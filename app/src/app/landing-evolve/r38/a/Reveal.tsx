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
 * Scroll-triggered reveal used everywhere except the hero (whose device and
 * proof must be visible with zero scroll and zero animation gating).
 * Mount-gated via useMounted rather than useReducedMotion alone, so the
 * server-rendered HTML never contains a literal opacity:0.
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const skipAnimation = !mounted || reduceMotion;

  return (
    <motion.div
      className={className}
      initial={skipAnimation ? undefined : { opacity: 0, y: 14 }}
      whileInView={skipAnimation ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
