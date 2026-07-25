"use client";

import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { round2 } from "./data";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

export type TrendPoint = { label: string; value: number };

/**
 * Deterministic line chart — crosshair hover tooltip + keyboard access (each point is a focusable button).
 * Coordinates use only linear interpolation (no trigonometry), all rounded to 2 decimal places.
 */
export default function TrendChart({
  points,
  formatValue,
  ariaLabel,
  strokeClass,
  fillClass,
}: {
  points: TrendPoint[];
  formatValue: (v: number) => string;
  ariaLabel: string;
  strokeClass: string;
  fillClass: string;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const W = 480;
  const H = 140;
  const padX = 10;
  const padY = 14;
  const n = points.length;
  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 0.01);

  const coords = points.map((p, i) => {
    const x = round2(padX + (i / (n - 1)) * (W - padX * 2));
    const y = round2(padY + (1 - (p.value - min) / range) * (H - padY * 2));
    return { x, y };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[n - 1].x} ${H - padY} L ${coords[0].x} ${H - padY} Z`;

  const active = activeIdx ?? n - 1;
  const activeCoord = coords[active];

  function move(delta: number) {
    const next = Math.min(n - 1, Math.max(0, active + delta));
    setActiveIdx(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    }
  }

  return (
    <div className="relative" onMouseLeave={() => setActiveIdx(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full" preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
        <path d={areaPath} className={fillClass} fillOpacity={0.1} stroke="none" />
        <path d={linePath} className={strokeClass} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {activeCoord ? (
          <>
            <line
              x1={activeCoord.x}
              y1={padY - 6}
              x2={activeCoord.x}
              y2={H - padY}
              className="stroke-zinc-300 dark:stroke-zinc-700"
              strokeWidth={1}
              strokeDasharray="3 3"
              aria-hidden="true"
            />
            <circle cx={activeCoord.x} cy={activeCoord.y} r={3.4} className={cx(strokeClass, fillClass)} strokeWidth={1.5} aria-hidden="true" />
          </>
        ) : null}
      </svg>

      {/* Per-point focus/hover hit zone — a real button so keyboard traversal works. */}
      <div className="absolute inset-0 flex">
        {points.map((p, i) => (
          <button
            key={p.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            tabIndex={i === active ? 0 : -1}
            onFocus={() => setActiveIdx(i)}
            onMouseEnter={() => setActiveIdx(i)}
            onKeyDown={onKeyDown}
            aria-label={`${p.label}: ${formatValue(p.value)}`}
            className="h-full flex-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400"
          />
        ))}
      </div>

      {activeCoord ? (
        <div
          role="status"
          aria-live="polite"
          className={cx(
            "pointer-events-none absolute top-0 -translate-y-full rounded-lg border px-2.5 py-1.5 text-xs shadow-sm",
            "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
          )}
          style={{
            left: `${round2((activeCoord.x / W) * 100)}%`,
            transform: `translate(${activeCoord.x < W / 2 ? "0%" : "-100%"}, -8px)`,
          }}
        >
          <p className={cx("font-medium", TEXT_PRIMARY)}>{formatValue(points[active].value)}</p>
          <p className={TEXT_CAPTION}>{points[active].label}</p>
        </div>
      ) : null}
    </div>
  );
}
