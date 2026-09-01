// native/src/evolve/r17/c/data.ts — auto-native-r17 candidate c: "Price Suggestion & Market Comps".
// Deterministic dummy data + the pricing math itself. No Math.random / Date.now / argument-less
// `new Date()` anywhere below — every value is a fixed literal or a pure function over fixed literals.

export type Condition = "New" | "Like New" | "Good" | "Fair" | "Worn";

// Ordinal condition scale used by the weighting math below (higher = better condition).
export const CONDITION_SCORE: Record<Condition, number> = {
  New: 5,
  "Like New": 4,
  Good: 3,
  Fair: 2,
  Worn: 1,
};

export type SellerItem = {
  title: string;
  category: string;
  condition: Condition;
};

// The listing the seller is currently creating — this screen prices *this* item.
export const SELLER_ITEM: SellerItem = {
  title: "Sony WH-1000XM4 Wireless Headphones",
  category: "Electronics · Headphones",
  condition: "Good",
};

export type SoldComp = {
  id: string;
  title: string;
  condition: Condition;
  /** Final sold price in KRW — a real historical transaction, not an asking price. */
  soldPriceWon: number;
  /** Days since the sale closed (fixed, not computed from a live clock). */
  daysAgo: number;
};

// 5 recently-sold listings of the same model, matched by repick's comp search — fixed so the
// suggestion below is fully reproducible. Deliberately spans condition and recency so the
// weighting has real work to do (see computeSuggestedPrice).
export const COMPS: SoldComp[] = [
  { id: "comp-1", title: "Sony WH-1000XM4, Black", condition: "Like New", soldPriceWon: 189000, daysAgo: 2 },
  { id: "comp-2", title: "Sony WH-1000XM4, Silver", condition: "Good", soldPriceWon: 164000, daysAgo: 5 },
  { id: "comp-3", title: "Sony WH-1000XM4, Black", condition: "Good", soldPriceWon: 158000, daysAgo: 9 },
  { id: "comp-4", title: "Sony WH-1000XM4, Blue", condition: "Fair", soldPriceWon: 131000, daysAgo: 13 },
  { id: "comp-5", title: "Sony WH-1000XM4, Black", condition: "Like New", soldPriceWon: 196000, daysAgo: 24 },
];

export const PRICE_STEP = 1000;

/* ───────── the pricing math (real, inspectable — not a hardcoded literal) ───────── */

// Recency weight: halves roughly every 2 weeks. Pure function of a fixed integer.
export function recencyWeight(daysAgo: number): number {
  return 1 / (1 + daysAgo / 14);
}

// Condition-match weight: 1.0 at an exact match, down to a 0.25 floor 3+ tiers away —
// a comp in wildly different condition still counts a little, never zero.
export function conditionWeight(compCondition: Condition, sellerCondition: Condition): number {
  const diff = Math.abs(CONDITION_SCORE[compCondition] - CONDITION_SCORE[sellerCondition]);
  return Math.max(1 - diff * 0.25, 0.25);
}

export function compWeight(comp: SoldComp, sellerCondition: Condition): number {
  return recencyWeight(comp.daysAgo) * conditionWeight(comp.condition, sellerCondition);
}

// Weighted mean of comp sold prices, weighted by recency × condition-match, rounded to the
// nearest ₩1,000. This is what "AI-suggested price" means on this screen — swap SELLER_ITEM's
// condition or COMPS above and the number below changes with it.
export function computeSuggestedPrice(comps: SoldComp[], sellerCondition: Condition): number {
  let sumWeight = 0;
  let sumWeightedPrice = 0;
  for (const c of comps) {
    const w = compWeight(c, sellerCondition);
    sumWeight += w;
    sumWeightedPrice += w * c.soldPriceWon;
  }
  const raw = sumWeight > 0 ? sumWeightedPrice / sumWeight : 0;
  return Math.round(raw / 1000) * 1000;
}

export function compRange(comps: SoldComp[]): { min: number; max: number } {
  const prices = comps.map((c) => c.soldPriceWon);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export type PriceCategory = "below-range" | "below-suggested" | "at-suggested" | "above-suggested" | "above-range";

// Categorizes the seller's *current* chosen price against the suggestion and the comp range.
// Pure function of (current, suggested, range) — this is what the live "why this price" copy reads.
export function categorizePrice(current: number, suggested: number, range: { min: number; max: number }): PriceCategory {
  if (current < range.min) return "below-range";
  if (current > range.max) return "above-range";
  if (current === suggested) return "at-suggested";
  return current < suggested ? "below-suggested" : "above-suggested";
}

export const CATEGORY_LABEL: Record<PriceCategory, string> = {
  "below-range": "Below every comparable sale",
  "below-suggested": "Below the AI suggestion, within the typical range",
  "at-suggested": "Matches the AI suggestion",
  "above-suggested": "Above the AI suggestion, within the typical range",
  "above-range": "Above every comparable sale",
};

// Signed % difference from the suggested price, one decimal place.
export function diffPct(current: number, suggested: number): number {
  if (suggested === 0) return 0;
  return Math.round(((current - suggested) / suggested) * 1000) / 10;
}

export function pctText(pct: number): string {
  return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

/* ───────── formatting ───────── */

// ₩ formatting: a visible space between the glyph and the digits, matching the resolution
// already established in native/src/wallet/data.ts (₩ crossbar vs. adjacent digit stroke risk
// flagged in native/GENERATION.md §1) — same currency, same repo, price is this screen's entire
// subject so this is not a place to relitigate a settled provision with a fresh guess.
export function formatWon(amount: number): string {
  const digits = Math.round(Math.abs(amount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${amount < 0 ? "−" : ""}₩ ${digits}`;
}

export function agoText(daysAgo: number): string {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "1 day ago";
  return `${daysAgo} days ago`;
}
