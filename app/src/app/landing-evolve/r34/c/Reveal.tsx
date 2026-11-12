"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useMounted } from "./useMounted";

/**
 * Scroll-reveal wrapper — the route's "scroll trigger" interaction.
 * Server-rendered and first-paint output is always the plain, fully
 * visible element below (never `opacity: 0`), because `mounted` is
 * `false` until after hydration. Only once mounted, and only when the
 * viewer has not asked for reduced motion, does this swap to a
 * `framer-motion` element whose `initial` opacity exists purely client-side
 * — so a reduced-motion viewer, or one who never gets JS, never sees a
 * stuck-invisible section.
 */
export default function Reveal({
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
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
