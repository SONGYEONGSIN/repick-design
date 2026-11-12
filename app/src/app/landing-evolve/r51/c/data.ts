// "Draw-Your-Budget Curve" -- fixed dummy data + pure derivation functions.
//
// The hero's chart is NOT a single scrubber (r49/b's "Week Scrubber": one playhead, one
// position) and NOT a renormalizing weight dial (r18/c: a fixed small set of sliders that
// always renormalize to sum-to-100%). It is N (six) INDEPENDENTLY-settable point values, each
// free to range 0-400 on its own, forming an unconstrained shape -- a real multi-point curve the
// visitor draws by hand. Every total/projection below is a genuine fold over the full six-value
// array, never a read of the single point most recently touched.
//
// Determinism: no Math.random / Date.now / argument-less new Date() anywhere in this file.

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;

export const MIN_VALUE = 0;
export const MAX_VALUE = 400;
export const STEP = 10;
export const STEP_LARGE = 50;

// The curve never opens flat or empty -- a realistic hand-shaped starting plan.
export const DEFAULT_VALUES: number[] = [60, 90, 140, 110, 170, 130];
export const DEFAULT_ACTIVE_INDEX = 4; // "May", $170 -- mid-curve, non-zero, matches no edge case

// Chart geometry (logical units; the SVG scales these with viewBox, never trig, so nothing here
// needs the "round SVG trig coordinates to 2 decimals" rule -- there is no trig in this chart).
export const CHART_H = 180; // px, fixed regardless of rendered width
export const CHART_PAD = 18; // px reserved top/bottom so a point handle never clips the track
export const X_INSET = 6; // % reserved left/right so edge points' handles never clip the track
export const X_SPAN = 100 - X_INSET * 2;

export function xPercentForIndex(i: number, n: number = MONTHS.length): number {
  if (n <= 1) return 50;
  return Number((X_INSET + (i / (n - 1)) * X_SPAN).toFixed(2));
}

export function valueToY(value: number): number {
  const usable = CHART_H - CHART_PAD * 2;
  const fraction = 1 - (value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE);
  return Number((CHART_PAD + fraction * usable).toFixed(2));
}

// Inverse of valueToY, given a pointer Y already relative to the track's top edge.
export function yToValue(relY: number): number {
  const usable = CHART_H - CHART_PAD * 2;
  const clampedY = Math.min(CHART_H - CHART_PAD, Math.max(CHART_PAD, relY));
  const fraction = 1 - (clampedY - CHART_PAD) / usable;
  const raw = fraction * (MAX_VALUE - MIN_VALUE) + MIN_VALUE;
  const stepped = Math.round(raw / STEP) * STEP;
  return Math.min(MAX_VALUE, Math.max(MIN_VALUE, stepped));
}

export function clampStep(value: number): number {
  const stepped = Math.round(value / STEP) * STEP;
  return Math.min(MAX_VALUE, Math.max(MIN_VALUE, stepped));
}

export function formatUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

// ---- Fixed dummy inventory --------------------------------------------------------------
// Sorted ascending by salePrice on purpose: acquisitionPlan() below walks this exact order, so
// the sort is load-bearing, not incidental.

export type Category = "Cameras" | "Watches" | "Sneakers" | "Furniture" | "Audio";

export type InventoryItem = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  salePrice: number;
  listPriceNew: number;
  conditionGrade: "A" | "A-" | "B+" | "B";
  matchPercent: number;
  verified: boolean;
  matchReason: string;
  image: string;
  alt: string;
};

export const INVENTORY: InventoryItem[] = [
  {
    id: "ae1-strap-case",
    title: "AE-1 Strap & Case Bundle",
    brand: "Canon (aftermarket)",
    category: "Cameras",
    salePrice: 45,
    listPriceNew: 80,
    conditionGrade: "B+",
    matchPercent: 66,
    verified: true,
    matchReason: "Matched on your camera-accessory budget tier and a B+ condition floor.",
    image: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9",
    alt: "A brown leather camera strap coiled next to a fitted hard case",
  },
  {
    id: "leather-watch-band",
    title: "Classic Leather Watch Band",
    brand: "Hirsch",
    category: "Watches",
    salePrice: 58,
    listPriceNew: 95,
    conditionGrade: "A-",
    matchPercent: 72,
    verified: true,
    matchReason: "Priced within 5% of the accessory range you've funded this month.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    alt: "A watch with a leather strap laid flat on a light surface",
  },
  {
    id: "canvas-high-top",
    title: "Canvas High-Top Sneakers",
    brand: "Fieldwalk",
    category: "Sneakers",
    salePrice: 89,
    listPriceNew: 150,
    conditionGrade: "B+",
    matchPercent: 74,
    verified: false,
    matchReason: "Size and condition grade both match your saved preferences.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    alt: "A single light-colored high-top sneaker on a plain background",
  },
  {
    id: "walnut-record-shelf",
    title: "Walnut Record Shelf",
    brand: "Northfern",
    category: "Furniture",
    salePrice: 120,
    listPriceNew: 210,
    conditionGrade: "A-",
    matchPercent: 69,
    verified: true,
    matchReason: "Dimensions match the space you flagged, condition grade A- or better.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    alt: "A walnut wood shelf unit against a plain wall",
  },
  {
    id: "seiko-5-automatic",
    title: "Seiko 5 Automatic Watch",
    brand: "Seiko",
    category: "Watches",
    salePrice: 165,
    listPriceNew: 260,
    conditionGrade: "A",
    matchPercent: 88,
    verified: true,
    matchReason: "Reference and movement both verified against the serial registry.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    alt: "A stainless steel automatic watch with a round dial",
  },
  {
    id: "ae1-program-35mm",
    title: "AE-1 Program 35mm SLR",
    brand: "Canon",
    category: "Cameras",
    salePrice: 186,
    listPriceNew: 310,
    conditionGrade: "A-",
    matchPercent: 91,
    verified: true,
    matchReason: "Shutter-tested, serial-matched, and priced at your target discount.",
    image: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9",
    alt: "A black and silver 35mm film SLR camera with a standard lens attached",
  },
  {
    id: "lounge-chair",
    title: "Mid-Century Lounge Chair",
    brand: "Harlow & Finch",
    category: "Furniture",
    salePrice: 240,
    listPriceNew: 420,
    conditionGrade: "A-",
    matchPercent: 82,
    verified: true,
    matchReason: "Upholstery condition and frame joints both passed inspection.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    alt: "A mid-century lounge chair with wooden arms and tan upholstery",
  },
  {
    id: "direct-drive-turntable",
    title: "Direct-Drive Turntable",
    brand: "Technics",
    category: "Audio",
    salePrice: 310,
    listPriceNew: 520,
    conditionGrade: "A",
    matchPercent: 85,
    verified: true,
    matchReason: "Motor and tonearm tested; cartridge replaced before listing.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    alt: "A piece of audio equipment on a plain surface",
  },
];

export const CATEGORIES: readonly ("All" | Category)[] = [
  "All",
  "Cameras",
  "Watches",
  "Sneakers",
  "Furniture",
  "Audio",
];

export function discountPercent(item: InventoryItem): number {
  return Math.round((1 - item.salePrice / item.listPriceNew) * 100);
}

// ---- Derivations over the FULL six-point curve -----------------------------------------

export function totalOf(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0);
}

export function cumulativeOf(values: number[], uptoIndexInclusive: number): number {
  return values.slice(0, uptoIndexInclusive + 1).reduce((sum, v) => sum + v, 0);
}

export type AcquisitionPlan = {
  items: InventoryItem[];
  itemCount: number;
  totalSpent: number;
  totalSaved: number;
  remaining: number;
  nextItem: InventoryItem | null;
  nextGap: number | null; // additional dollars of total budget needed to reach nextItem
};

/**
 * The single function BOTH the hero readout and the closing CTA call -- a deterministic
 * cheapest-first walk of the fixed inventory against the real sum of all six curve points.
 * Never reads a single point in isolation.
 */
export function acquisitionPlan(total: number): AcquisitionPlan {
  const items: InventoryItem[] = [];
  let spent = 0;
  for (const item of INVENTORY) {
    if (spent + item.salePrice <= total) {
      items.push(item);
      spent += item.salePrice;
    }
  }
  const totalSaved = items.reduce((sum, it) => sum + (it.listPriceNew - it.salePrice), 0);
  const remaining = Math.max(0, total - spent);
  const nextItem = INVENTORY.find((it) => !items.includes(it)) ?? null;
  const nextGap = nextItem ? Math.max(0, nextItem.salePrice - remaining) : null;
  return { items, itemCount: items.length, totalSpent: spent, totalSaved, remaining, nextItem, nextGap };
}

export type MonthSelection = {
  items: InventoryItem[];
  isFallback: boolean;
  cheapestGap: number | null; // only set when isFallback -- $ short of the shown item
};

/**
 * A SECOND, independent live link: what a single month's own value (not the six-point total)
 * can currently reach, inside an optional category filter. Used by Product Preview and by the
 * hero's compact proof cards.
 */
export function affordableForMonth(
  monthValue: number,
  category: "All" | Category = "All",
  take = 3,
): MonthSelection {
  const pool = category === "All" ? INVENTORY : INVENTORY.filter((it) => it.category === category);
  const affordable = pool.filter((it) => it.salePrice <= monthValue);
  if (affordable.length === 0) {
    const fallbackPool = pool.length > 0 ? pool : INVENTORY;
    const cheapest = [...fallbackPool].sort((a, b) => a.salePrice - b.salePrice)[0];
    return { items: [cheapest], isFallback: true, cheapestGap: Math.max(0, cheapest.salePrice - monthValue) };
  }
  const sorted = [...affordable].sort((a, b) => b.matchPercent - a.matchPercent);
  return { items: sorted.slice(0, take), isFallback: false, cheapestGap: null };
}
