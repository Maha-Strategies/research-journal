import type { AtlasSourceCard as SourceCard } from '@/lib/atlas/de-sitter';

const VERIFICATION_CLASS: Record<SourceCard['verification'], string> = {
  Verified: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  Foundational: 'border-indigo-400/40 bg-indigo-400/10 text-indigo-200',
  Contextual: 'border-zinc-600 bg-zinc-700/20 text-zinc-300',
};

/**
 * Full source card. Bibliographic fields come from the working paper; the
 * source-type classification and the "why this source is here" note are
 * curator annotation, labelled as such.
 */
export default function AtlasSourceCard({ card }: { card: SourceCard }) {
  return (
    <article className="border border-zinc-800 bg-[#121214] p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${VERIFICATION_CLASS[card.verification]}`}
        >
          {card.verification}
        </span>
        <span className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          {card.sourceTypeLabel}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{card.year}</span>
      </div>

      <h3 className="text-sm font-normal leading-snug text-zinc-100">
        {card.url ? (
          <a href={card.url} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
            {card.label} ↗
          </a>
        ) : (
          card.label
        )}
      </h3>

      <dl className="mt-3 space-y-1 text-xs leading-relaxed text-zinc-400">
        {card.authors && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-zinc-600">Authors</dt>
            <dd>{card.authors}</dd>
          </div>
        )}
        {card.identifier && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-zinc-600">ID</dt>
            <dd className="font-mono">{card.identifier}</dd>
          </div>
        )}
        {card.journal && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-zinc-600">Journal</dt>
            <dd>{card.journal}</dd>
          </div>
        )}
      </dl>

      <p className="mt-4 border-l border-zinc-700 pl-3 text-xs leading-relaxed text-zinc-400">
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Why this source is here — </span>
        {card.whyHere}
      </p>

      {(card.titleNotRecorded || card.yearBasis !== 'arXiv identifier') && (
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
          {card.titleNotRecorded && 'Title not recorded in the source map; named here as the source map names it. '}
          {card.yearBasis !== 'arXiv identifier' && `Year taken from the ${card.yearBasis}.`}
        </p>
      )}
    </article>
  );
}
