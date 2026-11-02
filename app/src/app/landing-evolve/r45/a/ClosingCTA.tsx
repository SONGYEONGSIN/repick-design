"use client";

import { ArrowRight, Receipt as ReceiptIcon } from "lucide-react";
import { formatUsd } from "./data";
import { DISPLAY, FOCUS_RING, MUTED_TEXT } from "./tokens";

export function ClosingCTA({ netPayout }: { netPayout: number }) {
  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[760px] rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
        <ReceiptIcon className="mx-auto h-5 w-5 text-sky-400" aria-hidden="true" />
        <h2 className={`${DISPLAY} mt-4 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-[#F5F5F7] sm:text-3xl`}>
          Sell it today and keep <span className="tabular-nums">{formatUsd(netPayout)}</span>.
        </h2>
        <p className={`mx-auto mt-3 max-w-[420px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That figure is read straight off the receipt you just built above — move the slider or
          the grade again and this sentence changes with it.
        </p>
        <a
          href="#payout-receipt"
          className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-700 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-800 ${FOCUS_RING}`}
        >
          Adjust your price
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
