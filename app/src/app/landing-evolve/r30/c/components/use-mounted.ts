"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  // No-op: mount status never changes after it flips true, so there is
  // nothing to react to beyond the one transition `getSnapshot` reports.
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * Hydration-aware mount gate. Returns `false` during SSR and the first
 * client render, then `true` once hydration has completed. Used instead of
 * `useReducedMotion()` alone to decide when it is safe to mount a
 * `framer-motion` element with an `initial={{ opacity: 0 }}` prop — that
 * value is falsy/null during SSR and will not stop the literal `opacity:0`
 * from shipping in the server-rendered HTML otherwise.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
