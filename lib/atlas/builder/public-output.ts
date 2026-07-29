// The public output contract for builder-made atlases.
//
// Everything a released atlas exposes to the world is derived here: the JSON
// endpoints, the plain-text context, the JSON-LD, the canonical URLs, the
// sitemap entries, and the catalog entry the gateway reads. One module, so the
// page and the endpoints cannot disagree about what the atlas contains — the
// same reason lib/atlas/context-pack.ts derives every pack surface in one place.
//
// The output shapes deliberately mirror the hand-authored atlases (compare
// app/atlas/quantum-computing/*.json/route.ts). A client that can already read
// /atlas/quantum-computing/claims.json can read a builder atlas's claims.json
// without special-casing it, and the aggregate indexes at /atlas/claims.json can
// include both without a second code path.
//
// TWO PROPERTIES THIS MODULE MUST HOLD:
//
//  1. DETERMINISM. Same release in, byte-identical JSON out. No `new Date()`,
//     no `Math.random()`, no iteration over unordered structures, no
//     environment reads. Dates come from the record. This is what makes a
//     published release verifiable: a reader can re-derive the JSON from the
//     archived record and compare.
//
//  2. NOTHING PRIVATE ESCAPES. Every function here reads `ReleaseRecord.atlas`,
//     which is typed as PublicAtlas and was parsed through publicAtlasSchema at
//     release time. Private fields were dropped there, structurally. Do not add
//     a parameter to these functions that accepts a DraftAtlas.

// Values come from vocabulary.ts and types from schema.ts via `import type`,
// which erases at compile time. That combination is what keeps Zod out of the
// client bundle — see the header of vocabulary.ts for why that matters here.
import { SITE_URL } from '../../entity.ts';
import {
  CLAIM_STATUS_DEFINITIONS,
  PUBLIC_STATE,
  VERIFICATION_DEFINITIONS,
} from './vocabulary.ts';
import type { PublicAtlas, ReleaseRecord } from './schema.ts';

/** Base path for all atlases, hand-authored and built alike. */
export const ATLAS_BASE_PATH = '/atlas';

export const atlasPath = (slug: string) => `${ATLAS_BASE_PATH}/${slug}`;
export const atlasUrl = (slug: string, siteUrl: string = SITE_URL) => `${siteUrl}${atlasPath(slug)}`;

/**
 * Guard for every public surface.
 *
 * A release that is not `published` produces nothing at all — not an empty
 * object, not a stub. Callers must handle `null`, which means a draft cannot be
 * rendered by forgetting to check a flag.
 */
function publicOnly(release: ReleaseRecord): PublicAtlas | null {
  return release.state === PUBLIC_STATE ? release.atlas : null;
}

/** True when this release may appear in any public output. */
export function isPublic(release: ReleaseRecord): boolean {
  return release.state === PUBLIC_STATE;
}

/** The endpoints a builder atlas serves. Mirrors AtlasCatalogEntry.endpoints. */
export function buildEndpoints(slug: string) {
  const base = atlasPath(slug);
  return [
    { label: 'Metadata', path: `${base}/metadata.json`, format: 'application/json' },
    { label: 'Claim ledger', path: `${base}/claims.json`, format: 'application/json' },
    { label: 'Concept records', path: `${base}/concepts.json`, format: 'application/json' },
    { label: 'Source trail', path: `${base}/sources.json`, format: 'application/json' },
    { label: 'Context pack', path: `${base}/context-pack.json`, format: 'application/json' },
    { label: 'Plain-text context', path: `${base}/context.txt`, format: 'text/plain' },
  ];
}

/** The human entry points a builder atlas serves. Every one is really built. */
export function buildPages(slug: string) {
  const base = atlasPath(slug);
  return [
    { label: 'Claims', path: `${base}/claims` },
    { label: 'Concepts', path: `${base}/concepts` },
    { label: 'Sources', path: `${base}/sources` },
    { label: 'Methodology', path: `${base}/methodology` },
  ];
}

// ---------------------------------------------------------------------------
// metadata.json
// ---------------------------------------------------------------------------

export function buildMetadataRecord(release: ReleaseRecord, siteUrl: string = SITE_URL) {
  const atlas = publicOnly(release);
  if (!atlas) return null;
  const base = atlasUrl(atlas.slug, siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: atlas.title,
    description: atlas.description,
    url: base,
    canonicalUrl: base,
    version: release.version,
    datePublished: release.releasedAt.slice(0, 10),
    dateModified: release.releasedAt.slice(0, 10),
    lastReviewed: atlas.lastReviewed,
    evidenceCutoff: atlas.evidenceCutoff ?? null,
    license: atlas.license,
    creativeWorkStatus: 'Non-peer-reviewed educational research map',
    isAccessibleForFree: true,
    endpoints: Object.fromEntries(
      buildEndpoints(atlas.slug).map((endpoint) => [
        endpoint.label.toLowerCase().replace(/\s+/g, '-'),
        `${siteUrl}${endpoint.path}`,
      ]),
    ),
    statusVocabulary: Object.entries(CLAIM_STATUS_DEFINITIONS).map(([id, definition]) => ({
      id,
      definition,
    })),
    verificationVocabulary: Object.entries(VERIFICATION_DEFINITIONS).map(([id, definition]) => ({
      id,
      definition,
    })),
    counts: {
      claims: atlas.claims.length,
      concepts: atlas.concepts.length,
      sources: atlas.sources.length,
    },
    scope: atlas.scope,
    intendedReader: atlas.intendedReader,
    editorialBoundary: atlas.editorialBoundary,
    exclusions: atlas.exclusions,
    updatePolicy: atlas.updatePolicy,
    provenanceStandard: `${siteUrl}/standards/maha-provenance-standard`,
  };
}

// ---------------------------------------------------------------------------
// claims.json
// ---------------------------------------------------------------------------

export function buildClaimsRecord(release: ReleaseRecord, siteUrl: string = SITE_URL) {
  const atlas = publicOnly(release);
  if (!atlas) return null;
  const base = atlasUrl(atlas.slug, siteUrl);

  return {
    atlas: {
      title: atlas.title,
      canonicalUrl: base,
      version: release.version,
      evidenceCutoff: atlas.evidenceCutoff ?? null,
      lastReviewed: atlas.lastReviewed,
      methodology: `${base}/methodology`,
    },
    // Restated per endpoint so a client holding only claims.json still has the
    // boundary. Clause C3: exclusions are content, not a footer.
    boundary: atlas.editorialBoundary,
    exclusions: atlas.exclusions,
    statusVocabulary: Object.entries(CLAIM_STATUS_DEFINITIONS).map(([id, definition]) => ({
      id,
      definition,
    })),
    count: atlas.claims.length,
    claims: atlas.claims.map((claim) => ({
      id: claim.id,
      slug: claim.slug,
      claim: claim.claim,
      explanation: claim.explanation,
      status: claim.status,
      statusDefinition: CLAIM_STATUS_DEFINITIONS[claim.status],
      confidence: claim.confidence,
      controversy: claim.controversy,
      limitations: claim.limitations,
      exclusions: claim.exclusions,
      conceptIds: claim.conceptIds,
      sourceIds: claim.sourceIds,
      qualifyingSourceIds: claim.qualifyingSourceIds,
      reviewDate: claim.reviewDate,
      atlasVersion: release.version,
      canonicalUrl: `${base}/claims/${claim.id}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// concepts.json
// ---------------------------------------------------------------------------

export function buildConceptsRecord(release: ReleaseRecord, siteUrl: string = SITE_URL) {
  const atlas = publicOnly(release);
  if (!atlas) return null;
  const base = atlasUrl(atlas.slug, siteUrl);

  return {
    atlas: { title: atlas.title, canonicalUrl: base, version: release.version },
    note: 'Concept records orient a reader in the vocabulary a claim uses. They explain; they do not assert.',
    count: atlas.concepts.length,
    concepts: atlas.concepts.map((concept) => ({
      id: concept.id,
      label: concept.label,
      definition: concept.definition,
      scopeNote: concept.scopeNote ?? null,
      sourceIds: concept.sourceIds,
      related: concept.related,
      canonicalUrl: `${base}/concepts/${concept.id}`,
      citedByClaims: atlas.claims
        .filter((claim) => claim.conceptIds.includes(concept.id))
        .map((claim) => claim.id),
    })),
  };
}

// ---------------------------------------------------------------------------
// sources.json
// ---------------------------------------------------------------------------

export function buildSourcesRecord(release: ReleaseRecord, siteUrl: string = SITE_URL) {
  const atlas = publicOnly(release);
  if (!atlas) return null;
  const base = atlasUrl(atlas.slug, siteUrl);

  return {
    atlas: {
      title: atlas.title,
      canonicalUrl: base,
      version: release.version,
      claimsEndpoint: `${base}/claims.json`,
    },
    provenance:
      'Verification states what was checked, never whether the work is correct. Bibliographic fields come from the source; sourceType and whyHere are curator annotation and are labelled as such.',
    verificationVocabulary: Object.entries(VERIFICATION_DEFINITIONS).map(([id, definition]) => ({
      id,
      definition,
    })),
    count: atlas.sources.length,
    sources: atlas.sources.map((source) => ({
      id: source.id,
      // --- from the source itself ---
      title: source.title,
      authors: source.authors,
      year: source.year,
      yearBasis: source.yearBasis,
      publisher: source.publisher ?? null,
      identifier: source.identifier ?? null,
      url: source.url ?? null,
      // --- curator annotation, labelled ---
      curatorAnnotation: {
        sourceType: source.sourceType,
        whyHere: source.whyHere,
        limitations: source.limitations ?? null,
      },
      verification: source.verification,
      verificationDefinition: VERIFICATION_DEFINITIONS[source.verification],
      verifiedOn: source.verifiedOn,
      canonicalUrl: `${base}/sources/${source.id}`,
      citedByClaims: atlas.claims
        .filter((claim) => claim.sourceIds.includes(source.id))
        .map((claim) => claim.id),
      qualifiesClaims: atlas.claims
        .filter((claim) => claim.qualifyingSourceIds.includes(source.id))
        .map((claim) => claim.id),
      citedByConcepts: atlas.concepts
        .filter((concept) => concept.sourceIds.includes(source.id))
        .map((concept) => concept.id),
    })),
  };
}

// ---------------------------------------------------------------------------
// context-pack.json
// ---------------------------------------------------------------------------

export function buildContextPackRecord(release: ReleaseRecord, siteUrl: string = SITE_URL) {
  const atlas = publicOnly(release);
  if (!atlas) return null;
  const base = atlasUrl(atlas.slug, siteUrl);

  return {
    id: `${atlas.slug}-context-pack`,
    title: `${atlas.title} — Context Pack`,
    description: atlas.description,
    version: release.version,
    releasedAt: release.releasedAt,
    canonicalUrl: base,
    license: atlas.license,
    scope: atlas.scope,
    intendedReader: atlas.intendedReader,
    boundary: atlas.editorialBoundary,
    exclusions: atlas.exclusions,
    methodology: atlas.methodology,
    updatePolicy: atlas.updatePolicy,
    endpoints: buildEndpoints(atlas.slug).map((endpoint) => ({
      label: endpoint.label,
      url: `${siteUrl}${endpoint.path}`,
      format: endpoint.format,
    })),
    counts: {
      claims: atlas.claims.length,
      concepts: atlas.concepts.length,
      sources: atlas.sources.length,
    },
    // Clause M2: a downloaded copy leaves the site's framing behind, so the
    // constraints on reuse have to be inside the file.
    aiUseInstructions: [
      'Carry each claim’s status label and limitations statement with the claim. Both are part of the claim, not commentary on it.',
      'Do not present a claim labelled conjecture or speculative as an established result.',
      'Cite the claim identifier and the atlas version, and prefer directing a reader to the primary source over this pack.',
      'Do not treat this pack as an authority. It is a navigation layer over a non-peer-reviewed literature map and confers no standing on any answer.',
      'If asked something this pack does not cover, say so rather than extrapolating from it.',
      `This pack is a static snapshot. The endpoints under ${base} are authoritative; a downloaded copy is not.`,
    ],
    integrityNotes: [
      'Claim identifiers are stable and are never reassigned to a different claim.',
      'Every claim carries the date it was last reviewed and the atlas version it belongs to. Compare those against the live endpoints to detect drift in a copy you are holding.',
      'This atlas is self-published and not peer reviewed.',
    ],
    provenanceStandard: `${siteUrl}/standards/maha-provenance-standard`,
  };
}

// ---------------------------------------------------------------------------
// context.txt
// ---------------------------------------------------------------------------

/** Plain-text context document. Line-for-line deterministic. */
export function buildContextText(release: ReleaseRecord, siteUrl: string = SITE_URL): string | null {
  const atlas = publicOnly(release);
  if (!atlas) return null;
  const base = atlasUrl(atlas.slug, siteUrl);

  return [
    `# ${atlas.title}`,
    '',
    atlas.description,
    '',
    `Version: ${release.version}`,
    `Last reviewed: ${atlas.lastReviewed}`,
    ...(atlas.evidenceCutoff ? [`Evidence cutoff: ${atlas.evidenceCutoff}`] : []),
    `Canonical URL: ${base}`,
    `Claims JSON: ${base}/claims.json`,
    `Concepts JSON: ${base}/concepts.json`,
    `Sources JSON: ${base}/sources.json`,
    `License: ${atlas.license}`,
    '',
    '## Intended reader',
    atlas.intendedReader,
    '',
    '## Boundary',
    atlas.editorialBoundary,
    '',
    '## This atlas does not',
    ...atlas.exclusions.map((line) => `- ${line}`),
    '',
    '## Claims',
    ...atlas.claims.flatMap((claim) => [
      `- ${claim.id} [${claim.status}; ${claim.controversy}]: ${claim.claim}`,
      `  Limitations: ${claim.limitations}`,
      `  Sources: ${claim.sourceIds.join(', ')}`,
    ]),
    '',
    '## Concepts',
    ...atlas.concepts.map((concept) => `- ${concept.id}: ${concept.label} — ${concept.definition}`),
    '',
    '## Sources',
    ...atlas.sources.map(
      (source) =>
        `- [${source.verification}] ${source.title} (${source.year ?? 'n.d.'}) — ${source.url ?? source.identifier ?? 'no locator'}`,
    ),
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export function buildJsonLd(release: ReleaseRecord, siteUrl: string = SITE_URL) {
  const atlas = publicOnly(release);
  if (!atlas) return null;
  const base = atlasUrl(atlas.slug, siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${base}#atlas`,
    name: atlas.title,
    description: atlas.description,
    url: base,
    version: release.version,
    datePublished: release.releasedAt.slice(0, 10),
    dateModified: release.releasedAt.slice(0, 10),
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creativeWorkStatus: 'Non-peer-reviewed educational research map',
    isAccessibleForFree: true,
    publisher: { '@id': `${siteUrl}/#organization` },
    audience: { '@type': 'Audience', audienceType: atlas.intendedReader },
    about: atlas.concepts.map((concept) => ({ '@type': 'DefinedTerm', name: concept.label })),
  };
}

// ---------------------------------------------------------------------------
// Catalog entry + sitemap
// ---------------------------------------------------------------------------

/**
 * The gateway catalog entry.
 *
 * Field-for-field compatible with AtlasCatalogEntry in lib/atlas/catalog.ts, so
 * a released atlas appears in /atlas/manifest.json and on the gateway page
 * through the existing code path rather than a parallel one.
 */
export function buildCatalogEntry(release: ReleaseRecord) {
  const atlas = publicOnly(release);
  if (!atlas) return null;

  return {
    id: atlas.slug,
    title: atlas.title,
    shortTitle: atlas.shortTitle,
    canonicalPath: atlasPath(atlas.slug),
    description: atlas.description,
    scope: atlas.scope,
    exclusions: atlas.exclusions,
    status: atlas.statusBadge,
    version: release.version,
    lastReviewed: atlas.lastReviewed,
    evidenceCutoff: atlas.evidenceCutoff,
    counts: {
      claims: atlas.claims.length,
      concepts: atlas.concepts.length,
      sources: atlas.sources.length,
    },
    endpoints: buildEndpoints(atlas.slug),
    expansionCandidates: [
      'Add a claim only after source resolution, status assignment, limitation writing, and review.',
    ],
    intendedReader: atlas.intendedReader,
    pages: buildPages(atlas.slug),
  };
}

export type SitemapEntry = { path: string; lastModified: string };

/**
 * Every public URL this release owns.
 *
 * Derived from the records rather than written out, so a sitemap URL cannot
 * drift from the route that serves it — the same rule app/sitemap.ts follows
 * for the library and the hand-authored atlases.
 */
export function buildSitemapEntries(release: ReleaseRecord): SitemapEntry[] {
  const atlas = publicOnly(release);
  if (!atlas) return [];
  const base = atlasPath(atlas.slug);
  const released = release.releasedAt.slice(0, 10);

  return [
    { path: base, lastModified: released },
    { path: `${base}/claims`, lastModified: released },
    { path: `${base}/concepts`, lastModified: released },
    { path: `${base}/sources`, lastModified: released },
    { path: `${base}/methodology`, lastModified: released },
    ...atlas.claims.map((claim) => ({
      path: `${base}/claims/${claim.id}`,
      lastModified: claim.reviewDate,
    })),
    ...atlas.concepts.map((concept) => ({
      path: `${base}/concepts/${concept.id}`,
      lastModified: atlas.lastReviewed,
    })),
    ...atlas.sources.map((source) => ({
      path: `${base}/sources/${source.id}`,
      lastModified: source.verifiedOn,
    })),
  ];
}

/**
 * Every public artifact for a release, as a path → serialized body map.
 *
 * Used by the review stage to preview exactly what publishing would expose, and
 * by the leak test to assert that a non-published release produces an empty map.
 */
export function buildAllPublicOutput(
  release: ReleaseRecord,
  siteUrl: string = SITE_URL,
): Record<string, string> {
  if (!isPublic(release)) return {};
  const base = atlasPath(release.slug);
  const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

  return {
    [`${base}/metadata.json`]: json(buildMetadataRecord(release, siteUrl)),
    [`${base}/claims.json`]: json(buildClaimsRecord(release, siteUrl)),
    [`${base}/concepts.json`]: json(buildConceptsRecord(release, siteUrl)),
    [`${base}/sources.json`]: json(buildSourcesRecord(release, siteUrl)),
    [`${base}/context-pack.json`]: json(buildContextPackRecord(release, siteUrl)),
    [`${base}/context.txt`]: buildContextText(release, siteUrl) ?? '',
  };
}
