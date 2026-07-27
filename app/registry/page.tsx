import type { Metadata } from 'next';
import Link from 'next/link';

import RegistryList from '@/components/RegistryList';
import {
  ARTIFACT_TYPES,
  PENDING_ARTIFACTS,
  REGISTRY_ARTIFACTS,
  REGISTRY_META,
  REGISTRY_PATH,
  SITE_URL,
  buildRegistryRecord,
  getArtifactType,
  getPopulatedTypes,
  getRegistryTopics,
} from '@/lib/registry';

const ORG_URL = 'https://www.mahastrategies.com';
const AUTHOR_URL = 'https://www.mayonemaharajan.com';
const REGISTRY_URL = `${SITE_URL}${REGISTRY_PATH}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${REGISTRY_META.title} | Maha Strategies Research`,
  description: REGISTRY_META.description,
  keywords: [
    'Research context registry',
    'Research artifacts',
    'Context pack',
    'Research atlas',
    'Working papers',
    'Machine-readable research metadata',
  ],
  authors: [{ name: 'Mayone Maha Rajan', url: AUTHOR_URL }],
  creator: 'Mayone Maha Rajan',
  publisher: 'Maha Strategies',
  alternates: { canonical: REGISTRY_PATH },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    url: REGISTRY_URL,
    siteName: 'Maha Strategies Research',
    title: REGISTRY_META.title,
    description: REGISTRY_META.description,
  },
  twitter: {
    card: 'summary',
    title: REGISTRY_META.title,
    description: REGISTRY_META.description,
    creator: '@mayon_rajan',
  },
};

export default function RegistryPage() {
  const record = buildRegistryRecord();

  const registryLd = {
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
        '@id': `${REGISTRY_URL}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Research Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: REGISTRY_META.title, item: REGISTRY_URL },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': REGISTRY_URL,
        url: REGISTRY_URL,
        name: REGISTRY_META.title,
        description: REGISTRY_META.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#org` },
        inLanguage: 'en',
        isAccessibleForFree: true,
        license: REGISTRY_META.license,
        usageInfo: REGISTRY_META.notAJournal,
        mainEntity: { '@id': `${REGISTRY_URL}#artifacts` },
      },
      {
        '@type': 'ItemList',
        '@id': `${REGISTRY_URL}#artifacts`,
        name: 'Registered research artifacts',
        numberOfItems: REGISTRY_ARTIFACTS.length,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: REGISTRY_ARTIFACTS.map((artifact, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}${artifact.canonicalPath}`,
          item: {
            '@type': artifact.type === 'working-paper' ? 'ScholarlyArticle' : ['Dataset', 'LearningResource'],
            '@id': `${SITE_URL}${artifact.canonicalPath}`,
            name: artifact.title,
            description: artifact.description,
            url: `${SITE_URL}${artifact.canonicalPath}`,
            version: artifact.version,
            dateModified: new Date(artifact.lastUpdated).toISOString(),
            license: artifact.license,
            inLanguage: 'en',
            isAccessibleForFree: true,
            creativeWorkStatus: artifact.status,
            keywords: artifact.keywords.join(', '),
            author: { '@id': `${SITE_URL}/#architect` },
            publisher: { '@id': `${SITE_URL}/#org` },
            ...(artifact.doi
              ? {
                  sameAs: artifact.doi.doiUrl,
                  identifier: [
                    { '@type': 'PropertyValue', propertyID: 'DOI', value: artifact.doi.version, url: artifact.doi.doiUrl },
                    ...(artifact.doi.concept
                      ? [
                          {
                            '@type': 'PropertyValue',
                            propertyID: 'Concept DOI',
                            value: artifact.doi.concept,
                            url: `https://doi.org/${artifact.doi.concept}`,
                          },
                        ]
                      : []),
                  ],
                }
              : {}),
            distribution: artifact.machineReadable.map((endpoint) => ({
              '@type': 'DataDownload',
              name: endpoint.label,
              encodingFormat: endpoint.format,
              contentUrl: `${SITE_URL}${endpoint.path}`,
            })),
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6 font-sans text-zinc-300 selection:bg-indigo-500 selection:text-white md:p-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(registryLd) }} />

      <div className="mx-auto w-full max-w-4xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-indigo-400"
          >
            ← Return to Index
          </Link>
          <a
            href="/registry.json"
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-indigo-400"
          >
            [ registry.json ]
          </a>
        </nav>

        {/* HERO */}
        <header className="mb-16">
          <div className="mb-8 h-1 w-16 bg-gradient-to-r from-zinc-500 to-indigo-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Registry v{REGISTRY_META.version} · Updated {REGISTRY_META.lastUpdated}
          </p>
          <h1 className="mb-6 mt-4 text-3xl font-light uppercase leading-tight tracking-wide text-white md:text-5xl">
            Maha Research <br className="hidden md:block" />
            <span className="text-zinc-500">Context Registry</span>
          </h1>
          <p className="max-w-2xl border-l border-indigo-500/30 pl-4 text-sm font-light leading-relaxed tracking-wide text-zinc-400 md:text-base">
            {REGISTRY_META.purpose}
          </p>

          <p className="mt-8 border border-amber-400/35 bg-amber-400/5 p-4 text-sm leading-relaxed text-zinc-300">
            {REGISTRY_META.notAJournal}
          </p>
        </header>

        {/* WHAT THIS IS */}
        <section className="mb-20" aria-labelledby="about-heading">
          <h2
            id="about-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            How to read this registry
          </h2>

          <div className="space-y-6 text-sm leading-relaxed text-zinc-400">
            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                What a research context pack is
              </h3>
              <p>
                A context pack is a bounded, versioned package of a research artifact: its claims, each with a
                stable identifier and an epistemic status; its sources, each traced to where it was verified; and
                its exclusions, stated as part of the package rather than left to inference. The point is that the
                qualifications travel with the content. A claim separated from its status label and its limitations
                has lost the thing that made it safe to reuse — and that separation is exactly what happens when
                research is scraped, summarized, or pasted into a model without provenance.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                Why claims, sources, versioning, and exclusions matter
              </h3>
              <p>
                A claim identifier lets someone cite a specific formulation rather than a paraphrase. A source trail
                lets them check it. A version and review date let them tell whether the copy they hold is current.
                An exclusion tells them what the artifact was never meant to support. Together these are what
                separate a reusable research artifact from a confident-sounding document — and they are what a
                downstream reader, human or machine, needs in order to represent the work honestly.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                Four different things, deliberately not blurred
              </h3>
              <dl className="space-y-3">
                {ARTIFACT_TYPES.map((type) => (
                  <div key={type.id}>
                    <dt className="text-zinc-200">{type.label}</dt>
                    <dd className="mt-1 text-zinc-400">{type.definition}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-zinc-200">Peer-reviewed publication</dt>
                  <dd className="mt-1 text-zinc-400">
                    A paper that has passed independent expert review organized by a journal or conference.{' '}
                    <strong className="font-normal text-zinc-200">
                      Nothing in this registry is peer reviewed.
                    </strong>{' '}
                    No artifact here should be cited or described as though it were.
                  </dd>
                </div>
              </dl>
            </div>

            <p className="border-l border-amber-400/40 pl-4">
              Inclusion in this registry does not imply scientific consensus. It records that an artifact&rsquo;s
              provenance, status, and boundaries have been made explicit and can be checked — nothing more. Several
              registered artifacts describe debates the field has not settled, and they say so.
            </p>

            <p>
              The rules those properties are held to are written down in{' '}
              <Link href="/standards/maha-provenance-standard" className="text-indigo-300 underline">
                the Maha Provenance Standard
              </Link>
              , which is itself registered here. It is self-published and self-assessed, and each of its clauses
              links to the artifact where the practice can be checked.
            </p>
          </div>
        </section>

        {/* ARTIFACTS */}
        <section className="mb-20" aria-labelledby="artifacts-heading">
          <h2
            id="artifacts-heading"
            className="mb-4 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Registered artifacts — {REGISTRY_ARTIFACTS.length}
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-zinc-500">
            {record.inclusionPolicy[0]} Machine-readable form at{' '}
            <a href="/registry.json" className="text-indigo-300 underline">
              registry.json
            </a>
            .
          </p>

          <RegistryList
            artifacts={REGISTRY_ARTIFACTS}
            types={getPopulatedTypes()}
            topics={getRegistryTopics()}
          />
        </section>

        {/* PENDING */}
        {PENDING_ARTIFACTS.length > 0 && (
          <section className="mb-20" aria-labelledby="pending-heading">
            <h2
              id="pending-heading"
              className="mb-4 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
            >
              Not yet registered
            </h2>
            <p className="mb-6 max-w-2xl text-xs leading-relaxed text-zinc-500">
              Artifacts that have been planned or referred to but whose metadata is not yet complete enough to list.
              They are named here with the specific gap, rather than being included on the strength of a
              description.
            </p>
            <ul className="space-y-3">
              {PENDING_ARTIFACTS.map((entry) => (
                <li key={entry.title} className="border border-zinc-800 bg-[#121214] p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                      {getArtifactType(entry.type).label}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
                      Metadata incomplete
                    </span>
                  </div>
                  <h3 className="text-base font-light text-zinc-100">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{entry.missing}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* INCLUSION POLICY */}
        <section className="mb-20" aria-labelledby="policy-heading">
          <h2
            id="policy-heading"
            className="mb-8 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Inclusion policy
          </h2>
          <ul className="space-y-3">
            {record.inclusionPolicy.map((item) => (
              <li key={item} className="border-l border-zinc-800 py-1 pl-4 text-sm leading-relaxed text-zinc-400">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-800 pt-8 text-xs leading-relaxed text-zinc-500">
          <p className="mb-4">
            Registry v{REGISTRY_META.version}, updated {REGISTRY_META.lastUpdated}. Machine-readable at{' '}
            <a href="/registry.json" className="text-indigo-300 underline">
              /registry.json
            </a>
            . Licensed {REGISTRY_META.licenseLabel}. Individual artifacts carry their own license and status.
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
