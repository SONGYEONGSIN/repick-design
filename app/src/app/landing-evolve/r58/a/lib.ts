/**
 * Bulk Trade-In Tier Counter — single source of truth.
 *
 * Every number shown on this page for the trade-in device (the hero counter, the progress
 * caption, the closing CTA) is produced by calling `deriveTradeIn(count)` once and reading the
 * result. Nothing downstream re-types a tier name, an average, or a total — this is the one
 * shared derivation the brief requires, and it is the only thing that decides the tier.
 */

export type TradeInTier = {
  id: "starter" | "bulk" | "wholesale";
  name: string;
  /** Minimum item count that qualifies for this tier. */
  threshold: number;
  /** Average payout per item, in whole dollars, at this tier. */
  avgPayout: number;
};

// Fixed count thresholds. Crossing one of these changes the named tier — nothing else does.
export const TRADE_IN_TIERS: readonly TradeInTier[] = [
  { id: "starter", name: "Starter Trade", threshold: 1, avgPayout: 38 },
  { id: "bulk", name: "Bulk Dealer", threshold: 5, avgPayout: 45 },
  { id: "wholesale", name: "Wholesale Partner", threshold: 10, avgPayout: 52 },
];

/** Non-trivial starting point: inside the Bulk Dealer tier, not at an edge. Every reset returns here. */
export const DEFAULT_ITEM_COUNT = 6;

export const MIN_ITEM_COUNT = 1;

export type TradeInResult = {
  count: number;
  tier: TradeInTier;
  nextTier: TradeInTier | null;
  /** Items still needed to cross into `nextTier`; null once there is no tier left to reach. */
  itemsToNextTier: number | null;
  /** 0–1 progress through the current tier's band, for the progress indicator. */
  tierProgress: number;
  avgPayout: number;
  totalPayout: number;
  summary: string;
};

/**
 * The one shared derivation. Every on-page number for this device is read off the object this
 * returns — the hero counter, the endpoint caption, and the closing CTA all call this with the
 * same lifted `count` state rather than hand-typing a value.
 */
export function deriveTradeIn(count: number): TradeInResult {
  const safeCount = Math.max(MIN_ITEM_COUNT, Math.round(count));

  let tier: TradeInTier = TRADE_IN_TIERS[0];
  for (const candidate of TRADE_IN_TIERS) {
    if (safeCount >= candidate.threshold) tier = candidate;
  }

  const tierIndex = TRADE_IN_TIERS.indexOf(tier);
  const nextTier = TRADE_IN_TIERS[tierIndex + 1] ?? null;
  const itemsToNextTier = nextTier ? nextTier.threshold - safeCount : null;
  const tierProgress = nextTier
    ? Math.min(1, Math.max(0, (safeCount - tier.threshold) / (nextTier.threshold - tier.threshold)))
    : 1;

  const avgPayout = tier.avgPayout;
  const totalPayout = avgPayout * safeCount;

  const itemWord = safeCount === 1 ? "item" : "items";
  const summary = `Trading in ${safeCount} ${itemWord} puts you in the ${tier.name} tier — $${avgPayout} average payout per item, $${totalPayout.toLocaleString(
    "en-US"
  )} total.`;

  return {
    count: safeCount,
    tier,
    nextTier,
    itemsToNextTier,
    tierProgress,
    avgPayout,
    totalPayout,
    summary,
  };
}

/** A real, rendered outline on focus — never `ring`/`ring-offset` (invisible in Tailwind v4), and
 * never paired with `outline-none` (which would cancel it via `--tw-outline-style: none`). */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300";

export type ProductListing = {
  id: string;
  category: "Cameras" | "Footwear" | "Watches" | "Furniture";
  title: string;
  imageId: string;
  alt: string;
  priceBefore: number;
  priceAfter: number;
  matchPercent: number;
  conditionGrade: string;
  reasoning: string;
};

export const PRODUCT_LISTINGS: ProductListing[] = [
  {
    id: "camera-r6",
    category: "Cameras",
    title: "Canon EOS R6 body, 2 lenses",
    imageId: "1526170375885-4d8ecf77b99f",
    alt: "A mirrorless camera with a zoom lens resting on a wooden surface",
    priceBefore: 1850,
    priceAfter: 1260,
    matchPercent: 96,
    conditionGrade: "A-",
    reasoning:
      "Shutter count and sensor scan both land in the top condition band, and three verified buyers bid on this exact body-and-lens pairing in the last 30 days.",
  },
  {
    id: "footwear-og",
    category: "Footwear",
    title: "Running shoes, size 10, lightly worn",
    imageId: "1491553895911-0055eca6402d",
    alt: "A pair of white and grey running shoes on a plain background",
    priceBefore: 160,
    priceAfter: 96,
    matchPercent: 91,
    conditionGrade: "B+",
    reasoning:
      "Outsole wear is below average for the mileage reported, and this size sells fastest in the Footwear queue — matched to a buyer within a day on average.",
  },
  {
    id: "watch-diver",
    category: "Watches",
    title: "Automatic diver watch, steel bracelet",
    imageId: "1548036328-c9fa89d128fa",
    alt: "A stainless steel diver's watch with a black dial",
    priceBefore: 540,
    priceAfter: 410,
    matchPercent: 94,
    conditionGrade: "A",
    reasoning:
      "Movement accuracy tested within spec and bracelet links show no stretch, so this listing skips the inspection queue and goes straight to verified buyers.",
  },
  {
    id: "furniture-chair",
    category: "Furniture",
    title: "Mid-century lounge chair",
    imageId: "1555041469-a586c61ea9bc",
    alt: "A wooden-framed lounge chair with tan upholstery",
    priceBefore: 620,
    priceAfter: 430,
    matchPercent: 89,
    conditionGrade: "B+",
    reasoning:
      "Frame joints show no separation and upholstery has no tears, placing this above the usual bar for the Furniture category's verified-seller tier.",
  },
];

export const PRODUCT_CATEGORIES = ["All", "Cameras", "Footwear", "Watches", "Furniture"] as const;
