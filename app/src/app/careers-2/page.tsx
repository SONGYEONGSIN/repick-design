import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import LevelSlider from "./level-slider";
import RoleFilterGrid from "./role-filter-grid";
import { FOCUS_RING } from "./data";

export const metadata: Metadata = {
  title: "Careers — Talus",
  description: "Talus is hiring across engineering, design, sales, and support. Eight open roles, real comp bands.",
};

/**
 * Archetype: a faceted checkbox filter (team + location) over an always-visible role card grid
 * with per-card native <details> for extra responsibilities, plus a level range-slider that
 * selects a fixed, published comp band — deliberately not the culture-manifesto+chip-filter-
 * list+drawer, the combobox-search+sortable-benefits-table+lifestrip, or the FAQ-accordion+
 * department-collapse+static-comp-table shells that auto-careers-r1's three candidates already
 * used, and not the sortable-table+process-tablist shell this round's candidate a already uses.
 * Exactly three font-weight classes route-wide: font-normal, font-semibold, font-black. No
 * display face override (dark theme, teal accent).
 */
export default function CareersPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-teal-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-zinc-50">Talus</span>
          <a
            href="#roles"
            className={`inline-flex items-center gap-1.5 rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-teal-300 ${FOCUS_RING}`}
          >
            See open roles
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Careers at Talus</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
          >
            Eight open roles. Every comp band is published, not negotiated blind.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-400">
            Talus builds infrastructure monitoring for teams that can&apos;t afford to find out
            about an outage from Twitter. We&apos;re 45 people across three offices and remote.
          </p>
        </section>

        {/* Roles */}
        <section id="roles" aria-labelledby="roles-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Open roles
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Filter by team or location, or leave both empty to see all eight at once.
            </p>
            <div className="mt-8">
              <RoleFilterGrid />
            </div>
          </div>
        </section>

        {/* Level explorer */}
        <section aria-labelledby="comp-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="comp-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              What we actually pay
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Five levels, five published bands. Drag the slider — nothing here is a guess.
            </p>
            <div className="mt-8 max-w-xl">
              <LevelSlider />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-800">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Don&apos;t see the right role?
            </h2>
            <a
              href="mailto:jobs@talus.io"
              className={`inline-flex items-center gap-2 rounded-full bg-teal-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-teal-300 ${FOCUS_RING}`}
            >
              Email the team
              <Mail aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm font-normal text-zinc-400 sm:px-6">
          Copyright 2026 Talus, Inc.
        </div>
      </footer>
    </div>
  );
}
