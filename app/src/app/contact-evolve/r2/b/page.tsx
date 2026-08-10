import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TierConsole from "./tier-console";
import { CHANNELS, FOCUS_RING, OTHER_PATHS, groupThousands } from "./data";

export const metadata: Metadata = {
  title: "Contact — repick",
  description:
    "Two lines every visitor can use right now, plus channels matched to whether you're browsing, buying, or selling on repick.",
};

/**
 * Archetype: Trust Tier Console. The page is organised around the reader's *relationship to
 * repick* — guest, verified buyer, verified seller — rather than a department or a clock. This
 * sidesteps the determinism ban by construction: the primary device is an identity/context
 * selector, not a time input, so there is nothing to compute from `Date.now()`.
 *
 * Two-part contract with the r1 delta ("core proof must be zero-interaction, above the fold,
 * working links"): the baseline rail directly below the intro is a plain server-rendered `<ul>` of
 * real `mailto:`/`tel:` anchors, independent of `TierConsole`'s client state — it renders and
 * works even if the console's JS never hydrates. The console below adds to and reorders around
 * that baseline; it is never required to reveal it.
 *
 * Deliberately not the "hero paragraph + 3-4 cell bordered meta strip + single device" shape: the
 * baseline rail is a horizontal pill list (not a bordered stat grid), the tier picker doubles as
 * both explanation and control (not a passive strip preceding a device), and selecting a tier
 * causes a real two-pane content reflow — a differently-ordered channel list plus a different
 * "Good to know" panel — rather than a filter over an otherwise-static table.
 *
 * Light surface, blue as the single accent (verification/trust connotation, not used elsewhere in
 * the last three rounds), `--font-display-wide` on display type only. Exactly three font-weight
 * classes route-wide: font-normal, font-medium, font-semibold.
 */
const BASELINE = CHANNELS.filter((c) => c.tiers.length === 3);
const BASELINE_VOLUME = BASELINE.reduce((sum, c) => sum + c.volume, 0);

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-950">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 sm:px-6">
          <span
            className="text-lg font-semibold tracking-tight text-zinc-950"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            repick
          </span>
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-950 ${FOCUS_RING}`}
          >
            Back to marketplace
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Contact</p>
          <h1
            className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-950 sm:text-5xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Tell us who you are. We&rsquo;ll point you at the right line.
          </h1>
          <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-zinc-600 sm:text-lg">
            repick serves guests, verified buyers, and verified sellers differently. Pick which one
            you are below and the channels reorder to match it — or just use the two lines every
            visitor gets, right here.
          </p>
        </section>

        <section aria-labelledby="baseline-heading" className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <h2
              id="baseline-heading"
              className="text-sm font-semibold uppercase tracking-wide text-zinc-700"
            >
              Reach a person right now
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {BASELINE.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.id} className="min-w-0">
                    <a
                      href={c.primary.href}
                      className={`inline-flex min-w-0 items-center gap-2.5 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:border-blue-400 hover:text-blue-700 ${FOCUS_RING}`}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 flex-none text-blue-600" />
                      <span>{c.label}</span>
                      <span className="hidden text-zinc-400 sm:inline" aria-hidden="true">
                        &middot;
                      </span>
                      <span className="hidden tabular-nums text-zinc-600 sm:inline">
                        {c.primary.display}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 max-w-2xl text-sm font-normal leading-relaxed text-zinc-600">
              These two don&rsquo;t need a tier, a form, or a login.{" "}
              {groupThousands(BASELINE_VOLUME)} people used them last month.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="console-heading"
          className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16"
        >
          <h2
            id="console-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl"
          >
            Matched to how you use repick
          </h2>
          <TierConsole />
        </section>

        <section aria-labelledby="other-heading" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2
              id="other-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl"
            >
              Paths that don&rsquo;t need a tier
            </h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-600">
              These three sit outside the guest/buyer/seller split on purpose — they apply the same
              way to everyone.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {OTHER_PATHS.map((path) => {
                const Icon = path.icon;
                return (
                  <li
                    key={path.id}
                    className="flex min-w-0 flex-col rounded-xl border border-zinc-200 bg-white p-5"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-base font-semibold text-zinc-950">{path.label}</p>
                    <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-600">
                      {path.description}
                    </p>
                    <a
                      href={path.href}
                      className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-blue-700 hover:text-blue-800 ${FOCUS_RING}`}
                    >
                      {path.display}
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-8 sm:px-6">
          <p className="text-sm font-normal text-zinc-600">&copy; 2026 repick, Inc.</p>
          <p className="text-sm font-normal text-zinc-600">
            No account required to reach a human.
          </p>
        </div>
      </footer>
    </div>
  );
}
