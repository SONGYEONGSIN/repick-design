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
 * `whileInView` / `initial={{opacity:0}}` reveals so server-rendered HTML
 * never ships literal `opacity:0`.
 *
 * This is the fix for reassign-queue entry #12 (`auto-landing-r34/c`)
 * failure ①: the prior attempt's `Reveal.tsx` used
 * `useEffect(() => setMounted(true))`, which this repo's lint flags as
 * `react-hooks/set-state-in-effect` (a cascading-render pattern — a
 * passive effect whose only job is to synchronously schedule a second
 * render). `useSyncExternalStore` reads a snapshot during render itself,
 * so there is no effect and nothing to flag, and it is SSR-safe by
 * construction: the server snapshot is always `false`.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
