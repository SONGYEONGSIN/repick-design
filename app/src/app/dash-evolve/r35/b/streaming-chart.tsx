"use client";

import { Pause, Play, Radio } from "lucide-react";
import {
  REGION_RANGE,
  REGIONS,
  THROUGHPUT_SERIES,
  WINDOW_OPTIONS,
  formatOffset,
  formatReq,
  regionLabel,
  seriesValueAt,
  windowSlice,
  type RegionId,
} from "./data";
import { BORDER, FOCUS, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx, r2 } from "./tokens";
import { CardHead, Segmented } from "./ui";

const VIEWBOX_W = 960;
const VIEWBOX_H = 240;
const BOTTOM_PAD = 6;
const USABLE_H = VIEWBOX_H - BOTTOM_PAD - 6;

function xForIndex(i: number, count: number): number {
  if (count <= 1) return 0;
  return r2((i / (count - 1)) * VIEWBOX_W);
}

function yForValue(v: number, min: number, max: number): number {
  const range = max - min || 1;
  return r2(VIEWBOX_H - BOTTOM_PAD - ((v - min) / range) * USABLE_H);
}

export default function StreamingChart({
  region,
  onRegionChange,
  windowSeconds,
  onWindowSecondsChange,
  tick,
  isPlaying,
  onTogglePlaying,
  cursorIndex,
  onCursorIndexChange,
  prefersReducedMotion,
}: {
  region: RegionId;
  onRegionChange: (r: RegionId) => void;
  windowSeconds: number;
  onWindowSecondsChange: (s: number) => void;
  tick: number;
  isPlaying: boolean;
  onTogglePlaying: () => void;
  cursorIndex: number;
  onCursorIndexChange: (i: number) => void;
  prefersReducedMotion: boolean;
}) {
  const series = THROUGHPUT_SERIES[region];
  const { min, max } = REGION_RANGE[region];
  const values = windowSlice(series, tick, windowSeconds); // oldest -> newest
  const clampedCursorIndex = Math.min(cursorIndex, windowSeconds - 1);
  const secondsAgo = windowSeconds - 1 - clampedCursorIndex;
  const selectedValue = seriesValueAt(series, tick, secondsAgo);
  const liveValue = values[values.length - 1];

  const effectivePlaying = isPlaying && !prefersReducedMotion;

  const points = values.map((v, i) => ({ x: xForIndex(i, values.length), y: yForValue(v, min, max) }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${VIEWBOX_H} L${points[0].x},${VIEWBOX_H} Z`;

  const crossX = xForIndex(clampedCursorIndex, values.length);
  const crossY = yForValue(selectedValue, min, max);
  const liveX = points[points.length - 1].x;
  const liveY = points[points.length - 1].y;

  return (
    <div>
      <CardHead
        title="Edge request throughput"
        Icon={Radio}
        hint={`${regionLabel(region)} — rolling ${windowSeconds}s window, simulated at 1 point/second from a fixed, looping buffer. Demo data, not a live feed.`}
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Segmented ariaLabel="Region" options={REGIONS.map((r) => ({ id: r.id, label: r.label }))} value={region} onChange={onRegionChange} />
            <Segmented ariaLabel="Window length" options={WINDOW_OPTIONS} value={windowSeconds} onChange={onWindowSecondsChange} />
          </div>
        }
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
            <span className={cx("absolute h-2.5 w-2.5 rounded-full", effectivePlaying ? "bg-lime-500 motion-safe:animate-ping motion-safe:opacity-75" : "hidden")} />
            <span className={cx("h-1.5 w-1.5 rounded-full", effectivePlaying ? "bg-lime-500" : "bg-zinc-300")} />
          </span>
          <span className={cx("text-xs font-medium", effectivePlaying ? "text-lime-700" : TEXT_MUTED)}>
            {prefersReducedMotion ? "Static (reduced motion)" : effectivePlaying ? "Live" : "Paused"}
          </span>
        </div>

        <button
          type="button"
          onClick={onTogglePlaying}
          disabled={prefersReducedMotion}
          aria-pressed={effectivePlaying}
          className={cx(
            "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold",
            BORDER,
            TRANSITION,
            FOCUS,
            prefersReducedMotion ? "cursor-not-allowed text-zinc-400" : cx(TEXT_PRIMARY, "hover:bg-zinc-100"),
          )}
        >
          {effectivePlaying ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
          {effectivePlaying ? "Pause stream" : "Resume stream"}
        </button>
      </div>

      {prefersReducedMotion ? (
        <p className={cx("mt-2 text-xs font-normal leading-relaxed", TEXT_AUX)}>
          Your system prefers reduced motion, so this chart renders a settled frame and does not animate.
        </p>
      ) : null}

      <div className="mt-4">
        <div className="relative">
          <div aria-hidden="true" className={cx("pointer-events-none absolute left-1.5 top-1.5 rounded bg-white px-1 py-0.5 text-[11px] font-medium", TEXT_AUX)}>
            {formatReq(max)} req/s
          </div>
          <div aria-hidden="true" className={cx("pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-white px-1 py-0.5 text-[11px] font-medium", TEXT_AUX)}>
            {formatReq(min)} req/s
          </div>

          <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="none"
            className="h-64 w-full sm:h-80"
            role="img"
            aria-label={`${regionLabel(region)} edge request throughput over the last ${windowSeconds} seconds, currently ${formatReq(liveValue)} requests per second`}
          >
            <defs>
              <linearGradient id="r35b-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#84cc16" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <line x1={0} y1={r2(VIEWBOX_H - BOTTOM_PAD - USABLE_H / 2)} x2={VIEWBOX_W} y2={r2(VIEWBOX_H - BOTTOM_PAD - USABLE_H / 2)} stroke="#e4e4e7" strokeWidth={1} strokeDasharray="4 4" />
            <line x1={0} y1={VIEWBOX_H - BOTTOM_PAD} x2={VIEWBOX_W} y2={VIEWBOX_H - BOTTOM_PAD} stroke="#e4e4e7" strokeWidth={1} />

            <path d={areaPath} fill="url(#r35b-area-fill)" />
            <path d={linePath} fill="none" stroke="#4d7c0f" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

            {/* Crosshair: the keyboard-accessible scrubber below drives this, not hover alone. */}
            <line x1={crossX} y1={0} x2={crossX} y2={VIEWBOX_H} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="3 3" aria-hidden="true" />
            <circle cx={crossX} cy={crossY} r={4} fill="#4d7c0f" stroke="#ffffff" strokeWidth={1.5} aria-hidden="true" />

            {effectivePlaying ? <circle cx={liveX} cy={liveY} r={3.5} fill="#84cc16" className="motion-safe:animate-ping motion-safe:opacity-70" aria-hidden="true" /> : null}
            <circle cx={liveX} cy={liveY} r={3} fill={effectivePlaying ? "#84cc16" : "#a1a1aa"} stroke="#ffffff" strokeWidth={1.5} aria-hidden="true" />
          </svg>
        </div>

        <div aria-hidden="true" className={cx("pointer-events-none mt-1 flex justify-between text-[11px] font-medium", TEXT_AUX)}>
          <span>{`-${windowSeconds}s`}</span>
          <span>{`-${Math.round(windowSeconds / 2)}s`}</span>
          <span>now</span>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-4">
        <label htmlFor="r35b-scrub" className={cx("block text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
          Inspect a moment in the visible window
        </label>
        <input
          id="r35b-scrub"
          type="range"
          min={0}
          max={Math.max(0, windowSeconds - 1)}
          step={1}
          value={clampedCursorIndex}
          onChange={(e) => onCursorIndexChange(Number(e.target.value))}
          className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-lime-700"
          aria-valuetext={`${formatOffset(secondsAgo)}, ${formatReq(selectedValue)} requests per second`}
        />
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className={cx("text-xs font-medium", TEXT_MUTED)}>{formatOffset(secondsAgo)}</span>
          <span className={cx("text-lg font-semibold leading-none", NUM, TEXT_PRIMARY)}>{formatReq(selectedValue)}</span>
          <span className={cx("text-xs font-normal", TEXT_AUX)}>req/s at that moment</span>
        </p>
      </div>
    </div>
  );
}
