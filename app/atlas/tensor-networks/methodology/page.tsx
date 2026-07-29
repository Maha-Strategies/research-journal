import type { Metadata } from 'next';

import { AtlasNav, AtlasShell, TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { TN_BENCHMARKS, TN_META, TN_SOURCES, TN_STATUSES } from '@/lib/atlas/tensor-networks';

const PATH = `${TENSOR_ATLAS_PATH}/methodology`;

export const metadata: Metadata = {
  title: `Methodology | ${TN_META.title}`,
  description: 'How sources are verified, how evidence labels are assigned, and what this atlas refuses to publish.',
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
};

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: 'How a source enters this atlas',
    paragraphs: [
      `Every identifier in the source trail was resolved against an authoritative bibliographic record — the arXiv API for arXiv IDs, Crossref for DOIs — on ${TN_META.lastReviewed}. The title, author list, and year stored in each record are the ones the lookup returned, not the ones an editor remembered.`,
      'This is recorded as identifier verification, and the distinction is deliberate. It establishes that the identifier denotes the paper the record names. It does not establish that a full text was re-read end to end, and this atlas does not claim otherwise.',
      'Identifiers are never written from memory. An arXiv number with a transposed digit still looks exactly like a citation, resolves to a real but different paper or to nothing at all, and survives review precisely because nothing about it looks wrong.',
    ],
  },
  {
    heading: 'How evidence labels are assigned',
    paragraphs: [
      'Three labels are in use rather than the two the Quantum Computing Atlas needs. The third exists because this subject contains a proposed correspondence — the holographic reading of MERA — that is neither a settled result nor an ordinary open engineering question.',
      'Filing a conjecture as active research would flatten that difference. A conjecture with published objections and an unresolved engineering problem call for different degrees of reader trust, and one label cannot carry both.',
    ],
  },
  {
    heading: 'What this atlas will not publish',
    paragraphs: [
      'No performance figure appears here without a resolvable source. The benchmark schema enforces this rather than relying on editorial discipline: a benchmark record has no throughput, speedup, or runtime field, and it requires a source identifier plus an explicit statement of what the result does not establish.',
      'A vendor throughput number, a conference-slide comparison, or a scaling figure with no paper behind it therefore cannot be entered into this atlas at all. This is a structural constraint, not a policy that a future editor can quietly relax.',
      'The atlas also does not assert that classical tensor-network contraction generally outperforms quantum hardware on industrial optimization workloads. That claim circulates widely; none of the sources here establishes it. The absence is recorded as claim tn-014 rather than left to be inferred from silence, because an unstated absence reads as an oversight while a stated one can be checked.',
    ],
  },
  {
    heading: 'Update policy',
    paragraphs: [
      'Claims are versioned with the atlas and carry their own review dates. A new benchmark result can change a claim; a marketing figure cannot.',
      'When a claim changes status — a conjecture resolved, an open question settled — the change is made to the claim record with its review date advanced, so the ledger shows when the field moved rather than presenting the new position as though it had always held.',
    ],
  },
];

export default function TensorMethodologyPage() {
  return (
    <AtlasShell>
      <div className="mx-auto max-w-3xl">
        <AtlasNav back={{ href: TENSOR_ATLAS_PATH, label: TN_META.shortTitle }} />
        <header>
          <h1 className="text-3xl font-light uppercase tracking-wide text-white">Methodology</h1>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">
            {TN_SOURCES.length} sources · {TN_BENCHMARKS.length} benchmark records · edition {TN_META.version} · reviewed{' '}
            {TN_META.lastReviewed}.
          </p>
        </header>

        {SECTIONS.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {section.heading}
            </h2>
            <div className="mt-6 grid gap-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-zinc-400">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Evidence label definitions
          </h2>
          <dl className="mt-6 grid gap-4">
            {TN_STATUSES.map((status) => (
              <div key={status.id} className="border border-zinc-800 bg-[#121214] p-5">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-violet-300">{status.label}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-zinc-400">{status.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </AtlasShell>
  );
}
