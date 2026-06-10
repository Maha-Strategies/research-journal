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
        { '@id': `${SITE_URL}/papers/thermodynamic-isomorphism#article` },
        { '@id': `${SITE_URL}/papers/dissolving-self-ocean-planet#article` },
        { '@id': `${SITE_URL}/papers/commercial-fusion-viability#article` },
        { '@id': `${SITE_URL}/papers/chronobiological-entrainment#article` },
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
      '@id': `${SITE_URL}/papers/thermodynamic-isomorphism#article`,
      headline:
        'A Unified Nonlinear Dynamical Model of Thermodynamic Runaway: Structural Analogy Between Planetary Greenhouse Effects and Mesolimbic Dopaminergic Addiction',
      url: `${SITE_URL}/papers/thermodynamic-isomorphism`,
      datePublished: '2026-06',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      about: ['Nonlinear dynamical systems', 'Runaway greenhouse effect', 'Mesolimbic dopamine pathway', 'Saddle-node bifurcation'],
      abstract:
        'A structural analogy between the runaway greenhouse effect and the collapse of the mesolimbic dopamine pathway, modeled as open dissipative systems that lose negative feedback and undergo a saddle-node bifurcation under exogenous forcing. Presented as a hypothesis for empirical investigation.',
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
              A mathematical framework proposing a structural analogy between the runaway greenhouse effect in planetary astrophysics and the pathological collapse of the mammalian mesolimbic dopamine pathway.
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