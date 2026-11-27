"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Scroll-triggered entrance. Animates only opacity/transform (never layout properties), runs once
 * per section (`viewport.once`), and is fully gated by `prefers-reduced-motion`: when reduced
 * motion is requested, `initial` is skipped entirely so the element never gets stuck at
 * `opacity: 0` — it renders at its final, visible style immediately instead of waiting for an
 * animation that will never (and should never) run.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
