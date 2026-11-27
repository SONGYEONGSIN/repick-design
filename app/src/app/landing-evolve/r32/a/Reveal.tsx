'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMounted } from './useMounted';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll-triggered reveal used everywhere EXCEPT the hero. Mount-gated via
 * useMounted (useSyncExternalStore) rather than useReducedMotion alone: on
 * the server, and for one tick on the client before hydration, `initial` is
 * simply omitted, so the server HTML never contains `opacity:0` and a
 * slow-hydration visitor still sees fully visible content on first paint.
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const skipAnimation = !mounted || reduceMotion;

  return (
    <motion.div
      className={className}
      initial={skipAnimation ? undefined : { opacity: 0, y: 20 }}
      whileInView={skipAnimation ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
