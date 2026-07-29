'use client';

// Magic-link request form.
//
// Talks to Supabase Auth directly from the browser with the anon key. That is
// safe: the anon key grants nothing on its own, and requesting a link proves
// nothing — the link goes to the mailbox, and the account it creates is a
// `viewer` that RLS denies everything to until an owner promotes it.
//
// The response is deliberately identical whether or not the address belongs to
// an operator. Saying "no such operator" would turn this form into a way to
// enumerate who has access.

import { useState } from 'react';

import { createSupabaseBrowserClient } from '@/lib/atlas/builder/supabase/client';

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function requestLink(formData: FormData) {
    const address = String(formData.get('email') ?? '').trim();
    if (!address) return;

    setState('sending');
    try {
      const supabase = createSupabaseBrowserClient();
      const callback = new URL('/operator/auth/callback', window.location.origin);
      if (next.startsWith('/operator/')) callback.searchParams.set('next', next);

      const { error } = await supabase.auth.signInWithOtp({
        email: address,
        options: { emailRedirectTo: callback.toString() },
      });

      // A transport failure is worth showing; "that address is not an operator"
      // is not, and Supabase does not distinguish them here by design.
      if (error) {
        setState('error');
        setMessage(error.message);
        return;
      }

      setState('sent');
    } catch (cause) {
      setState('error');
      setMessage(cause instanceof Error ? cause.message : 'Could not reach the auth server.');
    }
  }

  if (state === 'sent') {
    return (
      <div className="mt-8 border border-cyan-900/60 bg-cyan-950/20 p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Link sent</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          If {email} belongs to an operator, a sign-in link is on its way. It can be used once and
          expires shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={requestLink} className="mt-8">
      <label
        htmlFor="email"
        className="block font-mono text-[10px] uppercase tracking-widest text-zinc-600"
      >
        Operator email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-3 w-full border border-zinc-800 bg-[#121214] px-4 py-3 text-sm text-zinc-200 outline-none focus:border-cyan-800"
      />

      {state === 'error' ? <p className="mt-4 text-sm text-amber-400">{message}</p> : null}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-6 w-full border border-cyan-900 bg-cyan-950/30 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:bg-cyan-950/60 disabled:opacity-50"
      >
        {state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
      </button>
    </form>
  );
}
