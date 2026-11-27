// native/src/evolve/r51/b/data.ts — deterministic dummy data + pure calc
// helpers for the Combine Shipments screen.
//
// No Math.random / Date.now / argument-less `new Date()` anywhere below —
// every number here is a fixed literal, and every derived number (combined
// weight, combined shipping cost, savings) is computed from those literals
// by a pure function so re-selecting the same items always yields the same
// result.

export type ShipmentItem = {
  id: string;
  title: string;
  sellerName: string;
  orderId: string;
  categoryLabel: string;
  swatchIndex: 1 | 2 | 3;
  /** Fixed package weight for this item, in grams. */
  weightGrams: number;
  /** What shipping this one item alone would cost, in KRW. Fixed field. */
  standaloneShippingCostWon: number;
  /**
   * Whether the selling seller supports folding this item into a combined
   * shipment with other purchases. When false, the row is shown but cannot
   * be selected.
   */
  combineEligible: boolean;
};

// Buyer's purchased-but-not-yet-shipped items, spanning three different
// orders from three different sellers — combining is cross-seller in this
// catalog's version of the mechanic (the marketplace's own consolidation
// hub repacks and forwards as one outbound parcel), not same-seller-only.
export const PENDING_SHIPMENT_ITEMS: ShipmentItem[] = [
  {
    id: "it-canon-ae1",
    title: "Canon AE-1 35mm Film Camera",
    sellerName: "Mina Park",
    orderId: "ORD-20261022-0931",
    categoryLabel: "Cameras",
    swatchIndex: 1,
    weightGrams: 620,
    standaloneShippingCostWon: 4200,
    combineEligible: true,
  },
  {
    id: "it-50mm-lens",
    title: "50mm f/1.8 Prime Lens",
    sellerName: "Mina Park",
    orderId: "ORD-20261022-0931",
    categoryLabel: "Lenses",
    swatchIndex: 2,
    weightGrams: 310,
    standaloneShippingCostWon: 3100,
    combineEligible: true,
  },
  {
    id: "it-leather-strap",
    title: "Leather Camera Strap",
    sellerName: "Jonghyun Woo",
    orderId: "ORD-20261025-1142",
    categoryLabel: "Accessories",
    swatchIndex: 3,
    weightGrams: 90,
    standaloneShippingCostWon: 2500,
    combineEligible: true,
  },
  {
    id: "it-kodak-gold",
    title: "Kodak Gold 200 Film, 3-Pack",
    sellerName: "Jonghyun Woo",
    orderId: "ORD-20261025-1142",
    categoryLabel: "Film",
    swatchIndex: 1,
    weightGrams: 150,
    standaloneShippingCostWon: 2500,
    combineEligible: true,
  },
  {
    id: "it-tripod",
    title: "Manfrotto Compact Tripod",
    sellerName: "Studio Frame Supply",
    orderId: "ORD-20261028-0507",
    categoryLabel: "Tripods",
    swatchIndex: 2,
    weightGrams: 980,
    standaloneShippingCostWon: 5200,
    combineEligible: true,
  },
  {
    id: "it-cleaning-kit",
    title: "Camera Cleaning Kit",
    sellerName: "Studio Frame Supply",
    orderId: "ORD-20261028-0507",
    categoryLabel: "Accessories",
    swatchIndex: 3,
    weightGrams: 140,
    standaloneShippingCostWon: 2200,
    // This seller has combined-shipment support switched off — kept in the
    // list (so the buyer can see why it's missing from their options)
    // rather than silently hidden.
    combineEligible: false,
  },
];

/** Minimum number of items required before a combine can be confirmed. */
export const MIN_MERGE_COUNT = 2;

type WeightTier = { upToGrams: number; costWon: number };

// Fixed flat-rate tiers for a single combined parcel — stands in for a
// carrier rate card. Deterministic step function, not a formula pulled from
// a live rate service.
const SHIPPING_WEIGHT_TIERS: WeightTier[] = [
  { upToGrams: 200, costWon: 2200 },
  { upToGrams: 500, costWon: 3100 },
  { upToGrams: 1000, costWon: 4200 },
  { upToGrams: 2000, costWon: 5600 },
  { upToGrams: 3500, costWon: 7200 },
  { upToGrams: Infinity, costWon: 9400 },
];

export function shippingCostForWeight(totalGrams: number): number {
  for (const tier of SHIPPING_WEIGHT_TIERS) {
    if (totalGrams <= tier.upToGrams) return tier.costWon;
  }
  return SHIPPING_WEIGHT_TIERS[SHIPPING_WEIGHT_TIERS.length - 1].costWon;
}

export type CombineEstimate = {
  totalWeightGrams: number;
  combinedCostWon: number;
  standaloneTotalWon: number;
  savingsWon: number;
};

/**
 * Pure recalculation of the combined-shipment estimate from the currently
 * selected items' fixed weight/cost fields. Called with a new array on
 * every selection change — never reads randomness, the clock, or any
 * external/mutable source.
 */
export function estimateCombinedShipment(items: ShipmentItem[]): CombineEstimate {
  const totalWeightGrams = items.reduce((sum, item) => sum + item.weightGrams, 0);
  const combinedCostWon = items.length > 0 ? shippingCostForWeight(totalWeightGrams) : 0;
  const standaloneTotalWon = items.reduce(
    (sum, item) => sum + item.standaloneShippingCostWon,
    0
  );
  const savingsWon = Math.max(0, standaloneTotalWon - combinedCostWon);
  return { totalWeightGrams, combinedCostWon, standaloneTotalWon, savingsWon };
}

export function formatWon(amountWon: number): string {
  const digits = Math.round(amountWon).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Trailing space keeps the ₩ glyph's stroke clear of the first tabular-num
  // digit at body text size (see repo-wide ₩ guidance).
  return `₩ ${withCommas}`;
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = Math.round(grams / 100) / 10;
    return `${kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1)} kg`;
  }
  return `${grams} g`;
}
