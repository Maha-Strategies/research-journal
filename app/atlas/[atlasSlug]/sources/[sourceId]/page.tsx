// A source record.
//
// The page is laid out to keep clause S1 visible: bibliographic fields — the
// ones that belong to the work itself — are separated from curator annotation,
// under headings that say which is which. A reader must be able to tell what
// came from the source and what the curator added, without reading the code.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import {
  PUBLISHED_RELEASES,
  getPublishedRelease,
  getPublishedSource,
} from '@/lib/atlas/builder/releases';
import { VERIFICATION_DEFINITIONS } from '@/lib/atlas/builder/vocabulary';
import { Breadcrumb, CARD, LABEL, LINK, ProvenanceLine, SECTION_HEADING } from '../../_shared';

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_RELEASES.flatMap((release) =>
    release.atlas.sources.map((source) => ({ atlasSlug: release.slug, sourceId: source.id })),
  );
}

type Params = { params: Promise<{ atlasSlug: string; sourceId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { atlasSlug, sourceId } = await params;
  const release = getPublishedRelease(atlasSlug);
  const source = getPublishedSource(atlasSlug, sourceId);
  if (!release || !source) return {};

  const url = `${SITE_URL}/atlas/${atlasSlug}/sources/${sourceId}`;
  return {
    title: `${source.title} — ${release.atlas.shortTitle}`,
    description: source.whyHere,
    alternates: { canonical: url },
  };
}

export default async function SourcePage({ params }: Params) {
  const { atlasSlug, sourceId } = await params;
  const release = getPublishedRelease(atlasSlug);
  const source = getPublishedSource(atlasSlug, sourceId);
  if (!release || !source) notFound();

  const { atlas } = release;
  const base = `/atlas/${atlasSlug}`;
  const supports = atlas.claims.filter((claim) => claim.sourceIds.includes(source.id));
  const qualifies = atlas.claims.filter((claim) => claim.qualifyingSourceIds.includes(source.id));
  const definesConcepts = atlas.concepts.filter((concept) => concept.sourceIds.includes(source.id));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Breadcrumb atlasSlug={atlasSlug} atlasTitle={atlas.shortTitle} section="Source" />

      <header className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
          Source · {source.verification}
        </p>
        <h1 className="mt-4 text-3xl font-light leading-snug text-white">{source.title}</h1>
        <p className="mt-4 text-sm text-zinc-400">
          {source.authors}
          {source.year ? ` · ${source.year}` : ''}
          {source.publisher ? ` · ${source.publisher}` : ''}
        </p>
        <ProvenanceLine version={release.version} lastReviewed={atlas.lastReviewed} />
      </header>

      <section aria-labelledby="bibliographic" className="mt-12">
        <h2 id="bibliographic" className={SECTION_HEADING}>
          From the source
        </h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <div className={CARD}>
            <dt className={LABEL}>Identifier</dt>
            <dd className="mt-3 break-words font-mono text-xs text-zinc-300">
              {source.identifier ?? '—'}
            </dd>
          </div>
          <div className={CARD}>
            <dt className={LABEL}>Year · basis</dt>
            <dd className="mt-3 text-sm text-zinc-300">
              {source.year ?? 'n.d.'}
              <span className="mt-2 block text-xs leading-relaxed text-zinc-500">
                {source.yearBasis}
              </span>
            </dd>
          </div>
        </dl>
        {source.url ? (
          <p className="mt-5 text-sm">
            <a href={source.url} rel="noopener noreferrer nofollow" className={LINK}>
              {source.url}
            </a>
          </p>
        ) : null}
      </section>

      <section aria-labelledby="annotation" className="mt-12">
        <h2 id="annotation" className={SECTION_HEADING}>
          Curator annotation
        </h2>
        <p className="mt-6 text-xs leading-relaxed text-zinc-600">
          Added by the curator, not taken from the source. Kept separate so the boundary between
          bibliographic fact and editorial judgement is visible.
        </p>
        <div className={`mt-5 ${CARD}`}>
          <p className={LABEL}>Source type</p>
          <p className="mt-3 text-sm text-zinc-300">{source.sourceType}</p>
          <p className={`mt-6 ${LABEL}`}>Why this source is here</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{source.whyHere}</p>
          {source.limitations ? (
            <>
              <p className={`mt-6 ${LABEL}`}>What it does not establish</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{source.limitations}</p>
            </>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="verification" className="mt-12">
        <h2 id="verification" className={SECTION_HEADING}>
          Verification · {source.verification}
        </h2>
        <div className={`mt-6 ${CARD}`}>
          <p className="text-sm leading-relaxed text-zinc-400">
            {VERIFICATION_DEFINITIONS[source.verification]}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            checked {source.verifiedOn}
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          Verification states what was checked, never whether the work is correct. Inclusion is not
          endorsement.
        </p>
      </section>

      {supports.length + qualifies.length + definesConcepts.length > 0 ? (
        <section aria-labelledby="used-by" className="mt-12">
          <h2 id="used-by" className={SECTION_HEADING}>
            Where this source is used
          </h2>
          <div className="mt-6 grid gap-3">
            {supports.map((claim) => (
              <p key={`s-${claim.id}`} className="text-sm text-zinc-400">
                <span className={LABEL}>supports</span>{' '}
                <Link href={`${base}/claims/${claim.id}`} className={LINK}>
                  {claim.id}
                </Link>{' '}
                {claim.claim}
              </p>
            ))}
            {qualifies.map((claim) => (
              <p key={`q-${claim.id}`} className="text-sm text-zinc-400">
                <span className={LABEL}>qualifies</span>{' '}
                <Link href={`${base}/claims/${claim.id}`} className={LINK}>
                  {claim.id}
                </Link>{' '}
                {claim.claim}
              </p>
            ))}
            {definesConcepts.map((concept) => (
              <p key={`c-${concept.id}`} className="text-sm text-zinc-400">
                <span className={LABEL}>defines</span>{' '}
                <Link href={`${base}/concepts/${concept.id}`} className={LINK}>
                  {concept.label}
                </Link>
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
