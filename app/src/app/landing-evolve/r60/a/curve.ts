// Deterministic resale-value curve. No Math.random, no Date.now() — every number is a fixed
// function of two inputs (day, certified), so server and client render byte-identical output.
//
// Piecewise-linear in two segments: a rise from day 0 to the day-45 peak (post-release demand
// ramp), then a decline from day 45 to day 180 (ordinary depreciation). The "Verified Condition
// Certificate" toggle does not nudge a single number — it rescales EVERY point on the curve by a
// fixed premium, which is why toggling it redraws the whole path, not just the marker.

export const DAY_MIN = 0;
export const DAY_MAX = 180;
export const PEAK_DAY = 45;

const BASE_DAY0 = 420;
const BASE_PEAK = 480;
const BASE_FLOOR = 260;

export const CERT_PREMIUM = 0.12;

// Phase boundaries, used for both the recommendation sentence and the chart's background bands.
export const RISING_END = 35;
export const PEAK_END = 55;

export type Phase = "rising" | "peak" | "declining";

export function baseValueAtDay(day: number): number {
  const clamped = Math.max(DAY_MIN, Math.min(DAY_MAX, day));
  if (clamped <= PEAK_DAY) {
    const t = clamped / PEAK_DAY;
    return BASE_DAY0 + (BASE_PEAK - BASE_DAY0) * t;
  }
  const t = (clamped - PEAK_DAY) / (DAY_MAX - PEAK_DAY);
  return BASE_PEAK + (BASE_FLOOR - BASE_PEAK) * t;
}

export function valueAtDay(day: number, certified: boolean): number {
  const base = baseValueAtDay(day);
  return certified ? base * (1 + CERT_PREMIUM) : base;
}

export function payoutAtDay(day: number, certified: boolean): number {
  return Math.round(valueAtDay(day, certified));
}

export function phaseAtDay(day: number): Phase {
  if (day < RISING_END) return "rising";
  if (day <= PEAK_END) return "peak";
  return "declining";
}

export const PHASE_LABEL: Record<Phase, string> = {
  rising: "Rising",
  peak: "Peak window",
  declining: "Declining",
};

export function recommendationFor(day: number, certified: boolean): string {
  const phase = phaseAtDay(day);
  const peakPayout = payoutAtDay(PEAK_DAY, certified);
  if (phase === "rising") {
    return `Value is still climbing toward day ${PEAK_DAY} — selling today leaves money on the table.`;
  }
  if (phase === "peak") {
    return `You're in the peak window — within a few dollars of the best price we project ($${peakPayout}).`;
  }
  return `You're past the peak — the longer you wait from here, the less this listing is worth.`;
}

// Fixed chart geometry. A 600x200 viewBox scaled by CSS, not by recomputing coordinates — every
// rendered size reads the same numbers. Values rounded to 2 decimals (same determinism discipline
// this brief applies to SVG trig coordinates).
export const CHART_W = 600;
export const CHART_H = 200;

// Global value domain across BOTH certificate states, with padding, so toggling the certificate
// never rescales the axis out from under the reader — only the curve's shape on a fixed axis.
const DOMAIN_MIN = 240;
const DOMAIN_MAX = 560;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function scaleX(day: number): number {
  return round2((day / DAY_MAX) * CHART_W);
}

export function scaleY(value: number): number {
  const frac = (value - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN);
  return round2(CHART_H - frac * CHART_H);
}

export interface CurvePoint {
  day: number;
  x: number;
  y: number;
  value: number;
}

const KEY_DAYS = [DAY_MIN, PEAK_DAY, DAY_MAX];

export function curvePoints(certified: boolean): CurvePoint[] {
  return KEY_DAYS.map((day) => {
    const value = valueAtDay(day, certified);
    return { day, x: scaleX(day), y: scaleY(value), value };
  });
}

export function curvePolylineAttr(certified: boolean): string {
  return curvePoints(certified)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
}

export function curveAreaPolygonAttr(certified: boolean): string {
  const points = curvePoints(certified);
  const baseline = CHART_H;
  const top = points.map((p) => `${p.x},${p.y}`).join(" ");
  return `${top} ${points[points.length - 1].x},${baseline} ${points[0].x},${baseline}`;
}

export function markerPosition(day: number, certified: boolean): { x: number; y: number } {
  return { x: scaleX(day), y: scaleY(valueAtDay(day, certified)) };
}

export interface PhaseBand {
  phase: Phase;
  x0: number;
  x1: number;
}

export function phaseBands(): PhaseBand[] {
  return [
    { phase: "rising", x0: scaleX(DAY_MIN), x1: scaleX(RISING_END) },
    { phase: "peak", x0: scaleX(RISING_END), x1: scaleX(PEAK_END) },
    { phase: "declining", x0: scaleX(PEAK_END), x1: scaleX(DAY_MAX) },
  ];
}
