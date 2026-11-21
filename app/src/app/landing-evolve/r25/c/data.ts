// Category Demand Ribbon — static, hand-authored catalog + pure derivation helpers.
// No randomness anywhere (no Math.random / Date.now / new Date()): every base number below is a
// fixed literal, and every derived number (band value, stack order, share, index) is a plain
// arithmetic function of the current slider weights. Same weights always produce the same ribbon.

export type CategoryId = "lenses" | "bodies" | "accessories" | "vintage";

export const CATEGORY_IDS: CategoryId[] = ["lenses", "bodies", "accessories", "vintage"];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  short: string;
  blurb: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  lenses: {
    id: "lenses",
    label: "Lenses",
    short: "Lenses",
    blurb: "Primes and zooms — the deepest resale market on repick.",
  },
  bodies: {
    id: "bodies",
    label: "Camera Bodies",
    short: "Bodies",
    blurb: "Mirrorless and DSLR bodies — value moves with new-model cycles.",
  },
  accessories: {
    id: "accessories",
    label: "Accessories",
    short: "Accessories",
    blurb: "Bags, grips, straps, flashes — steady, lower-ceiling demand.",
  },
  vintage: {
    id: "vintage",
    label: "Vintage Film Gear",
    short: "Vintage film",
    blurb: "Manual-focus and film bodies — small but climbing all year.",
  },
};

// Trailing 12 months ending on the page's "now" (Sep 2026).
export const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
export const MONTHS_FULL = [
  "October 2025",
  "November 2025",
  "December 2025",
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
];
export const NOW_INDEX = MONTHS.length - 1;

// Resale-value-demand index, 0-100, one fixed literal per category per month. Hand-authored shapes:
// lenses stay strong with a holiday + summer-travel double bump, bodies dip around a spring release
// cycle, accessories are flat with a small December/back-to-school lift, vintage film climbs through
// the summer analog season.
export const BASE_TREND: Record<CategoryId, number[]> = {
  lenses: [74, 78, 86, 80, 75, 73, 76, 82, 88, 92, 89, 85],
  bodies: [65, 68, 72, 58, 52, 60, 68, 74, 78, 80, 76, 70],
  accessories: [40, 46, 58, 44, 38, 36, 40, 44, 48, 50, 46, 52],
  vintage: [30, 32, 34, 36, 40, 44, 50, 58, 62, 60, 54, 46],
};

export type Weights = Record<CategoryId, number>;

export const WEIGHT_MIN = 0;
export const WEIGHT_MAX = 100;

export const DEFAULT_WEIGHTS: Weights = {
  lenses: 45,
  bodies: 25,
  accessories: 18,
  vintage: 12,
};

export const WEIGHT_PRESETS: { id: string; label: string; weights: Weights }[] = [
  { id: "balanced", label: "A balanced kit", weights: { lenses: 45, bodies: 25, accessories: 18, vintage: 12 } },
  { id: "glass-heavy", label: "Glass-heavy kit", weights: { lenses: 70, bodies: 15, accessories: 10, vintage: 5 } },
  { id: "body-first", label: "Body-first kit", weights: { lenses: 20, bodies: 55, accessories: 15, vintage: 10 } },
  { id: "film-collector", label: "Film collector", weights: { lenses: 15, bodies: 10, accessories: 15, vintage: 60 } },
];

export function matchPreset(weights: Weights): string | null {
  const found = WEIGHT_PRESETS.find((p) => CATEGORY_IDS.every((c) => p.weights[c] === weights[c]));
  return found ? found.id : null;
}

// --------------------------------------------------------------------------------------------------
// Ribbon geometry — pure derivation from weights. Returns value-space (not pixel-space) numbers;
// the chart component maps these to an SVG viewBox.

export interface RibbonSeries {
  months: string[];
  order: CategoryId[]; // bottom-to-top visual stacking order
  value: Record<CategoryId, number[]>; // per-category, per-month weighted value
  top: Record<CategoryId, number[]>; // cumulative upper edge, value-space, centered on 0
  bottom: Record<CategoryId, number[]>; // cumulative lower edge, value-space, centered on 0
  totals: number[]; // sum of all categories per month
  maxTotal: number;
  totalVolume: Record<CategoryId, number>; // sum across all 12 months, drives stack order
  dominant: CategoryId;
}

export function computeRibbon(weights: Weights): RibbonSeries {
  const value = {} as Record<CategoryId, number[]>;
  const totalVolume = {} as Record<CategoryId, number>;

  for (const cat of CATEGORY_IDS) {
    const w = weights[cat] / 100;
    const arr = BASE_TREND[cat].map((v) => v * w);
    value[cat] = arr;
    totalVolume[cat] = arr.reduce((a, b) => a + b, 0);
  }

  // Inside-out stack order: the category carrying the most weighted volume sits most central,
  // smaller ones flank it. Recomputed on every weight change, so the visual stacking order itself
  // reflows — not just band thickness.
  const sortedDesc = [...CATEGORY_IDS].sort((a, b) => totalVolume[b] - totalVolume[a]);
  const topHalf: CategoryId[] = [];
  const bottomHalf: CategoryId[] = [];
  sortedDesc.forEach((id, i) => (i % 2 === 0 ? topHalf : bottomHalf).push(id));
  const order = [...bottomHalf.slice().reverse(), ...topHalf];

  const totals = MONTHS.map((_, i) => CATEGORY_IDS.reduce((s, c) => s + value[c][i], 0));
  const maxTotal = Math.max(...totals, 1);

  const top = {} as Record<CategoryId, number[]>;
  const bottom = {} as Record<CategoryId, number[]>;
  for (const c of CATEGORY_IDS) {
    top[c] = new Array(MONTHS.length).fill(0);
    bottom[c] = new Array(MONTHS.length).fill(0);
  }

  for (let i = 0; i < MONTHS.length; i++) {
    let cumulative = -totals[i] / 2; // wiggle baseline: stack centered on 0 every month
    for (const cat of order) {
      bottom[cat][i] = cumulative;
      cumulative += value[cat][i];
      top[cat][i] = cumulative;
    }
  }

  return { months: MONTHS, order, value, top, bottom, totals, maxTotal, totalVolume, dominant: sortedDesc[0] };
}

export interface ItemReadout {
  category: CategoryId;
  shareNowPct: number;
  indexNow: number;
  indexPrev: number;
  trendUp: boolean;
}

// The one listing whose position "on the ribbon" the page tracks throughout.
export const YOUR_ITEM = {
  name: "Sony FE 24-70mm F2.8 GM II",
  category: "lenses" as CategoryId,
  price: 1650,
  originalPrice: 2300,
  grade: "A-",
  verified: true,
  matchPct: 96,
};

export function getItemReadout(series: RibbonSeries): ItemReadout {
  const cat = YOUR_ITEM.category;
  const total = series.totals[NOW_INDEX] || 1;
  const shareNowPct = (series.value[cat][NOW_INDEX] / total) * 100;
  const indexNow = BASE_TREND[cat][NOW_INDEX];
  const indexPrev = BASE_TREND[cat][NOW_INDEX - 1];
  return { category: cat, shareNowPct, indexNow, indexPrev, trendUp: indexNow >= indexPrev };
}

export function discountPct(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// --------------------------------------------------------------------------------------------------
// Hero + product-preview listing catalog.

export interface Listing {
  id: string;
  category: CategoryId;
  title: string;
  seller: string;
  price: number;
  originalPrice: number;
  grade: string;
  verified: boolean;
  matchPct: number;
  reasonTags: [string, string];
  photoId: string; // fixed images.unsplash.com/photo-<id>, reused elsewhere in this app's catalog
}

export const HERO_LISTINGS: Record<CategoryId, Listing> = {
  lenses: {
    id: "hero-lens",
    category: "lenses",
    title: YOUR_ITEM.name,
    seller: "Marcus T.",
    price: YOUR_ITEM.price,
    originalPrice: YOUR_ITEM.originalPrice,
    grade: YOUR_ITEM.grade,
    verified: YOUR_ITEM.verified,
    matchPct: YOUR_ITEM.matchPct,
    reasonTags: ["Optically inspected, no fungus or haze", "Matches your saved Sony E-mount kit"],
    photoId: "1543076447-215ad9ba6923",
  },
  bodies: {
    id: "hero-body",
    category: "bodies",
    title: "Canon EOS R6 Mark II Body",
    seller: "FrameworksCo",
    price: 1480,
    originalPrice: 2000,
    grade: "A",
    verified: true,
    matchPct: 91,
    reasonTags: ["Shutter count under 8,000 actuations", "Verified storefront, 4.9-star rating"],
    photoId: "1445205170230-053b83016050",
  },
  accessories: {
    id: "hero-accessory",
    category: "accessories",
    title: "Peak Design Everyday Backpack 20L",
    seller: "Dana R.",
    price: 185,
    originalPrice: 280,
    grade: "B+",
    verified: true,
    matchPct: 88,
    reasonTags: ["All zippers and straps test clean", "Ships same-day from a top-rated seller"],
    photoId: "1608256246200-53e635b5b65f",
  },
  vintage: {
    id: "hero-vintage",
    category: "vintage",
    title: "Leica M6 35mm Rangefinder",
    seller: "SilverHalide Co.",
    price: 2950,
    originalPrice: 3600,
    grade: "A-",
    verified: true,
    matchPct: 93,
    reasonTags: ["Meter and rangefinder patch both accurate", "Full service history included"],
    photoId: "1489987707025-afc232f7ea0f",
  },
};

export const PREVIEW_LISTINGS: Listing[] = [
  HERO_LISTINGS.lenses,
  HERO_LISTINGS.bodies,
  {
    id: "preview-accessory-1",
    category: "accessories",
    title: "Godox AD200 Pro Flash Kit",
    seller: "LumenGear",
    price: 210,
    originalPrice: 330,
    grade: "A-",
    verified: true,
    matchPct: 85,
    reasonTags: ["Battery cycles tested at 94% capacity", "Includes original diffuser dome"],
    photoId: "1560243563-062bfc001d68",
  },
  HERO_LISTINGS.vintage,
  {
    id: "preview-lens-2",
    category: "lenses",
    title: "Sigma 35mm F1.4 DG Art",
    seller: "OpticalMint",
    price: 620,
    originalPrice: 899,
    grade: "A",
    verified: true,
    matchPct: 90,
    reasonTags: ["Focus motor tests silent and fast", "No dust between elements at 10x zoom"],
    photoId: "1516826957135-700dedea698c",
  },
  {
    id: "preview-body-2",
    category: "bodies",
    title: "Fujifilm X-T5 Body, Silver",
    seller: "Priya K.",
    price: 1120,
    originalPrice: 1699,
    grade: "B+",
    verified: false,
    matchPct: 82,
    reasonTags: ["Light brassing on top plate only, cosmetic", "First-time seller, ID-verified"],
    photoId: "1553062407-98eeb64c6a62",
  },
];

export const PREVIEW_FILTERS: { id: "all" | CategoryId; label: string }[] = [
  { id: "all", label: "All categories" },
  { id: "lenses", label: CATEGORIES.lenses.label },
  { id: "bodies", label: CATEGORIES.bodies.label },
  { id: "accessories", label: CATEGORIES.accessories.label },
  { id: "vintage", label: CATEGORIES.vintage.label },
];

// --------------------------------------------------------------------------------------------------
// Social proof.

export const TESTIMONIALS = [
  {
    name: "Elena Voss",
    context: "Sold 3 lenses this year",
    quote:
      "I moved a 70-200 the week the ribbon showed lenses peaking. Same body sat listed two months later.",
    rating: 5,
    verified: true,
  },
  {
    name: "Jon Ashcroft",
    context: "Vintage collector, Portland",
    quote:
      "Watching the vintage band climb every summer convinced me to finally list my M6. Sold in four days.",
    rating: 5,
    verified: true,
  },
  {
    name: "Priya Nandakumar",
    context: "Switched systems in March",
    quote: "The share readout told me exactly how much of my listing's value was riding on timing, not just price.",
    rating: 4,
    verified: true,
  },
] as const;

export const TRUST_STATS = [
  { label: "Listings tracked in this ribbon", value: "38,400+" },
  { label: "Median time to sell, Grade A-", value: "6 days" },
  { label: "Sellers who checked demand first", value: "82%" },
] as const;

export const TRUST_SIGNALS = [
  "Condition-graded by a human inspector",
  "Verified seller badge on every eligible listing",
  "Price history shown before you list",
  "Buyer protection on every sale",
] as const;

export const FAQ_ITEMS = [
  {
    q: "What is the demand index actually measuring?",
    a: "A 0-100 score per category per month, built from repick's own completed-sale prices, listing volume and days-to-sell across that category. It is not a prediction — it is where the last 12 months of real resale activity landed.",
  },
  {
    q: "Why does the stacking order change when I move a slider?",
    a: "Each band's position reflects how much weighted volume it is carrying under your current mix, not a fixed rank. Push a slider up and its band can move from the outer edge toward the center of the ribbon.",
  },
  {
    q: "Does the marker only work for lenses?",
    a: "This preview tracks one saved item — a Sony FE 24-70mm F2.8 GM II — to keep the example concrete. Your account view tracks a marker per listing.",
  },
] as const;
