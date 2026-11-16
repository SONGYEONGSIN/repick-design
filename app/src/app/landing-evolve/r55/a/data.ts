// Deterministic dummy content. No Math.random/Date.now/new Date() anywhere — every figure here is
// a literal or a pure function of the stepper's step index (see model.ts).

export interface HeroItem {
  title: string;
  basePrice: number;
  photoId: string;
  alt: string;
  aiMatchPct: number;
  verified: boolean;
}

export const HERO_ITEM: HeroItem = {
  title: "Structured Wool-Blend Overcoat",
  basePrice: 240,
  photoId: "1551028719-00167b16eac5",
  alt: "Charcoal wool-blend overcoat laid flat on a light surface",
  aiMatchPct: 96,
  verified: true,
};

export interface Listing {
  id: string;
  title: string;
  basePrice: number;
  /** Fixed, not tied to the hero stepper — this is a different physical item. */
  step: number;
  verified: boolean;
  photoId: string;
  alt: string;
  reasonTags: readonly string[];
}

export const LISTINGS: readonly Listing[] = [
  {
    id: "sneakers",
    title: "Canvas Low-Top Sneakers",
    basePrice: 95,
    step: 2,
    verified: true,
    photoId: "1542291026-7eec264c27ff",
    alt: "Pair of white canvas low-top sneakers",
    reasonTags: ["Matches your saved size, US 9", "Sold by a seller you've bought from before"],
  },
  {
    id: "watch",
    title: "Automatic Steel Watch",
    basePrice: 410,
    step: 3,
    verified: true,
    photoId: "1523275335684-37898b6baf30",
    alt: "Stainless steel automatic wristwatch with a dark dial",
    reasonTags: ["Same movement as 3 watches you've viewed", "Priced under your saved alert"],
  },
  {
    id: "camera",
    title: "Compact Mirrorless Camera",
    basePrice: 560,
    step: 1,
    verified: false,
    photoId: "1510127034890-ba27508e9f1c",
    alt: "Compact mirrorless camera with a prime lens attached",
    reasonTags: ["Popular with buyers who kept your other saves", "Includes the original battery and charger"],
  },
  {
    id: "backpack",
    title: "Canvas Weekend Backpack",
    basePrice: 120,
    step: 0,
    verified: true,
    photoId: "1553062407-98eeb64c6a62",
    alt: "Canvas weekend backpack with leather trim",
    reasonTags: ["Close to 3 recent searches of yours", "Local pickup available near you"],
  },
] as const;

export interface StatChip {
  id: string;
  value: string;
  label: string;
}

export const STAT_CHIPS: readonly StatChip[] = [
  { id: "listings", value: "28,400+", label: "items graded and sold" },
  { id: "rating", value: "4.8/5", label: "average buyer rating" },
  { id: "resold", value: "91%", label: "of sellers list again" },
] as const;

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "jordan",
    quote:
      "I stepped through the grades before listing my own coat and priced it at Very Good instead of guessing low. It sold in four days.",
    name: "Jordan M.",
    role: "Seller, outerwear",
    initials: "JM",
  },
  {
    id: "priya",
    quote:
      "The grade walkthrough told me exactly what 'Excellent' meant for this watch before I paid. No surprises at pickup.",
    name: "Priya K.",
    role: "Buyer, watches",
    initials: "PK",
  },
  {
    id: "sam",
    quote:
      "Seeing the resale number move with the grade made the condition scale click instantly — it stopped feeling arbitrary.",
    name: "Sam R.",
    role: "Buyer, electronics",
    initials: "SR",
  },
] as const;
