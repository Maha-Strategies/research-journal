// Stage 1 — the atlas envelope.

import { notFound } from 'next/navigation';

import { createRequestStore } from '../_store';
import { formatChangeLog } from '@/lib/atlas/builder/changelog';
import { UpdateAtlasForm } from '../_forms';
import { SECTION_HEADING } from '../_ui';

export default async function AtlasDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = await (await createRequestStore()).getDraft(slug);
  if (!draft) notFound();

  const history = formatChangeLog(draft, 12);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section aria-labelledby="details">
        <h2 id="details" className={SECTION_HEADING}>
          Atlas details
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-500">
          These fields are the editorial envelope. The gateway reads them to describe the atlas
          without opening it, so scope, intended reader, boundary, and exclusions are all published
          as structured content rather than prose on a page.
        </p>
        <div className="mt-8">
          <UpdateAtlasForm draft={draft as unknown as Record<string, unknown>} />
        </div>
      </section>

      <aside>
        <h2 className={SECTION_HEADING}>Change log</h2>
        <p className="mt-5 text-xs leading-relaxed text-zinc-600">
          Private. Records operator activity and is never published; what reaches a reader is the
          release note on each version.
        </p>
        {history.length === 0 ? (
          <p className="mt-5 text-sm text-zinc-600">No changes recorded.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {history.map((entry) => (
              <li key={entry} className="font-mono text-[10px] leading-relaxed text-zinc-500">
                {entry}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
