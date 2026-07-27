import type { MetadataRoute } from 'next';

import { ATLAS_CLAIMS, ATLAS_META, ATLAS_NODES, ATLAS_PATH, getSourceCards } from '@/lib/atlas/de-sitter';
import { SI_PUBLIC_CLAIMS, SI_PUBLIC_CONCEPTS, SI_PUBLIC_META, SI_PUBLIC_SOURCES } from '@/lib/atlas/synthetic-intelligence';
import { REGISTRY_META, REGISTRY_PATH } from '@/lib/registry';
import { STANDARD_META, STANDARD_PATH } from '@/lib/standards/maha-provenance';

const SITE_URL = 'https://research.mahastrategies.com';

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

  return [home, registry, standard, ...paperEntries, ...atlasEntries];
}
