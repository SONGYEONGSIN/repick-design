// Static catalog data for the waterfall landing page (round r34, candidate b). No Math.random,
// no Date.now, no argument-less new Date() — every value here is a fixed literal.

import type { LucideIcon } from "lucide-react";
import { Footprints, ShoppingBag, Shirt, Watch } from "lucide-react";

// ---- Color tokens ------------------------------------------------------------------------
// Light theme: near-white surface, near-black ink. Accent is teal — see the candidate's
// vault report for the full WCAG contrast workings behind these choices.
export const COLOR = {
  bg: "#FAFAFA",
  bgAlt: "#F4F4F5", // zinc-100 — tinted surface (segment tracks, pill fills)
  ink: "#18181B",
  muted: "#52525B", // zinc-600 — used everywhere text sits on a muted token, light or tinted
  border: "#E4E4E7",
  accent: "#0D9488", // teal-600 — graphic fills (bars, borders), large text
  accentDark: "#0F766E", // teal-700 — small/body text on white, button fills
  accentSoft: "#CCFBF1", // teal-100 — chip backgrounds behind accentDark text
  accentLight: "#2DD4BF", // teal-400 — small text/icons on dark-ink surfaces only
} as const;

// ---- The featured, live-priced listing ----------------------------------------------------
// This is the product whose price the toggle row + waterfall chart actually drive. Its base
// price (before any condition) and retail price live in savings-math.ts alongside the toggle
// math; everything else about the listing (match %, grade, verification, photo) lives here.
export interface FeaturedProduct {
  id: string;
  name: string;
  categoryLabel: string;
  icon: LucideIcon;
  photoId: string;
  matchPct: number;
  conditionGrade: string;
  sellerVerified: boolean;
}

export const FEATURED_PRODUCT: FeaturedProduct = {
  id: "p-jacket",
  name: "Shearling Field Jacket",
  categoryLabel: "Outerwear",
  icon: Shirt,
  photoId: "1509631179647-0177331693ae",
  matchPct: 96,
  conditionGrade: "A−",
  sellerVerified: true,
};

// ---- Similar listings (static comparison grid, not toggle-linked) -------------------------
export interface SimilarProduct {
  id: string;
  name: string;
  categoryLabel: string;
  icon: LucideIcon;
  photoId: string;
  matchPct: number;
  conditionGrade: string;
  sellerVerified: boolean;
  priceBefore: number;
  priceAfter: number;
  discountPct: number;
}

export const SIMILAR_PRODUCTS: SimilarProduct[] = [
  {
    id: "p-tote",
    name: "Canvas Field Tote",
    categoryLabel: "Bags",
    icon: ShoppingBag,
    photoId: "1553062407-98eeb64c6a62",
    matchPct: 88,
    conditionGrade: "A",
    sellerVerified: true,
    priceBefore: 175,
    priceAfter: 121,
    discountPct: 31,
  },
  {
    id: "p-watch",
    name: "Meridian Diver 200m",
    categoryLabel: "Watches",
    icon: Watch,
    photoId: "1524805444758-089113d48a6d",
    matchPct: 91,
    conditionGrade: "B+",
    sellerVerified: true,
    priceBefore: 640,
    priceAfter: 452,
    discountPct: 29,
  },
  {
    id: "p-sneakers",
    name: "Air Current 97 — Triple White",
    categoryLabel: "Sneakers",
    icon: Footprints,
    photoId: "1495121605193-b116b5b09a56",
    matchPct: 94,
    conditionGrade: "A−",
    sellerVerified: false,
    priceBefore: 225,
    priceAfter: 158,
    discountPct: 30,
  },
];

export type SortKey = "savings" | "price" | "match";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "savings", label: "Most saved" },
  { key: "price", label: "Lowest price" },
  { key: "match", label: "Best match" },
];

export function sortSimilar(
  products: SimilarProduct[],
  key: SortKey,
): SimilarProduct[] {
  const copy = [...products];
  if (key === "savings") {
    const savingsOf = (p: SimilarProduct) => p.priceBefore - p.priceAfter;
    copy.sort((a, b) => savingsOf(b) - savingsOf(a));
  } else if (key === "price") {
    copy.sort((a, b) => a.priceAfter - b.priceAfter);
  } else {
    copy.sort((a, b) => b.matchPct - a.matchPct);
  }
  return copy;
}

// ---- Social proof ---------------------------------------------------------------------------
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "I turned on bundle and student verified and watched eighteen dollars peel off before I'd even opened checkout.",
    name: "Nadia F.",
    location: "Portland, OR",
  },
  {
    id: "t-2",
    quote:
      "Every other site just shows me a final number. This one shows me which switch earned which dollar.",
    name: "Owen T.",
    location: "Denver, CO",
  },
  {
    id: "t-3",
    quote:
      "I'm a student, I bundle, and I always pick up locally — the chart made that worth confirming.",
    name: "Reiko M.",
    location: "San Diego, CA",
  },
  {
    id: "t-4",
    quote:
      "Flipping the off-peak toggle on and watching the bar shrink is a small thing, but it made the discount feel earned, not handed out.",
    name: "Carlos V.",
    location: "Phoenix, AZ",
  },
];

export const TRUST_STATS: { label: string; value: string }[] = [
  { label: "Qualifying conditions available", value: "5" },
  { label: "Buyers who switch on at least one", value: "68%" },
  { label: "Average rating from verified buyers", value: "4.8 / 5" },
];
