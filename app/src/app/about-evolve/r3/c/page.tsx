import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import PeopleDirectory from "./people-directory";
import RegionChart from "./region-chart";
import PrinciplesPanel from "./principles-panel";
import { COMPANY, FOCUS_RING, MILESTONES } from "./data";

export const metadata: Metadata = {
  title: "About — Sextant",
  description:
    "Sextant reconciles usage, billing, and support data into the metrics a board will actually trust. Meet the sixteen people who build it, the principles that govern the roadmap, and the four regions that keep it running.",
};

/**
 * Archetype: a single-column, mostly-static "About" narrative whose three functional interactions
 * are all quick, reference-driven controls rather than a shared hover-synced diagram, a chip/select
 * filter, a range-scrubber, or a <details>-based accordion — the six shells auto-about-r1/r2 already
 * used. People are found through a live type-to-filter quick-find (no <select>, no chips) over a
 * flat roster; the regional headcount is a hover/focus/click bar chart whose detail readout always
 * shows a real region (never an empty default); the six principles are read one at a time behind a
 * cumulative "N of 6 reviewed" progress meter that only fills forward, not a plain tab switch.
 * History stays a static, non-interactive list on purpose — not every section needs a mechanism.
 * Exactly three font-weight classes route-wide: font-normal, font-semibold, font-black. Display
 * face: --font-display-wide. Dark theme, cyan accent.
 */
export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <span
            className="text-lg font-semibold tracking-tight text-zinc-50"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            {COMPANY.name}
          </span>
          <a
            href="mailto:careers@sextant.io"
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            About {COMPANY.name}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            We measure what the business did, not what the dashboard says it did.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-400">
            Sextant reconciles usage, billing, and support data into the metrics a board will
            actually defend — no manual joins, no CSV exports, no &ldquo;directionally correct.&rdquo;
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-zinc-800 pt-8 sm:grid-cols-4">
            <div>
              <dt className="text-sm font-normal text-zinc-400">Founded</dt>
              <dd className="mt-1 text-2xl font-black tabular-nums text-zinc-50">{COMPANY.founded}</dd>
            </div>
            <div>
              <dt className="text-sm font-normal text-zinc-400">Team</dt>
              <dd className="mt-1 text-2xl font-black tabular-nums text-zinc-50">{COMPANY.headcount}</dd>
            </div>
            <div>
              <dt className="text-sm font-normal text-zinc-400">Regions</dt>
              <dd className="mt-1 text-2xl font-black tabular-nums text-zinc-50">{COMPANY.regionCount}</dd>
            </div>
            <div>
              <dt className="text-sm font-normal text-zinc-400">Companies</dt>
              <dd className="mt-1 text-2xl font-black tabular-nums text-zinc-50">{COMPANY.customers}</dd>
            </div>
          </dl>
        </section>

        {/* Why the name / mission */}
        <section aria-labelledby="mission-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="mission-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Why we&apos;re named after a navigation instrument
            </h2>
            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              A sextant doesn&apos;t guess your position — it triangulates it from fixed points you
              can check yourself. We apply the same discipline to SaaS metrics: every number in the
              product traces back to a query, and every query traces back to an event someone can
              inspect. Founders Renata Cole and Idris Faw started the company after each spent a
              year reconciling the same kind of billing spreadsheet by hand, at two different
              companies, and arriving at two different answers.
            </p>
          </div>
        </section>

        {/* People */}
        <section aria-labelledby="people-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="people-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              The team
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Sixteen people across four regions, listed in full below. Search narrows the list —
              it never hides it.
            </p>
            <div className="mt-8">
              <PeopleDirectory />
            </div>
          </div>
        </section>

        {/* Regional distribution */}
        <section aria-labelledby="regions-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="regions-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Coverage by region
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Support follows the sun across four regions. Hover, focus, or tap a bar for the
              on-call handoff.
            </p>
            <div className="mt-8 max-w-2xl">
              <RegionChart />
            </div>
          </div>
        </section>

        {/* Values / principles */}
        <section aria-labelledby="principles-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="principles-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Six rules we enforce in code review
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Not a poster in the hallway. Open each one — the bar below tracks what you&apos;ve
              actually read.
            </p>
            <div className="mt-8">
              <PrinciplesPanel />
            </div>
          </div>
        </section>

        {/* Milestones — static, non-interactive by design */}
        <section aria-labelledby="milestones-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="milestones-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              How we got here
            </h2>
            <ol className="mt-8 space-y-6 border-l border-zinc-800 pl-6">
              {MILESTONES.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span className="text-sm font-semibold tabular-nums text-cyan-300">{m.year}</span>
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
              Want to argue with the query, not the dashboard?
            </h2>
            <a
              href="mailto:careers@sextant.io"
              className={`inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 ${FOCUS_RING}`}
            >
              Email the team
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm font-normal text-zinc-400 sm:px-6">
          Copyright 2026 {COMPANY.name}, Inc.
        </div>
      </footer>
    </div>
  );
}
