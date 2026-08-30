"use client";

import { useId, useState } from "react";
import {
  formatByUnit,
  headlineFor,
  type Bucket,
  type DimensionDef,
  type MetricDef,
  type PeriodDef,
  type TableRow,
} from "./data";
import { CATEGORICAL } from "./tokens";
import { Badge, DeltaChip } from "./ui";

const BAR_GAP = 3;
const TARGET_WIDTH = 880;
const MIN_MARK = 24;
const PLOT_H = 200;
const AXIS_H = 24;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function geometry(n: number) {
  const rawWidth = (TARGET_WIDTH - (n - 1) * BAR_GAP) / n;
  const markWidth = Math.max(MIN_MARK, rawWidth);
  const totalWidth = round2(n * markWidth + (n - 1) * BAR_GAP);
  return { markWidth: round2(markWidth), totalWidth };
}

/**
 * The single dominant visualization. Stacked bars for additive metrics
 * (category shares of a real total, per bucket) or small multi-line for
 * rate/average metrics (stacking a percentage would misrepresent it). Either
 * way the exact same crosshair + hero-number treatment applies, because the
 * chart answers exactly one assembled question at a time.
 */
export function ExploreChart({
  metric,
  dimension,
  period,
  rows,
  buckets,
}: {
  metric: MetricDef;
  dimension: DimensionDef;
  period: PeriodDef;
  rows: TableRow[];
  buckets: Bucket[];
}) {
  const uid = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const headline = headlineFor(metric, period);
  const n = buckets.length;
  const { markWidth, totalWidth } = geometry(n);
  const svgHeight = PLOT_H + AXIS_H;

  const bucketTotals = buckets.map((_, i) => rows.reduce((sum, r) => sum + Math.max(0, r.spark[i]), 0));
  const bucketBlended = buckets.map((_, i) => rows.reduce((sum, r) => sum + r.spark[i] * r.category.weight, 0));
  const bucketPeaks = buckets.map((_, i) => Math.max(...rows.map((r) => r.spark[i]), 0));
  const domainMax = metric.additive
    ? Math.max(...bucketTotals, 1) * 1.15
    : Math.max(...bucketPeaks, 1) * 1.2;

  function yFor(v: number): number {
    return round2(PLOT_H - (Math.max(0, v) / domainMax) * PLOT_H);
  }

  const active = activeIndex !== null ? buckets[activeIndex] : null;
  const tooltipId = `${uid}-tooltip`;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {metric.label} · {dimension.label} · {period.label}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span className="[font-family:var(--font-display-mono)] text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl">
              {formatByUnit(headline.value, metric.unit)}
            </span>
            <DeltaChip deltaPct={headline.deltaPct} isGood={headline.isGood} />
          </div>
          <p className="mt-1 text-xs font-normal text-zinc-500">
            vs {formatByUnit(headline.priorValue, metric.unit)} prior {period.label.toLowerCase()}
          </p>
        </div>
        <Badge tone="neutral">{metric.additive ? "Stacked total" : "Weighted average"}</Badge>
      </div>

      <div className="mt-5 w-full overflow-x-auto">
        <div className="relative" style={{ width: totalWidth }}>
          <svg
            width={totalWidth}
            height={svgHeight}
            viewBox={`0 0 ${totalWidth} ${svgHeight}`}
            role="img"
            aria-label={`${metric.label} by ${dimension.label.toLowerCase()}, ${period.label.toLowerCase()}. See the table below for exact values.`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <line
                key={f}
                x1={0}
                x2={totalWidth}
                y1={round2(PLOT_H * f)}
                y2={round2(PLOT_H * f)}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1}
              />
            ))}

            {metric.additive
              ? buckets.map((_, i) => {
                  const x = round2(i * (markWidth + BAR_GAP));
                  let cursor = PLOT_H; // running baseline; segments stack upward
                  return (
                    <g key={i}>
                      {rows.map((row, ri) => {
                        const v = Math.max(0, row.spark[i]);
                        const h = round2((v / domainMax) * PLOT_H);
                        const segTop = round2(cursor - h);
                        // 2px surface gap between stacked segments (1px inset each side)
                        const insetY = round2(segTop + (h > 2 ? 1 : 0));
                        const insetH = Math.max(0, round2(h > 2 ? h - 2 : h));
                        cursor = segTop;
                        return (
                          <rect
                            key={row.category.id}
                            x={x}
                            y={insetY}
                            width={markWidth}
                            height={insetH}
                            rx={insetH > 3 ? 2 : 0}
                            fill={CATEGORICAL[ri % CATEGORICAL.length]}
                            opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                          />
                        );
                      })}
                    </g>
                  );
                })
              : rows.map((row, ri) => {
                  const points = row.spark
                    .map((v, i) => `${round2(i * (markWidth + BAR_GAP) + markWidth / 2)},${yFor(v)}`)
                    .join(" ");
                  return (
                    <polyline
                      key={row.category.id}
                      points={points}
                      fill="none"
                      stroke={CATEGORICAL[ri % CATEGORICAL.length]}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={activeIndex === null ? 0.95 : 0.4}
                    />
                  );
                })}

            {!metric.additive &&
              rows.map((row, ri) =>
                row.spark.map((v, i) =>
                  i === activeIndex ? (
                    <circle
                      key={`${row.category.id}-${i}`}
                      cx={round2(i * (markWidth + BAR_GAP) + markWidth / 2)}
                      cy={yFor(v)}
                      r={3.5}
                      fill={CATEGORICAL[ri % CATEGORICAL.length]}
                      stroke="#18181b"
                      strokeWidth={1.5}
                    />
                  ) : null,
                ),
              )}

            {activeIndex !== null && (
              <line
                x1={round2(activeIndex * (markWidth + BAR_GAP) + markWidth / 2)}
                x2={round2(activeIndex * (markWidth + BAR_GAP) + markWidth / 2)}
                y1={0}
                y2={PLOT_H}
                stroke="#5b9bec"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
            )}

            {buckets.map((b, i) =>
              b.label ? (
                <text
                  key={i}
                  x={round2(i * (markWidth + BAR_GAP) + markWidth / 2)}
                  y={PLOT_H + 16}
                  textAnchor="middle"
                  className="fill-zinc-400 text-[10px] font-normal"
                >
                  {b.label}
                </text>
              ) : null,
            )}
          </svg>

          <div className="absolute inset-x-0 top-0 flex" style={{ height: PLOT_H }}>
            {buckets.map((b, i) => (
              <button
                key={i}
                type="button"
                aria-describedby={activeIndex === i ? tooltipId : undefined}
                aria-label={`${b.fullLabel}: ${formatByUnit(
                  metric.additive ? bucketTotals[i] : bucketBlended[i],
                  metric.unit,
                )}`}
                className="h-full outline-none focus-visible:bg-white/5"
                style={{ width: markWidth, marginRight: i === buckets.length - 1 ? 0 : BAR_GAP }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
              />
            ))}
          </div>

          {active !== null &&
            (() => {
              const idx = activeIndex as number;
              return (
                <div
                  id={tooltipId}
                  role="tooltip"
                  className="pointer-events-none absolute z-20 w-52 -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-950 p-3 shadow-xl shadow-black/50"
                  style={{
                    left: Math.min(Math.max(round2(idx * (markWidth + BAR_GAP) + markWidth / 2), 104), totalWidth - 104),
                    top: PLOT_H + AXIS_H + 8,
                  }}
                >
                  <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{active.fullLabel}</p>
                  <ul className="mt-1.5 space-y-1">
                    {rows.map((row, ri) => (
                      <li key={row.category.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex min-w-0 items-center gap-1.5 text-zinc-300">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: CATEGORICAL[ri % CATEGORICAL.length] }}
                            aria-hidden="true"
                          />
                          <span className="truncate">{row.category.label}</span>
                        </span>
                        <span className="shrink-0 font-medium tabular-nums text-zinc-50">
                          {formatByUnit(row.spark[idx], metric.unit)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5 text-xs">
                    <span className="font-medium text-zinc-400">{metric.additive ? "Total" : "Blended avg"}</span>
                    <span className="font-semibold tabular-nums text-zinc-50">
                      {formatByUnit(metric.additive ? bucketTotals[idx] : bucketBlended[idx], metric.unit)}
                    </span>
                  </div>
                </div>
              );
            })()}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {rows.map((row, ri) => (
          <li key={row.category.id} className="flex items-center gap-1.5 text-xs font-normal text-zinc-400">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: CATEGORICAL[ri % CATEGORICAL.length] }}
              aria-hidden="true"
            />
            {row.category.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
