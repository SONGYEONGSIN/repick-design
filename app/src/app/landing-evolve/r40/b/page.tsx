"use client";

import { useMemo, useState } from "react";
import Hero from "./Hero";
import RangeSweep from "./RangeSweep";
import ValueProp from "./ValueProp";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import Reveal from "./Reveal";
import { DEFAULT_MIN, DEFAULT_MAX, filterByRange, medianPrice } from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34d399]";

export default function Page() {
  const [range, setRange] = useState<[number, number]>([DEFAULT_MIN, DEFAULT_MAX]);
  const [min, max] = range;

  const filtered = useMemo(() => filterByRange(min, max), [min, max]);
  const median = useMemo(() => medianPrice(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#0B0B0F] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em] text-white">repick</span>
          <a
            href="#sweep"
            className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS} rounded-sm`}
          >
            Try the price sweep
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero />

        <section
          id="sweep"
          aria-labelledby="sweep-heading"
          className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-emerald-400">
                live price sweep
              </span>
              <h2
                id="sweep-heading"
                className="mt-4 max-w-[30rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl"
              >
                Your budget is a window, not a point.
              </h2>
              <p className="mt-5 max-w-[30rem] text-base font-normal leading-[1.6] text-zinc-400">
                Move either edge and the catalog redraws itself around it. The bars show real
                price spread across today&rsquo;s 24 listings — drag a handle, or tab to one and
                use the arrow keys.
              </p>
            </Reveal>

            <div className="mt-12">
              <RangeSweep min={min} max={max} onChange={(nextMin, nextMax) => setRange([nextMin, nextMax])} />
            </div>
          </div>
        </section>

        <ValueProp filteredCount={filtered.length} median={median} min={min} max={max} />
        <SocialProof />
        <ClosingCTA filteredCount={filtered.length} median={median} min={min} max={max} />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs font-normal text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 repick. Resale, graded.</span>
          <span>Prices shown are sample listings for illustration.</span>
        </div>
      </footer>
    </div>
  );
}
