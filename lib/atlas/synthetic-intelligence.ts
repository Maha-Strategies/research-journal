// Source layer for a future Synthetic Intelligence Atlas.
//
// SCOPE: LLM mechanisms and scaling, post-training and inference-time reasoning,
// tool use and agents, benchmarks and construct validity, evaluation and
// forecasting limits, and explicitly separated bounded scenarios. Quantum
// computing is deliberately out of scope; it needs a different primary
// literature and different epistemic boundaries, and belongs in its own atlas.
//
// PROVENANCE RULE. The draft report at
// ~/.gemini/antigravity/scratch/ai_capability_forecast/report.md is NOT evidence
// for any technical claim here. It is retained only as a methodological and
// self-audit artifact — specifically as an exhibit of citation confabulation.
// Every factual claim below is supported by a source that was independently
// resolved during this pass. Nothing was cited from memory of the report.
//
// EVIDENCE CUTOFF. 2026-06-14, matching the draft report's cutoff. No claim
// asserts a fact after that date. Source URLs were resolved on 2026-07-27;
// resolution date and evidence cutoff are different things and are recorded
// separately.
//
// This file is data only. No public Atlas route is built on it yet.

export const SI_EVIDENCE_CUTOFF = '2026-06-14';
export const SI_SOURCES_RESOLVED_ON = '2026-07-27';
export const SI_ATLAS_VERSION = '0.1.0';
export const SI_REVIEW_DATE = '2026-07-27';

/**
 * `forecast` is a fourth status specific to this atlas. A forecast claim is a
 * conditional scenario with stated assumptions and failure modes. It is never a
 * prediction and never a fact.
 */
export type SiStatus = 'established' | 'active' | 'conjecture' | 'forecast';

export type SiStatusDescriptor = { id: SiStatus; label: string; definition: string };

export const SI_STATUSES: SiStatusDescriptor[] = [
  {
    id: 'established',
    label: 'Established result',
    definition:
      'A published result, defined construction, or documented methodology that the relevant literature treats as settled. It says what was shown, not that any broader capability claim follows.',
  },
  {
    id: 'active',
    label: 'Active research',
    definition:
      'A genuinely open or contested question. Competent researchers disagree on technical grounds and no side has closed it.',
  },
  {
    id: 'conjecture',
    label: 'Conjecture',
    definition:
      'A precisely stated proposal motivated by evidence but not demonstrated. It may be true; it is not established.',
  },
  {
    id: 'forecast',
    label: 'Forecast scenario',
    definition:
      'A conditional scenario with explicit assumptions and failure modes. Not a prediction, not a probability statement, and not evidence about the world. Historical observations are never labelled this way, and forecast claims are never labelled anything else.',
  },
];

export type SiSourceType =
  | 'primary-paper'
  | 'benchmark-documentation'
  | 'provider-self-report'
  | 'research-organization'
  | 'methodological-artifact';

export const SI_SOURCE_TYPES: { id: SiSourceType; label: string; definition: string }[] = [
  { id: 'primary-paper', label: 'Primary paper', definition: 'A research paper presenting its own method, result, or argument.' },
  { id: 'benchmark-documentation', label: 'Benchmark documentation', definition: 'Documentation published by the owner or author of a benchmark about that benchmark.' },
  {
    id: 'provider-self-report',
    label: 'Provider self-report',
    definition:
      'A technical report or model card published by the organization that built the system. Treated as a self-report, never as an independent measurement, regardless of how it is formatted.',
  },
  { id: 'research-organization', label: 'Research organization publication', definition: 'A publication by an independent evaluation or forecasting organization.' },
  {
    id: 'methodological-artifact',
    label: 'Methodological artifact',
    definition:
      'Retained to document a process failure. Carries no evidential weight for any technical claim and may never be cited in support of one.',
  },
];

/**
 * `content-verified` means the identifier was resolved to the source and its
 * title (and where relevant its abstract) was read during this pass.
 * `url-resolved` means the canonical URL returned HTTP 200 but the page content
 * was not extracted; such sources carry no claim.
 * `excluded` means the draft report cited it and it was rejected.
 */
export type SiVerification = 'content-verified' | 'url-resolved' | 'excluded';

export type SiSource = {
  id: string;
  title: string;
  authors?: string;
  year: number;
  identifier?: string;
  doi?: string;
  url: string;
  sourceType: SiSourceType;
  verification: SiVerification;
  verifiedOn: string;
  whyHere: string;
  /** Set when the source is reachable but its contents were not read. */
  contentNotExtracted?: boolean;
};

const ARXIV = 'https://arxiv.org/abs/';
const V = SI_SOURCES_RESOLVED_ON;

export const SI_SOURCES: Record<string, SiSource> = {
  vaswani2017: {
    id: 'vaswani2017', title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017,
    identifier: 'arXiv:1706.03762', url: `${ARXIV}1706.03762`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The architecture paper underlying the transformer models this atlas is about.',
  },
  brown2020: {
    id: 'brown2020', title: 'Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020,
    identifier: 'arXiv:2005.14165', url: `${ARXIV}2005.14165`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Introduced in-context few-shot learning as an emergent property of scale.',
  },
  kaplan2020: {
    id: 'kaplan2020', title: 'Scaling Laws for Neural Language Models', authors: 'Kaplan et al.', year: 2020,
    identifier: 'arXiv:2001.08361', url: `${ARXIV}2001.08361`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The original power-law scaling result, and one side of the compute-allocation disagreement.',
  },
  hoffmann2022: {
    id: 'hoffmann2022', title: 'Training Compute-Optimal Large Language Models', authors: 'Hoffmann et al.', year: 2022,
    identifier: 'arXiv:2203.15556', url: `${ARXIV}2203.15556`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The Chinchilla revision of compute-optimal allocation, and the other side of that disagreement.',
  },
  chowdhery2022: {
    id: 'chowdhery2022', title: 'PaLM: Scaling Language Modeling with Pathways', authors: 'Chowdhery et al.', year: 2022,
    identifier: 'arXiv:2204.02311', url: `${ARXIV}2204.02311`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'A large-scale training report cited for scaling practice, not for leaderboard position.',
  },
  ouyang2022: {
    id: 'ouyang2022', title: 'Training language models to follow instructions with human feedback', authors: 'Ouyang et al.', year: 2022,
    identifier: 'arXiv:2203.02155', url: `${ARXIV}2203.02155`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The post-training method that separated instruction-following from raw pre-training.',
  },
  wei2022: {
    id: 'wei2022', title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', authors: 'Wei et al.', year: 2022,
    identifier: 'arXiv:2201.11903', url: `${ARXIV}2201.11903`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Established that intermediate reasoning steps at inference change measured performance.',
  },
  snell2024: {
    id: 'snell2024', title: 'Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters', authors: 'Snell et al.', year: 2024,
    identifier: 'arXiv:2408.03314', url: `${ARXIV}2408.03314`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The inference-time compute trade-off against parameter scaling.',
  },
  cobbe2021: {
    id: 'cobbe2021', title: 'Training Verifiers to Solve Math Word Problems', authors: 'Cobbe et al.', year: 2021,
    identifier: 'arXiv:2110.14168', url: `${ARXIV}2110.14168`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Verifier-based selection over sampled solutions, an early inference-time compute method.',
  },
  lewkowycz2022: {
    id: 'lewkowycz2022', title: 'Solving Quantitative Reasoning Problems with Language Models', authors: 'Lewkowycz et al.', year: 2022,
    identifier: 'arXiv:2206.14858', url: `${ARXIV}2206.14858`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Domain-targeted training on quantitative reasoning; cited for method, not for score comparisons.',
  },
  lewis2020: {
    id: 'lewis2020', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', authors: 'Lewis et al.', year: 2020,
    identifier: 'arXiv:2005.11401', url: `${ARXIV}2005.11401`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The originating formulation of retrieval-augmented generation.',
  },
  schick2023: {
    id: 'schick2023', title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', authors: 'Schick et al.', year: 2023,
    identifier: 'arXiv:2302.04761', url: `${ARXIV}2302.04761`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Learned external tool invocation from the model side.',
  },
  yao2022: {
    id: 'yao2022', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', authors: 'Yao et al.', year: 2022,
    identifier: 'arXiv:2210.03629', url: `${ARXIV}2210.03629`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The interleaved reason-and-act pattern underlying most agent loops.',
  },
  jimenez2023: {
    id: 'jimenez2023', title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', authors: 'Jimenez et al.', year: 2023,
    identifier: 'arXiv:2310.06770', url: `${ARXIV}2310.06770`, sourceType: 'benchmark-documentation',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The benchmark definition for test-verified resolution of real repository issues.',
  },
  yang2024: {
    id: 'yang2024', title: 'SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering', authors: 'Yang et al.', year: 2024,
    identifier: 'arXiv:2405.15793', url: `${ARXIV}2405.15793`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The load-bearing source for separating scaffolding capability from model capability.',
  },
  liu2023agentbench: {
    id: 'liu2023agentbench', title: 'AgentBench: Evaluating LLMs as Agents', authors: 'Liu et al.', year: 2023,
    identifier: 'arXiv:2308.03688', url: `${ARXIV}2308.03688`, sourceType: 'benchmark-documentation',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Multi-environment agent evaluation, cited for evaluation design rather than rankings.',
  },
  kwa2025: {
    id: 'kwa2025', title: 'Measuring AI Ability to Complete Long Software Tasks', authors: 'Kwa et al. (METR)', year: 2025,
    identifier: 'arXiv:2503.14499', url: `${ARXIV}2503.14499`, sourceType: 'research-organization',
    verification: 'content-verified', verifiedOn: V,
    whyHere:
      'The primary definition of the 50%-task-completion time horizon. Abstract read during this pass; it is the only verified source for any time-horizon figure in this map.',
  },
  hendrycks2020: {
    id: 'hendrycks2020', title: 'Measuring Massive Multitask Language Understanding', authors: 'Hendrycks et al.', year: 2020,
    identifier: 'arXiv:2009.03300', url: `${ARXIV}2009.03300`, sourceType: 'benchmark-documentation',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The MMLU benchmark definition.',
  },
  wang2024: {
    id: 'wang2024', title: 'MMLU-Pro: A More Robust and Challenging Multi-Task Language Understanding Benchmark', authors: 'Wang et al.', year: 2024,
    identifier: 'arXiv:2406.01574', url: `${ARXIV}2406.01574`, sourceType: 'benchmark-documentation',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'A benchmark revision motivated by saturation and robustness problems in the original.',
  },
  rein2023: {
    id: 'rein2023', title: 'GPQA: A Graduate-Level Google-Proof Q&A Benchmark', authors: 'Rein et al.', year: 2023,
    identifier: 'arXiv:2311.12022', url: `${ARXIV}2311.12022`, sourceType: 'benchmark-documentation',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The GPQA definition and its stated human baselines.',
  },
  chollet2019: {
    id: 'chollet2019', title: 'On the Measure of Intelligence', authors: 'Chollet', year: 2019,
    identifier: 'arXiv:1911.01547', url: `${ARXIV}1911.01547`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The skill-versus-generalization argument and the ARC formulation, central to construct validity here.',
  },
  srivastava2022: {
    id: 'srivastava2022', title: 'Beyond the Imitation Game: Quantifying and extrapolating the capabilities of language models', authors: 'Srivastava et al.', year: 2022,
    identifier: 'arXiv:2206.04615', url: `${ARXIV}2206.04615`, sourceType: 'benchmark-documentation',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'A large collaborative benchmark explicitly concerned with extrapolating capability.',
  },
  liang2022: {
    id: 'liang2022', title: 'Holistic Evaluation of Language Models', authors: 'Liang et al.', year: 2022,
    identifier: 'arXiv:2211.09110', url: `${ARXIV}2211.09110`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The argument for multi-metric evaluation instead of a single headline number.',
  },
  raji2021: {
    id: 'raji2021', title: 'AI and the Everything in the Whole Wide World Benchmark', authors: 'Raji et al.', year: 2021,
    identifier: 'arXiv:2111.15366', url: `${ARXIV}2111.15366`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The construct-validity critique of general-purpose benchmarks.',
  },
  bowman2021: {
    id: 'bowman2021', title: 'What Will it Take to Fix Benchmarking in Natural Language Understanding?', authors: 'Bowman and Dahl', year: 2021,
    identifier: 'arXiv:2104.02145', url: `${ARXIV}2104.02145`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Names the structural failure modes of benchmark-driven progress measurement.',
  },
  sainz2023: {
    id: 'sainz2023', title: 'NLP Evaluation in trouble: On the Need to Measure LLM Data Contamination for each Benchmark', authors: 'Sainz et al.', year: 2023,
    identifier: 'arXiv:2310.18018', url: `${ARXIV}2310.18018`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Contamination as a per-benchmark measurement problem rather than an anecdote.',
  },
  deng2023: {
    id: 'deng2023', title: 'Investigating Data Contamination in Modern Benchmarks for Large Language Models', authors: 'Deng et al.', year: 2023,
    identifier: 'arXiv:2311.09783', url: `${ARXIV}2311.09783`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Empirical contamination investigation across widely used benchmarks.',
  },
  chen2023drift: {
    id: 'chen2023drift', title: "How is ChatGPT's behavior changing over time?", authors: 'Chen, Zaharia, Zou', year: 2023,
    identifier: 'arXiv:2307.09009', url: `${ARXIV}2307.09009`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Documents that a fixed prompt against a served model is not a stable measurement over time.',
  },
  bommasani2021: {
    id: 'bommasani2021', title: 'On the Opportunities and Risks of Foundation Models', authors: 'Bommasani et al.', year: 2021,
    identifier: 'arXiv:2108.07258', url: `${ARXIV}2108.07258`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'Framing source for governance and accountability of general-purpose models.',
  },
  mitchell2019: {
    id: 'mitchell2019', title: 'Model Cards for Model Reporting', authors: 'Mitchell et al.', year: 2019,
    identifier: 'arXiv:1810.03993', url: `${ARXIV}1810.03993`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The reporting convention whose existence is why provider self-reports are structured the way they are.',
  },
  openai2023gpt4: {
    id: 'openai2023gpt4', title: 'GPT-4 Technical Report', authors: 'OpenAI', year: 2023,
    identifier: 'arXiv:2303.08774', url: `${ARXIV}2303.08774`, sourceType: 'provider-self-report',
    verification: 'content-verified', verifiedOn: V,
    whyHere:
      'Cited as an example of a provider technical report, including its own disclosure that architecture and training details are withheld. Not an independent measurement.',
  },
  grattafiori2024: {
    id: 'grattafiori2024', title: 'The Llama 3 Herd of Models', authors: 'Grattafiori et al. (Meta)', year: 2024,
    identifier: 'arXiv:2407.21783', url: `${ARXIV}2407.21783`, sourceType: 'provider-self-report',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'A comparatively detailed provider training report; still a self-report.',
  },
  grace2024: {
    id: 'grace2024', title: 'Thousands of AI Authors on the Future of AI', authors: 'Grace et al.', year: 2024,
    identifier: 'arXiv:2401.02843', url: `${ARXIV}2401.02843`, sourceType: 'primary-paper',
    verification: 'content-verified', verifiedOn: V,
    whyHere: 'The large expert-survey instrument used for timeline forecasting, and evidence about forecast instability.',
  },

  // Reachable but contents not extracted in this pass. No claim may cite these.
  metrTimeHorizonsBlog: {
    id: 'metrTimeHorizonsBlog', title: 'Measuring AI Ability to Complete Long Tasks (METR blog post)', authors: 'METR', year: 2025,
    url: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/',
    sourceType: 'research-organization', verification: 'url-resolved', verifiedOn: V, contentNotExtracted: true,
    whyHere: 'The organizational companion to the time-horizon paper. Listed for traceability; the paper is what claims cite.',
  },
  metrTimeHorizon11: {
    id: 'metrTimeHorizon11', title: 'Time Horizon 1.1 (METR blog post)', authors: 'METR', year: 2026,
    url: 'https://metr.org/blog/2026-1-29-time-horizon-1-1',
    sourceType: 'research-organization', verification: 'url-resolved', verifiedOn: V, contentNotExtracted: true,
    whyHere:
      'The draft report attributes a revised doubling-time estimate to this post. The URL resolves, but its contents were not extracted here, so no figure from it is carried into any claim.',
  },
  epochFrontierMath: {
    id: 'epochFrontierMath', title: 'FrontierMath (Epoch AI)', authors: 'Epoch AI', year: 2024,
    url: 'https://epoch.ai/frontiermath',
    sourceType: 'benchmark-documentation', verification: 'url-resolved', verifiedOn: V, contentNotExtracted: true,
    whyHere: 'Benchmark owner documentation. Listed for traceability; no score or tier claim is made from it.',
  },
  epochFrontierMathV2: {
    id: 'epochFrontierMathV2', title: 'FrontierMath Tier 4 v2 (Epoch AI)', authors: 'Epoch AI', year: 2026,
    url: 'https://epoch.ai/benchmarks/frontiermath-tier-4-v2',
    sourceType: 'benchmark-documentation', verification: 'url-resolved', verifiedOn: V, contentNotExtracted: true,
    whyHere:
      'The draft report attributes a large post-correction score swing to this page. The URL resolves; its contents were not extracted, so the swing is recorded as an unverified report assertion rather than a claim.',
  },
  arcPrize: {
    id: 'arcPrize', title: 'ARC Prize', authors: 'ARC Prize Foundation', year: 2024,
    url: 'https://arcprize.org/arc-agi',
    sourceType: 'benchmark-documentation', verification: 'url-resolved', verifiedOn: V, contentNotExtracted: true,
    whyHere: 'Benchmark owner documentation for ARC-AGI. Conceptual claims about ARC cite Chollet 2019 instead.',
  },
  swebenchSite: {
    id: 'swebenchSite', title: 'SWE-bench project site and leaderboard', authors: 'SWE-bench authors', year: 2023,
    url: 'https://www.swebench.com/',
    sourceType: 'benchmark-documentation', verification: 'url-resolved', verifiedOn: V, contentNotExtracted: true,
    whyHere: 'Benchmark owner site. Listed for traceability; no leaderboard figure is carried into any claim.',
  },

  // Retained only as a failure-mode exhibit. Carries no evidential weight.
  draftReport2026: {
    id: 'draftReport2026',
    title: 'AI Capability Trajectory: A Bounded Forecast and Its Own Failure Modes (unpublished draft)',
    authors: 'AI synthesis instrument, under Maha Strategies direction', year: 2026,
    url: 'file://~/.gemini/antigravity/scratch/ai_capability_forecast/report.md',
    sourceType: 'methodological-artifact', verification: 'content-verified', verifiedOn: V,
    whyHere:
      'The draft this map replaces. It is cited for exactly one thing: its own record of having fabricated a citation. It is not evidence for any technical claim, and any claim citing it must be about the draft itself.',
  },
};

export type SiConcept = {
  id: string;
  label: string;
  definition: string;
  whyItMatters: string;
  related: string[];
  sources: string[];
  notEstablished?: string;
};

export const SI_CONCEPTS: SiConcept[] = [
  {
    id: 'large-language-models', label: 'Large language models',
    definition: 'Neural networks trained on large text corpora to predict tokens, then adapted to follow instructions and produce text or actions.',
    whyItMatters: 'The object every other concept in this map is about. Nearly all capability discussion reduces to statements about these systems under particular scaffolding.',
    related: ['transformers', 'pre-training', 'post-training', 'scaling-laws'],
    sources: ['vaswani2017', 'brown2020', 'bommasani2021'],
    notEstablished: 'That these systems possess a general capability corresponding to human intelligence. No source in this map supports a single scalar capability score.',
  },
  {
    id: 'transformers', label: 'Transformers',
    definition: 'A sequence architecture built on attention rather than recurrence or convolution.',
    whyItMatters: 'Architectural properties set what can be scaled and what the inference cost profile looks like.',
    related: ['large-language-models', 'pre-training', 'inference-time-compute'],
    sources: ['vaswani2017'],
  },
  {
    id: 'scaling-laws', label: 'Scaling laws',
    definition: 'Empirical relations between training compute, parameters, data, and loss.',
    whyItMatters: 'Scaling laws are the basis of most quantitative capability forecasting, so their contested regions propagate directly into forecast uncertainty.',
    related: ['pre-training', 'ai-forecasting', 'large-language-models'],
    sources: ['kaplan2020', 'hoffmann2022', 'chowdhery2022'],
    notEstablished: 'That a loss curve extrapolates to a capability claim. Scaling laws are fitted on loss, not on task competence, and the mapping between them is not established.',
  },
  {
    id: 'pre-training', label: 'Pre-training',
    definition: 'The large-scale self-supervised phase in which a model learns from an unlabelled corpus.',
    whyItMatters: 'Determines what is in the model before any alignment, and is where benchmark contamination enters.',
    related: ['scaling-laws', 'benchmark-contamination', 'post-training'],
    sources: ['brown2020', 'kaplan2020', 'hoffmann2022', 'grattafiori2024', 'lewkowycz2022'],
  },
  {
    id: 'post-training', label: 'Post-training',
    definition: 'Adaptation after pre-training — supervised fine-tuning, preference optimization, reinforcement learning from human or model feedback.',
    whyItMatters: 'Most of the difference between a raw pre-trained model and a deployed assistant is here, which means capability comparisons across models often compare post-training pipelines.',
    related: ['pre-training', 'inference-time-compute', 'evaluation'],
    sources: ['ouyang2022'],
  },
  {
    id: 'inference-time-compute', label: 'Inference-time compute',
    definition: 'Additional computation spent at generation time — longer reasoning traces, sampling with verification, or search over candidate outputs.',
    whyItMatters: 'It breaks the assumption that a benchmark score is a property of a model. The same weights score differently under different inference budgets.',
    related: ['post-training', 'evaluation', 'agent-loop'],
    sources: ['wei2022', 'cobbe2021', 'snell2024'],
    notEstablished: 'That inference-time gains substitute indefinitely for training scale. The trade-off is reported within studied regimes, not as a general law.',
  },
  {
    id: 'retrieval-augmented-generation', label: 'Retrieval-augmented generation',
    definition: 'Conditioning generation on documents fetched at inference time from an external store.',
    whyItMatters: 'Separates what a system knows from what its weights encode, which changes what a capability measurement is measuring.',
    related: ['tool-use', 'large-language-models', 'evaluation'],
    sources: ['lewis2020'],
  },
  {
    id: 'tool-use', label: 'Tool use',
    definition: 'Model-initiated invocation of external functions — search, code execution, APIs — with results returned into context.',
    whyItMatters: 'Tool access frequently accounts for more measured improvement than model changes, and is often not held constant across comparisons.',
    related: ['agent-loop', 'retrieval-augmented-generation', 'coding-agents'],
    sources: ['schick2023', 'yao2022'],
  },
  {
    id: 'agent-loop', label: 'Agent loop',
    definition: 'An iterated cycle of reasoning, acting through tools, and observing results, continuing until a stopping condition.',
    whyItMatters: 'The loop and its environment are a system distinct from the model inside it. Attributing loop performance to the model is the most common category error in capability reporting.',
    related: ['tool-use', 'coding-agents', 'long-horizon-task-completion', 'reliability-compounding-error'],
    sources: ['yao2022', 'liu2023agentbench'],
  },
  {
    id: 'coding-agents', label: 'Coding agents',
    definition: 'Agent systems operating on real codebases through file, shell, and test interfaces.',
    whyItMatters: 'The most measured agentic domain, and the clearest demonstration that interface design changes outcomes independently of the model.',
    related: ['agent-loop', 'tool-use', 'evaluation'],
    sources: ['jimenez2023', 'yang2024'],
  },
  {
    id: 'long-horizon-task-completion', label: 'Long-horizon task completion',
    definition: 'The ability to carry a task requiring many dependent steps to completion, measured here by the time a human would take on tasks a system completes at a given success rate.',
    whyItMatters: 'It is the capability most relevant to autonomy claims and the one where measurement is least mature.',
    related: ['agent-loop', 'reliability-compounding-error', 'ai-forecasting'],
    sources: ['kwa2025'],
    notEstablished: 'That a measured horizon transfers to real-world software work. The source paper explicitly frames external validity as a limitation and its forward statement as conditional.',
  },
  {
    id: 'reliability-compounding-error', label: 'Reliability and compounding error',
    definition: 'The tendency of per-step failure probabilities to accumulate across a multi-step trajectory.',
    whyItMatters: 'It explains why systems that look strong on single-step benchmarks can fail on long tasks, and why error recovery matters more than peak accuracy.',
    related: ['long-horizon-task-completion', 'agent-loop', 'evaluation'],
    sources: ['kwa2025', 'liu2023agentbench'],
  },
  {
    id: 'evaluation', label: 'Evaluation',
    definition: 'The practice of measuring model or system behaviour against defined tasks and metrics.',
    whyItMatters: 'Every capability statement is an evaluation statement. What was measured, under what scaffolding, by whom, decides what the number means.',
    related: ['construct-validity', 'benchmark-contamination', 'governance-accountability'],
    sources: ['liang2022', 'srivastava2022', 'bowman2021', 'liu2023agentbench'],
  },
  {
    id: 'construct-validity', label: 'Construct validity',
    definition: 'Whether a measurement actually measures the property it is claimed to measure.',
    whyItMatters: 'It is the difference between "scored well on this benchmark" and "is capable". This atlas keeps those separate everywhere.',
    related: ['evaluation', 'benchmark-contamination', 'large-language-models'],
    sources: ['raji2021', 'bowman2021', 'chollet2019', 'hendrycks2020', 'rein2023'],
    notEstablished: 'That any benchmark in this map measures general intelligence. Each measures a defined task distribution, and its authors say so.',
  },
  {
    id: 'benchmark-contamination', label: 'Benchmark contamination',
    definition: 'Presence of evaluation data, or close variants, in training corpora.',
    whyItMatters: 'Contamination inflates scores without capability change, and is the main reason benchmark trends cannot be read as capability trends.',
    related: ['pre-training', 'evaluation', 'construct-validity'],
    sources: ['sainz2023', 'deng2023'],
  },
  {
    id: 'local-inference', label: 'Local and on-device inference',
    definition: 'Running models on user-controlled hardware rather than a hosted API.',
    whyItMatters: 'It changes the cost, privacy, and reproducibility profile of a system, and makes an evaluation reproducible in a way a served endpoint is not.',
    related: ['evaluation', 'governance-accountability', 'transformers'],
    sources: ['grattafiori2024', 'chen2023drift'],
    notEstablished: 'Any claim about the current capability gap between local and hosted models. No source in this map measures that gap as of the evidence cutoff.',
  },
  {
    id: 'ai-forecasting', label: 'AI forecasting',
    definition: 'Projection of future capability from historical measurements, expert elicitation, or trend extrapolation.',
    whyItMatters: 'Forecasts drive policy and capital allocation, and their failure modes are documentable rather than hypothetical.',
    related: ['scaling-laws', 'long-horizon-task-completion', 'construct-validity'],
    sources: ['grace2024', 'kwa2025', 'srivastava2022'],
    notEstablished: 'That any projection in this map is a prediction. Forecast-status claims are conditional scenarios with stated assumptions and failure modes.',
  },
  {
    id: 'governance-accountability', label: 'Governance and accountability',
    definition: 'Mechanisms for disclosure, reporting, and responsibility around deployed models.',
    whyItMatters: 'Reporting conventions determine what outsiders can check, which determines whether any capability claim is auditable.',
    related: ['evaluation', 'construct-validity', 'local-inference'],
    sources: ['mitchell2019', 'bommasani2021', 'openai2023gpt4'],
  },
];

export type SiForecastFrame = { assumptions: string[]; failureModes: string[] };

export type SiClaim = {
  id: string;
  slug: string;
  claim: string;
  status: SiStatus;
  explanation: string;
  limitations: string;
  conceptIds: string[];
  sourceIds: string[];
  reviewDate: string;
  /** Required when status is 'forecast'; forbidden otherwise. Enforced by the validator. */
  forecast?: SiForecastFrame;
};

export const SI_CLAIMS: SiClaim[] = [
  {
    id: 'si-001', slug: 'transformer-architecture', status: 'established',
    claim: 'The transformer architecture replaces recurrence and convolution with attention as the primary sequence-modelling mechanism.',
    explanation: 'This is an architectural fact stated by the originating paper and universally adopted since.',
    limitations: 'Architecture alone determines no capability. Nothing about attention implies any particular task competence.',
    conceptIds: ['transformers', 'large-language-models'], sourceIds: ['vaswani2017'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-002', slug: 'in-context-learning', status: 'established',
    claim: 'Sufficiently large autoregressive language models perform tasks from instructions and examples supplied in context, without gradient updates.',
    explanation: 'In-context few-shot behaviour was the central reported finding of the GPT-3 paper and is reproduced widely.',
    limitations: 'Reported on the task distributions studied. It is not a claim that in-context learning generalizes to arbitrary tasks, and it says nothing about reliability.',
    conceptIds: ['large-language-models', 'pre-training'], sourceIds: ['brown2020'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-003', slug: 'scaling-laws-loss', status: 'established',
    claim: 'Language-model loss follows empirical power-law relationships with training compute, parameter count, and dataset size over the studied ranges.',
    explanation: 'The originating scaling-law work fitted these relations across several orders of magnitude.',
    limitations: 'These are relations on loss within a studied range, not on task capability, and not guaranteed to hold outside it. Treating a loss extrapolation as a capability forecast is not supported by the source.',
    conceptIds: ['scaling-laws', 'pre-training'], sourceIds: ['kaplan2020'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-004', slug: 'compute-optimal-allocation-contested', status: 'active',
    claim: 'The compute-optimal allocation between parameters and training tokens has been revised in the literature, and deployed practice diverges from compute-optimal training.',
    explanation: 'The Chinchilla work revised the earlier parameter-heavy allocation toward a more balanced ratio, and large deployed models are trained well past compute-optimal token counts to reduce inference cost.',
    limitations: 'The direction of the revision is sourced; the specific exponents and ratios are not restated here, and no claim is made about what any particular current model used.',
    conceptIds: ['scaling-laws', 'pre-training'], sourceIds: ['kaplan2020', 'hoffmann2022', 'grattafiori2024'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-005', slug: 'rlhf-instruction-following', status: 'established',
    claim: 'Fine-tuning with human feedback substantially changes how closely a model follows instructions relative to its pre-trained base.',
    explanation: 'The InstructGPT work established this as a distinct post-training stage rather than a property of pre-training.',
    limitations: 'Instruction-following is not correctness, safety, or capability. Improvements on preference judgements do not transfer automatically to task accuracy.',
    conceptIds: ['post-training', 'large-language-models'], sourceIds: ['ouyang2022'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-006', slug: 'chain-of-thought', status: 'established',
    claim: 'Prompting a model to produce intermediate reasoning steps changes its measured performance on multi-step problems.',
    explanation: 'Chain-of-thought prompting demonstrated that the inference procedure, not only the weights, determines measured performance.',
    limitations: 'A produced reasoning trace is not evidence of the process that generated the answer. The source measures outputs, not internal reasoning.',
    conceptIds: ['inference-time-compute', 'post-training'], sourceIds: ['wei2022'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-007', slug: 'test-time-compute-tradeoff', status: 'active',
    claim: 'Allocating additional computation at inference time can, in studied settings, improve results more than spending the equivalent compute on additional parameters.',
    explanation: 'This trade-off is the basis of reasoning-style systems and is reported with verifier-based and search-based methods.',
    limitations: 'Demonstrated within specific task families and compute budgets. It is not established as a general substitution, and the studied regimes do not license extrapolation.',
    conceptIds: ['inference-time-compute', 'scaling-laws'], sourceIds: ['snell2024', 'cobbe2021'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-008', slug: 'rag-external-knowledge', status: 'established',
    claim: 'Retrieval-augmented generation conditions outputs on documents retrieved at inference time rather than on parametric memory alone.',
    explanation: 'The originating formulation combined a retriever with a generator for knowledge-intensive tasks.',
    limitations: 'Retrieval changes the source of knowledge, not the reliability of reasoning over it. It does not eliminate fabrication.',
    conceptIds: ['retrieval-augmented-generation', 'tool-use'], sourceIds: ['lewis2020'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-009', slug: 'tool-invocation', status: 'established',
    claim: 'Language models can be trained or prompted to invoke external tools and incorporate returned results.',
    explanation: 'Both learned tool invocation and interleaved reason-act prompting are documented mechanisms.',
    limitations: 'Tool access is a property of the deployed system, not the model. Comparisons that vary tool access are not model comparisons.',
    conceptIds: ['tool-use', 'agent-loop'], sourceIds: ['schick2023', 'yao2022'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-010', slug: 'scaffolding-vs-model', status: 'established',
    claim: 'The design of the agent-computer interface materially changes measured coding-agent performance holding the underlying model fixed.',
    explanation: 'This is the explicit finding of the SWE-agent work: interface affordances, not only model quality, determine outcomes on repository tasks.',
    limitations: 'It follows that an agentic benchmark score measures a model-plus-scaffold system. Attributing such a score to the model alone is unsupported, and this map never does so.',
    conceptIds: ['coding-agents', 'agent-loop', 'evaluation'], sourceIds: ['yang2024', 'jimenez2023'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-011', slug: 'swebench-construct', status: 'established',
    claim: 'SWE-bench measures whether a system produces a patch that passes a repository’s existing test suite for a real issue.',
    explanation: 'That is the benchmark definition given by its authors.',
    limitations: 'Passing tests is not correct engineering. The benchmark does not measure design quality, maintainability, review, or deployment safety, and its authors do not claim it does.',
    conceptIds: ['coding-agents', 'evaluation', 'construct-validity'], sourceIds: ['jimenez2023'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-012', slug: 'mcq-benchmark-construct', status: 'established',
    claim: 'MMLU and GPQA are multiple-choice benchmarks over defined subject distributions, with human baselines reported by their authors.',
    explanation: 'Both are defined by their originating papers, and GPQA reports expert baselines with and without web access.',
    limitations: 'Multiple-choice accuracy over a fixed distribution is not general knowledge or reasoning. Specific baseline percentages are deliberately not restated here; consult the sources.',
    conceptIds: ['construct-validity', 'evaluation'], sourceIds: ['hendrycks2020', 'rein2023', 'wang2024'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-013', slug: 'benchmark-revision-motivated-by-saturation', status: 'established',
    claim: 'Benchmarks are revised by their owners in response to saturation and robustness problems, producing successor versions that are not directly comparable to the originals.',
    explanation: 'MMLU-Pro was introduced as a more robust successor to MMLU for precisely these reasons.',
    limitations: 'A score change across a benchmark revision is a measurement change, not necessarily a capability change. Trends must not be spliced across versions.',
    conceptIds: ['evaluation', 'construct-validity', 'benchmark-contamination'], sourceIds: ['wang2024', 'bowman2021'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-014', slug: 'contamination-measured', status: 'active',
    claim: 'Contamination of evaluation data into training corpora is a measured problem that must be assessed per benchmark rather than assumed absent.',
    explanation: 'Multiple studies investigate contamination across widely used benchmarks and argue for per-benchmark measurement.',
    limitations: 'The extent of contamination for any specific model is generally not knowable from outside, because training corpora are not disclosed.',
    conceptIds: ['benchmark-contamination', 'pre-training', 'evaluation'], sourceIds: ['sainz2023', 'deng2023'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-015', slug: 'construct-validity-critique', status: 'active',
    claim: 'The use of general-purpose benchmarks as measures of general capability is contested in the literature on construct-validity grounds.',
    explanation: 'This critique argues that benchmarks index performance on a constructed task distribution and cannot underwrite claims about general ability, and that generalization must be measured differently from skill.',
    limitations: 'This is a methodological argument, not a demonstration that any specific score is wrong. Both critics and benchmark authors are represented in the source set.',
    conceptIds: ['construct-validity', 'evaluation'], sourceIds: ['raji2021', 'bowman2021', 'chollet2019'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-016', slug: 'holistic-evaluation', status: 'established',
    claim: 'Multi-metric evaluation across scenarios has been proposed and implemented as an alternative to single headline scores.',
    explanation: 'Holistic evaluation frameworks measure many metrics across many scenarios rather than reporting one number.',
    limitations: 'Reporting more metrics does not resolve construct validity. It makes the trade-offs visible; it does not make any single metric mean more.',
    conceptIds: ['evaluation', 'construct-validity'], sourceIds: ['liang2022', 'srivastava2022'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-017', slug: 'served-model-drift', status: 'active',
    claim: 'The behaviour of a served model accessed through an API can change over time on fixed prompts.',
    explanation: 'Longitudinal measurement of a hosted service found behaviour changes across dates on identical inputs.',
    limitations: 'A measurement of a hosted endpoint is dated. Reproducibility claims about API-based evaluations require the date and, where available, the model version.',
    conceptIds: ['evaluation', 'local-inference'], sourceIds: ['chen2023drift'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-018', slug: 'time-horizon-metric', status: 'established',
    claim: 'METR defines a 50%-task-completion time horizon: the time humans typically take on tasks a model completes with 50% success. Its published measurement reports a horizon of around 50 minutes for one frontier model of that period, and a doubling of the horizon roughly every seven months since 2019, with a possible acceleration in 2024.',
    explanation: 'These figures are taken from the abstract of the METR paper, read during this pass. They are the only time-horizon numbers in this map, and they replace the draft report’s unverifiable figures.',
    limitations: 'The authors state limitations including external validity, and their five-year statement is explicitly conditional on the trend generalizing. The measurement is over a specific task suite, not real-world software work. Figures later than this paper are not carried here: the draft report’s "~2 hours as of late 2025" was not independently verified during this pass and is excluded.',
    conceptIds: ['long-horizon-task-completion', 'reliability-compounding-error', 'ai-forecasting'], sourceIds: ['kwa2025'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-019', slug: 'reliability-drives-horizon', status: 'active',
    claim: 'Increases in measured long-horizon performance are attributed in part to improved reliability and error recovery rather than to reasoning improvements alone.',
    explanation: 'The METR paper attributes the horizon increase primarily to greater reliability and ability to adapt to mistakes, combined with logical reasoning and tool use.',
    limitations: 'This is an attribution offered by one research group over one task suite. The decomposition between reliability, reasoning, and scaffolding is not independently established.',
    conceptIds: ['reliability-compounding-error', 'long-horizon-task-completion', 'agent-loop'], sourceIds: ['kwa2025'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-020', slug: 'provider-reports-are-self-reports', status: 'established',
    claim: 'Provider technical reports and model cards are self-reports by the organization that built the system, and may withhold architecture, data, and training details.',
    explanation: 'The GPT-4 technical report states that it withholds such details; model cards are a reporting convention, not an audit mechanism.',
    limitations: 'Self-report status is not an accusation of inaccuracy. It means the figures were not produced by an independent party and cannot be treated as independent measurements.',
    conceptIds: ['governance-accountability', 'evaluation'], sourceIds: ['openai2023gpt4', 'mitchell2019', 'grattafiori2024'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-021', slug: 'expert-forecasts-unstable', status: 'active',
    claim: 'Aggregated expert forecasts of AI capability timelines have shifted substantially between survey rounds.',
    explanation: 'Large surveys of published AI researchers record materially different aggregate timelines across successive rounds.',
    limitations: 'Instability in aggregate forecasts is evidence about forecasters, not about capability. Specific dates and shift magnitudes are not restated here; consult the source.',
    conceptIds: ['ai-forecasting', 'governance-accountability'], sourceIds: ['grace2024'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-022', slug: 'metr-confabulation-exhibit', status: 'established',
    claim: 'The figure "METR reports a 50%-task-completion horizon of 14.5 hours" is a fabrication generated by an AI synthesis instrument and presented with a fake source tag. It is not a METR finding.',
    explanation: 'The draft report records in its own self-audit that this figure was produced by extrapolating a real trend and wrapping it in a [SOURCED] tag. It is retained here as a documented failure-mode exhibit because the mechanism — fabricating a plausible number to fill a post-cutoff gap and giving it citation form — is the specific risk this source map exists to prevent.',
    limitations: 'This claim is about the draft report, not about METR or about time horizons. It must never be cited as though METR published, retracted, or commented on any such figure. The verified time-horizon figures are in si-018.',
    conceptIds: ['ai-forecasting', 'long-horizon-task-completion', 'governance-accountability'], sourceIds: ['draftReport2026', 'kwa2025'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-023', slug: 'benchmark-vs-capability-separation', status: 'established',
    claim: 'A benchmark score is a measurement of a system on a task distribution under a scaffolding configuration at a date. It is not a measurement of general capability.',
    explanation: 'This follows from the benchmark definitions, the scaffolding result, the contamination literature, and the drift measurement taken together. It is the organizing rule of this map.',
    limitations: 'This is a methodological position, not a finding that any score is incorrect. It constrains interpretation, not measurement.',
    conceptIds: ['construct-validity', 'evaluation', 'coding-agents', 'benchmark-contamination'],
    sourceIds: ['jimenez2023', 'yang2024', 'sainz2023', 'chen2023drift', 'raji2021'], reviewDate: SI_REVIEW_DATE,
  },
  {
    id: 'si-024', slug: 'scenario-continued-horizon-growth', status: 'forecast',
    claim: 'Scenario, not prediction: if the measured doubling of the 50%-task-completion time horizon continued at its published historical rate, horizons would grow by roughly an order of magnitude over several years.',
    explanation: 'This is a mechanical restatement of the published doubling behaviour under the assumption that it continues. It is included to make the shape of the extrapolation inspectable, and deliberately carries no dates and no numeric interval.',
    limitations: 'Not a prediction, not a probability statement, and not evidence. No confidence interval is attached because none was computed; the draft report’s intervals were labelled "90% confidence intervals" without a stated method and are excluded from this map.',
    conceptIds: ['ai-forecasting', 'long-horizon-task-completion'], sourceIds: ['kwa2025'], reviewDate: SI_REVIEW_DATE,
    forecast: {
      assumptions: [
        'The published historical doubling rate continues without regime change.',
        'The task suite remains a valid proxy for the tasks of interest as horizons lengthen.',
        'Scaffolding, tool access, and evaluation methodology remain comparable over the projection period.',
        'No measurement revision resets the baseline, as benchmark revisions have repeatedly done elsewhere in this map.',
      ],
      failureModes: [
        'Trend extrapolation from a short series is the specific error this map documents; the underlying series spans a limited period and one research group.',
        'Compounding per-step error may bound achievable horizons independently of model improvement.',
        'A methodology revision could move the metric without any capability change, as documented for benchmark revisions generally.',
        'External validity may fail: horizon on a curated suite need not transfer to real work.',
        'Saturation of the task suite would make further growth unmeasurable rather than absent.',
      ],
    },
  },
  {
    id: 'si-025', slug: 'scenario-evaluation-breakdown', status: 'forecast',
    claim: 'Scenario, not prediction: if contamination and saturation continue to outpace benchmark construction, public benchmarks could cease to discriminate between frontier systems, leaving provider self-reports as the dominant public evidence.',
    explanation: 'This scenario is constructed from documented mechanisms — contamination, saturation-driven revision, and the self-report status of provider evaluations — rather than from any trend fit.',
    limitations: 'Not a prediction and not dated. It describes a possible failure of the measurement ecosystem, not a capability outcome, and no probability is asserted.',
    conceptIds: ['benchmark-contamination', 'evaluation', 'governance-accountability', 'construct-validity'],
    sourceIds: ['sainz2023', 'deng2023', 'wang2024', 'openai2023gpt4', 'mitchell2019'], reviewDate: SI_REVIEW_DATE,
    forecast: {
      assumptions: [
        'Contamination pressure grows with corpus scale and benchmark age.',
        'Benchmark owners continue revising in response to saturation.',
        'Independent evaluation capacity does not scale proportionally with model release cadence.',
      ],
      failureModes: [
        'Held-out, owner-run, or dynamically generated evaluations could preserve discrimination and falsify the scenario.',
        'The scenario assumes contamination is unmitigated; contamination-detection methods exist and are improving.',
        'It presumes public benchmarks remain the reference; procurement or regulatory evaluation could displace them.',
      ],
    },
  },
];

/**
 * Assertions in the draft report that are deliberately NOT carried forward,
 * with the reason. Published so the exclusions are auditable rather than silent.
 */
export const SI_EXCLUDED_REPORT_ASSERTIONS: { assertion: string; reason: string }[] = [
  { assertion: 'METR reported a 50%-task-completion horizon of 14.5 hours.', reason: 'Fabricated by the drafting instrument, per the report’s own self-audit. Retained only as failure-mode exhibit si-022, never as a finding.' },
  { assertion: 'METR measured ~2 hours (GPT-5 agent ≈ 2 hr 17 min) as of late 2025.', reason: 'The report’s replacement figure for its own fabrication. Not independently verified during this pass; the verified paper reports a different figure for an earlier model. Excluded.' },
  { assertion: 'METR Time Horizon 1.1 estimates a 131-day post-2023 doubling versus 165 days.', reason: 'URL resolves but contents were not extracted in this pass. No figure carried.' },
  { assertion: 'Mid-2026 GPQA-Diamond cluster at 94.2%–94.6%.', reason: 'Sourced in the report to community aggregators (intuitionlabs, smartchunks) and provider self-reports. No primary measurement. Excluded.' },
  { assertion: 'FrontierMath Tier-4 scores of ~38%, ~73%, ~76%, and the 42% problem-correction figure.', reason: 'Sourced to Quantum Zeitgeist, Digg, and an Epoch page whose contents were not extracted. No verified primary. Excluded.' },
  { assertion: 'MMLU contamination attributed to Morph Labs, 2025.', reason: 'Non-resolvable secondary attribution. The contamination point is retained in si-014 with peer-reviewed primaries instead.' },
  { assertion: 'All specific benchmark score trajectories (MMLU, GPQA, SWE-bench, ARC-AGI percentages by date).', reason: 'Individual scores were not independently resolved to primary sources during this pass. The map makes structural claims about what benchmarks measure instead of reproducing unverified leaderboards.' },
  { assertion: 'ARC-AGI-2 and ARC-AGI-3 scores and launch dates; MindsAI and Kaggle results.', reason: 'Sourced to leaderboards and community reports not resolved here. ARC concepts are grounded in Chollet 2019 instead.' },
  { assertion: 'Training-compute FLOP estimates for specific models and the ~4.5x/year growth rate.', reason: 'Attributed to estimates the report itself marks unverified for mid-2026. No primary resolved. Excluded.' },
  { assertion: 'API price-per-token trajectory and ~10x/year cost decline.', reason: 'Provider pricing pages not resolved as primaries; the report marks the mid-2026 figure unverified. Excluded.' },
  { assertion: 'The 2030 projection table and its "90% confidence intervals".', reason: 'No stated method, no calibration, and baselines drawn from excluded figures. Replaced by si-024 and si-025, which are conditional scenarios with assumptions and failure modes and carry no intervals.' },
  { assertion: 'Steinhardt 2021 forecasting-tournament figures and Metaculus community medians.', reason: 'Not resolved to primary sources during this pass. Forecast instability is retained in si-021 via the peer-reviewed expert survey instead.' },
  { assertion: 'Claims that Suno/Udio reached near-human pop music generation ("Industry tracking, 2024").', reason: 'No source. Excluded entirely.' },
];

export function getSiSource(id: string): SiSource | undefined { return SI_SOURCES[id]; }
export function getSiConcept(id: string): SiConcept | undefined { return SI_CONCEPTS.find((c) => c.id === id); }
export function getSiClaim(idOrSlug: string): SiClaim | undefined {
  return SI_CLAIMS.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}
export function getSiStatus(id: SiStatus): SiStatusDescriptor {
  return SI_STATUSES.find((s) => s.id === id) ?? SI_STATUSES[1];
}

/** JSON-ready record, mirroring the de Sitter atlas endpoint conventions. */
export function buildSyntheticIntelligenceRecord(siteUrl: string) {
  return {
    title: 'Synthetic Intelligence Source Map',
    description:
      'Verified source layer for a future Synthetic Intelligence Atlas: LLM mechanisms and scaling, post-training and inference-time reasoning, tool use and agents, benchmarks and construct validity, evaluation and forecasting limits. Quantum computing is out of scope by design.',
    version: SI_ATLAS_VERSION,
    status: 'Source layer only. No public atlas is built on this yet.',
    evidenceCutoff: SI_EVIDENCE_CUTOFF,
    sourcesResolvedOn: SI_SOURCES_RESOLVED_ON,
    reviewDate: SI_REVIEW_DATE,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    methodologyDocument: `${siteUrl}/papers/synthetic_intelligence_source_map`,
    statusVocabulary: SI_STATUSES,
    sourceTypeVocabulary: SI_SOURCE_TYPES,
    counts: {
      sources: Object.keys(SI_SOURCES).length,
      contentVerifiedSources: Object.values(SI_SOURCES).filter((s) => s.verification === 'content-verified').length,
      urlResolvedSources: Object.values(SI_SOURCES).filter((s) => s.verification === 'url-resolved').length,
      concepts: SI_CONCEPTS.length,
      claims: SI_CLAIMS.length,
      forecastClaims: SI_CLAIMS.filter((c) => c.status === 'forecast').length,
      excludedReportAssertions: SI_EXCLUDED_REPORT_ASSERTIONS.length,
    },
    sources: Object.values(SI_SOURCES).map((s) => ({
      id: s.id, title: s.title, authors: s.authors ?? null, year: s.year,
      identifier: s.identifier ?? null, doi: s.doi ?? null, url: s.url,
      sourceType: s.sourceType, verification: s.verification, verifiedOn: s.verifiedOn,
      contentNotExtracted: s.contentNotExtracted ?? false, whyHere: s.whyHere,
      citedByClaims: SI_CLAIMS.filter((c) => c.sourceIds.includes(s.id)).map((c) => c.id),
    })),
    concepts: SI_CONCEPTS.map((c) => ({ ...c, notEstablished: c.notEstablished ?? null })),
    claims: SI_CLAIMS.map((c) => ({
      id: c.id, slug: c.slug, claim: c.claim, status: c.status,
      statusLabel: getSiStatus(c.status).label, explanation: c.explanation, limitations: c.limitations,
      conceptIds: c.conceptIds, sourceIds: c.sourceIds, reviewDate: c.reviewDate,
      forecast: c.forecast ?? null, atlasVersion: SI_ATLAS_VERSION,
    })),
    excludedReportAssertions: SI_EXCLUDED_REPORT_ASSERTIONS,
    provenanceNotes: [
      'The draft report is not evidence for any technical claim. It is retained only as a methodological artifact documenting a citation fabrication.',
      'Every content-verified source was resolved to its canonical URL and its title read during this pass. Sources marked url-resolved returned HTTP 200 but their contents were not extracted, and no claim cites them.',
      'Provider technical reports and model cards are recorded as self-reports, never as independent measurements.',
      'Benchmark scores are not reproduced. The map makes structural claims about what each benchmark measures and what it does not.',
      'Forecast-status claims are conditional scenarios with stated assumptions and failure modes. They are never predictions and carry no confidence intervals.',
      `Evidence cutoff is ${SI_EVIDENCE_CUTOFF}. No claim asserts a fact after that date.`,
      'Quantum computing is deliberately excluded and belongs in a separate atlas with its own primary literature.',
    ],
  };
}
