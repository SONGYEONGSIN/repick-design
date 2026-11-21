"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SELLERS, coverageDiameterPct, pinPosition } from "./data";

/**
 * The output-visualization device for this candidate: a radial distance map,
 * not a criteria-radar polygon. Every pin's position is fixed (computed once
 * from a hand-authored distance+bearing pair in data.ts); the only thing
 * `radiusMi` changes is which pins render as "in range" versus dimmed —
 * the same twelve points, re-read against a moving threshold, never a
 * different set. Deliberately solid-fill (pins, coverage wash) rather than
 * stroked rings or a grid, to stay editorial instead of blueprint/schematic.
 */
export default function RadarMap({
  radiusMi,
  activeId,
  onActiveChange,
}: {
  radiusMi: number;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
}) {
  const reduced = useReducedMotion();
  const diameterPct = coverageDiameterPct(radiusMi);
  const active = SELLERS.find((s) => s.id === activeId) ?? null;
  const activeInRange = active ? active.distanceMi <= radiusMi : false;

  return (
    <div className="relative aspect-square w-full overflow-visible rounded-[28px] border border-white/10 bg-[#101019]">
      {/* Coverage wash — a solid soft fill, not a stroked ring, so this reads as
          an editorial device rather than a blueprint/schematic radar sweep. */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F46E5]/15 transition-[width,height] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${diameterPct}%`, height: `${diameterPct}%` }}
        aria-hidden="true"
      />

      {/* "You" marker, fixed at center */}
      <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-[#4F46E5]/30 blur-md" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-[#A5B4FC]/70" />
      </div>

      {SELLERS.map((seller) => {
        const { leftPct, topPct } = pinPosition(seller);
        const inRange = seller.distanceMi <= radiusMi;
        const isActive = seller.id === activeId;
        return (
          <motion.button
            key={seller.id}
            type="button"
            onMouseEnter={() => onActiveChange(seller.id)}
            onMouseLeave={() => onActiveChange(null)}
            onFocus={() => onActiveChange(seller.id)}
            onBlur={() => onActiveChange(null)}
            onClick={() => onActiveChange(isActive ? null : seller.id)}
            className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5B4FC] ${
              isActive ? "z-20" : "z-10"
            }`}
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            animate={{
              scale: isActive ? 1.3 : inRange ? 1 : 0.72,
              opacity: inRange ? 1 : 0.55,
            }}
            transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
            aria-label={`${seller.name}, ${seller.category}, ${seller.distanceMi} miles away — ${
              inRange ? "within your search radius" : "outside your search radius"
            }`}
          >
            <span
              className={`block rounded-full ${
                inRange ? "h-3 w-3 bg-[#4F46E5] ring-2 ring-white/70" : "h-2 w-2 bg-zinc-600"
              }`}
            />
          </motion.button>
        );
      })}

      {active ? (
        <div
          role="status"
          className="pointer-events-none absolute left-1/2 top-[5%] w-[210px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0B0B0F] px-3.5 py-2.5 text-left shadow-lg shadow-black/50"
        >
          <p className="text-sm font-semibold text-white">{active.name}</p>
          <p className="mt-0.5 text-xs font-normal text-zinc-400">
            {active.category} · {active.distanceMi} mi away
          </p>
          <p className={`mt-1 text-xs font-semibold ${activeInRange ? "text-[#A5B4FC]" : "text-zinc-400"}`}>
            {activeInRange ? "Within your radius" : "Outside your radius"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
