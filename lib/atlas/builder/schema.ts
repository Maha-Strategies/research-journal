// Record shapes for the Private Atlas Builder.
//
// This module is the contract between the operator UI, the private store, and
// the public serializer. It owns no content and renders nothing.
//
// THE PRIVATE/PUBLIC SPLIT IS STRUCTURAL, NOT A FILTER.
//
// Every record type is declared twice: a `public*Schema` carrying only fields
// that may appear in published output, and a `draft*Schema` that extends it
// with the operator's private fields. The public serializer in
// public-output.ts parses through the PUBLIC schema, and Zod object schemas
// strip unknown keys — so a private field cannot reach public JSON even if a
// future edit forgets to exclude it, or a record arrives from an import
// carrying fields nobody anticipated.
//
// The alternative — one schema plus a hand-maintained deny-list of private
// field names — fails open: add a field, forget the deny-list, and a private
// annotation ships. This arrangement fails closed. A new field is invisible to
// the public output until someone deliberately adds it to a public schema.
//
// IMPORT DISCIPLINE: modules under lib/atlas/builder/ import each other by
// RELATIVE path, never via the `@/` alias. Node's test runner executes these
// files directly (Node 26 strips types natively) and does not resolve tsconfig
// path aliases. Only the React pages, which run through Next, use `@/`.

import { z } from 'zod';

import {
  CLAIM_STATUSES,
  CONFIDENCE_LEVELS,
  CONTROVERSY_LABELS,
  RELEASE_STATES,
  SOURCE_TYPES,
  VERIFICATION_TAGS,
} from './vocabulary.ts';

// The vocabularies themselves live in vocabulary.ts, which imports nothing, so
// the public serving path can read them without pulling Zod into a browser
// bundle. Re-exported here so callers that already hold a schema import do not
// need a second one.
export {
  CLAIM_STATUSES,
  CLAIM_STATUS_DEFINITIONS,
  CONFIDENCE_LEVELS,
  CONTROVERSY_LABELS,
  NON_SUPPORTING_VERIFICATIONS,
  PUBLIC_STATE,
  RELEASE_STATES,
  RESERVED_ATLAS_SLUGS,
  SOURCE_TYPES,
  VERIFICATION_DEFINITIONS,
  VERIFICATION_TAGS,
} from './vocabulary.ts';
export type {
  ClaimStatus,
  ConfidenceLevel,
  ControversyLabel,
  ReleaseState,
  SourceType,
  VerificationTag,
} from './vocabulary.ts';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** ISO calendar date. Rejects `2026-13-45`, which a bare regex would accept. */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD.')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, 'Not a real calendar date.');

/** Semantic version. The atlas carries one; every endpoint derives from it (MPS V1). */
export const semverSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic (MAJOR.MINOR.PATCH).');

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case.')
  .min(2)
  .max(80);

/**
 * An identifier that is stable for the life of the record (MPS C2).
 *
 * Deliberately permissive about shape — the three existing atlases use three
 * conventions (`ds-001`, `qc-001`, `kklt2003`) — and strict about character
 * set, because these become URL path segments.
 */
export const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:[-.][a-z0-9]+)*$/i, 'Identifier may contain only letters, digits, hyphens, and dots.')
  .min(2)
  .max(64);

/** An absolute http(s) URL. Relative URLs are never valid in published output. */
export const absoluteUrlSchema = z
  .string()
  .url('Must be an absolute URL.')
  .refine((value) => /^https?:\/\//i.test(value), 'URL must use http or https.');

/** Prose that must actually say something. Guards against a field satisfied by a space. */
const prose = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `Must be at least ${min} characters of actual content.`)
    .max(max);

// ---------------------------------------------------------------------------
// Controlled vocabularies
// ---------------------------------------------------------------------------

// Zod enums built from the shared vocabularies. The arrays are the single
// definition; these are the runtime guards over them.
export const verificationSchema = z.enum(VERIFICATION_TAGS);
export const sourceTypeSchema = z.enum(SOURCE_TYPES);
export const claimStatusSchema = z.enum(CLAIM_STATUSES);
export const controversySchema = z.enum(CONTROVERSY_LABELS);
export const confidenceSchema = z.enum(CONFIDENCE_LEVELS);
export const releaseStateSchema = z.enum(RELEASE_STATES);

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

/**
 * Bibliographic fields and curator annotation are adjacent here but labelled
 * distinctly in output (MPS S1): `sourceType` and `whyHere` are the curator's,
 * everything above them is the source's own.
 */
export const publicSourceSchema = z.object({
  id: stableIdSchema,
  title: prose(4, 400),
  authors: prose(2, 600),
  year: z.number().int().min(1500).max(2200).nullable(),
  /** How `year` was arrived at (MPS S2: derive, do not recall). */
  yearBasis: prose(3, 200),
  publisher: z.string().trim().max(300).optional(),
  /** DOI, arXiv id, Zenodo id, ISBN, or a report number. */
  identifier: z.string().trim().max(200).optional(),
  url: absoluteUrlSchema.optional(),
  sourceType: sourceTypeSchema,
  verification: verificationSchema,
  verifiedOn: isoDateSchema,
  /** Curator annotation: why this source is in the atlas at all. */
  whyHere: prose(10, 1000),
  /** What this source does NOT establish. Content, not disclaimer (MPS C3). */
  limitations: z.string().trim().max(1500).optional(),
});

export const draftSourceSchema = publicSourceSchema.extend({
  /** PRIVATE. Operator working notes. Never serialized to public output. */
  privateNotes: z.string().max(5000).optional(),
});

export type PublicSource = z.infer<typeof publicSourceSchema>;
export type DraftSource = z.infer<typeof draftSourceSchema>;

// ---------------------------------------------------------------------------
// Concepts
// ---------------------------------------------------------------------------

export const publicConceptSchema = z.object({
  id: slugSchema,
  label: prose(2, 200),
  definition: prose(20, 2000),
  /** What the definition covers and what it deliberately leaves out. */
  scopeNote: z.string().trim().max(1500).optional(),
  sourceIds: z.array(stableIdSchema).default([]),
  related: z.array(slugSchema).default([]),
});

export const draftConceptSchema = publicConceptSchema.extend({
  privateNotes: z.string().max(5000).optional(),
});

export type PublicConcept = z.infer<typeof publicConceptSchema>;
export type DraftConcept = z.infer<typeof draftConceptSchema>;

// ---------------------------------------------------------------------------
// Claims
// ---------------------------------------------------------------------------

/**
 * The unit a reader cites.
 *
 * `sourceIds` and `limitations` are REQUIRED and non-empty at the type level,
 * not merely checked at release time. A claim without support or without a
 * stated boundary is not a valid claim record in this system — it cannot be
 * constructed, so it cannot be published by accident.
 */
export const publicClaimSchema = z.object({
  id: stableIdSchema,
  slug: slugSchema,
  claim: prose(20, 1200),
  explanation: prose(20, 4000),
  status: claimStatusSchema,
  confidence: confidenceSchema,
  controversy: controversySchema,
  /** Sources that support the claim. At least one, always. */
  sourceIds: z.array(stableIdSchema).min(1, 'A claim must cite at least one supporting source.'),
  /** Sources that qualify, complicate, or dissent from the claim. */
  qualifyingSourceIds: z.array(stableIdSchema).default([]),
  conceptIds: z.array(slugSchema).default([]),
  /** What this claim does not establish. Required — the stated boundary. */
  limitations: prose(20, 2000),
  exclusions: z.array(prose(10, 600)).default([]),
  reviewDate: isoDateSchema,
});

export const draftClaimSchema = publicClaimSchema.extend({
  privateNotes: z.string().max(5000).optional(),
});

export type PublicClaim = z.infer<typeof publicClaimSchema>;
export type DraftClaim = z.infer<typeof draftClaimSchema>;

// ---------------------------------------------------------------------------
// Change log
// ---------------------------------------------------------------------------

export const changeEntrySchema = z.object({
  at: z.string().datetime({ message: 'Change timestamps must be ISO 8601 with a timezone.' }),
  /** Who made the change. Free text until a real identity provider exists. */
  actor: prose(1, 120),
  action: z.enum(['created', 'updated', 'deleted', 'approved', 'released', 'rolled-back', 'imported', 'archived']),
  /** What the change touched, e.g. `claim:qc-001`. */
  target: z.string().trim().max(200),
  summary: prose(3, 600),
});

export type ChangeEntry = z.infer<typeof changeEntrySchema>;

// ---------------------------------------------------------------------------
// Atlas
// ---------------------------------------------------------------------------

/**
 * The editorial envelope. These fields are what the Atlas Gateway reads to
 * describe an atlas without opening it, so each has a counterpart in
 * AtlasCatalogEntry (lib/atlas/catalog.ts).
 */
export const publicAtlasSchema = z.object({
  slug: slugSchema,
  title: prose(4, 200),
  shortTitle: prose(2, 120),
  description: prose(40, 2000),
  scope: prose(20, 2000),
  /** Who the atlas is written for, in plain language. Required by the gateway. */
  intendedReader: prose(20, 1000),
  /** The editorial boundary: what this atlas refuses to do. */
  editorialBoundary: prose(20, 2000),
  /** At least one explicit exclusion, matching the catalog's publication gate. */
  exclusions: z.array(prose(10, 600)).min(1, 'At least one explicit exclusion is required.'),
  methodology: prose(40, 6000),
  updatePolicy: prose(20, 2000),
  version: semverSchema,
  lastReviewed: isoDateSchema,
  evidenceCutoff: isoDateSchema.optional(),
  license: z.string().trim().min(2).max(200).default('CC BY 4.0'),
  statusBadge: prose(3, 200),
  sources: z.array(publicSourceSchema),
  concepts: z.array(publicConceptSchema),
  claims: z.array(publicClaimSchema),
});

export const draftAtlasSchema = publicAtlasSchema.extend({
  sources: z.array(draftSourceSchema),
  concepts: z.array(draftConceptSchema),
  claims: z.array(draftClaimSchema),
  state: releaseStateSchema,
  /**
   * Operator intent for the NEXT release. Distinct from `state`: a draft may be
   * marked private even once approved, and being approved never implies consent
   * to publish. Release requires an explicit approval step regardless.
   */
  visibility: z.enum(['private', 'public']).default('private'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  /** PRIVATE. Operator working notes on the atlas as a whole. */
  privateNotes: z.string().max(20000).optional(),
  changeLog: z.array(changeEntrySchema).default([]),
});

export type PublicAtlas = z.infer<typeof publicAtlasSchema>;
export type DraftAtlas = z.infer<typeof draftAtlasSchema>;

// ---------------------------------------------------------------------------
// Releases
// ---------------------------------------------------------------------------

/**
 * An immutable snapshot of an atlas at one version.
 *
 * A release is never edited. Correcting a published release means cutting a new
 * version and marking the old one superseded, so the history of what was said
 * remains readable (MPS V2).
 */
export const releaseRecordSchema = z.object({
  slug: slugSchema,
  version: semverSchema,
  state: releaseStateSchema,
  releasedAt: z.string().datetime(),
  releasedBy: prose(1, 120),
  /** Free-text record of what changed in this version and why. */
  releaseNote: prose(10, 4000),
  /** Version this one replaces, where it replaces one. */
  supersedes: semverSchema.nullable().default(null),
  /** Set when a later version supersedes this one. */
  supersededBy: semverSchema.nullable().default(null),
  atlas: publicAtlasSchema,
});

export type ReleaseRecord = z.infer<typeof releaseRecordSchema>;
