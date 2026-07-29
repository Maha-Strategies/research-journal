// The publication gate.
//
// Everything an atlas must satisfy before it can be released, expressed as
// checks that return structured findings rather than throwing. The operator UI
// renders each finding against the record that produced it, so a missing
// boundary appears on the claim that lacks one instead of in a list at the
// bottom of a review page.
//
// TWO LAYERS, DELIBERATELY:
//
//   Zod (schema.ts) enforces what a single record must contain — a claim has a
//   non-empty sourceIds array and a limitations string, or it does not parse.
//
//   This module enforces what records must be true OF EACH OTHER — that those
//   source ids resolve to sources that exist, that no two claims share a slug,
//   that a claim is not resting entirely on a source tagged as excluded.
//
// The split matters because referential rules cannot be expressed in a schema
// for an individual record, and per-record rules should not wait until release
// to be discovered.
//
// This is the same class of check that scripts/validate-atlas-sources.mjs
// performs on the Synthetic Intelligence atlas by parsing TypeScript with
// regular expressions. Here the records are data, so the checks read the
// records directly.

import { NON_SUPPORTING_VERIFICATIONS, PUBLIC_STATE, RESERVED_ATLAS_SLUGS } from './vocabulary.ts';
import type { DraftAtlas, PublicAtlas } from './schema.ts';

export type FindingSeverity = 'error' | 'warning';

export type FindingTarget =
  | { kind: 'atlas' }
  | { kind: 'source'; id: string }
  | { kind: 'concept'; id: string }
  | { kind: 'claim'; id: string };

export type Finding = {
  severity: FindingSeverity;
  /** Stable machine-readable code, so the UI can key on it and tests can assert on it. */
  code: string;
  target: FindingTarget;
  message: string;
  /** The specific field at fault, where one applies. */
  field?: string;
};

export type ValidationResult = {
  /** True when there are no errors. Warnings do not block a release. */
  ok: boolean;
  findings: Finding[];
  errors: Finding[];
  warnings: Finding[];
  counts: { claims: number; concepts: number; sources: number };
};

const error = (code: string, target: FindingTarget, message: string, field?: string): Finding => ({
  severity: 'error',
  code,
  target,
  message,
  field,
});

const warning = (code: string, target: FindingTarget, message: string, field?: string): Finding => ({
  severity: 'warning',
  code,
  target,
  message,
  field,
});

/**
 * Normalises an identifier or URL for duplicate detection.
 *
 * Lowercased, with the common DOI and arXiv prefixes stripped, so that
 * `DOI:10.1038/x`, `doi:10.1038/X`, and `https://doi.org/10.1038/x` are
 * recognised as the same work. Trailing slashes go too, since `…/abs/1801.00862`
 * and `…/abs/1801.00862/` are one paper.
 *
 * Deliberately conservative: it collapses forms that are certainly equivalent
 * and leaves anything else alone. A missed duplicate is an editorial annoyance;
 * a false one would block a legitimate source.
 */
export function normalizeIdentifier(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/^https?:\/\/arxiv\.org\/(abs|pdf)\//, 'arxiv:')
    .replace(/^doi:\s*/, '')
    .replace(/^arxiv:\s*/, 'arxiv:')
    .replace(/\.pdf$/, '')
    .replace(/\/+$/, '');
}

/** Options that make the gate deterministic under test. */
export type ValidateOptions = {
  /** Reference date for "is this in the future" checks. Defaults to today. */
  today?: string;
  /** Slugs already taken by other atlases in the system. */
  takenSlugs?: readonly string[];
};

/**
 * Run the full gate over an atlas.
 *
 * Accepts a draft or a public atlas: the checks read only fields the two share,
 * so the same rules apply whether the atlas is being edited or re-verified at
 * release time.
 */
export function validateAtlas(
  atlas: PublicAtlas | DraftAtlas,
  options: ValidateOptions = {},
): ValidationResult {
  const findings: Finding[] = [];
  const today = options.today ?? new Date().toISOString().slice(0, 10);
  const takenSlugs = options.takenSlugs ?? [];

  // -- Atlas envelope -------------------------------------------------------

  if (RESERVED_ATLAS_SLUGS.includes(atlas.slug)) {
    findings.push(
      error(
        'slug-reserved',
        { kind: 'atlas' },
        `"${atlas.slug}" is reserved. It belongs to a hand-authored atlas or a gateway endpoint, and publishing here would shadow an existing public URL.`,
        'slug',
      ),
    );
  }

  if (takenSlugs.includes(atlas.slug)) {
    findings.push(
      error('slug-taken', { kind: 'atlas' }, `Another atlas already uses the slug "${atlas.slug}".`, 'slug'),
    );
  }

  if (atlas.lastReviewed > today) {
    findings.push(
      error('date-future', { kind: 'atlas' }, `Review date ${atlas.lastReviewed} is in the future.`, 'lastReviewed'),
    );
  }

  if (atlas.evidenceCutoff && atlas.evidenceCutoff > today) {
    findings.push(
      error(
        'date-future',
        { kind: 'atlas' },
        `Evidence cutoff ${atlas.evidenceCutoff} is in the future.`,
        'evidenceCutoff',
      ),
    );
  }

  // The catalog's publication gate requires all three to be non-zero, and
  // lib/atlas/catalog.ts throws at module scope if that is violated — which
  // would take down the whole site build, not just this atlas.
  if (atlas.claims.length === 0) {
    findings.push(error('empty-claims', { kind: 'atlas' }, 'An atlas needs at least one claim to publish.'));
  }
  if (atlas.concepts.length === 0) {
    findings.push(error('empty-concepts', { kind: 'atlas' }, 'An atlas needs at least one concept to publish.'));
  }
  if (atlas.sources.length === 0) {
    findings.push(error('empty-sources', { kind: 'atlas' }, 'An atlas needs at least one source to publish.'));
  }

  // -- Sources --------------------------------------------------------------

  const sourceById = new Map<string, (typeof atlas.sources)[number]>();
  const seenIdentifiers = new Map<string, string>();

  for (const source of atlas.sources) {
    const target: FindingTarget = { kind: 'source', id: source.id };

    if (sourceById.has(source.id)) {
      findings.push(error('duplicate-id', target, `Duplicate source id "${source.id}".`, 'id'));
      continue;
    }
    sourceById.set(source.id, source);

    if (!source.url && !source.identifier) {
      findings.push(
        error(
          'source-unlocatable',
          target,
          'A source needs a URL or an identifier, or a reader cannot find it.',
          'identifier',
        ),
      );
    }

    if (source.verifiedOn > today) {
      findings.push(
        error('date-future', target, `Verified date ${source.verifiedOn} is in the future.`, 'verifiedOn'),
      );
    }

    // Duplicate detection across both fields: the same work entered twice under
    // two ids is the failure that makes a source trail untrustworthy.
    for (const [field, raw] of [
      ['identifier', source.identifier],
      ['url', source.url],
    ] as const) {
      if (!raw) continue;
      const key = normalizeIdentifier(raw);
      const existing = seenIdentifiers.get(key);
      if (existing && existing !== source.id) {
        findings.push(
          error(
            'duplicate-source',
            target,
            `Resolves to the same work as source "${existing}" (${key}). Merge them or correct the identifier.`,
            field,
          ),
        );
      } else if (!existing) {
        seenIdentifiers.set(key, source.id);
      }
    }
  }

  // -- Concepts -------------------------------------------------------------

  const conceptById = new Map<string, (typeof atlas.concepts)[number]>();

  for (const concept of atlas.concepts) {
    const target: FindingTarget = { kind: 'concept', id: concept.id };

    if (conceptById.has(concept.id)) {
      findings.push(error('duplicate-id', target, `Duplicate concept id "${concept.id}".`, 'id'));
      continue;
    }
    conceptById.set(concept.id, concept);

    for (const sourceId of concept.sourceIds) {
      if (!sourceById.has(sourceId)) {
        findings.push(
          error('missing-source', target, `References source "${sourceId}", which is not in this atlas.`, 'sourceIds'),
        );
      }
    }
  }

  // Related-concept links are checked after every concept is known, so a
  // forward reference to a concept defined later is not a false error.
  for (const concept of atlas.concepts) {
    for (const relatedId of concept.related) {
      if (relatedId === concept.id) {
        findings.push(
          error('self-reference', { kind: 'concept', id: concept.id }, 'A concept cannot be related to itself.', 'related'),
        );
      } else if (!conceptById.has(relatedId)) {
        findings.push(
          error(
            'missing-concept',
            { kind: 'concept', id: concept.id },
            `Related concept "${relatedId}" does not exist in this atlas.`,
            'related',
          ),
        );
      }
    }
  }

  // -- Claims ---------------------------------------------------------------

  const claimById = new Map<string, (typeof atlas.claims)[number]>();
  const claimSlugs = new Map<string, string>();
  const citedSourceIds = new Set<string>();
  const usedConceptIds = new Set<string>();

  for (const claim of atlas.claims) {
    const target: FindingTarget = { kind: 'claim', id: claim.id };

    if (claimById.has(claim.id)) {
      findings.push(error('duplicate-id', target, `Duplicate claim id "${claim.id}".`, 'id'));
      continue;
    }
    claimById.set(claim.id, claim);

    const slugOwner = claimSlugs.get(claim.slug);
    if (slugOwner) {
      findings.push(
        error('duplicate-slug', target, `Slug "${claim.slug}" is already used by claim "${slugOwner}".`, 'slug'),
      );
    } else {
      claimSlugs.set(claim.slug, claim.id);
    }

    if (claim.reviewDate > today) {
      findings.push(error('date-future', target, `Review date ${claim.reviewDate} is in the future.`, 'reviewDate'));
    }

    // Support. The schema guarantees the array is non-empty; this checks that
    // the ids resolve and that what they resolve to can actually carry a claim.
    let supportingCount = 0;
    for (const sourceId of claim.sourceIds) {
      const source = sourceById.get(sourceId);
      if (!source) {
        findings.push(
          error('missing-source', target, `Cites source "${sourceId}", which is not in this atlas.`, 'sourceIds'),
        );
        continue;
      }
      citedSourceIds.add(sourceId);
      if (NON_SUPPORTING_VERIFICATIONS.includes(source.verification)) {
        findings.push(
          error(
            'weak-support',
            target,
            `Cites "${sourceId}", which is tagged ${source.verification} and may not support a claim.`,
            'sourceIds',
          ),
        );
      } else {
        supportingCount += 1;
      }
    }

    if (supportingCount === 0) {
      findings.push(
        error(
          'unsourced-claim',
          target,
          'No supporting source survives verification. A claim must rest on at least one source that may carry it.',
          'sourceIds',
        ),
      );
    }

    for (const sourceId of claim.qualifyingSourceIds) {
      if (!sourceById.has(sourceId)) {
        findings.push(
          error(
            'missing-source',
            target,
            `Qualifying source "${sourceId}" is not in this atlas.`,
            'qualifyingSourceIds',
          ),
        );
      } else {
        citedSourceIds.add(sourceId);
      }
    }

    for (const conceptId of claim.conceptIds) {
      if (!conceptById.has(conceptId)) {
        findings.push(
          error('missing-concept', target, `References concept "${conceptId}", which is not in this atlas.`, 'conceptIds'),
        );
      } else {
        usedConceptIds.add(conceptId);
      }
    }

    // A claim that is contested but labelled established is the exact
    // laundering the provenance standard exists to prevent (clause C1).
    if (claim.controversy === 'contested' && claim.status === 'established') {
      findings.push(
        error(
          'status-controversy-conflict',
          target,
          'A claim marked contested cannot carry the status "established". Say which it is.',
          'status',
        ),
      );
    }
  }

  // -- Advisory -------------------------------------------------------------

  for (const source of atlas.sources) {
    if (!citedSourceIds.has(source.id) && !atlas.concepts.some((c) => c.sourceIds.includes(source.id))) {
      findings.push(
        warning('orphan-source', { kind: 'source', id: source.id }, 'Cited by no claim and no concept.'),
      );
    }
  }

  for (const concept of atlas.concepts) {
    if (!usedConceptIds.has(concept.id)) {
      findings.push(
        warning('orphan-concept', { kind: 'concept', id: concept.id }, 'Referenced by no claim.'),
      );
    }
  }

  const errors = findings.filter((f) => f.severity === 'error');
  const warnings = findings.filter((f) => f.severity === 'warning');

  return {
    ok: errors.length === 0,
    findings,
    errors,
    warnings,
    counts: {
      claims: atlas.claims.length,
      concepts: atlas.concepts.length,
      sources: atlas.sources.length,
    },
  };
}

/**
 * Whether a draft may move to release.
 *
 * Separate from validateAtlas because release has one requirement the gate does
 * not: the operator must have said yes. Passing validation is necessary and
 * never sufficient.
 */
export function canRelease(
  atlas: DraftAtlas,
  options: ValidateOptions & { approved: boolean } = { approved: false },
): { allowed: boolean; reasons: string[]; validation: ValidationResult } {
  const validation = validateAtlas(atlas, options);
  const reasons: string[] = [];

  if (!options.approved) {
    reasons.push('Release has not been explicitly approved.');
  }
  if (!validation.ok) {
    reasons.push(`${validation.errors.length} validation error(s) must be resolved.`);
  }
  if (atlas.state === PUBLIC_STATE) {
    reasons.push('This version is already published. Cut a new version instead of re-releasing this one.');
  }
  if (atlas.state === 'archived') {
    reasons.push('An archived atlas cannot be released. Restore it to draft first.');
  }

  return { allowed: reasons.length === 0, reasons, validation };
}

// ---------------------------------------------------------------------------
// Link checking
// ---------------------------------------------------------------------------

export type LinkCheckResult = {
  sourceId: string;
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
};

/**
 * Resolve every source URL over the network.
 *
 * DELIBERATELY NOT PART OF THE GATE. A transient network failure or a publisher
 * that blocks HEAD requests would otherwise block a legitimate release, which
 * trains the operator to bypass the gate. Run it as a separate check and read
 * the results as advisory.
 */
export async function checkSourceUrls(
  atlas: PublicAtlas | DraftAtlas,
  fetchImpl: typeof fetch = fetch,
): Promise<LinkCheckResult[]> {
  const targets = atlas.sources.flatMap((source) =>
    source.url ? [{ id: source.id, url: source.url }] : [],
  );

  return Promise.all(
    targets.map(async ({ id, url }): Promise<LinkCheckResult> => {
      try {
        const response = await fetchImpl(url, { method: 'HEAD', redirect: 'follow' });
        return { sourceId: id, url, ok: response.ok, status: response.status };
      } catch (cause) {
        return {
          sourceId: id,
          url,
          ok: false,
          error: cause instanceof Error ? cause.message : String(cause),
        };
      }
    }),
  );
}
