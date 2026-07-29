// Server-side Supabase client, bound to the request's cookies.
//
// This is the client every request path uses. It carries the operator's session,
// so every query it makes runs as that authenticated user and is subject to the
// RLS policies in supabase/migrations/0004_rls.sql.
//
// It is NOT the admin client. Nothing on a request path should ever bypass RLS —
// if a page needs data the policies deny, the policies are wrong.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { requireBuilderConfig } from '../env.ts';

/**
 * A request-scoped client.
 *
 * Must be created per request and never cached in a module-level variable: it
 * closes over one request's cookie jar, and reusing it across requests would
 * serve one operator's data to another.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = requireBuilderConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. This is expected and safe:
          // proxy.ts refreshes the session on every request, so a token that
          // could not be written here is rewritten there on the next one.
        }
      },
    },
  });
}
