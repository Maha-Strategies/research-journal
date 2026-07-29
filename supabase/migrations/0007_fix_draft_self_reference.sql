-- Fix atlas_drafts policies that could not see their own new row.
--
-- THE BUG, found by the first `insert ... returning` from a real session.
--
-- The policies on atlas_drafts delegated to can_read_draft(id) and
-- can_write_draft(id). Those helpers re-query atlas_drafts to decide whether the
-- caller may see the row with that id.
--
-- For a child table that is correct: atlas_draft_claims asking about its parent
-- draft is asking about a row that already exists. For atlas_drafts itself it is
-- not. `insert ... returning` — which is what PostgREST issues for every
-- `.insert().select()`, and therefore what the application does on every create
-- — evaluates the SELECT policy against the row being inserted. The helper runs
-- a fresh query under the statement's snapshot, which does not include a row
-- that same statement has not finished writing. The lookup returns nothing, the
-- policy denies, and the insert fails with "new row violates row-level security
-- policy".
--
-- The failure is narrow and nasty: a plain `.insert()` succeeds, and only
-- `.insert().select()` fails, so the bug is invisible until something needs the
-- created row back.
--
-- THE FIX: on atlas_drafts, evaluate against the row's own columns instead of
-- looking the row up again. Same authorization rule, no self-reference, and it
-- holds during RETURNING.
--
-- can_read_draft / can_write_draft are kept unchanged, because the child tables
-- use them correctly and this is the only table where the row under test is the
-- row being written.

drop policy if exists atlas_drafts_select on atlas_drafts;
drop policy if exists atlas_drafts_update on atlas_drafts;
drop policy if exists atlas_drafts_delete on atlas_drafts;

-- Read: owner, an operator with the owner role, or an explicit collaborator.
create policy atlas_drafts_select on atlas_drafts
  for select to authenticated
  using (
    owner_id = auth.uid()
    or is_operator_owner()
    or exists (
      select 1 from atlas_draft_collaborators c
      where c.draft_id = atlas_drafts.id and c.operator_id = auth.uid()
    )
  );

-- Write: the owner (if their role permits writing at all), an owner-role
-- operator, or a collaborator explicitly granted can_write.
--
-- Stated on both USING and WITH CHECK: USING decides which rows may be targeted,
-- WITH CHECK decides what they may be changed into. Without the WITH CHECK an
-- operator could reassign owner_id and hand a draft to someone else.
create policy atlas_drafts_update on atlas_drafts
  for update to authenticated
  using (
    (owner_id = auth.uid() and can_operator_write())
    or is_operator_owner()
    or exists (
      select 1 from atlas_draft_collaborators c
      where c.draft_id = atlas_drafts.id and c.operator_id = auth.uid() and c.can_write
    )
  )
  with check (
    (owner_id = auth.uid() and can_operator_write())
    or is_operator_owner()
    or exists (
      select 1 from atlas_draft_collaborators c
      where c.draft_id = atlas_drafts.id and c.operator_id = auth.uid() and c.can_write
    )
  );

-- Delete stays narrower than update on purpose: a collaborator with write access
-- can edit records but cannot destroy the draft.
create policy atlas_drafts_delete on atlas_drafts
  for delete to authenticated
  using ((owner_id = auth.uid() and can_operator_write()) or is_operator_owner());
