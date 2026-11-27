export interface Listing {
  id: string;
  name: string;
  glyph: "jacket" | "bag" | "watch" | "sneaker";
  matchReason: string;
  grade: string;
  gradeScore: number;
  verifiedSales: number;
  priceBefore: number;
  priceAfter: number;
}

export const LISTINGS: Listing[] = [
  {
    id: "jacket",
    name: "Shearling-collar bomber",
    glyph: "jacket",
    matchReason: "Matches your saved size M",
    grade: "Excellent",
    gradeScore: 9.1,
    verifiedSales: 186,
    priceBefore: 240,
    priceAfter: 142,
  },
  {
    id: "bag",
    name: "Structured leather tote",
    glyph: "bag",
    matchReason: "Matches your saved style board",
    grade: "Very good",
    gradeScore: 8.4,
    verifiedSales: 94,
    priceBefore: 310,
    priceAfter: 205,
  },
  {
    id: "watch",
    name: "Steel dive watch, 40mm",
    glyph: "watch",
    matchReason: "Matches your saved brand list",
    grade: "Good",
    gradeScore: 7.6,
    verifiedSales: 312,
    priceBefore: 520,
    priceAfter: 365,
  },
  {
    id: "sneaker",
    name: "Low-top running sneaker",
    glyph: "sneaker",
    matchReason: "Matches your saved size 9.5",
    grade: "Excellent",
    gradeScore: 9.4,
    verifiedSales: 227,
    priceBefore: 128,
    priceAfter: 76,
  },
];

/** Derived from the two live prices, never a separately stored third number. */
export function discountPct(before: number, after: number): number {
  return Math.round((1 - after / before) * 100);
}
