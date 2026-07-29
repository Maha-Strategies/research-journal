'use client';

// Sign out. Server action clears the session cookies; this is only the control.

import { signOut } from './atlas-builder/actions';

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:text-amber-400"
      >
        sign out
      </button>
    </form>
  );
}
