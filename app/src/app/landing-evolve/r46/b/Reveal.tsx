"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "./hooks";

/**
 * Scroll-triggered fade-up, gated by the mount-correct usePrefersReducedMotion hook rather than
 * framer-motion's own useReducedMotion(). `data-reveal` is also targeted by a plain CSS media
 * query declared once in page.tsx (`@media (prefers-reduced-motion: reduce)`), which forces
 * opacity/transform to their resting values independently of when React hydrates — a safety net
 * so a reduced-motion visitor never sees a flash of `opacity: 0` while JavaScript is still
 * loading, not only after the hook resolves.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      data-reveal
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
