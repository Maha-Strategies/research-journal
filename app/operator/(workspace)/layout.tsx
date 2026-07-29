// The gated workspace shell — the real authorization check.
//
// proxy.ts performed an optimistic check on the way in; this is the one that
// counts on the render path. It calls the DAL, which verifies the token against
// the auth server rather than trusting the cookie, and resolves the operator's
// role from the database rather than from a JWT claim.
//
// Even this is not the last line of defence. Every query the pages below make
// runs as this operator's session and is filtered by RLS. If this check were
// removed, a signed-in viewer would see an empty workspace rather than someone
// else's drafts — which is the property the RLS tests prove.

import { redirect } from 'next/navigation';
import Link from 'next/link';

import { DENIAL_MESSAGES, ROLE_CAPABILITIES, requireOperator } from '@/lib/atlas/builder/dal';
import { configurationMessage, readBuilderConfig } from '@/lib/atlas/builder/env';
import { SignOutButton } from './SignOutButton';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const access = await requireOperator('viewer');

  if (!access.ok) {
    if (access.denial.reason === 'not-configured') {
      return (
        <main className="mx-auto max-w-2xl px-6 py-24">
          <h1 className="text-2xl font-light text-white">Not available</h1>
          <p className="mt-6 text-sm leading-relaxed text-zinc-400">
            {configurationMessage(readBuilderConfig())}
          </p>
        </main>
      );
    }

    if (access.denial.reason === 'no-profile') {
      return (
        <main className="mx-auto max-w-2xl px-6 py-24">
          <h1 className="text-2xl font-light text-white">No operator profile</h1>
          <p className="mt-6 text-sm leading-relaxed text-zinc-400">
            {DENIAL_MESSAGES['no-profile']}
          </p>
        </main>
      );
    }

    redirect('/operator/login');
  }

  const { operator } = access;

  return (
    <div className="min-h-screen">
      {operator.role === 'viewer' ? (
        <div className="border-b border-amber-900/60 bg-amber-950/30 px-6 py-3">
          <p className="mx-auto max-w-6xl font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Viewer · read-only · {ROLE_CAPABILITIES.viewer}
          </p>
        </div>
      ) : null}

      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link
            href="/operator/atlas-builder"
            className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:text-white"
          >
            Atlas Builder
          </Link>
          <div className="flex flex-wrap items-center gap-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              {operator.displayName} · {operator.role} · private workspace
            </p>
            <SignOutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
