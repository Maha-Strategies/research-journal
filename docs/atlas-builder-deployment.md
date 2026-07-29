# Atlas Builder — deployment and operations

The Builder is an internal authoring tool for evidence-bound research Atlases. This document covers configuration, the security model, and the gate that decides when it may be deployed.

Companion documents: [`atlas-builder.md`](atlas-builder.md) for the record model and workflow.

---

## Configuration

| Variable | Scope | Required for | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | everything | Local: `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | everything | Grants nothing on its own; RLS decides access |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | `atlas:export`, `atlas:import-file-drafts`, `test:rls` | **Bypasses RLS.** Never `NEXT_PUBLIC_` |

Start from [`.env.example`](../.env.example).

**Fail-closed.** With the public variables unset, every path under `/operator` returns 404 — in development as well as production. The previous file-backed Builder allowed an unsecured development mode because its private data was local files that never left the machine. That reasoning does not survive the move to Postgres: a misconfigured development instance could point at a real database, so there is no longer a safe unconfigured state.

**The service-role key does not belong in the web app's runtime environment.** Nothing the app serves needs it. Scope it to build/CI only. `lib/atlas/builder/supabase/admin.ts` throws if constructed inside a Next.js runtime, because a request path that needs it has a policy bug rather than a configuration gap.

---

## Local development

```bash
npm run db:start      # supabase start — requires Docker
npm run db:status     # copy the API URL and keys into .env.local
npm run db:reset      # re-apply every migration from scratch
npm run dev
```

Your first sign-in creates an `operator_profiles` row with the **`viewer`** role, which RLS denies everything to. Promote yourself once, directly against the local database:

```sql
update operator_profiles set role = 'owner' where email = 'you@example.com';
```

This cannot be done through the application: the `guard_role_change` trigger refuses any role change not made by an existing owner, so the first owner is necessarily a deliberate out-of-band act.

Importing existing file-backed drafts:

```bash
npm run atlas:import-file-drafts -- --owner you@example.com --dry-run
```

---

## Security model

Four layers, each of which assumes the others may be wrong.

| Layer | Where | Enforces |
|---|---|---|
| Optimistic check | `proxy.ts` | Redirects unauthenticated requests; rotates the session cookie. **Not a security boundary.** |
| Authorization | `lib/atlas/builder/dal.ts` | `auth.getUser()` revalidates the token with the auth server; role read from the database |
| Row-level security | `supabase/migrations/0004_rls.sql` | Who may read or write each row. The only layer that still holds if the others fail |
| Data integrity | triggers in `0001`–`0003` | Release immutability, append-only change log, reserved slugs, no private data in releases |

**Roles.** `viewer` reads authorized drafts. `editor` creates and edits their own drafts and any they have been granted write access to. `owner` administers all drafts, promotes operators, and is the **only** role that can cut a release.

**Why `getUser()` and not `getSession()`.** `getSession()` decodes the JWT from the cookie without verifying its signature — it is an assertion by the client about who they are. Every authorization decision starts from `getUser()`, which revalidates with the auth server.

**Private data is structurally separated, in three independent ways.** Private columns exist only on draft tables and have no counterpart in `atlas_releases`. The public serializer parses through `publicAtlasSchema`, and Zod strips unknown keys. A database trigger walks each release's JSON and rejects any `privateNotes` or `changeLog` key at any depth. The export script re-checks the bytes before writing the file that actually gets deployed.

**Release immutability.** Once inserted, only `state` and `superseded_by` may change, and only along permitted transitions. Deletes are refused by both a missing RLS policy and a trigger. A correction is a new version; the superseded one stays readable.

---

## Publishing is two steps

The public site does not query Postgres. `lib/atlas/builder/releases.ts` statically imports `content/atlas-releases/published.json`, so the route tree, aggregate indexes, and sitemap are derived at build time from a committed file.

```
Builder release  →  immutable row in atlas_releases   (private, reversible)
npm run atlas:export  →  content/atlas-releases/published.json
git commit + deploy   →  the atlas is live
```

This is deliberate: the public site stays up regardless of database availability, a build is reproducible from the repository alone, and putting an atlas live is a reviewable commit rather than a database write that silently changes what the world sees.

**Reserved slugs.** `de-sitter-swampland`, `quantum-computing`, `synthetic-intelligence`, and the gateway endpoint names are refused at the database, in `validate.ts`, and by `dynamicParams = false` on the public route tree. A Builder release cannot shadow a hand-authored Atlas.

---

## Testing

```bash
npm test        # 64 pure tests — schemas, validation, serialization, leak checks
npm run test:rls  # security proof against real Postgres; needs `npm run db:start`
npm run test:all
```

`test:rls` proves with two real authenticated users that one operator cannot read, update, or delete another's draft; that a collaborator grant confers exactly the access it says and no more; that a viewer cannot write; that an editor cannot publish; that a published release cannot be rewritten or deleted even by the service role; that the change log cannot be edited; and that an anonymous client reads nothing from any table.

**It skips loudly when Supabase is not running.** A silent skip on a security suite is worse than no suite.

---

## Deployment gate

Deploy a writable Builder only when **all** of these hold:

- [ ] Migrations applied to the target project (`supabase db push`)
- [ ] `npm run test:rls` passes against that project's schema
- [ ] `npm test` passes
- [ ] Production build succeeds and the public route list is unchanged
- [ ] At least one `owner` exists, and no unintended accounts hold `editor` or `owner`
- [ ] Supabase Auth is restricted to expected email addresses, or signups are disabled — a magic link is issued to any address that asks, and the default `viewer` role is what makes that safe
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is scoped to build/CI only, not the app runtime
- [ ] Email sending is configured, or nobody can sign in

---

## Known limitations

**Draft saves are not atomic.** `SupabaseAtlasStore.saveDraft` replaces child rows with a delete followed by an insert, and supabase-js has no client-side transaction. A failure between them leaves a draft with missing records. Recoverable — the draft is private and can be re-saved — but real. The fix is a Postgres function invoked via `rpc()`, deferred because it would move record mapping into SQL where the Zod schemas cannot check it.

**No optimistic concurrency.** Two operators editing one draft is last-write-wins. The collaborator model makes this reachable in a way the single-operator version was not. A row version column checked on update would close it.

**Role changes are not audited.** `atlas_change_log` records draft activity, not administrative action. A promotion to `owner` leaves no trace beyond the profile's `updated_at`.

**The first owner is set by hand.** Deliberate — see above — but it means bootstrapping requires database access.

---

## Rollback

Migrations are additive and numbered. To roll back locally, `npm run db:reset` re-applies from scratch. Against a remote project, write a new migration that reverses the change rather than editing an applied one.

**Rolling back a release is not a database rollback.** Re-publish an earlier version through the Builder, which moves the superseded record back to `published`, then re-run `atlas:export` and commit. Every version ever cut remains in `atlas_releases`.
