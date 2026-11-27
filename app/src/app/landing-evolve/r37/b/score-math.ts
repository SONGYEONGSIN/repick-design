// app/src/app/landing-evolve/r37/b/score-math.ts
//
// Every derived number on this route — the hero's Trust Score card, the
// value section's LIVE column, and the closing CTA's sentence — runs
// through `trustScoreState` against the one `inspected` Set lifted in
// LandingPage.tsx. There is no second, independently-typed trust figure
// anywhere that could drift out of sync.

import { STEP_SCORE, STEPS, type Product, type StepId } from "./data";

export const ALL_STEP_IDS: StepId[] = STEPS.map((s) => s.id);
export const TOTAL_STEPS = STEPS.length;

export interface TrustScoreState {
  /** How many distinct steps have ever been opened, 0..4. Never decreases. */
  inspectedCount: number;
  /** The running average of the inspected steps' own scores, or `null` if none have been opened yet. */
  score: number | null;
  /** True once every step has been inspected at least once — the score is then final, not partial. */
  resolved: boolean;
}

/**
 * The Trust Score is a genuine running average: it only ever includes the
 * scores of steps the viewer has actually opened at least once, in whatever
 * order they opened them. One step inspected shows that step's own score
 * verbatim; two or three show a real mean of exactly those; all four shows
 * the final, resolved figure. There is no hidden floor or decorative
 * animation — closing a panel again does not remove its step from the set,
 * so the score never regresses once earned.
 */
export function trustScoreState(inspected: ReadonlySet<StepId>): TrustScoreState {
  const inspectedCount = inspected.size;
  if (inspectedCount === 0) {
    return { inspectedCount, score: null, resolved: false };
  }
  const sum = [...inspected].reduce((acc, id) => acc + STEP_SCORE[id], 0);
  const score = Math.round(sum / inspectedCount);
  return { inspectedCount, score, resolved: inspectedCount === TOTAL_STEPS };
}

/**
 * The sentence fragment shared by the hero card and the closing CTA so the
 * two never describe the same state two different ways.
 */
export function trustScoreLabel(state: TrustScoreState): string {
  if (state.score === null) {
    return "Inspect a step below to start building the trust score.";
  }
  if (state.resolved) {
    return `${state.score}% verified — all 4 steps inspected.`;
  }
  return `${state.score}% building — ${state.inspectedCount}/4 steps inspected.`;
}

export function discountPercent(p: Pick<Product, "price" | "originalPrice">): number {
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
