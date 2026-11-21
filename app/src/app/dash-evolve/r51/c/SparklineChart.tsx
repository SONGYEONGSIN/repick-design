"use client";

import { useState, type KeyboardEvent } from "react";
import { QUEUE_VOLUME, formatShortDate } from "./data";
import { BORDER, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

const WIDTH = 280;
const HEIGHT = 56;
const PAD_X = 4;
const PAD_Y = 6;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildPoints() {
  const max = Math.max(...QUEUE_VOLUME);
  const min = Math.min(...QUEUE_VOLUME);
  const span = max - min || 1;
  const n = QUEUE_VOLUME.length;
  return QUEUE_VOLUME.map((value, i) => {
    const x = round2(PAD_X + (i * (WIDTH - PAD_X * 2)) / (n - 1));
    const y = round2(PAD_Y + (1 - (value - min) / span) * (HEIGHT - PAD_Y * 2));
    return { x, y, value, offset: i };
  });
}

const POINTS = buildPoints();
const PATH = POINTS.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

/**
 * 14-day queue-volume trend. One `role="slider"` scrub rail (not one button per day — 14 adjacent
 * ~20px buttons failed Lighthouse `target-size`, since none of them had the 24x24 safe-clickable
 * space the audit requires) spans the whole chart: pointer move picks the nearest day, Arrow
 * Left/Right/Home/End step it on focus. This state is local and ephemeral, read by nothing else on
 * the page (interaction ①) — same single-scrub-rail pattern already established and gate-verified
 * elsewhere in this catalog's StreamGraph chart (auto-dash-r51/a).
 */
export default function SparklineChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const activeIdx = hoveredIdx ?? POINTS.length - 1;
  const active = POINTS[activeIdx];

  function indexFromClientX(el: HTMLElement, clientX: number): number {
    const rect = el.getBoundingClientRect();
    const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    const n = POINTS.length;
    return Math.min(n - 1, Math.max(0, Math.round(ratio * (n - 1))));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setHoveredIdx((i) => Math.min(POINTS.length - 1, (i ?? POINTS.length - 1) + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setHoveredIdx((i) => Math.max(0, (i ?? POINTS.length - 1) - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setHoveredIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHoveredIdx(POINTS.length - 1);
    }
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-14 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
        <path d={PATH} fill="none" stroke="#15803d" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
        {hoveredIdx != null ? <line x1={active.x} y1={0} x2={active.x} y2={HEIGHT} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="2,2" /> : null}
        <circle cx={active.x} cy={active.y} r={2.75} fill="#15803d" />
      </svg>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Queue volume by day"
        aria-valuemin={0}
        aria-valuemax={POINTS.length - 1}
        aria-valuenow={activeIdx}
        aria-valuetext={`${formatShortDate(active.offset)}: ${active.value} reports received`}
        className="absolute inset-0 rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-green-700"
        onPointerMove={(e) => setHoveredIdx(indexFromClientX(e.currentTarget, e.clientX))}
        onPointerLeave={() => setHoveredIdx(null)}
        onFocus={() => setHoveredIdx((i) => i ?? POINTS.length - 1)}
        onBlur={() => setHoveredIdx(null)}
        onKeyDown={onKeyDown}
      />

      <div
        aria-hidden="true"
        className={cx("pointer-events-none absolute -top-1 -translate-x-1/2 -translate-y-full rounded-md border px-2 py-1 text-[11px] font-medium shadow-sm", BORDER, "bg-white", TEXT_PRIMARY, TRANSITION, hoveredIdx != null ? "opacity-100" : "opacity-0")}
        style={{ left: `${(active.x / WIDTH) * 100}%` }}
      >
        <span className={NUM}>{active.value}</span> on {formatShortDate(active.offset)}
      </div>

      <div className={cx("mt-1 flex items-center justify-between text-[10px] font-normal", TEXT_AUX)}>
        <span>{formatShortDate(0)}</span>
        <span>{formatShortDate(POINTS.length - 1)} (today)</span>
      </div>
    </div>
  );
}
