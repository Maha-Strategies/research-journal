// Stage 4 — claims.
//
// Each claim card shows its evidence as a resolved list rather than a set of
// ids, so a broken link is visible as a broken link. A claim whose only support
// is an excluded source reads as unsupported here, which is what it is.

import { notFound } from 'next/navigation';

import { createRequestStore } from '../../_store';
import { validateAtlas } from '@/lib/atlas/builder/validate';
import { deleteClaim } from '../../actions';
import { AddClaimForm } from '../../_forms';
import { CARD, SECTION_HEADING } from '../../_ui';

export default async function ClaimsStage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = await (await createRequestStore()).getDraft(slug);
  if (!draft) notFound();

  const validation = validateAtlas(draft);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-labelledby="list">
        <h2 id="list" className={SECTION_HEADING}>
          Claims · {draft.claims.length}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-zinc-500">
          The unit a reader cites. Every claim needs at least one supporting source and a stated
          boundary — both are required by the record shape itself, so a claim missing either cannot
          be created.
        </p>

        {draft.claims.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-600">No claims yet.</p>
        ) : (
          <div className="mt-8 grid gap-4">
            {draft.claims.map((claim) => {
              const findings = validation.findings.filter(
                (finding) => finding.target.kind === 'claim' && finding.target.id === claim.id,
              );
              const resolve = (id: string) => draft.sources.find((source) => source.id === id);

              return (
                <article key={claim.id} className={CARD}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                      {claim.id} · {claim.status} · {claim.controversy} · confidence{' '}
                      {claim.confidence}
                    </p>
                    <form action={deleteClaim}>
                      <input type="hidden" name="slug" value={slug} />
                      <input type="hidden" name="id" value={claim.id} />
                      <button
                        type="submit"
                        className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:text-amber-400"
                      >
                        remove
                      </button>
                    </form>
                  </div>

                  <h3 className="mt-3 text-sm font-light leading-relaxed text-white">
                    {claim.claim}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                    <span className="font-mono uppercase tracking-widest text-zinc-600">
                      does not establish
                    </span>{' '}
                    {claim.limitations}
                  </p>

                  {/* Evidence as resolved links, so a dangling id is obvious. */}
                  <div className="mt-4 border-t border-zinc-800 pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                      evidence
                    </p>
                    <ul className="mt-2 space-y-1">
                      {claim.sourceIds.map((id) => {
                        const source = resolve(id);
                        return (
                          <li key={`s-${id}`} className="text-xs leading-relaxed">
                            {source ? (
                              <span className="text-zinc-400">
                                <span className="text-cyan-500">supports</span> {source.title}{' '}
                                <span className="text-zinc-600">({source.verification})</span>
                              </span>
                            ) : (
                              <span className="text-amber-300">
                                supports → missing source &ldquo;{id}&rdquo;
                              </span>
                            )}
                          </li>
                        );
                      })}
                      {claim.qualifyingSourceIds.map((id) => {
                        const source = resolve(id);
                        return (
                          <li key={`q-${id}`} className="text-xs leading-relaxed">
                            {source ? (
                              <span className="text-zinc-400">
                                <span className="text-amber-500">qualifies</span> {source.title}
                              </span>
                            ) : (
                              <span className="text-amber-300">
                                qualifies → missing source &ldquo;{id}&rdquo;
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {findings.map((finding, index) => (
                    <p
                      key={`${finding.code}-${index}`}
                      className={`mt-3 text-xs leading-relaxed ${
                        finding.severity === 'error' ? 'text-amber-300' : 'text-zinc-500'
                      }`}
                    >
                      {finding.severity === 'error' ? '✗' : '·'} {finding.message}
                    </p>
                  ))}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="add">
        <h2 id="add" className={SECTION_HEADING}>
          Add a claim
        </h2>
        <p className="mt-5 text-xs leading-relaxed text-zinc-600">
          Source ids:{' '}
          {draft.sources.length > 0
            ? draft.sources.map((source) => source.id).join(', ')
            : 'none yet — add a source first'}
          <br />
          Concept ids:{' '}
          {draft.concepts.length > 0
            ? draft.concepts.map((concept) => concept.id).join(', ')
            : 'none yet'}
        </p>
        <div className="mt-8">
          <AddClaimForm slug={slug} />
        </div>
      </section>
    </div>
  );
}
