#!/usr/bin/env node
// One-shot migration: .atlas-builder/drafts/*.json → Postgres.
//
// Usage: npm run atlas:import-file-drafts -- --owner <operator-email> [--dry-run]
//
// This is what remains of FileAtlasStore. The file-backed store was the right
// design for a single-operator local tool, but it cannot enforce row-level
// security, so keeping it as a live second store would have meant the isolation
// guarantees held in one mode and not the other. It survives here as a reader
// so existing drafts are not stranded.
//
// Idempotent: a slug that already exists in the database is skipped, never
// overwritten. Run it twice and the second run reports skips.
//
// Uses the service-role key because it writes drafts on behalf of an operator
// who is not the one running the script. That is exactly the kind of privileged
// operation that belongs in a one-shot script rather than in the application.

import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const ownerEmail = args[args.indexOf('--owner') + 1];

if (!ownerEmail || ownerEmail.startsWith('--')) {
  console.error('Usage: npm run atlas:import-file-drafts -- --owner <operator-email> [--dry-run]');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceKey) {
  console.error('Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: owner, error: ownerError } = await supabase
  .from('operator_profiles')
  .select('id, email, role')
  .eq('email', ownerEmail)
  .maybeSingle();

if (ownerError || !owner) {
  console.error(`No operator profile for "${ownerEmail}". They must sign in once before drafts can be assigned to them.`);
  process.exit(1);
}

const DRAFTS_DIR = path.join(process.cwd(), '.atlas-builder/drafts');
let files;
try {
  files = (await readdir(DRAFTS_DIR)).filter((name) => name.endsWith('.json'));
} catch {
  console.log('No .atlas-builder/drafts directory. Nothing to import.');
  process.exit(0);
}

if (files.length === 0) {
  console.log('No draft files found. Nothing to import.');
  process.exit(0);
}

console.log(`${files.length} draft file(s); assigning ownership to ${owner.email} (${owner.role}).`);
if (dryRun) console.log('DRY RUN — nothing will be written.\n');

let imported = 0;
let skipped = 0;

for (const file of files) {
  const draft = JSON.parse(await readFile(path.join(DRAFTS_DIR, file), 'utf8'));

  const { data: existing } = await supabase
    .from('atlas_drafts')
    .select('slug')
    .eq('slug', draft.slug)
    .maybeSingle();

  if (existing) {
    console.log(`  skip  ${draft.slug} — already in the database`);
    skipped += 1;
    continue;
  }

  if (dryRun) {
    console.log(
      `  would import  ${draft.slug} — ${draft.claims?.length ?? 0} claims, ${draft.concepts?.length ?? 0} concepts, ${draft.sources?.length ?? 0} sources`,
    );
    imported += 1;
    continue;
  }

  const { data: inserted, error } = await supabase
    .from('atlas_drafts')
    .insert({
      slug: draft.slug,
      owner_id: owner.id,
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
      license: draft.license ?? 'CC BY 4.0',
      status_badge: draft.statusBadge,
      // Imported drafts always arrive as private drafts, whatever the file
      // claimed. A file cannot publish itself by being imported.
      state: 'draft',
      visibility: 'private',
      private_notes: draft.privateNotes ?? null,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`  FAIL  ${draft.slug} — ${error.message}`);
    continue;
  }

  const draftId = inserted.id;

  const write = async (table, rows) => {
    if (rows.length === 0) return;
    const { error: rowError } = await supabase.from(table).insert(rows);
    if (rowError) console.error(`  FAIL  ${draft.slug} ${table} — ${rowError.message}`);
  };

  await write(
    'atlas_draft_sources',
    (draft.sources ?? []).map((s, i) => ({
      draft_id: draftId, record_id: s.id, position: i,
      title: s.title, authors: s.authors, year: s.year ?? null, year_basis: s.yearBasis,
      publisher: s.publisher ?? null, identifier: s.identifier ?? null, url: s.url ?? null,
      source_type: s.sourceType, verification: s.verification, verified_on: s.verifiedOn,
      why_here: s.whyHere, limitations: s.limitations ?? null, private_notes: s.privateNotes ?? null,
    })),
  );

  await write(
    'atlas_draft_concepts',
    (draft.concepts ?? []).map((c, i) => ({
      draft_id: draftId, record_id: c.id, position: i,
      label: c.label, definition: c.definition, scope_note: c.scopeNote ?? null,
      source_ids: c.sourceIds ?? [], related: c.related ?? [], private_notes: c.privateNotes ?? null,
    })),
  );

  await write(
    'atlas_draft_claims',
    (draft.claims ?? []).map((c, i) => ({
      draft_id: draftId, record_id: c.id, position: i,
      slug: c.slug, claim: c.claim, explanation: c.explanation, status: c.status,
      confidence: c.confidence, controversy: c.controversy,
      source_ids: c.sourceIds ?? [], qualifying_source_ids: c.qualifyingSourceIds ?? [],
      concept_ids: c.conceptIds ?? [], limitations: c.limitations, exclusions: c.exclusions ?? [],
      review_date: c.reviewDate, private_notes: c.privateNotes ?? null,
    })),
  );

  console.log(`  ok    ${draft.slug}`);
  imported += 1;
}

console.log(`\n${dryRun ? 'Would import' : 'Imported'} ${imported}, skipped ${skipped}.`);
if (!dryRun && imported > 0) {
  console.log('The .atlas-builder/ directory is now redundant and can be deleted once you have checked the drafts in the Builder.');
}
