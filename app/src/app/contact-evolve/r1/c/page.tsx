import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Check, LifeBuoy, Mail, ShieldCheck } from "lucide-react";
import DeskClient from "./desk-client";
import { COMPANY, DESKS, FOCUS_RING, NOT_HANDLED, PREP, QUARTER, formatDuration } from "./data";

export const metadata: Metadata = {
  title: "Contact — Tessera",
  description:
    "Four desks, four published addresses, and a triage box that tries to answer you before it takes a message. Nothing is gated behind it.",
};

/**
 * Archetype: deflection-first contact desk. The page's spine is a triage slip — you say what is
 * happening, one box routes it to the status page, the docs, an answer a desk already wrote, or
 * straight to a person, and the slip changes *shape* by verdict rather than filtering a list. That
 * distinction is deliberate: "a search that narrows a list" is the skeleton auto-careers-r1/b and
 * auto-about-r1/b already used, so typing here replaces the whole slip with a single routed verdict
 * instead of trimming a result set.
 *
 * The anti-dark-pattern guardrails are structural, not editorial. All four desk addresses render in
 * the directory below the h1 at the zero-interaction default; the full board — hours, coverage,
 * median and p90 first reply, the named person who answers — renders with no click; escalation is
 * always one button; and a query that matches nothing skips deflection entirely and opens the
 * handoff on its own. Deflection is measured here as "63% never needed to write", never as
 * "fewer messages got through".
 *
 * Light theme, rose accent, --font-display-wide on the page's three display headings only (Latin,
 * display sizes); body stays on --font-sans. Exactly three font weights route-wide: font-normal,
 * font-semibold, font-bold. No clock reads anywhere — the "when will I hear back" arithmetic runs
 * off a weekday/hour you choose, defaulting to Wednesday 09:00 UTC.
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
          <span className="text-lg font-bold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
            {COMPANY.name}
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={COMPANY.statusUrl}
              className={`inline-flex items-center gap-1.5 rounded text-sm font-normal text-zinc-700 hover:text-rose-800 ${FOCUS_RING}`}
            >
              System status
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            <a
              href="mailto:support@tessera.co"
              className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 ${FOCUS_RING}`}
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              support@tessera.co
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Opening band: the h1, the honest framing, and the four addresses in full — before any
            interaction has happened, and before the triage box below has a chance to intercept. */}
        <section aria-labelledby="page-heading" className="border-b border-zinc-200">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">Contact</p>
            <h1
              id="page-heading"
              className="mt-4 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              We would rather answer you than receive you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-700">
              {COMPANY.name} is {COMPANY.line}. Last quarter{" "}
              <span className="font-semibold tabular-nums text-zinc-900">{QUARTER.inbound}</span> people
              started a message here and{" "}
              <span className="font-semibold tabular-nums text-zinc-900">{QUARTER.selfResolved}%</span>{" "}
              of them closed the tab with what they came for instead. That is the number we try to move
              — not the number of tickets.
            </p>
            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              The other {100 - QUARTER.selfResolved}% is the point of this page too. Here is where every
              one of them goes, with no form in front of it.
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 border-t border-zinc-200 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {DESKS.map((desk) => (
                <div key={desk.id} className="min-w-0">
                  <dt className="text-sm font-semibold text-zinc-900">{desk.name}</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${desk.email}`}
                      className={`inline-block max-w-full break-all rounded text-sm font-normal text-rose-800 underline underline-offset-2 hover:text-rose-900 ${FOCUS_RING}`}
                    >
                      {desk.email}
                    </a>
                    <span className="mt-1 block text-sm font-normal tabular-nums text-zinc-700">
                      Median first reply {formatDuration(desk.medianMinutes)} · {desk.hoursLabel}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Triage console + routing slip + the full desk board (client, shared send-time state). */}
        <DeskClient />

        {/* What makes a first reply useful rather than a round trip. */}
        <div className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
            <section aria-labelledby="prep-heading" className="min-w-0">
              <h2
                id="prep-heading"
                className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                Four things that halve the round trip
              </h2>
              <p className="mt-3 max-w-xl text-base font-normal leading-relaxed text-zinc-700">
                Nothing here is required. Every one of them is something a desk had to write back and
                ask for, which is the single largest reason a{" "}
                <span className="tabular-nums">{QUARTER.firstReplyMedian}</span> first reply turns into
                a two-day thread.
              </p>
              <ul className="mt-7 space-y-3">
                {PREP.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-rose-800" />
                    <span className="min-w-0 text-sm font-normal leading-relaxed text-zinc-800">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-normal leading-relaxed text-zinc-700">
                Only{" "}
                <span className="font-semibold tabular-nums text-zinc-900">{QUARTER.reopened}%</span> of
                answered messages get reopened. When one does, it comes back to the same person, not to
                a queue.
              </p>
            </section>

            <section aria-labelledby="limits-heading" className="min-w-0">
              <h2
                id="limits-heading"
                className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                And three things we do not do
              </h2>
              <p className="mt-3 max-w-xl text-base font-normal leading-relaxed text-zinc-700">
                Said plainly so you do not spend a day finding out.
              </p>
              <dl className="mt-7 space-y-4">
                {NOT_HANDLED.map((item) => (
                  <div key={item.label} className="rounded-xl border border-zinc-200 bg-white p-4">
                    <dt className="flex items-start gap-2.5 text-sm font-semibold text-zinc-900">
                      <LifeBuoy aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-zinc-600" />
                      <span className="min-w-0">{item.label}</span>
                    </dt>
                    <dd className="mt-1.5 pl-[1.625rem] text-sm font-normal leading-relaxed text-zinc-700">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-normal leading-relaxed text-zinc-800">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-rose-800" />
                <span className="min-w-0">
                  Reporting a vulnerability? Write to{" "}
                  <a
                    href="mailto:security@tessera.co"
                    className={`rounded font-semibold text-rose-800 underline underline-offset-2 ${FOCUS_RING}`}
                  >
                    security@tessera.co
                  </a>{" "}
                  at any hour, including weekends. Disclosures are acknowledged before they are triaged,
                  and we do not send legal threats to researchers.
                </span>
              </p>
            </section>
          </div>
        </div>

        {/* Postal reality. A contact page without an address is a support widget. */}
        <section aria-labelledby="postal-heading" className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 id="postal-heading" className="text-lg font-semibold tracking-tight text-zinc-900">
              Paper, and where it goes
            </h2>
            <div className="mt-5 flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-zinc-600" />
              <div className="min-w-0">
                <p className="max-w-2xl text-base font-normal leading-relaxed text-zinc-800">
                  {COMPANY.postal}
                </p>
                <p className="mt-2 text-sm font-normal text-zinc-700">
                  {COMPANY.registered}. Invoices, subpoenas and signed agreements only — anything
                  operational is faster by email, and mail is opened twice a week.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <p className="text-sm font-normal text-zinc-700">
            &copy; 2026 Tessera Financial Systems. {COMPANY.product}.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={COMPANY.docsUrl} className={`rounded text-sm font-normal text-zinc-700 hover:text-rose-800 ${FOCUS_RING}`}>
              Documentation
            </a>
            <a href={COMPANY.statusUrl} className={`rounded text-sm font-normal text-zinc-700 hover:text-rose-800 ${FOCUS_RING}`}>
              Status history
            </a>
            <a href="#main" className={`rounded text-sm font-normal text-zinc-700 hover:text-rose-800 ${FOCUS_RING}`}>
              Back to the top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
