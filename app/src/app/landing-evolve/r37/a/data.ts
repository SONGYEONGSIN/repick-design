/**
 * Candidate "a" — Instant Estimate.
 *
 * Dark theme, emerald accent family assigned for this round (not the
 * catalog stock violet/teal/orange/rose hues). Base accent is reserved for
 * borders and body-size text directly on bg/surface; the tint carries
 * small text, icons and focus rings; the fill shade is a darker step
 * reserved for behind white button/badge labels. See candidates/a.md for
 * the measured contrast ratios behind each of these roles.
 */
export const COLORS = {
  bg: '#0B0B0F',
  surface: '#121714',
  surfaceLine: '#213128',
  fg: '#FFFFFF',
  muted: '#A1A1AA',
  accent: '#10B981',
  accentTint: '#6EE7B7',
  accentFill: '#047857',
} as const;

export type CategoryId = 'sneakers' | 'denim' | 'bags' | 'watches' | 'streetwear';

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  sneakers: 'Sneakers',
  denim: 'Denim & Outerwear',
  bags: 'Bags & Leather',
  watches: 'Watches & Accessories',
  streetwear: 'Streetwear Tops',
};

export type GradeId = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-';

export interface Item {
  id: string;
  brand: string;
  title: string;
  category: CategoryId;
  grade: GradeId;
  /** Original retail price, fixed. */
  retail: number;
  /** Most recent comparable sold price for this exact item, fixed. */
  sold: number;
  /** Whether Repick's AI authentication check passed for this comp. */
  verified: boolean;
}

/**
 * Fixed, deterministic local dataset — 25 items across 5 categories. Every
 * number here (retail, sold, grade, verified) is hand-authored data, never
 * generated at runtime. This is the only "backend" the search device reads
 * from: there is no network call anywhere in this page.
 */
export const ITEMS: Item[] = [
  // Sneakers
  { id: 's1', brand: 'Nike', title: "Air Jordan 1 Retro High 'UNC'", category: 'sneakers', grade: 'A-', retail: 180, sold: 112, verified: true },
  { id: 's2', brand: 'Nike', title: "Dunk Low 'Panda'", category: 'sneakers', grade: 'A+', retail: 110, sold: 78, verified: true },
  { id: 's3', brand: 'Adidas', title: "Yeezy Boost 350 V2 'Zebra'", category: 'sneakers', grade: 'B+', retail: 230, sold: 150, verified: true },
  { id: 's4', brand: 'New Balance', title: "550 'White Green'", category: 'sneakers', grade: 'A', retail: 120, sold: 82, verified: true },
  { id: 's5', brand: 'Nike', title: "Air Force 1 '07 White", category: 'sneakers', grade: 'B', retail: 110, sold: 52, verified: false },

  // Denim & Outerwear
  { id: 'd1', brand: "Levi's", title: '501 Vintage Selvedge Jacket', category: 'denim', grade: 'A-', retail: 198, sold: 112, verified: true },
  { id: 'd2', brand: 'Carhartt', title: 'Detroit Jacket', category: 'denim', grade: 'B+', retail: 160, sold: 88, verified: true },
  { id: 'd3', brand: 'Patagonia', title: 'Retro-X Fleece Jacket', category: 'denim', grade: 'A', retail: 219, sold: 132, verified: true },
  { id: 'd4', brand: 'The North Face', title: 'Nuptse 700 Puffer', category: 'denim', grade: 'B', retail: 280, sold: 142, verified: false },
  { id: 'd5', brand: "Levi's", title: '505 Straight Jeans', category: 'denim', grade: 'B+', retail: 70, sold: 34, verified: true },

  // Bags & Leather
  { id: 'b1', brand: 'Coach', title: 'Original Leather Tote', category: 'bags', grade: 'A-', retail: 350, sold: 172, verified: true },
  { id: 'b2', brand: 'Fjallraven', title: 'Kanken Classic Backpack', category: 'bags', grade: 'A', retail: 90, sold: 54, verified: true },
  { id: 'b3', brand: 'Herschel', title: 'Supply Weekender Duffel', category: 'bags', grade: 'B+', retail: 120, sold: 58, verified: false },
  { id: 'b4', brand: 'Saint Laurent', title: 'Card Holder Wallet', category: 'bags', grade: 'A', retail: 250, sold: 138, verified: true },
  { id: 'b5', brand: 'Timbuk2', title: 'Classic Messenger Bag', category: 'bags', grade: 'B', retail: 95, sold: 42, verified: true },

  // Watches & Accessories
  { id: 'w1', brand: 'Seiko', title: '5 Automatic SNK Series', category: 'watches', grade: 'A', retail: 110, sold: 68, verified: true },
  { id: 'w2', brand: 'Casio', title: 'G-Shock DW5600', category: 'watches', grade: 'A-', retail: 70, sold: 42, verified: true },
  { id: 'w3', brand: 'Fossil', title: 'Leather Strap Chronograph', category: 'watches', grade: 'B+', retail: 125, sold: 54, verified: false },
  { id: 'w4', brand: 'Ray-Ban', title: 'Wayfarer Classic', category: 'watches', grade: 'B', retail: 163, sold: 68, verified: true },
  { id: 'w5', brand: 'Citizen', title: 'Eco-Drive Field Watch', category: 'watches', grade: 'A', retail: 195, sold: 112, verified: true },

  // Streetwear Tops
  { id: 't1', brand: 'Champion', title: 'Reverse Weave Crewneck', category: 'streetwear', grade: 'A', retail: 65, sold: 36, verified: true },
  { id: 't2', brand: 'Stussy', title: '8-Ball Graphic Tee', category: 'streetwear', grade: 'A-', retail: 45, sold: 24, verified: true },
  { id: 't3', brand: 'Nike', title: 'Tech Fleece Hoodie', category: 'streetwear', grade: 'B', retail: 130, sold: 58, verified: false },
  { id: 't4', brand: 'BAPE', title: 'Camo Full-Zip Hoodie', category: 'streetwear', grade: 'B+', retail: 320, sold: 178, verified: true },
  { id: 't5', brand: 'Carhartt WIP', title: 'Chase Hoodie', category: 'streetwear', grade: 'A', retail: 100, sold: 62, verified: true },
];

export const DEFAULT_ITEM_ID = 's1';

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
      'I typed in my jacket before I ever listed it. The range it gave me was within four dollars of what it actually sold for.',
    name: 'Priya N.',
    context: 'Sold a jacket, Portland',
    initials: 'PN',
  },
  {
    id: 'tm-02',
    quote:
      'Seeing three real comps next to my estimate is what convinced me the number was not just a round figure someone picked.',
    name: 'Marcus T.',
    context: 'Sold a pair of sneakers, Chicago',
    initials: 'MT',
  },
  {
    id: 'tm-03',
    quote:
      'The grade on my bag came back lower than I expected, and the payout range reflected that honestly instead of inflating it.',
    name: 'Ines V.',
    context: 'Sold a bag, Montreal',
    initials: 'IV',
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: '18,900+', label: 'Comparable sales in the current pricing index' },
  { value: '94%', label: 'Of estimates landing within the quoted range at sale' },
  { value: '48 hrs', label: 'Average time from estimate to a listed item' },
];
