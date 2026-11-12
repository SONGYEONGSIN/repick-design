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
 * True once this has rendered on the client past hydration. The server
 * snapshot (false) is what SSR/first-paint HTML reconciles against, so the
 * "animated" markup — and any literal opacity:0 — never ships without JS.
 */
function useHydrated() {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}

/**
 * Scroll-reveal wrapper, safe for no-JS / slow-hydration visitors: content
 * is visible by default and only gains the fade + y-offset entrance once
 * we know we're hydrated on the client AND the visitor hasn't asked for
 * reduced motion.
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
      initial={animate ? { opacity: 0, y: 14 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
