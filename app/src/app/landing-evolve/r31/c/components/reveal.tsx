"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useMounted } from "./use-mounted";

/**
 * Scroll-reveal wrapper. Server-rendered and first-paint output is always
 * the plain, fully visible `<div>` below — never `opacity: 0` — because
 * `mounted` is `false` until hydration completes. Only after mount, and
 * only when the viewer has not asked for reduced motion, does this swap to
 * a `framer-motion` element whose `initial` opacity exists purely on the
 * client.
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
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (!mounted || reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
