"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { formatCompact, formatNumber } from "../lib/format";

interface PerformanceChartProps {
  series: number[];
  labels: string[];
  seriesLabel: string;
}

const VIEW_W = 280;
const VIEW_H = 96;
const PAD_L = 4;
const PAD_R = 4;
const PAD_T = 8;
const PAD_B = 16;
const PLOT_W = VIEW_W - PAD_L - PAD_R;
const PLOT_H = VIEW_H - PAD_T - PAD_B;

function round2(n: number): number {
  return Number(n.toFixed(2));
}

export default function PerformanceChart({ series, labels, seriesLabel }: PerformanceChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tableId = useId();
  const statusId = useId();

  const n = series.length;
  const maxRaw = Math.max(...series, 1);
  const max = Math.ceil((maxRaw * 1.15) / 100) * 100;

  const xFor = (i: number) => PAD_L + (n <= 1 ? 0 : (i / (n - 1)) * PLOT_W);
  const yFor = (v: number) => PAD_T + PLOT_H - (v / max) * PLOT_H;

  const pts = series.map((v, i) => ({ x: round2(xFor(i)), y: round2(yFor(v)) }));
  const linePath = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const baseline = round2(PAD_T + PLOT_H);
  const areaPath = `${linePath} L${round2(xFor(n - 1))},${baseline} L${round2(xFor(0))},${baseline} Z`;

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
  const activeLabel = activeIndex === null ? null : labels[activeIndex];
  const activeX = activeIndex === null ? 0 : xFor(activeIndex);
  const leftPct = (activeX / VIEW_W) * 100;
  const tooltipTransform = leftPct < 20 ? "translateX(0)" : leftPct > 80 ? "translateX(-100%)" : "translateX(-50%)";

  return (
    <div className="w-full">
      <div
        tabIndex={0}
        role="group"
        aria-label={`${seriesLabel} 추이 차트. 화살표 키로 지점 이동, Escape로 해제`}
        aria-describedby={tableId}
        onKeyDown={handleKeyDown}
        onFocus={() => setActiveIndex((i) => (i === null ? n - 1 : i))}
        onBlur={() => setActiveIndex(null)}
        className="relative w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-24 w-full touch-none"
          preserveAspectRatio="none"
          role="presentation"
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="cadence-reach-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-indigo-500)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-indigo-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line x1={PAD_L} y1={baseline} x2={VIEW_W - PAD_R} y2={baseline} stroke="var(--color-zinc-200)" strokeWidth={1} vectorEffect="non-scaling-stroke" />

          <path d={areaPath} fill="url(#cadence-reach-area)" stroke="none" />
          <path d={linePath} fill="none" stroke="var(--color-indigo-600)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

          {labels.map((label, i) => (
            <text
              key={label}
              x={round2(xFor(i))}
              y={VIEW_H - 4}
              textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
              className="fill-zinc-400 text-[9px] tabular-nums"
            >
              {label}
            </text>
          ))}

          {activeIndex !== null && (
            <g>
              <line x1={round2(xFor(activeIndex))} y1={PAD_T} x2={round2(xFor(activeIndex))} y2={baseline} stroke="var(--color-zinc-300)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <circle cx={pts[activeIndex].x} cy={pts[activeIndex].y} r={3.5} fill="var(--color-indigo-600)" stroke="white" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            </g>
          )}
        </svg>

        {active !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 z-10 min-w-[128px] rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs shadow-lg"
            style={{ left: `${leftPct.toFixed(2)}%`, transform: tooltipTransform }}
          >
            <p className="text-[10px] font-medium tabular-nums text-zinc-500">{activeLabel}</p>
            <p className="font-semibold tabular-nums text-zinc-900">{formatNumber(active)}회</p>
          </div>
        )}

        <p id={statusId} role="status" aria-live="polite" className="sr-only">
          {active !== null ? `${activeLabel} — 도달 ${formatNumber(active)}회` : `${seriesLabel} 차트 포커스됨. 화살표 키로 지점을 탐색하세요. 최고 ${formatCompact(maxRaw)}회.`}
        </p>

        <table id={tableId} className="sr-only">
          <caption>{seriesLabel} 일별 도달 추이</caption>
          <thead>
            <tr>
              <th scope="col">일자</th>
              <th scope="col">도달</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, i) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{series[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
