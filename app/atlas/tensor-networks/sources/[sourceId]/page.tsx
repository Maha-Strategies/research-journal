import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AtlasNav, AtlasShell, TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { SITE_URL } from '@/lib/entity';
import { TN_CLAIMS, TN_CONCEPTS, TN_META, TN_SOURCES, getTnSource, getTnStatus } from '@/lib/atlas/tensor-networks';

type Params = { params: Promise<{ sourceId: string }> };

export function generateStaticParams() {
  return TN_SOURCES.map((source) => ({ sourceId: source.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const source = getTnSource((await params).sourceId);
  if (!source) return { title: 'Source not found' };

  const path = `${TENSOR_ATLAS_PATH}/sources/${source.id}`;
  return {
    title: `${source.title} | ${TN_META.title}`,
    description: source.whyHere,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
  };
}

export default async function TensorSourcePage({ params }: Params) {
  const source = getTnSource((await params).sourceId);
  if (!source) notFound();

  const citingClaims = TN_CLAIMS.filter((claim) => claim.sourceIds.includes(source.id));
  const citingConcepts = TN_CONCEPTS.filter((concept) => concept.sources.includes(source.id));
  const url = `${SITE_URL}${TENSOR_ATLAS_PATH}/sources/${source.id}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': `${url}#source`,
    name: source.title,
    headline: source.title,
    author: source.authors,
    datePublished: String(source.year),
    identifier: source.identifier,
    url: source.url,
    sameAs: source.url,
    isPartOf: { '@id': `${SITE_URL}${TENSOR_ATLAS_PATH}#atlas` },
  };

  return (
    <AtlasShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="mx-auto max-w-3xl">
        <AtlasNav back={{ href: `${TENSOR_ATLAS_PATH}/sources`, label: 'Sources' }} />
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {source.sourceType.replaceAll('-', ' ')} · {source.verification.replaceAll('-', ' ')} {source.verifiedOn}
        </p>
        <h1 className="mt-5 text-2xl font-light leading-snug text-white md:text-3xl">{source.title}</h1>
        <p className="mt-4 text-sm text-zinc-500">{source.authors} · {source.year}</p>

        <dl className="mt-8 grid gap-3 border border-zinc-800 bg-[#121214] p-5 text-sm">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Identifier</dt>
            <dd className="mt-1 font-mono text-zinc-300">{source.identifier}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Canonical URL</dt>
            <dd className="mt-1">
              <a href={source.url} className="break-all text-violet-300 underline" rel="noopener noreferrer">
                {source.url}
              </a>
            </dd>
          </div>
        </dl>

        <section className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Why it is in this atlas</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{source.whyHere}</p>
        </section>

        {citingClaims.length > 0 && (
          <section className="mt-12">
            <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Claims citing this source
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

        {citingConcepts.length > 0 && (
          <section className="mt-12">
            <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Concepts citing this source
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {citingConcepts.map((concept) => (
                <Link
                  key={concept.id}
                  href={`${TENSOR_ATLAS_PATH}/concepts/${concept.id}`}
                  className="border border-zinc-700 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-300 hover:border-violet-400"
                >
                  {concept.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </AtlasShell>
  );
}
