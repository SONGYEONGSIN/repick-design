import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import RoleBoard from "./role-board";
import CompCalculator from "./comp-calculator";
import { FOCUS_RING, STATS } from "./data";

export const metadata: Metadata = {
  title: "Careers — Loomwork",
  description: "Loomwork is hiring across engineering, product, revenue, and operations. Every open role, on one board.",
};

/**
 * Archetype: a board-first careers page. The primary structure is a kanban-style board — every
 * department's roles are visible in their own column at once, with a regroup control that
 * recomputes the same board by location instead of hiding anything. Selecting a role swaps a
 * single persistent detail panel next to the board (not a drawer, not an inline expansion), and a
 * separate compensation panel resolves a published band from two real inputs (department, years of
 * experience) against a small fixed lookup table. Deliberately not the manifesto+chip-filter+
 * drawer, combobox-search+sortable-table+lifestrip, FAQ-accordion+department-collapse+static-table,
 * sortable-table+process-tablist, checkbox-filter+details+level-slider, or filterless-list+
 * carousel+stepper shells this page type has already used. Exactly three font-weight classes
 * route-wide: font-normal, font-semibold, font-bold. Display face: --font-display-mono (dark
 * theme, violet accent).
 */
export default function CareersPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-violet-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-50">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 flex-none text-violet-400">
              <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.9" />
              <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.55" />
              <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.55" />
              <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.9" />
            </svg>
            Loomwork
          </span>
          <a
            href="#board"
            className={`inline-flex items-center gap-1.5 rounded-full bg-violet-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-violet-300 ${FOCUS_RING}`}
          >
            See open roles
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Careers at Loomwork</p>
          <h1
            id="hero-heading"
            style={{ fontFamily: "var(--font-display-mono)" }}
            className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
          >
            Twelve open roles. One board, every one visible.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-400">
            Loomwork threads the handoffs between sales, support, and operations into one workflow
            graph that customers can see and edit. We&apos;re a 120-person, three-hub team building
            the layer under everyone else&apos;s busywork.
          </p>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-normal uppercase tracking-[0.12em] text-zinc-400">{s.label}</dt>
                <dd className="mt-1 text-3xl font-bold tabular-nums text-zinc-50">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Board */}
        <section id="board" aria-labelledby="board-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="board-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Open roles
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              All twelve roles sit on the board below, grouped by department by default. Switch the
              grouping to see the same roles by hub city instead — nothing is ever hidden, only
              rearranged. Select any card to open it in the panel.
            </p>
            <div className="mt-8">
              <RoleBoard />
            </div>
          </div>
        </section>

        {/* Compensation */}
        <section aria-labelledby="comp-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="comp-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              What we actually pay
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Pick a department and a years-of-experience bucket to see the published band —
              base, equity, and any variable pay note that applies to that group.
            </p>
            <div className="mt-8 max-w-2xl">
              <CompCalculator />
            </div>
          </div>
        </section>

        {/* How we work */}
        <section aria-labelledby="how-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="how-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              How the team works
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                <h3 className="text-base font-semibold text-zinc-50">Three hubs, one clock</h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-400">
                  Austin, Lisbon, and remote across US/EU hours. Every team keeps a four-hour daily
                  overlap so meetings never require a 6am login.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                <h3 className="text-base font-semibold text-zinc-50">Bands are published, not negotiated blind</h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-400">
                  The lookup above is the same table hiring managers use in an offer. What you see
                  is what lands in writing.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                <h3 className="text-base font-semibold text-zinc-50">One interview loop, four conversations</h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-400">
                  Recruiter screen, a working session on a real workflow, a peer panel, and a final
                  conversation with the hiring manager. No surprise rounds added mid-process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-800">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Don&apos;t see the right role?
            </h2>
            <p className="max-w-xl text-base font-normal leading-relaxed text-zinc-400">
              We open new roles most months. Send us a note and what you&apos;d want to work on, and
              we&apos;ll reach out when something matches.
            </p>
            <a
              href="mailto:jobs@loomwork.io"
              className={`inline-flex items-center gap-2 rounded-full bg-violet-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-violet-300 ${FOCUS_RING}`}
            >
              Email the team
              <Mail aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm font-normal text-zinc-400 sm:px-6">Copyright 2026 Loomwork, Inc.</div>
      </footer>
    </div>
  );
}
