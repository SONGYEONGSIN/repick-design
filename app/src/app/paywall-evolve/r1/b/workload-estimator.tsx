"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  type BillingPeriod,
  WORKLOAD_SLIDER,
  fmt,
  getPlan,
  planPrice,
  recommendPlanId,
  usd,
} from "./data";

/** "Estimate your usage" — a slider projecting next month's run volume, recomputing the
 * recommended tier, its price at the shared billing period, and the run headroom (or overage)
 * live as the handle moves. One source of truth (`runs`) drives every derived number below it. */
export default function WorkloadEstimator({ billing }: { billing: BillingPeriod }) {
  const [runs, setRuns] = useState(WORKLOAD_SLIDER.default);
  const sliderId = useId();

  const recommended = useMemo(() => {
    const planId = recommendPlanId(runs);
    const plan = getPlan(planId);
    const headroom = plan.runsIncluded - runs;
    return { plan, headroom };
  }, [runs]);

  const price = planPrice(recommended.plan, billing);
  const pctOfRange = ((runs - WORKLOAD_SLIDER.min) / (WORKLOAD_SLIDER.max - WORKLOAD_SLIDER.min)) * 100;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div>
          <label htmlFor={sliderId} className="text-sm font-medium text-zinc-100">
            Expected automation runs next month
          </label>
          <p className="mt-1 text-sm font-normal text-zinc-400">
            Drag to your best guess — we&apos;ll match it to the plan that covers it.
          </p>
          <input
            id={sliderId}
            type="range"
            min={WORKLOAD_SLIDER.min}
            max={WORKLOAD_SLIDER.max}
            step={WORKLOAD_SLIDER.step}
            value={runs}
            onChange={(e) => setRuns(Number(e.target.value))}
            className={
              "mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-green-500 " +
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            }
            style={{
              background: `linear-gradient(to right, #22c55e ${pctOfRange}%, #27272a ${pctOfRange}%)`,
            }}
            aria-valuetext={`${fmt(runs)} runs per month`}
          />
          <div className="mt-2 flex items-center justify-between text-xs font-normal text-zinc-400 tabular-nums">
            <span>{fmt(WORKLOAD_SLIDER.min)}</span>
            <span className="text-base font-medium text-zinc-50">{fmt(runs)} runs / mo</span>
            <span>{fmt(WORKLOAD_SLIDER.max)}+</span>
          </div>
        </div>

        <ArrowRight className="hidden h-5 w-5 flex-none text-zinc-600 lg:block" aria-hidden="true" />

        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4" aria-live="polite">
          <p className="text-xs font-normal text-zinc-400">Recommended plan</p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight text-zinc-50">{recommended.plan.name}</p>
          <p className="mt-1 text-sm font-medium text-green-400 tabular-nums">{usd(price)} / mo</p>
          <p className="mt-2 text-xs font-normal text-zinc-400 tabular-nums">
            {recommended.headroom >= 0
              ? `${fmt(recommended.headroom)} runs of headroom left in this tier`
              : `${fmt(Math.abs(recommended.headroom))} runs over this tier's limit`}
          </p>
        </div>
      </div>
    </div>
  );
}
