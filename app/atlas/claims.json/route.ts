import { SITE_URL } from '@/lib/entity';
import { ATLAS_CATALOG_PATH } from '@/lib/atlas/catalog';
import { buildClaimIndex, indexEnvelope } from '@/lib/atlas/aggregate';

/**
 * Aggregated claim discovery index across all atlases.
 *
 * Carries identification only — id, status, claim text, review date, and the
 * canonical URL. Explanation, limitations, and source lists stay in the owning
 * atlas's own claims.json, linked per entry as `atlasClaimsEndpoint`. Copying
 * limitations here would create a second copy free to drift out of step with
 * the first, which is how a caveat gets lost.
 */
export async function GET() {
  const claims = buildClaimIndex(SITE_URL);

  return Response.json(
    {
      ...indexEnvelope(SITE_URL, 'claim', `${ATLAS_CATALOG_PATH}/claims.json`),
      count: claims.length,
      byAtlas: claims.reduce<Record<string, number>>((acc, claim) => {
        acc[claim.atlasId] = (acc[claim.atlasId] ?? 0) + 1;
        return acc;
      }, {}),
      fieldsOmitted: ['explanation', 'limitations', 'conceptIds', 'sourceIds'],
      claims,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
