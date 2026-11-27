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
 * `whileInView`/`initial={{opacity:0}}` reveals so server-rendered HTML
 * never ships literal `opacity:0`. `useReducedMotion()` alone is never
 * relied on for this — it can be falsy during SSR, but `mounted` is always
 * `false` then too, so the plain, fully-visible branch wins regardless of
 * which signal resolves first.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
