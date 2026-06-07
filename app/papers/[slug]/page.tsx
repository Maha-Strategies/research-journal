import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// CRITICAL: This CSS file is required to render the LaTeX equations properly
import 'katex/dist/katex.min.css';

const SITE_URL = 'https://research.mahastrategies.com';

// Per-paper metadata. Add an entry here when you publish a new paper.
// Keyed by slug (the markdown filename without .md).
const PAPER_META: Record<
  string,
  {
    title: string;
    description: string;
    about: string[];
    abstract: string;
  }
> = {
  'planet-nine-forecast': {
    title:
      'A Monte Carlo Forecast for the Detection of Planet Nine',
    description:
      'A Monte Carlo forecast (N = 100,000) of the detectability of the hypothesized Planet Nine: a weighted three-model parameter ensemble propagated through Kepler orbit simulation, with existing survey masks and forward models for LSST, Subaru/HSC, and infrared surveys through 2036. Treats existence as an unproven hypothesis.',
    about: [
      'Planet Nine',
      'Trans-Neptunian objects',
      'Monte Carlo simulation',
      'Vera C. Rubin Observatory',
      'Orbital mechanics',
    ],
    abstract:
      'A Monte Carlo forecast of where, when, and by which instrument an undetected trans-Neptunian super-Earth would most plausibly be found, propagating a weighted three-model parameter ensemble through Kepler orbit simulation, applying existing survey null-detection masks, and modeling future detection by LSST, Subaru/HSC, and infrared surveys through 2036. Reports a null-detection posterior and does not claim the planet exists.',
  },
  'thermodynamic-isomorphism': {
    title:
      'A Structural Analogy Between Planetary Greenhouse Runaway and Dopaminergic Addiction',
    description:
      'A nonlinear dynamical-systems analysis proposing that the runaway greenhouse effect and mesolimbic dopamine collapse share a saddle-node bifurcation. Presented as a testable hypothesis, not a peer-reviewed result.',
    about: [
      'Saddle-node bifurcation',
      'Runaway greenhouse effect',
      'Mesolimbic dopamine',
      'Nonlinear dynamics',
      'Dissipative systems',
    ],
    abstract:
      'A structural analogy between the runaway greenhouse effect and the collapse of the mesolimbic dopamine pathway, modeled as open dissipative systems that lose negative feedback and undergo a saddle-node bifurcation under exogenous forcing. Presented as a hypothesis for empirical investigation.',
  },
  'dissolving-self-ocean-planet': {
    title:
      'Why the Dissolving Self Is Imagined as an Ocean Planet: DMN Downregulation and the Cognitive Basis of the Neptune Metaphor',
    description:
      'A review of the neuroscience of self-attenuation in altered states (flow, meditation, psychedelics) and its association with prefrontal and default-mode downregulation, with a cognitive-science account of why the experience is mapped onto a boundaryless ocean planet. The mapping is cognitive, not physical.',
    about: [
      'Default Mode Network',
      'Altered states of consciousness',
      'Conceptual metaphor',
      'Structure-mapping theory',
      'Cognitive science',
    ],
    abstract:
      'A review of the neuroscience of self-attenuation in altered states and its association with prefrontal and default-mode downregulation, followed by a cognitive-science account of why this interior experience is metaphorically mapped onto a boundaryless ocean planet. Argues the planetary mapping is a fact about human metaphor formation, not a physical correspondence.',
  },
  'commercial-fusion-viability': {
    title:
      'Bridging the Chasm: From Scientific Break-Even to Commercial Fusion Power',
    description:
      'An AI-assisted technical synthesis of the engineering bottlenecks separating scientific break-even from commercial fusion power: magnetic and inertial confinement, the engineering-gain derivation, first-wall materials, and muon-catalyzed fusion. A review of public literature, not original research; quantitative figures pending independent verification.',
    about: [
      'Nuclear fusion',
      'Magnetic confinement fusion',
      'Inertial confinement fusion',
      'Plasma physics',
      'Fusion engineering',
    ],
    abstract:
      'An AI-assisted technical synthesis of the bottlenecks between scientific break-even and commercial fusion power, covering tokamak/stellarator/ICF confinement, the engineering-gain (Q_eng) derivation, first-wall neutron-damage materials, and muon-catalyzed fusion. A review of publicly available literature rather than original research; quantitative claims are flagged for independent verification.',
  },
    'chronobiological-entrainment': {
    title:
      'Chronobiological Entrainment as a Primary Modality for Endocrine Homeostasis',
    description:
      'The "Circadian Fortress" hypothesis: an AI-assisted synthesis proposing that circadian misalignment between central (SCN) and peripheral metabolic clocks is an underweighted, independent contributor to metabolic dysfunction, with a proposed isocaloric RCT to test it. Stated at hypothesis level; not peer-reviewed.',
    about: [
      'Circadian rhythm',
      'Chronobiology',
      'Metabolic syndrome',
      'Time-restricted eating',
      'Suprachiasmatic nucleus',
    ],
    abstract:
      'A hypothesis and literature synthesis proposing that metabolic dysfunction is, in substantial part, a systems-level failure of temporal architecture rather than purely caloric thermodynamics. Proposes the "Circadian Fortress" model synchronizing photic and non-photic zeitgebers, and an isocaloric randomized controlled trial designed to test whether circadian timing is an independent contributor to metabolic health. Stated at hypothesis level; not peer-reviewed.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = PAPER_META[slug];
  if (!meta) {
    return { title: 'Paper | Maha Strategies Research' };
  }
  const url = `${SITE_URL}/papers/${slug}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: `${meta.title} | Maha Strategies Research`,
    description: meta.description,
    alternates: { canonical: `/papers/${slug}` },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Maha Strategies Research',
      title: meta.title,
      description: meta.description,
      images: [{ url: '/og-research.png', width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/og-research.png'],
    },
  };
}

function getPaperContent(slug: string) {
    const papersDirectory = path.join(process.cwd(), 'content/papers');
    const fullPath = path.join(papersDirectory, `${slug}.md`);
    
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return fileContents;
    } catch (error) {
      console.log("❌ FAILED TO FIND FILE AT: ", fullPath);
      console.error(error); 
      return null; 
    }
  }

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const content = getPaperContent(resolvedParams.slug);

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center font-mono">
        <h1>404 - Paper Not Found</h1>
      </div>
    );
  }

  const meta = PAPER_META[resolvedParams.slug];
  const articleLd = meta
    ? {
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        '@id': `${SITE_URL}/papers/${resolvedParams.slug}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/papers/${resolvedParams.slug}`,
        },
        headline: meta.title,
        url: `${SITE_URL}/papers/${resolvedParams.slug}`,
        datePublished: '2026-06',
        inLanguage: 'en',
        author: {
          '@type': 'Person',
          name: 'Mayone Maha Rajan',
          url: 'https://www.mayonemaharajan.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Maha Strategies',
          url: 'https://www.mahastrategies.com',
        },
        about: meta.about,
        abstract: meta.abstract,
        creativeWorkStatus: 'Draft / Hypothesis (not peer-reviewed)',
        isAccessibleForFree: true,
      }
    : null;

  // Generate a safe BibTeX key by stripping hyphens from the slug
  const bibtexKey = `rajan2026${resolvedParams.slug.replace(/-/g, '')}`;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 font-sans selection:bg-indigo-500 selection:text-white p-8 md:p-24">
      {articleLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      )}
      <div className="max-w-3xl w-full mx-auto">
        
        {/* BACK NAVIGATION */}
        <nav className="mb-16 border-b border-zinc-800 pb-4">
          <Link href="/" className="font-mono text-[10px] tracking-widest text-zinc-500 hover:text-indigo-400 uppercase transition-colors">
            &#8592; Return to Index
          </Link>
        </nav>

        {/* MARKDOWN RENDERER */}
        <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-light prose-headings:tracking-wide prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-pre:bg-[#121214] prose-pre:border prose-pre:border-zinc-800">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* CITATION BLOCK */}
        {meta && (
          <div className="mt-20 bg-[#121214] border border-zinc-800 p-6 md:p-8 rounded-lg">
            <h3 className="text-zinc-300 font-mono text-xs uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
              Cite This Work
            </h3>
            
            <div className="mb-6">
              <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">APA Format</h4>
              <p className="text-zinc-400 text-sm leading-relaxed select-all">
                Rajan, M. M. (2026). {meta.title}. <em>Maha Strategies Research</em>. {`${SITE_URL}/papers/${resolvedParams.slug}`}
              </p>
            </div>

            <div>
              <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">BibTeX</h4>
              <pre className="text-zinc-400 text-xs overflow-x-auto p-4 bg-[#0a0a0c] border border-zinc-800 rounded select-all font-mono whitespace-pre">
{`@article{${bibtexKey},
  title={${meta.title}},
  author={Rajan, Mayone Maha},
  journal={Maha Strategies Research},
  year={2026},
  url={${SITE_URL}/papers/${resolvedParams.slug}}
}`}
              </pre>
            </div>
            
            {/* Note about DOI if you upload to Zenodo later */}
            <p className="mt-4 text-zinc-600 text-xs italic">
              Note: If citing a specific version archived on Zenodo, please append the relevant DOI to the formats above.
            </p>
          </div>
        )}

        {/* HUMAN-IN-THE-LOOP DISCLAIMER */}
        <div className="mt-16 pt-8 border-t border-zinc-800 text-xs text-zinc-500 font-mono leading-relaxed">
          <strong className="text-zinc-400 uppercase tracking-widest">Architect's Note:</strong> This manuscript was synthesized by an AI agent (Antigravity) and architected by a human curator. The frameworks and analyses presented herein are intended to spark empirical cross-disciplinary research and should not be treated as peer-reviewed scientific fact without further independent verification.
        </div>

      </div>
    </div>
  );
}