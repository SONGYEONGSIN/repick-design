// Fixed, deterministic data. No Math.random / Date.now / new Date() anywhere in this route --
// every number the page shows is a literal here or a pure function of the four selections below
// (model.ts). Prices are USD, rounded to the nearest dollar in model.ts (never here).

export type CategoryId = "sneakers" | "watches" | "outerwear" | "cameras";
export type ConditionId = "like-new" | "excellent" | "good" | "fair";
export type AccessoriesId = "with-box" | "item-only";
export type PhotosId = "professional" | "clear" | "dim";
export type PayoutId = "cash" | "credit";

export type CategoryOption = {
  id: CategoryId;
  label: string;
  basePrice: number; // typical resale center price at Excellent / item-only / clear-photo baseline
  comparableBase: number; // comparable recent sales at full confidence
  tagA: string;
  tagB: string;
};

export const CATEGORIES: CategoryOption[] = [
  {
    id: "sneakers",
    label: "Sneakers",
    basePrice: 96,
    comparableBase: 184,
    tagA: "Matches 3 saved searches",
    tagB: "Size is this week's most-searched",
  },
  {
    id: "watches",
    label: "Watches",
    basePrice: 238,
    comparableBase: 97,
    tagA: "Box + papers lift watch resale ~8%",
    tagB: "Movement service history matters most",
  },
  {
    id: "outerwear",
    label: "Outerwear",
    basePrice: 132,
    comparableBase: 142,
    tagA: "Trending ahead of this week's cold front",
    tagB: "Shell condition drives most of the spread",
  },
  {
    id: "cameras",
    label: "Cameras",
    basePrice: 118,
    comparableBase: 68,
    tagA: "Shutter-count buyers pay a premium",
    tagB: "Working light meter confirmed in comps",
  },
];

export type ConditionOption = {
  id: ConditionId;
  label: string;
  hint: string;
  priceMult: number;
  confidenceDelta: number;
};

export const CONDITIONS: ConditionOption[] = [
  { id: "like-new", label: "Like new", hint: "No visible wear", priceMult: 1.15, confidenceDelta: 5 },
  { id: "excellent", label: "Excellent", hint: "Light, even wear", priceMult: 1.0, confidenceDelta: 3 },
  { id: "good", label: "Good", hint: "Visible wear, fully usable", priceMult: 0.82, confidenceDelta: 0 },
  { id: "fair", label: "Fair", hint: "Heavy wear or flaws", priceMult: 0.62, confidenceDelta: -8 },
];

export type AccessoriesOption = {
  id: AccessoriesId;
  label: string;
  priceMult: number;
};

export const ACCESSORIES: AccessoriesOption[] = [
  { id: "with-box", label: "Original box & papers", priceMult: 1.08 },
  { id: "item-only", label: "Item only", priceMult: 1.0 },
];

export type PhotosOption = {
  id: PhotosId;
  label: string;
  confidenceDelta: number;
  comparableFactor: number;
};

export const PHOTOS: PhotosOption[] = [
  { id: "professional", label: "Studio / professional", confidenceDelta: 18, comparableFactor: 1.0 },
  { id: "clear", label: "Clear phone photos", confidenceDelta: 6, comparableFactor: 1.0 },
  { id: "dim", label: "Dim or blurry", confidenceDelta: -20, comparableFactor: 0.55 },
];

export const DEFAULT_CATEGORY: CategoryId = "sneakers";
export const DEFAULT_CONDITION: ConditionId = "excellent";
export const DEFAULT_ACCESSORIES: AccessoriesId = "item-only";
export const DEFAULT_PHOTOS: PhotosId = "clear";
export const DEFAULT_PAYOUT: PayoutId = "cash";

// Trade-credit rate: deterministic, literal -- credit is always 70% of the cash center price.
export const TRADE_CREDIT_RATE = 0.7;

export type MatchedListing = {
  id: string;
  title: string;
  category: string;
  photoId: string; // images.unsplash.com/photo-<id>, fixed real photo already used elsewhere in this catalog
  alt: string;
  matchPct: number;
  grade: string;
  verified: boolean;
  discountPct: number;
  retailPrice: number;
  soldPrice: number;
  reason: string;
};

export const MATCHED_LISTINGS: MatchedListing[] = [
  {
    id: "m-sneaker",
    title: "Nocturne Trail Sneakers",
    category: "Sneakers · US 9.5",
    photoId: "1491553895911-0055eca6402d",
    alt: "A pair of worn trail running sneakers photographed on a plain background",
    matchPct: 94,
    grade: "Excellent",
    verified: true,
    discountPct: 32,
    retailPrice: 185,
    soldPrice: 126,
    reason: "Matched on size, brand, and this buyer's saved search for trail soles.",
  },
  {
    id: "m-watch",
    title: "Meridian Chrono Watch",
    category: "Watches · 38mm steel",
    photoId: "1495121605193-b116b5b09a56",
    alt: "A steel chronograph wristwatch with a metal bracelet resting on a flat surface",
    matchPct: 89,
    grade: "Like New",
    verified: true,
    discountPct: 29,
    retailPrice: 410,
    soldPrice: 291,
    reason: "Box and papers confirmed against the serial on file; movement serviced in 2025.",
  },
  {
    id: "m-jacket",
    title: "Fieldwork Shell Jacket",
    category: "Outerwear · Size M",
    photoId: "1500648767791-00dcc994a43e",
    alt: "A technical outdoor shell jacket laid flat against a neutral backdrop",
    matchPct: 91,
    grade: "Good",
    verified: false,
    discountPct: 27,
    retailPrice: 240,
    soldPrice: 175,
    reason: "Shell seams and zippers checked in 14 close-up comparison photos.",
  },
];
