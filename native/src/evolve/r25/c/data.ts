// native/src/evolve/r25/c/data.ts — deterministic dummy data + pure domain helpers for
// SavedSearchManagerScreen. No Math.random / Date.now / argument-less `new Date()` anywhere
// below — every value is a fixed literal, every derived value is a pure function of the data.

export type SearchCategory = "phones" | "cameras" | "furniture" | "sneakers" | "bags";

export const CATEGORY_LABELS: Record<SearchCategory, string> = {
  phones: "Phones & Tablets",
  cameras: "Cameras & Lenses",
  furniture: "Furniture",
  sneakers: "Sneakers",
  bags: "Bags & Accessories",
};

export type SavedSearch = {
  id: string;
  /** What the buyer searched for — the readable name of the saved search. */
  title: string;
  category: SearchCategory;
  conditionLabel: string;
  maxPriceKrw: number;
  /** New matching listings since the buyer last opened this search. Frozen at 0 semantics
   * while `paused` — a paused search does not accumulate matches (checked in the UI, not here,
   * so the raw count stays inspectable for merge math). */
  newMatchesCount: number;
  paused: boolean;
  lastCheckedLabel: string;
};

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "ss-1",
    title: "iPhone 13 Pro, Space Gray",
    category: "phones",
    conditionLabel: "Like New or better",
    maxPriceKrw: 800000,
    newMatchesCount: 5,
    paused: false,
    lastCheckedLabel: "Checked 2 hours ago",
  },
  {
    id: "ss-2",
    title: "iPhone 14 Pro Max, Any Color",
    category: "phones",
    conditionLabel: "Good or better",
    maxPriceKrw: 950000,
    newMatchesCount: 2,
    paused: false,
    lastCheckedLabel: "Checked 5 hours ago",
  },
  {
    id: "ss-3",
    title: "Sony A7 III, Body Only",
    category: "cameras",
    conditionLabel: "Like New or better",
    maxPriceKrw: 1200000,
    newMatchesCount: 0,
    paused: false,
    lastCheckedLabel: "Checked yesterday",
  },
  {
    id: "ss-4",
    title: "Herman Miller Aeron, Size B",
    category: "furniture",
    conditionLabel: "Any condition",
    maxPriceKrw: 450000,
    newMatchesCount: 3,
    paused: true,
    lastCheckedLabel: "Paused since Sep 12",
  },
  {
    id: "ss-5",
    title: "Nike Dunk Low Panda, Size 270",
    category: "sneakers",
    conditionLabel: "New with tags",
    maxPriceKrw: 180000,
    newMatchesCount: 8,
    paused: false,
    lastCheckedLabel: "Checked 30 minutes ago",
  },
  {
    id: "ss-6",
    title: "Jordan 1 Retro High, Size 270",
    category: "sneakers",
    conditionLabel: "Good or better",
    maxPriceKrw: 220000,
    newMatchesCount: 0,
    paused: true,
    lastCheckedLabel: "Paused since Sep 20",
  },
  {
    id: "ss-7",
    title: "Vintage Coach Crossbody Bag",
    category: "bags",
    conditionLabel: "Good or better",
    maxPriceKrw: 150000,
    newMatchesCount: 1,
    paused: false,
    lastCheckedLabel: "Checked 3 hours ago",
  },
];

// Thousands-separated digits without toLocaleString (deterministic across environments).
export function groupThousands(n: number): string {
  return Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// A space between the won sign and the digits keeps the glyph from reading as a strikethrough
// next to a run of digits (see native/GENERATION.md §1) — this is a single Text node and it
// never carries `fontVariant: ["tabular-nums"]`.
export function formatPriceCeiling(maxPriceKrw: number): string {
  return `under ₩ ${groupThousands(maxPriceKrw)}`;
}

/** Two saved searches are mergeable only when they target the same category — merging across
 * categories would silently widen the search into something the buyer never asked for. */
export function canMergePair(a: SavedSearch, b: SavedSearch): boolean {
  return a.category === b.category;
}

/** Produces a new saved search that is the real union of two compatible ones: the wider price
 * ceiling (so nothing either search would have caught is lost), the shared condition floor (or
 * "Any condition" when they disagree), and a new-matches count that is the honest sum of both —
 * not a decorative merge, an actually recomputed one. */
export function buildMergedSearch(a: SavedSearch, b: SavedSearch): SavedSearch {
  return {
    id: `merged-${a.id}-${b.id}`,
    title: `${a.title} + ${b.title}`,
    category: a.category,
    conditionLabel: a.conditionLabel === b.conditionLabel ? a.conditionLabel : "Any condition",
    maxPriceKrw: Math.max(a.maxPriceKrw, b.maxPriceKrw),
    newMatchesCount: a.newMatchesCount + b.newMatchesCount,
    paused: false,
    lastCheckedLabel: "Checked just now",
  };
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
