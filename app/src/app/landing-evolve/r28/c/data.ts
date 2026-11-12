// All figures below are fixed literals — nothing here is randomized, fetched, or time-based, so
// the parallel-coordinates plot and every number derived from it render identically on server and
// client and on every reload. Prices in USD, distance in miles, condition/match out of 100/100.

export type AxisId = "price" | "condition" | "match" | "rating" | "distance";

export type Axis = {
  id: AxisId;
  /** Shown on the priority-axis button and as the axis caption above the chart. */
  label: string;
  /** Which extreme counts as "best" on this axis. */
  better: "low" | "high";
  /** Formats a raw value (already in display units) for tick labels and the stat callout. */
  format: (value: number) => string;
};

export const AXES: Axis[] = [
  {
    id: "price",
    label: "Price",
    better: "low",
    format: (v) => `$${Math.round(v).toLocaleString("en-US")}`,
  },
  {
    id: "condition",
    label: "Condition",
    better: "high",
    format: (v) => `${Math.round(v)}/100`,
  },
  {
    id: "match",
    label: "AI match",
    better: "high",
    format: (v) => `${Math.round(v)}%`,
  },
  {
    id: "rating",
    label: "Seller rating",
    better: "high",
    format: (v) => `${v.toFixed(1)}/5`,
  },
  {
    id: "distance",
    label: "Distance",
    better: "low",
    format: (v) => `${v.toFixed(1)} mi`,
  },
];

export type Listing = {
  id: string;
  brand: string;
  name: string;
  photoId: string;
  priceOriginal: number;
  priceNow: number;
  condition: number;
  conditionLabel: string;
  match: number;
  rating: number;
  distance: number;
  verified: boolean;
  /** The single sentence that answers "why did the AI pick this" — the conversion argument. */
  reasoning: string;
};

export const LISTINGS: Listing[] = [
  {
    id: "sony-a7iii",
    brand: "Sony",
    name: "Sony A7 III Body",
    photoId: "1516035069371-29a1b244cc32",
    priceOriginal: 1400,
    priceNow: 1050,
    condition: 92,
    conditionLabel: "Grade A — Excellent",
    match: 96,
    rating: 4.9,
    distance: 2.1,
    verified: true,
    reasoning: "Shutter count under 8,000 matches your low-use preference.",
  },
  {
    id: "fuji-xt4",
    brand: "Fujifilm",
    name: "Fujifilm X-T4 Body",
    photoId: "1502920917128-1aa500764cbd",
    priceOriginal: 1300,
    priceNow: 980,
    condition: 88,
    conditionLabel: "Grade A− — Very good",
    match: 91,
    rating: 4.7,
    distance: 4.3,
    verified: true,
    reasoning: "In-body stabilization tested live across all five axes.",
  },
  {
    id: "canon-r6",
    brand: "Canon",
    name: "Canon EOS R6",
    photoId: "1516724562728-afc824a36e84",
    priceOriginal: 1800,
    priceNow: 1320,
    condition: 95,
    conditionLabel: "Grade A — Excellent",
    match: 89,
    rating: 4.8,
    distance: 6.0,
    verified: true,
    reasoning: "Sensor scan shows zero dust spots at f/22.",
  },
  {
    id: "sony-a6400",
    brand: "Sony",
    name: "Sony A6400 Body",
    photoId: "1499244571948-7ccddb3583f1",
    priceOriginal: 850,
    priceNow: 640,
    condition: 82,
    conditionLabel: "Grade B+ — Light wear",
    match: 84,
    rating: 4.5,
    distance: 1.4,
    verified: true,
    reasoning: "The closest active listing to your saved pickup spot.",
  },
  {
    id: "nikon-z6ii",
    brand: "Nikon",
    name: "Nikon Z6 II Body",
    photoId: "1471341971476-ae15ff5dd4ea",
    priceOriginal: 1600,
    priceNow: 1150,
    condition: 90,
    conditionLabel: "Grade A− — Very good",
    match: 93,
    rating: 4.6,
    distance: 8.7,
    verified: true,
    reasoning: "Dual card slots confirmed working on the inspection call.",
  },
  {
    id: "panasonic-s5",
    brand: "Panasonic",
    name: "Panasonic Lumix S5",
    photoId: "1554080353-a576cf803bde",
    priceOriginal: 1150,
    priceNow: 890,
    condition: 85,
    conditionLabel: "Grade B+ — Light wear",
    match: 87,
    rating: 4.4,
    distance: 3.2,
    verified: true,
    reasoning: "Firmware confirmed current — no open recalls.",
  },
];

export const BRANDS: string[] = Array.from(new Set(LISTINGS.map((l) => l.brand)));

export const HERO_FEATURED_IDS = ["sony-a7iii", "canon-r6"] as const;

/** Reads the raw value of a given axis off a listing, in that axis's own display units. */
export function getAxisValue(listing: Listing, axisId: AxisId): number {
  switch (axisId) {
    case "price":
      return listing.priceNow;
    case "condition":
      return listing.condition;
    case "match":
      return listing.match;
    case "rating":
      return listing.rating;
    case "distance":
      return listing.distance;
  }
}

/** The listing that wins a given axis — min if lower is better, max if higher is better. */
export function bestListingForAxis(axisId: AxisId, listings: Listing[]): Listing {
  const axis = AXES.find((a) => a.id === axisId)!;
  return listings.reduce((best, current) => {
    const bestValue = getAxisValue(best, axisId);
    const currentValue = getAxisValue(current, axisId);
    const currentWins = axis.better === "low" ? currentValue < bestValue : currentValue > bestValue;
    return currentWins ? current : best;
  }, listings[0]);
}

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.priceNow / listing.priceOriginal) * 100);
}

export function savingsOf(listing: Listing): number {
  return listing.priceOriginal - listing.priceNow;
}

export function formatUSD(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

// ---------------------------------------------------------------------------------------------
// Social proof

export const STATS: { label: string; value: string }[] = [
  { label: "Listings verified this year", value: "38,200+" },
  { label: "Median grading accuracy", value: "97.4%" },
  { label: "Axes compared per listing", value: "5" },
  { label: "Avg. time to a picked listing", value: "94 sec" },
];

export const TESTIMONIALS: {
  name: string;
  role: string;
  quote: string;
  initials: string;
}[] = [
  {
    name: "Derek Amato",
    role: "Bought a Sony A7 III on repick",
    quote:
      "I could see the shutter count and the price on the same chart. I didn't have to trust a description — I could trust the axis.",
    initials: "DA",
  },
  {
    name: "Naomi Ruiz",
    role: "Camera dealer, 6 years",
    quote:
      "Buyers used to argue with my grading. Now the condition score sits right next to the price on their own screen.",
    initials: "NR",
  },
  {
    name: "Femi Adeyemi",
    role: "Bought a Nikon Z6 II on repick",
    quote:
      "I care about distance more than most people. Switching the priority axis showed me that instantly, no re-search.",
    initials: "FA",
  },
];
