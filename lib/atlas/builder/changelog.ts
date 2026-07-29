// The readable change log.
//
// Who changed what, and when. Kept on the draft rather than in a side channel
// so it travels with the record it describes, and so a review page can show the
// history without a second lookup.
//
// The log is PRIVATE. It records operator activity, and operator activity is
// not published — it lives on `draftAtlasSchema`, which the public serializer
// never parses through. What reaches the public is the release note on each
// version, which is written deliberately for a reader.

import { changeEntrySchema, type ChangeEntry, type DraftAtlas } from './schema.ts';

export type ChangeInput = Omit<ChangeEntry, 'at'>;

/**
 * Append an entry, newest last.
 *
 * Chronological order matters for reading a history, and appending is the only
 * mutation: entries are never edited or removed, because a change log that can
 * be revised records nothing.
 */
export function appendChange(
  draft: DraftAtlas,
  change: ChangeInput,
  now: string = new Date().toISOString(),
): DraftAtlas {
  const entry = changeEntrySchema.parse({ ...change, at: now });
  return { ...draft, updatedAt: now, changeLog: [...draft.changeLog, entry] };
}

/** Newest first, for display. Does not mutate the stored order. */
export function recentChanges(draft: DraftAtlas, limit = 20): ChangeEntry[] {
  return [...draft.changeLog].reverse().slice(0, limit);
}

/**
 * Group entries by the record they touched, so a claim's own history can be
 * shown on the claim rather than only in a global feed.
 */
export function changesByTarget(draft: DraftAtlas): Map<string, ChangeEntry[]> {
  const grouped = new Map<string, ChangeEntry[]>();
  for (const entry of draft.changeLog) {
    const existing = grouped.get(entry.target);
    if (existing) existing.push(entry);
    else grouped.set(entry.target, [entry]);
  }
  return grouped;
}

/** One-line summaries, newest first. Used by the review stage. */
export function formatChangeLog(draft: DraftAtlas, limit = 20): string[] {
  return recentChanges(draft, limit).map(
    (entry) => `${entry.at.slice(0, 19).replace('T', ' ')} · ${entry.actor} ${entry.action} ${entry.target} — ${entry.summary}`,
  );
}
