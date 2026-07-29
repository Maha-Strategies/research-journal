// A concept record. Concepts explain; they do not assert.
//
// The distinction is load-bearing: a concept page carries no epistemic status
// because it makes no claim. Where a definition is contested, that belongs in a
// claim record with a status label, not smuggled into a definition.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_URL } from '@/lib/entity';
import {
  PUBLISHED_RELEASES,
  getPublishedConcept,
  getPublishedRelease,
} from '@/lib/atlas/builder/releases';
import { Breadcrumb, CARD, LABEL, LINK, ProvenanceLine, SECTION_HEADING } from '../../_shared';

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_RELEASES.flatMap((release) =>
    release.atlas.concepts.map((concept) => ({ atlasSlug: release.slug, conceptId: concept.id })),
  );
}

type Params = { params: Promise<{ atlasSlug: string; conceptId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { atlasSlug, conceptId } = await params;
  const release = getPublishedRelease(atlasSlug);
  const concept = getPublishedConcept(atlasSlug, conceptId);
  if (!release || !concept) return {};

  const url = `${SITE_URL}/atlas/${atlasSlug}/concepts/${conceptId}`;
  return {
    title: `${concept.label} — ${release.atlas.shortTitle}`,
    description: concept.definition,
    alternates: { canonical: url },
  };
}

export default async function ConceptPage({ params }: Params) {
  const { atlasSlug, conceptId } = await params;
  const release = getPublishedRelease(atlasSlug);
  const concept = getPublishedConcept(atlasSlug, conceptId);
  if (!release || !concept) notFound();

  const { atlas } = release;
  const base = `/atlas/${atlasSlug}`;
  const sources = concept.sourceIds
    .map((id) => atlas.sources.find((source) => source.id === id))
    .filter((source) => source !== undefined);
  const related = concept.related
    .map((id) => atlas.concepts.find((other) => other.id === id))
    .filter((other) => other !== undefined);
  const usedBy = atlas.claims.filter((claim) => claim.conceptIds.includes(concept.id));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Breadcrumb atlasSlug={atlasSlug} atlasTitle={atlas.shortTitle} section={concept.label} />

      <header className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Concept</p>
        <h1 className="mt-4 text-3xl font-light text-white">{concept.label}</h1>
        <ProvenanceLine version={release.version} lastReviewed={atlas.lastReviewed} />
      </header>

      <section aria-labelledby="definition" className="mt-12">
        <h2 id="definition" className={SECTION_HEADING}>
          Definition
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-zinc-300">{concept.definition}</p>
        {concept.scopeNote ? (
          <div className={`mt-6 ${CARD}`}>
            <p className={LABEL}>Scope note</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{concept.scopeNote}</p>
          </div>
        ) : null}
      </section>

      {sources.length > 0 ? (
        <section aria-labelledby="sources" className="mt-12">
          <h2 id="sources" className={SECTION_HEADING}>
            Sources for this definition
          </h2>
          <ul className="mt-6 grid gap-3">
            {sources.map((source) => (
              <li key={source.id} className="text-sm">
                <Link href={`${base}/sources/${source.id}`} className={LINK}>
                  {source.title}
                </Link>
                <span className="ml-2 text-zinc-600">
                  {source.authors}
                  {source.year ? ` · ${source.year}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section aria-labelledby="related" className="mt-12">
          <h2 id="related" className={SECTION_HEADING}>
            Related concepts
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {related.map((other) => (
              <Link
                key={other.id}
                href={`${base}/concepts/${other.id}`}
                className="border border-zinc-800 bg-[#121214] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:border-cyan-900 hover:text-white"
              >
                {other.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {usedBy.length > 0 ? (
        <section aria-labelledby="claims" className="mt-12">
          <h2 id="claims" className={SECTION_HEADING}>
            Claims that use this concept · {usedBy.length}
          </h2>
          <div className="mt-6 grid gap-3">
            {usedBy.map((claim) => (
              <article key={claim.id} className={CARD}>
                <p className={LABEL}>
                  {claim.id} · {claim.status}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  <Link href={`${base}/claims/${claim.id}`} className="hover:text-cyan-200">
                    {claim.claim}
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
