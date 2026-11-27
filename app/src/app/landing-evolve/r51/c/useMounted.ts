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
 * True only once this component has hydrated on the client. Gates `whileInView`/`initial`
 * reveals so the server-rendered HTML never ships a literal unresolved `opacity:0` -- reduced
 * motion viewers and the pre-hydration paint always get the plain, fully-visible branch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
