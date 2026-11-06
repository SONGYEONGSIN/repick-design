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
 * True only after the client has mounted -- avoids an animated-from-hidden flash on first paint.
 * This repo's established idiom for this (landing-evolve/r34/a/useMounted.ts) uses
 * useSyncExternalStore rather than a useEffect+setState pair, which the lint gate flags as
 * react-hooks/set-state-in-effect (cascading-render risk).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
