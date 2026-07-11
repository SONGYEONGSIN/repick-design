"use client";

import { useState } from "react";
import type { TrendPoint } from "./data";
import { formatNumber, formatPercent } from "./data";
import { cn } from "./cn";

const WIDTH = 640;
const HEIGHT = 200;
const PAD_TOP = 14;
const PAD_BOTTOM = 20;
const PAD_X = 4;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

interface BookingTrendChartProps {
  data: TrendPoint[];
}

export function BookingTrendChart({ data }: BookingTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const innerWidth = WIDTH - PAD_X * 2;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const values = data.map((d) => d.bookings);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const points = data.map((d, i) => {
    const x = round2(PAD_X + (data.length === 1 ? 0 : (i / (data.length - 1)) * innerWidth));
    const y = round2(PAD_TOP + innerHeight - ((d.bookings - min) / range) * innerHeight);
    return { ...d, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const baseline = PAD_TOP + innerHeight;
  const areaPath = `${linePath} L${points[points.length - 1].x},${baseline} L${points[0].x},${baseline} Z`;

  const active = activeIndex !== null ? points[activeIndex] : null;
  // 라벨이 겹치지 않도록 균등 간격으로 최대 6개만 표시
  const labelStep = Math.max(1, Math.ceil(points.length / 6));

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-1 z-10 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 shadow-md transition-opacity motion-reduce:transition-none",
            active ? "opacity-100" : "opacity-0",
          )}
          style={{ left: `${active ? (active.x / WIDTH) * 100 : 50}%` }}
        >
          <p className="whitespace-nowrap text-[11px] font-medium text-zinc-400">
            {active?.label}
          </p>
          <p className="whitespace-nowrap text-[13px] font-semibold tabular-nums text-zinc-900">
            예약 {active ? formatNumber(active.bookings) : " "}건
          </p>
          <p className="whitespace-nowrap text-[11.5px] tabular-nums text-zinc-500">
            전환율 {active ? formatPercent(active.conversionRate) : ""}
          </p>
        </div>

        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="h-56 w-full overflow-visible"
          role="img"
          aria-label="최근 예약 추이 라인 차트"
        >
          <defs>
            <linearGradient id="d30-trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-indigo-500)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--color-indigo-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={PAD_X}
            y1={baseline}
            x2={WIDTH - PAD_X}
            y2={baseline}
            stroke="var(--color-zinc-200)"
            strokeWidth={1}
          />

          {active ? (
            <line
              x1={active.x}
              y1={PAD_TOP}
              x2={active.x}
              y2={baseline}
              stroke="var(--color-zinc-300)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ) : null}

          <path d={areaPath} fill="url(#d30-trend-fill)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-indigo-600)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {active ? (
            <circle cx={active.x} cy={active.y} r={3.5} fill="var(--color-indigo-600)" stroke="white" strokeWidth={1.5} />
          ) : null}
        </svg>

        <div className="absolute inset-0 flex" aria-hidden="false">
          {points.map((p, i) => (
            <button
              key={p.dateISO}
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              className="h-full flex-1 focus-visible:outline-none"
              aria-label={`${p.label} · 예약 ${p.bookings}건 · 전환율 ${p.conversionRate}%`}
            />
          ))}
        </div>
      </div>

      <div className="mt-1 flex text-[11px] tabular-nums text-zinc-400">
        {points.map((p, i) => (
          <span key={p.dateISO} className="flex-1 text-center">
            {i % labelStep === 0 ? p.label : ""}
          </span>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {active
          ? `${active.label} 예약 ${active.bookings}건, 전환율 ${active.conversionRate}퍼센트`
          : ""}
      </p>
    </div>
  );
}
