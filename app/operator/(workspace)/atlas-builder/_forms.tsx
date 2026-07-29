'use client';

// The record-entry forms.
//
// Each one asks for the fields the publication gate will check, in the order
// the editorial workflow needs them, with a note on any field whose purpose is
// not obvious from its label. Asking for a boundary at entry rather than at
// review is the point: a claim without one cannot be constructed at all, so
// there is no state in which an unbounded claim exists waiting to be caught.

import {
  CLAIM_STATUSES,
  CONFIDENCE_LEVELS,
  CONTROVERSY_LABELS,
  SOURCE_TYPES,
  VERIFICATION_TAGS,
} from '@/lib/atlas/builder/vocabulary';
import {
  addClaim,
  addConcept,
  addSource,
  approveDraft,
  archiveAtlas,
  createDraft,
  importDraft,
  releaseDraft,
  revokeApproval,
  updateAtlas,
} from './actions';
import { ActionForm, SelectField, TextArea, TextField } from './_ui';

const today = () => new Date().toISOString().slice(0, 10);

export function CreateAtlasForm() {
  return (
    <ActionForm action={createDraft} submitLabel="Create atlas">
      <TextField name="title" label="Title" required />
      <TextField
        name="slug"
        label="Slug"
        required
        note="Lowercase kebab-case. Becomes /atlas/<slug>. The three hand-authored atlas slugs are reserved and will be refused."
      />
      <TextField name="shortTitle" label="Short title" note="Used in breadcrumbs. Defaults to the title." />
      <TextArea name="description" label="Description" required rows={3} />
      <TextArea name="scope" label="Scope" required rows={2} note="What this atlas covers." />
      <TextArea
        name="intendedReader"
        label="Intended reader"
        required
        rows={2}
        note="In plain language. The gateway states who each atlas is for."
      />
      <TextArea
        name="editorialBoundary"
        label="Editorial boundary"
        required
        rows={3}
        note="What this atlas refuses to do. Not a disclaimer — it is published as structured content."
      />
      <TextArea
        name="exclusions"
        label="Exclusions"
        required
        rows={4}
        note="One per line. At least one is required by the publication gate."
      />
      <TextArea
        name="methodology"
        label="Methodology"
        required
        rows={4}
        note="How sources were resolved and claims written. This is published."
      />
      <TextArea name="updatePolicy" label="Update policy" required rows={2} />
      <TextField name="version" label="Version" defaultValue="0.1.0" />
      <TextField name="lastReviewed" label="Claims last reviewed" type="date" defaultValue={today()} required />
      <TextField name="evidenceCutoff" label="Evidence cutoff" type="date" note="Optional." />
      <TextField name="statusBadge" label="Status badge" defaultValue="Draft edition" />
    </ActionForm>
  );
}

export function ImportAtlasForm() {
  return (
    <ActionForm action={importDraft} submitLabel="Import">
      <TextArea
        name="json"
        label="Portable JSON"
        required
        rows={12}
        placeholder='{ "format": "maha-atlas-portable", "formatVersion": "1.0.0", ... }'
      />
    </ActionForm>
  );
}

export function UpdateAtlasForm({ draft }: { draft: Record<string, unknown> }) {
  const value = (key: string) => String(draft[key] ?? '');
  return (
    <ActionForm action={updateAtlas} submitLabel="Save changes">
      <input type="hidden" name="slug" value={value('slug')} />
      <TextField name="title" label="Title" defaultValue={value('title')} required />
      <TextField name="shortTitle" label="Short title" defaultValue={value('shortTitle')} required />
      <TextArea name="description" label="Description" defaultValue={value('description')} required rows={3} />
      <TextArea name="scope" label="Scope" defaultValue={value('scope')} required rows={2} />
      <TextArea
        name="intendedReader"
        label="Intended reader"
        defaultValue={value('intendedReader')}
        required
        rows={2}
      />
      <TextArea
        name="editorialBoundary"
        label="Editorial boundary"
        defaultValue={value('editorialBoundary')}
        required
        rows={3}
      />
      <TextArea
        name="exclusions"
        label="Exclusions"
        defaultValue={(draft.exclusions as string[] | undefined)?.join('\n') ?? ''}
        required
        rows={4}
        note="One per line."
      />
      <TextArea name="methodology" label="Methodology" defaultValue={value('methodology')} required rows={5} />
      <TextArea name="updatePolicy" label="Update policy" defaultValue={value('updatePolicy')} required rows={2} />
      <TextField name="version" label="Version" defaultValue={value('version')} required />
      <TextField
        name="lastReviewed"
        label="Claims last reviewed"
        type="date"
        defaultValue={value('lastReviewed')}
        required
      />
      <TextField name="evidenceCutoff" label="Evidence cutoff" type="date" defaultValue={value('evidenceCutoff')} />
      <TextField name="license" label="License" defaultValue={value('license')} required />
      <TextField name="statusBadge" label="Status badge" defaultValue={value('statusBadge')} required />
      <SelectField
        name="visibility"
        label="Intended visibility"
        options={['private', 'public']}
        defaultValue={value('visibility')}
        note="Intent for a future release. It does not publish anything — release is a separate, explicit act."
      />
      <TextArea
        name="privateNotes"
        label="Private notes"
        defaultValue={value('privateNotes')}
        rows={4}
        note="Never published. Stripped structurally by the public schema, not by a filter."
      />
    </ActionForm>
  );
}

export function AddSourceForm({ slug }: { slug: string }) {
  return (
    <ActionForm action={addSource} submitLabel="Add source" resetOnSuccess>
      <input type="hidden" name="slug" value={slug} />
      <TextField name="id" label="Source id" required note="Stable and never reassigned. Becomes /sources/<id>." />
      <TextField name="title" label="Title" required />
      <TextField name="authors" label="Authors" required />
      <TextField name="year" label="Year" type="number" note="Leave blank for an undated work." />
      <TextField
        name="yearBasis"
        label="Year basis"
        required
        note="How the year was determined — decoded from the identifier, read off the page. Derive, do not recall."
      />
      <TextField name="publisher" label="Publisher" />
      <TextField name="identifier" label="Identifier" note="DOI, arXiv id, Zenodo id, ISBN, or report number." />
      <TextField name="url" label="URL" type="url" note="Must be absolute. Duplicates are detected across id and URL." />
      <SelectField name="sourceType" label="Source type" options={SOURCE_TYPES} note="Curator annotation." />
      <SelectField
        name="verification"
        label="Verification"
        options={VERIFICATION_TAGS}
        note="What was checked, not how good the work is. An 'excluded' source may never support a claim."
      />
      <TextField name="verifiedOn" label="Verified on" type="date" defaultValue={today()} required />
      <TextArea name="whyHere" label="Why this source is here" required rows={3} note="Curator annotation." />
      <TextArea name="limitations" label="What it does not establish" rows={2} />
      <TextArea name="privateNotes" label="Private notes" rows={2} note="Never published." />
    </ActionForm>
  );
}

export function AddConceptForm({ slug }: { slug: string }) {
  return (
    <ActionForm action={addConcept} submitLabel="Add concept" resetOnSuccess>
      <input type="hidden" name="slug" value={slug} />
      <TextField name="id" label="Concept id" required note="Lowercase kebab-case. Becomes /concepts/<id>." />
      <TextField name="label" label="Label" required />
      <TextArea
        name="definition"
        label="Definition"
        required
        rows={3}
        note="Concepts explain; they do not assert. A contested definition belongs in a claim with a status label."
      />
      <TextArea name="scopeNote" label="Scope note" rows={2} note="What the definition leaves out." />
      <TextField name="sourceIds" label="Source ids" note="Comma-separated. Must already exist in this atlas." />
      <TextField name="related" label="Related concept ids" note="Comma-separated." />
      <TextArea name="privateNotes" label="Private notes" rows={2} note="Never published." />
    </ActionForm>
  );
}

export function AddClaimForm({ slug }: { slug: string }) {
  return (
    <ActionForm action={addClaim} submitLabel="Add claim" resetOnSuccess>
      <input type="hidden" name="slug" value={slug} />
      <TextField name="id" label="Claim id" required note="Stable and never reassigned, e.g. abc-001." />
      <TextField name="claimSlug" label="Claim slug" required note="Lowercase kebab-case. Must be unique." />
      <TextArea name="claim" label="The claim" required rows={3} note="Plain language, one assertion." />
      <TextArea name="explanation" label="Explanation" required rows={4} />
      <SelectField
        name="status"
        label="Epistemic status"
        options={CLAIM_STATUSES}
        note="A property of the literature. Part of the claim, not commentary on it."
      />
      <SelectField
        name="controversy"
        label="Controversy"
        options={CONTROVERSY_LABELS}
        note="How far the field agrees. A contested claim cannot be labelled established."
      />
      <SelectField
        name="confidence"
        label="Curator confidence"
        options={CONFIDENCE_LEVELS}
        note="Your own read. Deliberately separate from status and controversy."
      />
      <TextField
        name="sourceIds"
        label="Supporting source ids"
        required
        note="Comma-separated. At least one is required, and it must not be an excluded source."
      />
      <TextField
        name="qualifyingSourceIds"
        label="Qualifying source ids"
        note="Comma-separated. Sources that complicate or dissent from the claim."
      />
      <TextField name="conceptIds" label="Concept ids" note="Comma-separated." />
      <TextArea
        name="limitations"
        label="What this claim does not establish"
        required
        rows={3}
        note="Required. A claim cannot exist in this system without a stated boundary."
      />
      <TextArea name="exclusions" label="Exclusions" rows={3} note="One per line." />
      <TextField name="reviewDate" label="Reviewed on" type="date" defaultValue={today()} required />
      <TextArea name="privateNotes" label="Private notes" rows={2} note="Never published." />
    </ActionForm>
  );
}

export function ApproveForm({ slug }: { slug: string }) {
  return (
    <ActionForm action={approveDraft} submitLabel="Approve for release">
      <input type="hidden" name="slug" value={slug} />
      <TextArea name="note" label="Approval note" rows={2} note="Recorded in the change log." />
    </ActionForm>
  );
}

export function RevokeApprovalForm({ slug }: { slug: string }) {
  return (
    <ActionForm action={revokeApproval} submitLabel="Withdraw approval" danger>
      <input type="hidden" name="slug" value={slug} />
    </ActionForm>
  );
}

export function ReleaseForm({ slug, version }: { slug: string; version: string }) {
  return (
    <ActionForm action={releaseDraft} submitLabel={`Publish v${version}`} danger>
      <input type="hidden" name="slug" value={slug} />
      <TextArea
        name="releaseNote"
        label="Release note"
        required
        rows={4}
        note="What changed in this version and why. Published on the methodology page — write it for a reader."
      />
      <TextField
        name="confirmSlug"
        label={`Type "${slug}" to confirm`}
        required
        note="This publishes the atlas to a public URL. It is the one action that crosses the private/public boundary."
      />
    </ActionForm>
  );
}

export function ArchiveForm({ slug, version }: { slug: string; version: string }) {
  return (
    <ActionForm action={archiveAtlas} submitLabel={`Withdraw v${version}`} danger>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="version" value={version} />
      <TextField name="confirmSlug" label={`Type "${slug}" to confirm`} required />
    </ActionForm>
  );
}
