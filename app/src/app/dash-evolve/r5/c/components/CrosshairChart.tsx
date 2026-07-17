"use client";

import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";
import type { SeriesPoint } from "../lib/data";
import { round2 } from "../lib/format";

const W = 480;
const H = 140;
const PAD_X = 8;
const PAD_Y = 14;

export default function CrosshairChart({
  data,
  yDomain,
  accentClass,
  ariaLabel,
}: {
  data: SeriesPoint[];
  yDomain: [number, number];
  accentClass: string;
  ariaLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [min, max] = yDomain;
  const range = max - min || 1;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  const n = data.length;
  const step = n > 1 ? innerW / (n - 1) : 0;

  const xFor = (i: number) => round2(PAD_X + i * step);
  const yFor = (v: number) => round2(PAD_Y + innerH - ((v - min) / range) * innerH);

  const linePoints = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");
  const areaPoints = `${xFor(0)},${H - PAD_Y} ${linePoints} ${xFor(n - 1)},${H - PAD_Y}`;

  const indexFromClientX = (clientX: number, rect: DOMRect): number => {
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(n - 1, Math.max(0, Math.round(ratio * (n - 1))));
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveIndex(indexFromClientX(e.clientX, rect));
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((cur) => Math.min(n - 1, (cur ?? -1) + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((cur) => Math.max(0, (cur ?? n) - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(n - 1);
    } else if (e.key === "Escape") {
      setActiveIndex(null);
    }
  };

  const active = activeIndex !== null ? data[activeIndex] : null;
  const activeX = activeIndex !== null ? xFor(activeIndex) : null;
  const activeY = activeIndex !== null ? yFor(data[activeIndex].value) : null;

  const tooltipAlign: "start" | "center" | "end" =
    activeIndex === null ? "center" : activeIndex === 0 ? "start" : activeIndex === n - 1 ? "end" : "center";
  const tooltipTransform =
    tooltipAlign === "start" ? "translateX(0)" : tooltipAlign === "end" ? "translateX(-100%)" : "translateX(-50%)";

  return (
    <div
      className="relative min-w-0 outline-none"
      tabIndex={0}
      role="group"
      aria-label={`${ariaLabel}. Use arrow keys to scan points.`}
      onKeyDown={handleKeyDown}
      onBlur={() => setActiveIndex(null)}
      onPointerLeave={() => setActiveIndex(null)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`h-[140px] w-full ${accentClass}`}
        preserveAspectRatio="none"
        role="img"
        aria-hidden="true"
      >
        <line x1={PAD_X} y1={PAD_Y} x2={W - PAD_X} y2={PAD_Y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
        <line
          x1={PAD_X}
          y1={H - PAD_Y}
          x2={W - PAD_X}
          y2={H - PAD_Y}
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="1"
        />

        <polygon points={areaPoints} fill="currentColor" fillOpacity="0.08" stroke="none" />
        <polyline
          points={linePoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {activeX !== null && activeY !== null ? (
          <>
            <line
              x1={activeX}
              y1={PAD_Y}
              x2={activeX}
              y2={H - PAD_Y}
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx={activeX} cy={activeY} r="3.5" fill="white" stroke="currentColor" strokeWidth="2" />
          </>
        ) : null}

        <rect
          x="0"
          y="0"
          width={W}
          height={H}
          fill="transparent"
          onPointerMove={handlePointerMove}
          className="cursor-crosshair"
        />
      </svg>

      {active && activeX !== null ? (
        <div
          className="pointer-events-none absolute top-0 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] shadow-md dark:border-white/10 dark:bg-zinc-900"
          style={{ left: `${(activeX / W) * 100}%`, transform: tooltipTransform }}
        >
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{active.label}</p>
          <p className="tabular-nums text-zinc-600 dark:text-zinc-400">{active.value.toFixed(2)}%</p>
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {active ? `${active.label}: ${active.value.toFixed(2)}%` : ""}
      </span>

      <div className="mt-1 flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>{data[0]?.label}</span>
        <span>{data[n - 1]?.label}</span>
      </div>
    </div>
  );
}
