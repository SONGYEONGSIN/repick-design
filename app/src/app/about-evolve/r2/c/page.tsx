import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import OfficeDirectory from "./office-directory";
import PeopleByRole from "./people-by-role";
import PillarCarousel from "./pillar-carousel";
import { FOCUS_RING } from "./data";

export const metadata: Metadata = {
  title: "About — Solmark",
  description:
    "Solmark tracks freight across seven offices and three continents so a shipment's status is never a guess.",
};

/**
 * Archetype: a region-filtered office directory (native select), a function-filtered people list
 * (native select), and a manually-advanced culture-pillar carousel with an explicit play/pause
 * toggle — deliberately not the single-column narrative+timeline, the chip-filtered team-grid, or
 * the hover-synced step diagram that auto-about-r1's three candidates already used, and not the
 * sticky-rail/org-pod/tablist shell or the year-scrubber/alpha-index/details-accordion shell that
 * this round's candidates a and b already use. Exactly three font-weight classes route-wide:
 * font-normal, font-semibold, font-black. No display face override (dark theme, fuchsia accent).
 */
export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fuchsia-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-zinc-50">Solmark</span>
          <a
            href="mailto:jobs@solmark.io"
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-400">About Solmark</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
          >
            A shipment&apos;s status should never be a guess.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-400">
            Solmark tracks freight from origin port to final mile across seven offices and three
            continents, so a customer&apos;s dashboard says the same thing the carrier does.
          </p>
        </section>

        {/* Offices */}
        <section aria-labelledby="offices-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="offices-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Seven offices, three continents
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Freight doesn&apos;t stop moving at a time zone boundary, so neither do we.
            </p>
            <div className="mt-8">
              <OfficeDirectory />
            </div>
          </div>
        </section>

        {/* People */}
        <section aria-labelledby="people-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="people-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Who you&apos;d actually work with
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Filter by function, or leave it on &ldquo;All&rdquo; to see the whole roster at once.
            </p>
            <div className="mt-8">
              <PeopleByRole />
            </div>
          </div>
        </section>

        {/* Culture pillars */}
        <section aria-labelledby="pillars-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="pillars-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              How we actually operate
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Four pillars, one at a time. Advance manually or press play — nothing moves until you
              ask it to.
            </p>
            <div className="mt-8 max-w-2xl">
              <PillarCarousel />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-800">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Want an eighth office on that list?
            </h2>
            <a
              href="mailto:jobs@solmark.io"
              className={`inline-flex items-center gap-2 rounded-full bg-fuchsia-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-fuchsia-300 ${FOCUS_RING}`}
            >
              Email the team
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm font-normal text-zinc-400 sm:px-6">
          Copyright 2026 Solmark, Inc.
        </div>
      </footer>
    </div>
  );
}
