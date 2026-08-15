"use client";

import { useRef, useState } from "react";
import type { AccountId, PeriodId } from "./data";
import { formatDate, formatMinutes, PERIODS, seriesForPeriod, seriesStats, weeklySeriesFor } from "./data";
import { BORDER, FOCUS_VISIBLE, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { SegmentedControl, TrendPill } from "./ui";

const VB_W = 640;
const VB_H = 220;
const PAD_X = 10;
const PAD_TOP = 26;
const PAD_BOTTOM = 22;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Dominant visualization: account SLA-compliance & first-response trend, an area/line chart from
 * charts.catalog's "Trend Over Time" row. Key values are always-visible text (headline avg stats
 * above the chart, plus a permanent value label on the latest point) — hover/focus only adds the
 * per-week crosshair readout, it is never required to read the current state. Keyboard-accessible:
 * every data point is a real, individually focusable, ≥24×24px button; Tab moves through them in
 * order and ArrowLeft/ArrowRight jump directly between them.
 */
export default function SlaTrendChart({ accountId, period, onPeriodChange }: { accountId: AccountId; period: PeriodId; onPeriodChange: (p: PeriodId) => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const fullSeries = weeklySeriesFor(accountId);
  const points = seriesForPeriod(accountId, period);
  const stats = seriesStats(points, fullSeries);

  const n = points.length;
  const plotW = VB_W - PAD_X * 2;
  const plotH = VB_H - PAD_TOP - PAD_BOTTOM;

  const coords = points.map((p, i) => {
    const x = round2(PAD_X + (n > 1 ? (i * plotW) / (n - 1) : plotW / 2));
    const y = round2(PAD_TOP + (1 - Math.min(100, Math.max(0, p.compliancePct)) / 100) * plotH);
    return { x, y, point: p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x},${c.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x},${PAD_TOP + plotH} L ${coords[0].x},${PAD_TOP + plotH} Z`;

  const baselineY = round2(PAD_TOP + plotH);
  const active = activeIndex != null ? coords[activeIndex] : null;
  const last = coords[coords.length - 1];

  function focusIndex(i: number) {
    const clamped = Math.max(0, Math.min(n - 1, i));
    btnRefs.current[clamped]?.focus();
    setActiveIndex(clamped);
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>SLA compliance</p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className={cx("text-2xl font-semibold", NUM, TEXT_PRIMARY)}>{stats.avgCompliance}%</span>
              <TrendPill good={stats.complianceDelta.good} direction={stats.complianceDelta.direction} label={stats.complianceDelta.label} />
            </div>
          </div>
          <div>
            <p className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Avg. first response</p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className={cx("text-2xl font-semibold", NUM, TEXT_PRIMARY)}>{formatMinutes(stats.avgResponse)}</span>
              <TrendPill good={stats.responseDelta.good} direction={stats.responseDelta.direction} label={stats.responseDelta.label} />
            </div>
          </div>
        </div>
        <SegmentedControl options={PERIODS.map((p) => ({ id: p.id, label: p.label }))} value={period} onChange={onPeriodChange} ariaLabel="Chart period" />
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="h-48 w-full sm:h-56"
          role="img"
          aria-label={`SLA compliance and first-response trend over ${PERIODS.find((p) => p.id === period)?.label.toLowerCase()}, currently averaging ${stats.avgCompliance} percent compliance`}
        >
          <line x1={PAD_X} y1={baselineY} x2={VB_W - PAD_X} y2={baselineY} className="stroke-zinc-200" strokeWidth={1} />
          <line x1={PAD_X} y1={PAD_TOP} x2={VB_W - PAD_X} y2={PAD_TOP} className="stroke-zinc-100" strokeWidth={1} />

          {active ? <line x1={active.x} y1={PAD_TOP} x2={active.x} y2={baselineY} className="stroke-teal-300" strokeWidth={1} strokeDasharray="3 3" /> : null}

          <path d={areaPath} className="fill-teal-500/10" />
          <path d={linePath} fill="none" className="stroke-teal-600" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {coords.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={active === c ? 4 : 2.5} className={active === c ? "fill-teal-700" : "fill-teal-500"} />
          ))}

          <text x={round2(last.x - 4)} y={round2(last.y - 10)} textAnchor="end" className="fill-zinc-900 text-[13px] font-semibold" style={{ fontFeatureSettings: "'tnum'" }}>
            {last.point.compliancePct}%
          </text>
        </svg>

        {coords.map((c, i) => (
          <button
            key={i}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                focusIndex(i + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                focusIndex(i - 1);
              }
            }}
            aria-label={`Week of ${formatDate(c.point.weekStartMs)}: ${c.point.compliancePct}% SLA compliance, ${formatMinutes(c.point.responseMin)} average first response`}
            className={cx("absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full", FOCUS_VISIBLE)}
            style={{ left: `${round2((c.x / VB_W) * 100)}%`, top: `${round2((c.y / VB_H) * 100)}%` }}
          />
        ))}

        {active ? (
          <div
            className={cx("pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full rounded-lg border px-2.5 py-1.5 text-xs shadow-md", BORDER, "bg-white")}
            style={{ left: `${round2((active.x / VB_W) * 100)}%` }}
          >
            <p className={cx("font-semibold", TEXT_PRIMARY)}>{formatDate(active.point.weekStartMs)}</p>
            <p className={TEXT_CAPTION}>
              <span className={NUM}>{active.point.compliancePct}%</span> compliance &middot; <span className={NUM}>{formatMinutes(active.point.responseMin)}</span> response
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
