"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import type { ChartPoint } from "./data";
import { formatPct, formatSignedPts } from "./data";
import { CHART, FOCUS, NUM, TEXT_AUX, TEXT_AUX_MUTED, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { TrendMark, r2, useElementWidth } from "./ui";

/**
 * The hero's supporting chart: daily SLA compliance across the selected window, a constant
 * dashed target line, and a real crosshair — arrow keys / Home / End move it, pointer move
 * tracks it, and `aria-valuetext` announces the date, the rate and the gap to target on every
 * move. The same figures are always printed above the plot as text, so nothing here depends on
 * a pointer ever touching the chart.
 */

const HEIGHT = 176;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;
const PAD_X = 8;

export default function ComplianceChart({
  points,
  target,
  activeIndex,
  onActiveIndexChange,
  queueLabel,
}: {
  points: ChartPoint[];
  target: number;
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  queueLabel: string;
}) {
  const { ref, width } = useElementWidth<HTMLDivElement>(680);
  const n = points.length;
  const clampedIndex = Math.min(n - 1, Math.max(0, activeIndex));

  const values = points.map((p) => p.rate);
  const lo = Math.min(...values, target);
  const hi = Math.max(...values, target);
  const span = hi - lo || 1;
  const yMin = lo - span * 0.18 - 0.4;
  const yMax = hi + span * 0.16 + 0.4;

  const plotBottom = HEIGHT - PAD_BOTTOM;
  const plotH = plotBottom - PAD_TOP;
  const innerW = Math.max(60, width - PAD_X * 2);

  const xFor = (i: number) => r2(n <= 1 ? PAD_X + innerW / 2 : PAD_X + (i / (n - 1)) * innerW);
  const yFor = (v: number) => r2(plotBottom - ((v - yMin) / (yMax - yMin)) * plotH);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.rate)}`).join(" ");
  const areaPath = `${linePath} L${xFor(n - 1)},${plotBottom} L${xFor(0)},${plotBottom} Z`;
  const targetY = yFor(target);

  const active = points[clampedIndex];
  const gap = active.rate - target;

  // Roughly one label per 10% of the plotted width so long windows (90D) do not overlap.
  const labelEvery = Math.max(1, Math.ceil(n / 9));

  function indexFromClientX(clientX: number): number {
    const el = ref.current;
    if (!el || n <= 1) return 0;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left - PAD_X) / Math.max(1, rect.width - PAD_X * 2)));
    return Math.round(ratio * (n - 1));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onActiveIndexChange(Math.max(0, clampedIndex - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onActiveIndexChange(Math.min(n - 1, clampedIndex + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      onActiveIndexChange(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onActiveIndexChange(n - 1);
    }
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{active.full}</p>
          <p className={cx("mt-0.5 flex items-baseline gap-2 text-xl font-semibold", NUM, TEXT_PRIMARY)}>
            {formatPct(active.rate)}
            <span className={cx("text-xs font-normal", TEXT_AUX)}>compliance</span>
          </p>
        </div>
        <div className="text-right">
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>vs target</p>
          <p className={cx("mt-0.5 flex items-center justify-end gap-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>
            <TrendMark pts={gap} size={12} />
            {formatSignedPts(gap)}
          </p>
        </div>
      </div>

      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={`${queueLabel} compliance by day — move the crosshair with the arrow keys`}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={clampedIndex}
        aria-valuetext={`${active.full}: ${formatPct(active.rate)} compliance, ${gap < 0 ? "under" : "at or above"} the ${formatPct(target)} target`}
        onPointerMove={(e: PointerEvent<HTMLDivElement>) => onActiveIndexChange(indexFromClientX(e.clientX))}
        onKeyDown={onKeyDown}
        className={cx("relative mt-3 w-full cursor-crosshair rounded-lg", FOCUS)}
        style={{ height: `${HEIGHT}px` }}
      >
        <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="block h-full w-full" aria-hidden="true">
          <line x1={PAD_X} y1={plotBottom} x2={r2(PAD_X + innerW)} y2={plotBottom} stroke={CHART.axis} strokeWidth="1" />
          <line x1={PAD_X} y1={targetY} x2={r2(PAD_X + innerW)} y2={targetY} stroke={CHART.target} strokeWidth="1.25" strokeDasharray="4 4" />
          <path d={areaPath} fill={CHART.area} fillOpacity="0.08" stroke="none" />
          <path d={linePath} fill="none" stroke={CHART.line} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <line x1={xFor(clampedIndex)} y1={PAD_TOP - 8} x2={xFor(clampedIndex)} y2={plotBottom} stroke={CHART.labelStrong} strokeWidth="1" strokeDasharray="2 3" />
          <circle cx={xFor(clampedIndex)} cy={yFor(active.rate)} r="4" fill={CHART.line} stroke="#ffffff" strokeWidth="1.5" />
          {points.map((p, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text key={p.key} x={xFor(i)} y={HEIGHT - 7} textAnchor="middle" fontSize="10" fill={i === clampedIndex ? CHART.labelStrong : CHART.label}>
                {p.short}
              </text>
            ) : null,
          )}
        </svg>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_SECONDARY)}>
          <span aria-hidden="true" className="inline-block h-0.5 w-6 rounded-full" style={{ backgroundColor: CHART.line }} />
          Compliance rate
        </span>
        <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_SECONDARY)}>
          <span aria-hidden="true" className="inline-block h-0.5 w-6" style={{ backgroundImage: `repeating-linear-gradient(to right, ${CHART.target} 0 4px, transparent 4px 8px)` }} />
          {`Target (${formatPct(target)})`}
        </span>
        <span className={cx("text-[11px] font-normal", TEXT_AUX_MUTED)}>{`${n} days shown`}</span>
      </div>

      {/* The visually-hidden fallback table is wrapped in an sr-only BOX rather than wearing the
          sr-only class itself: a <table> cannot shrink below its min-content width, so `sr-only`
          on the table leaks width into document.scrollWidth and can blow the 390px overflow
          sweep while looking perfect on screen. The wrapper clips it, and `relative` keeps its
          containing block from escaping this scroll-safe ancestor. */}
      <div className="relative sr-only">
        <table>
          <caption className="font-normal">{`${queueLabel} daily SLA compliance against target`}</caption>
          <thead>
            <tr>
              <th scope="col" className="font-medium">
                Day
              </th>
              <th scope="col" className="font-medium">
                Compliance
              </th>
              <th scope="col" className="font-medium">
                Target
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.key}>
                <th scope="row" className="font-normal">
                  {p.full}
                </th>
                <td className="font-normal">{formatPct(p.rate)}</td>
                <td className="font-normal">{formatPct(target)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
