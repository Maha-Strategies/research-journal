// The staged workflow shell.
//
// The stage nav and the validation panel are in the layout rather than on each
// page so that the current state of the gate is visible at every stage, not
// only at review. Surfacing a missing boundary while the operator is still
// adding sources is the difference between an editorial prompt and a rejection
// at the end.

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createRequestStore } from '../_store';
import { validateAtlas } from '@/lib/atlas/builder/validate';

type Props = { children: React.ReactNode; params: Promise<{ slug: string }> };

const STAGES = [
  { path: '', label: '1 · Atlas' },
  { path: '/sources', label: '2 · Sources' },
  { path: '/concepts', label: '3 · Concepts' },
  { path: '/claims', label: '4 · Claims' },
  { path: '/review', label: '5 · Review' },
  { path: '/release', label: '6 · Release' },
];

export default async function AtlasLayout({ children, params }: Props) {
  const { slug } = await params;
  const store = await createRequestStore();
  const draft = await store.getDraft(slug);
  if (!draft) notFound();

  const validation = validateAtlas(draft);
  const base = `/operator/atlas-builder/${slug}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        <Link href="/operator/atlas-builder" className="hover:text-cyan-300">
          Workspace
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{draft.slug}</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
            {draft.state} · v{draft.version} · {draft.visibility}
          </p>
          <h1 className="mt-3 text-2xl font-light text-white">{draft.title}</h1>
        </div>
        <p className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-widest text-zinc-600">
          {draft.claims.length} claims · {draft.concepts.length} concepts · {draft.sources.length}{' '}
          sources
          <br />
          updated {draft.updatedAt.slice(0, 16).replace('T', ' ')}
        </p>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 border-y border-zinc-800 py-3">
        {STAGES.map((stage) => (
          <Link
            key={stage.path}
            href={`${base}${stage.path}`}
            className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-cyan-300"
          >
            {stage.label}
          </Link>
        ))}
      </nav>

      {/* The gate, always in view. Errors block release; warnings do not. */}
      <div
        className={`mt-6 border p-4 ${
          validation.ok ? 'border-zinc-800 bg-[#121214]' : 'border-amber-900/60 bg-amber-950/20'
        }`}
      >
        <p
          className={`font-mono text-[10px] uppercase tracking-widest ${
            validation.ok ? 'text-cyan-400' : 'text-amber-300'
          }`}
        >
          {validation.ok
            ? 'Passes the publication gate'
            : `${validation.errors.length} blocking ${validation.errors.length === 1 ? 'issue' : 'issues'}`}
          {validation.warnings.length > 0 ? ` · ${validation.warnings.length} advisory` : ''}
        </p>
        {validation.errors.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {validation.errors.slice(0, 6).map((finding, index) => (
              <li key={`${finding.code}-${index}`} className="text-xs leading-relaxed text-amber-200">
                <span className="font-mono text-amber-500">
                  {finding.target.kind}
                  {'id' in finding.target ? ` ${finding.target.id}` : ''}
                </span>{' '}
                — {finding.message}
              </li>
            ))}
            {validation.errors.length > 6 ? (
              <li className="text-xs text-amber-400">
                …and {validation.errors.length - 6} more. See the review stage.
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      <div className="mt-10">{children}</div>
    </div>
  );
}
