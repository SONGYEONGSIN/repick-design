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

// Gates framer-motion's whileInView entrance so no `opacity: 0` is ever
// present in the server-rendered HTML a non-JS or pre-hydration view sees —
// before mount (or with reduced motion on), Reveal renders a plain, fully
// visible div instead of a motion.div with an initial state.
// useSyncExternalStore, not useState+useEffect — the latter calls setState
// synchronously inside an effect body, which this repo's lint config flags
// (react-hooks/set-state-in-effect) as a cascading-render risk even though
// this particular case only ever fires once. This is the repo's own
// established idiom for the same gate (landing-evolve/r34/a/useMounted.ts).
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
