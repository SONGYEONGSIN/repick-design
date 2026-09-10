"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, CircleDashed, ClipboardCheck, Scale, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { ACCENT_HEX, ACCENT_TINT, cx, NUM } from "./tokens";

const PILL = "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap";
const PLAIN_PILL = "inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-normal leading-none whitespace-nowrap text-zinc-600";

/** Every badge below mounts and unmounts on framer's `AnimatePresence` (driven from ProductCard) —
 * this one entrance/exit pair is shared so a badge appearing at its real stage always announces
 * itself the same way: fade + a small rise, opacity/transform only, well under the 250ms ceiling. */
export function BadgePop({ children, layoutId }: { children: ReactNode; layoutId?: string }) {
  const reduceMotion = Boolean(useReducedMotion());
  return (
    <motion.span
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 4, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.94 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
      layoutId={layoutId}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
}

export function SelfReportChip({ condition }: { condition: string }) {
  return (
    <span className={PLAIN_PILL}>
      <CircleDashed size={11} aria-hidden="true" />
      Self-reported: {condition}
    </span>
  );
}

export function InspectedChip() {
  return (
    <span className={PLAIN_PILL}>
      <ClipboardCheck size={11} aria-hidden="true" />
      Physically inspected
    </span>
  );
}

export function GradeBadge({ grade, score }: { grade: string; score: number }) {
  return (
    <span className={cx(PILL, "border-zinc-300 bg-white text-zinc-800")}>
      <Scale size={11} aria-hidden="true" />
      Grade {grade} <span className={NUM}>· {score.toFixed(1)}/10</span>
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className={cx(PILL, "border-transparent text-white")} style={{ backgroundColor: ACCENT_HEX }}>
      <BadgeCheck size={11} aria-hidden="true" />
      Verified
    </span>
  );
}

export function MatchBadge({ pct }: { pct: number }) {
  return (
    <span className={cx(PILL, ACCENT_TINT)}>
      <Sparkles size={11} aria-hidden="true" />
      <span className={NUM}>{pct}%</span> AI match
    </span>
  );
}
