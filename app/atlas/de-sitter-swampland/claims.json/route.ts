import {
  ATLAS_CLAIMS,
  ATLAS_META,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  EPISTEMIC_STATUSES,
  getStatus,
} from '@/lib/atlas/de-sitter';
import { getZenodoRecord } from '@/lib/zenodo-records';

const SITE_URL = 'https://research.mahastrategies.com';

export async function GET() {
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const atlasUrl = `${SITE_URL}${ATLAS_PATH}`;
  const paperUrl = `${SITE_URL}/papers/${ATLAS_PAPER_SLUG}`;

  return Response.json(
    {
      atlas: {
        title: ATLAS_META.title,
        url: atlasUrl,
        version: ATLAS_META.version,
        release: ATLAS_META.releaseName,
        lastReviewed: ATLAS_META.lastReviewed,
        license: ATLAS_META.license,
        sourcePaper: paperUrl,
        ...(zenodo ? { doi: zenodo.doi, conceptDoi: zenodo.conceptDoi, archive: zenodo.recordUrl } : {}),
        sourcesEndpoint: `${atlasUrl}/sources.json`,
        note: 'Educational, non-peer-reviewed orientation tool. Each claim carries an epistemic status and a limitations statement; both are part of the claim and should travel with it.',
      },
      statusVocabulary: EPISTEMIC_STATUSES.map(({ id, label, definition }) => ({ id, label, definition })),
      count: ATLAS_CLAIMS.length,
      claims: ATLAS_CLAIMS.map((claim) => ({
        id: claim.ref,
        slug: claim.id,
        claim: claim.claim,
        status: claim.status,
        statusLabel: getStatus(claim.status).label,
        statusNote: claim.statusNote ?? null,
        explanation: claim.explanation,
        limitations: claim.limitations,
        conceptIds: claim.conceptIds,
        sourceIds: claim.sources,
        reviewDate: claim.reviewDate,
        atlasVersion: ATLAS_META.version,
        canonicalUrl: `${atlasUrl}/claims/${claim.ref}`,
      })),
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
