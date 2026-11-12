"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  // Nothing ever changes after mount, so there is nothing to notify.
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * True only once the component has hydrated on the client. Used to gate
 * `whileInView` / `initial={{opacity:0}}` reveals so server-rendered HTML
 * never ships literal `opacity:0`. `useSyncExternalStore` reads its
 * snapshot during render itself — no `useEffect`, nothing to flag as a
 * cascading-render pattern, and SSR-safe by construction since the server
 * snapshot is always `false`. Deliberately not relying on
 * `useReducedMotion()` alone, which is falsy during SSR regardless of the
 * viewer's real preference.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
