"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * True only once this component has hydrated on the client. Gates
 * `whileInView`/`initial={{opacity:0}}` reveals so the server-rendered HTML never
 * ships a literal unresolved `opacity:0` — pre-hydration paint and any visitor whose
 * browser never fires the hydration event always get the plain, fully-visible branch.
 * Separate from `usePrefersReducedMotion`, which gates the race animation itself.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
