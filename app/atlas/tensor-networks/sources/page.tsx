import type { Metadata } from 'next';

import { AtlasNav, AtlasShell, SourceCard, TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { TN_META, TN_SOURCES } from '@/lib/atlas/tensor-networks';

const PATH = `${TENSOR_ATLAS_PATH}/sources`;

export const metadata: Metadata = {
  title: `Sources | ${TN_META.title}`,
  description: `Source trail for the ${TN_META.title}: ${TN_SOURCES.length} primary papers and reviews, each with a resolved arXiv or DOI identifier.`,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
};

export default function TensorSourcesPage() {
  return (
    <AtlasShell>
      <div className="mx-auto max-w-5xl">
        <AtlasNav back={{ href: TENSOR_ATLAS_PATH, label: TN_META.shortTitle }} />
        <header className="max-w-3xl">
          <h1 className="text-3xl font-light uppercase tracking-wide text-white">Source trail</h1>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">
            {TN_SOURCES.length} sources. Every identifier below was resolved against arXiv or Crossref on{' '}
            {TN_META.lastReviewed}, and the title, authors, and year shown are the ones those records returned.
          </p>
          <p className="mt-5 border-l border-amber-400/45 pl-4 text-sm leading-relaxed text-zinc-400">
            That is identifier verification, not a re-reading of each full text. A reviewer auditing this atlas should
            check the mapping from a claim to a specific result in a specific paper — that is the step where a source trail
            most often goes wrong, and it is the step an identifier check cannot cover.
          </p>
        </header>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {TN_SOURCES.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </div>
    </AtlasShell>
  );
}
