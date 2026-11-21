import {
  Shirt,
  Snowflake,
  Layers,
  Sparkles,
  Footprints,
  ShoppingBag,
  ShieldCheck,
  ThumbsUp,
  AlertCircle,
  Tag,
  Star,
  Crown,
  Camera,
  Images,
  GalleryHorizontalEnd,
  type LucideIcon,
} from "lucide-react";

/**
 * Deterministic seller-payout model. Every number on this route is derived
 * from these fixed tables by plain arithmetic — nothing here reads the
 * clock or a random source. The four wizard steps each pick one key into
 * one of the tables below; `computeEstimate` folds all four into a single
 * suggested-price range, a fee rate, and a payout range, with the payout
 * always computed as `price - fee` on each end of the range so the two
 * numbers can never drift apart.
 */

export type CategoryId = "denim" | "outerwear" | "knitwear" | "dresses" | "sneakers" | "bags";
export type ConditionId = "new" | "likeNew" | "good" | "fair";
export type BrandTierId = "standard" | "premium" | "luxury";
export type PhotoTierId = "few" | "standard" | "full";

export interface Selections {
  category: CategoryId;
  condition: ConditionId;
  brand: BrandTierId;
  photos: PhotoTierId;
}

/** Sensible, non-degenerate defaults — the estimate is never blank on first paint. */
export const DEFAULT_SELECTIONS: Selections = {
  category: "denim",
  condition: "good",
  brand: "premium",
  photos: "standard",
};

interface CategoryEntry {
  label: string;
  /** Singular noun used in the closing CTA sentence, e.g. "List your {ctaNoun}...". */
  ctaNoun: string;
  /** Baseline resale price in dollars at condition=good, brand=standard, photos=standard. */
  base: number;
  icon: LucideIcon;
}

export const CATEGORIES: Record<CategoryId, CategoryEntry> = {
  denim: { label: "Denim & jeans", ctaNoun: "jeans", base: 38, icon: Shirt },
  outerwear: { label: "Outerwear & jackets", ctaNoun: "jacket", base: 64, icon: Snowflake },
  knitwear: { label: "Knitwear & sweaters", ctaNoun: "sweater", base: 32, icon: Layers },
  dresses: { label: "Dresses", ctaNoun: "dress", base: 40, icon: Sparkles },
  sneakers: { label: "Sneakers & shoes", ctaNoun: "sneakers", base: 52, icon: Footprints },
  bags: { label: "Bags & accessories", ctaNoun: "bag", base: 58, icon: ShoppingBag },
};

export const CATEGORY_ORDER: CategoryId[] = [
  "denim",
  "outerwear",
  "knitwear",
  "dresses",
  "sneakers",
  "bags",
];

interface ConditionEntry {
  label: string;
  short: string;
  /** Multiplies the category base price. */
  priceMult: number;
  /** Added to the brand tier's fee rate (can be negative). */
  feeAdjust: number;
  icon: LucideIcon;
}

export const CONDITIONS: Record<ConditionId, ConditionEntry> = {
  new: {
    label: "New with tags",
    short: "New",
    priceMult: 1.35,
    feeAdjust: -0.02,
    icon: Sparkles,
  },
  likeNew: {
    label: "Like new",
    short: "Like New",
    priceMult: 1.15,
    feeAdjust: -0.01,
    icon: ShieldCheck,
  },
  good: { label: "Good", short: "Good", priceMult: 1.0, feeAdjust: 0, icon: ThumbsUp },
  fair: { label: "Fair", short: "Fair", priceMult: 0.7, feeAdjust: 0.02, icon: AlertCircle },
};

export const CONDITION_ORDER: ConditionId[] = ["new", "likeNew", "good", "fair"];

interface BrandTierEntry {
  label: string;
  description: string;
  /** Multiplies the category base price. */
  priceMult: number;
  /** Base seller fee rate before the condition adjustment. */
  feeRate: number;
  icon: LucideIcon;
}

export const BRAND_TIERS: Record<BrandTierId, BrandTierEntry> = {
  standard: {
    label: "Standard",
    description: "Everyday labels",
    priceMult: 1.0,
    feeRate: 0.2,
    icon: Tag,
  },
  premium: {
    label: "Premium",
    description: "Known contemporary brands",
    priceMult: 1.55,
    feeRate: 0.16,
    icon: Star,
  },
  luxury: {
    label: "Luxury",
    description: "Designer & heritage houses",
    priceMult: 2.6,
    feeRate: 0.12,
    icon: Crown,
  },
};

export const BRAND_TIER_ORDER: BrandTierId[] = ["standard", "premium", "luxury"];

interface PhotoTierEntry {
  label: string;
  caption: string;
  /** Multiplies the category base price — more photos, more buyer confidence, higher clearing price. */
  priceMult: number;
  icon: LucideIcon;
}

export const PHOTO_TIERS: Record<PhotoTierId, PhotoTierEntry> = {
  few: { label: "3–4 photos", caption: "Fastest to list", priceMult: 0.94, icon: Camera },
  standard: {
    label: "5–7 photos",
    caption: "Our most common listing",
    priceMult: 1.0,
    icon: Images,
  },
  full: {
    label: "8+ photos",
    caption: "Strongest buyer confidence",
    priceMult: 1.06,
    icon: GalleryHorizontalEnd,
  },
};

export const PHOTO_TIER_ORDER: PhotoTierId[] = ["few", "standard", "full"];

export interface Estimate {
  /** Suggested price range, in whole dollars. */
  priceLow: number;
  priceHigh: number;
  /** Effective seller fee rate, brand tier minus/plus condition adjustment, clamped to a sane band. */
  feeRate: number;
  /** Fee in dollars at each end of the price range. */
  feeLow: number;
  feeHigh: number;
  /** price - fee at each end, computed directly (never independently re-derived). */
  payoutLow: number;
  payoutHigh: number;
}

/**
 * Folds the four wizard selections into a priced estimate. Every output
 * number is a direct arithmetic function of the four fixed tables above —
 * `payoutX` is literally `priceX - feeX`, so the receipt can never fail to
 * subtract correctly.
 */
export function computeEstimate(selections: Selections): Estimate {
  const category = CATEGORIES[selections.category];
  const condition = CONDITIONS[selections.condition];
  const brand = BRAND_TIERS[selections.brand];
  const photos = PHOTO_TIERS[selections.photos];

  const mid = Math.round(category.base * condition.priceMult * brand.priceMult * photos.priceMult);
  const priceLow = Math.round(mid * 0.85);
  const priceHigh = Math.round(mid * 1.15);

  const feeRate = Math.min(0.25, Math.max(0.08, brand.feeRate + condition.feeAdjust));
  const feeLow = Math.round(priceLow * feeRate);
  const feeHigh = Math.round(priceHigh * feeRate);

  return {
    priceLow,
    priceHigh,
    feeRate,
    feeLow,
    feeHigh,
    payoutLow: priceLow - feeLow,
    payoutHigh: priceHigh - feeHigh,
  };
}

export interface SoldComp {
  id: string;
  name: string;
  meta: string;
  grade: string;
  soldPrice: number;
  photoId: string;
}

/** "Sold recently" comps — fixed, content-appropriate Unsplash photo ids, never randomly seeded. */
export const SOLD_COMPS: SoldComp[] = [
  {
    id: "denim-jacket",
    name: "Levi's trucker jacket",
    meta: "Denim & jeans · Premium",
    grade: "Like New",
    soldPrice: 54,
    photoId: "1551028719-00167b16eac5",
  },
  {
    id: "wool-coat",
    name: "Wool car coat",
    meta: "Outerwear · Luxury",
    grade: "Good",
    soldPrice: 212,
    photoId: "1539533018447-63fcce2678e3",
  },
  {
    id: "leather-bag",
    name: "Structured leather tote",
    meta: "Bags & accessories · Premium",
    grade: "Like New",
    soldPrice: 118,
    photoId: "1548036328-c9fa89d128fa",
  },
  {
    id: "sneakers",
    name: "Suede low-top sneakers",
    meta: "Sneakers & shoes · Premium",
    grade: "Good",
    soldPrice: 61,
    photoId: "1549298916-b41d501d3772",
  },
];
