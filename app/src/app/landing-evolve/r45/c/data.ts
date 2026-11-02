// Deterministic pricing model for "Meet in the Middle" -- no Math.random / Date.now / new Date
// anywhere. Every dollar figure on the page is a pure function of one shared number: the assumed
// resale discount (a whole percent, 15-70). Drag the divider or press an arrow key and this one
// value changes; every price, every stat, the badge and the closing CTA re-derive from it.

export const DISCOUNT_MIN = 15; // modest markdown -- lightly worn designer pieces, high demand
export const DISCOUNT_MAX = 70; // deep markdown -- end-of-season, high-supply categories
export const DISCOUNT_DEFAULT = 42; // starting position, roughly the catalog-wide median markdown
export const DISCOUNT_STEP = 1; // arrow key step
export const DISCOUNT_STEP_LARGE = 5; // Shift+Arrow / Page Up / Page Down step

// The divider's own travel range, as a percent of the split's width. Panels never fully collapse
// at either extreme (narrowest panel still holds 30% of the width) and the divider's rail is only
// drawn across this middle band, so there is no "dead" drag zone at the ends.
export const PANEL_MIN = 30;
export const PANEL_MAX = 70;

/** The left ("Buying new") panel's share of the split's width, 30-70, for a given discount. */
export function travelForDiscount(discount: number): number {
  const t = (discount - DISCOUNT_MIN) / (DISCOUNT_MAX - DISCOUNT_MIN);
  return PANEL_MAX - t * (PANEL_MAX - PANEL_MIN);
}

/** Inverse of the above: a raw pointer-position percent (0-100, clamped to the travel band) back to a discount. */
export function discountForTravel(rawPct: number): number {
  const clamped = Math.min(PANEL_MAX, Math.max(PANEL_MIN, rawPct));
  const t = (PANEL_MAX - clamped) / (PANEL_MAX - PANEL_MIN);
  return Math.round(DISCOUNT_MIN + t * (DISCOUNT_MAX - DISCOUNT_MIN));
}

export function clampDiscount(discount: number): number {
  return Math.min(DISCOUNT_MAX, Math.max(DISCOUNT_MIN, Math.round(discount)));
}

/** The repick-side price for a given new price, at the current shared discount. */
export function repickPrice(newPrice: number, discount: number): number {
  return Math.round(newPrice * (1 - discount / 100));
}

export function savingsAmount(newPrice: number, discount: number): number {
  return newPrice - repickPrice(newPrice, discount);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// ---- Catalog content ----

export const MAIN_ITEM = {
  id: "overcoat-aldwych",
  title: "Wool overcoat",
  brand: "Aldwych & Rae",
  newPrice: 480,
  image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop",
  alt: "Camel wool overcoat laid flat against a neutral background",
  matchPercent: 94,
  conditionGrade: "A-",
  verified: true,
};

export type CategoryItem = { id: string; label: string; newPrice: number };

// Three more categories driven by the exact same shared discount -- proof that one divider moves
// more than a single hero price.
export const CATEGORY_ITEMS: CategoryItem[] = [
  { id: "sneakers", label: "Sneakers", newPrice: 180 },
  { id: "tote", label: "Leather tote", newPrice: 410 },
  { id: "denim", label: "Raw denim jacket", newPrice: 210 },
];

// A single already-finished sale shown in social proof -- its own fixed numbers, explicitly not
// driven by the divider above. Copy must never imply this card moves with it.
export const CLOSED_SALE = {
  id: "aviator-rowan",
  title: "Shearling aviator jacket",
  brand: "Rowan Field",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  alt: "Brown shearling aviator jacket on a plain surface",
  newPrice: 540,
  soldPrice: 289,
  daysToSell: 9,
  conditionGrade: "A-",
  verified: true,
};

export type Testimonial = { id: string; name: string; role: string; quote: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Priya N.",
    role: "Buyer, outerwear",
    quote:
      "I dragged the line until it matched what I actually expected to pay for a worn coat, and the number on the right side was the number I ended up paying two days later.",
  },
  {
    id: "t2",
    name: "Devon K.",
    role: "Buyer, five resales",
    quote:
      "Most sites just show you a strikethrough price. This one let me argue with the discount myself before I ever opened a listing.",
  },
];

export const STATS = [
  { value: "18,400", label: "verified resales completed" },
  { value: "38%", label: "avg. markdown across closed sales" },
  { value: "9d", label: "median days from list to sold" },
];
