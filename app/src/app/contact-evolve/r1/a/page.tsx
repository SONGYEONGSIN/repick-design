import type { Metadata } from "next";
import { Building2, Mail, MapPin, ShieldCheck, Wallet } from "lucide-react";
import DispatchConsole from "./dispatch-console";
import { FOCUS_RING } from "./data";

export const metadata: Metadata = {
  title: "Contact — Culvert",
  description:
    "Five desks, five sets of published hours, and a reply-by time computed for each. Pick the desk; the clock does the rest.",
};

/**
 * Archetype: routing-first. The page's spine is a dispatch board of five desks — sales, operations,
 * partnerships, recruiting, press — each carrying its owner, its published hours, its direct address
 * and a computed reply-by time. All five are on screen with no interaction; choosing one re-aims the
 * page (required fields, owner brief, wrong-desk redirect, alternate routes) rather than revealing
 * anything that was hidden. The form is the consequence of the choice, never the premise.
 *
 * Deliberately none of: hero + single visualisation, fixed side rail + segmented toggle,
 * master-detail, department kanban, or an office/region tablist as the primary axis. The board rows
 * are complete records, not stubs that need opening — that is what keeps this off the master-detail
 * skeleton.
 *
 * Light theme, emerald accent (emerald-700/800 only — emerald-600 fails AA behind white text),
 * display face --font-display-grotesk on the wordmark and h1. Exactly three font weights route-wide:
 * font-normal, font-semibold, font-bold.
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
            className="text-lg font-semibold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Culvert
          </span>
          <p className="text-sm font-normal text-zinc-600">Metering and SCADA telemetry, made billing-grade</p>
        </div>
      </header>

      <main id="main">
        <section aria-labelledby="page-heading" className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">Contact Culvert</p>
          <h1
            id="page-heading"
            className="mt-4 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Tell us which desk. We&rsquo;ll tell you the hour.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-700">
            Culvert moves interval data from 4.1 million meters into systems that bill against it, which means the
            person who should read your message depends entirely on what it says. So this page starts with the desk,
            not the form: pick one, and the hours, the owner, the fields you&rsquo;ll be asked for and the way around
            this form all change together.
          </p>
          <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-600">
            Every address below is a real queue with a person&rsquo;s name on it. Nothing routes to a shared inbox that
            nobody owns.
          </p>
        </section>

        <DispatchConsole />

        <section aria-labelledby="elsewhere-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 id="elsewhere-heading" className="text-2xl font-bold tracking-tight text-zinc-900">
              Three things that never belong on a desk
            </h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              These bypass the board entirely — they have their own owners and their own clocks, and routing them
              through sales or support only slows them down.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              <li className="min-w-0 rounded-2xl border border-zinc-300 bg-white p-5">
                <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 flex-none text-emerald-800" />
                  Security disclosure
                </h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">
                  Triaged within 24 hours, every day of the year, by the security lead rather than the on-call rota.
                  PGP fingerprint <span className="tabular-nums">4C2F 91A8 D370 6E15</span>.
                </p>
                <a
                  href="mailto:security@culvert.io"
                  className={`mt-3 inline-flex items-center gap-1.5 break-all rounded text-sm font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-900 ${FOCUS_RING}`}
                >
                  <Mail aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                  security@culvert.io
                </a>
              </li>

              <li className="min-w-0 rounded-2xl border border-zinc-300 bg-white p-5">
                <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                  <Wallet aria-hidden="true" className="h-4 w-4 flex-none text-emerald-800" />
                  Billing and remittance
                </h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">
                  Purchase orders, W-9s, and remittance advice. Quote your account ID and finance answers on the next
                  working day — they do not read the sales queue.
                </p>
                <a
                  href="mailto:billing@culvert.io"
                  className={`mt-3 inline-flex items-center gap-1.5 break-all rounded text-sm font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-900 ${FOCUS_RING}`}
                >
                  <Mail aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                  billing@culvert.io
                </a>
              </li>

              <li className="min-w-0 rounded-2xl border border-zinc-300 bg-white p-5">
                <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                  <MapPin aria-hidden="true" className="h-4 w-4 flex-none text-emerald-800" />
                  Post and visitors
                </h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">
                  Legal notices go to Austin. Nobody is at either address without an appointment, so write first.
                </p>
                <address className="mt-3 space-y-2 text-sm font-normal not-italic leading-relaxed text-zinc-700">
                  <span className="flex items-start gap-2">
                    <Building2 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 flex-none text-zinc-600" />
                    <span className="min-w-0">
                      <span className="tabular-nums">1904</span> East Cesar Chavez, Suite <span className="tabular-nums">210</span>, Austin TX <span className="tabular-nums">78702</span>
                    </span>
                  </span>
                  <span className="flex items-start gap-2">
                    <Building2 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 flex-none text-zinc-600" />
                    <span className="min-w-0">
                      Rua da Prata <span className="tabular-nums">80</span>, <span className="tabular-nums">1100-416</span> Lisboa, Portugal
                    </span>
                  </span>
                </address>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm font-normal text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Culvert Systems, Inc.</span>
          <span>
            Desk hours are published in UTC and honoured on the Austin and Lisbon calendars. Public holidays add one
            working day.
          </span>
        </div>
      </footer>
    </div>
  );
}
