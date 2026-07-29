// Stage 6 — release.
//
// Two gates, deliberately not one button:
//
//   APPROVE  records that a human read the validation report.
//   RELEASE  publishes, and requires the slug typed back.
//
// Collapsing them would make "I have checked this" and "put it on the internet"
// the same click. The version history below is the other half of clause V2: a
// published version is never rewritten, so every release stays readable and any
// of them can be restored.

import { notFound } from 'next/navigation';

import { createRequestStore } from '../../_store';
import { canRelease } from '@/lib/atlas/builder/validate';
import { compareVersions } from '@/lib/atlas/builder/release';
import { ApproveForm, ArchiveForm, ReleaseForm, RevokeApprovalForm } from '../../_forms';
import { CARD, SECTION_HEADING } from '../../_ui';

export default async function ReleaseStage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await createRequestStore();
  const draft = await store.getDraft(slug);
  if (!draft) notFound();

  const history = (await store.listReleases(slug)).sort((a, b) =>
    compareVersions(a.version, b.version),
  );
  const published = await store.getPublished();
  const live = published.find((record) => record.slug === slug);
  const gate = canRelease(draft, { approved: draft.state === 'approved' });

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-labelledby="gate">
        <h2 id="gate" className={SECTION_HEADING}>
          Release gate
        </h2>

        <div className={`mt-6 ${CARD}`}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            current state
          </p>
          <p className="mt-3 text-lg font-light text-white">
            {draft.state} · v{draft.version}
          </p>
          {gate.allowed ? (
            <p className="mt-4 text-sm leading-relaxed text-cyan-300">
              Ready to publish. This will create {draft.claims.length + draft.concepts.length + draft.sources.length + 5}{' '}
              public URLs under /atlas/{slug}.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {gate.reasons.map((reason) => (
                <li key={reason} className="text-sm leading-relaxed text-amber-300">
                  — {reason}
                </li>
              ))}
            </ul>
          )}
        </div>

        {draft.state === 'draft' && gate.validation.ok ? (
          <div className="mt-8">
            <p className="mb-5 text-sm leading-relaxed text-zinc-500">
              Approval records that you read the validation report. It does not publish anything.
            </p>
            <ApproveForm slug={slug} />
          </div>
        ) : null}

        {draft.state === 'approved' ? (
          <>
            <div className="mt-8">
              <p className="mb-5 text-sm leading-relaxed text-zinc-500">
                Publishing writes an immutable release to{' '}
                <code className="text-zinc-400">content/atlas-releases/</code> and adds the atlas to
                the served corpus. Commit that directory to deploy it. Any previously published
                version is marked superseded, never overwritten.
              </p>
              <ReleaseForm slug={slug} version={draft.version} />
            </div>
            <div className="mt-10 border-t border-zinc-800 pt-8">
              <p className="mb-5 text-sm leading-relaxed text-zinc-500">
                Not ready after all?
              </p>
              <RevokeApprovalForm slug={slug} />
            </div>
          </>
        ) : null}

        {live ? (
          <div className="mt-10 border-t border-zinc-800 pt-8">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              Withdraw from publication
            </h3>
            <p className="my-5 text-sm leading-relaxed text-zinc-500">
              Removes the atlas from the served corpus. Every released version stays in the archive,
              so this is a deprecation, not a deletion.
            </p>
            <ArchiveForm slug={slug} version={live.version} />
          </div>
        ) : null}
      </section>

      <section aria-labelledby="history">
        <h2 id="history" className={SECTION_HEADING}>
          Version history · {history.length}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-zinc-500">
          Every release ever cut for this slug. Published versions are never rewritten — a
          correction becomes a new version, and the superseded one stays readable.
        </p>

        {history.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-600">Never released.</p>
        ) : (
          <div className="mt-8 grid gap-4">
            {history.map((record) => (
              <article key={record.version} className={CARD}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                  v{record.version} · {record.state}
                </p>
                <p className="mt-3 text-xs text-zinc-500">
                  released {record.releasedAt.slice(0, 16).replace('T', ' ')} by {record.releasedBy}
                </p>
                {record.supersedes ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    supersedes v{record.supersedes}
                  </p>
                ) : null}
                {record.supersededBy ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    superseded by v{record.supersededBy}
                  </p>
                ) : null}
                <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-zinc-400">
                  {record.releaseNote}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
