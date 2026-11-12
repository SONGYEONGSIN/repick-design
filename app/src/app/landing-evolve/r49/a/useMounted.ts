"use client";

import { useSyncExternalStore } from "react";

function noopSubscribe() {
  return () => {};
}

function clientSnapshot() {
  return true;
}

function serverSnapshot() {
  return false;
}

/**
 * Resolves `true` only once this component has hydrated on the client. Used to gate
 * `whileInView` / `initial={{ opacity: 0 }}` reveals so the server-rendered HTML
 * never ships a literal unresolved `opacity: 0` — the pre-hydration paint, and any
 * visitor whose browser never fires the hydration event, always get the plain,
 * fully-visible branch instead.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);
}
