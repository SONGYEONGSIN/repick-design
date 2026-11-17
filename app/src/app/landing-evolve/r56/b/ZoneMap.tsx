"use client";

import { Clock, Truck, CheckCircle2, LocateFixed } from "lucide-react";
import { ZONES, getZoneResult, type TierId } from "./zones";
import { FOCUS_RING } from "./ui";

interface ZoneMapProps {
  selectedZoneId: string;
  onSelect: (zoneId: string) => void;
}

const TIER_LABEL: Record<TierId, string> = {
  near: "Near tier",
  mid: "Mid tier",
  far: "Far tier",
};

// Near-monochrome: tier is differentiated by shade of the one accent hue plus
// the text label beside it, never by color alone.
const TIER_DOT: Record<TierId, string> = {
  near: "bg-indigo-300",
  mid: "bg-indigo-600",
  far: "bg-zinc-600",
};

// Fixed hub coordinates + per-zone center, used only to draw the decorative
// connector lines behind the tiles. Hardcoded, never derived from Date/Math.random.
const HUB = { top: 50, left: 48 };

function zoneCenter(zone: { top: number; left: number; width: number; height: number }) {
  return { x: zone.left + zone.width / 2, y: zone.top + zone.height / 2 };
}

export default function ZoneMap({ selectedZoneId, onSelect }: ZoneMapProps) {
  const result = getZoneResult(selectedZoneId);

  return (
    <div>
      <div
        className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/12] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60"
        role="group"
        aria-label="Select a pickup zone on the district grid"
      >
        {/* Decorative schematic grid + connector lines — never the click target itself. */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern id="b-grid" width="6.25" height="6.25" patternUnits="userSpaceOnUse">
              <path
                d="M 6.25 0 L 0 0 0 6.25"
                fill="none"
                stroke="#27272A"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#b-grid)" />
          {ZONES.map((zone) => {
            const c = zoneCenter(zone);
            return (
              <line
                key={zone.id}
                x1={HUB.left}
                y1={HUB.top}
                x2={c.x}
                y2={c.y}
                stroke="#3F3F6B"
                strokeWidth="0.4"
                strokeDasharray="1.2 1.4"
              />
            );
          })}
          <circle cx={HUB.left} cy={HUB.top} r="2.4" fill="#18181B" stroke="#52525B" strokeWidth="0.5" />
        </svg>
        <div
          className="absolute flex items-center justify-center rounded-full border border-zinc-600 bg-zinc-950 text-[7px] sm:text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-400"
          style={{
            top: `${HUB.top}%`,
            left: `${HUB.left}%`,
            width: "14%",
            height: "14%",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        >
          Hub
        </div>

        {/* The zones themselves — each tile IS the focusable/clickable region. */}
        {ZONES.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelect(zone.id)}
              aria-pressed={isSelected}
              aria-label={`${zone.name}, ${TIER_LABEL[zone.tier]}${
                isSelected ? ", currently selected" : ""
              }`}
              className={`absolute flex flex-col justify-between rounded-lg border p-1.5 sm:p-2.5 text-left transition-colors ${FOCUS_RING} ${
                isSelected
                  ? "border-indigo-400 bg-indigo-500/15"
                  : "border-zinc-700 bg-zinc-900/80 hover:border-zinc-500 hover:bg-zinc-800/80"
              }`}
              style={{
                top: `${zone.top}%`,
                left: `${zone.left}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
            >
              <span className="flex items-start justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-semibold leading-tight text-white">
                  {zone.name}
                </span>
                {isSelected ? (
                  <CheckCircle2
                    className="h-3.5 w-3.5 shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[zone.tier]}`}
                  aria-hidden="true"
                />
                {TIER_LABEL[zone.tier]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live readout — calls the exact same getZoneResult() the hero proof grid
          and the closing CTA call, so this can never drift into a second,
          similar-looking but separately-hardcoded number. */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200">
          <LocateFixed className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
          {result.zone.name}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 tabular-nums">
          <Clock className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          {result.etaLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 tabular-nums">
          <Truck className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          {result.feeLabel}
        </span>
      </div>
    </div>
  );
}
