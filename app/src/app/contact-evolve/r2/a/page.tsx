import type { Metadata } from "next";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import EscalationClient from "./escalation-client";
import { COMPANY, FOCUS_RING, TIERS } from "./data";

export const metadata: Metadata = {
  title: "Contact — Sole Trace",
  description:
    "Four support tiers, each with a named owner, a real address, and a published promise — pick the situation that matches yours to see which rung handles it.",
};

/**
 * Archetype: escalation ladder. The page's spine is not a desk directory and not a clock — it is a
 * fixed, four-rung ladder (self-serve → specialist → escalation → urgent direct line) rendered as a
 * step-connected vertical sequence with a numbered progression indicator. All four rungs, their
 * owners, their mailto:/tel: links, and their published SLA/queue-depth/break-condition text render
 * unconditionally, above the fold, before any interaction. The page's one interactive device does
 * not touch that content: a row of issue-type chips narrows *attention* to which rung applies to the
 * visitor's situation by adding a "Matches your situation" callout — it never filters, hides, or
 * gates a tier. There is no day/hour/timezone control anywhere on this route; "when will they
 * respond" is answered with a fixed, published promise per tier (e.g. "same business day") plus the
 * fixed condition under which that promise does not hold, not a live or simulated calculation.
 *
 * Light theme, blue accent (blue-700/800 only), no display typeface — headings run on --font-sans at
 * larger sizes and heavier weight, which is deliberate: this route already reads as an operations
 * runbook, and a second typeface would compete with the rung numbers for that texture. Exactly three
 * font weights route-wide: font-normal, font-semibold, font-bold.
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
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-zinc-900">{COMPANY.name}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={COMPANY.statusUrl}
              className={`inline-flex items-center gap-1 rounded text-sm font-normal text-zinc-700 hover:text-blue-800 ${FOCUS_RING}`}
            >
              Status page
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            <a
              href={`mailto:${TIERS[0].email}`}
              className={`inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 ${FOCUS_RING}`}
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              {TIERS[0].email}
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <section aria-labelledby="page-heading" className="pb-8 pt-10 sm:pt-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-800">Contact</p>
            <h1
              id="page-heading"
              className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl"
            >
              Four rungs. Every one of them answers.
            </h1>
            <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-zinc-700">
              Start at Tier 1 — most questions end there. If the promised window passes, the next rung
              is already named below, not hidden behind a form.
            </p>
          </section>

          <section aria-labelledby="ladder-heading" className="pb-14">
            <h2 id="ladder-heading" className="sr-only">
              The escalation ladder
            </h2>
            <EscalationClient />
          </section>

          <section aria-labelledby="why-tiers-heading" className="border-t border-zinc-200 py-12">
            <h2 id="why-tiers-heading" className="text-lg font-bold text-zinc-900 sm:text-xl">
              Why tiers, not one inbox
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>
                  A single shared inbox makes every message wait behind the slowest one in the queue.
                  Splitting by tier means a shipping question never sits behind a fraud review.
                </span>
              </li>
              <li className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>
                  Each tier is staffed by people who actually handle that kind of case, so the first
                  reply is usually the useful one — not a hand-off to someone else.
                </span>
              </li>
              <li className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>
                  Writing to the wrong rung isn&apos;t a mistake — Tier 1 will forward you up, and a rung
                  above will point you back down. Nothing here is a dead end.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="prep-heading" className="border-t border-zinc-200 py-12">
            <h2 id="prep-heading" className="text-lg font-bold text-zinc-900 sm:text-xl">
              Before you write
            </h2>
            <p className="mt-2 max-w-xl text-sm font-normal leading-relaxed text-zinc-700">
              Every tier above answers faster with these on the first message, so the reply doesn&apos;t
              come back asking for them.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>Your order or listing ID — top of your account page.</span>
              </li>
              <li className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>What you expected to happen, and what happened instead.</span>
              </li>
              <li className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>Photos, for anything about item condition or authentication.</span>
              </li>
              <li className="flex gap-2.5 text-sm font-normal leading-relaxed text-zinc-700">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>One message, not three — a second copy joins the same queue, not a faster one.</span>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-4 py-8 text-sm font-normal text-zinc-600 sm:px-6">
          <p>
            Still not sure which rung fits?{" "}
            <a
              href={`mailto:${TIERS[0].email}`}
              className={`font-semibold text-blue-800 underline decoration-blue-800/40 underline-offset-2 hover:text-blue-900 ${FOCUS_RING}`}
            >
              {TIERS[0].email}
            </a>{" "}
            starts every case, at any tier.
          </p>
          <p className="mt-3">{COMPANY.tagline}</p>
        </div>
      </footer>
    </div>
  );
}
