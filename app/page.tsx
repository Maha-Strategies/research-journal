// app/page.tsx (research.mahastrategies.com)  — metadata + JSON-LD for the research project home.
// Replace the default create-next-app metadata. Server component (no 'use client').
//
// NOTE ON CLAIMS: schema below describes "an AI-assisted research synthesis project"
// rather than a "peer-reviewed journal" — this matches the project's own
// honesty (hypotheses, not peer-reviewed facts) and avoids overclaiming that
// would invite criticism. Framing is deliberately modest: this is a transparent
// one-author AI-synthesis project, not a journal with peer review or independent authors.

import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://research.mahastrategies.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Maha Strategies Research & Architecture — Human-AI Collaborative Synthesis',
  description:
    'An open-access research project exploring cross-disciplinary structural analogies, using agentic AI as a synthesis instrument under human curation. Frameworks are presented as hypotheses for empirical testing, not peer-reviewed conclusions.',
  keywords: [
    'human-AI collaboration',
    'cross-disciplinary synthesis',
    'nonlinear dynamical systems',
    'systems theory',
    'computational neuroscience',
    'astrophysics',
    'AI-assisted research',
    'agentic AI in research',
  ],
  authors: [{ name: 'Mayone Maha Rajan' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Maha Strategies Research',
    title: 'Maha Strategies Research & Architecture',
    description:
      'Human-AI collaborative synthesis: cross-disciplinary structural analogies presented as testable hypotheses under human curation.',
    images: [{ url: '/og-research.png', width: 1200, height: 630, alt: 'Maha Strategies Research & Architecture' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maha Strategies Research & Architecture',
    description: 'Human-AI collaborative synthesis of cross-disciplinary structural analogies.',
    images: ['/og-research.png'],
  },
};

// JSON-LD: describe the site as a CollectionPage / research project, and the
// inaugural paper as a ScholarlyArticle. Inject in the page body.
export const researchHomeLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Maha Strategies Research & Architecture',
      description:
        'An open-access research project applying agentic AI, under human curation, to surface cross-disciplinary structural analogies as testable hypotheses.',
      publisher: { '@id': `${SITE_URL}/#org` },
      isAccessibleForFree: true,
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/#collection`,
      url: SITE_URL,
      name: 'Maha Strategies Research & Architecture',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      isAccessibleForFree: true,
      about:
        'Cross-disciplinary structural analogies generated via human-curated agentic AI synthesis, presented as testable hypotheses.',
      hasPart: [
        { '@id': `${SITE_URL}/papers/planet-nine-forecast#article` },
        { '@id': `${SITE_URL}/papers/the_perturber_question#article` },
        { '@id': `${SITE_URL}/papers/retrograde_p9#article` },
        { '@id': `${SITE_URL}/papers/readout_plasticity_paper#article` },
        { '@id': `${SITE_URL}/papers/machine_learning_g2_betti#article` },
        { '@id': `${SITE_URL}/papers/de_sitter_swampland_map#article` },
        { '@id': `${SITE_URL}/papers/thermodynamic-isomorphism#article` },
        { '@id': `${SITE_URL}/papers/dissolving-self-ocean-planet#article` },
        { '@id': `${SITE_URL}/papers/chronobiological-entrainment#article` },
        { '@id': `${SITE_URL}/papers/commercial-fusion-viability#article` },
      ],
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: 'Maha Strategies',
      url: 'https://www.mahastrategies.com',
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#architect`,
      name: 'Mayone Maha Rajan',
      url: 'https://www.mayonemaharajan.com',
      jobTitle: 'Architect / Curator',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/planet-nine-forecast#article`,
      headline:
        'A Monte Carlo Forecast for the Detection of Planet Nine',
      url: `${SITE_URL}/papers/planet-nine-forecast`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Planet Nine', 'Trans-Neptunian objects', 'Monte Carlo simulation', 'Vera C. Rubin Observatory', 'Orbital mechanics'],
      abstract:
        'A Monte Carlo forecast (N = 100,000) of the detectability of the hypothesized Planet Nine, propagating a weighted three-model parameter ensemble through Kepler orbit simulation, applying existing survey null-detection masks, and modeling future detection by LSST, Subaru/HSC, and infrared surveys through 2036. Treats the planet as an unproven hypothesis and reports a null-detection posterior; does not claim the planet exists.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Forecast / Conditional analysis (not peer-reviewed)',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/the_perturber_question#article`,
      headline:
        'The Perturber Question Under Audit: An Agentic-AI Replication of the eTNO Clustering Test and a Composition-Agnostic Hypothesis Synthesis',
      url: `${SITE_URL}/papers/the_perturber_question`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Planet Nine', 'Extreme trans-Neptunian objects', 'Orbital clustering', 'Survey selection bias', 'Monte Carlo simulation', 'Agentic AI in research'],
      abstract:
        'A replication and audit study testing whether the extreme trans-Neptunian object orbital-clustering signal survives selection-bias modeling in fully characterized surveys. An independently implemented Python selection-function simulator, benchmarked against the official Fortran SurveySimulator on identical synthetic populations, finds no statistically significant clustering in the reconstructed characterized CFEPS/OSSOS sample — a conclusion robust to implementation choice and directionally consistent with Napier et al. (2021). The benchmark surfaces genuine implementation disagreement, so the pipeline is validated for the clustering conclusion but not for absolute completeness predictions. Includes a composition-agnostic discriminating-observables matrix, a candidate vetting protocol, and an empirical self-audit of the agentic AI instrument. Presented as a replication and methods study, not peer-reviewed.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Draft / Hypothesis (not peer-reviewed)',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/machine_learning_g2_betti#article`,
      headline:
        'Machine Learning G2 Betti Numbers from Orientifold Calabi-Yau Data: A Leakage-Audited Predictive Test',
      url: `${SITE_URL}/papers/machine_learning_g2_betti`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['G2 manifolds', 'M-theory compactification', 'Calabi-Yau threefolds', 'Kreuzer-Skarke database', 'Machine learning in physics', 'Feature leakage'],
      abstract:
        'A test of whether the Betti numbers b2 and b3 of candidate G2 manifolds can be predicted from the underlying Calabi-Yau topology and a Z2 involution encoding, without access to the invariant eigenspace dimensions that trivially determine them. Using real entries from the public orientifold Calabi-Yau database derived from the Kreuzer-Skarke classification, a deep neural network is benchmarked against an ordinary-least-squares baseline on a held-out set of involution families with no training overlap. The network outperforms the baseline on the non-trivial target b2 and is outperformed on the linear-dominated b3; the mixed result is reported in full. A self-audit documents a prior version whose circular result and synthetic data were removed in revision. The smooth G2 resolution is assumed, not constructed. Presented as a leakage-audited methods study, not peer-reviewed.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Methods study (not peer-reviewed)',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/de_sitter_swampland_map#article`,
      headline:
        'The de Sitter Problem in the String Swampland: A Verified Literature Map',
      url: `${SITE_URL}/papers/de_sitter_swampland_map`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['de Sitter vacua', 'Swampland program', 'String theory landscape', 'KKLT construction', 'Large Volume Scenario', 'Dark Dimension'],
      abstract:
        'A literature map of the de Sitter problem in the string/M-theory swampland program: whether string theory admits stable or metastable de Sitter vacua, or whether quantum gravity forbids them. The map structures the debate around seven open problems — KKLT control, Large Volume Scenario control, the de Sitter Swampland Conjecture, the Dark Dimension, quintessence, the Dine-Seiberg problem, and Trans-Planckian Censorship — representing each camp\'s strongest arguments without adjudicating between them. Citations carry provenance tags distinguishing independently resolved identifiers from sourced-but-unaudited ones. A non-peer-reviewed synthesis and orientation tool, not original research.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Literature synthesis (not peer-reviewed; not original research)',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/retrograde_p9#article`,
      headline:
        'A Reproducible N-Body Pipeline and Numerical Convergence Framework for Retrograde Planet Nine Configurations',
      url: `${SITE_URL}/papers/retrograde_p9`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Planet Nine', 'Retrograde perturber', 'N-body simulation', 'REBOUND integrator', 'Extreme trans-Neptunian objects', 'Numerical convergence'],
      abstract:
        'A reproducible active point-mass N-body pipeline and numerical convergence framework for studying highly inclined, retrograde perturbers, built on REBOUND\'s adaptive ias15 solver rather than phase-averaged secular approximations. A 20,000-year proof-of-concept run projects early-phase dynamical drift into Cartesian Poincaré coordinates, coupled with an infrared detectability parameterization anchored to Fortney et al. (2016). The run is explicitly an initialization and boundary-validation phase confirming integrator stability prior to HPC-scale deployment; it spans roughly 1.55 perturber revolutions, four to five orders of magnitude short of the secular shepherding timescale, and reaches no physical shepherding conclusion by construction. A methods-and-infrastructure paper, not peer-reviewed.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Methods / infrastructure (not peer-reviewed; reaches no physical conclusion)',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/thermodynamic-isomorphism#article`,
      headline:
        'A Unified Nonlinear Dynamical Model of Thermodynamic Runaway: Structural Analogy Between Planetary Greenhouse Effects and Mesolimbic Dopaminergic Addiction',
      url: `${SITE_URL}/papers/thermodynamic-isomorphism`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Nonlinear dynamical systems', 'Runaway greenhouse effect', 'Mesolimbic dopamine pathway', 'Saddle-node bifurcation'],
      abstract:
        'A structural analogy between the runaway greenhouse effect and the collapse of the mesolimbic dopamine pathway, modeled as open dissipative systems whose saturating dissipation (the Ingersoll / clearance-Vmax ceiling) is overwhelmed by exogenous forcing, producing a saddle-node fold. The framework yields a falsifiable cross-domain prediction — shared early-warning signatures (critical slowing down, rising variance, rising lag-1 autocorrelation) near the threshold. The shared universality class is presented as a hypothesis for empirical investigation, not a demonstrated result.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Draft / Hypothesis (not peer-reviewed)',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/dissolving-self-ocean-planet#article`,
      headline:
        'Why the Dissolving Self Is Imagined as an Ocean Planet: Default Mode Network Downregulation in Altered States and the Cognitive Basis of the Neptune Metaphor',
      url: `${SITE_URL}/papers/dissolving-self-ocean-planet`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Default Mode Network', 'Altered states of consciousness', 'Conceptual metaphor', 'Structure-mapping theory', 'Cognitive science'],
      abstract:
        'A review of the neuroscience of self-attenuation in altered states (flow, meditation, psychedelics) and its association with prefrontal and default-mode downregulation, followed by a cognitive-science account of why this interior experience is metaphorically mapped onto a boundaryless ocean planet. Argues the planetary mapping is a fact about human metaphor formation, not a physical correspondence.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Draft / Hypothesis (not peer-reviewed)',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/commercial-fusion-viability#article`,
      headline:
        'Bridging the Chasm: From Scientific Break-Even to Commercial Fusion Power',
      url: `${SITE_URL}/papers/commercial-fusion-viability`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Nuclear fusion', 'Magnetic confinement', 'Inertial confinement fusion', 'Plasma physics', 'Fusion engineering'],
      abstract:
        'An AI-assisted technical synthesis of the engineering bottlenecks separating scientific break-even from commercial fusion power, covering magnetic and inertial confinement, the engineering-gain derivation, first-wall materials, and muon-catalyzed fusion. A review of public literature, not original research; quantitative figures are pending independent verification.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Synthesis review (not peer-reviewed; figures pending verification)',
    },
        {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/chronobiological-entrainment#article`,
      headline:
        'Chronobiological Entrainment as a Primary Modality for Endocrine Homeostasis',
      url: `${SITE_URL}/papers/chronobiological-entrainment`,
      datePublished: '2026-02',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Circadian rhythm', 'Chronobiology', 'Metabolic syndrome', 'Time-restricted eating', 'Suprachiasmatic nucleus'],
      abstract:
        'A hypothesis and literature synthesis proposing that circadian misalignment between central and peripheral metabolic clocks is an underweighted, independent contributor to metabolic dysfunction, with a proposed isocaloric RCT to test it. Stated at hypothesis level; not peer-reviewed.',
      isAccessibleForFree: true,
      creator: [
        { '@id': `${SITE_URL}/#architect` },
        { '@type': 'SoftwareApplication', name: 'Google Antigravity (agentic model)' },
      ],
      creativeWorkStatus: 'Hypothesis / synthesis (not peer-reviewed)',
    },
  ],
};

export default function ResearchHomepage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 font-sans selection:bg-indigo-500 selection:text-white p-8 md:p-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(researchHomeLd) }}
      />
      <div className="max-w-4xl w-full mx-auto">
        
        {/* TOP NAVIGATION */}
        <nav className="mb-20 flex flex-wrap items-center justify-between border-b border-zinc-800 pb-4 gap-4">
          <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            Maha Strategies <span className="text-indigo-400">///</span> Research & Architecture
          </div>
          <div className="flex gap-6">
            <a href="#manifesto" className="font-mono text-[10px] tracking-widest text-zinc-400 hover:text-indigo-400 uppercase transition-colors">
              [ The Manifesto ]
            </a>
            <a href="https://www.mayonemaharajan.com" target="_blank" rel="noreferrer" className="font-mono text-[10px] tracking-widest text-zinc-400 hover:text-indigo-400 uppercase transition-colors">
              [ Conceptual Architect ]
            </a>
          </div>
        </nav>

        {/* HERO / VISION */}
        <header className="mb-24">
          <div className="w-16 h-1 bg-gradient-to-r from-zinc-500 to-indigo-500 mb-8"></div>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide uppercase text-white mb-6 leading-tight">
            Human-AI Collaborative <br />
            <span className="text-zinc-500">Scientific Architecture</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 tracking-wide font-light leading-relaxed max-w-2xl border-l border-indigo-500/30 pl-4">
            An avant-garde open-access research project dedicated to exploring cross-disciplinary structural analogies. We treat artificial intelligence not as a surrogate author, but as an advanced cognitive instrument for synthesizing complex theoretical frameworks under rigorous human curation.
          </p>
        </header>

        {/* PUBLISHED RESEARCH LIST */}
        <section className="mb-32">
          <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase border-b border-zinc-800 pb-2 mb-8">
            Vol. 1 — Inaugural Synthesis
          </div>

          {/* Lead Paper Item — Planet Nine */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mb-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Astronomy / Statistical Forecasting / Orbital Dynamics
                </div>
                <Link href="/papers/planet-nine-forecast">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    A Monte Carlo Forecast for the Detection of Planet Nine
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A Monte Carlo forecast (N = 100,000) of where, when, and by which instrument the hypothesized Planet Nine would most plausibly be detected &mdash; propagating a weighted three-model parameter ensemble through Kepler orbit simulation, applying existing survey masks, and modeling LSST, Subaru/HSC, and infrared detection through 2036. The planet is treated as an unproven hypothesis; the analysis quantifies detectability and a null-detection posterior rather than asserting existence.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/planet-nine-forecast" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

          {/* eTNO Clustering Audit */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mb-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Astronomy / Replication / Survey Selection Bias
                </div>
                <Link href="/papers/the_perturber_question">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    The Perturber Question Under Audit
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A replication of the extreme trans-Neptunian object orbital-clustering test on the fully characterized CFEPS/OSSOS sample, using an independent Python selection-function pipeline benchmarked against the official Fortran SurveySimulator. The reconstructed sample shows no statistically significant clustering &mdash; robust to implementation choice and directionally consistent with Napier et al. (2021). Includes a composition-agnostic hypothesis matrix, a candidate vetting protocol, and an empirical self-audit of the agentic AI instrument.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/the_perturber_question" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

          {/* New Lead Paper Item — Synaptic Plasticity */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mb-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Computational Neuroscience / Symbolic Regression
                </div>
                <Link href="/papers/readout_plasticity_paper">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    Evolving Local Synaptic Plasticity Rules to Track Representational Drift
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A study implementing a grammar-constrained symbolic regression framework to systematically discover optimal local plasticity rules governing the readout weights of an empirical neural population. The framework systematically discovered homeostatic Hebbian rules that out-perform prior hand-crafted baselines in tracking representational drift.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/readout_plasticity_paper" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

          {/* G2 Manifold ML */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mb-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  M-Theory / Machine Learning / Methods
                </div>
                <Link href="/papers/machine_learning_g2_betti">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    Machine Learning G2 Betti Numbers from Orientifold Calabi-Yau Data
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A leakage-audited test of whether a neural network can predict the Betti numbers of candidate G2 manifolds from real Kreuzer-Skarke-derived Calabi-Yau topology and a Z2 involution encoding, benchmarked against a linear baseline. The network wins on the non-trivial target and loses on the linear-dominated one &mdash; the mixed result is reported in full. Includes a self-audit of a prior version whose circular result and synthetic data were removed in revision. The smooth G2 resolution is assumed, not constructed.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/machine_learning_g2_betti" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

          {/* de Sitter Swampland Map */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mb-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  String Theory / Literature Synthesis / Swampland
                </div>
                <Link href="/papers/de_sitter_swampland_map">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    The de Sitter Problem in the String Swampland: A Verified Literature Map
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A verified map of the contested de Sitter problem in the string/M-theory swampland program, structured around seven open problems and their competing camps &mdash; KKLT control, the Large Volume Scenario, the de Sitter Swampland Conjecture, the Dark Dimension, quintessence, Dine-Seiberg, and Trans-Planckian Censorship. Each camp's strongest arguments are represented without adjudication, and citations carry provenance tags marking which identifiers were independently resolved. A synthesis and orientation tool, not original research.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/de_sitter_swampland_map" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

          {/* Retrograde Planet Nine Pipeline */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mb-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Astronomy / N-Body Methods / Infrastructure
                </div>
                <Link href="/papers/retrograde_p9">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    A Reproducible N-Body Pipeline for Retrograde Planet Nine Configurations
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A reproducible active point-mass N-body pipeline and numerical convergence framework for studying highly inclined retrograde perturbers, built on REBOUND's ias15 solver rather than phase-averaged secular approximations, with a coupled infrared detectability parameterization. The 20,000-year proof-of-concept run is explicitly an integrator-stability and boundary-validation phase &mdash; roughly 1.55 perturber revolutions, far short of the secular shepherding timescale &mdash; and reaches no shepherding conclusion by construction.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/retrograde_p9" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>


          {/* Featured Paper Item */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Systems Theory / Neurobiology / Astrophysics
                </div>
                <Link href="/papers/thermodynamic-isomorphism">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    A Unified Nonlinear Dynamical Model of Thermodynamic Runaway
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A mathematical framework proposing a structural analogy between the runaway greenhouse effect and the collapse of the mesolimbic dopamine pathway — and deriving a falsifiable cross-domain prediction of shared early-warning signatures near the tipping point. The shared universality class is advanced as a hypothesis, not a demonstrated result.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/thermodynamic-isomorphism" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

          {/* Second entry */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mt-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Cognitive Science / Philosophy of Mind / Neuroscience
                </div>
                <Link href="/papers/dissolving-self-ocean-planet">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    Why the Dissolving Self Is Imagined as an Ocean Planet
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A review of the neuroscience of self-attenuation in altered states &mdash; its association with prefrontal and default-mode network downregulation &mdash; and a cognitive-science account of why this interior experience is metaphorically mapped onto a boundaryless ocean planet. The planetary mapping is treated as a fact about human metaphor formation, not a physical correspondence.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            <Link href="/papers/dissolving-self-ocean-planet" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

                    {/* Chronobiology entry */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mt-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Chronobiology / Metabolic Health / Hypothesis
                </div>
                <Link href="/papers/chronobiological-entrainment">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    Chronobiological Entrainment as a Primary Modality for Endocrine Homeostasis
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                Feb 2026
              </div>
            </div>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              The "Circadian Fortress" hypothesis: a synthesis proposing that misalignment between the central (SCN) and peripheral metabolic clocks is an underweighted, independent contributor to metabolic dysfunction &mdash; with an isocaloric randomized trial proposed to test whether circadian timing matters independently of calories. Stated at hypothesis level; not a clinical conclusion.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>
            <Link href="/papers/chronobiological-entrainment" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>
        </section>

          {/* Third entry */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mt-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Technical Synthesis / Fusion Energy Engineering
                </div>
                <Link href="/papers/commercial-fusion-viability">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    Bridging the Chasm: From Scientific Break-Even to Commercial Fusion Power
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              An AI-assisted synthesis of the engineering bottlenecks between scientific break-even and commercial fusion power &mdash; magnetic and inertial confinement, the engineering-gain derivation, first-wall materials, and muon-catalyzed fusion. A review of public literature rather than a cross-disciplinary analogy; quantitative figures are flagged as pending independent verification.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Synthesis Instrument</span>
                <span className="text-xs text-zinc-300">Google Antigravity (agentic model)</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Architected By</span>
                <span className="text-xs text-zinc-300">Mayone Maha Rajan</span>
              </div>
            </div>

            

            <Link href="/papers/commercial-fusion-viability" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

        {/* MANIFESTO SECTION */}
        <section id="manifesto" className="scroll-mt-24 border-t border-zinc-800/50 pt-16">
          <h2 className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase border-b border-zinc-800 pb-2 mb-12 font-normal">
            The Architect&rsquo;s Method : A Note on Human-AI Synthesis
          </h2>

          {/* Custom Prose Classes for the Cybernetic Aesthetic */}
          <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-light prose-headings:tracking-wide prose-h3:text-indigo-400 prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-widest prose-h3:font-mono prose-p:text-zinc-400 prose-p:font-light prose-p:leading-relaxed prose-blockquote:border-l-indigo-500 prose-blockquote:bg-[#121214] prose-blockquote:p-6 prose-blockquote:not-italic prose-blockquote:text-zinc-300 prose-li:text-zinc-400">
            
            <h3>I. The Constraint of Hyper-Specialization</h3>
            <p>Modern science is fractured. The neurobiologist does not read the astrophysicist; the astrophysicist does not speak to the thermodynamic engineer. Human cognition is naturally constrained by the sheer volume of specialized literature, which can obscure structural parallels that run across disciplines. We are rich in data but starved of synthesis.</p>

            <h3>II. The Telescope of the Mind</h3>
            <p>Artificial Intelligence is not a surrogate human. It is not an author, a peer, or a replacement for the scientific method. Rather, it is a cognitive instrument. Just as the telescope allowed the astronomer to see beyond the limits of the biological eye, agentic AI allows the human mind to perceive structural analogies across vast, disconnected disciplines. We use AI to collapse the boundaries between planetary physics and mesolimbic neurobiology.</p>

            <h3>III. The Separation of Generation and Architecture</h3>
            <p>Traditional authorship implies total, manual creation. In the era of human-AI collaboration, this definition is obsolete and intellectually dishonest. We propose a new framework:</p>
            <ul>
              <li><strong>The Synthesizer (AI):</strong> The agentic entity responsible for navigating vast datasets, connecting disparate terminologies, and generating the structural text and mathematical correlations.</li>
              <li><strong>The Architect (Human):</strong> The visionary who curates the prompt, directs the epistemological inquiry, challenges the output, and grounds the agent's synthesis in reality.</li>
            </ul>

            <h3>IV. Radical Transparency</h3>
            <p>We reject the practice of passing off AI-generated synthesis as human-authored work. Every paper published within this project operates under radical transparency. The agentic models used, the human curation applied, and the exact boundaries of the collaboration are explicitly labeled.</p>

            <h3>V. The Mandate of Empirical Verification</h3>
            <p>The frameworks generated here are not peer-reviewed facts; they are hypotheses and conceptual provocations meant to spark actual, physical, empirical research in traditional laboratories. We provide the architectural blueprint; it is up to the human scientific community to build the house.</p>

            <blockquote>
              The future of human knowledge does not belong to the solitary genius, nor does it belong to the autonomous machine. It belongs to the Architect who knows how to conduct the synthesis.
            </blockquote>
          </div>
        </section>

      </div>
    </div>
  );
}