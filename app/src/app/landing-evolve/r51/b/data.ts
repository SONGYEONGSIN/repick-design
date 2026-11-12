import type { CriterionId } from "./rank-model";

export interface Listing {
  id: string;
  title: string;
  category: string;
  photoId: string;
  alt: string;
  conditionGrade: string;
  verified: boolean;
  priceBefore: number;
  priceAfter: number;
  /** Fixed, per-criterion score 0-100 — never changes with the visitor's ranking. */
  scores: Record<CriterionId, number>;
  /** One AI-match-reasoning line per criterion, shown for whichever criterion
   *  is currently ranked #1. All five are fixed text; nothing here is
   *  generated at runtime. */
  reasoningByLead: Record<CriterionId, string>;
}

export function discountPercent(listing: Listing): number {
  return Math.round(((listing.priceBefore - listing.priceAfter) / listing.priceBefore) * 100);
}

/**
 * Four fixed repick listings. Photo ids reused from elsewhere in this
 * catalog's `data.ts` files (camera / sneaker / watch / outerwear), on the
 * same reasoning r50/c recorded: an id already in production use across
 * several candidates with consistent category labeling is a safer bet than
 * guessing a fresh one blind.
 */
export const LISTINGS: Listing[] = [
  {
    id: "camera",
    title: "Mirrorless Camera, Full-Frame",
    category: "Electronics",
    photoId: "1526170375885-4d8ecf77b99f",
    alt: "Full-frame mirrorless camera listed on repick",
    conditionGrade: "A-",
    verified: true,
    priceBefore: 1480,
    priceAfter: 980,
    scores: { price: 55, condition: 90, sellerRating: 85, shippingSpeed: 35, rarity: 80 },
    reasoningByLead: {
      price: "Priced the smallest discount of the four under this order — its strength lies elsewhere.",
      condition: "A- grade confirmed at intake — the sharpest condition score of the four.",
      sellerRating: "Top-rated seller history here, second only to the watch.",
      shippingSpeed: "Ships in 5–7 days — the slowest turnaround of the four under this order.",
      rarity: "Limited production run — among the rarest pieces in this set.",
    },
  },
  {
    id: "sneakers",
    title: "Limited-Run Sneakers, Size 10",
    category: "Footwear",
    photoId: "1542291026-7eec264c27ff",
    alt: "Pair of limited-run sneakers listed on repick",
    conditionGrade: "B+",
    verified: true,
    priceBefore: 240,
    priceAfter: 132,
    scores: { price: 78, condition: 68, sellerRating: 60, shippingSpeed: 92, rarity: 70 },
    reasoningByLead: {
      price: "Deepest live discount of the four at 45% under retail.",
      condition: "Light wear only — a solid B+, though not the top grade here.",
      sellerRating: "Newer seller account — the lightest trust signal of the four under this order.",
      shippingSpeed: "Ships same day — the fastest turnaround in this set.",
      rarity: "Limited colorway, but still in active circulation.",
    },
  },
  {
    id: "watch",
    title: "Automatic Watch, Discontinued Ref.",
    category: "Accessories",
    photoId: "1523275335684-37898b6baf30",
    alt: "Automatic wristwatch listed on repick",
    conditionGrade: "A",
    verified: true,
    priceBefore: 2200,
    priceAfter: 1580,
    scores: { price: 40, condition: 82, sellerRating: 94, shippingSpeed: 50, rarity: 95 },
    reasoningByLead: {
      price: "Smallest discount of the four — rarity and trust are carrying this listing.",
      condition: "Grade A, the strongest condition score in this set.",
      sellerRating: "Highest-rated seller of the four, with a clean return history.",
      shippingSpeed: "Mid-pack on turnaround — not the bottleneck here.",
      rarity: "Discontinued reference number — the rarest piece in this set.",
    },
  },
  {
    id: "jacket",
    title: "Waxed Field Jacket, Size M",
    category: "Outerwear",
    photoId: "1551028719-00167b16eac5",
    alt: "Waxed field jacket listed on repick",
    conditionGrade: "B",
    verified: false,
    priceBefore: 210,
    priceAfter: 96,
    scores: { price: 86, condition: 72, sellerRating: 70, shippingSpeed: 80, rarity: 45 },
    reasoningByLead: {
      price: "Deepest cut of the four at 54% under original retail.",
      condition: "Honest wear reflected plainly in its B grade.",
      sellerRating: "Mid-pack trust signal — verification is still pending on this one.",
      shippingSpeed: "Local pickup available today — a fast turnaround.",
      rarity: "Still in wide circulation — the most common piece of the four.",
    },
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  context: string;
  photoId: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "tm-01",
    quote:
      "I put condition at the top before I ever opened a listing. What arrived matched the grade on screen, down to the strap wear.",
    name: "Nadia P.",
    context: "Bought a watch, Chicago",
    photoId: "1543076447-215ad9ba6923",
  },
  {
    id: "tm-02",
    quote:
      "Shipping speed mattered more than price for once. I dragged it to the top and the sneakers I wanted were already leading.",
    name: "Theo B.",
    context: "Bought sneakers, Austin",
    photoId: "1441986300917-64674bd600d8",
  },
  {
    id: "tm-03",
    quote:
      "Rarity first, always, for anything I collect. Repick let me rank it that way instead of guessing from a star rating.",
    name: "Isla M.",
    context: "Bought a camera, Toronto",
    photoId: "1553062407-98eeb64c6a62",
  },
];

export const PLATFORM_STATS: { value: string; label: string }[] = [
  { value: "18,900+", label: "Verified sellers on the platform" },
  { value: "97%", label: "Of condition grades confirmed accurate on delivery" },
  { value: "5", label: "Matching criteria, one shared scoring formula" },
  { value: "412", label: "Active listings in the current catalog" },
];
