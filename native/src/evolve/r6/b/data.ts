// native/src/evolve/r6/b/data.ts — auto-native-r6 candidate b: Discover/Search screen dummy data.
// Deterministic only: fixed literal values + pure functions. No Math.random/Date.now/bare `new Date()`.

export type Category = "Electronics" | "Furniture" | "Clothing" | "Books" | "Accessories" | "Sporting Goods";
export type Condition = "Like New" | "Good" | "Fair";
export type PriceBand = "under50" | "mid" | "over200";

export type Listing = {
  id: string;
  title: string;
  category: Category;
  condition: Condition;
  price: number; // KRW, fixed
  seller: string;
  description: string;
  glyph: string; // 1-2 letter monochrome placeholder glyph standing in for a thumbnail image
};

// 12 fixed listings spanning every category/condition/price-band combination used by the filters below,
// so every facet (including the "empty result" path) is reachable deterministically.
export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Electronics · Sony WH-1000XM4 Headphones",
    category: "Electronics",
    condition: "Like New",
    price: 185000,
    seller: "minji_k",
    description: "Barely used noise-cancelling headphones, original case and cable included.",
    glyph: "EL",
  },
  {
    id: "l2",
    title: "Furniture · Herman Miller Aeron Chair",
    category: "Furniture",
    condition: "Good",
    price: 780000,
    seller: "studio.hana",
    description: "Size B, fully adjustable. Light wear on the armrests, mechanism works perfectly.",
    glyph: "FN",
  },
  {
    id: "l3",
    title: "Clothing · Patagonia Better Sweater",
    category: "Clothing",
    condition: "Like New",
    price: 62000,
    seller: "jaewon.c",
    description: "Worn twice. Size M, navy. No pilling, smoke-free home.",
    glyph: "CL",
  },
  {
    id: "l4",
    title: "Books · The Design of Everyday Things",
    category: "Books",
    condition: "Good",
    price: 12000,
    seller: "readingroom",
    description: "Revised edition, a few pencil notes in the margins, spine intact.",
    glyph: "BK",
  },
  {
    id: "l5",
    title: "Accessories · Leather Crossbody Bag",
    category: "Accessories",
    condition: "Fair",
    price: 45000,
    seller: "sohyun.p",
    description: "Visible corner scuffs but strap and zipper are solid. Priced for the wear.",
    glyph: "AC",
  },
  {
    id: "l6",
    title: "Electronics · Nintendo Switch OLED",
    category: "Electronics",
    condition: "Like New",
    price: 210000,
    seller: "gamecloset",
    description: "Includes dock and two Joy-Cons, no drift. Box and inserts included.",
    glyph: "EL",
  },
  {
    id: "l7",
    title: "Sporting Goods · Trek Domane Road Bike",
    category: "Sporting Goods",
    condition: "Good",
    price: 950000,
    seller: "ride.often",
    description: "56cm frame, recent tune-up, new tires. Selling to move down a size.",
    glyph: "SG",
  },
  {
    id: "l8",
    title: "Furniture · Mid-Century Teak Sideboard",
    category: "Furniture",
    condition: "Fair",
    price: 420000,
    seller: "olddesk.seoul",
    description: "Solid teak, one door hinge needs tightening. Structurally sound.",
    glyph: "FN",
  },
  {
    id: "l9",
    title: "Clothing · Uniqlo Down Jacket",
    category: "Clothing",
    condition: "Good",
    price: 38000,
    seller: "jaewon.c",
    description: "Size L, black. One winter of use, down loft still full.",
    glyph: "CL",
  },
  {
    id: "l10",
    title: "Electronics · Kindle Paperwhite",
    category: "Electronics",
    condition: "Like New",
    price: 68000,
    seller: "minji_k",
    description: "8GB, screen protector applied since day one. Includes cover.",
    glyph: "EL",
  },
  {
    id: "l11",
    title: "Accessories · Casio G-Shock Watch",
    category: "Accessories",
    condition: "Good",
    price: 55000,
    seller: "timepiece.kr",
    description: "Battery replaced this year, all buttons and backlight working.",
    glyph: "AC",
  },
  {
    id: "l12",
    title: "Books · Atomic Habits (Hardcover)",
    category: "Books",
    condition: "Like New",
    price: 9000,
    seller: "readingroom",
    description: "Read once, no marks. Dust jacket has a small crease on the spine.",
    glyph: "BK",
  },
];

export const CATEGORY_FILTERS: readonly ("All" | Category)[] = [
  "All",
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Accessories",
  "Sporting Goods",
];

export const CONDITION_FILTERS: readonly ("Any" | Condition)[] = ["Any", "Like New", "Good", "Fair"];

export const PRICE_FILTERS: readonly { key: "any" | PriceBand; label: string }[] = [
  { key: "any", label: "Any price" },
  { key: "under50", label: "Under ₩50,000" },
  { key: "mid", label: "₩50,000–200,000" },
  { key: "over200", label: "Over ₩200,000" },
];

// Pure classification — same input always yields the same band.
export function priceBand(price: number): PriceBand {
  if (price < 50000) return "under50";
  if (price <= 200000) return "mid";
  return "over200";
}

// Thousands-separated KRW. No fontVariant:"tabular-nums" is applied to text nodes rendering this string
// anywhere in this screen — a prior round (auto-native-r4) found tabular-nums combined with the ₩ glyph
// produces a rendering artifact in this environment, so numeral alignment is intentionally not used here.
export function formatKRW(won: number): string {
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${won < 0 ? "-" : ""}₩${digits}`;
}

export type Filters = {
  query: string;
  category: "All" | Category;
  condition: "Any" | Condition;
  price: "any" | PriceBand;
};

export const DEFAULT_FILTERS: Filters = { query: "", category: "All", condition: "Any", price: "any" };

// Pure, deterministic filtering — no side effects, no randomness. Search matches title or category text.
export function filterListings(items: Listing[], filters: Filters): Listing[] {
  const q = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (q && !item.title.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) return false;
    if (filters.category !== "All" && item.category !== filters.category) return false;
    if (filters.condition !== "Any" && item.condition !== filters.condition) return false;
    if (filters.price !== "any" && priceBand(item.price) !== filters.price) return false;
    return true;
  });
}
