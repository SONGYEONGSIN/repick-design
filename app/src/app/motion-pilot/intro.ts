"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * The intro curtain's one decision: does this visit get the loading sequence, or does the page
 * arrive already open?
 *
 * The sequence is a second clock, and §2 of `vault/00-principles/brief-scene.md` allows the scene
 * exactly one. It survives that rule by being a *mount transition* rather than a running term: under
 * capture and reduced motion it does not run at all, so the frozen frame is identical to what it was
 * before the curtain existed. That is stricter than pinning it to 0 — there is nothing left to pin.
 *
 * Skipping it under capture is not only a determinism nicety. `scripts/capture-shots.mjs` waits
 * roughly 2.9s before its first screenshot (networkidle + 600ms, a scroll-through pass, then 700ms
 * at the offset); a ~1.9s curtain plus a 0.5s hero reveal lands inside that window by a margin too
 * thin to trust across machines. Skipped, the timing question does not arise.
 */

/** Milliseconds from mount to the hero starting its reveal — the curtain is fully lifted by then. */
export const INTRO_MS = 1900;

/** Phase names are load-bearing: `SiteLoader` renders nothing at all once the phase is `reveal`. */
export type IntroPhase = "load" | "reveal";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server — the standard isomorphic guard. The
 * distinction matters here: on a frozen page the effect flips to `reveal`, and only the layout
 * variant does that *before paint*, so the capture pipeline never sees a frame of black curtain.
 */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function skipIntro(): boolean {
  if (typeof window === "undefined") return false;
  const frozen = Boolean((window as unknown as { __SPECIMEN_FREEZE__?: boolean }).__SPECIMEN_FREEZE__);
  return frozen || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useIntro(): IntroPhase {
  // Always "load" on the server so the markup is stable; the effect below decides in one tick.
  const [phase, setPhase] = useState<IntroPhase>("load");

  useIsoLayoutEffect(() => {
    if (skipIntro()) {
      setPhase("reveal");
      return;
    }
    const timer = window.setTimeout(() => setPhase("reveal"), INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return phase;
}
