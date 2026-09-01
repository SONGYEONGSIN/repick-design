"use client";

import { motion, useReducedMotion } from "framer-motion";
import { arcLength, arcPath, clamp, GAUGE_END_DEG, GAUGE_START_DEG, GAUGE_SWEEP_DEG, polarToCartesian, r2 } from "./gauge-math";

const CX = 140;
const CY = 140;
const RADIUS = 100;
const STROKE = 14;
const TRACK_PATH = arcPath(CX, CY, RADIUS, GAUGE_START_DEG, GAUGE_END_DEG);
const FULL_LENGTH = arcLength(RADIUS, GAUGE_SWEEP_DEG);
const TICK_VALUES = [0, 25, 50, 75, 100];

function tickPositions(value: number) {
  const angle = GAUGE_START_DEG + (value / 100) * GAUGE_SWEEP_DEG;
  const inner = polarToCartesian(CX, CY, RADIUS - STROKE / 2 - 6, angle);
  const outer = polarToCartesian(CX, CY, RADIUS - STROKE / 2 - 1, angle);
  return { inner, outer };
}

export function Gauge({ value, accent }: { value: number; accent: string }) {
  const reduceMotion = useReducedMotion();
  const pct = clamp(value, 0, 100) / 100;
  const offset = r2(FULL_LENGTH - FULL_LENGTH * pct);

  return (
    <div className="relative w-full max-w-[280px]">
      <svg viewBox="0 0 280 230" className="w-full" aria-hidden="true">
        {/* Neutral track — the full 270deg sweep, always visible so the scale itself reads at rest. */}
        <path d={TRACK_PATH} fill="none" stroke="#27272E" strokeWidth={STROKE} strokeLinecap="round" />

        {/* Tick marks at 0/25/50/75/100 for console-style calibration. */}
        {TICK_VALUES.map((t) => {
          const { inner, outer } = tickPositions(t);
          return (
            <line
              key={t}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#4B4B54"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Value arc — same path as the track, revealed via strokeDashoffset so we never recompute
            the `d` attribute on every slider tick (only the offset changes). */}
        <motion.path
          d={TRACK_PATH}
          fill="none"
          stroke={accent}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${FULL_LENGTH} ${FULL_LENGTH}`}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 18 }}
        />
      </svg>

      {/* Numeric readout lives on top of the arc — color is never the only signal for the score. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 text-center">
        <span
          className="tabular-nums text-white leading-none"
          style={{ fontFamily: "var(--font-display-grotesk)", fontWeight: 800, fontSize: "64px" }}
          aria-live="polite"
        >
          {value.toFixed(1)}
        </span>
        <span className="mt-1 text-[11px] uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.16em" }}>
          / 100 composite
        </span>
      </div>
    </div>
  );
}
