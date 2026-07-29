// The Data Access Layer.
//
// Next's own auth guidance (node_modules/next/dist/docs/01-app/02-guides/
// authentication.md) prescribes three layers, and this is the middle one:
//
//   proxy.ts  optimistic check. Reads the session cookie, redirects obvious
//             misses. Runs on every route including prefetches, so it does no
//             database work and is NOT a security boundary.
//   THIS      real authorization. Verifies the token with the auth server and
//             resolves the operator's role.
//   RLS       enforcement at the data source. The last word, and the only layer
//             that still holds if the two above are wrong.
//
// WHY getUser() AND NOT getSession():
//
// getSession() reads the JWT out of the cookie and decodes it without checking
// the signature against the auth server. It is fast and it is forgeable —
// anything derived from it is an assertion by the client about who they are.
// getUser() revalidates with the auth server. Every authorization decision here
// starts from getUser(), and the cost is one network call per request.

import { cache } from 'react';

import { createSupabaseServerClient } from './supabase/server.ts';
import { readBuilderConfig } from './env.ts';

export const OPERATOR_ROLES = ['owner', 'editor', 'viewer'] as const;
export type OperatorRole = (typeof OPERATOR_ROLES)[number];

export type Operator = {
  id: string;
  email: string;
  displayName: string;
  role: OperatorRole;
};

export type AccessDenial =
  | { reason: 'not-configured'; missing: string[] }
  | { reason: 'unauthenticated' }
  | { reason: 'no-profile' }
  | { reason: 'insufficient-role'; role: OperatorRole; required: OperatorRole };

export type AccessResult = { ok: true; operator: Operator } | { ok: false; denial: AccessDenial };

/** Ranked so a comparison can express "editor or better" without a lookup table. */
const ROLE_RANK: Record<OperatorRole, number> = { viewer: 0, editor: 1, owner: 2 };

export function roleAtLeast(role: OperatorRole, required: OperatorRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

/**
 * The authenticated operator, or a structured denial.
 *
 * Wrapped in React's `cache` so a page that checks access, renders a header
 * with the operator's name, and loads a draft performs ONE token verification
 * per request rather than three. The cache is per-request; it does not leak
 * between users.
 */
export const getOperator = cache(async (): Promise<AccessResult> => {
  const config = readBuilderConfig();
  if (!config.configured) {
    return { ok: false, denial: { reason: 'not-configured', missing: config.missing } };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, denial: { reason: 'unauthenticated' } };
  }

  // The role comes from the database, never from a JWT claim. Claims can carry
  // stale data after a demotion, and app_metadata is only as trustworthy as
  // everything that can write to it.
  const { data: profile, error: profileError } = await supabase
    .from('operator_profiles')
    .select('id, email, display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false, denial: { reason: 'no-profile' } };
  }

  return {
    ok: true,
    operator: {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      role: profile.role as OperatorRole,
    },
  };
});

/**
 * Require an authenticated operator of at least `required` rank.
 *
 * Returns a result rather than throwing or redirecting, so a server action can
 * turn a denial into a message beside the form and a page can turn the same
 * denial into a redirect. Both call the same check.
 */
export async function requireOperator(required: OperatorRole = 'viewer'): Promise<AccessResult> {
  const result = await getOperator();
  if (!result.ok) return result;

  if (!roleAtLeast(result.operator.role, required)) {
    return {
      ok: false,
      denial: { reason: 'insufficient-role', role: result.operator.role, required },
    };
  }
  return result;
}

/** What each role may do, stated in one place and shown to the operator. */
export const ROLE_CAPABILITIES: Record<OperatorRole, string> = {
  viewer:
    'Read drafts you own or have been added to. Cannot create, edit, or release. This is the default for a new account — an owner must promote you.',
  editor: 'Create and edit your own drafts, and any draft you have been given write access to. Cannot publish.',
  owner:
    'Everything an editor can do, plus administering all drafts, promoting operators, and cutting releases. Publishing is owner-only.',
};

export const DENIAL_MESSAGES: Record<AccessDenial['reason'], string> = {
  'not-configured':
    'The Atlas Builder is not configured for this environment. It refuses to serve without a database and auth server to enforce its access rules.',
  unauthenticated: 'Sign in to continue.',
  'no-profile':
    'Your account has no operator profile. This should be created automatically at signup — contact an owner.',
  'insufficient-role': 'Your role does not permit this action.',
};
