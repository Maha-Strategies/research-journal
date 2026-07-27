import { buildContextText } from '@/lib/atlas/context-pack';

export async function GET() {
  return new Response(buildContextText(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
