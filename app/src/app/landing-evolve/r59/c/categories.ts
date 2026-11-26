// Deterministic device state for the Trust Breakdown. No Math.random, no Date.now() — every
// number is a fixed lookup keyed by which categories are on and which strictness mode is active,
// so server and client render byte-identical output.

export type StrictnessMode = "standard" | "strict";

export interface Category {
  id: string;
  label: string;
  standardPts: number;
  strictPts: number;
  detail: string;
}

// Both modes sum to the same 100-point maximum — strictness redistributes weight across
// categories (functional testing matters far more under "strict"), it does not just scale every
// number down uniformly. That is a deliberate, checkable property: 22+24+18+16+20 = 100 and
// 18+20+14+12+36 = 100.
export const CATEGORIES: Category[] = [
  {
    id: "photos",
    label: "Photo match",
    standardPts: 22,
    strictPts: 18,
    detail: "Submitted photos are compared against manufacturer reference images, angle by angle.",
  },
  {
    id: "serial",
    label: "Serial verification",
    standardPts: 24,
    strictPts: 20,
    detail: "The serial or IMEI is cross-checked against the manufacturer registry and theft databases.",
  },
  {
    id: "battery",
    label: "Battery health",
    standardPts: 18,
    strictPts: 14,
    detail: "Cycle count and maximum capacity are measured through a diagnostic handshake.",
  },
  {
    id: "cosmetic",
    label: "Cosmetic grading",
    standardPts: 16,
    strictPts: 12,
    detail: "Surface imaging is graded against the four-tier cosmetic rubric.",
  },
  {
    id: "functional",
    label: "Functional test",
    standardPts: 20,
    strictPts: 36,
    detail: "Every physical control, port, and sensor is cycled and logged — weighted heaviest under strict mode.",
  },
];

export function maxScore(mode: StrictnessMode): number {
  return CATEGORIES.reduce((sum, c) => sum + (mode === "strict" ? c.strictPts : c.standardPts), 0);
}

export function pointsFor(category: Category, mode: StrictnessMode): number {
  return mode === "strict" ? category.strictPts : category.standardPts;
}

export interface BreakdownResult {
  activeIds: Set<string>;
  mode: StrictnessMode;
  score: number;
  max: number;
}

export function deriveBreakdown(activeIds: Set<string>, mode: StrictnessMode): BreakdownResult {
  const max = maxScore(mode);
  let score = 0;
  for (const category of CATEGORIES) {
    if (activeIds.has(category.id)) score += pointsFor(category, mode);
  }
  return { activeIds, mode, score, max };
}
