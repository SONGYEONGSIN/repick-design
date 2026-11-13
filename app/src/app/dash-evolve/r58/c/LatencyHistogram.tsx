"use client";

import { useState } from "react";
import { HISTOGRAMS, PERCENTILES, type Period, type Bin } from "./data";

const WIDTH = 680;
const HEIGHT = 180;
const PAD_L = 8;
const PAD_R = 8;
const PAD_TOP = 8;
const PAD_BOTTOM = 24;
const GAP = 6;

function binIndexFor(bins: Bin[], ms: number) {
  for (let i = 0; i < bins.length; i++) {
    if (ms <= bins[i].to || i === bins.length - 1) return i;
  }
  return bins.length - 1;
}

export function LatencyHistogram({
  period,
  focusLabel,
  focusP99,
}: {
  period: Period;
  focusLabel: string | null;
  focusP99: number | null;
}) {
  const bins = HISTOGRAMS[period];
  const percentiles = PERCENTILES[period];
  const maxCount = Math.max(...bins.map((b) => b.count));
  const plotWidth = WIDTH - PAD_L - PAD_R;
  const barWidth = Number(((plotWidth - GAP * (bins.length - 1)) / bins.length).toFixed(2));
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hovered = hoveredIndex !== null ? bins[hoveredIndex] : null;

  const focusBinIndex = focusP99 !== null ? binIndexFor(bins, focusP99) : null;
  const focusX =
    focusBinIndex !== null
      ? Number((PAD_L + focusBinIndex * (barWidth + GAP) + barWidth / 2).toFixed(2))
      : null;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Latency distribution</p>
        <p aria-live="polite" className="text-xs font-normal tabular-nums text-slate-300">
          {hovered
            ? `${hovered.from}–${hovered.to}ms — ${hovered.count.toLocaleString("en-US")} requests`
            : focusLabel
              ? `Focused: ${focusLabel} · p99 ${focusP99}ms`
              : "Hover or focus a bar for its count"}
        </p>
      </div>

      {/* Percentiles shown as permanent text, not only on hover — dash-brief-v3's "단일 지배
          시각화 완성도" rule. */}
      <div className="mt-2 flex items-center gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">p50</p>
          <p className="font-[family-name:var(--font-display-mono)] text-sm font-semibold tabular-nums text-slate-50">
            {percentiles.p50}ms
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">p95</p>
          <p className="font-[family-name:var(--font-display-mono)] text-sm font-semibold tabular-nums text-amber-300">
            {percentiles.p95}ms
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">p99</p>
          <p className="font-[family-name:var(--font-display-mono)] text-sm font-semibold tabular-nums text-rose-300">
            {percentiles.p99}ms
          </p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-3 h-40 w-full"
        role="img"
        aria-label={`Latency histogram for the ${period} window: ${bins.map((b) => `${b.from} to ${b.to} milliseconds, ${b.count} requests`).join("; ")}. p50 ${percentiles.p50}ms, p95 ${percentiles.p95}ms, p99 ${percentiles.p99}ms.`}
      >
        {bins.map((bin, i) => {
          const h = Number(((bin.count / maxCount) * plotHeight).toFixed(2));
          const x = Number((PAD_L + i * (barWidth + GAP)).toFixed(2));
          const y = Number((PAD_TOP + plotHeight - h).toFixed(2));
          const isHovered = hoveredIndex === i;
          return (
            <g key={`${bin.from}-${bin.to}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx="2"
                className={isHovered ? "fill-rose-400" : "fill-rose-500/70"}
              />
              <rect
                x={x}
                y={PAD_TOP}
                width={barWidth}
                height={plotHeight}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${bin.from} to ${bin.to} milliseconds: ${bin.count} requests`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={() => setHoveredIndex(null)}
                className="cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-300"
              />
              <text
                x={Number((x + barWidth / 2).toFixed(2))}
                y={HEIGHT - 6}
                textAnchor="middle"
                className="fill-slate-400 text-[9px] tabular-nums"
              >
                {bin.from}
              </text>
            </g>
          );
        })}
        {focusX !== null && (
          <g aria-hidden="true">
            <line x1={focusX} y1={PAD_TOP} x2={focusX} y2={PAD_TOP + plotHeight} stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" className="text-slate-200" />
            <circle cx={focusX} cy={PAD_TOP} r="3" className="fill-slate-50" />
          </g>
        )}
      </svg>
    </div>
  );
}
