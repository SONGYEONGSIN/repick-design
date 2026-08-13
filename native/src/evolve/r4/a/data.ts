// native/src/evolve/r4/a/data.ts — deterministic marketplace browse/search dummy data.
// No Math.random / Date.now / argless new Date() anywhere — fixed values + pure computation only.

export type Condition = "New" | "Like New" | "Good" | "Fair";

export type Listing = {
  id: string;
  title: string;
  category: string;
  price: number; // USD, whole dollars
  condition: Condition;
  location: string;
  postedDaysAgo: number; // fixed integer, not derived from Date.now()
  swatch: { w: number; h: number; r: "sm" | "md"; inner: "dot" | "bar" | "none" };
};

export const CATEGORIES = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Books & Media",
] as const;

export type Category = (typeof CATEGORIES)[number];

// 22 fixed listings spanning every category, condition, and price band below.
export const LISTINGS: Listing[] = [
  { id: "l1", title: "Mid-century walnut sofa", category: "Furniture", price: 420, condition: "Good", location: "Mission District, SF", postedDaysAgo: 1, swatch: { w: 64, h: 40, r: "sm", inner: "bar" } },
  { id: "l2", title: "iPhone 12, 128GB, unlocked", category: "Electronics", price: 280, condition: "Like New", location: "Uptown, Oakland", postedDaysAgo: 0, swatch: { w: 34, h: 58, r: "md", inner: "dot" } },
  { id: "l3", title: "Patagonia Better Sweater, size M", category: "Clothing", price: 38, condition: "Good", location: "Berkeley Hills", postedDaysAgo: 3, swatch: { w: 52, h: 52, r: "md", inner: "none" } },
  { id: "l4", title: "KitchenAid stand mixer, 5-qt", category: "Home & Kitchen", price: 145, condition: "Like New", location: "Downtown, San Jose", postedDaysAgo: 2, swatch: { w: 44, h: 56, r: "sm", inner: "dot" } },
  { id: "l5", title: "Trek FX 3 hybrid bike, size M", category: "Sports & Outdoors", price: 390, condition: "Good", location: "Alameda", postedDaysAgo: 5, swatch: { w: 68, h: 44, r: "sm", inner: "bar" } },
  { id: "l6", title: "Vinyl record bundle, 24 albums", category: "Books & Media", price: 96, condition: "Good", location: "Emeryville", postedDaysAgo: 4, swatch: { w: 56, h: 56, r: "sm", inner: "none" } },
  { id: "l7", title: "Oak dining table, seats 6", category: "Furniture", price: 310, condition: "Fair", location: "Rockridge, Oakland", postedDaysAgo: 8, swatch: { w: 68, h: 40, r: "sm", inner: "bar" } },
  { id: "l8", title: "Sony WH-1000XM4 headphones", category: "Electronics", price: 150, condition: "Like New", location: "Mission District, SF", postedDaysAgo: 1, swatch: { w: 56, h: 40, r: "md", inner: "dot" } },
  { id: "l9", title: "Levi's 501 jeans, 32x32, 3-pack", category: "Clothing", price: 45, condition: "Good", location: "Temescal, Oakland", postedDaysAgo: 6, swatch: { w: 40, h: 58, r: "sm", inner: "none" } },
  { id: "l10", title: "Cast iron skillet set, 3-piece", category: "Home & Kitchen", price: 52, condition: "Good", location: "Berkeley Hills", postedDaysAgo: 2, swatch: { w: 58, h: 44, r: "md", inner: "dot" } },
  { id: "l11", title: "Yoga mat and block set", category: "Sports & Outdoors", price: 22, condition: "New", location: "Downtown, San Jose", postedDaysAgo: 0, swatch: { w: 30, h: 60, r: "sm", inner: "bar" } },
  { id: "l12", title: "Board game collection, 8 titles", category: "Books & Media", price: 60, condition: "Good", location: "Alameda", postedDaysAgo: 7, swatch: { w: 58, h: 44, r: "sm", inner: "none" } },
  { id: "l13", title: "IKEA Poang armchair", category: "Furniture", price: 65, condition: "Good", location: "Emeryville", postedDaysAgo: 3, swatch: { w: 48, h: 56, r: "md", inner: "bar" } },
  { id: "l14", title: "PS4 console, 500GB, 2 controllers", category: "Electronics", price: 135, condition: "Good", location: "Rockridge, Oakland", postedDaysAgo: 9, swatch: { w: 60, h: 38, r: "sm", inner: "dot" } },
  { id: "l15", title: "Wool peacoat, size L", category: "Clothing", price: 58, condition: "Like New", location: "Mission District, SF", postedDaysAgo: 4, swatch: { w: 44, h: 58, r: "md", inner: "none" } },
  { id: "l16", title: "Dyson V8 cordless vacuum", category: "Home & Kitchen", price: 175, condition: "Good", location: "Temescal, Oakland", postedDaysAgo: 1, swatch: { w: 34, h: 60, r: "sm", inner: "dot" } },
  { id: "l17", title: "Wilson tennis racket, adult", category: "Sports & Outdoors", price: 28, condition: "Fair", location: "Berkeley Hills", postedDaysAgo: 11, swatch: { w: 34, h: 60, r: "sm", inner: "bar" } },
  { id: "l18", title: "Used textbook bundle, CS 101-301", category: "Books & Media", price: 70, condition: "Good", location: "Downtown, San Jose", postedDaysAgo: 6, swatch: { w: 46, h: 58, r: "sm", inner: "none" } },
  { id: "l19", title: "Standing desk, electric", category: "Furniture", price: 210, condition: "Like New", location: "Alameda", postedDaysAgo: 2, swatch: { w: 68, h: 42, r: "sm", inner: "bar" } },
  { id: "l20", title: "Canon EOS Rebel T7 with kit lens", category: "Electronics", price: 320, condition: "Good", location: "Emeryville", postedDaysAgo: 5, swatch: { w: 58, h: 46, r: "md", inner: "dot" } },
  { id: "l21", title: "Nike Air Max 90, size 10", category: "Clothing", price: 48, condition: "Good", location: "Rockridge, Oakland", postedDaysAgo: 0, swatch: { w: 60, h: 40, r: "md", inner: "none" } },
  { id: "l22", title: "Vintage bookshelf, 5-tier", category: "Furniture", price: 85, condition: "Fair", location: "Mission District, SF", postedDaysAgo: 12, swatch: { w: 44, h: 62, r: "sm", inner: "bar" } },
];

export type PriceBandId = "all" | "under50" | "50to150" | "150to300" | "300plus";

export const PRICE_BANDS: { id: PriceBandId; label: string; min: number; max: number }[] = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "under50", label: "Under $50", min: 0, max: 50 },
  { id: "50to150", label: "$50-$150", min: 50, max: 150 },
  { id: "150to300", label: "$150-$300", min: 150, max: 300 },
  { id: "300plus", label: "$300+", min: 300, max: Infinity },
];

export type SortId = "newest" | "priceAsc" | "priceDesc";

export const SORTS: { id: SortId; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "priceAsc", label: "Price: Low to High" },
  { id: "priceDesc", label: "Price: High to Low" },
];

function group(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function usd(value: number): string {
  return `$${group(value)}`;
}

// "Today" / "1 day ago" / "N days ago" — from a fixed field, never Date.now().
export function daysAgoLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function matchesQuery(item: Listing, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  return (
    item.title.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.location.toLowerCase().includes(q)
  );
}

export function matchesCategories(item: Listing, selected: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.includes(item.category);
}

export function matchesPriceBand(item: Listing, bandId: PriceBandId): boolean {
  if (bandId === "all") return true;
  const band = PRICE_BANDS.find((b) => b.id === bandId);
  if (!band) return true;
  return item.price >= band.min && item.price < band.max;
}

export function sortListings(items: Listing[], sort: SortId): Listing[] {
  const copy = [...items];
  if (sort === "priceAsc") return copy.sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
  if (sort === "priceDesc") return copy.sort((a, b) => b.price - a.price || a.id.localeCompare(b.id));
  return copy.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo || a.id.localeCompare(b.id));
}
