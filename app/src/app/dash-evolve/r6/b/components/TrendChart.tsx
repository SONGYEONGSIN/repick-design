"use client";

import { useId, useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { QuotaTrendPoint } from "../lib/data";
import { formatPct } from "../lib/format";

function round2(n: number): number {
  return Number(n.toFixed(2));
}

/**
 * Crosshair-enabled quota-attainment trend line for the rep detail drawer.
 * Hover or focus (keyboard arrow keys / Home / End) moves the crosshair. An
 * off-screen data table plus a live region keep the same information
 * available without a pointer. The sr-only fallback wraps the <table> in a
 * <div className="sr-only"> rather than applying sr-only to the table
 * itself — a bare `<table className="sr-only">` ignores its declared width
 * because table-layout:auto still expands to content width, which pushes
 * document.scrollWidth past the viewport at wide breakpoints.
 */
export default function TrendChart({ points, ariaTitle }: { points: QuotaTrendPoint[]; ariaTitle: string }) {
  const gradientId = useId();
  const tableId = useId();
  const n = points.length;
  const [active, setActive] = useState<number | null>(null);
  const idx = active === null ? n - 1 : Math.min(Math.max(active, 0), n - 1);

  const { linePath, areaPath, coords, min, max } = useMemo(() => {
    const values = points.map((p) => p.pct);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    const xy = points.map((p, i) => {
      const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
      const y = round2(86 - ((p.pct - lo) / span) * 68);
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
        aria-label={`${ariaTitle}. Use arrow keys to move across months, Escape to release.`}
        aria-describedby={tableId}
        tabIndex={0}
        onKeyDown={handleKey}
        onFocus={() => setActive((i) => (i === null ? n - 1 : i))}
        onBlur={() => setActive(null)}
        onPointerMove={handleMove}
        onPointerLeave={() => setActive(null)}
        className="relative h-28 w-full cursor-crosshair touch-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="86" x2="100" y2="86" stroke="#e4e4e7" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="#4f46e5"
            strokeWidth={1.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-indigo-300"
          style={{ left: `${activeCoord.x}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-600 shadow"
          style={{ left: `${activeCoord.x}%`, top: `${activeCoord.y}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-zinc-200 bg-zinc-900 px-1.5 py-1 text-[10px] font-medium text-white shadow-lg"
          style={{
            left: `${Math.min(Math.max(activeCoord.x, 14), 86)}%`,
            top: `${Math.max(activeCoord.y - 8, 4)}%`,
          }}
          aria-hidden="true"
        >
          {activePoint.label} · {formatPct(activePoint.pct)}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {activePoint.label}: {formatPct(activePoint.pct)} quota attainment
      </p>

      <div className="mt-1 flex items-center justify-between text-[10px] tabular-nums text-zinc-500">
        <span>Min {formatPct(min)}</span>
        <span>Max {formatPct(max)}</span>
      </div>

      <div className="sr-only">
        <table id={tableId}>
          <caption>{ariaTitle}</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Quota attainment</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.label}>
                <th scope="row">{p.label}</th>
                <td>{formatPct(p.pct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
