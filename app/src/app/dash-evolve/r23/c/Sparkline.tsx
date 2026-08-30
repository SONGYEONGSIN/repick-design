"use client";

import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import { FOCUS } from "./ui";

export interface SparkPoint {
  label: string;
  value: number;
}

/**
 * Generative SVG sparkline — no charting library, deterministic coordinates
 * (rounded to 2 decimals), with a keyboard-accessible hover/focus crosshair
 * tooltip. This is interaction ① from the brief: mouse users get a
 * `mousemove` crosshair, keyboard users get the identical readout by
 * arrowing across the same point set with focus.
 */
export function Sparkline({
  data,
  width = 240,
  height = 56,
  stroke = "#0f766e",
  fill = "rgba(15,118,110,0.10)",
  formatValue = (v: number) => String(v),
  unit = "",
}: {
  data: SparkPoint[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  formatValue?: (v: number) => string;
  unit?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const padY = 6;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const span = Math.max(max - min, 1);

  const points = useMemo(
    () =>
      data.map((d, i) => {
        const x = data.length > 1 ? (i / (data.length - 1)) * width : 0;
        const y = height - padY - ((d.value - min) / span) * (height - padY * 2);
        return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, ...d };
      }),
    [data, width, height, min, span]
  );

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  function nearestIndex(clientX: number, rect: DOMRect) {
    const relX = ((clientX - rect.left) / rect.width) * width;
    let best = 0;
    let bestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  function onMouseMove(e: MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setActive(nearestIndex(e.clientX, rect));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => Math.min(points.length - 1, (a ?? -1) + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => Math.max(0, (a ?? points.length) - 1));
    } else if (e.key === "Escape") {
      setActive(null);
    }
  }

  const activePoint = active !== null ? points[active] : null;
  const tooltipLeft = activePoint ? Math.min(Math.max(activePoint.x, 30), width - 30) : 0;

  return (
    <div
      className={`relative select-none rounded-sm ${FOCUS}`}
      style={{ width, height }}
      tabIndex={0}
      role="img"
      aria-label={`Trend across ${data.length} points. Latest: ${data[data.length - 1].label} ${formatValue(
        data[data.length - 1].value
      )}${unit}. Use arrow keys to inspect each point.`}
      onKeyDown={onKeyDown}
      onFocus={() => setActive((a) => a ?? points.length - 1)}
      onBlur={() => setActive(null)}
      onMouseLeave={() => setActive(null)}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={onMouseMove}
        className="overflow-visible"
        aria-hidden
      >
        <path d={areaPath} fill={fill} stroke="none" />
        <path d={path} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        {activePoint ? (
          <g>
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={0}
              y2={height}
              stroke="#a1a1aa"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <circle cx={activePoint.x} cy={activePoint.y} r={3} fill={stroke} stroke="white" strokeWidth={1.5} />
          </g>
        ) : null}
      </svg>
      {activePoint ? (
        <div
          className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] shadow-md"
          style={{ left: tooltipLeft }}
        >
          <span className="font-medium text-zinc-900 tabular-nums">
            {formatValue(activePoint.value)}
            {unit}
          </span>
          <span className="ml-1.5 text-zinc-500">{activePoint.label}</span>
        </div>
      ) : null}
    </div>
  );
}
