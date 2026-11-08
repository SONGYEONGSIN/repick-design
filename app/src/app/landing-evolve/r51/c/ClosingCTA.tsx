"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { INVENTORY, acquisitionPlan, formatUsd, totalOf } from "./data";
import { ACCENT_FILL, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

/**
 * Cites the real, current total/projection by calling the SAME `acquisitionPlan` function the
 * hero reads (imported from `./data`, not re-derived or paraphrased) -- never a hardcoded
 * string, and honest at every edge of the curve's range, including a total of $0.
 */
export default function ClosingCTA({ values }: { values: number[] }) {
  const total = totalOf(values);
  const plan = acquisitionPlan(total);

  const line =
    plan.itemCount === 0
      ? plan.nextItem
        ? `Right now your six-month plan adds up to ${formatUsd(total)} — nothing unlocked yet. Push it past ${formatUsd(plan.nextItem.salePrice)} total and your first verified pick is in reach.`
        : `Right now your six-month plan adds up to ${formatUsd(total)}.`
      : plan.nextItem
        ? `Right now your six-month plan adds up to ${formatUsd(total)} — enough for about ${plan.itemCount} verified piece${plan.itemCount === 1 ? "" : "s"} and roughly ${formatUsd(plan.totalSaved)} saved versus buying new.`
        : `Right now your six-month plan adds up to ${formatUsd(total)} — enough for every one of the ${INVENTORY.length} verified listings currently tracked here, about ${formatUsd(plan.totalSaved)} saved versus buying new.`;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <Reveal className="rounded-3xl border border-[#23232C] bg-[#13131A] p-8 sm:p-12">
        <h2 className="max-w-[492px] text-[clamp(1.8rem,3vw+1rem,2.8rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
          Your curve, carried all the way down the page.
        </h2>
        <p className="mt-4 max-w-[492px] text-base font-normal leading-[1.6] text-white">{line}</p>
        <a
          href="#curve"
          className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} hover:opacity-90 ${FOCUS_RING}`}
        >
          Adjust your plan
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className={`mt-3 max-w-[339px] text-[11px] font-normal tracking-[0.02em] ${MUTED_TEXT}`}>
          Figures above recompute from the exact six points you&rsquo;ve set — change any one and
          this line changes with it.
        </p>
      </Reveal>
    </section>
  );
}
