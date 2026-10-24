"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { formatPrice } from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34d399]";

export default function ClosingCTA({
  filteredCount,
  median,
  min,
  max,
}: {
  filteredCount: number;
  median: number;
  min: number;
  max: number;
}) {
  return (
    <section
      id="closing"
      aria-labelledby="closing-heading"
      className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-emerald-400">
            ready when your window is
          </span>

          <h2
            id="closing-heading"
            className="mt-4 max-w-[34rem] text-3xl font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl"
          >
            {filteredCount > 0 ? (
              <>
                Your window has{" "}
                <span className="font-[family-name:var(--font-display-mono)] tabular-nums text-emerald-400">
                  {filteredCount}
                </span>{" "}
                listing{filteredCount === 1 ? "" : "s"} sitting inside it, right now.
              </>
            ) : (
              <>Widen your window above and listings will land back inside it.</>
            )}
          </h2>

          <p className="mt-5 max-w-[30rem] text-base font-normal leading-[1.6] text-zinc-400">
            {filteredCount > 0
              ? `That's ${formatPrice(min)}–${formatPrice(max)}, median ${formatPrice(median)}. Move either handle on the sweep above and every number on this page — including this one — moves with it.`
              : "Drag either handle on the sweep above until the count fills back in, then come back down here — this line always tracks it."}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#sweep"
              className={`inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#0B0B0F] transition-colors duration-200 hover:bg-emerald-400 ${FOCUS}`}
            >
              Open my window
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-sm font-normal text-zinc-400">Free to search, no listing fee to start.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
