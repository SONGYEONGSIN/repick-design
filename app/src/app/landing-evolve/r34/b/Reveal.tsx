"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Subscribes to nothing — this exists purely to get a value guaranteed `false` during SSR and the
// first client hydration pass (so server/client markup matches), then `true` once hydration is
// confirmed done, well before a visitor could have scrolled anywhere. That lets the swap from a
// plain, fully-visible <div> to a real <motion.div> happen invisibly, so a no-JS or slow-hydration
// visitor never sees a stuck `opacity:0`.
function subscribe(): () => void {
  return () => {};
}
function getClientSnapshot(): boolean {
  return true;
}
function getServerSnapshot(): boolean {
  return false;
}
function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const mounted = useMounted();
  const reducedMotion = useReducedMotion();

  if (!mounted || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
