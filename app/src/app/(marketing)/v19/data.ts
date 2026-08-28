import {
  BadgeCheck,
  Backpack,
  Lamp,
  Scale,
  ShieldCheck,
  Shirt,
  Table2,
  type LucideIcon,
} from "lucide-react";

/**
 * Shared design tokens. Tailwind classes below are written out as literal strings at each call
 * site (arbitrary-value class names must be static for the compiler to pick them up), so these
 * constants exist for the handful of places that need the raw value in a JS/inline-style context
 * — not as something interpolated into a className.
 *
 * Accent = sky-700 #0369a1. Chosen over sky-500/600 because contrast math (see candidates/c.md)
 * showed sky-500 fails even the 3:1 non-text threshold against white (2.77:1), sky-600 clears 3:1
 * but not 4.5:1 for white text sitting on it as a button fill (4.09:1), while sky-700 clears both
 * the 3:1 fill/border case AND the 4.5:1 small-text/icon/focus-ring case against white (5.93:1).
 */
export const DISPLAY_FONT = { fontFamily: "var(--font-display-grotesk)" } as const;

export type Category = "condition" | "authenticity" | "price";

export const CATEGORY_ORDER: Category[] = ["condition", "authenticity", "price"];

interface CategoryMeta {
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  condition: {
    label: "Condition",
    short: "condition",
    description:
      "What the item actually looks and feels like, checked against every photo the seller submitted.",
    icon: BadgeCheck,
  },
  authenticity: {
    label: "Authenticity",
    short: "authenticity",
    description:
      "Brand marks, stitching and materials, checked against verified reference photos for that brand and style.",
    icon: ShieldCheck,
  },
  price: {
    label: "Price fairness",
    short: "price",
    description:
      "The asking price, checked against comparable verified sales from the last 30 days.",
    icon: Scale,
  },
};

export interface Correction {
  id: string;
  category: Category;
  before: string;
  after: string;
  reason: string;
  points: number;
}

/** Ordered corrections that make up the redlined seller listing. Default state (all categories
 *  active) renders all four — the DNA brief requires the unmanipulated view to already show a
 *  nonzero, meaningful diff, not a blank slate the user has to unlock. */
export const CORRECTIONS: Correction[] = [
  {
    id: "condition-grade",
    category: "condition",
    before: "like-new condition with zero flaws",
    after:
      "good pre-owned condition — light wear on the left cuff and a faint mark near the collar (Grade B+)",
    reason:
      "Wear consistent with regular use is visible in photos 2 and 5 of 6 submitted. Graded against repick's published condition rubric.",
    points: 6,
  },
  {
    id: "condition-care",
    category: "condition",
    before: "machine washable, no dry cleaning needed",
    after:
      "the manufacturer's care label reads dry-clean only, confirmed in photo 4",
    reason:
      "Care-label text was legible in one submitted photo and cross-checked against the brand's published care guide.",
    points: 6,
  },
  {
    id: "authenticity-brand",
    category: "authenticity",
    before: "100% genuine leather from a well-known heritage brand",
    after:
      "full-grain leather; the brand mark is genuine but partially worn, verified against 3 reference photos",
    reason:
      "Stitch pattern, hardware stamp and grain matched verified reference photos on file for this brand and style.",
    points: 18,
  },
  {
    id: "price-fair",
    category: "price",
    before: "priced to sell fast — the best deal in the city for this jacket",
    after:
      "listed 12% below 14 comparable verified jackets sold in the last 30 days",
    reason:
      "Compared against repick's verified sales history for the same brand, grade and size, sold in the last 30 days.",
    points: 12,
  },
];

export type RedlineSegment = string | { correctionId: string };

/** The sentence the corrections are woven into, read top to bottom in order. */
export const REDLINE_TEMPLATE: RedlineSegment[] = [
  "This jacket is in ",
  { correctionId: "condition-grade" },
  ". It's ",
  { correctionId: "authenticity-brand" },
  ". Care label: ",
  { correctionId: "condition-care" },
  ". It's ",
  { correctionId: "price-fair" },
  ".",
];

const TRUST_BASE = 58;

/** Recomputes the live confidence number from whichever categories are currently active. Every
 *  active category with corrections contributes its points; deterministic, no randomness. */
export function computeTrustScore(active: ReadonlySet<Category>): number {
  const contribution = CORRECTIONS.reduce(
    (sum, c) => (active.has(c.category) ? sum + c.points : sum),
    0,
  );
  return TRUST_BASE + contribution;
}

export function visibleCorrections(active: ReadonlySet<Category>): Correction[] {
  return CORRECTIONS.filter((c) => active.has(c.category));
}

/** Total trust-score points a single category is worth, and how many corrections it found in
 *  this listing — used by the "What repick checks" section so those numbers stay derived from
 *  CORRECTIONS rather than retyped by hand. */
export function categoryStats(category: Category): { points: number; count: number } {
  const matches = CORRECTIONS.filter((c) => c.category === category);
  return {
    points: matches.reduce((sum, c) => sum + c.points, 0),
    count: matches.length,
  };
}

/** Percentage off, rounded to the nearest whole number — computed, never hand-typed, so the
 *  badge always matches the two prices sitting next to it. */
export function pctOff(before: number, after: number): number {
  return Math.round(((before - after) / before) * 100);
}

export interface ListingProof {
  id: string;
  title: string;
  categoryLabel: string;
  icon: LucideIcon;
  matchPct: number;
  grade: string;
  verified: "verified" | "pending";
  priceBefore: number;
  priceAfter: number;
}

/** The flagship, redlined listing. Grade B+ and the 12%-below figure both come straight out of
 *  CORRECTIONS above (condition-grade, price-fair) rather than being retyped, so the card can
 *  never drift out of sync with the paragraph it sits under. */
export const REDLINE_LISTING: ListingProof = {
  id: "redline-listing",
  title: "Vintage Leather Field Jacket — Size M",
  categoryLabel: "Outerwear · seller-submitted",
  icon: Shirt,
  matchPct: 94,
  grade: "B+",
  verified: "verified",
  priceBefore: 340,
  priceAfter: 299,
};

/** Three more listings shown at rest, each carrying its own full proof stack (match, grade,
 *  verification, before/after price) so the first fold reads as a real product preview, not just
 *  one hero example. */
export const OTHER_LISTINGS: ListingProof[] = [
  {
    id: "oak-side-table",
    title: "Mid-Century Oak Side Table",
    categoryLabel: "Furniture",
    icon: Table2,
    matchPct: 88,
    grade: "A-",
    verified: "verified",
    priceBefore: 210,
    priceAfter: 172,
  },
  {
    id: "canvas-duffel",
    title: "Canvas Weekender Duffel",
    categoryLabel: "Bags",
    icon: Backpack,
    matchPct: 81,
    grade: "B",
    verified: "verified",
    priceBefore: 95,
    priceAfter: 86,
  },
  {
    id: "ceramic-lamp",
    title: "Ceramic Table Lamp, Cream",
    categoryLabel: "Home",
    icon: Lamp,
    matchPct: 76,
    grade: "A",
    verified: "pending",
    priceBefore: 64,
    priceAfter: 58,
  },
];

export interface SocialStat {
  value: string;
  label: string;
}

export interface Quote {
  text: string;
  name: string;
  role: string;
}

export const SOCIAL_STATS: SocialStat[] = [
  { value: "128,400+", label: "listings redlined this year" },
  { value: "1 in 4", label: "listings get at least one correction" },
  { value: "94%", label: "of buyers say the redline changed their offer" },
  { value: "11 hrs", label: "average seller response time saved per week" },
];

export const QUOTES: Quote[] = [
  {
    text: "repick caught a care-label mismatch on a jacket I almost bought without a second look.",
    name: "Priya M.",
    role: "Verified buyer",
  },
  {
    text: "Every correction cites its evidence. It reads like an editor, not a warning label.",
    name: "Daniel K.",
    role: "Verified buyer",
  },
  {
    text: "I list secondhand furniture for a living. The redline settles disputes before they start.",
    name: "Marta S.",
    role: "Verified seller",
  },
];
