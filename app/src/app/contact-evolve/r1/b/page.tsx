import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import ContactConsole from "./contact-console";
import {
  CHANNELS,
  FOCUS_RING,
  OTHER_PATHS,
  REGIONAL_DESKS,
  SAMPLE_WINDOW,
  groupThousands,
} from "./data";

export const metadata: Metadata = {
  title: "Contact — Havelock",
  description:
    "Three regional support desks, one always-on Sev-1 bridge, and the measured time each channel takes to answer. Pick your timezone and the hour you would write.",
};

/**
 * Archetype: availability first. The page is organised around *when* rather than around a form —
 * the first thing it renders is four desks with their current shift state, and the form at the
 * bottom is downstream of that reading rather than the reason for the page.
 *
 * The determinism rule bans `new Date()`, which on a page about response times could have been
 * fatal; it turned into the structure instead. A fixed reference moment (Tuesday 14:20 UTC) plays
 * "now", the reader supplies their own UTC offset, and that choice recomputes every clock,
 * countdown, coverage bar and expected-reply time on the page. See `data.ts` for the arithmetic.
 *
 * Deliberately not: a hero with one chart under it, a fixed side rail with a segmented toggle, a
 * master-detail list, a departmental board, or a region tablist — the last of which the previous
 * careers round already used for geography. Geography here is a *time axis*, not a set of tabs.
 *
 * Dark surface, amber as the only accent, `--font-display-mono` on display type and every clock;
 * body copy stays on `--font-sans`. Exactly three font-weight classes route-wide: font-normal,
 * font-semibold, font-bold. No muted token below zinc-400 anywhere on this dark ground.
 */
export default function ContactPage() {
  const roster = REGIONAL_DESKS.reduce((sum, desk) => sum + desk.roster, 0);
  const measured = CHANNELS.reduce((sum, channel) => sum + channel.sampleN, 0);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 sm:px-6">
          <span
            className="text-lg font-semibold tracking-tight text-zinc-50"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Havelock
          </span>
          <a
            href="tel:+17205550148"
            className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 hover:border-amber-400 hover:text-amber-300 ${FOCUS_RING}`}
          >
            <Phone aria-hidden="true" className="h-4 w-4 flex-none" />
            <span className="tabular-nums">Sev-1 bridge +1 720 555 0148</span>
          </a>
        </div>
      </header>

      <main id="main">
        <section aria-labelledby="intro-heading" className="mx-auto max-w-6xl px-4 pb-4 pt-14 sm:px-6 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Contact Havelock
          </p>
          <h1
            id="intro-heading"
            className="mt-5 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Every hour of the day has an owner.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-300">
            Havelock runs the telemetry pipeline behind four hundred engineering teams, and support
            follows the sun through Osaka, Porto and Denver. This page starts with who is awake and
            how long they have, because that is the part a contact form usually leaves you to guess.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-zinc-800 pt-8 sm:grid-cols-3">
            <li className="min-w-0">
              <p
                className="text-3xl font-bold tabular-nums text-zinc-50"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {REGIONAL_DESKS.length} desks
              </p>
              <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-300">
                {roster} people on the rosters, each desk keeping real local hours rather than a
                &ldquo;global&rdquo; queue.
              </p>
            </li>
            <li className="min-w-0">
              <p
                className="text-3xl font-bold tabular-nums text-zinc-50"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                1 seam hour
              </p>
              <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-300">
                23:00 to 00:00 UTC, between Denver clocking off and Osaka clocking on. The Sev-1
                bridge carries it, and we would rather print the seam than paint over it.
              </p>
            </li>
            <li className="min-w-0">
              <p
                className="text-3xl font-bold tabular-nums text-zinc-50"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {groupThousands(measured)} replies
              </p>
              <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-300">
                Measured first replies over the {SAMPLE_WINDOW}. Every median on this page is drawn
                from that sample, with its size printed beside it.
              </p>
            </li>
          </ul>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <ContactConsole />
        </div>

        <section aria-labelledby="other-heading" className="border-t border-zinc-800 bg-zinc-900/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2
              id="other-heading"
              className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
            >
              Ways in that are not a desk
            </h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
              These four sit outside the rota on purpose. None of them competes with a support case
              for the same seat.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {OTHER_PATHS.map((path) => (
                <li
                  key={path.id}
                  className="flex min-w-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-300">
                    {path.title}
                  </h3>
                  <div className="mt-3 space-y-1">
                    {path.lines.map((line) => (
                      <p
                        key={line}
                        className="break-words text-sm font-normal tabular-nums text-zinc-100"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="mt-4 border-t border-zinc-800 pt-4 text-xs font-normal leading-relaxed text-zinc-400">
                    {path.foot}
                  </p>
                </li>
              ))}
            </ul>

            <a
              href="mailto:support@havelock.io"
              className={`mt-10 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300 ${FOCUS_RING}`}
            >
              Or just email support@havelock.io
              <ArrowRight aria-hidden="true" className="h-4 w-4 flex-none" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-8 sm:px-6">
          <p className="text-sm font-normal text-zinc-400">
            © 2026 Havelock Systems, Inc. · Denver · Porto · Osaka
          </p>
          <p className="text-sm font-normal text-zinc-400">
            No chatbot sits in front of these queues. A person reads every one.
          </p>
        </div>
      </footer>
    </div>
  );
}
