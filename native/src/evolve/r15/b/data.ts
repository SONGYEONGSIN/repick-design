// native/src/evolve/r15/b/data.ts
// Deterministic dummy data for the Bundle Offer Builder screen.
// No Math.random / Date.now / argument-less new Date() anywhere.

export type BundleListing = {
  id: string;
  title: string;
  category: string;
  price: number; // current asking price, KRW
  originalPrice: number; // pre-discount price, KRW
  matchPct: number; // AI match score, 0-100
  grade: "A" | "A-" | "B+" | "B" | "B-";
};

export const seller = {
  name: "Jordan's Closet",
  verified: true,
  itemCount: 6,
};

export const listings: BundleListing[] = [
  {
    id: "l1",
    title: "Wool Overcoat, Charcoal",
    category: "Outerwear",
    price: 128000,
    originalPrice: 160000,
    matchPct: 96,
    grade: "A",
  },
  {
    id: "l2",
    title: "Leather Crossbody Bag",
    category: "Bags",
    price: 54000,
    originalPrice: 72000,
    matchPct: 91,
    grade: "A-",
  },
  {
    id: "l3",
    title: "Cashmere Scarf, Grey",
    category: "Accessories",
    price: 22000,
    originalPrice: 30000,
    matchPct: 88,
    grade: "B+",
  },
  {
    id: "l4",
    title: "Denim Jacket, Vintage Wash",
    category: "Outerwear",
    price: 46000,
    originalPrice: 60000,
    matchPct: 84,
    grade: "B",
  },
  {
    id: "l5",
    title: "Knit Sweater, Cream",
    category: "Knitwear",
    price: 31000,
    originalPrice: 42000,
    matchPct: 79,
    grade: "B",
  },
  {
    id: "l6",
    title: "Leather Ankle Boots",
    category: "Shoes",
    price: 65000,
    originalPrice: 85000,
    matchPct: 75,
    grade: "B-",
  },
];

// Bundle discount grows modestly with item count, fully deterministic —
// indexed by (selected item count - 1), clamped to the last step for
// counts beyond the table.
const BUNDLE_DISCOUNT_STEPS_PCT = [0, 5, 8, 10, 12, 15];

export function getBundleDiscountPct(itemCount: number): number {
  if (itemCount <= 0) return 0;
  const idx = Math.min(itemCount - 1, BUNDLE_DISCOUNT_STEPS_PCT.length - 1);
  return BUNDLE_DISCOUNT_STEPS_PCT[idx];
}

// ₩ mitigation option 1: a literal space is inserted between the ₩ glyph
// and the digits so the glyph's horizontal stroke never touches a digit.
// Digits are grouped with commas via a fixed, deterministic formatter
// (no Intl dependency).
export function formatKRW(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  let grouped = "";
  for (let i = 0; i < digits.length; i++) {
    const posFromEnd = digits.length - i;
    grouped += digits[i];
    if (posFromEnd > 1 && posFromEnd % 3 === 1) grouped += ",";
  }
  return `${sign}₩ ${grouped}`;
}
