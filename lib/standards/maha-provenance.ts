// The Maha Provenance Standard.
//
// This module is DESCRIPTIVE. Every clause below documents a practice already
// implemented in this repository, and each one names the artifact or module
// where it is enforced. Nothing here is aspirational, and nothing describes a
// procedure that is not actually followed. If a clause stops being true of the
// codebase, the clause is wrong and should be changed or removed — not left
// standing as a claim about how the work is done.

export const STANDARD_PATH = '/standards/maha-provenance-standard';

export const STANDARD_META = {
  id: 'maha-provenance-standard',
  title: 'The Maha Provenance Standard',
  shortTitle: 'Maha Provenance Standard',
  subtitle: 'A claim-level provenance framework for self-published research artifacts',
  purpose:
    'A written specification of how claims in Maha Strategies Research artifacts are identified, labelled, sourced, bounded, versioned, and corrected.',
  description:
    'A claim-level provenance framework for self-published research artifacts. It specifies how an individual assertion is given a stable identifier, an epistemic status, a traceable source, and an explicit statement of what it does not establish — and how those properties are preserved when the artifact is packaged, exported, or reused by an AI system. Descriptive of practice already in use rather than proposed for adoption.',
  version: '1.0.0',
  datePublished: '2026-07-27',
  dateModified: '2026-07-27',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  licenseLabel: 'CC BY 4.0',
  status: 'Internal methodology specification',
  statusNote:
    'Not a peer-reviewed standard, not issued by a standards body, and not adopted outside this project. It documents how one research project works, so that its outputs can be checked against a stated rule rather than taken on trust.',
} as const;

export type StandardClause = {
  id: string;
  number: string;
  title: string;
  rule: string;
  rationale: string;
  /** Where the clause is actually enforced, so a reader can check it. */
  evidence: { label: string; href: string; external?: boolean }[];
};

export const STANDARD_CLAUSES: StandardClause[] = [
  {
    id: 'provenance-tags',
    number: 'P1',
    title: 'Every citation carries a provenance tag',
    rule:
      'A cited work must be marked with the basis on which it is cited: independently resolved against a primary index, cited in good faith but not re-resolved, or foundational and cited by journal reference. The tag states what was checked, not how good the work is.',
    rationale:
      'A citation list is the easiest part of a document to fabricate and the least likely part to be checked. Tagging forces the question "was this actually resolved?" to be answered before publication rather than assumed afterwards.',
    evidence: [
      { label: 'Provenance tags and Verification Ledger in the de Sitter paper', href: '/papers/de_sitter_swampland_map' },
      { label: 'Verification labels in the atlas source trail', href: '/atlas/de-sitter-swampland/sources.json' },
    ],
  },
  {
    id: 'verification-not-endorsement',
    number: 'P2',
    title: 'Verification is not endorsement',
    rule:
      'Marking a citation verified asserts only that the identifier resolves to a real work and that the work is correctly placed in the argument. It asserts nothing about whether that work is right.',
    rationale:
      'Without this separation, a well-sourced document starts to read as a well-supported one. In a contested field most cited works disagree with each other, and a provenance system that blurred the two would misrepresent the literature it maps.',
    evidence: [
      { label: 'Standing caveats in the paper’s Verification Ledger', href: '/papers/de_sitter_swampland_map' },
      { label: 'Verification vocabulary in sources.json', href: '/atlas/de-sitter-swampland/sources.json' },
    ],
  },
  {
    id: 'closed-citation-set',
    number: 'P3',
    title: 'A derived artifact inherits its source’s citation set',
    rule:
      'An artifact built on a verified source may cite only works already in that source’s verified set. Where a claim would benefit from a citation outside the set, the gap is stated on the claim instead of being filled.',
    rationale:
      'The failure mode this prevents is subtle: a derived work adds a plausible, famous, entirely real citation that was never checked by anyone in the chain. Closing the set makes the boundary of what was verified survive derivation.',
    evidence: [
      { label: 'ds-001 states its citation gap rather than filling it', href: '/atlas/de-sitter-swampland/claims/ds-001' },
      { label: 'Provenance notes in sources.json', href: '/atlas/de-sitter-swampland/sources.json' },
    ],
  },
  {
    id: 'epistemic-status',
    number: 'C1',
    title: 'Every claim carries an epistemic status',
    rule:
      'A claim must be labelled established result, active research, conjecture, or speculative interpretation. The status is part of the claim, not commentary on it, and must travel with the wording wherever the claim goes.',
    rationale:
      'Prose flattens. A sentence about a conjecture and a sentence about a measurement read identically once quoted out of context. An explicit label is the only part of a claim that survives paraphrase intact.',
    evidence: [
      { label: 'Status vocabulary and definitions', href: '/atlas/de-sitter-swampland/claims.json' },
      { label: 'The epistemic legend on the atlas', href: '/atlas/de-sitter-swampland' },
    ],
  },
  {
    id: 'stable-identifiers',
    number: 'C2',
    title: 'Claims have stable identifiers that are never reassigned',
    rule:
      'Each claim receives a permanent identifier. An identifier always refers to the same assertion; it is never reused for a different one, and renumbering is not permitted.',
    rationale:
      'An external citation to a claim is worthless if the target can silently change underneath it. Fixing identifiers is what makes a claim citable at all.',
    evidence: [
      { label: 'ds-001 … ds-012 with canonical URLs', href: '/atlas/de-sitter-swampland/claims.json' },
      { label: 'A claim detail page', href: '/atlas/de-sitter-swampland/claims/ds-004' },
    ],
  },
  {
    id: 'exclusions',
    number: 'C3',
    title: 'Exclusions are content, not disclaimer',
    rule:
      'Each claim states its scope and limitations, and each artifact states what it does not establish. These statements are published in the same machine-readable form as the claims themselves, not confined to a footer.',
    rationale:
      'A disclaimer at the bottom of a page does not survive extraction. A limitations field attached to a claim record does. If the boundary matters, it has to be structured like the content.',
    evidence: [
      { label: 'Per-claim limitations in claims.json', href: '/atlas/de-sitter-swampland/claims.json' },
      { label: 'Artifact-level exclusions in the context pack manifest', href: '/atlas/de-sitter-swampland/context-pack.json' },
    ],
  },
  {
    id: 'annotation-separation',
    number: 'S1',
    title: 'Curator annotation is kept separate from bibliographic fact',
    rule:
      'Fields taken from a source and fields added by the curator are stored separately and labelled distinctly in the published record. A reader must be able to tell which is which without reading the source code.',
    rationale:
      'Editorial judgement is legitimate and useful; passing it off as a property of the source is not. Keeping the two apart in the data model makes the boundary visible rather than a matter of the curator’s memory.',
    evidence: [
      { label: 'sourceType and whyHere marked as curator annotation', href: '/atlas/de-sitter-swampland/sources.json' },
      { label: 'Curator inference labelled in the disagreement map', href: '/atlas/de-sitter-swampland' },
    ],
  },
  {
    id: 'derivation-over-recall',
    number: 'S2',
    title: 'Derive, do not recall',
    rule:
      'Where a metadata value can be computed from a recorded identifier, it must be computed rather than remembered. The basis of the derivation is published alongside the value.',
    rationale:
      'Recalled bibliographic detail is exactly where fabrication enters. A publication year decoded from an arXiv identifier can be re-derived by anyone; one written from memory cannot be distinguished from a plausible guess.',
    evidence: [
      { label: 'year and yearBasis in the source trail', href: '/atlas/de-sitter-swampland/sources.json' },
    ],
  },
  {
    id: 'versioning',
    number: 'V1',
    title: 'One version number, and a separate review date',
    rule:
      'An artifact carries a single version that all its endpoints derive from, plus a review date recording when its claims were last checked. Packaging changes advance the version; only claim review advances the review date.',
    rationale:
      'Two dates answer two different questions: has the artifact changed, and has anyone re-read the claims lately. Collapsing them into one hides which kind of change occurred.',
    evidence: [
      { label: 'version and lastReviewed on the atlas', href: '/atlas/de-sitter-swampland' },
      { label: 'atlasVersion and reviewDate per claim', href: '/atlas/de-sitter-swampland/claims.json' },
    ],
  },
  {
    id: 'corrections-disclosed',
    number: 'V2',
    title: 'Corrections are disclosed, not silently replaced',
    rule:
      'A withdrawn or corrected result is described in the record rather than quietly overwritten. The version history states what changed and why.',
    rationale:
      'The value of a self-published corpus rests entirely on whether its corrections are visible. A project that silently fixes its mistakes provides no basis for trusting the parts that were never flagged.',
    evidence: [
      { label: 'Revision note and camp-placement correction in the paper', href: '/papers/de_sitter_swampland_map' },
      { label: 'Version history on the paper page', href: '/papers/de_sitter_swampland_map' },
    ],
  },
  {
    id: 'status-labelling',
    number: 'V3',
    title: 'The artifact states its own review status',
    rule:
      'Every artifact declares whether it is peer reviewed. Self-published status is stated on the page, in the citation exports, and in the machine-readable record. Repository publication is never represented as review.',
    rationale:
      'A stable URL, a DOI, and a citation export together look a great deal like a journal article. Saying plainly that it is not one is the minimum a self-publisher owes a reader.',
    evidence: [
      { label: 'Working-paper status banner and citation exports', href: '/papers/de_sitter_swampland_map' },
      { label: 'reviewStatus in the paper record', href: '/papers/de_sitter_swampland_map/metadata.json' },
    ],
  },
  {
    id: 'machine-readable-parity',
    number: 'M1',
    title: 'Machine-readable parity',
    rule:
      'Anything a human reader is shown — claims, statuses, sources, limitations, exclusions, versions — is published in machine-readable form carrying the same labels. The structured record must not be a weaker version of the page.',
    rationale:
      'Most downstream reuse is now machine reuse. If the caveats live only in prose, they are dropped exactly when they matter most.',
    evidence: [
      { label: 'claims.json', href: '/atlas/de-sitter-swampland/claims.json' },
      { label: 'sources.json', href: '/atlas/de-sitter-swampland/sources.json' },
      { label: 'Plain-text context document', href: '/atlas/de-sitter-swampland/context.txt' },
    ],
  },
  {
    id: 'bounded-ai-use',
    number: 'M2',
    title: 'Packaged artifacts carry their own use boundaries',
    rule:
      'An artifact packaged for reuse ships explicit instructions on how it may be represented, including that it confers no authority on a system that consumes it. The instructions are part of the package, not of the website.',
    rationale:
      'A downloaded copy leaves the site and its framing behind. Whatever constrains reuse has to be inside the file.',
    evidence: [
      { label: 'aiUseInstructions in the context pack manifest', href: '/atlas/de-sitter-swampland/context-pack.json' },
      { label: 'Context pack overview', href: '/atlas/de-sitter-swampland/context-pack' },
    ],
  },
  {
    id: 'instrument-disclosure',
    number: 'M3',
    title: 'The instrument is disclosed',
    rule:
      'Where an AI system contributed to synthesis, verification, or drafting, it is named along with the human direction applied, and its observed failure modes are recorded rather than smoothed over.',
    rationale:
      'A reader assessing an AI-assisted document needs to know which parts were machine-generated and what went wrong during production. Concealing the instrument removes the reader’s main basis for calibrating trust.',
    evidence: [
      { label: 'Instrument attribution and documented failure modes in the paper', href: '/papers/de_sitter_swampland_map' },
    ],
  },
];

export type ConformanceLevel = {
  level: string;
  label: string;
  requires: string;
  clauses: string[];
};

export const CONFORMANCE_LEVELS: ConformanceLevel[] = [
  {
    level: 'L1',
    label: 'Labelled',
    requires:
      'The artifact declares its own status, version, and review status, and does not represent itself as peer reviewed.',
    clauses: ['V1', 'V3'],
  },
  {
    level: 'L2',
    label: 'Sourced',
    requires:
      'Everything in L1, plus provenance-tagged citations, disclosed corrections, and a stated boundary on what the artifact does not establish.',
    clauses: ['P1', 'P2', 'V2', 'C3'],
  },
  {
    level: 'L3',
    label: 'Claim-level',
    requires:
      'Everything in L2, plus stable per-claim identifiers, per-claim epistemic status and limitations, a closed inherited citation set, separated curator annotation, and machine-readable parity.',
    clauses: ['P3', 'C1', 'C2', 'S1', 'S2', 'M1'],
  },
];

/**
 * Clauses that are not part of a level because they apply only when their
 * condition holds. An artifact is not penalised for failing a clause that does
 * not apply to it, and is not credited with one it never had to meet.
 */
export const CONDITIONAL_CLAUSES: { clause: string; appliesWhen: string }[] = [
  { clause: 'M2', appliesWhen: 'The artifact is packaged for download or for reuse away from this site.' },
  { clause: 'M3', appliesWhen: 'An AI system contributed to the artifact’s synthesis, verification, or drafting.' },
];

/**
 * Places where this project does not currently meet its own standard.
 * Published deliberately: a self-assessed standard with no recorded gaps is
 * not credible, and clause V2 requires that shortcomings be disclosed rather
 * than smoothed over.
 */
export const OPEN_GAPS: { clause: string; artifact: string; gap: string }[] = [
  {
    clause: 'M3',
    artifact: 'The de Sitter / String Swampland Atlas',
    gap:
      'The atlas page discloses the instrument used to produce its source paper, but carries no note naming the AI assistance used in drafting the atlas layer itself — its prose, concept definitions, and claim wording. The working paper it derives from does carry that disclosure. Until the atlas states its own, its M3 conformance is inherited rather than direct.',
  },
];

/** Conformance of artifacts in this repository, stated only where checked. */
export const CONFORMANCE_RECORD: { artifact: string; href: string; level: string; note: string }[] = [
  {
    artifact: 'The de Sitter / String Swampland Atlas',
    href: '/atlas/de-sitter-swampland',
    level: 'L3',
    note:
      'Twelve claims with stable identifiers, statuses, and limitations; a closed citation set inherited from its source paper; curator annotation separated from bibliographic fields; full machine-readable parity. Its context pack additionally satisfies M2. One open gap against M3 is recorded below.',
  },
  {
    artifact: 'The de Sitter Problem in the String Swampland (working paper)',
    href: '/papers/de_sitter_swampland_map',
    level: 'L2',
    note:
      'Provenance-tagged citations, a verification ledger, disclosed corrections, stated status and version, and instrument disclosure. It does not assign per-claim identifiers, so it does not reach L3 — the atlas built on it supplies that layer.',
  },
];

export const STANDARD_NOTES = [
  'This document is descriptive. It records how this project already works so that its outputs can be checked against a stated rule instead of taken on trust.',
  'It is not issued by a standards body, has not been peer reviewed, and is not claimed to be in use anywhere outside Maha Strategies Research.',
  'Conformance is self-assessed. The evidence links on every clause exist so a reader can check the assessment rather than accept it.',
  'The standard has no DOI. Cite it by URL and version.',
  'Where a clause and the codebase disagree, the codebase is the fact and the clause is the error.',
];

export function buildStandardRecord(siteUrl: string) {
  return {
    id: STANDARD_META.id,
    title: STANDARD_META.title,
    subtitle: STANDARD_META.subtitle,
    description: STANDARD_META.description,
    version: STANDARD_META.version,
    datePublished: STANDARD_META.datePublished,
    dateModified: STANDARD_META.dateModified,
    canonicalUrl: `${siteUrl}${STANDARD_PATH}`,
    license: STANDARD_META.license,
    licenseLabel: STANDARD_META.licenseLabel,
    status: STANDARD_META.status,
    statusNote: STANDARD_META.statusNote,
    doi: null,
    doiNote: 'This standard has no DOI. Cite it by URL and version.',
    clauseCount: STANDARD_CLAUSES.length,
    clauses: STANDARD_CLAUSES.map((clause) => ({
      id: clause.id,
      number: clause.number,
      title: clause.title,
      rule: clause.rule,
      rationale: clause.rationale,
      evidenceUrls: clause.evidence.map((entry) => ({
        label: entry.label,
        url: entry.external ? entry.href : `${siteUrl}${entry.href}`,
      })),
    })),
    conformanceLevels: CONFORMANCE_LEVELS,
    conditionalClauses: CONDITIONAL_CLAUSES,
    conformanceRecord: CONFORMANCE_RECORD.map((entry) => ({
      artifact: entry.artifact,
      url: `${siteUrl}${entry.href}`,
      level: entry.level,
      note: entry.note,
      selfAssessed: true,
    })),
    openGaps: OPEN_GAPS,
    notes: STANDARD_NOTES,
  };
}
