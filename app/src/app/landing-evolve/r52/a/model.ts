// Pure, deterministic derivation functions. Every number on this page that claims to be "live"
// is computed here from (listing, scrubDay) -- nothing is a hardcoded literal copy-pasted at
// generation time, and nothing uses Math.random/Date.now.

import type { Listing } from "./data";

export type ItemState = {
  price: number;
  discountPct: number;
  matchPct: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Current asking price: decays from startPrice toward floorPrice as listing age grows. */
export function computePrice(item: Listing, day: number): number {
  const decayed =
    item.floorPrice + (item.startPrice - item.floorPrice) * Math.exp(-day / item.halfLifeDays);
  return Math.round(decayed);
}

/** % off original retail at the current price. */
export function computeDiscountPct(item: Listing, day: number): number {
  const price = computePrice(item, day);
  return Math.round(100 * (1 - price / item.retailPrice));
}

/** AI match score: rises from the item's own floor toward a shared ceiling as price softens. */
export function computeMatchPct(item: Listing, day: number): number {
  const ceiling = 97;
  const tau = item.halfLifeDays * 1.4;
  const grown = item.baseMatchFloor + (ceiling - item.baseMatchFloor) * (1 - Math.exp(-day / tau));
  return Math.round(clamp(grown, item.baseMatchFloor, ceiling));
}

export function computeItemState(item: Listing, day: number): ItemState {
  return {
    price: computePrice(item, day),
    discountPct: computeDiscountPct(item, day),
    matchPct: computeMatchPct(item, day),
  };
}

export type Aggregate = {
  avgMatchPct: number;
  avgDiscountPct: number;
  estDaysToMatch: number;
  qualifiedBuyers: number;
};

/** Pool of buyers whose budget currently clears at least one listing -- scales with listing age. */
export function computeQualifiedBuyers(day: number): number {
  const raw = 600 + day * 18.5;
  return Math.round(raw / 10) * 10;
}

/** Estimated remaining days until match, given how far price has already softened. */
export function computeEstDaysToMatch(day: number): number {
  return Math.max(6, Math.round(42 - day * 0.55));
}

export function computeAggregate(items: Listing[], day: number): Aggregate {
  const states = items.map((item) => computeItemState(item, day));
  const avgMatchPct = Math.round(
    states.reduce((sum, state) => sum + state.matchPct, 0) / states.length,
  );
  const avgDiscountPct = Math.round(
    states.reduce((sum, state) => sum + state.discountPct, 0) / states.length,
  );
  return {
    avgMatchPct,
    avgDiscountPct,
    estDaysToMatch: computeEstDaysToMatch(day),
    qualifiedBuyers: computeQualifiedBuyers(day),
  };
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
