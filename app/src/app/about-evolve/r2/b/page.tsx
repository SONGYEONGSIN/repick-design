import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import PeopleIndex from "./people-index";
import ValuesAccordion from "./values-accordion";
import YearScrubber from "./year-scrubber";
import { FOCUS_RING } from "./data";

export const metadata: Metadata = {
  title: "About — Fenwick",
  description:
    "Fenwick keeps two systems of record honest with each other, without anyone on either team thinking about it.",
};

/**
 * Archetype: a year-scrubber (native range input) driving fixed historical stats, an alphabetical
 * people index with letter-jump anchors and per-row native <details> bios, and a native <details>
 * values accordion — deliberately not the single-column narrative+timeline, the chip-filtered
 * team-grid, or the hover-synced step diagram that auto-about-r1's three candidates already used,
 * and not the sticky-rail/org-pod/tablist shell of this round's candidate a. Exactly three
 * font-weight classes route-wide: font-normal, font-semibold, font-black. No display face override
 * (body sans only, light theme, lime accent).
 */
export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-zinc-900">Fenwick</span>
          <a
            href="mailto:jobs@fenwick.io"
            className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-900 ${FOCUS_RING}`}
          >
            Join the team
            <Mail aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero + year scrubber */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <h1 id="hero-heading" className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl">
            Two systems of record, honest with each other, every time.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-700">
            Fenwick is the sync engine that keeps a customer&apos;s ERP and their warehouse system
            saying the same thing, even when one of them is wrong.
          </p>

          <div className="mt-12 max-w-2xl rounded-2xl border border-zinc-200 p-6 sm:p-8">
            <YearScrubber />
          </div>
        </section>

        {/* People */}
        <section aria-labelledby="people-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="people-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              The 12 you&apos;d actually talk to
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              34 people work at Fenwick. These are the ones a new customer meets first — jump to a
              letter, or open a row for the longer version.
            </p>
            <div className="mt-8">
              <PeopleIndex />
            </div>
          </div>
        </section>

        {/* Values */}
        <section aria-labelledby="values-heading" className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="values-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              What we actually believe
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Four statements. The first one is open — the rest are one click away.
            </p>
            <div className="mt-8">
              <ValuesAccordion />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Want to be person 13 on that list?
            </h2>
            <a
              href="mailto:jobs@fenwick.io"
              className={`inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 ${FOCUS_RING}`}
            >
              Email the team
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm font-normal text-zinc-600 sm:px-6">
          Copyright 2026 Fenwick, Inc.
        </div>
      </footer>
    </div>
  );
}
