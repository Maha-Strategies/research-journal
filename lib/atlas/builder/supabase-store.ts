// The Postgres implementation of AtlasStore.
//
// Everything above this file — actions.ts, the operator pages, the release
// logic — is unchanged by the move from files to Postgres, because the
// AtlasStore interface was the seam the file version was written against.
//
// NO AUTHORIZATION LOGIC LIVES HERE. Every query runs through a request-scoped
// client carrying the operator's session, so RLS decides what is visible and
// writable. A store method that "checks permission" would be a fourth opinion
// on authorization competing with the DAL and the policies. What this file does
// is translate between the Zod records and the relational schema.
//
// COLUMN MAPPING: the tables are snake_case; the records are camelCase. The
// mapping is explicit in both directions below rather than done by a generic
// case-converter, so a column rename produces a type error instead of a field
// that silently becomes undefined.

import {
  draftAtlasSchema,
  releaseRecordSchema,
  type DraftAtlas,
  type DraftClaim,
  type DraftConcept,
  type DraftSource,
  type ReleaseRecord,
} from './schema.ts';
import type { AtlasStore } from './store.ts';

/**
 * The slice of a Supabase client this store uses.
 *
 * Deliberately loose. supabase-js derives its query-builder types from
 * generated database types, and this project has no codegen step — adding one
 * would put a second, machine-written description of the schema alongside the
 * Zod records, free to drift from them. Typing the builder precisely by hand
 * would be worse: an inaccurate type that reads as a guarantee.
 *
 * The checking that matters happens one line later. Every read is parsed
 * through draftAtlasSchema or releaseRecordSchema before it leaves this file,
 * so a column rename or a type change surfaces as a parse failure at the
 * boundary rather than as a wrong value deep in the application.
 */
type Client = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any;
};

/**
 * A row as PostgREST returns it, before Zod parsing.
 *
 * `unknown` values would be more honest still, but every read here is
 * immediately handed to a Zod schema that validates the whole shape, so the
 * checking happens one line later at the boundary that matters. Making the
 * intermediate type strict would only add casts between the query and the parse.
 */
type DraftRow = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

// ---------------------------------------------------------------------------
// Row → record
// ---------------------------------------------------------------------------

const isoDate = (value: string | null): string | undefined =>
  value ? String(value).slice(0, 10) : undefined;

function toSource(row: DraftRow): DraftSource {
  return {
    id: row.record_id,
    title: row.title,
    authors: row.authors,
    year: row.year ?? null,
    yearBasis: row.year_basis,
    publisher: row.publisher ?? undefined,
    identifier: row.identifier ?? undefined,
    url: row.url ?? undefined,
    sourceType: row.source_type,
    verification: row.verification,
    verifiedOn: isoDate(row.verified_on) as string,
    whyHere: row.why_here,
    limitations: row.limitations ?? undefined,
    privateNotes: row.private_notes ?? undefined,
  };
}

function toConcept(row: DraftRow): DraftConcept {
  return {
    id: row.record_id,
    label: row.label,
    definition: row.definition,
    scopeNote: row.scope_note ?? undefined,
    sourceIds: row.source_ids ?? [],
    related: row.related ?? [],
    privateNotes: row.private_notes ?? undefined,
  };
}

function toClaim(row: DraftRow): DraftClaim {
  return {
    id: row.record_id,
    slug: row.slug,
    claim: row.claim,
    explanation: row.explanation,
    status: row.status,
    confidence: row.confidence,
    controversy: row.controversy,
    sourceIds: row.source_ids ?? [],
    qualifyingSourceIds: row.qualifying_source_ids ?? [],
    conceptIds: row.concept_ids ?? [],
    limitations: row.limitations,
    exclusions: row.exclusions ?? [],
    reviewDate: isoDate(row.review_date) as string,
    privateNotes: row.private_notes ?? undefined,
  };
}

/**
 * Assemble a draft from its rows.
 *
 * Parsed through draftAtlasSchema rather than cast: the database and the Zod
 * records are two descriptions of the same shape, and this is the one place
 * they meet. If they drift, this throws here instead of producing a malformed
 * record that reaches the release gate.
 */
function toDraft(row: DraftRow): DraftAtlas {
  const order = (a: DraftRow, b: DraftRow) => a.position - b.position;

  return draftAtlasSchema.parse({
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title,
    description: row.description,
    scope: row.scope,
    intendedReader: row.intended_reader,
    editorialBoundary: row.editorial_boundary,
    exclusions: row.exclusions ?? [],
    methodology: row.methodology,
    updatePolicy: row.update_policy,
    version: row.version,
    lastReviewed: isoDate(row.last_reviewed),
    evidenceCutoff: isoDate(row.evidence_cutoff),
    license: row.license,
    statusBadge: row.status_badge,
    state: row.state,
    visibility: row.visibility,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    privateNotes: row.private_notes ?? undefined,
    sources: [...(row.atlas_draft_sources ?? [])].sort(order).map(toSource),
    concepts: [...(row.atlas_draft_concepts ?? [])].sort(order).map(toConcept),
    claims: [...(row.atlas_draft_claims ?? [])].sort(order).map(toClaim),
    // The change log lives in its own table and is loaded separately, so a
    // draft list does not drag every historical entry with it.
    changeLog: (row.change_log ?? []).map((entry: DraftRow) => ({
      at: new Date(entry.at).toISOString(),
      actor: entry.actor_name ?? entry.actor_id,
      action: entry.action,
      target: entry.target,
      summary: entry.summary,
    })),
  });
}

function toRelease(row: DraftRow): ReleaseRecord {
  return releaseRecordSchema.parse({
    slug: row.slug,
    version: row.version,
    state: row.state,
    releasedAt: new Date(row.released_at).toISOString(),
    releasedBy: row.released_by_name ?? row.released_by,
    releaseNote: row.release_note,
    supersedes: row.supersedes ?? null,
    supersededBy: row.superseded_by ?? null,
    atlas: row.atlas,
  });
}

// ---------------------------------------------------------------------------
// Record → row
// ---------------------------------------------------------------------------

const draftColumns = (draft: DraftAtlas) => ({
  slug: draft.slug,
  title: draft.title,
  short_title: draft.shortTitle,
  description: draft.description,
  scope: draft.scope,
  intended_reader: draft.intendedReader,
  editorial_boundary: draft.editorialBoundary,
  exclusions: draft.exclusions,
  methodology: draft.methodology,
  update_policy: draft.updatePolicy,
  version: draft.version,
  last_reviewed: draft.lastReviewed,
  evidence_cutoff: draft.evidenceCutoff ?? null,
  license: draft.license,
  status_badge: draft.statusBadge,
  state: draft.state,
  visibility: draft.visibility,
  private_notes: draft.privateNotes ?? null,
});

const sourceColumns = (source: DraftSource, draftId: string, position: number) => ({
  draft_id: draftId,
  record_id: source.id,
  position,
  title: source.title,
  authors: source.authors,
  year: source.year,
  year_basis: source.yearBasis,
  publisher: source.publisher ?? null,
  identifier: source.identifier ?? null,
  url: source.url ?? null,
  source_type: source.sourceType,
  verification: source.verification,
  verified_on: source.verifiedOn,
  why_here: source.whyHere,
  limitations: source.limitations ?? null,
  private_notes: source.privateNotes ?? null,
});

const conceptColumns = (concept: DraftConcept, draftId: string, position: number) => ({
  draft_id: draftId,
  record_id: concept.id,
  position,
  label: concept.label,
  definition: concept.definition,
  scope_note: concept.scopeNote ?? null,
  source_ids: concept.sourceIds,
  related: concept.related,
  private_notes: concept.privateNotes ?? null,
});

const claimColumns = (claim: DraftClaim, draftId: string, position: number) => ({
  draft_id: draftId,
  record_id: claim.id,
  position,
  slug: claim.slug,
  claim: claim.claim,
  explanation: claim.explanation,
  status: claim.status,
  confidence: claim.confidence,
  controversy: claim.controversy,
  source_ids: claim.sourceIds,
  qualifying_source_ids: claim.qualifyingSourceIds,
  concept_ids: claim.conceptIds,
  limitations: claim.limitations,
  exclusions: claim.exclusions,
  review_date: claim.reviewDate,
  private_notes: claim.privateNotes ?? null,
});

const DRAFT_SELECT = `
  *,
  atlas_draft_sources (*),
  atlas_draft_concepts (*),
  atlas_draft_claims (*)
`;

function fail(context: string, error: { message: string; code?: string } | null): never {
  throw new Error(`${context}: ${error?.message ?? 'unknown error'}${error?.code ? ` (${error.code})` : ''}`);
}

export class SupabaseAtlasStore implements AtlasStore {
  constructor(private readonly client: Client) {}

  async listDrafts(): Promise<DraftAtlas[]> {
    // RLS filters this to drafts the caller owns, collaborates on, or (as an
    // owner) administers. No `where` clause here does that work.
    const { data, error } = await this.client
      .from('atlas_drafts')
      .select(DRAFT_SELECT)
      .order('updated_at', { ascending: false });

    if (error) fail('Could not list drafts', error);
    return (data ?? []).map((row: DraftRow) => toDraft(row));
  }

  async getDraft(slug: string): Promise<DraftAtlas | null> {
    const { data, error } = await this.client
      .from('atlas_drafts')
      .select(DRAFT_SELECT)
      .eq('slug', slug)
      .maybeSingle();

    if (error) fail(`Could not load draft "${slug}"`, error);
    if (!data) return null;

    const { data: log } = await this.client
      .from('atlas_change_log')
      .select('at, action, target, summary, actor_id, operator_profiles(display_name)')
      .eq('draft_id', data.id)
      .order('at', { ascending: true });

    return toDraft({
      ...data,
      change_log: (log ?? []).map((entry: DraftRow) => ({
        ...entry,
        actor_name: entry.operator_profiles?.display_name,
      })),
    });
  }

  /** The draft's primary key, needed to write child rows. */
  private async draftId(slug: string): Promise<string | null> {
    const { data, error } = await this.client
      .from('atlas_drafts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (error) fail(`Could not resolve draft "${slug}"`, error);
    return data?.id ?? null;
  }

  /**
   * Upsert a draft and replace its record sets.
   *
   * Child rows are deleted and reinserted rather than diffed. That keeps
   * `position` — which the deterministic serializer depends on — exactly equal
   * to the array order the caller supplied, with no reconciliation logic that
   * could drift. The cost is bounded: an atlas is tens of records, not
   * thousands, and the whole operation is one operator's edit.
   *
   * NOT ATOMIC. supabase-js has no client-side transaction; a failure between
   * the delete and the insert would leave a draft with missing records. This is
   * recoverable (the draft is private and the operator can re-save) but it is a
   * real limitation, recorded in docs/atlas-builder-deployment.md. The fix is a
   * Postgres function called via rpc(), deferred rather than done because it
   * moves the record mapping into SQL where the Zod schemas cannot check it.
   */
  async saveDraft(draft: DraftAtlas): Promise<DraftAtlas> {
    const parsed = draftAtlasSchema.parse(draft);

    const { data: upserted, error } = await this.client
      .from('atlas_drafts')
      .upsert(draftColumns(parsed), { onConflict: 'slug' })
      .select('id')
      .single();

    if (error) fail(`Could not save draft "${parsed.slug}"`, error);
    const id = upserted.id as string;

    for (const table of ['atlas_draft_sources', 'atlas_draft_concepts', 'atlas_draft_claims']) {
      const { error: deleteError } = await this.client.from(table).delete().eq('draft_id', id);
      if (deleteError) fail(`Could not clear ${table}`, deleteError);
    }

    const writes: [string, unknown[]][] = [
      ['atlas_draft_sources', parsed.sources.map((s, i) => sourceColumns(s, id, i))],
      ['atlas_draft_concepts', parsed.concepts.map((c, i) => conceptColumns(c, id, i))],
      ['atlas_draft_claims', parsed.claims.map((c, i) => claimColumns(c, id, i))],
    ];

    for (const [table, rows] of writes) {
      if (rows.length === 0) continue;
      const { error: insertError } = await this.client.from(table).insert(rows);
      if (insertError) fail(`Could not write ${table}`, insertError);
    }

    return (await this.getDraft(parsed.slug)) ?? parsed;
  }

  async deleteDraft(slug: string): Promise<void> {
    const { error } = await this.client.from('atlas_drafts').delete().eq('slug', slug);
    if (error) fail(`Could not delete draft "${slug}"`, error);
  }

  async listReleases(slug: string): Promise<ReleaseRecord[]> {
    const { data, error } = await this.client
      .from('atlas_releases')
      .select('*, operator_profiles!atlas_releases_released_by_fkey (display_name)')
      .eq('slug', slug)
      .order('released_at', { ascending: false });

    if (error) fail(`Could not list releases for "${slug}"`, error);
    return (data ?? []).map((row: DraftRow) =>
      toRelease({ ...row, released_by_name: row.operator_profiles?.display_name }),
    );
  }

  async getRelease(slug: string, version: string): Promise<ReleaseRecord | null> {
    const { data, error } = await this.client
      .from('atlas_releases')
      .select('*, operator_profiles!atlas_releases_released_by_fkey (display_name)')
      .eq('slug', slug)
      .eq('version', version)
      .maybeSingle();

    if (error) fail(`Could not load release ${slug}@${version}`, error);
    if (!data) return null;
    return toRelease({ ...data, released_by_name: data.operator_profiles?.display_name });
  }

  /**
   * Write the immutable archive entry.
   *
   * `insert`, never `upsert`. A unique violation on (slug, version) is the
   * correct outcome for a re-release attempt, and the assert_release_immutable
   * trigger blocks any update that would rewrite one. Three independent guards
   * — application check in cutRelease(), this insert, and the trigger.
   */
  async archiveRelease(release: ReleaseRecord, releasedById: string): Promise<void> {
    const parsed = releaseRecordSchema.parse(release);

    const { error } = await this.client.from('atlas_releases').insert({
      slug: parsed.slug,
      version: parsed.version,
      state: parsed.state,
      released_at: parsed.releasedAt,
      released_by: releasedById,
      release_note: parsed.releaseNote,
      supersedes: parsed.supersedes,
      superseded_by: parsed.supersededBy,
      atlas: parsed.atlas,
    });

    if (error) {
      if (error.code === '23505') {
        throw new Error(
          `Release ${parsed.slug}@${parsed.version} already exists. A published version is never rewritten — cut a new version instead.`,
        );
      }
      fail(`Could not archive release ${parsed.slug}@${parsed.version}`, error);
    }
  }

  /** Mark a previously published version superseded. The only permitted update. */
  async markSuperseded(slug: string, version: string, supersededBy: string): Promise<void> {
    const { error } = await this.client
      .from('atlas_releases')
      .update({ state: 'superseded', superseded_by: supersededBy })
      .eq('slug', slug)
      .eq('version', version);

    if (error) fail(`Could not supersede ${slug}@${version}`, error);
  }

  async setReleaseState(slug: string, version: string, state: ReleaseRecord['state']): Promise<void> {
    const { error } = await this.client
      .from('atlas_releases')
      .update({ state })
      .eq('slug', slug)
      .eq('version', version);

    if (error) fail(`Could not set ${slug}@${version} to ${state}`, error);
  }

  /**
   * Every currently-published release.
   *
   * This is what `npm run atlas:export` serializes into
   * content/atlas-releases/published.json, which is the file the public build
   * reads. The public site never queries Postgres.
   */
  async getPublished(): Promise<ReleaseRecord[]> {
    const { data, error } = await this.client
      .from('atlas_releases')
      .select('*, operator_profiles!atlas_releases_released_by_fkey (display_name)')
      .eq('state', 'published')
      .order('slug', { ascending: true });

    if (error) fail('Could not read the published corpus', error);
    return (data ?? []).map((row: DraftRow) =>
      toRelease({ ...row, released_by_name: row.operator_profiles?.display_name }),
    );
  }

  /**
   * Not supported.
   *
   * In the file store, the published set was a file this method rewrote. In
   * Postgres the published set is *derived* — it is whichever releases have
   * state 'published' — so there is nothing to assign. Withdrawing an atlas is
   * setReleaseState(..., 'archived'), which keeps the record.
   */
  async setPublished(): Promise<void> {
    throw new Error(
      'setPublished is not supported by the Postgres store. The published corpus is derived from release state; use setReleaseState() to withdraw an atlas, then `npm run atlas:export` to regenerate published.json.',
    );
  }

  async appendChange(
    draftSlug: string,
    entry: { action: string; target: string; summary: string },
  ): Promise<void> {
    const id = await this.draftId(draftSlug);

    // actor_id is set by the force_change_log_actor trigger from auth.uid() and
    // is deliberately not sent from here — a client-supplied actor could be
    // attributed to anyone.
    const { error } = await this.client.from('atlas_change_log').insert({
      draft_id: id,
      slug: draftSlug,
      action: entry.action,
      target: entry.target,
      summary: entry.summary,
    });

    if (error) fail('Could not write the change log', error);
  }
}
