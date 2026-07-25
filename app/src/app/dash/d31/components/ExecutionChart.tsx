"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { PeriodPoint } from "../lib/data";
import { formatNumber } from "../lib/format";

interface ExecutionChartProps {
  series: PeriodPoint[];
  periodLabel: string;
}

const VIEW_W = 720;
const VIEW_H = 280;
const PAD_L = 44;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 28;
const PLOT_W = VIEW_W - PAD_L - PAD_R;
const PLOT_H = VIEW_H - PAD_T - PAD_B;

function round2(n: number): number {
  return Number(n.toFixed(2));
}

export default function ExecutionChart({ series, periodLabel }: ExecutionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const liveRegionId = useId();
  const tableId = useId();

  const n = series.length;
  const maxRaw = Math.max(...series.map((p) => Math.max(p.success, p.failed)), 1);
  const max = Math.max(10, Math.ceil((maxRaw * 1.15) / 10) * 10);

  const xFor = (i: number) => PAD_L + (n <= 1 ? 0 : (i / (n - 1)) * PLOT_W);
  const yFor = (v: number) => PAD_T + PLOT_H - (v / max) * PLOT_H;

  const successPts = series.map((p, i) => ({ x: round2(xFor(i)), y: round2(yFor(p.success)) }));
  const failedPts = series.map((p, i) => ({ x: round2(xFor(i)), y: round2(yFor(p.failed)) }));

  const successPath = successPts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const failedPath = failedPts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const baseline = round2(PAD_T + PLOT_H);
  const areaPath = `${successPath} L${round2(xFor(n - 1))},${baseline} L${round2(xFor(0))},${baseline} Z`;

  const gridSteps = [0, 0.33, 0.66, 1];
  const gridLines = gridSteps.map((t) => round2(PAD_T + PLOT_H * t));
  const gridValues = gridSteps.map((t) => Math.round(max * (1 - t)));

  const labelStep = n <= 8 ? 1 : Math.ceil(n / 7);

  function nearestIndex(clientX: number, rect: DOMRect): number {
    const relX = ((clientX - rect.left) / rect.width) * VIEW_W;
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(xFor(i) - relX);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    return nearest;
  }

  function handlePointerMove(e: PointerEvent<SVGSVGElement>) {
    setActiveIndex(nearestIndex(e.clientX, e.currentTarget.getBoundingClientRect()));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((i) => (i === null ? n - 1 : Math.min(n - 1, i + 1)));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((i) => (i === null ? n - 1 : Math.max(0, i - 1)));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(n - 1);
    } else if (e.key === "Escape") {
      setActiveIndex(null);
    }
  }

  const active = activeIndex === null ? null : series[activeIndex];
  const activeX = activeIndex === null ? 0 : xFor(activeIndex);
  const leftPct = (activeX / VIEW_W) * 100;
  const tooltipTransform = leftPct < 18 ? "translateX(0)" : leftPct > 82 ? "translateX(-100%)" : "translateX(-50%)";

  return (
    <div className="w-full">
      <div
        tabIndex={0}
        role="group"
        aria-label={`Execution trend chart, ${periodLabel}. Use arrow keys to move between points, Escape to close`}
        aria-describedby={tableId}
        onKeyDown={handleKeyDown}
        onFocus={() => setActiveIndex((i) => (i === null ? n - 1 : i))}
        onBlur={() => setActiveIndex(null)}
        className="relative w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400"
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full touch-none"
          role="presentation"
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="chart-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-indigo-400)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--color-indigo-400)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridLines.map((y, i) => (
            <g key={y}>
              <line x1={PAD_L} y1={y} x2={VIEW_W - PAD_R} y2={y} stroke="white" strokeOpacity="0.06" />
              <text x={PAD_L - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-zinc-500 text-[10px] tabular-nums">
                {formatNumber(gridValues[i])}
              </text>
            </g>
          ))}

          {series.map((p, i) =>
            i % labelStep === 0 || i === n - 1 ? (
              <text
                key={p.label}
                x={round2(xFor(i))}
                y={VIEW_H - 8}
                textAnchor="middle"
                className="fill-zinc-500 text-[10px] tabular-nums"
              >
                {p.label}
              </text>
            ) : null,
          )}

          <path d={areaPath} fill="url(#chart-area-fill)" stroke="none" />
          <path d={failedPath} fill="none" stroke="var(--color-rose-400)" strokeWidth={1.5} strokeDasharray="3 3" strokeLinejoin="round" />
          <path d={successPath} fill="none" stroke="var(--color-indigo-400)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {activeIndex !== null && (
            <g>
              <line
                x1={round2(xFor(activeIndex))}
                y1={PAD_T}
                x2={round2(xFor(activeIndex))}
                y2={baseline}
                stroke="white"
                strokeOpacity="0.25"
              />
              <circle cx={successPts[activeIndex].x} cy={successPts[activeIndex].y} r={3.5} fill="var(--color-indigo-400)" stroke="var(--color-zinc-950)" strokeWidth={1.5} />
              <circle cx={failedPts[activeIndex].x} cy={failedPts[activeIndex].y} r={3.5} fill="var(--color-rose-400)" stroke="var(--color-zinc-950)" strokeWidth={1.5} />
            </g>
          )}
        </svg>

        {active && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 z-10 min-w-[152px] rounded-lg border border-white/10 bg-zinc-900/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm"
            style={{ left: `${leftPct.toFixed(2)}%`, transform: tooltipTransform }}
          >
            <p className="text-[11px] tabular-nums text-zinc-400">{active.label}</p>
            <dl className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-1.5 rounded-full bg-indigo-400" />
                  Success
                </dt>
                <dd className="tabular-nums text-zinc-50">{formatNumber(active.success)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-1.5 rounded-full bg-rose-400" />
                  Failed
                </dt>
                <dd className="tabular-nums text-zinc-50">{formatNumber(active.failed)}</dd>
              </div>
            </dl>
          </div>
        )}

        <p id={liveRegionId} role="status" aria-live="polite" className="sr-only">
          {active
            ? `${active.label} — ${formatNumber(active.success)} succeeded, ${formatNumber(active.failed)} failed`
            : "Chart focused. Use arrow keys to explore points."}
        </p>

        <table id={tableId} className="sr-only">
          <caption>{periodLabel} execution success/failure trend data</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Success</th>
              <th scope="col">Failed</th>
            </tr>
          </thead>
          <tbody>
            {series.map((p) => (
              <tr key={p.label}>
                <th scope="row">{p.label}</th>
                <td>{p.success}</td>
                <td>{p.failed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-indigo-400" aria-hidden="true" />
          Success
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-rose-400" style={{ borderTop: "1px dashed" }} aria-hidden="true" />
          Failed
        </span>
      </div>
    </div>
  );
}
