// Shared pieces for the builder-atlas route tree.
//
// A leading underscore marks this folder entry as private to the router: Next
// does not turn `_shared.tsx` into a route. It keeps the per-page files short
// enough to read, and keeps one definition of the styling the gateway uses.

import Link from 'next/link';

export const SECTION_HEADING =
  'border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500';

export const CARD = 'border border-zinc-800 bg-[#121214] p-5';

export const LABEL = 'font-mono text-[10px] uppercase tracking-widest text-zinc-600';

export const LINK = 'text-cyan-300 underline underline-offset-4 hover:text-white';

/** Gateway → atlas → section, so a reader always knows where they are. */
export function Breadcrumb({
  atlasSlug,
  atlasTitle,
  section,
}: {
  atlasSlug: string;
  atlasTitle: string;
  section?: string;
}) {
  return (
    <nav className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
      <Link href="/atlas" className="hover:text-cyan-300">
        Research Atlas Gateway
      </Link>
      <span className="mx-2">/</span>
      {section ? (
        <>
          <Link href={`/atlas/${atlasSlug}`} className="hover:text-cyan-300">
            {atlasTitle}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">{section}</span>
        </>
      ) : (
        <span className="text-zinc-400">{atlasTitle}</span>
      )}
    </nav>
  );
}

/**
 * The version and review line.
 *
 * Repeated on every record page on purpose: a claim is true of a version, not
 * of all time, and a reader who lands directly on a claim URL needs that in
 * front of them rather than one hop away on the landing page.
 */
export function ProvenanceLine({
  version,
  lastReviewed,
  reviewDate,
}: {
  version: string;
  lastReviewed: string;
  reviewDate?: string;
}) {
  return (
    <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
      atlas v{version} · atlas reviewed {lastReviewed}
      {reviewDate ? ` · this record reviewed ${reviewDate}` : ''}
    </p>
  );
}
