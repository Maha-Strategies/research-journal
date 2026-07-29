// Shared shell and record cards for the Tensor Network Optimization Atlas.
//
// Kept separate from components/QuantumAtlas.tsx rather than generalized: the
// two atlases have different status vocabularies (this one has a third label,
// `conjecture`) and different record shapes (this one carries benchmark records
// and structural specs). A shared component parameterized over both would have
// to accept a status string it cannot style, which is how a conjecture ends up
// rendered in the same colour as an established result.

import Link from 'next/link';

import type { BenchmarkRecord, TnClaim, TnConcept, TnSource, TnStatus } from '@/lib/atlas/tensor-networks';

export const TENSOR_ATLAS_PATH = '/atlas/tensor-networks';

/**
 * Status colours. `conjecture` is deliberately the coldest of the three — it is
 * the label a reader is most likely to skim past, and the one where doing so
 * changes the meaning of the page.
 */
const statusStyles: Record<TnStatus, string> = {
  established: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200',
  'active-research': 'border-amber-400/50 bg-amber-400/10 text-amber-200',
  conjecture: 'border-sky-400/50 bg-sky-400/10 text-sky-200',
};

export function AtlasShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-violet-500 selection:text-white md:p-24">
      {children}
    </main>
  );
}

export function AtlasNav({ back }: { back?: { href: string; label: string } }) {
  return (
    <nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest">
      <Link href={back?.href ?? '/atlas'} className="text-zinc-500 hover:text-violet-300">
        ← {back?.label ?? 'Atlas index'}
      </Link>
      <span className="flex gap-5">
        <Link href={TENSOR_ATLAS_PATH} className="text-zinc-400 hover:text-violet-300">Atlas</Link>
        <Link href={`${TENSOR_ATLAS_PATH}/concepts`} className="text-zinc-400 hover:text-violet-300">Concepts</Link>
        <Link href={`${TENSOR_ATLAS_PATH}/sources`} className="text-zinc-400 hover:text-violet-300">Sources</Link>
        <Link href={`${TENSOR_ATLAS_PATH}/methodology`} className="text-zinc-400 hover:text-violet-300">Method</Link>
      </span>
    </nav>
  );
}

export function ClaimCard({ claim, label, detail = false }: { claim: TnClaim; label: string; detail?: boolean }) {
  return (
    <article className={detail ? '' : 'border border-zinc-800 bg-[#121214] p-5'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">{claim.id}</span>
        <span className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${statusStyles[claim.status]}`}>
          {label}
        </span>
      </div>
      <h2 className="mt-4 text-base font-light leading-relaxed text-zinc-100 md:text-xl">{claim.claim}</h2>
      <p className="mt-5 text-sm leading-relaxed text-zinc-400">{claim.explanation}</p>
      <div className="mt-6 border-l border-amber-400/45 pl-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Limits of this claim</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{claim.limitations}</p>
      </div>
      {!detail && (
        <Link
          href={`${TENSOR_ATLAS_PATH}/claims/${claim.id}`}
          className="mt-6 inline-block font-mono text-[10px] uppercase tracking-widest text-violet-300 hover:text-white"
        >
          Read claim record →
        </Link>
      )}
    </article>
  );
}

export function ConceptCard({ concept }: { concept: TnConcept }) {
  return (
    <article className="border border-zinc-800 bg-[#121214] p-5">
      <h2 className="text-lg font-light text-white">{concept.label}</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{concept.definition}</p>
      <Link
        href={`${TENSOR_ATLAS_PATH}/concepts/${concept.id}`}
        className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-violet-300 hover:text-white"
      >
        Concept record →
      </Link>
    </article>
  );
}

export function SourceCard({ source }: { source: TnSource }) {
  return (
    <article className="border border-zinc-800 bg-[#121214] p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        {source.sourceType.replaceAll('-', ' ')} · {source.verification.replaceAll('-', ' ')}
      </p>
      <h2 className="mt-4 text-lg font-light text-white">{source.title}</h2>
      <p className="mt-2 text-sm text-zinc-500">{source.authors} · {source.year}</p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">{source.identifier}</p>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{source.whyHere}</p>
      <Link
        href={`${TENSOR_ATLAS_PATH}/sources/${source.id}`}
        className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-violet-300 hover:text-white"
      >
        Source record →
      </Link>
    </article>
  );
}

/**
 * Benchmark cards always render `doesNotEstablish`. It is not conditional and
 * has no collapsed state: the scope limit is the half of a benchmark that gets
 * dropped when a figure is quoted onward, so it is rendered with the same weight
 * as the result itself.
 */
export function BenchmarkCard({ benchmark, source }: { benchmark: BenchmarkRecord; source?: TnSource }) {
  return (
    <article className="border border-zinc-800 bg-[#121214] p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Benchmark record · {benchmark.id}</p>
      <h3 className="mt-4 text-base font-light leading-relaxed text-zinc-100">{benchmark.task}</h3>
      <dl className="mt-5 grid gap-3 text-sm">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Classical method</dt>
          <dd className="mt-1 leading-relaxed text-zinc-400">{benchmark.classicalMethod}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Compared against</dt>
          <dd className="mt-1 leading-relaxed text-zinc-400">{benchmark.comparedAgainst}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Reported result</dt>
          <dd className="mt-1 leading-relaxed text-zinc-400">{benchmark.reportedResult}</dd>
        </div>
      </dl>
      <div className="mt-6 border-l border-amber-400/45 pl-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Does not establish</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{benchmark.doesNotEstablish}</p>
      </div>
      {source && (
        <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Source ·{' '}
          <Link href={`${TENSOR_ATLAS_PATH}/sources/${source.id}`} className="text-violet-300 hover:text-white">
            {source.identifier}
          </Link>
        </p>
      )}
    </article>
  );
}
