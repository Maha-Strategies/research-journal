// Sign-in for the operator area.
//
// Magic link only. No password is collected, transmitted, or stored anywhere in
// this application — the strongest thing you can say about credential handling
// is that there are no credentials to handle.
//
// Deliberately outside the (workspace) route group, so the gate that protects
// the builder does not also protect the page you use to get past it.

import { readBuilderConfig, configurationMessage } from '@/lib/atlas/builder/env';
import { LoginForm } from './LoginForm';

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

const ERROR_TEXT: Record<string, string> = {
  'missing-code': 'That sign-in link was incomplete. Request a new one.',
  'exchange-failed':
    'That sign-in link could not be used. Links are single-use and expire — request a new one.',
};

export default async function LoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  const config = readBuilderConfig();

  if (!config.configured) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-2xl font-light text-white">Not available</h1>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">{configurationMessage(config)}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
        Maha Research · operator
      </p>
      <h1 className="mt-4 text-2xl font-light text-white">Atlas Builder</h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-500">
        A private authoring workspace. Nothing here is public until a release is explicitly
        approved.
      </p>

      {error && ERROR_TEXT[error] ? (
        <p className="mt-6 border border-amber-900/60 bg-amber-950/20 p-4 text-sm leading-relaxed text-amber-200">
          {ERROR_TEXT[error]}
        </p>
      ) : null}

      <LoginForm next={next ?? ''} />

      <p className="mt-8 text-xs leading-relaxed text-zinc-600">
        Sign-in is by emailed link — there is no password. A new account starts with the{' '}
        <span className="text-zinc-500">viewer</span> role and can see nothing until an owner grants
        access, so requesting a link is not itself a way in.
      </p>
    </main>
  );
}
