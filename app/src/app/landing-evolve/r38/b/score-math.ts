// app/src/app/landing-evolve/r38/b/score-math.ts
//
// Every derived number on this route passes through exactly one of these
// pure functions, read fresh wherever it's displayed — never cached or
// duplicated as a separate literal, so nothing can drift out of sync with
// the drag position or the selected listing.

import type { Listing } from "./data";

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * AI confidence at the current drag position: a plain linear interpolation
 * between the listing's own base (reveal = 0, raw photo only) and max
 * (reveal = 100, overlay fully revealed) confidence. Deliberately NOT
 * stepped on box boundaries — it recomputes on every unit of drag, and
 * switching listings changes both endpoints, not just the current value.
 */
export function confidenceAt(listing: Listing, reveal: number): number {
  const r = clamp(reveal, 0, 100) / 100;
  return Math.round(listing.baseConfidence + r * (listing.maxConfidence - listing.baseConfidence));
}

/** Boxes whose full width has been swept past by the divider. */
export function revealedBoxes(listing: Listing, reveal: number) {
  return listing.boxes.filter((b) => reveal >= b.leftPct + b.widthPct);
}

export function gradeLabel(confidence: number): string {
  if (confidence >= 90) return "Near-certain match";
  if (confidence >= 75) return "Strong match";
  if (confidence >= 60) return "Good match";
  return "Early read";
}

/**
 * Fair-price estimate: asking price scaled by a factor that rises from 0.85
 * (at 0% confidence — the AI is unsure, so the fair estimate sits below
 * what's being asked) to 1.00 (at 100% confidence — the asking price is
 * the fair price once nothing is left unverified).
 */
export function fairPrice(listing: Listing, confidence: number): number {
  const factor = 0.85 + 0.15 * (clamp(confidence, 0, 100) / 100);
  return Math.round(listing.price * factor);
}

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.price / listing.originalPrice) * 100);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function ctaLabel(confidence: number): string {
  return `Shop the ${confidence}%-confidence catalog`;
}
