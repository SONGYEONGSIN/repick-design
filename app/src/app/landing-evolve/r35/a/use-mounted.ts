"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True only after hydration has completed. During SSR and the initial hydration pass this
 * returns `false` (matching the server snapshot), so any caller that gates a motion `initial`
 * prop on it renders the page's FINAL visible state in the server-rendered HTML — never a
 * literal `opacity:0` that a no-JS viewer would be stuck with.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
