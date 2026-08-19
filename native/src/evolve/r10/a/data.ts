// native/src/evolve/r10/a/data.ts — deterministic Search & Browse dummy data
// (no Math.random / Date.now / no-arg new Date — all fixed values, pure computation)

export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Books",
  "Sports",
  "Kids",
  "Beauty",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Listing = {
  id: string;
  title: string;
  category: Category;
  price: number; // KRW, fixed value
  savedInitial: boolean; // deterministic initial "saved" state
};

// 14 listings, 2 per category, prices vary in digit count to exercise tabular-nums alignment.
export const LISTINGS: Listing[] = [
  { id: "l1", title: "Wireless earbuds · Pro 2", category: "Electronics", price: 189000, savedInitial: false },
  { id: "l2", title: "Mechanical keyboard · 65%", category: "Electronics", price: 128000, savedInitial: true },
  { id: "l3", title: "Running shoes · Trail GTX", category: "Sports", price: 96000, savedInitial: false },
  { id: "l4", title: "Yoga mat · Eco cork", category: "Sports", price: 42000, savedInitial: false },
  { id: "l5", title: "Wool coat · Camel", category: "Fashion", price: 165000, savedInitial: true },
  { id: "l6", title: "Denim jacket · Straight fit", category: "Fashion", price: 89000, savedInitial: false },
  { id: "l7", title: "Cast iron skillet · 10in", category: "Home", price: 54000, savedInitial: false },
  { id: "l8", title: "Ceramic dinner set · 4p", category: "Home", price: 76000, savedInitial: true },
  { id: "l9", title: "Board game · Strategy classic", category: "Kids", price: 38000, savedInitial: false },
  { id: "l10", title: "Wooden building blocks", category: "Kids", price: 45000, savedInitial: false },
  { id: "l11", title: "Novel · Short story collection", category: "Books", price: 15000, savedInitial: false },
  { id: "l12", title: "Cookbook · Weeknight meals", category: "Books", price: 22000, savedInitial: true },
  { id: "l13", title: "Facial serum · Vitamin C", category: "Beauty", price: 34000, savedInitial: false },
  { id: "l14", title: "Hair dryer · Ionic", category: "Beauty", price: 118000, savedInitial: false },
];

// Thousands-separated KRW formatting — avoids toLocaleString (environment-independent, deterministic).
export function formatKRW(won: number): string {
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₩${digits}`;
}
