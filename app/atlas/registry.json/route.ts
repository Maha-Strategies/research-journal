import { buildAtlasCatalogRecord } from '@/lib/atlas/catalog';

const SITE_URL = 'https://research.mahastrategies.com';

export async function GET() {
  return Response.json(
    { '@context': 'https://schema.org', '@type': 'DataCatalog', ...buildAtlasCatalogRecord(SITE_URL) },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
