import Link from 'next/link';

import {
  ATLAS_META,
  ATLAS_PATH,
  getClaimUrl,
  getNode,
  getSource,
  getStatus,
  type AtlasClaim,
} from '@/lib/atlas/de-sitter';

/**
 * One claim, rendered identically on the ledger and on its own route so the
 * two can never drift. The ledger variant links out to the claim route; the
 * detail variant is the claim route itself and links back to the ledger.
 */
export default function AtlasClaimArticle({
  claim,
  variant,
}: {
  claim: AtlasClaim;
  variant: 'ledger' | 'detail';
}) {
  const status = getStatus(claim.status);
  const isDetail = variant === 'detail';

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          {claim.ref}
        </span>
        <span className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${status.badgeClass}`}>
          {status.label}
          {claim.statusNote ? ` · ${claim.statusNote}` : ''}
        </span>
      </div>

      <p className={`mb-5 font-light leading-relaxed text-zinc-100 ${isDetail ? 'text-lg md:text-xl' : 'text-base'}`}>
        {claim.claim}
      </p>

      <dl className="space-y-5 text-sm leading-relaxed text-zinc-400">
        <div>
          <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Why it is stated this way
          </dt>
          <dd>{claim.explanation}</dd>
        </div>

        <div>
          <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Scope and limitations
          </dt>
          <dd className="border-l border-amber-400/40 pl-4">{claim.limitations}</dd>
        </div>

        <div>
          <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Sources</dt>
          <dd>
            <ul className="space-y-1.5">
              {claim.sources.map((id) => {
                const source = getSource(id);
                if (!source) return null;
                return (
                  <li key={id} className="text-xs leading-relaxed">
                    {source.url ? (
                      <a href={source.url} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                        {source.label} ↗
                      </a>
                    ) : (
                      <span className="text-zinc-300">{source.label}</span>
                    )}
                    {source.authors && <span> · {source.authors}</span>}
                    {source.identifier && <span> · {source.identifier}</span>}
                    {source.journal && <span> · {source.journal}</span>}
                  </li>
                );
              })}
            </ul>
          </dd>
        </div>

        <div>
          <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Related atlas concepts
          </dt>
          <dd className="flex flex-wrap gap-2">
            {claim.conceptIds.map((id) => {
              const node = getNode(id);
              if (!node) return null;
              return (
                <Link
                  key={id}
                  href={`${ATLAS_PATH}#concept-${id}`}
                  className="inline-flex min-h-11 items-center border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-indigo-400 hover:text-white"
                >
                  {node.label}
                </Link>
              );
            })}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Last reviewed {claim.reviewDate} · Atlas v{ATLAS_META.version}
        </p>
        {isDetail ? (
          <Link
            href={`${ATLAS_PATH}#claim-${claim.ref}`}
            className="font-mono text-[10px] uppercase tracking-widest text-indigo-300 underline"
          >
            ← Back to the ledger
          </Link>
        ) : (
          <Link
            href={getClaimUrl(claim)}
            className="font-mono text-[10px] uppercase tracking-widest text-indigo-300 underline"
          >
            Permalink to {claim.ref} →
          </Link>
        )}
      </div>
    </div>
  );
}
