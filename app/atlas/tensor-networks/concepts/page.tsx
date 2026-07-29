import type { Metadata } from 'next';

import { AtlasNav, AtlasShell, ConceptCard, TENSOR_ATLAS_PATH } from '@/components/TensorAtlas';
import { MAHA_ORGANIZATION_ID, SITE_URL } from '@/lib/entity';
import { TN_CONCEPTS, TN_META } from '@/lib/atlas/tensor-networks';

const PATH = `${TENSOR_ATLAS_PATH}/concepts`;
const URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = {
  title: `Concepts | ${TN_META.title}`,
  description: `Concept vocabulary for the ${TN_META.title}: tensor-network structure, bond dimension, entanglement scaling, and the QUBO/Ising encoding layer.`,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
};

export default function TensorConceptsPage() {
  // The same DefinedTermSet @id as the landing page emits, so the two pages
  // describe one vocabulary rather than two identically named ones.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}${TENSOR_ATLAS_PATH}#vocabulary`,
    name: `${TN_META.title} — concept vocabulary`,
    url: URL,
    publisher: { '@id': MAHA_ORGANIZATION_ID },
    hasDefinedTerm: TN_CONCEPTS.map((concept) => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}${PATH}/${concept.id}#term`,
      name: concept.label,
      description: concept.definition,
      url: `${SITE_URL}${PATH}/${concept.id}`,
    })),
  };

  return (
    <AtlasShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-5xl">
        <AtlasNav back={{ href: TENSOR_ATLAS_PATH, label: TN_META.shortTitle }} />
        <header className="max-w-3xl">
          <h1 className="text-3xl font-light uppercase tracking-wide text-white">Concept library</h1>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">
            {TN_CONCEPTS.length} concept records. Each states what the term means, why it matters, and — where it applies —
            what the term is routinely taken to establish but does not.
          </p>
        </header>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {TN_CONCEPTS.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </div>
    </AtlasShell>
  );
}
