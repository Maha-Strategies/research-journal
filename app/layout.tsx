import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { MAYON_RAJAN, PERSON_SITE_URL, SITE_URL } from "@/lib/entity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Maha Strategies Research";

const SITE_DESCRIPTION =
  "Open-access research and curriculum from Maha Strategies Research: versioned working papers, source-traced research atlases, and hazard-literacy teaching material. Every artifact states its status, provenance, and citation boundary up front.";

/**
 * Site-wide metadata defaults. Any route that does not set its own value
 * inherits these.
 *
 * NO `title.template` HERE — deliberately. Several routes already bake the site
 * name into their own title (app/papers/[slug] appends
 * "| Maha Strategies Research"; the library pages append
 * "· The Mayon Learning Library"). Adding a template would append the suffix a
 * second time and ship "… | Maha Strategies Research | Maha Strategies
 * Research" to search results. `default` covers routes that set no title at all,
 * which is what a root fallback is for. See the note in the handoff about
 * introducing a template properly.
 *
 * NO `openGraph.images` HERE — deliberately. The referenced social card
 * (/og-research.png) is not present in public/, and a sitewide og:image
 * pointing at a 404 is worse than none: crawlers cache the failure and the
 * card renders blank. Add the asset, then add the field.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // A plain string, not `{ default, template }`: Next's Metadata type requires
  // `template` whenever the object form is used, and a template is exactly what
  // must not be set here (see above). A bare string is the fallback title.
  title: `${SITE_NAME} | Deep Tech & Hazard Literacy`,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: MAYON_RAJAN.name, url: PERSON_SITE_URL }],
  creator: MAYON_RAJAN.name,
  publisher: SITE_NAME,
  category: "Science",
  // NO root `alternates.canonical`. A canonical URL is a per-page claim, and a
  // root default is inherited by any route that forgets to set its own — which
  // makes that page declare itself a duplicate of the homepage and drop out of
  // the index. The homepage sets its own canonical; so does every route in the
  // library. A root default would add nothing and silently punish omissions.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    // NO root `url`, for the same reason as the canonical above: inherited by
    // every page that does not override it, so sharing a lesson would render
    // the homepage's card. Absent is better than wrong — consumers fall back to
    // the URL actually being shared.
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Deep Tech & Hazard Literacy`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    // `summary` rather than `summary_large_image`: the large-image card renders
    // poorly with no image. Promote this once /og-research.png exists.
    card: "summary",
    title: `${SITE_NAME} | Deep Tech & Hazard Literacy`,
    description: SITE_DESCRIPTION,
    creator: "@mayon_rajan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="alternate" type="text/plain" title="Maha Strategies Research machine-readable site guide" href="/llms.txt" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
