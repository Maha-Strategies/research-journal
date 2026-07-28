import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MAYON_EXHIBIT_NAME } from '@/lib/entity';
import {
  AUDIENCE_ROLE_DESCRIPTORS,
  LIBRARY_PATH,
  generateLessonSchema,
  lessonUrl,
  modulePath,
} from '@/lib/library/schema';
import { getAllLessons, getLessonById, getModuleForLesson } from '@/lib/library/registry';

type LessonParams = { id: string };

export function generateStaticParams(): LessonParams[] {
  return getAllLessons().map((lesson) => ({ id: lesson.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<LessonParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) return {};

  return {
    title: `${lesson.title} · The Mayon Learning Library`,
    description: lesson.description,
    alternates: { canonical: lessonUrl(lesson) },
  };
}

export default async function LessonPage({ params }: { params: Promise<LessonParams> }) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) notFound();

  const parentModule = getModuleForLesson(lesson.id);

  // The single source of structured data for this page. Everything about
  // authorship, provenance, and the interactive lab is decided in
  // lib/library/schema.ts — this component only injects it.
  const lessonLd = generateLessonSchema(lesson, parentModule?.title);

  return (
    <main className="min-h-screen bg-[#0a0a0c] p-6 text-zinc-300 selection:bg-amber-500 selection:text-white md:p-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest">
          {parentModule ? (
            <Link
              href={modulePath(parentModule.slug)}
              className="text-zinc-500 hover:text-amber-300"
            >
              ← {parentModule.title}
            </Link>
          ) : (
            <Link href={LIBRARY_PATH} className="text-zinc-500 hover:text-amber-300">
              ← Learning library
            </Link>
          )}
          <Link href={LIBRARY_PATH} className="text-zinc-400 hover:text-amber-300">
            Learning library →
          </Link>
        </nav>

        <header>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Lesson{parentModule ? ` · ${parentModule.title}` : ''}
          </p>
          <h1 className="mt-4 text-3xl font-light text-white md:text-5xl">{lesson.title}</h1>
          <p className="mt-6 border-l border-amber-400/40 pl-4 text-base leading-relaxed text-zinc-400">
            {lesson.description}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {lesson.audience.map((role) => (
              <li
                key={role}
                className="border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
              >
                {AUDIENCE_ROLE_DESCRIPTORS[role].label}
              </li>
            ))}
          </ul>
        </header>

        <section aria-labelledby="objectives" className="mt-12">
          <h2
            id="objectives"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Learning objectives
          </h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-zinc-300">
            {lesson.learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="field-steps" className="mt-12">
          <h2
            id="field-steps"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            In the field
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">
            Ordered, and meant to be workable under pressure. Numbered because the
            sequence matters.
          </p>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-zinc-300 marker:font-mono marker:text-amber-400">
            {lesson.fieldActionableSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        {lesson.interactiveLabUrl && (
          <section aria-labelledby="interactive-lab" className="mt-12">
            <h2
              id="interactive-lab"
              className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
            >
              Interactive lab
            </h2>

            <div className="mt-5 border border-amber-400/40 bg-amber-400/5 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-200">
                3D simulation · opens in a new tab
              </p>
              <h3 className="mt-3 text-xl font-light text-white">{MAYON_EXHIBIT_NAME}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                See the terrain and danger-zone geometry this lesson describes. The
                exhibit is a separate work, published alongside this library rather than
                inside it.
              </p>
              <a
                href={lesson.interactiveLabUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block border border-amber-400 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-amber-200 hover:bg-amber-400 hover:text-zinc-950"
              >
                Open the 3D exhibit ↗
              </a>
            </div>
          </section>
        )}

        <footer className="mt-12 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-600">
          Seed curriculum: illustrative teaching material written to exercise the library
          structure. Not reviewed curriculum, and not a substitute for guidance from the
          agency responsible for hazard warnings in your area.
        </footer>
      </article>
    </main>
  );
}
