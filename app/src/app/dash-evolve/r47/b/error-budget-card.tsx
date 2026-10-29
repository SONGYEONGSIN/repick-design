"use client";

import { TriangleAlert } from "lucide-react";
import { MONTHLY_BUDGET_MINUTES, SERVICES, computeBudgetBurn, type Incident } from "./data";
import { formatMinutes, formatPercent } from "./format";
import { Card, ProgressBar } from "./ui";

/**
 * 30-day error-budget burn per service, at 99.9% SLO (43.2 allowed-downtime minutes/month).
 * Burned minutes sum the SAME `resolutionMinutes` fields the header's MTTR and uptime figures
 * use — one source of truth, so these numbers can never drift apart from each other.
 */
export function ErrorBudgetCard({ incidents }: { incidents: Incident[] }) {
  const rows = SERVICES.map((s) => ({ service: s, burn: computeBudgetBurn(incidents, s.id) })).sort(
    (a, b) => b.burn.pct - a.burn.pct
  );

  return (
    <Card as="section" ariaLabelledBy="budget-title" id="budget-section" className="p-4 sm:p-5">
      <h2 id="budget-title" className="text-sm font-semibold text-zinc-50">
        Error Budget Burn
      </h2>
      <p className="mt-0.5 font-normal text-xs text-zinc-400">
        30-day window · {formatMinutes(MONTHLY_BUDGET_MINUTES)} budget per service at 99.9% SLO
      </p>

      <ul className="mt-4 space-y-3">
        {rows.map(({ service, burn }) => {
          const overBudget = burn.pct > 100;
          return (
            <li key={service.id}>
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate font-medium text-xs text-zinc-200">{service.label}</span>
                <span className="flex shrink-0 items-center gap-1 font-medium text-xs tabular-nums">
                  {overBudget ? <TriangleAlert className="h-3 w-3 text-rose-400" aria-hidden="true" /> : null}
                  <span className={overBudget ? "text-rose-300" : "text-zinc-300"}>{formatPercent(burn.pct, 0)}</span>
                </span>
              </div>
              <ProgressBar
                pct={burn.pct}
                className="mt-1.5"
                fillClassName={overBudget ? "bg-rose-500" : burn.pct > 0 ? "bg-rose-700" : "bg-white/15"}
                ariaLabel={`${service.label} error budget burned, ${formatPercent(burn.pct, 0)} of ${formatMinutes(MONTHLY_BUDGET_MINUTES)}`}
              />
              <p className="mt-1 font-normal text-[11px] text-zinc-400">
                {formatMinutes(burn.burnedMinutes)} burned
                {overBudget ? (
                  <span className="text-rose-400"> · {formatMinutes(Math.abs(burn.remainingMinutes))} over budget</span>
                ) : (
                  <span> · {formatMinutes(burn.remainingMinutes)} remaining</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
