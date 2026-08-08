import type { Metadata } from "next";
import { ArrowRight, Mail, MapPin, Users2 } from "lucide-react";
import RoleExplorer from "./role-explorer";
import { FOCUS_RING, LOCATION_LABELS, PRINCIPLES, ROLES, TRACK_LABELS, type Track, type LocationKey } from "./data";

export const metadata: Metadata = {
  title: "Careers — Fenmark",
  description:
    "Fenmark is hiring across engineering, design, sales, and customer success. Type in your years of experience and see the published band, live.",
};

const TRACK_COUNT = new Set(ROLES.map((r) => r.track)).size;
const LOCATION_COUNT = new Set(ROLES.map((r) => r.location)).size;

/**
 * Archetype: an input-driven pay calculator — a numeric years-of-experience stepper + track/
 * location <select> pair that runs a fixed step function and a published base-band table through
 * real arithmetic (band × location multiplier, rounded) to a live salary/equity readout — laid
 * over an always-visible role card grid that the calculator highlights (never gates). Deliberately
 * not the culture-manifesto+chip-filter+drawer, combobox-search+sortable-table+lifestrip, FAQ-
 * accordion+department-collapse+static-table, sortable-table+tablist+perk-grid, checkbox-filter+
 * details+range-slider, or filterless-list+carousel+stepper+segmented-toggle shells already used
 * across auto-careers-r1 and r2. Light theme, rose accent, no display face — --font-sans only.
 * Exactly three font-weight classes route-wide: font-normal, font-semibold, font-bold.
 */
export default function CareersPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-zinc-900">Fenmark</span>
          <a
            href="#roles"
            className={`inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 ${FOCUS_RING}`}
          >
            See open roles
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">Careers at Fenmark</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
          >
            Know what a role pays before you write the cover letter.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-600">
            Fenmark builds routing and compliance software for field-service and logistics teams —
            the layer that decides which truck goes where, and proves it to an auditor afterward.
            We&apos;re 110 people across three offices and remote.
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-zinc-200 pt-6">
            <div>
              <dt className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-600">Open roles</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-zinc-900">{ROLES.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-600">Teams</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-zinc-900">{TRACK_COUNT}</dd>
            </div>
            <div>
              <dt className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-600">Locations</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-zinc-900">{LOCATION_COUNT}</dd>
            </div>
          </dl>
        </section>

        {/* Calculator + always-visible role list */}
        <section id="roles" aria-labelledby="roles-heading" className="border-t border-zinc-200 bg-zinc-50/60">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Open roles &amp; pay estimator
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-600">
              Every open role is listed below with no clicks required. Enter your experience, team,
              and location on the left and the estimate — and the matching roles — update live.
            </p>
            <div className="mt-8">
              <RoleExplorer />
            </div>
          </div>
        </section>

        {/* Track / location index — static, complements the calculator with a plain summary */}
        <section aria-labelledby="index-heading" className="border-t border-zinc-200">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="index-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Where the roles are
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Users2 aria-hidden="true" className="h-4 w-4 text-rose-700" />
                  By team
                </div>
                <ul className="mt-3 space-y-2">
                  {(Object.keys(TRACK_LABELS) as Track[]).map((t) => {
                    const count = ROLES.filter((r) => r.track === t).length;
                    return (
                      <li key={t} className="flex items-center justify-between text-sm font-normal text-zinc-600">
                        <span>{TRACK_LABELS[t]}</span>
                        <span className="tabular-nums text-zinc-900">{count}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-rose-700" />
                  By location
                </div>
                <ul className="mt-3 space-y-2">
                  {(Object.keys(LOCATION_LABELS) as LocationKey[]).map((l) => {
                    const count = ROLES.filter((r) => r.location === l).length;
                    return (
                      <li key={l} className="flex items-center justify-between text-sm font-normal text-zinc-600">
                        <span>{LOCATION_LABELS[l]}</span>
                        <span className="tabular-nums text-zinc-900">{count}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pay principles */}
        <section aria-labelledby="principles-heading" className="border-t border-zinc-200 bg-zinc-50/60">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="principles-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              How we think about pay
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <div key={p.index} className="flex gap-4">
                  <span className="text-sm font-bold tabular-nums text-rose-700">{p.index}</span>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">{p.title}</h3>
                    <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-200">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Don&apos;t see the right role?
            </h2>
            <p className="max-w-xl text-base font-normal leading-relaxed text-zinc-600">
              We review every note. Tell us your team, level, and location and we&apos;ll point you
              to the closest published band.
            </p>
            <a
              href="mailto:jobs@fenmark.io"
              className={`inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 ${FOCUS_RING}`}
            >
              Email the team
              <Mail aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm font-normal text-zinc-600 sm:px-6">
          Copyright 2026 Fenmark, Inc.
        </div>
      </footer>
    </div>
  );
}
