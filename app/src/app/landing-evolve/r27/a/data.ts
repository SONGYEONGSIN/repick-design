// repick — Signal Map (r27 candidate a)
// Reference dataset for the weighted-axis radar. All numbers are editorial/dummy
// values for demonstration, not live marketplace data.

export type AxisId =
  | "condition"
  | "authenticity"
  | "priceFit"
  | "sellerTrust"
  | "demandVelocity";

export type Axis = {
  id: AxisId;
  label: string;
  short: string;
  hint: string;
};

// Order here is the render order around the polygon (12 o'clock, clockwise).
export const AXES: Axis[] = [
  {
    id: "condition",
    label: "Condition",
    short: "Cond.",
    hint: "AI grading vs. submitted photos and video",
  },
  {
    id: "authenticity",
    label: "Authenticity",
    short: "Auth.",
    hint: "Serial, hardware and material checks",
  },
  {
    id: "priceFit",
    label: "Price fit",
    short: "Price",
    hint: "Ask vs. active comparable sales",
  },
  {
    id: "sellerTrust",
    label: "Seller trust",
    short: "Seller",
    hint: "Track record across past verified sales",
  },
  {
    id: "demandVelocity",
    label: "Demand velocity",
    short: "Demand",
    hint: "How fast comparable listings clear",
  },
];

export type RawScores = Record<AxisId, number>;

// The reference listing the radar is drawn from — a real card shown in the
// product preview grid below, so the shape ties back to something visible.
export const REFERENCE_LISTING_ID = "sony-a7iv";

export const RAW_SCORES: RawScores = {
  condition: 92,
  authenticity: 97,
  priceFit: 81,
  sellerTrust: 90,
  demandVelocity: 76,
};

export const DEFAULT_WEIGHT = Math.round(100 / AXES.length); // 20
export const DEFAULT_WEIGHTS: number[] = AXES.map(() => DEFAULT_WEIGHT);

/**
 * Renormalizing slider set: raising one axis's weight proportionally pulls the
 * remaining axes down (and vice versa) so the five always sum to 100 — the same
 * "one input reshapes the whole system" pattern as the r18/r21 dial rounds, just
 * feeding a polygon instead of a single needle.
 */
export function renormalizeWeights(
  weights: number[],
  index: number,
  rawValue: number
): number[] {
  const n = weights.length;
  const newValue = Math.min(100, Math.max(0, Math.round(rawValue)));
  const oldOthersSum = 100 - weights[index];
  const newOthersSum = 100 - newValue;
  const next = weights.slice();
  next[index] = newValue;

  const otherIdx = weights.map((_, i) => i).filter((i) => i !== index);

  if (oldOthersSum <= 0) {
    // Every other axis was already at 0 — split the remainder evenly.
    const share = Math.floor(newOthersSum / otherIdx.length);
    let remainder = newOthersSum - share * otherIdx.length;
    otherIdx.forEach((i) => {
      next[i] = share + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder -= 1;
    });
    return next;
  }

  // Proportional redistribution, preserving the other axes' relative ratios.
  // The last axis absorbs the rounding remainder so the total always lands on
  // exactly 100 (no visible drift from repeated rounding).
  let running = 0;
  otherIdx.forEach((i, k) => {
    const isLast = k === otherIdx.length - 1;
    const scaled = (weights[i] / oldOthersSum) * newOthersSum;
    const rounded = isLast ? newOthersSum - running : Math.round(scaled);
    next[i] = rounded;
    running += rounded;
  });
  return next;
}

export type AxisState = {
  /** 0–100, clamped — what the polygon actually plots for this axis. */
  value: number;
  weight: number;
  raw: number;
};

export type SignalState = {
  axes: AxisState[];
  /** True weighted average across the five axes (0–100, one decimal). Never
   *  clamped, since weights always sum to 100 it can't exceed the raw range. */
  weightedScore: number;
};

export function computeSignalState(weights: number[], raw: RawScores): SignalState {
  const axes = AXES.map((axis, i) => {
    const w = weights[i];
    const r = raw[axis.id];
    const value = Math.max(0, Math.min(100, Math.round((r * w) / DEFAULT_WEIGHT)));
    return { value, weight: w, raw: r };
  });
  const weightedSum = AXES.reduce((sum, axis, i) => sum + raw[axis.id] * weights[i], 0);
  const weightedScore = Math.round((weightedSum / 100) * 10) / 10;
  return { axes, weightedScore };
}

// ---------------------------------------------------------------------------
// Listings — shared by the hero preview and the product preview grid.

export type Listing = {
  id: string;
  name: string;
  category: "Mirrorless" | "Lens" | "Film";
  image: string;
  gradeLabel: string;
  match: number;
  verified: boolean;
  priceOriginal: number;
  priceNow: number;
  tags: string[];
};

export const LISTINGS: Listing[] = [
  {
    id: "sony-a7iv",
    name: "Sony a7 IV",
    category: "Mirrorless",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56",
    gradeLabel: "Excellent",
    match: 96,
    verified: true,
    priceOriginal: 2498,
    priceNow: 1760,
    tags: ["Shutter count verified", "Sensor spotless", "Box included"],
  },
  {
    id: "fuji-x100v",
    name: "Fujifilm X100V",
    category: "Mirrorless",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    gradeLabel: "Like New",
    match: 94,
    verified: true,
    priceOriginal: 1399,
    priceNow: 1120,
    tags: ["Leaf shutter tested", "No sensor dust", "Ships next day"],
  },
  {
    id: "canon-rf-2470",
    name: "Canon RF 24–70mm f/2.8L",
    category: "Lens",
    image: "https://images.unsplash.com/photo-1560243563-062bfc001d68",
    gradeLabel: "Good",
    match: 89,
    verified: true,
    priceOriginal: 2299,
    priceNow: 1540,
    tags: ["Optics clear, no fungus", "AF calibrated"],
  },
  {
    id: "leica-m6",
    name: "Leica M6",
    category: "Film",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
    gradeLabel: "Good",
    match: 88,
    verified: true,
    priceOriginal: 4750,
    priceNow: 3600,
    tags: ["Meter tested accurate", "Rangefinder aligned"],
  },
];

export const CATEGORIES = ["All", "Mirrorless", "Lens", "Film"] as const;

// ---------------------------------------------------------------------------
// Social proof

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I put most of the weight on seller trust and price fit before I bought. The shape told me more in five seconds than a paragraph of listing copy ever did.",
    name: "Marisol Ortega",
    role: "Wedding photographer, Austin TX",
    initials: "MO",
  },
  {
    quote:
      "Selling, I could see exactly which axis was dragging my score down — condition, not authenticity — and fixed the listing photos before it even went live.",
    name: "Daniel Ferreira",
    role: "Landscape photographer",
    initials: "DF",
  },
  {
    quote:
      "Every other resale app gives you one score and asks you to trust it. This one shows its work, axis by axis.",
    name: "Priya Nandakumar",
    role: "Film and digital shooter",
    initials: "PN",
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: "38,200+", label: "listings scored across five axes" },
  { value: "$21.4M", label: "paid out to sellers to date" },
  { value: "4.9 / 5", label: "average buyer rating" },
  { value: "72 hrs", label: "average time to payout" },
];

// ---------------------------------------------------------------------------
// Hero perspective toggle copy

export type Perspective = "buying" | "selling";

export const PERSPECTIVE_COPY: Record<
  Perspective,
  { eyebrow: string; heading: [string, string]; sub: string; cta: string }
> = {
  buying: {
    eyebrow: "For buyers",
    heading: ["Five signals.", "One honest shape."],
    sub: "repick's AI scores every listing on condition, authenticity, price fit, seller trust and demand — then lets you reweight them to match what you actually care about.",
    cta: "See your weighted match",
  },
  selling: {
    eyebrow: "For sellers",
    heading: ["Five signals.", "One honest price."],
    sub: "repick's AI grades your item on the same five axes buyers use to decide — condition, authenticity, price fit, seller trust and demand — before it ever goes live.",
    cta: "Get your listing scored",
  },
};
