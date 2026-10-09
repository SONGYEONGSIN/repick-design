"use client";

import { Gauge, Wallet, AlertTriangle, PhoneMissed } from "lucide-react";
import { fmtCompactCurrency, type MonthSummary } from "./data";
import { TrendDelta } from "./ui";

function Tile({
  icon: Icon, label, value, delta, deltaUnit,
}: { icon: typeof Gauge; label: string; value: string; delta: number; deltaUnit: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
        <Icon aria-hidden="true" className="h-4.5 w-4.5" />
      </div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
        {value}
      </p>
      <div className="mt-1.5">
        <TrendDelta value={delta} unit={deltaUnit} />
      </div>
    </div>
  );
}

export function KpiStrip({ summary }: { summary: MonthSummary }) {
  return (
    <section aria-labelledby="kpi-heading">
      <h2 id="kpi-heading" className="sr-only">Key metrics for this month</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Tile
          icon={Gauge}
          label="Avg. booked capacity"
          value={`${summary.avgUtilization}%`}
          delta={Math.round((summary.avgUtilization - summary.avgUtilizationPrev) * 10) / 10}
          deltaUnit=" pts"
        />
        <Tile
          icon={Wallet}
          label="Revenue booked"
          value={fmtCompactCurrency(summary.totalRevenue)}
          delta={summary.totalRevenuePrev ? Math.round(((summary.totalRevenue - summary.totalRevenuePrev) / summary.totalRevenuePrev) * 1000) / 10 : 0}
          deltaUnit="%"
        />
        <Tile
          icon={AlertTriangle}
          label="At-risk days"
          value={`${summary.atRiskDays}`}
          delta={summary.atRiskDays - summary.atRiskDaysPrev}
          deltaUnit=" days"
        />
        <Tile
          icon={PhoneMissed}
          label="No-show rate"
          value={`${summary.noShowRate}%`}
          delta={Math.round((summary.noShowRate - summary.noShowRatePrev) * 10) / 10}
          deltaUnit=" pts"
        />
      </div>
    </section>
  );
}
