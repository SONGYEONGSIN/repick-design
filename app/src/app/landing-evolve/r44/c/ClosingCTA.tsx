"use client";

import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { formatUsd } from "./data";
import { DISPLAY, FOCUS_RING, MUTED_TEXT } from "./tokens";

export function ClosingCTA({
  price,
  headlineCta,
}: {
  price: number;
  headlineCta: string;
}) {
  return (
    <section className="border-t border-[#121212]/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[760px] rounded-2xl border border-[#121212]/10 bg-[#121212]/[0.02] p-8 text-center sm:p-12">
        <SlidersHorizontal className="mx-auto h-5 w-5 text-emerald-700" aria-hidden="true" />
        <h2 className={`${DISPLAY} mt-4 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-[#121212] sm:text-3xl`}>
          List at <span className="tabular-nums">{formatUsd(price)}</span>, and {headlineCta}.
        </h2>
        <p className={`mx-auto mt-3 max-w-[430px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That figure is read off the same curve you just moved — drag the slider again and this
          sentence changes with it. The seller stats above are historical and don&rsquo;t move with it.
        </p>
        <a
          href="#simulator"
          className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-700 px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#065f46] ${FOCUS_RING}`}
        >
          Try another price
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
