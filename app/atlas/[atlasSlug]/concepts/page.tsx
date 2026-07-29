// The concept index.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import { PUBLISHED_SLUGS, getPublishedRelease } from '@/lib/atlas/builder/releases';
import { Breadcrumb, CARD, LINK, SECTION_HEADING } from '../_shared';

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_SLUGS.map((atlasSlug) => ({ atlasSlug }));
}

type Params = { params: Promise<{ atlasSlug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  if (!release) return {};
  return {
    title: `Concepts — ${release.atlas.shortTitle}`,
    description: `Orientation records for the vocabulary used in ${release.atlas.title}.`,
    alternates: { canonical: `${SITE_URL}/atlas/${atlasSlug}/concepts` },
  };
}

export default async function ConceptsIndex({ params }: Params) {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  if (!release) notFound();

  const { atlas } = release;
  const base = `/atlas/${atlasSlug}`;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Breadcrumb atlasSlug={atlasSlug} atlasTitle={atlas.shortTitle} section="Concepts" />

      <header className="mt-8">
        <h1 className="text-3xl font-light text-white">Concepts</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Orientation records for the terms this atlas uses, written so a claim can be read without
          already knowing the field. Concepts explain; they do not assert.
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {atlas.concepts.length} concepts · atlas v{release.version}
        </p>
      </header>

      <section aria-labelledby="index" className="mt-12">
        <h2 id="index" className={SECTION_HEADING}>
          All concepts
        </h2>
        <div className="mt-6 grid gap-4">
          {atlas.concepts.map((concept) => {
            const usedBy = atlas.claims.filter((claim) => claim.conceptIds.includes(concept.id));
            return (
              <article key={concept.id} className={CARD}>
                <h3 className="text-base font-light text-white">
                  <Link href={`${base}/concepts/${concept.id}`} className="hover:text-cyan-200">
                    {concept.label}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{concept.definition}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  {usedBy.length} {usedBy.length === 1 ? 'claim' : 'claims'} ·{' '}
                  {concept.sourceIds.length}{' '}
                  {concept.sourceIds.length === 1 ? 'source' : 'sources'}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <p className="mt-12 text-sm text-zinc-500">
        Machine-readable:{' '}
        <a href={`${base}/concepts.json`} className={LINK}>
          concepts.json
        </a>
      </p>
    </main>
  );
}
