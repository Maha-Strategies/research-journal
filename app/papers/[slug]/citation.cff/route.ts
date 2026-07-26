import { getCitationCff, getWorkingPaper } from '@/lib/working-papers';

const SITE_URL = 'https://research.mahastrategies.com';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = getWorkingPaper(slug);
  if (!paper) return new Response('Paper not found', { status: 404 });
  return new Response(getCitationCff(paper, SITE_URL), { headers: { 'Content-Type': 'text/yaml; charset=utf-8', 'Content-Disposition': `attachment; filename="${slug}.cff"`, 'Cache-Control': 'public, max-age=3600' } });
}
