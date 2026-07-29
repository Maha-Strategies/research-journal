// Source layer for the Tensor Network Optimization Atlas.
// Evidence cutoff: 2026-07-29.
//
// SCOPE: matrix product states (MPS), MERA, and the use of tensor-network
// contraction as a *classical* method for problems that are also posed to
// quantum hardware — QUBO/Ising optimization and quantum-circuit simulation.
//
// ---------------------------------------------------------------------------
// WHAT "VERIFIED" MEANS IN THIS MODULE — read before adding a source.
// ---------------------------------------------------------------------------
// Every identifier below was resolved on 2026-07-29 against an authoritative
// bibliographic record — the arXiv API (`export.arxiv.org/api/query?id_list=`)
// for arXiv IDs, and the Crossref API for the one DOI-only record — and the
// title, author list, and year stored here are the ones those records returned.
//
// That is `identifier-verified`: the identifier provably denotes the paper this
// record names. It is NOT a re-reading of each full text. The claims below rest
// on results that are standard and widely restated in the tensor-network
// literature, but a reviewer re-checking this atlas should treat the mapping
// from a claim to a specific theorem in a specific paper as the thing to audit.
//
// Do not add a source by writing an arXiv number or DOI from memory. Identifier
// strings are exactly the kind of value that is easy to recall approximately and
// impossible to spot as wrong once published — a transposed digit still looks
// like a citation. Resolve it, then paste what the record returned.
//
// ---------------------------------------------------------------------------
// WHAT THIS ATLAS DELIBERATELY DOES NOT CLAIM
// ---------------------------------------------------------------------------
// The commercial framing around "quantum-inspired" optimization asserts that
// classical tensor-network contraction on GPUs beats NISQ hardware on industrial
// workloads — portfolio construction, supply-chain logistics — as a general
// fact. No such general result is recorded here, because none of the sources
// below establishes one, and this atlas does not publish throughput figures it
// cannot attribute.
//
// The `BenchmarkRecord` type is built so that omission is structural rather than
// a matter of editorial restraint: it has no free-text performance field, and
// every record requires a `sourceId` plus the specific task and classical
// baseline the comparison was run against. A number with no paper behind it
// cannot be expressed in this schema. See tn-014, which states the absence of a
// general advantage result as its own claim rather than leaving it implied.

export const TN_ATLAS_PATH = '/atlas/tensor-networks';
export const TN_REVIEW_DATE = '2026-07-29';
export const TN_EVIDENCE_CUTOFF = '2026-07-29';

// ---------------------------------------------------------------------------
// Evidence labels
// ---------------------------------------------------------------------------
// Three labels rather than the Quantum Computing Atlas's two. This atlas covers
// the AdS/CFT–MERA correspondence, which is neither an established result nor an
// open engineering question: it is a proposed structural analogy with published
// objections. Collapsing it into `active-research` would misfile a conjecture as
// ordinary unfinished work.

export type TnStatus = 'established' | 'active-research' | 'conjecture';

export const TN_STATUSES = [
  {
    id: 'established' as const,
    label: 'Established result',
    definition:
      'A published theorem, standard construction, or reproduced numerical result. The label does not imply the method is practical at every system size, nor that its cost is acceptable for a given application.',
  },
  {
    id: 'active-research' as const,
    label: 'Active research',
    definition:
      'An open scientific or engineering question with no field-wide resolution. Evidence exists on more than one side, or the comparison needed to settle it has not been run.',
  },
  {
    id: 'conjecture' as const,
    label: 'Conjecture',
    definition:
      'A proposed correspondence or interpretation that is argued structurally rather than derived, and which has published objections or unmet consistency conditions. It is recorded because it drives research, not because it is settled.',
  },
];

export const getTnStatus = (id: TnStatus) => TN_STATUSES.find((status) => status.id === id)!;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export type TnSource = {
  id: string;
  title: string;
  authors: string;
  year: number;
  identifier: string;
  url: string;
  sourceType: 'primary-paper' | 'review-article';
  /**
   * See the module header. `identifier-verified` means the identifier was
   * resolved against arXiv or Crossref on `verifiedOn` and the bibliographic
   * fields here are what that record returned.
   */
  verification: 'identifier-verified';
  verifiedOn: string;
  whyHere: string;
};

export const TN_SOURCES: TnSource[] = [
  {
    id: 'white-1992',
    title: 'Density matrix formulation for quantum renormalization groups',
    authors: 'Steven R. White',
    year: 1992,
    identifier: 'DOI:10.1103/PhysRevLett.69.2863',
    url: 'https://doi.org/10.1103/PhysRevLett.69.2863',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Primary source for DMRG, the variational method later understood as optimization over matrix product states.',
  },
  {
    id: 'vidal-2003',
    title: 'Efficient classical simulation of slightly entangled quantum computations',
    authors: 'Guifré Vidal',
    year: 2003,
    identifier: 'arXiv:quant-ph/0301063',
    url: 'https://arxiv.org/abs/quant-ph/0301063',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Ties classical simulation cost to the entanglement carried across a cut, which is the quantity a bond dimension budgets.',
  },
  {
    id: 'verstraete-cirac-2004',
    title: 'Renormalization algorithms for Quantum-Many Body Systems in two and higher dimensions',
    authors: 'F. Verstraete, J. I. Cirac',
    year: 2004,
    identifier: 'arXiv:cond-mat/0407066',
    url: 'https://arxiv.org/abs/cond-mat/0407066',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Primary source for the projected entangled pair state (PEPS) generalization of MPS beyond one dimension.',
  },
  {
    id: 'vidal-2005',
    title: 'Entanglement renormalization',
    authors: 'Guifré Vidal',
    year: 2005,
    identifier: 'arXiv:cond-mat/0512165',
    url: 'https://arxiv.org/abs/cond-mat/0512165',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Introduces entanglement renormalization and the disentangler that distinguishes MERA from a plain tree network.',
  },
  {
    id: 'vidal-2006',
    title: 'A class of quantum many-body states that can be efficiently simulated',
    authors: 'G. Vidal',
    year: 2006,
    identifier: 'arXiv:quant-ph/0610099',
    url: 'https://arxiv.org/abs/quant-ph/0610099',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Primary source for the MERA ansatz and its efficient contraction, including the scale-invariant construction.',
  },
  {
    id: 'schuch-2006',
    title: 'The computational complexity of PEPS',
    authors: 'Norbert Schuch, Michael M. Wolf, Frank Verstraete, J. Ignacio Cirac',
    year: 2006,
    identifier: 'arXiv:quant-ph/0611050',
    url: 'https://arxiv.org/abs/quant-ph/0611050',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Establishes hardness results for contracting PEPS — the reason higher-dimensional tensor networks are approximated, not contracted exactly.',
  },
  {
    id: 'markov-shi-2005',
    title: 'Simulating quantum computation by contracting tensor networks',
    authors: 'Igor L. Markov, Yaoyun Shi',
    year: 2005,
    identifier: 'arXiv:quant-ph/0511069',
    url: 'https://arxiv.org/abs/quant-ph/0511069',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Connects the cost of contracting a tensor network to the treewidth of its graph, which is the structural quantity behind contraction-order search.',
  },
  {
    id: 'hastings-2007',
    title: 'An Area Law for One Dimensional Quantum Systems',
    authors: 'M. B. Hastings',
    year: 2007,
    identifier: 'arXiv:0705.2024',
    url: 'https://arxiv.org/abs/0705.2024',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Proves the one-dimensional area law that explains why a bounded bond dimension suffices for gapped 1D ground states — and, by implication, when it does not.',
  },
  {
    id: 'verstraete-2008',
    title: 'Matrix Product States, Projected Entangled Pair States, and variational renormalization group methods for quantum spin systems',
    authors: 'F. Verstraete, J. I. Cirac, V. Murg',
    year: 2008,
    identifier: 'arXiv:0907.2796',
    url: 'https://arxiv.org/abs/0907.2796',
    sourceType: 'review-article',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Review tying MPS, PEPS, and variational renormalization group methods into one framework.',
  },
  {
    id: 'swingle-2009',
    title: 'Entanglement Renormalization and Holography',
    authors: 'Brian Swingle',
    year: 2009,
    identifier: 'arXiv:0905.1317',
    url: 'https://arxiv.org/abs/0905.1317',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'The paper that proposed reading the MERA network as a discretized holographic geometry. It is the origin of the AdS/MERA conjecture, not a proof of it.',
  },
  {
    id: 'schollwoeck-2010',
    title: 'The density-matrix renormalization group in the age of matrix product states',
    authors: 'Ulrich Schollwöck',
    year: 2010,
    identifier: 'arXiv:1008.3477',
    url: 'https://arxiv.org/abs/1008.3477',
    sourceType: 'review-article',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Standard reference for MPS canonical forms, SVD truncation, and the reformulation of DMRG in tensor-network language.',
  },
  {
    id: 'orus-2013',
    title: 'A Practical Introduction to Tensor Networks: Matrix Product States and Projected Entangled Pair States',
    authors: 'Román Orús',
    year: 2013,
    identifier: 'arXiv:1306.2164',
    url: 'https://arxiv.org/abs/1306.2164',
    sourceType: 'review-article',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Review covering tensor-network structure, entanglement scaling, and contraction strategy; the general reference for this atlas.',
  },
  {
    id: 'lucas-2013',
    title: 'Ising formulations of many NP problems',
    authors: 'Andrew Lucas',
    year: 2013,
    identifier: 'arXiv:1302.5843',
    url: 'https://arxiv.org/abs/1302.5843',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Catalogues explicit Ising encodings for NP-hard problems — the step that turns a combinatorial problem into a spin model a tensor network can act on.',
  },
  {
    id: 'farhi-2014',
    title: 'A Quantum Approximate Optimization Algorithm',
    authors: 'Edward Farhi, Jeffrey Goldstone, Sam Gutmann',
    year: 2014,
    identifier: 'arXiv:1411.4028',
    url: 'https://arxiv.org/abs/1411.4028',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Primary source for QAOA, the quantum method against which quantum-inspired classical optimizers are usually compared.',
  },
  {
    id: 'bao-2015',
    title: 'Consistency Conditions for an AdS/MERA Correspondence',
    authors: 'Ning Bao, ChunJun Cao, Sean M. Carroll, Aidan Chatwin-Davies, Nicholas Hunter-Jones, Jason Pollack, Grant N. Remmen',
    year: 2015,
    identifier: 'arXiv:1504.06632',
    url: 'https://arxiv.org/abs/1504.06632',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'States conditions an AdS/MERA correspondence would have to satisfy and argues they are in tension. It is why tn-005 is labelled a conjecture rather than a result.',
  },
  {
    id: 'mugel-2020',
    title: 'Dynamic Portfolio Optimization with Real Datasets Using Quantum Processors and Quantum-Inspired Tensor Networks',
    authors: 'Samuel Mugel, Carlos Kuchkovsky, Escolástico Sánchez, Samuel Fernández-Lorenzo, Jorge Luis-Hita, Enrique Lizaso, Román Orús',
    year: 2020,
    identifier: 'arXiv:2007.00017',
    url: 'https://arxiv.org/abs/2007.00017',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'A reported application of tensor-network optimization to portfolio construction alongside quantum processors — the closest thing in this source set to the commercial framing, and narrower than that framing suggests.',
  },
  {
    id: 'pan-2021',
    title: 'Solving the sampling problem of the Sycamore quantum circuits',
    authors: 'Feng Pan, Keyang Chen, Pan Zhang',
    year: 2021,
    identifier: 'arXiv:2111.03011',
    url: 'https://arxiv.org/abs/2111.03011',
    sourceType: 'primary-paper',
    verification: 'identifier-verified',
    verifiedOn: TN_REVIEW_DATE,
    whyHere: 'Classical tensor-network contraction applied to the Sycamore sampling task. The strongest evidence here that a specific claimed quantum advantage narrowed — for one benchmark task, not for an application.',
  },
];

// ---------------------------------------------------------------------------
// Structural specifications
// ---------------------------------------------------------------------------
// These describe the *shape and cost model* of the ansätze this atlas covers.
// They carry no performance numbers: cost is expressed as an asymptotic scaling
// string tied to the parameters named in the same record, so it stays checkable
// against the cited source instead of standing in for a measurement.

/**
 * A matrix product state specification.
 *
 * `bondDimension` (D) is the single knob that sets both the expressive ceiling
 * and the cost. It bounds the entanglement entropy the state can carry across
 * any cut at log(D), which is why an MPS is efficient exactly when the target
 * state's entanglement is bounded — and why raising D is not a free accuracy
 * dial but an exponential retreat toward the full Hilbert space.
 */
export type MpsSpec = {
  id: string;
  label: string;
  /** Bond dimension D: the rank retained on each virtual index. */
  bondDimension: { symbol: 'D'; role: string; entanglementCeiling: string };
  /**
   * How the state is truncated. Discarded weight — the tail of the Schmidt
   * spectrum thrown away at each SVD — is the honest error measure; it is
   * reported, not assumed to be negligible.
   */
  truncation: { criterion: string; errorMeasure: string; note: string };
  canonicalForm: string;
  /** Asymptotic cost in terms of D and the site count N. No wall-clock times. */
  costScaling: string;
  appliesWhen: string;
  breaksWhen: string;
  sources: string[];
};

export const TN_MPS_SPECS: MpsSpec[] = [
  {
    id: 'mps-ground-state',
    label: 'MPS ground-state search (DMRG)',
    bondDimension: {
      symbol: 'D',
      role: 'Rank retained on each virtual bond; sets the variational manifold the sweep optimizes over.',
      entanglementCeiling: 'An MPS of bond dimension D carries at most log(D) entanglement entropy across any single cut.',
    },
    truncation: {
      criterion: 'Singular value decomposition at each bond, keeping the D largest singular values.',
      errorMeasure: 'Discarded weight — the summed squares of the singular values thrown away.',
      note: 'Discarded weight is the quantity to report. A converged sweep with a large discarded weight is converged to the wrong state, and the sweep itself will not say so.',
    },
    canonicalForm: 'Left/right canonical gauge fixed by successive QR or SVD, so the effective problem at each site is well conditioned.',
    costScaling: 'Polynomial in D and linear in site count N for a fixed sweep count; the D-dependence dominates.',
    appliesWhen: 'Gapped one-dimensional local Hamiltonians, where the area law bounds ground-state entanglement independently of system size.',
    breaksWhen: 'Critical chains (entanglement grows logarithmically with size), two-dimensional systems mapped to a chain, and real-time evolution past short times — all of which force D upward.',
    sources: ['white-1992', 'schollwoeck-2010', 'hastings-2007', 'orus-2013'],
  },
  {
    id: 'mps-time-evolution',
    label: 'MPS time evolution',
    bondDimension: {
      symbol: 'D',
      role: 'Same rank budget, but now re-truncated after every applied gate rather than optimized once.',
      entanglementCeiling: 'Unchanged at log(D) per cut — the ceiling is a property of the ansatz, not of what it is used for.',
    },
    truncation: {
      criterion: 'SVD truncation after each two-site gate application.',
      errorMeasure: 'Accumulated discarded weight across the gate sequence.',
      note: 'Errors compound over time steps; a per-step truncation that looks harmless can dominate the result by the end of the evolution.',
    },
    canonicalForm: 'Canonical form restored between gate applications so each truncation is taken with respect to the correct reduced state.',
    costScaling: 'Polynomial in D per gate, multiplied by the number of gates.',
    appliesWhen: 'Short-time dynamics, or evolution that does not rapidly generate entanglement across cuts.',
    breaksWhen: 'Generic quench dynamics, where entanglement grows roughly linearly in time and the required D grows exponentially with it. This is the entanglement barrier, and it is a property of the physics, not of the implementation.',
    sources: ['vidal-2003', 'schollwoeck-2010'],
  },
];

/**
 * A MERA specification.
 *
 * MERA's distinguishing element is the disentangler: a unitary applied *before*
 * coarse-graining that removes short-range entanglement the isometry would
 * otherwise have to carry upward. Without it the network is a tree, and a tree
 * cannot reproduce the entanglement scaling of a critical system.
 */
export type MeraSpec = {
  id: string;
  label: string;
  /** The two node types, kept distinct because conflating them loses the point of the ansatz. */
  nodes: { kind: 'disentangler' | 'isometry'; symbol: string; constraint: string; role: string }[];
  /** Whether one layer's tensors are reused at every scale. */
  scaleInvariant: boolean;
  layerStructure: string;
  entanglementScaling: string;
  costScaling: string;
  appliesWhen: string;
  breaksWhen: string;
  sources: string[];
};

export const TN_MERA_SPECS: MeraSpec[] = [
  {
    id: 'mera-scale-invariant',
    label: 'Scale-invariant MERA',
    nodes: [
      {
        kind: 'disentangler',
        symbol: 'u',
        constraint: 'Unitary: u†u = 1.',
        role: 'Removes short-range entanglement across the boundary between neighbouring blocks before those blocks are coarse-grained.',
      },
      {
        kind: 'isometry',
        symbol: 'w',
        constraint: 'Isometric: w†w = 1 on the retained subspace.',
        role: 'Coarse-grains a block of sites into a single effective site, mapping to a smaller Hilbert space.',
      },
    ],
    scaleInvariant: true,
    layerStructure: 'One (u, w) pair reused at every layer, giving a renormalization-group transformation with no preferred length scale.',
    entanglementScaling: 'Reproduces the logarithmic entanglement scaling characteristic of critical one-dimensional systems, which a plain tree tensor network cannot.',
    costScaling: 'Polynomial in the bond dimension; the layer count grows logarithmically in system size rather than linearly.',
    appliesWhen: 'Critical (gapless) systems where correlations are scale-free and an area law alone does not bound the entanglement.',
    breaksWhen: 'The cost prefactor in the bond dimension is severe, and the two-dimensional generalization is substantially harder than the one-dimensional case.',
    sources: ['vidal-2005', 'vidal-2006', 'orus-2013'],
  },
];

/**
 * A mapping from a combinatorial optimization problem to a tensor network.
 *
 * The two-step structure is deliberate. Step one (problem → Ising/QUBO) is a
 * change of encoding and is exact. Step two (Ising → contraction) is where the
 * approximation lives. Collapsing them into "we solve QUBO with tensor networks"
 * is what lets a hardness result get quietly skipped: the encoding being exact
 * says nothing about the contraction being tractable.
 */
export type QuboMappingSpec = {
  id: string;
  label: string;
  /** The optimization form being encoded. */
  problemForm: 'QUBO' | 'Ising';
  /** Exact algebraic relation between the two forms. */
  encoding: string;
  /** How constraints enter the objective, and what that costs. */
  penaltyHandling: string;
  /** How the spin model becomes a network of tensors. */
  tensorConstruction: string;
  /** Which quantity is actually extracted by contracting. */
  extractedQuantity: string;
  /** Where the approximation enters. Never omitted. */
  approximationEntersAt: string;
  sources: string[];
};

export const TN_QUBO_MAPPINGS: QuboMappingSpec[] = [
  {
    id: 'qubo-to-ising',
    label: 'QUBO to Ising spin model',
    problemForm: 'QUBO',
    encoding:
      'Substituting x = (1 + s) / 2 with x in {0, 1} and s in {-1, +1} converts a quadratic binary objective into an Ising energy with couplings J, local fields h, and a constant offset. The transformation is exact and invertible.',
    penaltyHandling:
      'Hard constraints are added as penalty terms weighted by a multiplier large enough that violating a constraint costs more than any feasible gain. The multiplier widens the energy scale, which worsens conditioning — a correctness-preserving step that makes the numerics harder.',
    tensorConstruction:
      'Each spin becomes an index; each coupling becomes a tensor on the edge joining its two spins. The problem graph becomes the network graph, so the problem topology is the contraction topology.',
    extractedQuantity:
      'Contracting the network evaluates a partition function or, in the zero-temperature limit, a minimum-energy configuration.',
    approximationEntersAt:
      'The contraction, not the encoding. Exact contraction is intractable for general graphs, so bond dimensions are truncated — which means the result is a variational bound or an approximation whose error is not generally certified.',
    sources: ['lucas-2013', 'markov-shi-2005'],
  },
  {
    id: 'ising-np-hard-instances',
    label: 'NP-hard problems as Ising models',
    problemForm: 'Ising',
    encoding:
      'Explicit Ising formulations exist for a catalogue of NP-hard problems including partitioning, covering, colouring, and Hamiltonian-cycle families.',
    penaltyHandling:
      'Each formulation states its own penalty structure and the multiplier scaling needed for the ground state to encode a feasible solution.',
    tensorConstruction:
      'The interaction graph of the resulting spin model determines the tensor network; a dense coupling matrix produces a dense network with high treewidth.',
    extractedQuantity: 'Ground-state configuration, or low-energy configurations sampled from the model.',
    approximationEntersAt:
      'Encoding an NP-hard problem exactly does not make it easy. The encoding is polynomial; the hardness moves into the contraction, where it is met with truncation rather than removed.',
    sources: ['lucas-2013', 'schuch-2006'],
  },
];

/**
 * A benchmark record.
 *
 * NOTE THE ABSENT FIELD. There is no `throughput`, `speedup`, or `runtime` free
 * text. A benchmark enters this atlas as: a named task, the classical method
 * used, the quantum method compared against, what the cited source reported, and
 * what the result does not extend to. `sourceId` is required and singular — a
 * benchmark with no attributable source is not representable.
 *
 * This is the schema-level answer to performance claims that circulate without
 * a paper behind them.
 */
export type BenchmarkRecord = {
  id: string;
  task: string;
  classicalMethod: string;
  comparedAgainst: string;
  /** What the cited source reported, stated without extrapolation. */
  reportedResult: string;
  /** The generalization the result does NOT license. Required. */
  doesNotEstablish: string;
  /** Exactly one source. A benchmark is only as good as the record behind it. */
  sourceId: string;
};

export const TN_BENCHMARKS: BenchmarkRecord[] = [
  {
    id: 'bench-sycamore-sampling',
    task: 'Sampling from the output distribution of the Sycamore random quantum circuits.',
    classicalMethod: 'Tensor-network contraction with an optimized contraction order, run on classical hardware.',
    comparedAgainst: 'The superconducting-processor demonstration that originally framed this task as beyond practical classical reach.',
    reportedResult:
      'The cited work reports solving the Sycamore sampling problem classically, substantially narrowing the gap the original demonstration claimed for this task.',
    doesNotEstablish:
      'It does not show classical tensor networks outperform quantum hardware in general, and it is a benchmark sampling task rather than an application workload. It also does not settle later circuits at different depths or sizes.',
    sourceId: 'pan-2021',
  },
  {
    id: 'bench-dynamic-portfolio',
    task: 'Dynamic portfolio optimization on real market datasets.',
    classicalMethod: 'Quantum-inspired tensor-network optimization.',
    comparedAgainst: 'Quantum processors applied to the same problem instances.',
    reportedResult:
      'The cited work reports applying both tensor-network methods and quantum processors to dynamic portfolio optimization with real datasets.',
    doesNotEstablish:
      'It does not establish a general throughput advantage over quantum annealers or gate-based hardware, does not extend to supply-chain logistics or molecular simulation, and does not license the claim that tensor networks are the better production method for portfolio construction. Instance sizes, cost models, and solution-quality criteria all bound what a result like this transfers to.',
    sourceId: 'mugel-2020',
  },
];

// ---------------------------------------------------------------------------
// Concepts
// ---------------------------------------------------------------------------

export type TnConcept = {
  id: string;
  label: string;
  definition: string;
  whyItMatters: string;
  notEstablished?: string;
  sources: string[];
  related: string[];
};

export const TN_CONCEPTS: TnConcept[] = [
  {
    id: 'tensor-network',
    label: 'Tensor network',
    definition: 'A representation of a high-rank tensor as a contracted network of lower-rank tensors, whose graph structure encodes which degrees of freedom are directly correlated.',
    whyItMatters: 'It replaces a state vector that grows exponentially in system size with a set of small tensors whose size is controlled by a chosen rank parameter.',
    notEstablished: 'The representation is efficient only for states whose correlation structure matches the network geometry. It is not a general-purpose compression of arbitrary quantum states.',
    sources: ['orus-2013', 'verstraete-2008'],
    related: ['bond-dimension', 'contraction-complexity'],
  },
  {
    id: 'mps',
    label: 'Matrix product state (MPS)',
    definition: 'A one-dimensional chain of tensors in which each physical site carries one tensor joined to its neighbours by virtual bonds.',
    whyItMatters: 'It is the ansatz underlying DMRG and the best-understood tensor network, with well-defined canonical forms and truncation control.',
    notEstablished: 'Efficiency is not automatic: it depends on the entanglement across cuts staying bounded, which fails for critical systems and for long-time dynamics.',
    sources: ['schollwoeck-2010', 'orus-2013', 'white-1992'],
    related: ['bond-dimension', 'dmrg', 'area-law'],
  },
  {
    id: 'bond-dimension',
    label: 'Bond dimension (D)',
    definition: 'The rank retained on each virtual index of a tensor network, bounding the entanglement the state can carry across a cut at log(D).',
    whyItMatters: 'It is the single parameter trading accuracy against cost, and the number that must accompany any tensor-network result for it to be interpretable.',
    notEstablished: 'A larger D is not a general fix. The D required to hold a fixed accuracy can grow exponentially with the entanglement of the target state.',
    sources: ['schollwoeck-2010', 'vidal-2003', 'orus-2013'],
    related: ['truncation', 'area-law', 'mps'],
  },
  {
    id: 'truncation',
    label: 'SVD truncation and discarded weight',
    definition: 'Reducing a bond to the D largest singular values, discarding the remaining tail of the Schmidt spectrum.',
    whyItMatters: 'Discarded weight is the error measure that makes a tensor-network computation auditable rather than merely convergent-looking.',
    notEstablished: 'Small discarded weight at each step does not bound the global error in general, particularly when truncations accumulate across many time steps.',
    sources: ['schollwoeck-2010', 'vidal-2003'],
    related: ['bond-dimension', 'mps'],
  },
  {
    id: 'area-law',
    label: 'Area law',
    definition: 'A scaling property in which the entanglement entropy of a region grows with the size of its boundary rather than its volume.',
    whyItMatters: 'It is the structural reason a bounded bond dimension can suffice: it is proven for gapped one-dimensional local Hamiltonians.',
    notEstablished: 'The proven 1D result does not transfer wholesale to higher dimensions or to gapless systems, and volume-law states are outside the regime where a small D helps.',
    sources: ['hastings-2007', 'orus-2013'],
    related: ['mps', 'bond-dimension', 'mera'],
  },
  {
    id: 'dmrg',
    label: 'DMRG',
    definition: 'A variational sweep algorithm that optimizes a state site by site, later understood as optimization over the MPS manifold.',
    whyItMatters: 'It is the method that made one-dimensional quantum many-body simulation routine, and the practical origin of the tensor-network program.',
    sources: ['white-1992', 'schollwoeck-2010'],
    related: ['mps', 'bond-dimension'],
  },
  {
    id: 'peps',
    label: 'PEPS',
    definition: 'A projected entangled pair state: the generalization of MPS to two and higher dimensions, with tensors arranged on a lattice.',
    whyItMatters: 'It extends the tensor-network approach past the chain geometry where MPS applies.',
    notEstablished: 'Exact contraction of PEPS is computationally hard, so higher-dimensional work relies on approximate contraction schemes whose error is not generally certified.',
    sources: ['verstraete-cirac-2004', 'schuch-2006'],
    related: ['contraction-complexity', 'tensor-network'],
  },
  {
    id: 'mera',
    label: 'MERA',
    definition: 'A multiscale entanglement renormalization ansatz: a layered network alternating disentanglers and isometries, coarse-graining a system scale by scale.',
    whyItMatters: 'It captures the logarithmic entanglement scaling of critical systems that a plain tree network cannot reach.',
    notEstablished: 'Its cost prefactor is high and its higher-dimensional generalization is substantially harder than the one-dimensional case.',
    sources: ['vidal-2005', 'vidal-2006'],
    related: ['disentangler', 'scale-invariance', 'holographic-conjecture'],
  },
  {
    id: 'disentangler',
    label: 'Disentangler',
    definition: 'A unitary applied across block boundaries before coarse-graining, removing short-range entanglement that the isometry would otherwise have to carry to the next layer.',
    whyItMatters: 'It is the element that distinguishes MERA from a tree tensor network and the reason MERA reaches critical entanglement scaling.',
    sources: ['vidal-2005', 'vidal-2006'],
    related: ['mera', 'scale-invariance'],
  },
  {
    id: 'scale-invariance',
    label: 'Scale invariance',
    definition: 'Reusing the same disentangler and isometry at every layer, giving a renormalization-group transformation with no preferred length scale.',
    whyItMatters: 'It matches the scale-free correlation structure of critical systems and makes the layer count grow logarithmically with system size.',
    sources: ['vidal-2006', 'orus-2013'],
    related: ['mera', 'holographic-conjecture'],
  },
  {
    id: 'holographic-conjecture',
    label: 'AdS/MERA correspondence (conjecture)',
    definition: 'The proposal that the layered geometry of a MERA network is a discretization of a holographic bulk spacetime, with the extra network direction playing the role of a radial bulk coordinate.',
    whyItMatters: 'It motivated a decade of work connecting tensor networks, entanglement, and quantum gravity, and gave the field a geometric vocabulary.',
    notEstablished: 'It is an analogy argued structurally, not a derivation. Published work states consistency conditions such a correspondence would need to satisfy and argues they are in tension. Nothing in the practical use of MERA or MPS as numerical methods depends on it being true.',
    sources: ['swingle-2009', 'bao-2015'],
    related: ['mera', 'scale-invariance'],
  },
  {
    id: 'qubo-ising',
    label: 'QUBO and Ising models',
    definition: 'Quadratic unconstrained binary optimization, and its equivalent spin form in which binary variables become ±1 spins with couplings and local fields.',
    whyItMatters: 'It is the shared encoding target for quantum annealers, QAOA, and tensor-network optimizers, which is what makes them comparable at all.',
    notEstablished: 'A shared encoding does not imply comparable performance, and the encoding step being exact says nothing about the resulting instance being tractable.',
    sources: ['lucas-2013'],
    related: ['penalty-term', 'quantum-inspired-optimization'],
  },
  {
    id: 'penalty-term',
    label: 'Penalty term',
    definition: 'A term added to an objective so that violating a hard constraint costs more than any feasible improvement, converting a constrained problem into an unconstrained one.',
    whyItMatters: 'It is how real constraints — budgets, capacities, exclusivity — enter a QUBO at all.',
    notEstablished: 'Penalty multipliers widen the energy scale and worsen conditioning; a formally correct encoding can be numerically much harder to solve than the problem it encodes.',
    sources: ['lucas-2013'],
    related: ['qubo-ising'],
  },
  {
    id: 'contraction-complexity',
    label: 'Contraction complexity',
    definition: 'The cost of evaluating a tensor network, governed by the contraction order chosen and by structural properties of the network graph such as its treewidth.',
    whyItMatters: 'Contraction order search, not tensor arithmetic, is often what decides whether a network is evaluable at all.',
    notEstablished: 'Exact contraction of general networks is computationally hard; hardware acceleration changes the constant factor, not the complexity class.',
    sources: ['markov-shi-2005', 'schuch-2006'],
    related: ['peps', 'tensor-network', 'quantum-inspired-optimization'],
  },
  {
    id: 'quantum-inspired-optimization',
    label: 'Quantum-inspired optimization',
    definition: 'Classical algorithms — tensor-network contraction among them — that borrow structure from quantum many-body methods and run on conventional hardware.',
    whyItMatters: 'It provides the classical baseline that any claimed quantum advantage on an optimization problem has to beat.',
    notEstablished: 'The label describes an algorithmic lineage, not a demonstrated performance class. It does not imply an advantage over either classical solvers or quantum hardware on a given workload.',
    sources: ['mugel-2020', 'orus-2013'],
    related: ['qubo-ising', 'qaoa', 'contraction-complexity'],
  },
  {
    id: 'qaoa',
    label: 'QAOA',
    definition: 'The quantum approximate optimization algorithm: a variational circuit alternating problem and mixing Hamiltonians, with classical outer-loop parameter optimization.',
    whyItMatters: 'It is the standard gate-based quantum approach to QUBO/Ising problems and the usual comparison point for quantum-inspired classical methods.',
    notEstablished: 'Whether QAOA delivers a practical advantage over strong classical baselines on real instances is unresolved.',
    sources: ['farhi-2014'],
    related: ['qubo-ising', 'quantum-inspired-optimization'],
  },
];

// ---------------------------------------------------------------------------
// Claims
// ---------------------------------------------------------------------------

export type TnClaim = {
  id: string;
  slug: string;
  status: TnStatus;
  claim: string;
  explanation: string;
  limitations: string;
  conceptIds: string[];
  sourceIds: string[];
  /** Set only on claims that reference a benchmark record. */
  benchmarkIds?: string[];
  reviewDate: string;
};

export const TN_CLAIMS: TnClaim[] = [
  {
    id: 'tn-001',
    slug: 'mps-cost-is-set-by-bond-dimension',
    status: 'established',
    claim: 'A matrix product state represents a many-body state with a cost controlled by its bond dimension, which bounds the entanglement it can carry across any cut.',
    explanation: 'The bond dimension D fixes the variational manifold. Because an MPS of bond dimension D carries at most log(D) entanglement entropy across a cut, the representation is efficient precisely when the target state\'s entanglement is bounded.',
    limitations: 'This is a statement about representational capacity, not a guarantee that any particular state of interest is reachable at a practical D.',
    conceptIds: ['mps', 'bond-dimension', 'tensor-network'],
    sourceIds: ['schollwoeck-2010', 'orus-2013'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-002',
    slug: 'area-law-explains-when-mps-works',
    status: 'established',
    claim: 'The one-dimensional area law proves that ground states of gapped one-dimensional local Hamiltonians have entanglement bounded independently of system size.',
    explanation: 'This is the structural result explaining why DMRG succeeds in one dimension: the entanglement a correct answer must carry does not grow with the chain, so a fixed bond dimension can suffice.',
    limitations: 'The proof covers gapped 1D local Hamiltonians. It does not transfer wholesale to higher dimensions or to gapless systems, and it says nothing about states reached by long-time evolution.',
    conceptIds: ['area-law', 'mps', 'bond-dimension'],
    sourceIds: ['hastings-2007'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-003',
    slug: 'dmrg-is-mps-optimization',
    status: 'established',
    claim: 'DMRG is understood as variational optimization over the manifold of matrix product states.',
    explanation: 'The density-matrix renormalization group was formulated before the tensor-network language existed; the later reformulation showed the states it produces are matrix product states and its sweeps are variational updates on them.',
    limitations: 'The reformulation is a change of description, not of results. It does not by itself extend DMRG\'s reach beyond the regimes where it already worked.',
    conceptIds: ['dmrg', 'mps'],
    sourceIds: ['white-1992', 'schollwoeck-2010'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-004',
    slug: 'truncation-error-must-be-reported',
    status: 'established',
    claim: 'Tensor-network accuracy is controlled by singular-value truncation, and the discarded weight is the quantity that makes a result interpretable.',
    explanation: 'Each bond is reduced to its D largest singular values; the discarded tail is a measurable error. A result reported without its bond dimension and discarded weight cannot be assessed.',
    limitations: 'Small per-step discarded weight does not bound global error in general. Truncations accumulate, and a sweep can converge cleanly onto a state that the truncation put out of reach.',
    conceptIds: ['truncation', 'bond-dimension'],
    sourceIds: ['schollwoeck-2010', 'vidal-2003'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-005',
    slug: 'ads-mera-is-a-conjecture-not-a-derivation',
    status: 'conjecture',
    claim: 'The reading of a MERA network as a discretized holographic geometry is a proposed correspondence, not a derived one, and published work argues its consistency conditions are in tension.',
    explanation: 'The proposal observes that the extra layer direction of a MERA behaves like a radial bulk coordinate and that entanglement entropy has a geometric reading in the network. Subsequent work set out conditions such a correspondence would have to satisfy and argued they conflict.',
    limitations: 'This atlas records the conjecture and the objection; it does not adjudicate them. Critically, no numerical use of MPS, MERA, or PEPS as an optimization method depends on the correspondence being true — the algorithms predate it and stand on their own analysis. Treating the holographic reading as a warrant for a computational claim is a category error.',
    conceptIds: ['holographic-conjecture', 'mera', 'scale-invariance'],
    sourceIds: ['swingle-2009', 'bao-2015'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-006',
    slug: 'mera-disentanglers-reach-critical-scaling',
    status: 'established',
    claim: 'MERA introduces disentanglers before coarse-graining, allowing it to reproduce the entanglement scaling of critical systems that a tree tensor network cannot.',
    explanation: 'A unitary applied across block boundaries removes short-range entanglement that would otherwise have to be carried upward through the isometries, so the network reaches logarithmic entanglement scaling.',
    limitations: 'The cost prefactor in the bond dimension is high, and the higher-dimensional generalization is substantially harder than the one-dimensional construction.',
    conceptIds: ['mera', 'disentangler', 'scale-invariance'],
    sourceIds: ['vidal-2005', 'vidal-2006'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-007',
    slug: 'qubo-and-ising-are-equivalent-encodings',
    status: 'established',
    claim: 'Quadratic unconstrained binary optimization problems map exactly onto Ising spin models, and explicit Ising formulations exist for a catalogue of NP-hard problems.',
    explanation: 'The substitution between binary variables and ±1 spins is exact and invertible, and published formulations give the couplings, fields, and penalty structures for a range of NP-hard families.',
    limitations: 'An exact encoding does not make a problem easy. Penalty multipliers widen the energy scale and worsen conditioning, and the hardness of the original problem survives the change of variables intact.',
    conceptIds: ['qubo-ising', 'penalty-term'],
    sourceIds: ['lucas-2013'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-008',
    slug: 'contraction-cost-tracks-network-structure',
    status: 'established',
    claim: 'The cost of contracting a tensor network is governed by the contraction order and by structural properties of the network graph such as its treewidth.',
    explanation: 'Quantum circuits and spin models alike can be expressed as tensor networks, and the feasibility of evaluating them depends on graph structure rather than on the arithmetic of any single contraction step.',
    limitations: 'Favourable structure is a property of the instance. Hardware acceleration improves the constant factor; it does not change the complexity class, and a dense problem graph produces a network with no good contraction order to find.',
    conceptIds: ['contraction-complexity', 'tensor-network'],
    sourceIds: ['markov-shi-2005'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-009',
    slug: 'peps-contraction-is-hard',
    status: 'established',
    claim: 'PEPS extend tensor networks beyond one dimension, but exact contraction of PEPS is computationally hard.',
    explanation: 'The lattice generalization of MPS gives the right entanglement structure for two-dimensional systems, and hardness results for contracting it are why higher-dimensional work uses approximate contraction schemes.',
    limitations: 'Approximate schemes carry errors that are not generally certified, so a two-dimensional tensor-network result requires more care in interpretation than a one-dimensional one.',
    conceptIds: ['peps', 'contraction-complexity'],
    sourceIds: ['verstraete-cirac-2004', 'schuch-2006'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-010',
    slug: 'entanglement-growth-bounds-time-evolution',
    status: 'established',
    claim: 'Tensor-network time evolution is limited by entanglement growth, which forces the bond dimension upward as the simulated time increases.',
    explanation: 'Generic dynamics generate entanglement across cuts, and holding a fixed accuracy then requires a bond dimension that grows with it. This is the entanglement barrier.',
    limitations: 'The barrier is a property of the physics being simulated, not of a given implementation, so it is not removed by better engineering. Specific non-generic dynamics can evade it.',
    conceptIds: ['bond-dimension', 'truncation', 'area-law'],
    sourceIds: ['vidal-2003', 'schollwoeck-2010'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-011',
    slug: 'classical-contraction-narrowed-a-sampling-claim',
    status: 'established',
    claim: 'Classical tensor-network contraction has been reported to solve the Sycamore random-circuit sampling problem, narrowing the advantage originally claimed for that specific task.',
    explanation: 'The result is the clearest published case of tensor-network methods closing a gap that hardware had been said to open, and it is evidence that classical baselines move.',
    limitations: 'It concerns one benchmark sampling task, not an application workload, and it does not generalize to a claim that classical tensor networks outperform quantum hardware broadly. It also does not settle circuits at other depths or sizes.',
    conceptIds: ['contraction-complexity', 'quantum-inspired-optimization'],
    sourceIds: ['pan-2021'],
    benchmarkIds: ['bench-sycamore-sampling'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-012',
    slug: 'tensor-network-portfolio-work-is-narrow',
    status: 'active-research',
    claim: 'Tensor-network methods have been applied to dynamic portfolio optimization on real datasets alongside quantum processors, but the reported work does not establish a general advantage.',
    explanation: 'The cited study applies both approaches to the same problem family, which is what makes it relevant. Its scope is a specific formulation on specific datasets.',
    limitations: 'A single application study does not transfer to supply-chain logistics or molecular simulation, and it does not license the claim that tensor networks are the better production method for portfolio construction. Instance size, cost model, and solution-quality criteria all bound what such a result means.',
    conceptIds: ['quantum-inspired-optimization', 'qubo-ising'],
    sourceIds: ['mugel-2020'],
    benchmarkIds: ['bench-dynamic-portfolio'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-013',
    slug: 'qaoa-advantage-is-unresolved',
    status: 'active-research',
    claim: 'Whether QAOA delivers a practical advantage over strong classical baselines on real optimization instances remains unresolved.',
    explanation: 'QAOA is the standard gate-based approach to QUBO and Ising problems and the usual comparison point for quantum-inspired classical methods. Settling the question requires end-to-end comparisons at matched accuracy and cost.',
    limitations: 'This records an open question. It is neither a claim that QAOA will fail nor that classical methods are permanently ahead.',
    conceptIds: ['qaoa', 'qubo-ising', 'quantum-inspired-optimization'],
    sourceIds: ['farhi-2014', 'lucas-2013'],
    reviewDate: TN_REVIEW_DATE,
  },
  {
    id: 'tn-014',
    slug: 'no-general-classical-advantage-is-recorded-here',
    status: 'active-research',
    claim: 'No source in this atlas establishes that classical tensor-network contraction generally outperforms quantum hardware on industrial optimization workloads.',
    explanation:
      'This claim exists to state an absence rather than leave it to be inferred from silence. The strongest results recorded here are a specific sampling task reproduced classically and a specific portfolio-optimization study. Neither is a throughput comparison across portfolio construction, supply-chain logistics, and molecular simulation, and this atlas publishes no performance figures it cannot attribute to a cited source.',
    limitations:
      'The absence of a general result is not evidence that classical methods are inferior, nor that they are superior. It records that the comparison the commercial framing asserts has not been established by the sources here. A future benchmark could change this claim; a vendor figure without a resolvable source could not.',
    conceptIds: ['quantum-inspired-optimization', 'contraction-complexity', 'qaoa'],
    sourceIds: ['pan-2021', 'mugel-2020', 'farhi-2014'],
    benchmarkIds: ['bench-sycamore-sampling', 'bench-dynamic-portfolio'],
    reviewDate: TN_REVIEW_DATE,
  },
];

// ---------------------------------------------------------------------------
// Metadata and lookups
// ---------------------------------------------------------------------------

export const TN_META = {
  title: 'Tensor Network Optimization Atlas',
  shortTitle: 'Tensor Networks Atlas',
  description:
    'A source-led, machine-readable research library for matrix product states, MERA, and tensor-network contraction as a classical method for QUBO/Ising optimization and quantum-circuit simulation.',
  scope:
    'Tensor-network structure and cost models (MPS, PEPS, MERA), the mapping from QUBO/Ising problems into contractible networks, and the evidence status of classical-versus-quantum comparisons on those problems.',
  version: '0.1.0',
  datePublished: TN_REVIEW_DATE,
  dateModified: TN_REVIEW_DATE,
  lastReviewed: TN_REVIEW_DATE,
  evidenceCutoff: TN_EVIDENCE_CUTOFF,
  license: 'CC BY 4.0',
  statusBadge: 'First edition · 14 source-bounded claims',
};

export const getTnClaim = (id: string) => TN_CLAIMS.find((claim) => claim.id === id);
export const getTnConcept = (id: string) => TN_CONCEPTS.find((concept) => concept.id === id);
export const getTnSource = (id: string) => TN_SOURCES.find((source) => source.id === id);
export const getTnBenchmark = (id: string) => TN_BENCHMARKS.find((benchmark) => benchmark.id === id);

/**
 * Referential integrity gate, run at module load so a broken reference fails the
 * build rather than rendering a dead link. This mirrors what
 * scripts/validate-atlas-sources.mjs does for the Synthetic Intelligence module,
 * but runs in-process because these records are typed rather than regex-parsed.
 */
function validateTensorNetworkAtlas(): string[] {
  const errors: string[] = [];
  const sourceIds = new Set(TN_SOURCES.map((source) => source.id));
  const conceptIds = new Set(TN_CONCEPTS.map((concept) => concept.id));
  const benchmarkIds = new Set(TN_BENCHMARKS.map((benchmark) => benchmark.id));

  for (const benchmark of TN_BENCHMARKS) {
    if (!sourceIds.has(benchmark.sourceId)) errors.push(`${benchmark.id}: references missing source "${benchmark.sourceId}".`);
    if (!benchmark.doesNotEstablish) errors.push(`${benchmark.id}: a benchmark record must state what it does not establish.`);
  }

  for (const concept of TN_CONCEPTS) {
    if (!concept.sources.length) errors.push(`${concept.id}: concept has no sources.`);
    concept.sources.forEach((id) => { if (!sourceIds.has(id)) errors.push(`${concept.id}: references missing source "${id}".`); });
    concept.related.forEach((id) => { if (!conceptIds.has(id)) errors.push(`${concept.id}: references missing concept "${id}".`); });
  }

  const seenSlugs = new Set<string>();
  for (const claim of TN_CLAIMS) {
    if (!/^tn-\d{3}$/.test(claim.id)) errors.push(`${claim.id}: malformed claim id.`);
    if (seenSlugs.has(claim.slug)) errors.push(`${claim.id}: duplicate slug "${claim.slug}".`);
    seenSlugs.add(claim.slug);
    if (!claim.sourceIds.length) errors.push(`${claim.id}: every claim must be sourced.`);
    if (!claim.limitations) errors.push(`${claim.id}: missing limitations.`);
    claim.sourceIds.forEach((id) => { if (!sourceIds.has(id)) errors.push(`${claim.id}: references missing source "${id}".`); });
    claim.conceptIds.forEach((id) => { if (!conceptIds.has(id)) errors.push(`${claim.id}: references missing concept "${id}".`); });
    claim.benchmarkIds?.forEach((id) => { if (!benchmarkIds.has(id)) errors.push(`${claim.id}: references missing benchmark "${id}".`); });
  }

  for (const spec of [...TN_MPS_SPECS, ...TN_MERA_SPECS, ...TN_QUBO_MAPPINGS]) {
    spec.sources.forEach((id) => { if (!sourceIds.has(id)) errors.push(`${spec.id}: references missing source "${id}".`); });
  }

  return errors;
}

const TN_VALIDATION_ERRORS = validateTensorNetworkAtlas();
if (TN_VALIDATION_ERRORS.length) {
  throw new Error(`Invalid Tensor Network Atlas source layer:\n${TN_VALIDATION_ERRORS.join('\n')}`);
}
