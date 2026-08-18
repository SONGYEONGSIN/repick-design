"use client";

import { useId, useState } from "react";
import { INT } from "./data";
import { FOCUS_RING } from "./ui";

const WIDTH = 88;
const HEIGHT = 28;
const PAD = 3;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildGeometry(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (WIDTH - PAD * 2) / (values.length - 1);
  const points = values.map((v, i) => {
    const x = round2(PAD + i * stepX);
    const y = round2(HEIGHT - PAD - ((v - min) / span) * (HEIGHT - PAD * 2));
    return { x, y, v };
  });
  return { points, min, max };
}

export function Sparkline({
  values,
  label,
  deltaPct,
  tone,
}: {
  values: number[];
  label: string;
  deltaPct: number;
  tone: "up" | "down" | "flat";
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tooltipId = useId();
  const { points } = buildGeometry(values);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const strokeTone =
    tone === "up" ? "stroke-emerald-600" : tone === "down" ? "stroke-rose-600" : "stroke-zinc-400";
  const fillTone = tone === "up" ? "fill-emerald-600" : tone === "down" ? "fill-rose-600" : "fill-zinc-400";
  const active = activeIndex !== null ? points[activeIndex] : null;

  function nearestIndexFromClientX(clientX: number, rect: DOMRect): number {
    const ratio = (clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (points.length - 1));
    return Math.min(points.length - 1, Math.max(0, idx));
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        type="button"
        className={`group relative rounded-md p-0.5 ${FOCUS_RING}`}
        aria-describedby={tooltipId}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setActiveIndex(nearestIndexFromClientX(e.clientX, rect));
        }}
        onMouseLeave={() => setActiveIndex(null)}
        onFocus={() => setActiveIndex(points.length - 1)}
        onBlur={() => setActiveIndex(null)}
      >
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${label}: 14-day trend, ${deltaPct >= 0 ? "up" : "down"} ${Math.abs(deltaPct)} percent`}
          className="overflow-visible"
        >
          <path d={path} fill="none" strokeWidth={1.5} className={strokeTone} strokeLinecap="round" strokeLinejoin="round" />
          {active ? (
            <>
              <line x1={active.x} x2={active.x} y1={0} y2={HEIGHT} stroke="currentColor" strokeWidth={1} className="text-zinc-300" />
              <circle cx={active.x} cy={active.y} r={2.2} className={fillTone} />
            </>
          ) : null}
        </svg>
        {active ? (
          <span
            role="tooltip"
            id={tooltipId}
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm transition-opacity duration-150 motion-reduce:transition-none"
          >
            Day {activeIndex! + 1}: {INT.format(active.v)} units
          </span>
        ) : null}
      </button>
      <span
        className={`shrink-0 text-xs font-semibold tabular-nums ${
          tone === "up" ? "text-emerald-700" : tone === "down" ? "text-rose-700" : "text-zinc-500"
        }`}
      >
        {deltaPct > 0 ? "+" : ""}
        {deltaPct}%
      </span>
    </div>
  );
}
