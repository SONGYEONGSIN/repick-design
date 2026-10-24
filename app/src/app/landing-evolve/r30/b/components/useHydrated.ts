"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only after the client has hydrated and committed a render. Server snapshot is always
 * false, so SSR output never contains the "pre-animation" inline style a motion library would
 * otherwise bake into the markup (e.g. a literal opacity:0 on real content). `useReducedMotion()`
 * alone does not cover this — it is falsy/null during SSR too, which looks identical to "motion
 * is fine, go ahead and animate" and lets the opacity:0 ship anyway.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
