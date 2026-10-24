import type { ChipId } from './reorder-math';

// Dark theme, violet accent family assigned for this round (not the catalog
// stock #6E56CF). Base accent is reserved for borders, large text (>=24px,
// or >=19px bold) and fills behind white text; the tint carries small text,
// icons and focus rings; the fill shade is a darker step reserved for
// behind white button labels. See candidates/a.md for the measured
// contrast ratios behind each of these four roles.
export const COLORS = {
  bg: '#0B0B0F',
  surface: '#16131F',
  surfaceLine: '#2A2438',
  fg: '#FFFFFF',
  muted: '#A1A1AA',
  accent: '#8B5CF6',
  accentTint: '#C4B5FD',
  accentFill: '#6D28D9',
} as const;

export type IconKey = 'jacket' | 'keyboard' | 'bag';

export interface Product {
  id: string;
  title: string;
  category: string;
  conditionGrade: string;
  verified: boolean;
  priceBefore: number;
  priceAfter: number;
  /** AI-match-reasoning tag — one line, changes meaning as weights shift. */
  reasoningByLeadChip: Record<ChipId, string>;
  iconKey: IconKey;
  /** Per-criterion score, 0-100, independent of the visitor's current weighting. */
  scores: Record<ChipId, number>;
}

export function discountPercent(product: Product): number {
  return Math.round(((product.priceBefore - product.priceAfter) / product.priceBefore) * 100);
}

/**
 * Three real repick listings. Every number below (price, grade, verification,
 * the four per-criterion scores) is fixed, real catalog data — nothing here
 * is computed from the visitor's chip order. What IS computed live is each
 * product's match percent and its position in the grid; see reorder-math.ts.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'jacket',
    title: 'Waxed Field Jacket, Size M',
    category: 'Outerwear',
    conditionGrade: 'A-',
    verified: true,
    priceBefore: 210,
    priceAfter: 92,
    iconKey: 'jacket',
    scores: { price: 88, condition: 92, trust: 65, pickup: 40 },
    reasoningByLeadChip: {
      price: 'Priced to lead: 56% under retail is the deepest cut of the three.',
      condition: 'Near-mint A- grade, confirmed at intake before it was ever listed.',
      trust: 'Seller trust sits mid-pack here — the discount and grade are doing the work.',
      pickup: 'Ships in 4-6 days — the slowest of the three, which costs it rank under this order.',
    },
  },
  {
    id: 'keyboard',
    title: 'Hot-Swap Mechanical Keyboard',
    category: 'Electronics',
    conditionGrade: 'B+',
    verified: true,
    priceBefore: 180,
    priceAfter: 95,
    iconKey: 'keyboard',
    scores: { price: 60, condition: 78, trust: 90, pickup: 85 },
    reasoningByLeadChip: {
      price: 'A real discount, but the smallest of the three under this order.',
      condition: 'Light keycap wear only — B+ holds up well against the other two.',
      trust: 'Verified seller with a clean return history: the highest trust score here.',
      pickup: 'Local pickup available today — the fastest turnaround of the three.',
    },
  },
  {
    id: 'bag',
    title: 'Leather Weekender Bag',
    category: 'Bags',
    conditionGrade: 'B',
    verified: false,
    priceBefore: 340,
    priceAfter: 190,
    iconKey: 'bag',
    scores: { price: 70, condition: 60, trust: 80, pickup: 95 },
    reasoningByLeadChip: {
      price: 'A solid 44% off, though not the deepest of the three under this order.',
      condition: 'Honest wear on the base and strap is reflected plainly in its B grade.',
      trust: 'Strong buyer rating history, even without the seller-verification badge.',
      pickup: 'Same-day pickup available — the fastest of the three listings.',
    },
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  context: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-01',
    quote:
      'I put condition grade first before I ever touched a listing. The jacket that arrived matched the grade on screen exactly.',
    name: 'Dana K.',
    context: 'Bought a jacket, Seattle',
    initials: 'DK',
  },
  {
    id: 'tm-02',
    quote:
      'Pickup speed mattered more to me than price for once — I moved it to the top and the keyboard I wanted was already leading.',
    name: 'Omar R.',
    context: 'Bought a keyboard, Austin',
    initials: 'OR',
  },
  {
    id: 'tm-03',
    quote:
      'Seller trust first, always. Repick let me rank it that way instead of guessing from a star rating buried in the listing.',
    name: 'Freya L.',
    context: 'Bought a bag, Copenhagen',
    initials: 'FL',
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: '12,400+', label: 'Verified sellers on the platform' },
  { value: '96%', label: 'Of condition grades confirmed accurate on delivery' },
  { value: '312', label: 'Active listings in the current catalog' },
];
