"use client";

/**
 * A small trend line with a keyboard-accessible crosshair tooltip. Each data point is a real,
 * focusable <button> (24×24px hit target, per the `target-size` audit) laid out at a percentage
 * position so the chart is fully responsive without any fixed pixel width. Tab (or hover) onto a
 * point to open its tooltip and the vertical crosshair guide; the line/fill underneath is purely
 * decorative (`aria-hidden`) since every value is independently exposed through each point button's
 * accessible name — a keyboard or screen-reader user never depends on the visual crosshair to read
 * a value.
 */

import { useId, useState } from "react";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

const VIEW_W = 280;
const VIEW_H = 64;
const PAD_X = 4;
const PAD_Y = 8;

export default function SparklineCrosshair({
  data,
  labels,
  formatValue,
  stroke,
  fillId,
}: {
  data: number[];
  labels: string[];
  formatValue: (n: number) => string;
  stroke: string;
  fillId: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const reactId = useId();
  const gradientId = `${fillId}-${reactId}`;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = data.length === 1 ? VIEW_W / 2 : PAD_X + (i * (VIEW_W - PAD_X * 2)) / (data.length - 1);
    const y = PAD_Y + (1 - (v - min) / range) * (VIEW_H - PAD_Y * 2);
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, v, label: labels[i] };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${VIEW_H - PAD_Y} L${points[0].x},${VIEW_H - PAD_Y} Z`;

  const activePoint = active !== null ? points[active] : null;
  const activeAnchor = active === 0 ? "start" : active === points.length - 1 ? "end" : "middle";

  return (
    <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        {activePoint ? (
          <>
            <line x1={activePoint.x} y1={PAD_Y - 4} x2={activePoint.x} y2={VIEW_H - PAD_Y + 4} stroke={stroke} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx={activePoint.x} cy={activePoint.y} r="3" fill={stroke} />
          </>
        ) : null}
      </svg>

      {points.map((p, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
          onFocus={() => setActive(i)}
          onBlur={() => setActive((cur) => (cur === i ? null : cur))}
          aria-label={`${p.label}: ${formatValue(p.v)}`}
          className="absolute z-10 grid h-6 w-6 place-items-center rounded-full outline-2 outline-offset-2 outline-sky-400 focus-visible:outline"
          style={{ left: `${(p.x / VIEW_W) * 100}%`, top: `${(p.y / VIEW_H) * 100}%`, transform: "translate(-50%, -50%)" }}
        >
          <span className={cx("h-1.5 w-1.5 rounded-full", TRANSITION, active === i ? "scale-[1.8]" : "scale-100")} style={{ backgroundColor: stroke }} aria-hidden="true" />
        </button>
      ))}

      {activePoint ? (
        <div
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute top-0 z-20 -translate-y-full whitespace-nowrap rounded-lg border px-2 py-1 text-[11px] font-medium shadow-lg",
            BORDER,
            "bg-zinc-900",
            TEXT_PRIMARY,
          )}
          style={{
            left: `${(activePoint.x / VIEW_W) * 100}%`,
            transform: activeAnchor === "start" ? "translate(0, -6px)" : activeAnchor === "end" ? "translate(-100%, -6px)" : "translate(-50%, -6px)",
          }}
        >
          <span className={TEXT_CAPTION}>{activePoint.label}</span> <span className="tabular-nums">{formatValue(activePoint.v)}</span>
        </div>
      ) : null}
    </div>
  );
}
