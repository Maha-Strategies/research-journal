-- Immutable release archive and the change log.
--
-- This table is the system of record for what was published, at what version,
-- when, and by whom. content/atlas-releases/published.json is generated from it
-- by `npm run atlas:export` and is what the public build actually reads.
--
-- THE INVARIANT: A PUBLISHED RELEASE IS NEVER REWRITTEN.
--
-- Clause V2 of the Maha Provenance Standard — corrections are disclosed, not
-- silently replaced. Previously this was enforced by application code in
-- release.ts and store.ts. Both still apply, but now it is also enforced by the
-- database, so it holds against a direct SQL statement, a migration script, or a
-- future code path that forgets. That is the difference between a convention and
-- a guarantee.

create table atlas_releases (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  version text not null,
  state release_state not null default 'published',

  released_at timestamptz not null default now(),
  released_by uuid not null references operator_profiles (id) on delete restrict,
  release_note text not null,

  supersedes text,
  superseded_by text,

  -- The frozen PublicAtlas, exactly as publicAtlasSchema.parse() produced it.
  -- Private fields were dropped structurally at that parse; the scan trigger
  -- below asserts it independently rather than trusting that it happened.
  atlas jsonb not null,

  unique (slug, version),

  constraint atlas_releases_version_semver check (version ~ '^\d+\.\d+\.\d+$'),
  constraint atlas_releases_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint atlas_releases_slug_matches_atlas check (atlas ->> 'slug' = slug),
  constraint atlas_releases_note_present check (length(trim(release_note)) >= 10)
);

create index atlas_releases_slug_idx on atlas_releases (slug);
create index atlas_releases_state_idx on atlas_releases (state);

create trigger atlas_releases_slug_guard
  before insert on atlas_releases
  for each row execute function assert_slug_available();

-- ---------------------------------------------------------------------------
-- Guard 1: private material can never enter a release
-- ---------------------------------------------------------------------------

-- Walks the whole jsonb document looking for keys that belong to the private
-- tier. A database-level assertion of the public/private boundary that does not
-- depend on the application having parsed through the right Zod schema.
create or replace function jsonb_has_key_deep(doc jsonb, needle text)
returns boolean
language sql
immutable
as $$
  select case jsonb_typeof(doc)
    when 'object' then
      exists (select 1 from jsonb_object_keys(doc) k where k = needle)
      or exists (select 1 from jsonb_each(doc) e where jsonb_has_key_deep(e.value, needle))
    when 'array' then
      exists (select 1 from jsonb_array_elements(doc) e where jsonb_has_key_deep(e, needle))
    else false
  end;
$$;

create or replace function assert_release_carries_no_private_data()
returns trigger
language plpgsql
as $$
declare
  forbidden text;
begin
  foreach forbidden in array array['privateNotes', 'private_notes', 'changeLog', 'change_log'] loop
    if jsonb_has_key_deep(new.atlas, forbidden) then
      raise exception 'Release %@% carries private field "%" and was rejected. Public output is produced by parsing through publicAtlasSchema, which strips these.',
        new.slug, new.version, forbidden
        using errcode = 'check_violation';
    end if;
  end loop;
  return new;
end;
$$;

create trigger atlas_releases_no_private_data
  before insert or update on atlas_releases
  for each row execute function assert_release_carries_no_private_data();

-- ---------------------------------------------------------------------------
-- Guard 2: immutability
-- ---------------------------------------------------------------------------

-- Only `state` and `superseded_by` may ever change, and only along the
-- transitions the lifecycle permits. Everything that constitutes the published
-- artifact — the atlas body, its version, its slug, who released it and when,
-- and the release note — is frozen at insert.
create or replace function assert_release_immutable()
returns trigger
language plpgsql
as $$
begin
  if new.id is distinct from old.id
     or new.slug is distinct from old.slug
     or new.version is distinct from old.version
     or new.atlas is distinct from old.atlas
     or new.released_at is distinct from old.released_at
     or new.released_by is distinct from old.released_by
     or new.release_note is distinct from old.release_note
     or new.supersedes is distinct from old.supersedes
  then
    raise exception 'Release %@% is immutable. Cut a new version instead; the published one stays readable and is marked superseded.',
      old.slug, old.version
      using errcode = 'check_violation';
  end if;

  if new.state is distinct from old.state then
    if not (
      (old.state = 'published'  and new.state in ('superseded', 'archived')) or
      (old.state = 'superseded' and new.state in ('archived', 'published')) or
      (old.state = 'archived'   and new.state = 'published')
    ) then
      raise exception 'Release state cannot move from % to %.', old.state, new.state
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$$;

create trigger atlas_releases_immutable
  before update on atlas_releases
  for each row execute function assert_release_immutable();

-- A release is never deleted. Withdrawing an atlas from publication is a state
-- change to 'archived', which keeps the record readable — deleting it would
-- destroy the history the version number exists to make citable.
create or replace function forbid_release_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Releases are never deleted. Set state to ''archived'' to withdraw %@% from publication.',
    old.slug, old.version
    using errcode = 'check_violation';
end;
$$;

create trigger atlas_releases_no_delete
  before delete on atlas_releases
  for each row execute function forbid_release_delete();

-- ---------------------------------------------------------------------------
-- Change log
-- ---------------------------------------------------------------------------

create type change_action as enum (
  'created', 'updated', 'deleted', 'approved', 'released', 'rolled-back', 'imported', 'archived'
);

create table atlas_change_log (
  id bigint generated always as identity primary key,
  draft_id uuid references atlas_drafts (id) on delete cascade,
  slug text not null,

  -- Bound to an authenticated principal, not a name someone typed. This is what
  -- makes the log an audit trail rather than a note-to-self.
  actor_id uuid not null references operator_profiles (id) on delete restrict,

  action change_action not null,
  target text not null,
  summary text not null,
  at timestamptz not null default now()
);

create index atlas_change_log_draft_idx on atlas_change_log (draft_id, at desc);
create index atlas_change_log_slug_idx on atlas_change_log (slug, at desc);

-- The client never supplies actor_id. Trusting a client-supplied actor would
-- let any operator write log entries attributed to someone else.
create or replace function force_change_log_actor()
returns trigger
language plpgsql
as $$
begin
  new.actor_id := auth.uid();
  if new.actor_id is null then
    raise exception 'Change-log entries require an authenticated operator.'
      using errcode = 'insufficient_privilege';
  end if;
  new.at := now();
  return new;
end;
$$;

create trigger atlas_change_log_force_actor
  before insert on atlas_change_log
  for each row execute function force_change_log_actor();

-- An amendable log records nothing.
create or replace function forbid_change_log_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'The change log is append-only.'
    using errcode = 'insufficient_privilege';
end;
$$;

create trigger atlas_change_log_append_only
  before update or delete on atlas_change_log
  for each row execute function forbid_change_log_mutation();
