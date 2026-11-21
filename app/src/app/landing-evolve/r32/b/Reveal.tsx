"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Subscribes to nothing — this exists purely to get a value that is guaranteed to be `false`
// during SSR and during the first client hydration pass (so the two match, no mismatch
// warning), then flips to `true` once React confirms hydration is done. That flip happens
// well before a user could have scrolled to below-the-fold content, so the swap from a plain
// <div> to a real <motion.div> below is invisible in practice but is what makes the
// whileInView entrance a genuine *client-only* mount rather than something baked into the
// server HTML as `opacity:0`.
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

/**
 * Scroll-triggered reveal for everything below the hero. Renders a plain, fully-visible
 * <div> on the server and on the very first client paint (so a no-JS or slow-hydration
 * visitor never sees `opacity:0`), then swaps to an animated motion.div once mounted and
 * only if the visitor hasn't asked for reduced motion.
 */
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
