// Landing page for the Tensor Network Optimization Atlas.
//
// ROUTE NOTE: this is a STATIC segment, like the other three hand-authored
// atlases. It has no route params, so it has no `generateStaticParams` and
// nothing to await — that pair belongs to app/atlas/[atlasSlug]/, the dynamic
// route the Atlas Builder publishes through. The child routes below
// (claims/[claimId], concepts/[conceptId], sources/[sourceId]) DO take params,
// and each awaits `params` as a Promise per current Next.js conventions.
//
// The slug is registered in RESERVED_ATLAS_SLUGS so a builder release can never
// take /atlas/tensor-networks and shadow this tree.

import type { Metadata } from 'next';
import Link from 'next/link';

import { AtlasNav, AtlasShell, BenchmarkCard, ClaimCard, ConceptCard, SourceCard, TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { MAHA_ORGANIZATION_ID, MAYON_RAJAN_PERSON_ID, SITE_URL } from '@/lib/entity';
import {
  TN_BENCHMARKS,
  TN_CLAIMS,
  TN_CONCEPTS,
  TN_MERA_SPECS,
  TN_META,
  TN_MPS_SPECS,
  TN_QUBO_MAPPINGS,
  TN_SOURCES,
  TN_STATUSES,
  getTnSource,
  getTnStatus,
} from '@/lib/atlas/tensor-networks';

const URL = `${SITE_URL}${TENSOR_ATLAS_PATH}`;

export const metadata: Metadata = {
  title: TN_META.title,
  description: TN_META.description,
  alternates: { canonical: TENSOR_ATLAS_PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', url: URL, title: TN_META.title, description: TN_META.description },
};

const SECTION_HEADING = 'border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500';

export default function TensorNetworkAtlasPage() {
  // JSON-LD graph.
  //
  // Three nodes with explicit @ids that other nodes reference rather than
  // restate: the atlas itself (a TechArticle, because this is a technical
  // exposition rather than a course unit), and a DefinedTermSet holding the
  // concept vocabulary. Publisher and author are @id references into the
  // canonical entity nodes from lib/entity.ts — restating the organization here
  // would mint a second, drifting copy of the publisher.
  const graph = [
    {
      '@type': 'TechArticle',
      '@id': `${URL}#atlas`,
      name: TN_META.title,
      headline: TN_META.title,
      description: TN_META.description,
      url: URL,
      datePublished: TN_META.datePublished,
      dateModified: TN_META.dateModified,
      license: TN_META.license,
      inLanguage: 'en',
      isAccessibleForFree: true,
      creativeWorkStatus: 'Non-peer-reviewed educational research map',
      publisher: { '@id': MAHA_ORGANIZATION_ID },
      author: { '@id': MAYON_RAJAN_PERSON_ID },
      about: { '@id': `${URL}#vocabulary` },
      citation: TN_SOURCES.map((source) => ({
        '@type': 'ScholarlyArticle',
        '@id': `${URL}/sources/${source.id}#source`,
        name: source.title,
        author: source.authors,
        datePublished: String(source.year),
        identifier: source.identifier,
        url: source.url,
      })),
      hasPart: TN_CLAIMS.map((claim) => ({
        '@type': 'Claim',
        '@id': `${URL}/claims/${claim.id}#claim`,
        identifier: claim.id,
        url: `${URL}/claims/${claim.id}`,
        text: claim.claim,
      })),
      encoding: ['metadata.json', 'claims.json', 'sources.json'].map((path) => ({
        '@type': 'MediaObject',
        encodingFormat: 'application/json',
        contentUrl: `${URL}/${path}`,
      })),
    },
    {
      '@type': 'DefinedTermSet',
      '@id': `${URL}#vocabulary`,
      name: `${TN_META.title} — concept vocabulary`,
      url: `${URL}/concepts`,
      publisher: { '@id': MAHA_ORGANIZATION_ID },
      hasDefinedTerm: TN_CONCEPTS.map((concept) => ({
        '@type': 'DefinedTerm',
        '@id': `${URL}/concepts/${concept.id}#term`,
        name: concept.label,
        description: concept.definition,
        url: `${URL}/concepts/${concept.id}`,
        inDefinedTermSet: { '@id': `${URL}#vocabulary` },
      })),
    },
  ];

  const ld = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <AtlasShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-5xl">
        <AtlasNav />

        <header className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-violet-300">
            Source-led research library · evidence through {TN_META.evidenceCutoff}
          </p>
          <h1 className="mt-5 text-3xl font-light uppercase leading-tight tracking-wide text-white md:text-5xl">
            Tensor Network <span className="text-zinc-500">Optimization Atlas</span>
          </h1>
          <p className="mt-7 border-l border-violet-400/40 pl-4 text-base leading-relaxed text-zinc-400">
            {TN_META.description}
          </p>
          <p className="mt-7 inline-block border border-violet-400/35 bg-violet-400/5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-violet-200">
            {TN_META.statusBadge}
          </p>
        </header>

        <section className="mt-14 grid gap-4 md:grid-cols-4">
          {[
            ['Claim records', TN_CLAIMS.length],
            ['Verified sources', TN_SOURCES.length],
            ['Concept records', TN_CONCEPTS.length],
            ['Benchmark records', TN_BENCHMARKS.length],
          ].map(([label, count]) => (
            <div key={String(label)} className="border border-zinc-800 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{label}</p>
              <p className="mt-3 text-3xl font-light text-white">{count}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className={SECTION_HEADING}>Evidence labels</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TN_STATUSES.map((status) => (
              <div key={status.id} className="border border-zinc-800 bg-[#121214] p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-violet-300">{status.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{status.definition}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The holographic framing is addressed head-on rather than left in the
            header as atmosphere, because it is the part of this subject most
            often stated as though it licensed a computational conclusion. */}
        <section className="mt-16">
          <h2 className={SECTION_HEADING}>Theoretical foundation · what carries weight and what does not</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="border border-zinc-800 bg-[#121214] p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">The load-bearing argument</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Tensor networks are efficient when the state they represent carries bounded entanglement across the cuts of
                the network. That is a proven structural fact in one dimension — the area law — and it is what justifies a
                finite bond dimension. Every practical result in this atlas rests on this argument, and on nothing above it.
              </p>
            </div>
            <div className="border border-sky-400/30 bg-sky-400/5 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-sky-300">The holographic reading</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Reading a MERA network as a discretized AdS geometry is a conjecture argued by structural analogy, with
                published consistency conditions that are in tension. It is recorded here because it drives research — not
                because it is settled, and not as a warrant for any performance claim. MPS, MERA, and PEPS were developed
                and analysed as numerical methods independently of it; their cost models stand or fall on entanglement
                scaling, not on holography.
              </p>
              <Link
                href={`${TENSOR_ATLAS_PATH}/claims/tn-005`}
                className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-sky-300 hover:text-white"
              >
                Claim tn-005 →
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={SECTION_HEADING}>Ansatz specifications · MPS</h2>
          <div className="mt-6 grid gap-4">
            {TN_MPS_SPECS.map((spec) => (
              <article key={spec.id} className="border border-zinc-800 bg-[#121214] p-5">
                <h3 className="text-lg font-light text-white">{spec.label}</h3>
                <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Bond dimension · {spec.bondDimension.symbol}
                    </dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{spec.bondDimension.role}</dd>
                    <dd className="mt-2 leading-relaxed text-zinc-500">{spec.bondDimension.entanglementCeiling}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Truncation</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{spec.truncation.criterion}</dd>
                    <dd className="mt-2 leading-relaxed text-zinc-500">
                      Error measure: {spec.truncation.errorMeasure}. {spec.truncation.note}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Canonical form</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{spec.canonicalForm}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Cost scaling</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{spec.costScaling}</dd>
                  </div>
                </dl>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="border-l border-emerald-400/40 pl-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">Applies when</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{spec.appliesWhen}</p>
                  </div>
                  <div className="border-l border-amber-400/45 pl-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Breaks when</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{spec.breaksWhen}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className={SECTION_HEADING}>Ansatz specifications · MERA</h2>
          <div className="mt-6 grid gap-4">
            {TN_MERA_SPECS.map((spec) => (
              <article key={spec.id} className="border border-zinc-800 bg-[#121214] p-5">
                <h3 className="text-lg font-light text-white">{spec.label}</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {spec.nodes.map((node) => (
                    <div key={node.kind} className="border border-zinc-800 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                        {node.kind} · {node.symbol}
                      </p>
                      <p className="mt-2 font-mono text-[10px] text-zinc-500">{node.constraint}</p>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{node.role}</p>
                    </div>
                  ))}
                </div>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Layer structure</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{spec.layerStructure}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Entanglement scaling</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{spec.entanglementScaling}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Cost scaling</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{spec.costScaling}</dd>
                  </div>
                </dl>
                <div className="mt-6 border-l border-amber-400/45 pl-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Breaks when</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{spec.breaksWhen}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className={SECTION_HEADING}>QUBO and Ising mappings</h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-400">
            The mapping is two steps, and they have different epistemic status. Encoding a problem as a spin model is exact.
            Contracting the resulting network is where the approximation lives — and where the original problem&rsquo;s
            hardness reappears. Each record below names that boundary explicitly.
          </p>
          <div className="mt-6 grid gap-4">
            {TN_QUBO_MAPPINGS.map((mapping) => (
              <article key={mapping.id} className="border border-zinc-800 bg-[#121214] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-light text-white">{mapping.label}</h3>
                  <span className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    {mapping.problemForm}
                  </span>
                </div>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Encoding</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{mapping.encoding}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Constraint handling</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{mapping.penaltyHandling}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Tensor construction</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{mapping.tensorConstruction}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Extracted quantity</dt>
                    <dd className="mt-1 leading-relaxed text-zinc-400">{mapping.extractedQuantity}</dd>
                  </div>
                </dl>
                <div className="mt-6 border-l border-amber-400/45 pl-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Approximation enters at</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{mapping.approximationEntersAt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className={SECTION_HEADING}>Benchmark records · {TN_BENCHMARKS.length}</h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-400">
            This atlas records benchmarks as attributed comparisons, not as performance figures. Every record names its task,
            its classical method, what it was compared against, and what it does not establish. There is no throughput or
            speedup field in the schema — a number without a resolvable source cannot be entered here at all.
          </p>
          <div className="mt-6 grid gap-4">
            {TN_BENCHMARKS.map((benchmark) => (
              <BenchmarkCard key={benchmark.id} benchmark={benchmark} source={getTnSource(benchmark.sourceId)} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex justify-between border-b border-zinc-800 pb-3">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Claim ledger · {TN_CLAIMS.length}
            </h2>
            <a href={`${TENSOR_ATLAS_PATH}/claims.json`} className="font-mono text-[10px] text-violet-300">
              claims.json ↗
            </a>
          </div>
          <div className="mt-6 grid gap-4">
            {TN_CLAIMS.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} label={getTnStatus(claim.status).label} />
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Concept library</h2>
              <Link href={`${TENSOR_ATLAS_PATH}/concepts`} className="font-mono text-[10px] text-violet-300">
                All concepts →
              </Link>
            </div>
            <div className="mt-6 grid gap-4">
              {TN_CONCEPTS.slice(0, 4).map((concept) => (
                <ConceptCard key={concept.id} concept={concept} />
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Source library</h2>
              <Link href={`${TENSOR_ATLAS_PATH}/sources`} className="font-mono text-[10px] text-violet-300">
                All sources →
              </Link>
            </div>
            <div className="mt-6 grid gap-4">
              {TN_SOURCES.slice(0, 4).map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-zinc-800 pt-7 text-xs leading-relaxed text-zinc-500">
          Educational, non-peer-reviewed research map.{' '}
          <Link className="text-violet-300 underline" href={`${TENSOR_ATLAS_PATH}/methodology`}>
            Methodology and update policy
          </Link>{' '}
          ·{' '}
          <Link className="text-violet-300 underline" href="/atlas/quantum-computing">
            Quantum Computing Atlas
          </Link>{' '}
          ·{' '}
          <a className="text-violet-300 underline" href={`${TENSOR_ATLAS_PATH}/metadata.json`}>
            metadata.json
          </a>{' '}
          ·{' '}
          <a className="text-violet-300 underline" href={`${TENSOR_ATLAS_PATH}/context.txt`}>
            context.txt
          </a>
          .
        </footer>
      </div>
    </AtlasShell>
  );
}
