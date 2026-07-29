// The published corpus, as the public site sees it.
//
// This is the ONLY builder module the public serving path imports. It reads
// content/atlas-releases/published.json through a static JSON import, so:
//
//   - there is no filesystem access on a public route, which keeps builder
//     atlases servable from a static build the same way the hand-authored ones
//     are;
//   - the published set is fixed at build time, so a request can never observe
//     a half-written release;
//   - nothing here can reach the private workspace. store.ts, which can, is not
//     imported from any public route.
//
// It also imports no Zod. See the header of vocabulary.ts: lib/atlas/catalog.ts
// is transitively imported by a client component, and this module is imported
// by catalog.ts. Records are shape-checked by assertPublishable() below rather
// than parsed, and the full schema validation happens where it belongs — at
// release time in the builder, and in the test suite against the committed file.

import publishedJson from '../../../content/atlas-releases/published.json' with { type: 'json' };

import type { ReleaseRecord } from './schema.ts';
import { PUBLIC_STATE } from './vocabulary.ts';

/**
 * Fail the build on a malformed published record.
 *
 * Deliberately a hard throw at module scope, matching the existing behaviour of
 * lib/atlas/catalog.ts:194 — an invalid catalog takes down the build rather
 * than shipping a broken atlas. Here the stakes are the same: a released record
 * missing its slug or state would produce pages at unpredictable URLs.
 *
 * The checks are structural only. Deep validation of a release happens in the
 * builder before it is ever written, and again in the test suite.
 */
function assertPublishable(record: unknown, index: number): ReleaseRecord {
  const candidate = record as Partial<ReleaseRecord>;
  const where = `content/atlas-releases/published.json[${index}]`;

  if (!candidate || typeof candidate !== 'object') {
    throw new Error(`${where}: not an object.`);
  }
  if (typeof candidate.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.slug)) {
    throw new Error(`${where}: missing or malformed slug.`);
  }
  if (typeof candidate.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(candidate.version)) {
    throw new Error(`${where}: missing or malformed semantic version.`);
  }
  if (candidate.state !== PUBLIC_STATE) {
    // The published file is the served corpus. A draft, approved, superseded, or
    // archived record appearing here means something bypassed publish(), and
    // serving it would put unreleased material at a public URL.
    throw new Error(
      `${where}: state is "${candidate.state}", but only "${PUBLIC_STATE}" records may appear in the published corpus.`,
    );
  }
  if (!candidate.atlas || typeof candidate.atlas !== 'object') {
    throw new Error(`${where}: missing atlas record.`);
  }
  if (candidate.atlas.slug !== candidate.slug) {
    throw new Error(`${where}: atlas slug "${candidate.atlas.slug}" does not match release slug "${candidate.slug}".`);
  }

  return candidate as ReleaseRecord;
}

/**
 * Every currently-published builder atlas.
 *
 * Empty until a release is explicitly approved and published. Every public
 * integration — the catalog, the aggregate indexes, the sitemap, the dynamic
 * route tree — is additive over this array, so while it is empty the public
 * build is identical to one without the builder installed.
 */
export const PUBLISHED_RELEASES: ReleaseRecord[] = (publishedJson as unknown[]).map(assertPublishable);

/** Slugs with a published release. Feeds generateStaticParams. */
export const PUBLISHED_SLUGS: string[] = PUBLISHED_RELEASES.map((release) => release.slug).sort();

export function getPublishedRelease(slug: string): ReleaseRecord | undefined {
  return PUBLISHED_RELEASES.find((release) => release.slug === slug);
}

export function getPublishedClaim(slug: string, claimId: string) {
  return getPublishedRelease(slug)?.atlas.claims.find((claim) => claim.id === claimId);
}

export function getPublishedConcept(slug: string, conceptId: string) {
  return getPublishedRelease(slug)?.atlas.concepts.find((concept) => concept.id === conceptId);
}

export function getPublishedSource(slug: string, sourceId: string) {
  return getPublishedRelease(slug)?.atlas.sources.find((source) => source.id === sourceId);
}
