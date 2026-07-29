// A single claim record — the unit a reader cites.
//
// Everything that qualifies the claim renders WITH it: status, controversy,
// confidence, limitations, exclusions, and the sources it rests on. Clause C3
// of the Maha Provenance Standard is the reason — a boundary confined to a
// page footer does not survive being quoted, so it is placed in the record.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import { PUBLISHED_RELEASES, getPublishedClaim, getPublishedRelease } from '@/lib/atlas/builder/releases';
import {
  CLAIM_STATUS_DEFINITIONS,
  VERIFICATION_DEFINITIONS,
} from '@/lib/atlas/builder/vocabulary';
import { Breadcrumb, CARD, LABEL, LINK, ProvenanceLine, SECTION_HEADING } from '../../_shared';

export const dynamicParams = false;

/**
 * Two dynamic segments, so this runs once per parent param and must return the
 * claim ids for that atlas only. Returning every claim id for every atlas would
 * generate cross-product URLs that resolve to nothing.
 */
export function generateStaticParams() {
  return PUBLISHED_RELEASES.flatMap((release) =>
    release.atlas.claims.map((claim) => ({ atlasSlug: release.slug, claimId: claim.id })),
  );
}

type Params = { params: Promise<{ atlasSlug: string; claimId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { atlasSlug, claimId } = await params;
  const release = getPublishedRelease(atlasSlug);
  const claim = getPublishedClaim(atlasSlug, claimId);
  if (!release || !claim) return {};

  const url = `${SITE_URL}/atlas/${atlasSlug}/claims/${claimId}`;
  return {
    title: `${claim.id} — ${release.atlas.shortTitle}`,
    description: claim.claim,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: claim.id, description: claim.claim },
  };
}

export default async function ClaimPage({ params }: Params) {
  const { atlasSlug, claimId } = await params;
  const release = getPublishedRelease(atlasSlug);
  const claim = getPublishedClaim(atlasSlug, claimId);
  if (!release || !claim) notFound();

  const { atlas } = release;
  const base = `/atlas/${atlasSlug}`;
  const supporting = claim.sourceIds
    .map((id) => atlas.sources.find((source) => source.id === id))
    .filter((source) => source !== undefined);
  const qualifying = claim.qualifyingSourceIds
    .map((id) => atlas.sources.find((source) => source.id === id))
    .filter((source) => source !== undefined);
  const concepts = claim.conceptIds
    .map((id) => atlas.concepts.find((concept) => concept.id === id))
    .filter((concept) => concept !== undefined);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Breadcrumb atlasSlug={atlasSlug} atlasTitle={atlas.shortTitle} section={claim.id} />

      <header className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
          {claim.id} · {claim.status} · {claim.controversy} · curator confidence {claim.confidence}
        </p>
        <h1 className="mt-4 text-3xl font-light leading-snug text-white">{claim.claim}</h1>
        <ProvenanceLine
          version={release.version}
          lastReviewed={atlas.lastReviewed}
          reviewDate={claim.reviewDate}
        />
      </header>

      <section aria-labelledby="explanation" className="mt-12">
        <h2 id="explanation" className={SECTION_HEADING}>
          What this means
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">{claim.explanation}</p>
      </section>

      <section aria-labelledby="status" className="mt-12">
        <h2 id="status" className={SECTION_HEADING}>
          Epistemic status
        </h2>
        <div className={`mt-6 ${CARD}`}>
          <p className={LABEL}>{claim.status}</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {CLAIM_STATUS_DEFINITIONS[claim.status]}
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          Status describes the state of the literature. <em>Controversy</em> ({claim.controversy})
          describes how far the field agrees. <em>Confidence</em> ({claim.confidence}) is the
          curator&rsquo;s own read and is not a property of the evidence.
        </p>
      </section>

      <section aria-labelledby="boundary" className="mt-12">
        <h2 id="boundary" className={SECTION_HEADING}>
          What this claim does not establish
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-300">{claim.limitations}</p>
        {claim.exclusions.length > 0 ? (
          <ul className="mt-5 space-y-2">
            {claim.exclusions.map((exclusion) => (
              <li key={exclusion} className="text-sm leading-relaxed text-zinc-500">
                — {exclusion}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section aria-labelledby="evidence" className="mt-12">
        <h2 id="evidence" className={SECTION_HEADING}>
          Evidence · {supporting.length} supporting
          {qualifying.length > 0 ? ` · ${qualifying.length} qualifying` : ''}
        </h2>

        <div className="mt-6 grid gap-4">
          {supporting.map((source) => (
            <article key={source.id} className={CARD}>
              <p className={LABEL}>Supports · {source.verification}</p>
              <h3 className="mt-3 text-base font-light text-white">
                <Link href={`${base}/sources/${source.id}`} className="hover:text-cyan-200">
                  {source.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                {source.authors}
                {source.year ? ` · ${source.year}` : ''}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {VERIFICATION_DEFINITIONS[source.verification]}
              </p>
            </article>
          ))}

          {qualifying.map((source) => (
            <article key={source.id} className={`${CARD} border-l-2 border-l-amber-900/60`}>
              <p className={LABEL}>Qualifies or complicates · {source.verification}</p>
              <h3 className="mt-3 text-base font-light text-white">
                <Link href={`${base}/sources/${source.id}`} className="hover:text-cyan-200">
                  {source.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                {source.authors}
                {source.year ? ` · ${source.year}` : ''}
              </p>
            </article>
          ))}
        </div>
      </section>

      {concepts.length > 0 ? (
        <section aria-labelledby="concepts" className="mt-12">
          <h2 id="concepts" className={SECTION_HEADING}>
            Concepts this claim uses
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                href={`${base}/concepts/${concept.id}`}
                className="border border-zinc-800 bg-[#121214] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:border-cyan-900 hover:text-white"
              >
                {concept.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="mt-14 border-t border-zinc-800 pt-6">
        <p className="text-sm leading-relaxed text-zinc-500">
          Cite this claim by its identifier and the atlas version: <code>{claim.id}</code>, v
          {release.version}. Identifiers are stable and are never reassigned. The machine-readable
          record is in{' '}
          <a href={`${base}/claims.json`} className={LINK}>
            claims.json
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
