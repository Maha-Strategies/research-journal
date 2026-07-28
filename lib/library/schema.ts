// The Mayon Learning Library: types, validation, and structured data.
//
// This module defines the shape of a lesson and the JSON-LD it emits. It owns
// no content — the registry does that — and it renders nothing. It is the
// contract that sits between the two.
//
// CROSS-DOMAIN IDENTITY: every lesson this library publishes is authored by a
// person whose authoritative web identity lives on mayonemaharajan.com, and
// published by an organization whose identity lives on this site. The JSON-LD
// generator below states that split explicitly rather than collapsing both
// roles into one entity, so that a consumer reading only the markup can tell
// who taught the material apart from who stands behind its provenance.
//
// This module states NO identity facts of its own. Names, URLs, and `sameAs`
// values are read from the entity nodes in lib/entity.ts and spread into the
// markup. An earlier version restated them inline, which meant a domain could
// be corrected in one file and left wrong in the other. Deriving them makes
// that class of drift impossible: there is one place to change a domain.
//
// VALIDATION: the Zod schemas are the runtime guard for content authored by
// hand. The TypeScript interfaces are derived from them (`z.infer`) rather than
// declared twice, so a field cannot be added to one and forgotten in the other.

import { z } from 'zod';
import {
  MAHA_ORGANIZATION,
  MAHA_ORGANIZATION_ID,
  MAYON_EXHIBIT_ID,
  MAYON_EXHIBIT_NAME,
  MAYON_EXHIBIT_URL,
  MAYON_RAJAN,
  MAYON_RAJAN_PERSON_ID,
  SITE_URL,
  sameSiteAs,
} from '@/lib/entity';

/** Planned base path for the library. No route is built against it yet. */
export const LIBRARY_PATH = '/library';

// ---------------------------------------------------------------------------
// Audience
// ---------------------------------------------------------------------------

/**
 * Who a lesson is written for. These are *authoring* roles: they describe the
 * reader the material addresses, not a permission level or an account type.
 */
export const AUDIENCE_ROLES = [
  'teacher',
  'student',
  'institution',
  'visitor',
  'responder',
] as const;

export const audienceRoleSchema = z.enum(AUDIENCE_ROLES);

export type AudienceRole = z.infer<typeof audienceRoleSchema>;

export type AudienceRoleDescriptor = {
  id: AudienceRole;
  label: string;
  definition: string;
  /**
   * The value emitted as Schema.org `educationalRole`.
   *
   * PROVENANCE NOTE: `student` and `teacher` are values in common use in the
   * Schema.org ecosystem. The remaining three are project-specific extensions —
   * Schema.org does not define a controlled vocabulary for `educationalRole`,
   * so these are honest local terms rather than borrowed standard ones. They
   * are recorded here so a consumer can see which is which.
   */
  educationalRole: string;
  /** True where `educationalRole` is a widely recognised value. */
  isConventionalRole: boolean;
};

export const AUDIENCE_ROLE_DESCRIPTORS: Record<AudienceRole, AudienceRoleDescriptor> = {
  teacher: {
    id: 'teacher',
    label: 'Teacher',
    definition:
      'An educator delivering the material to others, who needs the lesson structure, the objectives, and the reasoning behind them.',
    educationalRole: 'teacher',
    isConventionalRole: true,
  },
  student: {
    id: 'student',
    label: 'Student',
    definition:
      'A learner working through the material directly, in a classroom or independently.',
    educationalRole: 'student',
    isConventionalRole: true,
  },
  institution: {
    id: 'institution',
    label: 'Institution',
    definition:
      'A school, agency, or programme adopting the material at the level of policy or curriculum rather than delivering an individual lesson.',
    educationalRole: 'administrator',
    isConventionalRole: false,
  },
  visitor: {
    id: 'visitor',
    label: 'Visitor',
    definition:
      'A general reader with no institutional role, arriving without prior context and owed a self-contained explanation.',
    educationalRole: 'general public',
    isConventionalRole: false,
  },
  responder: {
    id: 'responder',
    label: 'Responder',
    definition:
      'Someone who may have to act during an actual hazard event, for whom the field-actionable steps are the operative part of the lesson.',
    educationalRole: 'emergency responder',
    isConventionalRole: false,
  },
};

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

const nonEmptyString = z.string().trim().min(1);

/**
 * A slug fragment: lowercase, digits, and single hyphens. Enforced so that a
 * lesson id can be used directly in a URL path without escaping.
 */
const slug = nonEmptyString.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'must be lowercase alphanumeric words separated by single hyphens',
);

export const learningLessonSchema = z.object({
  /** Stable identifier, unique across the whole library. Used in URLs. */
  id: slug,
  title: nonEmptyString,
  /** The module this lesson belongs to. Must match a registered module. */
  moduleSlug: slug,
  /**
   * REQUIRED BEYOND THE MINIMAL FIELD SET: Schema.org `Course` is not valid
   * without a description, and search consumers reject a Course node that
   * lacks one. Carrying it on the lesson is the only way the generator can
   * emit conformant markup, so it is required rather than optional.
   */
  description: nonEmptyString,
  /** At least one audience — a lesson written for nobody is an authoring bug. */
  audience: z.array(audienceRoleSchema).min(1),
  /** What the learner should be able to do afterwards. Emitted as `teaches`. */
  learningObjectives: z.array(nonEmptyString).min(1),
  /**
   * Concrete steps a reader can carry out in the field. Emitted as ordered
   * `HowToStep` parts. This is the part of a hazard-literacy lesson that has to
   * survive being read under pressure, so it is ordered and kept separate from
   * the objectives rather than folded into prose.
   */
  fieldActionableSteps: z.array(nonEmptyString).min(1),
  /**
   * An interactive lab the lesson sends the learner to — currently the Mayon
   * Volcano 3D Interactive exhibit at mayonrajan.com. May be a bare origin or a
   * deep link carrying a coordinate/era anchor, so the lesson can drop the
   * learner at the exact view it is discussing.
   *
   * IDENTITY NOTE: the exhibit is a standalone work, NOT the author. It is
   * emitted as a `SoftwareApplication` and never as a `Person` identifier. See
   * the domain-separation block in lib/entity.ts.
   */
  interactiveLabUrl: z.url().optional(),
  /**
   * Overrides the default `learningResourceType` in the JSON-LD, e.g.
   * `['LessonPlan', '3DSimulation']`. Free text by design: Schema.org defines
   * no controlled vocabulary for this property, so these are descriptive local
   * terms rather than borrowed standard ones.
   */
  learningResourceType: z.array(nonEmptyString).min(1).optional(),
});

export type LearningLesson = z.infer<typeof learningLessonSchema>;

/** Emitted when a lesson declares no explicit `learningResourceType`. */
export const DEFAULT_LEARNING_RESOURCE_TYPE = ['Lesson'] as const;

export const learningModuleSchema = z.object({
  slug,
  title: nonEmptyString,
  description: nonEmptyString,
  lessons: z.array(learningLessonSchema).min(1),
});

export type LearningModule = z.infer<typeof learningModuleSchema>;

/**
 * Validate authored content, throwing with a readable path on the first bad
 * field. Called by the registry at module load so malformed content fails at
 * build time rather than at render time.
 */
export function parseLearningModule(input: unknown): LearningModule {
  return learningModuleSchema.parse(input);
}

export function parseLearningLesson(input: unknown): LearningLesson {
  return learningLessonSchema.parse(input);
}

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

// These must stay in lockstep with the route folders under app/library. They
// are the single source of truth for the canonical URL of every library page:
// the JSON-LD `@id` and `url`, the `alternates.canonical` metadata, the
// in-page links, and the sitemap all derive from them. A lesson is addressed by
// id alone — ids are unique library-wide (enforced in registry.ts), so the
// module slug is navigation context rather than part of the lesson's identity.

/** Canonical path for a lesson. Serves `app/library/lessons/[id]`. */
export function lessonPath(lesson: Pick<LearningLesson, 'id'>): string {
  return `${LIBRARY_PATH}/lessons/${lesson.id}`;
}

/** Absolute canonical URL for a lesson. */
export function lessonUrl(lesson: Pick<LearningLesson, 'id'>): string {
  return `${SITE_URL}${lessonPath(lesson)}`;
}

/** Canonical path for a module. Serves `app/library/modules/[slug]`. */
export function modulePath(moduleSlug: string): string {
  return `${LIBRARY_PATH}/modules/${moduleSlug}`;
}

/** Absolute canonical URL for a module. */
export function moduleUrl(moduleSlug: string): string {
  return `${SITE_URL}${modulePath(moduleSlug)}`;
}

/** Canonical path for an audience index. Serves `app/library/audiences/[role]`. */
export function audiencePath(role: AudienceRole): string {
  return `${LIBRARY_PATH}/audiences/${role}`;
}

/** Absolute canonical URL for an audience index. */
export function audienceUrl(role: AudienceRole): string {
  return `${SITE_URL}${audiencePath(role)}`;
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

type HowToStepNode = {
  '@type': 'HowToStep';
  position: number;
  text: string;
};

type EducationalAudienceNode = {
  '@type': 'EducationalAudience';
  educationalRole: string;
};

/**
 * The interactive lab as a work in its own right.
 *
 * TYPE CHOICE: `SoftwareApplication` + `LearningResource`. A browser-delivered
 * 3D exhibit is an application a learner runs, and a resource they learn from;
 * both types are real Schema.org types and both are consumed in the wild.
 *
 * `VisualArtifact` is deliberately NOT used: it is not a Schema.org type. The
 * nearest real one is `VisualArtwork`, which describes paintings, sculpture,
 * and illustration — not interactive software — so it would be a worse fit than
 * `SoftwareApplication` even setting validity aside.
 */
type InteractiveLabNode = {
  '@type': ['SoftwareApplication', 'LearningResource'];
  '@id': string;
  name: string;
  url: string;
  applicationCategory: 'EducationalApplication';
  /** Runs in the browser; no install step. */
  operatingSystem: 'Any (web browser)';
  learningResourceType: string[];
  /** Free to use, stated explicitly so consumers do not assume a paywall. */
  isAccessibleForFree: true;
};

/**
 * The lesson node. Typed as a dual `Course` + `LearningResource` because both
 * describe the same thing here: a `Course` is what an institution adopts, a
 * `LearningResource` is what a learner opens. Schema.org permits an array of
 * types, and emitting both means neither consumer has to infer the other.
 */
export type LessonSchemaNode = {
  '@context': 'https://schema.org';
  '@type': ['Course', 'LearningResource'];
  '@id': string;
  url: string;
  name: string;
  description: string;
  inLanguage: 'en';
  learningResourceType: string[];
  isPartOf: { '@type': 'Course'; '@id': string; name?: string };
  teaches: string[];
  /**
   * The ordered field procedure, plus the interactive lab when the lesson
   * declares one. Mixed-type by design; entries are distinguished by `@type`,
   * and only `HowToStep` entries carry `position`. A consumer rebuilding the
   * field procedure should filter to `HowToStep` and sort by `position` rather
   * than assuming the array is homogeneous.
   */
  hasPart: (HowToStepNode | InteractiveLabNode)[];
  audience: EducationalAudienceNode[];
  author: {
    '@type': 'Person';
    '@id': string;
    name: string;
    url: string;
    sameAs: string[];
  };
  provider: { '@type': 'Organization'; '@id': string; name: string; url: string };
  publisher: { '@type': 'Organization'; '@id': string };
  hasCourseInstance: {
    '@type': 'CourseInstance';
    courseMode: 'online';
    instructor: { '@type': 'Person'; '@id': string };
  };
};

/**
 * Build the node for a lesson's interactive lab.
 *
 * The `@id` is keyed to the lab's ORIGIN while `url` keeps the full link. A
 * lesson that deep-links to a specific era or coordinate therefore still points
 * at the one exhibit entity instead of minting a new work per anchor — the
 * difference between "twelve lessons cite this exhibit" and "twelve unrelated
 * applications happen to share a hostname".
 *
 * A lab on the known exhibit site gets its real name and canonical `@id`;
 * anything else is named from its hostname rather than guessed at. Host
 * matching ignores a leading `www.`, so a lesson authored with the apex form
 * still resolves to the one canonical exhibit entity.
 */
function buildInteractiveLabNode(labUrl: string): InteractiveLabNode {
  const isKnownExhibit = sameSiteAs(labUrl, MAYON_EXHIBIT_URL);

  return {
    '@type': ['SoftwareApplication', 'LearningResource'],
    '@id': isKnownExhibit ? MAYON_EXHIBIT_ID : `${new URL(labUrl).origin}/#interactive-lab`,
    name: isKnownExhibit ? MAYON_EXHIBIT_NAME : new URL(labUrl).hostname,
    url: labUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any (web browser)',
    learningResourceType: ['3DSimulation', 'InteractiveResource'],
    isAccessibleForFree: true,
  };
}

/**
 * Build the JSON-LD for a lesson.
 *
 * CROSS-DOMAIN CONTRACT — this is the part that matters and the reason the
 * function exists:
 *
 *   - `author` and `hasCourseInstance.instructor` resolve to the Person at
 *     mayonemaharajan.com. That domain, not this one, is the authoritative
 *     entity for the human who wrote and teaches the material. It is NOT
 *     mayonrajan.com, which is a separate educational project (the Mayon
 *     Volcano 3D Interactive exhibit) and is not an identifier for any person.
 *   - `provider` and `publisher` resolve to MAHA_ORGANIZATION_ID on this site,
 *     which is the entity that hosts the content and stands behind its
 *     provenance.
 *
 * The author and provider nodes carry both an `@id` and enough inline detail to
 * stand alone. The `@id` lets a crawler merge them with the fuller nodes emitted
 * elsewhere (including on mayonemaharajan.com); the inline detail means the
 * markup is still valid if it is read in isolation. Emitting only an `@id` would
 * leave a dangling reference whenever this node is consumed on its own.
 *
 * Identity values are spread from the entity nodes rather than written out
 * here, so correcting a domain in lib/entity.ts corrects it everywhere.
 *
 * INTERACTIVE LAB: when `interactiveLabUrl` is set, the exhibit is appended to
 * `hasPart` as a `SoftwareApplication` + `LearningResource`.
 *
 * `hasPart` was chosen over `workExample` deliberately. Schema.org defines
 * `workExample` as an "example/instance/realization/derivation of the concept
 * of this creative work" — a paperback edition, a translation. The exhibit is
 * not an edition of the lesson, so `workExample` would assert something false.
 * `hasPart` ("an item that is part of this item, in some sense") is the honest
 * fit for a tool the lesson incorporates.
 *
 * The lab keeps its own `@id` on mayonrajan.com, so it stays a distinct work
 * that other lessons can reference rather than a fragment owned by this lesson.
 *
 * @param lesson  A lesson. Validated before use, so a malformed lesson cannot
 *                produce structured data that silently misstates authorship.
 * @param moduleTitle  Optional title of the parent module, for `isPartOf`.
 */
export function generateLessonSchema(
  lesson: LearningLesson,
  moduleTitle?: string,
): LessonSchemaNode {
  const validated = learningLessonSchema.parse(lesson);
  const url = lessonUrl(validated);

  const resourceTypes: string[] =
    validated.learningResourceType ?? [...DEFAULT_LEARNING_RESOURCE_TYPE];

  const steps: HowToStepNode[] = validated.fieldActionableSteps.map((text, index) => ({
    '@type': 'HowToStep' as const,
    position: index + 1,
    text,
  }));

  const labParts: InteractiveLabNode[] = validated.interactiveLabUrl
    ? [buildInteractiveLabNode(validated.interactiveLabUrl)]
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': ['Course', 'LearningResource'],
    '@id': `${url}#lesson`,
    url,
    name: validated.title,
    description: validated.description,
    inLanguage: 'en',
    learningResourceType: resourceTypes,
    isPartOf: {
      '@type': 'Course',
      '@id': `${moduleUrl(validated.moduleSlug)}#module`,
      ...(moduleTitle ? { name: moduleTitle } : {}),
    },
    teaches: validated.learningObjectives,
    hasPart: [...steps, ...labParts],
    audience: validated.audience.map((role) => ({
      '@type': 'EducationalAudience' as const,
      educationalRole: AUDIENCE_ROLE_DESCRIPTORS[role].educationalRole,
    })),

    // The author is the Person on mayonemaharajan.com. Every field is read from
    // the canonical node — nothing about the person is restated here.
    author: {
      '@type': 'Person',
      '@id': MAYON_RAJAN['@id'],
      name: MAYON_RAJAN.name,
      url: MAYON_RAJAN.url,
      sameAs: [...MAYON_RAJAN.sameAs],
    },

    // The provider and publisher are the organization on this site, likewise
    // read from the canonical node.
    provider: {
      '@type': 'Organization',
      '@id': MAHA_ORGANIZATION['@id'],
      name: MAHA_ORGANIZATION.name,
      url: MAHA_ORGANIZATION.url,
    },
    publisher: { '@type': 'Organization', '@id': MAHA_ORGANIZATION_ID },

    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: { '@type': 'Person', '@id': MAYON_RAJAN_PERSON_ID },
    },
  };
}
