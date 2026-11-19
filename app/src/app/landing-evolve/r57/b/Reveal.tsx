"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered entrance used by every section below the hero. The
 * resting styles ARE the finished state; when motion is reduced, `initial`
 * is skipped entirely (`false`) so the element renders already-visible
 * instead of being left at a permanent `opacity: 0`.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}
