"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COLOR } from "./theme";

// Shared focus-visible treatment. Deliberately avoids `ring-*`/`ring-offset-*`
// (render transparent in this project's Tailwind v4 build) and never pairs
// `outline-none` with a later `focus-visible:outline-*` (the earlier utility
// would cancel the later one via the shared --tw-outline-style variable).
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC369]";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Folio({ index, total, label }: { index: number; total: number; label: string }) {
  return (
    <div
      className="flex items-center gap-2 text-[11px] font-normal uppercase"
      style={{ color: COLOR.mutedDim, letterSpacing: "0.16em" }}
      aria-hidden="true"
    >
      <span>
        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="h-px w-6" style={{ background: COLOR.borderStrong }} />
      <span>{label}</span>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase"
      style={{ color: COLOR.accentBright, letterSpacing: "0.28em" }}
    >
      {children}
    </p>
  );
}

export function ConditionChip({ grade }: { grade: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] font-semibold"
      style={{ borderColor: COLOR.borderStrong, color: COLOR.fg, letterSpacing: "0.04em" }}
    >
      Grade {grade}
    </span>
  );
}

export function VerifiedChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: "rgba(245,158,11,0.14)", color: COLOR.accentBright, letterSpacing: "0.02em" }}
    >
      {label}
    </span>
  );
}

export function DiscountChip({ pct }: { pct: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: COLOR.accent, color: COLOR.inkOnAccent }}
    >
      {pct}% off list
    </span>
  );
}
