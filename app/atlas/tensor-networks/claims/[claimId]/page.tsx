import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AtlasNav, AtlasShell, BenchmarkCard, ClaimCard, SourceCard, TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { MAHA_ORGANIZATION_ID, MAYON_RAJAN_PERSON_ID, SITE_URL } from '@/lib/entity';
import { TN_CLAIMS, TN_META, getTnBenchmark, getTnClaim, getTnSource, getTnStatus } from '@/lib/atlas/tensor-networks';

type Params = { params: Promise<{ claimId: string }> };

export function generateStaticParams() {
  return TN_CLAIMS.map((claim) => ({ claimId: claim.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const claim = getTnClaim((await params).claimId);
  if (!claim) return { title: 'Claim not found' };

  const path = `${TENSOR_ATLAS_PATH}/claims/${claim.id}`;
  return {
    title: `${claim.id} — ${getTnStatus(claim.status).label} | ${TN_META.title}`,
    description: claim.claim,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { type: 'article', url: `${SITE_URL}${path}`, title: claim.claim, description: claim.explanation },
  };
}

export default async function TensorClaimPage({ params }: Params) {
  const claim = getTnClaim((await params).claimId);
  if (!claim) notFound();

  const sources = claim.sourceIds.map(getTnSource).filter((source) => source !== undefined);
  const benchmarks = (claim.benchmarkIds ?? []).map(getTnBenchmark).filter((benchmark) => benchmark !== undefined);
  const url = `${SITE_URL}${TENSOR_ATLAS_PATH}/claims/${claim.id}`;

  // The claim node points at the atlas and the publisher by @id rather than
  // restating either. `citation` carries the resolved source records so a
  // consumer reading only this page still gets the evidence trail.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Claim',
    '@id': `${url}#claim`,
    identifier: claim.id,
    url,
    text: claim.claim,
    description: claim.explanation,
    dateModified: claim.reviewDate,
    isPartOf: { '@id': `${SITE_URL}${TENSOR_ATLAS_PATH}#atlas` },
    publisher: { '@id': MAHA_ORGANIZATION_ID },
    author: { '@id': MAYON_RAJAN_PERSON_ID },
    citation: sources.map((source) => ({
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}${TENSOR_ATLAS_PATH}/sources/${source.id}#source`,
      name: source.title,
      author: source.authors,
      datePublished: String(source.year),
      identifier: source.identifier,
      url: source.url,
    })),
  };

  return (
    <AtlasShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="mx-auto max-w-3xl">
        <AtlasNav back={{ href: TENSOR_ATLAS_PATH, label: TN_META.shortTitle }} />
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Claim record · edition {TN_META.version}
        </p>
        <ClaimCard claim={claim} label={getTnStatus(claim.status).label} detail />

        {benchmarks.length > 0 && (
          <section className="mt-12">
            <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Benchmark records behind this claim
            </h2>
            <div className="mt-6 grid gap-4">
              {benchmarks.map((benchmark) => (
                <BenchmarkCard key={benchmark.id} benchmark={benchmark} source={getTnSource(benchmark.sourceId)} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Supporting sources
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
            {claim.conceptIds.map((id) => (
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
