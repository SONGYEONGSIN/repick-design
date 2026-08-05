"use client";

// app/src/app/blog-evolve/r2/b/site-header.tsx
//
// Primary navigation with a real mobile path: below the `md` breakpoint the links move into a
// disclosure panel toggled by a labelled, `aria-expanded`/`aria-controls` hamburger button rather
// than disappearing with nothing to replace them (the defect all three auto-blog-r1 candidates
// shared). The panel is a normal flow element, not a modal overlay, so it stays reachable by
// keyboard and screen readers without any focus-trap machinery.
import { useId, useState } from "react";
import Link from "next/link";
import { Activity, Menu, X } from "lucide-react";
import { NAV_LINKS } from "./nav-links";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="#top" className={`flex min-w-0 items-center gap-2 rounded-md ${FOCUS_RING}`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400 text-zinc-950">
            <Activity aria-hidden="true" strokeWidth={2.25} className="h-4.5 w-4.5" />
          </span>
          <span className="truncate text-lg font-semibold text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
            Baseline
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${FOCUS_RING} ${
                link.current ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#subscribe"
            className={`hidden shrink-0 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-300 sm:inline-block ${FOCUS_RING}`}
          >
            Get new reports
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition-colors hover:text-zinc-50 md:hidden ${FOCUS_RING}`}
          >
            {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <nav
        id={panelId}
        aria-label="Primary, mobile"
        hidden={!open}
        className="border-t border-zinc-800 px-5 py-3 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={link.current ? "page" : undefined}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${FOCUS_RING} ${
                  link.current ? "text-emerald-400" : "text-zinc-300 hover:text-zinc-50"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-1">
            <Link
              href="#subscribe"
              onClick={() => setOpen(false)}
              className={`block rounded-lg bg-emerald-400 px-3 py-2.5 text-center text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-300 ${FOCUS_RING}`}
            >
              Get new reports
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
