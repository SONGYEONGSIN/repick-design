"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { trendSeries, fmtDateShort } from "./data";
import { Card, SectionHeading } from "./ui";

const W = 600;
const H = 160;
const PAD_X = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 8;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function TrendChartCard() {
  const series = useMemo(() => trendSeries(), []);
  const n = series.length;
  const svgRef = useRef<SVGSVGElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const points = useMemo(() => {
    const innerW = W - PAD_X * 2;
    const innerH = H - PAD_TOP - PAD_BOTTOM;
    return series.map((pt, i) => {
      const x = round2(PAD_X + (n === 1 ? 0 : (i / (n - 1)) * innerW));
      const y = round2(PAD_TOP + innerH * (1 - pt.value / 100));
      return { ...pt, x, y };
    });
  }, [series, n]);

  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" "),
    [points]
  );
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L${last.x},${H - PAD_BOTTOM} L${first.x},${H - PAD_BOTTOM} Z`;
  }, [points, linePath]);

  function indexFromClientX(clientX: number): number {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const fraction = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(n - 1, Math.round(fraction * (n - 1))));
  }

  function onKeyDown(e: KeyboardEvent<SVGSVGElement>) {
    if (e.key === "ArrowRight") { e.preventDefault(); setIndex((i) => Math.min(n - 1, (i ?? -1) + 1)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setIndex((i) => Math.max(0, (i ?? n) - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setIndex(0); }
    else if (e.key === "End") { e.preventDefault(); setIndex(n - 1); }
  }

  const active = index !== null ? points[index] : null;

  return (
    <Card>
      <SectionHeading title="30-day booked-capacity trend" />
      <p className="sr-only">
        Line chart of daily booked capacity percentage for the 30 days ending September 21, 2026. Focus the
        chart and use the arrow keys to inspect each day&apos;s value.
      </p>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full cursor-crosshair"
          role="img"
          aria-label="30-day booked capacity trend"
          tabIndex={0}
          onMouseMove={(e) => setIndex(indexFromClientX(e.clientX))}
          onMouseLeave={() => setIndex(null)}
          onFocus={() => setIndex((i) => (i === null ? n - 1 : i))}
          onBlur={() => setIndex(null)}
          onKeyDown={onKeyDown}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-orange-500, #f97316)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-orange-500, #f97316)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#trendFill)" stroke="none" />
          <path d={linePath} fill="none" stroke="#c2410c" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {active && (
            <>
              <line x1={active.x} y1={PAD_TOP} x2={active.x} y2={H - PAD_BOTTOM} stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx={active.x} cy={active.y} r="4" fill="#c2410c" stroke="white" strokeWidth="1.5" />
            </>
          )}
        </svg>
        {active && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute top-0 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
            style={{ left: `${(active.x / W) * 100}%`, transform: "translate(-50%, -8px)" }}
          >
            <span className="block whitespace-nowrap font-medium text-zinc-900">{fmtDateShort(active.date)}</span>
            <span className="block whitespace-nowrap font-normal text-zinc-500">{active.value}% booked</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs font-normal text-zinc-500">Hover or focus the chart, then use ← → to step through days.</p>
    </Card>
  );
}
