"use client";

import { useState } from "react";
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
 * 14-day queue-volume trend. Hover OR keyboard-focus any day (invisible button overlays, positioned
 * by percentage so they track the SVG regardless of rendered width) opens the same crosshair + value
 * tooltip — this state is local and ephemeral, read by nothing else on the page (interaction ①).
 */
export default function SparklineChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const activeIdx = hoveredIdx ?? POINTS.length - 1;
  const active = POINTS[activeIdx];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-14 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
        <path d={PATH} fill="none" stroke="#15803d" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
        {hoveredIdx != null ? <line x1={active.x} y1={0} x2={active.x} y2={HEIGHT} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="2,2" /> : null}
        <circle cx={active.x} cy={active.y} r={2.75} fill="#15803d" />
      </svg>

      <div className="absolute inset-0 flex">
        {POINTS.map((p, i) => (
          <button
            key={p.offset}
            type="button"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => setHoveredIdx(i)}
            onBlur={() => setHoveredIdx(null)}
            className={cx("h-full flex-1 rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-green-700")}
          >
            <span className="sr-only">{`${formatShortDate(p.offset)}: ${p.value} reports received`}</span>
          </button>
        ))}
      </div>

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
