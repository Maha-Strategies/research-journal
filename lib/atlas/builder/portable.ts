// The portable interchange format.
//
// A documented, schema-versioned JSON envelope for moving an atlas between
// machines, backing one up, or authoring one outside the builder. Deliberately
// built before any external integration: a documented file format that a person
// can read and diff is a better foundation than a bespoke API, and it means the
// builder is never the only way to get data in or out.
//
// PRIVACY IS DECLARED IN THE FILE, NOT INFERRED.
//
// An export either carries the operator's private notes or it does not, and the
// envelope says which in `contains`. A file that omits the field is treated as
// containing private material, because a missing declaration on an unknown file
// is exactly when you want the cautious reading. This matters because the two
// exports look almost identical, and the difference decides whether the file
// can be shared.

import {
  draftAtlasSchema,
  publicAtlasSchema,
  type DraftAtlas,
  type PublicAtlas,
} from './schema.ts';

export const PORTABLE_FORMAT = 'maha-atlas-portable';
export const PORTABLE_FORMAT_VERSION = '1.0.0';

export type PortableContents = 'public-records-only' | 'includes-private-notes';

export type PortableEnvelope = {
  format: typeof PORTABLE_FORMAT;
  formatVersion: string;
  exportedAt: string;
  contains: PortableContents;
  /**
   * Restated in the file so a copy that leaves the builder still says what it
   * is and what it does not carry.
   */
  note: string;
  atlas: PublicAtlas | DraftAtlas;
};

const PUBLIC_NOTE =
  'Public records only. Operator private notes, change log, and workflow state are not included. Safe to share.';
const PRIVATE_NOTE =
  'CONTAINS PRIVATE OPERATOR NOTES and the full change log. This is a backup, not a shareable artifact. Do not publish or attach it to anything public.';

/**
 * Export an atlas.
 *
 * Public by default. Including private material is an explicit argument at the
 * call site, so an export cannot leak notes because someone forgot a flag —
 * forgetting the flag produces the safe file.
 */
export function exportAtlas(
  draft: DraftAtlas,
  options: { includePrivate?: boolean; now?: string } = {},
): PortableEnvelope {
  const includePrivate = options.includePrivate ?? false;
  const exportedAt = options.now ?? new Date().toISOString();

  return {
    format: PORTABLE_FORMAT,
    formatVersion: PORTABLE_FORMAT_VERSION,
    exportedAt,
    contains: includePrivate ? 'includes-private-notes' : 'public-records-only',
    note: includePrivate ? PRIVATE_NOTE : PUBLIC_NOTE,
    // The public branch parses through publicAtlasSchema, which strips every
    // private field structurally. Same mechanism as the release path.
    atlas: includePrivate ? draftAtlasSchema.parse(draft) : publicAtlasSchema.parse(draft),
  };
}

export type ImportResult =
  | { ok: true; draft: DraftAtlas; warnings: string[] }
  | { ok: false; errors: string[] };

/**
 * Read a portable file into a draft.
 *
 * The result is always a DRAFT, whatever the file says. An import is untrusted
 * input: a file claiming `state: "published"` must not be able to put itself
 * into the served corpus by being imported, so state and visibility are reset
 * rather than read.
 */
export function importAtlas(
  raw: unknown,
  options: { now?: string; actor?: string } = {},
): ImportResult {
  const now = options.now ?? new Date().toISOString();
  const actor = options.actor ?? 'import';
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw || typeof raw !== 'object') {
    return { ok: false, errors: ['File is not a JSON object.'] };
  }

  const envelope = raw as Partial<PortableEnvelope>;

  if (envelope.format !== PORTABLE_FORMAT) {
    errors.push(`Not a ${PORTABLE_FORMAT} file (found format "${String(envelope.format)}").`);
  }

  if (typeof envelope.formatVersion !== 'string') {
    errors.push('Missing formatVersion.');
  } else {
    const [major] = envelope.formatVersion.split('.');
    const [currentMajor] = PORTABLE_FORMAT_VERSION.split('.');
    if (major !== currentMajor) {
      errors.push(
        `Format version ${envelope.formatVersion} is not compatible with ${PORTABLE_FORMAT_VERSION}. A major version change means the record shape moved.`,
      );
    } else if (envelope.formatVersion !== PORTABLE_FORMAT_VERSION) {
      warnings.push(
        `File was written by format version ${envelope.formatVersion}; this builder writes ${PORTABLE_FORMAT_VERSION}.`,
      );
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  // A file with no `contains` declaration is treated as private. See the header.
  if (envelope.contains !== 'public-records-only') {
    warnings.push(
      'File is not declared as public-records-only. Treating it as containing private material — review before sharing or publishing.',
    );
  }

  const parsed = draftAtlasSchema.safeParse({
    ...(envelope.atlas as object),
    // Untrusted input never sets its own lifecycle position.
    state: 'draft',
    visibility: 'private',
    createdAt: now,
    updatedAt: now,
    changeLog: [
      {
        at: now,
        actor,
        action: 'imported',
        target: `atlas:${(envelope.atlas as { slug?: string })?.slug ?? 'unknown'}`,
        summary: `Imported from a ${PORTABLE_FORMAT} file written at ${envelope.exportedAt ?? 'an unrecorded time'}.`,
      },
    ],
  });

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
    };
  }

  return { ok: true, draft: parsed.data, warnings };
}

/** Serialize an envelope for download. Stable formatting so exports diff cleanly. */
export function serializeEnvelope(envelope: PortableEnvelope): string {
  return `${JSON.stringify(envelope, null, 2)}\n`;
}
