import { buildStandardRecord } from '@/lib/standards/maha-provenance';

const SITE_URL = 'https://research.mahastrategies.com';

export async function GET() {
  return Response.json(
    { '@context': 'https://schema.org', '@type': 'DefinedTermSet', ...buildStandardRecord(SITE_URL) },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
