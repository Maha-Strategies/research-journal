// Session refresh and the optimistic access check for /operator.
//
// WHAT THIS IS NOT: the security boundary. Next's auth guidance is explicit
// that proxy runs on every route including prefetches, and that the real checks
// belong close to the data. Here that means:
//
//   this file            refreshes the Supabase session cookie and redirects
//                        obvious misses. Cheap, and not authoritative.
//   lib/atlas/builder/dal.ts  verifies the token with the auth server and
//                        resolves the operator's role.
//   supabase/migrations/0004_rls.sql  decides what any given session can read
//                        or write, and is the only layer that still holds if
//                        the two above are wrong.
//
// Deleting this file would not expose any data. It exists so an unauthenticated
// visitor gets a redirect instead of a rendered shell, and — more importantly —
// so the Supabase refresh token is rotated on every request. Server Components
// cannot write cookies, so if this file did not run, a session would expire
// mid-edit and the operator would be signed out without warning.
//
// Next 16 renamed this convention from `middleware.ts` to `proxy.ts` and runs it
// on the Node.js runtime by default.

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { readBuilderConfig } from '@/lib/atlas/builder/env';

/** Reachable without a session, or there is no way to obtain one. */
const PUBLIC_OPERATOR_PATHS = ['/operator/login', '/operator/auth'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A header travels with every response — JSON, redirects, error pages — which
  // a <meta> tag does not. Belt and braces with the layout's robots metadata and
  // the Disallow line in public/robots.txt.
  const noindex = (response: NextResponse) => {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  };

  const config = readBuilderConfig();

  // Unconfigured is a hard stop for EVERY path under /operator, login included.
  // There is no auth server to sign in against, so a login form would be a lie —
  // and serving one path while 404ing the rest would confirm the route exists.
  if (!config.configured) {
    return noindex(
      new NextResponse('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } }),
    );
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.config.url, config.config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Written to both the request (so anything downstream in this pass sees
        // the refreshed token) and the response (so the browser keeps it).
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // This call is what rotates the refresh token. It talks to the auth server,
  // not the database, so it does not carry the per-route query cost the Next
  // guidance warns about — and skipping it would break session continuity.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicPath = PUBLIC_OPERATOR_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublicPath) {
    // Already signed in and sitting on the login page — send them onward.
    if (user && pathname === '/operator/login') {
      return noindex(NextResponse.redirect(new URL('/operator/atlas-builder', request.url)));
    }
    return noindex(response);
  }

  if (!user) {
    const loginUrl = new URL('/operator/login', request.url);
    // Re-validated as a same-origin /operator path before use, in the sign-in
    // handler. A `next` parameter followed blindly is an open redirect.
    loginUrl.searchParams.set('next', pathname);
    return noindex(NextResponse.redirect(loginUrl));
  }

  return noindex(response);
}

export const config = {
  matcher: ['/operator/:path*'],
};
