"use client";

import type { MouseEvent } from "react";
import { useMemo, useRef, useState } from "react";
import type { Experiment, SeriesPoint } from "./data";
import { currentCi, currentLift, formatDate, formatLift, round2, significanceState } from "./data";
import { ACCENT_TEXT, BORDER, FOCUS_VISIBLE, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { CardHeader, EyebrowLabel, SegmentedControl, SignificanceBadge, ToggleSwitch } from "./ui";

export type ChartPeriod = "recent" | "full";
export const CHART_PERIODS: { id: ChartPeriod; label: string }[] = [
  { id: "recent", label: "Last 14 days" },
  { id: "full", label: "Full history" },
];

const VB_W = 780;
const VB_H = 260;
const PAD_LEFT = 34;
const PAD_RIGHT = 14;
const PAD_TOP = 16;
const PAD_BOTTOM = 26;
const Y_MIN = -9;
const Y_MAX = 14;
const GRID_VALUES = [-8, -4, 0, 4, 8, 12];

type PlottedPoint = SeriesPoint & { x: number; yLift: number; yLow: number; yHigh: number };

function yToPx(v: number, plotTop: number, plotH: number): number {
  return round2(plotTop + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * plotH);
}

export default function ForecastChart({
  experiment,
  period,
  onPeriodChange,
  showForecast,
  onShowForecastChange,
}: {
  experiment: Experiment;
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
  showForecast: boolean;
  onShowForecastChange: (v: boolean) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const isRunning = experiment.status === "running";
  const forecastVisible = showForecast && isRunning;

  const historyShown = useMemo(() => {
    const full = experiment.series.history;
    if (period === "full") return full;
    return full.slice(-Math.min(14, full.length));
  }, [experiment, period]);

  const forecastShown = forecastVisible ? experiment.series.forecast : [];

  const plotW = VB_W - PAD_LEFT - PAD_RIGHT;
  const plotH = VB_H - PAD_TOP - PAD_BOTTOM;
  const plotTop = PAD_TOP;

  const combined: SeriesPoint[] = [...historyShown, ...forecastShown];
  const n = combined.length;

  const points: PlottedPoint[] = combined.map((p, i) => {
    const x = round2(PAD_LEFT + (n > 1 ? (i * plotW) / (n - 1) : plotW / 2));
    return { ...p, x, yLift: yToPx(p.lift, plotTop, plotH), yLow: yToPx(p.ciLow, plotTop, plotH), yHigh: yToPx(p.ciHigh, plotTop, plotH) };
  });

  const historyPts = points.slice(0, historyShown.length);
  const forecastPts = points.slice(historyShown.length - 1); // include the join point for a seamless line

  function linePath(pts: PlottedPoint[]): string {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.yLift}`).join(" ");
  }
  function bandPath(pts: PlottedPoint[]): string {
    if (pts.length === 0) return "";
    const top = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.yHigh}`).join(" ");
    const bottom = [...pts].reverse().map((p) => `L ${p.x},${p.yLow}`).join(" ");
    return `${top} ${bottom} Z`;
  }

  const active = activeIndex != null ? points[activeIndex] : null;
  const lift = currentLift(experiment);
  const ci = currentCi(experiment);
  const sig = significanceState(ci.ciLow, ci.ciHigh);
  const lastPoint = points[points.length - 1];

  function moveTo(i: number) {
    setActiveIndex(Math.max(0, Math.min(n - 1, i)));
  }

  function handlePointerMove(e: MouseEvent<HTMLDivElement>) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const relX = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(relX * (n - 1));
    moveTo(idx);
  }

  const tooltipSide = active ? (active.x / VB_W > 0.72 ? "right" : active.x / VB_W < 0.15 ? "left" : "center") : "center";

  return (
    <div>
      <CardHeader
        title="Lift forecast vs. control"
        description={`${experiment.metricLabel} · ${experiment.name}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {isRunning ? (
              <ToggleSwitch id="forecast-toggle" checked={showForecast} onChange={onShowForecastChange} label="Show forecast" />
            ) : (
              <span className={cx("text-xs font-medium", TEXT_CAPTION)}>Concluded — forecast unavailable</span>
            )}
            <SegmentedControl options={CHART_PERIODS} value={period} onChange={onPeriodChange} ariaLabel="Chart history window" />
          </div>
        }
      />

      <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <EyebrowLabel>Current lift</EyebrowLabel>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className={cx("text-3xl font-semibold", NUM, sig === "significant-negative" ? "text-rose-400" : TEXT_PRIMARY)}>{formatLift(lift)}</span>
            <SignificanceBadge state={sig} />
          </div>
        </div>
        <div>
          <EyebrowLabel>95% confidence interval</EyebrowLabel>
          <p className={cx("mt-0.5 text-sm", NUM, TEXT_CAPTION)}>
            {formatLift(ci.ciLow)} to {formatLift(ci.ciHigh)}
          </p>
        </div>
      </div>

      <div ref={wrapRef} className="relative mt-4" onMouseMove={handlePointerMove} onMouseLeave={() => setActiveIndex(null)}>
        <div
          role="group"
          tabIndex={0}
          aria-label={`Lift trend chart, ${points.length} data points. Use left and right arrow keys to inspect a point. Currently ${formatLift(lift)} lift, ${sig === "not-yet" ? "not yet significant" : "significant"}.`}
          onFocus={() => moveTo(historyPts.length - 1)}
          onBlur={() => setActiveIndex(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              moveTo((activeIndex ?? historyPts.length - 1) + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              moveTo((activeIndex ?? historyPts.length - 1) - 1);
            } else if (e.key === "Home") {
              e.preventDefault();
              moveTo(0);
            } else if (e.key === "End") {
              e.preventDefault();
              moveTo(n - 1);
            }
          }}
          className={cx("rounded-lg", FOCUS_VISIBLE)}
        >
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="h-56 w-full sm:h-64" role="img" aria-hidden="true">
            {GRID_VALUES.map((v) => {
              const y = yToPx(v, plotTop, plotH);
              return <line key={v} x1={PAD_LEFT} y1={y} x2={VB_W - PAD_RIGHT} y2={y} className={v === 0 ? "stroke-zinc-600" : "stroke-white/5"} strokeWidth={1} strokeDasharray={v === 0 ? "4 3" : undefined} />;
            })}
            {GRID_VALUES.map((v) => (
              <text key={`lbl-${v}`} x={PAD_LEFT - 6} y={round2(yToPx(v, plotTop, plotH) + 3)} textAnchor="end" className="fill-zinc-500 text-[9px]" style={{ fontFeatureSettings: "'tnum'" }}>
                {v}
              </text>
            ))}

            {forecastPts.length > 1 ? (
              <line x1={forecastPts[0].x} y1={PAD_TOP} x2={forecastPts[0].x} y2={round2(PAD_TOP + plotH)} className="stroke-white/15" strokeWidth={1} strokeDasharray="2 3" />
            ) : null}

            <path d={bandPath(historyPts)} className="fill-cyan-400/12" />
            {forecastPts.length > 1 ? <path d={bandPath(forecastPts)} className="fill-cyan-400/7" /> : null}

            <path d={linePath(historyPts)} fill="none" className="stroke-cyan-400" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {forecastPts.length > 1 ? <path d={linePath(forecastPts)} fill="none" className="stroke-cyan-400" strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" /> : null}

            {active ? <line x1={active.x} y1={PAD_TOP} x2={active.x} y2={PAD_TOP + plotH} className="stroke-zinc-200/70" strokeWidth={1} /> : null}
            {active ? <circle cx={active.x} cy={active.yLift} r={3.5} className="fill-zinc-50" /> : null}

            <text x={round2(lastPoint.x - 6)} y={round2(lastPoint.yLift - 10)} textAnchor="end" className="fill-zinc-50 text-[12px] font-semibold" style={{ fontFeatureSettings: "'tnum'" }}>
              {formatLift(lastPoint.lift)}
            </text>
          </svg>
        </div>

        {active ? (
          <div
            className={cx(
              "pointer-events-none absolute top-0 w-44 -translate-y-full rounded-lg border px-2.5 py-2 text-xs shadow-lg",
              BORDER,
              "bg-zinc-950",
              tooltipSide === "right" ? "right-0" : tooltipSide === "left" ? "left-0" : "-translate-x-1/2",
            )}
            style={tooltipSide === "center" ? { left: `${round2((active.x / VB_W) * 100)}%` } : undefined}
          >
            <p className={cx("font-semibold", TEXT_PRIMARY)}>{formatDate(active.dateMs)}</p>
            <p className={cx("mt-0.5", TEXT_CAPTION)}>{active.kind === "forecast" ? "Forecast" : "Actual"}</p>
            <p className={cx("mt-1", NUM, TEXT_PRIMARY)}>{formatLift(active.lift)} lift</p>
            <p className={cx(NUM, TEXT_CAPTION)}>
              CI {formatLift(active.ciLow)} to {formatLift(active.ciHigh)}
            </p>
          </div>
        ) : null}

        <p aria-live="polite" className="sr-only">
          {active ? `${formatDate(active.dateMs)}: ${formatLift(active.lift)} lift, ${active.kind}, confidence interval ${formatLift(active.ciLow)} to ${formatLift(active.ciHigh)}` : ""}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <span className={cx("flex items-center gap-1.5 text-xs", TEXT_CAPTION)}>
          <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden="true">
            <line x1="1" y1="4" x2="17" y2="4" className="stroke-cyan-400" strokeWidth={2} strokeLinecap="round" />
          </svg>
          Actual
        </span>
        <span className={cx("flex items-center gap-1.5 text-xs", TEXT_CAPTION)}>
          <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden="true">
            <line x1="1" y1="4" x2="17" y2="4" className="stroke-cyan-400" strokeWidth={2} strokeDasharray="4 3" strokeLinecap="round" />
          </svg>
          Forecast
        </span>
        <span className={cx("flex items-center gap-1.5 text-xs", TEXT_CAPTION)}>
          <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true">
            <rect x="1" y="2" width="12" height="6" className="fill-cyan-400/20" />
          </svg>
          95% confidence band
        </span>
        <span className={cx("text-xs", ACCENT_TEXT)}>Hover or focus the chart, then use ← →</span>
      </div>
    </div>
  );
}
