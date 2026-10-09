"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

function subscribeNoop() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

/**
 * True once this has rendered on the client past hydration. React is
 * required to reconcile the server snapshot (false) on the very first
 * client pass, then flips to the client snapshot (true) right after —
 * so the SSR/first-paint HTML never contains the "animated" markup.
 */
function useHydrated() {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}

/**
 * Scroll-reveal wrapper that is safe for no-JS / slow-hydration visitors:
 * it never ships a literal opacity:0 in server-rendered HTML. Content is
 * visible by default and only gains the reveal animation once we know
 * we're hydrated on the client AND the visitor hasn't asked for reduced
 * motion.
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
  const hydrated = useHydrated();
  const prefersReduced = useReducedMotion();
  const animate = hydrated && !prefersReduced;

  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, y: 18 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
