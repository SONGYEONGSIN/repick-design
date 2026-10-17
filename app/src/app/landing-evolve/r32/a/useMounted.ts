'use client';

import { useSyncExternalStore } from 'react';

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
 * `whileInView`/`initial={{opacity:0}}` reveals so server-rendered HTML never
 * ships literal `opacity:0` — a slow-hydration or no-JS visitor still sees
 * fully visible content on first paint.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
