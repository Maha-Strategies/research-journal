// Cross-atlas discovery indexes for the Research Atlas Gateway.
//
// WHAT THESE ARE: indexes that let a crawler or an AI client find every public
// claim, concept, and source across all atlases in one request, and then follow
// a canonical URL to the record that actually owns it.
//
// WHAT THESE ARE NOT: a second copy of the corpus. Each atlas already publishes
// canonical metadata.json / claims.json / sources.json beneath its own path, and
// those remain the authority. An index entry therefore carries the identifying
// fields — id, status, the claim or label text — plus the canonical URLs, and
// deliberately omits the body (explanation, limitations, source lists,
// verification notes). Anything a consumer needs beyond identification is one
// documented hop away.
//
// This matters beyond tidiness: a duplicated corpus drifts. Two copies of a
// claim's limitations, updated at different times, is precisely how a caveat
// gets lost — the failure the provenance standard exists to prevent.
//
// NORMALISATION HAZARD: the hand-authored atlases do not share a record shape.
//   - de Sitter claims are addressed by `ref` ("ds-001"); SI, QC and TN use `id`.
//   - de Sitter sources carry `label`; SI, QC and TN carry `title`.
//   - Quantum Computing sources have no `verification` field at all.
//   - Tensor Network sources carry `verification: 'identifier-verified'`, which
//     is a WEAKER assertion than SI's content verification — it says the
//     identifier resolves to the named paper, not that the text was re-read.
//     The value is surfaced verbatim rather than mapped onto SI's vocabulary,
//     because collapsing the two would silently upgrade the weaker claim.
// The adapters below are written per atlas for that reason. A generic mapper
// would have silently produced wrong URLs for de Sitter claims.

import {
  ATLAS_CLAIMS,
  ATLAS_META,
  ATLAS_NODES,
  ATLAS_PATH,
  getSourceCards,
} from '@/lib/atlas/de-sitter';
import {
  SI_PUBLIC_CLAIMS,
  SI_PUBLIC_CONCEPTS,
  SI_PUBLIC_META,
  SI_PUBLIC_SOURCES,
} from '@/lib/atlas/synthetic-intelligence';
import {
  QC_ATLAS_PATH,
  QC_CLAIMS,
  QC_CONCEPTS,
  QC_META,
  QC_SOURCES,
} from '@/lib/atlas/quantum-computing';
import {
  TN_ATLAS_PATH,
  TN_CLAIMS,
  TN_CONCEPTS,
  TN_META,
  TN_SOURCES,
} from '@/lib/atlas/tensor-networks';
import { ATLAS_CATALOG, ATLAS_CATALOG_PATH } from '@/lib/atlas/catalog';
import { PUBLISHED_RELEASES } from '@/lib/atlas/builder/releases';

const SI_PATH = '/atlas/synthetic-intelligence';

/**
 * Builder-published atlases.
 *
 * These DO share a record shape — the builder's schema is uniform — so unlike
 * the three hand-authored adapters above, one mapper covers all of them safely.
 * The hazard the header warns about does not apply here precisely because these
 * records were produced by a single schema rather than authored by hand.
 *
 * Empty until a release is approved, so every index below is unchanged today.
 */
const releasedAtlases = () =>
  PUBLISHED_RELEASES.map((release) => ({
    release,
    path: `/atlas/${release.slug}`,
  }));

/** Shared preamble so every endpoint states its own status in-band. */
export function indexEnvelope(siteUrl: string, kind: string, canonicalPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    name: `Maha Research Atlas — aggregated ${kind} index`,
    url: `${siteUrl}${canonicalPath}`,
    isPartOf: `${siteUrl}${ATLAS_CATALOG_PATH}`,
    role: 'discovery-index',
    note:
      `A cross-atlas discovery index of ${kind} records. Identifying fields and canonical URLs only — ` +
      'this is not the record of authority. Follow canonicalUrl for the full record, or the owning ' +
      "atlas's own JSON endpoint listed in atlases[].endpoints of /atlas/manifest.json.",
    boundary:
      'The atlases are source-linked research maps. They are not consensus statements, forecasts, ' +
      'investment advice, or operational guidance. Record status labels and limitations are part of ' +
      'the record and must not be dropped when reused.',
    license: 'https://creativecommons.org/licenses/by/4.0/',
  };
}

export type ClaimIndexEntry = {
  atlasId: string;
  atlasUrl: string;
  id: string;
  status: string;
  claim: string;
  reviewDate: string;
  canonicalUrl: string;
  atlasClaimsEndpoint: string;
};

export function buildClaimIndex(siteUrl: string): ClaimIndexEntry[] {
  return [
    // de Sitter: URL is keyed on `ref`, not `id`.
    ...ATLAS_CLAIMS.map((claim) => ({
      atlasId: 'de-sitter-swampland',
      atlasUrl: `${siteUrl}${ATLAS_PATH}`,
      id: claim.ref,
      status: claim.status,
      claim: claim.claim,
      reviewDate: claim.reviewDate,
      canonicalUrl: `${siteUrl}${ATLAS_PATH}/claims/${claim.ref}`,
      atlasClaimsEndpoint: `${siteUrl}${ATLAS_PATH}/claims.json`,
    })),
    ...QC_CLAIMS.map((claim) => ({
      atlasId: 'quantum-computing',
      atlasUrl: `${siteUrl}${QC_ATLAS_PATH}`,
      id: claim.id,
      status: claim.status,
      claim: claim.claim,
      reviewDate: claim.reviewDate,
      canonicalUrl: `${siteUrl}${QC_ATLAS_PATH}/claims/${claim.id}`,
      atlasClaimsEndpoint: `${siteUrl}${QC_ATLAS_PATH}/claims.json`,
    })),
    ...TN_CLAIMS.map((claim) => ({
      atlasId: 'tensor-networks',
      atlasUrl: `${siteUrl}${TN_ATLAS_PATH}`,
      id: claim.id,
      status: claim.status,
      claim: claim.claim,
      reviewDate: claim.reviewDate,
      canonicalUrl: `${siteUrl}${TN_ATLAS_PATH}/claims/${claim.id}`,
      atlasClaimsEndpoint: `${siteUrl}${TN_ATLAS_PATH}/claims.json`,
    })),
    ...SI_PUBLIC_CLAIMS.map((claim) => ({
      atlasId: 'synthetic-intelligence',
      atlasUrl: `${siteUrl}${SI_PATH}`,
      id: claim.id,
      status: claim.status,
      claim: claim.claim,
      reviewDate: claim.reviewDate,
      canonicalUrl: `${siteUrl}${SI_PATH}/claims/${claim.id}`,
      atlasClaimsEndpoint: `${siteUrl}${SI_PATH}/claims.json`,
    })),
    ...releasedAtlases().flatMap(({ release, path }) =>
      release.atlas.claims.map((claim) => ({
        atlasId: release.slug,
        atlasUrl: `${siteUrl}${path}`,
        id: claim.id,
        status: claim.status,
        claim: claim.claim,
        reviewDate: claim.reviewDate,
        canonicalUrl: `${siteUrl}${path}/claims/${claim.id}`,
        atlasClaimsEndpoint: `${siteUrl}${path}/claims.json`,
      })),
    ),
  ];
}

export type ConceptIndexEntry = {
  atlasId: string;
  atlasUrl: string;
  id: string;
  label: string;
  canonicalUrl: string;
};

export function buildConceptIndex(siteUrl: string): ConceptIndexEntry[] {
  return [
    ...ATLAS_NODES.map((node) => ({
      atlasId: 'de-sitter-swampland',
      atlasUrl: `${siteUrl}${ATLAS_PATH}`,
      id: node.id,
      label: node.label,
      canonicalUrl: `${siteUrl}${ATLAS_PATH}/concepts/${node.id}`,
    })),
    ...QC_CONCEPTS.map((concept) => ({
      atlasId: 'quantum-computing',
      atlasUrl: `${siteUrl}${QC_ATLAS_PATH}`,
      id: concept.id,
      label: concept.label,
      canonicalUrl: `${siteUrl}${QC_ATLAS_PATH}/concepts/${concept.id}`,
    })),
    ...TN_CONCEPTS.map((concept) => ({
      atlasId: 'tensor-networks',
      atlasUrl: `${siteUrl}${TN_ATLAS_PATH}`,
      id: concept.id,
      label: concept.label,
      canonicalUrl: `${siteUrl}${TN_ATLAS_PATH}/concepts/${concept.id}`,
    })),
    ...SI_PUBLIC_CONCEPTS.map((concept) => ({
      atlasId: 'synthetic-intelligence',
      atlasUrl: `${siteUrl}${SI_PATH}`,
      id: concept.id,
      label: concept.label,
      canonicalUrl: `${siteUrl}${SI_PATH}/concepts/${concept.id}`,
    })),
    ...releasedAtlases().flatMap(({ release, path }) =>
      release.atlas.concepts.map((concept) => ({
        atlasId: release.slug,
        atlasUrl: `${siteUrl}${path}`,
        id: concept.id,
        label: concept.label,
        canonicalUrl: `${siteUrl}${path}/concepts/${concept.id}`,
      })),
    ),
  ];
}

export type SourceIndexEntry = {
  atlasId: string;
  atlasUrl: string;
  id: string;
  /** de Sitter records call this `label`; SI and QC call it `title`. */
  title: string;
  year?: number | string;
  identifier?: string;
  /** The source's own external destination, where the atlas records one. */
  externalUrl?: string;
  /** Absent for Quantum Computing sources, which do not carry this field. */
  verification?: string;
  canonicalUrl: string;
  atlasSourcesEndpoint: string;
};

export function buildSourceIndex(siteUrl: string): SourceIndexEntry[] {
  return [
    ...getSourceCards().map((source) => ({
      atlasId: 'de-sitter-swampland',
      atlasUrl: `${siteUrl}${ATLAS_PATH}`,
      id: source.id,
      title: source.label,
      year: source.year,
      identifier: source.identifier,
      externalUrl: source.url,
      verification: source.verification,
      canonicalUrl: `${siteUrl}${ATLAS_PATH}/sources/${source.id}`,
      atlasSourcesEndpoint: `${siteUrl}${ATLAS_PATH}/sources.json`,
    })),
    ...QC_SOURCES.map((source) => ({
      atlasId: 'quantum-computing',
      atlasUrl: `${siteUrl}${QC_ATLAS_PATH}`,
      id: source.id,
      title: source.title,
      year: source.year,
      identifier: source.identifier,
      externalUrl: source.url,
      canonicalUrl: `${siteUrl}${QC_ATLAS_PATH}/sources/${source.id}`,
      atlasSourcesEndpoint: `${siteUrl}${QC_ATLAS_PATH}/sources.json`,
    })),
    ...TN_SOURCES.map((source) => ({
      atlasId: 'tensor-networks',
      atlasUrl: `${siteUrl}${TN_ATLAS_PATH}`,
      id: source.id,
      title: source.title,
      year: source.year,
      identifier: source.identifier,
      externalUrl: source.url,
      verification: source.verification,
      canonicalUrl: `${siteUrl}${TN_ATLAS_PATH}/sources/${source.id}`,
      atlasSourcesEndpoint: `${siteUrl}${TN_ATLAS_PATH}/sources.json`,
    })),
    ...SI_PUBLIC_SOURCES.map((source) => ({
      atlasId: 'synthetic-intelligence',
      atlasUrl: `${siteUrl}${SI_PATH}`,
      id: source.id,
      title: source.title,
      year: source.year,
      identifier: source.identifier,
      externalUrl: source.url,
      verification: source.verification,
      canonicalUrl: `${siteUrl}${SI_PATH}/sources/${source.id}`,
      atlasSourcesEndpoint: `${siteUrl}${SI_PATH}/sources.json`,
    })),
    ...releasedAtlases().flatMap(({ release, path }) =>
      release.atlas.sources.map((source) => ({
        atlasId: release.slug,
        atlasUrl: `${siteUrl}${path}`,
        id: source.id,
        title: source.title,
        year: source.year ?? undefined,
        identifier: source.identifier,
        externalUrl: source.url,
        verification: source.verification,
        canonicalUrl: `${siteUrl}${path}/sources/${source.id}`,
        atlasSourcesEndpoint: `${siteUrl}${path}/sources.json`,
      })),
    ),
  ];
}

/** Per-atlas summary used by the manifest and by index `atlases` blocks. */
export function buildAtlasSummaries(siteUrl: string) {
  const reviewDates: Record<string, string> = {
    'de-sitter-swampland': ATLAS_META.lastReviewed,
    'quantum-computing': QC_META.lastReviewed,
    'tensor-networks': TN_META.lastReviewed,
    'synthetic-intelligence': SI_PUBLIC_META.lastReviewed,
  };

  return ATLAS_CATALOG.map((atlas) => ({
    atlasId: atlas.id,
    title: atlas.title,
    canonicalUrl: `${siteUrl}${atlas.canonicalPath}`,
    version: atlas.version,
    status: atlas.status,
    lastReviewed: reviewDates[atlas.id] ?? atlas.lastReviewed,
    evidenceCutoff: atlas.evidenceCutoff,
    intendedReader: atlas.intendedReader,
    scope: atlas.scope,
    exclusions: atlas.exclusions,
    counts: atlas.counts,
    pages: atlas.pages.map((page) => ({ label: page.label, url: `${siteUrl}${page.path}` })),
    endpoints: atlas.endpoints.map((endpoint) => ({
      label: endpoint.label,
      format: endpoint.format,
      url: `${siteUrl}${endpoint.path}`,
    })),
  }));
}
