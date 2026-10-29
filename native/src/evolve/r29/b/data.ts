// native/src/evolve/r29/b/data.ts
//
// Deterministic seed data + pure domain helpers for the Draft Listings
// screen. Nothing here calls Math.random, Date.now, or `new Date()` — every
// field is a fixed literal and every exported function is a pure transform
// of its arguments, so the "ready to publish" flag below is always computed
// from the draft's real fields rather than stored as a trusted boolean.

export type DraftCondition = "new_with_tags" | "like_new" | "good" | "fair" | null;

export interface DraftListing {
  id: string;
  /** Empty string means the seller hasn't typed a title yet — a real draft state, not an error. */
  title: string;
  category: string;
  /** Null = price field untouched. A seller can also leave it at 0, which is treated as unset below. */
  priceCents: number | null;
  condition: DraftCondition;
  photoCount: number;
  /** Fixed human-readable recency string — never computed from the current clock. */
  editedNote: string;
}

export const initialDrafts: DraftListing[] = [
  {
    id: "d1",
    title: "Denim Trucker Jacket",
    category: "Outerwear",
    priceCents: 4200,
    condition: "good",
    photoCount: 4,
    editedNote: "Edited yesterday",
  },
  {
    id: "d2",
    title: "Floral Midi Dress",
    category: "Dresses",
    priceCents: null,
    condition: "like_new",
    photoCount: 3,
    editedNote: "Edited 2 days ago",
  },
  {
    id: "d3",
    title: "Leather Crossbody Bag",
    category: "Bags",
    priceCents: 5600,
    condition: null,
    photoCount: 5,
    editedNote: "Edited 3 days ago",
  },
  {
    id: "d4",
    title: "",
    category: "Shoes",
    priceCents: null,
    condition: null,
    photoCount: 1,
    editedNote: "Edited 4 days ago",
  },
  {
    id: "d5",
    title: "Wool Blend Overcoat",
    category: "Outerwear",
    priceCents: 8900,
    condition: "new_with_tags",
    photoCount: 6,
    editedNote: "Edited 5 days ago",
  },
  {
    id: "d6",
    title: "Striped Cotton Tee",
    category: "Tops",
    priceCents: null,
    condition: null,
    photoCount: 2,
    editedNote: "Edited 1 week ago",
  },
  {
    id: "d7",
    title: "Silk Scarf, Paisley Print",
    category: "Accessories",
    // Seller cleared the price back to zero instead of leaving it unset —
    // treated the same as "no price" by the validation rule below, since a
    // free listing isn't a thing this marketplace supports.
    priceCents: 0,
    condition: "good",
    photoCount: 2,
    editedNote: "Edited 1 week ago",
  },
  {
    id: "d8",
    title: "Canvas High-Top Sneakers",
    category: "Shoes",
    priceCents: 3100,
    condition: "fair",
    photoCount: 4,
    editedNote: "Edited 2 weeks ago",
  },
  {
    id: "d9",
    title: "Cashmere Sweater",
    category: "Tops",
    priceCents: 6700,
    condition: "like_new",
    photoCount: 3,
    editedNote: "Edited 3 weeks ago",
  },
];

/**
 * The real publish-readiness rule: a title, a strictly-positive price, and a
 * condition must all be present. Every caller derives this from the draft's
 * current fields on every render instead of trusting a cached flag, so it
 * can never drift out of sync with an edit.
 */
export function isReadyToPublish(draft: DraftListing): boolean {
  return (
    draft.title.trim().length > 0 &&
    draft.priceCents !== null &&
    draft.priceCents > 0 &&
    draft.condition !== null
  );
}

export function conditionLabel(condition: DraftCondition): string {
  switch (condition) {
    case "new_with_tags":
      return "New with tags";
    case "like_new":
      return "Like new";
    case "good":
      return "Good";
    case "fair":
      return "Fair";
    default:
      return "Condition not set";
  }
}

/** Formats whole cents as a plain Latin-currency string, e.g. "$42.00". */
export function formatPrice(cents: number): string {
  const whole = Math.floor(cents / 100);
  const remainder = cents % 100;
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${grouped}.${remainder.toString().padStart(2, "0")}`;
}

/** Deterministic 3-way cycle used to tint the placeholder thumbnail boxes. */
export function swatchIndexFor(position: number): 0 | 1 | 2 {
  return (position % 3) as 0 | 1 | 2;
}
