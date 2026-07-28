import Link from 'next/link';

import type { SiClaim, SiConcept, SiSource, SiStatus } from '@/lib/atlas/synthetic-intelligence';

export const SYNTHETIC_ATLAS_PATH = '/atlas/synthetic-intelligence';

const statusStyles: Record<SiStatus, string> = {
  established: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200',
  active: 'border-amber-400/50 bg-amber-400/10 text-amber-200',
  conjecture: 'border-violet-400/50 bg-violet-400/10 text-violet-200',
  forecast: 'border-rose-400/50 bg-rose-400/10 text-rose-200',
};

export function StatusBadge({ status, label }: { status: SiStatus; label: string }) {
  return <span className={`inline-block border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${statusStyles[status]}`}>{label}</span>;
}

export function AtlasShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-cyan-500 selection:text-white md:p-24">{children}</main>;
}

export function AtlasNav({ back }: { back?: { href: string; label: string } }) {
  return <nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest"><Link href={back?.href ?? '/'} className="text-zinc-500 transition-colors hover:text-cyan-300">← {back?.label ?? 'Research index'}</Link><span className="flex flex-wrap gap-5"><Link href={SYNTHETIC_ATLAS_PATH} className="text-zinc-400 hover:text-cyan-300">Atlas</Link><Link href={`${SYNTHETIC_ATLAS_PATH}/claims`} className="text-zinc-400 hover:text-cyan-300">Claims</Link><Link href={`${SYNTHETIC_ATLAS_PATH}/comparisons`} className="text-zinc-400 hover:text-cyan-300">Comparisons</Link><Link href={`${SYNTHETIC_ATLAS_PATH}/concepts`} className="text-zinc-400 hover:text-cyan-300">Concepts</Link><Link href={`${SYNTHETIC_ATLAS_PATH}/sources`} className="text-zinc-400 hover:text-cyan-300">Sources</Link><Link href={`${SYNTHETIC_ATLAS_PATH}/methodology`} className="text-zinc-400 hover:text-cyan-300">Method</Link></span></nav>;
}

export function ClaimCard({ claim, statusLabel, detail = false }: { claim: SiClaim; statusLabel: string; detail?: boolean }) {
  return <article className={detail ? '' : 'border border-zinc-800 bg-[#121214] p-5'}>
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">{claim.id}</span><StatusBadge status={claim.status} label={statusLabel} /></div>
    <h2 className={detail ? 'mt-5 text-xl font-light leading-relaxed text-white md:text-2xl' : 'mt-4 text-base font-light leading-relaxed text-zinc-100'}>{claim.claim}</h2>
    <p className="mt-5 text-sm leading-relaxed text-zinc-400">{claim.explanation}</p>
    <div className="mt-6 border-l border-amber-400/45 pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Limits of this claim</p><p className="mt-2 text-sm leading-relaxed text-zinc-400">{claim.limitations}</p></div>
    {!detail && <Link href={`${SYNTHETIC_ATLAS_PATH}/claims/${claim.id}`} className="mt-6 inline-block font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:text-white">Read claim record →</Link>}
  </article>;
}

export function SourceCard({ source }: { source: SiSource }) {
  return <article className="border border-zinc-800 bg-[#121214] p-5"><div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest"><span className="border border-zinc-700 px-2 py-1 text-zinc-300">{source.sourceType.replaceAll('-', ' ')}</span><span className="border border-zinc-700 px-2 py-1 text-zinc-500">Content verified</span></div><h2 className="mt-4 text-lg font-light text-white">{source.title}</h2><p className="mt-2 text-sm text-zinc-500">{source.authors ?? 'Author not recorded'} · {source.year}</p><p className="mt-4 text-sm leading-relaxed text-zinc-400">{source.whyHere}</p><Link href={`${SYNTHETIC_ATLAS_PATH}/sources/${source.id}`} className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:text-white">Source record →</Link></article>;
}

export function ConceptCard({ concept }: { concept: SiConcept }) {
  return <article className="border border-zinc-800 bg-[#121214] p-5"><h2 className="text-lg font-light text-white">{concept.label}</h2><p className="mt-3 text-sm leading-relaxed text-zinc-400">{concept.definition}</p><Link href={`${SYNTHETIC_ATLAS_PATH}/concepts/${concept.id}`} className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:text-white">Concept record →</Link></article>;
}
