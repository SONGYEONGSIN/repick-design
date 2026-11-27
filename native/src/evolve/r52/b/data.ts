// native/src/evolve/r52/b/data.ts — deterministic dummy data + pure helpers
// for the Curate Featured Items screen.
//
// No Math.random / Date.now / argument-less `new Date()` anywhere below.
// Every listing field is a fixed literal, and every value derived from the
// current featured order (rank lookups, cap checks) is computed by a pure
// function so the same inputs always produce the same output.

export type ActiveListing = {
  id: string;
  title: string;
  categoryLabel: string;
  conditionLabel: string;
  /** Listing price in KRW. Fixed literal. */
  priceWon: number;
  swatchTone: 1 | 2 | 3;
};

// A seller's active (currently live, not sold/draft) listings. Ten items —
// enough that the cap below is meaningfully smaller than the pool, so
// "disable new picks at cap, but keep editing existing picks" has real rows
// to exercise on both sides of that line.
export const SELLER_ACTIVE_LISTINGS: ActiveListing[] = [
  {
    id: "ls-polaroid-sx70",
    title: "Polaroid SX-70 Land Camera",
    categoryLabel: "Cameras",
    conditionLabel: "Excellent",
    priceWon: 185000,
    swatchTone: 1,
  },
  {
    id: "ls-denim-jacket",
    title: "Vintage Levi's Trucker Jacket, size M",
    categoryLabel: "Apparel",
    conditionLabel: "Good",
    priceWon: 62000,
    swatchTone: 2,
  },
  {
    id: "ls-record-player",
    title: "Audio-Technica AT-LP120 Turntable",
    categoryLabel: "Audio",
    conditionLabel: "Like new",
    priceWon: 240000,
    swatchTone: 3,
  },
  {
    id: "ls-enamel-pins",
    title: "Enamel Pin Set, 12 pieces",
    categoryLabel: "Collectibles",
    conditionLabel: "New",
    priceWon: 18000,
    swatchTone: 1,
  },
  {
    id: "ls-leather-satchel",
    title: "Hand-stitched Leather Satchel",
    categoryLabel: "Bags",
    conditionLabel: "Good",
    priceWon: 97000,
    swatchTone: 2,
  },
  {
    id: "ls-film-stock",
    title: "Expired Fujifilm Superia, 5-roll bundle",
    categoryLabel: "Film",
    conditionLabel: "New",
    priceWon: 34000,
    swatchTone: 3,
  },
  {
    id: "ls-synth-keyboard",
    title: "Korg Monologue Analog Synth",
    categoryLabel: "Instruments",
    conditionLabel: "Excellent",
    priceWon: 210000,
    swatchTone: 1,
  },
  {
    id: "ls-ceramic-mugs",
    title: "Hand-thrown Ceramic Mug Pair",
    categoryLabel: "Home",
    conditionLabel: "Like new",
    priceWon: 29000,
    swatchTone: 2,
  },
  {
    id: "ls-trading-cards",
    title: "Sealed 1998 Trading Card Booster Box",
    categoryLabel: "Collectibles",
    conditionLabel: "New",
    priceWon: 420000,
    swatchTone: 3,
  },
  {
    id: "ls-wool-scarf",
    title: "Merino Wool Scarf, charcoal",
    categoryLabel: "Apparel",
    conditionLabel: "New",
    priceWon: 22000,
    swatchTone: 1,
  },
];

/** Maximum number of listings that can be featured on the storefront at once. */
export const FEATURE_CAP = 6;

/**
 * The storefront's last-saved featured order, as it looked before this
 * editing session started. Two items pre-featured — enough to exercise
 * "remove/reorder an existing pick while below cap" without the tester
 * having to add anything first.
 */
export const LAST_SAVED_FEATURED_ORDER: ReadonlyArray<string> = [
  "ls-trading-cards",
  "ls-record-player",
];

export function listingById(id: string): ActiveListing | undefined {
  return SELLER_ACTIVE_LISTINGS.find((listing) => listing.id === id);
}

/**
 * 1-based rank of a listing within a featured order, or null when it is not
 * in that order at all. Pure lookup — recomputed from the array every call,
 * never cached on the listing itself.
 */
export function rankWithin(order: ReadonlyArray<string>, id: string): number | null {
  const index = order.indexOf(id);
  return index === -1 ? null : index + 1;
}

export function formatWon(amountWon: number): string {
  const digits = Math.round(amountWon).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Trailing space keeps the ₩ glyph's stroke clear of the first tabular-num
  // digit at body text size.
  return `₩ ${withCommas}`;
}
