"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useHydrated } from "./useHydrated";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Scroll-reveal wrapper. Gated on hydration (not just useReducedMotion) so server-rendered HTML
 * never ships a literal opacity:0 — see useHydrated for why that check alone is not sufficient.
 * When motion is reduced or the page has not hydrated yet, `initial` is `false`, which tells
 * framer-motion to skip the "from" state entirely and render the resting (visible) style.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = hydrated && !reduceMotion;

  return (
    <motion.div
      className={className}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
