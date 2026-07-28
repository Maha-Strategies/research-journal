// The site's public surfaces: the top-level destinations a reader can enter.
//
// WHY THIS EXISTS: the homepage previously hardcoded its links. Two atlases,
// the atlas catalog, the learning library, and the provenance standard were all
// live, indexed, and in the sitemap — and none of them were reachable from the
// homepage, because adding a surface and adding a link to it were separate acts
// and the second kept being forgotten.
//
// Everything below is DERIVED from the module that owns it: atlases from
// ATLAS_CATALOG, the library from LEARNING_MODULES. Registering a new atlas in
// the catalog, or a new module in the library, makes it appear on the homepage
// with no edit here and no edit to app/page.tsx. That is the point: reachability
// is a property of the data, not a thing someone has to remember.
//
// A surface belongs here when it is a place a reader can enter and navigate
// from. Individual papers do not — they have their own list on the homepage.

import { ATLAS_CATALOG, ATLAS_CATALOG_PATH } from '@/lib/atlas/catalog';
import { LIBRARY_PATH } from '@/lib/library/schema';
import { LEARNING_MODULES, getAllLessons } from '@/lib/library/registry';
import { REGISTRY_META, REGISTRY_PATH } from '@/lib/registry';
import { STANDARD_META, STANDARD_PATH } from '@/lib/standards/maha-provenance';

export type SurfaceKind = 'catalog' | 'atlas' | 'library' | 'registry' | 'standard';

export type PublicSurface = {
  id: string;
  kind: SurfaceKind;
  /** Short label for the kind, shown as an eyebrow. */
  kindLabel: string;
  title: string;
  /** Site-relative canonical path. */
  path: string;
  description: string;
  /** One line of scale or status facts, read from the owning module. */
  meta: string;
};

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * Every public surface, in the order a newcomer should meet them: the library
 * first because it is the way in for a non-specialist, then the atlases, then
 * the infrastructure that explains how the rest is built.
 */
export function getPublicSurfaces(): PublicSurface[] {
  const library: PublicSurface = {
    id: 'mayon-learning-library',
    kind: 'library',
    kindLabel: 'Learning library',
    title: 'The Mayon Learning Library',
    path: LIBRARY_PATH,
    description:
      'Curriculum for hazard literacy and educational sovereignty. Every lesson states who it is written for, what it teaches, and what a reader can do with it in the field.',
    meta: `${plural(LEARNING_MODULES.length, 'module')} · ${plural(getAllLessons().length, 'lesson')}`,
  };

  const catalog: PublicSurface = {
    id: 'atlas-catalog',
    kind: 'catalog',
    kindLabel: 'Atlas catalog',
    title: 'Research Atlas Catalog',
    path: ATLAS_CATALOG_PATH,
    description:
      'Every public atlas with its version, review date, declared scope, and stated exclusions. An atlas is an orientation layer over literature, not a source and not a consensus statement.',
    meta: plural(ATLAS_CATALOG.length, 'atlas', 'atlases'),
  };

  // Derived, so a new atlas registered in the catalog appears here on its own.
  const atlases: PublicSurface[] = ATLAS_CATALOG.map((atlas) => ({
    id: atlas.id,
    kind: 'atlas',
    kindLabel: 'Research atlas',
    title: atlas.shortTitle,
    path: atlas.canonicalPath,
    description: atlas.description,
    meta: `v${atlas.version} · ${plural(atlas.counts.claims, 'claim')} · ${plural(atlas.counts.sources, 'source')}`,
  }));

  const registry: PublicSurface = {
    id: 'context-registry',
    kind: 'registry',
    kindLabel: 'Context registry',
    title: REGISTRY_META.title,
    path: REGISTRY_PATH,
    description: REGISTRY_META.purpose,
    meta: `v${REGISTRY_META.version} · updated ${REGISTRY_META.lastUpdated}`,
  };

  const standard: PublicSurface = {
    id: 'provenance-standard',
    kind: 'standard',
    kindLabel: 'Methodology',
    title: STANDARD_META.shortTitle,
    path: STANDARD_PATH,
    description: STANDARD_META.purpose,
    meta: `v${STANDARD_META.version} · ${STANDARD_META.dateModified}`,
  };

  return [library, catalog, ...atlases, registry, standard];
}

/**
 * The compact set for the top navigation bar. Deliberately short: a nav that
 * lists everything stops functioning as a nav.
 */
export function getPrimaryNavSurfaces(): PublicSurface[] {
  const byId = new Map(getPublicSurfaces().map((s) => [s.id, s]));
  return ['mayon-learning-library', 'atlas-catalog', 'context-registry']
    .map((id) => byId.get(id))
    .filter((s): s is PublicSurface => Boolean(s));
}
