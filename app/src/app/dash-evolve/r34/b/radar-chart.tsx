"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Axis, AxisId, SeriesStyle } from "./data";

export interface RadarSeriesInput {
  id: string;
  name: string;
  scores: Record<AxisId, number>;
  style: SeriesStyle;
}

const CENTER = 50;
const MAX_R = 28;
const LABEL_R = 41;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

function polar(angle: number, radius: number) {
  return { x: r2(CENTER + radius * Math.cos(angle)), y: r2(CENTER + radius * Math.sin(angle)) };
}

function angleFor(index: number, count: number) {
  return -Math.PI / 2 + index * ((2 * Math.PI) / count);
}

function Marker({
  type,
  cx,
  cy,
  color,
}: {
  type: SeriesStyle["marker"];
  cx: number;
  cy: number;
  color: string;
}) {
  const s = 1.9;
  switch (type) {
    case "circle":
      return <circle cx={cx} cy={cy} r={s} fill={color} />;
    case "square":
      return <rect x={r2(cx - s)} y={r2(cy - s)} width={r2(s * 2)} height={r2(s * 2)} fill={color} />;
    case "triangle":
      return (
        <polygon
          points={`${cx},${r2(cy - s * 1.15)} ${r2(cx - s)},${r2(cy + s * 0.8)} ${r2(cx + s)},${r2(cy + s * 0.8)}`}
          fill={color}
        />
      );
    case "diamond":
      return (
        <polygon
          points={`${cx},${r2(cy - s * 1.25)} ${r2(cx + s * 1.25)},${cy} ${cx},${r2(cy + s * 1.25)} ${r2(cx - s * 1.25)},${cy}`}
          fill={color}
        />
      );
    default:
      return null;
  }
}

export function RadarChart({
  axes,
  series,
  periodLabel,
  tableId,
}: {
  axes: Axis[];
  series: RadarSeriesInput[];
  periodLabel: string;
  tableId: string;
}) {
  const n = axes.length;
  const uid = useId();
  const shouldReduceMotion = useReducedMotion();
  const [activeAxisId, setActiveAxisId] = useState<AxisId | null>(null);

  const geometry = useMemo(() => {
    const axisPoints = axes.map((axis, i) => {
      const angle = angleFor(i, n);
      return {
        axis,
        angle,
        outer: polar(angle, MAX_R),
        label: polar(angle, LABEL_R),
      };
    });

    const rings = RING_FRACTIONS.map((frac) =>
      axisPoints.map((p) => polar(p.angle, MAX_R * frac))
    );

    const seriesPolygons = series.map((s) => ({
      series: s,
      points: axisPoints.map((p) => {
        const value = Math.max(0, Math.min(100, s.scores[p.axis.id]));
        return { ...polar(p.angle, MAX_R * (value / 100)), axisId: p.axis.id, value };
      }),
    }));

    return { axisPoints, rings, seriesPolygons };
  }, [axes, n, series]);

  const activeAxisLabel = activeAxisId
    ? axes.find((a) => a.id === activeAxisId)?.label ?? ""
    : "";
  const activeHotspot = activeAxisId
    ? geometry.axisPoints.find((p) => p.axis.id === activeAxisId)
    : undefined;

  // Three-way clamp per axis (left/center/right, top/center/bottom) rather than a simple midpoint
  // split: a tooltip anchored dead-center (x or y at ~50%) with a one-sided offset would overhang
  // one edge of a small container — centering it instead keeps the overhang symmetric and smaller
  // on both sides, which matters most at the 390px mobile width this chart also has to fit.
  function anchorStyle(x: number, y: number): CSSProperties {
    let left: string;
    let translateX: string;
    if (x < 38) {
      left = `calc(${x}% + 10px)`;
      translateX = "0%";
    } else if (x > 62) {
      left = `calc(${x}% - 10px)`;
      translateX = "-100%";
    } else {
      left = `${x}%`;
      translateX = "-50%";
    }

    let top: string;
    let translateY: string;
    if (y < 38) {
      top = `calc(${y}% + 10px)`;
      translateY = "0%";
    } else if (y > 62) {
      top = `calc(${y}% - 10px)`;
      translateY = "-100%";
    } else {
      top = `${y}%`;
      translateY = "-50%";
    }

    return { left, top, transform: `translate(${translateX}, ${translateY})` };
  }

  const tooltipId = `${uid}-tooltip`;

  return (
    <div>
      <p className="sr-only">
        Decorative radar chart. Exact per-axis values for every overlaid vendor are listed in the
        table below (see &ldquo;{periodLabel}&rdquo; scores).
      </p>
      <div className="relative mx-auto aspect-square w-full max-w-[560px] select-none">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {geometry.rings.map((ring, i) => (
            <polygon
              key={i}
              points={ring.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={i === geometry.rings.length - 1 ? "#D4D4D8" : "#E4E4E7"}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {geometry.axisPoints.map((p) => (
            <line
              key={p.axis.id}
              x1={CENTER}
              y1={CENTER}
              x2={p.outer.x}
              y2={p.outer.y}
              stroke="#E4E4E7"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <AnimatePresence initial={false}>
            {geometry.seriesPolygons.map(({ series: s, points }) => (
              <motion.g
                key={s.id}
                style={{ transformOrigin: "50% 50%" }}
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: "easeOut" }}
              >
                <polygon
                  points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill={`${s.style.color}1F`}
                  stroke={s.style.color}
                  strokeWidth={1.7}
                  strokeLinejoin="round"
                  strokeDasharray={s.style.dash}
                  vectorEffect="non-scaling-stroke"
                />
                {points.map((p) => (
                  <Marker key={p.axisId} type={s.style.marker} cx={p.x} cy={p.y} color={s.style.color} />
                ))}
              </motion.g>
            ))}
          </AnimatePresence>

          {geometry.axisPoints.map((p) => {
            const anchor = p.label.x < 42 ? "end" : p.label.x > 58 ? "start" : "middle";
            return (
              <text
                key={p.axis.id}
                x={p.label.x}
                y={p.label.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={3.6}
                fill="#3F3F46"
              >
                {p.axis.label}
              </text>
            );
          })}
        </svg>

        {geometry.axisPoints.map((p) => {
          const isActive = p.axis.id === activeAxisId;
          return (
            <button
              key={p.axis.id}
              type="button"
              aria-label={`${p.axis.label} axis — show values for overlaid vendors`}
              aria-describedby={isActive ? tooltipId : undefined}
              onMouseEnter={() => setActiveAxisId(p.axis.id)}
              onMouseLeave={() => setActiveAxisId((cur) => (cur === p.axis.id ? null : cur))}
              onFocus={() => setActiveAxisId(p.axis.id)}
              onBlur={() => setActiveAxisId((cur) => (cur === p.axis.id ? null : cur))}
              className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 ${
                isActive ? "border-lime-700 bg-lime-100" : "border-zinc-300 bg-white hover:bg-zinc-50"
              }`}
              style={{ left: `${p.outer.x}%`, top: `${p.outer.y}%` }}
            />
          );
        })}

        {activeAxisId && activeHotspot && (
          <div
            id={tooltipId}
            role="status"
            className="absolute z-10 w-52 max-w-[calc(100vw-2rem)] rounded-lg border border-zinc-200 bg-white p-3 shadow-sm"
            style={anchorStyle(activeHotspot.outer.x, activeHotspot.outer.y)}
          >
            <p className="text-xs font-semibold text-zinc-900">{activeAxisLabel}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-zinc-500">{periodLabel}</p>
            <ul className="mt-2 space-y-1.5">
              {series.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-700">
                    <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true">
                      <line
                        x1="0"
                        y1="4"
                        x2="14"
                        y2="4"
                        stroke={s.style.color}
                        strokeWidth={1.8}
                        strokeDasharray={s.style.dash}
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    {s.name}
                  </span>
                  <span className="tabular-nums text-zinc-900">{activeAxisId ? s.scores[activeAxisId] : ""}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p id={`${uid}-caption`} className="mt-3 text-center text-xs text-zinc-500">
        Hover or focus a vertex dot for exact values · full table is{" "}
        <a href={`#${tableId}`} className="text-lime-700 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700">
          below
        </a>
        .
      </p>
    </div>
  );
}
