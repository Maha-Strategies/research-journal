import {
  ATLAS_CLAIMS,
  ATLAS_META,
  ATLAS_NODES,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  SOURCE_TYPES,
  VERIFICATION_DEFINITIONS,
  getSourceCards,
} from '@/lib/atlas/de-sitter';
import { getZenodoRecord } from '@/lib/zenodo-records';

const SITE_URL = 'https://research.mahastrategies.com';

export async function GET() {
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const atlasUrl = `${SITE_URL}${ATLAS_PATH}`;
  const paperUrl = `${SITE_URL}/papers/${ATLAS_PAPER_SLUG}`;
  const cards = getSourceCards();

  return Response.json(
    {
      atlas: {
        title: ATLAS_META.title,
        url: atlasUrl,
        version: ATLAS_META.version,
        release: ATLAS_META.releaseName,
        lastReviewed: ATLAS_META.lastReviewed,
        license: ATLAS_META.license,
        sourcePaper: paperUrl,
        ...(zenodo ? { doi: zenodo.doi, conceptDoi: zenodo.conceptDoi, archive: zenodo.recordUrl } : {}),
        claimsEndpoint: `${atlasUrl}/claims.json`,
      },
      verificationVocabulary: VERIFICATION_DEFINITIONS,
      sourceTypeVocabulary: SOURCE_TYPES,
      provenanceNotes: [
        'Bibliographic fields are taken from the working paper at ' +
          paperUrl +
          ', whose verification ledger records that all twenty-four arXiv identifiers were independently resolved against arXiv and INSPIRE-HEP.',
        'The sourceType classification and the whyHere note are curator annotation, not fields from the source paper.',
        'Publication years are decoded from the arXiv identifier the paper records; the one work with no identifier takes its year from the journal reference. Where a journal year differs from the arXiv year, the journal field carries it.',
        'Verification means an identifier resolves to a real paper that is correctly placed in the debate. It is not an endorsement of that paper’s argument.',
        'No work outside the source paper’s citation set appears here. Discovery-era observational cosmology papers are outside that set and are therefore not cited.',
      ],
      count: cards.length,
      sources: cards.map((card) => ({
        id: card.id,
        recordUrl: `${atlasUrl}/sources/${card.id}`,
        title: card.label,
        titleRecordedInSourcePaper: !card.titleNotRecorded,
        authors: card.authors ?? null,
        year: card.year,
        yearBasis: card.yearBasis,
        sourceType: card.sourceType,
        sourceTypeLabel: card.sourceTypeLabel,
        identifier: card.identifier ?? null,
        journal: card.journal ?? null,
        url: card.url ?? null,
        verification: card.verification,
        whyHere: card.whyHere,
        citedByClaims: ATLAS_CLAIMS.filter((claim) => claim.sources.includes(card.id)).map((claim) => claim.ref),
        citedByConcepts: ATLAS_NODES.filter((node) => node.sources.includes(card.id)).map((node) => node.id),
      })),
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
