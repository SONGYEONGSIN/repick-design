'use client';

import { ReactNode, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Hydration-aware "has mounted" flag. The server snapshot and client snapshot
// deliberately differ, so React treats the first client render after
// hydration as a change and re-renders — this is the standard
// useSyncExternalStore trick for mount-gating client-only behavior without a
// useEffect + useState flicker, and without ever telling the server to ship
// opacity:0 on content a no-JS visitor needs to see.
function subscribeNever() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribeNever, getClientSnapshot, getServerSnapshot);
}

/**
 * Scroll-reveal wrapper. On the server, and until the page has hydrated, or
 * when the visitor prefers reduced motion, this renders a plain static div
 * at full opacity — content is never invisible for a no-JS or slow-hydration
 * visitor. Only once mounted in a no-preference environment does it animate.
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
  const hasMounted = useHasMounted();
  const reducedMotion = useReducedMotion();

  if (!hasMounted || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
