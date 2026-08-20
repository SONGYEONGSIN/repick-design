"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered entrance used by the below-fold sections. Reduced motion is honoured by rendering
 * a plain, already-visible element — never an `opacity:0` shell waiting on a callback. The branch is
 * safe for hydration: `useReducedMotion()` returns `null` on the server AND on the first client
 * render, so both produce the `motion.div` and only settle to the static branch after mount, once the
 * user's preference is actually known.
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
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
