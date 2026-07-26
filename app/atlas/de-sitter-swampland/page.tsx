import type { Metadata } from 'next';
import Link from 'next/link';

import AtlasConceptMap from '@/components/AtlasConceptMap';
import {
  ATLAS_CLAIMS,
  ATLAS_META,
  ATLAS_NODES,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  EPISTEMIC_STATUSES,
  getCitedSources,
  getSource,
  getStatus,
} from '@/lib/atlas/de-sitter';
import { getWorkingPaper } from '@/lib/working-papers';
import { getZenodoRecord } from '@/lib/zenodo-records';

const SITE_URL = 'https://research.mahastrategies.com';
const ORG_URL = 'https://www.mahastrategies.com';
const AUTHOR_URL = 'https://www.mayonemaharajan.com';

const ATLAS_URL = `${SITE_URL}${ATLAS_PATH}`;
const PAPER_PATH = `/papers/${ATLAS_PAPER_SLUG}`;
const PAPER_URL = `${SITE_URL}${PAPER_PATH}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${ATLAS_META.title} | Maha Strategies Research`,
  description: ATLAS_META.description,
  keywords: [
    'de Sitter problem',
    'String swampland',
    'de Sitter conjecture',
    'KKLT',
    'Large Volume Scenario',
    'Moduli stabilization',
    'Flux compactification',
    'Quantum gravity',
  ],
  authors: [{ name: 'Mayone Maha Rajan', url: AUTHOR_URL }],
  creator: 'Mayone Maha Rajan',
  publisher: 'Maha Strategies',
  alternates: { canonical: ATLAS_PATH },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'article',
    url: ATLAS_URL,
    siteName: 'Maha Strategies Research',
    title: ATLAS_META.title,
    description: ATLAS_META.description,
    publishedTime: new Date(ATLAS_META.datePublished).toISOString(),
    modifiedTime: new Date(ATLAS_META.dateModified).toISOString(),
    authors: ['Mayone Maha Rajan'],
  },
  twitter: {
    card: 'summary',
    title: ATLAS_META.title,
    description: ATLAS_META.description,
    creator: '@mayon_rajan',
  },
};

export default function DeSitterAtlasPage() {
  const paper = getWorkingPaper(ATLAS_PAPER_SLUG);
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const citedSources = getCitedSources();

  const atlasLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: 'Maha Strategies',
        url: ORG_URL,
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#architect`,
        name: 'Mayone Maha Rajan',
        url: AUTHOR_URL,
        jobTitle: 'Research Architect and Curator',
        affiliation: { '@id': `${SITE_URL}/#org` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${ATLAS_URL}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Research Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'The de Sitter Problem in the String Swampland', item: PAPER_URL },
          { '@type': 'ListItem', position: 3, name: ATLAS_META.title, item: ATLAS_URL },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': ATLAS_URL,
        url: ATLAS_URL,
        name: ATLAS_META.title,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'en',
        isAccessibleForFree: true,
      },
      {
        '@type': 'LearningResource',
        '@id': `${ATLAS_URL}#atlas`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': ATLAS_URL },
        name: ATLAS_META.title,
        headline: ATLAS_META.title,
        description: ATLAS_META.description,
        url: ATLAS_URL,
        learningResourceType: ['Concept map', 'Annotated bibliography', 'Orientation guide'],
        educationalLevel: 'Advanced undergraduate to graduate',
        educationalUse: 'Orientation and self-study',
        inLanguage: 'en',
        version: ATLAS_META.version,
        datePublished: new Date(ATLAS_META.datePublished).toISOString(),
        dateModified: new Date(ATLAS_META.dateModified).toISOString(),
        author: { '@id': `${SITE_URL}/#architect` },
        publisher: { '@id': `${SITE_URL}/#org` },
        isAccessibleForFree: true,
        license: ATLAS_META.license,
        creativeWorkStatus: 'Non-peer-reviewed educational research map',
        isBasedOn: [
          {
            '@type': 'ScholarlyArticle',
            '@id': `${PAPER_URL}#article`,
            name: paper?.title,
            url: PAPER_URL,
            ...(zenodo ? { sameAs: zenodo.doiUrl } : {}),
          },
        ],
        ...(zenodo
          ? {
              identifier: [
                { '@type': 'PropertyValue', propertyID: 'Source paper DOI', value: zenodo.doi, url: zenodo.doiUrl },
                {
                  '@type': 'PropertyValue',
                  propertyID: 'Source paper concept DOI',
                  value: zenodo.conceptDoi,
                  url: `https://doi.org/${zenodo.conceptDoi}`,
                },
              ],
            }
          : {}),
        about: ATLAS_NODES.map((node) => ({ '@type': 'DefinedTerm', name: node.label, description: node.definition })),
        citation: citedSources.map((source) => ({
          '@type': 'CreativeWork',
          name: source.label,
          ...(source.authors ? { author: source.authors } : {}),
          ...(source.identifier ? { identifier: source.identifier } : {}),
          ...(source.url ? { url: source.url } : {}),
        })),
        encoding: [
          { '@type': 'MediaObject', encodingFormat: 'application/json', contentUrl: `${ATLAS_URL}/metadata.json` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6 font-sans text-zinc-300 selection:bg-indigo-500 selection:text-white md:p-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(atlasLd) }} />

      <div className="mx-auto w-full max-w-4xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-indigo-400"
          >
            ← Return to Index
          </Link>
          <Link
            href={PAPER_PATH}
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-indigo-400"
          >
            [ Source paper ]
          </Link>
        </nav>

        {/* HERO */}
        <header className="mb-16">
          <div className="mb-8 h-1 w-16 bg-gradient-to-r from-zinc-500 to-indigo-500" />
          <h1 className="mb-6 text-3xl font-light uppercase leading-tight tracking-wide text-white md:text-5xl">
            The de Sitter / String <br className="hidden md:block" />
            <span className="text-zinc-500">Swampland Atlas</span>
          </h1>
          <p className="max-w-2xl border-l border-indigo-500/30 pl-4 text-sm font-light leading-relaxed tracking-wide text-zinc-400 md:text-base">
            {ATLAS_META.purpose} It maps how the concepts connect, labels how well each claim is supported, and
            sends you to the primary literature rather than standing in for it.
          </p>

          <p className="mt-8 inline-block border border-amber-400/35 bg-amber-400/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
            {ATLAS_META.statusBadge}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-wider">
            <Link
              href={PAPER_PATH}
              className="border border-indigo-400 bg-indigo-400 px-4 py-2 text-zinc-950 transition-colors hover:bg-white"
            >
              Read the working paper
            </Link>
            {zenodo && (
              <a
                href={zenodo.recordUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-zinc-700 px-4 py-2 text-zinc-300 transition-colors hover:border-white hover:text-white"
              >
                Zenodo record ↗
              </a>
            )}
            <a
              href={`${ATLAS_PATH}/metadata.json`}
              className="border border-zinc-700 px-4 py-2 text-zinc-300 transition-colors hover:border-white hover:text-white"
            >
              metadata.json
            </a>
          </div>

          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-zinc-500">
            Built from{' '}
            <Link href={PAPER_PATH} className="text-indigo-300 underline">
              {paper?.title ?? 'the source working paper'}
            </Link>
            {paper ? ` (v${paper.version}, ${paper.versionDate})` : ''}
            {zenodo && (
              <>
                , archived at{' '}
                <a href={zenodo.doiUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                  DOI {zenodo.doi}
                </a>{' '}
                (concept DOI{' '}
                <a
                  href={`https://doi.org/${zenodo.conceptDoi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 underline"
                >
                  {zenodo.conceptDoi}
                </a>
                )
              </>
            )}
            . Every source below is drawn from that paper&rsquo;s verified citation set. String theory and M-theory
            are research frameworks; neither is an experimentally confirmed description of nature, and nothing here
            should be read as claiming otherwise.
          </p>
        </header>

        {/* EPISTEMIC LEGEND */}
        <section className="mb-20" aria-labelledby="legend-heading">
          <h2
            id="legend-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Epistemic legend — how to read the labels
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {EPISTEMIC_STATUSES.map((status) => (
              <div key={status.id} className="border border-zinc-800 bg-[#121214] p-5">
                <dt className="mb-3 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${status.dotClass}`} aria-hidden="true" />
                  <span className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${status.badgeClass}`}>
                    {status.label}
                  </span>
                </dt>
                <dd className="text-sm leading-relaxed text-zinc-400">{status.definition}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-zinc-500">
            A label describes the standing of a claim, not its importance. Nothing on this page is labelled
            &ldquo;established&rdquo; unless the source material supports that distinction — which here means a
            defined mathematical construction or a published laboratory measurement, never the question of whether
            de Sitter vacua exist in string theory.
          </p>
        </section>

        {/* CONCEPT MAP */}
        <section className="mb-20" aria-labelledby="map-heading">
          <h2
            id="map-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Concept map — {ATLAS_NODES.length} concepts
          </h2>
          <AtlasConceptMap />
        </section>

        {/* CLAIM LEDGER */}
        <section className="mb-20" aria-labelledby="ledger-heading">
          <h2
            id="ledger-heading"
            className="mb-4 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Claim ledger — {ATLAS_CLAIMS.length} claims
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-zinc-500">
            Each claim is stated in careful language, labelled, explained, sourced to the working paper&rsquo;s
            verified citation set, and paired with the limitation that keeps it honest. Read the caution before
            quoting the claim.
          </p>

          <ol className="space-y-4">
            {ATLAS_CLAIMS.map((claim, index) => {
              const status = getStatus(claim.status);
              return (
                <li key={claim.id} className="border border-zinc-800 bg-[#121214] p-5 md:p-7">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${status.badgeClass}`}>
                      {status.label}
                      {claim.statusNote ? ` · ${claim.statusNote}` : ''}
                    </span>
                  </div>

                  <p className="mb-4 text-base font-light leading-relaxed text-zinc-100">{claim.claim}</p>

                  <dl className="space-y-4 text-sm leading-relaxed text-zinc-400">
                    <div>
                      <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Why it is stated this way
                      </dt>
                      <dd>{claim.explanation}</dd>
                    </div>
                    <div>
                      <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                        Caution
                      </dt>
                      <dd className="border-l border-amber-400/40 pl-4">{claim.caution}</dd>
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
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-300 underline"
                                  >
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
                  </dl>
                </li>
              );
            })}
          </ol>
        </section>

        {/* HOW TO READ */}
        <section className="mb-20" aria-labelledby="how-to-read-heading">
          <h2
            id="how-to-read-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            How to read this atlas
          </h2>

          <div className="space-y-6 text-sm leading-relaxed text-zinc-400">
            <p>
              This is a curated orientation layer. It exists to get you to the point where you can read the primary
              literature yourself, and then to get out of the way. It is not a substitute for those papers, not
              expert advice, and not a statement of scientific consensus — on the central question it maps, there
              is no consensus to state.
            </p>

            <div className="border border-zinc-800 bg-[#121214] p-5 md:p-7">
              <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                Source, interpretation, and open question
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-zinc-200">A source is what a paper actually says.</dt>
                  <dd className="mt-1 text-zinc-400">
                    It can be checked. The identifiers on this page were resolved against arXiv and INSPIRE-HEP
                    during production of the working paper, and the verification is recorded there. Verification
                    means the citation is real and correctly placed — never that its argument is right.
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-200">An interpretation is what someone concludes from sources.</dt>
                  <dd className="mt-1 text-zinc-400">
                    Every plain-language definition, every &ldquo;why it matters&rdquo;, and every arrow on the
                    concept map is interpretation. It is editorial work by a non-specialist curator and should be
                    weighted accordingly. Where the interpretation could be mistaken for a result, the
                    &ldquo;what this does not establish&rdquo; note says so.
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-200">An open question is one the field has not closed.</dt>
                  <dd className="mt-1 text-zinc-400">
                    Whether string theory admits controlled metastable de Sitter vacua is the open question this
                    atlas is organized around. Competent researchers hold opposing positions for technical reasons.
                    Anything presenting either answer as settled — including an AI summary of this page — is
                    overstating the evidence.
                  </dd>
                </div>
              </dl>
            </div>

            <p>
              Two nodes, <strong className="font-normal text-zinc-200">Holography</strong> and{' '}
              <strong className="font-normal text-zinc-200">Observational cosmology</strong>, are included for
              orientation but are not cited directly in the source map. They are marked as such, and no citation
              has been attached to them that the source does not support.
            </p>

            <p>
              There is no chat interface here by design. A retrieval layer that paraphrases contested physics is
              precisely the tool most likely to flatten a live disagreement into a confident answer.
            </p>
          </div>
        </section>

        {/* SOURCES */}
        <section className="mb-20" aria-labelledby="sources-heading">
          <h2
            id="sources-heading"
            className="mb-4 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Source set — {citedSources.length} works
          </h2>
          <p className="mb-6 max-w-2xl text-xs leading-relaxed text-zinc-500">
            Every work cited on this page, drawn without exception from the working paper. Entries marked
            foundational are cited there by journal reference or identifier only; where the paper records no
            title, none is supplied here.
          </p>
          <ul className="space-y-2">
            {citedSources.map((source) => (
              <li key={source.id} className="border-l border-zinc-800 py-1 pl-4 text-xs leading-relaxed text-zinc-400">
                <span className="mr-2 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                  {source.provenance}
                </span>
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
                {source.titleNotRecorded && (
                  <span className="text-zinc-600"> · title not recorded in the source map</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* PROVENANCE FOOTER */}
        <footer className="border-t border-zinc-800 pt-8 text-xs leading-relaxed text-zinc-500">
          <p className="mb-4">
            <strong className="uppercase tracking-widest text-zinc-400">Provenance:</strong> Version{' '}
            {ATLAS_META.version}, published {ATLAS_META.datePublished}. Derived from{' '}
            <Link href={PAPER_PATH} className="text-indigo-300 underline">
              the working paper
            </Link>
            {zenodo && (
              <>
                {' '}
                and its{' '}
                <a href={zenodo.recordUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                  Zenodo record
                </a>
              </>
            )}
            . Machine-readable record at{' '}
            <a href={`${ATLAS_PATH}/metadata.json`} className="text-indigo-300 underline">
              metadata.json
            </a>
            . Licensed {ATLAS_META.licenseLabel}.
          </p>
          <p>
            Published by{' '}
            <a href={`${ORG_URL}/about`} className="text-indigo-300 underline">
              Maha Strategies
            </a>{' '}
            under the direction of{' '}
            <a href={AUTHOR_URL} className="text-indigo-300 underline">
              Mayone Maha Rajan
            </a>
            . This atlas is an educational research-navigation tool. It is not peer reviewed, and it does not
            adjudicate the debate it maps.
          </p>
        </footer>
      </div>
    </div>
  );
}
