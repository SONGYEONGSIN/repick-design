// native/src/evolve/r5/a/data.ts — auto-native-r5 candidate a.
// Deterministic dummy data for the listing-creation wizard: category list, condition ladder,
// a suggested-price reference (mocked "similar sold listings" comparison), and quick price
// presets derived from that reference. No Math.random / Date.now / bare `new Date()` anywhere.

export interface Category {
  id: string;
  label: string;
}

export interface ConditionOption {
  id: string;
  label: string;
  description: string;
}

export interface PriceReference {
  itemHint: string;
  low: number;
  typical: number;
  high: number;
  soldCount: number;
  windowDays: number;
}

export interface PricePreset {
  id: string;
  label: string;
  value: number;
}

export const PHOTO_SLOT_COUNT = 6;
export const PHOTO_SLOT_IDS: readonly string[] = Array.from(
  { length: PHOTO_SLOT_COUNT },
  (_, index) => `slot-${index + 1}`,
);

export const PRICE_STEP = 5000;

export const CATEGORIES: readonly Category[] = [
  { id: "outerwear", label: "Outerwear" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "shoes", label: "Shoes" },
  { id: "bags", label: "Bags & Accessories" },
  { id: "electronics", label: "Electronics" },
  { id: "home", label: "Home & Living" },
  { id: "sporting", label: "Sporting Goods" },
];

export const CONDITIONS: readonly ConditionOption[] = [
  {
    id: "new-with-tags",
    label: "New with tags",
    description: "Unused, tags or original packaging still attached.",
  },
  {
    id: "like-new",
    label: "Like new",
    description: "Used once or twice, no visible wear.",
  },
  {
    id: "good",
    label: "Good",
    description: "Light signs of use, fully functional.",
  },
  {
    id: "fair",
    label: "Fair",
    description: "Noticeable wear, still works as expected.",
  },
  {
    id: "well-used",
    label: "Well used",
    description: "Heavy wear or cosmetic flaws, priced accordingly.",
  },
];

export const PRICE_REFERENCE: PriceReference = {
  itemHint: "Similar sold listings",
  low: 96000,
  typical: 128000,
  high: 165000,
  soldCount: 34,
  windowDays: 30,
};

export const PRICE_PRESETS: readonly PricePreset[] = [
  { id: "below", label: "Price to sell — 10% under typical", value: 115000 },
  { id: "typical", label: "Match typical", value: 128000 },
  { id: "above", label: "Ask for more — 10% over typical", value: 141000 },
];

/** Heterogeneous row model for the details step's single FlatList (category rows, then
 * condition rows, each under its own section header) — avoids nesting a second list. */
export type DetailsRow =
  | { kind: "header"; id: string; label: string; hint: string }
  | { kind: "category"; id: string; category: Category }
  | { kind: "condition"; id: string; condition: ConditionOption };

export const DETAILS_ROWS: readonly DetailsRow[] = [
  {
    kind: "header",
    id: "header-category",
    label: "Category",
    hint: "Pick the closest match — buyers filter by this.",
  },
  ...CATEGORIES.map(
    (category): DetailsRow => ({
      kind: "category",
      id: `category-${category.id}`,
      category,
    }),
  ),
  {
    kind: "header",
    id: "header-condition",
    label: "Condition",
    hint: "Be honest — buyers compare this to the photos.",
  },
  ...CONDITIONS.map(
    (condition): DetailsRow => ({
      kind: "condition",
      id: `condition-${condition.id}`,
      condition,
    }),
  ),
];

export const STEPS = [
  { id: "photos", label: "Photos" },
  { id: "details", label: "Details" },
  { id: "price", label: "Price" },
  { id: "review", label: "Review" },
] as const;

/** Thousands-separated KRW digits, no symbol — deterministic, no toLocaleString. */
export function formatWonDigits(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  const digits = safe.toString();
  let grouped = "";
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) {
      grouped += ",";
    }
    grouped += digits[i];
  }
  return grouped;
}

/** Full "₩1,234" string — safe for accessibilityLabel / plain non-tabular Text. */
export function formatWon(amount: number): string {
  return `₩${formatWonDigits(amount)}`;
}
