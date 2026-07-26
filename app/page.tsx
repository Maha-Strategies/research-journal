// app/page.tsx (research.mahastrategies.com) — SEO + AIO optimized
// Server component (no 'use client').
// Preserves all original visual content, only metadata + JSON-LD improved for SEO/AIO.

import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://research.mahastrategies.com';
const ORG_URL = 'https://www.mahastrategies.com';
const AUTHOR_URL = 'https://www.mayonemaharajan.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Maha Strategies Research | Human-AI Synthesis Lab',
    template: '%s | Maha Strategies Research',
  },
  description:
    'Open-access research project using agentic AI as a synthesis instrument under human curation. Cross-disciplinary structural analogies presented as testable hypotheses, not peer-reviewed conclusions.',
  authors: [{ name: 'Mayone Maha Rajan', url: AUTHOR_URL }],
  creator: 'Mayone Maha Rajan',
  publisher: 'Maha Strategies',
  category: 'Science',
  classification: 'Research',
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Maha Strategies Research',
    title: 'Maha Strategies Research & Architecture',
    description:
      'Human-AI collaborative synthesis: cross-disciplinary structural analogies presented as testable hypotheses under human curation.',
    images: [{ url: `${SITE_URL}/og-research.png`, width: 1200, height: 630, alt: 'Maha Strategies Research & Architecture - Human-AI Synthesis Lab' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maha Strategies Research & Architecture',
    description: 'Human-AI collaborative synthesis of cross-disciplinary structural analogies.',
    images: [`${SITE_URL}/og-research.png`],
    creator: '@mayon_rajan',
  },
};

// JSON-LD: Full valid graph for Google + LLM entity resolution
// Dates are full ISO 8601. About fields use sameAs for AIO disambiguation.
export const researchHomeLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: 'Maha Strategies',
      url: ORG_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
        caption: 'Maha Strategies',
      },
      sameAs: [ORG_URL],
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#architect`,
      name: 'Mayone Maha Rajan',
      url: AUTHOR_URL,
      jobTitle: 'Research Architect and Curator',
      affiliation: { '@id': `${SITE_URL}/#org` },
      sameAs: [AUTHOR_URL, 'https://www.linkedin.com/in/mayonemaharajan', 'https://x.com/mayon_rajan'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Maha Strategies Research & Architecture',
      description:
        'An open-access research project applying agentic AI, under human curation, to surface cross-disciplinary structural analogies as testable hypotheses.',
      publisher: { '@id': `${SITE_URL}/#org` },
      inLanguage: 'en',
      isAccessibleForFree: true,
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/#collection`,
      url: SITE_URL,
      name: 'Maha Strategies Research & Architecture',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      description:
        'Cross-disciplinary structural analogies generated via human-curated agentic AI synthesis, presented as testable hypotheses for empirical verification.',
      inLanguage: 'en',
      isAccessibleForFree: true,
      about: {
        '@type': 'Thing',
        name: 'Cross-disciplinary research synthesis',
        sameAs: 'https://en.wikipedia.org/wiki/Interdisciplinarity',
      },
      hasPart: [
        { '@id': `${SITE_URL}/papers/the-maha-framework#article` },
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
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumbs`,
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Research Home', item: SITE_URL }],
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#paper-list`,
      name: 'Published Research Papers',
      itemListElement: [
        { '@type': 'ListItem', position: 1, url: `${SITE_URL}/papers/the-maha-framework`, name: 'The M·A·H·A Framework' },
        { '@type': 'ListItem', position: 2, url: `${SITE_URL}/papers/planet-nine-forecast`, name: 'A Monte Carlo Forecast for the Detection of Planet Nine' },
        { '@type': 'ListItem', position: 3, url: `${SITE_URL}/papers/the_perturber_question`, name: 'The Perturber Question Under Audit' },
        { '@type': 'ListItem', position: 4, url: `${SITE_URL}/papers/readout_plasticity_paper`, name: 'Evolving Local Synaptic Plasticity Rules to Track Representational Drift' },
        { '@type': 'ListItem', position: 5, url: `${SITE_URL}/papers/machine_learning_g2_betti`, name: 'Machine Learning G2 Betti Numbers from Orientifold Calabi-Yau Data' },
        { '@type': 'ListItem', position: 6, url: `${SITE_URL}/papers/de_sitter_swampland_map`, name: 'The de Sitter Problem in the String Swampland' },
        { '@type': 'ListItem', position: 7, url: `${SITE_URL}/papers/retrograde_p9`, name: 'A Reproducible N-Body Pipeline for Retrograde Planet Nine Configurations' },
        { '@type': 'ListItem', position: 8, url: `${SITE_URL}/papers/thermodynamic-isomorphism`, name: 'A Unified Nonlinear Dynamical Model of Thermodynamic Runaway' },
        { '@type': 'ListItem', position: 9, url: `${SITE_URL}/papers/dissolving-self-ocean-planet`, name: 'Why the Dissolving Self Is Imagined as an Ocean Planet' },
        { '@type': 'ListItem', position: 10, url: `${SITE_URL}/papers/chronobiological-entrainment`, name: 'Chronobiological Entrainment as a Primary Modality for Endocrine Homeostasis' },
        { '@type': 'ListItem', position: 11, url: `${SITE_URL}/papers/commercial-fusion-viability`, name: 'Bridging the Chasm: From Scientific Break-Even to Commercial Fusion Power' },
      ],
    },
    // --- ScholarlyArticles: full ISO dates, entity-linked about, license, image ---
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/the-maha-framework#article`,
      headline: 'The M·A·H·A Framework: An Integrative Architecture for Resisting Systemic Metabolic, Attentional, and Relational Extraction',
      url: `${SITE_URL}/papers/the-maha-framework`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/papers/the-maha-framework` },
      datePublished: '2026-06-01',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/the-maha-framework.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      keywords: 'M·A·H·A Framework, Metabolic health, Attention economy, Cognitive liberty, Commons governance, Systems thermodynamics',
      about: [
        { '@type': 'DefinedTerm', name: 'Metabolic health', sameAs: 'https://en.wikipedia.org/wiki/Metabolic_syndrome' },
        { '@type': 'DefinedTerm', name: 'Attention economy', sameAs: 'https://en.wikipedia.org/wiki/Attention_economy' },
      ],
      abstract: 'This paper formalizes the M·A·H·A (Mindfulness, Authenticity, Health, Action) framework as an integrative socio-biological model designed to resist the compounding crises of the early twenty-first century.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/planet-nine-forecast#article`,
      headline: 'A Monte Carlo Forecast for the Detection of Planet Nine',
      url: `${SITE_URL}/papers/planet-nine-forecast`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-05',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/planet-nine-forecast.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      about: [
        { '@type': 'Thing', name: 'Planet Nine', sameAs: 'https://www.wikidata.org/wiki/Q19893910' },
        { '@type': 'Thing', name: 'Vera C. Rubin Observatory', sameAs: 'https://www.wikidata.org/wiki/Q472095' },
      ],
      abstract: 'A Monte Carlo forecast (N = 100,000) of the detectability of the hypothesized Planet Nine, propagating a weighted three-model parameter ensemble through Kepler orbit simulation, applying existing survey null-detection masks, and modeling future detection by LSST, Subaru/HSC, and infrared surveys through 2036.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/the_perturber_question#article`,
      headline: 'The Perturber Question Under Audit: An Agentic-AI Replication of the eTNO Clustering Test and a Composition-Agnostic Hypothesis Synthesis',
      url: `${SITE_URL}/papers/the_perturber_question`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-08',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/the_perturber_question.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'A replication and audit study testing whether the extreme trans-Neptunian object orbital-clustering signal survives selection-bias modeling in fully characterized surveys.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/readout_plasticity_paper#article`,
      headline: 'Evolving Local Synaptic Plasticity Rules to Track Representational Drift',
      url: `${SITE_URL}/papers/readout_plasticity_paper`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-07',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/readout_plasticity_paper.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'A grammar-constrained symbolic regression framework to discover optimal local plasticity rules governing readout weights tracking representational drift.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/machine_learning_g2_betti#article`,
      headline: 'Machine Learning G2 Betti Numbers from Orientifold Calabi-Yau Data: A Leakage-Audited Predictive Test',
      url: `${SITE_URL}/papers/machine_learning_g2_betti`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-10',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/machine_learning_g2_betti.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'A leakage-audited test of whether Betti numbers of candidate G2 manifolds can be predicted from real Kreuzer-Skarke-derived Calabi-Yau topology.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/de_sitter_swampland_map#article`,
      headline: 'The de Sitter Problem in the String Swampland: A Verified Literature Map',
      url: `${SITE_URL}/papers/de_sitter_swampland_map`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-10',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/de_sitter_swampland_map.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'A verified literature map of the de Sitter problem in the string/M-theory swampland program structured around seven open problems.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/retrograde_p9#article`,
      headline: 'A Reproducible N-Body Pipeline and Numerical Convergence Framework for Retrograde Planet Nine Configurations',
      url: `${SITE_URL}/papers/retrograde_p9`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-09',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/retrograde_p9.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'A reproducible active point-mass N-body pipeline and convergence framework built on REBOUND ias15 solver for retrograde perturbers.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/thermodynamic-isomorphism#article`,
      headline: 'A Unified Nonlinear Dynamical Model of Thermodynamic Runaway: Structural Analogy Between Planetary Greenhouse Effects and Mesolimbic Dopaminergic Addiction',
      url: `${SITE_URL}/papers/thermodynamic-isomorphism`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-03',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/thermodynamic-isomorphism.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      about: [
        { '@type': 'Thing', name: 'Saddle-node bifurcation', sameAs: 'https://en.wikipedia.org/wiki/Saddle-node_bifurcation' },
        { '@type': 'Thing', name: 'Runaway greenhouse effect', sameAs: 'https://en.wikipedia.org/wiki/Runaway_greenhouse_effect' },
        { '@type': 'Thing', name: 'Mesolimbic pathway', sameAs: 'https://en.wikipedia.org/wiki/Mesolimbic_pathway' },
      ],
      abstract: 'A structural analogy between runaway greenhouse effect and mesolimbic dopamine collapse as saddle-node fold in open dissipative systems.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/dissolving-self-ocean-planet#article`,
      headline: 'Why the Dissolving Self Is Imagined as an Ocean Planet: Default Mode Network Downregulation in Altered States and the Cognitive Basis of the Neptune Metaphor',
      url: `${SITE_URL}/papers/dissolving-self-ocean-planet`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-04',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/dissolving-self-ocean-planet.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'A review of self-attenuation neuroscience and why interior experience is mapped onto ocean planet metaphor via structure-mapping theory.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/chronobiological-entrainment#article`,
      headline: 'Chronobiological Entrainment as a Primary Modality for Endocrine Homeostasis',
      url: `${SITE_URL}/papers/chronobiological-entrainment`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-02-15',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/chronobiological-entrainment.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'Hypothesis that circadian misalignment between central and peripheral clocks is an underweighted contributor to metabolic dysfunction.',
    },
    {
      '@type': 'ScholarlyArticle',
      '@id': `${SITE_URL}/papers/commercial-fusion-viability#article`,
      headline: 'Bridging the Chasm: From Scientific Break-Even to Commercial Fusion Power',
      url: `${SITE_URL}/papers/commercial-fusion-viability`,
      isPartOf: { '@id': `${SITE_URL}/#collection` },
      datePublished: '2026-06-02',
      dateModified: '2026-06-11',
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#architect` },
      publisher: { '@id': `${SITE_URL}/#org` },
      image: `${SITE_URL}/og/commercial-fusion-viability.png`,
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      abstract: 'AI-assisted synthesis of engineering bottlenecks between scientific break-even and commercial fusion power.',
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
            <a href="https://www.mahastrategies.com/about" target="_blank" rel="noreferrer" className="font-mono text-[10px] tracking-widest text-zinc-400 hover:text-indigo-400 uppercase transition-colors">
              [ Publisher ]
            </a>
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

          {/* Lead Paper Item — The M·A·H·A Framework */}
          <article className="group relative border border-zinc-800/50 bg-[#121214] p-8 mb-6 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest">
                  Systems Theory / Socio-Biology / Framework
                </div>
                <Link href="/papers/the-maha-framework">
                  <h2 className="text-2xl text-white font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    The M·A·H·A Framework: An Integrative Architecture for Resisting Systemic Extraction
                  </h2>
                </Link>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase whitespace-nowrap">
                June 2026
              </div>
            </div>

            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
              A formalization of the M·A·H·A (Mindfulness, Authenticity, Health, Action) framework as an integrative socio-biological model. This paper proposes that contemporary metabolic, attentional, and relational pathologies may be productively understood not as isolated public health failures, but as coupled downstream consequences of a single, structurally extractive economic architecture.
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

            <Link href="/papers/the-maha-framework" className="absolute top-8 right-8 text-zinc-500 group-hover:text-indigo-400 transition-colors">
              &#8599;
            </Link>
          </article>

          {/* Planet Nine */}
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

          {/* Synaptic Plasticity */}
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


          {/* Thermodynamic Isomorphism */}
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

          {/* Dissolving Self Ocean Planet */}
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

          {/* Fusion Energy */}
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
