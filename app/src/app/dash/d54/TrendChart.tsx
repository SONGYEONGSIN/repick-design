"use client";

import { useRef, useState } from "react";
import { TREND_30D, TREND_7D, TREND_TODAY } from "./data";
import { FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, r2, cx } from "./tokens";
import { Segmented } from "./ui";

export type Period = "today" | "7d" | "30d";

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
];

const W = 800;
const H = 220;
const PAD_X = 28;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
const MIN_V = 60;
const MAX_V = 100;
const GRID_VALUES = [60, 70, 80, 90, 100];

function seriesFor(period: Period) {
  if (period === "today") return TREND_TODAY;
  if (period === "7d") return TREND_7D;
  return TREND_30D;
}

export default function TrendChart({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  const data = seriesFor(period);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOTTOM;

  function xAt(i: number) {
    return data.length === 1 ? PAD_X : r2(PAD_X + (i / (data.length - 1)) * plotW);
  }
  function yAt(v: number) {
    return r2(PAD_TOP + plotH - ((v - MIN_V) / (MAX_V - MIN_V)) * plotH);
  }

  const linePoints = data.map((d, i) => `${xAt(i)},${yAt(d.value)}`).join(" ");
  const areaPoints = `${xAt(0)},${yAt(MIN_V)} ${data.map((d, i) => `${xAt(i)},${yAt(d.value)}`).join(" ")} ${xAt(data.length - 1)},${yAt(MIN_V)}`;

  const shownIndex = activeIndex ?? data.length - 1;
  const shown = data[shownIndex];

  function moveFocus(delta: number) {
    const next = Math.max(0, Math.min(data.length - 1, shownIndex + delta));
    btnRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>On-time rate</h2>
          <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_AUX)}>Citywide pickups completed inside their promised window.</p>
        </div>
        <Segmented options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} ariaLabel="Trend period" />
      </div>

      <div className="relative mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true" preserveAspectRatio="none">
          {GRID_VALUES.map((v) => (
            <g key={v}>
              <line x1={PAD_X} y1={yAt(v)} x2={W - PAD_X} y2={yAt(v)} className="stroke-white/[0.08]" strokeWidth={1} />
              <text x={PAD_X - 8} y={yAt(v) + 3} textAnchor="end" className="fill-zinc-400 text-[9px] [font-feature-settings:'tnum']">
                {v}
              </text>
            </g>
          ))}
          <polygon points={areaPoints} className="fill-blue-400/10" />
          <polyline points={linePoints} fill="none" className="stroke-blue-400" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => (
            <circle key={d.label} cx={xAt(i)} cy={yAt(d.value)} r={i === shownIndex ? 4.5 : 2.5} className={i === shownIndex ? "fill-blue-300" : "fill-blue-400/60"} />
          ))}
          <line x1={xAt(shownIndex)} y1={PAD_TOP} x2={xAt(shownIndex)} y2={H - PAD_BOTTOM} className="stroke-blue-300/40" strokeWidth={1} strokeDasharray="2 3" />
          {data.map((d, i) => (
            <text key={d.label} x={xAt(i)} y={H - 8} textAnchor="middle" className="fill-zinc-400 text-[9px]">
              {d.label}
            </text>
          ))}
        </svg>

        <div className="absolute inset-0" role="group" aria-label="On-time rate by period, use arrow keys to move between points">
          {data.map((d, i) => (
            <button
              key={d.label}
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
                  moveFocus(1);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  moveFocus(-1);
                }
              }}
              aria-label={`${d.label}: ${d.value}% on-time`}
              style={{ left: `${r2((xAt(i) / W) * 100)}%`, width: `${r2((plotW / data.length / W) * 100)}%`, top: 0 }}
              className={cx("absolute h-full -translate-x-1/2 rounded-md", FOCUS)}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className={cx("mt-2 text-xs font-normal", TEXT_AUX)}>
        <span className={cx(NUM, "font-semibold", TEXT_PRIMARY)}>{shown.value}%</span> on-time at <span className="font-medium text-zinc-300">{shown.label}</span>
        {activeIndex === null ? " (latest)" : ""}
      </p>
    </div>
  );
}
