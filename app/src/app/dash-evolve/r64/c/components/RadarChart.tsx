"use client";

import type { Alert, AxisDef, CategoryDef } from "../lib/data";
import { AXES } from "../lib/data";
import {
  CENTER,
  MAX_RADIUS,
  RING_FRACTIONS,
  VIEW_SIZE,
  anchorFor,
  dyFor,
  hotzonePoint,
  labelPoint,
  pointAtRadius,
  polygonPoints,
  ringRadius,
  round2,
  scorePoint,
  spokeAngle,
} from "../lib/geometry";

interface RadarChartProps {
  alert: Alert;
  category: CategoryDef;
  hoveredAxisIndex: number | null;
  onHoverAxis: (index: number | null) => void;
}

/**
 * Two overlaid datasets — this alert's own risk profile and its category's 24h baseline — on a
 * fixed 6-axis frame. The alert's values are printed as persistent text right at each axis tip
 * (never hover-only); both datasets' exact values also live in the always-visible legend table
 * rendered by InspectorPanel directly below this chart, so neither series depends on a hover to
 * be readable. Hovering or focusing an axis hotzone adds one shared, shared-position tooltip with
 * both numbers together — a convenience on top of the persistent labels, not their only home.
 */
export default function RadarChart({ alert, category, hoveredAxisIndex, onHoverAxis }: RadarChartProps) {
  const count = AXES.length;
  const alertPoints = AXES.map((axis, i) => scorePoint(i, count, alert.profile[axis.id]));
  const baselinePoints = AXES.map((axis, i) => scorePoint(i, count, category.baseline[axis.id]));

  const hoveredAxis: AxisDef | null = hoveredAxisIndex !== null ? AXES[hoveredAxisIndex] : null;
  const tooltipAnchor = hoveredAxisIndex !== null ? labelPoint(hoveredAxisIndex, count) : null;

  return (
    <div className="relative min-w-0">
      <svg
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        role="img"
        aria-label={`Risk profile radar for ${alert.title}, this alert versus the ${category.label} category baseline, across ${count} axes`}
        className="h-auto w-full max-w-[420px]"
      >
        {RING_FRACTIONS.map((fraction) => (
          <circle key={fraction} cx={CENTER} cy={CENTER} r={ringRadius(fraction)} fill="none" stroke="#e4e4e7" strokeWidth={1} />
        ))}
        {RING_FRACTIONS.map((fraction) => (
          <text key={`ring-${fraction}`} x={CENTER + 4} y={round2(CENTER - MAX_RADIUS * fraction)} fontSize={9} fill="#71717a" className="font-normal tabular-nums">
            {Math.round(fraction * 100)}
          </text>
        ))}

        {AXES.map((axis, i) => {
          const tip = pointAtRadius(spokeAngle(i, count), MAX_RADIUS);
          return <line key={axis.id} x1={CENTER} y1={CENTER} x2={tip.x} y2={tip.y} stroke="#e4e4e7" strokeWidth={1} />;
        })}

        {/* Category baseline — muted, dashed, no fill. */}
        <polygon points={polygonPoints(baselinePoints)} fill="none" stroke="#a1a1aa" strokeWidth={2} strokeDasharray="5,4" strokeLinejoin="round" />
        {baselinePoints.map((p, i) => (
          <circle key={`baseline-${AXES[i].id}`} cx={p.x} cy={p.y} r={2.5} fill="#a1a1aa" />
        ))}

        {/* This alert — orange, filled. */}
        <polygon points={polygonPoints(alertPoints)} fill="#f97316" fillOpacity={0.14} stroke="#c2410c" strokeWidth={2.5} strokeLinejoin="round" />
        {alertPoints.map((p, i) => (
          <circle key={`alert-${AXES[i].id}`} cx={p.x} cy={p.y} r={3.5} fill="#c2410c" />
        ))}

        {/* Persistent per-axis value for this alert, printed at the tip — never hover-only. */}
        {AXES.map((axis, i) => {
          const angle = spokeAngle(i, count);
          const nudgeOut = pointAtRadius(angle, MAX_RADIUS + 13);
          return (
            <text
              key={`value-${axis.id}`}
              x={nudgeOut.x}
              y={nudgeOut.y}
              textAnchor={anchorFor(angle)}
              fontSize={11}
              className="font-semibold tabular-nums"
              fill="#9a3412"
            >
              {alert.profile[axis.id]}
            </text>
          );
        })}

        {AXES.map((axis, i) => {
          const angle = spokeAngle(i, count);
          const p = labelPoint(i, count);
          return (
            <text
              key={axis.id}
              x={p.x}
              y={p.y}
              textAnchor={anchorFor(angle)}
              dy={dyFor(angle) + (Math.sin(angle) < -0.5 ? -11 : Math.sin(angle) > 0.5 ? 11 : 0)}
              fontSize={10.5}
              className="font-medium uppercase"
              fill={hoveredAxisIndex === i ? "#9a3412" : "#52525b"}
              style={{ letterSpacing: "0.03em" }}
            >
              {axis.shortLabel}
            </text>
          );
        })}

        {/* Keyboard + pointer hotzones for the crosshair tooltip — one shared tooltip element
           below, never a per-point absolutely-positioned decoration. */}
        {AXES.map((axis, i) => {
          const p = hotzonePoint(i, count);
          return (
            <circle
              key={`hot-${axis.id}`}
              cx={p.x}
              cy={p.y}
              r={15}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${axis.label}: this alert ${alert.profile[axis.id]}, ${category.label} baseline ${category.baseline[axis.id]}`}
              className="cursor-pointer focus-visible:fill-orange-50 focus-visible:stroke-orange-600 focus-visible:stroke-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              onMouseEnter={() => onHoverAxis(i)}
              onMouseLeave={() => onHoverAxis(null)}
              onFocus={() => onHoverAxis(i)}
              onBlur={() => onHoverAxis(null)}
            />
          );
        })}
      </svg>

      {hoveredAxis && tooltipAnchor ? (
        <div
          role="status"
          className="pointer-events-none absolute z-10 w-48 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-2.5 shadow-lg"
          style={{ left: `${round2((tooltipAnchor.x / VIEW_SIZE) * 100)}%`, top: `${round2((tooltipAnchor.y / VIEW_SIZE) * 100)}%` }}
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{hoveredAxis.label}</p>
          <ul className="mt-1 space-y-0.5">
            <li className="flex items-center justify-between gap-2 text-xs text-zinc-700">
              <span className="min-w-0 flex-1 truncate font-medium text-orange-800">This alert</span>
              <span className="shrink-0 tabular-nums font-semibold text-zinc-900">{alert.profile[hoveredAxis.id]}</span>
            </li>
            <li className="flex items-center justify-between gap-2 text-xs text-zinc-700">
              <span className="min-w-0 flex-1 truncate text-zinc-500">{category.label} baseline</span>
              <span className="shrink-0 tabular-nums font-semibold text-zinc-900">{category.baseline[hoveredAxis.id]}</span>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
