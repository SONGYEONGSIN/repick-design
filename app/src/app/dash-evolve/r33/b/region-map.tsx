"use client";

import { useId, useState } from "react";
import { HEX_VIEWBOX, METRICS, STATUS_META, concernIntensity, type MetricKey, type Zone } from "./data";
import { cx } from "./ui";

// Status hues — fixed RGB triples blended toward a neutral base by `concernIntensity`. Hue always
// encodes `status` (derived from onTimeRate alone); only the blend weight moves when the metric
// toggle changes, so the map's color *key* never changes meaning, only how strongly each zone reads.
const BASE_RGB: [number, number, number] = [36, 36, 40];
const HUE_RGB: Record<Zone["status"], [number, number, number]> = {
  "on-track": [63, 156, 144],
  watch: [199, 146, 63],
  "at-risk": [188, 86, 86],
};

function mix(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export default function RegionMap({
  zones,
  metric,
  selectedId,
  onSelect,
}: {
  zones: Zone[];
  metric: MetricKey;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  // Ephemeral preview state — mouse hover OR keyboard focus on a hex. This is intentionally a
  // SEPARATE, local pair of states from `selectedId` (owned by the parent and passed down as a
  // prop): previewing a hex must never move the persistent selection or touch the detail panel.
  // It resets the moment the pointer leaves or focus moves on, and never calls `onSelect`.
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const previewId = hoverId ?? focusId;
  const previewZone = previewId ? zones.find((z) => z.id === previewId) ?? null : null;
  const titleId = useId();
  const meta = METRICS[metric];

  return (
    <div className="relative w-full" style={{ aspectRatio: `${HEX_VIEWBOX.width} / ${HEX_VIEWBOX.height}` }}>
      <svg
        viewBox={`0 0 ${HEX_VIEWBOX.width} ${HEX_VIEWBOX.height}`}
        className="h-full w-full"
        role="group"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{`Delivery zone map, colored by status and shaded by ${meta.label.toLowerCase()}`}</title>
        {zones.map((zone) => {
          const intensity = concernIntensity(zone, metric);
          const fill = mix(BASE_RGB, HUE_RGB[zone.status], intensity);
          const isSelected = zone.id === selectedId;
          const isPreview = zone.id === previewId && !isSelected;
          return (
            <g key={zone.id}>
              <polygon
                points={zone.hex.points}
                fill={fill}
                stroke={isSelected ? "#e7f4f1" : isPreview ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.08)"}
                strokeWidth={isSelected ? 2.5 : isPreview ? 1.75 : 1}
                tabIndex={0}
                role="button"
                aria-current={isSelected ? "location" : undefined}
                aria-label={`${zone.name}, ${zone.code}. ${STATUS_META[zone.status].label}. ${meta.label}: ${meta.format(zone)}. ${
                  isSelected ? "Selected." : "Press Enter to view details."
                }`}
                className={cx(
                  "cursor-pointer transition-[stroke,stroke-width] duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
                )}
                onClick={() => onSelect(zone.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(zone.id);
                  }
                }}
                onMouseEnter={() => setHoverId(zone.id)}
                onMouseLeave={() => setHoverId((cur) => (cur === zone.id ? null : cur))}
                onFocus={() => setFocusId(zone.id)}
                onBlur={() => setFocusId((cur) => (cur === zone.id ? null : cur))}
              />
              {/* A fixed dark pill behind the label, independent of the hex's own fill color —
                  at full intensity some status hues (amber especially) get light enough that
                  white text directly on the fill would fail the AA contrast floor. Compositing
                  against this near-opaque backdrop keeps label contrast high no matter which
                  status/intensity combination is showing. */}
              <rect
                x={zone.hex.cx - 27}
                y={zone.hex.cy - 20}
                width={54}
                height={36}
                rx={5}
                className="pointer-events-none fill-zinc-950/75"
              />
              <text
                x={zone.hex.cx}
                y={zone.hex.cy - 7}
                textAnchor="middle"
                className="pointer-events-none select-none fill-zinc-50 text-[12px] font-semibold"
              >
                {zone.code}
              </text>
              <text
                x={zone.hex.cx}
                y={zone.hex.cy + 11}
                textAnchor="middle"
                className="pointer-events-none select-none fill-zinc-50 text-[11px] font-medium tabular-nums"
              >
                {meta.format(zone)}
              </text>
            </g>
          );
        })}
      </svg>

      {previewZone ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 w-48 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 shadow-xl"
          style={{
            // Clamp the pre-transform anchor to at least half the tooltip's own width from each
            // edge, so after the -50% horizontal shift above, the tooltip can never cross the map
            // wrapper's left/right edge (and cause page overflow) for a hex in an outer column.
            left: `clamp(96px, ${(previewZone.hex.cx / HEX_VIEWBOX.width) * 100}%, calc(100% - 96px))`,
            top: `${(previewZone.hex.cy / HEX_VIEWBOX.height) * 100}%`,
          }}
        >
          <p className="truncate text-[12.5px] font-semibold text-zinc-50">{previewZone.name}</p>
          <p className="mt-0.5 text-[11px] font-normal text-zinc-400">{previewZone.code} &middot; {STATUS_META[previewZone.status].label}</p>
          <p className="mt-1.5 flex items-baseline justify-between text-[12px]">
            <span className="font-normal text-zinc-400">{meta.shortLabel}</span>
            <span className="font-semibold tabular-nums text-zinc-50">{meta.format(previewZone)}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
