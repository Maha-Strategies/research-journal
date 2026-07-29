import 'server-only';

// Request-scoped store construction for the workspace pages.
//
// Kept here rather than in supabase-store.ts so that module stays free of
// next/headers and can be exercised by the RLS tests with a plain client.
//
// The store is created per request and never cached: it wraps a client bound to
// one operator's cookies, and reusing it across requests would serve one
// operator's drafts to another. Every query it makes is filtered by RLS.

import { createSupabaseServerClient } from '@/lib/atlas/builder/supabase/server';
import { SupabaseAtlasStore } from '@/lib/atlas/builder/supabase-store';

export async function createRequestStore(): Promise<SupabaseAtlasStore> {
  return new SupabaseAtlasStore(await createSupabaseServerClient());
}
