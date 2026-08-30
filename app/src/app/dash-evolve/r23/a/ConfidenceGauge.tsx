"use client";

import { useState } from "react";
import { Sparkline, SegmentedControl, FOCUS_LIGHT, cx } from "./ui";

/**
 * Flagship visualization for the detail pane: a generated semicircular gauge for the AI re-grade
 * confidence, plus a per-pass trend line underneath. Generative SVG/CSS only, no chart library.
 * Coordinates are computed from trig and rounded to 2 decimals so the arc is fully deterministic.
 *
 * Commercial-completeness note: the confidence number is rendered as persistent text in the middle
 * of the arc at all times — it does not require a hover to read. Only the per-pass sparkline detail
 * underneath benefits from a hover/focus point tooltip, and that tooltip is ephemeral component state
 * (see TrendWithTooltip below), never lifted page state.
 */

function polar(px: number, py: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round((px + r * Math.cos(rad)) * 100) / 100,
    y: Math.round((py + r * Math.sin(rad)) * 100) / 100,
  };
}

function arcPath(px: number, py: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(px, py, r, startDeg);
  const end = polar(px, py, r, endDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function ConfidenceGauge({
  confidence,
  verdictLabel,
  trend,
}: {
  confidence: number;
  verdictLabel: string;
  trend: number[];
}) {
  const [view, setView] = useState<"pass" | "cumulative">("pass");
  const centerX = 90;
  const centerY = 84;
  const r = 68;
  const startDeg = 180;
  const endDeg = 360;
  const sweep = ((endDeg - startDeg) * confidence) / 100;
  const trackPath = arcPath(centerX, centerY, r, startDeg, endDeg);
  const fillPath = arcPath(centerX, centerY, r, startDeg, startDeg + sweep);

  const cumulative = trend.map((_, i) => {
    const slice = trend.slice(0, i + 1);
    return Math.round((slice.reduce((s, v) => s + v, 0) / slice.length) * 10) / 10;
  });
  const seriesValues = view === "pass" ? trend : cumulative;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">AI re-grade confidence</p>
      </div>

      <div className="relative mx-auto mt-1 h-[92px] w-[180px]">
        <svg viewBox="0 0 180 92" className="h-full w-full" aria-hidden="true">
          <path d={trackPath} fill="none" stroke="#E4E4E7" strokeWidth={12} strokeLinecap="round" />
          <path d={fillPath} fill="none" stroke="#B45309" strokeWidth={12} strokeLinecap="round" />
        </svg>
        {/* Persistent value — always visible, never hidden behind a hover state. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-[28px] font-semibold leading-none tabular-nums text-zinc-900">{confidence}%</span>
          <span className="mt-1 text-[11px] text-zinc-500">{verdictLabel}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Confidence by pass</p>
        <SegmentedControl
          ariaLabel="Confidence trend view"
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: "pass", label: "Per pass" },
            { value: "cumulative", label: "Cumulative" },
          ]}
        />
      </div>
      <div className="mt-2">
        <TrendWithTooltip values={seriesValues} />
      </div>
    </div>
  );
}

/**
 * Ephemeral inspector — Mode B of the selection-propagation split (see DetailPane.tsx header comment
 * and Timeline.tsx). Hovering / focusing a point shows its exact value in a small floating label held
 * entirely in this component's own `hoverIndex` state; it never touches lifted page state and resets
 * the instant the pointer/focus leaves, so it cannot be confused with the persistent "pin" that a
 * rail-row click performs.
 */
function TrendWithTooltip({ values }: { values: number[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const width = 220;
  const height = 40;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1 || 1);
  const points = values.map((v, i) => ({
    x: Math.round(i * stepX * 100) / 100,
    y: Math.round((height - 4 - ((v - min) / span) * (height - 8)) * 100) / 100,
    v,
  }));

  return (
    <div className="relative">
      <Sparkline values={values} width={width} height={height} tone="#B45309" />
      <div className="absolute inset-0 flex">
        {points.map((p, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Pass ${i + 1}: ${p.v}% confidence`}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            onFocus={() => setHoverIndex(i)}
            onBlur={() => setHoverIndex(null)}
            className={cx("h-full flex-1 rounded-sm", FOCUS_LIGHT)}
          />
        ))}
      </div>
      {hoverIndex !== null && (
        <div
          role="tooltip"
          className="pointer-events-none absolute -top-7 z-10 -translate-x-1/2 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-zinc-800 shadow-md"
          style={{ left: `${points[hoverIndex].x}px` }}
        >
          Pass {hoverIndex + 1}: {points[hoverIndex].v}%
        </div>
      )}
    </div>
  );
}
