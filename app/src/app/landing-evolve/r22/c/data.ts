// Static, hand-authored listing catalog + pure derivation helpers for the compare console.
// No randomness anywhere: which cell wins a row, and which row order "sort by biggest gap"
// produces, are both deterministic functions of the fixed data below and the visitor's own
// (also deterministic, state-only) selection.

export type Direction = "min" | "max";

export interface Listing {
  id: string;
  title: string;
  seller: string;
  photoId: string; // images.unsplash.com/photo-<fixed id>
  alt: string;
  price: number;
  originalPrice: number;
  conditionGrade: string;
  gradeScore: number; // ordinal, higher = better condition, used for comparison only
  verificationLabel: string;
  verificationRank: number; // ordinal, higher = more thoroughly checked
  etaDays: number;
  matchPct: number;
  matchTags: string[];
}

export function unsplashUrl(photoId: string, width: number): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=70`;
}

export function discountPct(originalPrice: number, price: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers, EU 42",
    seller: "SoleStreet Vintage",
    photoId: "1543076447-215ad9ba6923",
    alt: "Pair of classic white low-top sneakers laid on a plain surface",
    price: 68,
    originalPrice: 120,
    conditionGrade: "A-",
    gradeScore: 90,
    verificationLabel: "Verified",
    verificationRank: 2,
    etaDays: 3,
    matchPct: 91,
    matchTags: [
      "Sizing matched against your saved fit profile",
      "Sole wear confirmed within the listed grade",
      "Priced 8% under comparable Grade A- sales",
    ],
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots, Verified",
    seller: "Northbend Trading Co.",
    photoId: "1608256246200-53e635b5b65f",
    alt: "Pair of suede Chelsea boots side by side on a plain surface",
    price: 145,
    originalPrice: 210,
    conditionGrade: "A",
    gradeScore: 95,
    verificationLabel: "Verified + Authenticated",
    verificationRank: 3,
    etaDays: 5,
    matchPct: 97,
    matchTags: [
      "Authenticator confirmed maker's stamp and stitching",
      "Style matches 3 items already in your saved list",
      "No resoling detected across inspection photos",
    ],
  },
  {
    id: "watch",
    title: "Oyster Perpetual 36, Pre-Owned",
    seller: "Meridian Timepiece Co.",
    photoId: "1523275335684-37898b6baf30",
    alt: "Stainless steel wristwatch worn on a wrist",
    price: 5980,
    originalPrice: 6900,
    conditionGrade: "A",
    gradeScore: 95,
    verificationLabel: "Verified + Authenticated",
    verificationRank: 3,
    etaDays: 7,
    matchPct: 95,
    matchTags: [
      "Movement timing verified within factory spec",
      "Papers and case serial cross-checked",
      "Within your saved price ceiling for this reference",
    ],
  },
  {
    id: "camera",
    title: "Leica M6 TTL, 35mm Summicron",
    seller: "FocalTradePost",
    photoId: "1495121605193-b116b5b09a56",
    alt: "Leica M6 rangefinder film camera with 35mm lens, resting on a wood surface",
    price: 2140,
    originalPrice: 2650,
    conditionGrade: "A-",
    gradeScore: 90,
    verificationLabel: "Verified",
    verificationRank: 2,
    etaDays: 4,
    matchPct: 93,
    matchTags: [
      "Shutter speeds tested across all 6 stages",
      "Lens glass free of fungus or haze",
      "Seller history: 4 years on repick, 0 disputes",
    ],
  },
];

export const MAX_COMPARE = 3;

export interface Criterion {
  id: string;
  label: string;
  direction: Direction;
  helper: string; // sr-only-friendly note on which direction wins, read alongside the label
  getValue: (l: Listing) => number;
  format: (l: Listing) => string;
  sub: (l: Listing) => string;
}

export const CRITERIA: Criterion[] = [
  {
    id: "price",
    label: "Price",
    direction: "min",
    helper: "Lower wins",
    getValue: (l) => l.price,
    format: (l) => `$${l.price.toLocaleString()}`,
    sub: (l) => `${discountPct(l.originalPrice, l.price)}% below retail`,
  },
  {
    id: "grade",
    label: "Condition grade",
    direction: "max",
    helper: "Higher grade wins",
    getValue: (l) => l.gradeScore,
    format: (l) => l.conditionGrade,
    sub: () => "12-point inspection",
  },
  {
    id: "verification",
    label: "Verification",
    direction: "max",
    helper: "More thorough check wins",
    getValue: (l) => l.verificationRank,
    format: (l) => l.verificationLabel,
    sub: () => "Seller identity checked",
  },
  {
    id: "delivery",
    label: "Est. delivery",
    direction: "min",
    helper: "Fewer days wins",
    getValue: (l) => l.etaDays,
    format: (l) => `${l.etaDays} biz days`,
    sub: () => "To your door",
  },
  {
    id: "match",
    label: "AI match",
    direction: "max",
    helper: "Higher confidence wins",
    getValue: (l) => l.matchPct,
    format: (l) => `${l.matchPct}%`,
    sub: () => "Vs. your saved preferences",
  },
];

/** Every listing id tied for the most favorable value in a row — empty when fewer than 2 columns. */
export function computeWinnerIds(criterion: Criterion, listings: Listing[]): string[] {
  if (listings.length < 2) return [];
  const values = listings.map((l) => ({ id: l.id, v: criterion.getValue(l) }));
  const best =
    criterion.direction === "min"
      ? Math.min(...values.map((v) => v.v))
      : Math.max(...values.map((v) => v.v));
  return values.filter((v) => v.v === best).map((v) => v.id);
}

/** Normalized 0-1 spread of a row's values across the current listings, for the gap sort. */
function gapScore(criterion: Criterion, listings: Listing[]): number {
  if (listings.length < 2) return 0;
  const values = listings.map((l) => criterion.getValue(l));
  const max = Math.max(...values);
  const min = Math.min(...values);
  return max === 0 ? 0 : (max - min) / max;
}

/** Pure, deterministic reorder — Array.sort is stable, and every input here is fixed data. */
export function orderCriteria(
  criteria: Criterion[],
  listings: Listing[],
  sortByGap: boolean,
): Criterion[] {
  if (!sortByGap || listings.length < 2) return criteria;
  return [...criteria].sort((a, b) => gapScore(b, listings) - gapScore(a, listings));
}

export interface ValuePillar {
  title: string;
  body: string;
}

export const VALUE_PILLARS: ValuePillar[] = [
  {
    title: "AI matching engine",
    body:
      "Every listing is scored against your saved size, style and price preferences the moment it's posted, not after you search for it.",
  },
  {
    title: "12-point condition grading",
    body:
      "A trained model and a human reviewer independently grade wear, function and completeness, so the letter grade in a table cell means the same thing on every listing.",
  },
  {
    title: "Seller verification",
    body:
      "Identity, sale history and, for higher-value items, an authenticator's sign-off are all checked before a listing can carry the Verified label at all.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I had the boots and the camera both open, and the table just told me the camera was the safer buy on grade and verification. I didn't have to build that comparison myself.",
    name: "Renata Osei",
    role: "Buyer, 19 purchases",
  },
  {
    quote:
      "Adding a third listing to compare didn't reset anything — the two I'd already picked stayed put and the table just grew a column. Small thing, but it's what kept me on the page.",
    name: "Marcus Feldt",
    role: "Buyer, first-time on repick",
  },
  {
    quote:
      "Watching the winning cell move from my item to a competitor's as I added it to the table was the most honest comparison a marketplace has shown me.",
    name: "Iida Salonen",
    role: "Seller, camera & optics",
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "2.1M", label: "listings scored for AI match to date" },
  { value: "96.4%", label: "score-to-inspection agreement on graded items" },
  { value: "3", label: "listings a visitor can hold in one comparison" },
];
