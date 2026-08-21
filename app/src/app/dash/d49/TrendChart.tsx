"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import type { PeriodPoint } from "./data";
import { formatCompactUSD, formatSignedUSD, formatUSD } from "./data";
import { CHART, FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { DirectionMark, r2, useElementWidth } from "./ui";

/**
 * Secondary chart: the same metric across periods, with the plan line drawn alongside the actual.
 * The two series are told apart by LINE STYLE (actual solid, plan dashed) and by their own printed
 * end labels — never by colour alone.
 *
 * The crosshair is a real slider: Arrow keys, Home and End move it, and `aria-valuetext` announces
 * the period, the actual, the plan and the gap on every move. The same figures are printed as
 * always-visible text above the plot, so nothing here depends on a pointer.
 */

const HEIGHT = 168;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;
const PAD_X = 10;

export default function TrendChart({
  series,
  caption,
  activeIndex,
  onActiveIndexChange,
}: {
  series: PeriodPoint[];
  caption: string;
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
}) {
  const { ref, width } = useElementWidth<HTMLDivElement>(760);
  const n = series.length;

  const values = series.flatMap((p) => [p.actual, p.plan]);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const yMin = lo - span * 0.16;
  const yMax = hi + span * 0.12;

  const plotBottom = HEIGHT - PAD_BOTTOM;
  const plotH = plotBottom - PAD_TOP;
  const innerW = Math.max(60, width - PAD_X * 2);

  const xFor = (i: number) => r2(PAD_X + (i / (n - 1)) * innerW);
  const yFor = (v: number) => r2(plotBottom - ((v - yMin) / (yMax - yMin)) * plotH);

  const actualPath = series.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.actual)}`).join(" ");
  const planPath = series.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.plan)}`).join(" ");
  const areaPath = `${actualPath} L${xFor(n - 1)},${plotBottom} L${xFor(0)},${plotBottom} Z`;

  const active = series[Math.min(n - 1, Math.max(0, activeIndex))];
  const gap = active.actual - active.plan;

  function indexFromClientX(clientX: number): number {
    const el = ref.current;
    if (!el) return n - 1;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left - PAD_X) / Math.max(1, rect.width - PAD_X * 2)));
    return Math.round(ratio * (n - 1));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onActiveIndexChange(Math.max(0, activeIndex - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onActiveIndexChange(Math.min(n - 1, activeIndex + 1));
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
      {/* Always-visible readout — the chart never depends on hover to be legible. */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{active.full}</p>
          <p className={cx("mt-0.5 flex items-baseline gap-2 text-xl font-semibold", NUM, TEXT_PRIMARY)}>
            {formatUSD(active.actual)}
            <span className={cx("text-xs font-normal", TEXT_AUX)}>actual</span>
          </p>
        </div>
        <dl className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <div>
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Plan</dt>
            <dd className={cx("mt-0.5 text-sm font-medium", NUM, TEXT_SECONDARY)}>{formatUSD(active.plan)}</dd>
          </div>
          <div>
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Actual vs plan</dt>
            <dd className={cx("mt-0.5 flex items-center gap-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>
              <DirectionMark amount={gap} size={12} />
              {formatSignedUSD(gap)}
            </dd>
          </div>
        </dl>
      </div>

      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="Spend by period — move the crosshair with the arrow keys"
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={activeIndex}
        aria-valuetext={`${active.full}: actual ${formatUSD(active.actual)}, plan ${formatUSD(active.plan)}, ${gap < 0 ? "under" : "over"} plan by ${formatUSD(Math.abs(gap))}`}
        onPointerMove={(e: PointerEvent<HTMLDivElement>) => onActiveIndexChange(indexFromClientX(e.clientX))}
        onKeyDown={onKeyDown}
        className={cx("relative mt-3 w-full cursor-crosshair rounded-lg", FOCUS)}
        style={{ height: `${HEIGHT}px` }}
      >
        <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="block h-full w-full" aria-hidden="true">
          <line x1={PAD_X} y1={plotBottom} x2={r2(PAD_X + innerW)} y2={plotBottom} stroke={CHART.axis} strokeWidth="1" />
          <path d={areaPath} fill={CHART.decrease} fillOpacity="0.15" stroke="none" />
          <path d={planPath} fill="none" stroke={CHART.plan} strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round" />
          <path d={actualPath} fill="none" stroke={CHART.decrease} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <line x1={xFor(activeIndex)} y1={PAD_TOP - 8} x2={xFor(activeIndex)} y2={plotBottom} stroke={CHART.labelStrong} strokeWidth="1" strokeDasharray="2 3" />
          <circle cx={xFor(activeIndex)} cy={yFor(active.plan)} r="3" fill={CHART.axis} stroke={CHART.plan} strokeWidth="1.5" />
          <circle cx={xFor(activeIndex)} cy={yFor(active.actual)} r="4" fill={CHART.decrease} stroke="#18181b" strokeWidth="1.5" />
          {series.map((p, i) => (
            <text key={p.key} x={xFor(i)} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill={i === activeIndex ? CHART.labelStrong : CHART.label}>
              {p.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_SECONDARY)}>
          <span aria-hidden="true" className="inline-block h-0.5 w-6 rounded-full" style={{ backgroundColor: CHART.decrease }} />
          Actual (solid)
        </span>
        <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_SECONDARY)}>
          <span
            aria-hidden="true"
            className="inline-block h-0.5 w-6"
            style={{ backgroundImage: `repeating-linear-gradient(to right, ${CHART.plan} 0 5px, transparent 5px 9px)` }}
          />
          Plan (dashed)
        </span>
        <span className={cx("text-[11px] font-normal", TEXT_AUX)}>{`${caption} · axis ${formatCompactUSD(yMin)}–${formatCompactUSD(yMax)}`}</span>
      </div>

      {/* The visually-hidden data table is wrapped in the sr-only BOX rather than wearing the
          sr-only class itself: a <table> cannot shrink below its min-content width and ignores
          `overflow:hidden`, so `sr-only` on the table leaks ~370px into document.scrollWidth and
          blows the 390px overflow sweep while looking perfect on screen. The wrapper clips it. */}
      <div className="sr-only">
        <table>
          <caption className="font-normal">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className="font-medium">
                Period
              </th>
              <th scope="col" className="font-medium">
                Actual
              </th>
              <th scope="col" className="font-medium">
                Plan
              </th>
            </tr>
          </thead>
          <tbody>
            {series.map((p) => (
              <tr key={p.key}>
                <th scope="row" className="font-normal">
                  {p.full}
                </th>
                <td className="font-normal">{formatUSD(p.actual)}</td>
                <td className="font-normal">{formatUSD(p.plan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
