"use client";

import { useId, useState } from "react";
import { chartBuckets, formatInt, type Service, type TimeRange } from "./data";

const RANGES: TimeRange[] = ["6h", "24h", "7d"];
const RANGE_LABEL: Record<TimeRange, string> = { "6h": "6h", "24h": "24h", "7d": "7d" };

const VB_W = 760;
const VB_H = 220;
const PAD_L = 42;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 24;

export default function LatencyChart({
  service,
  range,
  onRangeChange,
}: {
  service: Service;
  range: TimeRange;
  onRangeChange: (r: TimeRange) => void;
}) {
  const buckets = chartBuckets(service, range);
  const [activeIndex, setActiveIndex] = useState(buckets.length - 1);
  const gradientId = useId();

  // Keep the crosshair on a valid, meaningful point (the latest one) whenever the selected
  // service or range changes, instead of leaving it pointed at a now-unrelated index. This is the
  // "adjust state during render" pattern, not an effect, so it resolves in the same commit.
  const selectionKey = `${service.id}|${range}`;
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey);
  if (selectionKey !== prevSelectionKey) {
    setPrevSelectionKey(selectionKey);
    setActiveIndex(buckets.length - 1);
  }

  const safeIndex = Math.min(activeIndex, buckets.length - 1);
  const active = buckets[safeIndex];
  const latest = buckets[buckets.length - 1];
  const errorRate = latest.requests > 0 ? (latest.errors / latest.requests) * 100 : 0;
  const activeErrorRate = active.requests > 0 ? (active.errors / active.requests) * 100 : 0;

  const maxY = Math.max(...buckets.map((b) => b.p99)) * 1.15 || 1;

  const scaleX = (i: number) =>
    Math.round((PAD_L + (i / Math.max(1, buckets.length - 1)) * (VB_W - PAD_L - PAD_R)) * 100) / 100;
  const scaleY = (v: number) =>
    Math.round((VB_H - PAD_B - (v / maxY) * (VB_H - PAD_T - PAD_B)) * 100) / 100;

  const buildPath = (key: "p50" | "p95" | "p99") =>
    buckets.map((b, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(b[key])}`).join(" ");

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fracX = (e.clientX - rect.left) / rect.width;
    const vbX = fracX * VB_W;
    const t = (vbX - PAD_L) / (VB_W - PAD_L - PAD_R);
    const idx = Math.round(t * (buckets.length - 1));
    setActiveIndex(Math.max(0, Math.min(buckets.length - 1, idx)));
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

  return (
    <section aria-labelledby="chart-heading" className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="min-w-0">
          <h1 id="chart-heading" className="truncate text-lg font-semibold text-zinc-50">
            {service.name} — latency overview
          </h1>
          <p className="mt-0.5 text-sm text-zinc-400">{service.description}</p>
        </div>
        <div role="group" aria-label="Chart time range" className="flex shrink-0 gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {RANGES.map((r) => {
            const pressed = r === range;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={pressed}
                onClick={() => onRangeChange(r)}
                className={`h-9 min-w-[2.75rem] rounded-md px-3 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                  pressed ? "bg-violet-400 text-zinc-950" : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                {RANGE_LABEL[r]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-4 border-b border-white/10 px-6 py-4 sm:grid-cols-4">
        <Stat label="P50 latency" value={`${formatInt(latest.p50)} ms`} />
        <Stat label="P95 latency" value={`${formatInt(latest.p95)} ms`} emphasis />
        <Stat label="P99 latency" value={`${formatInt(latest.p99)} ms`} />
        <Stat label="Error rate" value={`${errorRate.toFixed(1)}%`} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
          <Legend swatch="bg-zinc-400" label="P50" />
          <Legend swatch="bg-violet-400" label="P95" />
          <Legend swatch="bg-violet-300" label="P99" dashed />
          <span className="ml-auto hidden sm:inline">Focus the chart, then use ← → to inspect a point</span>
        </div>

        <div
          tabIndex={0}
          role="group"
          aria-label={`Latency chart for ${service.name}, ${range} view. Use arrow keys to inspect points.`}
          onKeyDown={handleKeyDown}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            height="auto"
            className="block w-full"
            onMouseMove={handleMove}
            role="img"
            aria-label={`Latency over time for ${service.name}`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridLines.map((g) => {
              const y = PAD_T + g * (VB_H - PAD_T - PAD_B);
              const value = Math.round(maxY * (1 - g));
              return (
                <g key={g}>
                  <line
                    x1={PAD_L}
                    x2={VB_W - PAD_R}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    className="text-white/10"
                    strokeWidth={1}
                  />
                  <text x={PAD_L - 8} y={y + 3} textAnchor="end" fontSize={10} className="fill-zinc-400 tabular-nums">
                    {value}
                  </text>
                </g>
              );
            })}

            <path
              d={`${buildPath("p95")} L${scaleX(buckets.length - 1)},${VB_H - PAD_B} L${scaleX(0)},${VB_H - PAD_B} Z`}
              fill={`url(#${gradientId})`}
              stroke="none"
            />

            <path d={buildPath("p50")} fill="none" stroke="currentColor" className="text-zinc-400" strokeWidth={1.5} />
            <path d={buildPath("p99")} fill="none" stroke="currentColor" className="text-violet-300" strokeWidth={1.5} strokeDasharray="4 3" />
            <path d={buildPath("p95")} fill="none" stroke="currentColor" className="text-violet-400" strokeWidth={2.5} strokeLinejoin="round" />

            <line
              x1={scaleX(safeIndex)}
              x2={scaleX(safeIndex)}
              y1={PAD_T}
              y2={VB_H - PAD_B}
              stroke="currentColor"
              className="text-zinc-200/40"
              strokeWidth={1}
            />
            {(["p50", "p95", "p99"] as const).map((key) => (
              <circle
                key={key}
                cx={scaleX(safeIndex)}
                cy={scaleY(active[key])}
                r={3.2}
                className={key === "p95" ? "fill-violet-400" : key === "p99" ? "fill-violet-300" : "fill-zinc-300"}
              />
            ))}

            {buckets.map((b, i) =>
              b.label ? (
                <text
                  key={i}
                  x={scaleX(i)}
                  y={VB_H - 6}
                  textAnchor="middle"
                  fontSize={10}
                  className="fill-zinc-400 tabular-nums"
                >
                  {b.label}
                </text>
              ) : null,
            )}
          </svg>
        </div>

        <p aria-live="polite" className="mt-3 text-sm tabular-nums text-zinc-200">
          <span className="font-medium text-zinc-50">{active.label || "selected point"}:</span>{" "}
          P50 {formatInt(active.p50)}ms · P95 {formatInt(active.p95)}ms · P99 {formatInt(active.p99)}ms ·{" "}
          {formatInt(active.requests)} req · {activeErrorRate.toFixed(1)}% errors
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className={`mt-1 truncate text-xl font-semibold tabular-nums ${emphasis ? "text-violet-300" : "text-zinc-50"}`}>
        {value}
      </p>
    </div>
  );
}

function Legend({ swatch, label, dashed }: { swatch: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className={`h-0.5 w-3 rounded-full ${swatch} ${dashed ? "opacity-70" : ""}`} />
      {label}
    </span>
  );
}
