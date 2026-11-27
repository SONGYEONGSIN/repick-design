"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMounted } from "./useMounted";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Scroll-triggered fade/rise used below the hero. Hydration-gated via `useMounted`
 * (useSyncExternalStore-based) — until the client has mounted, this renders the
 * plain, fully-visible element with no `initial` prop at all, so the server-rendered
 * HTML never ships a literal `opacity: 0`. Also checks `usePrefersReducedMotion`
 * independently, so a reduced-motion visitor gets the same fully-visible,
 * non-animated element even after hydration completes. Animates only
 * transform/opacity (never width/height/top/left), entrance under 250ms-ish.
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
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();

  if (!mounted || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.22, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
