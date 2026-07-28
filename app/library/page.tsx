import type { Metadata } from 'next';
import Link from 'next/link';

import { MAHA_ORGANIZATION_ID, SITE_URL } from '@/lib/entity';
import {
  AUDIENCE_ROLES,
  AUDIENCE_ROLE_DESCRIPTORS,
  LIBRARY_PATH,
  audiencePath,
  lessonPath,
  modulePath,
} from '@/lib/library/schema';
import { LEARNING_MODULES, getAllLessons, getLessonsByAudience } from '@/lib/library/registry';

const LIBRARY_TITLE = 'The Mayon Learning Library';
const LIBRARY_DESCRIPTION =
  'Curriculum for hazard literacy and educational sovereignty. Every lesson states who it is written for, what it teaches, and what a reader can actually do with it in the field.';

export const metadata: Metadata = {
  title: LIBRARY_TITLE,
  description: LIBRARY_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${LIBRARY_PATH}` },
};

export default function LibraryHubPage() {
  const lessons = getAllLessons();

  // A CollectionPage rather than a Course: this page indexes the curriculum,
  // it does not teach it. The modules it lists carry the Course typing.
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}${LIBRARY_PATH}#page`,
    url: `${SITE_URL}${LIBRARY_PATH}`,
    name: LIBRARY_TITLE,
    description: LIBRARY_DESCRIPTION,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website` },
    publisher: { '@id': MAHA_ORGANIZATION_ID },
    hasPart: LEARNING_MODULES.map((m) => ({
      '@type': 'Course',
      '@id': `${SITE_URL}${modulePath(m.slug)}#module`,
      name: m.title,
      url: `${SITE_URL}${modulePath(m.slug)}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-amber-500 selection:text-white md:p-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      <div className="mx-auto max-w-5xl">
        <nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest">
          <Link href="/" className="text-zinc-500 hover:text-amber-300">
            ← Research index
          </Link>
          <Link href="/registry" className="text-zinc-400 hover:text-amber-300">
            Context registry →
          </Link>
        </nav>

        <header className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Hazard literacy · educational sovereignty
          </p>
          <h1 className="mt-4 text-3xl font-light uppercase tracking-wide text-white md:text-5xl">
            The Mayon <span className="text-zinc-500">Learning Library</span>
          </h1>
          <p className="mt-6 border-l border-amber-400/40 pl-4 text-base leading-relaxed text-zinc-400">
            {LIBRARY_DESCRIPTION}
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            {LEARNING_MODULES.length} module{LEARNING_MODULES.length === 1 ? '' : 's'} ·{' '}
            {lessons.length} lessons
          </p>
        </header>

        <section aria-labelledby="curriculum" className="mt-16">
          <h2
            id="curriculum"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Curriculum
          </h2>

          <div className="mt-6 grid gap-6">
            {LEARNING_MODULES.map((learningModule) => (
              <article
                key={learningModule.slug}
                className="border border-zinc-800 bg-[#121214] p-6 md:p-8"
              >
                <h3 className="text-2xl font-light text-white">
                  <Link
                    href={modulePath(learningModule.slug)}
                    className="hover:text-amber-200"
                  >
                    {learningModule.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
                  {learningModule.description}
                </p>

                <ul className="mt-6 space-y-2 border-t border-zinc-800 pt-5">
                  {learningModule.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={lessonPath(lesson)}
                        className="text-sm text-amber-200/90 underline decoration-zinc-700 underline-offset-4 hover:text-white"
                      >
                        {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={modulePath(learningModule.slug)}
                  className="mt-6 inline-block border border-amber-400 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-amber-200 hover:bg-amber-400 hover:text-zinc-950"
                >
                  Open module →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="audiences" className="mt-16">
          <h2
            id="audiences"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Paths by audience
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-400">
            The same material is written for different readers. These paths filter the
            library to the lessons that address a given role — a lesson may appear on
            more than one path.
          </p>

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {AUDIENCE_ROLES.map((role) => {
              const descriptor = AUDIENCE_ROLE_DESCRIPTORS[role];
              const count = getLessonsByAudience(role).length;

              return (
                <li key={role}>
                  <Link
                    href={audiencePath(role)}
                    className="block h-full border border-zinc-800 bg-[#121214] p-5 hover:border-amber-500"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-light text-white">{descriptor.label}</h3>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                        {count} lesson{count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {descriptor.definition}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-600">
          Seed curriculum. These lessons are illustrative teaching material published to
          exercise the library structure; they are not reviewed curriculum and are not
          sourced against the Maha Provenance Standard the way a published research
          artifact is.
        </footer>
      </div>
    </main>
  );
}
