import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// CRITICAL: This CSS file is required to render the LaTeX equations properly
import 'katex/dist/katex.min.css';

// YOUR CUSTOM INTERACTIVE COMPONENTS
import MonteCarloChart from '@/components/MonteCarloChart';
import RunawayBifurcation from '@/components/RunawayBifurcation';

const SITE_URL = 'https://research.mahastrategies.com';

// Per-paper metadata. Add an entry here when you publish a new paper.
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
    title: 'A Monte Carlo Forecast for the Detection of Planet Nine',
    description: 'A Monte Carlo forecast (N = 100,000) of the detectability of the hypothesized Planet Nine...',
    about: ['Planet Nine', 'Trans-Neptunian objects', 'Monte Carlo simulation', 'Vera C. Rubin Observatory', 'Orbital mechanics'],
    abstract: 'A Monte Carlo forecast of where, when, and by which instrument an undetected trans-Neptunian super-Earth would most plausibly be found...',
  },
  'thermodynamic-isomorphism': {
    title: 'A Unified Nonlinear Dynamical Model of Thermodynamic Runaway: Structural Analogy Between Planetary Greenhouse Effects and Mesolimbic Dopaminergic Addiction',
    description:
      'A nonlinear dynamical-systems framework proposing that the runaway greenhouse effect and mesolimbic dopamine collapse share a saddle-node (fold) bifurcation, and deriving a falsifiable cross-domain prediction of shared early-warning signatures near the tipping point. The shared universality class is advanced as a hypothesis, not a demonstrated result.',
    about: [
      'Saddle-node bifurcation',
      'Runaway greenhouse effect',
      'Mesolimbic dopamine',
      'Nonlinear dynamics',
      'Dissipative systems',
      'Critical slowing down',
    ],
    abstract:
      'A structural analogy between the runaway greenhouse effect and the collapse of the mesolimbic dopamine pathway, modeled as open dissipative systems whose saturating dissipation (the Ingersoll / clearance-Vmax ceiling) is overwhelmed by exogenous forcing, producing a saddle-node fold. The framework yields a falsifiable cross-domain prediction — shared early-warning signatures (critical slowing down, rising variance, rising lag-1 autocorrelation) near the threshold. The shared universality class is presented as a hypothesis for empirical investigation, not a demonstrated result.',
  },
  'dissolving-self-ocean-planet': {
    title: 'Why the Dissolving Self Is Imagined as an Ocean Planet: DMN Downregulation and the Cognitive Basis of the Neptune Metaphor',
    description: 'A review of the neuroscience of self-attenuation in altered states...',
    about: ['Default Mode Network', 'Altered states of consciousness', 'Conceptual metaphor', 'Structure-mapping theory', 'Cognitive science'],
    abstract: 'A review of the neuroscience of self-attenuation in altered states and its association with prefrontal and default-mode downregulation...',
  },
  'commercial-fusion-viability': {
    title: 'Bridging the Chasm: From Scientific Break-Even to Commercial Fusion Power',
    description: 'An AI-assisted technical synthesis of the engineering bottlenecks separating scientific break-even from commercial fusion power...',
    about: ['Nuclear fusion', 'Magnetic confinement fusion', 'Inertial confinement fusion', 'Plasma physics', 'Fusion engineering'],
    abstract: 'An AI-assisted technical synthesis of the bottlenecks between scientific break-even and commercial fusion power...',
  },
  'chronobiological-entrainment': {
    title: 'Chronobiological Entrainment as a Primary Modality for Endocrine Homeostasis',
    description: 'The "Circadian Fortress" hypothesis: an AI-assisted synthesis proposing that circadian misalignment...',
    about: ['Circadian rhythm', 'Chronobiology', 'Metabolic syndrome', 'Time-restricted eating', 'Suprachiasmatic nucleus'],
    abstract: 'A hypothesis and literature synthesis proposing that metabolic dysfunction is, in substantial part, a systems-level failure of temporal architecture...',
  },
  'the_perturber_question': {
    title: 'The Perturber Question Under Audit: An Agentic-AI Replication of the eTNO Clustering Test and a Composition-Agnostic Hypothesis Synthesis',
    description:
      'A computational astrophysics audit that replicates the extreme trans-Neptunian object orbital-clustering test on the fully characterized CFEPS/OSSOS sample, benchmarks an independent Python pipeline against the official Fortran SurveySimulator, maps a composition-agnostic hypothesis matrix, and documents what an agentic AI instrument contributed to and fabricated within the work.',
    about: [
      'Planet Nine',
      'Extreme trans-Neptunian objects',
      'Orbital clustering',
      'Survey selection bias',
      'Monte Carlo simulation',
      'Agentic AI in research',
    ],
    abstract:
      'A replication and audit study addressing whether the extreme trans-Neptunian object (eTNO) orbital-clustering signal survives selection-bias modeling in fully characterized surveys. Using the public CFEPS/OSSOS characterizations, an independently implemented Python selection-function simulator is benchmarked against the official Fortran SurveySimulator on identical synthetic populations. The complete characterized sample reconstructed from Shankman et al. (2017) yields selection-biased Monte Carlo p-values showing no statistically significant clustering, a conclusion robust to implementation choice and directionally consistent with Napier et al. (2021); the benchmark also surfaces genuine implementation disagreement, so the pipeline is validated for the clustering conclusion but not for absolute completeness predictions. The paper further presents a composition-agnostic discriminating-observables matrix and a candidate vetting protocol, and closes with an empirical self-audit documenting both real contributions and recurring failure modes of the agentic AI instrument. Presented as a replication and methods study, not peer-reviewed.',
  },
  'readout_plasticity_paper': {
    title: 'Evolving Local Synaptic Plasticity Rules to Track Representational Drift',
    description: 'A Symbolic Regression and Hierarchical Modeling Study evaluating how biologically plausible local learning rules can maintain stable decoding geometry despite unstable neural representations.',
    about: ['Representational drift', 'Synaptic plasticity', 'Symbolic regression', 'Computational neuroscience', 'Hierarchical modeling', 'Hebbian learning'],
    abstract: 'Neuronal representations in sensory and association cortices undergo continuous reorganization over days and weeks, a phenomenon known as representational drift. This study implements a grammar-constrained symbolic regression framework to systematically discover optimal local plasticity rules governing the readout weights of an empirical neural population (Posterior Parietal Cortex, PPC, of mice performing a virtual-navigation task).',
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
  
  // UPDATED: Now targeting .mdx files instead of .md
  const mdxPath = path.join(papersDirectory, `${slug}.mdx`);
  const mdPath = path.join(papersDirectory, `${slug}.md`);
  
  try {
    // Fallback logic to support any remaining .md files during the transition
    if (fs.existsSync(mdxPath)) {
      return fs.readFileSync(mdxPath, 'utf8');
    } else if (fs.existsSync(mdPath)) {
      return fs.readFileSync(mdPath, 'utf8');
    } else {
      console.log("❌ FAILED TO FIND MDX OR MD FILE FOR: ", slug);
      return null;
    }
  } catch (error) {
    console.error("Error reading file:", error); 
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

  const bibtexKey = `rajan2026${resolvedParams.slug.replace(/-/g, '')}`;

  // MDX COMPONENT MAP: Add any new interactive components here
  const mdxComponents = {
    MonteCarloChart,
    RunawayBifurcation,
  };

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
            ← Return to Index
          </Link>
        </nav>

        {/* MDX RENDERER */}
        <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-light prose-headings:tracking-wide prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-pre:bg-[#121214] prose-pre:border prose-pre:border-zinc-800">
          <MDXRemote 
            source={content} 
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
              }
            }}
          />
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