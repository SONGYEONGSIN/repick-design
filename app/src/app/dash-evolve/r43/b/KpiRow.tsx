"use client";

import { useState } from "react";
import { Warehouse, TrendingDown, Gauge, Activity } from "lucide-react";
import {
  COMPANY_TRAILING_SHRINK,
  SHRINK_CRITICAL_PCT,
  formatCompactUSD,
  formatPercent,
  getStoreSummary,
  round2,
  type ShrinkStatus,
  type StoreId,
} from "./data";
import { Card, Pill, Progress, SegmentedControl } from "./ui";

const STATUS_TONE: Record<ShrinkStatus, "up" | "watch" | "down"> = {
  healthy: "up",
  watch: "watch",
  critical: "down",
};

const STATUS_LABEL: Record<ShrinkStatus, string> = {
  healthy: "Healthy",
  watch: "Watch",
  critical: "Critical",
};


const RANGE_OPTIONS: { id: "3mo" | "12mo"; label: string }[] = [
  { id: "3mo", label: "3mo" },
  { id: "12mo", label: "12mo" },
];

function Sparkline({ data }: { data: number[] }) {
  const width = 168;
  const height = 48;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((value, i) => {
    const x = round2(i * step);
    const y = round2(height - ((value - min) / range) * (height - 6) - 3);
    return { x, y };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1].x},${height} L0,${height} Z`;
  const last = points[points.length - 1];

  return (
    <figure className="min-w-0 max-w-[168px] flex-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="h-12 w-full overflow-visible"
      >
        <path d={areaPath} fill="rgba(45,212,191,0.12)" />
        <path d={path} fill="none" stroke="#2dd4bf" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r={2.4} fill="#2dd4bf" />
      </svg>
      <figcaption className="sr-only">
        Trailing company-wide shrink rate, from {formatPercent(data[0])} to {formatPercent(data[data.length - 1])}.
      </figcaption>
    </figure>
  );
}

export function KpiRow({ storeId }: { storeId: StoreId }) {
  const [range, setRange] = useState<"3mo" | "12mo">("12mo");
  const summary = getStoreSummary(storeId);
  const trailing = range === "3mo" ? COMPANY_TRAILING_SHRINK.slice(-3) : COMPANY_TRAILING_SHRINK;
  const latestCompany = COMPANY_TRAILING_SHRINK[COMPANY_TRAILING_SHRINK.length - 1];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="min-w-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <Warehouse className="h-4 w-4" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide">Opening inventory</span>
        </div>
        <p
          className="mt-3 text-3xl font-semibold tabular-nums text-zinc-50"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {formatCompactUSD(summary.opening)}
        </p>
        <p className="mt-1.5 text-xs text-zinc-400">As of period start, this quarter</p>
      </Card>

      <Card className="min-w-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <TrendingDown className="h-4 w-4" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide">Net shrinkage</span>
        </div>
        <p
          className="mt-3 text-3xl font-semibold tabular-nums text-rose-300"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {formatCompactUSD(summary.netShrink)}
        </p>
        <p className="mt-1.5 text-xs text-zinc-400">Closing {formatCompactUSD(summary.closing)} this quarter</p>
      </Card>

      <Card className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <Gauge className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-[11px] font-medium uppercase tracking-wide">Shrink rate</span>
          </div>
          <Pill tone={STATUS_TONE[summary.status]}>{STATUS_LABEL[summary.status]}</Pill>
        </div>
        <p
          className="mt-3 text-3xl font-semibold tabular-nums text-zinc-50"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {formatPercent(summary.shrinkPct)}
        </p>
        <div className="mt-3">
          <Progress
            value={Math.min(summary.shrinkPct, SHRINK_CRITICAL_PCT)}
            max={SHRINK_CRITICAL_PCT}
            tone={summary.status === "healthy" ? "accent" : summary.status === "watch" ? "warn" : "danger"}
            label={`Shrink rate ${formatPercent(summary.shrinkPct)} against a ${formatPercent(SHRINK_CRITICAL_PCT, 0)} target ceiling`}
          />
          <p className="mt-1.5 text-xs text-zinc-400">Target ceiling {formatPercent(SHRINK_CRITICAL_PCT, 0)}</p>
        </div>
      </Card>

      <Card className="min-w-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <Activity className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide">Company trend</span>
        </div>
        <div className="mt-2.5">
          <SegmentedControl label="Trend range" options={RANGE_OPTIONS} value={range} onChange={setRange} size="sm" />
        </div>
        <div className="mt-3 flex items-end gap-3">
          <p
            className="shrink-0 text-3xl font-semibold tabular-nums text-zinc-50"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {formatPercent(latestCompany)}
          </p>
          <Sparkline data={trailing} />
        </div>
        <p className="mt-1.5 text-xs text-zinc-400">All five locations, {range === "3mo" ? "trailing 3 months" : "trailing 12 months"}</p>
      </Card>
    </div>
  );
}
