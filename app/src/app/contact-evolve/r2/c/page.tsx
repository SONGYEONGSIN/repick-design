import type { Metadata } from "next";
import { ArrowUpRight, Mail, Phone, MapPin, Info, Send, ShieldAlert } from "lucide-react";
import DirectoryClient from "./directory-client";
import { COMPANY, FOCUS_RING } from "./data";

export const metadata: Metadata = {
  title: "Contact — Overrun",
  description:
    "Six support desks, searchable by what happened. Every address, phone line, and coverage window renders before you touch anything.",
};

/**
 * Archetype: a searchable staff directory, not a form and not a clock. The page's spine is the desk
 * list itself — all six desks, their published addresses, their staffed hours, and the conditions
 * under which a reply is delayed render in full at the zero-interaction default, above the fold. The
 * one interactive device is a live-narrowing search box plus category chips over that fixed,
 * deterministic six-row array (`directory-client.tsx`) — filtering only ever *finds* a channel
 * faster, it never gates one. Two-pane chrome: a sticky category rail sits beside the card list on
 * wide viewports, and the search bar itself goes sticky on narrow ones — deliberately not the
 * "hero paragraph + bordered meta-strip + single device" shape, and not a dense table with
 * row-level disclosure either.
 *
 * No clock is read anywhere. Response promises are static per-desk text plus a fixed weekday
 * coverage strip (Mon…Sun, hard-coded per desk) — the page states when a promise breaks (desk
 * closing hours, uncovered weekdays) as prose and a decorative day grid, never as a time-of-day
 * input.
 *
 * Light theme, orange accent (orange-700 interactive surfaces and links, orange-100/50 tints,
 * orange-800 for stronger text on tinted backgrounds). Display face `--font-display-mono` on the h1
 * and section headings only (Latin, display sizes — chosen for a directory concept, evokes tabular
 * listings without using the tabular body face for prose). Body and all Korean stay on
 * `--font-sans`. Exactly three weight classes route-wide: `font-normal`, `font-semibold`,
 * `font-bold`.
 */
export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <span
            className="text-lg font-bold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {COMPANY.name}
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={COMPANY.statusUrl}
              className={`inline-flex items-center gap-1.5 rounded text-sm font-normal text-zinc-700 hover:text-orange-700 ${FOCUS_RING}`}
            >
              System status
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            <a
              href={`mailto:${COMPANY.generalEmail}`}
              className={`inline-flex items-center gap-1.5 rounded text-sm font-semibold text-orange-700 hover:text-orange-800 ${FOCUS_RING}`}
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              {COMPANY.generalEmail}
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Short opening band — eyebrow, h1, one paragraph carrying the general channel as real
            links. No bordered stat strip below it; the directory itself is the next thing on the
            page. */}
        <section aria-labelledby="page-heading" className="border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Contact</p>
            <h1
              id="page-heading"
              className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Find the desk, not a queue.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-normal leading-relaxed text-zinc-700 sm:text-lg">
              {COMPANY.name} is {COMPANY.line}. Six desks below cover everything from a late package
              to a locked account — search by what happened, or write straight to{" "}
              <a
                href={`mailto:${COMPANY.generalEmail}`}
                className={`rounded font-semibold text-orange-700 underline underline-offset-2 hover:text-orange-800 ${FOCUS_RING}`}
              >
                {COMPANY.generalEmail}
              </a>{" "}
              and a person will forward it by hand. Prefer a call?{" "}
              <a
                href={`tel:${COMPANY.generalPhone}`}
                className={`inline-flex items-center gap-1 rounded font-semibold text-orange-700 underline underline-offset-2 hover:text-orange-800 ${FOCUS_RING}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                {COMPANY.generalPhoneLabel}
              </a>
              , {COMPANY.generalHours}. A compromised account doesn&apos;t wait for that window — the
              security line further down is staffed 24 hours.
            </p>
          </div>
        </section>

        {/* The directory itself: fixed six-desk array, live-narrowed by the search + category
            device. Unfiltered by default — every address and phone number below is already a
            working link before any interaction happens. */}
        <section aria-labelledby="directory-heading" className="border-b border-zinc-200">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2
              id="directory-heading"
              className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Six desks
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Every one of them is listed below with no click required — search or filter only makes
              the right one faster to find.
            </p>
            <DirectoryClient />
          </div>
        </section>

        {/* Good to know — three short reassurance cards, distinct from the per-desk "not handled"
            copy above (that lives inline per card via the jump-to link). */}
        <section aria-labelledby="know-heading" className="border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 id="know-heading" className="text-xl font-bold tracking-tight text-zinc-900">
              Good to know
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5">
                <Info aria-hidden="true" className="h-5 w-5 text-orange-700" />
                <p className="mt-3 text-sm font-semibold text-zinc-900">Medians, not promises</p>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">
                  The response times above are rolling medians from last quarter, not guarantees. A
                  rough week can push any desk past its usual window.
                </p>
              </div>
              <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5">
                <Send aria-hidden="true" className="h-5 w-5 text-orange-700" />
                <p className="mt-3 text-sm font-semibold text-zinc-900">One thread, one issue</p>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">
                  A second message about the same order just splits the conversation. Reply on the
                  original thread and it stays with the same person.
                </p>
              </div>
              <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5">
                <ShieldAlert aria-hidden="true" className="h-5 w-5 text-orange-700" />
                <p className="mt-3 text-sm font-semibold text-zinc-900">Security skips the queue</p>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">
                  A compromised account doesn&apos;t wait for business hours — call the Account &amp;
                  Security line above any time, day or night.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Postal reality. */}
        <section aria-labelledby="postal-heading">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 id="postal-heading" className="text-lg font-semibold tracking-tight text-zinc-900">
              Paper, and where it goes
            </h2>
            <div className="mt-5 flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-zinc-600" />
              <div className="min-w-0">
                <p className="max-w-2xl text-base font-normal leading-relaxed text-zinc-800">{COMPANY.postal}</p>
                <p className="mt-2 text-sm font-normal text-zinc-600">
                  {COMPANY.registered}. Invoices, subpoenas, and signed agreements only — mail is
                  opened twice a week, so anything operational is faster through one of the six desks
                  above.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <p className="text-sm font-normal text-zinc-600">&copy; 2026 Overrun Commerce, Inc.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href={COMPANY.helpCenterUrl}
              className={`rounded text-sm font-normal text-zinc-700 hover:text-orange-700 ${FOCUS_RING}`}
            >
              Help center
            </a>
            <a
              href={COMPANY.statusUrl}
              className={`rounded text-sm font-normal text-zinc-700 hover:text-orange-700 ${FOCUS_RING}`}
            >
              System status
            </a>
            <a href="#main" className={`rounded text-sm font-normal text-zinc-700 hover:text-orange-700 ${FOCUS_RING}`}>
              Back to the top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
