// Static dataset for the "Price Window" candidate. Every number below is a fixed literal —
// no Math.random, no Date.now, no new Date anywhere in this folder. Month labels are derived
// from array position by a pure function in model.ts, never from a real clock.
//
// Photo ids are fixed, human-picked Unsplash ids already used (and already verified to resolve)
// elsewhere in this catalog — see landing-evolve/r49/a/data.ts for the same three camera ids.

export type ConditionGrade = "Like New" | "Excellent" | "Good" | "Fair";

export interface PricePoint {
  /** Resale price in USD for this month, aggregated across repick's completed sales. */
  price: number;
}

/**
 * 24 months of aggregate resale price for one fixed listing: a Sony a7 III body on repick.
 * The story the numbers tell (deliberate, not noise): a steady post-launch decline, a sharp
 * one-month dip around a firmware-recall rumor (months 7-9), a multi-month recovery, then a
 * gentle settle. This gives the timeline brush a real "before / during / after" shape to find.
 */
export const PRICE_HISTORY: readonly PricePoint[] = [
  { price: 2050 }, { price: 2010 }, { price: 1970 }, { price: 1930 }, { price: 1890 }, { price: 1860 },
  { price: 1820 }, { price: 1760 }, { price: 1650 }, { price: 1680 }, { price: 1700 }, { price: 1705 },
  { price: 1695 }, { price: 1700 }, { price: 1690 }, { price: 1710 }, { price: 1740 }, { price: 1765 },
  { price: 1780 }, { price: 1760 }, { price: 1735 }, { price: 1715 }, { price: 1700 }, { price: 1690 },
] as const;

export const MONTH_COUNT = PRICE_HISTORY.length; // 24

/** Smallest window the brush may be resized down to, in months. */
export const MIN_WINDOW = 3;

/** Default window on first paint: the firmware-recall dip, so the proof is never an empty state. */
export const DEFAULT_WINDOW = { start: 6, end: 9 } as const;

export interface WindowPreset {
  id: string;
  label: string;
  start: number;
  end: number;
}

export const WINDOW_PRESETS: readonly WindowPreset[] = [
  { id: "full", label: "Full 24 months", start: 0, end: MONTH_COUNT - 1 },
  { id: "dip", label: "Recall dip", start: 6, end: 9 },
  { id: "recovery", label: "Recovery", start: 10, end: 18 },
  { id: "recent", label: "Last 6 months", start: 18, end: MONTH_COUNT - 1 },
] as const;

export interface Listing {
  id: string;
  title: string;
  seller: string;
  price: number;
  originalPrice: number;
  grade: ConditionGrade;
  verifiedSeller: boolean;
  matchPct: number;
  reasoning: readonly string[];
  photoId: string;
  alt: string;
}

/** Three live listings for the exact model (and two close substitutes) the chart above tracks. */
export const LISTINGS: readonly Listing[] = [
  {
    id: "sony-a7iii",
    title: "Sony a7 III Body",
    seller: "Northline Optics",
    price: 1690,
    originalPrice: 2199,
    grade: "Excellent",
    verifiedSeller: true,
    matchPct: 97,
    reasoning: ["Same model as the chart above", "Shutter count under 5,000"],
    photoId: "1495121605193-b116b5b09a56",
    alt: "Full-frame mirrorless camera body photographed on a plain background",
  },
  {
    id: "fuji-xt4",
    title: "Fujifilm X-T4 Body",
    seller: "Harbor Camera Co.",
    price: 1041,
    originalPrice: 1699,
    grade: "Good",
    verifiedSeller: true,
    matchPct: 81,
    reasoning: ["Closest substitute in your price band", "Battery grip included"],
    photoId: "1502920917128-1aa500764cbd",
    alt: "Fujifilm X-T4 mirrorless camera body photographed on a plain background",
  },
  {
    id: "leica-m6",
    title: "Leica M6 Rangefinder",
    seller: "Private seller",
    price: 3800,
    originalPrice: 4750,
    grade: "Like New",
    verifiedSeller: false,
    matchPct: 64,
    reasoning: ["Rare matching serial range", "No digital body in this bracket matches as closely"],
    photoId: "1543076447-215ad9ba6923",
    alt: "Leica M6 rangefinder film camera photographed on a plain background",
  },
] as const;
