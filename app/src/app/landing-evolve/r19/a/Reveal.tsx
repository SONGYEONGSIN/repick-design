"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Scroll-triggered entrance that can never end up permanently invisible.
//
// framer-motion bakes `initial` values into the server-rendered `style` attribute so client and
// server markup match before hydration — if `initial` touched opacity, a page whose JS never
// hydrates (or fails) would render with `opacity:0` forever. This component sidesteps that by
// construction: it only ever animates `y` (a bounded, small offset). Content is always fully
// opaque, in-flow and readable even with zero JS running; the only thing JS adds is the last 16px
// of a settle-in motion, which `prefers-reduced-motion` also removes entirely.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
