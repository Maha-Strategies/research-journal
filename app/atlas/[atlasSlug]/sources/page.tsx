// The source trail.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import { PUBLISHED_SLUGS, getPublishedRelease } from '@/lib/atlas/builder/releases';
import { VERIFICATION_DEFINITIONS } from '@/lib/atlas/builder/vocabulary';
import { Breadcrumb, CARD, LABEL, LINK, SECTION_HEADING } from '../_shared';

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
    title: `Sources — ${release.atlas.shortTitle}`,
    description: `The source trail for ${release.atlas.title}, with verification tags and the role each source plays.`,
    alternates: { canonical: `${SITE_URL}/atlas/${atlasSlug}/sources` },
  };
}

export default async function SourcesIndex({ params }: Params) {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  if (!release) notFound();

  const { atlas } = release;
  const base = `/atlas/${atlasSlug}`;
  const used = Object.entries(VERIFICATION_DEFINITIONS).filter(([tag]) =>
    atlas.sources.some((source) => source.verification === tag),
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Breadcrumb atlasSlug={atlasSlug} atlasTitle={atlas.shortTitle} section="Sources" />

      <header className="mt-8">
        <h1 className="text-3xl font-light text-white">Source trail</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Every work this atlas rests on, tagged with how far it was checked. The tag describes
          verification, not quality — inclusion is never endorsement.
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {atlas.sources.length} sources · atlas v{release.version}
        </p>
      </header>

      <section aria-labelledby="vocabulary" className="mt-12">
        <h2 id="vocabulary" className={SECTION_HEADING}>
          Verification vocabulary
        </h2>
        <dl className="mt-6 grid gap-4">
          {used.map(([tag, definition]) => (
            <div key={tag} className={CARD}>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                {tag}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-zinc-400">{definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="trail" className="mt-12">
        <h2 id="trail" className={SECTION_HEADING}>
          All sources
        </h2>
        <div className="mt-6 grid gap-4">
          {atlas.sources.map((source) => {
            const cited = atlas.claims.filter(
              (claim) =>
                claim.sourceIds.includes(source.id) ||
                claim.qualifyingSourceIds.includes(source.id),
            );
            return (
              <article key={source.id} className={CARD}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                  {source.verification} · {source.sourceType}
                </p>
                <h3 className="mt-3 text-base font-light leading-relaxed text-white">
                  <Link href={`${base}/sources/${source.id}`} className="hover:text-cyan-200">
                    {source.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  {source.authors}
                  {source.year ? ` · ${source.year}` : ''}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  <span className={LABEL}>why here</span> {source.whyHere}
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  cited by {cited.length} {cited.length === 1 ? 'claim' : 'claims'} · checked{' '}
                  {source.verifiedOn}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <p className="mt-12 text-sm text-zinc-500">
        Machine-readable:{' '}
        <a href={`${base}/sources.json`} className={LINK}>
          sources.json
        </a>
      </p>
    </main>
  );
}
