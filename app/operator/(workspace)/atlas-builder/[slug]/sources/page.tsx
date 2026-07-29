// Stage 2 — sources.

import { notFound } from 'next/navigation';

import { createRequestStore } from '../../_store';
import { validateAtlas } from '@/lib/atlas/builder/validate';
import { deleteSource } from '../../actions';
import { AddSourceForm } from '../../_forms';
import { CARD, SECTION_HEADING } from '../../_ui';

export default async function SourcesStage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = await (await createRequestStore()).getDraft(slug);
  if (!draft) notFound();

  const validation = validateAtlas(draft);
  const findingsFor = (id: string) =>
    validation.findings.filter(
      (finding) => finding.target.kind === 'source' && finding.target.id === id,
    );

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-labelledby="list">
        <h2 id="list" className={SECTION_HEADING}>
          Sources · {draft.sources.length}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-zinc-500">
          Bibliographic fields belong to the work; source type and &ldquo;why this source is
          here&rdquo; are yours. The published record labels which is which.
        </p>

        {draft.sources.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-600">
            No sources yet. A claim cannot be written until at least one exists.
          </p>
        ) : (
          <div className="mt-8 grid gap-4">
            {draft.sources.map((source) => {
              const findings = findingsFor(source.id);
              const citedBy = draft.claims.filter(
                (claim) =>
                  claim.sourceIds.includes(source.id) ||
                  claim.qualifyingSourceIds.includes(source.id),
              );
              return (
                <article key={source.id} className={CARD}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                      {source.id} · {source.verification}
                    </p>
                    <form action={deleteSource}>
                      <input type="hidden" name="slug" value={slug} />
                      <input type="hidden" name="id" value={source.id} />
                      <button
                        type="submit"
                        className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:text-amber-400"
                      >
                        remove
                      </button>
                    </form>
                  </div>

                  <h3 className="mt-3 text-sm font-light leading-relaxed text-white">
                    {source.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500">
                    {source.authors}
                    {source.year ? ` · ${source.year}` : ' · undated'}
                    {source.identifier ? ` · ${source.identifier}` : ''}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    {source.sourceType} · checked {source.verifiedOn} · cited by {citedBy.length}{' '}
                    {citedBy.length === 1 ? 'claim' : 'claims'}
                  </p>

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
          Add a source
        </h2>
        <div className="mt-8">
          <AddSourceForm slug={slug} />
        </div>
      </section>
    </div>
  );
}
