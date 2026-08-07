import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import OrgPods from "./org-pods";
import StatRail from "./stat-rail";
import ValuesTabs from "./values-tabs";
import { FOCUS_RING, MILESTONES } from "./data";

export const metadata: Metadata = {
  title: "About — Cordwell",
  description:
    "Cordwell builds the query engine that lets a four-person on-call rotation debug an outage before the support queue notices.",
};

/**
 * Archetype: sticky segmented stat rail (right, desktop-only sticky) running alongside a scrolling
 * main column whose centerpiece is a click-to-reveal org-pod roster (People) and an ARIA tablist of
 * value statements (Values) — deliberately not the single-column narrative+timeline, the
 * chip-filtered team-grid, or the hover-synced step diagram that auto-about-r1's three candidates
 * already used. Exactly three font-weight classes route-wide: font-normal, font-semibold,
 * font-black. Display face: --font-display-mono (dark theme, rose accent).
 */
export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-rose-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <span
            className="text-lg font-semibold tracking-tight text-zinc-50"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Cordwell
          </span>
          <a
            href="mailto:jobs@cordwell.io"
            className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-50 hover:border-zinc-700 ${FOCUS_RING}`}
          >
            Join the team
            <Mail aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-400">About Cordwell</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Nobody should find out about an outage from a customer.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-400">
            Cordwell is the query engine that sits in front of a customer&apos;s Postgres, so the
            four-person on-call rotation that built it finds the slow query before the support
            queue does.
          </p>
        </section>

        {/* Two-column: sticky stat rail + org pods */}
        <section aria-labelledby="team-heading" className="border-t border-zinc-800">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_300px]">
            <div>
              <h2 id="team-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
                The team
              </h2>
              <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
                Forty people across four pods. Click a pod to see who&apos;s in it — the first one
                is already open.
              </p>
              <div className="mt-8">
                <OrgPods />
              </div>
            </div>
            <StatRail />
          </div>
        </section>

        {/* Values */}
        <section aria-labelledby="values-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="values-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              What we actually believe
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Four statements, not forty. Pick one to read the reasoning behind it.
            </p>
            <div className="mt-8">
              <ValuesTabs />
            </div>
          </div>
        </section>

        {/* Milestones — static, non-interactive by design */}
        <section aria-labelledby="milestones-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="milestones-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              How we got here
            </h2>
            <ol className="mt-8 space-y-6 border-l border-zinc-800 pl-6">
              {MILESTONES.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="text-sm font-semibold tabular-nums text-rose-400">{m.year}</span>
                  <p className="mt-1 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-800">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Want to see the roster grow?
            </h2>
            <a
              href="mailto:jobs@cordwell.io"
              className={`inline-flex items-center gap-2 rounded-full bg-rose-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-rose-300 ${FOCUS_RING}`}
            >
              Email the team
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm font-normal text-zinc-400 sm:px-6">
          Copyright 2026 Cordwell, Inc.
        </div>
      </footer>
    </div>
  );
}
