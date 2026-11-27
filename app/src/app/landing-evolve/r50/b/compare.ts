import { LISTINGS, type Grade, type Listing } from "./data";

// --- Grade scoring ---------------------------------------------------------

export const GRADE_SCORE: Record<Grade, number> = {
  "A+": 4.3,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
};

export function gradeScore(grade: Grade): number {
  return GRADE_SCORE[grade];
}

export function gradeNormalized(listing: Listing): number {
  return (gradeScore(listing.grade) / GRADE_SCORE["A+"]) * 100;
}

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.price / listing.retail) * 100);
}

function normalize(value: number, min: number, max: number): number {
  if (max <= min) return 50;
  return ((value - min) / (max - min)) * 100;
}

// Dataset-wide bounds, computed once from the fixed sample set — never from
// just the two selected listings, so picking the same listing twice can
// never collapse a range to zero and divide by it.
const ALL_DAYS = LISTINGS.map((l) => l.daysToSell);
const ALL_PRICES = LISTINGS.map((l) => l.price);
const MIN_DAYS = Math.min(...ALL_DAYS);
const MAX_DAYS = Math.max(...ALL_DAYS);
const MIN_PRICE = Math.min(...ALL_PRICES);
const MAX_PRICE = Math.max(...ALL_PRICES);

export function speedScore(listing: Listing): number {
  return 100 - normalize(listing.daysToSell, MIN_DAYS, MAX_DAYS);
}

export function priceEfficiency(listing: Listing): number {
  return 100 - normalize(listing.price, MIN_PRICE, MAX_PRICE);
}

// Single real composite computation every surface on the page cites —
// never a per-category static lookup.
export function compositeScore(listing: Listing): number {
  const raw =
    listing.match * 0.45 +
    gradeNormalized(listing) * 0.25 +
    discountPct(listing) * 0.2 +
    speedScore(listing) * 0.1;
  return Math.round(raw * 10) / 10;
}

// --- Radar axes -------------------------------------------------------------

export interface RadarAxis {
  key: string;
  label: string;
  value: (listing: Listing) => number;
}

export const RADAR_AXES: RadarAxis[] = [
  { key: "match", label: "Match", value: (l) => l.match },
  { key: "grade", label: "Grade", value: (l) => gradeNormalized(l) },
  { key: "discount", label: "Discount", value: (l) => discountPct(l) },
  { key: "speed", label: "Speed", value: (l) => speedScore(l) },
  { key: "price", label: "Value", value: (l) => priceEfficiency(l) },
];

// --- Diff rows ----------------------------------------------------------

export type Direction = "higher" | "lower";

export interface DiffRow {
  key: string;
  label: string;
  direction: Direction;
  value: (listing: Listing) => number;
  formatValue: (listing: Listing) => string;
}

export const DIFF_ROWS: DiffRow[] = [
  {
    key: "price",
    label: "Price",
    direction: "lower",
    value: (l) => l.price,
    formatValue: (l) => `$${l.price.toLocaleString("en-US")}`,
  },
  {
    key: "match",
    label: "AI match",
    direction: "higher",
    value: (l) => l.match,
    formatValue: (l) => `${l.match}%`,
  },
  {
    key: "grade",
    label: "Condition grade",
    direction: "higher",
    value: (l) => gradeScore(l.grade),
    formatValue: (l) => l.grade,
  },
  {
    key: "days",
    label: "Est. time to sell",
    direction: "lower",
    value: (l) => l.daysToSell,
    formatValue: (l) => `${l.daysToSell} day${l.daysToSell === 1 ? "" : "s"}`,
  },
  {
    key: "discount",
    label: "Discount vs. retail",
    direction: "higher",
    value: (l) => discountPct(l),
    formatValue: (l) => `${discountPct(l)}%`,
  },
];

function rowDelta(row: DiffRow, a: Listing, b: Listing): string {
  const av = row.value(a);
  const bv = row.value(b);
  if (av === bv) return "Tied";
  const diff = Math.abs(av - bv);
  switch (row.key) {
    case "price":
      return `$${diff.toLocaleString("en-US")} apart`;
    case "match":
    case "discount":
      return `${diff} pt${diff === 1 ? "" : "s"} apart`;
    case "grade":
      return `${a.grade} vs. ${b.grade}`;
    case "days":
      return `${diff} day${diff === 1 ? "" : "s"} apart`;
    default:
      return `${diff} apart`;
  }
}

export interface ComparisonRow {
  row: DiffRow;
  better: "a" | "b" | "tie";
  delta: string;
}

export interface Comparison {
  rows: ComparisonRow[];
  compositeA: number;
  compositeB: number;
  compositeDelta: number;
  compositeBetter: "a" | "b" | "tie";
  biggestSwing: { label: string; magnitude: number } | null;
  identical: boolean;
}

// The one shared computation every selector pair feeds and every surface
// on the page reads back from — the diff table, the radar chart and the
// closing CTA all call this same function with the same two listings.
export function compare(a: Listing, b: Listing): Comparison {
  const identical = a.id === b.id;

  const rows: ComparisonRow[] = DIFF_ROWS.map((row) => {
    const av = row.value(a);
    const bv = row.value(b);
    let better: "a" | "b" | "tie" = "tie";
    if (av !== bv) {
      better =
        row.direction === "higher"
          ? av > bv
            ? "a"
            : "b"
          : av < bv
            ? "a"
            : "b";
    }
    return { row, better, delta: rowDelta(row, a, b) };
  });

  const compositeA = compositeScore(a);
  const compositeB = compositeScore(b);
  const rawDelta = Math.round((compositeA - compositeB) * 10) / 10;
  const compositeBetter: "a" | "b" | "tie" =
    rawDelta === 0 ? "tie" : rawDelta > 0 ? "a" : "b";

  const swings = RADAR_AXES.map((axis) => ({
    label: axis.label,
    magnitude: Math.abs(axis.value(a) - axis.value(b)),
  }));
  const hasSwing = swings.some((s) => s.magnitude > 0.01);
  const biggestSwing = hasSwing
    ? swings.reduce(
        (max, cur) => (cur.magnitude > max.magnitude ? cur : max),
        swings[0],
      )
    : null;

  return {
    rows,
    compositeA,
    compositeB,
    compositeDelta: Math.abs(rawDelta),
    compositeBetter,
    biggestSwing,
    identical,
  };
}
