/**
 * Fixed, hand-authored dataset. No Math.random / Date.now / new Date anywhere
 * in this route — every seller sits at a permanent (distance, bearing) pair,
 * and the only thing that changes at runtime is which of them read as
 * "in range" for the current slider value. Positions never move; only style
 * does, as a pure function of `radiusMi`.
 */

export type SellerCategory = "Outerwear" | "Footwear" | "Bags" | "Electronics";

export type Seller = {
  id: string;
  name: string;
  category: SellerCategory;
  /** Fixed straight-line distance from the shopper, in miles. */
  distanceMi: number;
  /** Fixed compass bearing, degrees clockwise from north (0–360). */
  bearingDeg: number;
};

export const SELLERS: Seller[] = [
  { id: "finch", name: "Finch & Co.", category: "Outerwear", distanceMi: 1.2, bearingDeg: 300 },
  { id: "westport", name: "Westport Collective", category: "Footwear", distanceMi: 3.3, bearingDeg: 46 },
  { id: "harlow", name: "Harlow Vintage", category: "Bags", distanceMi: 2.4, bearingDeg: 118 },
  { id: "northloop", name: "North Loop Trade", category: "Electronics", distanceMi: 4.1, bearingDeg: 205 },
  { id: "alder", name: "Alder Street Supply", category: "Outerwear", distanceMi: 9.5, bearingDeg: 70 },
  { id: "prairie", name: "Prairie Edge Market", category: "Footwear", distanceMi: 7.9, bearingDeg: 260 },
  { id: "rivergate", name: "Rivergate Resale", category: "Bags", distanceMi: 6.8, bearingDeg: 165 },
  { id: "birchwood", name: "Birchwood Exchange", category: "Electronics", distanceMi: 12.3, bearingDeg: 320 },
  { id: "cedarline", name: "Cedarline Goods", category: "Outerwear", distanceMi: 15.7, bearingDeg: 95 },
  { id: "mill", name: "Mill District Swap", category: "Bags", distanceMi: 18.4, bearingDeg: 350 },
  { id: "lowertown", name: "Lowertown Relics", category: "Footwear", distanceMi: 21.6, bearingDeg: 140 },
  { id: "saltbox", name: "Saltbox Supply Co.", category: "Electronics", distanceMi: 23.8, bearingDeg: 230 },
];

export const MIN_RADIUS_MI = 1;
export const MAX_RADIUS_MI = 25;
export const DEFAULT_RADIUS_MI = 8;
export const RADIUS_PRESETS_MI = [5, 10, 15, 25] as const;

/**
 * Radial scale, in percent of the panel's half-width from center, as a
 * function of miles. At the slider's own max (25mi) this reaches 42%,
 * leaving an 8-percentage-point margin so nothing — pin, glow, or coverage
 * wash — touches the rounded panel edge. The farthest fixed seller (23.8mi)
 * still sits inside that margin at full radius.
 *
 * Square-root, not linear: four fixed sellers (1.2/2.4/3.3/4.1mi) sit close
 * together in true distance, and a linear mile->pixel mapping crowded their
 * pins into less than 24px of separation at 390px (axe target-size: "Safe
 * clickable space has a diameter of ... instead of at least 24px", 4 nodes).
 * A sqrt scale spreads near-center points apart (more pixels per mile close
 * to the shopper, fewer per mile far away) without changing which sellers
 * are "in range" at any given radius — that's still a plain distanceMi<=
 * radiusMi comparison, independent of pixel layout. Both the pins AND the
 * coverage-wash circle use this same function, so a pin still sits exactly
 * on the wash boundary when distanceMi===radiusMi; a different scale per
 * element would have desynced them.
 */
function radialScalePct(mi: number): number {
  return 42 * Math.sqrt(mi / MAX_RADIUS_MI);
}

export function pinPosition(seller: Pick<Seller, "distanceMi" | "bearingDeg">): {
  leftPct: number;
  topPct: number;
} {
  const rad = (seller.bearingDeg * Math.PI) / 180;
  const r = radialScalePct(seller.distanceMi);
  return {
    leftPct: 50 + r * Math.sin(rad),
    topPct: 50 - r * Math.cos(rad),
  };
}

/** Diameter, in percent of the (square) panel's own width, of the current coverage wash. */
export function coverageDiameterPct(radiusMi: number): number {
  return 2 * radialScalePct(radiusMi);
}

export type RadiusStats = {
  inRangeCount: number;
  totalSellers: number;
  nearestInRangeMi: number | null;
  farthestInRangeMi: number | null;
};

export function statsForRadius(radiusMi: number): RadiusStats {
  const inRange = SELLERS.filter((s) => s.distanceMi <= radiusMi);
  const distances = inRange.map((s) => s.distanceMi);
  return {
    inRangeCount: inRange.length,
    totalSellers: SELLERS.length,
    nearestInRangeMi: distances.length ? Math.min(...distances) : null,
    farthestInRangeMi: distances.length ? Math.max(...distances) : null,
  };
}

export type Listing = {
  id: string;
  title: string;
  matchPct: number;
  grade: string;
  verified: boolean;
  discountPct: number;
  photoId: string;
  sellerId: string;
};

export const LISTINGS: Listing[] = [
  {
    id: "jacket",
    title: "Waxed field jacket, size M",
    matchPct: 94,
    grade: "A-",
    verified: true,
    discountPct: 22,
    photoId: "1495121605193-b116b5b09a56",
    sellerId: "finch",
  },
  {
    id: "shoes",
    title: "Trail running shoes, worn twice",
    matchPct: 91,
    grade: "A",
    verified: true,
    discountPct: 19,
    photoId: "1524805444758-089113d48a6d",
    sellerId: "harlow",
  },
  {
    id: "watch",
    title: "Automatic watch, steel case",
    matchPct: 88,
    grade: "B+",
    verified: true,
    discountPct: 15,
    photoId: "1441986300917-64674bd600d8",
    sellerId: "westport",
  },
];

export function sellerById(id: string): Seller | undefined {
  return SELLERS.find((s) => s.id === id);
}
