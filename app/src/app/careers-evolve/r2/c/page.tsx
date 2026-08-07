import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import BenefitsToggle from "./benefits-toggle";
import QuoteCarousel from "./quote-carousel";
import StageStepper from "./stage-stepper";
import { FOCUS_RING, ROLES } from "./data";

export const metadata: Metadata = {
  title: "Careers — Harborlight",
  description: "Harborlight is hiring across engineering, marketing, support, and finance. Six open roles.",
};

/**
 * Archetype: a plain always-visible role list (no filter chrome at all — the simplest possible
 * satisfaction of the careers content contract), a team-quote carousel with play/pause, a
 * click-to-reveal interview-stage stepper, and a full-time/contract benefits toggle — deliberately
 * not the culture-manifesto+chip-filter-list+drawer, the combobox-search+sortable-benefits-
 * table+lifestrip, or the FAQ-accordion+department-collapse+static-comp-table shells that
 * auto-careers-r1's three candidates already used, and not the sortable-table+process-tablist or
 * faceted-checkbox+level-slider shells this round's candidates a and b already use. Exactly three
 * font-weight classes route-wide: font-normal, font-semibold, font-black. No display face
 * override (light theme, green accent).
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
          <span className="text-lg font-semibold tracking-tight text-zinc-900">Harborlight</span>
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Careers at Harborlight</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
          >
            Six open roles. No account required to read a single one of them.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-700">
            Harborlight processes payments for small merchants who&apos;d otherwise be stuck with a
            bank&apos;s idea of customer support. We&apos;re 28 people, hiring across four teams.
          </p>
        </section>

        {/* Roles — plain list, no filter chrome */}
        <section id="roles" aria-labelledby="roles-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Open roles
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              All six. No filter to figure out first.
            </p>
            <ul className="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
              {ROLES.map((role) => (
                <li key={role.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4">
                  <span className="text-base font-semibold text-zinc-900">{role.title}</span>
                  <span className="text-sm font-normal text-zinc-600">
                    {role.team} &middot; {role.location}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Team quotes */}
        <section aria-labelledby="quotes-heading" className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="quotes-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              What it&apos;s actually like
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Three people, three tenures. Advance manually or press play.
            </p>
            <div className="mt-8">
              <QuoteCarousel />
            </div>
          </div>
        </section>

        {/* Interview stages */}
        <section aria-labelledby="stages-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="stages-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              How hiring works here
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Four stages. Click one to read what actually happens at it.
            </p>
            <div className="mt-8">
              <StageStepper />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section aria-labelledby="benefits-heading" className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="benefits-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Benefits, by employment type
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Contract roles get a different package than full-time — here&apos;s exactly how they differ.
            </p>
            <div className="mt-8">
              <BenefitsToggle />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Don&apos;t see the right role?
            </h2>
            <a
              href="mailto:jobs@harborlight.io"
              className={`inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 ${FOCUS_RING}`}
            >
              Email the team
              <Mail aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm font-normal text-zinc-600 sm:px-6">
          Copyright 2026 Harborlight, Inc.
        </div>
      </footer>
    </div>
  );
}
