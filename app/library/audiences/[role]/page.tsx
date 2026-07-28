import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MAHA_ORGANIZATION_ID, SITE_URL } from '@/lib/entity';
import {
  AUDIENCE_ROLES,
  AUDIENCE_ROLE_DESCRIPTORS,
  type AudienceRole,
  LIBRARY_PATH,
  audiencePath,
  lessonPath,
  modulePath,
} from '@/lib/library/schema';
import { getLessonsByAudience, getModuleForLesson } from '@/lib/library/registry';

type AudienceParams = { role: string };

export function generateStaticParams(): AudienceParams[] {
  return AUDIENCE_ROLES.map((role) => ({ role }));
}

export const dynamicParams = false;

/** Narrow the raw route segment to a known role, or nothing. */
function toAudienceRole(value: string): AudienceRole | undefined {
  return (AUDIENCE_ROLES as readonly string[]).includes(value)
    ? (value as AudienceRole)
    : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<AudienceParams>;
}): Promise<Metadata> {
  const { role } = await params;
  const audienceRole = toAudienceRole(role);

  if (!audienceRole) return {};

  const descriptor = AUDIENCE_ROLE_DESCRIPTORS[audienceRole];

  return {
    title: `For ${descriptor.label.toLowerCase()}s · The Mayon Learning Library`,
    description: descriptor.definition,
    alternates: { canonical: `${SITE_URL}${audiencePath(audienceRole)}` },
  };
}

export default async function AudiencePage({
  params,
}: {
  params: Promise<AudienceParams>;
}) {
  const { role } = await params;
  const audienceRole = toAudienceRole(role);

  if (!audienceRole) notFound();

  const descriptor = AUDIENCE_ROLE_DESCRIPTORS[audienceRole];
  const lessons = getLessonsByAudience(audienceRole);
  const url = `${SITE_URL}${audiencePath(audienceRole)}`;

  const audienceLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    url,
    name: `${descriptor.label} path`,
    description: descriptor.definition,
    isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}${LIBRARY_PATH}#page` },
    publisher: { '@id': MAHA_ORGANIZATION_ID },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: descriptor.educationalRole,
    },
    hasPart: lessons.map((lesson) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(audienceLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <nav className="mb-12 flex flex-wrap justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-widest">
          <Link href={LIBRARY_PATH} className="text-zinc-500 hover:text-amber-300">
            ← Learning library
          </Link>
          <Link href={`${LIBRARY_PATH}#audiences`} className="text-zinc-400 hover:text-amber-300">
            All audience paths →
          </Link>
        </nav>

        <header>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Audience path
          </p>
          <h1 className="mt-4 text-3xl font-light text-white md:text-5xl">
            For {descriptor.label.toLowerCase()}s
          </h1>
          <p className="mt-6 border-l border-amber-400/40 pl-4 text-base leading-relaxed text-zinc-400">
            {descriptor.definition}
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            {lessons.length} lesson{lessons.length === 1 ? '' : 's'} on this path
          </p>
        </header>

        <section aria-labelledby="path-lessons" className="mt-12">
          <h2
            id="path-lessons"
            className="border-b border-zinc-800 pb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            Lessons
          </h2>

          <ul className="mt-6 space-y-4">
            {lessons.map((lesson) => {
              const parentModule = getModuleForLesson(lesson.id);

              return (
                <li key={lesson.id}>
                  <article className="border border-zinc-800 bg-[#121214] p-5 hover:border-amber-500">
                    {parentModule && (
                      <Link
                        href={modulePath(parentModule.slug)}
                        className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-amber-300"
                      >
                        {parentModule.title}
                      </Link>
                    )}
                    <h3 className="mt-2 text-xl font-light text-white">
                      <Link href={lessonPath(lesson)} className="hover:text-amber-200">
                        {lesson.title}
                      </Link>
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                      {lesson.description}
                    </p>
                  </article>
                </li>
              );
            })}

            {lessons.length === 0 && (
              <li className="text-sm leading-relaxed text-zinc-500">
                No lesson in the library currently addresses this audience. That is a
                content gap, stated rather than hidden.
              </li>
            )}
          </ul>
        </section>

        <footer className="mt-12 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-600">
          A lesson may address several audiences at once, so it can appear on more than one
          path. These paths filter the library; they do not partition it.
        </footer>
      </div>
    </main>
  );
}
