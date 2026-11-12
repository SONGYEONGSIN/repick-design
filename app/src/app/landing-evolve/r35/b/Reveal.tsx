"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMounted } from "./useMounted";

/**
 * Scroll-reveal wrapper for everything BELOW the hero only.
 *
 * Mount-gated via `useMounted()` (a `useSyncExternalStore` hydration check),
 * not `useReducedMotion()` alone: during SSR and the first hydration pass
 * `mounted` is false, so `initial` resolves to `false` and the element
 * renders in its final, fully visible state — no `opacity: 0` ever ships in
 * server HTML. Only after the client has taken over does `initial` become a
 * real hidden state for `whileInView` to animate from. Reduced-motion is
 * handled independently on top of that, not instead of it.
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
  const animated = mounted && !reduceMotion;

  return (
    <motion.div
      className={className}
      initial={animated ? { opacity: 0, y: 16 } : false}
      whileInView={animated ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
