// The claim ledger index.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import { PUBLISHED_SLUGS, getPublishedRelease } from '@/lib/atlas/builder/releases';
import { CLAIM_STATUS_DEFINITIONS } from '@/lib/atlas/builder/vocabulary';
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
    title: `Claims — ${release.atlas.shortTitle}`,
    description: `Every claim in ${release.atlas.title}, with its epistemic status, sources, and stated limitations.`,
    alternates: { canonical: `${SITE_URL}/atlas/${atlasSlug}/claims` },
  };
}

export default async function ClaimsIndex({ params }: Params) {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  if (!release) notFound();

  const { atlas } = release;
  const base = `/atlas/${atlasSlug}`;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Breadcrumb atlasSlug={atlasSlug} atlasTitle={atlas.shortTitle} section="Claims" />

      <header className="mt-8">
        <h1 className="text-3xl font-light text-white">The claim ledger</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Every claim carries a stable identifier, an epistemic status, the sources it rests on, and
          an explicit statement of what it does not establish. Claims are the unit you cite.
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {atlas.claims.length} claims · atlas v{release.version} · reviewed {atlas.lastReviewed}
        </p>
      </header>

      <section aria-labelledby="vocabulary" className="mt-12">
        <h2 id="vocabulary" className={SECTION_HEADING}>
          Status vocabulary
        </h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.entries(CLAIM_STATUS_DEFINITIONS).map(([status, definition]) => (
            <div key={status} className={CARD}>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                {status}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-zinc-400">{definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="ledger" className="mt-12">
        <h2 id="ledger" className={SECTION_HEADING}>
          Claims
        </h2>
        <div className="mt-6 grid gap-4">
          {atlas.claims.map((claim) => (
            <article key={claim.id} className={CARD}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                {claim.id} · {claim.status} · {claim.controversy}
              </p>
              <h3 className="mt-3 text-base font-light leading-relaxed text-white">
                <Link href={`${base}/claims/${claim.id}`} className="hover:text-cyan-200">
                  {claim.claim}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                <span className={LABEL}>does not establish</span> {claim.limitations}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {claim.sourceIds.length} supporting
                {claim.qualifyingSourceIds.length > 0
                  ? ` · ${claim.qualifyingSourceIds.length} qualifying`
                  : ''}{' '}
                · reviewed {claim.reviewDate}
              </p>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-12 text-sm text-zinc-500">
        Machine-readable:{' '}
        <a href={`${base}/claims.json`} className={LINK}>
          claims.json
        </a>
      </p>
    </main>
  );
}
