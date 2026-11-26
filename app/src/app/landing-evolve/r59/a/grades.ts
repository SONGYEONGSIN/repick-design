// Deterministic device state for the Grade Ladder. No Math.random, no Date.now — every number is
// a fixed lookup, so server and client render byte-identical output (no hydration mismatch).

export type GradeId = "aplus" | "a" | "b" | "c";

export interface Grade {
  id: GradeId;
  label: string;
  note: string;
  priceLow: number;
  priceHigh: number;
  resale3: number; // % of original list price retained at 3 months
  resale6: number;
  resale12: number;
  defectsAllowed: string[];
}

export const GRADES: Grade[] = [
  {
    id: "aplus",
    label: "A+",
    note: "Like new, no visible wear",
    priceLow: 1180,
    priceHigh: 1340,
    resale3: 94,
    resale6: 88,
    resale12: 81,
    defectsAllowed: ["No cosmetic marks of any kind", "Full original accessory set", "Battery health 95% or higher"],
  },
  {
    id: "a",
    label: "A",
    note: "Light wear, fully functional",
    priceLow: 980,
    priceHigh: 1120,
    resale3: 90,
    resale6: 82,
    resale12: 74,
    defectsAllowed: ["Faint surface scuffs under direct light", "Minor edge wear on corners", "Battery health 90% or higher"],
  },
  {
    id: "b",
    label: "B",
    note: "Visible wear, mechanics unaffected",
    priceLow: 760,
    priceHigh: 900,
    resale3: 84,
    resale6: 74,
    resale12: 64,
    defectsAllowed: ["Noticeable scratches on housing", "Scuffed corners or chipped paint", "Battery health 80% or higher"],
  },
  {
    id: "c",
    label: "C",
    note: "Heavy wear, functional with caveats",
    priceLow: 540,
    priceHigh: 660,
    resale3: 76,
    resale6: 63,
    resale12: 50,
    defectsAllowed: ["Deep scratches or minor dents", "Missing original box or charger", "Battery health 70% or higher"],
  },
];

export const ACCESSORIES_PRICE_BUMP = 60;
export const ACCESSORIES_RESALE_BUMP = 3; // percentage points added at every horizon

export interface LadderResult {
  grade: Grade;
  priceLow: number;
  priceHigh: number;
  resale3: number;
  resale6: number;
  resale12: number;
}

export function deriveLadder(gradeId: GradeId, includeAccessories: boolean): LadderResult {
  const grade = GRADES.find((g) => g.id === gradeId) ?? GRADES[1];
  const bumpPrice = includeAccessories ? ACCESSORIES_PRICE_BUMP : 0;
  const bumpResale = includeAccessories ? ACCESSORIES_RESALE_BUMP : 0;
  return {
    grade,
    priceLow: grade.priceLow + bumpPrice,
    priceHigh: grade.priceHigh + bumpPrice,
    resale3: Math.min(99, grade.resale3 + bumpResale),
    resale6: Math.min(99, grade.resale6 + bumpResale),
    resale12: Math.min(99, grade.resale12 + bumpResale),
  };
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}
