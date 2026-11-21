// Pure, deterministic negotiation math. The two handle positions (offer, ask) are the only state
// this route keeps — the gap, its percentage, the outcome label, the closing-CTA sentence, and the
// hero listing's live discount are all derived from them in render, never cached or duplicated.

export const MAX_PRICE = 800;
export const STEP = 10;
export const BIG_STEP = 50;

export const DEFAULT_OFFER = 420;
export const DEFAULT_ASK = 620;

/** How much of the ask the gap has to be before it's "too wide" rather than "likely". */
export const GAP_THRESHOLD_PCT = 0.08;

export type Outcome = "too-wide" | "likely" | "at-or-above-ask";

export interface Negotiation {
  offer: number;
  ask: number;
  /** ask - offer, signed: negative once the offer reaches or passes the ask. */
  gap: number;
  /** gap as a share of the ask; negative once the offer reaches or passes the ask. */
  gapPct: number;
  outcome: Outcome;
}

/** Clamp a dragged/typed/nudged handle value onto the fixed $0–MAX_PRICE axis, snapped to STEP. */
export function clampPrice(raw: number): number {
  const snapped = Math.round(raw / STEP) * STEP;
  return Math.min(MAX_PRICE, Math.max(0, snapped));
}

/**
 * The one function every displayed number and label in this route runs through. Both handles feed
 * it; the outcome is a real threshold on the resulting percentage, not a lookup keyed on one input.
 */
export function computeNegotiation(offer: number, ask: number): Negotiation {
  const gap = ask - offer;
  const gapPct = ask > 0 ? gap / ask : 0;
  let outcome: Outcome;
  if (gap <= 0) outcome = "at-or-above-ask";
  else if (gapPct <= GAP_THRESHOLD_PCT) outcome = "likely";
  else outcome = "too-wide";
  return { offer, ask, gap, gapPct, outcome };
}

export function outcomeLabel(outcome: Outcome): string {
  switch (outcome) {
    case "too-wide":
      return "Gap too wide";
    case "likely":
      return "Likely to be accepted";
    case "at-or-above-ask":
      return "At or above ask";
  }
}

/** One sentence restating the live gap — used in the hero chrome, value cards, and closing CTA, so
 *  all three always agree because all three call this same function on the same two numbers. */
export function outcomeSummary(result: Negotiation): string {
  const { gap, outcome } = result;
  if (outcome === "at-or-above-ask") {
    return gap === 0
      ? "Your offer matches the asking price exactly — this one is ready to send."
      : `Your offer already clears the ask by ${formatUsd(Math.abs(gap))} — this one is ready to send.`;
  }
  if (outcome === "likely") {
    return `You're ${formatUsd(gap)} apart — close enough that sellers like this one often say yes.`;
  }
  return `You're ${formatUsd(gap)} apart — comps say that gap rarely closes without a bigger move.`;
}

/** Live discount on the hero listing's original price, computed off the live ask (seller's floor),
 *  never off the original fixed askPrice literal in data.ts — dragging the ask handle restates it. */
export function discountPct(originalPrice: number, ask: number): number {
  if (originalPrice <= 0) return 0;
  return Math.max(0, Math.round(((originalPrice - ask) / originalPrice) * 100));
}

export function formatUsd(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "−" : "";
  return `${sign}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

export function formatPct(value: number): string {
  return `${Math.round(Math.abs(value) * 100)}%`;
}
