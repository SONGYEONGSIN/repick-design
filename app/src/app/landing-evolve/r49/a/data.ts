// Static dataset for the "Live Match Search" candidate. No Math.random, no Date.now
// anywhere — every number is a fixed literal, and every number derived from these is
// a pure function in search-math.ts, never a duplicated literal. Photo ids are fixed,
// human-picked Unsplash ids already used elsewhere in this catalog (not a random
// image feed) — see landing-evolve/r29/a/data.ts and r48/a/data.ts for the same ids.

export type ConditionGrade = "Like New" | "Excellent" | "Good";

export interface Listing {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  descriptor: string;
  price: number;
  originalPrice: number;
  grade: ConditionGrade;
  verifiedSeller: boolean;
  aiReasoning: string;
  photoId: string;
  alt: string;
}

// The fixed comparable-listings pool the search device matches queries against.
// Four categories on purpose (camera x3, watch x2, sneakers x2, chair x1) so that a
// broad query ("camera") returns several results and a narrower one ("leica" or
// "sony camera") visibly narrows the set — the device's whole premise.
export const LISTINGS: Listing[] = [
  {
    id: "sony-a7iv",
    title: "Sony A7 IV Mirrorless Body",
    brand: "Sony",
    model: "a7 iv",
    category: "camera",
    descriptor: "full-frame mirrorless body",
    price: 1680,
    originalPrice: 2498,
    grade: "Excellent",
    verifiedSeller: true,
    aiReasoning: "AI match: priced under 9 listings with the same shutter count",
    photoId: "1495121605193-b116b5b09a56",
    alt: "Full-frame mirrorless camera body photographed on a plain background",
  },
  {
    id: "fuji-xt4",
    title: "Fujifilm X-T4 Body",
    brand: "Fujifilm",
    model: "x-t4",
    category: "camera",
    descriptor: "aps-c mirrorless body",
    price: 1041,
    originalPrice: 1699,
    grade: "Good",
    verifiedSeller: true,
    aiReasoning: "AI match: closest substitute for 6 sold-out X-T4 listings",
    photoId: "1502920917128-1aa500764cbd",
    alt: "Fujifilm X-T4 mirrorless camera body photographed on a plain background",
  },
  {
    id: "leica-m6",
    title: "Leica M6 Rangefinder",
    brand: "Leica",
    model: "m6",
    category: "camera",
    descriptor: "35mm film rangefinder",
    price: 3800,
    originalPrice: 4750,
    grade: "Like New",
    verifiedSeller: true,
    aiReasoning: "AI match: matches 41 saved searches for this exact model",
    photoId: "1543076447-215ad9ba6923",
    alt: "Leica M6 rangefinder film camera photographed on a plain background",
  },
  {
    id: "omega-speedmaster",
    title: "Omega Speedmaster Professional",
    brand: "Omega",
    model: "speedmaster professional",
    category: "watch",
    descriptor: "chronograph dive watch",
    price: 4480,
    originalPrice: 6400,
    grade: "Excellent",
    verifiedSeller: true,
    aiReasoning: "AI match: within 3% of the last 90-day auction average",
    photoId: "1524805444758-089113d48a6d",
    alt: "Omega Speedmaster Professional chronograph watch photographed on a plain background",
  },
  {
    id: "rolex-oyster",
    title: "Rolex Oyster Perpetual 36",
    brand: "Rolex",
    model: "oyster perpetual 36",
    category: "watch",
    descriptor: "automatic dress watch",
    price: 5760,
    originalPrice: 7200,
    grade: "Good",
    verifiedSeller: false,
    aiReasoning: "AI match: box and papers verified against 3 sold comps",
    photoId: "1523275335684-37898b6baf30",
    alt: "Rolex Oyster Perpetual watch photographed on a plain background",
  },
  {
    id: "nike-af1",
    title: "Nike Air Force 1 High-Top",
    brand: "Nike",
    model: "air force 1 high-top",
    category: "sneakers",
    descriptor: "basketball shoes size 10",
    price: 88,
    originalPrice: 160,
    grade: "Like New",
    verifiedSeller: false,
    aiReasoning: "AI match: fits 310 saved searches for this size and colorway",
    photoId: "1441986300917-64674bd600d8",
    alt: "Nike Air Force 1 high-top sneaker photographed on a plain background",
  },
  {
    id: "adidas-terrex",
    title: "Adidas Terrex Trail Runner",
    brand: "Adidas",
    model: "terrex trail runner",
    category: "sneakers",
    descriptor: "running shoes size 9",
    price: 64,
    originalPrice: 150,
    grade: "Good",
    verifiedSeller: true,
    aiReasoning: "AI match: tread wear consistent with under 40 trail miles",
    photoId: "1542291026-7eec264c27ff",
    alt: "Grey and white trail running sneaker photographed on a plain background",
  },
  {
    id: "lindgren-armchair",
    title: "Mid-Century Accent Armchair",
    brand: "West End Studio",
    model: "lindgren armchair",
    category: "chair",
    descriptor: "upholstered accent seating",
    price: 225,
    originalPrice: 520,
    grade: "Like New",
    verifiedSeller: true,
    aiReasoning: "AI match: closest substitute for 4 recently sold-out listings",
    photoId: "1489987707025-afc232f7ea0f",
    alt: "Upholstered mid-century accent armchair photographed on a plain background",
  },
];

// The query the page renders with before any visitor interaction — deliberately
// non-empty (not "empty until typed") so the hero's proof cards are populated at
// first paint, per the structural requirement. "camera" matches three listings here.
export const DEFAULT_QUERY = "camera";

export interface QuickFilter {
  id: string;
  label: string;
  query: string;
}

// Tap-to-fill suggestions shown under the search input — the "autocomplete" half of
// the device for visitors who'd rather tap than type. Each just sets the same query
// state the text input controls, so it runs through the identical match/rank path.
export const QUICK_FILTERS: QuickFilter[] = [
  { id: "camera", label: "Camera", query: "camera" },
  { id: "watch", label: "Watch", query: "watch" },
  { id: "sneakers", label: "Sneakers", query: "sneakers" },
  { id: "chair", label: "Chair", query: "chair" },
];

// Fixed curated subset shown in the standalone Product Preview section — one per
// category, independent of whatever the visitor has typed into the search device.
export const PREVIEW_IDS = ["leica-m6", "omega-speedmaster", "nike-af1"] as const;

export const TESTIMONIALS = [
  {
    quote:
      "I typed my camera's exact model and watched three comps appear with real sale prices before I'd even finished the sentence.",
    name: "Priya N.",
    role: "Sold 14 items",
  },
  {
    quote:
      "Narrowing the search from “watch” to “Omega” and seeing the match percentage climb is what convinced me the pricing was real.",
    name: "Dorian K.",
    role: "Sold 9 items",
  },
] as const;
