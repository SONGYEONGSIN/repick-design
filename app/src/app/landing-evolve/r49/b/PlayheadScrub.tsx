"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  MATCHES_MAX,
  MATCHES_MIN,
  WEEK_COUNT,
  WEEKS,
  formatCount,
  formatUsd,
  percentChangeFromStart,
  periodLabel,
  periodLabelCapitalized,
  weekAt,
  type WeekStat,
} from "./data";
import { ACCENT_TINT_TEXT, EYEBROW, FOCUS_RING, INK_CLASS, MUTED_TEXT, STAT_LABEL } from "./tokens";
import { useMounted } from "./useMounted";

// Chart geometry — fixed, deterministic, rounded to 2dp so server and client ever only
// disagree in ways that round away (no trig here, but the same hydration-safety habit).
const VIEW_W = 560;
const VIEW_H = 148;
const PAD_X = 18;
const PAD_Y = 20;
const CHART_W = VIEW_W - PAD_X * 2;
const CHART_H = VIEW_H - PAD_Y * 2;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function xForIndex(i: number): number {
  return round2(PAD_X + (i / (WEEK_COUNT - 1)) * CHART_W);
}

function yForValue(v: number): number {
  const t = (v - MATCHES_MIN) / (MATCHES_MAX - MATCHES_MIN);
  return round2(PAD_Y + (1 - t) * CHART_H);
}

const LINE_PATH = WEEKS.map((w, i) => `${i === 0 ? "M" : "L"} ${xForIndex(i)},${yForValue(w.matchesFound)}`).join(" ");

interface PlayheadScrubProps {
  index: number;
  onChange: (index: number) => void;
}

/**
 * The single draggable playhead: ONE point scrubbing a fixed 12-week window (not a two-handle
 * range — the brief's dual-handle time-window selector is a different device elsewhere in this
 * catalog and is deliberately not rebuilt here). The real control is a native
 * `<input type="range">`, styled as a video-style scrub bar — this keeps every keyboard
 * interaction (arrow keys, Home/End, Page Up/Down) and the focus-visible ring working for free,
 * rather than reimplementing a custom role="slider" by hand. The SVG trend line above it is
 * purely decorative (aria-hidden) and reflects the exact same index via plain percentage math —
 * dragging or arrow-keying the control moves the highlighted dot and every stat below it
 * immediately, with no separate "apply" step.
 */
export function PlayheadScrub({ index, onChange }: PlayheadScrubProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = mounted && !reduceMotion;

  const current: WeekStat = weekAt(index);
  const sliderId = useId();
  const descId = useId();

  const dotX = xForIndex(index);
  const dotY = yForValue(current.matchesFound);

  const matchesDelta = useMemo(() => percentChangeFromStart(index, "matchesFound"), [index]);
  const valueText = `Week ${index + 1} of ${WEEK_COUNT}, ${periodLabel(index)}: ${formatCount(current.matchesFound)} matches found`;

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={`${EYEBROW} ${ACCENT_TINT_TEXT}`}>Live marketplace scrubber</p>
        <p className={`text-xs font-semibold tabular-nums ${MUTED_TEXT}`}>
          Week <span className={INK_CLASS}>{index + 1}</span> of {WEEK_COUNT} ·{" "}
          <span className={INK_CLASS}>{periodLabelCapitalized(index)}</span>
        </p>
      </div>

      {/* Decorative trend line — aria-hidden; the native slider below is the real control and
          carries the same index via identical percentage math, so the two always agree. */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-16 w-full sm:h-20"
        preserveAspectRatio="none"
      >
        <line x1={PAD_X} y1={VIEW_H - PAD_Y} x2={VIEW_W - PAD_X} y2={VIEW_H - PAD_Y} stroke="#FFFFFF" strokeOpacity={0.08} strokeWidth={1} />
        <path d={LINE_PATH} fill="none" stroke="#2563EB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {WEEKS.map((w, i) =>
          i === index ? null : (
            <circle key={w.index} cx={xForIndex(i)} cy={yForValue(w.matchesFound)} r={2.5} fill="#6B6B78" />
          ),
        )}
        {/* vertical guide from the baseline up to the highlighted point */}
        <line x1={dotX} y1={VIEW_H - PAD_Y} x2={dotX} y2={dotY} stroke="#60A5FA" strokeOpacity={0.5} strokeWidth={1.5} strokeDasharray="3 3" />
        {/* A one-shot opacity "ping" on the week that just became current — opacity-only, so
            it stays within the transform/opacity-only motion rule, and it is re-keyed on the
            index so every new scrub position gets its own fade without a persisted opacity:0
            resting state (the ping is MEANT to end at 0; the solid dot below it never does). */}
        <motion.circle
          key={index}
          cx={dotX}
          cy={dotY}
          r={10}
          fill="none"
          stroke="#2563EB"
          strokeWidth={2}
          initial={shouldAnimate ? { opacity: 0.65 } : { opacity: 0 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <circle cx={dotX} cy={dotY} r={6} fill="#2563EB" stroke="#FFFFFF" strokeWidth={2} />
      </svg>

      {/* The real control: a native range input styled as a playhead scrub bar. */}
      <div className="flex flex-col gap-1">
        <label htmlFor={sliderId} className="sr-only">
          Scrub the last 12 weeks of marketplace activity
        </label>
        <p id={descId} className="sr-only">
          Drag, or use the arrow keys, Home and End, to move the playhead across the last 12
          weeks. The trend highlight, matches found, average payout and items sold below update
          immediately to the selected week.
        </p>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={WEEK_COUNT - 1}
          step={1}
          value={index}
          aria-describedby={descId}
          aria-valuetext={valueText}
          onChange={(e) => onChange(Number(e.target.value))}
          className={[
            "h-7 w-full cursor-pointer appearance-none bg-transparent",
            "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10",
            "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/10",
            "[&::-webkit-slider-thumb]:mt-[-11px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,0.25)]",
            "[&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,0.25)]",
            FOCUS_RING,
          ].join(" ")}
        />
        <div className={`flex items-center justify-between text-[11px] font-semibold ${MUTED_TEXT}`}>
          <span>12 weeks ago</span>
          <span>This week</span>
        </div>
      </div>

      {/* Live-updating aggregate stats — the "core proof" the drag must move in real time. */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-2">
        <StatTile label="Matches found" value={formatCount(current.matchesFound)} valueKey={`m-${index}`} shouldAnimate={shouldAnimate} />
        <StatTile label="Avg. payout" value={formatUsd(current.avgPayout)} valueKey={`p-${index}`} shouldAnimate={shouldAnimate} />
        <StatTile label="Items sold" value={formatCount(current.itemsSold)} valueKey={`s-${index}`} shouldAnimate={shouldAnimate} />
      </div>

      <div className="flex items-center gap-1 text-[11px] font-semibold">
        {matchesDelta >= 0 ? (
          <TrendingUp className={`h-3 w-3 shrink-0 ${ACCENT_TINT_TEXT}`} aria-hidden="true" />
        ) : (
          <TrendingDown className={`h-3 w-3 shrink-0 ${MUTED_TEXT}`} aria-hidden="true" />
        )}
        <span className={`tabular-nums ${INK_CLASS}`}>
          {matchesDelta >= 0 ? "+" : ""}
          {matchesDelta}%
        </span>
        <span className={`truncate font-normal ${MUTED_TEXT}`}>matches found vs. 12 weeks ago</span>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  valueKey,
  shouldAnimate,
}: {
  label: string;
  value: string;
  valueKey: string;
  shouldAnimate: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className={`${STAT_LABEL} ${MUTED_TEXT}`}>{label}</p>
      <motion.p
        key={valueKey}
        initial={shouldAnimate ? { opacity: 0, y: 4 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={`mt-0.5 truncate text-base font-extrabold tabular-nums ${INK_CLASS} sm:text-lg`}
      >
        {value}
      </motion.p>
    </div>
  );
}
