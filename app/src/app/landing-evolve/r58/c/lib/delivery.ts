/**
 * Delivery Grid Pick — shared derivation.
 *
 * Exactly one function (`deriveCombo`) computes everything the page ever shows about a
 * speed + insurance combination: shipping cost, total landed cost, and delivery window.
 * Every surface that cites a number (hero readout, comparison strip, closing CTA) calls
 * this same function with the current selection instead of re-typing a value, so there is
 * never a second, drifting copy of "the total."
 *
 * `nearestByCost` is the dynamic half of the device: given whichever cell is currently
 * selected, it re-ranks the other five cells by distance from the *selected* total cost and
 * returns the two closest. Swap the selection and the two "next-best" cells are recomputed
 * from scratch — this is not a precomputed static ranking table.
 */

export type Speed = "standard" | "express" | "overnight";
export type Insurance = "basic" | "full";

export interface SpeedMeta {
  id: Speed;
  label: string;
  shortLabel: string;
  window: string;
}

export interface InsuranceMeta {
  id: Insurance;
  label: string;
  shortLabel: string;
  detail: string;
}

export const SPEEDS: SpeedMeta[] = [
  { id: "standard", label: "Standard", shortLabel: "STD", window: "5–7 business days" },
  { id: "express", label: "Express", shortLabel: "EXP", window: "2–3 business days" },
  { id: "overnight", label: "Overnight", shortLabel: "O/N", window: "Next business day" },
];

export const INSURANCE: InsuranceMeta[] = [
  { id: "basic", label: "Basic", shortLabel: "Basic", detail: "Covers up to $50" },
  { id: "full", label: "Full Coverage", shortLabel: "Full", detail: "Covers full item value" },
];

const SHIPPING_COST: Record<Speed, Record<Insurance, number>> = {
  standard: { basic: 4.5, full: 7.0 },
  express: { basic: 8.5, full: 11.0 },
  overnight: { basic: 16.0, full: 19.5 },
};

export const ITEM = {
  name: "Wool Twill Peacoat",
  size: "Size M",
  price: 142,
  originalPrice: 210,
  matchPercent: 96,
  conditionGrade: "Excellent",
  conditionScore: 9,
  sellerName: "Ada K.",
  sellerRating: 4.9,
  sellerSales: 312,
  photoId: "1551028719-00167b16eac5",
};

export function cellKey(speed: Speed, insurance: Insurance): string {
  return `${speed}:${insurance}`;
}

export interface DerivedCombo {
  key: string;
  speed: Speed;
  insurance: Insurance;
  speedMeta: SpeedMeta;
  insuranceMeta: InsuranceMeta;
  shippingCost: number;
  deliveryWindow: string;
  itemPrice: number;
  totalCost: number;
  discountPercent: number;
}

/** The one shared derivation. Every other number on the page traces back to this call. */
export function deriveCombo(speed: Speed, insurance: Insurance): DerivedCombo {
  const speedMeta = SPEEDS.find((s) => s.id === speed) ?? SPEEDS[0];
  const insuranceMeta = INSURANCE.find((i) => i.id === insurance) ?? INSURANCE[0];
  const shippingCost = SHIPPING_COST[speedMeta.id][insuranceMeta.id];
  const itemPrice = ITEM.price;
  const totalCost = Math.round((itemPrice + shippingCost) * 100) / 100;
  const discountPercent = Math.round(((ITEM.originalPrice - ITEM.price) / ITEM.originalPrice) * 100);

  return {
    key: cellKey(speedMeta.id, insuranceMeta.id),
    speed: speedMeta.id,
    insurance: insuranceMeta.id,
    speedMeta,
    insuranceMeta,
    shippingCost,
    deliveryWindow: speedMeta.window,
    itemPrice,
    totalCost,
    discountPercent,
  };
}

export function allCombos(): DerivedCombo[] {
  const out: DerivedCombo[] = [];
  for (const s of SPEEDS) {
    for (const i of INSURANCE) {
      out.push(deriveCombo(s.id, i.id));
    }
  }
  return out;
}

/**
 * The two cells whose total cost sits closest to the currently selected cell's total cost,
 * recomputed fresh from `selectedKey` every call — not a fixed table of "cheap / mid / expensive."
 */
export function nearestByCost(selectedKey: string, count = 2): DerivedCombo[] {
  const combos = allCombos();
  const selected = combos.find((c) => c.key === selectedKey);
  if (!selected) return [];
  return combos
    .filter((c) => c.key !== selectedKey)
    .sort((a, b) => Math.abs(a.totalCost - selected.totalCost) - Math.abs(b.totalCost - selected.totalCost))
    .slice(0, count);
}

export function cheapestCombo(): DerivedCombo {
  return allCombos().reduce((min, c) => (c.totalCost < min.totalCost ? c : min));
}

export function priciestCombo(): DerivedCombo {
  return allCombos().reduce((max, c) => (c.totalCost > max.totalCost ? c : max));
}

export function formatUSD(n: number): string {
  return `$${n.toFixed(2)}`;
}

export const DEFAULT_SPEED: Speed = "express";
export const DEFAULT_INSURANCE: Insurance = "full";

export interface ProductListing {
  id: string;
  name: string;
  size: string;
  price: number;
  originalPrice: number;
  matchPercent: number;
  conditionGrade: string;
  conditionScore: number;
  sellerName: string;
  sellerRating: number;
  sellerSales: number;
  photoId: string;
  reasoning: string;
}

export function discountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export const LISTINGS: ProductListing[] = [
  {
    id: "peacoat",
    name: ITEM.name,
    size: ITEM.size,
    price: ITEM.price,
    originalPrice: ITEM.originalPrice,
    matchPercent: ITEM.matchPercent,
    conditionGrade: ITEM.conditionGrade,
    conditionScore: ITEM.conditionScore,
    sellerName: ITEM.sellerName,
    sellerRating: ITEM.sellerRating,
    sellerSales: ITEM.sellerSales,
    photoId: ITEM.photoId,
    reasoning: "Matched on size run, fabric weight, and your saved silhouette filters.",
  },
  {
    id: "denim-jacket",
    name: "Selvedge Denim Jacket",
    size: "Size L",
    price: 96,
    originalPrice: 150,
    matchPercent: 91,
    conditionGrade: "Very Good",
    conditionScore: 8,
    sellerName: "Marco P.",
    sellerRating: 4.8,
    sellerSales: 204,
    photoId: "1551537482-f2075a1d41f2",
    reasoning: "Matched on brand fit history and a stitch-condition scan.",
  },
  {
    id: "cashmere-crewneck",
    name: "Cashmere Crewneck",
    size: "Size S",
    price: 58,
    originalPrice: 95,
    matchPercent: 88,
    conditionGrade: "Good",
    conditionScore: 7,
    sellerName: "Lena V.",
    sellerRating: 4.7,
    sellerSales: 150,
    photoId: "1576566588028-4147f3842f27",
    reasoning: "Matched on color palette and your prior purchase cadence.",
  },
  {
    id: "crossbody-bag",
    name: "Leather Crossbody Bag",
    size: "One Size",
    price: 121,
    originalPrice: 175,
    matchPercent: 93,
    conditionGrade: "Excellent",
    conditionScore: 9,
    sellerName: "Noah S.",
    sellerRating: 4.9,
    sellerSales: 410,
    photoId: "1548036328-c9fa89d128fa",
    reasoning: "Matched on hardware finish and your saved brand list.",
  },
];
