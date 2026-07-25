"use client";

import { useId, useMemo, useState } from "react";
import { round2 } from "./format";

/**
 * Weighted forecast trend — area + line crosshair chart.
 * Moves the active point via mouse hover (position → nearest index) or keyboard (← → Home End),
 * updating the tooltip and crosshair. aria-live announces the active point.
 * Coordinates are rounded to 2 decimals (hydration-stable); the line uses non-scaling-stroke
 * to avoid scale distortion.
 */
export function ForecastChart({
  points,
  unit,
  ariaTitle,
}: {
  points: { label: string; value: number }[];
  unit: string;
  ariaTitle: string;
}) {
  const gradientId = useId();
  const n = points.length;
  const [active, setActive] = useState(n - 1);

  const idx = Math.min(Math.max(active, 0), n - 1);

  const { linePath, areaPath, coords, min, max } = useMemo(() => {
    const values = points.map((p) => p.value);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    // 0..100 coordinate space, 12% padding top and bottom.
    const xy = points.map((p, i) => {
      const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
      const y = round2(88 - ((p.value - lo) / span) * 76);
      return { x, y };
    });
    const line = xy.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
    const area = `${line} L100,100 L0,100 Z`;
    return { linePath: line, areaPath: area, coords: xy, min: lo, max: hi };
  }, [points, n]);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.round(ratio * (n - 1));
    setActive(Math.min(Math.max(i, 0), n - 1));
  }

  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    let next = idx;
    if (e.key === "ArrowLeft") next = idx - 1;
    else if (e.key === "ArrowRight") next = idx + 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(Math.min(Math.max(next, 0), n - 1));
  }

  const activePoint = points[idx];
  const activeCoord = coords[idx];

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
          Weighted forecast trend
        </span>
        <span className="text-[11px] text-zinc-400">
          High {max}
          {unit} · Low {min}
          {unit}
        </span>
      </div>
      <div
        role="img"
        aria-label={`${ariaTitle}. ${points
          .map((p) => `${p.label} ${p.value}${unit}`)
          .join(", ")}`}
        tabIndex={0}
        onKeyDown={handleKey}
        onPointerMove={handleMove}
        className="relative h-[68px] w-full cursor-crosshair touch-none rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(37 99 235)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="rgb(37 99 235)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="rgb(37 99 235)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Crosshair + active point (HTML overlay — no scale distortion) */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-blue-500/30"
          style={{ left: `${activeCoord.x}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow-sm"
          style={{ left: `${activeCoord.x}%`, top: `${activeCoord.y}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white shadow-lg"
          style={{
            left: `${Math.min(Math.max(activeCoord.x, 12), 88)}%`,
            top: `${Math.max(activeCoord.y - 6, 4)}%`,
          }}
          aria-hidden="true"
        >
          {activePoint.label} · {activePoint.value}
          {unit}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {activePoint.label} weighted forecast {activePoint.value}
        {unit}
      </p>
    </div>
  );
}
