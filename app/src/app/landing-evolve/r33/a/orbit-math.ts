/**
 * Pure, deterministic math for the "Priority Orbit" device.
 *
 * There is exactly one piece of interaction state in the whole page: which
 * criterion was last adjusted, and what value it was set to. Every other
 * number on the page — the five orbit weights, the composite score, the
 * ranked legend, the catalog-clears estimate — is a pure function of that
 * one state pair. Nothing here reads Math.random, Date.now or new Date.
 */

export interface Criterion {
  id: string;
  /** Full label, used in UI copy and aria labels. */
  label: string;
  /** Short label, used inline in sentences and the CTA button. */
  short: string;
  /** How well the single featured listing satisfies this criterion, 0-100. */
  baseScore: number;
  /** Starting share of the fixed 100-point weight budget. */
  defaultWeight: number;
}

export const WEIGHT_BUDGET = 100;
export const MIN_WEIGHT = 10;
export const MAX_WEIGHT = 60;
export const WEIGHT_STEP = 5;

export const CRITERIA: Criterion[] = [
  { id: 'style', label: 'Style match', short: 'Style', baseScore: 94, defaultWeight: 24 },
  { id: 'size', label: 'Size fit', short: 'Size', baseScore: 89, defaultWeight: 20 },
  { id: 'budget', label: 'Budget fit', short: 'Budget', baseScore: 81, defaultWeight: 18 },
  { id: 'condition', label: 'Condition grade', short: 'Condition', baseScore: 96, defaultWeight: 22 },
  { id: 'trust', label: 'Seller trust', short: 'Trust', baseScore: 99, defaultWeight: 16 },
];

export const DEFAULT_WEIGHTS: number[] = CRITERIA.map((c) => c.defaultWeight);

export interface OrbitState {
  activeIndex: number;
  activeValue: number;
}

export const DEFAULT_ORBIT_STATE: OrbitState = {
  activeIndex: -1,
  activeValue: DEFAULT_WEIGHTS[0],
};

function clampWeight(value: number): number {
  return Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, Math.round(value / WEIGHT_STEP) * WEIGHT_STEP));
}

/**
 * Recompute all five weights from one control's value. The active
 * criterion gets exactly `activeValue`; the fixed weight budget (100) is
 * always preserved, so what the active one gains the rest give up —
 * split across the other four in proportion to their own default shares,
 * using the largest-remainder method so integer weights always sum to
 * exactly 100 with no rounding drift. No randomness: the same
 * (activeIndex, activeValue) pair always produces the same five weights.
 */
export function computeWeights(state: OrbitState): number[] {
  const { activeIndex } = state;
  if (activeIndex < 0) return DEFAULT_WEIGHTS.slice();

  const activeValue = clampWeight(state.activeValue);
  const remaining = WEIGHT_BUDGET - activeValue;
  const otherIdx = CRITERIA.map((_, i) => i).filter((i) => i !== activeIndex);
  const sumOtherDefaults = otherIdx.reduce((s, i) => s + DEFAULT_WEIGHTS[i], 0);

  const raw = otherIdx.map((i) => (remaining * DEFAULT_WEIGHTS[i]) / sumOtherDefaults);
  const floored = raw.map((r) => Math.floor(r));
  const fracs = raw.map((r, k) => ({ idx: otherIdx[k], frac: r - floored[k] }));
  let leftover = remaining - floored.reduce((s, v) => s + v, 0);

  // Largest-remainder method, ties broken by criterion index (deterministic).
  const order = fracs
    .slice()
    .sort((a, b) => (b.frac - a.frac) || (a.idx - b.idx));

  const weights = new Array(CRITERIA.length).fill(0);
  weights[activeIndex] = activeValue;
  otherIdx.forEach((i, k) => {
    weights[i] = floored[k];
  });
  for (let k = 0; k < order.length && leftover > 0; k += 1) {
    weights[order[k].idx] += 1;
    leftover -= 1;
  }
  return weights;
}

/** Weighted composite score, 0-100, rounded to the nearest whole point. */
export function computeScore(weights: number[]): number {
  const total = CRITERIA.reduce((s, c, i) => s + (weights[i] / WEIGHT_BUDGET) * c.baseScore, 0);
  return Math.round(total);
}

/** Index of the currently most-weighted criterion (ties -> lowest index). */
export function leadingIndex(weights: number[]): number {
  let best = 0;
  for (let i = 1; i < weights.length; i += 1) {
    if (weights[i] > weights[best]) best = i;
  }
  return best;
}

export function scoreTier(score: number): string {
  if (score >= 90) return 'Prime match';
  if (score >= 80) return 'Strong match';
  if (score >= 70) return 'Fair match';
  return 'Loose match';
}

const TOTAL_CATALOG = 312;

/**
 * Deterministic estimate of how many of the fixed catalog's listings would
 * clear a 90-and-above match at the current weighting. A pure function of
 * the composite score — not a claim that live inventory is being re-polled.
 */
export function catalogClears(score: number): number {
  const ratio = Math.pow(score / 100, 2.2);
  return Math.max(0, Math.min(TOTAL_CATALOG, Math.round(TOTAL_CATALOG * ratio)));
}

export const TOTAL_CATALOG_SIZE = TOTAL_CATALOG;

/** Radius in SVG user units for a given weight — higher weight, smaller radius. */
export function radiusForWeight(weight: number, rMin = 86, rMax = 176): number {
  const t = (clampWeight(weight) - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT);
  return rMax - t * (rMax - rMin);
}

/** Position of criterion index i on its orbit, center at (cx, cy). */
export function orbitPosition(i: number, radius: number, total = CRITERIA.length, cx = 200, cy = 200) {
  const angleDeg = -90 + i * (360 / total);
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}
