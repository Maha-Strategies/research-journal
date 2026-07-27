# Atlas Expansion System

The Atlas Expansion System is the research-site infrastructure for growing indexable pages without producing generic, unsupported content. It is not an auto-publishing system.

## Publication gate

An Atlas is eligible for the public catalog only when it has:

1. A canonical `/atlas/...` URL and semantic version.
2. A review date, stated scope, and stated exclusions.
3. At least one public claim, concept, and source record.
4. A source-backed claim ledger, source trail, and metadata endpoint.
5. Page-level limitations and an explicit epistemic status wherever a claim needs one.
6. A successful production build, which confirms the declared static routes compile.

## Page classes

Every Atlas uses a bounded set of page classes: landing page, claim record, concept record, source record, JSON metadata, claim ledger JSON, source trail JSON, and plain-text context. Optional classes—context packs, methods, datasets, argument/response records—must be earned by their source layer rather than added for volume.

## Expansion pipeline

`candidate → source resolved → source read → claim drafted → status and limitation written → editorial review → catalog entry updated → build passes → publish`

Candidates are not URLs. They do not appear in the sitemap or public Atlas until the full gate is satisfied.

## Current roadmap toward 1,000 quality-indexed pages

- Expand existing research Atlases with source-backed claim, concept, and source records.
- Build a Mayon learning/source atlas on the Mayon domain using the same boundaries and public-agency source rules.
- Expand Agentic Publishing documentation around actual product features, release manifests, and context packs.
- Build MPS learning and implementation pages around real workflows rather than keyword variants.
- Keep commercial proof (case studies, technical guides, API documentation) on Maha Strategies, distinct from research claims.

No component should create pages merely because a template exists. Each page must answer a distinct question and link to its source or operating evidence.
