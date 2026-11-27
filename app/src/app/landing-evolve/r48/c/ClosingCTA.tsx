"use client";

import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { type WindowStats, windowLabel } from "./data";
import { ACCENT_FILL, ACCENT_TEXT, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

export function ClosingCTA({ start, end, stats }: { start: number; end: number; stats: WindowStats }) {
  const direction: "up" | "down" | "flat" = stats.deltaPct === null || stats.deltaPct === 0 ? "flat" : stats.deltaPct > 0 ? "up" : "down";
  const DirIcon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const trendCopy =
    stats.deltaPct === null
      ? "with no prior window yet to compare against"
      : `${direction === "up" ? "up" : "down"} ${Math.abs(stats.deltaPct)}% from the prior ${stats.lengthDays}-day window`;

  return (
    <section className="border-t border-[#E4E4E7] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[720px] rounded-2xl border border-[#E4E4E7] bg-white p-8 text-center sm:p-12">
        <DirIcon className={`mx-auto h-5 w-5 ${ACCENT_TEXT}`} aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-[#09090B] sm:text-3xl">
          For {windowLabel(start, end).toLowerCase()}, this market is averaging{" "}
          <span className="tabular-nums">{stats.avgDays} days to sell</span> — {trendCopy}.
        </h2>
        <p className={`mx-auto mt-3 max-w-[420px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That&rsquo;s the exact window you left the handles on above — scroll back up and drag either one
          again, and this line moves with it. The closed sale in social proof above is historical and doesn&rsquo;t.
        </p>
        <a
          href="#trend"
          className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} hover:opacity-90 ${FOCUS_RING}`}
        >
          Move the window again
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
