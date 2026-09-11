// native/src/evolve/r19/b/data.ts
// Deterministic dummy data for the Bundle Listing Builder.
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value is a fixed
// literal, and the one pre-existing bundle's totals were hand-computed from pricing.ts's formula
// (see the comment on it below) so the screen opens in an internally-consistent state.

export interface ActiveListing {
  id: string;
  title: string;
  /** 2-letter placeholder shown inside the thumbnail box (stand-in for a photo). */
  thumbLabel: string;
  priceKrw: number;
  category: string;
}

// A seller's active (unsold, currently listed) inventory — the pool this screen selects from.
export const ACTIVE_LISTINGS: ActiveListing[] = [
  { id: "al1", title: "Ceramic Mug Set of 4", thumbLabel: "CM", priceKrw: 18000, category: "Kitchen" },
  { id: "al2", title: "Linen Table Runner", thumbLabel: "LT", priceKrw: 14000, category: "Home" },
  { id: "al3", title: "Bamboo Cutting Board", thumbLabel: "BC", priceKrw: 22000, category: "Kitchen" },
  { id: "al4", title: "Wool Throw Blanket", thumbLabel: "WB", priceKrw: 46000, category: "Home" },
  { id: "al5", title: "Cast Iron Trivet, Set of 2", thumbLabel: "CT", priceKrw: 12000, category: "Kitchen" },
  { id: "al6", title: "Glass Pour-Over Carafe", thumbLabel: "PC", priceKrw: 28000, category: "Kitchen" },
  { id: "al7", title: "Rattan Placemat Set of 4", thumbLabel: "RP", priceKrw: 16000, category: "Home" },
  { id: "al8", title: "Beeswax Candle Trio", thumbLabel: "BX", priceKrw: 21000, category: "Home" },
];

export interface PublishedBundle {
  id: string;
  title: string;
  itemCount: number;
  totalKrw: number;
  discountPercent: number;
}

// One bundle this seller already published, shown so the screen doesn't open empty below the
// picker. Its numbers were computed by hand from the SAME formula in pricing.ts, using items
// al1 + al3 + al5 (18000 + 22000 + 12000 = 52000 subtotal; 3 items -> 12% -> 6240 raw discount,
// floored to 6200 -> 45800 total) — kept as literals here since this bundle's source items are no
// longer individually selectable (they already shipped as a bundle).
export const INITIAL_PUBLISHED_BUNDLES: PublishedBundle[] = [
  { id: "pb1", title: "Kitchen Starter Bundle", itemCount: 3, totalKrw: 45800, discountPercent: 12 },
];
