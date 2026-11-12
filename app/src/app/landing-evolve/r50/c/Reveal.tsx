"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered entrance wrapper.
 *
 * `initial` (hidden) and `whileInView` (visible) never depend on the reduced-motion flag, so there
 * is no SSR/hydration race to get wrong: the element always starts hidden and the *same*
 * IntersectionObserver-driven `whileInView` transition always runs and always ends at full
 * opacity — including for an element that is already in view at mount, which still fires once the
 * observer attaches. The element can therefore never get stuck at opacity:0.
 *
 * `prefers-reduced-motion` only shortens that transition to effectively nothing (duration/offset
 * collapse to 0), rather than gating *whether* the element becomes visible at all.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion() === true;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
