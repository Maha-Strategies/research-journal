'use server';

// Server actions for the Atlas Builder.
//
// Every action begins with a DAL check at the role it requires. That is not
// redundant with proxy.ts: a server action is a public HTTP endpoint that can be
// invoked directly, and "the page that rendered this form was gated" is not a
// property the request carries.
//
// It is also not redundant with RLS. The DAL check produces a readable message
// for the operator; RLS produces a refusal at the database. The first is the
// user interface, the second is the guarantee — and the second is what still
// holds if this file has a bug.
//
// THE ACTOR IS NEVER SUPPLIED BY THE CLIENT. atlas_change_log.actor_id is set by
// a database trigger from auth.uid(). The free-text "your name" field that every
// form carried in the file-backed version is gone.

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  draftAtlasSchema,
  draftClaimSchema,
  draftConceptSchema,
  draftSourceSchema,
  type DraftAtlas,
} from '@/lib/atlas/builder/schema';
import { DENIAL_MESSAGES, requireOperator, type OperatorRole } from '@/lib/atlas/builder/dal';
import { createSupabaseServerClient } from '@/lib/atlas/builder/supabase/server';
import { SupabaseAtlasStore } from '@/lib/atlas/builder/supabase-store';
import { cutRelease, transitionDraft } from '@/lib/atlas/builder/release';
import { validateAtlas } from '@/lib/atlas/builder/validate';
import { importAtlas } from '@/lib/atlas/builder/portable';

export type ActionResult = { ok: boolean; message: string; errors?: string[] };

const BUILDER_PATH = '/operator/atlas-builder';

/**
 * Authorize, then hand back a store bound to this operator's session.
 *
 * One helper rather than a check plus a separate client construction, so an
 * action cannot accidentally obtain a store without having been authorized.
 */
async function authorized(role: OperatorRole) {
  const access = await requireOperator(role);
  if (!access.ok) {
    const detail =
      access.denial.reason === 'insufficient-role'
        ? `This action requires the ${access.denial.required} role; you have ${access.denial.role}.`
        : DENIAL_MESSAGES[access.denial.reason];
    return { ok: false as const, result: { ok: false, message: detail } as ActionResult };
  }

  const supabase = await createSupabaseServerClient();
  return {
    ok: true as const,
    operator: access.operator,
    store: new SupabaseAtlasStore(supabase),
    supabase,
  };
}

const text = (formData: FormData, key: string): string => String(formData.get(key) ?? '').trim();

const lines = (formData: FormData, key: string): string[] =>
  text(formData, key)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const ids = (formData: FormData, key: string): string[] =>
  text(formData, key)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

function zodErrors(error: { issues: { path: PropertyKey[]; message: string }[] }): string[] {
  return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`);
}

/**
 * Translate a Postgres refusal into something an operator can act on.
 *
 * A constraint or policy violation reaching the UI as a raw driver message is a
 * dead end. These are refusals the schema is designed to produce, so they get
 * sentences rather than error codes.
 */
function explainDatabaseError(cause: unknown): string {
  const message = cause instanceof Error ? cause.message : String(cause);

  if (message.includes('row-level security')) {
    return 'The database refused this write: you do not have access to that draft.';
  }
  if (message.includes('atlas_draft_claims_has_source')) {
    return 'A claim must cite at least one supporting source.';
  }
  if (message.includes('atlas_draft_claims_has_boundary')) {
    return 'A claim must state what it does not establish.';
  }
  if (message.includes('atlas_draft_claims_status_controversy')) {
    return 'A claim marked contested cannot carry the status "established".';
  }
  if (message.includes('atlas_drafts_has_exclusion')) {
    return 'An atlas must state at least one exclusion.';
  }
  return message;
}

/** Persist a draft plus its change-log entry, and refresh the affected pages. */
async function persist(
  store: SupabaseAtlasStore,
  draft: DraftAtlas,
  change: { action: string; target: string; summary: string },
  successMessage: string,
): Promise<ActionResult> {
  try {
    await store.saveDraft(draft);
    await store.appendChange(draft.slug, change);
  } catch (cause) {
    return { ok: false, message: explainDatabaseError(cause) };
  }

  revalidatePath(`${BUILDER_PATH}/${draft.slug}`, 'layout');
  revalidatePath(BUILDER_PATH);
  return { ok: true, message: successMessage };
}

/** Columns for a new draft. owner_id comes from the session, never the form. */
function insertColumns(draft: DraftAtlas, ownerId: string) {
  return {
    slug: draft.slug,
    owner_id: ownerId,
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
    state: 'draft' as const,
    visibility: 'private' as const,
  };
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/operator/login');
}

// ---------------------------------------------------------------------------
// Atlas lifecycle
// ---------------------------------------------------------------------------

export async function createDraft(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  const now = new Date().toISOString();
  const slug = text(formData, 'slug');

  if (await auth.store.getDraft(slug)) {
    return { ok: false, message: `A draft with the slug "${slug}" already exists.` };
  }

  const parsed = draftAtlasSchema.safeParse({
    slug,
    title: text(formData, 'title'),
    shortTitle: text(formData, 'shortTitle') || text(formData, 'title'),
    description: text(formData, 'description'),
    scope: text(formData, 'scope'),
    intendedReader: text(formData, 'intendedReader'),
    editorialBoundary: text(formData, 'editorialBoundary'),
    exclusions: lines(formData, 'exclusions'),
    methodology: text(formData, 'methodology'),
    updatePolicy: text(formData, 'updatePolicy'),
    version: text(formData, 'version') || '0.1.0',
    lastReviewed: text(formData, 'lastReviewed'),
    evidenceCutoff: text(formData, 'evidenceCutoff') || undefined,
    license: text(formData, 'license') || 'CC BY 4.0',
    statusBadge: text(formData, 'statusBadge') || 'Draft edition',
    state: 'draft',
    visibility: 'private',
    createdAt: now,
    updatedAt: now,
    changeLog: [],
    sources: [],
    concepts: [],
    claims: [],
  });

  if (!parsed.success) {
    return { ok: false, message: 'The atlas could not be created.', errors: zodErrors(parsed.error) };
  }

  try {
    const { error } = await auth.supabase
      .from('atlas_drafts')
      .insert(insertColumns(parsed.data, auth.operator.id));
    if (error) throw new Error(error.message);

    await auth.store.appendChange(parsed.data.slug, {
      action: 'created',
      target: `atlas:${parsed.data.slug}`,
      summary: 'Atlas created.',
    });
  } catch (cause) {
    return { ok: false, message: explainDatabaseError(cause) };
  }

  revalidatePath(BUILDER_PATH);
  redirect(`${BUILDER_PATH}/${parsed.data.slug}`);
}

export async function updateAtlas(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return { ok: false, message: 'Draft not found, or you do not have access to it.' };

  const parsed = draftAtlasSchema.safeParse({
    ...draft,
    title: text(formData, 'title'),
    shortTitle: text(formData, 'shortTitle'),
    description: text(formData, 'description'),
    scope: text(formData, 'scope'),
    intendedReader: text(formData, 'intendedReader'),
    editorialBoundary: text(formData, 'editorialBoundary'),
    exclusions: lines(formData, 'exclusions'),
    methodology: text(formData, 'methodology'),
    updatePolicy: text(formData, 'updatePolicy'),
    version: text(formData, 'version'),
    lastReviewed: text(formData, 'lastReviewed'),
    evidenceCutoff: text(formData, 'evidenceCutoff') || undefined,
    license: text(formData, 'license'),
    statusBadge: text(formData, 'statusBadge'),
    visibility: text(formData, 'visibility') === 'public' ? 'public' : 'private',
    privateNotes: text(formData, 'privateNotes') || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: 'Changes were not saved.', errors: zodErrors(parsed.error) };
  }

  return persist(
    auth.store,
    parsed.data,
    { action: 'updated', target: `atlas:${draft.slug}`, summary: 'Atlas details updated.' },
    'Atlas details saved.',
  );
}

export async function deleteDraft(formData: FormData): Promise<void> {
  const auth = await authorized('editor');
  if (!auth.ok) return;
  await auth.store.deleteDraft(text(formData, 'slug'));
  revalidatePath(BUILDER_PATH);
  redirect(BUILDER_PATH);
}

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export async function addSource(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return { ok: false, message: 'Draft not found, or you do not have access to it.' };

  const yearRaw = text(formData, 'year');
  const parsed = draftSourceSchema.safeParse({
    id: text(formData, 'id'),
    title: text(formData, 'title'),
    authors: text(formData, 'authors'),
    year: yearRaw ? Number(yearRaw) : null,
    yearBasis: text(formData, 'yearBasis'),
    publisher: text(formData, 'publisher') || undefined,
    identifier: text(formData, 'identifier') || undefined,
    url: text(formData, 'url') || undefined,
    sourceType: text(formData, 'sourceType'),
    verification: text(formData, 'verification'),
    verifiedOn: text(formData, 'verifiedOn'),
    whyHere: text(formData, 'whyHere'),
    limitations: text(formData, 'limitations') || undefined,
    privateNotes: text(formData, 'privateNotes') || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: 'Source not added.', errors: zodErrors(parsed.error) };
  }
  if (draft.sources.some((source) => source.id === parsed.data.id)) {
    return { ok: false, message: `A source with the id "${parsed.data.id}" already exists.` };
  }

  return persist(
    auth.store,
    { ...draft, sources: [...draft.sources, parsed.data] },
    {
      action: 'created',
      target: `source:${parsed.data.id}`,
      summary: `Added source "${parsed.data.title}".`,
    },
    `Source "${parsed.data.id}" added.`,
  );
}

export async function deleteSource(formData: FormData): Promise<void> {
  const auth = await authorized('editor');
  if (!auth.ok) return;
  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return;
  const id = text(formData, 'id');
  await persist(
    auth.store,
    { ...draft, sources: draft.sources.filter((source) => source.id !== id) },
    { action: 'deleted', target: `source:${id}`, summary: `Removed source "${id}".` },
    'Source removed.',
  );
}

export async function addConcept(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return { ok: false, message: 'Draft not found, or you do not have access to it.' };

  const parsed = draftConceptSchema.safeParse({
    id: text(formData, 'id'),
    label: text(formData, 'label'),
    definition: text(formData, 'definition'),
    scopeNote: text(formData, 'scopeNote') || undefined,
    sourceIds: ids(formData, 'sourceIds'),
    related: ids(formData, 'related'),
    privateNotes: text(formData, 'privateNotes') || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: 'Concept not added.', errors: zodErrors(parsed.error) };
  }
  if (draft.concepts.some((concept) => concept.id === parsed.data.id)) {
    return { ok: false, message: `A concept with the id "${parsed.data.id}" already exists.` };
  }

  return persist(
    auth.store,
    { ...draft, concepts: [...draft.concepts, parsed.data] },
    {
      action: 'created',
      target: `concept:${parsed.data.id}`,
      summary: `Added concept "${parsed.data.label}".`,
    },
    `Concept "${parsed.data.id}" added.`,
  );
}

export async function deleteConcept(formData: FormData): Promise<void> {
  const auth = await authorized('editor');
  if (!auth.ok) return;
  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return;
  const id = text(formData, 'id');
  await persist(
    auth.store,
    { ...draft, concepts: draft.concepts.filter((concept) => concept.id !== id) },
    { action: 'deleted', target: `concept:${id}`, summary: `Removed concept "${id}".` },
    'Concept removed.',
  );
}

export async function addClaim(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return { ok: false, message: 'Draft not found, or you do not have access to it.' };

  const parsed = draftClaimSchema.safeParse({
    id: text(formData, 'id'),
    slug: text(formData, 'claimSlug'),
    claim: text(formData, 'claim'),
    explanation: text(formData, 'explanation'),
    status: text(formData, 'status'),
    confidence: text(formData, 'confidence'),
    controversy: text(formData, 'controversy'),
    sourceIds: ids(formData, 'sourceIds'),
    qualifyingSourceIds: ids(formData, 'qualifyingSourceIds'),
    conceptIds: ids(formData, 'conceptIds'),
    limitations: text(formData, 'limitations'),
    exclusions: lines(formData, 'exclusions'),
    reviewDate: text(formData, 'reviewDate'),
    privateNotes: text(formData, 'privateNotes') || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: 'Claim not added.', errors: zodErrors(parsed.error) };
  }
  if (draft.claims.some((claim) => claim.id === parsed.data.id)) {
    return { ok: false, message: `A claim with the id "${parsed.data.id}" already exists.` };
  }

  return persist(
    auth.store,
    { ...draft, claims: [...draft.claims, parsed.data] },
    {
      action: 'created',
      target: `claim:${parsed.data.id}`,
      summary: `Added claim "${parsed.data.id}".`,
    },
    `Claim "${parsed.data.id}" added.`,
  );
}

export async function deleteClaim(formData: FormData): Promise<void> {
  const auth = await authorized('editor');
  if (!auth.ok) return;
  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return;
  const id = text(formData, 'id');
  await persist(
    auth.store,
    { ...draft, claims: draft.claims.filter((claim) => claim.id !== id) },
    { action: 'deleted', target: `claim:${id}`, summary: `Removed claim "${id}".` },
    'Claim removed.',
  );
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

export async function importDraft(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text(formData, 'json'));
  } catch (cause) {
    return {
      ok: false,
      message: 'That is not valid JSON.',
      errors: [cause instanceof Error ? cause.message : String(cause)],
    };
  }

  const result = importAtlas(parsedJson, { actor: auth.operator.displayName });
  if (!result.ok) {
    return { ok: false, message: 'The file could not be imported.', errors: result.errors };
  }
  if (await auth.store.getDraft(result.draft.slug)) {
    return {
      ok: false,
      message: `A draft with the slug "${result.draft.slug}" already exists. Rename or delete it first.`,
    };
  }

  try {
    const { error } = await auth.supabase
      .from('atlas_drafts')
      .insert(insertColumns(result.draft, auth.operator.id));
    if (error) throw new Error(error.message);

    await auth.store.saveDraft(result.draft);
    await auth.store.appendChange(result.draft.slug, {
      action: 'imported',
      target: `atlas:${result.draft.slug}`,
      summary: 'Imported from a maha-atlas-portable file.',
    });
  } catch (cause) {
    return { ok: false, message: explainDatabaseError(cause) };
  }

  revalidatePath(BUILDER_PATH);
  redirect(`${BUILDER_PATH}/${result.draft.slug}`);
}

// ---------------------------------------------------------------------------
// Approval and release
// ---------------------------------------------------------------------------

/**
 * Move a draft to `approved`. Editor or better.
 *
 * Separate from release on purpose, and now separated by ROLE as well as by
 * click: an editor can approve, but only an owner can publish. Approval records
 * that someone read the validation report; release is a different decision made
 * by a different person.
 */
export async function approveDraft(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return { ok: false, message: 'Draft not found, or you do not have access to it.' };

  const validation = validateAtlas(draft);
  if (!validation.ok) {
    return {
      ok: false,
      message: 'Cannot approve: the atlas does not pass validation.',
      errors: validation.errors.map((finding) => `${finding.code}: ${finding.message}`),
    };
  }

  const note = text(formData, 'note') || 'Approved for release.';
  const moved = transitionDraft(draft, 'approved', auth.operator.displayName, note);
  if (!moved.ok) return { ok: false, message: moved.reason };

  return persist(
    auth.store,
    moved.draft,
    { action: 'approved', target: `atlas:${draft.slug}`, summary: note },
    'Approved. Release is now available to an owner.',
  );
}

export async function revokeApproval(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('editor');
  if (!auth.ok) return auth.result;

  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return { ok: false, message: 'Draft not found, or you do not have access to it.' };

  const moved = transitionDraft(draft, 'draft', auth.operator.displayName, 'Approval withdrawn.');
  if (!moved.ok) return { ok: false, message: moved.reason };

  return persist(
    auth.store,
    moved.draft,
    { action: 'updated', target: `atlas:${draft.slug}`, summary: 'Approval withdrawn.' },
    'Approval withdrawn.',
  );
}

/**
 * Publish an approved atlas. OWNER ONLY.
 *
 * The action that crosses the private/public boundary, and the most tightly
 * held: the DAL requires the owner role, the RLS insert policy on
 * atlas_releases independently requires it, and the operator must type the slug
 * back. Publishing writes the immutable archive row — the atlas becomes a live
 * URL only once `npm run atlas:export` regenerates published.json and that file
 * is committed and deployed.
 */
export async function releaseDraft(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('owner');
  if (!auth.ok) return auth.result;

  const draft = await auth.store.getDraft(text(formData, 'slug'));
  if (!draft) return { ok: false, message: 'Draft not found, or you do not have access to it.' };

  if (draft.state !== 'approved') {
    return { ok: false, message: 'Only an approved atlas can be released. Approve it first.' };
  }
  if (text(formData, 'confirmSlug') !== draft.slug) {
    return {
      ok: false,
      message: `Type the slug "${draft.slug}" exactly to confirm that you intend to publish this atlas.`,
    };
  }

  const history = await auth.store.listReleases(draft.slug);

  // Re-run the gate here rather than trust the review page, which may have
  // rendered before the draft's most recent edit.
  const result = cutRelease(draft, {
    approved: true,
    actor: auth.operator.displayName,
    releaseNote: text(formData, 'releaseNote'),
    history,
  });

  if (!result.ok) {
    return { ok: false, message: 'Release refused.', errors: result.reasons };
  }

  try {
    await auth.store.archiveRelease(result.release, auth.operator.id);
    for (const superseded of result.superseded) {
      await auth.store.markSuperseded(superseded.slug, superseded.version, result.release.version);
    }
    await auth.store.saveDraft({ ...draft, state: 'published' });
    await auth.store.appendChange(draft.slug, {
      action: 'released',
      target: `atlas:${draft.slug}`,
      summary: `Released version ${draft.version}.`,
    });
  } catch (cause) {
    return { ok: false, message: explainDatabaseError(cause) };
  }

  revalidatePath(`${BUILDER_PATH}/${draft.slug}`, 'layout');
  revalidatePath(BUILDER_PATH);

  return {
    ok: true,
    message: `Released ${draft.slug} v${draft.version}. Run \`npm run atlas:export\` and commit content/atlas-releases/ to put it live.`,
  };
}

/** Withdraw a published version. OWNER ONLY. The record is retained. */
export async function archiveAtlas(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorized('owner');
  if (!auth.ok) return auth.result;

  const slug = text(formData, 'slug');
  const version = text(formData, 'version');
  if (text(formData, 'confirmSlug') !== slug) {
    return { ok: false, message: `Type the slug "${slug}" to confirm withdrawal.` };
  }

  try {
    await auth.store.setReleaseState(slug, version, 'archived');
    await auth.store.appendChange(slug, {
      action: 'archived',
      target: `atlas:${slug}`,
      summary: `Withdrew version ${version} from publication.`,
    });
  } catch (cause) {
    return { ok: false, message: explainDatabaseError(cause) };
  }

  revalidatePath(BUILDER_PATH);
  return {
    ok: true,
    message: `${slug} v${version} withdrawn. The release record is retained. Run \`npm run atlas:export\` and commit to take it off the site.`,
  };
}
