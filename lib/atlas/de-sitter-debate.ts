// The Disagreement Map: the seven open problems from Section B of the working
// paper at content/papers/de_sitter_swampland_map.mdx, restated so that a
// reader can see at a glance which layer of each problem is shared technical
// vocabulary, which is genuinely disputed, and which is conjectural.
//
// PROVENANCE. Problem statements, camp positions, and citations come from the
// source paper. The "what would count as progress" field is curator inference,
// and is marked as such in the UI; where the paper's Section E speaks directly
// to tractability, that is the basis and is noted in the text.

export type DebateCamp = {
  label: string;
  position: string;
  sources: string[];
};

export type DebateProblem = {
  /** Problem number as given in the source paper's open-problems table. */
  number: number;
  id: string;
  title: string;
  question: string;
  /** Vocabulary and machinery both sides use without dispute. */
  commonLanguage: string;
  /** The specific technical point in dispute. */
  debated: string;
  /** What in this problem rests on unproved conjecture. */
  conjectural: string;
  /** Curator inference: what would move this problem. */
  whatWouldCount: string;
  camps: DebateCamp[];
  claimRefs: string[];
  conceptIds: string[];
};

export const DEBATE_PROBLEMS: DebateProblem[] = [
  {
    number: 1,
    id: 'kklt-control',
    title: 'KKLT anti-brane uplift and ten-dimensional control',
    question: 'Is the KKLT anti-brane uplift under parametric ten-dimensional supergravity control?',
    commonLanguage:
      'Both sides use flux compactification, non-perturbative superpotentials, warped throats, and the anti-D3-brane uplift as well-defined objects. Nobody disputes what the KKLT recipe says to do, or that it produces a supersymmetric anti-de Sitter minimum before the uplift step.',
    debated:
      'Whether the anti-brane backreaction is singular in ten dimensions in a way that invalidates the four-dimensional effective description. This is a calculation about a specific approximation regime, not a matter of taste.',
    conjectural:
      'Nothing in this problem requires a swampland conjecture. It is a control question internal to string theory, which is why it is the hardest one to dismiss from either direction.',
    whatWouldCount:
      'An agreed ten-dimensional treatment of the polarized anti-brane and its backreaction, reproducible by both camps. The source paper classes this as deep formal work in supergravity and algebraic geometry, effectively closed to an outsider without an expert collaborator.',
    camps: [
      {
        label: 'KKLT defenders',
        position:
          'Supersymmetry breaking is localized on the anti-D3-brane and is captured by a nilpotent superfield in the four-dimensional theory. An explicit ten-dimensional analysis reproduces the four-dimensional result, and brane polarization resolves the apparent singularity.',
        sources: ['kklt2003', 'kachru2019', 'kallosh2019', 'michel2014'],
      },
      {
        label: 'Ten-dimensional supergravity skeptics',
        position:
          'Explicit backreaction calculations show infrared singularities that cannot be cloaked, and the integrated ten-dimensional equations are argued to obstruct the uplift entirely.',
        sources: ['bena2012', 'moritz2017', 'danielsson2018'],
      },
    ],
    claimRefs: ['ds-003', 'ds-004'],
    conceptIds: ['kklt', 'moduli', 'flux-compactification', 'anti-de-sitter'],
  },
  {
    number: 2,
    id: 'lvs-control',
    title: 'Large Volume Scenario and parametric control',
    question: 'Can the Large Volume Scenario build metastable de Sitter vacua under rigorous control?',
    commonLanguage:
      'The LVS stabilization mechanism and its exponentially large volume are not in dispute, nor is the general expectation that large volume suppresses the leading alpha-prime and loop corrections.',
    debated:
      'Whether the suppression is genuinely parametric once warping and loop corrections are included, and whether the negative D3-tadpole required to keep control exceeds what known Calabi-Yau geometries supply.',
    conjectural:
      'The claim that LVS de Sitter vacua are in the swampland imports the swampland framing; the tadpole objection itself does not, and stands as an internal control argument.',
    whatWouldCount:
      'A programmatic search of the Kreuzer-Skarke database for Calabi-Yau manifolds meeting the parametric tadpole bounds. The source paper identifies this as a database and algorithmic task that does not require solving supergravity equations, and names it one of the few genuinely tractable openings for an outsider.',
    camps: [
      {
        label: 'LVS proponents',
        position:
          'Large volume suppresses the dangerous corrections, and uplift via F-terms of blow-up modes avoids singular anti-branes altogether, so the construction does not inherit the KKLT dispute.',
        sources: ['lvs2005', 'gallego2017', 'cicoli2012'],
      },
      {
        label: 'Control skeptics',
        position:
          'Warping and loop corrections violate the expected scaling, and maintaining control requires a negative D3-tadpole larger than known Calabi-Yau bounds allow.',
        sources: ['junghans2022', 'gao2022'],
      },
    ],
    claimRefs: ['ds-005', 'ds-006'],
    conceptIds: ['large-volume-scenario', 'moduli', 'compactification'],
  },
  {
    number: 3,
    id: 'ds-conjecture',
    title: 'The de Sitter Swampland Conjecture',
    question: 'Does the de Sitter Swampland Conjecture hold as a quantum-gravity constraint?',
    commonLanguage:
      'The statement of the conjecture is shared and precise: a bound on the gradient of the scalar potential, refined in a later form to a condition on the Hessian. Both camps agree on what is being asserted.',
    debated:
      'Whether the motivating arguments support a bound with an order-one coefficient, and whether such a coefficient can be reconciled with slow-roll inflation and the observed value of the cosmological constant.',
    conjectural:
      'The conjecture itself, in both its original and refined forms. It rests on asymptotic and thermodynamic arguments, not on a ten-dimensional proof, and the refinement was introduced because the original was in tension with known physics.',
    whatWouldCount:
      'Either a derivation of the bound from a controlled construction, or an explicit counterexample construction that survives the control objections of Problems 1 and 2. Sharper asymptotic theorems would also narrow the space of admissible coefficients.',
    camps: [
      {
        label: 'Conjecture advocates',
        position:
          'The bound follows the pattern of the distance conjecture and de Sitter thermodynamics, and it explains the persistent failure to construct controlled de Sitter vacua.',
        sources: ['obied2018', 'ooguri2018', 'garg2018'],
      },
      {
        label: 'Landscape defenders',
        position:
          'An order-one coefficient is in tension with inflationary phenomenology and the observed dark-energy sector, and the conjecture over-generalizes tree-level no-go theorems.',
        sources: ['akrami2018', 'kallosh2019'],
      },
    ],
    claimRefs: ['ds-007', 'ds-008'],
    conceptIds: ['ds-conjecture', 'refined-ds-conjecture', 'swampland', 'de-sitter'],
  },
  {
    number: 4,
    id: 'dark-dimension',
    title: 'The Dark Dimension',
    question: 'Is the Dark Dimension scenario consistent with all bounds?',
    commonLanguage:
      'The experimental constraints are shared ground. Torsion-balance limits on inverse-square-law deviations and astrophysical cooling bounds are accepted by everyone; the question is what they leave room for.',
    debated:
      'Whether a single mesoscopic extra dimension at roughly a micron survives short-range gravity limits, SN1987A and neutron-star cooling constraints, and the astrophysical limits on decaying dark gravitons.',
    conjectural:
      'The scenario rests on the AdS distance conjecture, which is itself unproved, combined with phenomenological input. This is the most conjecture-dependent problem on the map, which is why the atlas labels it speculative interpretation.',
    whatWouldCount:
      'Improved torsion-balance sensitivity at and below the micron scale, or tighter astrophysical cooling limits. The source paper notes this is straightforward to read and reproduce but harder to extend than it looks, because the prediction sits at the current experimental frontier and systematics modeling is the real difficulty.',
    camps: [
      {
        label: 'Proponents',
        position:
          'The AdS distance conjecture plus the observed dark-energy scale predicts a single extra dimension of order a micron, with Kaluza-Klein gravitons supplying dark matter, and the scenario has been embedded in a warped-throat construction.',
        sources: ['montero2022', 'lust2019', 'blumenhagen2022'],
      },
      {
        label: 'Phenomenological skeptics',
        position:
          'Laboratory limits on deviations from the inverse-square law, together with astrophysical cooling and dark-graviton constraints, squeeze the viable parameter space.',
        sources: ['lee2020', 'kapner2007', 'lawSmith2023'],
      },
    ],
    claimRefs: ['ds-011', 'ds-012'],
    conceptIds: ['extra-dimensions', 'cosmological-constant', 'swampland'],
  },
  {
    number: 5,
    id: 'quintessence',
    title: 'Quintessence as the dark-energy alternative',
    question: 'Can quintessence explain dark energy consistently with quantum gravity?',
    commonLanguage:
      'Everyone agrees on the observational situation: the dark-energy equation of state is measured close to w = −1, and rolling-scalar models must fit within that.',
    debated:
      'Whether the fit demands fine-tuning severe enough to count against the swampland programme, and which direction newer data actually pushes. One data-side reassessment in the source set finds newer data allows slightly more freedom in the criteria rather than tightening the tension, while raising a separate fine-tuning problem from constraints on moduli-electromagnetic couplings.',
    conjectural:
      'The motivation for taking quintessence seriously here is conditional on the de Sitter conjecture holding. Quintessence as a dark-energy model is independent of that; its role in this debate is not.',
    whatWouldCount:
      'Tighter equation-of-state constraints from DESI and Euclid. The source paper identifies this as accessible work: constraining swampland-quintessence or Trans-Planckian Censorship models by modifying standard Boltzmann solvers and running MCMC pipelines, with one paper in the source set as a worked example of exactly that.',
    camps: [
      {
        label: 'Swampland-quintessence advocates',
        position:
          'A rolling scalar avoids the thermodynamic problems of stable de Sitter and can satisfy the gradient bound, so the conjectures point to a testable cosmology rather than a dead end.',
        sources: ['agrawal2018'],
      },
      {
        label: 'Observational skeptics',
        position:
          'Bounds pushing the equation of state toward w = −1 force the conjecture coefficient small, straining the order-one requirement the conjecture needs.',
        sources: ['heisenberg2018'],
      },
      {
        label: 'Data-side reassessment, in neither camp',
        position:
          'A refit of a range of quintessence models to newer datasets finds the data allows slightly more freedom in the swampland criteria rather than tightening the tension, and cautions against model-independent reconstructions of the criteria from expansion-rate data.',
        sources: ['schoneberg2023'],
      },
    ],
    claimRefs: ['ds-001', 'ds-010'],
    conceptIds: ['cosmological-constant', 'observational-cosmology', 'de-sitter'],
  },
  {
    number: 6,
    id: 'dine-seiberg',
    title: 'The Dine-Seiberg problem',
    question: 'Does the Dine-Seiberg problem force all de Sitter constructions into the swampland?',
    commonLanguage:
      'The 1985 observation itself is not disputed: string compactifications are weakly coupled and large-volume only asymptotically, and the potential vanishes in that limit. Every stabilization scheme has to confront this.',
    debated:
      'Whether interior minima at finite coupling and volume can be stabilized under trustworthy control, or whether the interior is precisely where the effective description stops being reliable.',
    conjectural:
      'The stronger reading — that the asymptotic regime is the only controlled one, so all interior constructions are in the swampland — is a swampland-programme position, not a theorem.',
    whatWouldCount:
      'Either a demonstration that specific interior minima are controlled with quantified error, or a sharp theorem that unsuppressed corrections always spoil them. This problem overlaps Problems 1 and 2 by construction; the source paper groups all three as angles on a single question.',
    camps: [
      {
        label: 'Landscape proponents',
        position:
          'Combining fluxes, instantons, and alpha-prime corrections yields trustworthy interior minima, which is what KKLT and LVS are for.',
        sources: ['kklt2003', 'lvs2005'],
      },
      {
        label: 'Asymptotic-swampland advocates',
        position:
          'The conjectures are sharp asymptotically, and interior stabilization introduces corrections that are not suppressed, so control is illusory there.',
        sources: ['dineSeiberg1985', 'ooguri2018', 'lust2019'],
      },
    ],
    claimRefs: ['ds-002', 'ds-004', 'ds-006'],
    conceptIds: ['moduli', 'compactification', 'swampland'],
  },
  {
    number: 7,
    id: 'tcc',
    title: 'Trans-Planckian Censorship',
    question: 'Does the Trans-Planckian Censorship Conjecture constrain the de Sitter lifetime?',
    commonLanguage:
      'The statement of the conjecture and the lifetime bound it implies are agreed. So is the observational fact the objection turns on: the measured amplitude of primordial perturbations.',
    debated:
      'Whether the low inflation scale the bound forces can be reconciled with generating the observed perturbation amplitude without fine-tuning.',
    conjectural:
      'The conjecture itself. It offers an independent route to swampland-like constraints, replacing "no de Sitter" with "no long-lived de Sitter", but it is not derived.',
    whatWouldCount:
      'A derivation of the censorship condition from a controlled ultraviolet-complete setup, or a concrete inflationary model that satisfies the bound and reproduces the observed perturbation amplitude without tuning.',
    camps: [
      {
        label: 'TCC proponents',
        position:
          'Frozen sub-Planckian modes would break the effective field theory, and the conjecture yields a natural bound on how long a de Sitter phase can last.',
        sources: ['bedroya2019'],
      },
      {
        label: 'Cosmological and landscape skeptics',
        position:
          'The bound forces the inflationary energy scale low enough that the observed perturbation amplitude becomes hard to generate without fine-tuning.',
        sources: ['akrami2018'],
      },
    ],
    claimRefs: ['ds-009'],
    conceptIds: ['de-sitter', 'swampland', 'ds-conjecture'],
  },
];

export function getDebateProblem(id: string): DebateProblem | undefined {
  return DEBATE_PROBLEMS.find((problem) => problem.id === id);
}
