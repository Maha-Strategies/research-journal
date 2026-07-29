// Test suite for the Private Atlas Builder.
//
// Run with: npm run test:builder
//
// Uses node:test and Node's native type stripping — no test framework, no
// transform step, no new dependency. This is why every module under
// lib/atlas/builder/ imports its siblings with an explicit `.ts` extension:
// Node's resolver requires it, and tsconfig's allowImportingTsExtensions lets
// tsc and Turbopack read the same files.
//
// The properties worth testing here are the ones whose failure would be silent:
// a draft reaching public output, a published version being rewritten, a
// private note surviving serialization. Those get the most attention below.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test, { describe } from 'node:test';

import { draftAtlasSchema, publicAtlasSchema, type DraftAtlas, type ReleaseRecord } from './schema.ts';
import { RESERVED_ATLAS_SLUGS } from './vocabulary.ts';
import { canRelease, normalizeIdentifier, validateAtlas } from './validate.ts';
import {
  applyToPublished,
  bumpVersion,
  canTransition,
  compareVersions,
  cutRelease,
  draftFromRelease,
  rollbackTo,
  withdrawFromPublished,
} from './release.ts';
import {
  buildAllPublicOutput,
  buildCatalogEntry,
  buildClaimsRecord,
  buildContextText,
  buildSitemapEntries,
  buildSourcesRecord,
  isPublic,
} from './public-output.ts';
import { exportAtlas, importAtlas, PORTABLE_FORMAT } from './portable.ts';
import { appendChange } from './changelog.ts';
import { PUBLISHED_RELEASES, PUBLISHED_SLUGS } from './releases.ts';

const NOW = '2026-07-28T10:00:00.000Z';
const TODAY = '2026-07-28';
// The package has no `"type": "module"`, so Node strips types in CommonJS mode
// and `import.meta` is unavailable. npm scripts run from the package root, so
// cwd is the repository root; asserted below rather than assumed.
const REPO_ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/**
 * A minimal valid draft, built fresh per test so mutation in one cannot leak
 * into another.
 */
function makeDraft(overrides: Partial<DraftAtlas> = {}): DraftAtlas {
  return draftAtlasSchema.parse({
    slug: 'test-atlas',
    title: 'Test Atlas For The Builder',
    shortTitle: 'Test Atlas',
    description:
      'A fixture atlas used only by the builder test suite. It exists to exercise validation, release, and serialization paths.',
    scope: 'The behaviour of the atlas builder test suite.',
    intendedReader: 'A developer reading the builder test suite to see what it guarantees.',
    editorialBoundary: 'A fixture. It asserts nothing about any real subject matter whatsoever.',
    exclusions: ['Not a real atlas and must never be published.'],
    methodology:
      'Constructed by hand in the test suite. No sources were resolved; the records are synthetic and exist to exercise code paths.',
    updatePolicy: 'Changed whenever the record shape changes. It has no review cycle.',
    version: '0.1.0',
    lastReviewed: TODAY,
    license: 'CC BY 4.0',
    statusBadge: 'Fixture · 1 claim',
    state: 'draft',
    visibility: 'private',
    createdAt: NOW,
    updatedAt: NOW,
    changeLog: [],
    privateNotes: 'PRIVATE-ATLAS-NOTE-SENTINEL',
    sources: [
      {
        id: 'src-one',
        title: 'A Fixture Source',
        authors: 'Test Suite',
        year: 2020,
        yearBasis: 'Invented for the fixture.',
        identifier: 'DOI:10.0000/fixture-one',
        url: 'https://example.com/fixture-one',
        sourceType: 'primary-paper',
        verification: 'verified',
        verifiedOn: TODAY,
        whyHere: 'Supports the fixture claim so the claim has a resolvable source.',
        privateNotes: 'PRIVATE-SOURCE-NOTE-SENTINEL',
      },
    ],
    concepts: [
      {
        id: 'fixture-concept',
        label: 'Fixture concept',
        definition: 'A concept record that exists so the fixture atlas has a non-empty concept layer.',
        sourceIds: ['src-one'],
        related: [],
        privateNotes: 'PRIVATE-CONCEPT-NOTE-SENTINEL',
      },
    ],
    claims: [
      {
        id: 'tst-001',
        slug: 'a-fixture-claim',
        claim: 'This is a fixture claim used to exercise the builder validation and release paths.',
        explanation: 'It exists to be validated, released, and serialized by the test suite.',
        status: 'established',
        confidence: 'high',
        controversy: 'uncontested',
        sourceIds: ['src-one'],
        qualifyingSourceIds: [],
        conceptIds: ['fixture-concept'],
        limitations: 'Establishes nothing at all. It is a synthetic record inside a test fixture.',
        exclusions: [],
        reviewDate: TODAY,
        privateNotes: 'PRIVATE-CLAIM-NOTE-SENTINEL',
      },
    ],
    ...overrides,
  });
}

/** Every private sentinel planted in the fixture above. */
const PRIVATE_SENTINELS = [
  'PRIVATE-ATLAS-NOTE-SENTINEL',
  'PRIVATE-SOURCE-NOTE-SENTINEL',
  'PRIVATE-CONCEPT-NOTE-SENTINEL',
  'PRIVATE-CLAIM-NOTE-SENTINEL',
];

function release(draft: DraftAtlas = makeDraft()): ReleaseRecord {
  const result = cutRelease(draft, {
    approved: true,
    actor: 'test',
    releaseNote: 'Initial fixture release for the test suite.',
    today: TODAY,
    now: NOW,
  });
  assert.equal(result.ok, true, `cutRelease failed: ${!result.ok ? result.reasons.join('; ') : ''}`);
  return (result as Extract<typeof result, { ok: true }>).release;
}

// ---------------------------------------------------------------------------

describe('test environment', () => {
  test('runs from the repository root, as the npm script guarantees', () => {
    assert.ok(
      readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8').includes('"research-journal"'),
      'Tests must be run from the repository root — use `npm run test:builder`.',
    );
  });
});

describe('schema validation', () => {
  test('accepts a well-formed draft', () => {
    assert.doesNotThrow(() => makeDraft());
  });

  test('rejects a claim with no sources', () => {
    const result = draftAtlasSchema.safeParse({
      ...makeDraft(),
      claims: [{ ...makeDraft().claims[0], sourceIds: [] }],
    });
    assert.equal(result.success, false);
  });

  test('rejects a claim with no stated boundary', () => {
    const claim = { ...makeDraft().claims[0] } as Record<string, unknown>;
    delete claim.limitations;
    const result = draftAtlasSchema.safeParse({ ...makeDraft(), claims: [claim] });
    assert.equal(result.success, false);
  });

  test('rejects an impossible calendar date', () => {
    const result = draftAtlasSchema.safeParse({ ...makeDraft(), lastReviewed: '2026-02-31' });
    assert.equal(result.success, false);
  });

  test('rejects a non-semantic version', () => {
    const result = draftAtlasSchema.safeParse({ ...makeDraft(), version: '1.0' });
    assert.equal(result.success, false);
  });

  test('rejects an atlas with no exclusions', () => {
    const result = draftAtlasSchema.safeParse({ ...makeDraft(), exclusions: [] });
    assert.equal(result.success, false);
  });

  test('rejects a relative source URL', () => {
    const draft = makeDraft();
    const result = draftAtlasSchema.safeParse({
      ...draft,
      sources: [{ ...draft.sources[0], url: '/relative/path' }],
    });
    assert.equal(result.success, false);
  });

  test('public schema strips private fields structurally', () => {
    const parsed = publicAtlasSchema.parse(makeDraft());
    const serialized = JSON.stringify(parsed);
    for (const sentinel of PRIVATE_SENTINELS) {
      assert.equal(serialized.includes(sentinel), false, `${sentinel} survived the public schema`);
    }
    assert.equal('privateNotes' in parsed, false);
  });
});

describe('referential validation', () => {
  test('a valid atlas passes', () => {
    const result = validateAtlas(makeDraft(), { today: TODAY });
    assert.equal(result.ok, true, JSON.stringify(result.errors));
  });

  test('flags a claim citing a source that does not exist', () => {
    const draft = makeDraft();
    draft.claims[0].sourceIds = ['no-such-source'];
    const result = validateAtlas(draft, { today: TODAY });
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((f) => f.code === 'missing-source'));
  });

  test('flags a claim resting only on an excluded source', () => {
    const draft = makeDraft();
    draft.sources[0].verification = 'excluded';
    const result = validateAtlas(draft, { today: TODAY });
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((f) => f.code === 'weak-support'));
    assert.ok(result.errors.some((f) => f.code === 'unsourced-claim'));
  });

  test('flags duplicate claim slugs', () => {
    const draft = makeDraft();
    draft.claims.push({ ...draft.claims[0], id: 'tst-002' });
    const result = validateAtlas(draft, { today: TODAY });
    assert.ok(result.errors.some((f) => f.code === 'duplicate-slug'));
  });

  test('detects the same work entered twice under different ids', () => {
    const draft = makeDraft();
    draft.sources.push({
      ...draft.sources[0],
      id: 'src-two',
      identifier: 'https://doi.org/10.0000/FIXTURE-ONE',
      url: 'https://example.com/other',
    });
    const result = validateAtlas(draft, { today: TODAY });
    assert.ok(result.errors.some((f) => f.code === 'duplicate-source'));
  });

  test('normalizeIdentifier collapses equivalent DOI and arXiv forms', () => {
    assert.equal(normalizeIdentifier('DOI:10.1038/X'), normalizeIdentifier('https://doi.org/10.1038/x'));
    assert.equal(
      normalizeIdentifier('arXiv:1801.00862'),
      normalizeIdentifier('https://arxiv.org/abs/1801.00862/'),
    );
    // Distinct works must not collapse.
    assert.notEqual(normalizeIdentifier('arXiv:1801.00862'), normalizeIdentifier('arXiv:1801.00863'));
  });

  test('flags a future review date', () => {
    const draft = makeDraft();
    draft.claims[0].reviewDate = '2027-01-01';
    const result = validateAtlas(draft, { today: TODAY });
    assert.ok(result.errors.some((f) => f.code === 'date-future'));
  });

  test('flags a contested claim labelled established', () => {
    const draft = makeDraft();
    draft.claims[0].controversy = 'contested';
    const result = validateAtlas(draft, { today: TODAY });
    assert.ok(result.errors.some((f) => f.code === 'status-controversy-conflict'));
  });

  test('flags a broken concept cross-reference', () => {
    const draft = makeDraft();
    draft.concepts[0].related = ['nope'];
    const result = validateAtlas(draft, { today: TODAY });
    assert.ok(result.errors.some((f) => f.code === 'missing-concept'));
  });

  test('every reserved slug is refused', () => {
    for (const slug of RESERVED_ATLAS_SLUGS) {
      // Only kebab-case slugs can be constructed; the dotted ones are refused
      // by the schema before validation ever sees them.
      const parsed = draftAtlasSchema.safeParse({ ...makeDraft(), slug });
      if (!parsed.success) continue;
      const result = validateAtlas(parsed.data, { today: TODAY });
      assert.ok(
        result.errors.some((f) => f.code === 'slug-reserved'),
        `slug "${slug}" was not refused`,
      );
    }
  });

  test('warns about an orphan source without blocking release', () => {
    const draft = makeDraft();
    draft.sources.push({
      ...draft.sources[0],
      id: 'src-orphan',
      identifier: 'DOI:10.0000/orphan',
      url: 'https://example.com/orphan',
    });
    const result = validateAtlas(draft, { today: TODAY });
    assert.equal(result.ok, true);
    assert.ok(result.warnings.some((f) => f.code === 'orphan-source'));
  });
});

describe('release gating', () => {
  test('an unapproved draft cannot be released', () => {
    const gate = canRelease(makeDraft(), { approved: false, today: TODAY });
    assert.equal(gate.allowed, false);
    assert.ok(gate.reasons.some((r) => r.includes('not been explicitly approved')));
  });

  test('an approved but invalid draft cannot be released', () => {
    const draft = makeDraft();
    draft.claims[0].sourceIds = ['missing'];
    const gate = canRelease(draft, { approved: true, today: TODAY });
    assert.equal(gate.allowed, false);
  });

  test('an approved valid draft can be released', () => {
    const gate = canRelease(makeDraft(), { approved: true, today: TODAY });
    assert.equal(gate.allowed, true, gate.reasons.join('; '));
  });

  test('cutRelease refuses without approval even when valid', () => {
    const result = cutRelease(makeDraft(), {
      approved: false,
      actor: 'test',
      releaseNote: 'Should not happen.',
      today: TODAY,
      now: NOW,
    });
    assert.equal(result.ok, false);
  });

  test('cutRelease refuses to reuse a version already cut', () => {
    const first = release();
    const result = cutRelease(makeDraft(), {
      approved: true,
      actor: 'test',
      releaseNote: 'Second attempt at the same version.',
      today: TODAY,
      now: NOW,
      history: [first],
    });
    assert.equal(result.ok, false);
    assert.ok(!result.ok && result.reasons.some((r) => r.includes('already released')));
  });

  test('a release supersedes its predecessor rather than replacing it', () => {
    const first = release();
    const next = makeDraft({ version: '0.2.0' });
    const result = cutRelease(next, {
      approved: true,
      actor: 'test',
      releaseNote: 'Second version.',
      today: TODAY,
      now: NOW,
      history: [first],
    });
    assert.equal(result.ok, true);
    assert.ok(result.ok);
    assert.equal(result.release.supersedes, '0.1.0');
    assert.equal(result.superseded.length, 1);
    assert.equal(result.superseded[0].version, '0.1.0');
    assert.equal(result.superseded[0].state, 'superseded');
    assert.equal(result.superseded[0].supersededBy, '0.2.0');
    // The original record object is untouched.
    assert.equal(first.state, 'published');
  });
});

describe('version and state machine', () => {
  test('bumpVersion moves the right component', () => {
    assert.equal(bumpVersion('1.2.3', 'major'), '2.0.0');
    assert.equal(bumpVersion('1.2.3', 'minor'), '1.3.0');
    assert.equal(bumpVersion('1.2.3', 'patch'), '1.2.4');
  });

  test('bumpVersion rejects a non-semantic input', () => {
    assert.throws(() => bumpVersion('1.2', 'patch'));
  });

  test('compareVersions sorts numerically, not lexically', () => {
    const sorted = ['0.9.0', '0.10.0', '0.2.0'].sort(compareVersions);
    assert.deepEqual(sorted, ['0.10.0', '0.9.0', '0.2.0']);
  });

  test('a published release cannot go back to draft', () => {
    assert.equal(canTransition('published', 'draft'), false);
    assert.equal(canTransition('published', 'superseded'), true);
    assert.equal(canTransition('draft', 'approved'), true);
    assert.equal(canTransition('draft', 'published'), false);
  });

  test('draftFromRelease produces a draft at a bumped version', () => {
    const next = draftFromRelease(release(), 'minor', NOW);
    assert.equal(next.state, 'draft');
    assert.equal(next.version, '0.2.0');
    assert.equal(next.visibility, 'private');
  });

  test('rollback restores an archived version and keeps history', () => {
    const v1 = release();
    const v2 = release(makeDraft({ version: '0.2.0' }));
    const published = applyToPublished([], v2);
    const result = rollbackTo(published, [v1, v2], 'test-atlas', '0.1.0', 'test', NOW);
    assert.equal(result.ok, true);
    assert.ok(result.ok);
    assert.equal(result.published.length, 1);
    assert.equal(result.published[0].version, '0.1.0');
    assert.equal(result.restored.state, 'published');
  });

  test('rollback to an unknown version fails', () => {
    const result = rollbackTo([], [], 'test-atlas', '9.9.9', 'test', NOW);
    assert.equal(result.ok, false);
  });

  test('applyToPublished keeps one entry per slug', () => {
    const v1 = release();
    const v2 = release(makeDraft({ version: '0.2.0' }));
    const published = applyToPublished(applyToPublished([], v1), v2);
    assert.equal(published.length, 1);
    assert.equal(published[0].version, '0.2.0');
  });

  test('withdrawFromPublished removes the atlas from the served corpus', () => {
    const published = applyToPublished([], release());
    assert.equal(withdrawFromPublished(published, 'test-atlas').length, 0);
  });
});

describe('public/private separation', () => {
  test('a draft-state release produces no public output at all', () => {
    const draftState: ReleaseRecord = { ...release(), state: 'draft' };
    assert.equal(isPublic(draftState), false);
    assert.deepEqual(buildAllPublicOutput(draftState), {});
    assert.equal(buildClaimsRecord(draftState), null);
    assert.equal(buildSourcesRecord(draftState), null);
    assert.equal(buildContextText(draftState), null);
    assert.equal(buildCatalogEntry(draftState), null);
    assert.deepEqual(buildSitemapEntries(draftState), []);
  });

  test('every non-published state produces no output', () => {
    for (const state of ['draft', 'approved', 'superseded', 'archived'] as const) {
      const record: ReleaseRecord = { ...release(), state };
      assert.deepEqual(buildAllPublicOutput(record), {}, `state "${state}" produced output`);
    }
  });

  test('no private sentinel appears anywhere in published output', () => {
    const output = buildAllPublicOutput(release());
    const combined = Object.values(output).join('\n');
    assert.ok(combined.length > 0, 'expected published output');
    for (const sentinel of PRIVATE_SENTINELS) {
      assert.equal(combined.includes(sentinel), false, `${sentinel} leaked into public output`);
    }
    assert.equal(combined.includes('privateNotes'), false);
    assert.equal(combined.includes('changeLog'), false);
  });

  test('the release record itself carries no private fields', () => {
    const serialized = JSON.stringify(release());
    for (const sentinel of PRIVATE_SENTINELS) {
      assert.equal(serialized.includes(sentinel), false, `${sentinel} was archived into the release`);
    }
  });
});

describe('public output contract', () => {
  test('serializing the same release twice is byte-identical', () => {
    const record = release();
    assert.deepEqual(buildAllPublicOutput(record), buildAllPublicOutput(record));
    assert.equal(
      JSON.stringify(buildAllPublicOutput(record)),
      JSON.stringify(buildAllPublicOutput(record)),
    );
  });

  test('two releases built from identical input serialize identically', () => {
    assert.equal(
      JSON.stringify(buildAllPublicOutput(release())),
      JSON.stringify(buildAllPublicOutput(release())),
    );
  });

  test('every public artifact is valid JSON where it claims to be', () => {
    const output = buildAllPublicOutput(release());
    for (const [routePath, body] of Object.entries(output)) {
      if (routePath.endsWith('.json')) {
        assert.doesNotThrow(() => JSON.parse(body), `${routePath} is not valid JSON`);
      } else {
        assert.ok(body.length > 0, `${routePath} is empty`);
      }
    }
  });

  test('claims.json carries status, limitations, sources, and a canonical URL', () => {
    const record = buildClaimsRecord(release());
    assert.ok(record);
    const claim = record.claims[0];
    assert.equal(claim.id, 'tst-001');
    assert.ok(claim.status);
    assert.ok(claim.limitations.length > 0);
    assert.ok(claim.sourceIds.length > 0);
    assert.equal(claim.canonicalUrl, 'https://research.mahastrategies.com/atlas/test-atlas/claims/tst-001');
    assert.equal(claim.atlasVersion, '0.1.0');
  });

  test('sources.json separates curator annotation from bibliographic fact', () => {
    const record = buildSourcesRecord(release());
    assert.ok(record);
    const source = record.sources[0];
    assert.ok('curatorAnnotation' in source);
    assert.equal(source.curatorAnnotation.sourceType, 'primary-paper');
    // Curator fields must NOT sit at the top level alongside bibliographic ones.
    assert.equal('sourceType' in source, false);
    assert.equal('whyHere' in source, false);
  });

  test('context.txt carries each claim with its status and limitations', () => {
    const text = buildContextText(release());
    assert.ok(text);
    assert.ok(text.includes('tst-001'));
    assert.ok(text.includes('[established; uncontested]'));
    assert.ok(text.includes('Limitations:'));
  });

  test('sitemap entries cover every record and stay under the atlas path', () => {
    const entries = buildSitemapEntries(release());
    const paths = entries.map((e) => e.path);
    assert.ok(paths.includes('/atlas/test-atlas'));
    assert.ok(paths.includes('/atlas/test-atlas/claims/tst-001'));
    assert.ok(paths.includes('/atlas/test-atlas/sources/src-one'));
    assert.ok(paths.includes('/atlas/test-atlas/concepts/fixture-concept'));
    for (const entry of entries) {
      assert.ok(entry.path.startsWith('/atlas/test-atlas'), `${entry.path} escapes the atlas path`);
      assert.match(entry.lastModified, /^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('the catalog entry matches the shape the gateway validates', () => {
    const entry = buildCatalogEntry(release());
    assert.ok(entry);
    assert.match(entry.id, /^[a-z0-9-]+$/);
    assert.ok(entry.canonicalPath.startsWith('/atlas/'));
    assert.match(entry.version, /^\d+\.\d+\.\d+$/);
    assert.match(entry.lastReviewed, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(entry.exclusions.length > 0);
    assert.ok(entry.intendedReader.length > 0);
    assert.ok(entry.counts.claims > 0 && entry.counts.concepts > 0 && entry.counts.sources > 0);
    for (const endpoint of entry.endpoints) {
      assert.ok(endpoint.path.startsWith(entry.canonicalPath));
      assert.ok(endpoint.format.includes('/'));
    }
    for (const page of entry.pages) {
      assert.ok(page.path.startsWith(`${entry.canonicalPath}/`));
    }
  });
});

describe('the published corpus is empty until a release is approved', () => {
  test('published.json currently holds no releases', () => {
    assert.deepEqual(PUBLISHED_RELEASES, []);
    assert.deepEqual(PUBLISHED_SLUGS, []);
  });

  test('the committed published.json parses and is an array', () => {
    const raw = readFileSync(path.join(REPO_ROOT, 'content/atlas-releases/published.json'), 'utf8');
    const parsed = JSON.parse(raw);
    assert.ok(Array.isArray(parsed));
  });
});

describe('portable import/export', () => {
  test('a public export carries no private material', () => {
    const envelope = exportAtlas(makeDraft(), { now: NOW });
    assert.equal(envelope.contains, 'public-records-only');
    const serialized = JSON.stringify(envelope);
    for (const sentinel of PRIVATE_SENTINELS) {
      assert.equal(serialized.includes(sentinel), false, `${sentinel} leaked into a public export`);
    }
  });

  test('a private export declares itself and carries the notes', () => {
    const envelope = exportAtlas(makeDraft(), { includePrivate: true, now: NOW });
    assert.equal(envelope.contains, 'includes-private-notes');
    assert.ok(JSON.stringify(envelope).includes('PRIVATE-ATLAS-NOTE-SENTINEL'));
  });

  test('export and re-import round-trips the public records', () => {
    const envelope = exportAtlas(makeDraft(), { now: NOW });
    const result = importAtlas(envelope, { now: NOW, actor: 'test' });
    assert.equal(result.ok, true, !result.ok ? result.errors.join('; ') : '');
    assert.ok(result.ok);
    assert.equal(result.draft.slug, 'test-atlas');
    assert.equal(result.draft.claims.length, 1);
    assert.equal(result.draft.sources.length, 1);
  });

  test('an imported file is always a draft, whatever it claims', () => {
    const envelope = exportAtlas(makeDraft(), { now: NOW });
    const hostile = {
      ...envelope,
      atlas: { ...envelope.atlas, state: 'published', visibility: 'public' },
    };
    const result = importAtlas(hostile, { now: NOW });
    assert.ok(result.ok);
    assert.equal(result.draft.state, 'draft');
    assert.equal(result.draft.visibility, 'private');
  });

  test('a file of the wrong format is refused', () => {
    const result = importAtlas({ format: 'something-else', formatVersion: '1.0.0' });
    assert.equal(result.ok, false);
  });

  test('an incompatible major format version is refused', () => {
    const envelope = exportAtlas(makeDraft(), { now: NOW });
    const result = importAtlas({ ...envelope, formatVersion: '2.0.0' });
    assert.equal(result.ok, false);
  });

  test('a file not declared public is imported with a warning', () => {
    const envelope = exportAtlas(makeDraft(), { now: NOW });
    const undeclared = { ...envelope, contains: undefined };
    const result = importAtlas(undeclared, { now: NOW });
    assert.ok(result.ok);
    assert.ok(result.warnings.some((w) => w.includes('private material')));
  });

  test('malformed records are reported per field, not as one failure', () => {
    const envelope = exportAtlas(makeDraft(), { now: NOW });
    const broken = {
      ...envelope,
      atlas: { ...envelope.atlas, version: 'not-a-version', lastReviewed: 'nope' },
    };
    const result = importAtlas(broken, { now: NOW });
    assert.equal(result.ok, false);
    assert.ok(!result.ok && result.errors.length >= 2);
  });
});

describe('the shipped example file', () => {
  const raw = readFileSync(path.join(REPO_ROOT, 'docs/atlas-builder-example.json'), 'utf8');

  test('parses as JSON', () => {
    assert.doesNotThrow(() => JSON.parse(raw));
  });

  test('is a public-records-only portable file', () => {
    const parsed = JSON.parse(raw);
    assert.equal(parsed.format, PORTABLE_FORMAT);
    assert.equal(parsed.contains, 'public-records-only');
  });

  test('imports cleanly and passes the full validation gate', () => {
    const result = importAtlas(JSON.parse(raw), { now: NOW, actor: 'test' });
    assert.equal(result.ok, true, !result.ok ? result.errors.join('; ') : '');
    assert.ok(result.ok);
    const validation = validateAtlas(result.draft, { today: TODAY });
    assert.equal(
      validation.ok,
      true,
      validation.errors.map((e) => `${e.code}: ${e.message}`).join('; '),
    );
  });

  test('every source URL is well-formed and absolute', () => {
    const parsed = JSON.parse(raw);
    for (const source of parsed.atlas.sources) {
      assert.doesNotThrow(() => new URL(source.url), `${source.id} has a malformed URL`);
      assert.match(source.url, /^https:\/\//);
    }
  });

  test('does not use a reserved slug', () => {
    const parsed = JSON.parse(raw);
    assert.equal(RESERVED_ATLAS_SLUGS.includes(parsed.atlas.slug), false);
  });
});

describe('change log', () => {
  test('appending records an entry and moves updatedAt', () => {
    const draft = makeDraft();
    const later = '2026-07-28T12:00:00.000Z';
    const updated = appendChange(draft, {
      actor: 'operator',
      action: 'updated',
      target: 'claim:tst-001',
      summary: 'Reworded the limitations.',
    }, later);
    assert.equal(updated.changeLog.length, draft.changeLog.length + 1);
    assert.equal(updated.updatedAt, later);
    assert.equal(updated.changeLog.at(-1)?.summary, 'Reworded the limitations.');
  });

  test('appending does not mutate the original draft', () => {
    const draft = makeDraft();
    const before = draft.changeLog.length;
    appendChange(
      draft,
      { actor: 'operator', action: 'updated', target: 'claim:tst-001', summary: 'An edit.' },
      NOW,
    );
    assert.equal(draft.changeLog.length, before);
  });
});
