// Pure, deterministic math for the radial trust-score gauge. No Math.random / Date — every value
// here is a function of its arguments only, so server and client renders agree and re-renders on
// slider input are exact recomputes, never approximations.

/** Round to 2 decimal places. Applied to every trig-derived SVG coordinate/length so floating point
 * noise between environments can never disagree past the 2nd decimal and trip a hydration mismatch. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export interface Point {
  x: number;
  y: number;
}

/** angleDeg: 0 = top (12 o'clock), increasing = clockwise. Matches standard SVG y-down space. */
export function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: r2(cx + radius * Math.cos(rad)),
    y: r2(cy + radius * Math.sin(rad)),
  };
}

/** Describes an SVG arc path from startDeg to endDeg (startDeg < endDeg), drawn clockwise, with the
 * path's `M` point sitting exactly at startDeg — required so a stroke-dasharray/dashoffset reveal
 * fills from the gauge's logical zero end rather than its logical max end. */
export function arcPath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, radius, startDeg);
  const end = polarToCartesian(cx, cy, radius, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

/** Total length of a circular arc spanning `sweepDeg` degrees at the given radius. */
export function arcLength(radius: number, sweepDeg: number): number {
  return r2(radius * (sweepDeg * Math.PI / 180));
}

export const GAUGE_START_DEG = -135;
export const GAUGE_END_DEG = 135;
export const GAUGE_SWEEP_DEG = GAUGE_END_DEG - GAUGE_START_DEG; // 270

export type FactorKey = "sellerHistory" | "authenticityCheck" | "conditionMatch" | "priceFairness";

export type WeightState = Record<FactorKey, number>;

/** Composite score = weighted average of each factor's fixed raw score, using the live slider
 * weights as importance. Every sub-bar's contribution is raw_i * weight_i / sum(weights), and the
 * four contributions sum exactly to the composite — so moving any single slider renormalizes and
 * visibly redistributes all four bars, not just the one being dragged. */
export function computeComposite(raw: WeightState, weights: WeightState): {
  composite: number;
  contributions: WeightState;
} {
  const keys = Object.keys(raw) as FactorKey[];
  const weightSum = keys.reduce((sum, k) => sum + weights[k], 0) || 1;
  const contributions = {} as WeightState;
  let compositeSum = 0;
  for (const k of keys) {
    const contribution = (raw[k] * weights[k]) / weightSum;
    contributions[k] = contribution;
    compositeSum += contribution;
  }
  return { composite: compositeSum, contributions };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
