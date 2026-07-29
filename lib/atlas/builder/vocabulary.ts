// Controlled vocabularies for builder atlases.
//
// WHY THIS IS A SEPARATE MODULE FROM schema.ts:
//
// The public serving path reaches these constants. lib/atlas/catalog.ts is
// imported by lib/registry.ts, which is imported by components/RegistryList.tsx
// — a client component. Anything catalog.ts transitively imports is therefore
// in a browser bundle.
//
// schema.ts imports Zod. If the public output modules read their vocabularies
// from schema.ts, Zod and every schema definition would be pulled into the
// client bundle for a page that only renders a list of links.
//
// So the vocabularies live here, with NO imports at all. schema.ts builds its
// enums from these arrays, and the public output modules read them directly
// while importing schema.ts types with `import type`, which erases at compile
// time. One definition of each vocabulary, and Zod stays on the server.

/**
 * Verification tags, from clause P1 of the Maha Provenance Standard: a citation
 * is marked with the basis on which it is cited. The tag states what was
 * checked, not how good the work is (clause P2).
 */
export const VERIFICATION_TAGS = [
  'verified',
  'cited-unresolved',
  'foundational',
  'excluded',
] as const;
export type VerificationTag = (typeof VERIFICATION_TAGS)[number];

export const VERIFICATION_DEFINITIONS: Record<VerificationTag, string> = {
  verified:
    'The identifier was independently resolved against a primary index and the work was checked to be correctly placed in the argument. Verification is not endorsement.',
  'cited-unresolved':
    'Cited in good faith from the source material but not independently re-resolved. May not be the sole support for a claim.',
  foundational:
    'A pre-index or field-defining work cited by journal reference alone. Where no identifier exists, none is supplied.',
  excluded: 'Recorded but deliberately outside the evidence set. May never support a claim.',
};

/**
 * Verification tags too weak to be a claim's only support.
 *
 * Mirrors the rule already enforced for the Synthetic Intelligence atlas in
 * scripts/validate-atlas-sources.mjs, which fails when a claim cites a
 * url-resolved-only source.
 */
export const NON_SUPPORTING_VERIFICATIONS: readonly VerificationTag[] = ['excluded'];

export const SOURCE_TYPES = [
  'primary-paper',
  'authoritative-report',
  'benchmark-documentation',
  'dataset',
  'standard-or-specification',
  'provider-self-report',
  'observational',
  'educational',
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

/** Epistemic status (MPS C1). Part of the claim, not commentary on it. */
export const CLAIM_STATUSES = [
  'established',
  'active-research',
  'conjecture',
  'speculative',
] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const CLAIM_STATUS_DEFINITIONS: Record<ClaimStatus, string> = {
  established:
    'A published result, standard construction, or authoritative definition. Does not imply every practical question is settled.',
  'active-research': 'An open question with no field-wide resolution.',
  conjecture: 'Precisely stated and motivated, but unproved.',
  speculative: 'An interpretation offered by some workers, not an established reading.',
};

/** How contested the claim is among people qualified to judge it. */
export const CONTROVERSY_LABELS = ['uncontested', 'debated', 'contested'] as const;
export type ControversyLabel = (typeof CONTROVERSY_LABELS)[number];

/**
 * The curator's own confidence, kept separate from `status` and `controversy`.
 *
 * These three answer different questions and are routinely collapsed: status is
 * a property of the literature, controversy is a property of the field's
 * agreement, and confidence is the curator's read. Merging them would launder
 * an editorial judgement into a property of the evidence — the failure clause
 * S1 exists to prevent.
 */
export const CONFIDENCE_LEVELS = ['high', 'moderate', 'low'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

/**
 * Release lifecycle.
 *
 *   draft      — being authored; never public
 *   approved   — passed the gate and explicitly approved; still not public
 *   published  — serving at a canonical URL
 *   superseded — was published, replaced by a later version; history kept
 *   archived   — withdrawn from publication, record retained (MPS V2)
 *
 * Only `published` produces public output. Permitted moves are in
 * RELEASE_TRANSITIONS (release.ts).
 */
export const RELEASE_STATES = [
  'draft',
  'approved',
  'published',
  'superseded',
  'archived',
] as const;
export type ReleaseState = (typeof RELEASE_STATES)[number];

/** The only state whose records may be serialized into public output. */
export const PUBLIC_STATE: ReleaseState = 'published';

/**
 * Slugs a builder atlas may not claim.
 *
 * The first three are the hand-authored atlases: a builder release taking one
 * of those slugs would put a generated page at a URL a static route already
 * serves. The rest are the gateway's own endpoint names, which sit as siblings
 * under /atlas/ and would be shadowed by an atlas of the same name.
 */
export const RESERVED_ATLAS_SLUGS: readonly string[] = [
  'de-sitter-swampland',
  'quantum-computing',
  'synthetic-intelligence',
  'tensor-networks',
  'manifest.json',
  'claims.json',
  'concepts.json',
  'sources.json',
  'registry.json',
  'manifest',
  'claims',
  'concepts',
  'sources',
  'registry',
];
