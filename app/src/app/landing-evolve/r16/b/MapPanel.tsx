"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  MAP_VIEWBOX,
  MAP_CENTER,
  MAP_SCALE,
  MAP_RINGS,
  RADIUS_MIN,
  RADIUS_MAX,
  RADIUS_STEP,
  RADIUS_PRESETS,
  NEIGHBORHOOD,
  formatPrice,
  formatRadius,
  type Listing,
  type PriceBand,
} from "./data";

type MapPanelProps = {
  radiusKm: number;
  onRadiusChange: (km: number) => void;
  listings: Listing[];
  within: Listing[];
  top: Listing[];
  band: PriceBand | null;
};

export default function MapPanel({
  radiusKm,
  onRadiusChange,
  listings,
  within,
  top,
  band,
}: MapPanelProps) {
  const reduce = useReducedMotion();
  const topIds = new Set(top.map((l) => l.id));
  const withinIds = new Set(within.map((l) => l.id));
  const radiusPx = Math.round(radiusKm * MAP_SCALE * 100) / 100;

  const summary = band
    ? `${within.length} comparable${within.length === 1 ? "" : "s"} within ${formatRadius(
        radiusKm
      )} km of ${NEIGHBORHOOD}, priced ${formatPrice(band.low)} to ${formatPrice(band.high)}.`
    : `No comparables within ${formatRadius(radiusKm)} km of ${NEIGHBORHOOD} yet. Widen your radius.`;

  return (
    <div id="radius-control" className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
          Comparable sales near {NEIGHBORHOOD}
        </h2>
        <span className="text-[11px] tabular-nums text-zinc-400">
          {within.length}/{listings.length} in range
        </span>
      </div>

      <div className="mt-4 aspect-square w-full overflow-hidden rounded-lg bg-[#0B0B0F]">
        <svg
          viewBox={`0 0 ${MAP_VIEWBOX} ${MAP_VIEWBOX}`}
          aria-hidden="true"
          className="h-full w-full"
        >
          {MAP_RINGS.map((km) => (
            <circle
              key={km}
              cx={MAP_CENTER}
              cy={MAP_CENTER}
              r={km * MAP_SCALE}
              fill="none"
              stroke="#27272a"
              strokeWidth={1}
            />
          ))}
          {MAP_RINGS.map((km) => (
            <text
              key={`label-${km}`}
              x={MAP_CENTER + 4}
              y={MAP_CENTER - km * MAP_SCALE + 10}
              fontSize={9}
              fill="#a1a1aa"
            >
              {km}km
            </text>
          ))}
          <motion.circle
            cx={MAP_CENTER}
            cy={MAP_CENTER}
            fill="#a3e635"
            fillOpacity={0.08}
            stroke="#a3e635"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            animate={{ r: radiusPx }}
            transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
          />
          {listings.map((listing) => {
            const isTop = topIds.has(listing.id);
            const isWithin = withinIds.has(listing.id);
            const r = isTop ? 7 : 4;
            const fill = isTop ? "#a3e635" : isWithin ? "#d4d4d8" : "#52525b";
            return (
              <circle
                key={listing.id}
                cx={listing.x}
                cy={listing.y}
                r={r}
                fill={fill}
                stroke={isTop ? "#0B0B0F" : "none"}
                strokeWidth={isTop ? 1.5 : 0}
                opacity={isWithin ? 1 : 0.8}
              />
            );
          })}
          <circle cx={MAP_CENTER} cy={MAP_CENTER} r={6} fill="#0B0B0F" stroke="#a3e635" strokeWidth={2} />
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <li className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime-400" /> Top match
        </li>
        <li className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-zinc-300" /> In radius
        </li>
        <li className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-zinc-600" /> Outside radius
        </li>
      </ul>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="radius-slider" className="text-[13px] font-medium text-zinc-200">
            Search radius
          </label>
          <span className="tabular-nums text-[15px] font-bold text-white">
            {formatRadius(radiusKm)} km
          </span>
        </div>
        <input
          id="radius-slider"
          type="range"
          min={RADIUS_MIN}
          max={RADIUS_MAX}
          step={RADIUS_STEP}
          value={radiusKm}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          aria-valuetext={`${formatRadius(radiusKm)} kilometers`}
          className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3e635] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0B0B0F] [&::-webkit-slider-thumb]:bg-lime-400 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0B0B0F] [&::-moz-range-thumb]:bg-lime-400"
        />
        <div className="mt-1 flex justify-between text-[10px] tabular-nums text-zinc-400">
          <span>{RADIUS_MIN} km</span>
          <span>{RADIUS_MAX} km</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Radius presets">
        {RADIUS_PRESETS.map((preset) => {
          const active = radiusKm === preset.km;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onRadiusChange(preset.km)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3e635] ${
                active
                  ? "border-lime-400 bg-lime-400/10 text-lime-300"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {preset.label} &middot; {formatRadius(preset.km)} km
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {summary}
      </p>
    </div>
  );
}
