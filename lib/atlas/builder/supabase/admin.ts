// Service-role Supabase client. BYPASSES ROW-LEVEL SECURITY ENTIRELY.
//
// PERMITTED CALLERS — this list is exhaustive:
//
//   scripts/atlas-export-published.mjs   reads every published release to
//                                        regenerate published.json
//   scripts/atlas-import-file-drafts.mjs one-shot import of .atlas-builder/
//   lib/atlas/builder/rls.test.ts        provisions test users, and is the
//                                        control case the RLS tests compare
//                                        authenticated clients against
//
// NEVER from a page, layout, route handler, server action, or proxy. Those all
// run with a user's session and must be subject to the policies. If a request
// path appears to need this client, the policy is wrong — fix the policy.
//
// The guard below is a real runtime check rather than a comment, because the
// consequence of importing this into a request path is silent: everything keeps
// working, and RLS simply stops applying.

import { createClient } from '@supabase/supabase-js';

import { requireBuilderConfig, requireServiceRoleKey } from '../env.ts';

/**
 * Refuse to construct inside a Next request.
 *
 * `NEXT_RUNTIME` is set by Next for server rendering and route handling, and is
 * absent when a plain Node script or the test runner is the entry point. That
 * makes it a reliable discriminator between "a script is running this" and "a
 * request is running this".
 */
function assertNotInRequestPath(): void {
  if (process.env.NEXT_RUNTIME) {
    throw new Error(
      'The service-role Supabase client was constructed inside a Next.js runtime. It bypasses RLS and is for scripts and tests only. A request path that needs data the policies deny has a policy bug, not a missing key.',
    );
  }
}

export function createSupabaseAdminClient() {
  assertNotInRequestPath();
  const { url } = requireBuilderConfig();

  return createClient(url, requireServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
