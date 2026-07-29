// Row-level security, release immutability, and public/private separation,
// proved against a real Postgres.
//
// Run with: npm run test:rls   (requires `supabase start`)
//
// WHY THIS FILE EXISTS SEPARATELY FROM builder.test.ts:
//
// Everything in builder.test.ts is pure — schemas, validation, serialization —
// and runs anywhere in milliseconds. Everything here needs a database, two real
// authenticated users, and the policies actually loaded. Splitting them keeps
// `npm test` fast and unconditional, and makes it obvious when the security
// proof did not run.
//
// It uses a `.rls-test.ts` suffix rather than `.test.ts` so the default suite
// does not try to run it and fail on a missing database.
//
// THE CENTRAL CLAIM UNDER TEST: an operator cannot read or modify another
// operator's draft unless explicitly authorized. That was previously true
// because there was one operator and the drafts were files on their laptop.
// Now it is true only if these policies are right, so it is asserted rather
// than assumed.

import assert from 'node:assert/strict';
import test, { after, before, describe } from 'node:test';
import { execFileSync, execSync } from 'node:child_process';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

type LocalConfig = { url: string; anonKey: string; serviceKey: string };

/**
 * Read local Supabase credentials from the CLI.
 *
 * Taken from `supabase status` rather than hardcoded: the local keys are stable
 * in practice but are not a documented contract, and a hardcoded key that
 * silently stops matching produces a confusing auth failure rather than a clear
 * "Supabase is not running".
 */
function readLocalConfig(): LocalConfig | null {
  try {
    const raw = execSync('supabase status -o json', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const status = JSON.parse(raw);
    const url = status.API_URL ?? status.api_url;
    const anonKey = status.ANON_KEY ?? status.anon_key;
    const serviceKey = status.SERVICE_ROLE_KEY ?? status.service_role_key;
    if (!url || !anonKey || !serviceKey) return null;
    return { url, anonKey, serviceKey };
  } catch {
    return null;
  }
}

const config = readLocalConfig();

if (!config) {
  describe('security (RLS, immutability, private/public separation)', () => {
    test('SKIPPED — local Supabase is not running', { skip: true }, () => {});
  });
  console.error(
    '\n  ⚠ RLS tests did not run: local Supabase is unavailable.\n' +
      '    Start Docker, then `npm run db:start`, then `npm run test:rls`.\n' +
      '    Deployment readiness cannot be claimed without this suite passing.\n',
  );
} else {
  runSecuritySuite(config);
}

function runSecuritySuite({ url, anonKey, serviceKey }: LocalConfig) {
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const stamp = Date.now();
  const ALICE = `alice-${stamp}@example.test`;
  const BOB = `bob-${stamp}@example.test`;
  const VIEWER = `viewer-${stamp}@example.test`;
  const PASSWORD = 'test-password-not-a-real-secret';

  const ALICE_SLUG = `rls-alice-${stamp}`;
  const PRIVATE_SENTINEL = `PRIVATE-SENTINEL-${stamp}`;

  let alice: SupabaseClient;
  let bob: SupabaseClient;
  let viewer: SupabaseClient;
  let aliceId = '';
  let bobId = '';
  let aliceDraftId = '';

  /**
   * Remove test fixtures through the local Postgres superuser.
   *
   * The normal service-role client intentionally cannot remove a release or an
   * append-only change-log row. That is the invariant under test. A test suite
   * still needs to leave a developer's local project clean, so this narrowly
   * targeted cleanup uses the disposable local database container after the
   * assertions have run. It is never used by application code or against a
   * hosted Supabase project.
   */
  function removeTestFixtures(): void {
    const project = process.cwd().split('/').pop();
    if (!project || !/^[a-z0-9-]+$/.test(project)) {
      throw new Error('Could not derive a safe local Supabase project name for RLS-test cleanup.');
    }
    const container = `supabase_db_${project}`;
    const pattern = `%-${stamp}@example.test`;
    const sql = `
      begin;
      set local session_replication_role = replica;
      delete from atlas_draft_claims where draft_id in (select id from atlas_drafts where owner_id in (select id from operator_profiles where email like '${pattern}'));
      delete from atlas_draft_concepts where draft_id in (select id from atlas_drafts where owner_id in (select id from operator_profiles where email like '${pattern}'));
      delete from atlas_draft_sources where draft_id in (select id from atlas_drafts where owner_id in (select id from operator_profiles where email like '${pattern}'));
      delete from atlas_draft_collaborators where draft_id in (select id from atlas_drafts where owner_id in (select id from operator_profiles where email like '${pattern}')) or operator_id in (select id from operator_profiles where email like '${pattern}');
      delete from atlas_change_log where actor_id in (select id from operator_profiles where email like '${pattern}');
      delete from atlas_releases where released_by in (select id from operator_profiles where email like '${pattern}');
      delete from atlas_drafts where owner_id in (select id from operator_profiles where email like '${pattern}');
      delete from operator_profiles where email like '${pattern}';
      delete from auth.users where email like '${pattern}';
      commit;
    `;
    execFileSync('docker', ['exec', '-i', container, 'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres', '-c', sql], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  /**
   * A client authenticated as a real user.
   *
   * Password sign-in is used here purely because a test cannot read an email.
   * The application itself uses magic links only — this is a harness detail and
   * not a second supported credential path.
   */
  async function signIn(email: string): Promise<SupabaseClient> {
    const client = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await client.auth.signInWithPassword({ email, password: PASSWORD });
    if (error) throw new Error(`Could not sign in ${email}: ${error.message}`);
    return client;
  }

  async function createUser(email: string, role: 'owner' | 'editor' | 'viewer'): Promise<string> {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
    });
    if (error || !data.user) throw new Error(`Could not create ${email}: ${error?.message}`);

    // The on_auth_user_created trigger provisions the profile as 'viewer'; the
    // role is set here through the admin client, which is the only path that
    // can — guard_role_change refuses an authenticated self-promotion.
    const { error: roleError } = await admin
      .from('operator_profiles')
      .update({ role })
      .eq('id', data.user.id);
    if (roleError) throw new Error(`Could not set role for ${email}: ${roleError.message}`);

    // Read it back. An update matching zero rows is NOT an error in PostgREST,
    // so without this the role could silently stay 'viewer' and every later
    // assertion would fail somewhere far from the cause.
    const { data: profile } = await admin
      .from('operator_profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profile?.role !== role) {
      throw new Error(
        `Role for ${email} is "${profile?.role ?? 'missing profile'}", expected "${role}". The on_auth_user_created trigger or guard_role_change is not behaving as the migrations describe.`,
      );
    }

    return data.user.id;
  }

  before(async () => {
    aliceId = await createUser(ALICE, 'editor');
    bobId = await createUser(BOB, 'editor');
    await createUser(VIEWER, 'viewer');

    alice = await signIn(ALICE);
    bob = await signIn(BOB);
    viewer = await signIn(VIEWER);

    // Alice's draft, created through her own session so the insert policy is
    // exercised rather than bypassed.
    const { data, error } = await alice
      .from('atlas_drafts')
      .insert({
        slug: ALICE_SLUG,
        owner_id: aliceId,
        title: 'Alice RLS Fixture',
        short_title: 'Alice Fixture',
        description: 'A fixture atlas owned by Alice, used to prove that Bob cannot reach it.',
        scope: 'Row-level security verification.',
        intended_reader: 'The test suite, and anyone auditing the isolation guarantees.',
        editorial_boundary: 'A fixture. It asserts nothing about any real subject.',
        exclusions: ['Test fixture, never to be published.'],
        methodology: 'Constructed by the RLS test suite.',
        update_policy: 'Deleted when the suite finishes.',
        version: '0.1.0',
        last_reviewed: '2026-07-28',
        status_badge: 'Fixture',
        private_notes: PRIVATE_SENTINEL,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Alice could not create her draft: ${error.message}`);
    aliceDraftId = data.id;

    const { error: sourceError } = await alice.from('atlas_draft_sources').insert({
      draft_id: aliceDraftId,
      record_id: 'alice-source',
      position: 0,
      title: 'A Fixture Source',
      authors: 'Test Suite',
      year: 2020,
      year_basis: 'Invented for the fixture.',
      identifier: 'DOI:10.0000/alice-fixture',
      url: 'https://example.com/alice-fixture',
      source_type: 'primary-paper',
      verification: 'verified',
      verified_on: '2026-07-28',
      why_here: 'Supports the fixture claim.',
      private_notes: PRIVATE_SENTINEL,
    });
    if (sourceError) throw new Error(`Alice could not add a source: ${sourceError.message}`);
  });

  /**
   * Remove every account this run created.
   *
   * Deletes by email pattern rather than by remembered id, and drops owned
   * drafts first. atlas_drafts.owner_id is `on delete restrict`, so deleting an
   * operator who still owns a draft fails — and because the earlier version
   * swallowed that failure, test accounts accumulated in the local database
   * with `editor` and `owner` roles. That directly undermines the deployment
   * check "no unintended account holds editor or owner", so the failure is
   * surfaced here rather than ignored.
   */
  after(() => {
    try {
      removeTestFixtures();
    } catch (error) {
      // A successful security suite that leaves owner accounts behind is not
      // a successful local verification. Fail loudly so the deploy checklist
      // cannot be satisfied by a polluted test database.
      throw new Error(`Could not remove local RLS test fixtures: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // -------------------------------------------------------------------------

  describe('draft isolation between operators', () => {
    test('Alice can read her own draft', async () => {
      const { data, error } = await alice.from('atlas_drafts').select('slug').eq('slug', ALICE_SLUG);
      assert.equal(error, null);
      assert.equal(data?.length, 1);
    });

    test('Bob cannot read Alice’s draft', async () => {
      const { data, error } = await bob.from('atlas_drafts').select('slug').eq('slug', ALICE_SLUG);
      // RLS filters rather than errors: Bob gets an empty set, not a refusal.
      assert.equal(error, null);
      assert.deepEqual(data, []);
    });

    test('Bob cannot see Alice’s draft in a list', async () => {
      const { data } = await bob.from('atlas_drafts').select('slug');
      assert.equal((data ?? []).some((row: { slug: string }) => row.slug === ALICE_SLUG), false);
    });

    test('Bob cannot read Alice’s source records', async () => {
      const { data } = await bob.from('atlas_draft_sources').select('record_id').eq('draft_id', aliceDraftId);
      assert.deepEqual(data, []);
    });

    test('Bob cannot reach Alice’s private notes by any select', async () => {
      const { data } = await bob.from('atlas_drafts').select('*');
      assert.equal(JSON.stringify(data ?? []).includes(PRIVATE_SENTINEL), false);
    });

    test('Bob cannot update Alice’s draft', async () => {
      const { data, error } = await bob
        .from('atlas_drafts')
        .update({ title: 'Bob was here' })
        .eq('slug', ALICE_SLUG)
        .select();
      // No visible row to update: the update matches nothing rather than erroring.
      assert.equal(error, null);
      assert.deepEqual(data, []);

      const { data: check } = await admin.from('atlas_drafts').select('title').eq('slug', ALICE_SLUG).single();
      assert.equal(check?.title, 'Alice RLS Fixture');
    });

    test('Bob cannot delete Alice’s draft', async () => {
      await bob.from('atlas_drafts').delete().eq('slug', ALICE_SLUG);
      const { data } = await admin.from('atlas_drafts').select('slug').eq('slug', ALICE_SLUG);
      assert.equal(data?.length, 1, 'Alice’s draft survived');
    });

    test('Bob cannot insert records into Alice’s draft', async () => {
      const { error } = await bob.from('atlas_draft_claims').insert({
        draft_id: aliceDraftId,
        record_id: 'bob-injected',
        position: 99,
        slug: 'bob-injected',
        claim: 'A claim Bob should not be able to add to someone else’s atlas.',
        explanation: 'If this row exists, the child-table policy is not delegating correctly.',
        status: 'established',
        confidence: 'high',
        controversy: 'uncontested',
        source_ids: ['alice-source'],
        limitations: 'This should never have been written in the first place.',
        review_date: '2026-07-28',
      });
      assert.notEqual(error, null, 'the insert should have been refused');

      const { data } = await admin.from('atlas_draft_claims').select('record_id').eq('draft_id', aliceDraftId);
      assert.equal((data ?? []).length, 0);
    });

    test('Bob cannot create a draft owned by Alice', async () => {
      const { error } = await bob.from('atlas_drafts').insert({
        slug: `bob-impersonating-${stamp}`,
        owner_id: aliceId,
        title: 'Draft attributed to Alice',
        short_title: 'Impersonation',
        description: 'If this succeeds, owner_id is not pinned to the authenticated caller.',
        scope: 'Testing the insert policy.',
        intended_reader: 'The test suite.',
        editorial_boundary: 'A fixture.',
        exclusions: ['Fixture.'],
        methodology: 'Constructed by the test suite.',
        update_policy: 'n/a',
        version: '0.1.0',
        last_reviewed: '2026-07-28',
        status_badge: 'Fixture',
      });
      assert.notEqual(error, null, 'owner_id must be pinned to auth.uid()');
    });
  });

  describe('explicit authorization via collaborators', () => {
    test('a collaborator row grants read but not write', async () => {
      await admin.from('atlas_draft_collaborators').insert({
        draft_id: aliceDraftId,
        operator_id: bobId,
        can_write: false,
        granted_by: aliceId,
      });

      const { data: readable } = await bob.from('atlas_drafts').select('slug').eq('slug', ALICE_SLUG);
      assert.equal(readable?.length, 1, 'Bob should now be able to read');

      const { data: updated } = await bob
        .from('atlas_drafts')
        .update({ title: 'Bob edit attempt' })
        .eq('slug', ALICE_SLUG)
        .select();
      assert.deepEqual(updated, [], 'read access must not imply write access');

      await admin
        .from('atlas_draft_collaborators')
        .delete()
        .eq('draft_id', aliceDraftId)
        .eq('operator_id', bobId);
    });

    test('can_write grants write, and revoking it takes access away again', async () => {
      await admin.from('atlas_draft_collaborators').insert({
        draft_id: aliceDraftId,
        operator_id: bobId,
        can_write: true,
        granted_by: aliceId,
      });

      const { data: updated } = await bob
        .from('atlas_drafts')
        .update({ status_badge: 'Edited by collaborator' })
        .eq('slug', ALICE_SLUG)
        .select();
      assert.equal(updated?.length, 1, 'a write collaborator should be able to edit');

      await admin
        .from('atlas_draft_collaborators')
        .delete()
        .eq('draft_id', aliceDraftId)
        .eq('operator_id', bobId);

      const { data: afterRevoke } = await bob.from('atlas_drafts').select('slug').eq('slug', ALICE_SLUG);
      assert.deepEqual(afterRevoke, [], 'revoking the grant must remove access');
    });
  });

  describe('roles', () => {
    test('a viewer cannot create a draft', async () => {
      const { data: profile } = await admin
        .from('operator_profiles')
        .select('id')
        .eq('email', VIEWER)
        .single();

      const { error } = await viewer.from('atlas_drafts').insert({
        slug: `viewer-attempt-${stamp}`,
        owner_id: profile!.id,
        title: 'Viewer attempt',
        short_title: 'Viewer',
        description: 'A viewer must not be able to create an atlas.',
        scope: 'Role enforcement.',
        intended_reader: 'The test suite.',
        editorial_boundary: 'A fixture.',
        exclusions: ['Fixture.'],
        methodology: 'Constructed by the test suite.',
        update_policy: 'n/a',
        version: '0.1.0',
        last_reviewed: '2026-07-28',
        status_badge: 'Fixture',
      });
      assert.notEqual(error, null, 'a viewer must not be able to insert a draft');
    });

    test('an operator cannot promote themselves', async () => {
      const { data } = await bob.from('operator_profiles').update({ role: 'owner' }).eq('id', bobId).select();
      const { data: check } = await admin.from('operator_profiles').select('role').eq('id', bobId).single();
      assert.equal(check?.role, 'editor', 'self-promotion must be refused');
      assert.ok(!data || data.length === 0 || check?.role === 'editor');
    });

    test('an editor cannot insert a release', async () => {
      const { error } = await alice.from('atlas_releases').insert({
        slug: `editor-release-${stamp}`,
        version: '0.1.0',
        released_by: aliceId,
        release_note: 'An editor should not be able to publish.',
        atlas: { slug: `editor-release-${stamp}`, claims: [], concepts: [], sources: [] },
      });
      assert.notEqual(error, null, 'publishing is owner-only');
    });
  });

  describe('release immutability', () => {
    const RELEASE_SLUG = `rls-release-${stamp}`;
    let ownerId = '';

    before(async () => {
      ownerId = await createUser(`owner-${stamp}@example.test`, 'owner');
      await admin.from('atlas_releases').insert({
        slug: RELEASE_SLUG,
        version: '1.0.0',
        state: 'published',
        released_by: ownerId,
        release_note: 'Fixture release for immutability checks.',
        atlas: {
          slug: RELEASE_SLUG,
          title: 'Immutability fixture',
          claims: [{ id: 'imm-001', claim: 'A claim.' }],
          concepts: [],
          sources: [],
        },
      });
    });

    after(async () => {
      // The fixture release is deliberately NOT cleaned up: forbid_release_delete
      // refuses every delete, which is the guarantee under test. It is left in
      // the local database, where `npm run db:reset` clears it.
      await admin.auth.admin.deleteUser(ownerId).catch(() => {});
    });

    test('the atlas body cannot be rewritten', async () => {
      const { error } = await admin
        .from('atlas_releases')
        .update({ atlas: { slug: RELEASE_SLUG, claims: [], concepts: [], sources: [] } })
        .eq('slug', RELEASE_SLUG)
        .eq('version', '1.0.0');
      assert.notEqual(error, null, 'a published release body must be immutable');
      assert.match(String(error?.message), /immutable/i);
    });

    test('the version cannot be changed', async () => {
      const { error } = await admin
        .from('atlas_releases')
        .update({ version: '9.9.9' })
        .eq('slug', RELEASE_SLUG);
      assert.notEqual(error, null);
    });

    test('the release note cannot be rewritten', async () => {
      const { error } = await admin
        .from('atlas_releases')
        .update({ release_note: 'Quietly changed after the fact.' })
        .eq('slug', RELEASE_SLUG);
      assert.notEqual(error, null);
    });

    test('a release cannot be deleted, even by the service role', async () => {
      const { error } = await admin.from('atlas_releases').delete().eq('slug', RELEASE_SLUG);
      assert.notEqual(error, null, 'releases must never be deletable');

      const { data } = await admin.from('atlas_releases').select('slug').eq('slug', RELEASE_SLUG);
      assert.equal(data?.length, 1);
    });

    test('state may move along permitted transitions', async () => {
      const { error } = await admin
        .from('atlas_releases')
        .update({ state: 'superseded', superseded_by: '1.1.0' })
        .eq('slug', RELEASE_SLUG);
      assert.equal(error, null, 'published -> superseded is permitted');
    });

    test('rollback re-publishes an earlier version', async () => {
      const { error } = await admin
        .from('atlas_releases')
        .update({ state: 'published' })
        .eq('slug', RELEASE_SLUG);
      assert.equal(error, null, 'superseded -> published is permitted for rollback');
    });

    test('a duplicate version is refused', async () => {
      const { error } = await admin.from('atlas_releases').insert({
        slug: RELEASE_SLUG,
        version: '1.0.0',
        released_by: ownerId,
        release_note: 'A second release at the same version.',
        atlas: { slug: RELEASE_SLUG, claims: [], concepts: [], sources: [] },
      });
      assert.notEqual(error, null, 'unique(slug, version) must hold');
    });
  });

  describe('the database refuses private material in a release', () => {
    test('a release carrying privateNotes is rejected at insert', async () => {
      const { data: profile } = await admin
        .from('operator_profiles')
        .select('id')
        .eq('email', ALICE)
        .single();

      const { error } = await admin.from('atlas_releases').insert({
        slug: `poisoned-${stamp}`,
        version: '1.0.0',
        released_by: profile!.id,
        release_note: 'A release that should never be storable.',
        atlas: {
          slug: `poisoned-${stamp}`,
          claims: [{ id: 'p-001', claim: 'A claim.', privateNotes: PRIVATE_SENTINEL }],
          concepts: [],
          sources: [],
        },
      });

      assert.notEqual(error, null, 'the private-key scan must reject this');
      assert.match(String(error?.message), /private/i);
    });

    test('a release carrying a nested changeLog is rejected', async () => {
      const { data: profile } = await admin
        .from('operator_profiles')
        .select('id')
        .eq('email', ALICE)
        .single();

      const { error } = await admin.from('atlas_releases').insert({
        slug: `poisoned-log-${stamp}`,
        version: '1.0.0',
        released_by: profile!.id,
        release_note: 'A release carrying operator activity.',
        atlas: {
          slug: `poisoned-log-${stamp}`,
          claims: [],
          concepts: [],
          sources: [],
          changeLog: [{ actor: 'someone', action: 'updated' }],
        },
      });

      assert.notEqual(error, null);
    });

    test('a reserved slug cannot be released', async () => {
      const { data: profile } = await admin
        .from('operator_profiles')
        .select('id')
        .eq('email', ALICE)
        .single();

      const { error } = await admin.from('atlas_releases').insert({
        slug: 'quantum-computing',
        version: '9.9.9',
        released_by: profile!.id,
        release_note: 'An attempt to shadow a hand-authored Atlas.',
        atlas: { slug: 'quantum-computing', claims: [], concepts: [], sources: [] },
      });

      assert.notEqual(error, null, 'a hand-authored Atlas slug must be unclaimable');
      assert.match(String(error?.message), /reserved/i);
    });

    test('a reserved slug cannot be used for a draft either', async () => {
      const { error } = await alice.from('atlas_drafts').insert({
        slug: 'de-sitter-swampland',
        owner_id: aliceId,
        title: 'Shadowing attempt',
        short_title: 'Shadow',
        description: 'An attempt to take a hand-authored Atlas slug.',
        scope: 'Reserved-slug enforcement.',
        intended_reader: 'The test suite.',
        editorial_boundary: 'A fixture.',
        exclusions: ['Fixture.'],
        methodology: 'Constructed by the test suite.',
        update_policy: 'n/a',
        version: '0.1.0',
        last_reviewed: '2026-07-28',
        status_badge: 'Fixture',
      });
      assert.notEqual(error, null);
    });
  });

  describe('the change log is an audit trail', () => {
    test('actor_id is forced to the authenticated caller', async () => {
      await alice.from('atlas_change_log').insert({
        draft_id: aliceDraftId,
        slug: ALICE_SLUG,
        // Deliberately claiming to be Bob. The trigger must overwrite this.
        actor_id: bobId,
        action: 'updated',
        target: `atlas:${ALICE_SLUG}`,
        summary: 'An entry attributed to the wrong operator.',
      });

      const { data } = await admin
        .from('atlas_change_log')
        .select('actor_id')
        .eq('draft_id', aliceDraftId)
        .order('at', { ascending: false })
        .limit(1);

      assert.equal(data?.[0]?.actor_id, aliceId, 'the actor must be the authenticated caller');
    });

    test('entries cannot be edited', async () => {
      const { data: entry } = await admin
        .from('atlas_change_log')
        .select('id')
        .eq('draft_id', aliceDraftId)
        .limit(1)
        .single();

      const { error } = await admin
        .from('atlas_change_log')
        .update({ summary: 'Rewritten history.' })
        .eq('id', entry!.id);

      assert.notEqual(error, null, 'the change log must be append-only');
    });

    test('entries cannot be deleted', async () => {
      const { data: entry } = await admin
        .from('atlas_change_log')
        .select('id')
        .eq('draft_id', aliceDraftId)
        .limit(1)
        .single();

      const { error } = await admin.from('atlas_change_log').delete().eq('id', entry!.id);
      assert.notEqual(error, null);
    });

    test('Bob cannot read the change log of a draft he cannot see', async () => {
      const { data } = await bob.from('atlas_change_log').select('summary').eq('draft_id', aliceDraftId);
      assert.deepEqual(data, []);
    });
  });

  describe('unauthenticated access', () => {
    test('an anonymous client can read nothing', async () => {
      const anon = createClient(url, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      for (const table of [
        'atlas_drafts',
        'atlas_draft_sources',
        'atlas_draft_concepts',
        'atlas_draft_claims',
        'atlas_releases',
        'atlas_change_log',
        'operator_profiles',
      ]) {
        const { data } = await anon.from(table).select('*');
        assert.deepEqual(data ?? [], [], `anonymous access to ${table} must return nothing`);
      }
    });
  });
}
