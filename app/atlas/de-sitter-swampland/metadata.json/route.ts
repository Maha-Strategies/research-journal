import {
  ATLAS_CLAIMS,
  ATLAS_EDGES,
  ATLAS_META,
  ATLAS_NODES,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  EPISTEMIC_STATUSES,
  getCitedSources,
} from '@/lib/atlas/de-sitter';
import { getWorkingPaper } from '@/lib/working-papers';
import { getZenodoRecord } from '@/lib/zenodo-records';

const SITE_URL = 'https://research.mahastrategies.com';

export async function GET() {
  const paper = getWorkingPaper(ATLAS_PAPER_SLUG);
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const url = `${SITE_URL}${ATLAS_PATH}`;
  const paperUrl = `${SITE_URL}/papers/${ATLAS_PAPER_SLUG}`;
  const sources = getCitedSources();

  return Response.json(
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: ATLAS_META.title,
      description: ATLAS_META.description,
      version: ATLAS_META.version,
      datePublished: ATLAS_META.datePublished,
      dateModified: ATLAS_META.dateModified,
      url,
      canonicalUrl: url,
      learningResourceType: ['Concept map', 'Annotated bibliography', 'Orientation guide'],
      creativeWorkStatus: 'Non-peer-reviewed educational research map',
      inLanguage: 'en',
      isAccessibleForFree: true,
      license: ATLAS_META.license,
      reuseNotes: ATLAS_META.reuseNotes,
      author: { '@type': 'Person', name: 'Mayone Maha Rajan', url: 'https://www.mayonemaharajan.com' },
      publisher: { '@type': 'Organization', name: 'Maha Strategies', url: 'https://www.mahastrategies.com' },
      isBasedOn: {
        '@type': 'ScholarlyArticle',
        name: paper?.title,
        url: paperUrl,
        version: paper?.version,
        creativeWorkStatus: paper?.status,
        reviewStatus: paper?.reviewStatus,
        metadata: `${paperUrl}/metadata.json`,
        ...(zenodo ? { sameAs: zenodo.doiUrl } : {}),
      },
      ...(zenodo
        ? {
            archive: {
              provider: 'Zenodo',
              record: zenodo.recordUrl,
              doi: zenodo.doi,
              doiUrl: zenodo.doiUrl,
              conceptDoi: zenodo.conceptDoi,
              conceptDoiUrl: `https://doi.org/${zenodo.conceptDoi}`,
              note: 'The DOIs identify the source working paper, not this atlas. The atlas has no DOI of its own.',
            },
          }
        : {}),
      release: ATLAS_META.releaseName,
      lastReviewed: ATLAS_META.lastReviewed,
      endpoints: {
        metadata: `${url}/metadata.json`,
        claims: `${url}/claims.json`,
        sources: `${url}/sources.json`,
      },
      epistemicStatuses: EPISTEMIC_STATUSES.map(({ id, label, definition }) => ({ id, label, definition })),
      conceptNodes: ATLAS_NODES.map((node) => ({
        id: node.id,
        label: node.label,
        epistemicStatus: node.status,
        definition: node.definition,
        whyItMatters: node.whyItMatters,
        notEstablished: node.notEstablished ?? null,
        contextualOnly: node.contextual ?? false,
        related: node.related,
        sources: node.sources,
      })),
      conceptEdges: ATLAS_EDGES.map((edge) => ({ from: edge.from, to: edge.to, relation: edge.label })),
      claimLedger: ATLAS_CLAIMS.map((claim) => ({
        id: claim.ref,
        slug: claim.id,
        claim: claim.claim,
        epistemicStatus: claim.status,
        statusNote: claim.statusNote ?? null,
        explanation: claim.explanation,
        limitations: claim.limitations,
        /** @deprecated v1.0.0 key, retained so existing consumers keep working. */
        caution: claim.limitations,
        conceptIds: claim.conceptIds,
        sources: claim.sources,
        reviewDate: claim.reviewDate,
        canonicalUrl: `${url}/claims/${claim.ref}`,
      })),
      sources: sources.map((source) => ({
        id: source.id,
        label: source.label,
        authors: source.authors ?? null,
        identifier: source.identifier ?? null,
        journal: source.journal ?? null,
        url: source.url ?? null,
        provenance: source.provenance,
        titleNotRecordedInSource: source.titleNotRecorded ?? false,
      })),
      sourceUrls: sources.map((source) => source.url).filter((href): href is string => Boolean(href)),
      provenanceNotes: [
        'Every source in this record is drawn from the working paper at ' +
          paperUrl +
          ', whose verification ledger records that all twenty-four arXiv identifiers were independently resolved against arXiv and INSPIRE-HEP.',
        'Verification means an identifier resolves to a real paper that is correctly placed in the debate. It is not an endorsement of that paper’s argument.',
        'Discovery-era observational cosmology papers are outside the source paper’s verified citation set and are therefore not cited here.',
        'Nodes flagged contextualOnly are orientation aids that the source map does not cite directly.',
        'String theory and M-theory are research frameworks, not experimentally confirmed descriptions of nature.',
        'This atlas does not adjudicate whether string theory admits metastable de Sitter vacua; that question is open.',
      ],
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
