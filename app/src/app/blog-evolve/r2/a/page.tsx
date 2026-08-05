import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "./site-chrome";
import SeriesExplorer from "./series-explorer";
import { SERIES, ESSAYS, ALL_TAGS } from "./data";

export const metadata: Metadata = {
  title: "Continuum — systems-engineering research, written as series",
  description:
    "Continuum publishes multi-part series on distributed systems, query planning, and observability, plus standalone essays that don't fit a sequence.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main-content">
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10">
          <p className="text-sm font-bold tracking-wide text-rose-700 uppercase">Continuum Research</p>
          <h1
            className="mt-2 max-w-2xl text-4xl font-bold text-balance text-zinc-900 sm:text-5xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Read it as a sequence, not a feed.
          </h1>
          <p className="mt-4 max-w-xl text-base font-normal text-pretty text-zinc-600">
            Every long investigation here ships as a numbered series you can work through in order —
            each part shows where it sits, what comes next, and how much of the series you&apos;ve
            already read. Shorter, one-off essays live separately below.
          </p>
        </div>

        <SeriesExplorer series={SERIES} essays={ESSAYS} tags={ALL_TAGS} />

        <div className="h-4 sm:h-6" aria-hidden="true" />
      </main>

      <SiteFooter />
    </div>
  );
}
