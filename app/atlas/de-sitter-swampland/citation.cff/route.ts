import { getAtlasCitations } from '@/lib/atlas/context-pack';

export async function GET() {
  return new Response(getAtlasCitations().cff, {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
      'Content-Disposition': 'attachment; filename="CITATION.cff"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
