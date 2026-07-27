// The Atlas Context Pack: a bounded, citable package of the atlas for people
// and AI-assisted research workflows.
//
// Everything the pack publishes is derived here so the overview page, the
// manifest endpoint, the plain-text endpoint, and the download bundle can never
// disagree about what the pack contains or what it excludes.

import {
  ATLAS_CLAIMS,
  ATLAS_META,
  ATLAS_NODES,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  EPISTEMIC_STATUSES,
  getSourceCards,
  getStatus,
} from '@/lib/atlas/de-sitter';
import { DEBATE_PROBLEMS } from '@/lib/atlas/de-sitter-debate';
import { getZenodoRecord } from '@/lib/zenodo-records';

const SITE_URL = 'https://research.mahastrategies.com';
const ORCID = 'https://orcid.org/0009-0006-8135-5306';

export const CONTEXT_PACK_PATH = `${ATLAS_PATH}/context-pack`;

export const PACK_URLS = {
  page: `${SITE_URL}${CONTEXT_PACK_PATH}`,
  manifest: `${SITE_URL}${ATLAS_PATH}/context-pack.json`,
  contextText: `${SITE_URL}${ATLAS_PATH}/context.txt`,
  download: `${SITE_URL}${CONTEXT_PACK_PATH}/download.json`,
  citationCff: `${SITE_URL}${ATLAS_PATH}/citation.cff`,
  atlas: `${SITE_URL}${ATLAS_PATH}`,
  claims: `${SITE_URL}${ATLAS_PATH}/claims.json`,
  sources: `${SITE_URL}${ATLAS_PATH}/sources.json`,
  metadata: `${SITE_URL}${ATLAS_PATH}/metadata.json`,
  methodology: `${SITE_URL}${ATLAS_PATH}#version-heading`,
  paper: `${SITE_URL}/papers/${ATLAS_PAPER_SLUG}`,
} as const;

export const PACK_META = {
  id: 'de-sitter-swampland-atlas-context-pack',
  title: 'de Sitter / String Swampland Atlas — Context Pack',
  description:
    'A bounded, versioned research context package for the de Sitter problem in the string/M-theory swampland program. Bundles a twelve-claim ledger with epistemic status labels, twenty-eight annotated source cards, and explicit exclusions, so the material can be reused — including as context for an AI-assisted workflow — without losing its provenance or its uncertainty.',
  oneLine:
    'A citable, bounded research context: claims with status labels, sources with provenance, and explicit statements of what this does not cover.',
} as const;

export const INTENDED_USES = [
  {
    audience: 'Students and self-directed learners',
    use: 'Orient yourself in a contested literature before reading the primary papers, with an explicit signal of which statements are settled and which are not.',
  },
  {
    audience: 'Educators',
    use: 'A worked example for teaching the difference between an established result, an open research question, a conjecture, and a speculative interpretation — using a live debate rather than a tidy one.',
  },
  {
    audience: 'Researchers entering the area',
    use: 'A provenance-checked starting bibliography of twenty-seven works, with the structure of the seven open problems and the strongest argument on each side.',
  },
  {
    audience: 'AI-assisted research workflows',
    use: 'A compact, bounded context attachment that carries source links and epistemic labels with it, so a model summarizing this material has the qualifications in front of it rather than having to infer them.',
  },
] as const;

export const EXCLUSIONS = [
  'This pack is not peer reviewed and confers no authority. It is an educational orientation resource assembled by a non-specialist curator.',
  'It is not a complete string theory corpus. It covers one debate — whether string/M-theory admits metastable de Sitter vacua — through twenty-seven works, and nothing else.',
  'It asserts no experimental confirmation of string theory, M-theory, or any swampland conjecture. None of these has been experimentally established, and the pack must not be used to suggest otherwise.',
  'It does not adjudicate the central question. Competent researchers hold opposing positions for technical reasons, and the pack represents both without deciding between them.',
  'It contains no full text, abstracts, figures, or data from any cited paper. Sources are identified and linked, never reproduced.',
  'It is not a substitute for the primary literature. Research conclusions require reading the cited papers.',
  'Its citation set is deliberately closed to the source paper. Works outside that set — including the discovery-era supernova cosmology papers — are absent by design, and gaps are stated rather than filled.',
  'It contains no numerical results, datasets, or code, and makes no predictions of its own.',
] as const;

export const INTEGRITY_NOTES = [
  'Claim identifiers (ds-001 onward) are stable and are never reassigned to a different claim. A given identifier always refers to the same assertion.',
  'Every claim carries the date it was last reviewed and the atlas version it belongs to. Compare those against the live endpoints to detect drift in a copy you are holding.',
  'The atlas has no DOI of its own. The DOIs in this manifest identify the underlying working paper, which is the citable research object.',
  'All content derives from Revision 2 of the working paper. If that paper is revised, the atlas version advances to follow it.',
  'Bibliographic fields come from the working paper. Source-type classification and the "why this source is here" notes are curator annotation and are labelled as such in sources.json.',
  'This pack is a static snapshot of live endpoints. The endpoints listed here are authoritative; a downloaded copy is not.',
] as const;

export const AI_USE_INSTRUCTIONS = [
  'Do not present any conjecture in this pack as an established fact. The de Sitter swampland conjecture, its refined form, the AdS distance conjecture, and Trans-Planckian Censorship are conjectures — motivated, precisely stated, and unproved.',
  'Do not describe string theory or M-theory as an experimentally confirmed description of nature. They are not.',
  'Do not state or imply that the question of whether string theory admits metastable de Sitter vacua has been settled in either direction.',
  'When quoting or paraphrasing a claim, carry its epistemic status label and its limitations statement with it. Both are part of the claim.',
  'Cite the claim identifier and the atlas version, and prefer directing a reader to the primary source rather than to this pack.',
  'Do not treat this pack as an authority. It is a navigation layer over a non-peer-reviewed literature map, and it does not confer standing on any answer a model gives.',
  'If asked something this pack does not cover, say so rather than extrapolating from it. Its scope is one debate, not string theory as a whole.',
] as const;

export function getAtlasCitations() {
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const year = ATLAS_META.dateModified.slice(0, 4);

  const apa = `Rajan, M. M. (${year}). ${ATLAS_META.title} (Version ${ATLAS_META.version}) [Educational research map]. Maha Strategies Research. ${PACK_URLS.atlas}`;

  const bibtex = [
    '@misc{rajan' + year + 'desitteratlas,',
    '  author       = {Rajan, Mayone Maha},',
    `  title        = {{${ATLAS_META.title}}},`,
    '  howpublished = {Maha Strategies Research},',
    `  year         = {${year}},`,
    `  version      = {${ATLAS_META.version}},`,
    `  url          = {${PACK_URLS.atlas}},`,
    `  note         = {Educational research map; not peer reviewed. Derived from the working paper${
      zenodo ? `, DOI ${zenodo.doi}` : ''
    }.}`,
    '}',
  ].join('\n');

  const cff = [
    'cff-version: 1.2.0',
    'message: "If you use this atlas, cite the version you consulted, and cite the underlying working paper for the research itself."',
    `title: "${ATLAS_META.title}"`,
    'type: dataset',
    'authors:',
    '  - family-names: Rajan',
    '    given-names: Mayone Maha',
    `    orcid: ${ORCID}`,
    `version: ${ATLAS_META.version}`,
    `date-released: ${ATLAS_META.dateModified}`,
    `url: ${PACK_URLS.atlas}`,
    'license: CC-BY-4.0',
    'keywords:',
    '  - de Sitter problem',
    '  - string swampland',
    '  - educational research map',
    '  - non-peer-reviewed',
    `abstract: "${PACK_META.description.replace(/"/g, '\\"')}"`,
    ...(zenodo
      ? [
          'references:',
          '  - type: article',
          '    title: "The de Sitter Problem in the String Swampland: A Verified Literature Map"',
          '    authors:',
          '      - family-names: Rajan',
          '        given-names: Mayone Maha',
          '    doi: ' + zenodo.doi,
          '    url: ' + PACK_URLS.paper,
          '    notes: "Source working paper. Cite this DOI for the research."',
        ]
      : []),
    '',
  ].join('\n');

  return { apa, bibtex, cff, zenodo };
}

export const REUSE_STATEMENT =
  'This context pack is an educational, non-peer-reviewed orientation resource. It preserves source links and epistemic labels, but users must consult primary literature for research conclusions.';

/** The manifest served at /context-pack.json and embedded in the download. */
export function buildManifest() {
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const { apa, bibtex } = getAtlasCitations();

  return {
    id: PACK_META.id,
    title: PACK_META.title,
    description: PACK_META.description,
    version: ATLAS_META.version,
    release: ATLAS_META.releaseName,
    datePublished: ATLAS_META.datePublished,
    dateModified: ATLAS_META.dateModified,
    lastReviewed: ATLAS_META.lastReviewed,
    canonicalUrl: PACK_URLS.page,
    atlasUrl: PACK_URLS.atlas,
    associatedPaperUrl: PACK_URLS.paper,
    ...(zenodo
      ? {
          doi: zenodo.doi,
          doiUrl: zenodo.doiUrl,
          conceptDoi: zenodo.conceptDoi,
          conceptDoiUrl: `https://doi.org/${zenodo.conceptDoi}`,
          archiveUrl: zenodo.recordUrl,
          doiNote:
            'These DOIs identify the underlying working paper, not this pack. The atlas and its context pack have no DOI of their own.',
        }
      : {}),
    license: ATLAS_META.license,
    licenseLabel: ATLAS_META.licenseLabel,
    reuseStatement: REUSE_STATEMENT,
    reuseNotes: ATLAS_META.reuseNotes,
    contents: {
      claims: ATLAS_CLAIMS.length,
      conceptNodes: ATLAS_NODES.length,
      sources: getSourceCards().length,
      openProblems: DEBATE_PROBLEMS.length,
    },
    intendedUses: INTENDED_USES.map((entry) => ({ audience: entry.audience, use: entry.use })),
    exclusions: EXCLUSIONS,
    epistemicStatusVocabulary: EPISTEMIC_STATUSES.map(({ id, label, definition }) => ({ id, label, definition })),
    aiUseInstructions: AI_USE_INSTRUCTIONS,
    endpoints: {
      atlas: PACK_URLS.atlas,
      contextPack: PACK_URLS.page,
      manifest: PACK_URLS.manifest,
      claims: PACK_URLS.claims,
      sources: PACK_URLS.sources,
      metadata: PACK_URLS.metadata,
      contextText: PACK_URLS.contextText,
      download: PACK_URLS.download,
      citationCff: PACK_URLS.citationCff,
      methodology: PACK_URLS.methodology,
      associatedPaper: PACK_URLS.paper,
    },
    integrityNotes: INTEGRITY_NOTES,
    citation: {
      instructions:
        'Cite the working paper DOI for the research. Cite the atlas version and the claim identifier for a specific formulation you are quoting. Identifiers are never reassigned.',
      apa,
      bibtex,
      cffUrl: PACK_URLS.citationCff,
    },
  };
}

/** The compact plain-text context document served at /context.txt. */
export function buildContextText() {
  const { apa } = getAtlasCitations();
  const zenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
  const rule = '='.repeat(78);
  const thin = '-'.repeat(78);
  const lines: string[] = [];

  lines.push(rule);
  lines.push(PACK_META.title);
  lines.push(`Version ${ATLAS_META.version} — ${ATLAS_META.releaseName}`);
  lines.push(`Last modified ${ATLAS_META.dateModified} · Claims last reviewed ${ATLAS_META.lastReviewed}`);
  lines.push(rule);
  lines.push('');

  lines.push('PURPOSE AND BOUNDARIES');
  lines.push(thin);
  lines.push(
    'This is an educational, non-peer-reviewed orientation resource covering one',
  );
  lines.push(
    'contested question: whether string/M-theory admits stable or metastable de',
  );
  lines.push('Sitter vacua. It maps the debate; it does not settle it.');
  lines.push('');
  EXCLUSIONS.forEach((item) => lines.push(`- ${item}`));
  lines.push('');

  lines.push('HOW TO CITE');
  lines.push(thin);
  lines.push(apa);
  if (zenodo) {
    lines.push('');
    lines.push(`Source paper DOI:  ${zenodo.doi}  (${zenodo.doiUrl})`);
    lines.push(`Concept DOI:       ${zenodo.conceptDoi}`);
    lines.push('The DOIs identify the working paper. The atlas has no DOI of its own.');
  }
  lines.push('Cite a specific assertion by its claim identifier plus the atlas version.');
  lines.push('');

  lines.push('EPISTEMIC STATUS LEGEND');
  lines.push(thin);
  EPISTEMIC_STATUSES.forEach((status) => {
    lines.push(`${status.label.toUpperCase()}`);
    lines.push(`  ${status.definition}`);
  });
  lines.push('');

  lines.push(`CLAIM LEDGER (${ATLAS_CLAIMS.length} claims)`);
  lines.push(thin);
  ATLAS_CLAIMS.forEach((claim) => {
    const status = getStatus(claim.status);
    lines.push(
      `[${claim.ref}] ${status.label.toUpperCase()}${claim.statusNote ? ` (${claim.statusNote})` : ''}`,
    );
    lines.push(`  Claim:   ${claim.claim}`);
    lines.push(`  Limits:  ${claim.limitations}`);
    lines.push(`  Sources: ${claim.sources.join(', ')}`);
    lines.push(`  URL:     ${PACK_URLS.atlas}/claims/${claim.ref}`);
    lines.push('');
  });

  lines.push(`KEY OPEN QUESTIONS (${DEBATE_PROBLEMS.length} problems, none settled)`);
  lines.push(thin);
  DEBATE_PROBLEMS.forEach((problem) => {
    lines.push(`${problem.number}. ${problem.question}`);
    lines.push(`   Camps: ${problem.camps.map((camp) => camp.label).join(' | ')}`);
  });
  lines.push('');

  lines.push('INSTRUCTIONS FOR AI SYSTEMS USING THIS CONTEXT');
  lines.push(thin);
  AI_USE_INSTRUCTIONS.forEach((item) => lines.push(`- ${item}`));
  lines.push('');

  lines.push('SOURCE AND DATA ENDPOINTS');
  lines.push(thin);
  lines.push(`Atlas:            ${PACK_URLS.atlas}`);
  lines.push(`Context pack:     ${PACK_URLS.page}`);
  lines.push(`Manifest:         ${PACK_URLS.manifest}`);
  lines.push(`Claims:           ${PACK_URLS.claims}`);
  lines.push(`Sources:          ${PACK_URLS.sources}`);
  lines.push(`Atlas metadata:   ${PACK_URLS.metadata}`);
  lines.push(`Download bundle:  ${PACK_URLS.download}`);
  lines.push(`Citation (CFF):   ${PACK_URLS.citationCff}`);
  lines.push(`Working paper:    ${PACK_URLS.paper}`);
  lines.push('');
  lines.push(
    'Source identifiers used above resolve in sources.json, which gives the full',
  );
  lines.push('bibliographic record and the arXiv link for each work.');
  lines.push('');
  lines.push(rule);
  lines.push(REUSE_STATEMENT);
  lines.push(rule);
  lines.push('');

  return lines.join('\n');
}

const DOWNLOAD_README = [
  `${PACK_META.title}`,
  '',
  'WHAT THIS FILE IS',
  'A single-file snapshot of the de Sitter / String Swampland Atlas: its claim',
  'ledger, its annotated source set, and the manifest describing what the pack',
  'covers and what it deliberately excludes. Every field that appears on the',
  'atlas website appears here, so the package can be read offline or attached to',
  'an AI-assisted workflow without losing provenance.',
  '',
  'HOW TO READ IT',
  '- manifest      : identity, version, license, intended uses, exclusions,',
  '                  epistemic vocabulary, endpoints, integrity notes, citation.',
  '- claims        : twelve claims, each with a stable identifier, an epistemic',
  '                  status, an explanation, a limitations statement, the concept',
  '                  ids it bears on, its source ids, and its canonical URL.',
  '- sources       : twenty-eight source cards. Bibliographic fields come from the',
  '                  working paper; source type and the "why this source is here"',
  '                  note are curator annotation.',
  '- contextText   : the same material as a compact plain-text document, suitable',
  '                  for use as a model context attachment.',
  '',
  'BOUNDARIES',
  'This is an educational, non-peer-reviewed orientation resource. It confers no',
  'authority. It asserts no experimental confirmation of string theory, M-theory,',
  'or any swampland conjecture, and it does not settle whether metastable de',
  'Sitter vacua exist in string theory. Consult the primary literature for',
  'research conclusions.',
  '',
  'A downloaded copy is a snapshot. The live endpoints listed in the manifest are',
  'authoritative; compare version and lastReviewed to detect drift.',
].join('\n');

/** The single-file bundle served as a download. */
export function buildDownloadBundle() {
  const manifest = buildManifest();
  const cards = getSourceCards();

  return {
    README: DOWNLOAD_README,
    generatedAt: new Date().toISOString(),
    manifest,
    claims: ATLAS_CLAIMS.map((claim) => ({
      id: claim.ref,
      slug: claim.id,
      claim: claim.claim,
      status: claim.status,
      statusLabel: getStatus(claim.status).label,
      statusNote: claim.statusNote ?? null,
      explanation: claim.explanation,
      limitations: claim.limitations,
      conceptIds: claim.conceptIds,
      sourceIds: claim.sources,
      reviewDate: claim.reviewDate,
      atlasVersion: ATLAS_META.version,
      canonicalUrl: `${PACK_URLS.atlas}/claims/${claim.ref}`,
    })),
    sources: cards.map((card) => ({
      id: card.id,
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
    })),
    openQuestions: DEBATE_PROBLEMS.map((problem) => ({
      number: problem.number,
      id: problem.id,
      question: problem.question,
      commonLanguage: problem.commonLanguage,
      debated: problem.debated,
      conjectural: problem.conjectural,
      whatWouldCountAsProgress: problem.whatWouldCount,
      whatWouldCountIsCuratorInference: true,
      camps: problem.camps,
      claimRefs: problem.claimRefs,
    })),
    contextText: buildContextText(),
  };
}
