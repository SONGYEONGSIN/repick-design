"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ACCENT, NEUTRAL_FILL, WINNER_FILL, type LeaderId } from "./data";

/**
 * Two pans + one connecting beam, rotating together around a static
 * fulcrum — a literal balance scale, not a single-needle gauge. `tilt`
 * (degrees) comes from the live weighted-score difference computed in
 * data.ts; this component only renders it.
 *
 * The two faint travel-limit ticks mark where the right pan sits at the
 * ±16° clamp. They're fixed geometry, computed by hand once and rounded to
 * 2 decimals (not left as a live SVG `rotate()` attribute) so server and
 * client markup match exactly:
 *   pivot = (150, 70), beam half-length dx = 95
 *   point(θ) = (150 + dx·cos θ, 70 + dx·sin θ)
 *   θ =  16°: cos=0.9613, sin=0.2756 → dx'=91.32, dy'=26.18 → (241.32, 96.18)
 *   θ = −16°: cos=0.9613, sin=−0.2756 → dx'=91.32, dy'=−26.18 → (241.32, 43.82)
 */
export default function BalanceBeam({ tilt, leaderId }: { tilt: number; leaderId: LeaderId }) {
  const reduced = useReducedMotion();
  const leftFill = leaderId === "left" ? WINNER_FILL : NEUTRAL_FILL;
  const rightFill = leaderId === "right" ? WINNER_FILL : NEUTRAL_FILL;

  return (
    <svg viewBox="0 0 300 175" className="h-auto w-full max-w-[220px]" aria-hidden="true" focusable="false">
      {/* travel-limit reference, static */}
      <path
        d="M 241.32 96.18 A 95 95 0 0 1 241.32 43.82"
        fill="none"
        stroke="#E4E4E7"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <circle cx="241.32" cy="96.18" r="2" fill="#D4D4D8" />
      <circle cx="241.32" cy="43.82" r="2" fill="#D4D4D8" />

      {/* level reference, static */}
      <line x1="30" y1="70" x2="270" y2="70" stroke="#E4E4E7" strokeWidth="1" strokeDasharray="4 4" />

      {/* stand + base, static */}
      <line x1="150" y1="70" x2="150" y2="145" stroke="#A1A1AA" strokeWidth="4" strokeLinecap="round" />
      <polygon points="128,158 172,158 150,145" fill="#D4D4D8" stroke="#A1A1AA" strokeWidth="1" />

      {/* beam + pans — the only part that rotates */}
      <motion.g
        style={{ transformOrigin: "150px 70px" }}
        initial={{ rotate: tilt }}
        animate={{ rotate: tilt }}
        transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
      >
        <line x1="55" y1="70" x2="245" y2="70" stroke="#3F3F46" strokeWidth="6" strokeLinecap="round" />
        <line x1="55" y1="70" x2="55" y2="94" stroke="#A1A1AA" strokeWidth="3" />
        <line x1="245" y1="70" x2="245" y2="94" stroke="#A1A1AA" strokeWidth="3" />
        <rect x="27" y="94" width="56" height="16" rx="6" fill={leftFill} stroke="#71717A" strokeWidth="1" />
        <rect x="217" y="94" width="56" height="16" rx="6" fill={rightFill} stroke="#71717A" strokeWidth="1" />
      </motion.g>

      {/* fulcrum pin, static, drawn on top */}
      <circle cx="150" cy="70" r="5" fill={ACCENT} stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
}
