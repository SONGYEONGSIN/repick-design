"use client";

/**
 * Backhaul — conversion trend for the selected stage, with a keyboard-operable crosshair.
 *
 * Two series that must never be told apart by colour alone: the selected stage's pass-through rate
 * is a SOLID line with a round marker, the end-to-end recovery rate is a DASHED line with a hollow
 * square marker, and both legend swatches repeat the line style. Both current values are printed as
 * text in the header at all times, so the chart is readable at a glance without any pointer.
 *
 * The SVG uses a 0–100 user-unit box with `preserveAspectRatio="none"`, so one user unit is exactly
 * one percent of the box in each axis: the HTML crosshair, markers and tooltip layered on top can
 * therefore be positioned with the same numbers, and stay pixel-round instead of being scaled into
 * ellipses. Strokes carry `vector-effect="non-scaling-stroke"` so line weight and dash length stay
 * constant at every viewport width.
 */

import type { KeyboardEvent, PointerEvent } from "react";
import { useRef } from "react";
import type { TrendPoint } from "./data";
import { fmtPct } from "./data";
import { BORDER, FOCUS, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";

const PAD_X = 2.5;
const PAD_TOP = 10;
const PAD_BOTTOM = 12;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function TrendChart({
  points,
  activeIndex,
  onActiveIndexChange,
  stageName,
  periodLabel,
}: {
  points: TrendPoint[];
  activeIndex: number | null;
  onActiveIndexChange: (i: number | null) => void;
  stageName: string;
  periodLabel: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const n = points.length;

  const all = points.flatMap((p) => [p.stagePct, p.overallPct]);
  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  const min = Math.max(0, Math.floor(rawMin - 3));
  const max = Math.min(100, Math.ceil(rawMax + 3));
  const span = Math.max(1, max - min);

  const xFor = (i: number) => round2(PAD_X + (i / (n - 1)) * (100 - PAD_X * 2));
  const yFor = (v: number) => round2(100 - PAD_BOTTOM - ((v - min) / span) * (100 - PAD_TOP - PAD_BOTTOM));

  const stagePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.stagePct)}`).join(" ");
  const areaPath = `${stagePath} L${xFor(n - 1)},${100 - PAD_BOTTOM} L${xFor(0)},${100 - PAD_BOTTOM} Z`;
  const overallPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.overallPct)}`).join(" ");

  const gridLines = [0, 0.5, 1].map((t) => round2(100 - PAD_BOTTOM - t * (100 - PAD_TOP - PAD_BOTTOM)));

  const active = activeIndex === null ? null : points[activeIndex];
  const latest = points[n - 1];
  const shown = active ?? latest;
  const shownIndex = activeIndex ?? n - 1;

  function indexFromClientX(clientX: number): number {
    const el = wrapRef.current;
    if (!el) return n - 1;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (n - 1));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = activeIndex ?? n - 1;
    let next = -1;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, current - 1);
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(n - 1, current + 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    onActiveIndexChange(next);
  }

  const tooltipLeft = Math.min(80, Math.max(20, xFor(shownIndex)));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-0.5 w-5 shrink-0 rounded-full bg-indigo-400" />
            <span className={cx("truncate text-xs font-medium", TEXT_SECONDARY)}>{stageName} pass rate</span>
          </div>
          <p className={cx("mt-0.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{fmtPct(latest.stagePct)}</p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-0.5 w-5 shrink-0 rounded-full"
              style={{ backgroundImage: "repeating-linear-gradient(to right, #a1a1aa 0 5px, transparent 5px 9px)" }}
            />
            <span className={cx("truncate text-xs font-medium", TEXT_SECONDARY)}>End-to-end recovery</span>
          </div>
          <p className={cx("mt-0.5 text-2xl font-semibold leading-none", NUM, TEXT_SECONDARY)}>{fmtPct(latest.overallPct)}</p>
        </div>
      </div>

      <div
        ref={wrapRef}
        role="slider"
        tabIndex={0}
        aria-label={`Conversion trend crosshair — ${periodLabel}. Use arrow keys to move between points.`}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={shownIndex}
        aria-valuetext={`${shown.label}: ${stageName} pass rate ${fmtPct(shown.stagePct)}, end-to-end recovery ${fmtPct(shown.overallPct)}`}
        onPointerMove={(e: PointerEvent<HTMLDivElement>) => onActiveIndexChange(indexFromClientX(e.clientX))}
        onPointerLeave={() => onActiveIndexChange(null)}
        onFocus={() => onActiveIndexChange(activeIndex ?? n - 1)}
        onBlur={() => onActiveIndexChange(null)}
        onKeyDown={onKeyDown}
        className={cx("relative mt-3 h-[176px] w-full cursor-crosshair rounded-xl border", BORDER, "bg-zinc-950/40", FOCUS)}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          {gridLines.map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={areaPath} fill="#818cf8" fillOpacity="0.16" stroke="none" />
          <path d={overallPath} fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          <path d={stagePath} fill="none" stroke="#818cf8" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className={cx("absolute left-2 text-[10px] font-medium", NUM, TEXT_CAPTION)} style={{ top: `${round2(100 - PAD_BOTTOM - (100 - PAD_TOP - PAD_BOTTOM))}%` }}>
            {max}%
          </span>
          <span className={cx("absolute left-2 -translate-y-full text-[10px] font-medium", NUM, TEXT_CAPTION)} style={{ top: `${100 - PAD_BOTTOM}%` }}>
            {min}%
          </span>
          <span className="absolute top-0 block h-full w-px bg-indigo-400/45" style={{ left: `${xFor(shownIndex)}%` }} />
          <span
            className="absolute block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-indigo-400"
            style={{ left: `${xFor(shownIndex)}%`, top: `${yFor(shown.stagePct)}%` }}
          />
          <span
            className="absolute block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 border-2 border-zinc-400 bg-zinc-950"
            style={{ left: `${xFor(shownIndex)}%`, top: `${yFor(shown.overallPct)}%` }}
          />
          <span
            className={cx("absolute top-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border px-2 py-1 text-[11px]", BORDER, "bg-zinc-900/95 shadow-lg shadow-black/40")}
            style={{ left: `${tooltipLeft}%` }}
          >
            <span className={cx("font-medium", TEXT_CAPTION)}>{shown.label}</span>
            <span className={cx("ml-1.5 font-semibold", NUM, "text-indigo-300")}>{fmtPct(shown.stagePct)}</span>
            <span className={cx("ml-1 font-normal", NUM, TEXT_CAPTION)}>/ {fmtPct(shown.overallPct)}</span>
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={cx("text-[11px] font-normal", TEXT_CAPTION)}>{points[0].label}</span>
        <span className={cx("text-[11px] font-normal", TEXT_CAPTION)}>{points[Math.floor((n - 1) / 2)].label}</span>
        <span className={cx("text-[11px] font-normal", TEXT_CAPTION)}>{latest.label}</span>
      </div>
    </div>
  );
}
