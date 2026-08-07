import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import ProcessTabs from "./process-tabs";
import RolesTable from "./roles-table";
import { FOCUS_RING, PERKS } from "./data";

export const metadata: Metadata = {
  title: "Careers — Ridgeline",
  description: "Ridgeline is hiring across Platform, Product, Success, and People. Ten open roles, all visible below.",
};

/**
 * Archetype: a real sortable+searchable <table> of open roles (always fully visible — the careers
 * content contract) + an ARIA tablist walking through the four hiring-process stages + a static
 * perks grid — deliberately not the culture-manifesto+chip-filter-list+drawer, the
 * combobox-search+sortable-benefits-table+lifestrip, or the FAQ-accordion+department-collapse+
 * static-comp-table shells that auto-careers-r1's three candidates already used. Exactly three
 * font-weight classes route-wide: font-normal, font-semibold, font-black. Display face:
 * --font-display-grotesk (light theme, orange accent).
 */
export default function CareersPage() {
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
          <span
            className="text-lg font-semibold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Ridgeline
          </span>
          <a
            href="#roles"
            className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 ${FOCUS_RING}`}
          >
            See open roles
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-800">Careers at Ridgeline</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Ten open roles. No recruiter screen required to see the actual job title.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-700">
            Ridgeline builds the workflow layer that mid-market operations teams run their day on.
            We&apos;re 60 people, mostly remote, and we&apos;re hiring across four teams.
          </p>
        </section>

        {/* Roles table */}
        <section id="roles" aria-labelledby="roles-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Open roles
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              All ten, sortable by column. Search narrows the list — it never hides it entirely.
            </p>
            <div className="mt-8">
              <RolesTable />
            </div>
          </div>
        </section>

        {/* Hiring process */}
        <section aria-labelledby="process-heading" className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="process-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              How hiring works here
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Four stages, five business days to a decision. Step through them below.
            </p>
            <div className="mt-8">
              <ProcessTabs />
            </div>
          </div>
        </section>

        {/* Perks — static, non-interactive by design */}
        <section aria-labelledby="perks-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="perks-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              What everyone gets, full-time or not
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PERKS.map((perk) => (
                <li key={perk.label} className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-white p-4">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-orange-700" />
                  <span className="text-sm font-normal text-zinc-800">{perk.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-200">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Don&apos;t see the right role?
            </h2>
            <a
              href="mailto:jobs@ridgeline.io"
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
          Copyright 2026 Ridgeline, Inc.
        </div>
      </footer>
    </div>
  );
}
