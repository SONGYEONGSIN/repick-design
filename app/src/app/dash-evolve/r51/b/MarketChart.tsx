"use client";

import { useRef, useState } from "react";
import { ArrowUp, ArrowDown, TableProperties } from "lucide-react";
import { MARKET_SERIES, PERIOD_AXIS, PERIOD_POINTS, PERIODS, TARGET_CPM, CURRENCY, round2, type Period } from "./data";
import { Card, SegmentedControl, FOCUS_RING } from "./ui";

const VB_W = 1000;
const VB_H = 280;
const PAD_L = 52;
const PAD_R = 8;
const PAD_T = 16;
const PAD_B = 26;
const PLOT_W = VB_W - PAD_L - PAD_R;
const PLOT_H = VB_H - PAD_T - PAD_B;

function pickTicks(pts: number, maxTicks: number): number[] {
  if (pts <= maxTicks) return Array.from({ length: pts }, (_, i) => i);
  const out: number[] = [];
  for (let k = 0; k < maxTicks; k++) out.push(Math.round((k * (pts - 1)) / (maxTicks - 1)));
  return Array.from(new Set(out));
}

/** The center pane's single dominant visualization: the market-wide CPM index against the
 *  contracted target floor. Hover/focus here drives a purely ephemeral inspector — it is local
 *  `useState` that nothing else on the page reads, and it never reaches the watchlist selection
 *  or the detail pane (that is a wholly separate mechanism, see page.tsx). */
export function MarketChart({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const series = MARKET_SERIES[period];
  const labels = PERIOD_AXIS[period];
  const pts = PERIOD_POINTS[period];

  const high = round2(Math.max(...series));
  const low = round2(Math.min(...series));
  const current = series[series.length - 1];
  const vsTarget = round2(((current - TARGET_CPM) / TARGET_CPM) * 100);
  const aboveTarget = vsTarget >= 0;

  const min = Math.min(...series, TARGET_CPM) * 0.92;
  const max = Math.max(...series, TARGET_CPM) * 1.08;
  const range = max - min || 1;

  function xAt(i: number) {
    return PAD_L + (pts > 1 ? i / (pts - 1) : 0) * PLOT_W;
  }
  function yAt(v: number) {
    return PAD_T + (1 - (v - min) / range) * PLOT_H;
  }

  const linePoints = series.map((v, i) => `${xAt(i).toFixed(2)},${yAt(v).toFixed(2)}`).join(" ");
  const targetY = yAt(TARGET_CPM);
  const xTicks = pickTicks(pts, pts <= 7 ? pts : 6);
  const yTicks = [0, 0.33, 0.66, 1].map((f) => round2(min + f * (max - min)));

  function indexFromClientX(clientX: number): number {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return pts - 1;
    const vbX = ((clientX - rect.left) / rect.width) * VB_W;
    const frac = (vbX - PAD_L) / PLOT_W;
    return Math.max(0, Math.min(pts - 1, Math.round(frac * (pts - 1))));
  }

  const hoverPct = hoverIndex === null ? null : pts > 1 ? hoverIndex / (pts - 1) : 0;

  return (
    <Card as="section" aria-labelledby="market-chart-title" className="flex flex-shrink-0 flex-col">
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5">
        <h2 id="market-chart-title" className="text-sm font-semibold text-zinc-900">
          Market overview
        </h2>
        <SegmentedControl ariaLabel="Chart period" value={period} onChange={onPeriodChange} options={PERIODS.map((p) => ({ value: p, label: p }))} />
      </div>

      {/* Legend — the proof row. These four values are always visible, derived from the full
          series, and never depend on hover/focus state. */}
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-200 px-4 py-3 sm:grid-cols-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">
            <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true" className="flex-shrink-0 text-sky-600">
              <line x1="0" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" />
            </svg>
            Market avg CPM
          </div>
          <p className="mt-0.5 tabular-nums text-lg font-semibold text-zinc-900">{CURRENCY.format(current)}</p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">
            <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true" className="flex-shrink-0 text-zinc-400">
              <line x1="0" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            Target floor
          </div>
          <p className="mt-0.5 tabular-nums text-lg font-semibold text-zinc-900">{CURRENCY.format(TARGET_CPM)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">vs. target</p>
          <p className={`mt-0.5 inline-flex items-center gap-1 tabular-nums text-lg font-semibold ${aboveTarget ? "text-emerald-700" : "text-red-700"}`}>
            {aboveTarget ? <ArrowUp className="h-4 w-4 flex-shrink-0" aria-hidden="true" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
            {Math.abs(vsTarget)}%
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">Period high / low</p>
          <p className="mt-0.5 tabular-nums text-sm font-normal text-zinc-700">
            {CURRENCY.format(high)} / {CURRENCY.format(low)}
          </p>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 px-4 pt-4 sm:px-5">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="h-56 w-full sm:h-64 lg:h-72"
          role="img"
          aria-label={`Line chart of market average CPM over the trailing ${period === "24H" ? "24 hours" : period === "7D" ? "7 days" : "30 days"}, ranging from ${CURRENCY.format(low)} to ${CURRENCY.format(high)}, against a target floor of ${CURRENCY.format(TARGET_CPM)}.`}
          onMouseMove={(e) => setHoverIndex(indexFromClientX(e.clientX))}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {yTicks.map((v, i) => (
            <g key={i}>
              <line x1={PAD_L} x2={VB_W - PAD_R} y1={yAt(v)} y2={yAt(v)} stroke="#f4f4f5" strokeWidth="1" />
              <text x={PAD_L - 6} y={yAt(v) + 3} textAnchor="end" className="fill-zinc-500" fontSize="10">
                {CURRENCY.format(v)}
              </text>
            </g>
          ))}

          <line x1={PAD_L} x2={VB_W - PAD_R} y1={targetY} y2={targetY} stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="5 4" />

          {xTicks.map((i) => (
            <text key={i} x={xAt(i)} y={VB_H - 6} textAnchor="middle" className="fill-zinc-500" fontSize="10">
              {labels[i]}
            </text>
          ))}

          <polyline points={linePoints} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {hoverIndex !== null && hoverPct !== null && (
            <>
              <line x1={xAt(hoverIndex)} x2={xAt(hoverIndex)} y1={PAD_T} y2={VB_H - PAD_B} stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx={xAt(hoverIndex)} cy={yAt(series[hoverIndex])} r="4" fill="#0284c7" stroke="white" strokeWidth="1.5" />
            </>
          )}
        </svg>

        {hoverIndex !== null && hoverPct !== null && (
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute top-3 z-10 w-40 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-2.5 text-xs shadow-lg"
            style={{ left: `${Math.min(88, Math.max(12, hoverPct * 100))}%` }}
          >
            <p className="font-medium text-zinc-900">{labels[hoverIndex]}</p>
            <p className="mt-1 flex items-center justify-between gap-2 font-normal text-zinc-600">
              <span>Market avg</span>
              <span className="tabular-nums text-zinc-900">{CURRENCY.format(series[hoverIndex])}</span>
            </p>
            <p className="mt-0.5 flex items-center justify-between gap-2 font-normal text-zinc-600">
              <span>Target</span>
              <span className="tabular-nums text-zinc-900">{CURRENCY.format(TARGET_CPM)}</span>
            </p>
          </div>
        )}

        <label className="mt-1 flex items-center gap-2.5 text-[11px] font-normal text-zinc-500">
          <span className="flex-shrink-0">Inspect:</span>
          <input
            type="range"
            min={0}
            max={pts - 1}
            step={1}
            value={hoverIndex ?? pts - 1}
            onChange={(e) => setHoverIndex(Number(e.target.value))}
            onFocus={() => setHoverIndex((v) => (v === null ? pts - 1 : v))}
            onBlur={() => setHoverIndex(null)}
            aria-label={`Scrub the market chart across the ${period} window`}
            className={`h-1.5 flex-1 cursor-pointer accent-sky-600 ${FOCUS_RING}`}
          />
        </label>
      </div>

      <ChartTableFallback period={period} series={series} labels={labels} />
    </Card>
  );
}

function ChartTableFallback({ period, series, labels }: { period: Period; series: number[]; labels: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex-shrink-0 border-t border-zinc-200 px-4 py-2.5 sm:px-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="market-chart-table"
        className={`inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        <TableProperties className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        {open ? "Hide data table" : "View data table"}
      </button>
      {open && (
        <div id="market-chart-table" className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-zinc-200">
          <table className="w-full table-fixed border-collapse text-xs">
            <caption className="sr-only">Market average CPM and target floor for each point in the {period} window.</caption>
            <colgroup>
              <col style={{ width: "40%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "30%" }} />
            </colgroup>
            <thead className="sticky top-0 bg-zinc-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left font-medium text-zinc-600">
                  Period
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-zinc-600">
                  Market avg
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-zinc-600">
                  Target
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {series.map((v, i) => (
                <tr key={i}>
                  <td className="truncate whitespace-nowrap px-3 py-1.5 font-normal text-zinc-700">{labels[i]}</td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums font-normal text-zinc-900">{CURRENCY.format(v)}</td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums font-normal text-zinc-500">{CURRENCY.format(TARGET_CPM)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
