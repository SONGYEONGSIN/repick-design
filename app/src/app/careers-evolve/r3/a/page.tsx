import type { Metadata } from "next";
import { ArrowRight, Check, Mail } from "lucide-react";
import OfficeExplorer from "./office-explorer";
import { FOCUS_RING, HQ_ID, OFFICES, PERKS, PROCESS_STEPS, ROLES } from "./data";

export const metadata: Metadata = {
  title: "Careers — Isoline",
  description: "Isoline is hiring across four offices and time zones. Fourteen open roles, browsable by where you'd actually work.",
};

/**
 * Archetype: geography as the primary browsing axis, not a filter chip bolted onto a role list. An
 * ARIA tablist of offices ("All offices" + four real ones) is the main structure of the roles
 * section; the default "All offices" panel already renders all fourteen roles grouped by city with
 * no interaction required (careers content contract). A native <select> narrows by team on top of
 * whichever office is active, a text input narrows by keyword, and a sidebar timezone-overlap panel
 * recomputes per office selection from fixed UTC-hour data — four wired, non-decorative
 * interactions. No wide multi-column table anywhere (avoids the r2 table-crowding-at-390 delta by
 * construction: roles render as single-column cards/list items). Deliberately not the culture-
 * manifesto+chip-filter+drawer, combobox-search+benefits-table+life-strip, FAQ-accordion+
 * department-collapse+comp-table, sortable-table+process-tablist, checkbox-fieldset+details+
 * comp-slider, or filterless-list+quote-carousel+stage-stepper+segmented-toggle shells the five
 * prior careers candidates already used. Exactly three font-weight classes route-wide: font-normal,
 * font-semibold, font-black. Display face: --font-display-grotesk (light theme, amber accent).
 */
export default function CareersPage() {
  const hq = OFFICES.find((o) => o.id === HQ_ID)!;
  const totalHeadcount = OFFICES.reduce((sum, o) => sum + o.headcount, 0);

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
          <span className="text-lg font-semibold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            Isoline
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">Careers at Isoline</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Pick where you&apos;d work first. The roles follow.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-700">
            Isoline runs the payroll and compliance infrastructure that lets B2B companies pay and
            regulate a team in fourteen countries without fourteen separate vendors. We&apos;re{" "}
            {totalHeadcount} people across four offices and time zones, and every open role below is
            filed under a real city — not a vague &ldquo;remote&rdquo; catch-all.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-zinc-200 pt-8 sm:grid-cols-4">
            <div>
              <dt className="text-xs font-normal uppercase tracking-wide text-zinc-500">Open roles</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{ROLES.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-normal uppercase tracking-wide text-zinc-500">Offices</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{OFFICES.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-normal uppercase tracking-wide text-zinc-500">Time zones spanned</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">13</dd>
            </div>
            <div>
              <dt className="text-xs font-normal uppercase tracking-wide text-zinc-500">HQ</dt>
              <dd className="mt-1 text-2xl font-semibold text-zinc-900">{hq.city}</dd>
            </div>
          </dl>
        </section>

        {/* Roles — office-first explorer */}
        <section id="roles" aria-labelledby="roles-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Open roles, by office
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Start with a city, or leave it on &ldquo;All offices&rdquo; to see everything at once.
              Team and keyword narrow further — neither one ever hides the list entirely.
            </p>
            <div className="mt-8">
              <OfficeExplorer />
            </div>
          </div>
        </section>

        {/* Hiring process — static, deliberately not another tablist or accordion */}
        <section aria-labelledby="process-heading" className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="process-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              How hiring works, wherever you are
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Four steps, always scheduled inside your own working hours — not ours.
            </p>
            <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PROCESS_STEPS.map((step, i) => (
                <li key={step.label} className="rounded-xl border border-zinc-200 p-5">
                  <span className="text-sm font-semibold tabular-nums text-amber-800">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-base font-semibold text-zinc-900">{step.label}</p>
                  <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Benefits — static, non-interactive by design */}
        <section aria-labelledby="benefits-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="benefits-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              What everyone gets, in every office
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Beyond this, each office adds its own local perk — see the sidebar when you pick a city above.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PERKS.map((perk) => (
                <li key={perk.label} className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-white p-4">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-amber-700" />
                  <span className="text-sm font-normal text-zinc-800">{perk.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="apply" aria-labelledby="cta-heading" className="border-t border-zinc-200">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Don&apos;t see the right role in the right city?
            </h2>
            <p className="max-w-xl text-base font-normal leading-relaxed text-zinc-700">
              We open new offices when the compliance work demands it, not before. Tell us where you
              are and what you do, and we&apos;ll reach out if that changes.
            </p>
            <a
              href="mailto:jobs@isoline.io"
              className={`inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-400 ${FOCUS_RING}`}
            >
              Email the team
              <Mail aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto px-4 py-8 text-sm font-normal text-zinc-600 sm:px-6 max-w-5xl">
          Copyright 2026 Isoline, Inc.
        </div>
      </footer>
    </div>
  );
}
