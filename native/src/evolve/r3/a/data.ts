export type GradeId = "fair" | "good" | "excellent";

export const ITEM = {
  title: "Kestrel X100 Mirrorless Camera",
  subtitle: "Body only - draft listing by you",
  marketFloor: 220,
  marketCeiling: 700,
  baseCenter: 415,
  baseHalfWidth: 105,
  comparablePool: 46,
};

export type Grade = {
  id: GradeId;
  label: string;
  blurb: string;
  centerShift: number;
};

export const GRADES: Grade[] = [
  {
    id: "fair",
    label: "Fair",
    blurb: "Visible wear, everything still works",
    centerShift: -85,
  },
  {
    id: "good",
    label: "Good",
    blurb: "Light marks, no dents or fungus",
    centerShift: 15,
  },
  {
    id: "excellent",
    label: "Excellent",
    blurb: "Near mint, barely handled",
    centerShift: 85,
  },
];

export const GRADE_LABEL: Record<GradeId, string> = {
  fair: "Fair",
  good: "Good",
  excellent: "Excellent",
};

export const GRADE_POOL: Record<GradeId, number> = {
  fair: 12,
  good: 21,
  excellent: 13,
};

export type IncludedItem = {
  id: string;
  label: string;
  hint: string;
  value: number;
};

export const INCLUDED_ITEMS: IncludedItem[] = [
  {
    id: "box",
    label: "Original box",
    hint: "Full packaging is the most requested extra",
    value: 22,
  },
  {
    id: "charger",
    label: "Charger and cable",
    hint: "Assumed by most buyers, missing it costs you",
    value: 14,
  },
  {
    id: "strap",
    label: "Branded strap",
    hint: "Small lift, easy to forget",
    value: 8,
  },
  {
    id: "warranty",
    label: "Warranty card",
    hint: "Proves the purchase date",
    value: 26,
  },
];

export const EXTRA_BATTERY_VALUE = 18;
export const MAX_EXTRA_BATTERIES = 3;

export const NARROWING = { grade: 38, included: 24, extras: 16 };

export const CONFIDENCE = ["Rough", "Fair", "Good", "Sharp"];

export const PHOTO_SLOTS = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "wear", label: "Wear spot" },
];

export type Comparable = {
  id: string;
  title: string;
  grade: GradeId;
  price: number;
  soldDaysAgo: number;
  note: string;
};

export const COMPARABLES: Comparable[] = [
  {
    id: "c1",
    title: "X100 body, sensor cleaned",
    grade: "fair",
    price: 285,
    soldDaysAgo: 9,
    note: "No box, heavy grip wear",
  },
  {
    id: "c2",
    title: "X100 body with charger",
    grade: "fair",
    price: 312,
    soldDaysAgo: 22,
    note: "Scuffed base plate, shutter tested",
  },
  {
    id: "c3",
    title: "X100 body, boxed",
    grade: "good",
    price: 438,
    soldDaysAgo: 4,
    note: "Box and charger, light marks",
  },
  {
    id: "c4",
    title: "X100 body with strap",
    grade: "good",
    price: 402,
    soldDaysAgo: 11,
    note: "No box, strap included",
  },
  {
    id: "c5",
    title: "X100 body only",
    grade: "good",
    price: 421,
    soldDaysAgo: 17,
    note: "Charger only, clean finish",
  },
  {
    id: "c6",
    title: "X100 full kit, near mint",
    grade: "excellent",
    price: 561,
    soldDaysAgo: 6,
    note: "Box, warranty card, two spare batteries",
  },
  {
    id: "c7",
    title: "X100 boxed, unused strap",
    grade: "excellent",
    price: 524,
    soldDaysAgo: 14,
    note: "Box and charger, strap still wrapped",
  },
];

export type Factor = {
  id: string;
  label: string;
  amount: number;
  direction: "up" | "down";
};

export type SellState = {
  grade: GradeId | null;
  included: string[];
  includedTouched: boolean;
  extras: number;
  extrasTouched: boolean;
};

export type Estimate = {
  low: number;
  high: number;
  spread: number;
  leftPct: number;
  widthPct: number;
  signals: number;
  confidence: string;
  matchedCount: number;
  comparables: Comparable[];
  factors: Factor[];
  nextStep: string;
};

const roundTo5 = (value: number) => Math.round(value / 5) * 5;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function estimateFor(state: SellState): Estimate {
  const gradeDef = GRADES.find((entry) => entry.id === state.grade) ?? null;
  const factors: Factor[] = [];

  let center = ITEM.baseCenter;

  if (gradeDef) {
    center += gradeDef.centerShift;
    factors.push({
      id: `grade-${gradeDef.id}`,
      label: `${gradeDef.label} condition grade`,
      amount: gradeDef.centerShift,
      direction: gradeDef.centerShift >= 0 ? "up" : "down",
    });
  }

  INCLUDED_ITEMS.forEach((entry) => {
    if (state.included.includes(entry.id)) {
      center += entry.value;
      factors.push({
        id: entry.id,
        label: entry.label,
        amount: entry.value,
        direction: "up",
      });
    }
  });

  if (state.extras > 0) {
    const amount = state.extras * EXTRA_BATTERY_VALUE;
    center += amount;
    factors.push({
      id: "extras",
      label:
        state.extras === 1 ? "1 spare battery" : `${state.extras} spare batteries`,
      amount,
      direction: "up",
    });
  }

  const missing = INCLUDED_ITEMS.filter(
    (entry) => !state.included.includes(entry.id),
  ).sort((a, b) => b.value - a.value);

  if (state.includedTouched && missing.length > 0) {
    factors.push({
      id: "missing",
      label:
        missing.length === 1
          ? `Missing ${missing[0].label.toLowerCase()}`
          : `Missing ${missing.length} kit parts`,
      amount: missing.reduce((sum, entry) => sum + entry.value, 0),
      direction: "down",
    });
  }

  const signals =
    (state.grade ? 1 : 0) +
    (state.includedTouched ? 1 : 0) +
    (state.extrasTouched ? 1 : 0);

  const halfWidth =
    ITEM.baseHalfWidth -
    (state.grade ? NARROWING.grade : 0) -
    (state.includedTouched ? NARROWING.included : 0) -
    (state.extrasTouched ? NARROWING.extras : 0);

  const low = clamp(
    roundTo5(center - halfWidth),
    ITEM.marketFloor,
    ITEM.marketCeiling,
  );
  const high = clamp(
    roundTo5(center + halfWidth),
    ITEM.marketFloor,
    ITEM.marketCeiling,
  );

  const span = ITEM.marketCeiling - ITEM.marketFloor;
  const leftPct = ((low - ITEM.marketFloor) / span) * 100;
  const widthPct = ((high - low) / span) * 100;

  const matchedCount = state.grade
    ? GRADE_POOL[state.grade]
    : ITEM.comparablePool;
  const comparables = state.grade
    ? COMPARABLES.filter((entry) => entry.grade === state.grade)
    : COMPARABLES;

  let nextStep: string;
  if (!state.grade) {
    nextStep = `Pick a condition grade to cut the spread by $${NARROWING.grade * 2}.`;
  } else if (!state.includedTouched) {
    nextStep = `Confirm what ships in the box to cut the spread by $${NARROWING.included * 2}.`;
  } else if (!state.extrasTouched) {
    nextStep = `Set the spare battery count to cut the spread by $${NARROWING.extras * 2}.`;
  } else if (missing.length > 0) {
    nextStep = `Add the ${missing[0].label.toLowerCase()} to lift the top of your range by $${missing[0].value}.`;
  } else {
    nextStep = `Every detail is in. This is the tightest range ${matchedCount} matching sales support.`;
  }

  return {
    low,
    high,
    spread: high - low,
    leftPct: Math.round(leftPct * 10) / 10,
    widthPct: Math.round(widthPct * 10) / 10,
    signals,
    confidence: CONFIDENCE[signals],
    matchedCount,
    comparables,
    factors,
    nextStep,
  };
}
