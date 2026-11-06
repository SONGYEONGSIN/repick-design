// Deterministic 12-week marketplace history for the single-point playhead scrubber.
// No Math.random / Date.now / new Date() anywhere — every number below is a fixed literal so
// server and client render identical markup on hydration, and the dataset never drifts between
// requests. Index 0 = 12 weeks ago, index 11 = "this week" (the default/initial playhead
// position, per the brief's "now is the default" rule for the fold-proof hero).

export interface WeekStat {
  /** 0 = 12 weeks ago ... 11 = this week. */
  index: number;
  matchesFound: number;
  avgPayout: number;
  itemsSold: number;
}

export const WEEKS: readonly WeekStat[] = [
  { index: 0, matchesFound: 212, avgPayout: 142, itemsSold: 164 },
  { index: 1, matchesFound: 228, avgPayout: 146, itemsSold: 171 },
  { index: 2, matchesFound: 241, avgPayout: 151, itemsSold: 179 },
  { index: 3, matchesFound: 236, avgPayout: 149, itemsSold: 176 },
  { index: 4, matchesFound: 255, avgPayout: 158, itemsSold: 188 },
  { index: 5, matchesFound: 248, avgPayout: 155, itemsSold: 182 },
  { index: 6, matchesFound: 221, avgPayout: 147, itemsSold: 168 },
  { index: 7, matchesFound: 265, avgPayout: 162, itemsSold: 196 },
  { index: 8, matchesFound: 278, avgPayout: 168, itemsSold: 203 },
  { index: 9, matchesFound: 291, avgPayout: 171, itemsSold: 211 },
  { index: 10, matchesFound: 304, avgPayout: 176, itemsSold: 219 },
  { index: 11, matchesFound: 312, avgPayout: 181, itemsSold: 226 },
];

export const WEEK_COUNT = WEEKS.length; // 12
export const DEFAULT_WEEK_INDEX = WEEK_COUNT - 1; // "this week" — the fold-proof default.

export const MATCHES_MIN = Math.min(...WEEKS.map((w) => w.matchesFound));
export const MATCHES_MAX = Math.max(...WEEKS.map((w) => w.matchesFound));

export function weekAt(index: number): WeekStat {
  const clamped = Math.min(WEEK_COUNT - 1, Math.max(0, index));
  return WEEKS[clamped];
}

/** "This week" / "N week(s) ago" — grammatical in both directions, never tensed wrong. */
export function periodLabel(index: number): string {
  const weeksAgo = WEEK_COUNT - 1 - index;
  if (weeksAgo === 0) return "this week";
  if (weeksAgo === 1) return "1 week ago";
  return `${weeksAgo} weeks ago`;
}

export function periodLabelCapitalized(index: number): string {
  const label = periodLabel(index);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** Percent change of `field` between 12 weeks ago (index 0) and the current index. Derived
 * fresh from the dataset every call — never a stored/hardcoded delta. */
export function percentChangeFromStart(index: number, field: keyof Omit<WeekStat, "index">): number {
  const start = WEEKS[0][field];
  const current = weekAt(index)[field];
  return Math.round(((current - start) / start) * 100);
}

export interface ProductListing {
  id: string;
  title: string;
  brand: string;
  photoId: string;
  alt: string;
  matchPercent: number;
  matchReasoning: string;
  grade: "A" | "A-" | "B+" | "B";
  priceOriginal: number;
  priceNow: number;
  sellerLabel: string;
}

export function discountPct(p: ProductListing): number {
  return Math.round((1 - p.priceNow / p.priceOriginal) * 100);
}

// Two hero-pinned listings — fully badged (match / grade / verified / discount), always visible
// with zero scroll regardless of where the playhead sits, per the hard fold-proof rule.
export const HERO_PRODUCTS: readonly ProductListing[] = [
  {
    id: "h1",
    title: "Sony A7 III body, Grade A-",
    brand: "Sony",
    photoId: "1502920917128-1aa500764cbd",
    alt: "Photo of the Sony A7 III camera body listing",
    matchPercent: 96,
    matchReasoning: "Same sensor generation as your search history, shutter count verified under 8,000.",
    grade: "A-",
    priceOriginal: 1999,
    priceNow: 1380,
    sellerLabel: "Verified seller · 142 trades",
  },
  {
    id: "h2",
    title: "Canon RF 24-70mm f/2.8L lens",
    brand: "Canon",
    photoId: "1524805444758-089113d48a6d",
    alt: "Photo of the Canon RF 24-70mm lens listing",
    matchPercent: 91,
    matchReasoning: "Matches the mount on your last trade-in and stays under your stated budget.",
    grade: "A",
    priceOriginal: 2299,
    priceNow: 1640,
    sellerLabel: "Verified seller · 58 trades",
  },
];

// Four more listings for the dedicated product-preview section below the hero.
export const PREVIEW_PRODUCTS: readonly ProductListing[] = [
  {
    id: "p1",
    title: "DJI Mic 2 wireless kit",
    brand: "DJI",
    photoId: "1543076447-215ad9ba6923",
    alt: "Photo of the DJI Mic 2 wireless kit listing",
    matchPercent: 88,
    matchReasoning: "Frequently traded alongside cameras in your grade range; full kit, no missing parts.",
    grade: "B+",
    priceOriginal: 299,
    priceNow: 198,
    sellerLabel: "Verified seller · 211 trades",
  },
  {
    id: "p2",
    title: "Peak Design Everyday backpack 20L",
    brand: "Peak Design",
    photoId: "1489987707025-afc232f7ea0f",
    alt: "Photo of the Peak Design Everyday backpack listing",
    matchPercent: 84,
    matchReasoning: "Fits the body-plus-two-lens kit size you traded in, light shelf wear only.",
    grade: "B",
    priceOriginal: 280,
    priceNow: 176,
    sellerLabel: "Verified seller · 97 trades",
  },
  {
    id: "p3",
    title: "Sigma 35mm f/1.4 Art prime",
    brand: "Sigma",
    photoId: "1516035069371-29a1b244cc32",
    alt: "Photo of the Sigma 35mm f/1.4 Art lens listing",
    matchPercent: 90,
    matchReasoning: "Closest focal length to your three most-viewed listings this quarter.",
    grade: "A-",
    priceOriginal: 899,
    priceNow: 612,
    sellerLabel: "Verified seller · 76 trades",
  },
  {
    id: "p4",
    title: "SanDisk Extreme Pro 128GB CFexpress",
    brand: "SanDisk",
    photoId: "1587825140708-dfaf72ae4b04",
    alt: "Photo of the SanDisk Extreme Pro CFexpress card listing",
    matchPercent: 82,
    matchReasoning: "Matches the card slot on the camera body in your current match, unopened box.",
    grade: "A",
    priceOriginal: 249,
    priceNow: 179,
    sellerLabel: "Verified seller · 134 trades",
  },
];
