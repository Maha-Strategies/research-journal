import { TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { MAHA_ORGANIZATION_ID, MAYON_RAJAN_PERSON_ID, SITE_URL } from '@/lib/entity';
import { TN_BENCHMARKS, TN_CLAIMS, TN_CONCEPTS, TN_META, TN_SOURCES, TN_STATUSES } from '@/lib/atlas/tensor-networks';

const base = `${SITE_URL}${TENSOR_ATLAS_PATH}`;

export async function GET() {
  return Response.json(
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': `${base}#atlas`,
      name: TN_META.title,
      description: TN_META.description,
      url: base,
      canonicalUrl: base,
      version: TN_META.version,
      datePublished: TN_META.datePublished,
      dateModified: TN_META.dateModified,
      lastReviewed: TN_META.lastReviewed,
      evidenceCutoff: TN_META.evidenceCutoff,
      license: TN_META.license,
      creativeWorkStatus: 'Non-peer-reviewed educational research map',
      isAccessibleForFree: true,
      publisher: { '@id': MAHA_ORGANIZATION_ID },
      author: { '@id': MAYON_RAJAN_PERSON_ID },
      endpoints: {
        metadata: `${base}/metadata.json`,
        claims: `${base}/claims.json`,
        sources: `${base}/sources.json`,
        context: `${base}/context.txt`,
        methodology: `${base}/methodology`,
      },
      statusVocabulary: TN_STATUSES,
      counts: {
        claims: TN_CLAIMS.length,
        concepts: TN_CONCEPTS.length,
        sources: TN_SOURCES.length,
        benchmarks: TN_BENCHMARKS.length,
      },
      scope: TN_META.scope,
      exclusions: [
        'No performance figure without a resolvable cited source. The benchmark schema has no throughput, speedup, or runtime field.',
        'No claim that classical tensor-network contraction generally outperforms quantum hardware on industrial optimization workloads — see claim tn-014.',
        'No adjudication of the AdS/MERA correspondence, which is recorded as a conjecture with its published objection.',
        'No vendor rankings, roadmaps-as-evidence, or investment guidance.',
      ],
      verificationNote:
        'Source identifiers were resolved against the arXiv API and Crossref on the review date. That establishes the identifier denotes the named paper; it is not a re-reading of each full text.',
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
