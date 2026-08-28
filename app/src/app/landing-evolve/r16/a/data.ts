// Static content for the Q2 2026 self-audit landing (r16 / candidate a).
// All figures are fixed, hand-authored fixtures — no Math.random/Date.now anywhere,
// so the page renders identically on server and client.

export type AuditStatus = "worse" | "better";

export interface AuditCategory {
  id: string;
  rank: number;
  label: string;
  description: string;
  thisQuarter: number;
  lastQuarter: number;
  resolutionRate: number; // percent of flagged cases corrected or refunded
  status: AuditStatus;
  whatChanged: string;
}

// Sorted by potential harm to a buyer's trust, not by incident count — the category
// with the fewest cases can lead if a single incident there costs more trust than a
// hundred incidents somewhere smaller. The rationale is printed verbatim on the page.
export const AUDIT_CATEGORIES: AuditCategory[] = [
  {
    id: "wrong-item",
    rank: 1,
    label: "Wrong item shipped",
    description:
      "The buyer received a different item than the one repick confirmed as matched — not a variant, a different product.",
    thisQuarter: 6,
    lastQuarter: 9,
    resolutionRate: 100,
    status: "better",
    whatChanged:
      "Photo-hash verification now blocks a listing from going live until the seller's upload matches the description at the SKU level.",
  },
  {
    id: "fake-verification",
    rank: 2,
    label: "Verification badge shown in error",
    description:
      "A seller-verification badge rendered on a listing before that seller's identity documents had actually cleared review.",
    thisQuarter: 11,
    lastQuarter: 4,
    resolutionRate: 82,
    status: "worse",
    whatChanged:
      "The badge now renders only after a second, independent document check — not after the first pass alone.",
  },
  {
    id: "grade-overstated",
    rank: 3,
    label: "Condition grade overstated by two or more grades",
    description:
      "The AI condition grade — for example “Excellent” — sat two or more grades above what buyers reported on arrival.",
    thisQuarter: 34,
    lastQuarter: 41,
    resolutionRate: 91,
    status: "better",
    whatChanged:
      "The grading model now folds buyer-submitted arrival photos back into training every week instead of once a quarter.",
  },
  {
    id: "size-mismatch",
    rank: 4,
    label: "Size or measurement mismatch",
    description:
      "Listed measurements didn't match the item on arrival, most often in outerwear and footwear listings.",
    thisQuarter: 58,
    lastQuarter: 49,
    resolutionRate: 74,
    status: "worse",
    whatChanged:
      "Unresolved going into this quarter. A required measurement photo at listing time ships next quarter.",
  },
  {
    id: "match-overconfident",
    rank: 5,
    label: "Match score shown as overconfident",
    description:
      "Buyers rejected an item repick had scored above 90% match, most often on color or material accuracy.",
    thisQuarter: 142,
    lastQuarter: 168,
    resolutionRate: 63,
    status: "better",
    whatChanged:
      "Match score now discounts listings with fewer than three seller photos instead of assuming average fidelity.",
  },
];

export const SORT_RATIONALE =
  "Ranked by potential harm to a buyer's trust, not by how often it happened — a rare wrong-item shipment costs more trust than a common size mismatch, so it leads regardless of count.";

export const MEASUREMENT_LIMIT =
  "We can't honestly estimate how many buyers we lost to a bad match before we caught it. Churn from an error nobody flagged doesn't show up as a support ticket, so we don't publish a number here that we can't stand behind.";

export type ListingCategory = "coat" | "bag" | "lamp" | "dresser";

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  matchPercent: number;
  grade: string;
  priceNow: number;
  priceWas: number;
  verified: boolean;
}

export const LISTINGS: Listing[] = [
  {
    id: "coat",
    title: "Herringbone wool overcoat",
    category: "coat",
    matchPercent: 96,
    grade: "Excellent",
    priceNow: 184,
    priceWas: 310,
    verified: true,
  },
  {
    id: "bag",
    title: "Leather weekender bag",
    category: "bag",
    matchPercent: 91,
    grade: "Very good",
    priceNow: 96,
    priceWas: 150,
    verified: true,
  },
  {
    id: "lamp",
    title: "Ceramic table lamp, set of two",
    category: "lamp",
    matchPercent: 88,
    grade: "Good",
    priceNow: 58,
    priceWas: 95,
    verified: true,
  },
  {
    id: "dresser",
    title: "Mid-century oak dresser",
    category: "dresser",
    matchPercent: 94,
    grade: "Excellent",
    priceNow: 410,
    priceWas: 650,
    verified: true,
  },
];

export function discountPercent(priceNow: number, priceWas: number): number {
  return Math.round((1 - priceNow / priceWas) * 100);
}

export interface Quote {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export const QUOTES: Quote[] = [
  {
    id: "q1",
    quote:
      "They published the size-mismatch number going up, not just the ones going down. That's the report I keep reading.",
    name: "Priya N.",
    role: "Buyer since 2024",
  },
  {
    id: "q2",
    quote:
      "My badge was pulled for three days during the identity re-check. Annoying in the moment, correct in hindsight.",
    name: "Marcus D.",
    role: "Verified seller",
  },
  {
    id: "q3",
    quote:
      "Most platforms show me a score. This one shows me where the score was wrong last quarter. I trust the score more for it.",
    name: "Elena V.",
    role: "Buyer since 2025",
  },
];

export const STAT_TOTAL_INCIDENTS = AUDIT_CATEGORIES.reduce(
  (sum, c) => sum + c.thisQuarter,
  0,
);
export const STAT_TOTAL_LAST_QUARTER = AUDIT_CATEGORIES.reduce(
  (sum, c) => sum + c.lastQuarter,
  0,
);
