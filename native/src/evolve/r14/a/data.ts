// native/src/evolve/r14/a/data.ts — auto-native-r14 candidate a: Bulk Relist / Inventory Manager.
//
// All values below are fixed literals — no Math.random / Date.now / argument-less `new Date()` —
// so the screen renders identically on every load (GENERATION.md §5). The seven listings all
// start "active" with zero paused: the "Paused" filter is therefore genuinely empty at first
// render (a real, reachable empty state — not a contrived one) and only fills in once the
// multi-select "Take down" batch action actually moves something into it. See candidates/a.md.

export type ListingStatus = "active" | "paused";

export type Listing = {
  id: string;
  title: string;
  category: string;
  priceWon: number;
  status: ListingStatus;
  views: number;
  likes: number;
  postedLabel: string;
  relisted: boolean;
};

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Nike Air Force 1 '07 White",
    category: "Sneakers · Size 270",
    priceWon: 89000,
    status: "active",
    views: 342,
    likes: 28,
    postedLabel: "Posted 5 days ago",
    relisted: false,
  },
  {
    id: "l2",
    title: "Uniqlo Fleece Full-Zip Jacket",
    category: "Outerwear · Size L",
    priceWon: 32000,
    status: "active",
    views: 198,
    likes: 14,
    postedLabel: "Posted 9 days ago",
    relisted: false,
  },
  {
    id: "l3",
    title: "Zara Structured Wool Coat",
    category: "Outerwear · Size M",
    priceWon: 145000,
    status: "active",
    views: 512,
    likes: 41,
    postedLabel: "Posted 2 days ago",
    relisted: false,
  },
  {
    id: "l4",
    title: "Levi's 501 Original Jeans",
    category: "Denim · W32 L32",
    priceWon: 42000,
    status: "active",
    views: 87,
    likes: 6,
    postedLabel: "Posted 18 days ago",
    relisted: false,
  },
  {
    id: "l5",
    title: "Adidas Samba OG",
    category: "Sneakers · Size 260",
    priceWon: 76000,
    status: "active",
    views: 623,
    likes: 55,
    postedLabel: "Posted 3 days ago",
    relisted: false,
  },
  {
    id: "l6",
    title: "Patagonia Better Sweater Fleece",
    category: "Outerwear · Size M",
    priceWon: 68000,
    status: "active",
    views: 134,
    likes: 9,
    postedLabel: "Posted 12 days ago",
    relisted: false,
  },
  {
    id: "l7",
    title: "Champion Reverse Weave Hoodie",
    category: "Tops · Size L",
    priceWon: 39000,
    status: "active",
    views: 76,
    likes: 4,
    postedLabel: "Posted 21 days ago",
    relisted: false,
  },
];

export type ListingTab = "all" | "active" | "paused";

export const PRICE_CUT_PERCENT = 10;
export const MIN_PRICE_WON = 5000;

// Simulated processing delay for batch actions — fixed, not random. See GENERATION.md §5.
export const PROCESSING_DELAY_MS = 700;

export function cutPrice(priceWon: number): number {
  const cut = Math.round((priceWon * (100 - PRICE_CUT_PERCENT)) / 100 / 1000) * 1000;
  return Math.max(MIN_PRICE_WON, cut);
}

// ₩ and the digits get a visible gap (option ① from GENERATION.md §1) — the glyph's stroke
// otherwise runs into the adjacent digit at body text size. Same convention as payout/data.ts
// and evolve/r12/a; reused deliberately rather than re-litigated. See candidates/a.md.
export function formatWon(amount: number): string {
  const digits = Math.round(amount).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₩ ${withCommas}`;
}

export function formatCount(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
