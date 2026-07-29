import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AtlasNav, AtlasShell, SourceCard, TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { MAHA_ORGANIZATION_ID, SITE_URL } from '@/lib/entity';
import { TN_CLAIMS, TN_CONCEPTS, TN_META, getTnConcept, getTnSource, getTnStatus } from '@/lib/atlas/tensor-networks';

type Params = { params: Promise<{ conceptId: string }> };

export function generateStaticParams() {
  return TN_CONCEPTS.map((concept) => ({ conceptId: concept.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const concept = getTnConcept((await params).conceptId);
  if (!concept) return { title: 'Concept not found' };

  const path = `${TENSOR_ATLAS_PATH}/concepts/${concept.id}`;
  return {
    title: `${concept.label} | ${TN_META.title}`,
    description: concept.definition,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
  };
}

export default async function TensorConceptPage({ params }: Params) {
  const concept = getTnConcept((await params).conceptId);
  if (!concept) notFound();

  const sources = concept.sources.map(getTnSource).filter((source) => source !== undefined);
  const citingClaims = TN_CLAIMS.filter((claim) => claim.conceptIds.includes(concept.id));
  const url = `${SITE_URL}${TENSOR_ATLAS_PATH}/concepts/${concept.id}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${url}#term`,
    name: concept.label,
    description: concept.definition,
    url,
    inDefinedTermSet: { '@id': `${SITE_URL}${TENSOR_ATLAS_PATH}#vocabulary` },
    publisher: { '@id': MAHA_ORGANIZATION_ID },
  };

  return (
    <AtlasShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="mx-auto max-w-3xl">
        <AtlasNav back={{ href: `${TENSOR_ATLAS_PATH}/concepts`, label: 'Concepts' }} />
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Concept record · edition {TN_META.version}
        </p>
        <h1 className="mt-5 text-3xl font-light text-white">{concept.label}</h1>
        <p className="mt-6 text-base leading-relaxed text-zinc-300">{concept.definition}</p>

        <section className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Why it matters</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{concept.whyItMatters}</p>
        </section>

        {concept.notEstablished && (
          <section className="mt-8 border-l border-amber-400/45 pl-4">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-amber-300">What this does not establish</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{concept.notEstablished}</p>
          </section>
        )}

        {citingClaims.length > 0 && (
          <section className="mt-12">
            <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Claims using this concept
            </h2>
            <ul className="mt-5 grid gap-3">
              {citingClaims.map((claim) => (
                <li key={claim.id}>
                  <Link
                    href={`${TENSOR_ATLAS_PATH}/claims/${claim.id}`}
                    className="block border border-zinc-800 bg-[#121214] p-4 hover:border-violet-400/50"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                      {claim.id} · {getTnStatus(claim.status).label}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-zinc-300">{claim.claim}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Sources
          </h2>
          <div className="mt-6 grid gap-4">
            {sources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Related concepts
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {concept.related.map((id) => (
              <Link
                key={id}
                href={`${TENSOR_ATLAS_PATH}/concepts/${id}`}
                className="border border-zinc-700 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-300 hover:border-violet-400"
              >
                {id.replaceAll('-', ' ')}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </AtlasShell>
  );
}
