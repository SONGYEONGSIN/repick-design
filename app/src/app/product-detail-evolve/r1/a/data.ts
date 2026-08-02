// Fernway — a peer-to-peer verified resale marketplace. This file holds the deterministic dummy
// data for a single listing detail page (Fieldstone Co. Classic Low-Top Sneakers). Every number is
// hand-authored, never Math.random()/Date.now(), so the page hydrates identically every render.

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  label: string;
};

// Same source photograph, four different imgix crop windows — the closest a static mock can get to
// "four angles" of one physical, one-of-a-kind resale item without inventing photography that does
// not exist. Deterministic query params only (no random seeds).
export const GALLERY: GalleryImage[] = [
  {
    id: "front",
    src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&crop=entropy&w=1200&h=1200&q=80",
    alt: "Fieldstone Co. Classic Low-Top sneaker, front three-quarter view on a plain backdrop",
    label: "Front",
  },
  {
    id: "side",
    src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&crop=left&w=1200&h=1200&q=80",
    alt: "Fieldstone Co. Classic Low-Top sneaker, side profile showing the lace panel",
    label: "Side profile",
  },
  {
    id: "sole",
    src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&crop=bottom&w=1200&h=1200&q=80",
    alt: "Fieldstone Co. Classic Low-Top sneaker, sole and outsole tread detail",
    label: "Sole detail",
  },
  {
    id: "pair",
    src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&crop=top&w=1200&h=1200&q=80",
    alt: "Fieldstone Co. Classic Low-Top sneaker, top-down view of both shoes paired",
    label: "Paired",
  },
];

export type ConditionGrade = "S" | "A" | "B+";

export type SizeOption = {
  us: string;
  eu: string;
  price: number;
  asksAvailable: number;
  grade: ConditionGrade;
  shipsInDays: number;
  inStock: boolean;
};

// Prices vary by size the way a real resale order book does: each size is its own pool of listings,
// so the lowest current ask (and the condition grade that ask happens to carry) differs size to size.
export const SIZES: SizeOption[] = [
  { us: "7", eu: "40", price: 92, asksAvailable: 2, grade: "A", shipsInDays: 4, inStock: true },
  { us: "7.5", eu: "40.5", price: 88, asksAvailable: 3, grade: "A", shipsInDays: 3, inStock: true },
  { us: "8", eu: "41", price: 84, asksAvailable: 5, grade: "S", shipsInDays: 2, inStock: true },
  { us: "8.5", eu: "42", price: 88, asksAvailable: 4, grade: "A", shipsInDays: 3, inStock: true },
  { us: "9", eu: "42.5", price: 79, asksAvailable: 7, grade: "B+", shipsInDays: 2, inStock: true },
  { us: "9.5", eu: "43", price: 86, asksAvailable: 3, grade: "S", shipsInDays: 2, inStock: true },
  { us: "10", eu: "44", price: 91, asksAvailable: 2, grade: "A", shipsInDays: 4, inStock: true },
  { us: "10.5", eu: "44.5", price: 97, asksAvailable: 1, grade: "A", shipsInDays: 5, inStock: true },
  { us: "11", eu: "45", price: 0, asksAvailable: 0, grade: "B+", shipsInDays: 0, inStock: false },
  { us: "12", eu: "46", price: 104, asksAvailable: 1, grade: "B+", shipsInDays: 6, inStock: true },
];

export const GRADE_LABEL: Record<ConditionGrade, string> = {
  S: "Museum condition",
  A: "Light wear only",
  "B+": "Well-loved, sturdy",
};

export const GRADE_SCORE: Record<ConditionGrade, number> = {
  S: 98,
  A: 88,
  "B+": 74,
};

export type ConditionPoint = {
  id: string;
  title: string;
  score: number;
  summary: string;
  notes: string[];
};

export const CONDITION_REPORT: ConditionPoint[] = [
  {
    id: "upper",
    title: "Upper & toe box",
    score: 96,
    summary: "Canvas retains full color, no cracking or discoloration.",
    notes: [
      "No visible creasing across the toe box under raking light.",
      "Original stitching intact along both side panels.",
      "Trace surface dust only, removed during intake cleaning.",
    ],
  },
  {
    id: "sole",
    title: "Outsole & midsole",
    score: 91,
    summary: "Tread pattern is 90%+ intact, midsole shows no yellowing.",
    notes: [
      "Heel strike wear consistent with under 20 miles walked.",
      "Midsole foam compresses evenly, no lean when set on a flat surface.",
      "No sole separation at the rand.",
    ],
  },
  {
    id: "insole",
    title: "Insole & lining",
    score: 88,
    summary: "Sockliner shows light footbed impression, lining unstained.",
    notes: [
      "Original insole present and reseated flat.",
      "No odor flagged during the intake inspection pass.",
      "Interior lining free of tears at the heel collar.",
    ],
  },
  {
    id: "hardware",
    title: "Laces & eyelets",
    score: 84,
    summary: "Laces are the original pair, eyelets show no rust or bend.",
    notes: [
      "Aglets intact on both laces, no fraying past the first inch.",
      "All eight eyelets seated and undamaged.",
      "Swapped-lace risk: none — matched to the original production run.",
    ],
  },
];

export const OVERVIEW_FACTS: { label: string; value: string }[] = [
  { label: "Silhouette", value: "Classic Low-Top" },
  { label: "Upper material", value: "Cotton canvas" },
  { label: "Outsole", value: "Vulcanized rubber" },
  { label: "Closure", value: "5-eyelet lace-up" },
  { label: "Colorway", value: "Optic White" },
  { label: "Original release", value: "Spring 2019" },
  { label: "Made in", value: "Portugal" },
  { label: "Box included", value: "Yes, original" },
];

export const SELLER = {
  name: "Mika R.",
  verified: true,
  trades: 76,
  rating: 4.7,
  reviewCount: 58,
  responseTime: "Usually replies within 3 hours",
  memberSince: "Seller since 2022",
};

export const SHIPPING_STEPS: { title: string; detail: string }[] = [
  { title: "Seller ships to Fernway", detail: "Tracked shipping to the nearest authentication hub." },
  { title: "Independent authentication", detail: "A three-point physical and material check, off-platform from the seller." },
  { title: "Re-shipped to you", detail: "New label, sealed authentication tag attached." },
];

export type Review = {
  id: string;
  author: string;
  rating: number;
  helpful: number;
  title: string;
  body: string;
  daysAgo: number;
  verifiedPurchase: boolean;
};

// daysAgo is a fixed offset, not a computed one — keeps the copy ("6 days ago") stable across builds
// instead of drifting with `new Date()`.
export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Denise A.",
    rating: 5,
    helpful: 24,
    title: "Exactly as graded",
    body: "The condition report undersold it if anything — these looked barely worn. Shipping took three days from cleared authentication.",
    daysAgo: 6,
    verifiedPurchase: true,
  },
  {
    id: "r2",
    author: "Owen T.",
    rating: 5,
    helpful: 19,
    title: "Sizing ran true",
    body: "Ordered my usual US 9 and the fit matched the brand's standard last. Insole photo in the condition report was accurate.",
    daysAgo: 14,
    verifiedPurchase: true,
  },
  {
    id: "r3",
    author: "Priya K.",
    rating: 4,
    helpful: 11,
    title: "Small mark not pictured",
    body: "One faint mark on the left toe box wasn't called out in the report, otherwise matched the listing. Fernway support offered a partial refund without me having to push for it.",
    daysAgo: 21,
    verifiedPurchase: true,
  },
  {
    id: "r4",
    author: "Sam L.",
    rating: 5,
    helpful: 8,
    title: "Fast authentication turnaround",
    body: "Was expecting the authentication step to add a week — it added a day. Box corner was slightly soft but the shoes themselves were clean.",
    daysAgo: 33,
    verifiedPurchase: true,
  },
  {
    id: "r5",
    author: "Grace H.",
    rating: 3,
    helpful: 6,
    title: "Good shoes, slow reply",
    body: "Condition was fine and matched the grade. Took a couple of days to hear back on a sizing question before I checked out.",
    daysAgo: 47,
    verifiedPurchase: false,
  },
];

export function formatUsd(value: number): string {
  return `$${value.toFixed(0)}`;
}
