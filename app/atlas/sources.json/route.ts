import { SITE_URL } from '@/lib/entity';
import { ATLAS_CATALOG_PATH } from '@/lib/atlas/catalog';
import { buildSourceIndex, indexEnvelope } from '@/lib/atlas/aggregate';

/**
 * Aggregated source discovery index across all atlases.
 *
 * Bibliographic identification plus canonical URL. The curator annotation
 * ("why this source is here") stays on the canonical record.
 *
 * VERIFICATION SEMANTICS: `verification` is present only where the owning atlas
 * records one — Quantum Computing sources carry no such field, so the key is
 * absent rather than defaulted. An absent tag means "this atlas does not record
 * a verification label for this source", never "unverified" and never
 * "verified". Defaulting it would manufacture a provenance claim.
 */
export async function GET() {
  const sources = buildSourceIndex(SITE_URL);

  return Response.json(
    {
      ...indexEnvelope(SITE_URL, 'source', `${ATLAS_CATALOG_PATH}/sources.json`),
      count: sources.length,
      byAtlas: sources.reduce<Record<string, number>>((acc, source) => {
        acc[source.atlasId] = (acc[source.atlasId] ?? 0) + 1;
        return acc;
      }, {}),
      fieldsOmitted: ['whyHere', 'authors', 'sourceType', 'provenance'],
      verificationNote:
        'A verification label describes how far the citation was checked, not whether the work is correct. Where the key is absent, the owning atlas records no label; do not infer one.',
      sources,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
