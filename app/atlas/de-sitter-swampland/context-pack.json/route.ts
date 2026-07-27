import { buildManifest } from '@/lib/atlas/context-pack';

export async function GET() {
  return Response.json(
    { '@context': 'https://schema.org', '@type': 'Dataset', ...buildManifest() },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
