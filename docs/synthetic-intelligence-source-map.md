# Synthetic Intelligence Source Map — methodology

**Version 0.1.0 · Source layer only · Evidence cutoff 2026-06-14 · Sources resolved 2026-07-27**

## What this is

A verified source layer for a future Synthetic Intelligence Atlas. It contains a source ledger, a concept registry, and a claim ledger, held in `lib/atlas/synthetic-intelligence.ts`. **No public page is built on it.** The data is structured to match the de Sitter Atlas conventions so an atlas can be assembled later without restructuring the evidence.

This document is **not peer reviewed**. It is an educational, source-bounded orientation layer assembled by a non-specialist curator. **It is not a capability forecast**, and it must not be cited as one.

## Where it is located

The methodology document lives in `docs/` rather than `content/papers/`. Files in `content/papers/` are served as public routes by `app/papers/[slug]/page.tsx`, which reads a `PAPER_META` registry; an unregistered MDX file there would produce a broken public route, and the brief says not to create public pages yet. Promoting this to a citable paper page is a separate, deliberate step.

## Relationship to the draft report

The draft at `~/.gemini/antigravity/scratch/ai_capability_forecast/report.md` is **not evidence for any technical claim in this map**. It is retained as a methodological artifact for one reason: it documents, in its own self-audit, that the drafting instrument fabricated a figure and presented it with a `[SOURCED]` tag.

That fabrication is preserved as claim **si-022**, labelled explicitly as a *report-generated fabrication, not a METR finding*. The mechanism it exhibits — filling a post-cutoff gap with a plausible number wrapped in citation form — is the specific failure this source map exists to prevent.

Thirteen further assertions from the draft are excluded and listed with reasons in `SI_EXCLUDED_REPORT_ASSERTIONS`. Notably, the report's own *correction* to its fabrication (a "~2 hours" time horizon) is **also excluded**, because it too could not be independently verified in this pass. Correcting a fabricated number with an unverified number is not a correction.

## Source standards applied

1. **Independent resolution.** Every source marked `content-verified` was fetched during this pass and its title read; where a claim depends on specifics, the abstract was read. Nothing was cited from memory, and no identifier from the draft report was trusted without resolution.
2. **Verification is not endorsement.** A resolved citation means the work exists and is correctly placed. It says nothing about whether its argument is right.
3. **Two verification tiers.** `content-verified` sources may carry claims. `url-resolved` sources returned HTTP 200 but their contents were not extracted; **no claim cites them**. They are listed for traceability only, which is why Epoch AI's FrontierMath pages, the METR blog posts, the ARC Prize site, and the SWE-bench leaderboard appear as sources but support nothing.
4. **Provider reports are self-reports.** Technical reports and model cards are typed `provider-self-report` and are never treated as independent measurements, regardless of formatting.
5. **No secondary sources.** Community aggregators and news outlets cited by the draft — Quantum Zeitgeist, Digg, intuitionlabs, smartchunks, Morph Labs — are excluded. Where their underlying point was substantive (contamination, saturation), it was re-grounded in peer-reviewed primaries or dropped.
6. **No unverified numbers.** Benchmark scores, model names, release dates, compute estimates, and pricing from the draft are not reproduced. The map makes structural claims about what each benchmark measures instead of restating leaderboards.

## Claim discipline

Every claim carries a stable ID (`si-001`…), a status, an explanation, a limitations statement, concept IDs, source IDs, and a review date. Identifiers are never reassigned.

Four separations are enforced throughout:

- **No single capability score.** There is no aggregate "AI intelligence" number anywhere in this map, and `si-023` states why as a claim rather than a footnote.
- **Benchmark performance ≠ general capability.** A score is a measurement of a system on a task distribution under a scaffolding configuration at a date.
- **Model capability ≠ scaffolding capability.** `si-010` establishes that interface design changes outcomes with the model held fixed, so agentic scores measure a model-plus-scaffold system.
- **History ≠ forecast.** Historical observations are never labelled `forecast`, and forecast claims are never labelled anything else.

## The `forecast` status

This map adds a fourth status beyond the de Sitter atlas's three. A `forecast` claim is a **conditional scenario with stated assumptions and failure modes**. It is not a prediction, not a probability statement, and not evidence about the world.

The draft's 2030 projection table is excluded in full. Its intervals were labelled "90% confidence intervals" with no stated method, no calibration, and baselines drawn from figures this map excludes. The two scenarios that replace it (`si-024`, `si-025`) carry **no numeric intervals at all** — only an explicit assumption set and an explicit list of ways each could fail.

## Scope

**In scope:** LLM mechanisms and scaling; post-training and inference-time reasoning; tool use, retrieval, coding agents, long-horizon agents; benchmarks and construct validity; reliability, evaluation, contamination, and forecasting limits; bounded scenarios kept separate from historical evidence.

**Out of scope by design:** quantum computing. It requires a different primary literature and different epistemic boundaries, and belongs in its own atlas.

## Validation

`scripts/validate-atlas-sources.mjs` fails the build if a claim references a missing source or concept, if an ID is duplicated or malformed, if a `forecast` claim lacks assumptions or failure modes, if a non-forecast claim carries a forecast frame, if a claim cites a `url-resolved` source, or if any claim other than `si-022` cites the draft report. Run it with `npm run validate:atlas`.

## Known limits of this pass

- Source verification confirmed identifier, title, and canonical URL. For most sources the abstract was not read in full, so claims are pitched at what the title and role support.
- Six sources are `url-resolved` only and support nothing. Extracting their contents would let several currently-excluded assertions be re-examined.
- The concept registry is a starting structure, not a survey of the field. Eighteen concepts cannot cover this literature.
- Everything here is time-stamped. The evidence cutoff is 2026-06-14; the resolution date is 2026-07-27. These are different things and are recorded separately.
