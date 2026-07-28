import type { NextConfig } from "next";

/**
 * Redirects for library URLs that were published and then restructured.
 *
 * The first library deploy shipped a single `hazard-literacy-fundamentals`
 * module with two lessons. The curriculum was then reorganised into ten
 * hazard-domain modules, which retired both of those lesson URLs. They were
 * already in the published sitemap, so they get 308s rather than 404s.
 *
 * `permanent: true` emits a 308, which search engines cache indefinitely.
 * That is correct here — these paths are not coming back — but it does mean a
 * mistake in a destination is expensive to undo. Nothing validates these
 * destinations automatically: if a lesson id below is ever renamed in
 * lib/library/registry.ts, this file must be updated by hand or the redirect
 * will point at a 404.
 */
const RETIRED_LIBRARY_LESSONS = [
  {
    // Direct successor: same subject, same alert-level framing, now the
    // opening lesson of the volcanic-hazards module.
    source: "/library/lessons/reading-an-alert-level",
    destination: "/library/lessons/volc-alert-levels",
    permanent: true,
  },
  {
    // CLOSEST MATCH, NOT AN EXACT SUCCESSOR. The retired lesson covered
    // household evacuation planning end to end — triggers, routes, roles,
    // reunification. The new curriculum splits that across modules; this
    // destination carries the trigger-and-route half, which is the part the
    // old URL was most often reached for. Revisit if a dedicated household
    // planning lesson is added later.
    source: "/library/lessons/building-a-household-evacuation-plan",
    destination: "/library/lessons/hydromet-flood-evacuation",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return RETIRED_LIBRARY_LESSONS;
  },
};

export default nextConfig;
