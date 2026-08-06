import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import RolesBoard from "./roles-board";
import { FOCUS_RING, ROLES } from "./data";

export const metadata: Metadata = {
  title: "Careers — Fathom Labs",
  description:
    "Fathom Labs builds the observability layer engineering teams reach for during an outage. See open roles and what it's like to work here.",
};

/**
 * Culture manifesto + filterable open-roles archetype. Editorial prose blocks use deterministic
 * inline SVG accents (no photos, no remote hosts). The Open Roles list, its two-facet filter, its
 * sort control, and its slide-over drawer all live in the client component `roles-board.tsx`.
 * Exactly three font-weight classes appear across this route: font-normal, font-semibold, font-black.
 */
export default function CareersPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Fathom Labs</span>
          <a
            href="#open-roles"
            className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 hover:border-blue-400 hover:text-blue-200 ${FOCUS_RING}`}
          >
            View open roles
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Careers at Fathom Labs</p>
          <h1
            id="hero-heading"
            className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            We build the instruments engineers trust during an outage.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-400">
            Fathom Labs makes the observability platform that tells an on-call engineer what broke,
            why, and where — in seconds, not tabs. We hire people who want that answer to be right
            more than they want it to look impressive.
          </p>
          <p className="mt-6 text-sm font-normal text-zinc-500">
            <span className="tabular-nums font-semibold text-zinc-200">38</span> people, across{" "}
            <span className="tabular-nums font-semibold text-zinc-200">14</span> countries, on{" "}
            <span className="tabular-nums font-semibold text-zinc-200">6</span> teams.
          </p>
        </section>

        {/* Editorial block 1 — How we work */}
        <section
          aria-labelledby="work-heading"
          className="border-t border-zinc-900 bg-zinc-900/30"
        >
          <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-14">
            <div>
              <h2 id="work-heading" className="text-2xl font-black leading-tight text-zinc-50 sm:text-3xl">
                How we work
              </h2>
              <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-zinc-400">
                We are distributed across fourteen countries, which means most decisions are made in
                writing before they are made in a meeting. A design doc or a written proposal gets a
                deadline for comments, not a calendar invite. Four days a month carry no internal
                meetings at all — engineers spend them heads-down, and it shows in what ships the
                following week.
              </p>
              <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-zinc-400">
                On-call is real but bounded: a documented rotation, a page budget the team reviews
                monthly, and an explicit rule that a system paging the same person three nights in a
                row is a bug in the system, not in the person.
              </p>
            </div>
            <svg
              viewBox="0 0 240 200"
              role="img"
              aria-label="Abstract diagram of connected nodes representing distributed, asynchronous work"
              className="h-auto w-full max-w-xs justify-self-center text-zinc-700 md:justify-self-end"
            >
              <line x1="40" y1="150" x2="120" y2="60" stroke="currentColor" strokeWidth="1.5" />
              <line x1="120" y1="60" x2="200" y2="110" stroke="currentColor" strokeWidth="1.5" />
              <line x1="120" y1="60" x2="150" y2="30" stroke="currentColor" strokeWidth="1.5" />
              <line x1="40" y1="150" x2="90" y2="170" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="40" cy="150" r="9" fill="#0a0a0f" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="120" cy="60" r="12" fill="#0a0a0f" stroke="#60a5fa" strokeWidth="2" />
              <circle cx="200" cy="110" r="9" fill="#0a0a0f" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="150" cy="30" r="7" fill="#0a0a0f" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="90" cy="170" r="7" fill="#0a0a0f" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </section>

        {/* Editorial block 2 — How we build */}
        <section aria-labelledby="build-heading" className="border-t border-zinc-900">
          <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.3fr] md:items-center md:gap-14">
            <svg
              viewBox="0 0 240 200"
              role="img"
              aria-label="Abstract diagram of ascending bars representing incremental, reviewed shipping"
              className="h-auto w-full max-w-xs justify-self-center text-zinc-700 md:order-1 md:justify-self-start"
            >
              <rect x="30" y="140" width="26" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="76" y="110" width="26" height="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="122" y="75" width="26" height="105" fill="none" stroke="#60a5fa" strokeWidth="2" />
              <rect x="168" y="40" width="26" height="140" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="20" y1="180" x2="210" y2="180" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className="md:order-2">
              <h2 id="build-heading" className="text-2xl font-black leading-tight text-zinc-50 sm:text-3xl">
                How we build
              </h2>
              <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-zinc-400">
                Nothing ships behind a feature flag forever. We break work into changes small enough
                to review in one sitting, and we ship them to a slice of real traffic before the
                whole rollout. The ingest pipeline that handles two million events a second today
                grew that way — one reviewed, reversible step at a time, not one rewrite.
              </p>
              <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-zinc-400">
                Every engineer carries a pager, including the ones who lead the teams. If an
                architecture is painful to operate at 3am, the person who designed it finds out
                directly, not through a ticket.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial block 3 — How we grow */}
        <section aria-labelledby="grow-heading" className="border-t border-zinc-900 bg-zinc-900/30">
          <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-14">
            <div>
              <h2 id="grow-heading" className="text-2xl font-black leading-tight text-zinc-50 sm:text-3xl">
                How we grow
              </h2>
              <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-zinc-400">
                Every person gets a two-thousand-dollar annual budget for courses, books, or a
                conference, spent without a manager's approval. Levels are published internally —
                what a senior engineer is expected to own is written down, not passed around as
                office folklore.
              </p>
              <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-zinc-400">
                The founding engineering team has stuck around for an average of six years, which we
                take as a signal the growth path holds up past the first promotion, not just as a
                nice number for a careers page.
              </p>
            </div>
            <svg
              viewBox="0 0 240 200"
              role="img"
              aria-label="Abstract diagram of an ascending staircase representing career growth"
              className="h-auto w-full max-w-xs justify-self-center text-zinc-700 md:justify-self-end"
            >
              <path
                d="M20 180 H60 V150 H100 V115 H140 V75 H180 V35 H210"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="210" cy="35" r="8" fill="#0a0a0f" stroke="#60a5fa" strokeWidth="2" />
            </svg>
          </div>
        </section>

        {/* Open roles */}
        <section
          id="open-roles"
          aria-labelledby="roles-heading"
          className="border-t border-zinc-900 scroll-mt-8"
        >
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="roles-heading" className="text-2xl font-black leading-tight text-zinc-50 sm:text-3xl">
              Open roles
            </h2>
            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              {ROLES.length} roles open across engineering, design, product, support, sales, and
              operations. Filter by team and location, then open a role for the full description.
            </p>

            <div className="mt-8">
              <RolesBoard />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold text-zinc-100">Fathom Labs</p>
            <p className="mt-1 text-sm font-normal text-zinc-500">
              Observability that tells you what broke, why, and where.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-normal text-zinc-400">
            <a href="#open-roles" className={`rounded-sm hover:text-zinc-100 ${FOCUS_RING}`}>
              Open roles
            </a>
            <a href="mailto:careers@fathomlabs.io" className={`rounded-sm hover:text-zinc-100 ${FOCUS_RING}`}>
              careers@fathomlabs.io
            </a>
            <span className="text-zinc-600">© 2026 Fathom Labs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
