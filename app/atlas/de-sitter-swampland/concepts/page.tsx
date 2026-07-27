import type { Metadata } from 'next';
import Link from 'next/link';

import { ATLAS_META, ATLAS_NODES, ATLAS_PATH, getConceptUrl, getStatus } from '@/lib/atlas/de-sitter';

const SITE_URL = 'https://research.mahastrategies.com';
const URL = `${SITE_URL}${ATLAS_PATH}/concepts`;

export const metadata: Metadata = {
  title: `Concept Library | ${ATLAS_META.shortTitle}`,
  description: 'Sixteen source-bounded concept records for navigating the de Sitter problem in the string/M-theory swampland program.',
  alternates: { canonical: `${ATLAS_PATH}/concepts` },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', url: URL, title: `Concept Library | ${ATLAS_META.shortTitle}`, description: 'Source-bounded concept records with claim and literature links.' },
};

export default function AtlasConceptLibraryPage() {
  const libraryLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${URL}#page`,
    url: URL,
    name: `${ATLAS_META.title} — Concept Library`,
    isPartOf: { '@id': `${SITE_URL}${ATLAS_PATH}#atlas` },
    hasPart: ATLAS_NODES.map((node) => ({ '@type': 'DefinedTerm', name: node.label, url: `${SITE_URL}${getConceptUrl(node.id)}` })),
  };

  return <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-indigo-500 selection:text-white md:p-24"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(libraryLd) }} /><div className="mx-auto max-w-5xl"><nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest"><Link href={ATLAS_PATH} className="text-zinc-500 hover:text-indigo-300">← {ATLAS_META.shortTitle}</Link><Link href={`${ATLAS_PATH}/sources`} className="text-zinc-400 hover:text-indigo-300">Source library →</Link></nav><header className="max-w-3xl"><p className="font-mono text-[10px] uppercase tracking-widest text-indigo-300">Atlas library · {ATLAS_NODES.length} concepts</p><h1 className="mt-4 text-3xl font-light text-white md:text-5xl">Concepts, with their boundaries intact.</h1><p className="mt-6 text-sm leading-relaxed text-zinc-400">These are curator-written orientation records based only on the Atlas source set. Each page keeps its epistemic status and its “does not establish” boundary next to the relevant claims and sources.</p></header><section className="mt-12 grid gap-4 md:grid-cols-2">{ATLAS_NODES.map((node) => { const status = getStatus(node.status); return <article key={node.id} className="border border-zinc-800 bg-[#121214] p-5"><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-light text-white"><Link href={getConceptUrl(node.id)} className="hover:text-indigo-300">{node.label}</Link></h2><span className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${status.badgeClass}`}>{status.label}</span></div><p className="mt-4 text-sm leading-relaxed text-zinc-400">{node.definition}</p><Link href={getConceptUrl(node.id)} className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-indigo-300 hover:text-white">Open concept record →</Link></article>})}</section><p className="mt-12 text-xs leading-relaxed text-zinc-600">The status labels describe the standing of the record’s central statement, not the importance of the topic. This is an educational, non-peer-reviewed navigation layer, not a consensus statement.</p></div></main>;
}
