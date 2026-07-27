// The Maha Research Context Registry: a public index of reusable research
// artifacts.
//
// INCLUSION RULE: an artifact appears here only when its canonical URL,
// machine-readable endpoints, status, and any DOI can be verified against this
// repository. Nothing is listed on the strength of a description alone. Where
// metadata for a planned artifact is incomplete, it stays out of the registry
// and is recorded in PENDING_ARTIFACTS instead, so the gap is visible rather
// than papered over.
//
// Fields that already live elsewhere (atlas version, exclusions, paper status,
// DOIs) are read from their owning module rather than restated, so a registry
// entry cannot drift from the artifact it describes.

import {
  ATLAS_META,
  ATLAS_CLAIMS,
  ATLAS_PAPER_SLUG,
  ATLAS_PATH,
  getSourceCards,
} from '@/lib/atlas/de-sitter';
import { CONTEXT_PACK_PATH, EXCLUSIONS, INTENDED_USES } from '@/lib/atlas/context-pack';
import { STANDARD_CLAUSES, STANDARD_META, STANDARD_PATH } from '@/lib/standards/maha-provenance';
import { getWorkingPaper } from '@/lib/working-papers';
import { getZenodoRecord } from '@/lib/zenodo-records';

export const SITE_URL = 'https://research.mahastrategies.com';

export const REGISTRY_PATH = '/registry';

export type ArtifactType = 'atlas' | 'context-pack' | 'working-paper' | 'dataset' | 'methodology';

export type ArtifactTypeDescriptor = {
  id: ArtifactType;
  label: string;
  definition: string;
};

/**
 * The distinctions the registry exists to preserve. A reader should be able to
 * tell from the type alone what kind of authority an artifact does and does not
 * carry.
 */
export const ARTIFACT_TYPES: ArtifactTypeDescriptor[] = [
  {
    id: 'atlas',
    label: 'Research atlas',
    definition:
      'An orientation layer over a body of literature. It maps how concepts connect and labels how well each claim is supported. It is not a source; it points at sources.',
  },
  {
    id: 'context-pack',
    label: 'Context pack',
    definition:
      'A bounded, versioned package of an atlas or dataset — claims, sources, exclusions, and citation metadata — designed to be reused, including as context for an AI-assisted workflow, without losing its provenance.',
  },
  {
    id: 'working-paper',
    label: 'Working paper',
    definition:
      'A self-published research document with a stated status and version. Not peer reviewed unless it explicitly says so, and never to be represented as a journal article.',
  },
  {
    id: 'dataset',
    label: 'Dataset',
    definition:
      'Structured data with documented provenance and reuse terms. No dataset is currently registered.',
  },
  {
    id: 'methodology',
    label: 'Methodology or standard',
    definition:
      'A document specifying how research artifacts are produced, versioned, sourced, or audited. It carries no scientific findings of its own, and self-published methodology is not an accredited standard.',
  },
];

export function getArtifactType(id: ArtifactType): ArtifactTypeDescriptor {
  return ARTIFACT_TYPES.find((type) => type.id === id) ?? ARTIFACT_TYPES[0];
}

export type MachineReadableEndpoint = {
  label: string;
  path: string;
  format: string;
  note?: string;
};

export type ArtifactLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ArtifactDoi = {
  version: string;
  concept?: string;
  recordUrl: string;
  doiUrl: string;
  /** What the DOI actually identifies, when that is not the artifact itself. */
  identifies: string;
};

/**
 * One registry entry. Adding a future atlas, pack, or dataset should require
 * exactly one of these and no changes to the page or the endpoint.
 */
export type RegistryArtifact = {
  id: string;
  title: string;
  shortTitle: string;
  type: ArtifactType;
  /** Plain-language status shown as the card's primary label. */
  status: string;
  /** The qualification that keeps the status honest. */
  statusNote: string;
  description: string;
  canonicalPath: string;
  machineReadable: MachineReadableEndpoint[];
  relatedLinks: ArtifactLink[];
  doi?: ArtifactDoi;
  license: string;
  licenseLabel: string;
  intendedUse: string[];
  exclusions: string[];
  keywords: string[];
  topics: string[];
  version: string;
  reviewDate: string;
  lastUpdated: string;
  /** Short capability labels rendered as chips, e.g. "Claim ledger". */
  features: string[];
};

const atlasZenodo = getZenodoRecord(ATLAS_PAPER_SLUG);
const atlasPaper = getWorkingPaper(ATLAS_PAPER_SLUG);
const PAPER_PATH = `/papers/${ATLAS_PAPER_SLUG}`;

const SHARED_TOPICS = ['String theory', 'Quantum gravity', 'Cosmology'];

const CC_BY = 'https://creativecommons.org/licenses/by/4.0/';

export const REGISTRY_META = {
  title: 'Maha Research Context Registry',
  purpose:
    'A public index of versioned, source-aware research artifacts designed for human reading and bounded AI-assisted use.',
  description:
    'A public index of versioned, source-aware research artifacts from Maha Strategies Research: atlases, context packs, and working papers, each with its status, machine-readable endpoints, exclusions, and citation metadata stated up front. Inclusion is a statement about provenance, not about scientific consensus.',
  version: '1.0.0',
  lastUpdated: '2026-07-27',
  license: CC_BY,
  licenseLabel: 'CC BY 4.0',
  notAJournal:
    'This registry is not a journal, a peer-review system, or a scientific authority. It indexes artifacts and records what each one is, what it is based on, and what it does not establish. Listing an artifact here says nothing about whether the field agrees with it.',
} as const;

export const REGISTRY_ARTIFACTS: RegistryArtifact[] = [
  {
    id: 'de-sitter-swampland-atlas',
    title: 'The de Sitter / String Swampland Atlas',
    shortTitle: 'de Sitter / Swampland Atlas',
    type: 'atlas',
    status: 'Public educational orientation tool',
    statusNote:
      'Not peer reviewed. Does not adjudicate whether string theory admits metastable de Sitter vacua, and asserts no experimental confirmation of string theory, M-theory, or any swampland conjecture.',
    description:
      'A source-first concept map and claim ledger for the de Sitter problem in the string/M-theory swampland program. Sixteen concept nodes, twelve claims with stable identifiers and epistemic status labels, seven open problems presented with both camps, and twenty-eight annotated source cards — every citation drawn from the verified set of the underlying working paper. Ships with a downloadable context pack carrying its own exclusions.',
    canonicalPath: ATLAS_PATH,
    machineReadable: [
      { label: 'Atlas metadata', path: `${ATLAS_PATH}/metadata.json`, format: 'application/json', note: 'Concept nodes, edges, and the claim ledger.' },
      { label: 'Claim ledger', path: `${ATLAS_PATH}/claims.json`, format: 'application/json', note: 'Claims with status, limitations, source ids, review date, canonical URL.' },
      { label: 'Source trail', path: `${ATLAS_PATH}/sources.json`, format: 'application/json', note: 'Source cards with verification labels and provenance notes.' },
      { label: 'Context pack manifest', path: `${ATLAS_PATH}/context-pack.json`, format: 'application/json', note: 'Intended uses, exclusions, endpoints, integrity and citation notes.' },
      { label: 'Plain-text context', path: `${ATLAS_PATH}/context.txt`, format: 'text/plain', note: 'Compact context document for AI-assisted workflows.' },
      { label: 'Context pack download', path: `${CONTEXT_PACK_PATH}/download.json`, format: 'application/json', note: 'Single-file bundle: manifest, claims, sources, open questions, README.' },
      { label: 'Citation metadata', path: `${ATLAS_PATH}/citation.cff`, format: 'text/yaml' },
    ],
    relatedLinks: [
      { label: 'Context pack', href: CONTEXT_PACK_PATH },
      { label: 'Source working paper', href: PAPER_PATH },
      ...(atlasZenodo ? [{ label: 'Zenodo record', href: atlasZenodo.recordUrl, external: true }] : []),
    ],
    ...(atlasZenodo
      ? {
          doi: {
            version: atlasZenodo.doi,
            concept: atlasZenodo.conceptDoi,
            recordUrl: atlasZenodo.recordUrl,
            doiUrl: atlasZenodo.doiUrl,
            identifies:
              'the underlying working paper, not the atlas. The atlas and its context pack have no DOI of their own.',
          },
        }
      : {}),
    license: CC_BY,
    licenseLabel: 'CC BY 4.0',
    intendedUse: INTENDED_USES.map((entry) => `${entry.audience}: ${entry.use}`),
    exclusions: [...EXCLUSIONS],
    keywords: [
      'de Sitter problem',
      'String swampland',
      'KKLT',
      'Large Volume Scenario',
      'Moduli stabilization',
      'Epistemic status labels',
      'Claim ledger',
    ],
    topics: SHARED_TOPICS,
    version: ATLAS_META.version,
    reviewDate: ATLAS_META.lastReviewed,
    lastUpdated: ATLAS_META.dateModified,
    features: [
      `Claim ledger (${ATLAS_CLAIMS.length})`,
      `Source trail (${getSourceCards().length})`,
      'Machine-readable JSON',
      'Downloadable context pack',
      'Stable claim URLs',
    ],
  },
  {
    id: 'de-sitter-swampland-literature-map',
    title: 'The de Sitter Problem in the String Swampland: A Verified Literature Map',
    shortTitle: 'de Sitter literature map',
    type: 'working-paper',
    status: atlasPaper ? `${atlasPaper.status} · ${atlasPaper.reviewStatus}` : 'Preprint · Not peer reviewed',
    statusNote:
      'A literature map, not original research. It surveys a contested debate and represents the disagreement rather than resolving it.',
    description:
      'A survey of the de Sitter problem in string/M-theory structured around seven open problems and their competing camps. Every cited arXiv identifier was independently resolved against arXiv and INSPIRE-HEP before publication, and provenance tags record the verification status of each cited work. This paper is the authority for every citation used by the atlas built on it.',
    canonicalPath: PAPER_PATH,
    machineReadable: [
      { label: 'Paper metadata', path: `${PAPER_PATH}/metadata.json`, format: 'application/json', note: 'Status, version, structured references, archive record.' },
      { label: 'BibTeX', path: `${PAPER_PATH}/citation.bib`, format: 'application/x-bibtex' },
      { label: 'CITATION.cff', path: `${PAPER_PATH}/citation.cff`, format: 'text/yaml' },
      { label: 'Stable PDF', path: `${PAPER_PATH}.pdf`, format: 'application/pdf' },
    ],
    relatedLinks: [
      { label: 'Companion atlas', href: ATLAS_PATH },
      { label: 'Context pack', href: CONTEXT_PACK_PATH },
      ...(atlasZenodo ? [{ label: 'Zenodo record', href: atlasZenodo.recordUrl, external: true }] : []),
    ],
    ...(atlasZenodo
      ? {
          doi: {
            version: atlasZenodo.doi,
            concept: atlasZenodo.conceptDoi,
            recordUrl: atlasZenodo.recordUrl,
            doiUrl: atlasZenodo.doiUrl,
            identifies: 'this paper. Cite the version DOI for the archived edition you consulted.',
          },
        }
      : {}),
    license: CC_BY,
    licenseLabel: 'CC BY 4.0',
    intendedUse: [
      'Researchers and students who need the structure of the de Sitter debate and a provenance-checked entry point into its literature.',
      'Anyone assessing what an AI-assisted synthesis can and cannot be trusted to produce: the paper documents its own verification passes and corrections.',
    ],
    exclusions: [
      'Not peer reviewed, and must not be represented as a journal article.',
      'Not original research. It maps a debate; it advances no physics position of its own.',
      'It does not adjudicate whether string theory admits metastable de Sitter vacua, and takes no side on the question.',
      'Verification means a citation resolves to a real paper correctly placed in the debate. It is not an endorsement of that paper’s argument — most works cited disagree with one another.',
      'Affiliations and camp placements are time-stamped to the revision date, not permanent.',
    ],
    keywords: [
      'de Sitter vacua',
      'Swampland program',
      'String theory landscape',
      'KKLT construction',
      'Large Volume Scenario',
      'Dark Dimension',
      'Citation verification',
    ],
    topics: SHARED_TOPICS,
    version: atlasPaper?.version ?? '2.0',
    reviewDate: atlasPaper?.versionDate ?? '2026-07-26',
    lastUpdated: atlasPaper?.versionDate ?? '2026-07-26',
    features: ['Provenance-tagged citations', 'Verification ledger', 'Machine-readable metadata', 'Archived with DOI'],
  },
  {
    id: 'maha-provenance-standard',
    title: STANDARD_META.title,
    shortTitle: STANDARD_META.shortTitle,
    type: 'methodology',
    status: STANDARD_META.status,
    statusNote: STANDARD_META.statusNote,
    description:
      'A claim-level provenance framework specifying how an assertion is given a stable identifier, an epistemic status, a traceable source, and an explicit statement of what it does not establish — and how those properties survive packaging, export, and reuse by an AI system. Fourteen clauses across provenance, claim structure, separation of judgement from fact, versioning, and machine reuse, each linking to where it is enforced. Descriptive of practice already in use, not proposed for adoption.',
    canonicalPath: STANDARD_PATH,
    machineReadable: [
      {
        label: 'Standard record',
        path: `${STANDARD_PATH}/metadata.json`,
        format: 'application/json',
        note: 'Clauses with rules, rationale, and evidence URLs; conformance levels and self-assessed conformance.',
      },
    ],
    relatedLinks: [
      { label: 'Applied in the de Sitter Atlas', href: ATLAS_PATH },
      { label: 'Applied in the source working paper', href: PAPER_PATH },
    ],
    license: CC_BY,
    licenseLabel: 'CC BY 4.0',
    intendedUse: [
      'Readers assessing how far a Maha artifact can be trusted, who want the rule stated rather than inferred from the output.',
      'Anyone building self-published or AI-assisted research who wants a worked example of attaching provenance and epistemic status at the level of the individual claim.',
    ],
    exclusions: [
      'Not a peer-reviewed standard and not issued by any standards body.',
      'Not adopted or in use outside Maha Strategies Research, and not proposed for anyone else to adopt.',
      'Conformance is self-assessed. No external body has audited the level assignments; the evidence links exist so a reader can check them.',
      'Descriptive rather than prescriptive: where a clause and the codebase disagree, the codebase is the fact and the clause is the error.',
      'It is not a general research methodology and not a substitute for peer review.',
      'It has no DOI. Cite it by URL and version.',
    ],
    keywords: [
      'Claim-level provenance',
      'Epistemic status labels',
      'Citation verification',
      'Research versioning',
      'Machine-readable provenance',
      'AI-assisted research disclosure',
    ],
    topics: ['Research methodology', 'Provenance'],
    version: STANDARD_META.version,
    reviewDate: STANDARD_META.dateModified,
    lastUpdated: STANDARD_META.dateModified,
    features: [
      `Clauses (${STANDARD_CLAUSES.length})`,
      'Evidence links per clause',
      'Conformance levels',
      'Machine-readable JSON',
      'No DOI',
    ],
  },
];

/**
 * Artifacts that were requested or planned but cannot be listed yet, with the
 * specific metadata that is missing. Published on the registry page so the
 * absence is legible rather than silent.
 */
export const PENDING_ARTIFACTS: { title: string; type: ArtifactType; missing: string }[] = [];

export function getArtifact(id: string): RegistryArtifact | undefined {
  return REGISTRY_ARTIFACTS.find((artifact) => artifact.id === id);
}

/** Every distinct topic across registered artifacts, for the topic filter. */
export function getRegistryTopics(): string[] {
  return [...new Set(REGISTRY_ARTIFACTS.flatMap((artifact) => artifact.topics))].sort();
}

/** Types that actually have at least one registered artifact. */
export function getPopulatedTypes(): ArtifactTypeDescriptor[] {
  const present = new Set(REGISTRY_ARTIFACTS.map((artifact) => artifact.type));
  return ARTIFACT_TYPES.filter((type) => present.has(type.id));
}

/** The registry record served at /registry.json. */
export function buildRegistryRecord() {
  return {
    title: REGISTRY_META.title,
    description: REGISTRY_META.description,
    purpose: REGISTRY_META.purpose,
    version: REGISTRY_META.version,
    lastUpdated: REGISTRY_META.lastUpdated,
    canonicalUrl: `${SITE_URL}${REGISTRY_PATH}`,
    license: REGISTRY_META.license,
    licenseLabel: REGISTRY_META.licenseLabel,
    disclaimer: REGISTRY_META.notAJournal,
    artifactTypeVocabulary: ARTIFACT_TYPES.map(({ id, label, definition }) => ({ id, label, definition })),
    count: REGISTRY_ARTIFACTS.length,
    artifacts: REGISTRY_ARTIFACTS.map((artifact) => ({
      id: artifact.id,
      title: artifact.title,
      type: artifact.type,
      typeLabel: getArtifactType(artifact.type).label,
      status: artifact.status,
      statusNote: artifact.statusNote,
      description: artifact.description,
      canonicalUrl: `${SITE_URL}${artifact.canonicalPath}`,
      machineReadableUrls: artifact.machineReadable.map((endpoint) => ({
        label: endpoint.label,
        url: `${SITE_URL}${endpoint.path}`,
        format: endpoint.format,
        note: endpoint.note ?? null,
      })),
      relatedUrls: artifact.relatedLinks.map((link) => ({
        label: link.label,
        url: link.external ? link.href : `${SITE_URL}${link.href}`,
      })),
      doi: artifact.doi
        ? {
            version: artifact.doi.version,
            concept: artifact.doi.concept ?? null,
            doiUrl: artifact.doi.doiUrl,
            recordUrl: artifact.doi.recordUrl,
            identifies: artifact.doi.identifies,
          }
        : null,
      license: artifact.license,
      licenseLabel: artifact.licenseLabel,
      intendedUse: artifact.intendedUse,
      exclusions: artifact.exclusions,
      keywords: artifact.keywords,
      topics: artifact.topics,
      features: artifact.features,
      version: artifact.version,
      reviewDate: artifact.reviewDate,
      lastUpdated: artifact.lastUpdated,
    })),
    pendingArtifacts: PENDING_ARTIFACTS,
    inclusionPolicy: [
      'An artifact is listed only when its canonical URL, machine-readable endpoints, status, and any DOI can be verified against the source repository.',
      'Inclusion records provenance. It is not a claim that the field agrees with an artifact, and it is not peer review.',
      'Each entry states what its artifact does not establish. Those exclusions travel with the record and should be preserved on reuse.',
      'Artifacts whose metadata is incomplete are listed under pendingArtifacts with the specific gap named, rather than being included on the strength of a description.',
    ],
  };
}
