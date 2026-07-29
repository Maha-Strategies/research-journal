// How the atlas was made, and the policy for changing it.
//
// The version and review date are two different facts and are shown as such
// (clause V1): one answers "has the artifact changed", the other "has anyone
// re-read the claims lately". Collapsing them hides which kind of change
// occurred.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import { PUBLISHED_SLUGS, getPublishedRelease } from '@/lib/atlas/builder/releases';
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
    title: `Methodology — ${release.atlas.shortTitle}`,
    description: `How ${release.atlas.title} was assembled, what it excludes, and how it is updated.`,
    alternates: { canonical: `${SITE_URL}/atlas/${atlasSlug}/methodology` },
  };
}

export default async function MethodologyPage({ params }: Params) {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  if (!release) notFound();

  const { atlas } = release;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Breadcrumb atlasSlug={atlasSlug} atlasTitle={atlas.shortTitle} section="Methodology" />

      <header className="mt-8">
        <h1 className="text-3xl font-light text-white">Methodology</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
          How this atlas was assembled, what it refuses to do, and how it changes.
        </p>
      </header>

      <section aria-labelledby="method" className="mt-12">
        <h2 id="method" className={SECTION_HEADING}>
          How it was made
        </h2>
        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
          {atlas.methodology}
        </p>
      </section>

      <section aria-labelledby="boundary" className="mt-12">
        <h2 id="boundary" className={SECTION_HEADING}>
          Editorial boundary
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-300">{atlas.editorialBoundary}</p>
        <ul className="mt-6 space-y-3">
          {atlas.exclusions.map((exclusion) => (
            <li key={exclusion} className="text-sm leading-relaxed text-zinc-500">
              — {exclusion}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="updates" className="mt-12">
        <h2 id="updates" className={SECTION_HEADING}>
          Update policy
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-300">{atlas.updatePolicy}</p>
      </section>

      <section aria-labelledby="version" className="mt-12">
        <h2 id="version" className={SECTION_HEADING}>
          Version and review
        </h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          <div className={CARD}>
            <dt className={LABEL}>Version</dt>
            <dd className="mt-3 text-sm text-zinc-300">{release.version}</dd>
          </div>
          <div className={CARD}>
            <dt className={LABEL}>Claims last reviewed</dt>
            <dd className="mt-3 text-sm text-zinc-300">{atlas.lastReviewed}</dd>
          </div>
          <div className={CARD}>
            <dt className={LABEL}>Evidence cutoff</dt>
            <dd className="mt-3 text-sm text-zinc-300">{atlas.evidenceCutoff ?? '—'}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-zinc-500">
          The version and the review date answer different questions: whether the artifact changed,
          and whether anyone has re-read the claims lately. Released{' '}
          {release.releasedAt.slice(0, 10)}.
        </p>
        <div className={`mt-6 ${CARD}`}>
          <p className={LABEL}>Release note</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-400">
            {release.releaseNote}
          </p>
        </div>
      </section>

      <section aria-labelledby="status" className="mt-12">
        <h2 id="status" className={SECTION_HEADING}>
          Review status
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          Self-published and <strong className="text-zinc-200">not peer reviewed</strong>. A stable
          URL and a citation export do not make an artifact a journal article. The rules this atlas
          follows are specified in the{' '}
          <Link href="/standards/maha-provenance-standard" className={LINK}>
            Maha Provenance Standard
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
