"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ACCENT_DEEP, BORDER, MUTED } from "./data";

// Focus ring used on every interactive element in this route. Deliberately avoids the two dead
// idioms called out in the brief: no `ring-offset-*` (renders transparent in this Tailwind v4
// setup) and no `outline-none` placed before a later `focus-visible:outline-*` utility (the two
// cancel via the shared `--tw-outline-style` custom property). This is a plain box-shadow ring —
// the pattern the brief confirms actually paints — plus a border-color swap as a second, redundant
// visual change so focus is never carried by a single fragile property.
export const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#8F5D12] focus-visible:border-[#8F5D12]";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block text-[11px] font-semibold uppercase"
      style={{ color: ACCENT_DEEP, letterSpacing: "0.28em" }}
    >
      {children}
    </span>
  );
}

export function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`text-[11px] font-semibold uppercase ${className}`}
      style={{ color: MUTED, letterSpacing: "0.16em" }}
    >
      {children}
    </span>
  );
}

export function StatLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="block text-[10px] font-semibold uppercase"
      style={{ color: MUTED, letterSpacing: "0.12em" }}
    >
      {children}
    </span>
  );
}

export function Folio({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[13px] font-semibold"
      style={{ color: MUTED, letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums" }}
    >
      {children}
    </span>
  );
}

export function Divider() {
  return <div className="h-px w-full" style={{ backgroundColor: BORDER }} />;
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Scroll-triggered entrance. When the viewer prefers reduced motion we render the *finished* state
 * as both `initial` and `animate` (not just skip the transition) so nothing is ever left stuck at
 * opacity:0 — the documented failure mode for reduced-motion entrance animation.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
