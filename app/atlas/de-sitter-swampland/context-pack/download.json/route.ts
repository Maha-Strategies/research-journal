import { ATLAS_META } from '@/lib/atlas/de-sitter';
import { buildDownloadBundle } from '@/lib/atlas/context-pack';

export async function GET() {
  const filename = `de-sitter-swampland-atlas-context-pack-v${ATLAS_META.version}.json`;

  return new Response(JSON.stringify(buildDownloadBundle(), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
