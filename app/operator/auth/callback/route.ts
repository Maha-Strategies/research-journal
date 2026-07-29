// Magic-link landing point.
//
// Supabase sends the operator here with a one-time code, which is exchanged for
// a session. The exchange must happen server-side so the resulting cookies are
// httpOnly.

import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/atlas/builder/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  // Only same-origin /operator paths are honoured. `next` survives a round trip
  // through an email, which is exactly the kind of value an attacker can set —
  // following it unchecked would make this an open redirect reachable from a
  // link in someone's inbox.
  const destination =
    next && next.startsWith('/operator/') && !next.startsWith('//')
      ? next
      : '/operator/atlas-builder';

  if (!code) {
    return NextResponse.redirect(`${origin}/operator/login?error=missing-code`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/operator/login?error=exchange-failed`);
  }

  return NextResponse.redirect(`${origin}${destination}`);
}
