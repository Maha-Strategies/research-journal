import { buildRegistryRecord } from '@/lib/registry';

export async function GET() {
  return Response.json(
    { '@context': 'https://schema.org', '@type': 'DataCatalog', ...buildRegistryRecord() },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
