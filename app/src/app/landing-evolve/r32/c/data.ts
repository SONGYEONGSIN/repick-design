// Deterministic sample data for the threshold-slider + pictogram-array device.
// No Math.random / Date.now anywhere: every value below comes from fixed
// arithmetic over the index `i`, so server and client always compute the
// identical 100-item array and hydration can never mismatch.

export type SampleListing = {
  id: number;
  price: number; // USD
  grade: number; // 1 (fair) – 5 (excellent) condition grade
  trust: number; // 0-100 seller trust score
  match: number; // 0-100 AI match percent (not used by the device filter,
  // kept so the dataset can also back an "average match" stat if needed)
};

function buildSampleListings(): SampleListing[] {
  const items: SampleListing[] = [];
  for (let i = 0; i < 100; i++) {
    const price = 18 + ((37 * i) % 182); // 18 – 199
    const grade = 1 + ((7 * i) % 5); // 1 – 5
    const trust = 42 + ((53 * i) % 58); // 42 – 99
    const match = 58 + ((29 * i) % 42); // 58 – 99
    items.push({ id: i, price, grade, trust, match });
  }
  return items;
}

export const SAMPLE_LISTINGS: SampleListing[] = buildSampleListings();
export const SAMPLE_TOTAL = SAMPLE_LISTINGS.length; // 100

export const GRADE_LABELS: Record<number, string> = {
  1: 'C',
  2: 'B-',
  3: 'B+',
  4: 'A-',
  5: 'A+',
};

export type Thresholds = {
  maxPrice: number;
  minGrade: number;
  minTrust: number;
};

export const DEFAULT_THRESHOLDS: Thresholds = {
  maxPrice: 120,
  minGrade: 3,
  minTrust: 70,
};

export const THRESHOLD_LIMITS = {
  maxPrice: { min: 20, max: 200, step: 5 },
  minGrade: { min: 1, max: 5, step: 1 },
  minTrust: { min: 40, max: 100, step: 5 },
};

/** The single filter function every live count/percentage/array state in the
 * page shares — nothing downstream ever re-derives this differently. */
export function qualifiesListing(listing: SampleListing, t: Thresholds): boolean {
  return listing.price <= t.maxPrice && listing.grade >= t.minGrade && listing.trust >= t.minTrust;
}

export type DerivedStats = {
  count: number;
  percent: number;
  avgDiscount: number;
  avgTrust: number;
};

/** One hardcoded, deterministic markdown-off curve: each sample listing's
 * "discount" is derived from its own grade + trust (better condition/trust
 * sellers price closer to full value), so the average-discount stat below
 * is a real aggregate over real per-item numbers, not a separate guess. */
function discountFor(listing: SampleListing): number {
  return Math.max(10, 58 - listing.grade * 4 - Math.floor(listing.trust / 5));
}

export function computeDerivedStats(thresholds: Thresholds): DerivedStats {
  const qualifying = SAMPLE_LISTINGS.filter((l) => qualifiesListing(l, thresholds));
  const count = qualifying.length;
  const percent = Math.round((count / SAMPLE_TOTAL) * 100);
  const avgDiscount = count
    ? Math.round(qualifying.reduce((sum, l) => sum + discountFor(l), 0) / count)
    : 0;
  const avgTrust = count ? Math.round(qualifying.reduce((sum, l) => sum + l.trust, 0) / count) : 0;
  return { count, percent, avgDiscount, avgTrust };
}

// ---------------------------------------------------------------------------
// Featured / "rich card" listings for the product-preview section. A smaller,
// handpicked set distinct from the 100-item sample pool above.

export type Category = 'Outerwear' | 'Footwear' | 'Bags';
export const CATEGORIES: readonly ('All' | Category)[] = ['All', 'Outerwear', 'Footwear', 'Bags'];

type RawFeatured = {
  id: string;
  name: string;
  category: Category;
  matchPercent: number;
  grade: string;
  verified: boolean;
  originalPrice: number;
  salePrice: number;
  reasoning: string;
};

const RAW_FEATURED: RawFeatured[] = [
  {
    id: 'overcoat',
    name: 'Merino Wool Overcoat',
    category: 'Outerwear',
    matchPercent: 94,
    grade: 'A-',
    verified: true,
    originalPrice: 340,
    salePrice: 211,
    reasoning: 'Matches your saved size M and recent cold-weather searches.',
  },
  {
    id: 'bomber',
    name: 'Shearling Bomber Jacket',
    category: 'Outerwear',
    matchPercent: 88,
    grade: 'B+',
    verified: true,
    originalPrice: 420,
    salePrice: 235,
    reasoning: 'Close to three jackets you viewed earlier this week.',
  },
  {
    id: 'chelsea',
    name: 'Leather Chelsea Boots',
    category: 'Footwear',
    matchPercent: 91,
    grade: 'A',
    verified: true,
    originalPrice: 260,
    salePrice: 169,
    reasoning: 'Same size and brand as your last two footwear saves.',
  },
  {
    id: 'trail',
    name: 'Trail Running Sneakers',
    category: 'Footwear',
    matchPercent: 83,
    grade: 'B+',
    verified: false,
    originalPrice: 180,
    salePrice: 122,
    reasoning: 'New seller, but grading and photos line up with your fit profile.',
  },
  {
    id: 'weekender',
    name: 'Canvas Weekender Bag',
    category: 'Bags',
    matchPercent: 90,
    grade: 'A-',
    verified: true,
    originalPrice: 210,
    salePrice: 124,
    reasoning: 'Matches the travel-bag category you shortlisted.',
  },
  {
    id: 'tote',
    name: 'Structured Tote',
    category: 'Bags',
    matchPercent: 86,
    grade: 'B+',
    verified: false,
    originalPrice: 150,
    salePrice: 105,
    reasoning: 'Condition grade clears your minimum by two full tiers.',
  },
];

export type FeaturedListing = RawFeatured & { discountPercent: number };

export const FEATURED_LISTINGS: FeaturedListing[] = RAW_FEATURED.map((item) => ({
  ...item,
  discountPercent: Math.round((1 - item.salePrice / item.originalPrice) * 100),
}));

export const HERO_PROOF_LISTING = FEATURED_LISTINGS[0];

// ---------------------------------------------------------------------------
// Static social proof (not tied to the slider state).

export const PROOF_STATS: { label: string; value: string }[] = [
  { label: 'Listings graded to date', value: '128,400' },
  { label: 'Median grading accuracy', value: '96%' },
  { label: 'Resale categories tracked', value: '64' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      'The condition grade matched what arrived, down to the scuff on the left heel. First time a resale grade has meant anything.',
    name: 'Priya N.',
    role: 'Verified buyer',
  },
  {
    quote:
      'I set a trust score once on my profile and buyers stopped asking if the jacket was authentic.',
    name: 'Marcus T.',
    role: 'Seller, 41 listings',
  },
  {
    quote: 'Three thresholds told me more in ten seconds than a dozen category filters ever did.',
    name: 'Elena R.',
    role: 'Verified buyer',
  },
];
