-- Table privileges.
--
-- WHY THIS MIGRATION EXISTS — it was added after the first real run against
-- Postgres, which exposed two problems that no amount of reading the policies
-- would have found.
--
-- Grants are checked BEFORE row-level security. A role with no SELECT privilege
-- is denied regardless of how permissive its policies are, and a role WITH a
-- privilege is then narrowed by them. Policies alone are therefore only half of
-- an access model.
--
-- PROBLEM 1 — the application did not work, and the tests would have lied.
--
-- This Supabase image ships a restricted default privilege set for tables
-- created by `postgres` in the public schema: anon, authenticated, and
-- service_role received Dxtm (TRUNCATE, REFERENCES, TRIGGER, MAINTAIN) and no
-- SELECT, INSERT, UPDATE, or DELETE. Every query from the app would have been
-- refused at the grant layer.
--
-- The dangerous part is what that does to the security suite. Its central
-- assertions are of the form "operator B cannot read operator A's draft". With
-- no SELECT privilege, nobody can read anything, so those assertions pass — and
-- pass for a reason that has nothing to do with the policies being correct. The
-- suite would have reported a green security proof for a database whose RLS had
-- never once been exercised.
--
-- PROBLEM 2 — authenticated users could destroy the release archive.
--
-- That default set includes TRUNCATE. TRUNCATE is not subject to row-level
-- security and does not fire row-level triggers, so neither the RLS policies
-- nor forbid_release_delete would have stopped it. Any signed-in operator —
-- including a `viewer`, the role meant to be powerless — could have truncated
-- atlas_releases and destroyed every published version.
--
-- The rule below: revoke everything, then grant the maximum each role's
-- policies could ever make use of, and nothing beyond it.

-- ---------------------------------------------------------------------------
-- Start from nothing
-- ---------------------------------------------------------------------------

revoke all on operator_profiles         from anon, authenticated;
revoke all on atlas_drafts              from anon, authenticated;
revoke all on atlas_draft_collaborators from anon, authenticated;
revoke all on atlas_draft_sources       from anon, authenticated;
revoke all on atlas_draft_concepts      from anon, authenticated;
revoke all on atlas_draft_claims        from anon, authenticated;
revoke all on atlas_releases            from anon, authenticated;
revoke all on atlas_change_log          from anon, authenticated;
revoke all on reserved_atlas_slugs      from anon, authenticated;

-- ---------------------------------------------------------------------------
-- anon: nothing
-- ---------------------------------------------------------------------------

-- No grants at all, deliberately. The public site never queries Postgres — it
-- reads content/atlas-releases/published.json, committed at build time. An
-- anonymous client therefore has no legitimate reason to reach any table, and
-- "no privilege" is a stronger guarantee than "a policy that returns no rows".

-- ---------------------------------------------------------------------------
-- authenticated: exactly what the policies can use
-- ---------------------------------------------------------------------------

-- Drafts and their records: full CRUD, narrowed to owned/collaborated rows by
-- the policies in 0004.
grant select, insert, update, delete on atlas_drafts              to authenticated;
grant select, insert, update, delete on atlas_draft_sources       to authenticated;
grant select, insert, update, delete on atlas_draft_concepts      to authenticated;
grant select, insert, update, delete on atlas_draft_claims        to authenticated;
grant select, insert,         delete on atlas_draft_collaborators to authenticated;

-- Profiles: read all (the UI names who changed what), update own. No insert —
-- profiles are created by the on_auth_user_created trigger. No delete —
-- removing an operator is an auth.users deletion, which cascades.
grant select, update on operator_profiles to authenticated;

-- Releases: read and create; update only for the state transitions
-- assert_release_immutable permits.
--
-- NO DELETE. Three independent mechanisms now say a release cannot be removed:
-- no privilege here, no delete policy in 0004, and forbid_release_delete. And
-- no TRUNCATE, which would have bypassed the latter two entirely.
grant select, insert, update on atlas_releases to authenticated;

-- Change log: append and read. No update, no delete — an amendable audit log
-- records nothing, and this is the privilege layer saying so before the
-- policies and the trigger repeat it.
grant select, insert on atlas_change_log to authenticated;

-- Reserved slugs: read only, so the UI can explain why a slug was refused.
-- Changing this list means editing a hand-authored Atlas's claim on its URL,
-- which belongs in a migration and a code review.
grant select on reserved_atlas_slugs to authenticated;

-- ---------------------------------------------------------------------------
-- service_role
-- ---------------------------------------------------------------------------

-- Full access. It already carries the BYPASSRLS role attribute, so policies do
-- not constrain it; without matching grants it would still have been refused at
-- this layer, which is what made the export and import scripts silently return
-- nothing on the first run.
--
-- This is why admin.ts refuses to construct inside a Next.js runtime: the key
-- is for scripts and the test harness, and a request path that needs it has a
-- policy bug rather than a missing privilege.
grant all on operator_profiles         to service_role;
grant all on atlas_drafts              to service_role;
grant all on atlas_draft_collaborators to service_role;
grant all on atlas_draft_sources       to service_role;
grant all on atlas_draft_concepts      to service_role;
grant all on atlas_draft_claims        to service_role;
grant all on atlas_releases            to service_role;
grant all on atlas_change_log          to service_role;
grant all on reserved_atlas_slugs      to service_role;

-- ---------------------------------------------------------------------------
-- TRUNCATE guard
-- ---------------------------------------------------------------------------

-- The revokes above remove TRUNCATE from anon and authenticated, which closes
-- the hole. This trigger is the second lock: TRUNCATE ignores row-level
-- security and row-level triggers, so if a future migration re-grants it — or a
-- default privilege changes again under us, which is exactly how this arose —
-- there would otherwise be nothing left to stop the release archive being
-- destroyed in one statement.
create or replace function forbid_release_truncate()
returns trigger
language plpgsql
as $$
begin
  raise exception 'atlas_releases cannot be truncated. Published releases are permanent; withdraw one by setting its state to ''archived''.'
    using errcode = 'insufficient_privilege';
end;
$$;

create trigger atlas_releases_no_truncate
  before truncate on atlas_releases
  for each statement execute function forbid_release_truncate();

create trigger atlas_change_log_no_truncate
  before truncate on atlas_change_log
  for each statement execute function forbid_release_truncate();
