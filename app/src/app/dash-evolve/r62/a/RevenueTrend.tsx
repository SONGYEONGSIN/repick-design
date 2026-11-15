"use client";

import { useState } from "react";
import { WEEK_REVENUE, formatRevenueCompact } from "./data";
import { Card, NUM, SectionLabel } from "./ui";

const VIEW_W = 280;
const VIEW_H = 100;
const PAD_X = 10;
const PAD_Y = 10;
const PLOT_W = VIEW_W - PAD_X * 2;
const PLOT_H = VIEW_H - PAD_Y * 2;

const round2 = (n: number) => Math.round(n * 100) / 100;

const REVENUES = WEEK_REVENUE.map((w) => w.revenue);
const MIN_REVENUE = Math.min(...REVENUES);
const MAX_REVENUE = Math.max(...REVENUES);
const SPAN = Math.max(MAX_REVENUE - MIN_REVENUE, 1);

/** Chart coordinates, computed fresh from `WEEK_REVENUE` and rounded to 2 decimals — never
 *  hand-typed, so the plotted geometry can never drift from the underlying numbers. */
const POINTS = WEEK_REVENUE.map((w, i) => {
  const x = round2(PAD_X + (i / (WEEK_REVENUE.length - 1)) * PLOT_W);
  const y = round2(PAD_Y + ((MAX_REVENUE - w.revenue) / SPAN) * PLOT_H);
  return { x, y, label: w.label, revenue: w.revenue };
});

const LINE_D = POINTS.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
const AREA_D = `${LINE_D} L${POINTS[POINTS.length - 1].x} ${VIEW_H - PAD_Y} L${POINTS[0].x} ${VIEW_H - PAD_Y} Z`;

export function RevenueTrend() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : POINTS[activeIndex];

  return (
    <Card>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <SectionLabel>Revenue — last 8 weeks</SectionLabel>
        <span className={`shrink-0 whitespace-nowrap text-xs text-zinc-500 ${NUM}`}>{formatRevenueCompact(REVENUES[REVENUES.length - 1])}/wk</span>
      </div>

      <div className="relative" style={{ height: 120 }}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          role="img"
          aria-label={`Weekly revenue trend, ${WEEK_REVENUE[0].label} through ${WEEK_REVENUE[WEEK_REVENUE.length - 1].label}, ranging from ${formatRevenueCompact(MIN_REVENUE)} to ${formatRevenueCompact(MAX_REVENUE)}`}
        >
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c2410c" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={AREA_D} fill="url(#trend-fill)" />
          <path d={LINE_D} fill="none" stroke="#c2410c" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
          {active ? (
            <line x1={active.x} y1={PAD_Y} x2={active.x} y2={VIEW_H - PAD_Y} stroke="#d4d4d8" strokeWidth="1" strokeDasharray="2 2" />
          ) : null}
          {POINTS.map((p, i) => (
            <circle
              key={p.label}
              cx={p.x}
              cy={p.y}
              r={activeIndex === i ? 3.2 : 2}
              fill={activeIndex === i ? "#c2410c" : "#ffffff"}
              stroke="#c2410c"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* Transparent, keyboard-reachable hit targets — one per week, each a full-height column so
            it's easy to hover or tab to, independent of the thin plotted line underneath. */}
        <div className="absolute inset-0 flex">
          {POINTS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              className="h-full flex-1 min-w-0 rounded-sm focus-visible:outline-2 outline-offset-2 outline-orange-600"
            >
              <span className="sr-only">{`${p.label}: ${formatRevenueCompact(p.revenue)}`}</span>
            </button>
          ))}
        </div>

        {active ? (
          <div
            role="status"
            className="pointer-events-none absolute top-0 min-w-0 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs shadow-md"
            style={{
              left: `${Math.min(Math.max((active.x / VIEW_W) * 100, 14), 86)}%`,
              transform: "translate(-50%, calc(-100% - 6px))",
            }}
          >
            <span className="block whitespace-nowrap font-medium text-zinc-900">{active.label}</span>
            <span className={`block whitespace-nowrap text-zinc-600 ${NUM}`}>{formatRevenueCompact(active.revenue)}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
