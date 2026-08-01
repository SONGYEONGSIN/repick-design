"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * The opening curtain's one decision: does this visit get the shutter sequence, or does the page
 * arrive already open?
 *
 * A curtain is a second clock, and the scene profile allows exactly one. It survives that rule by
 * being a *mount transition* rather than a running term: under capture and under reduced motion it
 * does not mount at all, so the frozen frame is byte-identical to a page that never had a curtain.
 * That is stricter than pinning it to zero — nothing is left to pin.
 *
 * Kept short for the same reason. The capture pipeline takes its first shot roughly 2.9s in; a
 * curtain that eats most of that window is a timing bet across machines, and this one does not run
 * during capture anyway.
 */

/** Milliseconds from mount to the hero starting its reveal — the curtain is fully lifted by then. */
export const INTRO_MS = 1300;

/** Phase names are load-bearing: `ShutterLoader` renders nothing at all once the phase is `open`. */
export type IntroPhase = "closed" | "open";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server. The distinction matters: on a frozen
 * page the effect flips the phase, and only the layout variant does that *before paint*, so a
 * capture never catches a frame of black curtain.
 */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function skipIntro(): boolean {
  if (typeof window === "undefined") return false;
  const frozen = Boolean((window as unknown as { __SPECIMEN_FREEZE__?: boolean }).__SPECIMEN_FREEZE__);
  return frozen || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useIntro(): IntroPhase {
  // Always "closed" on the server so the markup is stable; the effect decides in one tick.
  const [phase, setPhase] = useState<IntroPhase>("closed");

  useIsoLayoutEffect(() => {
    if (skipIntro()) {
      setPhase("open");
      return;
    }
    const timer = window.setTimeout(() => setPhase("open"), INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return phase;
}
