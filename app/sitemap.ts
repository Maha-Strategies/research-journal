import type { MetadataRoute } from 'next';

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
const atlases: { path: string; lastModified: string }[] = [
  { path: '/atlas/de-sitter-swampland', lastModified: '2026-07-26' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
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

  return [home, ...paperEntries, ...atlasEntries];
}
