#!/usr/bin/env node
// Regenerate content/atlas-releases/published.json from Postgres.
//
// Usage: npm run atlas:export
//
// THIS IS THE BRIDGE BETWEEN THE DATABASE AND THE PUBLIC SITE.
//
// The public build does not query Postgres. lib/atlas/builder/releases.ts
// statically imports published.json, so the route tree, the aggregate indexes,
// and the sitemap are all derived at build time from a committed file. That is
// deliberate:
//
//   - the public site stays up regardless of database availability;
//   - a build is reproducible from the repository alone;
//   - putting an atlas live is a reviewable commit, not a database write that
//     silently changes what the world sees.
//
// So publishing is two steps. The Builder writes an immutable release row; this
// script turns the currently-published rows into the file; committing that file
// is what actually makes the atlas public.
//
// Uses the service-role key because it must see every published release
// regardless of which operator runs it. It only ever reads.

import { createClient } from '@supabase/supabase-js';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const OUTPUT = path.join(process.cwd(), 'content/atlas-releases/published.json');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error(
    'atlas:export needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n' +
      'See docs/atlas-builder-deployment.md.',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase
  .from('atlas_releases')
  .select('slug, version, state, released_at, release_note, supersedes, superseded_by, atlas, operator_profiles!atlas_releases_released_by_fkey (display_name)')
  .eq('state', 'published')
  .order('slug', { ascending: true });

if (error) {
  console.error(`Could not read releases: ${error.message}`);
  process.exit(1);
}

const releases = (data ?? []).map((row) => ({
  slug: row.slug,
  version: row.version,
  state: row.state,
  releasedAt: new Date(row.released_at).toISOString(),
  releasedBy: row.operator_profiles?.display_name ?? 'unknown',
  releaseNote: row.release_note,
  supersedes: row.supersedes ?? null,
  supersededBy: row.superseded_by ?? null,
  atlas: row.atlas,
}));

// Last line of defence before private material could reach a committed file.
// The public serializer strips these structurally and a database trigger
// rejects them on insert; this checks the bytes actually about to be written,
// because this file is the one that gets deployed.
const FORBIDDEN = ['privateNotes', 'private_notes', 'changeLog', 'change_log'];
const serialized = `${JSON.stringify(releases, null, 2)}\n`;

for (const key of FORBIDDEN) {
  if (serialized.includes(`"${key}"`)) {
    console.error(
      `REFUSING TO WRITE: the export contains "${key}", which is private and must never be published.\n` +
        'This indicates a release was created by a path that bypassed publicAtlasSchema.',
    );
    process.exit(1);
  }
}

const previous = await readFile(OUTPUT, 'utf8').catch(() => null);
if (previous === serialized) {
  console.log(`No change. ${releases.length} published release(s).`);
  process.exit(0);
}

await writeFile(OUTPUT, serialized, 'utf8');

console.log(`Wrote ${releases.length} published release(s) to content/atlas-releases/published.json`);
for (const release of releases) {
  console.log(`  ${release.slug}@${release.version} — ${release.atlas.claims?.length ?? 0} claims`);
}
console.log(
  releases.length > 0
    ? '\nCommit content/atlas-releases/published.json to put these live.'
    : '\nNothing is published. The public build is unchanged.',
);
