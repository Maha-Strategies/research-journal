-- Fix a bootstrapping deadlock in guard_role_change.
--
-- THE BUG, found by trying to create the first owner.
--
-- The original guard raised unless is_operator_owner() was true. That function
-- resolves the caller through auth.uid(), which is null outside an API request
-- — in a direct psql session, in a migration, and for the service-role key,
-- whose JWT carries no `sub` claim.
--
-- So the guard refused everyone. Not just non-owners: everyone. The first
-- operator is auto-provisioned as `viewer` by on_auth_user_created, promoting
-- requires an existing owner, and no owner could ever be created by any means,
-- including direct database access. The system could never have its first
-- administrator.
--
-- THE FIX, and why it is not a weakening.
--
-- The guard now raises only when there IS an authenticated caller who is not an
-- owner. A null auth.uid() means the change is coming from a direct database
-- session or the service-role key.
--
-- Neither is a privilege this grants. Direct database access can drop the
-- trigger, rewrite the table, or alter the function; the service-role key
-- carries BYPASSRLS and full grants. Anyone with either already controls the
-- database completely, so refusing them a role update protects nothing and
-- costs the ability to bootstrap.
--
-- What the guard actually defends against is unchanged and is the case that
-- matters: an authenticated operator escalating their own role, or another
-- operator's, through the API. That path always has a non-null auth.uid() and
-- is still refused unless the caller is already an owner.
--
-- Bootstrapping is therefore a deliberate out-of-band act — which is the
-- property the deployment checklist relies on when it asks you to confirm that
-- no unintended account holds `owner`.

create or replace function guard_role_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not is_operator_owner()
  then
    raise exception 'Only an owner may change an operator role (attempted % -> %).', old.role, new.role
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

comment on function guard_role_change is
  'Refuses a role change made through the API by anyone who is not already an owner. A null auth.uid() (direct database session or service-role key) is permitted, because both already control the database outright and refusing them would make the first owner uncreatable.';
