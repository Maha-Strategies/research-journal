import { getPaperReferences } from '@/lib/paper-references';
import { getBibtex, getWorkingPaper } from '@/lib/working-papers';

const SITE_URL = 'https://research.mahastrategies.com';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = getWorkingPaper(slug);
  if (!paper) return Response.json({ error: 'Paper not found' }, { status: 404 });
  const url = `${SITE_URL}/papers/${slug}`;
  return Response.json({ '@context': 'https://schema.org', '@type': 'ScholarlyArticle', identifier: url, name: paper.title, version: paper.version, dateModified: paper.versionDate, creativeWorkStatus: paper.status, reviewStatus: paper.reviewStatus, url, encoding: [{ '@type': 'MediaObject', encodingFormat: 'application/pdf', contentUrl: `${url}.pdf` }, { '@type': 'MediaObject', encodingFormat: 'application/x-bibtex', contentUrl: `${url}/citation.bib` }, { '@type': 'MediaObject', encodingFormat: 'text/yaml', contentUrl: `${url}/citation.cff` }], citation: getPaperReferences(slug), bibtex: getBibtex(paper, SITE_URL) }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
