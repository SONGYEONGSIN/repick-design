"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion } from "framer-motion";

// Hydration-aware mount gate. useReducedMotion() alone is falsy during SSR, which would ship
// initial={opacity:0} as literal inline opacity:0 in the server HTML. useSyncExternalStore's
// server/client snapshot split avoids that: the server (and the first client render, which must
// match it) gets `false`, so the real content paints immediately; only once React has reconciled
// past hydration does the snapshot flip to `true` and the motion variant take over.
const emptySubscribe = () => () => {};

function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function useReducedMotionPreference(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotionPreference();

  if (!hydrated || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
