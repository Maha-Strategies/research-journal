import type { Metadata } from 'next';
import Link from 'next/link';

import AtlasSourceCard from '@/components/AtlasSourceCard';
import { ATLAS_META, ATLAS_PATH, getSourceCards } from '@/lib/atlas/de-sitter';

const SITE_URL = 'https://research.mahastrategies.com';
const URL = `${SITE_URL}${ATLAS_PATH}/sources`;

export const metadata: Metadata = {
  title: `Source Library | ${ATLAS_META.shortTitle}`,
  description: 'Annotated, source-bounded records for the literature cited by the de Sitter / String Swampland Atlas.',
  alternates: { canonical: `${ATLAS_PATH}/sources` },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', url: URL, title: `Source Library | ${ATLAS_META.shortTitle}`, description: 'Annotated source records with verification labels, claims, and concept links.' },
};

export default function AtlasSourceLibraryPage() {
  const cards = getSourceCards();
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${URL}#page`, url: URL, name: `${ATLAS_META.title} — Source Library`, isPartOf: { '@id': `${SITE_URL}${ATLAS_PATH}#atlas` }, hasPart: cards.map((card) => ({ '@type': 'CreativeWork', name: card.label, url: `${URL}/${card.id}`, ...(card.identifier ? { identifier: card.identifier } : {}) })) };
  return <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-indigo-500 selection:text-white md:p-24"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} /><div className="mx-auto max-w-5xl"><nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest"><Link href={ATLAS_PATH} className="text-zinc-500 hover:text-indigo-300">← {ATLAS_META.shortTitle}</Link><Link href={`${ATLAS_PATH}/concepts`} className="text-zinc-400 hover:text-indigo-300">Concept library →</Link></nav><header className="max-w-3xl"><p className="font-mono text-[10px] uppercase tracking-widest text-indigo-300">Atlas library · {cards.length} sources</p><h1 className="mt-4 text-3xl font-light text-white md:text-5xl">A source trail you can follow.</h1><p className="mt-6 text-sm leading-relaxed text-zinc-400">Each record preserves what the working paper recorded, why the Atlas uses it, and its verification label. A verified identifier means it was resolved and correctly placed in the map—not that its argument is endorsed or that the field agrees with it.</p></header><section className="mt-12 grid gap-4">{cards.map((card) => <AtlasSourceCard key={card.id} card={card} />)}</section><footer className="mt-12 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-600">Bibliographic fields come from the cited working paper. Source type and “why this source is here” are curator annotation. No source outside that verified citation set is added here.</footer></div></main>;
}
