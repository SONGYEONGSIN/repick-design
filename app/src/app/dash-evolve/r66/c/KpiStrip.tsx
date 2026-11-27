"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { PERIOD_LABEL, teamName, usd, usdCompact, numberFmt, type Kpis, type Period } from "./data";
import { Card, FieldLabel, SegmentedControl } from "./ui";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "quarter", label: "Quarter" },
];

/**
 * The KPI strip for this rail-less bucket is deliberately not a four-card row: one hero number
 * plus a handful of compact inline stats, separated by hairline dividers, with the period
 * segmented control folded into the same row. Every figure comes from `computeKpis()`, which
 * reads the exact same `PERIOD_DATA` arrays the treemap and fallback table render below it.
 */
export function KpiStrip({ kpis, period, onPeriodChange }: { kpis: Kpis; period: Period; onPeriodChange: (p: Period) => void }) {
  return (
    <Card className="flex min-w-0 flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="flex min-w-0 flex-wrap items-end gap-x-8 gap-y-4">
        <div className="min-w-0">
          <FieldLabel>Total allocated spend</FieldLabel>
          <p className="mt-1 whitespace-nowrap text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl">{usd(kpis.total)}</p>
          <p className="mt-0.5 text-xs font-normal text-zinc-400">{PERIOD_LABEL[period]}</p>
        </div>

        <Divider />

        <InlineStat label={kpis.secondary.kind === "delta" ? "Vs prior period" : "Avg per month"}>
          {kpis.secondary.kind === "delta" ? (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              {kpis.secondary.up ? <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
              {kpis.secondary.up ? "+" : ""}
              {kpis.secondary.pct.toFixed(1)}%
            </span>
          ) : (
            usdCompact(kpis.secondary.value)
          )}
        </InlineStat>

        <InlineStat label="Largest team" nowrap={false}>
          {teamName(kpis.largestTeamId)} <span className="font-normal text-zinc-400">&middot; {usdCompact(kpis.largestTeamCost)}</span>
        </InlineStat>

        <InlineStat label="Teams">{numberFmt.format(kpis.teamsCount)}</InlineStat>

        <InlineStat label="Services tracked">{numberFmt.format(kpis.servicesTracked)}</InlineStat>
      </div>

      <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} label="Reporting period" />
    </Card>
  );
}

function Divider() {
  return <span aria-hidden="true" className="hidden h-10 w-px shrink-0 bg-white/10 sm:block" />;
}

function InlineStat({
  label,
  children,
  nowrap = true,
}: {
  label: string;
  children: ReactNode;
  nowrap?: boolean;
}) {
  return (
    <div className="min-w-0 max-w-[14rem]">
      <FieldLabel>{label}</FieldLabel>
      <p className={`mt-1 text-sm font-semibold tabular-nums text-zinc-50 ${nowrap ? "whitespace-nowrap" : ""}`}>{children}</p>
    </div>
  );
}
