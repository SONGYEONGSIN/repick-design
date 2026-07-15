"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ThroughputPoint } from "../lib/data";
import { formatCompact, formatNumber } from "../lib/format";

interface ThroughputChartProps {
  series: ThroughputPoint[];
  periodLabel: string;
}

const VIEW_W = 760;
const VIEW_H = 200;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 14;
const PAD_B = 24;
const PLOT_W = VIEW_W - PAD_L - PAD_R;
const PLOT_H = VIEW_H - PAD_T - PAD_B;

function round2(n: number): number {
  return Number(n.toFixed(2));
}

export default function ThroughputChart({ series, periodLabel }: ThroughputChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tableId = useId();
  const statusId = useId();

  const n = series.length;
  const maxRaw = Math.max(...series.map((p) => p.events), 1);
  const max = Math.ceil((maxRaw * 1.12) / 1000) * 1000;

  const xFor = (i: number) => PAD_L + (n <= 1 ? 0 : (i / (n - 1)) * PLOT_W);
  const yFor = (v: number) => PAD_T + PLOT_H - (v / max) * PLOT_H;

  const pts = series.map((p, i) => ({ x: round2(xFor(i)), y: round2(yFor(p.events)) }));
  const linePath = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const baseline = round2(PAD_T + PLOT_H);
  const areaPath = `${linePath} L${round2(xFor(n - 1))},${baseline} L${round2(xFor(0))},${baseline} Z`;

  const gridSteps = [0, 0.5, 1];
  const gridLines = gridSteps.map((t) => round2(PAD_T + PLOT_H * t));
  const labelStep = n <= 12 ? 1 : Math.ceil(n / 12);

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
  const tooltipTransform =
    leftPct < 16 ? "translateX(0)" : leftPct > 84 ? "translateX(-100%)" : "translateX(-50%)";

  return (
    <div className="w-full">
      <div
        tabIndex={0}
        role="group"
        aria-label={`처리량 추이 차트, ${periodLabel}. 화살표 키로 지점 이동, Escape로 해제`}
        aria-describedby={tableId}
        onKeyDown={handleKeyDown}
        onFocus={() => setActiveIndex((i) => (i === null ? n - 1 : i))}
        onBlur={() => setActiveIndex(null)}
        className="relative w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-32 w-full touch-none sm:h-36"
          preserveAspectRatio="none"
          role="presentation"
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="rivet-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-violet-500)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-violet-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridLines.map((y) => (
            <line key={y} x1={PAD_L} y1={y} x2={VIEW_W - PAD_R} y2={y} stroke="var(--color-zinc-200)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}

          <path d={areaPath} fill="url(#rivet-area)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-violet-600)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {series.map((p, i) =>
            i % labelStep === 0 || i === n - 1 ? (
              <text
                key={p.label}
                x={round2(xFor(i))}
                y={VIEW_H - 6}
                textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                className="fill-zinc-400 text-[11px] tabular-nums"
              >
                {p.label}
              </text>
            ) : null,
          )}

          {activeIndex !== null && (
            <g>
              <line
                x1={round2(xFor(activeIndex))}
                y1={PAD_T}
                x2={round2(xFor(activeIndex))}
                y2={baseline}
                stroke="var(--color-zinc-300)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={pts[activeIndex].x} cy={pts[activeIndex].y} r={4} fill="var(--color-violet-600)" stroke="white" strokeWidth={2} vectorEffect="non-scaling-stroke" />
            </g>
          )}
        </svg>

        {active && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1 z-10 min-w-[150px] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={{ left: `${leftPct.toFixed(2)}%`, transform: tooltipTransform }}
          >
            <p className="text-[11px] font-medium tabular-nums text-zinc-500">{active.label}</p>
            <dl className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-1.5 text-zinc-600">
                  <span className="size-1.5 rounded-full bg-violet-500" />
                  이벤트
                </dt>
                <dd className="font-semibold tabular-nums text-zinc-900">{formatNumber(active.events)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-1.5 text-zinc-600">
                  <span className="size-1.5 rounded-full bg-rose-400" />
                  오류
                </dt>
                <dd className="tabular-nums text-zinc-700">{formatNumber(active.errors)}</dd>
              </div>
            </dl>
          </div>
        )}

        <p id={statusId} role="status" aria-live="polite" className="sr-only">
          {active
            ? `${active.label} — 이벤트 ${formatNumber(active.events)}건, 오류 ${formatNumber(active.errors)}건`
            : `처리량 차트 포커스됨. 화살표 키로 지점을 탐색하세요. 최고 ${formatCompact(maxRaw)}건.`}
        </p>

        <table id={tableId} className="sr-only">
          <caption>{periodLabel} 처리량 추이 데이터</caption>
          <thead>
            <tr>
              <th scope="col">시점</th>
              <th scope="col">이벤트</th>
              <th scope="col">오류</th>
            </tr>
          </thead>
          <tbody>
            {series.map((p) => (
              <tr key={p.label}>
                <th scope="row">{p.label}</th>
                <td>{p.events}</td>
                <td>{p.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
