// The storage contract for the Atlas Builder.
//
// This file is now an interface only. The file-backed implementation that lived
// here has moved to scripts/atlas-import-file-drafts.mjs, where it survives as
// a one-shot reader for migrating existing .atlas-builder/ drafts into Postgres.
//
// WHY THE FILE STORE LEFT THE RUNTIME PATH:
//
// It was the right design when the Builder was a single-operator local tool —
// the guarantee that drafts could not leak was that they were never committed
// and Vercel's filesystem is read-only. That guarantee does not generalise to a
// shared tool, and keeping both stores would have meant the security model held
// in one mode and not the other. Two code paths where one enforces row-level
// security and one cannot is precisely the dual path the private/public boundary
// exists to prevent, and it is the kind of difference that is very hard to write
// a meaningful test for.
//
// The single implementation is SupabaseAtlasStore in supabase-store.ts, where
// every query runs as the authenticated operator and RLS decides what is
// visible. See supabase/migrations/0004_rls.sql.

import type { DraftAtlas, ReleaseRecord } from './schema.ts';

export interface AtlasStore {
  /** Drafts the caller is authorized to see. Filtering is RLS's job, not the caller's. */
  listDrafts(): Promise<DraftAtlas[]>;
  getDraft(slug: string): Promise<DraftAtlas | null>;
  saveDraft(draft: DraftAtlas): Promise<DraftAtlas>;
  deleteDraft(slug: string): Promise<void>;

  /** Every release ever cut for a slug, newest first. */
  listReleases(slug: string): Promise<ReleaseRecord[]>;
  getRelease(slug: string, version: string): Promise<ReleaseRecord | null>;

  /**
   * Write an immutable archive entry.
   *
   * `releasedById` is the authenticated operator's uuid. It is separate from
   * `release.releasedBy` — which carries a display name for rendering — because
   * the audit trail must key on a principal, not on a label.
   */
  archiveRelease(release: ReleaseRecord, releasedById: string): Promise<void>;

  /** Mark a previously published version superseded. The only permitted update. */
  markSuperseded(slug: string, version: string, supersededBy: string): Promise<void>;

  /** Move a release along the lifecycle, e.g. to withdraw it as `archived`. */
  setReleaseState(slug: string, version: string, state: ReleaseRecord['state']): Promise<void>;

  /** Releases currently in the `published` state. The input to published.json. */
  getPublished(): Promise<ReleaseRecord[]>;

  /**
   * Present only because the file store had it.
   *
   * The Postgres store throws: the published corpus is derived from release
   * state rather than assigned, so there is nothing to set. Retained on the
   * interface so the migration script can still be typed against it.
   */
  setPublished(records: readonly ReleaseRecord[]): Promise<void>;

  /** Append a change-log entry. The actor is taken from the session, never passed. */
  appendChange(
    draftSlug: string,
    entry: { action: string; target: string; summary: string },
  ): Promise<void>;
}
