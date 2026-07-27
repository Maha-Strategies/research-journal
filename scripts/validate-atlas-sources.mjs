#!/usr/bin/env node
// Referential-integrity validator for atlas source layers.
// Exits non-zero if a claim references a missing source or concept, or if any
// of the provenance rules the source map depends on are violated.
//
// Usage: npm run validate:atlas

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// The data module is TypeScript; parse the literals out of it rather than
// adding a transpile step to a validation script.
const src = readFileSync(path.join(root, 'lib/atlas/synthetic-intelligence.ts'), 'utf8');

const grab = (re) => [...src.matchAll(re)].map((m) => m[1]);

// Parse the SI_SOURCES record by splitting it into per-entry blocks, so that a
// verification value can never be attributed to a neighbouring source.
const sourcesBlock = src.slice(
  src.indexOf('export const SI_SOURCES'),
  src.indexOf('export type SiConcept'),
);
const sourceEntries = [...sourcesBlock.matchAll(/^ {2}([A-Za-z0-9]+): \{([\s\S]*?)^ {2}\},$/gm)]
  .map(([, key, body]) => ({ key, body }));

const declaredSourceIds = new Set(sourceEntries.map((e) => e.key));
const urlResolved = new Set(
  sourceEntries.filter((e) => /verification: '(url-resolved|excluded)'/.test(e.body)).map((e) => e.key),
);
for (const e of sourceEntries) {
  const declared = e.body.match(/id: '([A-Za-z0-9]+)'/)?.[1];
  if (declared && declared !== e.key) fail(`source "${e.key}": inner id "${declared}" does not match its key`);
  if (!/url: /.test(e.body)) fail(`source "${e.key}": no canonical URL`);
  if (!/verification: /.test(e.body)) fail(`source "${e.key}": no verification status`);
}

const conceptIds = new Set(grab(/^\s*id: '([a-z0-9-]+)', label: '/gm));

// Claims
const claimBlocks = [...src.matchAll(/\{\s*\n\s*id: '(si-\d{3})', slug: '([a-z0-9-]+)', status: '(\w+)',([\s\S]*?)\n  \},/g)];

if (declaredSourceIds.size === 0) fail('No sources parsed — the validator regex is out of date with the data module.');
if (conceptIds.size === 0) fail('No concepts parsed — the validator regex is out of date with the data module.');
if (claimBlocks.length === 0) fail('No claims parsed — the validator regex is out of date with the data module.');

const seenClaimIds = new Set();
const seenSlugs = new Set();

for (const [, id, slug, status, body] of claimBlocks) {
  if (!/^si-\d{3}$/.test(id)) fail(`${id}: malformed claim id`);
  if (seenClaimIds.has(id)) fail(`${id}: duplicate claim id`);
  seenClaimIds.add(id);
  if (seenSlugs.has(slug)) fail(`${id}: duplicate slug "${slug}"`);
  seenSlugs.add(slug);

  if (!['established', 'active', 'conjecture', 'forecast'].includes(status)) {
    fail(`${id}: unknown status "${status}"`);
  }

  const concepts = (body.match(/conceptIds: \[([^\]]*)\]/)?.[1] ?? '')
    .split(',').map((s) => s.trim().replace(/'/g, '')).filter(Boolean);
  const sources = (body.match(/sourceIds: \[([^\]]*)\]/)?.[1] ?? '')
    .split(',').map((s) => s.trim().replace(/'/g, '')).filter(Boolean);

  if (concepts.length === 0) fail(`${id}: no conceptIds`);
  if (sources.length === 0) fail(`${id}: no sourceIds — every claim must be sourced`);
  if (!/limitations:/.test(body)) fail(`${id}: missing limitations`);
  if (!/explanation:/.test(body)) fail(`${id}: missing explanation`);
  if (!/reviewDate:/.test(body)) fail(`${id}: missing reviewDate`);

  concepts.forEach((c) => { if (!conceptIds.has(c)) fail(`${id}: references missing concept "${c}"`); });
  sources.forEach((s) => {
    if (!declaredSourceIds.has(s)) fail(`${id}: references missing source "${s}"`);
    if (urlResolved.has(s)) fail(`${id}: cites "${s}", which is url-resolved only and may not support a claim`);
  });

  // The draft report may only ever back the documented fabrication exhibit.
  if (sources.includes('draftReport2026') && id !== 'si-022') {
    fail(`${id}: cites the draft report, which is not evidence for technical claims (only si-022 may cite it)`);
  }

  const hasForecastFrame = /forecast: \{/.test(body);
  if (status === 'forecast') {
    if (!hasForecastFrame) fail(`${id}: forecast status requires a forecast frame`);
    else {
      const frame = body.slice(body.indexOf('forecast: {'));
      const a = (frame.match(/assumptions: \[([\s\S]*?)\]/)?.[1] ?? '').split("',").filter((s) => s.trim()).length;
      const f = (frame.match(/failureModes: \[([\s\S]*?)\]/)?.[1] ?? '').split("',").filter((s) => s.trim()).length;
      if (a < 2) fail(`${id}: forecast needs at least two stated assumptions (found ${a})`);
      if (f < 2) fail(`${id}: forecast needs at least two stated failure modes (found ${f})`);
    }
    if (/confidence interval/i.test(body) && !/no confidence interval|carry no confidence/i.test(body)) {
      fail(`${id}: forecast claims must not assert confidence intervals`);
    }
  } else if (hasForecastFrame) {
    fail(`${id}: only forecast-status claims may carry a forecast frame`);
  }
}

// Orphan checks (advisory)
const citedSources = new Set(claimBlocks.flatMap(([, , , , body]) =>
  (body.match(/sourceIds: \[([^\]]*)\]/)?.[1] ?? '').split(',').map((s) => s.trim().replace(/'/g, '')).filter(Boolean)));
const conceptSourceRefs = new Set(grab(/sources: \[([^\]]*)\]/g).flatMap((s) =>
  s.split(',').map((x) => x.trim().replace(/'/g, '')).filter(Boolean)));

for (const s of declaredSourceIds) {
  if (!citedSources.has(s) && !conceptSourceRefs.has(s) && !urlResolved.has(s)) {
    warn(`source "${s}" is content-verified but cited by no claim or concept`);
  }
}
for (const c of conceptIds) {
  const used = claimBlocks.some(([, , , , body]) => body.includes(`'${c}'`));
  if (!used) warn(`concept "${c}" is referenced by no claim`);
}

// Cutoff must be explicit
if (!/SI_EVIDENCE_CUTOFF = '\d{4}-\d{2}-\d{2}'/.test(src)) fail('Evidence cutoff is not declared');

console.log(`sources declared      : ${declaredSourceIds.size}`);
console.log(`  url-resolved only   : ${urlResolved.size} (may not back claims)`);
console.log(`concepts              : ${conceptIds.size}`);
console.log(`claims                : ${claimBlocks.length}`);
console.log(`  forecast claims     : ${claimBlocks.filter(([, , , s]) => s === 'forecast').length}`);

if (warnings.length) {
  console.log(`\nwarnings (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
if (errors.length) {
  console.error(`\nFAILED with ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  ✗ ${e}`));
  process.exit(1);
}
console.log('\nvalidation passed: every claim resolves to existing sources and concepts.');
