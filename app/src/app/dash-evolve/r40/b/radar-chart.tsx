"use client";

import { useId } from "react";
import type { AxisDef, VendorDef, VendorId } from "./data";
import { formatScore, valueForView, type ViewMode } from "./format";
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
  scorePoint,
  spokeAngle,
} from "./geometry";
import { DASH_PATTERNS, Marker, TONE_STROKE } from "./vendor-swatch";

interface RadarChartProps {
  vendors: VendorDef[];
  axes: AxisDef[];
  view: ViewMode;
  pinnedId: VendorId;
  hoveredId: VendorId | null;
  onHoverVendor: (id: VendorId | null) => void;
  hoveredAxisIndex: number | null;
  onHoverAxis: (index: number | null) => void;
}

export default function RadarChart({
  vendors,
  axes,
  view,
  pinnedId,
  hoveredId,
  onHoverVendor,
  hoveredAxisIndex,
  onHoverAxis,
}: RadarChartProps) {
  const titleId = useId();
  const count = axes.length;

  // Non-focused vendors draw first, then the ephemeral hover preview, then
  // the persistent pin on top — so the pinned polygon is never obscured.
  // Hover is explicitly suppressed when it targets the pinned vendor itself.
  const effectiveHoverId = hoveredId && hoveredId !== pinnedId ? hoveredId : null;
  const drawOrder = [
    ...vendors.filter((v) => v.id !== pinnedId && v.id !== effectiveHoverId),
    ...vendors.filter((v) => v.id === effectiveHoverId),
    ...vendors.filter((v) => v.id === pinnedId),
  ];

  const hoveredAxis = hoveredAxisIndex !== null ? axes[hoveredAxisIndex] : null;
  const tooltipAnchor = hoveredAxisIndex !== null ? labelPoint(hoveredAxisIndex, count) : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        role="img"
        aria-labelledby={titleId}
        className="h-auto w-full max-w-[460px]"
      >
        <title id={titleId}>
          Radar comparison of {vendors.length} suppliers across {count} evaluation axes
        </title>

        {/* Reference rings */}
        {RING_FRACTIONS.map((fraction) => (
          <circle
            key={fraction}
            cx={CENTER}
            cy={CENTER}
            r={ringRadius(fraction)}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth={1}
          />
        ))}
        {/* Ring value labels along the top spoke */}
        {RING_FRACTIONS.map((fraction) => (
          <text
            key={`ring-label-${fraction}`}
            x={CENTER + 4}
            y={round2(CENTER - MAX_RADIUS * fraction)}
            fontSize={9}
            fill="#a1a1aa"
            className="font-normal tabular-nums"
          >
            {Math.round(fraction * 100)}
          </text>
        ))}

        {/* Spokes */}
        {axes.map((axis, i) => {
          const tip = pointAtRadius(spokeAngle(i, count), MAX_RADIUS);
          return (
            <line
              key={axis.id}
              x1={CENTER}
              y1={CENTER}
              x2={tip.x}
              y2={tip.y}
              stroke="#e4e4e7"
              strokeWidth={1}
            />
          );
        })}

        {/* Vendor polygons */}
        {drawOrder.map((vendor) => {
          const isPinned = vendor.id === pinnedId;
          const isHover = vendor.id === effectiveHoverId;
          const tone: "pinned" | "hover" | "neutral" = isPinned ? "pinned" : isHover ? "hover" : "neutral";
          const color = TONE_STROKE[tone];
          const points = axes.map((axis, i) =>
            scorePoint(i, count, valueForView(axis.id, vendor.scores[axis.id], view)),
          );
          return (
            <g
              key={vendor.id}
              tabIndex={0}
              role="button"
              aria-label={`Preview ${vendor.name} on the radar`}
              onMouseEnter={() => onHoverVendor(vendor.id)}
              onMouseLeave={() => onHoverVendor(null)}
              onFocus={() => onHoverVendor(vendor.id)}
              onBlur={() => onHoverVendor(null)}
              className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              <polygon
                points={polygonPoints(points)}
                fill={isPinned ? color : "none"}
                fillOpacity={isPinned ? 0.12 : 0}
                stroke={color}
                strokeWidth={isPinned ? 2.5 : 2}
                strokeDasharray={DASH_PATTERNS[vendor.stroke]}
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <Marker
                  key={axes[i]?.id ?? i}
                  shape={vendor.marker}
                  cx={p.x}
                  cy={p.y}
                  color={color}
                  filled={isPinned}
                  size={isPinned ? 1.1 : 0.9}
                />
              ))}
            </g>
          );
        })}

        {/* Axis labels */}
        {axes.map((axis, i) => {
          const angle = spokeAngle(i, count);
          const p = labelPoint(i, count);
          return (
            <text
              key={axis.id}
              x={p.x}
              y={p.y}
              textAnchor={anchorFor(angle)}
              dy={dyFor(angle)}
              fontSize={11}
              className="font-medium uppercase tracking-wide"
              fill={hoveredAxisIndex === i ? "#be123c" : "#52525b"}
              style={{ letterSpacing: "0.03em" }}
            >
              {axis.shortLabel}
            </text>
          );
        })}

        {/* Keyboard + pointer hotzones for the crosshair tooltip */}
        {axes.map((axis, i) => {
          const p = hotzonePoint(i, count);
          return (
            <circle
              key={`hot-${axis.id}`}
              cx={p.x}
              cy={p.y}
              r={14}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${axis.label} axis: show every supplier's value`}
              className="cursor-pointer outline-none focus-visible:fill-rose-50 focus-visible:stroke-rose-600 focus-visible:stroke-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
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
          className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg motion-reduce:transition-none"
          style={{
            left: `${round2((tooltipAnchor.x / VIEW_SIZE) * 100)}%`,
            top: `${round2((tooltipAnchor.y / VIEW_SIZE) * 100)}%`,
          }}
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {hoveredAxis.label}
          </p>
          <ul className="mt-1.5 space-y-1">
            {vendors.map((vendor) => (
              <li
                key={vendor.id}
                className="flex items-center justify-between gap-2 text-sm font-normal text-zinc-700"
              >
                <span className="min-w-0 flex-1 truncate">
                  {vendor.shortName}
                  {vendor.id === pinnedId ? (
                    <span className="ml-1 font-medium text-rose-700">(pinned)</span>
                  ) : null}
                </span>
                <span className="shrink-0 tabular-nums font-semibold text-zinc-900">
                  {formatScore(valueForView(hoveredAxis.id, vendor.scores[hoveredAxis.id], view))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
