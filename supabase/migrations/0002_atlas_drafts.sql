-- The private authoring workspace.
--
-- These tables are the Postgres replacement for .atlas-builder/. Everything
-- here is private: drafts, unpublished claims, and operator notes. Nothing in
-- this migration is ever read by a public route — the public site reads
-- content/atlas-releases/published.json, generated from atlas_releases.
--
-- COLUMN NAMING: snake_case, mapped to the camelCase Zod records in
-- lib/atlas/builder/schema.ts by lib/atlas/builder/supabase-store.ts. The Zod
-- schemas remain the single definition of a record's shape; this schema is the
-- storage projection of them.

-- ---------------------------------------------------------------------------
-- Controlled vocabularies
-- ---------------------------------------------------------------------------

-- Mirrors lib/atlas/builder/vocabulary.ts. Declared as enums rather than text
-- so an invalid status is rejected by the database and not only by Zod.
-- Extending a vocabulary is therefore a migration, which is correct: these are
-- published labels that downstream consumers key on.

create type source_type as enum (
  'primary-paper', 'authoritative-report', 'benchmark-documentation', 'dataset',
  'standard-or-specification', 'provider-self-report', 'observational', 'educational'
);

create type verification_tag as enum ('verified', 'cited-unresolved', 'foundational', 'excluded');

create type claim_status as enum ('established', 'active-research', 'conjecture', 'speculative');

create type controversy_label as enum ('uncontested', 'debated', 'contested');

create type confidence_level as enum ('high', 'moderate', 'low');

create type release_state as enum ('draft', 'approved', 'published', 'superseded', 'archived');

create type atlas_visibility as enum ('private', 'public');

-- ---------------------------------------------------------------------------
-- Reserved slugs
-- ---------------------------------------------------------------------------

-- Mirrors RESERVED_ATLAS_SLUGS in lib/atlas/builder/vocabulary.ts. Enforced
-- here as well as in validate.ts because the consequence of getting it wrong is
-- a generated page shadowing a hand-authored Atlas URL, and a constraint the
-- application cannot forget is worth the duplication.
create table reserved_atlas_slugs (
  slug text primary key,
  reason text not null
);

insert into reserved_atlas_slugs (slug, reason) values
  ('de-sitter-swampland',    'Hand-authored Atlas with its own route tree.'),
  ('quantum-computing',      'Hand-authored Atlas with its own route tree.'),
  ('synthetic-intelligence', 'Hand-authored Atlas with its own route tree.'),
  ('manifest',               'Atlas gateway endpoint.'),
  ('claims',                 'Atlas gateway endpoint.'),
  ('concepts',               'Atlas gateway endpoint.'),
  ('sources',                'Atlas gateway endpoint.'),
  ('registry',               'Atlas gateway endpoint.');

create or replace function assert_slug_available()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from reserved_atlas_slugs where slug = new.slug) then
    raise exception 'Slug "%" is reserved and cannot be used by a builder atlas.', new.slug
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Drafts
-- ---------------------------------------------------------------------------

create table atlas_drafts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  owner_id uuid not null references operator_profiles (id) on delete restrict,

  title text not null,
  short_title text not null,
  description text not null,
  scope text not null,
  intended_reader text not null,
  editorial_boundary text not null,
  exclusions text[] not null default '{}',
  methodology text not null,
  update_policy text not null,

  version text not null,
  last_reviewed date not null,
  evidence_cutoff date,
  license text not null default 'CC BY 4.0',
  status_badge text not null,

  state release_state not null default 'draft',
  visibility atlas_visibility not null default 'private',

  -- PRIVATE. Has no counterpart in atlas_releases, which is what makes the
  -- public/private split structural rather than a filter applied at write time.
  private_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint atlas_drafts_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint atlas_drafts_version_semver check (version ~ '^\d+\.\d+\.\d+$'),
  constraint atlas_drafts_has_exclusion check (cardinality(exclusions) > 0)
);

comment on column atlas_drafts.private_notes is
  'PRIVATE. Never serialized into public output. The public release table has no equivalent column.';

create trigger atlas_drafts_slug_guard
  before insert or update of slug on atlas_drafts
  for each row execute function assert_slug_available();

create trigger atlas_drafts_touch
  before update on atlas_drafts
  for each row execute function touch_updated_at();

create index atlas_drafts_owner_idx on atlas_drafts (owner_id);
create index atlas_drafts_state_idx on atlas_drafts (state);

-- ---------------------------------------------------------------------------
-- Collaborators
-- ---------------------------------------------------------------------------

-- Explicit cross-operator authorization. Absent a row here, one operator cannot
-- see another's draft at all — which is the property the RLS tests prove.
create table atlas_draft_collaborators (
  draft_id uuid not null references atlas_drafts (id) on delete cascade,
  operator_id uuid not null references operator_profiles (id) on delete cascade,
  can_write boolean not null default false,
  granted_by uuid not null references operator_profiles (id),
  granted_at timestamptz not null default now(),
  primary key (draft_id, operator_id)
);

-- ---------------------------------------------------------------------------
-- Records
-- ---------------------------------------------------------------------------

-- `position` exists because the public output is order-sensitive and must be
-- deterministic: claims.json, context.txt, and the sitemap all render records in
-- authored order. Relying on physical row order would make the serializer's
-- byte-for-byte determinism a coincidence.
--
-- `record_id` is the business identifier ('mps-standard', 'ex-001') that becomes
-- a URL segment. It is unique per draft, not globally.

create table atlas_draft_sources (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references atlas_drafts (id) on delete cascade,
  record_id text not null,
  position integer not null,

  title text not null,
  authors text not null,
  year integer,
  year_basis text not null,
  publisher text,
  identifier text,
  url text,
  source_type source_type not null,
  verification verification_tag not null,
  verified_on date not null,
  why_here text not null,
  limitations text,

  private_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (draft_id, record_id),
  constraint atlas_draft_sources_locatable check (url is not null or identifier is not null),
  constraint atlas_draft_sources_year_range check (year is null or (year between 1500 and 2200))
);

comment on column atlas_draft_sources.private_notes is 'PRIVATE. Never published.';

create trigger atlas_draft_sources_touch
  before update on atlas_draft_sources
  for each row execute function touch_updated_at();

create index atlas_draft_sources_draft_idx on atlas_draft_sources (draft_id, position);

create table atlas_draft_concepts (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references atlas_drafts (id) on delete cascade,
  record_id text not null,
  position integer not null,

  label text not null,
  definition text not null,
  scope_note text,
  -- Business ids of sources/concepts in the same draft. Referential integrity is
  -- checked by validateAtlas() in lib/atlas/builder/validate.ts before release,
  -- which resolves them and reports a finding per dangling id. A Postgres array
  -- cannot carry a foreign key; join tables were rejected as heavier than the
  -- guarantee is worth, given the gate already blocks release on a bad id.
  source_ids text[] not null default '{}',
  related text[] not null default '{}',

  private_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (draft_id, record_id),
  constraint atlas_draft_concepts_id_format check (record_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on column atlas_draft_concepts.private_notes is 'PRIVATE. Never published.';

create trigger atlas_draft_concepts_touch
  before update on atlas_draft_concepts
  for each row execute function touch_updated_at();

create index atlas_draft_concepts_draft_idx on atlas_draft_concepts (draft_id, position);

create table atlas_draft_claims (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references atlas_drafts (id) on delete cascade,
  record_id text not null,
  position integer not null,

  slug text not null,
  claim text not null,
  explanation text not null,
  status claim_status not null,
  confidence confidence_level not null,
  controversy controversy_label not null,
  source_ids text[] not null,
  qualifying_source_ids text[] not null default '{}',
  concept_ids text[] not null default '{}',
  limitations text not null,
  exclusions text[] not null default '{}',
  review_date date not null,

  private_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (draft_id, record_id),
  unique (draft_id, slug),

  -- The two invariants the whole system exists to protect, asserted in the
  -- storage layer as well as in Zod. A claim with no support or no stated
  -- boundary cannot be stored, so it cannot exist waiting to be caught later.
  constraint atlas_draft_claims_has_source check (cardinality(source_ids) > 0),
  constraint atlas_draft_claims_has_boundary check (length(trim(limitations)) >= 20),

  -- Mirrors the status/controversy conflict rule in validate.ts.
  constraint atlas_draft_claims_status_controversy
    check (not (controversy = 'contested' and status = 'established'))
);

comment on column atlas_draft_claims.private_notes is 'PRIVATE. Never published.';
comment on constraint atlas_draft_claims_has_source on atlas_draft_claims is
  'A claim must cite at least one supporting source. Whether those ids resolve, and whether the sources are strong enough to carry a claim, is checked by validateAtlas() before release.';

create trigger atlas_draft_claims_touch
  before update on atlas_draft_claims
  for each row execute function touch_updated_at();

create index atlas_draft_claims_draft_idx on atlas_draft_claims (draft_id, position);
