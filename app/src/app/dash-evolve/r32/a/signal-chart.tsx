"use client";

import { useRef } from "react";
import type { Signal, SeriesPoint } from "./data";
import { dateLabel, formatValue, isAnomalous } from "./data";

const round2 = (n: number) => Math.round(n * 100) / 100;

const SHORT_UNIT: Record<string, string> = {
  "%": "%",
  "per 1k listings": "/1k list.",
  "per 1k orders": "/1k ord.",
  "per 1k shipments": "/1k ship.",
  "per 10k logins": "/10k log.",
  "per 1k signups": "/1k sign.",
};

interface Props {
  signal: Signal;
  points: SeriesPoint[];
  width: number;
  height: number;
  variant?: "compact" | "expanded";
  cursorIndex: number | null;
  onCursorChange: (index: number | null) => void;
}

export default function SignalChart({ signal, points, width, height, variant = "compact", cursorIndex, onCursorChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pad = variant === "expanded" ? { left: 34, right: 10, top: 14, bottom: 20 } : { left: 3, right: 3, top: 8, bottom: 4 };

  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const domainMax = round2(Math.max(signal.threshold, ...points.map((p) => p.value), 0.01) * 1.15);

  const xScale = (i: number) => (points.length <= 1 ? pad.left + plotW / 2 : round2(pad.left + (plotW * i) / (points.length - 1)));
  const yScale = (v: number) => round2(pad.top + plotH - (v / domainMax) * plotH);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(p.value)}`)
    .join(" ");

  const thresholdY = yScale(signal.threshold);
  const lastIdx = points.length - 1;
  const anomalies = points.map((p, i) => ({ i, p, an: isAnomalous(signal, p) })).filter((x) => x.an);

  function indexFromClientX(clientX: number): number {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return lastIdx;
    const fraction = (clientX - rect.left) / rect.width;
    const xView = fraction * width;
    if (points.length <= 1) return 0;
    const step = plotW / (points.length - 1);
    const idx = Math.round((xView - pad.left) / step);
    return Math.min(lastIdx, Math.max(0, idx));
  }

  const cursor = cursorIndex !== null && cursorIndex >= 0 && cursorIndex <= lastIdx ? points[cursorIndex] : null;
  const shortUnit = SHORT_UNIT[signal.unit] ?? signal.unit;
  const yTicks = variant === "expanded" ? [0, domainMax / 2, domainMax] : [];

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full touch-none"
        aria-hidden="true"
        onPointerMove={(e) => onCursorChange(indexFromClientX(e.clientX))}
        onPointerLeave={() => onCursorChange(null)}
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={width - pad.right} y1={yScale(t)} y2={yScale(t)} stroke="#f0f0f2" strokeWidth={1} />
            <text x={pad.left - 6} y={yScale(t) + 3} textAnchor="end" fontSize={9} fill="#71717a">
              {round2(t)}
            </text>
          </g>
        ))}

        <line
          x1={pad.left}
          x2={width - pad.right}
          y1={thresholdY}
          y2={thresholdY}
          stroke="#e11d48"
          strokeWidth={1}
          strokeDasharray="3 2.5"
          opacity={0.65}
        />

        <path d={linePath} fill="none" stroke="#a1a1aa" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* Anomaly markers: a diamond shape, never color alone. */}
        {anomalies.map(({ i, p }) => {
          const x = xScale(i);
          const y = yScale(p.value);
          const r = variant === "expanded" ? 5 : 3.6;
          return (
            <polygon
              key={i}
              points={`${x},${round2(y - r)} ${round2(x + r)},${y} ${x},${round2(y + r)} ${round2(x - r)},${y}`}
              fill="#e11d48"
              stroke="#ffffff"
              strokeWidth={1}
            />
          );
        })}

        {/* Latest-value marker, only when the last point isn't already a diamond. */}
        {!isAnomalous(signal, points[lastIdx]) && (
          <circle cx={xScale(lastIdx)} cy={yScale(points[lastIdx].value)} r={variant === "expanded" ? 3.5 : 2.6} fill="#71717a" />
        )}

        {cursor && (
          <g>
            <line x1={xScale(cursorIndex!)} x2={xScale(cursorIndex!)} y1={pad.top} y2={height - pad.bottom} stroke="#e11d48" strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={xScale(cursorIndex!)} cy={yScale(cursor.value)} r={variant === "expanded" ? 5 : 4} fill="#ffffff" stroke="#e11d48" strokeWidth={2} />
          </g>
        )}

        {variant === "expanded" && (
          <>
            <text x={pad.left} y={height - 6} fontSize={9} fill="#71717a">{dateLabel(points[0].day)}</text>
            <text x={width - pad.right} y={height - 6} fontSize={9} fill="#71717a" textAnchor="end">{dateLabel(points[lastIdx].day)}</text>
          </>
        )}
      </svg>

      {cursor && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg"
          style={{
            left: `${Math.min(88, Math.max(12, (xScale(cursorIndex!) / width) * 100))}%`,
            top: `${(yScale(cursor.value) / height) * 100}%`,
            transform: "translate(-50%, calc(-100% - 8px))",
          }}
        >
          {dateLabel(cursor.day)} &middot; {formatValue(signal, cursor.value)}{shortUnit}
        </div>
      )}
    </div>
  );
}
