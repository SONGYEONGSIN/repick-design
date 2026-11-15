// Pure, deterministic fixed-sum redistribution. The stacked bar's segment boundaries are the
// only state this page keeps for the allocator — shares, fit score, and projected views are all
// derived from them in render, never stored separately and never reset by an effect.

import { CATEGORIES, MIN_SHARE, type Category } from "./data";

/** Cumulative boundary positions (0–100) between the n categories. Length is n - 1. */
export type Boundaries = readonly number[];

export function boundariesFromShares(shares: readonly number[]): number[] {
  const boundaries: number[] = [];
  let cumulative = 0;
  for (let i = 0; i < shares.length - 1; i += 1) {
    cumulative += shares[i];
    boundaries.push(cumulative);
  }
  return boundaries;
}

/** Shares always sum to exactly 100 — each is just the gap between two adjacent boundaries. */
export function sharesFromBoundaries(boundaries: Boundaries): number[] {
  const shares: number[] = [];
  let prev = 0;
  for (const boundary of boundaries) {
    shares.push(boundary - prev);
    prev = boundary;
  }
  shares.push(100 - prev);
  return shares;
}

/**
 * Clamp a dragged/nudged boundary so it never crosses its neighbors by less than MIN_SHARE on
 * either side. Moving boundary i only ever changes the two categories that share it — the rest
 * of the split is untouched, which is what keeps the "one category's gain is another's loss"
 * trade feeling local and reversible under drag, rather than rescaling the whole row.
 */
export function clampBoundary(boundaries: Boundaries, index: number, rawValue: number): number {
  const lowerNeighbor = index === 0 ? 0 : boundaries[index - 1];
  const upperNeighbor = index === boundaries.length - 1 ? 100 : boundaries[index + 1];
  const min = lowerNeighbor + MIN_SHARE;
  const max = upperNeighbor - MIN_SHARE;
  return Math.min(max, Math.max(min, Math.round(rawValue)));
}

export function moveBoundary(boundaries: Boundaries, index: number, rawValue: number): number[] {
  const next = boundaries.slice();
  next[index] = clampBoundary(boundaries, index, rawValue);
  return next;
}

export interface AllocationModel {
  shares: readonly number[];
  /** 0–100: how closely the split mirrors this week's real buyer demand distribution. */
  fitScore: number;
  /** Projected featured-slot views this week at this split. */
  projectedViews: number;
  dominantIndex: number;
  /** True when two or more categories are tied for the largest share — no single "leader". */
  isTie: boolean;
}

export function computeModel(shares: readonly number[], categories: readonly Category[] = CATEGORIES): AllocationModel {
  const deviationSum = shares.reduce((sum, share, i) => sum + Math.abs(share - categories[i].demandShare), 0);
  const fitScore = Math.round(100 - deviationSum / 2);

  const projectedViews = Math.round(shares.reduce((sum, share, i) => sum + share * categories[i].viewYield, 0));

  let dominantIndex = 0;
  let tieCount = 1;
  for (let i = 1; i < shares.length; i += 1) {
    if (shares[i] > shares[dominantIndex]) {
      dominantIndex = i;
      tieCount = 1;
    } else if (shares[i] === shares[dominantIndex]) {
      tieCount += 1;
    }
  }

  return { shares, fitScore, projectedViews, dominantIndex, isTie: tieCount > 1 };
}

export function formatViews(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}
