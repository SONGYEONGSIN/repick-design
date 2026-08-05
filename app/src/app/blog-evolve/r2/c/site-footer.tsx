// app/src/app/blog-evolve/r2/c/site-footer.tsx
//
// Sibling of `<main>`, not nested inside it, so it keeps its implicit `contentinfo` landmark role.
import { Anchor, Rss, Code2, Mail } from "lucide-react";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const FOOTER_COLUMNS = [
  { heading: "Product", links: ["Queues", "Workflows", "Scheduling", "Status page"] },
  { heading: "Resources", links: ["Docs", "API reference", "Changelog", "Guides"] },
  { heading: "Company", links: ["About", "Careers", "Contact"] },
];

const SOCIAL_LINKS = [
  { label: "Keelson changelog RSS feed", icon: Rss },
  { label: "Keelson source and API repos", icon: Code2 },
  { label: "Email Keelson", icon: Mail },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Anchor aria-hidden="true" strokeWidth={2} className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-zinc-900">Keelson</span>
            </div>
            <p className="mt-3 max-w-xs text-sm font-normal text-zinc-600">
              Durable queues, workflows, and scheduling for backend teams. One spine of releases —
              every change bolted to a version, nothing shipped off the record.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-blue-600 hover:text-blue-700 ${FOCUS}`}
                >
                  <Icon aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="min-w-0">
              <h2 className="text-sm font-bold text-zinc-900">{col.heading}</h2>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((label) => (
                  <li key={label}>
                    <a href="#" className={`rounded text-sm font-normal text-zinc-600 transition-colors hover:text-blue-700 ${FOCUS}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-sm font-normal text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Keelson, Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className={`rounded hover:text-zinc-900 ${FOCUS}`}>
              Privacy
            </a>
            <a href="#" className={`rounded hover:text-zinc-900 ${FOCUS}`}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
