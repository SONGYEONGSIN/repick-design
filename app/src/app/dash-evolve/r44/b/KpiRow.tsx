"use client";

import { useState } from "react";
import { Package, Gauge, AlertTriangle, Activity, TrendingUp, TrendingDown } from "lucide-react";
import {
  formatCompactUnits,
  formatPercent,
  formatSignedPercent,
  getWarehouseSummary,
  round2,
  type Status,
  type WarehouseId,
} from "./data";
import { Card, Pill, Progress, SegmentedControl } from "./ui";

const STATUS_TONE: Record<Status, "good" | "watch" | "critical"> = { good: "good", watch: "watch", critical: "critical" };
const STATUS_LABEL: Record<Status, string> = { good: "Healthy", watch: "Watch", critical: "Critical" };

const RANGE_OPTIONS: { id: "7d" | "30d"; label: string }[] = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
];

/** Hoisted to module scope — never defined inside KpiRow's render body. */
function Sparkline({ data, target }: { data: number[]; target: number }) {
  const width = 168;
  const height = 48;
  const max = Math.max(...data, target) * 1.05;
  const step = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((value, i) => {
    const x = round2(i * step);
    const y = round2(height - (value / max) * (height - 6) - 3);
    return { x, y };
  });
  const targetY = round2(height - (target / max) * (height - 6) - 3);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1].x},${height} L0,${height} Z`;
  const last = points[points.length - 1];

  return (
    <figure className="min-w-0 max-w-[168px] flex-1">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="h-12 w-full overflow-visible">
        <line x1={0} x2={width} y1={targetY} y2={targetY} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="2.5,2.5" />
        <path d={areaPath} fill="rgba(5,150,105,0.10)" />
        <path d={path} fill="none" stroke="#047857" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r={2.4} fill="#047857" />
      </svg>
      <figcaption className="sr-only">
        Daily units shipped, {data.length} days, against a target of {formatCompactUnits(target)} per day.
      </figcaption>
    </figure>
  );
}

export function KpiRow({ warehouseId }: { warehouseId: WarehouseId }) {
  const [range, setRange] = useState<"7d" | "30d">("30d");
  const summary = getWarehouseSummary(warehouseId);
  const series = range === "7d" ? summary.dailySeries7 : summary.dailySeries30;
  const dailyTarget = Math.round(summary.shippedTarget30 / 30);
  const latestDelta = summary.latestDayPct - 100;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="min-w-0">
        <div className="flex items-center gap-2 text-zinc-500">
          <Package className="h-4 w-4" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide">Units shipped</span>
        </div>
        <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
          {formatCompactUnits(summary.shippedTrailing30)}
        </p>
        <p className="mt-1.5 text-xs font-normal text-zinc-500">
          Trailing 30 days · target {formatCompactUnits(summary.shippedTarget30)}
        </p>
      </Card>

      <Card className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <Gauge className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-[11px] font-medium uppercase tracking-wide">On-time rate</span>
          </div>
          <Pill tone={STATUS_TONE[summary.onTimeStatus]}>{STATUS_LABEL[summary.onTimeStatus]}</Pill>
        </div>
        <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
          {formatPercent(summary.onTimeAvgTrailing30)}
        </p>
        <div className="mt-3">
          <Progress
            value={summary.onTimeAvgTrailing30}
            max={100}
            tone={summary.onTimeStatus === "good" ? "accent" : summary.onTimeStatus === "watch" ? "warn" : "danger"}
            label={`On-time rate ${formatPercent(summary.onTimeAvgTrailing30)} against a 95% target floor`}
          />
          <p className="mt-1.5 text-xs font-normal text-zinc-500">Target floor 95% · trailing 30 days</p>
        </div>
      </Card>

      <Card className="min-w-0">
        <div className="flex items-center gap-2 text-zinc-500">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide">Open exceptions</span>
        </div>
        <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
          {summary.openExceptions}
        </p>
        <p className="mt-1.5 text-xs font-normal text-zinc-500">Logged in the last 5 days, unresolved</p>
      </Card>

      <Card className="min-w-0">
        <div className="flex items-center gap-2 text-zinc-500">
          <Activity className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide">Daily shipping trend</span>
        </div>
        <div className="mt-2.5">
          <SegmentedControl label="Trend range" options={RANGE_OPTIONS} value={range} onChange={setRange} size="sm" />
        </div>
        <div className="mt-3 flex items-end gap-3">
          <p className="flex shrink-0 items-center gap-1 text-3xl font-semibold tabular-nums text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
            {summary.latestDayPct}%
          </p>
          <Sparkline data={series} target={dailyTarget} />
        </div>
        <p className={`mt-1.5 flex items-center gap-1 text-xs font-normal ${latestDelta >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
          {latestDelta >= 0 ? <TrendingUp className="h-3 w-3" aria-hidden="true" /> : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
          <span className="tabular-nums">{formatSignedPercent(latestDelta)} vs. target, latest day</span>
        </p>
      </Card>
    </div>
  );
}
