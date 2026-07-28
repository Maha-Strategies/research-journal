import { ATLAS_CLAIMS, ATLAS_META, ATLAS_NODES, ATLAS_PAPER_SLUG, ATLAS_PATH, getSourceCards } from '@/lib/atlas/de-sitter';
import { SI_PUBLIC_CLAIMS, SI_PUBLIC_CONCEPTS, SI_PUBLIC_META, SI_PUBLIC_SOURCES } from '@/lib/atlas/synthetic-intelligence';
import { QC_ATLAS_PATH, QC_CLAIMS, QC_CONCEPTS, QC_META, QC_SOURCES } from '@/lib/atlas/quantum-computing';

export const ATLAS_CATALOG_PATH = '/atlas';

export type AtlasCatalogEntry = {
  id: string;
  title: string;
  shortTitle: string;
  canonicalPath: string;
  description: string;
  scope: string;
  exclusions: string[];
  status: string;
  version: string;
  lastReviewed: string;
  evidenceCutoff?: string;
  counts: { claims: number; concepts: number; sources: number };
  endpoints: { label: string; path: string; format: string }[];
  expansionCandidates: string[];
  /** Who the atlas is written for, in plain language. */
  intendedReader: string;
  /**
   * The human HTML entry points that ACTUALLY EXIST for this atlas.
   *
   * The three atlases are deliberately not uniform — de Sitter has no
   * methodology page and no claims index, Quantum Computing has no context
   * pack, and only Synthetic Intelligence has a comparisons layer. This list is
   * written per atlas rather than generated from a template, so the gateway
   * cannot advertise a page that was never built. Adding a route here without
   * building it produces a 404, which the post-build crawl audit catches.
   */
  pages: { label: string; path: string }[];
  /** Working paper this atlas sits alongside, where one exists. */
  relatedPaperSlug?: string;
};

export const ATLAS_CATALOG: AtlasCatalogEntry[] = [
  {
    id: 'quantum-computing',
    title: QC_META.title,
    shortTitle: QC_META.shortTitle,
    canonicalPath: QC_ATLAS_PATH,
    description: QC_META.description,
    scope: 'Quantum computing concepts, hardware modalities, error correction, algorithms, limitations, and near-term applications.',
    exclusions: ['No technology forecasts, vendor rankings, investment advice, or unverified performance leaderboards.', 'No claim that current devices can run large-scale Shor factoring or general-purpose fault-tolerant algorithms.'],
    status: QC_META.statusBadge,
    version: QC_META.version,
    lastReviewed: QC_META.lastReviewed,
    evidenceCutoff: QC_META.evidenceCutoff,
    counts: { claims: QC_CLAIMS.length, concepts: QC_CONCEPTS.length, sources: QC_SOURCES.length },
    endpoints: [
      { label: 'Metadata', path: `${QC_ATLAS_PATH}/metadata.json`, format: 'application/json' },
      { label: 'Claim ledger', path: `${QC_ATLAS_PATH}/claims.json`, format: 'application/json' },
      { label: 'Source trail', path: `${QC_ATLAS_PATH}/sources.json`, format: 'application/json' },
      { label: 'Plain-text context', path: `${QC_ATLAS_PATH}/context.txt`, format: 'text/plain' },
    ],
    expansionCandidates: ['Add a claim only after primary or authoritative source resolution, status assignment, limitation writing, and review.', 'Do not turn platform announcements, raw qubit counts, or roadmap targets into standalone evidence records.'],
    intendedReader:
      'A technically literate non-specialist trying to separate what quantum hardware demonstrably does today from what is projected, marketed, or still theoretical.',
    // No context-pack page for this atlas.
    pages: [
      { label: 'Concepts', path: `${QC_ATLAS_PATH}/concepts` },
      { label: 'Sources', path: `${QC_ATLAS_PATH}/sources` },
      { label: 'Methodology', path: `${QC_ATLAS_PATH}/methodology` },
    ],
  },
  {
    id: 'de-sitter-swampland',
    title: ATLAS_META.title,
    shortTitle: ATLAS_META.shortTitle,
    canonicalPath: ATLAS_PATH,
    description: ATLAS_META.description,
    scope: 'The de Sitter problem in the string/M-theory swampland program, with a literature map, claim ledger, source trail, and a downloadable context pack.',
    exclusions: [
      'Does not adjudicate whether string theory admits metastable de Sitter vacua.',
      'Does not claim experimental confirmation of string theory, M-theory, or any swampland conjecture.',
    ],
    status: ATLAS_META.statusBadge,
    version: ATLAS_META.version,
    lastReviewed: ATLAS_META.lastReviewed,
    counts: { claims: ATLAS_CLAIMS.length, concepts: ATLAS_NODES.length, sources: getSourceCards().length },
    endpoints: [
      { label: 'Metadata', path: `${ATLAS_PATH}/metadata.json`, format: 'application/json' },
      { label: 'Claim ledger', path: `${ATLAS_PATH}/claims.json`, format: 'application/json' },
      { label: 'Source trail', path: `${ATLAS_PATH}/sources.json`, format: 'application/json' },
      { label: 'Context pack', path: `${ATLAS_PATH}/context-pack.json`, format: 'application/json' },
      { label: 'Plain-text context', path: `${ATLAS_PATH}/context.txt`, format: 'text/plain' },
    ],
    expansionCandidates: [
      'Add source-backed argument and response records only when the underlying literature map is expanded and re-verified.',
      'Treat new camps, interpretations, and observational links as editorial candidates—not pages—until sources and status labels are reviewed.',
    ],
    intendedReader:
      'A reader with some physics background who wants the shape of an unresolved research debate — who argues what, on what evidence — without being told which side is right.',
    // No methodology page and no claims index for this atlas.
    pages: [
      { label: 'Concepts', path: `${ATLAS_PATH}/concepts` },
      { label: 'Sources', path: `${ATLAS_PATH}/sources` },
      { label: 'Context pack', path: `${ATLAS_PATH}/context-pack` },
    ],
    relatedPaperSlug: ATLAS_PAPER_SLUG,
  },
  {
    id: 'synthetic-intelligence',
    title: SI_PUBLIC_META.title,
    shortTitle: SI_PUBLIC_META.shortTitle,
    canonicalPath: '/atlas/synthetic-intelligence',
    description: SI_PUBLIC_META.description,
    scope: SI_PUBLIC_META.scope,
    exclusions: [
      'Forecast scenarios and the local methodological audit exhibit are not in the public edition.',
      SI_PUBLIC_META.outOfScope,
    ],
    status: SI_PUBLIC_META.statusBadge,
    version: SI_PUBLIC_META.version,
    lastReviewed: SI_PUBLIC_META.lastReviewed,
    evidenceCutoff: SI_PUBLIC_META.evidenceCutoff,
    counts: { claims: SI_PUBLIC_CLAIMS.length, concepts: SI_PUBLIC_CONCEPTS.length, sources: SI_PUBLIC_SOURCES.length },
    endpoints: [
      { label: 'Metadata', path: '/atlas/synthetic-intelligence/metadata.json', format: 'application/json' },
      { label: 'Claim ledger', path: '/atlas/synthetic-intelligence/claims.json', format: 'application/json' },
      { label: 'Concept records', path: '/atlas/synthetic-intelligence/concepts.json', format: 'application/json' },
      { label: 'Source trail', path: '/atlas/synthetic-intelligence/sources.json', format: 'application/json' },
      { label: 'Context pack', path: '/atlas/synthetic-intelligence/context-pack.json', format: 'application/json' },
      { label: 'Plain-text context', path: '/atlas/synthetic-intelligence/context.txt', format: 'text/plain' },
    ],
    expansionCandidates: [
      'Resolve additional primary sources before adding any claim, source, or concept page.',
      'Keep LLM/agent evaluation separate from the Quantum Computing Atlas, while linking only where workload and computing-boundary context is relevant.',
      'Do not convert benchmark leaderboard changes or provider marketing claims into public pages without independently verified primary evidence.',
    ],
    intendedReader:
      'Someone deciding how much weight to put on claims about AI capability — practitioner, educator, or policy reader — who needs the evidence and its limits stated together.',
    // The only atlas with a claims index and a comparisons decision layer.
    pages: [
      { label: 'Claims', path: '/atlas/synthetic-intelligence/claims' },
      { label: 'Comparisons', path: '/atlas/synthetic-intelligence/comparisons' },
      { label: 'Concepts', path: '/atlas/synthetic-intelligence/concepts' },
      { label: 'Sources', path: '/atlas/synthetic-intelligence/sources' },
      { label: 'Methodology', path: '/atlas/synthetic-intelligence/methodology' },
      { label: 'Context pack', path: '/atlas/synthetic-intelligence/context-pack' },
    ],
  },
];

export type AtlasCatalogValidation = { valid: boolean; errors: string[]; checkedAt: string };

/**
 * The build-time publication gate for future atlas entries. It intentionally
 * validates editorial metadata, while Next.js validates that declared static
 * routes actually compile during the production build.
 */
export function validateAtlasCatalog(entries = ATLAS_CATALOG): AtlasCatalogValidation {
  const errors: string[] = [];
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const atlas of entries) {
    if (!/^[a-z0-9-]+$/.test(atlas.id)) errors.push(`${atlas.id}: id must be lowercase kebab-case.`);
    if (ids.has(atlas.id)) errors.push(`${atlas.id}: duplicate id.`);
    ids.add(atlas.id);
    if (!atlas.canonicalPath.startsWith('/atlas/')) errors.push(`${atlas.id}: canonical path must be under /atlas/.`);
    if (paths.has(atlas.canonicalPath)) errors.push(`${atlas.id}: duplicate canonical path.`);
    paths.add(atlas.canonicalPath);
    if (!atlas.description || !atlas.scope) errors.push(`${atlas.id}: description and scope are required.`);
    if (!atlas.exclusions.length) errors.push(`${atlas.id}: at least one explicit exclusion is required.`);
    if (!/^\d+\.\d+\.\d+$/.test(atlas.version)) errors.push(`${atlas.id}: version must be semantic.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(atlas.lastReviewed)) errors.push(`${atlas.id}: lastReviewed must be YYYY-MM-DD.`);
    if (atlas.evidenceCutoff && !/^\d{4}-\d{2}-\d{2}$/.test(atlas.evidenceCutoff)) errors.push(`${atlas.id}: evidenceCutoff must be YYYY-MM-DD.`);
    if (atlas.counts.claims < 1 || atlas.counts.concepts < 1 || atlas.counts.sources < 1) errors.push(`${atlas.id}: claims, concepts, and sources must all be non-zero.`);
    const endpointLabels = new Set(atlas.endpoints.map((endpoint) => endpoint.label));
    for (const required of ['Metadata', 'Claim ledger', 'Source trail']) {
      if (!endpointLabels.has(required)) errors.push(`${atlas.id}: missing required ${required.toLowerCase()} endpoint.`);
    }
    for (const endpoint of atlas.endpoints) {
      if (!endpoint.path.startsWith(atlas.canonicalPath)) errors.push(`${atlas.id}: endpoint ${endpoint.label} is outside its canonical path.`);
      if (!endpoint.format.includes('/')) errors.push(`${atlas.id}: endpoint ${endpoint.label} needs a MIME type.`);
    }
    if (!atlas.intendedReader) errors.push(`${atlas.id}: intendedReader is required — the gateway states who each atlas is for.`);
    if (!atlas.pages.length) errors.push(`${atlas.id}: at least one human entry point is required.`);
    const pagePaths = new Set<string>();
    for (const page of atlas.pages) {
      if (!page.path.startsWith(`${atlas.canonicalPath}/`)) errors.push(`${atlas.id}: page ${page.label} is outside its canonical path.`);
      if (pagePaths.has(page.path)) errors.push(`${atlas.id}: duplicate page path ${page.path}.`);
      pagePaths.add(page.path);
    }
  }
  return { valid: errors.length === 0, errors, checkedAt: '2026-07-27' };
}

export const ATLAS_CATALOG_VALIDATION = validateAtlasCatalog();

if (!ATLAS_CATALOG_VALIDATION.valid) {
  throw new Error(`Invalid Atlas catalog:\n${ATLAS_CATALOG_VALIDATION.errors.join('\n')}`);
}

export function buildAtlasCatalogRecord(siteUrl: string) {
  return {
    title: 'Maha Research Atlas Catalog',
    description: 'A machine-readable catalog of public Maha Research atlases and their editorial boundaries, source trails, claim ledgers, and expansion criteria.',
    canonicalUrl: `${siteUrl}${ATLAS_CATALOG_PATH}`,
    count: ATLAS_CATALOG.length,
    validation: ATLAS_CATALOG_VALIDATION,
    publicationGate: [
      'A public atlas requires a canonical path, semantic version, review date, explicit scope, explicit exclusions, and non-zero public claim, concept, and source records.',
      'It must publish machine-readable metadata, claim ledger, and source trail endpoints beneath its own canonical path.',
      'New pages begin as editorial candidates. They become public only after source resolution, status assignment, limitation writing, and a successful production build.',
    ],
    atlases: ATLAS_CATALOG.map((atlas) => ({ ...atlas, canonicalUrl: `${siteUrl}${atlas.canonicalPath}`, endpoints: atlas.endpoints.map((endpoint) => ({ ...endpoint, url: `${siteUrl}${endpoint.path}` })) })),
  };
}
