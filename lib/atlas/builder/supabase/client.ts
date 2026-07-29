'use client';

// Browser Supabase client.
//
// Used only by the login form to request a magic link. Every authorization
// decision happens server-side in the DAL and in RLS; this client holds the
// anon key, which grants nothing on its own — the policies decide what the
// session behind it can see.

import { createBrowserClient } from '@supabase/ssr';

import { requireBuilderConfig } from '../env.ts';

export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireBuilderConfig();
  return createBrowserClient(url, anonKey);
}
