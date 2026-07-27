import type { Metadata } from 'next';
import Link from 'next/link';

import AtlasClaimArticle from '@/components/AtlasClaimArticle';
import AtlasConceptMap from '@/components/AtlasConceptMap';
import AtlasSourceCard from '@/components/AtlasSourceCard';
import {
  ATLAS_CLAIMS,
  ATLAS_META,
  ATLAS_NODES,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  EPISTEMIC_STATUSES,
  VERIFICATION_DEFINITIONS,
  getCitedSources,
  getSourceCard,
  getSourceCards,
} from '@/lib/atlas/de-sitter';
import { DEBATE_PROBLEMS } from '@/lib/atlas/de-sitter-debate';
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
  const sourceCards = getSourceCards();

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
          { '@type': 'MediaObject', encodingFormat: 'application/json', contentUrl: `${ATLAS_URL}/claims.json` },
          { '@type': 'MediaObject', encodingFormat: 'application/json', contentUrl: `${ATLAS_URL}/sources.json` },
        ],
        hasPart: ATLAS_CLAIMS.map((claim) => ({
          '@type': 'Claim',
          '@id': `${ATLAS_URL}/claims/${claim.ref}#claim`,
          identifier: claim.ref,
          url: `${ATLAS_URL}/claims/${claim.ref}`,
          text: claim.claim,
          dateModified: new Date(claim.reviewDate).toISOString(),
        })),
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
            <Link
              href={`${ATLAS_PATH}/context-pack`}
              className="border border-zinc-700 px-4 py-2 text-zinc-300 transition-colors hover:border-white hover:text-white"
            >
              Context pack →
            </Link>
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
            Each claim carries a stable identifier, an epistemic status, a sourced explanation, and the limitation
            that keeps it honest. Every claim is separately linkable — cite the identifier, not the wording alone.
            Machine-readable at{' '}
            <a href={`${ATLAS_PATH}/claims.json`} className="text-indigo-300 underline">
              claims.json
            </a>
            .
          </p>

          <ol className="space-y-4">
            {ATLAS_CLAIMS.map((claim) => (
              <li
                key={claim.ref}
                id={`claim-${claim.ref}`}
                className="scroll-mt-6 border border-zinc-800 bg-[#121214] p-5 md:p-7"
              >
                <AtlasClaimArticle claim={claim} variant="ledger" />
              </li>
            ))}
          </ol>
        </section>

        {/* DISAGREEMENT MAP */}
        <section className="mb-20" aria-labelledby="disagreement-heading">
          <h2
            id="disagreement-heading"
            className="mb-4 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Disagreement map — {DEBATE_PROBLEMS.length} open problems
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-zinc-500">
            The seven open problems from the source paper, each separated into four layers: the technical language
            both sides share, the specific point actually in dispute, what rests on unproved conjecture, and what
            would move the problem. Competing positions are stated as their proponents argue them. Neither side is
            presented as settled, because neither is.
          </p>

          <ol className="space-y-4">
            {DEBATE_PROBLEMS.map((problem) => (
              <li
                key={problem.id}
                id={`problem-${problem.id}`}
                className="scroll-mt-6 border border-zinc-800 bg-[#121214] p-5 md:p-7"
              >
                <div className="mb-4 flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Problem {problem.number}
                  </span>
                  <h3 className="text-lg font-light leading-snug text-white">{problem.title}</h3>
                </div>
                <p className="mb-6 border-l border-indigo-500/30 pl-4 text-sm font-light leading-relaxed text-zinc-300">
                  {problem.question}
                </p>

                <dl className="space-y-4 text-sm leading-relaxed text-zinc-400">
                  <div>
                    <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                      Common technical language
                    </dt>
                    <dd>{problem.commonLanguage}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-sky-300">
                      Actively debated
                    </dt>
                    <dd>{problem.debated}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                      Conjectural
                    </dt>
                    <dd>{problem.conjectural}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      What would count as progress
                    </dt>
                    <dd>
                      {problem.whatWouldCount}{' '}
                      <span className="text-zinc-600">(Curator inference, not a claim from the source paper.)</span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {problem.camps.map((camp) => (
                    <div key={camp.label} className="border border-zinc-800 bg-[#0d0d10] p-4">
                      <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-indigo-300">
                        {camp.label}
                      </h4>
                      <p className="text-xs leading-relaxed text-zinc-400">{camp.position}</p>
                      <ul className="mt-3 space-y-1">
                        {camp.sources.map((id) => {
                          const card = getSourceCard(id);
                          if (!card) return null;
                          return (
                            <li key={id} className="text-[11px] leading-relaxed text-zinc-500">
                              {card.url ? (
                                <a href={card.url} target="_blank" rel="noreferrer" className="text-indigo-300/80 underline">
                                  {card.identifier ?? card.label} ↗
                                </a>
                              ) : (
                                <span>{card.identifier ?? card.label}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                {problem.claimRefs.length > 0 && (
                  <p className="mt-5 flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                      Related claims
                    </span>
                    {problem.claimRefs.map((ref) => (
                      <Link
                        key={ref}
                        href={`${ATLAS_PATH}/claims/${ref}`}
                        className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-300 transition-colors hover:border-indigo-400 hover:text-white"
                      >
                        {ref}
                      </Link>
                    ))}
                  </p>
                )}
              </li>
            ))}
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

        {/* SOURCE TRAIL */}
        <section className="mb-20" aria-labelledby="sources-heading">
          <h2
            id="sources-heading"
            className="mb-4 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Source trail — {sourceCards.length} works
          </h2>
          <p className="mb-6 max-w-2xl text-xs leading-relaxed text-zinc-500">
            Every work cited on this page, drawn without exception from the working paper. Bibliographic fields come
            from that paper; the source-type classification and the &ldquo;why this source is here&rdquo; note are
            curator annotation. Machine-readable at{' '}
            <a href={`${ATLAS_PATH}/sources.json`} className="text-indigo-300 underline">
              sources.json
            </a>
            .
          </p>

          <dl className="mb-8 grid gap-3 sm:grid-cols-3">
            {VERIFICATION_DEFINITIONS.map((entry) => (
              <div key={entry.label} className="border border-zinc-800 bg-[#0d0d10] p-4">
                <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-300">{entry.label}</dt>
                <dd className="text-xs leading-relaxed text-zinc-500">{entry.definition}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-4">
            {sourceCards.map((card) => (
              <AtlasSourceCard key={card.id} card={card} />
            ))}
          </div>
        </section>

        {/* VERSION AND METHODOLOGY */}
        <section className="mb-20" aria-labelledby="version-heading">
          <h2
            id="version-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Version and methodology
          </h2>

          <div className="border border-indigo-400/25 bg-indigo-400/5 p-5 md:p-7">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Atlas version</dt>
                <dd className="mt-1 text-sm text-zinc-200">
                  {ATLAS_META.version} — {ATLAS_META.releaseName}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Last updated</dt>
                <dd className="mt-1 text-sm text-zinc-200">
                  {ATLAS_META.dateModified} (first published {ATLAS_META.datePublished})
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Claims last reviewed</dt>
                <dd className="mt-1 text-sm text-zinc-200">{ATLAS_META.lastReviewed}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">License</dt>
                <dd className="mt-1 text-sm text-zinc-200">{ATLAS_META.licenseLabel}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Associated paper</dt>
                <dd className="mt-1 text-sm">
                  <Link href={PAPER_PATH} className="text-indigo-300 underline">
                    {PAPER_URL}
                  </Link>
                </dd>
              </div>
              {zenodo && (
                <>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Published archive
                    </dt>
                    <dd className="mt-1 text-sm">
                      <a href={zenodo.recordUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                        {zenodo.recordUrl} ↗
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Zenodo DOI</dt>
                    <dd className="mt-1 text-sm">
                      <a href={zenodo.doiUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                        {zenodo.doi} ↗
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Concept DOI</dt>
                    <dd className="mt-1 text-sm">
                      <a
                        href={`https://doi.org/${zenodo.conceptDoi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-300 underline"
                      >
                        {zenodo.conceptDoi} ↗
                      </a>
                    </dd>
                  </div>
                </>
              )}
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Machine-readable</dt>
                <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a href={`${ATLAS_PATH}/metadata.json`} className="text-indigo-300 underline">
                    metadata.json
                  </a>
                  <a href={`${ATLAS_PATH}/claims.json`} className="text-indigo-300 underline">
                    claims.json
                  </a>
                  <a href={`${ATLAS_PATH}/sources.json`} className="text-indigo-300 underline">
                    sources.json
                  </a>
                  <a href={`${ATLAS_PATH}/context-pack.json`} className="text-indigo-300 underline">
                    context-pack.json
                  </a>
                  <a href={`${ATLAS_PATH}/context.txt`} className="text-indigo-300 underline">
                    context.txt
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Portable package</dt>
                <dd className="mt-1 text-sm">
                  <Link href={`${ATLAS_PATH}/context-pack`} className="text-indigo-300 underline">
                    Atlas Context Pack
                  </Link>{' '}
                  <span className="text-zinc-500">— downloadable, citable, with exclusions stated</span>
                </dd>
              </div>
            </dl>

            <p className="mt-6 border-t border-indigo-400/20 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
              {ATLAS_META.statusBadge}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              This atlas is an educational, non-peer-reviewed orientation tool. It is not peer-reviewed research, not
              expert advice, and not a statement of scientific consensus. On the central question it maps — whether
              string theory admits controlled metastable de Sitter vacua — there is no consensus to state.
            </p>
          </div>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-zinc-400">
            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                How claims are curated
              </h3>
              <p>
                A claim enters the ledger only if it can be stated in language the cited sources support, and only
                if it bears on the structure of the debate rather than decorating it. Each is written to be quotable
                without its context misleading anyone: the epistemic status and the limitations statement are part
                of the claim, not commentary on it. Claims are numbered <span className="font-mono">ds-001</span>{' '}
                onward, and an identifier is never reassigned to a different claim.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                How claims are sourced
              </h3>
              <p>
                Every citation is drawn from the working paper&rsquo;s verified set, whose ledger records that all
                twenty-four arXiv identifiers were independently resolved against arXiv and INSPIRE-HEP. No
                identifier, title, or author list has been added from any other source. Where the paper records only
                an identifier for a foundational work, this atlas repeats that rather than supplying a title the
                paper does not record. Where a claim would benefit from a citation outside that set, the gap is
                stated on the claim instead of being filled — see{' '}
                <Link href={`${ATLAS_PATH}/claims/ds-001`} className="text-indigo-300 underline">
                  ds-001
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                How claims are revised
              </h3>
              <p>
                Each claim carries the date it was last reviewed. Wording changes that alter what a claim asserts
                produce a new atlas version; corrections are made in place and the review date advances. If the
                underlying working paper is revised, the atlas version follows it. The atlas has no DOI of its own —
                cite the paper&rsquo;s DOI for the research, and the claim identifier plus atlas version for the
                specific formulation you are quoting.
              </p>
            </div>
          </div>
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
