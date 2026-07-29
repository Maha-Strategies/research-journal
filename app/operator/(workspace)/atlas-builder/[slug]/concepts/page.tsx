// Stage 3 — concepts.

import { notFound } from 'next/navigation';

import { createRequestStore } from '../../_store';
import { validateAtlas } from '@/lib/atlas/builder/validate';
import { deleteConcept } from '../../actions';
import { AddConceptForm } from '../../_forms';
import { CARD, SECTION_HEADING } from '../../_ui';

export default async function ConceptsStage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = await (await createRequestStore()).getDraft(slug);
  if (!draft) notFound();

  const validation = validateAtlas(draft);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-labelledby="list">
        <h2 id="list" className={SECTION_HEADING}>
          Concepts · {draft.concepts.length}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-zinc-500">
          Orientation records for the vocabulary a claim uses. Concepts explain; they do not assert.
          If a definition is contested, that belongs in a claim with a status label.
        </p>

        {draft.concepts.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-600">No concepts yet.</p>
        ) : (
          <div className="mt-8 grid gap-4">
            {draft.concepts.map((concept) => {
              const findings = validation.findings.filter(
                (finding) => finding.target.kind === 'concept' && finding.target.id === concept.id,
              );
              const usedBy = draft.claims.filter((claim) => claim.conceptIds.includes(concept.id));
              return (
                <article key={concept.id} className={CARD}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                      {concept.id}
                    </p>
                    <form action={deleteConcept}>
                      <input type="hidden" name="slug" value={slug} />
                      <input type="hidden" name="id" value={concept.id} />
                      <button
                        type="submit"
                        className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 hover:text-amber-400"
                      >
                        remove
                      </button>
                    </form>
                  </div>

                  <h3 className="mt-3 text-sm font-light text-white">{concept.label}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">{concept.definition}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    {concept.sourceIds.length} sources · used by {usedBy.length}{' '}
                    {usedBy.length === 1 ? 'claim' : 'claims'}
                    {concept.related.length > 0 ? ` · related: ${concept.related.join(', ')}` : ''}
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
          Add a concept
        </h2>
        <p className="mt-5 text-xs leading-relaxed text-zinc-600">
          Available source ids:{' '}
          {draft.sources.length > 0
            ? draft.sources.map((source) => source.id).join(', ')
            : 'none yet'}
        </p>
        <div className="mt-8">
          <AddConceptForm slug={slug} />
        </div>
      </section>
    </div>
  );
}
