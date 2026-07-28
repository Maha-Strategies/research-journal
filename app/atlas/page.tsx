import type { Metadata } from 'next';
import Link from 'next/link';

import { MAHA_ORGANIZATION_ID, MAYON_RAJAN_PERSON_ID, SITE_URL } from '@/lib/entity';
import {
  ATLAS_CATALOG,
  ATLAS_CATALOG_PATH,
  ATLAS_CATALOG_VALIDATION,
  buildAtlasCatalogRecord,
} from '@/lib/atlas/catalog';
import { STANDARD_META, STANDARD_PATH } from '@/lib/standards/maha-provenance';
import { getWorkingPaper } from '@/lib/working-papers';

const GATEWAY_TITLE = 'Research Atlas Gateway';

const GATEWAY_DESCRIPTION =
  'The directory of Maha Research atlases: source-linked research maps with claim ledgers, source trails, concept records, and stated boundaries. An atlas maps a body of literature; it is not a consensus statement, forecast, or advice.';

/**
 * Gateway version. Bumped when this directory's own structure or boundary
 * language changes — not when an individual atlas is revised, since each atlas
 * carries its own version and review date.
 */
const GATEWAY_VERSION = '1.0.0';
const GATEWAY_UPDATED = '2026-07-28';

export const metadata: Metadata = {
  title: GATEWAY_TITLE,
  description: GATEWAY_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${ATLAS_CATALOG_PATH}` },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${ATLAS_CATALOG_PATH}`,
    title: GATEWAY_TITLE,
    description: GATEWAY_DESCRIPTION,
  },
};

/** The aggregate discovery endpoints this gateway publishes. */
const AGGREGATE_ENDPOINTS = [
  {
    path: `${ATLAS_CATALOG_PATH}/manifest.json`,
    note: 'Every atlas with its version, counts, canonical URL, and full endpoint list.',
  },
  {
    path: `${ATLAS_CATALOG_PATH}/claims.json`,
    note: 'Discovery index of every public claim across all atlases, each pointing at its canonical record.',
  },
  {
    path: `${ATLAS_CATALOG_PATH}/concepts.json`,
    note: 'Discovery index of every public concept record.',
  },
  {
    path: `${ATLAS_CATALOG_PATH}/sources.json`,
    note: 'Discovery index of every public source record.',
  },
  {
    path: `${ATLAS_CATALOG_PATH}/registry.json`,
    note: 'The catalog record with its publication gate and validation state.',
  },
];

/** The vocabulary an atlas is built from, explained without jargon. */
const ATLAS_VOCABULARY = [
  {
    term: 'Claim',
    definition:
      'A single assertion with a stable identifier. Every claim carries an epistemic status and a statement of what it does not establish. Claims are the unit you cite.',
  },
  {
    term: 'Source',
    definition:
      'A work a claim rests on, tagged with how far it was checked — resolved against a primary index, cited but not re-resolved, or foundational. The tag describes verification, not quality.',
  },
  {
    term: 'Concept',
    definition:
      'An orientation record for a term the literature uses, written so a claim can be read without already knowing the field. Concepts explain; they do not assert.',
  },
  {
    term: 'Uncertainty',
    definition:
      'Carried on the claim itself, as a status label plus an explicit boundary. An atlas never launders a contested claim into a settled one by dropping the caveat.',
  },
  {
    term: 'Version',
    definition:
      'Each atlas is versioned and dated, with an evidence cutoff where one applies. A claim is true of a version, not of all time — which is why the version appears on every page.',
  },
];

export default function AtlasGatewayPage() {
  const record = buildAtlasCatalogRecord(SITE_URL);
  const url = `${SITE_URL}${ATLAS_CATALOG_PATH}`;

  const totals = ATLAS_CATALOG.reduce(
    (acc, atlas) => ({
      claims: acc.claims + atlas.counts.claims,
      concepts: acc.concepts + atlas.counts.concepts,
      sources: acc.sources + atlas.counts.sources,
    }),
    { claims: 0, concepts: 0, sources: 0 },
  );

  const gatewayLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    url,
    name: GATEWAY_TITLE,
    description: GATEWAY_DESCRIPTION,
    inLanguage: 'en',
    version: GATEWAY_VERSION,
    dateModified: GATEWAY_UPDATED,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website` },
    author: { '@id': MAYON_RAJAN_PERSON_ID },
    publisher: { '@id': MAHA_ORGANIZATION_ID },
    provider: { '@id': MAHA_ORGANIZATION_ID },
    citation: {
      '@type': 'CreativeWork',
      name: STANDARD_META.title,
      url: `${SITE_URL}${STANDARD_PATH}`,
    },
    hasPart: ATLAS_CATALOG.map((atlas) => ({
      '@type': ['Dataset', 'LearningResource'],
      '@id': `${SITE_URL}${atlas.canonicalPath}#atlas`,
      name: atlas.title,
      url: `${SITE_URL}${atlas.canonicalPath}`,
      description: atlas.description,
      version: atlas.version,
      dateModified: atlas.lastReviewed,
      creativeWorkStatus: atlas.status,
      isAccessibleForFree: true,
      publisher: { '@id': MAHA_ORGANIZATION_ID },
      distribution: atlas.endpoints.map((endpoint) => ({
        '@type': 'DataDownload',
        name: endpoint.label,
        encodingFormat: endpoint.format,
        contentUrl: `${SITE_URL}${endpoint.path}`,
      })),
    })),
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-cyan-500 selection:text-white md:p-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gatewayLd) }}
      />

      <div className="mx-auto max-w-5xl">
        <nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest">
          <Link href="/" className="text-zinc-500 hover:text-cyan-300">
            ← Research index
          </Link>
          <div className="flex flex-wrap gap-5">
            <Link href="/library" className="text-zinc-400 hover:text-cyan-300">
              Learning library
            </Link>
            <Link href="/registry" className="text-zinc-400 hover:text-cyan-300">
              Context registry →
            </Link>
          </div>
        </nav>

        <header className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
            Public research infrastructure · v{GATEWAY_VERSION} · updated {GATEWAY_UPDATED}
          </p>
          <h1 className="mt-4 text-3xl font-light uppercase tracking-wide text-white md:text-5xl">
            Research Atlas <span className="text-zinc-500">Gateway</span>
          </h1>
          <p className="mt-6 border-l border-cyan-400/40 pl-4 text-base leading-relaxed text-zinc-400">
            {GATEWAY_DESCRIPTION}
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            {ATLAS_CATALOG.length} atlases · {totals.claims} claims · {totals.concepts} concepts ·{' '}
            {totals.sources} sources
          </p>
        </header>

        {/* Boundary stated before the atlases, not as a footnote after them. */}
        <section
          aria-labelledby="boundary"
          className="mt-12 border border-amber-400/30 bg-amber-400/5 p-6"
        >
          <h2 id="boundary" className="font-mono text-[10px] uppercase tracking-widest text-amber-200">
            What these are not
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            The atlases are{' '}
            <strong className="font-medium text-white">source-linked research maps</strong>. They are
            not consensus statements, not forecasts, not investment advice, and not operational or
            safety guidance. An atlas records what has been claimed, by whom, on what evidence, and
            what that evidence does not establish. Where a field disagrees, the atlas maps the
            disagreement rather than resolving it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Inclusion of a source is a statement about provenance, not endorsement. A verified
            citation means the identifier resolved and the work is correctly placed — never that its
            argument is correct.
          </p>
        </section>

        <section aria-labelledby="what-is-an-atlas" className="mt-16">
          <h2
            id="what-is-an-atlas"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            What an Atlas is, in plain language
          </h2>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-400">
            An atlas is an orientation layer over a body of literature. It does not replace the
            sources; it tells you what is there, how the pieces relate, and how much weight each one
            carries. Five things do the work:
          </p>

          <dl className="mt-8 grid gap-5 md:grid-cols-2">
            {ATLAS_VOCABULARY.map((item) => (
              <div key={item.term} className="border border-zinc-800 bg-[#121214] p-5">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                  {item.term}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-zinc-400">{item.definition}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-500">
            The rules these follow are written down rather than implied. See the{' '}
            <Link
              href={STANDARD_PATH}
              className="text-cyan-300 underline underline-offset-4 hover:text-white"
            >
              {STANDARD_META.shortTitle}
            </Link>
            , which specifies how a claim is identified, labelled, sourced, bounded, versioned, and
            corrected.
          </p>
        </section>

        <section aria-labelledby="atlases" className="mt-16">
          <h2
            id="atlases"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            The Atlases · {ATLAS_CATALOG.length}
          </h2>

          <div className="mt-6 grid gap-6">
            {ATLAS_CATALOG.map((atlas) => {
              const paper = atlas.relatedPaperSlug
                ? getWorkingPaper(atlas.relatedPaperSlug)
                : undefined;

              return (
                <article key={atlas.id} className="border border-zinc-800 bg-[#121214] p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                        {atlas.status}
                      </p>
                      <h3 className="mt-3 text-2xl font-light text-white">
                        <Link href={atlas.canonicalPath} className="hover:text-cyan-200">
                          {atlas.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-widest text-zinc-500">
                      v{atlas.version} · reviewed {atlas.lastReviewed}
                      {atlas.evidenceCutoff ? (
                        <>
                          <br />
                          evidence through {atlas.evidenceCutoff}
                        </>
                      ) : null}
                    </p>
                  </div>

                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-400">
                    {atlas.description}
                  </p>

                  <dl className="mt-7 grid gap-4 border-y border-zinc-800 py-5 text-sm md:grid-cols-3">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                        Public records
                      </dt>
                      <dd className="mt-2 text-zinc-300">
                        {atlas.counts.claims} claims · {atlas.counts.concepts} concepts ·{' '}
                        {atlas.counts.sources} sources
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                        Scope
                      </dt>
                      <dd className="mt-2 leading-relaxed text-zinc-400">{atlas.scope}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                        Written for
                      </dt>
                      <dd className="mt-2 leading-relaxed text-zinc-400">{atlas.intendedReader}</dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                      Boundary
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
                      {atlas.exclusions.map((exclusion) => (
                        <li key={exclusion}>{exclusion}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Only the pages that exist for THIS atlas. The three are not
                      uniform — de Sitter has no methodology page, Quantum
                      Computing has no context pack, only Synthetic Intelligence
                      has comparisons. Advertising a missing page would 404. */}
                  <div className="mt-7 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
                    <Link
                      href={atlas.canonicalPath}
                      className="border border-cyan-400 px-4 py-2 text-cyan-200 hover:bg-cyan-400 hover:text-zinc-950"
                    >
                      Open Atlas →
                    </Link>
                    {atlas.pages.map((page) => (
                      <Link
                        key={page.path}
                        href={page.path}
                        className="border border-zinc-700 px-4 py-2 text-zinc-300 hover:border-white hover:text-white"
                      >
                        {page.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
                    {atlas.endpoints.map((endpoint) => (
                      <a
                        key={endpoint.path}
                        href={endpoint.path}
                        className="border border-zinc-800 px-3 py-2 text-zinc-500 hover:border-cyan-400/60 hover:text-cyan-300"
                      >
                        {endpoint.label} ↗
                      </a>
                    ))}
                  </div>

                  {paper && (
                    <p className="mt-6 border-t border-zinc-800 pt-5 text-sm leading-relaxed text-zinc-500">
                      Sits alongside the working paper{' '}
                      <Link
                        href={`/papers/${atlas.relatedPaperSlug}`}
                        className="text-cyan-300 underline underline-offset-4 hover:text-white"
                      >
                        {paper.title}
                      </Link>
                      . The atlas is a navigation layer over that paper&rsquo;s verified citation
                      set, not a second source.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="machine-readable" className="mt-16">
          <h2
            id="machine-readable"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Machine-readable discovery
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-400">
            These are <strong className="font-medium text-zinc-200">discovery indexes</strong>, not a
            second copy of the corpus. Each record carries its atlas id and the canonical URL of the
            record it points at, so an aggregate entry can never drift from — or be mistaken for —
            the atlas-level endpoint that owns it.
          </p>

          <ul className="mt-6 grid gap-3">
            {AGGREGATE_ENDPOINTS.map((endpoint) => (
              <li
                key={endpoint.path}
                className="flex flex-wrap items-baseline justify-between gap-3 border border-zinc-800 bg-[#121214] px-5 py-4"
              >
                <a
                  href={endpoint.path}
                  className="font-mono text-xs text-cyan-300 underline underline-offset-4 hover:text-white"
                >
                  {endpoint.path}
                </a>
                <span className="max-w-xl text-sm leading-relaxed text-zinc-500">
                  {endpoint.note}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="gate" className="mt-16 border border-zinc-800 p-6">
          <h2 id="gate" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Publication gate · catalog {ATLAS_CATALOG_VALIDATION.valid ? 'valid' : 'INVALID'}
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
            {record.publicationGate.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </section>

        <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-600">
          Educational, non-peer-reviewed research maps published by Maha Strategies Research. Each
          atlas states its own version, review date, and boundary; those statements govern. For
          current status on any real-world hazard or system, consult the responsible authority
          rather than an atlas.
        </footer>
      </div>
    </main>
  );
}
