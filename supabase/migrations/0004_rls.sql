-- Row-level security for every Builder table.
--
-- WHY THIS IS THE LOAD-BEARING MIGRATION.
--
-- In the file-backed Builder, the guarantee that one operator could not read
-- another's drafts was that there was only one operator and the files were on
-- their laptop. Postgres has no such property. Every isolation guarantee the
-- Builder claims now rests on the policies below, which is why lib/atlas/builder
-- /rls.test.ts proves them with two real authenticated users rather than
-- asserting them in a comment.
--
-- FORCE ROW LEVEL SECURITY is set as well as ENABLE, so that the table owner —
-- the role migrations run as — is also subject to policy. Without FORCE, a
-- privileged connection silently bypasses every rule below, and the tests would
-- pass while production leaked.
--
-- The service-role key bypasses RLS entirely by design. It is used only by
-- scripts and the RLS test harness, never on a request path. See
-- lib/atlas/builder/supabase/admin.ts.

-- ---------------------------------------------------------------------------
-- operator_profiles
-- ---------------------------------------------------------------------------

alter table operator_profiles enable row level security;
alter table operator_profiles force row level security;

-- Operators can see each other: the UI names who changed what, and a
-- collaborator picker needs to resolve a person. Roles are not secret.
create policy operator_profiles_select on operator_profiles
  for select to authenticated
  using (true);

-- Own profile only, and the role column is separately guarded by the
-- guard_role_change trigger in 0001 — a policy cannot express "every column
-- except this one".
create policy operator_profiles_update_self on operator_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy operator_profiles_update_owner on operator_profiles
  for update to authenticated
  using (is_operator_owner())
  with check (is_operator_owner());

-- No insert policy: profiles are created by the on_auth_user_created trigger,
-- which is SECURITY DEFINER. No delete policy: removing an operator is an
-- auth.users deletion, which cascades.

-- ---------------------------------------------------------------------------
-- atlas_drafts
-- ---------------------------------------------------------------------------

alter table atlas_drafts enable row level security;
alter table atlas_drafts force row level security;

-- Visibility is expressed once, here, and every child table delegates to it.
-- SECURITY DEFINER so the collaborator lookup inside is not itself subject to
-- the collaborators table's policy, which would recurse.
create or replace function can_read_draft(draft uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from atlas_drafts d
    where d.id = draft
      and (
        d.owner_id = auth.uid()
        or is_operator_owner()
        or exists (
          select 1 from atlas_draft_collaborators c
          where c.draft_id = d.id and c.operator_id = auth.uid()
        )
      )
  );
$$;

create or replace function can_write_draft(draft uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from atlas_drafts d
    where d.id = draft
      and (
        (d.owner_id = auth.uid() and can_operator_write())
        or is_operator_owner()
        or exists (
          select 1 from atlas_draft_collaborators c
          where c.draft_id = d.id and c.operator_id = auth.uid() and c.can_write
        )
      )
  );
$$;

create policy atlas_drafts_select on atlas_drafts
  for select to authenticated
  using (can_read_draft(id));

-- A viewer cannot create a draft: can_operator_write() gates on role, and
-- owner_id is pinned to the caller so a draft cannot be created in someone
-- else's name.
create policy atlas_drafts_insert on atlas_drafts
  for insert to authenticated
  with check (owner_id = auth.uid() and can_operator_write());

create policy atlas_drafts_update on atlas_drafts
  for update to authenticated
  using (can_write_draft(id))
  with check (can_write_draft(id));

-- Deleting a draft is the owner's alone. A collaborator with write access can
-- edit records but cannot destroy the work.
create policy atlas_drafts_delete on atlas_drafts
  for delete to authenticated
  using ((owner_id = auth.uid() and can_operator_write()) or is_operator_owner());

-- ---------------------------------------------------------------------------
-- Collaborators
-- ---------------------------------------------------------------------------

alter table atlas_draft_collaborators enable row level security;
alter table atlas_draft_collaborators force row level security;

create policy atlas_draft_collaborators_select on atlas_draft_collaborators
  for select to authenticated
  using (operator_id = auth.uid() or can_read_draft(draft_id));

-- Granting access is the draft owner's decision, not a collaborator's, so this
-- checks ownership directly rather than can_write_draft(). Otherwise a
-- collaborator could add further collaborators.
create policy atlas_draft_collaborators_insert on atlas_draft_collaborators
  for insert to authenticated
  with check (
    granted_by = auth.uid()
    and (is_operator_owner() or exists (
      select 1 from atlas_drafts d where d.id = draft_id and d.owner_id = auth.uid()
    ))
  );

create policy atlas_draft_collaborators_delete on atlas_draft_collaborators
  for delete to authenticated
  using (
    is_operator_owner() or exists (
      select 1 from atlas_drafts d where d.id = draft_id and d.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Draft records
-- ---------------------------------------------------------------------------

-- Identical shape for all three: authorization is a property of the parent
-- draft, expressed once in can_read_draft / can_write_draft.

alter table atlas_draft_sources enable row level security;
alter table atlas_draft_sources force row level security;

create policy atlas_draft_sources_select on atlas_draft_sources
  for select to authenticated using (can_read_draft(draft_id));
create policy atlas_draft_sources_insert on atlas_draft_sources
  for insert to authenticated with check (can_write_draft(draft_id));
create policy atlas_draft_sources_update on atlas_draft_sources
  for update to authenticated using (can_write_draft(draft_id)) with check (can_write_draft(draft_id));
create policy atlas_draft_sources_delete on atlas_draft_sources
  for delete to authenticated using (can_write_draft(draft_id));

alter table atlas_draft_concepts enable row level security;
alter table atlas_draft_concepts force row level security;

create policy atlas_draft_concepts_select on atlas_draft_concepts
  for select to authenticated using (can_read_draft(draft_id));
create policy atlas_draft_concepts_insert on atlas_draft_concepts
  for insert to authenticated with check (can_write_draft(draft_id));
create policy atlas_draft_concepts_update on atlas_draft_concepts
  for update to authenticated using (can_write_draft(draft_id)) with check (can_write_draft(draft_id));
create policy atlas_draft_concepts_delete on atlas_draft_concepts
  for delete to authenticated using (can_write_draft(draft_id));

alter table atlas_draft_claims enable row level security;
alter table atlas_draft_claims force row level security;

create policy atlas_draft_claims_select on atlas_draft_claims
  for select to authenticated using (can_read_draft(draft_id));
create policy atlas_draft_claims_insert on atlas_draft_claims
  for insert to authenticated with check (can_write_draft(draft_id));
create policy atlas_draft_claims_update on atlas_draft_claims
  for update to authenticated using (can_write_draft(draft_id)) with check (can_write_draft(draft_id));
create policy atlas_draft_claims_delete on atlas_draft_claims
  for delete to authenticated using (can_write_draft(draft_id));

-- ---------------------------------------------------------------------------
-- Releases
-- ---------------------------------------------------------------------------

alter table atlas_releases enable row level security;
alter table atlas_releases force row level security;

-- Every authenticated operator can read the archive. Its contents are already
-- public by definition — this is the record of what was published.
create policy atlas_releases_select on atlas_releases
  for select to authenticated
  using (true);

-- Publishing is the owner role's alone. This is the action that crosses the
-- private/public boundary, so it is the most tightly held.
create policy atlas_releases_insert on atlas_releases
  for insert to authenticated
  with check (is_operator_owner() and released_by = auth.uid());

-- Which columns may change is enforced by the assert_release_immutable trigger
-- in 0003; this policy decides who may attempt it at all.
create policy atlas_releases_update on atlas_releases
  for update to authenticated
  using (is_operator_owner())
  with check (is_operator_owner());

-- NO DELETE POLICY, deliberately. With RLS forced and no permissive delete
-- policy, every delete is refused before the forbid_release_delete trigger is
-- even reached. Two independent mechanisms, because losing a published release
-- destroys the citability the version number exists to provide.

-- ---------------------------------------------------------------------------
-- Change log
-- ---------------------------------------------------------------------------

alter table atlas_change_log enable row level security;
alter table atlas_change_log force row level security;

create policy atlas_change_log_select on atlas_change_log
  for select to authenticated
  using (draft_id is null or can_read_draft(draft_id));

create policy atlas_change_log_insert on atlas_change_log
  for insert to authenticated
  with check (draft_id is null or can_write_draft(draft_id));

-- No update or delete policy. Append-only, and the trigger in 0003 says so
-- again for anything that reaches the table another way.

-- ---------------------------------------------------------------------------
-- Reserved slugs
-- ---------------------------------------------------------------------------

alter table reserved_atlas_slugs enable row level security;
alter table reserved_atlas_slugs force row level security;

-- Readable so the UI can explain why a slug was refused. Writable by nobody
-- through the API: changing this list means editing a hand-authored Atlas's
-- claim on its URL, which belongs in a migration and a code review.
create policy reserved_atlas_slugs_select on reserved_atlas_slugs
  for select to authenticated
  using (true);
