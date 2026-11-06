"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Reduced-motion check backed by useSyncExternalStore instead of framer-motion's own
 * useReducedMotion(). Framer's hook is state+effect based, so the very first client render
 * (pre-effect, i.e. the hydration pass) always reports `false` regardless of the real OS
 * setting — which is exactly the window where an `initial={{ opacity: 0 }}` reveal would still
 * flash invisible content at a reduced-motion visitor. useSyncExternalStore reads the real
 * media-query value synchronously as part of the same render React uses to reconcile against
 * the server markup, so there is no separate "wrong value, then corrected" tick for consumers
 * to render through.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
