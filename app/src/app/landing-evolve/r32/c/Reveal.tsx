'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Hydration-safe "is this client-rendered yet" check. `useSyncExternalStore`
// is the one hook built for exactly this: it must return the SAME value on
// the server and on the very first client render (so hydration can never
// mismatch), then flips to the client value as soon as React has control —
// with no `setState` call inside a `useEffect` body anywhere.
function subscribeNever() {
  return () => {};
}
function useMounted(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Scroll-triggered entrance used ONLY outside the hero. `initial` is set to
 * `false` (not an opacity:0 object) whenever the page isn't safely mounted
 * on the client yet, or the viewer prefers reduced motion — so the
 * server-rendered HTML never ships an inline `opacity:0`/`transform` style,
 * and a no-JS or slow-hydration visitor always sees fully visible content.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const canAnimate = mounted && !reduceMotion;

  return (
    <motion.div
      className={className}
      initial={canAnimate ? { opacity: 0, y: 18 } : false}
      whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
