"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  GRID_HOURLY,
  GRID_DAILY,
  chartBuckets,
  supplyOf,
  balanceOf,
  renewableShareOf,
  formatMw,
  formatSignedMw,
  formatPct,
  RANGE_LABEL,
  type TimeRange,
} from "./data";
import SegmentedControl from "./components/SegmentedControl";
import ProgressBar from "./components/ProgressBar";
import { FOCUS_RING } from "./components/focus";
import { STORAGE_COLOR, GAS_COLOR, WIND_COLOR, SOLAR_COLOR, DEMAND_COLOR } from "./components/chartColors";

const RANGES: TimeRange[] = ["24h", "7d", "30d"];

const VB_W = 860;
const VB_H = 260;
const PAD_L = 48;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 28;

export default function GridChart({
  range,
  onRangeChange,
}: {
  range: TimeRange;
  onRangeChange: (r: TimeRange) => void;
}) {
  const buckets = chartBuckets(range, { hourly: GRID_HOURLY, daily: GRID_DAILY });

  const [activeIndex, setActiveIndex] = useState(buckets.length - 1);
  // Keep the crosshair pointed at a valid, meaningful index (the latest one) whenever the period
  // changes the bucket count — adjusted during render, not in an effect, so it resolves in the
  // same commit with no extra render.
  const [prevRange, setPrevRange] = useState(range);
  if (range !== prevRange) {
    setPrevRange(range);
    setActiveIndex(buckets.length - 1);
  }
  const safeIndex = Math.min(activeIndex, buckets.length - 1);
  const active = buckets[safeIndex];

  // The headline is always the live "now" snapshot (hour 23 of the hourly series) — it never
  // moves when the period toggle changes which history the chart below is showing, and it is
  // read from the exact same GRID_HOURLY array the region rail and chart both derive from.
  const now = GRID_HOURLY[GRID_HOURLY.length - 1];
  const totalSupply = supplyOf(now);
  const totalBalance = balanceOf(now);
  const renewableShare = renewableShareOf(now);
  const surplus = totalBalance >= 0;

  const maxY = Math.max(...buckets.map((b) => Math.max(supplyOf(b), b.demandMw))) * 1.15 || 1;

  const scaleX = (i: number) => Math.round((PAD_L + (i / Math.max(1, buckets.length - 1)) * (VB_W - PAD_L - PAD_R)) * 100) / 100;
  const scaleY = (v: number) => Math.round((VB_H - PAD_B - (v / maxY) * (VB_H - PAD_T - PAD_B)) * 100) / 100;

  // Cumulative stack: storage -> gas -> wind -> solar.
  const cum = buckets.map((b) => {
    const c1 = b.storageMw;
    const c2 = c1 + b.gasMw;
    const c3 = c2 + b.windMw;
    const c4 = c3 + b.solarMw;
    return [0, c1, c2, c3, c4];
  });

  function areaPath(lowerIdx: 0 | 1 | 2 | 3, upperIdx: 1 | 2 | 3 | 4) {
    const top = buckets.map((_, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(cum[i][upperIdx])}`).join(" ");
    const bottomRev = buckets
      .map((_, i) => i)
      .reverse()
      .map((i) => `L${scaleX(i)},${scaleY(cum[i][lowerIdx])}`)
      .join(" ");
    return `${top} ${bottomRev} Z`;
  }

  const demandPath = buckets.map((b, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(b.demandMw)}`).join(" ");

  function indexFromClientX(svg: SVGSVGElement, clientX: number) {
    const rect = svg.getBoundingClientRect();
    const fracX = (clientX - rect.left) / rect.width;
    const vbX = fracX * VB_W;
    const t = (vbX - PAD_L) / (VB_W - PAD_L - PAD_R);
    return Math.max(0, Math.min(buckets.length - 1, Math.round(t * (buckets.length - 1))));
  }

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    setActiveIndex(indexFromClientX(e.currentTarget, e.clientX));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(buckets.length - 1, i + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(buckets.length - 1);
    }
  }

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section aria-labelledby="chart-heading" className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="min-w-0">
          <h1 id="chart-heading" className="truncate text-lg font-semibold text-zinc-50">
            Grid-wide balance
          </h1>
          <p className="mt-0.5 text-sm text-zinc-400">Supply vs. demand across all six balancing regions</p>
        </div>
        <SegmentedControl ariaLabel="Chart time range" options={RANGES.map((r) => ({ value: r, label: RANGE_LABEL[r] }))} value={range} onChange={onRangeChange} />
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-4 border-b border-white/10 px-6 py-4 sm:grid-cols-4">
        <Stat label="Total generation" value={formatMw(totalSupply)} />
        <Stat label="Total demand" value={formatMw(now.demandMw)} />
        <Stat
          label="Net balance"
          value={formatSignedMw(totalBalance)}
          emphasis
          icon={surplus ? TrendingUp : TrendingDown}
          tone={surplus ? "text-emerald-300" : "text-rose-300"}
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-zinc-400">Renewable share</p>
          <p className="mt-1 truncate text-xl font-semibold tabular-nums text-indigo-300">{formatPct(renewableShare)}</p>
          <div className="mt-1.5">
            <ProgressBar value={renewableShare} tone="indigo" label="Renewable share of current generation" />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
          <Legend swatch={SOLAR_COLOR} label="Solar" />
          <Legend swatch={WIND_COLOR} label="Wind" />
          <Legend swatch={GAS_COLOR} label="Gas" />
          <Legend swatch={STORAGE_COLOR} label="Storage" />
          <Legend swatch={DEMAND_COLOR} label="Demand" line />
          <span className="ml-auto hidden sm:inline">Focus the chart, then use &larr; &rarr; to inspect a point</span>
        </div>

        <div
          tabIndex={0}
          role="group"
          aria-label={`Grid-wide generation mix and demand, ${RANGE_LABEL[range]} view. Use arrow keys to inspect points.`}
          onKeyDown={handleKeyDown}
          className={`rounded-lg ${FOCUS_RING}`}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            height="auto"
            className="block w-full"
            onMouseMove={handleMove}
            role="img"
            aria-label="Generation mix stacked area with demand overlay"
          >
            {gridLines.map((g) => {
              const y = PAD_T + g * (VB_H - PAD_T - PAD_B);
              const value = Math.round(maxY * (1 - g));
              return (
                <g key={g}>
                  <line x1={PAD_L} x2={VB_W - PAD_R} y1={y} y2={y} stroke="currentColor" className="text-white/10" strokeWidth={1} />
                  <text x={PAD_L - 8} y={y + 3} textAnchor="end" fontSize={10} className="fill-zinc-400 tabular-nums">
                    {value}
                  </text>
                </g>
              );
            })}

            <path d={areaPath(0, 1)} fill={STORAGE_COLOR} opacity={0.5} stroke="none" />
            <path d={areaPath(1, 2)} fill={GAS_COLOR} opacity={0.4} stroke="none" />
            <path d={areaPath(2, 3)} fill={WIND_COLOR} opacity={0.4} stroke="none" />
            <path d={areaPath(3, 4)} fill={SOLAR_COLOR} opacity={0.4} stroke="none" />

            {([1, 2, 3, 4] as const).map((upper) => (
              <path
                key={upper}
                d={buckets.map((_, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(cum[i][upper])}`).join(" ")}
                fill="none"
                stroke="#09090b"
                strokeWidth={1.5}
                strokeOpacity={0.5}
              />
            ))}

            <path d={demandPath} fill="none" stroke={DEMAND_COLOR} strokeWidth={2} strokeDasharray="5 3" strokeLinejoin="round" />

            <line x1={scaleX(safeIndex)} x2={scaleX(safeIndex)} y1={PAD_T} y2={VB_H - PAD_B} stroke="currentColor" className="text-zinc-200/40" strokeWidth={1} />

            <circle cx={scaleX(safeIndex)} cy={scaleY(active.demandMw)} r={5} fill={DEMAND_COLOR} stroke="#09090b" strokeWidth={2} />
            <circle cx={scaleX(safeIndex)} cy={scaleY(cum[safeIndex][4])} r={4} fill={SOLAR_COLOR} stroke="#09090b" strokeWidth={2} />

            {buckets.map((b, i) =>
              b.label ? (
                <text key={i} x={scaleX(i)} y={VB_H - 8} textAnchor="middle" fontSize={10} className="fill-zinc-400 tabular-nums">
                  {b.label}
                </text>
              ) : null,
            )}
          </svg>
        </div>

        <p aria-live="polite" className="mt-3 text-sm tabular-nums text-zinc-200">
          <span className="font-medium text-zinc-50">{active.label || "Selected point"}:</span>{" "}
          Solar {formatMw(active.solarMw)} &middot; Wind {formatMw(active.windMw)} &middot; Gas {formatMw(active.gasMw)} &middot; Storage{" "}
          {formatMw(active.storageMw)} &middot; Demand {formatMw(active.demandMw)} &middot; Balance{" "}
          <span className={balanceOf(active) >= 0 ? "text-emerald-300" : "text-rose-300"}>{formatSignedMw(balanceOf(active))}</span>
        </p>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  emphasis,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  icon?: typeof TrendingUp;
  tone?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className={`mt-1 flex min-w-0 items-center gap-1 text-xl font-semibold tabular-nums ${emphasis ? tone ?? "text-zinc-50" : "text-zinc-50"}`}>
        {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
        <span className="min-w-0 truncate">{value}</span>
      </p>
    </div>
  );
}

function Legend({ swatch, label, line }: { swatch: string; label: string; line?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className={line ? "h-0.5 w-3 rounded-full" : "size-2.5 rounded-sm"} style={{ backgroundColor: swatch }} />
      {label}
    </span>
  );
}
