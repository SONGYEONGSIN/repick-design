"use client";

import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { useMemo, useRef, useState } from "react";
import {
  REGION_META,
  REGION_ORDER,
  REVENUE,
  WEEK_LABELS,
  formatUsd,
  round2,
  windowSlice,
  type ChartWindow,
  type RegionId,
} from "./data";
import { BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { SegmentedControl } from "./ui";

const VB_W = 880;
const VB_H = 240;
const PAD_L = 6;
const PAD_R = 6;
const PAD_T = 14;
const PAD_B = 26;

const WINDOW_OPTIONS: { id: ChartWindow; label: string }[] = [
  { id: "recent", label: "6주" },
  { id: "full", label: "12주" },
];

export default function RevenueChart({
  window: win,
  onWindowChange,
  focusRegion,
  onToggleFocusRegion,
  pulseRegion,
}: {
  window: ChartWindow;
  onWindowChange: (w: ChartWindow) => void;
  focusRegion: RegionId | null;
  onToggleFocusRegion: (r: RegionId) => void;
  pulseRegion: RegionId | null;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const labels = windowSlice(WEEK_LABELS, win);
  const seriesByRegion = useMemo(
    () => Object.fromEntries(REGION_ORDER.map((r) => [r, windowSlice(REVENUE[r], win)])) as Record<RegionId, number[]>,
    [win],
  );
  const n = labels.length;
  const [activeIndex, setActiveIndex] = useState(n - 1);
  const clampedIndex = Math.min(activeIndex, n - 1);

  const allValues = REGION_ORDER.flatMap((r) => seriesByRegion[r]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = Math.max(max - min, 1);
  const domainMin = min - span * 0.08;
  const domainMax = max + span * 0.08;

  const xStep = (VB_W - PAD_L - PAD_R) / Math.max(n - 1, 1);
  function xAt(i: number): number {
    return round2(PAD_L + i * xStep);
  }
  function yAt(v: number): number {
    const t = (v - domainMin) / (domainMax - domainMin);
    return round2(VB_H - PAD_B - t * (VB_H - PAD_T - PAD_B));
  }

  const paths = useMemo(() => {
    return REGION_ORDER.map((r) => {
      const series = seriesByRegion[r];
      const d = series.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`).join(" ");
      return { region: r, d };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesByRegion, domainMin, domainMax]);

  function moveTo(i: number) {
    setActiveIndex(Math.min(n - 1, Math.max(0, i)));
  }

  function onMouseMove(e: ReactMouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const frac = (e.clientX - rect.left) / rect.width;
    const vbX = frac * VB_W;
    const idx = Math.round((vbX - PAD_L) / xStep);
    moveTo(idx);
  }

  function onKeyDown(e: ReactKeyboardEvent<SVGSVGElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveTo(clampedIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveTo(clampedIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      moveTo(n - 1);
    }
  }

  const tooltipLeftPct = round2((xAt(clampedIndex) / VB_W) * 100);
  const tooltipAlignRight = tooltipLeftPct > 62;

  const liveSummary = `${labels[clampedIndex]} 기준 ${REGION_ORDER.map(
    (r) => `${REGION_META[r].label} ${formatUsd(seriesByRegion[r][clampedIndex])}`,
  ).join(", ")}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>리전별 매출 추이</h2>
          <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
            차트에 초점을 맞추고 방향키로 이동하면 시점별 값을 읽을 수 있습니다
          </p>
        </div>
        <SegmentedControl ariaLabel="차트 기간" options={WINDOW_OPTIONS} value={win} onChange={onWindowChange} size="sm" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5" role="group" aria-label="리전 강조 필터">
        {REGION_ORDER.map((r) => {
          const meta = REGION_META[r];
          const isFocused = focusRegion === r;
          const isDimmed = focusRegion !== null && !isFocused;
          return (
            <button
              key={r}
              type="button"
              onClick={() => onToggleFocusRegion(r)}
              aria-pressed={isFocused}
              className={cx(
                "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium",
                TRANSITION,
                FOCUS_RING,
                isDimmed ? TEXT_CAPTION : TEXT_PRIMARY,
                "hover:bg-zinc-100 dark:hover:bg-white/5",
              )}
            >
              <span aria-hidden="true" className={cx("h-2 w-2 shrink-0 rounded-full", meta.dot, isDimmed && "opacity-40")} />
              {meta.label}
              {pulseRegion === r ? <span className={cx("text-[10px]", TEXT_CAPTION)}>· 선택됨</span> : null}
            </button>
          );
        })}
      </div>

      <div className="relative mt-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-56 w-full touch-none select-none"
          preserveAspectRatio="none"
          role="img"
          aria-label={`리전별 주간 매출 라인 차트. ${liveSummary}`}
          tabIndex={0}
          onMouseMove={onMouseMove}
          onKeyDown={onKeyDown}
          onFocus={() => moveTo(n - 1)}
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD_L}
              x2={VB_W - PAD_R}
              y1={round2(PAD_T + f * (VB_H - PAD_T - PAD_B))}
              y2={round2(PAD_T + f * (VB_H - PAD_T - PAD_B))}
              className="stroke-zinc-100 dark:stroke-white/[0.06]"
              strokeWidth={1}
            />
          ))}
          <line
            x1={PAD_L}
            x2={VB_W - PAD_R}
            y1={VB_H - PAD_B}
            y2={VB_H - PAD_B}
            className="stroke-zinc-200 dark:stroke-white/10"
            strokeWidth={1}
          />

          <line
            x1={xAt(clampedIndex)}
            x2={xAt(clampedIndex)}
            y1={PAD_T}
            y2={VB_H - PAD_B}
            className="stroke-zinc-300 dark:stroke-white/20 motion-reduce:transition-none"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {paths.map(({ region, d }) => {
            const meta = REGION_META[region];
            const isDimmed = focusRegion !== null && focusRegion !== region;
            return (
              <path
                key={region}
                d={d}
                fill="none"
                className={cx(meta.stroke, TRANSITION)}
                strokeWidth={region === pulseRegion ? 3 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isDimmed ? 0.25 : 1}
              />
            );
          })}

          {REGION_ORDER.map((r) => {
            const meta = REGION_META[r];
            const v = seriesByRegion[r][clampedIndex];
            const isDimmed = focusRegion !== null && focusRegion !== r;
            return (
              <circle
                key={r}
                cx={xAt(clampedIndex)}
                cy={yAt(v)}
                r={r === pulseRegion ? 4.6 : 3.4}
                className={cx(meta.fill, "stroke-white dark:stroke-zinc-900", TRANSITION)}
                strokeWidth={1.5}
                opacity={isDimmed ? 0.35 : 1}
              />
            );
          })}

          {labels.map((label, i) =>
            i === 0 || i === n - 1 || i === clampedIndex ? (
              <text
                key={label}
                x={xAt(i)}
                y={VB_H - 8}
                textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                className={cx("fill-zinc-500 dark:fill-zinc-400 text-[11px]", NUM)}
              >
                {label}
              </text>
            ) : null,
          )}
        </svg>

        <div
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute top-0 w-44 -translate-y-1 rounded-lg border p-2.5 text-xs shadow-lg",
            BORDER,
            "bg-white dark:bg-zinc-900",
          )}
          style={{
            left: tooltipAlignRight ? undefined : `${tooltipLeftPct}%`,
            right: tooltipAlignRight ? `${100 - tooltipLeftPct}%` : undefined,
            transform: tooltipAlignRight ? "translateX(-8px)" : "translateX(8px)",
          }}
        >
          <p className={cx("font-semibold", TEXT_PRIMARY, NUM)}>{labels[clampedIndex]}</p>
          <ul className="mt-1 space-y-1">
            {REGION_ORDER.map((r) => {
              const meta = REGION_META[r];
              const v = seriesByRegion[r][clampedIndex];
              return (
                <li key={r} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                    <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", meta.dot)} />
                    {meta.label}
                  </span>
                  <span className={cx("font-semibold", TEXT_PRIMARY, NUM)}>{formatUsd(v)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {liveSummary}
      </p>
    </div>
  );
}
