// The workspace: every draft, plus the two ways to start one.

import Link from 'next/link';

import { createRequestStore } from './_store';
import { validateAtlas } from '@/lib/atlas/builder/validate';
import { PUBLISHED_RELEASES } from '@/lib/atlas/builder/releases';
import { CreateAtlasForm, ImportAtlasForm } from './_forms';
import { CARD, SECTION_HEADING } from './_ui';

export default async function WorkspacePage() {
  const store = await createRequestStore();
  const drafts = await store.listDrafts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <header>
        <h1 className="text-3xl font-light text-white">Atlas Builder</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
          The private counterpart to the Research Atlas Gateway. Work moves through sources →
          concepts → claims → review → release. Nothing reaches a public URL until a release is
          explicitly approved and published.
        </p>
      </header>

      <section aria-labelledby="drafts" className="mt-12">
        <h2 id="drafts" className={SECTION_HEADING}>
          Drafts · {drafts.length}
        </h2>

        {drafts.length === 0 ? (
          <p className="mt-6 text-sm leading-relaxed text-zinc-500">
            No drafts yet. Create one below, or import a{' '}
            <code className="text-zinc-400">maha-atlas-portable</code> file —{' '}
            <code className="text-zinc-400">docs/atlas-builder-example.json</code> is a worked
            example you can paste in.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {drafts.map((draft) => {
              const validation = validateAtlas(draft);
              return (
                <article key={draft.slug} className={CARD}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                        {draft.state} · v{draft.version}
                      </p>
                      <h3 className="mt-3 text-xl font-light text-white">
                        <Link
                          href={`/operator/atlas-builder/${draft.slug}`}
                          className="hover:text-cyan-200"
                        >
                          {draft.title}
                        </Link>
                      </h3>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                        {draft.slug}
                      </p>
                    </div>
                    <p
                      className={`font-mono text-[10px] uppercase tracking-widest ${
                        validation.ok ? 'text-cyan-400' : 'text-amber-400'
                      }`}
                    >
                      {validation.ok
                        ? 'passes validation'
                        : `${validation.errors.length} blocking`}
                      {validation.warnings.length > 0 ? (
                        <>
                          <br />
                          {validation.warnings.length} advisory
                        </>
                      ) : null}
                    </p>
                  </div>

                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    {draft.claims.length} claims · {draft.concepts.length} concepts ·{' '}
                    {draft.sources.length} sources · updated {draft.updatedAt.slice(0, 16).replace('T', ' ')}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="published" className="mt-12">
        <h2 id="published" className={SECTION_HEADING}>
          Published by this builder · {PUBLISHED_RELEASES.length}
        </h2>
        {PUBLISHED_RELEASES.length === 0 ? (
          <p className="mt-6 text-sm leading-relaxed text-zinc-500">
            Nothing published. The three existing atlases — de Sitter, Quantum Computing, Synthetic
            Intelligence — are hand-authored and are not managed here. This builder cannot modify
            them; their slugs are reserved.
          </p>
        ) : (
          <div className="mt-6 grid gap-3">
            {PUBLISHED_RELEASES.map((release) => (
              <article key={release.slug} className={CARD}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                  live · v{release.version} · released {release.releasedAt.slice(0, 10)}
                </p>
                <h3 className="mt-3 text-lg font-light text-white">{release.atlas.title}</h3>
                <a
                  href={`/atlas/${release.slug}`}
                  className="mt-2 inline-block font-mono text-[10px] uppercase tracking-widest text-cyan-300 underline underline-offset-4"
                >
                  /atlas/{release.slug}
                </a>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="create">
          <h2 id="create" className={SECTION_HEADING}>
            Create an atlas
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-zinc-500">
            The editorial envelope first: who it is for, what it covers, and what it refuses to do.
            An atlas cannot be created without a stated boundary and at least one exclusion — those
            are the fields the publication gate checks, so they are asked for up front rather than
            retrofitted at review.
          </p>
          <div className="mt-6">
            <CreateAtlasForm />
          </div>
        </section>

        <section aria-labelledby="import">
          <h2 id="import" className={SECTION_HEADING}>
            Import
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-zinc-500">
            Paste a <code className="text-zinc-400">maha-atlas-portable</code> file. An import always
            arrives as a private draft, whatever state the file claims — a file cannot publish itself
            by being imported.
          </p>
          <div className="mt-6">
            <ImportAtlasForm />
          </div>
        </section>
      </div>
    </main>
  );
}
