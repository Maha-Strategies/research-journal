import { SITE_URL } from '@/lib/entity';
import { ATLAS_CATALOG_PATH, ATLAS_CATALOG_VALIDATION } from '@/lib/atlas/catalog';
import { buildAtlasSummaries, indexEnvelope } from '@/lib/atlas/aggregate';

/**
 * The gateway manifest: one request that tells a client every atlas that
 * exists, where its canonical pages and JSON endpoints live, and what each one
 * declares about its own scope and boundaries.
 *
 * Endpoint lists are read from the catalog, so an atlas cannot advertise here
 * an endpoint it does not actually serve.
 */
export async function GET() {
  const atlases = buildAtlasSummaries(SITE_URL);

  return Response.json(
    {
      ...indexEnvelope(SITE_URL, 'atlas', `${ATLAS_CATALOG_PATH}/manifest.json`),
      name: 'Maha Research Atlas Gateway — manifest',
      version: '1.0.0',
      catalogValid: ATLAS_CATALOG_VALIDATION.valid,
      count: atlases.length,
      totals: atlases.reduce(
        (acc, atlas) => ({
          claims: acc.claims + atlas.counts.claims,
          concepts: acc.concepts + atlas.counts.concepts,
          sources: acc.sources + atlas.counts.sources,
        }),
        { claims: 0, concepts: 0, sources: 0 },
      ),
      aggregateIndexes: {
        claims: `${SITE_URL}${ATLAS_CATALOG_PATH}/claims.json`,
        concepts: `${SITE_URL}${ATLAS_CATALOG_PATH}/concepts.json`,
        sources: `${SITE_URL}${ATLAS_CATALOG_PATH}/sources.json`,
        catalogRecord: `${SITE_URL}${ATLAS_CATALOG_PATH}/registry.json`,
      },
      atlases,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
