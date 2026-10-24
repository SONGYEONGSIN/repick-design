/**
 * Largest-remainder (Hare–Niemeyer) allocation.
 *
 * Converts a list of raw counts into integer "cells" that sum to exactly
 * `totalCells` (100 for a 10x10 waffle), instead of naive rounding — which
 * drifts (e.g. eight categories each rounded independently can sum to 98, 101,
 * or any number but 100). Each count's exact share is floored, then the leftover
 * cells are handed out one at a time to the categories with the largest
 * fractional remainder, largest first. Ties fall back to array order so the
 * result is fully deterministic for a given input.
 */
export function allocateCells(counts: number[], totalCells = 100): number[] {
  const total = counts.reduce((sum, c) => sum + c, 0);
  if (total <= 0) return counts.map(() => 0);

  const exact = counts.map((c) => (c / total) * totalCells);
  const floors = exact.map((v) => Math.floor(v));
  const allocated = floors.reduce((sum, v) => sum + v, 0);
  const remainder = totalCells - allocated;

  const byRemainder = exact
    .map((v, index) => ({ index, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);

  const result = [...floors];
  for (let k = 0; k < remainder; k += 1) {
    result[byRemainder[k].index] += 1;
  }
  return result;
}

/** Exact percent (not the rounded cell count) — used in labels and tooltips. */
export function exactPercent(count: number, total: number): number {
  if (total <= 0) return 0;
  return (count / total) * 100;
}
