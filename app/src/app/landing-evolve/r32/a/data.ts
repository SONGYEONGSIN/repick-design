// Static, deterministic data for the Repick "Sneakers" comparable-sales demo.
// Nothing here is randomized or time-based: every number is fixed so server and
// client render identically and the box-plot math is reproducible.

export type Grade = 'like-new' | 'good' | 'fair';

export const GRADE_ORDER: Grade[] = ['like-new', 'good', 'fair'];

export const GRADE_LABELS: Record<Grade, string> = {
  'like-new': 'Like New',
  good: 'Good',
  fair: 'Fair',
};

export interface SoldListing {
  id: string;
  price: number;
  grade: Grade;
}

// A fixed pool of 60 recorded sold listings for the "Sneakers" category,
// split across three condition grades. Prices are sorted ascending within
// each grade on purpose -- it keeps the filtering/quantile math easy to
// hand-check and the result is still deterministic either way.
const LIKE_NEW_PRICES = [
  185, 198, 205, 210, 215, 222, 230, 238, 245, 252, 260, 268, 275, 285, 298,
  310, 325, 340, 365, 395,
];
const GOOD_PRICES = [
  95, 102, 110, 118, 125, 132, 140, 148, 155, 162, 170, 178, 185, 192, 200,
  208, 218, 230, 245, 262,
];
const FAIR_PRICES = [
  42, 48, 55, 62, 68, 75, 82, 88, 95, 102, 108, 115, 122, 130, 138, 146, 155,
  162, 168, 175,
];

function toListings(prices: number[], grade: Grade, prefix: string): SoldListing[] {
  return prices.map((price, index) => ({ id: `${prefix}-${index}`, price, grade }));
}

export const SOLD_LISTINGS: SoldListing[] = [
  ...toListings(LIKE_NEW_PRICES, 'like-new', 'ln'),
  ...toListings(GOOD_PRICES, 'good', 'gd'),
  ...toListings(FAIR_PRICES, 'fair', 'fr'),
];

export const PRICE_DOMAIN = { min: 40, max: 420 };
export const DEFAULT_RANGE = { min: 100, max: 300 };
export const SLIDER_STEP = 5;
export const MIN_GAP = 20;

export interface BoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  count: number;
}

/** Linear-interpolation percentile over an already-sorted array. */
export function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight;
}

export function computeBoxStats(prices: number[]): BoxStats | null {
  if (prices.length === 0) return null;
  const sorted = [...prices].sort((a, b) => a - b);
  return {
    min: sorted[0],
    q1: Math.round(quantile(sorted, 0.25)),
    median: Math.round(quantile(sorted, 0.5)),
    q3: Math.round(quantile(sorted, 0.75)),
    max: sorted[sorted.length - 1],
    count: sorted.length,
  };
}

export function filteredPrices(grade: Grade, min: number, max: number): number[] {
  return SOLD_LISTINGS.filter(
    (l) => l.grade === grade && l.price >= min && l.price <= max,
  )
    .map((l) => l.price)
    .sort((a, b) => a - b);
}

/** Share of a sorted array at or below `value`, as a whole percentage. */
export function percentileRank(sorted: number[], value: number): number {
  if (sorted.length === 0) return 0;
  const countBelowOrEqual = sorted.filter((p) => p <= value).length;
  return Math.round((countBelowOrEqual / sorted.length) * 100);
}

/** Clamp + round a price to a 0-100 position on PRICE_DOMAIN, for CSS left/width. */
export function toDomainPercent(price: number): number {
  const { min, max } = PRICE_DOMAIN;
  const pct = ((price - min) / (max - min)) * 100;
  return Math.round(Math.max(0, Math.min(100, pct)) * 100) / 100;
}

export interface ExampleListing {
  name: string;
  grade: Grade;
  price: number;
  retailPrice: number;
  matchPercent: number;
  sellerLabel: string;
  sellerNote: string;
}

export const EXAMPLE_LISTING: ExampleListing = {
  name: 'Trail Runner — Low, Size 10',
  grade: 'good',
  price: 182,
  retailPrice: 240,
  matchPercent: 96,
  sellerLabel: 'Verified seller',
  sellerNote: 'ID checked · 40 past sales',
};

export function discountPercent(retail: number, price: number): number {
  return Math.round(((retail - price) / retail) * 100);
}

export interface PreviewItem {
  id: string;
  name: string;
  grade: Grade;
  matchPercent: number;
  matchTag: string;
  matchReasons: string[];
  retailPrice: number;
  price: number;
  sellerLabel: string;
  tone: 'ink' | 'sky' | 'stone';
}

export const PREVIEW_ITEMS: PreviewItem[] = [
  {
    id: 'p1',
    name: 'Trail Runner — Mid, Size 11',
    grade: 'like-new',
    matchPercent: 91,
    matchTag: 'Close to your saved silhouette',
    matchReasons: [
      'Mid-top profile matches your last 3 saves',
      'Size 11 — your stored fit',
      'Original laces and insole confirmed',
    ],
    retailPrice: 260,
    price: 231,
    sellerLabel: 'Verified seller',
    tone: 'ink',
  },
  {
    id: 'p2',
    name: 'Classic Low, Size 9',
    grade: 'good',
    matchPercent: 94,
    matchTag: 'Matches your size and colorway history',
    matchReasons: [
      'Size 9 — exact match',
      'Colorway seen in 4 of your recent views',
      'Sole wear within Good-grade tolerance',
    ],
    retailPrice: 220,
    price: 171,
    sellerLabel: 'Verified seller',
    tone: 'sky',
  },
  {
    id: 'p3',
    name: 'Street Slip-On, Size 8',
    grade: 'fair',
    matchPercent: 88,
    matchTag: 'Budget range you searched last week',
    matchReasons: [
      'Falls inside your saved price ceiling',
      'Size 8 — exact match',
      'Visible crease noted and priced in',
    ],
    retailPrice: 150,
    price: 96,
    sellerLabel: 'Verified seller · top rated',
    tone: 'stone',
  },
  {
    id: 'p4',
    name: 'Court Classic, Size 10.5',
    grade: 'like-new',
    matchPercent: 97,
    matchTag: 'Near-exact fit and condition target',
    matchReasons: [
      'Size 10.5 — exact match',
      'Box and tags included',
      'Single prior owner, low wear count',
    ],
    retailPrice: 300,
    price: 258,
    sellerLabel: 'Verified seller',
    tone: 'ink',
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'I could see the whole Good-grade price band before I offered, not just the one listing price. Made the decision easy.',
    name: 'Maya R.',
    role: 'Buyer, 6 purchases',
    initials: 'MR',
  },
  {
    quote:
      'My condition grade matched the independent inspection exactly. That consistency is what got me listing more here.',
    name: 'Devon K.',
    role: 'Seller, verified',
    initials: 'DK',
  },
  {
    quote:
      'The distribution view stopped me from lowballing a seller on a listing that was already priced below its own Fair-grade median.',
    name: 'Priya S.',
    role: 'Buyer, 3 purchases',
    initials: 'PS',
  },
];

export interface StatItem {
  value: string;
  label: string;
}

export const STAT_ITEMS: StatItem[] = [
  { value: '60', label: 'comparable Sneaker sales behind this chart' },
  { value: '98%', label: 'grade agreement, AI vs. human inspectors' },
  { value: '3', label: 'condition grades scored on every sale' },
];
