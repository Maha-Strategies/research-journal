import { TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { SITE_URL } from '@/lib/entity';
import { TN_META, TN_SOURCES } from '@/lib/atlas/tensor-networks';

const base = `${SITE_URL}${TENSOR_ATLAS_PATH}`;

export async function GET() {
  return Response.json(
    {
      '@context': 'https://schema.org',
      '@type': 'DataCatalog',
      name: `${TN_META.title} — source trail`,
      url: `${base}/sources.json`,
      isPartOf: `${base}#atlas`,
      version: TN_META.version,
      dateModified: TN_META.dateModified,
      license: TN_META.license,
      verificationNote:
        'Every identifier was resolved against the arXiv API or Crossref on its verifiedOn date, and the title, authors, and year here are what that record returned. This is identifier verification: it establishes that the identifier denotes the named paper, not that the full text was re-read.',
      sources: TN_SOURCES.map((source) => ({
        '@type': 'ScholarlyArticle',
        '@id': `${base}/sources/${source.id}#source`,
        id: source.id,
        title: source.title,
        authors: source.authors,
        year: source.year,
        identifier: source.identifier,
        url: source.url,
        sourceType: source.sourceType,
        verification: source.verification,
        verifiedOn: source.verifiedOn,
        whyHere: source.whyHere,
        canonicalUrl: `${base}/sources/${source.id}`,
      })),
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
