"use client";

import { motion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  AREA_PATH_D,
  BASELINE_Y,
  CATEGORY_LABEL,
  CHART_HEIGHT,
  CHART_WIDTH,
  LINE_PATH_D,
  type WindowStats,
  formatDayLabel,
  windowLabel,
  xForIndex,
} from "./data";
import { ACCENT_TEXT, CAPTION, EYEBROW, MUTED_TEXT } from "./tokens";
import { useMounted } from "./useMounted";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const CLIP_ID = "trend-window-clip";

export default function TrendChart({ start, end, stats }: { start: number; end: number; stats: WindowStats }) {
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();
  const animate = mounted && !reduceMotion;

  const clipX = xForIndex(start);
  const clipWidth = Math.max(2, Math.round((xForIndex(end) - xForIndex(start)) * 100) / 100);

  const direction: "up" | "down" | "flat" = stats.deltaPct === null || stats.deltaPct === 0 ? "flat" : stats.deltaPct > 0 ? "up" : "down";
  const DirIcon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const trendCopy =
    stats.deltaPct === null
      ? "Not enough history yet for a prior-window comparison."
      : stats.deltaPct === 0
        ? "Flat versus the prior window of the same length."
        : `${direction === "up" ? "Up" : "Down"} ${Math.abs(stats.deltaPct)}% vs. the prior ${stats.lengthDays}-day window.`;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={`${EYEBROW} ${ACCENT_TEXT}`}>Demand trend · {CATEGORY_LABEL}</p>
        <p className={`${CAPTION} ${MUTED_TEXT}`}>{windowLabel(start, end)}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="text-4xl font-extrabold leading-none tracking-[-0.02em] text-[#09090B] sm:text-5xl">
          <span className="tabular-nums">{stats.avgDays}</span>
          <span className="ml-2 text-base font-normal tracking-[0em] text-[#09090B]">days to sell</span>
        </p>
        <p className={`flex items-center gap-1.5 text-sm font-semibold ${direction === "up" ? ACCENT_TEXT : "text-zinc-600"}`}>
          <DirIcon className={`h-4 w-4 ${direction === "up" ? ACCENT_TEXT : "text-zinc-500"}`} aria-hidden="true" />
          {trendCopy}
        </p>
      </div>
      <p className={`mt-1 max-w-[420px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
        Average, on-market days to sell across every listing inside this window — narrower windows read
        current pace, wider ones smooth out single-week noise.
      </p>

      <div className="mt-5">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Demand index for ${CATEGORY_LABEL} from ${formatDayLabel(0)} to ${formatDayLabel(89)}. The highlighted segment is the selected window, ${windowLabel(start, end)}, averaging ${stats.avgDays} days to sell, ${trendCopy.toLowerCase()}`}
        >
          <defs>
            <clipPath id={CLIP_ID}>
              {animate ? (
                <motion.rect
                  y={0}
                  height={CHART_HEIGHT}
                  initial={false}
                  animate={{ x: clipX, width: clipWidth }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              ) : (
                <rect x={clipX} y={0} width={clipWidth} height={CHART_HEIGHT} />
              )}
            </clipPath>
          </defs>

          {/* baseline */}
          <line x1={0} y1={BASELINE_Y} x2={CHART_WIDTH} y2={BASELINE_Y} stroke="#E4E4E7" strokeWidth={1} />

          {/* full 90-day history, muted -- context for the highlighted window */}
          <path d={AREA_PATH_D} fill="#F4F4F5" />
          <path d={LINE_PATH_D} fill="none" stroke="#D4D4D8" strokeWidth={2} />

          {/* accent segment: same path, clipped to the selected window -- redraws when the handles move */}
          <g clipPath={`url(#${CLIP_ID})`}>
            <path d={AREA_PATH_D} fill="#059669" fillOpacity={0.14} />
            <path d={LINE_PATH_D} fill="none" stroke="#059669" strokeWidth={2.5} />
          </g>
        </svg>

        <div className={`mt-1.5 flex justify-between text-[11px] font-normal tabular-nums tracking-[0.04em] ${MUTED_TEXT}`} aria-hidden="true">
          <span>{formatDayLabel(0)}</span>
          <span>{formatDayLabel(89)}</span>
        </div>
      </div>
    </div>
  );
}
