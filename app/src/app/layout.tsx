import type { Metadata } from "next";
import "./globals.css";

/**
 * No `next/font` imports. The house rule is one typeface globally — Pretendard, loaded from the CDN
 * link below — and `scripts/dash-static-check.mjs` enforces it as `no-next-font`, which hard-failed
 * the gate on every route while three families were declared here.
 *
 * What each removal cost, checked before deleting rather than after:
 * - `Instrument_Serif` → `--font-display`: nothing. Zero consumers anywhere in the app; the variable
 *   was declared, aliased in globals.css, and never used.
 * - `Geist` → `--font-geist-sans`: nothing visible. It sat *after* Pretendard in the `--font-sans`
 *   stack, so it only ever rendered if the CDN failed, and `system-ui` still covers that case.
 * - `Geist_Mono` → `--font-mono`: this one is real. Eighteen call sites across dash, dashboard and
 *   gallery use the `font-mono` utility, and they now resolve to the system monospace stack in
 *   globals.css instead of Geist Mono. Metrics are close (both grotesque monos, tabular figures
 *   intact) but it is a rendering change, not a no-op.
 */

export const metadata: Metadata = {
  title: "Specimen — Interface design systems for AI agents",
  description: "An auto-evolving gallery of production-grade interface design systems, each shipping a copy-paste DESIGN.md an AI agent can rebuild from.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
