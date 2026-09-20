// Static data + pure derivation for the "Comparable Sales Distribution" hero widget.
//
// Every "variable" number on this page is a plain function of which comparison filters are
// switched on (a Set<FilterId> held in client state) applied to a fixed, hand-generated pool of
// 72 comparable sales. The pool itself is generated once, at module scope, by a tiny seeded
// xorshift32 generator — not `Math.random()` or `Date.now()` (both banned by the gate), and not
// hand-typed either: 72 rows of plausible, internally-correlated resale data would be tedious to
// author by hand and easy to get statistically incoherent. A fixed numeric seed run through a pure
// integer generator produces the same 72 rows on every render, every environment, forever — it is
// exactly as deterministic as a literal array, just shorter to read.

export type Grade = "C" | "B-" | "B" | "B+" | "A-" | "A" | "A+";

const GRADE_RANK: Record<Grade, number> = {
  "A+": 7,
  A: 6,
  "A-": 5,
  "B+": 4,
  B: 3,
  "B-": 2,
  C: 1,
};

export interface Comparable {
  id: string;
  price: number;
  grade: Grade;
  authenticTeak: boolean;
  originalEra: boolean;
  verifiedSeller: boolean;
  soldRecent: boolean;
  originalCushions: boolean;
}

// --- deterministic pool generation --------------------------------------------------------

/** xorshift32, seeded with a fixed literal. Same seed, same algorithm, same 72 rows every time. */
function makeRng(seed: number) {
  let s = seed >>> 0 || 1;
  return function next() {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

const rng = makeRng(916230477);

/** Average of three draws: a cheap Irwin-Hall approximation of a bell curve, range (0, 1). */
function bellish(): number {
  return (rng() + rng() + rng()) / 3;
}

function gradeFromQuality(q: number): Grade {
  if (q >= 0.86) return "A+";
  if (q >= 0.72) return "A";
  if (q >= 0.56) return "A-";
  if (q >= 0.4) return "B+";
  if (q >= 0.24) return "B";
  if (q >= 0.1) return "B-";
  return "C";
}

export const DOMAIN_MIN = 180;
export const DOMAIN_MAX = 780;
export const BIN_COUNT = 8;
export const BIN_WIDTH = (DOMAIN_MAX - DOMAIN_MIN) / BIN_COUNT; // 75

export const COMPARABLES: Comparable[] = Array.from({ length: 72 }, (_, i) => {
  // Quality index drives both the sale price and every boolean attribute below it, so filters
  // that select for higher quality also, correctly, pull the price distribution upward.
  const q = bellish();
  const noise = (rng() - 0.5) * BIN_WIDTH * 2.2;
  const rawPrice = DOMAIN_MIN + q * (DOMAIN_MAX - DOMAIN_MIN) + noise;
  const price = Math.round(Math.min(DOMAIN_MAX - 4, Math.max(DOMAIN_MIN + 4, rawPrice)));
  return {
    id: `c${i + 1}`,
    price,
    grade: gradeFromQuality(q),
    authenticTeak: rng() < 0.32 + q * 0.55,
    originalEra: rng() < 0.5,
    verifiedSeller: rng() < 0.38 + q * 0.4,
    soldRecent: rng() < 0.45,
    originalCushions: rng() < 0.28 + q * 0.45,
  };
});

export const TOTAL_COMPARABLES = COMPARABLES.length;

// --- the listing itself --------------------------------------------------------------------

export const ITEM = {
  name: "Danish-Style Teak Lounge Chair",
  detail: "Frame refinished · Solid teak · Mid-century form",
  category: "Furniture",
  askPrice: 460,
  appraisedValue: 720,
  matchPct: 92,
  conditionGrade: "A-" as Grade,
  sellerTrades: 187,
  sellerRating: 4.8,
  photoId: "1567016432779-094069958ea5",
  alt: "Mid-century wooden lounge chair with tan leather cushions, photographed against a plain studio background",
};

export function binIndexForPrice(price: number): number {
  const idx = Math.floor((price - DOMAIN_MIN) / BIN_WIDTH);
  return Math.min(BIN_COUNT - 1, Math.max(0, idx));
}

export const ITEM_BIN_INDEX = binIndexForPrice(ITEM.askPrice);

export function binRange(index: number): { lo: number; hi: number } {
  const lo = Math.round(DOMAIN_MIN + index * BIN_WIDTH);
  const hi = Math.round(DOMAIN_MIN + (index + 1) * BIN_WIDTH);
  return { lo, hi };
}

// --- filters ---------------------------------------------------------------------------------

export type FilterId =
  | "gradeAMinus"
  | "authenticTeak"
  | "originalEra"
  | "verifiedSeller"
  | "soldRecent"
  | "originalCushions";

export interface FilterDef {
  id: FilterId;
  label: string;
  predicate: (c: Comparable) => boolean;
}

export const FILTERS: FilterDef[] = [
  {
    id: "gradeAMinus",
    label: "Grade A- or better",
    predicate: (c) => GRADE_RANK[c.grade] >= GRADE_RANK["A-"],
  },
  {
    id: "authenticTeak",
    label: "Solid teak, verified",
    predicate: (c) => c.authenticTeak,
  },
  {
    id: "originalEra",
    label: "Original 1960s production",
    predicate: (c) => c.originalEra,
  },
  {
    id: "verifiedSeller",
    label: "Verified sellers only",
    predicate: (c) => c.verifiedSeller,
  },
  {
    id: "soldRecent",
    label: "Sold in the last 90 days",
    predicate: (c) => c.soldRecent,
  },
  {
    id: "originalCushions",
    label: "Original cushions, unrestored",
    predicate: (c) => c.originalCushions,
  },
];

export function applyFilters(active: Set<FilterId>): Comparable[] {
  const preds = FILTERS.filter((f) => active.has(f.id)).map((f) => f.predicate);
  if (preds.length === 0) return COMPARABLES;
  return COMPARABLES.filter((c) => preds.every((p) => p(c)));
}

export function histogramOf(records: Comparable[]): number[] {
  const counts = new Array(BIN_COUNT).fill(0);
  for (const r of records) counts[binIndexForPrice(r.price)]++;
  return counts;
}

export function percentileOf(records: Comparable[], price: number): number | null {
  if (records.length === 0) return null;
  const below = records.filter((r) => r.price <= price).length;
  return Math.round((below / records.length) * 100);
}

export function medianOf(records: Comparable[]): number | null {
  if (records.length === 0) return null;
  const sorted = [...records].map((r) => r.price).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function discountPct(price: number, appraised: number): number {
  return Math.round((1 - price / appraised) * 100);
}

// --- supporting copy -------------------------------------------------------------------------

export const AI_MATCH_TAGS: string[] = [
  "92% match to your saved “teak lounge chair” search",
  "Era match: solid teak, 1958–1965 joinery style",
  "Style match: same silhouette as 4 items in your list",
];

export interface ConditionPoint {
  label: string;
  pass: boolean;
  note?: string;
}

export const CONDITION_RUBRIC: ConditionPoint[] = [
  { label: "Frame free of cracks or splits", pass: true },
  { label: "All joints hold with no visible gaps", pass: true },
  { label: "No wobble on a flat, level floor", pass: true },
  { label: "Teak oil finish even across all faces", pass: true },
  { label: "Original hardware, no replacement fasteners", pass: true },
  { label: "No veneer lifting or delamination", pass: true },
  {
    label: "Cushion piping fully intact, no fraying",
    pass: false,
    note: "Light fraying on the rear seat piping — the one point holding this back from Grade A.",
  },
  { label: "No water rings or heat marks", pass: true },
  { label: "Legs original length, none trimmed", pass: true },
  { label: "No persistent odor after 48-hour air test", pass: true },
  { label: "Grain pattern consistent, no mismatched repairs", pass: true },
];

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I filtered down to verified sellers with original cushions before I ever messaged anyone. The pool dropped to nine chairs, and mine still sat at the 81st percentile.",
    name: "Owen Marsh",
    context: "Sold a Danish teak sideboard",
    rating: 5,
  },
  {
    quote:
      "Buyers used to ask me to justify the price against nothing. Now they filter the pool themselves and land on the same number I listed at.",
    name: "Renata Alves",
    context: "Sold 6 pieces of mid-century furniture",
    rating: 5,
  },
  {
    quote:
      "The distribution never hid the low end. I could see exactly how many chairs sold for less than mine, and why the ones that sold for more were all solid teak.",
    name: "Damian Cole",
    context: "Bought a lounge chair at the 74th percentile",
    rating: 4,
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "72", label: "Closed sales in the comparison pool behind every furniture listing" },
  { value: "88%", label: "Buyers who narrow the pool before messaging a seller" },
  { value: "2.4 days", label: "Median time to sold once a listing clears the 70th percentile" },
];
