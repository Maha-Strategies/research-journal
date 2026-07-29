// Landing page for a builder-published atlas.
//
// ROUTE SAFETY — read before touching generateStaticParams or dynamicParams.
//
// This dynamic segment sits beside three STATIC siblings:
//   app/atlas/de-sitter-swampland/, /quantum-computing/, /synthetic-intelligence/
// plus the gateway's own static endpoints (manifest.json, claims.json, …).
//
// Two independent things keep those safe:
//
//  1. `dynamicParams = false` means ONLY the paths returned by
//     generateStaticParams are ever served. Anything else 404s. With no
//     published releases the function returns [], so this route tree generates
//     zero pages and cannot collide with anything.
//
//  2. RESERVED_ATLAS_SLUGS (lib/atlas/builder/vocabulary.ts) refuses those
//     slugs at the validation gate, so a release can never claim one even once
//     the corpus is non-empty.
//
// Removing either one would let a builder atlas shadow a hand-authored URL.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import { PUBLISHED_SLUGS, getPublishedRelease } from '@/lib/atlas/builder/releases';
import { buildEndpoints, buildJsonLd, buildPages } from '@/lib/atlas/builder/public-output';
import { CLAIM_STATUS_DEFINITIONS } from '@/lib/atlas/builder/vocabulary';

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_SLUGS.map((atlasSlug) => ({ atlasSlug }));
}

type Params = { params: Promise<{ atlasSlug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  if (!release) return {};

  const url = `${SITE_URL}/atlas/${atlasSlug}`;
  return {
    title: release.atlas.title,
    description: release.atlas.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url,
      title: release.atlas.title,
      description: release.atlas.description,
    },
  };
}

const SECTION_HEADING =
  'border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500';

export default async function AtlasPage({ params }: Params) {
  const { atlasSlug } = await params;
  const release = getPublishedRelease(atlasSlug);
  if (!release) notFound();

  const { atlas } = release;
  const base = `/atlas/${atlasSlug}`;
  const jsonLd = buildJsonLd(release);

  const statusCounts = Object.keys(CLAIM_STATUS_DEFINITIONS)
    .map((status) => ({
      status,
      count: atlas.claims.filter((claim) => claim.status === status).length,
    }))
    .filter((entry) => entry.count > 0);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <nav className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        <Link href="/atlas" className="hover:text-cyan-300">
          Research Atlas Gateway
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{atlas.shortTitle}</span>
      </nav>

      <header className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
          {atlas.statusBadge}
        </p>
        <h1 className="mt-4 text-4xl font-light text-white">{atlas.title}</h1>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-400">{atlas.description}</p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          v{release.version} · reviewed {atlas.lastReviewed}
          {atlas.evidenceCutoff ? ` · evidence through ${atlas.evidenceCutoff}` : ''} ·{' '}
          {atlas.license}
        </p>
      </header>

      <section aria-labelledby="boundary" className="mt-14">
        <h2 id="boundary" className={SECTION_HEADING}>
          Scope and boundary
        </h2>
        <dl className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="border border-zinc-800 bg-[#121214] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              Written for
            </dt>
            <dd className="mt-3 text-sm leading-relaxed text-zinc-400">{atlas.intendedReader}</dd>
          </div>
          <div className="border border-zinc-800 bg-[#121214] p-5">
            <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Scope</dt>
            <dd className="mt-3 text-sm leading-relaxed text-zinc-400">{atlas.scope}</dd>
          </div>
        </dl>

        <div className="mt-5 border border-zinc-800 bg-[#121214] p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            Editorial boundary
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {atlas.editorialBoundary}
          </p>
          <ul className="mt-5 space-y-2">
            {atlas.exclusions.map((exclusion) => (
              <li key={exclusion} className="text-sm leading-relaxed text-zinc-500">
                — {exclusion}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="records" className="mt-14">
        <h2 id="records" className={SECTION_HEADING}>
          Records · {atlas.claims.length} claims · {atlas.concepts.length} concepts ·{' '}
          {atlas.sources.length} sources
        </h2>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {statusCounts.map((entry) => `${entry.count} ${entry.status}`).join(' · ')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {buildPages(atlasSlug).map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="border border-zinc-800 bg-[#121214] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:border-cyan-900 hover:text-white"
            >
              {page.label}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="claims-preview" className="mt-14">
        <h2 id="claims-preview" className={SECTION_HEADING}>
          The claim ledger
        </h2>
        <div className="mt-6 grid gap-4">
          {atlas.claims.map((claim) => (
            <article key={claim.id} className="border border-zinc-800 bg-[#121214] p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                {claim.id} · {claim.status} · {claim.controversy}
              </p>
              <h3 className="mt-3 text-lg font-light leading-relaxed text-white">
                <Link href={`${base}/claims/${claim.id}`} className="hover:text-cyan-200">
                  {claim.claim}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                <span className="text-zinc-600">Does not establish:</span> {claim.limitations}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="endpoints" className="mt-14">
        <h2 id="endpoints" className={SECTION_HEADING}>
          Machine-readable endpoints
        </h2>
        <ul className="mt-6 grid gap-2">
          {buildEndpoints(atlasSlug).map((endpoint) => (
            <li key={endpoint.path} className="text-sm">
              <a
                href={endpoint.path}
                className="font-mono text-xs text-cyan-300 underline underline-offset-4 hover:text-white"
              >
                {endpoint.path}
              </a>
              <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {endpoint.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="methodology-note" className="mt-14">
        <h2 id="methodology-note" className={SECTION_HEADING}>
          How this atlas was made
        </h2>
        <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-400">
          {atlas.methodology}
        </p>
        <p className="mt-5 text-sm leading-relaxed text-zinc-500">
          Self-published and not peer reviewed. Released {release.releasedAt.slice(0, 10)}. The rules
          this atlas follows are written down in the{' '}
          <Link
            href="/standards/maha-provenance-standard"
            className="text-cyan-300 underline underline-offset-4 hover:text-white"
          >
            Maha Provenance Standard
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
