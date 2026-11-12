"use client";

import { ArrowRight, SplitSquareHorizontal } from "lucide-react";
import { MAIN_ITEM, formatUsd, repickPrice, savingsAmount } from "./data";
import { ACCENT_FILL, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

export function ClosingCTA({ discount }: { discount: number }) {
  const repick = repickPrice(MAIN_ITEM.newPrice, discount);
  const saved = savingsAmount(MAIN_ITEM.newPrice, discount);

  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[720px] rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
        <SplitSquareHorizontal className="mx-auto h-5 w-5 text-[#BEF264]" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-[#F4F4F5] sm:text-3xl">
          At {discount}% off, this overcoat is{" "}
          <span className="tabular-nums">{formatUsd(repick)}</span> on repick — a{" "}
          <span className="tabular-nums">{formatUsd(saved)}</span> gap from retail.
        </h2>
        <p className={`mx-auto mt-3 max-w-[430px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That&rsquo;s the exact line you left the divider on above — scroll back up and drag it
          again, and this sentence moves with it. The buyer quotes and the closed sale above are
          historical and don&rsquo;t move with it.
        </p>
        <a
          href="#split"
          className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} hover:opacity-90 ${FOCUS_RING}`}
        >
          Move the line again
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
