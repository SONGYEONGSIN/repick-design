// native/src/evolve/r7/b/data.ts — auto-native-r7 candidate b: Search Results (with active filters) dummy data.
// Deterministic only: fixed literal values + pure functions. No Math.random/Date.now/bare `new Date()`.

export type Size = "XS" | "S" | "M" | "L" | "XL";
export type Condition = "New with tags" | "Like New" | "Good" | "Fair";
export type PriceBandKey = "under50" | "50to150" | "over150";
export type Brand = "Levi's" | "Wrangler" | "Lee" | "Carhartt" | "Uniqlo";
export type SortKey = "relevance" | "priceAsc" | "priceDesc" | "newest";

export type Item = {
  id: string;
  title: string;
  brand: Brand;
  size: Size;
  condition: Condition;
  price: number; // KRW, fixed
  daysAgo: number; // fixed — smaller = more recently listed
  description: string;
  monogram: string; // 2-letter placeholder standing in for a thumbnail image
};

// 14 fixed results for the query "vintage denim jacket" — spans every facet value used below,
// and spans query-token overlap from 3/3 down to 1/3 so relevance sort has real work to do.
export const RESULTS: Item[] = [
  {
    id: "r1",
    title: "Levi's Vintage Denim Trucker Jacket",
    brand: "Levi's",
    size: "M",
    condition: "Like New",
    price: 128000,
    daysAgo: 3,
    description: "Classic 70505 trucker cut, faded indigo wash, snap buttons all functional.",
    monogram: "LV",
  },
  {
    id: "r2",
    title: "Wrangler Vintage Denim Jacket — 90s Wash",
    brand: "Wrangler",
    size: "L",
    condition: "Good",
    price: 95000,
    daysAgo: 12,
    description: "Authentic 90s wash, slightly boxy fit, one interior pocket stitch repaired.",
    monogram: "WR",
  },
  {
    id: "r3",
    title: "Lee Storm Rider Vintage Denim Jacket",
    brand: "Lee",
    size: "M",
    condition: "Like New",
    price: 142000,
    daysAgo: 6,
    description: "Corduroy collar, deep indigo, sherpa-free version, no interior wear.",
    monogram: "LE",
  },
  {
    id: "r4",
    title: "Carhartt Denim Chore Jacket",
    brand: "Carhartt",
    size: "L",
    condition: "Good",
    price: 88000,
    daysAgo: 20,
    description: "Workwear chore jacket, not distressed, sturdy canvas-denim blend.",
    monogram: "CH",
  },
  {
    id: "r5",
    title: "Uniqlo Denim Jacket — New with Tags",
    brand: "Uniqlo",
    size: "S",
    condition: "New with tags",
    price: 39000,
    daysAgo: 2,
    description: "Brand new, never worn, tags attached, light wash.",
    monogram: "UQ",
  },
  {
    id: "r6",
    title: "Levi's Type III Trucker Jacket, Vintage 80s",
    brand: "Levi's",
    size: "S",
    condition: "Fair",
    price: 165000,
    daysAgo: 30,
    description: "Genuine 80s piece, some fading and a small repair on the left cuff.",
    monogram: "LV",
  },
  {
    id: "r7",
    title: "Wrangler Denim Vest (Cut from a Jacket)",
    brand: "Wrangler",
    size: "M",
    condition: "Good",
    price: 41000,
    daysAgo: 15,
    description: "Sleeveless denim vest, cut down from a jacket, raw edge finish.",
    monogram: "WR",
  },
  {
    id: "r8",
    title: "Vintage Denim Overalls",
    brand: "Lee",
    size: "L",
    condition: "Fair",
    price: 58000,
    daysAgo: 25,
    description: "Faded overalls, adjustable straps, small paint mark near the knee.",
    monogram: "LE",
  },
  {
    id: "r9",
    title: "Carhartt Vintage Detroit Jacket",
    brand: "Carhartt",
    size: "XL",
    condition: "Good",
    price: 132000,
    daysAgo: 9,
    description: "Blanket-lined Detroit jacket, heavy canvas duck — not denim, often searched alongside it.",
    monogram: "CH",
  },
  {
    id: "r10",
    title: "Uniqlo Denim Trucker Jacket",
    brand: "Uniqlo",
    size: "M",
    condition: "Like New",
    price: 52000,
    daysAgo: 4,
    description: "Modern-cut trucker jacket, mid wash, unworn condition.",
    monogram: "UQ",
  },
  {
    id: "r11",
    title: "Levi's Denim Skirt — Vintage Wash",
    brand: "Levi's",
    size: "S",
    condition: "Good",
    price: 45000,
    daysAgo: 18,
    description: "A-line denim skirt, vintage wash, raw hem.",
    monogram: "LV",
  },
  {
    id: "r12",
    title: "Lee Vintage Denim Jacket, XL Oversized",
    brand: "Lee",
    size: "XL",
    condition: "Like New",
    price: 118000,
    daysAgo: 1,
    description: "Oversized fit, deep pockets, minimal fading, listed today.",
    monogram: "LE",
  },
  {
    id: "r13",
    title: "Wrangler Denim Button-Up Shirt",
    brand: "Wrangler",
    size: "M",
    condition: "Fair",
    price: 22000,
    daysAgo: 40,
    description: "Denim shirt, not a jacket, heavy wash, missing one button.",
    monogram: "WR",
  },
  {
    id: "r14",
    title: "Carhartt Canvas Work Jacket",
    brand: "Carhartt",
    size: "L",
    condition: "New with tags",
    price: 149000,
    daysAgo: 5,
    description: "Canvas work jacket, brand new — not denim, sized true to label.",
    monogram: "CH",
  },
];

export const SIZE_OPTIONS: readonly Size[] = ["XS", "S", "M", "L", "XL"];
export const CONDITION_OPTIONS: readonly Condition[] = ["New with tags", "Like New", "Good", "Fair"];
export const BRAND_OPTIONS: readonly Brand[] = ["Levi's", "Wrangler", "Lee", "Carhartt", "Uniqlo"];
export const PRICE_OPTIONS: readonly { key: PriceBandKey; label: string }[] = [
  { key: "under50", label: "Under ₩50,000" },
  { key: "50to150", label: "₩50,000–150,000" },
  { key: "over150", label: "Over ₩150,000" },
];

export type Filters = {
  size: Size[];
  condition: Condition[];
  price: PriceBandKey[];
  brand: Brand[];
};

// Search opened with three facets already applied — mirrors arriving from a prior refine step,
// not a blank filter state. All three chips are independently removable (see screen).
export const DEFAULT_QUERY = "vintage denim jacket";
export const DEFAULT_FILTERS: Filters = {
  size: ["M"],
  condition: ["Like New"],
  price: ["50to150"],
  brand: [],
};

export function priceBandOf(price: number): PriceBandKey {
  if (price < 50000) return "under50";
  if (price <= 150000) return "50to150";
  return "over150";
}

export function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function searchableText(item: Item): string {
  return `${item.title} ${item.description} ${item.brand} ${item.size} ${item.condition}`.toLowerCase();
}

/** Count of query tokens present anywhere in the item's searchable text (0..tokens.length). */
export function tokenMatchCount(item: Item, tokens: readonly string[]): number {
  if (tokens.length === 0) return 0;
  const text = searchableText(item);
  return tokens.filter((t) => text.includes(t)).length;
}

/** Count of active facet groups this item satisfies — used as a relevance tie-breaker. */
export function facetMatchCount(item: Item, filters: Filters): number {
  let n = 0;
  if (filters.size.includes(item.size)) n += 1;
  if (filters.condition.includes(item.condition)) n += 1;
  if (filters.price.includes(priceBandOf(item.price))) n += 1;
  if (filters.brand.includes(item.brand)) n += 1;
  return n;
}

/** Which query tokens this item actually contains — drives the "Matches: …" line per row. */
export function matchedTokens(item: Item, tokens: readonly string[]): string[] {
  const text = searchableText(item);
  return tokens.filter((t) => text.includes(t));
}

/** Human labels for the active-filter facets this item satisfies — drives the inline facet tags. */
export function matchedFacetLabels(item: Item, filters: Filters): string[] {
  const labels: string[] = [];
  if (filters.size.includes(item.size)) labels.push(`Size ${item.size}`);
  if (filters.condition.includes(item.condition)) labels.push(item.condition);
  const band = priceBandOf(item.price);
  if (filters.price.includes(band)) {
    labels.push(PRICE_OPTIONS.find((p) => p.key === band)?.label ?? band);
  }
  if (filters.brand.includes(item.brand)) labels.push(item.brand);
  return labels;
}

export function matchesFilters(item: Item, filters: Filters, tokens: readonly string[]): boolean {
  const textOk = tokens.length === 0 || tokenMatchCount(item, tokens) > 0;
  const sizeOk = filters.size.length === 0 || filters.size.includes(item.size);
  const conditionOk = filters.condition.length === 0 || filters.condition.includes(item.condition);
  const priceOk = filters.price.length === 0 || filters.price.includes(priceBandOf(item.price));
  const brandOk = filters.brand.length === 0 || filters.brand.includes(item.brand);
  return textOk && sizeOk && conditionOk && priceOk && brandOk;
}

export function sortResults(items: Item[], sort: SortKey, filters: Filters, tokens: readonly string[]): Item[] {
  const withScore = items.map((item) => ({
    item,
    relevance: tokenMatchCount(item, tokens) * 10 + facetMatchCount(item, filters),
  }));
  withScore.sort((a, b) => {
    switch (sort) {
      case "priceAsc":
        if (a.item.price !== b.item.price) return a.item.price - b.item.price;
        break;
      case "priceDesc":
        if (a.item.price !== b.item.price) return b.item.price - a.item.price;
        break;
      case "newest":
        if (a.item.daysAgo !== b.item.daysAgo) return a.item.daysAgo - b.item.daysAgo;
        break;
      case "relevance":
      default:
        if (a.relevance !== b.relevance) return b.relevance - a.relevance;
        if (a.item.price !== b.item.price) return a.item.price - b.item.price;
        break;
    }
    return a.item.id.localeCompare(b.item.id);
  });
  return withScore.map((w) => w.item);
}

// Thousands-separated KRW formatting — avoids toLocaleString (environment-independent, deterministic).
// Deliberately never combined with fontVariant "tabular-nums" anywhere in this candidate — see
// SearchResultsScreen.tsx file-top comment for why (auto-native-r4 / auto-native-r6 rendering delta).
export function formatKRW(won: number): string {
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${won < 0 ? "-" : ""}₩${digits}`;
}

export function daysAgoLabel(daysAgo: number): string {
  if (daysAgo === 0) return "Listed today";
  if (daysAgo === 1) return "Listed 1 day ago";
  return `Listed ${daysAgo} days ago`;
}
