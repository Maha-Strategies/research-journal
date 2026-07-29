#!/usr/bin/env node
// Advisory source-link check.
//
// Usage: npm run atlas:check-links
//
// ADVISORY MEANS ADVISORY. This script reports and exits 0 even when links
// fail, unless it is given --strict.
//
// That is a deliberate design decision, not laxity. If a link check could block
// a release, then a publisher having a bad afternoon, a rate limit, a captive
// portal, or a server that refuses HEAD would all stop legitimate editorial
// work. The predictable result is that someone adds a flag to skip the check,
// and then it is skipped permanently. A check that cries wolf gets disabled;
// one that reports honestly gets read.
//
// Link rot is real and worth knowing about, so this runs on a schedule
// (.github/workflows/atlas-link-check.yml) and reports. A human decides whether
// a dead link means the source moved, the source is gone, or the record is
// wrong — none of which a 404 can distinguish.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const strict = process.argv.includes('--strict');
const PUBLISHED = path.join(process.cwd(), 'content/atlas-releases/published.json');

const raw = await readFile(PUBLISHED, 'utf8').catch(() => null);
if (raw === null) {
  console.log('No published.json. Nothing to check.');
  process.exit(0);
}

const releases = JSON.parse(raw);
if (releases.length === 0) {
  console.log('No published releases. Nothing to check.');
  process.exit(0);
}

/** HEAD first; some publishers reject it, so fall back to a ranged GET. */
async function resolve(url) {
  const attempt = async (init) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      return await fetch(url, { ...init, redirect: 'follow', signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    const head = await attempt({ method: 'HEAD' });
    if (head.ok) return { ok: true, status: head.status, method: 'HEAD' };

    // 403/405 from a HEAD is usually a policy, not a dead link.
    const get = await attempt({ method: 'GET', headers: { Range: 'bytes=0-0' } });
    return { ok: get.ok, status: get.status, method: 'GET' };
  } catch (cause) {
    return { ok: false, error: cause?.name === 'AbortError' ? 'timed out' : String(cause?.message ?? cause) };
  }
}

const findings = [];

for (const release of releases) {
  const sources = release.atlas?.sources ?? [];
  const checks = await Promise.all(
    sources
      .filter((source) => source.url)
      .map(async (source) => ({ source, result: await resolve(source.url) })),
  );

  const failures = checks.filter(({ result }) => !result.ok);
  console.log(
    `${release.slug}@${release.version}: ${checks.length} link(s) checked, ${failures.length} unresolved`,
  );

  for (const { source, result } of failures) {
    const detail = result.error ? result.error : `HTTP ${result.status}`;
    console.log(`  ✗ ${source.id} — ${detail}`);
    console.log(`    ${source.url}`);
    findings.push({ slug: release.slug, sourceId: source.id, url: source.url, detail });
  }
}

console.log(
  findings.length === 0
    ? '\nEvery source link resolved.'
    : `\n${findings.length} link(s) did not resolve. This is advisory: a failure here does not mean the record is wrong, and it never blocks a release. Check each one before changing anything.`,
);

// --strict exists for a human deliberately asking "fail if anything is broken",
// not for CI. The scheduled workflow does not pass it.
process.exit(strict && findings.length > 0 ? 1 : 0);
