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
 * `useReducedMotion()` alone so a `framer-motion` element's
 * `initial={{ opacity: 0 }}` prop never ships as literal `opacity:0` in the
 * server-rendered HTML.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
