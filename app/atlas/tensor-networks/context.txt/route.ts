import { TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { SITE_URL } from '@/lib/entity';
import { TN_BENCHMARKS, TN_CLAIMS, TN_META, TN_SOURCES } from '@/lib/atlas/tensor-networks';

const base = `${SITE_URL}${TENSOR_ATLAS_PATH}`;

export async function GET() {
  const body = [
    `# ${TN_META.title}`,
    '',
    TN_META.description,
    '',
    `Version: ${TN_META.version}`,
    `Evidence cutoff: ${TN_META.evidenceCutoff}`,
    `Canonical URL: ${base}`,
    `Claims JSON: ${base}/claims.json`,
    `Sources JSON: ${base}/sources.json`,
    `Methodology: ${base}/methodology`,
    '',
    '## Boundary',
    'This edition publishes source-bounded claims only. It excludes performance figures without a resolvable cited source,',
    'vendor rankings, and investment guidance. It does not assert that classical tensor-network contraction generally',
    'outperforms quantum hardware on industrial optimization workloads — see tn-014. The AdS/MERA correspondence is',
    'recorded as a conjecture with its published objection, and no computational claim here depends on it.',
    '',
    '## Claims',
    ...TN_CLAIMS.map((claim) => `- ${claim.id} [${claim.status}]: ${claim.claim}`),
    '',
    '## Claim limitations',
    // Limitations are emitted in full rather than summarized. This endpoint is
    // read by clients that will not follow a link for the caveat.
    ...TN_CLAIMS.map((claim) => `- ${claim.id}: ${claim.limitations}`),
    '',
    '## Benchmark records',
    ...TN_BENCHMARKS.flatMap((benchmark) => [
      `- ${benchmark.id}: ${benchmark.task}`,
      `  reported: ${benchmark.reportedResult}`,
      `  does not establish: ${benchmark.doesNotEstablish}`,
      `  source: ${benchmark.sourceId}`,
    ]),
    '',
    '## Sources',
    ...TN_SOURCES.map((source) => `- ${source.title} (${source.year}) — ${source.identifier} — ${source.url}`),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
