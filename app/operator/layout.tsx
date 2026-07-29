// Root of the operator area.
//
// This layout carries ONLY the noindex metadata and the dynamic-rendering flag,
// both of which must apply to everything under /operator — including the login
// page. The access check lives one level down, in (workspace)/layout.tsx.
//
// The split exists because the login page cannot sit behind the gate it exists
// to get through: a redirect-to-login inside a layout that wraps the login page
// is an infinite loop. `(workspace)` is a route group, so it shapes the
// component tree without appearing in any URL — /operator/atlas-builder is
// still /operator/atlas-builder.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Operator',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Nothing under /operator may be prerendered: these pages read the private
 * workspace from disk on every request, and a build-time render would bake one
 * moment's state into static output.
 */
export const dynamic = 'force-dynamic';

export default function OperatorRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
