// native/src/evolve/r49/a/data.ts
// Deterministic dummy data for the Nearby Sellers Map Browse screen.
// No Math.random / Date.now / new Date anywhere — every value, including
// every pin's x/y position on the abstract map, is a fixed literal.

export type CategoryKey =
  | "apparel"
  | "outdoorGear"
  | "furniture"
  | "electronics"
  | "collectibles"
  | "homeGoods";

export type CategoryFilterKey = "all" | CategoryKey;

export interface NearbySeller {
  id: string;
  name: string;
  category: CategoryKey;
  /** Straight-line distance from the buyer, in miles, fixed to one decimal. */
  distanceMi: number;
  itemCount: number;
  priceRangeLabel: string;
  /** Fixed position on the abstract map, 0–100, percent of the square map canvas. */
  pinXPct: number;
  pinYPct: number;
  /** Short fixed description of how this seller prefers to hand off items locally. */
  meetupNote: string;
}

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  apparel: "Apparel",
  outdoorGear: "Outdoor Gear",
  furniture: "Furniture",
  electronics: "Electronics",
  collectibles: "Collectibles",
  homeGoods: "Home Goods",
};

export const RADIUS_OPTIONS: ReadonlyArray<number> = [1, 3, 5, 10];

export const CATEGORY_FILTER_OPTIONS: ReadonlyArray<{
  key: CategoryFilterKey;
  label: string;
}> = [
  { key: "all", label: "All categories" },
  { key: "apparel", label: "Apparel" },
  { key: "outdoorGear", label: "Outdoor Gear" },
  { key: "furniture", label: "Furniture" },
  { key: "electronics", label: "Electronics" },
  { key: "collectibles", label: "Collectibles" },
  { key: "homeGoods", label: "Home Goods" },
];

export interface AppliedFilters {
  radiusMi: number;
  category: CategoryFilterKey;
}

export const DEFAULT_FILTERS: AppliedFilters = {
  radiusMi: 10,
  category: "all",
};

/** Concentric distance-ring backdrop for the abstract map, as % of the square canvas. */
export const MAP_RINGS: ReadonlyArray<{ sizePct: number; label: string }> = [
  { sizePct: 28, label: "1 mi" },
  { sizePct: 58, label: "3 mi" },
  { sizePct: 90, label: "5 mi" },
];

export const NEARBY_SELLERS: ReadonlyArray<NearbySeller> = [
  {
    id: "slr-maya",
    name: "Maya's Vintage Finds",
    category: "apparel",
    distanceMi: 0.8,
    itemCount: 14,
    priceRangeLabel: "$8 – $45",
    pinXPct: 56,
    pinYPct: 45,
    meetupNote: "Prefers the Birchwood Station parking lot.",
  },
  {
    id: "slr-northloop",
    name: "North Loop Tools",
    category: "outdoorGear",
    distanceMi: 1.4,
    itemCount: 9,
    priceRangeLabel: "$15 – $120",
    pinXPct: 42,
    pinYPct: 38,
    meetupNote: "Meets at the North Loop community center.",
  },
  {
    id: "slr-birchwood",
    name: "Birchwood Furniture Co.",
    category: "furniture",
    distanceMi: 2.1,
    itemCount: 6,
    priceRangeLabel: "$40 – $300",
    pinXPct: 63,
    pinYPct: 60,
    meetupNote: "Curbside pickup only, porch drop available.",
  },
  {
    id: "slr-circuit",
    name: "Circuit & Spark Electronics",
    category: "electronics",
    distanceMi: 2.6,
    itemCount: 11,
    priceRangeLabel: "$10 – $250",
    pinXPct: 34,
    pinYPct: 62,
    meetupNote: "Meets weekday evenings near the transit plaza.",
  },
  {
    id: "slr-collectors",
    name: "The Collector's Shelf",
    category: "collectibles",
    distanceMi: 3.3,
    itemCount: 20,
    priceRangeLabel: "$5 – $180",
    pinXPct: 70,
    pinYPct: 30,
    meetupNote: "Prefers the library branch lobby.",
  },
  {
    id: "slr-harborview",
    name: "Harborview Home Goods",
    category: "homeGoods",
    distanceMi: 4.0,
    itemCount: 8,
    priceRangeLabel: "$12 – $90",
    pinXPct: 25,
    pinYPct: 70,
    meetupNote: "Driveway pickup, weekends preferred.",
  },
  {
    id: "slr-ridgeline",
    name: "Ridgeline Outfitters",
    category: "outdoorGear",
    distanceMi: 4.7,
    itemCount: 5,
    priceRangeLabel: "$30 – $200",
    pinXPct: 80,
    pinYPct: 72,
    meetupNote: "Meets at the trailhead parking area.",
  },
  {
    id: "slr-secondstory",
    name: "Second Story Apparel",
    category: "apparel",
    distanceMi: 6.2,
    itemCount: 17,
    priceRangeLabel: "$6 – $60",
    pinXPct: 18,
    pinYPct: 20,
    meetupNote: "Meets outside the Second Story thrift shop.",
  },
  {
    id: "slr-analogaudio",
    name: "Analog Audio Exchange",
    category: "electronics",
    distanceMi: 7.8,
    itemCount: 4,
    priceRangeLabel: "$20 – $400",
    pinXPct: 88,
    pinYPct: 50,
    meetupNote: "By appointment near the east commuter lot.",
  },
  {
    id: "slr-oldmill",
    name: "Old Mill Antiques",
    category: "collectibles",
    distanceMi: 9.1,
    itemCount: 13,
    priceRangeLabel: "$10 – $150",
    pinXPct: 12,
    pinYPct: 85,
    meetupNote: "Meets at the old mill visitor lot, Saturdays.",
  },
];
