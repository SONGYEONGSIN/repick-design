"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useMounted } from "./use-mounted";

/**
 * Scroll-triggered entrance wrapper for everything BELOW the hero. Before hydration finishes,
 * this renders a plain static `<div>` in the page's finished state — no `initial` prop, no
 * `opacity:0` ships in server HTML, so no-JS viewers get the full content immediately. Only
 * once `useMounted()` flips true does the component swap to a fresh `motion.div` instance with
 * its own `initial`/`whileInView`, so the entrance plays (once) as it scrolls into view. The
 * hero itself never imports this component, by design.
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

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
