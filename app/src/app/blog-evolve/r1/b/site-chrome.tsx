import { Rows3 } from "lucide-react";

// Static site chrome — header (banner) and footer (contentinfo) — kept out of the client bundle
// since neither needs interactivity. Rendered as siblings of <main>, never nested inside it, so
// each keeps its implicit landmark role.

const NAV_LINKS = ["Product", "Docs", "Pricing", "Blog"];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="/blog-evolve/r1/b"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white">
            <Rows3 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-mono)" }}>
            Stackrail
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const current = link === "Blog";
            return (
              <a
                key={link}
                href={current ? "/blog-evolve/r1/b" : "#"}
                aria-current={current ? "page" : undefined}
                className={`min-h-10 rounded-lg px-3 text-sm font-medium leading-10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                  current ? "text-teal-700" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link}
              </a>
            );
          })}
        </nav>

        <a
          href="#"
          className="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-teal-700 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Get started
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white">
              <Rows3 className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-zinc-900" style={{ fontFamily: "var(--font-display-mono)" }}>
              Stackrail
            </span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
            <a href="#" className="rounded-md hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              Documentation
            </a>
            <a href="#" className="rounded-md hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              Status
            </a>
            <a href="#" className="rounded-md hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              Careers
            </a>
            <a href="#" className="rounded-md hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              RSS
            </a>
          </nav>
        </div>
        <p className="mt-8 text-xs text-zinc-600">Copyright 2026 Stackrail, Inc. Workflow orchestration for engineering teams.</p>
      </div>
    </footer>
  );
}
