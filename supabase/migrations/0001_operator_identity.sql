-- Operator identity and roles for the Private Atlas Builder.
--
-- Replaces the shared-secret model. Every operator is a real row in auth.users,
-- and every authorization decision in this schema keys on auth.uid().
--
-- DEFAULT ROLE IS 'viewer', DELIBERATELY.
--
-- A new signup can read nothing and write nothing until someone with the owner
-- role promotes them. Supabase Auth will happily create a user for any email
-- that completes a magic-link flow, so the default must be the powerless one —
-- otherwise the security boundary would be "whoever can receive an email".

create type operator_role as enum ('owner', 'editor', 'viewer');

comment on type operator_role is
  'viewer: read authorized drafts. editor: create and edit own drafts. owner: administer all drafts, promote operators, and cut releases.';

create table operator_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null,
  role operator_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table operator_profiles is
  'One row per authenticated operator. The role column is the authorization source of truth; it is never read from a JWT claim, which a client could influence.';

create index operator_profiles_role_idx on operator_profiles (role);

-- ---------------------------------------------------------------------------
-- Role helpers
-- ---------------------------------------------------------------------------

-- SECURITY DEFINER so the function can read operator_profiles from inside an
-- RLS policy on another table without that read being subject to
-- operator_profiles' own policies. Without it, any policy calling this would
-- recurse into the profiles policy and deadlock the check.
--
-- search_path is pinned: a SECURITY DEFINER function that resolves names
-- through a caller-controlled search_path is a privilege-escalation vector.
create or replace function current_operator_role()
returns operator_role
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from operator_profiles where id = auth.uid();
$$;

comment on function current_operator_role is
  'The calling operator''s role, or null when unauthenticated. Used by RLS policies.';

create or replace function is_operator_owner()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(current_operator_role() = 'owner', false);
$$;

create or replace function can_operator_write()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(current_operator_role() in ('owner', 'editor'), false);
$$;

-- ---------------------------------------------------------------------------
-- Provisioning
-- ---------------------------------------------------------------------------

create or replace function handle_new_operator()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into operator_profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- This name intentionally differs from the common `on_auth_user_created`
-- trigger used by other applications sharing the same Supabase project. A
-- database permits multiple AFTER INSERT triggers on auth.users, but their
-- names must be unique; each application keeps its own provisioning function.
create trigger on_auth_operator_created
  after insert on auth.users
  for each row
  execute function handle_new_operator();

-- Keep updated_at honest without the application having to remember.
create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger operator_profiles_touch
  before update on operator_profiles
  for each row
  execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Role changes are privileged
-- ---------------------------------------------------------------------------

-- Without this, the RLS policy allowing an operator to edit their own profile
-- (display name) would also let them set their own role to 'owner'. The policy
-- cannot express "these columns but not that one", so the rule is a trigger.
create or replace function guard_role_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role and not is_operator_owner() then
    raise exception 'Only an owner may change an operator role (attempted % -> %).', old.role, new.role
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

create trigger operator_profiles_guard_role
  before update on operator_profiles
  for each row
  execute function guard_role_change();
