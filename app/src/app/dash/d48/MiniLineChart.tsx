"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useRef } from "react";
import type { LatencyPoint } from "./data";
import { formatHour } from "./data";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

/**
 * Generative SVG line chart with a keyboard-accessible crosshair. `activeIndex` is controlled by
 * the parent so two mirrored panels can share one crosshair position — hovering or focusing
 * either region's chart moves both, which is the point of a twin comparison: the same hour is
 * always readable on both sides at once. Coordinates are rounded to 2 decimals (determinism).
 * A visually-hidden data table ships alongside the SVG as the mandatory fallback for a Line chart
 * at A11y grade AA (charts.catalog) — screen-reader users get the exact hourly series either way.
 */

const VB_W = 280;
const VB_H = 72;
const PAD_X = 4;
const PAD_TOP = 10;
const PAD_BOTTOM = 10;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function MiniLineChart({
  series,
  activeIndex,
  onActiveIndexChange,
  color,
  ariaLabel,
  regionName,
}: {
  series: LatencyPoint[];
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
  color: string;
  ariaLabel: string;
  regionName: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const n = series.length;
  const values = series.map((p) => p.latencyMs);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);

  function xFor(i: number): number {
    return round2(PAD_X + (i / (n - 1)) * (VB_W - PAD_X * 2));
  }
  function yFor(v: number): number {
    const t = (v - min) / span;
    return round2(VB_H - PAD_BOTTOM - t * (VB_H - PAD_TOP - PAD_BOTTOM));
  }

  const linePath = series.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.latencyMs)}`).join(" ");
  const areaPath = `${linePath} L${xFor(n - 1)},${VB_H - PAD_BOTTOM} L${xFor(0)},${VB_H - PAD_BOTTOM} Z`;

  function indexFromClientX(clientX: number): number {
    const el = wrapRef.current;
    if (!el) return n - 1;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (n - 1));
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    onActiveIndexChange(indexFromClientX(e.clientX));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = activeIndex ?? n - 1;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onActiveIndexChange(Math.max(0, current - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onActiveIndexChange(Math.min(n - 1, current + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      onActiveIndexChange(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onActiveIndexChange(n - 1);
    }
  }

  const active = activeIndex !== null ? series[activeIndex] : null;
  const tooltipPct = activeIndex !== null ? Math.min(88, Math.max(12, (activeIndex / (n - 1)) * 100)) : 50;

  return (
    <div>
      <div
        ref={wrapRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={activeIndex ?? n - 1}
        aria-valuetext={
          active
            ? `${formatHour(active.hourMs)}: ${active.latencyMs} ms`
            : `${formatHour(series[n - 1].hourMs)}: ${series[n - 1].latencyMs} ms (latest)`
        }
        onPointerMove={onPointerMove}
        onPointerLeave={() => onActiveIndexChange(null)}
        onFocus={() => onActiveIndexChange(activeIndex ?? n - 1)}
        onBlur={() => onActiveIndexChange(null)}
        onKeyDown={onKeyDown}
        className={cx(
          "relative h-[72px] w-full cursor-crosshair rounded-lg",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
        )}
      >
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <line x1={PAD_X} y1={VB_H - PAD_BOTTOM} x2={VB_W - PAD_X} y2={VB_H - PAD_BOTTOM} stroke="currentColor" strokeWidth="1" className="text-zinc-200" />
          <path d={areaPath} fill={color} fillOpacity="0.12" stroke="none" />
          <path d={linePath} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
          {active ? (
            <>
              <line
                x1={xFor(activeIndex as number)}
                y1={PAD_TOP - 4}
                x2={xFor(activeIndex as number)}
                y2={VB_H - PAD_BOTTOM}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              <circle cx={xFor(activeIndex as number)} cy={yFor(active.latencyMs)} r="3" fill={color} stroke="white" strokeWidth="1.25" />
            </>
          ) : null}
        </svg>

        {active ? (
          // Sighted-only convenience overlay: the slider's aria-valuetext already announces the
          // same value+hour to assistive tech on every move, so this is aria-hidden to avoid a
          // second, differently-worded announcement (and any label/content mismatch with the
          // slider's own aria-label).
          <div
            aria-hidden="true"
            style={{ left: `${round2(tooltipPct)}%` }}
            className={cx(
              "pointer-events-none absolute -top-1 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] shadow-md shadow-zinc-950/10",
              "motion-reduce:transition-none",
            )}
          >
            <span className={cx("font-medium", TEXT_PRIMARY)}>{active.latencyMs} ms</span>
            <span className={cx("ml-1.5", TEXT_CAPTION)}>{formatHour(active.hourMs)}</span>
          </div>
        ) : null}
      </div>

      <table className="sr-only">
        <caption>{regionName} — P95 latency, last 24 hours</caption>
        <thead>
          <tr>
            <th scope="col">Hour</th>
            <th scope="col">P95 latency (ms)</th>
          </tr>
        </thead>
        <tbody>
          {series.map((p) => (
            <tr key={p.hourMs}>
              <td>{formatHour(p.hourMs)}</td>
              <td>{p.latencyMs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
