"use client";

import { useId, useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { Experiment, MetricKey } from "./types";
import { METRICS, formatSignedPct, resolveMetric, round2, sampleFor } from "./format";
import { FOCUS_RING } from "./ui";

const VIEW_W = 760;
const VIEW_H = 340;
const PLOT_TOP = 34;
const PLOT_BOTTOM = 306;
const LEFT_X = 210;
const RIGHT_X = 560;
const MIN_GAP = 32;

interface Point {
  id: string;
  y: number;
}

/** Enforces a minimum vertical gap between same-column label points, deterministically. */
function resolveColumn(points: Point[]): Map<string, number> {
  const sorted = [...points].sort((a, b) => a.y - b.y || a.id.localeCompare(b.id));
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < MIN_GAP) sorted[i].y = sorted[i - 1].y + MIN_GAP;
  }
  const overflow = sorted[sorted.length - 1].y - PLOT_BOTTOM;
  if (overflow > 0) {
    sorted[sorted.length - 1].y = PLOT_BOTTOM;
    for (let i = sorted.length - 2; i >= 0; i--) {
      if (sorted[i + 1].y - sorted[i].y < MIN_GAP) sorted[i].y = sorted[i + 1].y - MIN_GAP;
    }
  }
  if (sorted[0] && sorted[0].y < PLOT_TOP) sorted[0].y = PLOT_TOP;
  const map = new Map<string, number>();
  for (const p of sorted) map.set(p.id, round2(p.y));
  return map;
}

export function SlopeChart({
  experiments,
  metric,
  hoveredId,
  onHover,
}: {
  experiments: Experiment[];
  metric: MetricKey;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const titleId = useId();
  const meta = METRICS[metric];

  const rows = useMemo(() => {
    const samples = experiments.map((exp) => ({ exp, sample: sampleFor(exp, metric), result: resolveMetric(sampleFor(exp, metric), metric) }));
    const allValues = samples.flatMap((s) => [s.sample.before, s.sample.after]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const span = max - min || 1;
    const padding = span * 0.12;
    const domainMin = min - padding;
    const domainMax = max + padding;
    const scale = (value: number) => round2(PLOT_TOP + (1 - (value - domainMin) / (domainMax - domainMin)) * (PLOT_BOTTOM - PLOT_TOP));

    const rawBefore = samples.map((s) => ({ id: s.exp.id, y: scale(s.sample.before) }));
    const rawAfter = samples.map((s) => ({ id: s.exp.id, y: scale(s.sample.after) }));
    const beforeY = resolveColumn(rawBefore);
    const afterY = resolveColumn(rawAfter);

    return samples.map((s) => ({
      ...s,
      yBefore: beforeY.get(s.exp.id) ?? PLOT_TOP,
      yAfter: afterY.get(s.exp.id) ?? PLOT_TOP,
    }));
  }, [experiments, metric]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-none flex-wrap items-baseline justify-between gap-2 text-[11px] text-zinc-500">
        <span>
          <span className="font-semibold text-zinc-700">{meta.label}</span> — before the experiment&apos;s variant shipped vs. after
        </span>
        <span className="font-normal">{meta.better === "higher" ? "Higher is better" : "Lower is better"}</span>
      </div>
      <svg
        aria-labelledby={titleId}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="min-h-0 w-full flex-1"
      >
        <title id={titleId}>{`${meta.label} before vs. after, one line per active experiment`}</title>
        <line x1={LEFT_X} y1={PLOT_TOP - 10} x2={LEFT_X} y2={PLOT_BOTTOM + 10} className="stroke-zinc-200" strokeWidth={1} />
        <line x1={RIGHT_X} y1={PLOT_TOP - 10} x2={RIGHT_X} y2={PLOT_BOTTOM + 10} className="stroke-zinc-200" strokeWidth={1} />
        <text x={LEFT_X} y={20} textAnchor="middle" className="fill-zinc-400 text-[10px] font-semibold tracking-wide uppercase">
          Before
        </text>
        <text x={RIGHT_X} y={20} textAnchor="middle" className="fill-zinc-400 text-[10px] font-semibold tracking-wide uppercase">
          After
        </text>

        {rows.map(({ exp, result, yBefore, yAfter }) => {
          const isHovered = hoveredId === exp.id;
          const isDimmed = hoveredId !== null && !isHovered;
          const lineColor = result.direction === "improved" ? "stroke-emerald-600" : "stroke-rose-600";
          const dotColor = result.direction === "improved" ? "fill-emerald-600 stroke-emerald-600" : "fill-rose-600 stroke-rose-600";
          const textColor = result.direction === "improved" ? "fill-emerald-700" : "fill-rose-700";
          const Icon = result.direction === "improved" ? TrendingUp : TrendingDown;
          return (
            <g
              key={exp.id}
              className="motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out"
              style={{ opacity: isDimmed ? 0.35 : 1 }}
            >
              <line
                x1={LEFT_X}
                y1={yBefore}
                x2={RIGHT_X}
                y2={yAfter}
                className={lineColor}
                strokeWidth={isHovered ? 3.5 : 2}
                strokeLinecap="round"
              />
              <circle cx={LEFT_X} cy={yBefore} r={4} className={`${dotColor} fill-white`} strokeWidth={2} />
              <circle cx={RIGHT_X} cy={yAfter} r={4} className={dotColor} strokeWidth={2} />

              <text x={LEFT_X - 14} y={yBefore - 5} textAnchor="end" className="fill-zinc-500 text-[10.5px] font-normal">
                {exp.shortName}
              </text>
              <text x={LEFT_X - 14} y={yBefore + 12} textAnchor="end" className="fill-zinc-900 text-[12px] font-bold tabular-nums">
                {meta.format(result.before)}
              </text>

              <text x={RIGHT_X + 14} y={yAfter - 5} textAnchor="start" className="fill-zinc-900 text-[12px] font-bold tabular-nums">
                {meta.format(result.after)}
              </text>
              <Icon x={RIGHT_X + 14} y={yAfter + 2} width={11} height={11} className={textColor} aria-hidden="true" />
              <text x={RIGHT_X + 29} y={yAfter + 12} textAnchor="start" className={`${textColor} text-[10.5px] font-semibold tabular-nums`}>
                {formatSignedPct(result.pctChange)} {result.direction}
              </text>

              {/* Keyboard- and mouse-accessible hit area; aria-label carries the full comparison for screen readers. */}
              <rect
                x={LEFT_X - 8}
                y={Math.min(yBefore, yAfter) - 16}
                width={RIGHT_X - LEFT_X + 16}
                height={Math.abs(yAfter - yBefore) + 32}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${exp.name}, flag ${exp.flagKey}: ${meta.format(result.before)} before, ${meta.format(result.after)} after, ${formatSignedPct(result.pctChange)}, ${result.direction}`}
                className={`cursor-pointer ${FOCUS_RING}`}
                onMouseEnter={() => onHover(exp.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(exp.id)}
                onBlur={() => onHover(null)}
              />
            </g>
          );
        })}
      </svg>

      <table className="sr-only">
        <caption>{`${meta.label} before vs. after, by experiment`}</caption>
        <thead>
          <tr>
            <th scope="col" className="font-semibold">
              Experiment
            </th>
            <th scope="col" className="font-semibold">
              Flag
            </th>
            <th scope="col" className="font-semibold">
              Before
            </th>
            <th scope="col" className="font-semibold">
              After
            </th>
            <th scope="col" className="font-semibold">
              Change
            </th>
            <th scope="col" className="font-semibold">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ exp, result }) => (
            <tr key={exp.id}>
              <td className="font-normal">{exp.name}</td>
              <td className="font-normal">{exp.flagKey}</td>
              <td className="font-normal">{meta.format(result.before)}</td>
              <td className="font-normal">{meta.format(result.after)}</td>
              <td className="font-normal">{formatSignedPct(result.pctChange)}</td>
              <td className="font-normal">{result.direction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
