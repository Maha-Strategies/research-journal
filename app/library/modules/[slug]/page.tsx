import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MAHA_ORGANIZATION_ID, MAYON_RAJAN_PERSON_ID, SITE_URL } from '@/lib/entity';
import {
  AUDIENCE_ROLE_DESCRIPTORS,
  LIBRARY_PATH,
  lessonPath,
  modulePath,
} from '@/lib/library/schema';
import { LEARNING_MODULES, getModuleBySlug } from '@/lib/library/registry';

type ModuleParams = { slug: string };

/**
 * Every module is known at build time, so all of them are prerendered.
 * `dynamicParams = false` makes any other slug a 404 rather than an on-demand
 * render — the library is a fixed set of documents, not an open namespace.
 */
export function generateStaticParams(): ModuleParams[] {
  return LEARNING_MODULES.map((learningModule) => ({ slug: learningModule.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<ModuleParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const learningModule = getModuleBySlug(slug);

  if (!learningModule) return {};

  return {
    title: learningModule.title,
    description: learningModule.description,
    alternates: { canonical: `${SITE_URL}${modulePath(slug)}` },
  };
}

export default async function ModulePage({ params }: { params: Promise<ModuleParams> }) {
  const { slug } = await params;
  const learningModule = getModuleBySlug(slug);

  if (!learningModule) notFound();

  const url = `${SITE_URL}${modulePath(slug)}`;

  const moduleLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#module`,
    url,
    name: learningModule.title,
    description: learningModule.description,
    inLanguage: 'en',
    isPartOf: {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}${LIBRARY_PATH}#page`,
    },
    author: { '@id': MAYON_RAJAN_PERSON_ID },
    provider: { '@id': MAHA_ORGANIZATION_ID },
    publisher: { '@id': MAHA_ORGANIZATION_ID },
    hasPart: learningModule.lessons.map((lesson) => ({
      '@type': ['Course', 'LearningResource'],
      '@id': `${SITE_URL}${lessonPath(lesson)}#lesson`,
      name: lesson.title,
      url: `${SITE_URL}${lessonPath(lesson)}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-amber-500 selection:text-white md:p-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(moduleLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest">
          <Link href={LIBRARY_PATH} className="text-zinc-500 hover:text-amber-300">
            ← Learning library
          </Link>
          <Link href="/registry" className="text-zinc-400 hover:text-amber-300">
            Context registry →
          </Link>
        </nav>

        <header>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Module · {learningModule.lessons.length} lesson
            {learningModule.lessons.length === 1 ? '' : 's'}
          </p>
          <h1 className="mt-4 text-3xl font-light text-white md:text-5xl">
            {learningModule.title}
          </h1>
          <p className="mt-6 border-l border-amber-400/40 pl-4 text-base leading-relaxed text-zinc-400">
            {learningModule.description}
          </p>
        </header>

        <section aria-labelledby="lessons" className="mt-12">
          <h2
            id="lessons"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Lessons in this module
          </h2>

          <ol className="mt-6 space-y-4">
            {learningModule.lessons.map((lesson, index) => (
              <li key={lesson.id}>
                <article className="border border-zinc-800 bg-[#121214] p-5 hover:border-amber-500">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-light text-white">
                      <Link href={lessonPath(lesson)} className="hover:text-amber-200">
                        {lesson.title}
                      </Link>
                    </h3>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                    {lesson.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {lesson.audience.map((role) => (
                      <li
                        key={role}
                        className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
                      >
                        {AUDIENCE_ROLE_DESCRIPTORS[role].label}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={lessonPath(lesson)}
                    className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-amber-300 hover:text-white"
                  >
                    Open lesson →
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-12 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-600">
          Seed curriculum: illustrative teaching material, not reviewed curriculum, and not
          sourced against the Maha Provenance Standard.
        </footer>
      </article>
    </main>
  );
}
