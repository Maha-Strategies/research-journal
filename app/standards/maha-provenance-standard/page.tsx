import type { Metadata } from 'next';
import Link from 'next/link';

import {
  CONDITIONAL_CLAUSES,
  CONFORMANCE_LEVELS,
  CONFORMANCE_RECORD,
  OPEN_GAPS,
  STANDARD_CLAUSES,
  STANDARD_META,
  STANDARD_NOTES,
  STANDARD_PATH,
} from '@/lib/standards/maha-provenance';

const SITE_URL = 'https://research.mahastrategies.com';
const ORG_URL = 'https://www.mahastrategies.com';
const AUTHOR_URL = 'https://www.mayonemaharajan.com';
const STANDARD_URL = `${SITE_URL}${STANDARD_PATH}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${STANDARD_META.title} | Maha Strategies Research`,
  description: STANDARD_META.description,
  keywords: [
    'Research provenance',
    'Claim-level provenance',
    'Epistemic status labels',
    'Citation verification',
    'Self-published research standards',
    'AI research provenance',
  ],
  authors: [{ name: 'Mayone Maha Rajan', url: AUTHOR_URL }],
  creator: 'Mayone Maha Rajan',
  publisher: 'Maha Strategies',
  alternates: { canonical: STANDARD_PATH },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'article',
    url: STANDARD_URL,
    siteName: 'Maha Strategies Research',
    title: STANDARD_META.title,
    description: STANDARD_META.description,
    publishedTime: new Date(STANDARD_META.datePublished).toISOString(),
    modifiedTime: new Date(STANDARD_META.dateModified).toISOString(),
    authors: ['Mayone Maha Rajan'],
  },
  twitter: {
    card: 'summary',
    title: STANDARD_META.title,
    description: STANDARD_META.description,
    creator: '@mayon_rajan',
  },
};

export default function MahaProvenanceStandardPage() {
  const standardLd = {
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
        '@id': `${STANDARD_URL}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Research Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Research Context Registry', item: `${SITE_URL}/registry` },
          { '@type': 'ListItem', position: 3, name: STANDARD_META.title, item: STANDARD_URL },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': STANDARD_URL,
        url: STANDARD_URL,
        name: STANDARD_META.title,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'en',
        isAccessibleForFree: true,
      },
      {
        '@type': ['DefinedTermSet', 'CreativeWork'],
        '@id': `${STANDARD_URL}#standard`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': STANDARD_URL },
        name: STANDARD_META.title,
        alternateName: STANDARD_META.shortTitle,
        description: STANDARD_META.description,
        url: STANDARD_URL,
        identifier: STANDARD_META.id,
        version: STANDARD_META.version,
        datePublished: new Date(STANDARD_META.datePublished).toISOString(),
        dateModified: new Date(STANDARD_META.dateModified).toISOString(),
        inLanguage: 'en',
        isAccessibleForFree: true,
        license: STANDARD_META.license,
        creativeWorkStatus: STANDARD_META.status,
        author: { '@id': `${SITE_URL}/#architect` },
        publisher: { '@id': `${SITE_URL}/#org` },
        usageInfo: STANDARD_META.statusNote,
        hasDefinedTerm: STANDARD_CLAUSES.map((clause) => ({
          '@type': 'DefinedTerm',
          '@id': `${STANDARD_URL}#${clause.id}`,
          termCode: clause.number,
          name: clause.title,
          description: clause.rule,
        })),
        encoding: [
          {
            '@type': 'MediaObject',
            encodingFormat: 'application/json',
            contentUrl: `${STANDARD_URL}/metadata.json`,
          },
        ],
        exampleOfWork: CONFORMANCE_RECORD.map((entry) => ({
          '@type': 'CreativeWork',
          name: entry.artifact,
          url: `${SITE_URL}${entry.href}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6 font-sans text-zinc-300 selection:bg-indigo-500 selection:text-white md:p-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(standardLd) }} />

      <div className="mx-auto w-full max-w-4xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-indigo-400"
          >
            ← Return to Index
          </Link>
          <span className="flex flex-wrap gap-6">
            <Link
              href="/registry"
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-indigo-400"
            >
              [ Registry ]
            </Link>
            <a
              href={`${STANDARD_PATH}/metadata.json`}
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-indigo-400"
            >
              [ metadata.json ]
            </a>
          </span>
        </nav>

        {/* HERO */}
        <header className="mb-16">
          <div className="mb-8 h-1 w-16 bg-gradient-to-r from-zinc-500 to-indigo-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Version {STANDARD_META.version} · {STANDARD_META.datePublished}
          </p>
          <h1 className="mb-6 mt-4 text-3xl font-light uppercase leading-tight tracking-wide text-white md:text-5xl">
            The Maha <br className="hidden md:block" />
            <span className="text-zinc-500">Provenance Standard</span>
          </h1>
          <p className="max-w-2xl border-l border-indigo-500/30 pl-4 text-sm font-light leading-relaxed tracking-wide text-zinc-400 md:text-base">
            {STANDARD_META.subtitle}. {STANDARD_META.purpose}
          </p>

          <div className="mt-8 border border-amber-400/35 bg-amber-400/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
              {STANDARD_META.status}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{STANDARD_META.statusNote}</p>
          </div>
        </header>

        {/* WHAT THIS IS */}
        <section className="mb-20" aria-labelledby="scope-heading">
          <h2
            id="scope-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Scope
          </h2>
          <div className="space-y-5 text-sm leading-relaxed text-zinc-400">
            <p>
              This document is <strong className="font-normal text-zinc-200">descriptive, not aspirational</strong>.
              Every clause below records a practice already implemented in this project, and each one links to the
              artifact or endpoint where it is enforced. The clauses were written by reading the codebase, not the
              other way round.
            </p>
            <p>
              The problem it addresses is narrow. Self-published research can be produced faster than it can be
              checked, and AI-assisted synthesis makes the gap wider: a fabricated citation and a real one are
              typographically identical, and a conjecture and a measurement read the same once paraphrased. The
              response here is to attach provenance and epistemic status to the individual claim rather than to the
              document, and to publish both in a form that survives extraction.
            </p>
            <p>
              What it does not attempt: this is not a general research methodology, not a peer-review substitute,
              and not a proposal for anyone else to adopt. It is one project&rsquo;s working rules, written down so
              that its outputs can be checked against a stated rule instead of taken on trust.
            </p>
          </div>
        </section>

        {/* CLAUSES */}
        <section className="mb-20" aria-labelledby="clauses-heading">
          <h2
            id="clauses-heading"
            className="mb-4 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Clauses — {STANDARD_CLAUSES.length}
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-zinc-500">
            Grouped by prefix: <span className="font-mono text-zinc-400">P</span> provenance,{' '}
            <span className="font-mono text-zinc-400">C</span> claim structure,{' '}
            <span className="font-mono text-zinc-400">S</span> separation of judgement from fact,{' '}
            <span className="font-mono text-zinc-400">V</span> versioning and correction,{' '}
            <span className="font-mono text-zinc-400">M</span> machine reuse. Each clause carries evidence links so
            the claim that it is followed can be checked.
          </p>

          <ol className="space-y-4">
            {STANDARD_CLAUSES.map((clause) => (
              <li
                key={clause.id}
                id={clause.id}
                className="scroll-mt-6 border border-zinc-800 bg-[#121214] p-5 md:p-7"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="border border-indigo-400/40 bg-indigo-400/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo-200">
                    {clause.number}
                  </span>
                  <h3 className="text-lg font-light leading-snug text-white">{clause.title}</h3>
                </div>

                <dl className="space-y-4 text-sm leading-relaxed text-zinc-400">
                  <div>
                    <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Rule</dt>
                    <dd className="border-l border-indigo-500/30 pl-4 text-zinc-300">{clause.rule}</dd>
                  </div>
                  <div>
                    <dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Why it exists
                    </dt>
                    <dd>{clause.rationale}</dd>
                  </div>
                  <div>
                    <dt className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Where it is enforced
                    </dt>
                    <dd>
                      <ul className="space-y-2">
                        {clause.evidence.map((entry) => (
                          <li key={entry.href + entry.label} className="text-xs leading-relaxed">
                            <a href={entry.href} className="inline-block py-1 text-indigo-300 underline">
                              {entry.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        {/* CONFORMANCE */}
        <section className="mb-20" aria-labelledby="conformance-heading">
          <h2
            id="conformance-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Conformance levels
          </h2>

          <dl className="mb-8 space-y-4">
            {CONFORMANCE_LEVELS.map((level) => (
              <div key={level.level} className="border border-zinc-800 bg-[#121214] p-5">
                <dt className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-300">
                    {level.level}
                  </span>
                  <span className="text-base font-light text-white">{level.label}</span>
                </dt>
                <dd className="text-sm leading-relaxed text-zinc-400">
                  {level.requires}
                  <span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Adds clauses: {level.clauses.join(', ')}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
            Self-assessed conformance in this repository
          </h3>
          <ul className="space-y-3">
            {CONFORMANCE_RECORD.map((entry) => (
              <li key={entry.href} className="border border-zinc-800 bg-[#121214] p-5">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-200">
                    {entry.level}
                  </span>
                  <Link href={entry.href} className="text-sm text-indigo-300 underline">
                    {entry.artifact}
                  </Link>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">{entry.note}</p>
              </li>
            ))}
          </ul>
          <h3 className="mb-4 mt-10 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
            Conditional clauses
          </h3>
          <p className="mb-4 max-w-2xl text-xs leading-relaxed text-zinc-500">
            These sit outside the levels because they apply only when their condition holds. An artifact is neither
            penalised for failing a clause that does not apply to it, nor credited with one it never had to meet.
          </p>
          <ul className="space-y-2">
            {CONDITIONAL_CLAUSES.map((entry) => (
              <li key={entry.clause} className="border-l border-zinc-800 py-1 pl-4 text-sm leading-relaxed text-zinc-400">
                <span className="font-mono text-xs text-zinc-300">{entry.clause}</span> — applies when{' '}
                {entry.appliesWhen}
              </li>
            ))}
          </ul>

          <h3 className="mb-4 mt-10 font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Open gaps against this standard
          </h3>
          <p className="mb-4 max-w-2xl text-xs leading-relaxed text-zinc-500">
            Places where this project does not currently meet its own rules. Published deliberately: a self-assessed
            standard reporting no shortcomings would not be worth reading, and clause V2 requires that they be
            disclosed rather than smoothed over.
          </p>
          <ul className="space-y-3">
            {OPEN_GAPS.map((gap) => (
              <li key={gap.clause + gap.artifact} className="border border-amber-400/35 bg-amber-400/5 p-5">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="border border-amber-400/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-200">
                    {gap.clause} not met
                  </span>
                  <span className="text-sm text-zinc-200">{gap.artifact}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">{gap.gap}</p>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-l border-amber-400/40 pl-4 text-xs leading-relaxed text-zinc-500">
            Conformance is self-assessed. No external body has audited these assignments. The evidence links on each
            clause exist precisely so that a reader can check the assessment rather than accept it.
          </p>
        </section>

        {/* NOTES AND CITATION */}
        <section className="mb-20" aria-labelledby="notes-heading">
          <h2
            id="notes-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Status, limits, and citation
          </h2>
          <ul className="mb-8 space-y-3">
            {STANDARD_NOTES.map((note) => (
              <li key={note} className="border-l border-zinc-800 py-1 pl-4 text-sm leading-relaxed text-zinc-400">
                {note}
              </li>
            ))}
          </ul>

          <div className="border border-zinc-800 bg-[#121214] p-6">
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Cite as</h3>
            <p className="select-all text-sm leading-relaxed text-zinc-300">
              Rajan, M. M. ({STANDARD_META.datePublished.slice(0, 4)}). {STANDARD_META.title} (Version{' '}
              {STANDARD_META.version}) [Methodology specification]. Maha Strategies Research. {STANDARD_URL}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              This standard has no DOI. Cite it by URL and version. Machine-readable record at{' '}
              <a href={`${STANDARD_PATH}/metadata.json`} className="text-indigo-300 underline">
                metadata.json
              </a>
              .
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-800 pt-8 text-xs leading-relaxed text-zinc-500">
          <p className="mb-4">
            Listed in the{' '}
            <Link href="/registry" className="text-indigo-300 underline">
              Maha Research Context Registry
            </Link>
            . Applied in{' '}
            <Link href="/atlas/de-sitter-swampland" className="text-indigo-300 underline">
              the de Sitter / String Swampland Atlas
            </Link>{' '}
            and{' '}
            <Link href="/papers/de_sitter_swampland_map" className="text-indigo-300 underline">
              its source working paper
            </Link>
            . Licensed {STANDARD_META.licenseLabel}.
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
            . No login, no paywall, no tracking.
          </p>
        </footer>
      </div>
    </div>
  );
}
