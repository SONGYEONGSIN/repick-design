"use client";

import { BadgeCheck, Scale } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cx } from "./tokens";

const PILL = "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap";

export function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className={cx(PILL, "border-zinc-200 bg-zinc-50 text-zinc-700")}>
      <Scale size={11} aria-hidden="true" />
      Grade {grade}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className={cx(PILL, "border-zinc-200 bg-zinc-50 text-zinc-700")}>
      <BadgeCheck size={11} aria-hidden="true" />
      Verified seller
    </span>
  );
}

export function MatchBadge({ match }: { match: number }) {
  return <span className={cx(PILL, "border-amber-200 bg-amber-50 text-[#92400E]")}>{match}% AI match</span>;
}

/** Small "live" indicator — a pulsing dot next to an eyebrow label. Reduced-motion swaps the pulse
 * for a static dot rather than leaving it stuck mid-animation. */
export function LiveDot() {
  const reduce = useReducedMotion();
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      {!reduce && (
        <motion.span
          className="absolute inset-0 rounded-full bg-[#92400E]"
          animate={{ opacity: [0.55, 0, 0.55], scale: [1, 1.9, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#92400E]" />
    </span>
  );
}
