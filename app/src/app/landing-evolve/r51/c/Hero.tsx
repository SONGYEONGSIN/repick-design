"use client";

import { ArrowRight } from "lucide-react";
import BudgetCurveEditor from "./BudgetCurveEditor";
import ProductCard from "./ProductCard";
import {
  MONTHS,
  acquisitionPlan,
  affordableForMonth,
  formatUsd,
  totalOf,
} from "./data";
import { ACCENT_FILL, EYEBROW, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

export default function Hero({
  values,
  activeIndex,
  onChange,
  onActivate,
}: {
  values: number[];
  activeIndex: number;
  onChange: (index: number, value: number) => void;
  onActivate: (index: number) => void;
}) {
  const total = totalOf(values);
  const plan = acquisitionPlan(total);
  const monthValue = values[activeIndex];
  const heroPicks = affordableForMonth(monthValue, "All", 2).items;

  return (
    <section id="curve" className="mx-auto max-w-[1280px] px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-5">
          <p className={`${EYEBROW} text-[#22D3EE]`}>Draw your own pace</p>
          <h1
            style={{ fontFamily: "var(--font-display-mono)" }}
            className="mt-3 text-[clamp(2rem,7vw+0.4rem,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white lg:text-[clamp(2.6rem,3vw+1.1rem,3.9rem)]"
          >
            Spend on repick at your own curve, not one fixed number.
          </h1>
          <p className="mt-4 max-w-[492px] text-base font-normal leading-[1.6] text-white">
            Set what you plan to spend each month below — six points, each one yours to drag up
            or down on its own. Your total, your estimated finds and your savings versus retail
            all recompute live, from the full shape you draw.
          </p>

          <a
            href="#plan"
            className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} hover:opacity-90 ${FOCUS_RING}`}
          >
            See what this plan gets you
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <div className="mt-6 grid min-w-0 grid-cols-2 gap-3">
            {heroPicks.map((item) => (
              <ProductCard key={item.id} item={item} compact />
            ))}
          </div>
          <p className={`mt-2 text-[11px] font-normal tracking-[0.02em] ${MUTED_TEXT}`}>
            Picks within {MONTHS[activeIndex]}&rsquo;s {formatUsd(monthValue)} budget.
          </p>
        </div>

        <div className="min-w-0 rounded-2xl border border-[#23232C] bg-[#13131A] p-4 lg:col-span-7 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold tracking-[0.01em] text-white">Your 6-month budget curve</p>
            <p className={`text-xs font-normal tabular-nums ${MUTED_TEXT}`}>$0 – $400 per month</p>
          </div>

          <div className="mt-5">
            <BudgetCurveEditor
              values={values}
              activeIndex={activeIndex}
              onChange={onChange}
              onActivate={onActivate}
            />
          </div>

          <div
            aria-live="polite"
            className="mt-6 grid grid-cols-1 gap-3 border-t border-[#23232C] pt-5 sm:grid-cols-3"
          >
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${MUTED_TEXT}`}>
                Total across 6 months
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-[#22D3EE]">{formatUsd(total)}</p>
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${MUTED_TEXT}`}>
                Estimated items you could acquire
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-white">
                {plan.itemCount} piece{plan.itemCount === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${MUTED_TEXT}`}>
                Projected savings vs. buying new
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-white">{formatUsd(plan.totalSaved)}</p>
            </div>

            <p className={`col-span-full max-w-[370px] text-xs font-normal leading-[1.5] ${MUTED_TEXT}`}>
              {plan.itemCount === 0
                ? plan.nextItem
                  ? `Plan at least ${formatUsd(plan.nextItem.salePrice)} total to unlock your first verified pick.`
                  : "Plan a budget above to see what it unlocks."
                : plan.nextItem
                  ? `${formatUsd(plan.remaining)} left unspent — ${formatUsd(plan.nextGap ?? 0)} more total unlocks the ${plan.nextItem.title}.`
                  : `${formatUsd(plan.remaining)} left unspent — enough for everything currently listed.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
