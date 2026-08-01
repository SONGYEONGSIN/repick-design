"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * The opening curtain's one decision: does this visit get the loading sequence, or does the page
 * arrive already open?
 *
 * The scene is allowed exactly one clock (`brief-scene.md` §2) and the idle drift already spends it.
 * The curtain survives that rule by being a *mount transition* rather than a running term: under
 * capture and under reduced motion it is never mounted at all, so the frozen frame is identical to
 * what it would be if the curtain had never been written. That is stricter than pinning it to zero —
 * there is nothing left to pin.
 *
 * `useLayoutEffect` on the client so the decision lands before paint: a capture must never see a
 * frame of black sheet. And the curtain is deliberately shorter than the capture pipeline's first
 * screenshot wait (~2.9s), so even a mistake here would not be photographed mid-lift.
 */

/** Milliseconds from mount to the page being fully open. */
export const INTRO_MS = 1500;

export type IntroPhase = "load" | "open";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function skipIntro(): boolean {
  if (typeof window === "undefined") return false;
  const frozen = Boolean((window as unknown as { __SPECIMEN_FREEZE__?: boolean }).__SPECIMEN_FREEZE__);
  return frozen || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useIntro(): IntroPhase {
  // Always "load" on the server so the markup is stable; the effect decides in one tick.
  const [phase, setPhase] = useState<IntroPhase>("load");

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
