// app/src/app/landing-evolve/r36/b/score-math.ts
//
// Every derived number on this route — the hero's center readout, the
// value-section recap, the closing CTA's sentence and its own button
// label, and each listing card's "covers" badge — runs through one of
// these pure functions against the fixed data in data.ts. There is no
// second, independently-typed figure anywhere that could drift out of
// sync with the rings.

import { CONCERNS, COVER_THRESHOLD, type ConcernId, type Listing, type Scores } from "./data";

export const ALL_CONCERN_IDS: ConcernId[] = CONCERNS.map((c) => c.id);

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Rounds to 2 decimals — used for SVG circle math so server and client render identical digits. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The hero's "match confidence" figure: the average of the selected
 * concerns' scores for one listing, or `null` when nothing is selected —
 * there is no honest average of an empty set, so the UI shows a dash
 * rather than a fabricated number.
 */
export function aggregateForSelection(scores: Scores, selected: ConcernId[]): number | null {
  if (selected.length === 0) return null;
  return Math.round(average(selected.map((id) => scores[id])));
}

/** A selection-independent baseline: the average across all five concerns. */
export function overallMatch(scores: Scores): number {
  return Math.round(average(ALL_CONCERN_IDS.map((id) => scores[id])));
}

/** How many of the given concern ids this listing clears at COVER_THRESHOLD. */
export function coveredCount(
  scores: Scores,
  concernIds: ConcernId[],
  threshold: number = COVER_THRESHOLD
): number {
  return concernIds.filter((id) => scores[id] >= threshold).length;
}

/** Average full-coverage count across the grid, independent of any user toggle — the value-section's FIXED column. */
export function catalogAverageCoverage(listings: Listing[]): number {
  const counts = listings.map((l) => coveredCount(l.scores, ALL_CONCERN_IDS));
  return Math.round(average(counts) * 10) / 10;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.price / listing.originalPrice) * 100);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/**
 * The CTA copy this route reuses in three places: the hero button, the
 * closing CTA button, and (via the same selected-count) the closing CTA's
 * own sentence. `selectedCount === 0` gets an honest fallback rather than
 * a button that claims to cover zero concerns.
 */
export function ctaLabel(selectedCount: number): string {
  if (selectedCount === 0) return "Browse items across every concern";
  return `See items covering ${selectedCount} of your concerns`;
}
