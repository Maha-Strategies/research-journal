// Environment validation for the Builder.
//
// THIS IS THE FAIL-CLOSED GATE. It replaces the ATLAS_BUILDER_TOKEN check from
// the file-backed version: the question is no longer "is a shared secret set"
// but "is this deployment actually wired to a database and an auth server".
//
// The rule is unchanged in spirit and stricter in effect:
//
//   production + incomplete configuration  →  the operator area does not exist.
//   development + incomplete configuration →  the operator area does not exist,
//                                             with an explanatory message.
//
// Note the second line. The previous version allowed an unsecured development
// mode, because the private data was local files that never left the machine.
// That reasoning does not survive the move to Postgres: a misconfigured dev
// instance could point at a real database, so there is no longer a safe
// "unsecured" state to allow. Configuration is now required everywhere, and the
// only difference production makes is how much the error message says.

/** Public — safe to expose to the browser; the anon key is protected by RLS. */
export type PublicSupabaseConfig = {
  url: string;
  anonKey: string;
};

export type BuilderConfigStatus =
  | { configured: true; config: PublicSupabaseConfig }
  | { configured: false; missing: string[] };

const PUBLIC_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;

/**
 * Read the public Supabase configuration.
 *
 * `process.env.NEXT_PUBLIC_*` is referenced by full literal name rather than
 * through a variable, because Next inlines these at build time by static
 * substitution. `process.env[someVariable]` is not substituted and would read
 * as undefined in the browser.
 */
export function readBuilderConfig(): BuilderConfigStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  const missing: string[] = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length > 0) return { configured: false, missing };
  return { configured: true, config: { url: url as string, anonKey: anonKey as string } };
}

export function isBuilderConfigured(): boolean {
  return readBuilderConfig().configured;
}

/** Throws with the specific missing names. Server-side call sites only. */
export function requireBuilderConfig(): PublicSupabaseConfig {
  const status = readBuilderConfig();
  if (!status.configured) {
    throw new Error(
      `The Atlas Builder is not configured. Missing: ${status.missing.join(', ')}. See docs/atlas-builder-deployment.md.`,
    );
  }
  return status.config;
}

/**
 * The service-role key. Bypasses RLS completely.
 *
 * SERVER ONLY, and deliberately not prefixed NEXT_PUBLIC_ so it cannot be
 * inlined into a browser bundle. Used by the export script, the one-shot
 * import, and the RLS test harness — never on a request path. A request path
 * that needs elevated access has a bug in its policies, not a missing key.
 */
export function readServiceRoleKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function requireServiceRoleKey(): string {
  const key = readServiceRoleKey();
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. It is required for scripts and tests that must bypass RLS, and must never be exposed to the browser.',
    );
  }
  return key;
}

/** Human-readable explanation for the operator-area denial page. */
export function configurationMessage(status: BuilderConfigStatus): string {
  if (status.configured) return 'Configured.';
  return (
    `The Atlas Builder is disabled because it is not configured for this environment. ` +
    `Missing: ${status.missing.join(', ')}. This is deliberate — the operator area refuses to ` +
    `serve without a database and auth server to enforce its access rules.`
  );
}

/**
 * Startup check for the whole Builder configuration.
 *
 * Returns problems rather than throwing so a script can print all of them at
 * once instead of surfacing them one restart at a time.
 */
export function validateEnvironment(options: { requireServiceRole?: boolean } = {}): string[] {
  const problems: string[] = [];
  const status = readBuilderConfig();

  if (!status.configured) {
    problems.push(`Missing required variables: ${status.missing.join(', ')}`);
  } else {
    try {
      const parsed = new URL(status.config.url);
      if (parsed.protocol !== 'https:' && parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') {
        problems.push(`NEXT_PUBLIC_SUPABASE_URL must use https outside local development (got ${parsed.protocol}//).`);
      }
    } catch {
      problems.push(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: "${status.config.url}"`);
    }

    // A service-role key in a NEXT_PUBLIC_ variable would be published to every
    // visitor's browser. Worth an explicit check: the failure is catastrophic
    // and completely silent.
    if (status.config.anonKey.includes('service_role')) {
      problems.push(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY appears to contain a service-role key. That key bypasses RLS and must never be public.',
      );
    }
  }

  if (options.requireServiceRole && !readServiceRoleKey()) {
    problems.push('SUPABASE_SERVICE_ROLE_KEY is required for this operation.');
  }

  for (const name of PUBLIC_VARS) {
    const value = process.env[name];
    if (value && value !== value.trim()) {
      problems.push(`${name} has leading or trailing whitespace, which will produce confusing auth failures.`);
    }
  }

  return problems;
}
