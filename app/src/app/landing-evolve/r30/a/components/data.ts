// Fixed, literal resale price-distribution data for the budget-fit bullet graph.
// No randomness, no Date.now — every number below is a plain literal and every
// derived value is plain arithmetic on those literals (deterministic + hydration-safe).

export type Category = {
  id: string;
  label: string;
  /** upper bound ($) of the "steal" band — 0 to this value */
  steal: number;
  /** upper bound ($) of the "fair market" band — steal to this value */
  fair: number;
  /** upper bound ($) of the visible scale / "above market" band — fair to this value */
  ceiling: number;
  /** this week's median asking price across live listings in the category */
  median: number;
  /** a short line naming what the median buys, for the product-preview tie-in */
  hint: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "outerwear",
    label: "Outerwear",
    steal: 100,
    fair: 180,
    ceiling: 260,
    median: 168,
    hint: "a mid-weight shell or field jacket",
  },
  {
    id: "sneakers",
    label: "Sneakers",
    steal: 90,
    fair: 160,
    ceiling: 230,
    median: 128,
    hint: "a low-mileage pair in a size run that actually sells",
  },
  {
    id: "denim",
    label: "Denim",
    steal: 50,
    fair: 90,
    ceiling: 140,
    median: 74,
    hint: "a selvedge or raw pair with real wear left in it",
  },
  {
    id: "bags",
    label: "Bags",
    steal: 140,
    fair: 250,
    ceiling: 380,
    median: 205,
    hint: "a structured leather tote or crossbody",
  },
  {
    id: "watches",
    label: "Watches",
    steal: 180,
    fair: 330,
    ceiling: 520,
    median: 295,
    hint: "an automatic in a case size people actually wear",
  },
];

export const SLIDER_MIN = 40;
export const SLIDER_MAX = 400;
export const SLIDER_STEP = 5;
export const DEFAULT_PRICE = 180;

export const PRESETS = [120, 180, 280, 380];

export type Band = "steal" | "fair" | "above";

export function bandFor(cat: Category, price: number): Band {
  if (price <= cat.steal) return "steal";
  if (price <= cat.fair) return "fair";
  return "above";
}

export function clearsMedian(cat: Category, price: number): boolean {
  return price >= cat.median;
}

export function diffFromMedian(cat: Category, price: number): number {
  return Math.round(Math.abs(price - cat.median));
}

export function pctOf(value: number, ceiling: number): number {
  const clamped = Math.max(0, Math.min(value, ceiling));
  return Math.round((clamped / ceiling) * 10000) / 100; // 2 decimal places
}

const BAND_LABEL: Record<Band, string> = {
  steal: "steal-tier",
  fair: "fair-market tier",
  above: "above-market tier",
};

export function readoutFor(cat: Category, price: number): string {
  const band = bandFor(cat, price);
  const clears = clearsMedian(cat, price);
  const diff = diffFromMedian(cat, price);
  const name = cat.label.toLowerCase();
  const bandLabel = BAND_LABEL[band];

  if (clears && band === "above") {
    return `$${price} clears the typical ${name} ask by $${diff} — ${bandLabel}, plenty of room to be picky.`;
  }
  if (clears && band === "fair") {
    return `$${price} clears the typical ${name} ask by $${diff} — right at the ${bandLabel}, no premium required.`;
  }
  if (!clears && band === "fair") {
    return `$${price} is $${diff} short of the typical ${name} ask — ${bandLabel} money, just under this category.`;
  }
  if (!clears && band === "steal") {
    return `$${price} is $${diff} short of the typical ${name} ask — ${bandLabel} money chasing a higher market.`;
  }
  // Rare edge combinations if the slider is dragged to an extreme.
  if (clears) {
    return `$${price} clears the typical ${name} ask by $${diff} — ${bandLabel}.`;
  }
  return `$${price} is $${diff} short of the typical ${name} ask — ${bandLabel} money.`;
}

export function summaryFor(price: number): {
  clearing: Category[];
  short: Category[];
} {
  const clearing = CATEGORIES.filter((c) => clearsMedian(c, price));
  const short = CATEGORIES.filter((c) => !clearsMedian(c, price));
  return { clearing, short };
}

function joinNames(cats: Category[]): string {
  const names = cats.map((c) => c.label);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export type Product = {
  id: string;
  title: string;
  brand: string;
  categoryId: string;
  photoId: string;
  alt: string;
  ask: number;
  retail: number;
  matchPct: number;
  grade: string;
  sellerName: string;
  sellerRating: number;
  sellerSales: number;
  reasons: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "jacket-1",
    title: "Greenland Field Jacket, size M",
    brand: "Fjällräven",
    categoryId: "outerwear",
    photoId: "1551028719-00167b16eac5",
    alt: "Olive canvas field jacket laid flat against a neutral background",
    ask: 172,
    retail: 260,
    matchPct: 94,
    grade: "A−",
    sellerName: "worn-well.lauren",
    sellerRating: 4.9,
    sellerSales: 212,
    reasons: [
      "Matches the fit profile from your last three saves — true to size, size M",
      "Priced within $4 of this week's outerwear median — a fair ask, not a guess",
      "Seller has closed 212 resales with zero disputes",
    ],
  },
  {
    id: "sneaker-1",
    title: "Achilles Low, EU 42",
    brand: "Common Projects",
    categoryId: "sneakers",
    photoId: "1549298916-b41d501d3772",
    alt: "White low-top leather sneaker shown in side profile",
    ask: 118,
    retail: 189,
    matchPct: 91,
    grade: "A",
    sellerName: "northline.resale",
    sellerRating: 4.8,
    sellerSales: 94,
    reasons: [
      "Listed $10 under this week's sneaker median for this size",
      "Condition grade A — resoled once, original box included",
      "Matches the silhouette from three of your recent saves",
    ],
  },
  {
    id: "bag-1",
    title: "Mini Bucket Bag, tan",
    brand: "Mansur Gavriel",
    categoryId: "bags",
    photoId: "1548036328-c9fa89d128fa",
    alt: "Structured tan leather bucket bag with a short top handle",
    ask: 238,
    retail: 425,
    matchPct: 88,
    grade: "B+",
    sellerName: "palomastudio",
    sellerRating: 4.9,
    sellerSales: 98,
    reasons: [
      "Structured leather bags like this hold 70%+ of retail for 18+ months",
      "Verified seller, 98 completed resales, ships within 2 days",
      "$33 over this week's median — worth watching, not grabbing yet",
    ],
  },
];

export function closingLine(price: number): string {
  const { clearing, short } = summaryFor(price);
  if (clearing.length === 0) {
    return `At $${price}, nothing on the board clears its typical ask yet — move the number up and watch that change.`;
  }
  if (short.length === 0) {
    return `At $${price}, all five categories clear their typical ask — ${joinNames(clearing)} are all in range tonight.`;
  }
  return `At $${price}, ${clearing.length} of 5 categories clear — ${joinNames(clearing)}. ${joinNames(
    short,
  )} still ${short.length === 1 ? "needs" : "need"} more room.`;
}
