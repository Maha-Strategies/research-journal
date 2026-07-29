// Machine-readable endpoint for a builder-published atlas.
//
// The body comes from lib/atlas/builder/public-output.ts, which is the single
// deterministic serializer for every public surface. A route handler must not
// shape a record itself: the page, the JSON, and the context pack would then be
// free to disagree about what the atlas contains.
//
// `dynamicParams = false` plus a generateStaticParams that reads only published
// releases means an unpublished slug 404s rather than rendering. See the header
// of page.tsx for why that matters next to the static atlas routes.

import { notFound } from 'next/navigation';

import { PUBLISHED_SLUGS, getPublishedRelease } from '@/lib/atlas/builder/releases';
import { buildMetadataRecord } from '@/lib/atlas/builder/public-output';

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_SLUGS.map((atlasSlug) => ({ atlasSlug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ atlasSlug: string }> }) {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  const record = release ? buildMetadataRecord(release) : null;
  if (!record) notFound();

  return Response.json(record, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
