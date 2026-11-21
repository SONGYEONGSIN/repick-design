// app/src/app/landing-evolve/r36/b/data.ts
//
// Fixed, deterministic content for this route. Nothing here is random or
// date-derived — every number a viewer sees is either one of these literals
// or a pure function of them (see score-math.ts).

export const CONCERNS = [
  { id: "authenticity", label: "Authenticity", hint: "verified against maker records" },
  { id: "condition", label: "Condition accuracy", hint: "grade matches the real wear" },
  { id: "shipping", label: "Ship speed", hint: "dispatched inside the promised window" },
  { id: "seller", label: "Seller reliability", hint: "seller's dispute-free track record" },
  { id: "price", label: "Price fairness", hint: "priced inside the fair-market range" },
] as const;

export type ConcernId = (typeof CONCERNS)[number]["id"];

export type Scores = Record<ConcernId, number>;

export interface Listing {
  id: string;
  title: string;
  category: string;
  photoId: string;
  price: number;
  originalPrice: number;
  grade: "Good" | "Very good" | "Excellent";
  verified: boolean;
  daysListed: number;
  scores: Scores;
}

/** The threshold a concern's score must clear to count as "covered". */
export const COVER_THRESHOLD = 75;

/**
 * The listing the hero's own ring cluster is inspecting. Kept separate from
 * the browsable grid below so the hero reads as "here is one real item,
 * examined concern by concern" rather than just another catalog tile.
 */
export const FEATURED_LISTING: Listing = {
  id: "featured-leica",
  title: "Leica M6 35mm camera",
  category: "Cameras",
  photoId: "1495121605193-b116b5b09a56",
  price: 2300,
  originalPrice: 2950,
  grade: "Excellent",
  verified: true,
  daysListed: 9,
  scores: {
    authenticity: 97,
    condition: 88,
    shipping: 73,
    seller: 91,
    price: 68,
  },
};

/**
 * The browsable grid. Scores deliberately straddle COVER_THRESHOLD in
 * different places on every row, so toggling concerns and switching sort
 * order both visibly reorder and re-badge this list rather than leaving it
 * static.
 */
export const GRID_LISTINGS: Listing[] = [
  {
    id: "chair",
    title: "Mid-century lounge chair",
    category: "Furniture",
    photoId: "1495121605193-b116b5b09a56",
    price: 420,
    originalPrice: 650,
    grade: "Excellent",
    verified: true,
    daysListed: 3,
    scores: { authenticity: 94, condition: 81, shipping: 69, seller: 88, price: 77 },
  },
  {
    id: "watch",
    title: "Automatic chronograph watch",
    category: "Watches",
    photoId: "1524805444758-089113d48a6d",
    price: 610,
    originalPrice: 900,
    grade: "Very good",
    verified: true,
    daysListed: 11,
    scores: { authenticity: 98, condition: 90, shipping: 77, seller: 95, price: 64 },
  },
  {
    id: "jacket",
    title: "Leather field jacket",
    category: "Apparel",
    photoId: "1441986300917-64674bd600d8",
    price: 145,
    originalPrice: 220,
    grade: "Good",
    verified: false,
    daysListed: 1,
    scores: { authenticity: 86, condition: 72, shipping: 81, seller: 79, price: 90 },
  },
  {
    id: "cabinet",
    title: "Walnut record cabinet",
    category: "Furniture",
    photoId: "1543076447-215ad9ba6923",
    price: 380,
    originalPrice: 540,
    grade: "Excellent",
    verified: true,
    daysListed: 22,
    scores: { authenticity: 91, condition: 85, shipping: 58, seller: 83, price: 73 },
  },
  {
    id: "lamp",
    title: "Cast-iron desk lamp",
    category: "Lighting",
    photoId: "1523275335684-37898b6baf30",
    price: 96,
    originalPrice: 140,
    grade: "Very good",
    verified: true,
    daysListed: 6,
    scores: { authenticity: 89, condition: 93, shipping: 90, seller: 86, price: 85 },
  },
];

/** The two items the hero shows beside the ring cluster, pulled from the grid above. */
export const HERO_PROOF_IDS = ["watch", "lamp"] as const;

export const SELLER_QUOTES = [
  {
    name: "Priya N.",
    role: "bought the chronograph watch",
    quote:
      "I only cared about authenticity and the seller's record. Turning the other three off didn't change the photo or the price — just which ring counted.",
  },
  {
    name: "Owen F.",
    role: "bought the record cabinet",
    quote:
      "Shipping speed was the one I cared least about, and it was also the lowest ring on that listing. Seeing them side by side made that an easy trade to accept.",
  },
  {
    name: "Mara D.",
    role: "returned a non-match",
    quote:
      "Price fairness was dim on the item I almost bought. I'd skipped past it assuming everything was covered — now I check which rings are actually lit.",
  },
] as const;

export const SOCIAL_STATS = [
  { value: "92%", label: "of buyers turn at least one concern off before checking out" },
  { value: "0", label: "blended single scores anywhere on this page" },
] as const;
