// Static, hand-authored catalog + pure derivation helpers for the Bundle Builder.
// No randomness anywhere: every "variable" number below is a fixed input, and every
// derived number is a plain arithmetic function of the current selection.

export type ProductId = "sneakers" | "camera" | "chair" | "watch" | "bike" | "bag";

export type Condition = "A" | "A-" | "B+" | "B" | "B-";

export interface Product {
  id: ProductId;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  match: number; // 0-100, AI match confidence
  condition: Condition;
  verified: boolean;
  photoId: string; // images.unsplash.com/photo-<id>
  alt: string;
  tags: string[]; // match-reasoning tags shown on the card
}

// 12-point condition rubric collapsed to a single 0-100 score used in the trust rollup.
export const CONDITION_SCORE: Record<Condition, number> = {
  A: 96,
  "A-": 90,
  "B+": 84,
  B: 76,
  "B-": 68,
};

export const PRODUCTS: Product[] = [
  {
    id: "sneakers",
    name: "Nike Air Zoom, US 9",
    category: "Footwear",
    price: 138,
    originalPrice: 220,
    match: 94,
    condition: "A-",
    verified: true,
    photoId: "1542291026-7eec264c27ff",
    alt: "White and grey Nike running sneaker on a plain background",
    tags: ["Matches your saved size 9", "Same brand as 3 saved items"],
  },
  {
    id: "camera",
    name: "Canon AE-1, 35mm film",
    category: "Cameras",
    price: 165,
    originalPrice: 260,
    match: 88,
    condition: "B+",
    verified: true,
    photoId: "1526170375885-4d8ecf77b99f",
    alt: "Black vintage 35mm film camera with a silver lens ring",
    tags: ["Same lens mount as your last search", "Priced under 3 comparable sales"],
  },
  {
    id: "chair",
    name: "Eames-style lounge chair",
    category: "Furniture",
    price: 410,
    originalPrice: 640,
    match: 91,
    condition: "A",
    verified: true,
    photoId: "1567016432779-094069958ea5",
    alt: "Mid-century wooden lounge chair with tan leather cushions",
    tags: ["Matches your saved style: mid-century", "Local pickup, 1.8 miles"],
  },
  {
    id: "watch",
    name: "Seiko automatic dress watch",
    category: "Watches",
    price: 220,
    originalPrice: 340,
    match: 82,
    condition: "B",
    verified: true,
    photoId: "1523275335684-37898b6baf30",
    alt: "Silver automatic dress watch with a brown leather strap",
    tags: ["Automatic movement, your saved filter", "Seller ships same day"],
  },
  {
    id: "bike",
    name: "Trek hybrid commuter",
    category: "Bikes",
    price: 340,
    originalPrice: 520,
    match: 78,
    condition: "B+",
    verified: false,
    photoId: "1485965120184-e220f721d03e",
    alt: "Grey hybrid commuter bicycle leaning against a plain wall",
    tags: ["Frame size matches your height range", "Component tier matches saved spec"],
  },
  {
    id: "bag",
    name: "Leather crossbody bag",
    category: "Accessories",
    price: 96,
    originalPrice: 150,
    match: 85,
    condition: "A-",
    verified: true,
    photoId: "1553062407-98eeb64c6a62",
    alt: "Tan leather crossbody bag with a brass buckle",
    tags: ["Color matches 4 saved items", "Under your saved price ceiling"],
  },
];

// Bundle-size -> extra discount, on top of each item's own before/after price.
// Index 0 = 1 item, index 5 = 6 items. Diminishing returns by design.
export const BUNDLE_TIERS = [0, 6, 12, 16, 19, 21];

export interface BundleItemScore {
  id: ProductId;
  name: string;
  contribution: number;
}

export interface BundleSummary {
  count: number;
  subtotal: number;
  originalSubtotal: number;
  discountPct: number;
  total: number;
  savings: number;
  rollup: number;
  perItem: BundleItemScore[];
}

/**
 * Pure derivation: given the currently selected product ids, compute both
 * output surfaces (discount curve position + trust rollup) from one shared
 * state. Deterministic — same input always yields the same numbers.
 */
export function computeBundle(selectedIds: ProductId[]): BundleSummary {
  const items = PRODUCTS.filter((p) => selectedIds.includes(p.id));
  const count = items.length;
  const subtotal = items.reduce((sum, p) => sum + p.price, 0);
  const originalSubtotal = items.reduce((sum, p) => sum + p.originalPrice, 0);
  const discountPct = count > 0 ? BUNDLE_TIERS[Math.min(count, BUNDLE_TIERS.length) - 1] : 0;
  const total = Math.round(subtotal * (1 - discountPct / 100));
  const savings = originalSubtotal - total;

  const perItem: BundleItemScore[] = items.map((p) => {
    const conditionScore = CONDITION_SCORE[p.condition];
    const verifiedScore = p.verified ? 100 : 55;
    const contribution = Math.round(p.match * 0.45 + conditionScore * 0.35 + verifiedScore * 0.2);
    return { id: p.id, name: p.name, contribution };
  });

  const rollup =
    perItem.length > 0
      ? Math.round(perItem.reduce((sum, p) => sum + p.contribution, 0) / perItem.length)
      : 0;

  return { count, subtotal, originalSubtotal, discountPct, total, savings, rollup, perItem };
}

export interface Testimonial {
  name: string;
  context: string;
  quote: string;
  rating: number; // 1-5
  verified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya N.",
    context: "Bought a matched lens kit",
    quote:
      "I saw the exact reasoning before I paid — same mount, lower price than two closed sales I'd bookmarked. That's the part that made me trust it.",
    rating: 5,
    verified: true,
  },
  {
    name: "Marcus D.",
    context: "Sold a commuter bike",
    quote:
      "Every offer that came in already knew my frame size and component tier. I stopped answering the same three questions on repeat.",
    rating: 5,
    verified: true,
  },
  {
    name: "Elena R.",
    context: "Bundled three furniture pieces",
    quote:
      "The bundle math updated the moment I added the second chair. No guessing what the discount would be at checkout.",
    rating: 4,
    verified: true,
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "94%", label: "Match reasoning shown before purchase" },
  { value: "48 hrs", label: "Median time to an accepted match" },
  { value: "12.4K", label: "Condition-verified trades to date" },
];

export const TRUST_SIGNALS: string[] = [
  "Condition graded on a 12-point rubric",
  "Seller identity checked before listing",
  "Match reasoning shown, not hidden",
  "Bundle pricing recomputed in real time",
  "Buyer protection on every verified trade",
];
