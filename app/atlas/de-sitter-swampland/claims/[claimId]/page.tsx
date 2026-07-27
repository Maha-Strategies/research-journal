import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import AtlasClaimArticle from '@/components/AtlasClaimArticle';
import AtlasSourceCard from '@/components/AtlasSourceCard';
import {
  ATLAS_CLAIMS,
  ATLAS_META,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  getClaim,
  getSourceCard,
  getStatus,
} from '@/lib/atlas/de-sitter';
import { getZenodoRecord } from '@/lib/zenodo-records';

const SITE_URL = 'https://research.mahastrategies.com';
const ORG_URL = 'https://www.mahastrategies.com';
const AUTHOR_URL = 'https://www.mayonemaharajan.com';

const ATLAS_URL = `${SITE_URL}${ATLAS_PATH}`;
const PAPER_PATH = `/papers/${ATLAS_PAPER_SLUG}`;
const PAPER_URL = `${SITE_URL}${PAPER_PATH}`;

export async function generateStaticParams() {
  return ATLAS_CLAIMS.map((claim) => ({ claimId: claim.ref }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ claimId: string }>;
}): Promise<Metadata> {
  const { claimId } = await params;
  const claim = getClaim(claimId);
  if (!claim) return { title: 'Claim not found | Maha Strategies Research' };

  const status = getStatus(claim.status);
  const url = `${ATLAS_URL}/claims/${claim.ref}`;
  const title = `${claim.ref} — ${status.label} | de Sitter / Swampland Atlas`;
  const description = `${claim.claim} Epistemic status: ${status.label}. Sourced from a citation-verified literature map; not a consensus statement.`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    authors: [{ name: 'Mayone Maha Rajan', url: AUTHOR_URL }],
    publisher: 'Maha Strategies',
    alternates: { canonical: `${ATLAS_PATH}/claims/${claim.ref}` },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Maha Strategies Research',
      title,
      description,
      publishedTime: new Date(ATLAS_META.datePublished).toISOString(),
      modifiedTime: new Date(claim.reviewDate).toISOString(),
      authors: ['Mayone Maha Rajan'],
    },
    twitter: { card: 'summary', title, description, creator: '@mayon_rajan' },
  };
}

export default async function ClaimPage({ params }: { params: Promise<{ claimId: string }> }) {
  const { claimId } = await params;
  const claim = getClaim(claimId);
  if (!claim) notFound();

  const status = getStatus(claim.status);
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const url = `${ATLAS_URL}/claims/${claim.ref}`;
  const cards = claim.sources
    .map((id) => getSourceCard(id))
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  const index = ATLAS_CLAIMS.findIndex((entry) => entry.ref === claim.ref);
  const previous = index > 0 ? ATLAS_CLAIMS[index - 1] : undefined;
  const next = index < ATLAS_CLAIMS.length - 1 ? ATLAS_CLAIMS[index + 1] : undefined;

  const claimLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Research Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: ATLAS_META.title, item: ATLAS_URL },
          { '@type': 'ListItem', position: 3, name: claim.ref, item: url },
        ],
      },
      {
        '@type': 'Claim',
        '@id': `${url}#claim`,
        url,
        identifier: claim.ref,
        text: claim.claim,
        name: `${claim.ref} — ${status.label}`,
        description: claim.explanation,
        inLanguage: 'en',
        dateModified: new Date(claim.reviewDate).toISOString(),
        author: { '@type': 'Person', name: 'Mayone Maha Rajan', url: AUTHOR_URL },
        publisher: { '@type': 'Organization', name: 'Maha Strategies', url: ORG_URL },
        license: ATLAS_META.license,
        isPartOf: { '@id': `${ATLAS_URL}#atlas` },
        isBasedOn: [
          { '@type': 'ScholarlyArticle', url: PAPER_URL, ...(zenodo ? { sameAs: zenodo.doiUrl } : {}) },
        ],
        citation: cards.map((card) => ({
          '@type': 'CreativeWork',
          name: card.label,
          ...(card.authors ? { author: card.authors } : {}),
          ...(card.identifier ? { identifier: card.identifier } : {}),
          ...(card.url ? { url: card.url } : {}),
          datePublished: String(card.year),
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6 font-sans text-zinc-300 selection:bg-indigo-500 selection:text-white md:p-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(claimLd) }} />

      <div className="mx-auto w-full max-w-3xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <Link
            href={ATLAS_PATH}
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-indigo-400"
          >
            ← {ATLAS_META.shortTitle}
          </Link>
          <Link
            href={PAPER_PATH}
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-indigo-400"
          >
            [ Source paper ]
          </Link>
        </nav>

        <header className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Claim {claim.ref} · Atlas v{ATLAS_META.version}
          </p>
          <h1 className="mt-4 text-2xl font-light leading-snug tracking-wide text-white md:text-3xl">
            {claim.claim}
          </h1>
        </header>

        <section className="border border-zinc-800 bg-[#121214] p-5 md:p-8" aria-label="Claim detail">
          <AtlasClaimArticle claim={claim} variant="detail" />
        </section>

        <section className="mt-12" aria-labelledby="claim-sources-heading">
          <h2
            id="claim-sources-heading"
            className="mb-6 border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Source cards — {cards.length}
          </h2>
          <div className="grid gap-4">
            {cards.map((card) => (
              <AtlasSourceCard key={card.id} card={card} />
            ))}
          </div>
        </section>

        <nav className="mt-12 flex flex-wrap justify-between gap-4 border-t border-zinc-800 pt-6" aria-label="Claim navigation">
          {previous ? (
            <Link
              href={`${ATLAS_PATH}/claims/${previous.ref}`}
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-indigo-400"
            >
              ← {previous.ref}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`${ATLAS_PATH}/claims/${next.ref}`}
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-indigo-400"
            >
              {next.ref} →
            </Link>
          )}
        </nav>

        <footer className="mt-12 border-t border-zinc-800 pt-8 text-xs leading-relaxed text-zinc-500">
          <p className="mb-3">
            This claim is one entry in an educational, non-peer-reviewed orientation tool. It is not a consensus
            statement, and its epistemic status label is part of the claim — quoting the wording without the status
            and the limitations misrepresents it.
          </p>
          <p>
            Machine-readable form:{' '}
            <a href={`${ATLAS_PATH}/claims.json`} className="text-indigo-300 underline">
              claims.json
            </a>{' '}
            ·{' '}
            <a href={`${ATLAS_PATH}/sources.json`} className="text-indigo-300 underline">
              sources.json
            </a>
            . Derived from{' '}
            <Link href={PAPER_PATH} className="text-indigo-300 underline">
              the working paper
            </Link>
            {zenodo && (
              <>
                {' '}
                (DOI{' '}
                <a href={zenodo.doiUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                  {zenodo.doi}
                </a>
                )
              </>
            )}
            . Licensed {ATLAS_META.licenseLabel}.
          </p>
        </footer>
      </div>
    </div>
  );
}
