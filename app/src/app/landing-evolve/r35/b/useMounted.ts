"use client";

import { useSyncExternalStore } from "react";

// No-op subscribe: this value never changes after the client snapshot is
// read once, so there is nothing to subscribe to — only the server/client
// snapshot difference matters.
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
 * Hydration-aware "has the client taken over yet" flag.
 *
 * During SSR (and the first hydration pass, which must match the server
 * output) this returns false, so any caller gating a Framer Motion `initial`
 * prop on it renders the FINAL visible state and never ships a literal
 * `opacity: 0` in server HTML. Once the client commits, it flips to true and
 * entrance animations are free to run.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
