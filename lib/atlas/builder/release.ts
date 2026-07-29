// Release: turning an approved draft into an immutable, versioned record.
//
// The invariant this module exists to hold: A PUBLISHED RELEASE IS NEVER
// REWRITTEN. Correcting one means cutting a new version and marking the old
// superseded, so the record of what was published at a given version stays
// readable. That is clause V2 of the Maha Provenance Standard — corrections are
// disclosed, not silently replaced — expressed as code rather than as a habit.
//
// Every function here is pure. Nothing touches the filesystem; the store does
// that. `now` is injectable so a release is reproducible under test.

import {
  releaseRecordSchema,
  publicAtlasSchema,
  type DraftAtlas,
  type ReleaseRecord,
  type ReleaseState,
} from './schema.ts';
import { canRelease, type ValidateOptions, type ValidationResult } from './validate.ts';
import { appendChange } from './changelog.ts';

/**
 * Permitted state moves.
 *
 * `published → draft` is absent on purpose: a published version is frozen. To
 * change a published atlas you cut a new version from it, which leaves the
 * published one intact and marks it superseded.
 */
export const RELEASE_TRANSITIONS: Record<ReleaseState, readonly ReleaseState[]> = {
  draft: ['approved', 'archived'],
  approved: ['published', 'draft', 'archived'],
  published: ['superseded', 'archived'],
  superseded: ['archived'],
  archived: ['draft'],
};

export function canTransition(from: ReleaseState, to: ReleaseState): boolean {
  return RELEASE_TRANSITIONS[from].includes(to);
}

export type VersionBump = 'major' | 'minor' | 'patch';

/**
 * Advance a semantic version.
 *
 * Which component to bump is an editorial decision and is never inferred:
 * clause V1 ties the version to packaging changes and the review date to claim
 * review, and only the operator knows which kind of change was made.
 */
export function bumpVersion(version: string, bump: VersionBump): string {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n) || n < 0)) {
    throw new Error(`Not a semantic version: "${version}"`);
  }
  const [major, minor, patch] = parts;
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

/** Highest version first. Compares numerically, so 0.10.0 sorts above 0.9.0. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pb[i] - pa[i];
  }
  return 0;
}

export type CutReleaseInput = ValidateOptions & {
  /** Must be true. The gate passing is necessary and never sufficient. */
  approved: boolean;
  actor: string;
  releaseNote: string;
  /** Every release ever cut for this slug, in any state. */
  history?: readonly ReleaseRecord[];
  now?: string;
};

export type CutReleaseResult =
  | {
      ok: true;
      release: ReleaseRecord;
      /** Previously-published records this release moves to `superseded`. */
      superseded: ReleaseRecord[];
      validation: ValidationResult;
    }
  | { ok: false; reasons: string[]; validation: ValidationResult };

/**
 * Cut an immutable release from a draft.
 *
 * Re-runs the full gate rather than trusting a validation result computed when
 * the review page was rendered — the draft may have been edited since, and a
 * stale pass is exactly how an unsourced claim would slip through.
 */
export function cutRelease(draft: DraftAtlas, input: CutReleaseInput): CutReleaseResult {
  const history = input.history ?? [];
  const now = input.now ?? new Date().toISOString();

  const gate = canRelease(draft, { ...input, approved: input.approved });
  if (!gate.allowed) {
    return { ok: false, reasons: gate.reasons, validation: gate.validation };
  }

  // Refuse to reuse a version that has already been cut, in any state. An
  // identifier that points at two different sets of claims is worse than no
  // identifier at all.
  const collision = history.find((record) => record.version === draft.version);
  if (collision) {
    return {
      ok: false,
      reasons: [
        `Version ${draft.version} was already released on ${collision.releasedAt} and is ${collision.state}. Bump the version before releasing.`,
      ],
      validation: gate.validation,
    };
  }

  const currentlyPublished = history.filter((record) => record.state === 'published');
  const predecessor = [...currentlyPublished].sort((a, b) => compareVersions(a.version, b.version))[0];

  // Parsing through the PUBLIC schema is what strips private fields. See the
  // header comment in schema.ts — this is the structural boundary, not a filter.
  const atlas = publicAtlasSchema.parse(draft);

  const release = releaseRecordSchema.parse({
    slug: draft.slug,
    version: draft.version,
    state: 'published',
    releasedAt: now,
    releasedBy: input.actor,
    releaseNote: input.releaseNote,
    supersedes: predecessor?.version ?? null,
    supersededBy: null,
    atlas,
  });

  const superseded = currentlyPublished.map((record) => ({
    ...record,
    state: 'superseded' as const,
    supersededBy: release.version,
  }));

  return { ok: true, release, superseded, validation: gate.validation };
}

/**
 * Start a new draft from a published release.
 *
 * The returned draft carries a bumped version and `state: 'draft'`, so the
 * published record it came from is untouched and the next release cannot
 * collide with it.
 */
export function draftFromRelease(
  release: ReleaseRecord,
  bump: VersionBump,
  now: string = new Date().toISOString(),
): DraftAtlas {
  return {
    ...release.atlas,
    version: bumpVersion(release.version, bump),
    state: 'draft',
    visibility: 'private',
    createdAt: now,
    updatedAt: now,
    changeLog: [
      {
        at: now,
        actor: release.releasedBy,
        action: 'created',
        target: `atlas:${release.slug}`,
        summary: `Drafted from published version ${release.version}.`,
      },
    ],
  };
}

/**
 * Replace the published entry for a slug.
 *
 * Keyed on slug because exactly one version of an atlas is published at a
 * canonical URL at any time. Earlier versions remain in the archive.
 */
export function applyToPublished(
  published: readonly ReleaseRecord[],
  release: ReleaseRecord,
): ReleaseRecord[] {
  const others = published.filter((record) => record.slug !== release.slug);
  return [...others, release].sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Withdraw an atlas from public serving. The archive keeps every version. */
export function withdrawFromPublished(
  published: readonly ReleaseRecord[],
  slug: string,
): ReleaseRecord[] {
  return published.filter((record) => record.slug !== slug);
}

export type RollbackResult =
  | { ok: true; published: ReleaseRecord[]; restored: ReleaseRecord }
  | { ok: false; reason: string };

/**
 * Re-publish an earlier version from the archive.
 *
 * The restored record is re-marked `published` and its `supersededBy` cleared,
 * because it is once again the version being served. Nothing is deleted: the
 * version that was rolled back from stays in the archive, which is the point.
 */
export function rollbackTo(
  published: readonly ReleaseRecord[],
  archive: readonly ReleaseRecord[],
  slug: string,
  version: string,
  actor: string,
  now: string = new Date().toISOString(),
): RollbackResult {
  const target = archive.find((record) => record.slug === slug && record.version === version);
  if (!target) {
    return { ok: false, reason: `No archived release ${slug}@${version}.` };
  }
  if (target.state === 'archived') {
    return { ok: false, reason: `Release ${slug}@${version} is archived and cannot be re-published.` };
  }

  const restored: ReleaseRecord = {
    ...target,
    state: 'published',
    supersededBy: null,
    releaseNote: `${target.releaseNote}\n\nRe-published by ${actor} on ${now} (rollback).`,
  };

  return { ok: true, published: applyToPublished(published, restored), restored };
}

/** Record a state change on a draft, with its change-log entry. */
export function transitionDraft(
  draft: DraftAtlas,
  to: ReleaseState,
  actor: string,
  summary: string,
  now: string = new Date().toISOString(),
): { ok: true; draft: DraftAtlas } | { ok: false; reason: string } {
  if (!canTransition(draft.state, to)) {
    return { ok: false, reason: `Cannot move an atlas from ${draft.state} to ${to}.` };
  }
  return {
    ok: true,
    draft: appendChange(
      { ...draft, state: to, updatedAt: now },
      { actor, action: to === 'approved' ? 'approved' : to === 'archived' ? 'archived' : 'updated', target: `atlas:${draft.slug}`, summary },
      now,
    ),
  };
}
