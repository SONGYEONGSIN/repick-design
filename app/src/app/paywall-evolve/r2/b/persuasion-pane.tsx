"use client";

import { useState } from "react";
import { BarChart3, Clock, Download, Lock, TrendingUp, Users } from "lucide-react";
import {
  COMPARISON_ROWS,
  CURRENT_USAGE,
  FOCUS,
  TRUST_STAT,
  USAGE_WINDOWS,
  USAGE_WINDOW_TABS,
  cx,
  fmt,
  usd,
  type BillingPeriod,
  type PlanTier,
} from "./data";
import UsageChart from "./usage-chart";

const ROW_ICONS = [Clock, Users, Download, BarChart3];

/** Left pane — persuasion. Concrete, always-visible evidence of why the account is blocked: the
 * exact overage, a day-by-day usage chart the reader can re-window, and a before/after list of
 * what stays locked on Starter. Nothing here needs a click to be understood at rest. */
export default function PersuasionPane({
  recommendedPlan,
  recommendedPrice,
  billing,
}: {
  recommendedPlan: PlanTier;
  recommendedPrice: number;
  billing: BillingPeriod;
}) {
  const [windowId, setWindowId] = useState<"7d" | "30d" | "90d">("7d");
  const data = USAGE_WINDOWS[windowId];

  return (
    <section aria-labelledby="blocked-heading" className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
        <Lock className="h-3 w-3 flex-none" aria-hidden="true" />
        Starter plan · event collection blocked
      </span>

      <h1 id="blocked-heading" className="mt-3 max-w-[26ch] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        New events stopped recording {CURRENT_USAGE.pausedSince}.
      </h1>

      <p className="mt-3 max-w-prose text-sm font-normal leading-relaxed text-slate-600">
        Fathomline tracked <strong className="font-medium text-slate-900 tabular-nums">{fmt(CURRENT_USAGE.eventsUsed)}</strong> events
        this month — <span className="tabular-nums">{fmt(CURRENT_USAGE.overBy)}</span> over Starter&apos;s{" "}
        <span className="tabular-nums">{fmt(CURRENT_USAGE.eventsLimit)}</span>-event limit. Collection paused automatically;
        nothing already captured was lost.
      </p>

      <p className="mt-2 max-w-prose text-sm font-normal text-slate-600">
        Upgrading to{" "}
        <a href="#plan" className={cx("font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800", FOCUS, "rounded")}>
          {recommendedPlan.name} — {usd(recommendedPrice)}/mo
        </a>{" "}
        removes this cap.
      </p>

      {/* Interaction: usage window tabs — re-windows the chart below */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Events tracked, day by day</h2>
          <div role="group" aria-label="Chart time window" className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            {USAGE_WINDOW_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={windowId === tab.id}
                onClick={() => setWindowId(tab.id)}
                className={cx(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  windowId === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900",
                  FOCUS,
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <UsageChart data={data} />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-normal text-slate-500">
          Dashed red bars mark periods after the monthly cap was reached and collection paused.
        </p>
      </div>

      {/* Feature comparison — dl kept flat: dl > div > (dt, dd), icon lives inside dt only */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">What&apos;s paused until you upgrade</h2>
        <dl className="mt-4 flex flex-col gap-3">
          {COMPARISON_ROWS.map((row, i) => {
            const Icon = ROW_ICONS[i % ROW_ICONS.length];
            return (
              <div key={row.label} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <dt className="flex min-w-0 items-start gap-2.5 text-sm font-medium text-slate-900">
                  <Icon className="mt-0.5 h-4 w-4 flex-none text-slate-400" aria-hidden="true" />
                  {row.label}
                </dt>
                <dd className="flex flex-none flex-col items-end text-right text-xs font-normal">
                  <span className="text-slate-500 line-through decoration-slate-300">{row.current}</span>
                  <span className="mt-0.5 font-medium text-teal-700">{row.upgraded}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <p className="mt-8 flex items-center gap-2 text-xs font-normal text-slate-500">
        <TrendingUp className="h-3.5 w-3.5 flex-none text-slate-400" aria-hidden="true" />
        {TRUST_STAT}
      </p>
    </section>
  );
}
