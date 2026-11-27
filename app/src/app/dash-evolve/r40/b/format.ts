import { AXES, AXIS_BENCHMARKS, AXIS_WEIGHTS, type AxisId, type VendorDef } from "./data";

/**
 * Deliberately NOT `Intl.NumberFormat({ notation: "compact" })`. That path's
 * trailing-zero trimming differs between Node's ICU (the SSR pass) and the
 * browser's ICU (the hydration pass) for the same input, which is a logged
 * hydration-mismatch risk in this catalog. Every number on this page is a
 * 0–100 score or a plain integer, so a hand-rolled formatter is both safer
 * and simpler than reaching for compact notation at all.
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const SCORE_FORMAT = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const COMPOSITE_FORMAT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatScore(value: number): string {
  return SCORE_FORMAT.format(value);
}

export function formatComposite(value: number): string {
  return COMPOSITE_FORMAT.format(value);
}

export function formatDelta(value: number): string {
  const rounded = Math.round(value);
  if (rounded === 0) return "±0";
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

/** Weighted composite score, 0–100 scale. Weights sum to exactly 1. */
export function compositeScore(scores: Record<AxisId, number>): number {
  let total = 0;
  for (const axis of AXES) {
    total += scores[axis.id] * AXIS_WEIGHTS[axis.id];
  }
  return round2(total);
}

/**
 * Deterministic linear remap of a raw 0–100 score onto a fixed industry
 * reference band (see AXIS_BENCHMARKS) — this is the "Percentile Rank" view.
 * Clamped to [0, 100]; no randomness, no dependency on the other suppliers
 * shown on the page.
 */
export function percentileRank(axisId: AxisId, rawScore: number): number {
  const { min, max } = AXIS_BENCHMARKS[axisId];
  const fraction = (rawScore - min) / (max - min);
  return Math.min(100, Math.max(0, round2(fraction * 100)));
}

export type ViewMode = "raw" | "percentile";

export function valueForView(
  axisId: AxisId,
  rawScore: number,
  view: ViewMode,
): number {
  return view === "raw" ? rawScore : percentileRank(axisId, rawScore);
}

export function compositeForView(vendor: VendorDef, view: ViewMode): number {
  if (view === "raw") return compositeScore(vendor.scores);
  const remapped: Record<AxisId, number> = { ...vendor.scores };
  for (const axis of AXES) {
    remapped[axis.id] = percentileRank(axis.id, vendor.scores[axis.id]);
  }
  return compositeScore(remapped);
}
