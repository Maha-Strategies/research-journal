// Canonical entity identifiers for Maha Strategies Research.
//
// This module is the single source of truth for *who* publishes and *who*
// authors the artifacts on this site. It exists so that structured data emitted
// anywhere in the app points at one stable `@id` per real-world entity, rather
// than restating a name and URL at each call site where they can quietly drift
// apart.
//
// The two entities are deliberately kept distinct:
//
//   - The ORGANIZATION (Maha Strategies Research) is the *publisher*. It is the
//     entity that stands behind an artifact's provenance and versioning.
//   - The PERSON (Mayone Maha Rajan) is the *author and instructor*. The
//     person's canonical web identity lives on a separate domain,
//     mayonemaharajan.com, which this site references rather than duplicates.
//
// DOMAIN SEPARATION — read before editing any URL below:
//
//   mayonemaharajan.com  is the PERSON. Author, instructor, ORCID holder.
//   mayonrajan.com       is a PROJECT — the Mayon Volcano 3D Interactive
//                        exhibit. It is a standalone educational work, NOT a
//                        personal site and NOT an identifier for the person.
//
// These two were conflated in the first version of this file. Do not put
// mayonrajan.com in the Person's `url` or `sameAs`: `sameAs` asserts that the
// target *is* the same entity, so pointing it at the exhibit would tell every
// consumer that a 3D volcano exhibit and a human being are one and the same.
// If the exhibit needs to be described, it is a CreativeWork of its own.
//
// Every value below is verified against something already in this repository —
// CITATION.cff for the ORCID and author name, lib/registry.ts for the site URL —
// except PERSON_SITE_URL, which is the author's own domain as stated by the
// author. Nothing here is asserted on the strength of a description alone.
//
// `@id` CONVENTION: a fragment on the entity's canonical page (`#organization`,
// `#person`). This is the standard Schema.org pattern for giving a node a stable
// identity that other nodes, on this site or elsewhere, can point at.

/** Canonical origin for the research site (the publisher's web home). */
export const SITE_URL = 'https://research.mahastrategies.com';

/**
 * Canonical origin for the author's personal site (the person's web home).
 *
 * The `www` host is the canonical form: the apex redirects to it. Structured
 * data must use the canonical origin, because `@id` and `sameAs` are matched as
 * opaque strings — an apex-host `@id` would not merge with the `www` one, and
 * the person would be modelled as two separate entities.
 */
export const PERSON_SITE_URL = 'https://www.mayonemaharajan.com';

/**
 * Stable `@id` for the publishing organization. Referenced as the `provider`
 * and `publisher` of every learning resource in the library.
 */
export const MAHA_ORGANIZATION_ID = `${SITE_URL}/#organization` as const;

/**
 * Stable `@id` for the author/instructor. Anchored on mayonemaharajan.com
 * because that domain — not this one, and not the exhibit domain — is the
 * authoritative entity for the person.
 */
export const MAYON_RAJAN_PERSON_ID = `${PERSON_SITE_URL}/#person` as const;

/**
 * Canonical origin for the Mayon Volcano 3D Interactive exhibit.
 *
 * This is a WORK, not a person and not the publisher. It is authored by the
 * same human, but it is a separate entity in the graph with its own `@id`, and
 * it must never appear in the Person's `url` or `sameAs`.
 *
 * Like the personal site, the `www` host is canonical and the apex redirects to
 * it. Authored content that uses the apex form is normalised to this origin
 * rather than being treated as a different work — see `sameSiteAs` below.
 */
export const MAYON_EXHIBIT_URL = 'https://www.mayonrajan.com';

/**
 * Stable `@id` for the exhibit.
 *
 * Deliberately anchored on the ORIGIN, not on whatever deep link a lesson uses.
 * A lesson may link to a specific coordinate or eruption era
 * (`?era=1814`, `#summit`), but every such link is the same application. Keying
 * the `@id` to the origin means every lesson that cites the exhibit converges
 * on one entity rather than minting a new one per anchor.
 */
export const MAYON_EXHIBIT_ID = `${MAYON_EXHIBIT_URL}/#exhibit` as const;

/** Display name for the exhibit. */
export const MAYON_EXHIBIT_NAME = 'Mayon Volcano 3D Interactive';

/**
 * Whether two URLs address the same site, ignoring a leading `www.`.
 *
 * Both mayonrajan.com and mayonemaharajan.com canonicalise to their `www` host,
 * with the apex redirecting. Authors will nonetheless write the apex form —
 * it is what people say out loud and what a browser shows. Comparing raw
 * origins would silently treat `https://mayonrajan.com` as a *different work*
 * from the canonical exhibit, minting a second entity named after a hostname.
 * Matching on the registrable host avoids that, while the canonical `@id` and
 * the constants above stay in the `www` form that the sites actually serve.
 *
 * Returns false rather than throwing when either argument is not a valid URL,
 * so a bad value degrades to "not the known entity" instead of crashing a build.
 */
export function sameSiteAs(a: string, b: string): boolean {
  const host = (value: string): string | null => {
    try {
      return new URL(value).hostname.replace(/^www\./i, '').toLowerCase();
    } catch {
      return null;
    }
  };
  const hostA = host(a);
  return hostA !== null && hostA === host(b);
}

/** ORCID record for the author. Verified in CITATION.cff. */
export const MAYON_RAJAN_ORCID = 'https://orcid.org/0009-0006-8135-5306' as const;

/**
 * A minimal reference to an entity defined elsewhere in the graph. Emitted when
 * a node needs to *point at* an entity without restating it.
 */
export type EntityReference = {
  '@id': string;
};

/** Schema.org Organization node for the publisher. */
export type OrganizationNode = {
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  description: string;
};

/** Schema.org Person node for the author/instructor. */
export type PersonNode = {
  '@type': 'Person';
  '@id': string;
  name: string;
  url: string;
  /** ORCID and any other authority-file identifiers for the same person. */
  sameAs: string[];
  jobTitle: string;
};

/**
 * The publisher. Cross-domain note: `url` points at this site, which is the
 * organization's own web home.
 */
export const MAHA_ORGANIZATION: OrganizationNode = {
  '@type': 'Organization',
  '@id': MAHA_ORGANIZATION_ID,
  name: 'Maha Strategies Research',
  url: SITE_URL,
  description:
    'An open, human-curated research practice publishing versioned, source-aware artifacts with their provenance, status, and citation boundaries stated up front.',
};

/**
 * The author and instructor. Cross-domain note: `url` deliberately points at
 * mayonemaharajan.com rather than at this site. This site hosts the content;
 * the author's own domain is the authoritative entity for the person.
 *
 * `sameAs` carries only identifiers that resolve to this same human: the
 * personal domain and the ORCID record. Project domains do not belong here.
 */
export const MAYON_RAJAN: PersonNode = {
  '@type': 'Person',
  '@id': MAYON_RAJAN_PERSON_ID,
  name: 'Mayone Maha Rajan',
  url: PERSON_SITE_URL,
  sameAs: [PERSON_SITE_URL, MAYON_RAJAN_ORCID],
  jobTitle: 'Researcher and Instructor',
};

/** Point at the publisher without restating it. */
export function organizationReference(): EntityReference {
  return { '@id': MAHA_ORGANIZATION_ID };
}

/** Point at the author/instructor without restating it. */
export function personReference(): EntityReference {
  return { '@id': MAYON_RAJAN_PERSON_ID };
}
