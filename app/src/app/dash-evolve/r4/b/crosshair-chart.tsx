"use client";

import { useId, useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { HistoryPoint } from "./data";
import { cn } from "./cn";

function round2(n: number): number {
  return Number(n.toFixed(2));
}

/**
 * Expanded latency chart used inside the service detail drawer — line + area
 * fill, with a crosshair that follows pointer hover and responds to
 * ArrowLeft/ArrowRight/Home/End when focused. Coordinates are rounded to 2
 * decimals so server and client markup always match. An off-screen table
 * mirrors the series for assistive tech, and a live region announces the
 * focused point.
 */
export function CrosshairChart({
  points,
  unit,
  ariaTitle,
  strokeColor = "#a78bfa",
}: {
  points: HistoryPoint[];
  unit: string;
  ariaTitle: string;
  strokeColor?: string;
}) {
  const gradientId = useId();
  const tableId = useId();
  const n = points.length;
  const [active, setActive] = useState<number | null>(null);
  const idx = active === null ? n - 1 : Math.min(Math.max(active, 0), n - 1);

  const { linePath, areaPath, coords, min, max } = useMemo(() => {
    const values = points.map((p) => p.value);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    const xy = points.map((p, i) => {
      const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
      const y = round2(88 - ((p.value - lo) / span) * 72);
      return { x, y };
    });
    const line = xy.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
    const area = `${line} L100,100 L0,100 Z`;
    return { linePath: line, areaPath: area, coords: xy, min: lo, max: hi };
  }, [points, n]);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.round(ratio * (n - 1));
    setActive(Math.min(Math.max(i, 0), n - 1));
  }

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    let next = idx;
    if (e.key === "ArrowLeft") next = idx - 1;
    else if (e.key === "ArrowRight") next = idx + 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else if (e.key === "Escape") {
      setActive(null);
      return;
    } else return;
    e.preventDefault();
    setActive(Math.min(Math.max(next, 0), n - 1));
  }

  const activePoint = points[idx];
  const activeCoord = coords[idx];

  return (
    <div className="w-full">
      <div
        role="group"
        aria-label={`${ariaTitle}. Use arrow keys to move across points, Escape to release.`}
        aria-describedby={tableId}
        tabIndex={0}
        onKeyDown={handleKey}
        onFocus={() => setActive((i) => (i === null ? n - 1 : i))}
        onBlur={() => setActive(null)}
        onPointerMove={handleMove}
        onPointerLeave={() => setActive(null)}
        className="relative h-[188px] w-full cursor-crosshair touch-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="88" x2="100" y2="88" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={1.6}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-violet-400/25"
          style={{ left: `${activeCoord.x}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-violet-400 shadow-[0_0_0_2px_rgba(167,139,250,0.3)]"
          style={{ left: `${activeCoord.x}%`, top: `${activeCoord.y}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-zinc-50 shadow-lg"
          style={{
            left: `${Math.min(Math.max(activeCoord.x, 12), 88)}%`,
            top: `${Math.max(activeCoord.y - 6, 4)}%`,
          }}
          aria-hidden="true"
        >
          {activePoint.label} · <span className="tabular-nums">{activePoint.value}</span>
          {unit}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {activePoint.label}: {activePoint.value}
        {unit}
      </p>

      <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-zinc-400">
        <span>
          Min {min}
          {unit}
        </span>
        <span>
          Max {max}
          {unit}
        </span>
      </div>

      <table id={tableId} className="sr-only">
        <caption>{ariaTitle}</caption>
        <thead>
          <tr>
            <th scope="col">Point</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              <td>
                {p.value}
                {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Compact static sparkline used inside each tile — no interaction, purely a visual summary. */
export function MiniSparkline({
  points,
  className = "",
  strokeColor = "#a78bfa",
}: {
  points: HistoryPoint[];
  className?: string;
  strokeColor?: string;
}) {
  const n = points.length;
  const path = useMemo(() => {
    const values = points.map((p) => p.value);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    return values
      .map((v, i) => {
        const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
        const y = round2(92 - ((v - lo) / span) * 82);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, [points, n]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
