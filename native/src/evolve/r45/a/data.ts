// native/src/evolve/r45/a/data.ts
//
// Deterministic dummy data + pure helpers for the Want List screen.
// A "want" is a pre-listing wishlist entry: criteria for an item the buyer
// is looking for that is NOT listed yet (brand/model/size/condition/max
// price). This is distinct from the existing `watchlist` screen, which
// tracks items that ARE already listed and being watched.
//
// No Math.random / Date.now / bare `new Date()` anywhere below — every
// value is a fixed literal or derived from one.

export const CONDITION_TIERS = [
  "Any condition",
  "New with tags",
  "Like new",
  "Good",
  "Fair",
] as const;

export type ConditionTier = (typeof CONDITION_TIERS)[number];

export interface WantEntry {
  id: string;
  brand: string;
  modelOrStyle: string;
  size: string;
  condition: ConditionTier;
  maxPriceCents: number;
  /** Pre-formatted, fixed display string — avoids any Date math for determinism. */
  addedOnLabel: string;
}

// Fixed "today" label used when a new want is saved in this session —
// a literal string, never Date.now()/new Date().
export const ADDED_TODAY_LABEL = "Added Oct 30, 2026";

export const WANT_ENTRIES: WantEntry[] = [
  {
    id: "w1",
    brand: "Patagonia",
    modelOrStyle: "Retro Pile Fleece Jacket",
    size: "Men's M",
    condition: "Like new",
    maxPriceCents: 9000,
    addedOnLabel: "Added Sep 2, 2026",
  },
  {
    id: "w2",
    brand: "New Balance",
    modelOrStyle: "990v5",
    size: "US 9.5",
    condition: "Good",
    maxPriceCents: 7500,
    addedOnLabel: "Added Sep 14, 2026",
  },
  {
    id: "w3",
    brand: "Levi's",
    modelOrStyle: "501 Original, vintage made in USA",
    size: "32 x 32",
    condition: "Any condition",
    maxPriceCents: 4500,
    addedOnLabel: "Added Oct 1, 2026",
  },
  {
    id: "w4",
    brand: "Nintendo",
    modelOrStyle: "Game Boy Color, any shell color",
    size: "N/A",
    condition: "New with tags",
    maxPriceCents: 6000,
    addedOnLabel: "Added Oct 20, 2026",
  },
];

/** The editable fields of a want, as held by the inline add/edit form. */
export interface WantFormSnapshot {
  brand: string;
  modelOrStyle: string;
  size: string;
  condition: ConditionTier;
  maxPrice: string;
}

export const EMPTY_WANT_FORM: WantFormSnapshot = {
  brand: "",
  modelOrStyle: "",
  size: "",
  condition: "Any condition",
  maxPrice: "",
};

export function entryToFormSnapshot(entry: WantEntry): WantFormSnapshot {
  return {
    brand: entry.brand,
    modelOrStyle: entry.modelOrStyle,
    size: entry.size,
    condition: entry.condition,
    maxPrice: formatCentsAsInput(entry.maxPriceCents),
  };
}

function formatCentsAsInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatCentsAsPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Structural, field-by-field comparison between the current draft and the
 * last-saved snapshot for the want being edited (or the empty baseline, for
 * a brand-new draft). This is the single source of truth for whether the
 * Want List bottom band renders — recomputed every render, never a
 * hand-flipped boolean. Trims strings so stray leading/trailing whitespace
 * doesn't register as a "change" the user never made.
 */
export function wantDraftDiffersFromSaved(
  draft: WantFormSnapshot,
  saved: WantFormSnapshot
): boolean {
  return (
    draft.brand.trim() !== saved.brand.trim() ||
    draft.modelOrStyle.trim() !== saved.modelOrStyle.trim() ||
    draft.size.trim() !== saved.size.trim() ||
    draft.condition !== saved.condition ||
    draft.maxPrice.trim() !== saved.maxPrice.trim()
  );
}

export interface WantFormErrors {
  brand?: string;
  modelOrStyle?: string;
  size?: string;
  maxPrice?: string;
}

/** Validates the draft; returns an empty object when every field is valid. */
export function validateWantForm(draft: WantFormSnapshot): WantFormErrors {
  const errors: WantFormErrors = {};
  if (draft.brand.trim().length === 0) {
    errors.brand = "Enter a brand.";
  }
  if (draft.modelOrStyle.trim().length === 0) {
    errors.modelOrStyle = "Enter a model or style.";
  }
  if (draft.size.trim().length === 0) {
    errors.size = "Enter a size.";
  }
  const parsedPrice = Number.parseFloat(draft.maxPrice.trim());
  if (draft.maxPrice.trim().length === 0) {
    errors.maxPrice = "Enter a max price.";
  } else if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    errors.maxPrice = "Enter a price greater than 0.";
  }
  return errors;
}

export function formSnapshotToPriceCents(draft: WantFormSnapshot): number {
  const parsed = Number.parseFloat(draft.maxPrice.trim());
  return Math.round(parsed * 100);
}
