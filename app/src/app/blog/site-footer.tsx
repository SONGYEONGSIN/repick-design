// app/src/app/blog-evolve/r2/b/site-footer.tsx
//
// A sibling of `<main>`, not nested inside it, so it keeps its implicit `contentinfo` landmark. The
// primary nav links are echoed here as a second, always-visible path to the same destinations —
// belt-and-suspenders alongside the header's mobile disclosure panel.
import { Activity, ExternalLink, Globe, Mail, Rss } from "lucide-react";
import { NAV_LINKS } from "./nav-links";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const RESOURCE_LINKS = ["Full dataset exports", "Benchmark harness (open source)", "Cite a report", "RSS feed"];
const COMPANY_LINKS = ["About Baseline", "Editorial standards", "Contact the editors", "Careers"];

const SOCIAL_LINKS = [
  { label: "Baseline RSS feed", icon: Rss },
  { label: "Email the editors", icon: Mail },
  { label: "Baseline website", icon: Globe },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400 text-zinc-950">
                <Activity aria-hidden="true" strokeWidth={2.25} className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
                Baseline
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm font-normal text-zinc-400">
              An independent benchmark journal. Every report ships with its methodology, sample size
              and raw comparison numbers — the finding is the headline, not the illustration.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-emerald-400 hover:text-emerald-400 ${FOCUS_RING}`}
                >
                  <Icon aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-zinc-50">Navigate</h2>
            <ul className="mt-3 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={`rounded text-sm font-normal text-zinc-400 transition-colors hover:text-emerald-400 ${FOCUS_RING}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-zinc-50">Resources</h2>
            <ul className="mt-3 space-y-2.5">
              {RESOURCE_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className={`inline-flex items-center gap-1 rounded text-sm font-normal text-zinc-400 transition-colors hover:text-emerald-400 ${FOCUS_RING}`}>
                    {label}
                    <ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-zinc-50">Company</h2>
            <ul className="mt-3 space-y-2.5">
              {COMPANY_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className={`rounded text-sm font-normal text-zinc-400 transition-colors hover:text-emerald-400 ${FOCUS_RING}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-zinc-800 pt-6 text-sm font-normal text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Baseline Journal. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className={`rounded hover:text-zinc-50 ${FOCUS_RING}`}>
              Privacy
            </a>
            <a href="#" className={`rounded hover:text-zinc-50 ${FOCUS_RING}`}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
