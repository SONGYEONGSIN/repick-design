// Fixed, deterministic data. No Math.random / Date.now / new Date() anywhere in this route —
// every number the page shows is either a literal here or a pure function (model.ts) of the
// live credit split. Switchback is a resale marketplace for used outdoor and trail gear.

import { Backpack, CloudRain, Footprints, Tent, type LucideIcon } from "lucide-react";

export type CategoryId = "shelter" | "packs" | "footwear" | "layers";

export interface Category {
  id: CategoryId;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  /** This week's share of buyer search volume in this category, out of 100 across all four. */
  demandShare: number;
  /** Featured-slot views generated per 1% of the weekly spotlight pool spent in this category. */
  viewYield: number;
}

// demandShare sums to 100; viewYield is an independent constant (how efficiently a credit
// converts to a view in that category right now) so "matching demand" and "maximizing views"
// can — and do, below — pull in different directions.
export const CATEGORIES = [
  { id: "shelter", label: "Tents & Shelter", shortLabel: "Shelter", Icon: Tent, demandShare: 32, viewYield: 54 },
  { id: "packs", label: "Packs & Bags", shortLabel: "Packs", Icon: Backpack, demandShare: 27, viewYield: 61 },
  { id: "footwear", label: "Footwear & Traction", shortLabel: "Footwear", Icon: Footprints, demandShare: 23, viewYield: 47 },
  { id: "layers", label: "Layers & Shells", shortLabel: "Layers", Icon: CloudRain, demandShare: 18, viewYield: 72 },
] as const;

/** The fixed weekly pool: always exactly 100 spotlight credits, split four ways. */
export const TOTAL_CREDITS = 100;

/** Minimum credits any one category keeps — prevents a drag from fully zeroing a neighbor out. */
export const MIN_SHARE = 5;

/** Starting split: deliberately not demand-matched, so there is real room for the score to move. */
export const DEFAULT_SHARES: readonly number[] = [40, 20, 15, 25];

/** Second scenario in the value section: credits spread evenly across all four categories. */
export const BALANCED_SHARES: readonly number[] = [25, 25, 25, 25];

export interface Listing {
  id: string;
  categoryIndex: number;
  title: string;
  photoId: string;
  alt: string;
  matchPct: number;
  grade: string;
  verified: boolean;
  discountPct: number;
  originalPrice: number;
  currentPrice: number;
  reasonTags: readonly [string, string];
  conditionNote: string;
}

export const LISTINGS = [
  {
    id: "l-shelter",
    categoryIndex: 0,
    title: "Ridgeline 2P Tent",
    photoId: "1504280390367-361c6d9f38f4",
    alt: "A two-person dome tent lit from within, pitched on a dark mountainside at night",
    matchPct: 95,
    grade: "Excellent",
    verified: true,
    discountPct: 38,
    originalPrice: 420,
    currentPrice: 260,
    reasonTags: ["3-season, no pole repairs in comps", "Matches this week's top shelter search"],
    conditionNote: "Seams and zipper pulls checked against 12 comparable listings before grading.",
  },
  {
    id: "l-packs",
    categoryIndex: 1,
    title: "Summit 45L Pack",
    photoId: "1532298229144-0ec0c57515c0",
    alt: "A hiking backpack resting on a rock with mountain ridgelines in the distance",
    matchPct: 91,
    grade: "Good",
    verified: true,
    discountPct: 33,
    originalPrice: 240,
    currentPrice: 161,
    reasonTags: ["Hip-belt wear within normal range", "Volume matches 4 saved alerts"],
    conditionNote: "Hip-belt stitching and buckle tension checked against 9 comparable listings.",
  },
  {
    id: "l-footwear",
    categoryIndex: 2,
    title: "Traverse Trail Shoes",
    photoId: "1491553895911-0055eca6402d",
    alt: "A pair of worn trail running shoes photographed against a plain background",
    matchPct: 88,
    grade: "Good",
    verified: false,
    discountPct: 41,
    originalPrice: 150,
    currentPrice: 89,
    reasonTags: ["Lug depth confirmed from 6 close-ups", "Size 10 is this week's top search"],
    conditionNote: "Outsole lug depth measured and compared against this week's size-10 sales.",
  },
  {
    id: "l-layers",
    categoryIndex: 3,
    title: "Fieldwork Rain Shell",
    photoId: "1500648767791-00dcc994a43e",
    alt: "A technical rain shell jacket laid flat against a neutral backdrop",
    matchPct: 93,
    grade: "Like New",
    verified: true,
    discountPct: 29,
    originalPrice: 260,
    currentPrice: 185,
    reasonTags: ["Seam tape fully intact in comps", "Waterproof rating verified on file"],
    conditionNote: "Waterproof rating re-verified against the manufacturer's spec sheet on file.",
  },
] as const;

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const TESTIMONIALS = [
  {
    id: "t-mara",
    quote:
      "I used to just dump everything into one category and hope. Watching the fit score move while I drag made the tradeoff obvious in a way a spreadsheet never did.",
    name: "Mara Ibsen",
    role: "Sold 34 items, verified seller since 2024",
    initials: "MI",
  },
  {
    id: "t-devon",
    quote:
      "Switchback graded a jacket I was sure was \"good\" as \"like new\" and backed it with the comp photos. The buyer never second-guessed it.",
    name: "Devon Oyelaran",
    role: "Sold 11 items, verified seller since 2025",
    initials: "DO",
  },
  {
    id: "t-priya",
    quote:
      "Shifting spotlight credit toward footwear this week doubled my views on two pairs of boots I'd listed months ago and basically forgotten about.",
    name: "Priya Nandy",
    role: "Sold 58 items, verified seller since 2023",
    initials: "PN",
  },
] as const;

export interface StatChip {
  id: string;
  value: string;
  label: string;
}

export const STAT_CHIPS: readonly StatChip[] = [
  { id: "s-sellers", value: "14,200+", label: "verified sellers" },
  { id: "s-payout", value: "41 hrs", label: "average payout turnaround" },
  { id: "s-rating", value: "4.8 / 5", label: "average seller rating" },
];
