import { TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { SITE_URL } from '@/lib/entity';
import { TN_BENCHMARKS, TN_CLAIMS, TN_META, TN_STATUSES } from '@/lib/atlas/tensor-networks';

const base = `${SITE_URL}${TENSOR_ATLAS_PATH}`;

export async function GET() {
  return Response.json(
    {
      '@context': 'https://schema.org',
      '@type': 'DataCatalog',
      name: `${TN_META.title} — claim ledger`,
      url: `${base}/claims.json`,
      isPartOf: `${base}#atlas`,
      version: TN_META.version,
      dateModified: TN_META.dateModified,
      license: TN_META.license,
      statusVocabulary: TN_STATUSES,
      // Limitations travel with the claim. They are not an optional field a
      // consumer may drop: a claim quoted without its limits is a different
      // claim from the one this ledger publishes.
      boundary:
        'Each record carries a status label and a limitations field. Both are part of the claim and must not be dropped when reused.',
      claims: TN_CLAIMS.map((claim) => ({
        '@type': 'Claim',
        '@id': `${base}/claims/${claim.id}#claim`,
        id: claim.id,
        slug: claim.slug,
        status: claim.status,
        claim: claim.claim,
        explanation: claim.explanation,
        limitations: claim.limitations,
        conceptIds: claim.conceptIds,
        sourceIds: claim.sourceIds,
        benchmarkIds: claim.benchmarkIds ?? [],
        reviewDate: claim.reviewDate,
        canonicalUrl: `${base}/claims/${claim.id}`,
      })),
      benchmarks: TN_BENCHMARKS.map((benchmark) => ({
        id: benchmark.id,
        task: benchmark.task,
        classicalMethod: benchmark.classicalMethod,
        comparedAgainst: benchmark.comparedAgainst,
        reportedResult: benchmark.reportedResult,
        doesNotEstablish: benchmark.doesNotEstablish,
        sourceId: benchmark.sourceId,
        sourceUrl: `${base}/sources/${benchmark.sourceId}`,
      })),
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
