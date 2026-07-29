import type { MetadataRoute } from 'next';

import { ATLAS_CLAIMS, ATLAS_META, ATLAS_NODES, ATLAS_PATH, getSourceCards } from '@/lib/atlas/de-sitter';
import { SI_PUBLIC_CLAIMS, SI_PUBLIC_CONCEPTS, SI_PUBLIC_META, SI_PUBLIC_SOURCES } from '@/lib/atlas/synthetic-intelligence';
import { QC_ATLAS_PATH, QC_CLAIMS, QC_CONCEPTS, QC_META, QC_SOURCES } from '@/lib/atlas/quantum-computing';
import { REGISTRY_META, REGISTRY_PATH } from '@/lib/registry';
import { STANDARD_META, STANDARD_PATH } from '@/lib/standards/maha-provenance';
import { LEARNING_MODULES, getAllLessons } from '@/lib/library/registry';
import { AUDIENCE_ROLES, LIBRARY_PATH, audiencePath, lessonPath, modulePath } from '@/lib/library/schema';
import { PUBLISHED_RELEASES } from '@/lib/atlas/builder/releases';
import { buildSitemapEntries } from '@/lib/atlas/builder/public-output';

const SITE_URL = 'https://research.mahastrategies.com';

// The library has no per-lesson revision dates yet. One honest date for the
// whole section beats a `new Date()` that would tell crawlers every lesson
// changed on every build. Bump this when library content materially changes.
const LIBRARY_LAST_MODIFIED = '2026-07-28';

// Keep in step with GATEWAY_UPDATED in app/atlas/page.tsx.
const ATLAS_GATEWAY_UPDATED = '2026-07-28';

// Publication dates from each paper's schema (datePublished).
// Update lastModified when a paper's content materially changes.
const papers: { slug: string; lastModified: string }[] = [
  { slug: 'the-volcanic-engine-thesis', lastModified: '2026-07-26' },
  { slug: 'planet-nine-forecast', lastModified: '2026-06-01' },
  { slug: 'thermodynamic-isomorphism', lastModified: '2026-06-01' },
  { slug: 'dissolving-self-ocean-planet', lastModified: '2026-06-01' },
  { slug: 'commercial-fusion-viability', lastModified: '2026-06-01' },
  { slug: 'chronobiological-entrainment', lastModified: '2026-02-01' },
  { slug: 'the-maha-framework', lastModified: '2026-06-18' },
  { slug: 'the_perturber_question', lastModified: '2026-06-08' },
  { slug: 'readout_plasticity_paper', lastModified: '2026-06-07' },
  { slug: 'machine_learning_g2_betti', lastModified: '2026-06-10' },
  { slug: 'de_sitter_swampland_map', lastModified: '2026-07-26' },
  { slug: 'retrograde_p9', lastModified: '2026-06-09' },
];

// Interactive research surfaces that sit alongside a paper rather than in it.
// Claim routes are derived from the atlas data so the two cannot drift.
const atlases: { path: string; lastModified: string }[] = [
  { path: QC_ATLAS_PATH, lastModified: QC_META.dateModified },
  { path: `${QC_ATLAS_PATH}/concepts`, lastModified: QC_META.dateModified },
  { path: `${QC_ATLAS_PATH}/sources`, lastModified: QC_META.dateModified },
  { path: `${QC_ATLAS_PATH}/methodology`, lastModified: QC_META.dateModified },
  ...QC_CONCEPTS.map((concept) => ({ path: `${QC_ATLAS_PATH}/concepts/${concept.id}`, lastModified: QC_META.lastReviewed })),
  ...QC_SOURCES.map((source) => ({ path: `${QC_ATLAS_PATH}/sources/${source.id}`, lastModified: source.verifiedOn })),
  ...QC_CLAIMS.map((claim) => ({ path: `${QC_ATLAS_PATH}/claims/${claim.id}`, lastModified: claim.reviewDate })),
  { path: ATLAS_PATH, lastModified: ATLAS_META.dateModified },
  { path: '/atlas', lastModified: '2026-07-27' },
  { path: `${ATLAS_PATH}/context-pack`, lastModified: ATLAS_META.dateModified },
  { path: `${ATLAS_PATH}/concepts`, lastModified: ATLAS_META.dateModified },
  { path: `${ATLAS_PATH}/sources`, lastModified: ATLAS_META.dateModified },
  ...ATLAS_NODES.map((node) => ({
    path: `${ATLAS_PATH}/concepts/${node.id}`,
    lastModified: ATLAS_META.lastReviewed,
  })),
  ...getSourceCards().map((source) => ({
    path: `${ATLAS_PATH}/sources/${source.id}`,
    lastModified: ATLAS_META.lastReviewed,
  })),
  ...ATLAS_CLAIMS.map((claim) => ({
    path: `${ATLAS_PATH}/claims/${claim.ref}`,
    lastModified: claim.reviewDate,
  })),
  { path: '/atlas/synthetic-intelligence', lastModified: SI_PUBLIC_META.dateModified },
  { path: '/atlas/synthetic-intelligence/claims', lastModified: SI_PUBLIC_META.dateModified },
  { path: '/atlas/synthetic-intelligence/comparisons', lastModified: SI_PUBLIC_META.dateModified },
  ...['llms-vs-agentic-systems', 'retrieval-vs-fine-tuning', 'tool-use-vs-autonomous-execution', 'local-inference-vs-cloud-inference', 'benchmark-performance-vs-real-world-reliability'].map((slug) => ({ path: `/atlas/synthetic-intelligence/comparisons/${slug}`, lastModified: SI_PUBLIC_META.dateModified })),
  { path: '/atlas/synthetic-intelligence/methodology', lastModified: SI_PUBLIC_META.dateModified },
  { path: '/atlas/synthetic-intelligence/context-pack', lastModified: SI_PUBLIC_META.dateModified },
  { path: '/atlas/synthetic-intelligence/concepts', lastModified: SI_PUBLIC_META.dateModified },
  { path: '/atlas/synthetic-intelligence/sources', lastModified: SI_PUBLIC_META.dateModified },
  ...SI_PUBLIC_CONCEPTS.map((concept) => ({
    path: `/atlas/synthetic-intelligence/concepts/${concept.id}`,
    lastModified: SI_PUBLIC_META.lastReviewed,
  })),
  ...SI_PUBLIC_SOURCES.map((source) => ({
    path: `/atlas/synthetic-intelligence/sources/${source.id}`,
    lastModified: source.verifiedOn,
  })),
  ...SI_PUBLIC_CLAIMS.map((claim) => ({
    path: `/atlas/synthetic-intelligence/claims/${claim.id}`,
    lastModified: claim.reviewDate,
  })),
  // Atlases published through the Private Atlas Builder. Every URL is derived
  // from the release record by the same function the route tree uses, so a
  // sitemap entry cannot point at a page that was not generated. Empty until a
  // release is approved.
  ...PUBLISHED_RELEASES.flatMap((release) => buildSitemapEntries(release)),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  };

  const standard = {
    url: `${SITE_URL}${STANDARD_PATH}`,
    lastModified: new Date(STANDARD_META.dateModified),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  };

  const registry = {
    url: `${SITE_URL}${REGISTRY_PATH}`,
    lastModified: new Date(REGISTRY_META.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  };

  const paperEntries = papers.map((p) => ({
    url: `${SITE_URL}/papers/${p.slug}`,
    lastModified: new Date(p.lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const atlasEntries = atlases.map((a) => ({
    url: `${SITE_URL}${a.path}`,
    lastModified: new Date(a.lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Gateway aggregate discovery endpoints. Listed so a crawler that reaches
  // /atlas can find the machine-readable indexes without parsing the HTML.
  const gatewayEndpoints = [
    '/atlas/manifest.json',
    '/atlas/claims.json',
    '/atlas/concepts.json',
    '/atlas/sources.json',
    '/atlas/registry.json',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(ATLAS_GATEWAY_UPDATED),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Library routes are derived from the registry and the same path helpers the
  // pages use, so a sitemap URL cannot drift from the route that serves it or
  // from the canonical URL in the page's JSON-LD.
  const libraryLastModified = new Date(LIBRARY_LAST_MODIFIED);

  const libraryEntries = [
    { path: LIBRARY_PATH, priority: 0.9 },
    ...LEARNING_MODULES.map((m) => ({ path: modulePath(m.slug), priority: 0.8 })),
    ...getAllLessons().map((lesson) => ({ path: lessonPath(lesson), priority: 0.8 })),
    ...AUDIENCE_ROLES.map((role) => ({ path: audiencePath(role), priority: 0.6 })),
  ].map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: libraryLastModified,
    changeFrequency: 'monthly' as const,
    priority: entry.priority,
  }));

  return [
    home,
    registry,
    standard,
    ...paperEntries,
    ...atlasEntries,
    ...gatewayEndpoints,
    ...libraryEntries,
  ];
}
