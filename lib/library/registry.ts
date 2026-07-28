// The Mayon Learning Library registry: the static content store.
//
// This file is the database. Modules and lessons are declared here as data,
// validated against the Zod schemas at load, and read through the accessor
// functions below. There is no runtime data source and no CMS: content is
// version-controlled alongside the code that renders it, so a change to a
// lesson is a reviewable diff rather than an invisible edit.
//
// SEED CONTENT NOTICE: the module below is Phase 1 seed content, written to
// exercise the schema and the JSON-LD generator end to end. It is illustrative
// teaching material, not reviewed curriculum, and it is not sourced against the
// Maha Provenance Standard the way a published artifact is. It should be
// replaced or verified before the library is exposed publicly.
//
// INVARIANTS enforced at module load, so a bad edit fails the build:
//   1. Every module and lesson satisfies its schema.
//   2. Lesson ids are unique across the entire library, not just per module.
//   3. Every lesson's `moduleSlug` matches the module that contains it.

import {
  type AudienceRole,
  type LearningLesson,
  type LearningModule,
  parseLearningModule,
} from '@/lib/library/schema';

const HAZARD_LITERACY_FUNDAMENTALS: LearningModule = parseLearningModule({
  slug: 'hazard-literacy-fundamentals',
  title: 'Hazard Literacy Fundamentals',
  description:
    'An introduction to reading a hazard environment: what the official signals mean, what they do not promise, and what a person can actually do with them before, during, and after an event.',
  lessons: [
    {
      id: 'reading-an-alert-level',
      moduleSlug: 'hazard-literacy-fundamentals',
      title: 'Reading an Alert Level',
      description:
        'How a volcanic alert level is constructed, what evidence moves it up or down, and why the number describes the state of the volcano rather than the safety of any particular place.',
      audience: ['teacher', 'student', 'visitor', 'responder'],
      // The 3D exhibit lets a learner see the danger-zone geometry this lesson
      // describes, which is the part that does not survive being read as prose.
      interactiveLabUrl: 'https://www.mayonrajan.com',
      learningResourceType: ['LessonPlan', '3DSimulation'],
      learningObjectives: [
        'Describe what each step on an alert-level scale asserts about observed activity.',
        'Distinguish an alert level, which describes the volcano, from a danger zone, which describes a place.',
        'Explain why an alert level can stay unchanged while local risk changes.',
        'Identify the authority responsible for issuing the alert level in a given jurisdiction.',
      ],
      fieldActionableSteps: [
        'Find the current alert level from the issuing agency directly, not from a repost.',
        'Note the timestamp on the bulletin and treat anything older than the latest issuance as superseded.',
        'Locate your position relative to the declared permanent and extended danger zones.',
        'Confirm the evacuation route and assembly point for your zone before conditions change.',
        'Write down the agency bulletin channel so it can be rechecked without a search.',
      ],
    },
    {
      id: 'building-a-household-evacuation-plan',
      moduleSlug: 'hazard-literacy-fundamentals',
      title: 'Building a Household Evacuation Plan',
      description:
        'A step-by-step method for a household to agree in advance on triggers, routes, roles, and a reunification point, so that the decision to leave is made before the event rather than during it.',
      audience: ['teacher', 'student', 'institution', 'responder'],
      learningObjectives: [
        'State a specific, observable trigger that commits the household to evacuate.',
        'Map a primary and an alternate route that do not share a single failure point.',
        'Assign a named responsibility for each dependent, animal, and essential document.',
        'Explain why a pre-agreed reunification point outperforms improvised coordination.',
      ],
      fieldActionableSteps: [
        'Agree one trigger condition that requires leaving, and write it where everyone can see it.',
        'Walk both routes in person and record how long each takes on foot.',
        'Pack documents, medication, water, and light into a single container kept by the exit.',
        'Name one out-of-area contact everyone will report to if separated.',
        'Set a fixed reunification point and a fallback in case the first is unreachable.',
        'Rehearse the plan once, then revise it based on what actually went wrong.',
      ],
    },
  ],
});

/**
 * Every module in the library, in the order they should be presented.
 */
export const LEARNING_MODULES: LearningModule[] = [HAZARD_LITERACY_FUNDAMENTALS];

// --- Load-time invariant checks -------------------------------------------

const seenLessonIds = new Set<string>();
for (const learningModule of LEARNING_MODULES) {
  for (const lesson of learningModule.lessons) {
    if (lesson.moduleSlug !== learningModule.slug) {
      throw new Error(
        `Library registry: lesson "${lesson.id}" declares moduleSlug "${lesson.moduleSlug}" but is listed under module "${learningModule.slug}".`,
      );
    }
    if (seenLessonIds.has(lesson.id)) {
      throw new Error(
        `Library registry: duplicate lesson id "${lesson.id}". Lesson ids must be unique across the whole library because they appear in URLs.`,
      );
    }
    seenLessonIds.add(lesson.id);
  }
}

// --- Accessors -------------------------------------------------------------

/** Every lesson in the library, flattened, in module then lesson order. */
export function getAllLessons(): LearningLesson[] {
  return LEARNING_MODULES.flatMap((learningModule) => learningModule.lessons);
}

/**
 * Lessons written for a given audience role.
 *
 * A lesson may address several audiences at once, so this filters on
 * membership rather than partitioning the library. A role with no lessons
 * returns an empty array — that is a content gap to be reported, not an error.
 */
export function getLessonsByAudience(role: AudienceRole): LearningLesson[] {
  return getAllLessons().filter((lesson) => lesson.audience.includes(role));
}

/** A single lesson by id, or undefined if no such lesson is registered. */
export function getLessonById(id: string): LearningLesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === id);
}

/** A single module by slug, or undefined if no such module is registered. */
export function getModuleBySlug(slug: string): LearningModule | undefined {
  return LEARNING_MODULES.find((learningModule) => learningModule.slug === slug);
}

/** The module a lesson belongs to, or undefined if the lesson is unknown. */
export function getModuleForLesson(lessonId: string): LearningModule | undefined {
  return LEARNING_MODULES.find((learningModule) =>
    learningModule.lessons.some((lesson) => lesson.id === lessonId),
  );
}
