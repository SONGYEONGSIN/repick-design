"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useMounted } from "./useMounted";

/**
 * Scroll-triggered reveal, mount-gated. Before hydration (and for a visitor with
 * `prefers-reduced-motion`), content renders at its resting, fully-visible state — never a
 * server-shipped `opacity:0` waiting on an observer that might not fire in time, and never an
 * entrance that leaves `opacity:0` as the permanent resting state. Asymmetric timing: the
 * entrance eases out slower than it would ease back in, so nothing in this page uses a linear or
 * symmetric curve.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = mounted && !reduceMotion;

  return (
    <motion.div
      className={className}
      initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
