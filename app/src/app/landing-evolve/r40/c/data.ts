// Deterministic content for the Grade Matrix device.
// Nothing here is generated at runtime — every number is hand-set so the
// same cell always produces the same best match and the same two alternates.

export type Category = "Bags" | "Watches" | "Sneakers" | "Electronics";
export type Tier = "Like New" | "Good" | "Fair";

export const TIERS: Tier[] = ["Like New", "Good", "Fair"];
export const CATEGORIES: Category[] = ["Bags", "Watches", "Sneakers", "Electronics"];

export type AltItem = {
  name: string;
  price: number;
  match: number;
};

export type BestItem = {
  name: string;
  price: number;
  match: number;
  discount: number;
  seller: string;
};

export type Cell = {
  count: number;
  density: 1 | 2 | 3 | 4 | 5;
  popular?: true;
  best: BestItem;
  alts: [AltItem, AltItem];
};

export const CATEGORY_PHOTO: Record<Category, { id: string; alt: string }> = {
  Bags: {
    id: "1584917865442-de89df76afd3",
    alt: "A structured brown leather tote bag standing upright against a plain background",
  },
  Watches: {
    id: "1524805444758-089113d48a6d",
    alt: "A stainless steel dive watch with a blue dial, photographed against a plain background",
  },
  Sneakers: {
    id: "1543163521-1bf539c55dd2",
    alt: "A single white and grey low-top sneaker photographed against a plain background",
  },
  Electronics: {
    id: "1505740420928-5e560c06d30e",
    alt: "A pair of black over-ear headphones photographed against a plain background",
  },
};

export const MATRIX: Record<Tier, Record<Category, Cell>> = {
  "Like New": {
    Bags: {
      count: 86,
      density: 3,
      best: {
        name: "Quilted Crossbody Bag",
        price: 340,
        match: 97,
        discount: 46,
        seller: "Verified · 203 sales",
      },
      alts: [
        { name: "Structured Leather Tote", price: 265, match: 92 },
        { name: "Mini Shoulder Bag", price: 190, match: 89 },
      ],
    },
    Watches: {
      count: 41,
      density: 2,
      best: {
        name: "Automatic Dive Watch",
        price: 890,
        match: 96,
        discount: 33,
        seller: "Verified · 58 sales",
      },
      alts: [
        { name: "Chronograph Steel Watch", price: 720, match: 91 },
        { name: "Minimalist Dress Watch", price: 410, match: 88 },
      ],
    },
    Sneakers: {
      count: 168,
      density: 5,
      popular: true,
      best: {
        name: "Retro Runner Sneakers",
        price: 165,
        match: 98,
        discount: 42,
        seller: "Verified · 402 sales",
      },
      alts: [
        { name: "Court Classic Sneakers", price: 140, match: 93 },
        { name: "Trail Hiker Sneakers", price: 125, match: 90 },
      ],
    },
    Electronics: {
      count: 52,
      density: 2,
      best: {
        name: "Noise-Cancel Headphones",
        price: 210,
        match: 95,
        discount: 35,
        seller: "Verified · 94 sales",
      },
      alts: [
        { name: "Compact Mirrorless Camera", price: 540, match: 90 },
        { name: "11-inch Tablet", price: 380, match: 88 },
      ],
    },
  },
  Good: {
    Bags: {
      count: 142,
      density: 4,
      best: {
        name: "Leather Satchel",
        price: 210,
        match: 90,
        discount: 38,
        seller: "Verified · 311 sales",
      },
      alts: [
        { name: "Canvas Tote Bag", price: 95, match: 86 },
        { name: "Convertible Crossbody", price: 120, match: 84 },
      ],
    },
    Watches: {
      count: 77,
      density: 3,
      best: {
        name: "Stainless Field Watch",
        price: 340,
        match: 89,
        discount: 41,
        seller: "Verified · 147 sales",
      },
      alts: [
        { name: "Quartz Chronograph", price: 260, match: 85 },
        { name: "Leather Strap Watch", price: 180, match: 82 },
      ],
    },
    Sneakers: {
      count: 151,
      density: 4,
      best: {
        name: "Everyday Trainer Sneakers",
        price: 78,
        match: 91,
        discount: 44,
        seller: "Verified · 268 sales",
      },
      alts: [
        { name: "Canvas Low-Top Sneakers", price: 55, match: 87 },
        { name: "Knit Runner Sneakers", price: 68, match: 85 },
      ],
    },
    Electronics: {
      count: 89,
      density: 3,
      best: {
        name: "Wireless Earbuds",
        price: 85,
        match: 88,
        discount: 39,
        seller: "Verified · 176 sales",
      },
      alts: [
        { name: "Bluetooth Speaker", price: 60, match: 84 },
        { name: "Fitness Smartwatch", price: 95, match: 82 },
      ],
    },
  },
  Fair: {
    Bags: {
      count: 54,
      density: 2,
      best: {
        name: "Vintage Canvas Weekender",
        price: 95,
        match: 78,
        discount: 52,
        seller: "Verified · 64 sales",
      },
      alts: [
        { name: "Worn Leather Tote", price: 60, match: 74 },
        { name: "Canvas Backpack", price: 70, match: 72 },
      ],
    },
    Watches: {
      count: 33,
      density: 2,
      best: {
        name: "Vintage Manual Watch",
        price: 150,
        match: 76,
        discount: 58,
        seller: "Verified · 29 sales",
      },
      alts: [
        { name: "Worn Dive Watch", price: 110, match: 71 },
        { name: "Classic Quartz Watch", price: 85, match: 69 },
      ],
    },
    Sneakers: {
      count: 96,
      density: 3,
      best: {
        name: "Worn Trail Sneakers",
        price: 38,
        match: 80,
        discount: 61,
        seller: "Verified · 121 sales",
      },
      alts: [
        { name: "Scuffed Court Sneakers", price: 28, match: 75 },
        { name: "Basic Canvas Sneakers", price: 24, match: 73 },
      ],
    },
    Electronics: {
      count: 47,
      density: 2,
      best: {
        name: "Refurbished Laptop",
        price: 320,
        match: 74,
        discount: 55,
        seller: "Verified · 52 sales",
      },
      alts: [
        { name: "Used Game Console", price: 140, match: 70 },
        { name: "Basic Tablet", price: 90, match: 68 },
      ],
    },
  },
};

export const DEFAULT_SELECTION: { tier: Tier; category: Category } = {
  tier: "Like New",
  category: "Sneakers",
};

// Hero showcase pulls straight from the same lookup table — no separate
// hand-written hero data to drift out of sync with the matrix below.
export const HERO_SHOWCASE: { tier: Tier; category: Category }[] = [
  { tier: "Like New", category: "Sneakers" },
  { tier: "Good", category: "Bags" },
];
