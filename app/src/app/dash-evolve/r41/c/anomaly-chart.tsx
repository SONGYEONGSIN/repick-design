"use client";

import { useState } from "react";
import { anomaliesForMetric, pointDeviation, pointDirection, round2, type MetricDef } from "./data";
import { formatMetricValue, formatNumber, formatRange, formatSignedMetricValue } from "./format";

const VIEW_W = 960;
const VIEW_H = 320;
const PAD_LEFT = 46;
const PAD_RIGHT = 16;
const PAD_TOP = 56;
const PAD_BOTTOM = 34;
const CHART_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const CHART_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

function markerPoints(x: number, y: number, direction: "above" | "below"): string {
  const r = 8;
  if (direction === "above") {
    // Diamond.
    return `${round2(x)},${round2(y - r)} ${round2(x + r)},${round2(y)} ${round2(x)},${round2(y + r)} ${round2(x - r)},${round2(y)}`;
  }
  // Triangle, pointing down toward the dip.
  return `${round2(x - r)},${round2(y - r * 0.55)} ${round2(x + r)},${round2(y - r * 0.55)} ${round2(x)},${round2(y + r)}`;
}

export default function AnomalyChart({ metric, selectedHour }: { metric: MetricDef; selectedHour: string | null }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [prevMetricKey, setPrevMetricKey] = useState(metric.key);
  if (prevMetricKey !== metric.key) {
    setPrevMetricKey(metric.key);
    setHoveredIndex(null);
  }

  const points = metric.points;
  const n = points.length;

  const allValues = points.flatMap((p) => [p.actual, p.expectedLow, p.expectedHigh]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const span = rawMax - rawMin || 1;
  const buffer = span * 0.1;
  const domainMin = Math.min(0, rawMin - buffer);
  const domainMax = rawMax + buffer;
  const domainSpan = domainMax - domainMin || 1;

  const xAt = (i: number) => round2(PAD_LEFT + (n === 1 ? 0 : (i / (n - 1)) * CHART_W));
  const yAt = (v: number) => round2(PAD_TOP + CHART_H - ((v - domainMin) / domainSpan) * CHART_H);

  const bandTopLine = points.map((p, i) => `${xAt(i)},${yAt(p.expectedHigh)}`).join(" ");
  const bandBottomLine = points.map((p, i) => `${xAt(i)},${yAt(p.expectedLow)}`).join(" ");
  const bandReversedBottom = points
    .map((p, i) => `${xAt(i)},${yAt(p.expectedLow)}`)
    .reverse()
    .join(" ");
  const actualLine = points.map((p, i) => `${xAt(i)},${yAt(p.actual)}`).join(" ");

  const anomalies = anomaliesForMetric(metric);

  const gridSteps = [0, 1 / 3, 2 / 3, 1];
  const gridValues = gridSteps.map((f) => domainMin + f * domainSpan);

  const hourTicks = points.map((p, i) => ({ index: i, label: p.hour })).filter((t) => t.index % 3 === 0);

  const hovered = hoveredIndex !== null ? points[hoveredIndex] : null;
  const hoveredDirection = hovered ? pointDirection(hovered) : null;
  const hoveredDeviation = hovered ? pointDeviation(hovered) : 0;

  return (
    <div className="relative">
      <div
        className="relative"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
          const index = Math.round(fraction * (n - 1));
          setHoveredIndex(index);
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block h-auto w-full" aria-hidden="true">
          {/* Y-axis gridlines + labels */}
          {gridValues.map((v, i) => {
            const y = yAt(v);
            return (
              <g key={i}>
                <line x1={PAD_LEFT} x2={VIEW_W - PAD_RIGHT} y1={y} y2={y} className="stroke-zinc-100" strokeWidth={1} />
                <text x={PAD_LEFT - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-zinc-500 font-normal text-[10px] tabular-nums">
                  {formatNumber(v, metric.decimals)}
                </text>
              </g>
            );
          })}

          {/* Expected-range band: low-opacity fill, distinguished further by a dashed border on both edges. */}
          <polygon points={`${bandTopLine} ${bandReversedBottom}`} className="fill-sky-100" />
          <polyline points={bandTopLine} fill="none" className="stroke-sky-400" strokeWidth={1.25} strokeDasharray="4 3" />
          <polyline points={bandBottomLine} fill="none" className="stroke-sky-400" strokeWidth={1.25} strokeDasharray="4 3" />

          {/* Actual value line */}
          <polyline points={actualLine} fill="none" className="stroke-sky-600" strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />

          {/* Crosshair */}
          {hovered ? (
            <g className="motion-safe:transition-opacity motion-safe:duration-150">
              <line
                x1={xAt(hoveredIndex!)}
                x2={xAt(hoveredIndex!)}
                y1={PAD_TOP}
                y2={VIEW_H - PAD_BOTTOM}
                className="stroke-zinc-300"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <circle cx={xAt(hoveredIndex!)} cy={yAt(hovered.actual)} r={4} className="fill-white stroke-sky-600" strokeWidth={2} />
            </g>
          ) : null}

          {/* Anomaly markers + always-on value labels */}
          {anomalies.map((a) => {
            const x = xAt(a.index);
            const y = yAt(a.actual);
            const isSelected = selectedHour === a.hour;
            const labelAbove = a.direction === "above";
            const labelText = `${formatMetricValue(metric, a.actual)} · ${a.direction === "above" ? "+" : "−"}${formatNumber(a.deviation, metric.decimals)}`;
            return (
              <g key={a.hour}>
                <circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill="none"
                  className={`stroke-red-500 motion-safe:transition-opacity motion-safe:duration-200 ${isSelected ? "opacity-100" : "opacity-0"}`}
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                />
                <polygon points={markerPoints(x, y, a.direction)} className="fill-red-600 stroke-white" strokeWidth={1.25} />
                <text
                  x={x}
                  y={labelAbove ? y - 16 : y + 22}
                  textAnchor="middle"
                  className="fill-zinc-700 font-medium text-[10px] tabular-nums"
                >
                  {labelText}
                </text>
              </g>
            );
          })}

          {/* X-axis hour labels */}
          {hourTicks.map((t) => (
            <text
              key={t.index}
              x={xAt(t.index)}
              y={VIEW_H - PAD_BOTTOM + 18}
              textAnchor="middle"
              className="fill-zinc-500 font-normal text-[10px] tabular-nums"
            >
              {t.label}
            </text>
          ))}
        </svg>

        {hovered ? (
          <div
            className="pointer-events-none absolute z-10 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md motion-safe:transition-opacity motion-safe:duration-150"
            style={{
              left: `${(xAt(hoveredIndex!) / VIEW_W) * 100}%`,
              top: `${Math.max(0, (yAt(hovered.actual) / VIEW_H) * 100 - 16)}%`,
            }}
          >
            <p className="font-medium text-xs text-zinc-900">{hovered.hour}</p>
            <p className="mt-0.5 font-normal text-[11px] tabular-nums text-zinc-600">
              Actual {formatMetricValue(metric, hovered.actual)}
            </p>
            <p className="font-normal text-[11px] tabular-nums text-zinc-500">
              Expected {formatRange(metric, hovered.expectedLow, hovered.expectedHigh)}
            </p>
            {hoveredDirection ? (
              <p className="mt-0.5 font-medium text-[11px] tabular-nums text-red-700">
                {formatSignedMetricValue(metric, hoveredDirection === "above" ? hoveredDeviation : -hoveredDeviation)} outside range
              </p>
            ) : (
              <p className="mt-0.5 font-normal text-[11px] text-zinc-500">Within expected range</p>
            )}
          </div>
        ) : null}
      </div>

      {/* Legend — shape, not color alone, distinguishes each series. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-3">
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <span className="h-0.5 w-5 rounded-full bg-sky-600" aria-hidden="true" />
          Actual value
        </span>
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <span className="h-2.5 w-5 rounded-sm border border-dashed border-sky-400 bg-sky-100" aria-hidden="true" />
          Expected range
        </span>
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <polygon points="5,0 10,5 5,10 0,5" className="fill-red-600" />
          </svg>
          Spike above range
        </span>
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <polygon points="0,1 10,1 5,9" className="fill-red-600" />
          </svg>
          Dip below range
        </span>
      </div>
    </div>
  );
}
