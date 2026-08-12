export type Basis = "value" | "paid" | "timing";

export type BasisOption = {
  id: Basis;
  label: string;
  caption: string;
  leaderPrefix: string;
};

export type OwnedItem = {
  id: string;
  name: string;
  category: string;
  paid: number;
  now: number;
  windowWeeks: number;
  windowLabel: string;
  timingScore: number;
  shape: { w: number; h: number; r: "sm" | "md"; inner: "dot" | "bar" | "none" };
};

export const BASIS_META: Record<Basis, BasisOption> = {
  value: {
    id: "value",
    label: "Value now",
    caption: "Ordered by what each thing would fetch today. Nothing is hidden.",
    leaderPrefix: "Worth most",
  },
  paid: {
    id: "paid",
    label: "Vs. paid",
    caption: "Ordered by return against the price you paid. Same eight things.",
    leaderPrefix: "Best return",
  },
  timing: {
    id: "timing",
    label: "Sell window",
    caption: "Ordered by how close each thing is to its best week to sell.",
    leaderPrefix: "Sell first",
  },
};

export const BASES: BasisOption[] = [
  BASIS_META.value,
  BASIS_META.paid,
  BASIS_META.timing,
];

export const OWNED_ITEMS: OwnedItem[] = [
  {
    id: "leica-m6",
    name: "Leica M6 Body",
    category: "Camera",
    paid: 2450,
    now: 2890,
    windowWeeks: 0,
    windowLabel: "Best week is now",
    timingScore: 94,
    shape: { w: 96, h: 60, r: "sm", inner: "dot" },
  },
  {
    id: "technics-sl1200",
    name: "Technics SL-1200 MK7",
    category: "Turntable",
    paid: 1050,
    now: 1180,
    windowWeeks: 3,
    windowLabel: "Best week in 3 weeks",
    timingScore: 71,
    shape: { w: 104, h: 64, r: "sm", inner: "dot" },
  },
  {
    id: "analogue-pocket",
    name: "Analogue Pocket",
    category: "Handheld",
    paid: 219,
    now: 305,
    windowWeeks: 0,
    windowLabel: "Best week is now",
    timingScore: 88,
    shape: { w: 52, h: 78, r: "md", inner: "bar" },
  },
  {
    id: "eames-ottoman",
    name: "Eames Lounge Ottoman",
    category: "Furniture",
    paid: 1690,
    now: 1745,
    windowWeeks: 6,
    windowLabel: "Best week in 6 weeks",
    timingScore: 58,
    shape: { w: 96, h: 52, r: "md", inner: "none" },
  },
  {
    id: "sony-a7iii",
    name: "Sony A7 III Kit",
    category: "Camera",
    paid: 1980,
    now: 1420,
    windowWeeks: 22,
    windowLabel: "Best week in 22 weeks",
    timingScore: 15,
    shape: { w: 92, h: 58, r: "sm", inner: "dot" },
  },
  {
    id: "aeron-b",
    name: "Aeron Chair, Size B",
    category: "Furniture",
    paid: 890,
    now: 705,
    windowWeeks: 16,
    windowLabel: "Best week in 16 weeks",
    timingScore: 26,
    shape: { w: 68, h: 80, r: "md", inner: "bar" },
  },
  {
    id: "rimowa-cabin",
    name: "Rimowa Cabin Trunk",
    category: "Luggage",
    paid: 760,
    now: 690,
    windowWeeks: 9,
    windowLabel: "Best week in 9 weeks",
    timingScore: 44,
    shape: { w: 74, h: 82, r: "sm", inner: "bar" },
  },
  {
    id: "marshall-dsl40",
    name: "Marshall DSL40 Amp",
    category: "Guitar amp",
    paid: 640,
    now: 585,
    windowWeeks: 12,
    windowLabel: "Best week in 12 weeks",
    timingScore: 37,
    shape: { w: 100, h: 66, r: "sm", inner: "bar" },
  },
];

function group(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function usd(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${group(Math.abs(rounded))}`;
}

export function signedUsd(value: number): string {
  const rounded = Math.round(value);
  if (rounded === 0) return "$0";
  return `${rounded > 0 ? "+" : "-"}$${group(Math.abs(rounded))}`;
}

export function signedPct(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

export function changeOf(item: OwnedItem): {
  delta: number;
  pct: number;
  up: boolean;
} {
  const delta = item.now - item.paid;
  const pct = (delta / item.paid) * 100;
  return { delta, pct, up: delta >= 0 };
}

export const TOTAL_PAID = OWNED_ITEMS.reduce((sum, item) => sum + item.paid, 0);
export const TOTAL_NOW = OWNED_ITEMS.reduce((sum, item) => sum + item.now, 0);
export const TOTAL_DELTA = TOTAL_NOW - TOTAL_PAID;
export const TOTAL_PCT = (TOTAL_DELTA / TOTAL_PAID) * 100;

export function shareOf(item: OwnedItem): number {
  return (item.now / TOTAL_NOW) * 100;
}

export const MAX_SHARE = OWNED_ITEMS.reduce(
  (max, item) => Math.max(max, shareOf(item)),
  0,
);

export const MAX_ABS_PCT = OWNED_ITEMS.reduce(
  (max, item) => Math.max(max, Math.abs(changeOf(item).pct)),
  0,
);

export const READY_NOW = OWNED_ITEMS.filter((item) => item.windowWeeks === 0);

export const READY_NOW_VALUE = READY_NOW.reduce(
  (sum, item) => sum + item.now,
  0,
);

export const NEXT_WINDOW_WEEKS = OWNED_ITEMS.filter(
  (item) => item.windowWeeks > 0,
).reduce((min, item) => Math.min(min, item.windowWeeks), 99);

export function basisRank(item: OwnedItem, basis: Basis): number {
  if (basis === "value") return item.now;
  if (basis === "paid") return changeOf(item).pct;
  return item.timingScore;
}

export function pctWidth(value: number): `${number}%` {
  const clamped = Math.max(4, Math.min(100, Math.round(value)));
  return `${clamped}%`;
}
