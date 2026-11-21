// native/src/evolve/r36/b/data.ts
// Deterministic dummy data for the Minimum Offer Threshold screen.
// No Math.random / Date.now / argument-less new Date() — fixed values only.

export type ListingThreshold = {
  id: string;
  title: string;
  category: string;
  /** The listing's current asking price, in won. */
  price: number;
  /** The seller's starting minimum acceptable offer, in won. */
  initialThreshold: number;
};

export const listingThresholds: ListingThreshold[] = [
  {
    id: "l1",
    title: "Vintage Denim Jacket",
    category: "Outerwear",
    price: 68000,
    initialThreshold: 45000,
  },
  {
    id: "l2",
    title: "iPhone 12 Mini 64GB",
    category: "Electronics",
    price: 320000,
    initialThreshold: 250000,
  },
  {
    id: "l3",
    title: "Nike Air Force 1 (US 9)",
    category: "Shoes",
    price: 95000,
    initialThreshold: 70000,
  },
  {
    id: "l4",
    title: "IKEA Poäng Armchair",
    category: "Furniture",
    price: 55000,
    initialThreshold: 30000,
  },
  {
    id: "l5",
    title: "Canon AE-1 Film Camera",
    category: "Electronics",
    price: 180000,
    initialThreshold: 140000,
  },
  {
    id: "l6",
    title: "Patagonia Fleece Vest",
    category: "Outerwear",
    price: 42000,
    initialThreshold: 25000,
  },
  {
    id: "l7",
    title: "Herman Miller Aeron Chair",
    category: "Furniture",
    price: 450000,
    initialThreshold: 350000,
  },
];
