// Data for the de Sitter / String Swampland Atlas at /atlas/de-sitter-swampland.
//
// PROVENANCE RULE FOR THIS FILE: every source below is drawn from the working
// paper at content/papers/de_sitter_swampland_map.mdx, whose Verification
// Ledger records that all twenty-four arXiv identifiers were independently
// resolved against arXiv/INSPIRE-HEP. Nothing here cites a work outside that
// set. Where the source map names a work only by identifier (the three
// [FOUNDATIONAL] entries), this file does the same rather than supplying a
// title the source map does not record.

export type EpistemicStatus = 'established' | 'active' | 'conjecture' | 'speculative';

export type StatusDescriptor = {
  id: EpistemicStatus;
  label: string;
  definition: string;
  /** Tailwind classes for the badge, matched to the site's zinc/indigo system. */
  badgeClass: string;
  dotClass: string;
  strokeColor: string;
};

export type AtlasSource = {
  id: string;
  /** How the source map names this work. Not embellished beyond that. */
  label: string;
  authors?: string;
  identifier?: string;
  journal?: string;
  url?: string;
  provenance: 'verified' | 'foundational';
  /** Set when the source map records no title for the work. */
  titleNotRecorded?: boolean;
};

export type AtlasNode = {
  id: string;
  label: string;
  /** Percent coordinates within the map viewport. */
  x: number;
  y: number;
  status: EpistemicStatus;
  definition: string;
  whyItMatters: string;
  related: string[];
  sources: string[];
  /** Rendered as "What this does not establish" when present. */
  notEstablished?: string;
  /**
   * True for orientation nodes that the source map treats as background rather
   * than citing directly. Surfaced in the UI so the gap is visible.
   */
  contextual?: boolean;
};

export type AtlasEdge = {
  from: string;
  to: string;
  label: string;
};

export type AtlasClaim = {
  id: string;
  claim: string;
  status: EpistemicStatus;
  /** Optional refinement of the status label, e.g. "observational framework". */
  statusNote?: string;
  explanation: string;
  sources: string[];
  caution: string;
};

export const ATLAS_PATH = '/atlas/de-sitter-swampland';
export const ATLAS_PAPER_SLUG = 'de_sitter_swampland_map';

export const ATLAS_META = {
  title: 'The de Sitter / String Swampland Atlas',
  shortTitle: 'de Sitter / Swampland Atlas',
  purpose:
    'A navigable, source-first guide to the de Sitter problem in string theory.',
  description:
    'A source-first concept map and claim ledger for the de Sitter problem in the string/M-theory swampland program, built from a citation-verified literature map. An educational orientation tool that separates established results from active research, conjecture, and speculative interpretation.',
  statusBadge: 'Educational research map · non-peer-reviewed orientation tool',
  version: '1.0.0',
  datePublished: '2026-07-26',
  dateModified: '2026-07-26',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  licenseLabel: 'CC BY 4.0',
  reuseNotes:
    'Reusable under CC BY 4.0 with attribution to Maha Strategies Research. This atlas is a navigation layer over a non-peer-reviewed literature map; it is not a consensus statement, and reuse should preserve its epistemic status labels and cautions.',
} as const;

export const EPISTEMIC_STATUSES: StatusDescriptor[] = [
  {
    id: 'established',
    label: 'Established result',
    definition:
      'A mathematical construction, derivation, or experimental measurement that the relevant community treats as settled. It says what was shown, not that any larger claim built on it follows.',
    badgeClass: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
    dotClass: 'bg-emerald-400',
    strokeColor: '#34d399',
  },
  {
    id: 'active',
    label: 'Active research',
    definition:
      'A genuinely open question under current technical dispute. Competent researchers disagree, the disagreement is technical rather than rhetorical, and no side has closed it.',
    badgeClass: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
    dotClass: 'bg-sky-400',
    strokeColor: '#38bdf8',
  },
  {
    id: 'conjecture',
    label: 'Conjecture',
    definition:
      'A precisely stated proposal that is motivated by evidence and argument but has not been derived or proved. It may be true; it is not established.',
    badgeClass: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
    dotClass: 'bg-amber-400',
    strokeColor: '#fbbf24',
  },
  {
    id: 'speculative',
    label: 'Speculative interpretation',
    definition:
      'A scenario built on top of one or more unproved conjectures, often combined with phenomenological input. Interesting and testable in places, but several inferential steps from established ground.',
    badgeClass: 'border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200',
    dotClass: 'bg-fuchsia-400',
    strokeColor: '#e879f9',
  },
];

export function getStatus(id: EpistemicStatus): StatusDescriptor {
  return EPISTEMIC_STATUSES.find((status) => status.id === id) ?? EPISTEMIC_STATUSES[1];
}

const ARXIV = 'https://arxiv.org/abs/';

export const ATLAS_SOURCES: Record<string, AtlasSource> = {
  kklt2003: {
    id: 'kklt2003',
    label: 'KKLT — the founding de Sitter construction paper',
    identifier: 'hep-th/0301240',
    url: `${ARXIV}hep-th/0301240`,
    provenance: 'foundational',
    titleNotRecorded: true,
  },
  lvs2005: {
    id: 'lvs2005',
    label: 'Large Volume Scenario — the founding LVS paper',
    identifier: 'hep-th/0502058',
    url: `${ARXIV}hep-th/0502058`,
    provenance: 'foundational',
    titleNotRecorded: true,
  },
  dineSeiberg1985: {
    id: 'dineSeiberg1985',
    label: 'Dine-Seiberg — the 1985 weak-coupling/large-volume observation',
    journal: 'Phys. Lett. B 162 (1985) 299',
    provenance: 'foundational',
    titleNotRecorded: true,
  },
  michel2014: {
    id: 'michel2014',
    label: 'Remarks on brane and antibrane dynamics',
    authors: 'Michel et al.',
    identifier: 'arXiv:1412.5702',
    url: `${ARXIV}1412.5702`,
    provenance: 'verified',
  },
  kallosh2019: {
    id: 'kallosh2019',
    label: 'dS Vacua and the Swampland',
    authors: 'Kallosh, Linde, McDonough, Scalisi',
    identifier: 'arXiv:1901.02022',
    url: `${ARXIV}1901.02022`,
    provenance: 'verified',
  },
  kachru2019: {
    id: 'kachru2019',
    label: 'de Sitter Vacua from Ten Dimensions',
    authors: 'Kachru, Kim, McAllister, Zimet',
    identifier: 'arXiv:1908.04788',
    url: `${ARXIV}1908.04788`,
    provenance: 'verified',
  },
  bena2012: {
    id: 'bena2012',
    label: "Anti-D3's — Singular to the Bitter End",
    authors: 'Bena et al.',
    identifier: 'arXiv:1206.6369',
    url: `${ARXIV}1206.6369`,
    provenance: 'verified',
  },
  moritz2017: {
    id: 'moritz2017',
    label: 'Toward de Sitter space from ten dimensions',
    authors: 'Moritz, Retolaza, Westphal',
    identifier: 'arXiv:1707.08678',
    url: `${ARXIV}1707.08678`,
    provenance: 'verified',
  },
  danielsson2018: {
    id: 'danielsson2018',
    label: 'What if string theory has no de Sitter vacua?',
    authors: 'Danielsson, Van Riet',
    identifier: 'arXiv:1804.01120',
    url: `${ARXIV}1804.01120`,
    provenance: 'verified',
  },
  gallego2017: {
    id: 'gallego2017',
    label: 'A New Class of de Sitter Vacua in Type IIB Large Volume Compactifications',
    authors: 'Gallego, Marsh, Vercnocke, Wrase',
    identifier: 'arXiv:1707.01095',
    url: `${ARXIV}1707.01095`,
    provenance: 'verified',
  },
  cicoli2012: {
    id: 'cicoli2012',
    label: 'De Sitter String Vacua from Dilaton-dependent Non-perturbative Effects',
    authors: 'Cicoli, Maharana, Quevedo, Burgess',
    identifier: 'arXiv:1203.1750',
    journal: 'JHEP 06 (2012) 011',
    url: `${ARXIV}1203.1750`,
    provenance: 'verified',
  },
  junghans2022: {
    id: 'junghans2022',
    label: 'LVS de Sitter Vacua are probably in the Swampland',
    authors: 'Junghans',
    identifier: 'arXiv:2201.03572',
    url: `${ARXIV}2201.03572`,
    provenance: 'verified',
  },
  gao2022: {
    id: 'gao2022',
    label: 'The LVS Parametric Tadpole Constraint',
    authors: 'Gao, Hebecker, Schreyer, Venken',
    identifier: 'arXiv:2202.04087',
    journal: 'JHEP 07 (2022) 056',
    url: `${ARXIV}2202.04087`,
    provenance: 'verified',
  },
  obied2018: {
    id: 'obied2018',
    label: 'The original de Sitter swampland conjecture',
    authors: 'Obied, Ooguri, Spodyneiko, Vafa',
    identifier: 'arXiv:1806.08362',
    url: `${ARXIV}1806.08362`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  ooguri2018: {
    id: 'ooguri2018',
    label: 'The refined form of the de Sitter conjecture',
    authors: 'Ooguri, Palti, Shiu, Vafa',
    identifier: 'arXiv:1810.05506',
    url: `${ARXIV}1810.05506`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  garg2018: {
    id: 'garg2018',
    label: 'The slow-roll bound supporting the conjecture',
    authors: 'Garg, Krishnan',
    identifier: 'arXiv:1807.05193',
    url: `${ARXIV}1807.05193`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  akrami2018: {
    id: 'akrami2018',
    label: 'Cosmological critique of the de Sitter conjecture',
    authors: 'Akrami, Kallosh, Linde, Vardanyan',
    identifier: 'arXiv:1808.09440',
    url: `${ARXIV}1808.09440`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  montero2022: {
    id: 'montero2022',
    label: 'The Dark Dimension and the Swampland',
    authors: 'Montero, Vafa, Valenzuela',
    identifier: 'arXiv:2205.12293',
    url: `${ARXIV}2205.12293`,
    provenance: 'verified',
  },
  blumenhagen2022: {
    id: 'blumenhagen2022',
    label: 'A warped-throat realization of the Dark Dimension',
    authors: 'Blumenhagen, Brinkmann, Makridou',
    identifier: 'arXiv:2208.01057',
    url: `${ARXIV}2208.01057`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  lawSmith2023: {
    id: 'lawSmith2023',
    label: 'Astrophysical Constraints on Decaying Dark Gravitons',
    authors: 'Law-Smith, Obied, Prabhu, Vafa',
    identifier: 'arXiv:2307.11048',
    journal: 'JHEP 06 (2024) 047',
    url: `${ARXIV}2307.11048`,
    provenance: 'verified',
  },
  lee2020: {
    id: 'lee2020',
    label: 'New Test of the Gravitational 1/r² Law at Separations down to 52 μm',
    authors: 'Lee, Adelberger, Cook, Fleischer, Heckel',
    identifier: 'arXiv:2002.11761',
    journal: 'PRL 124, 101101 (2020)',
    url: `${ARXIV}2002.11761`,
    provenance: 'verified',
  },
  kapner2007: {
    id: 'kapner2007',
    label: 'Tests of the Gravitational Inverse-Square Law below the Dark-Energy Length Scale',
    authors: 'Kapner, Cook, Adelberger, Gundlach, Heckel, Hoyle, Swanson',
    identifier: 'hep-ph/0611184',
    journal: 'PRL 98, 021101 (2007)',
    url: `${ARXIV}hep-ph/0611184`,
    provenance: 'verified',
  },
  agrawal2018: {
    id: 'agrawal2018',
    label: 'Cosmological implications of the swampland conjectures',
    authors: 'Agrawal, Obied, Steinhardt, Vafa',
    identifier: 'arXiv:1806.09718',
    url: `${ARXIV}1806.09718`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  heisenberg2018: {
    id: 'heisenberg2018',
    label: 'Equation-of-state bounds on swampland quintessence',
    authors: 'Heisenberg, Bartelmann, Brandenberger, Refregier',
    identifier: 'arXiv:1808.02877',
    url: `${ARXIV}1808.02877`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  schoneberg2023: {
    id: 'schoneberg2023',
    label: 'News from the Swampland — constraining string theory with astrophysics and cosmology',
    authors: 'Schöneberg, Vacher, Dias, Carvalho, Martins',
    identifier: 'arXiv:2307.15060',
    journal: 'JCAP 2023(10), 039; doi:10.1088/1475-7516/2023/10/039',
    url: `${ARXIV}2307.15060`,
    provenance: 'verified',
  },
  lust2019: {
    id: 'lust2019',
    label: 'The AdS distance conjecture',
    authors: 'Lüst, Palti, Vafa',
    identifier: 'arXiv:1906.05225',
    url: `${ARXIV}1906.05225`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
  bedroya2019: {
    id: 'bedroya2019',
    label: 'The Trans-Planckian Censorship Conjecture',
    authors: 'Bedroya, Vafa',
    identifier: 'arXiv:1909.11063',
    url: `${ARXIV}1909.11063`,
    provenance: 'verified',
    titleNotRecorded: true,
  },
};

export const ATLAS_NODES: AtlasNode[] = [
  {
    id: 'string-theory',
    label: 'String theory',
    x: 18,
    y: 7,
    status: 'active',
    definition:
      'A framework in which the fundamental objects are one-dimensional strings rather than point particles. Its consistency conditions require more than four spacetime dimensions and produce a graviton in the spectrum, which is why it is studied as a candidate theory of quantum gravity.',
    whyItMatters:
      'Every question on this map is a question about string theory: whether its consistent solutions include a universe like the one we observe, with a small positive vacuum energy.',
    related: ['m-theory', 'extra-dimensions', 'compactification', 'swampland'],
    sources: ['kklt2003', 'danielsson2018'],
    notEstablished:
      'String theory is not an experimentally confirmed description of nature. No prediction of it has been tested and confirmed at accessible energies. Its status here is that of a mathematical research framework, and this atlas makes no claim otherwise.',
  },
  {
    id: 'm-theory',
    label: 'M-theory',
    x: 46,
    y: 7,
    status: 'active',
    definition:
      'An eleven-dimensional framework proposed to unify the five consistent ten-dimensional superstring theories, which appear as limits of it. The source map treats the subject as "string/M-theory" throughout rather than separating them.',
    whyItMatters:
      'The de Sitter question is posed for the whole framework, not one string theory. A construction that fails in one duality frame may be argued to survive in another, which is part of why the debate is hard to close.',
    related: ['string-theory', 'extra-dimensions', 'compactification'],
    sources: ['danielsson2018'],
    notEstablished:
      'M-theory has no complete non-perturbative definition and no experimental confirmation. Naming it does not add evidence to any claim on this map.',
  },
  {
    id: 'extra-dimensions',
    label: 'Extra dimensions',
    x: 78,
    y: 7,
    status: 'active',
    definition:
      'Spatial dimensions beyond the three we observe, required by the consistency conditions of string and M-theory. They must be hidden from current experiment, either by being very small or by some other mechanism.',
    whyItMatters:
      'The size and shape of the extra dimensions determine the four-dimensional physics you get, including the vacuum energy. The de Sitter problem is largely a problem about controlling that geometry.',
    related: ['compactification', 'moduli', 'cosmological-constant'],
    sources: ['montero2022', 'lee2020', 'kapner2007'],
    notEstablished:
      'No extra dimension has been observed. Torsion-balance experiments find no deviation from the gravitational inverse-square law down to roughly 52 micrometres, which constrains but does not exclude mesoscopic scenarios.',
  },
  {
    id: 'compactification',
    label: 'Compactification',
    x: 32,
    y: 22,
    status: 'established',
    definition:
      'The procedure of taking a higher-dimensional theory and rolling up the extra dimensions on a small compact internal manifold, leaving an effective four-dimensional theory. In string theory the internal space is typically a Calabi-Yau manifold.',
    whyItMatters:
      'Compactification is the bridge between a ten- or eleven-dimensional theory and any statement about four-dimensional cosmology. It is also where the trouble starts: the procedure introduces the moduli whose stabilization is the central technical problem.',
    related: ['extra-dimensions', 'moduli', 'flux-compactification', 'string-theory'],
    sources: ['kklt2003', 'lvs2005'],
    notEstablished:
      'That compactification is a well-defined mathematical procedure does not establish that any particular compactification describes our universe, or that the resulting four-dimensional effective theory remains valid where it is being used.',
  },
  {
    id: 'flux-compactification',
    label: 'Flux compactification',
    x: 66,
    y: 22,
    status: 'established',
    definition:
      'Compactification with background field strengths (fluxes) threaded through cycles of the internal manifold. The fluxes are quantized, and different choices generate different four-dimensional potentials.',
    whyItMatters:
      'Fluxes generate a potential for many of the moduli, which is the first step in stabilizing them. The large number of allowed flux choices is also the origin of the "landscape" picture of many possible vacua.',
    related: ['compactification', 'moduli', 'kklt', 'anti-de-sitter'],
    sources: ['kklt2003', 'lvs2005'],
    notEstablished:
      'Flux stabilization of some moduli does not by itself produce a de Sitter vacuum, and counting flux choices does not establish that any of them is under effective-field-theory control.',
  },
  {
    id: 'moduli',
    label: 'Moduli',
    x: 20,
    y: 37,
    status: 'established',
    definition:
      'Massless or light scalar fields in the four-dimensional theory that parameterize the size, shape, and coupling of the internal geometry. Left unstabilized they would produce unobserved long-range forces and a time-varying coupling.',
    whyItMatters:
      'Moduli stabilization is the technical heart of the entire debate. Giving every modulus a mass at a minimum of the potential with positive vacuum energy is exactly what a de Sitter construction has to achieve, and exactly what critics argue cannot be done under control.',
    related: ['compactification', 'kklt', 'large-volume-scenario', 'de-sitter'],
    sources: ['kklt2003', 'lvs2005', 'dineSeiberg1985'],
    notEstablished:
      'The Dine-Seiberg observation is that string compactifications are weakly coupled and large-volume only asymptotically, where the potential vanishes. Any stabilized minimum sits at finite coupling and volume, where control is precisely what is contested.',
  },
  {
    id: 'anti-de-sitter',
    label: 'Anti-de Sitter spacetime',
    x: 58,
    y: 37,
    status: 'established',
    definition:
      'The maximally symmetric solution of Einstein gravity with negative cosmological constant. Its geometry has a timelike boundary at spatial infinity.',
    whyItMatters:
      'Supersymmetric anti-de Sitter vacua are comparatively easy to obtain in string theory, and KKLT begins from one. The difficulty is the last step: lifting that vacuum to positive vacuum energy. The asymmetry between how easy AdS is and how hard dS is, is the shape of the whole problem.',
    related: ['kklt', 'de-sitter', 'cosmological-constant', 'holography'],
    sources: ['kklt2003', 'lust2019'],
    notEstablished:
      'Our universe is not anti-de Sitter. The tractability of AdS in string theory is a statement about the mathematics, not about the observed spacetime.',
  },
  {
    id: 'holography',
    label: 'Holography',
    x: 85,
    y: 37,
    status: 'active',
    definition:
      'The principle that a gravitational theory in a region can be equivalently described by a non-gravitational theory on its boundary. The AdS/CFT correspondence is the sharply formulated example, relating gravity in anti-de Sitter space to a conformal field theory on the boundary.',
    whyItMatters:
      'Holography is the reason anti-de Sitter space is so well understood, and its absence for de Sitter is part of why de Sitter is not. De Sitter space has no timelike boundary of the same kind, so there is no comparably established holographic definition of it.',
    related: ['anti-de-sitter', 'de-sitter'],
    sources: [],
    contextual: true,
    notEstablished:
      'This is an orientation node. The source literature map does not cite holography or AdS/CFT directly, so no citation from its verified set is offered here. There is no established holographic definition of de Sitter space comparable to AdS/CFT.',
  },
  {
    id: 'kklt',
    label: 'KKLT',
    x: 13,
    y: 53,
    status: 'active',
    definition:
      'A proposed construction of a de Sitter vacuum in three steps: stabilize complex-structure moduli with fluxes, stabilize the volume with non-perturbative effects into a supersymmetric anti-de Sitter minimum, then uplift that minimum to positive vacuum energy with an anti-D3-brane.',
    whyItMatters:
      'KKLT is the reference construction of the entire field. Nearly every subsequent argument, on either side, is an argument about whether its uplift step survives scrutiny in the full ten-dimensional theory.',
    related: ['moduli', 'flux-compactification', 'anti-de-sitter', 'de-sitter', 'large-volume-scenario'],
    sources: ['kklt2003', 'kachru2019', 'kallosh2019', 'michel2014', 'bena2012', 'moritz2017', 'danielsson2018'],
    notEstablished:
      'That KKLT is a well-defined proposal does not establish that it produces a controlled de Sitter vacuum. Whether the anti-brane backreaction is singular in ten dimensions, and whether the four-dimensional effective description remains valid, is actively disputed. Defenders point to an explicit ten-dimensional analysis reproducing the four-dimensional result; critics argue integrated ten-dimensional equations obstruct the uplift.',
  },
  {
    id: 'large-volume-scenario',
    label: 'Large Volume Scenario',
    x: 38,
    y: 53,
    status: 'active',
    definition:
      'An alternative moduli-stabilization scheme in which the internal volume is stabilized at exponentially large values, nominally suppressing the corrections that could spoil the construction. Some versions uplift using F-terms of blow-up modes rather than anti-branes.',
    whyItMatters:
      'LVS is the main alternative route to a controlled de Sitter vacuum, and its large volume is meant to give the parametric control that critics say KKLT lacks. Whether it actually delivers that control is the second front of the debate.',
    related: ['moduli', 'kklt', 'de-sitter', 'swampland'],
    sources: ['lvs2005', 'gallego2017', 'cicoli2012', 'junghans2022', 'gao2022'],
    notEstablished:
      'Exponentially large volume does not automatically mean parametric suppression of every correction. Skeptics argue that warping and loop corrections violate the expected scaling, and that maintaining control requires a negative D3-tadpole exceeding known Calabi-Yau bounds. That argument is a control constraint, not a proved no-go theorem.',
  },
  {
    id: 'de-sitter',
    label: 'de Sitter spacetime',
    x: 68,
    y: 53,
    status: 'established',
    definition:
      'The maximally symmetric solution of Einstein gravity with positive cosmological constant: an exponentially expanding, accelerating spacetime with a cosmological horizon.',
    whyItMatters:
      'The observed universe is accelerating, and the standard model of cosmology describes that acceleration with a small positive cosmological constant. So a candidate theory of quantum gravity is expected to accommodate something close to de Sitter, or to explain why not.',
    related: ['cosmological-constant', 'kklt', 'large-volume-scenario', 'swampland', 'ds-conjecture'],
    sources: ['obied2018', 'agrawal2018', 'bedroya2019'],
    notEstablished:
      'That de Sitter space is a well-defined solution of classical general relativity establishes nothing about whether string theory admits a stable or metastable de Sitter vacuum. That question is open, and the source map takes no side on it.',
  },
  {
    id: 'swampland',
    label: 'String swampland',
    x: 26,
    y: 70,
    status: 'conjecture',
    definition:
      'The proposed set of effective field theories that look internally consistent as low-energy theories but admit no ultraviolet completion in quantum gravity. The swampland program tries to characterize that set with conjectured criteria.',
    whyItMatters:
      'If the criteria are right, they constrain what any quantum theory of gravity permits, without needing an explicit construction. The de Sitter question then becomes: are the candidate de Sitter constructions in the landscape, or in the swampland?',
    related: ['ds-conjecture', 'refined-ds-conjecture', 'de-sitter', 'string-theory', 'large-volume-scenario'],
    sources: ['obied2018', 'ooguri2018', 'lust2019', 'danielsson2018'],
    notEstablished:
      'The swampland criteria are conjectures, motivated by patterns in known constructions and by black-hole and thermodynamic arguments. They are not theorems, and a construction being argued into the swampland is a claim about the conjectures as much as about the construction.',
  },
  {
    id: 'cosmological-constant',
    label: 'Cosmological constant',
    x: 72,
    y: 70,
    status: 'established',
    definition:
      'A constant energy density of the vacuum, denoted Λ, entering Einstein equations as a uniform source. Positive Λ drives accelerated expansion; negative Λ gives anti-de Sitter geometry.',
    whyItMatters:
      'The observed late-time acceleration of the universe is standardly modeled with a small positive Λ, and observations place the dark-energy equation of state near w = −1. That small positive number is the target any string construction has to reproduce, and it is the observational anchor of the whole debate.',
    related: ['de-sitter', 'anti-de-sitter', 'observational-cosmology', 'extra-dimensions'],
    sources: ['heisenberg2018', 'schoneberg2023', 'akrami2018'],
    notEstablished:
      'Modeling acceleration with a constant Λ is a successful description, not a demonstration that the vacuum energy is truly constant. Dynamical dark energy remains viable within current bounds, which is why the quintessence branch of this debate stays open.',
  },
  {
    id: 'ds-conjecture',
    label: 'de Sitter conjecture',
    x: 14,
    y: 86,
    status: 'conjecture',
    definition:
      'The proposal that scalar potentials in any consistent quantum-gravity effective theory satisfy a gradient bound of the form |∇V| ≥ c·V, with c a positive number of order one in Planck units. Taken at face value it forbids stable de Sitter minima, where the gradient vanishes and V is positive.',
    whyItMatters:
      'It converts a hard construction problem into a sharp, falsifiable-looking criterion, and it is the single statement around which the post-2018 debate organizes.',
    related: ['swampland', 'refined-ds-conjecture', 'de-sitter', 'observational-cosmology'],
    sources: ['obied2018', 'garg2018', 'akrami2018'],
    notEstablished:
      'The conjecture rests on asymptotic and thermodynamic arguments, not on a ten-dimensional proof. Critics argue that an order-one c is in tension with slow-roll inflation and with the observed value of Λ, and that the conjecture over-generalizes tree-level no-go theorems.',
  },
  {
    id: 'refined-ds-conjecture',
    label: 'Refined de Sitter conjecture',
    x: 40,
    y: 86,
    status: 'conjecture',
    definition:
      'A weakened form of the de Sitter conjecture that replaces the strict gradient bound with a disjunction: either the gradient bound holds, or the potential has a sufficiently negative eigenvalue of its Hessian. This permits local maxima while still forbidding stable minima with positive energy.',
    whyItMatters:
      'The refinement was introduced because the original bound was in tension with known features of cosmology, including the Standard Model Higgs potential. It is the form most often used in current work.',
    related: ['ds-conjecture', 'swampland', 'de-sitter'],
    sources: ['ooguri2018', 'garg2018'],
    notEstablished:
      'Refining a conjecture to survive counterexamples does not establish it. The refined form remains a conjecture, and the weakening is itself part of what critics point to when arguing the criteria are not sharply derived.',
  },
  {
    id: 'observational-cosmology',
    label: 'Observational cosmology',
    x: 76,
    y: 86,
    status: 'active',
    definition:
      'The empirical study of the universe at large scales, including measurements of the expansion history, the cosmic microwave background, and large-scale structure. In this debate it supplies the dark-energy equation of state and the constraints that any proposal must survive.',
    whyItMatters:
      'This is the only branch of the map where measurement, rather than argument, decides anything. Equation-of-state constraints near w = −1 bear directly on rolling-scalar alternatives, and short-range gravity experiments constrain mesoscopic extra dimensions.',
    related: ['cosmological-constant', 'ds-conjecture', 'extra-dimensions'],
    sources: ['schoneberg2023', 'heisenberg2018', 'lee2020', 'kapner2007'],
    contextual: true,
    notEstablished:
      'This is an orientation node; the source map cites specific observational results rather than the field as a whole. Current data does not settle the de Sitter question, and one 2023 reanalysis in the source set finds that newer data allows slightly more freedom in the swampland criteria rather than tightening the tension.',
  },
];

export const ATLAS_EDGES: AtlasEdge[] = [
  { from: 'string-theory', to: 'm-theory', label: 'unified in the same framework' },
  { from: 'string-theory', to: 'extra-dimensions', label: 'consistency requires' },
  { from: 'm-theory', to: 'extra-dimensions', label: 'eleven dimensions' },
  { from: 'string-theory', to: 'compactification', label: 'reduced to 4D by' },
  { from: 'extra-dimensions', to: 'compactification', label: 'hidden by' },
  { from: 'compactification', to: 'moduli', label: 'produces' },
  { from: 'compactification', to: 'flux-compactification', label: 'with background fluxes' },
  { from: 'flux-compactification', to: 'moduli', label: 'partially stabilizes' },
  { from: 'moduli', to: 'kklt', label: 'stabilization proposal' },
  { from: 'moduli', to: 'large-volume-scenario', label: 'stabilization proposal' },
  { from: 'flux-compactification', to: 'kklt', label: 'first step of' },
  { from: 'kklt', to: 'anti-de-sitter', label: 'stabilizes to a SUSY AdS minimum' },
  { from: 'kklt', to: 'de-sitter', label: 'proposed uplift — contested' },
  { from: 'large-volume-scenario', to: 'de-sitter', label: 'proposed construction — contested' },
  { from: 'anti-de-sitter', to: 'holography', label: 'AdS/CFT correspondence' },
  { from: 'cosmological-constant', to: 'de-sitter', label: 'positive Λ gives' },
  { from: 'cosmological-constant', to: 'anti-de-sitter', label: 'negative Λ gives' },
  { from: 'observational-cosmology', to: 'cosmological-constant', label: 'measures' },
  { from: 'cosmological-constant', to: 'extra-dimensions', label: 'Dark Dimension proposal — speculative' },
  { from: 'string-theory', to: 'swampland', label: 'EFTs with no UV completion' },
  { from: 'swampland', to: 'ds-conjecture', label: 'proposed criterion' },
  { from: 'ds-conjecture', to: 'refined-ds-conjecture', label: 'weakened to' },
  { from: 'swampland', to: 'de-sitter', label: 'conjectured to forbid' },
  { from: 'swampland', to: 'large-volume-scenario', label: 'argued to place in swampland' },
  { from: 'ds-conjecture', to: 'observational-cosmology', label: 'constrained by w bounds' },
];

export const ATLAS_CLAIMS: AtlasClaim[] = [
  {
    id: 'lambda-modeling',
    claim:
      'The observed late-time acceleration of the universe is standardly modeled with a small positive cosmological constant, and current data place the dark-energy equation of state near w = −1.',
    status: 'established',
    statusNote: 'observational framework',
    explanation:
      'This is the empirical anchor of the debate. Both camps accept it: the landscape side tries to reproduce a small positive vacuum energy from string constructions, and the swampland side has to explain the same observation without a stable de Sitter vacuum.',
    sources: ['heisenberg2018', 'schoneberg2023'],
    caution:
      'A successful model is not a proof of mechanism. Whether the vacuum energy is truly constant or slowly rolling is not settled by current bounds. Note also that the discovery-era supernova papers are outside the source map’s verified citation set, so they are not cited here; the sources listed are the in-set works that constrain the equation of state.',
  },
  {
    id: 'no-consensus',
    claim:
      'Whether string/M-theory admits stable or metastable de Sitter vacua remains an open question, and there is no community consensus.',
    status: 'active',
    explanation:
      'The source map is explicit that the disagreement is technical and genuine, turning on the validity of four-dimensional effective actions, the control of higher-dimensional backreaction, and the trustworthiness of asymptotic regimes. Both camps maintain mathematically sophisticated positions.',
    sources: ['kachru2019', 'danielsson2018'],
    caution:
      'Neither this atlas nor its source paper adjudicates the question. Any presentation of either side as settled misrepresents the state of the field.',
  },
  {
    id: 'kklt-proposal',
    claim:
      'KKLT is a specific, well-defined proposal for obtaining a de Sitter vacuum: flux and non-perturbative stabilization into a supersymmetric anti-de Sitter minimum, followed by an anti-D3-brane uplift.',
    status: 'established',
    explanation:
      'The construction exists as a definite recipe in the literature and has been the reference point for the field for two decades. Describing what it proposes is uncontroversial.',
    sources: ['kklt2003'],
    caution:
      'That the construction is well-defined does not establish that it works. Its validity is the subject of the next two claims.',
  },
  {
    id: 'kklt-control',
    claim:
      'Whether the KKLT anti-brane uplift is under parametric ten-dimensional supergravity control is actively debated.',
    status: 'active',
    explanation:
      'Defenders argue that supersymmetry breaking is localized on the anti-D3-brane and that an explicit ten-dimensional analysis reproduces the four-dimensional result. Skeptics argue that explicit ten-dimensional treatments show infrared singularities in the anti-brane backreaction, and that the integrated ten-dimensional equations obstruct the uplift.',
    sources: ['kachru2019', 'kallosh2019', 'bena2012', 'moritz2017', 'danielsson2018'],
    caution:
      'This is a live technical dispute between established groups — not a fringe objection to a settled result, and not a refutation either. The existence of a singularity in a given approximation is not the same as its being physical; defenders argue brane polarization resolves it. Citing only one side misrepresents the literature.',
  },
  {
    id: 'lvs-large-volume',
    claim:
      'The Large Volume Scenario stabilizes Kähler moduli at exponentially large volume, which nominally suppresses α′ and loop corrections.',
    status: 'established',
    explanation:
      'The stabilization mechanism and its large-volume scaling are a definite result of the construction, and the suppression of leading corrections at large volume follows from that scaling.',
    sources: ['lvs2005', 'cicoli2012', 'gallego2017'],
    caution:
      'Nominal suppression of the leading corrections is not the same as parametric control of all of them. That stronger statement is contested.',
  },
  {
    id: 'lvs-tadpole',
    claim:
      'It has been argued that keeping LVS de Sitter constructions under control requires a negative D3-tadpole exceeding known Calabi-Yau bounds.',
    status: 'active',
    explanation:
      'This is the sharpest quantitative form of the LVS control objection: rather than disputing the scheme in principle, it derives a numerical requirement and compares it with what the known geometries supply.',
    sources: ['gao2022', 'junghans2022'],
    caution:
      'A parametric constraint against currently known Calabi-Yau bounds is not a no-go theorem. The bound is on what has been catalogued, and the argument is contested by LVS proponents.',
  },
  {
    id: 'ds-conjecture',
    claim:
      'The de Sitter swampland conjecture proposes that scalar potentials in consistent quantum-gravity effective theories obey a gradient bound |∇V| ≥ c·V, with c of order one.',
    status: 'conjecture',
    explanation:
      'Stating the conjecture is a statement about the literature, not about nature. Its advocates motivate it from the distance conjecture and de Sitter thermodynamics, and it would forbid stable de Sitter minima if correct.',
    sources: ['obied2018', 'garg2018'],
    caution:
      'The conjecture has no derivation from a ten-dimensional construction and no proof. It is a proposal under active test, and a refined form was introduced precisely because the original was in tension with known physics.',
  },
  {
    id: 'c-tension',
    claim:
      'An order-one value of c has been argued to be in tension with slow-roll inflation and with the observed value of the cosmological constant.',
    status: 'active',
    explanation:
      'This is the main cosmological objection from the landscape side: the same order-one constant that makes the conjecture powerful also makes it hard to reconcile with inflationary phenomenology and with the observed dark-energy sector.',
    sources: ['akrami2018'],
    caution:
      'The tension depends on which version of the conjecture is used and on assumptions about the inflationary sector. It is an argument in a live dispute, not a refutation.',
  },
  {
    id: 'tcc',
    claim:
      'The Trans-Planckian Censorship Conjecture proposes that sub-Planckian fluctuations never cross the Hubble horizon and freeze, which bounds the lifetime of a de Sitter phase.',
    status: 'conjecture',
    explanation:
      'TCC gives an independent route to swampland-like constraints, replacing "no de Sitter" with "no long-lived de Sitter". It has become central to the post-2019 debate and is treated as its own thread in the source map.',
    sources: ['bedroya2019'],
    caution:
      'TCC is a conjecture. Skeptics note that the resulting bound forces a low inflation scale, which makes the observed amplitude of primordial perturbations hard to generate without fine-tuning.',
  },
  {
    id: 'quintessence',
    claim:
      'If metastable de Sitter vacua are excluded, dark energy would have to be dynamical — a rolling scalar field rather than a constant.',
    status: 'active',
    explanation:
      'Quintessence is the standard fallback if the swampland position is correct, and it is where the conjectures make contact with data that can actually be measured.',
    sources: ['agrawal2018', 'heisenberg2018', 'schoneberg2023'],
    caution:
      'This is a conditional claim, not a claim that dark energy is dynamical. Bounds near w = −1 constrain rolling models; one 2023 reanalysis in the source set finds newer data allows slightly more freedom in the criteria rather than tightening the tension, while raising a separate fine-tuning problem from constraints on moduli-electromagnetic couplings.',
  },
  {
    id: 'dark-dimension',
    claim:
      'The Dark Dimension scenario ties the dark-energy scale to a Kaluza-Klein scale via the AdS distance conjecture, predicting a single extra dimension of roughly micron size.',
    status: 'speculative',
    explanation:
      'It is one of the few places in this debate that yields a concrete, near-term testable number, which is why it attracts attention out of proportion to its epistemic footing.',
    sources: ['montero2022', 'lust2019', 'blumenhagen2022', 'lawSmith2023'],
    caution:
      'The scenario is built on the AdS distance conjecture — itself unproved — combined with phenomenological input. A testable prediction is not evidence for the premises that generated it.',
  },
  {
    id: 'eotwash',
    claim:
      'Torsion-balance experiments report no deviation from the gravitational inverse-square law down to separations of about 52 micrometres.',
    status: 'established',
    statusNote: 'experimental measurement',
    explanation:
      'This is a direct laboratory measurement, published in Physical Review Letters, and one of the few genuinely settled empirical inputs on this map. It constrains any scenario predicting a mesoscopic extra dimension.',
    sources: ['lee2020', 'kapner2007'],
    caution:
      'A null result bounds the parameter space; it does not exclude the Dark Dimension scenario, whose predicted scale sits near the current experimental frontier. Systematics modeling, not the raw sensitivity, is the practical limit.',
  },
];

export function getNode(id: string): AtlasNode | undefined {
  return ATLAS_NODES.find((node) => node.id === id);
}

export function getSource(id: string): AtlasSource | undefined {
  return ATLAS_SOURCES[id];
}

/** Every source actually referenced by a node or claim, in declaration order. */
export function getCitedSources(): AtlasSource[] {
  const cited = new Set<string>();
  ATLAS_NODES.forEach((node) => node.sources.forEach((id) => cited.add(id)));
  ATLAS_CLAIMS.forEach((claim) => claim.sources.forEach((id) => cited.add(id)));
  return Object.values(ATLAS_SOURCES).filter((source) => cited.has(source.id));
}

/**
 * Papers that have a companion atlas. Used by the paper route to render a
 * contextual link without touching the archived manuscript text.
 */
export const ATLAS_BY_PAPER: Record<string, { href: string; title: string; blurb: string }> = {
  [ATLAS_PAPER_SLUG]: {
    href: ATLAS_PATH,
    title: ATLAS_META.title,
    blurb:
      'An interactive, source-first navigation layer over this paper: a concept map, epistemic status labels, and a claim ledger drawn entirely from the citations verified here.',
  },
};

export function getAtlasForPaper(slug: string) {
  return ATLAS_BY_PAPER[slug];
}
