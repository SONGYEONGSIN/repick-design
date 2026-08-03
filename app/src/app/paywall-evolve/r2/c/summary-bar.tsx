"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { type BillingPeriod, type PlanTier, cx, planPrice, usd } from "./data";

const FOCUS_ON_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900";

interface SummaryBarProps {
  currentPlan: PlanTier;
  recommendedPlan: PlanTier;
  billing: BillingPeriod;
  onViewRecommended: () => void;
}

/**
 * The persistent anchored summary bar. Fixed to the viewport (not `sticky`, so it is visible from
 * first paint with zero scrolling) and placed early in source order so it is also an early, not a
 * final, keyboard stop. It never disappears while either module below is opened or closed — the
 * three facts it promises (current plan, recommended plan, price delta) live here independently of
 * both accordions' state.
 */
export default function SummaryBar({ currentPlan, recommendedPlan, billing, onViewRecommended }: SummaryBarProps) {
  const currentPrice = planPrice(currentPlan, billing);
  const recommendedPrice = planPrice(recommendedPlan, billing);
  const delta = recommendedPrice - currentPrice;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-normal text-zinc-400">
          <span className="truncate">{currentPlan.name}</span>
          <ArrowRight className="h-3 w-3 flex-none" aria-hidden="true" />
          <span className="truncate font-medium text-white">{recommendedPlan.name}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">recommended</span>
        </div>

        <div className="flex items-baseline gap-1.5 text-sm">
          <span className="font-semibold tabular-nums text-white">{usd(recommendedPrice)}</span>
          <span className="font-normal text-zinc-400">/mo</span>
          <span className="font-medium tabular-nums text-blue-400">
            +{usd(delta)}/mo
          </span>
        </div>

        <button
          type="button"
          onClick={onViewRecommended}
          className={cx(
            "ml-auto flex flex-none items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500",
            FOCUS_ON_DARK,
          )}
        >
          Upgrade
          <span className="hidden sm:inline">to {recommendedPlan.name}</span>
          <ArrowUpRight className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
