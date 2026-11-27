import {
  Armchair,
  Camera,
  Footprints,
  ShoppingBag,
  Shirt,
  Watch,
  type LucideIcon,
} from "lucide-react";

// All figures below are fixed literals — nothing here is randomized, fetched, or time-based, so
// the demand map and every number derived from it render identically on server and client and on
// every reload. Values are in $K (thousands) of active weekly buyer-matching demand.

export type CategoryId =
  | "sneakers"
  | "watches"
  | "bags"
  | "electronics"
  | "furniture"
  | "outerwear";

export type Category = {
  id: CategoryId;
  label: string;
  /** Active buyer-demand dollars ($K/week) repick's matching engine currently has allocated here. */
  value: number;
  icon: LucideIcon;
};

// Ordered by descending value on purpose: the treemap layout keeps this order, so the largest
// allocation always anchors the same corner of the map regardless of which subset is selected.
export const CATEGORY_POOL: Category[] = [
  { id: "sneakers", label: "Sneakers", value: 640, icon: Footprints },
  { id: "watches", label: "Watches", value: 560, icon: Watch },
  { id: "bags", label: "Bags", value: 410, icon: ShoppingBag },
  { id: "electronics", label: "Electronics", value: 390, icon: Camera },
  { id: "furniture", label: "Furniture", value: 260, icon: Armchair },
  { id: "outerwear", label: "Outerwear", value: 210, icon: Shirt },
];

export const TOTAL_POOL_VALUE: number = CATEGORY_POOL.reduce((sum, c) => sum + c.value, 0);

export const MIN_SELECTED = 1;

export const DEFAULT_SELECTED: CategoryId[] = CATEGORY_POOL.map((c) => c.id);

// A tile's inline label hides below this share of the currently-selected total (self-audited per
// the brief: raw tile fill is never relied on for label contrast, but very thin tiles still don't
// have room to set a legible chip, so below this threshold the info lives in the legend + the
// sr-only table instead of overlapping text on a sliver).
export const LABEL_MIN_SHARE = 0.08;

export function formatDemand(valueK: number): string {
  if (valueK >= 1000) {
    return `$${(valueK / 1000).toFixed(2)}M`;
  }
  return `$${valueK.toLocaleString("en-US")}K`;
}

export function shareOf(valueK: number, totalK: number): number {
  if (totalK <= 0) return 0;
  return valueK / totalK;
}

export function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export type SelectionSummary = {
  items: Category[];
  total: number;
  top: Category | null;
  topShare: number;
};

/**
 * The single source of truth for "what does the current selection add up to" — the demand-map
 * section and the closing CTA both call this on the same `selected` state, so the sentence quoted
 * in the CTA is never a separate, driftable copy of the numbers driving the treemap.
 */
export function summarizeSelection(selected: Set<CategoryId>): SelectionSummary {
  const items = CATEGORY_POOL.filter((c) => selected.has(c.id));
  const total = items.reduce((sum, c) => sum + c.value, 0);
  const top = items[0] ?? null;
  const topShare = top ? shareOf(top.value, total) : 0;
  return { items, total, top, topShare };
}

// ---------------------------------------------------------------------------------------------
// Listings — the product preview section. photoIds are fixed, human-picked Unsplash ids already
// established elsewhere in this catalog (see landing-evolve/r24, r25 data files for reuse).

export type Listing = {
  id: string;
  category: CategoryId;
  categoryLabel: string;
  name: string;
  photoId: string;
  priceOriginal: number;
  priceNow: number;
  match: number;
  gradeLabel: string;
  verified: boolean;
  tags: string[];
};

export const LISTINGS: Listing[] = [
  {
    id: "vortex-04",
    category: "sneakers",
    categoryLabel: "Sneakers",
    name: "Air Vortex '04 Retro",
    photoId: "1543076447-215ad9ba6923",
    priceOriginal: 240,
    priceNow: 168,
    match: 96,
    gradeLabel: "Grade A — Excellent",
    verified: true,
    tags: [
      "Outsole wear consistent with 3 or fewer wears",
      "Colorway verified against factory archive",
      "Box and OG lace set present",
    ],
  },
  {
    id: "meridian-diver",
    category: "watches",
    categoryLabel: "Watches",
    name: "Meridian Diver 200M",
    photoId: "1523275335684-37898b6baf30",
    priceOriginal: 1850,
    priceNow: 1290,
    match: 94,
    gradeLabel: "Grade A− — Very good",
    verified: true,
    tags: [
      "Movement authenticated against serial registry",
      "Bezel action matches inspection video",
      "Full service history on file",
    ],
  },
  {
    id: "atelier-tote",
    category: "bags",
    categoryLabel: "Bags",
    name: "Atelier Tote, Saffiano",
    photoId: "1489987707025-afc232f7ea0f",
    priceOriginal: 980,
    priceNow: 690,
    match: 91,
    gradeLabel: "Grade B+ — Light wear",
    verified: true,
    tags: [
      "Hardware stamp matches authentication database",
      "Corner wear flagged and priced into the estimate",
      "Interior lining photographed in full",
    ],
  },
  {
    id: "aperture-x2",
    category: "electronics",
    categoryLabel: "Electronics",
    name: "Aperture X2 Mirrorless Body",
    photoId: "1441986300917-64674bd600d8",
    priceOriginal: 1400,
    priceNow: 990,
    match: 93,
    gradeLabel: "Grade A — Excellent",
    verified: true,
    tags: [
      "Shutter count pulled straight from EXIF data",
      "Sensor scan shows no dust spots",
      "Battery health verified at 97%",
    ],
  },
  {
    id: "bentwood-lounge",
    category: "furniture",
    categoryLabel: "Furniture",
    name: "Bentwood Lounge Chair",
    photoId: "1608256246200-53e635b5b65f",
    priceOriginal: 620,
    priceNow: 430,
    match: 88,
    gradeLabel: "Grade B — Good",
    verified: true,
    tags: [
      "Joint stability checked on a live video call",
      "Finish wear matched against the reference set",
      "Local pickup window confirmed by the seller",
    ],
  },
  {
    id: "waxed-field-jacket",
    category: "outerwear",
    categoryLabel: "Outerwear",
    name: "Waxed Field Jacket",
    photoId: "1516826957135-700dedea698c",
    priceOriginal: 340,
    priceNow: 228,
    match: 90,
    gradeLabel: "Grade A− — Very good",
    verified: true,
    tags: [
      "Wax coating freshness confirmed on inspection",
      "Zipper and snap function tested end to end",
      "Size tag matches the measurements given",
    ],
  },
];

export const HERO_FEATURED_IDS = ["meridian-diver", "vortex-04"] as const;

// ---------------------------------------------------------------------------------------------
// Social proof

export const STATS: { label: string; value: string }[] = [
  { label: "Listings verified this year", value: "38,200+" },
  { label: "Median grading accuracy", value: "97.4%" },
  { label: "Active demand tracked weekly", value: "$2.47M" },
  { label: "Categories matched live", value: "6" },
];

export const TESTIMONIALS: {
  name: string;
  role: string;
  quote: string;
  initials: string;
}[] = [
  {
    name: "Priya Nandakumar",
    role: "Sneaker reseller, 4 years",
    quote:
      "I used to guess what to list next. Now I check where demand is concentrated before I even photograph anything.",
    initials: "PN",
  },
  {
    name: "Marcus Oyelaran",
    role: "Watch dealer",
    quote:
      "The grade and the price show up together, with the reasoning attached. Buyers stop asking me to prove it.",
    initials: "MO",
  },
  {
    name: "Elin Vasko",
    role: "Vintage furniture seller",
    quote:
      "Furniture is a small slice of demand most weeks, and repick shows that honestly instead of hiding it.",
    initials: "EV",
  },
];
