import { SITE_URL } from '@/lib/entity';
import { ATLAS_CATALOG_PATH } from '@/lib/atlas/catalog';
import { buildConceptIndex, indexEnvelope } from '@/lib/atlas/aggregate';

/**
 * Aggregated concept discovery index across all atlases.
 *
 * Label and canonical URL only. The definition, why-it-matters, related
 * concepts, and the explicit not-established boundary all live on the canonical
 * concept record. A concept definition reproduced without its boundary is worse
 * than no definition, so the boundary is not separable and neither is copied.
 *
 * Note: only the Synthetic Intelligence atlas serves a per-atlas concepts.json.
 * For the other two, the canonical concept record is the HTML page linked here.
 */
export async function GET() {
  const concepts = buildConceptIndex(SITE_URL);

  return Response.json(
    {
      ...indexEnvelope(SITE_URL, 'concept', `${ATLAS_CATALOG_PATH}/concepts.json`),
      count: concepts.length,
      byAtlas: concepts.reduce<Record<string, number>>((acc, concept) => {
        acc[concept.atlasId] = (acc[concept.atlasId] ?? 0) + 1;
        return acc;
      }, {}),
      fieldsOmitted: ['definition', 'whyItMatters', 'related', 'notEstablished', 'sources'],
      concepts,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
