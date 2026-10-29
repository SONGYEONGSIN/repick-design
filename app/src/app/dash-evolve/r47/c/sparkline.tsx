"use client";

import { useState } from "react";

const WIDTH = 280;
const HEIGHT = 64;
const PAD_Y = 8;

/**
 * Usage-trend sparkline with a hover/focus crosshair tooltip. The hover state here is local to
 * this component only (`useState`, reset on blur/mouse-leave) — it is a separate, independently
 * scoped interaction from the rail→detail selection sync above it; nothing outside this component
 * reads or writes it.
 */
export function Sparkline({ data, labels }: { data: number[]; labels: readonly string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = data.length > 1 ? (index / (data.length - 1)) * WIDTH : WIDTH / 2;
    const y = PAD_Y + (1 - (value - min) / range) * (HEIGHT - PAD_Y * 2);
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), value, label: labels[index] };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const active = activeIndex !== null ? points[activeIndex] : null;

  return (
    <div className="relative w-full" style={{ height: HEIGHT }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path d={path} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {active && (
          <line
            x1={active.x}
            x2={active.x}
            y1={0}
            y2={HEIGHT}
            stroke="#cbd5e1"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
        )}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={activeIndex === i ? 3.5 : 0}
            fill="#2563eb"
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex" role="group" aria-label="Monthly usage trend, hover or focus a point for its value">
        {points.map((p, i) => (
          <button
            key={i}
            type="button"
            tabIndex={0}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex((current) => (current === i ? null : current))}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex((current) => (current === i ? null : current))}
            aria-label={`${p.label}: usage index ${p.value}`}
            className="h-full flex-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          />
        ))}
      </div>

      {active && (
        <div
          role="status"
          className="pointer-events-none absolute -top-8 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-900 shadow-sm"
          style={{ left: `${(active.x / WIDTH) * 100}%` }}
        >
          {active.label} · {active.value}
        </div>
      )}
    </div>
  );
}
