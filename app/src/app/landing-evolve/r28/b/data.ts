// repick — The Funnel (r28 candidate b)
// All figures are editorial/dummy values for demonstration, not live marketplace data.
// Every number below is either a fixed literal or derived from fixed literals by a pure
// function — nothing here depends on Math.random, Date.now(), or an argument-less Date().

export type Category = "Cameras" | "Watches" | "Sneakers" | "Bags";

export const CATEGORIES: Category[] = ["Cameras", "Watches", "Sneakers", "Bags"];

export type FunnelStageId = "submitted" | "preScreen" | "condition" | "authenticated" | "matched";

export type FunnelStageDef = {
  id: FunnelStageId;
  label: string;
  hint: string;
};

export const FUNNEL_STAGES: FunnelStageDef[] = [
  {
    id: "submitted",
    label: "Submitted",
    hint: "Every item a seller uploads for this category",
  },
  {
    id: "preScreen",
    label: "AI pre-screen",
    hint: "Photos, specs and price checked against known models",
  },
  {
    id: "condition",
    label: "Condition verified",
    hint: "Wear, function and completeness graded against the listing",
  },
  {
    id: "authenticated",
    label: "Seller authenticated",
    hint: "Identity, history and prior sales confirmed",
  },
  {
    id: "matched",
    label: "Final match",
    hint: "Clears the confidence bar you set below",
  },
];

/** One control point on a category's confidence curve: at this threshold, this
 *  fraction of the authenticated pool still clears the bar. Interpolated linearly
 *  between points — a fixed, deterministic lookup table, not a live distribution. */
type CurvePoint = { t: number; frac: number };

type CategoryFunnel = {
  submitted: number;
  preScreenRate: number;
  conditionRate: number;
  authRate: number;
  curve: CurvePoint[];
};

export const FUNNEL_DATA: Record<Category, CategoryFunnel> = {
  Cameras: {
    submitted: 8400,
    preScreenRate: 0.58,
    conditionRate: 0.71,
    authRate: 0.83,
    curve: [
      { t: 50, frac: 1.0 },
      { t: 60, frac: 0.78 },
      { t: 70, frac: 0.55 },
      { t: 80, frac: 0.34 },
      { t: 90, frac: 0.16 },
      { t: 95, frac: 0.09 },
      { t: 99, frac: 0.04 },
    ],
  },
  Watches: {
    submitted: 5200,
    preScreenRate: 0.52,
    conditionRate: 0.68,
    authRate: 0.79,
    curve: [
      { t: 50, frac: 1.0 },
      { t: 60, frac: 0.81 },
      { t: 70, frac: 0.6 },
      { t: 80, frac: 0.38 },
      { t: 90, frac: 0.19 },
      { t: 95, frac: 0.1 },
      { t: 99, frac: 0.05 },
    ],
  },
  Sneakers: {
    submitted: 14600,
    preScreenRate: 0.61,
    conditionRate: 0.66,
    authRate: 0.74,
    curve: [
      { t: 50, frac: 1.0 },
      { t: 60, frac: 0.74 },
      { t: 70, frac: 0.49 },
      { t: 80, frac: 0.29 },
      { t: 90, frac: 0.13 },
      { t: 95, frac: 0.07 },
      { t: 99, frac: 0.03 },
    ],
  },
  Bags: {
    submitted: 3100,
    preScreenRate: 0.49,
    conditionRate: 0.72,
    authRate: 0.86,
    curve: [
      { t: 50, frac: 1.0 },
      { t: 60, frac: 0.83 },
      { t: 70, frac: 0.63 },
      { t: 80, frac: 0.41 },
      { t: 90, frac: 0.21 },
      { t: 95, frac: 0.12 },
      { t: 99, frac: 0.06 },
    ],
  },
};

export const MIN_THRESHOLD = 50;
export const MAX_THRESHOLD = 99;
export const DEFAULT_THRESHOLD = 80;
export const DEFAULT_CATEGORY: Category = "Cameras";

function lerpFraction(curve: CurvePoint[], threshold: number): number {
  const t = Math.min(MAX_THRESHOLD, Math.max(MIN_THRESHOLD, threshold));
  for (let i = 0; i < curve.length - 1; i++) {
    const a = curve[i];
    const b = curve[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t;
      const ratio = span === 0 ? 0 : (t - a.t) / span;
      return a.frac + (b.frac - a.frac) * ratio;
    }
  }
  return curve[curve.length - 1].frac;
}

export type FunnelStageResult = {
  id: FunnelStageId;
  label: string;
  hint: string;
  count: number;
  /** Percentage of the submitted total that reaches this stage, 0–100. */
  pctOfTotal: number;
};

export type FunnelResult = {
  category: Category;
  threshold: number;
  stages: FunnelStageResult[];
  submitted: number;
  matched: number;
  matchedPct: number;
};

/** Pure function: same (category, threshold) always produces the same funnel — the
 *  thing the closing CTA quotes back is derived the exact same way the chart is. */
export function computeFunnel(category: Category, threshold: number): FunnelResult {
  const data = FUNNEL_DATA[category];
  const submitted = data.submitted;
  const preScreen = Math.round(submitted * data.preScreenRate);
  const condition = Math.round(preScreen * data.conditionRate);
  const authenticated = Math.round(condition * data.authRate);
  const frac = lerpFraction(data.curve, threshold);
  const matched = Math.round(authenticated * frac);

  const raw: { id: FunnelStageId; label: string; hint: string; count: number }[] = [
    { id: "submitted", label: FUNNEL_STAGES[0].label, hint: FUNNEL_STAGES[0].hint, count: submitted },
    { id: "preScreen", label: FUNNEL_STAGES[1].label, hint: FUNNEL_STAGES[1].hint, count: preScreen },
    { id: "condition", label: FUNNEL_STAGES[2].label, hint: FUNNEL_STAGES[2].hint, count: condition },
    { id: "authenticated", label: FUNNEL_STAGES[3].label, hint: FUNNEL_STAGES[3].hint, count: authenticated },
    { id: "matched", label: FUNNEL_STAGES[4].label, hint: FUNNEL_STAGES[4].hint, count: matched },
  ];

  const stages: FunnelStageResult[] = raw.map((s) => ({
    ...s,
    pctOfTotal: Math.round((s.count / submitted) * 1000) / 10,
  }));

  return {
    category,
    threshold,
    stages,
    submitted,
    matched,
    matchedPct: stages[4].pctOfTotal,
  };
}

// ---------------------------------------------------------------------------
// Listings — shared by the hero proof pair and the product preview grid.

export type Listing = {
  id: string;
  name: string;
  category: Category;
  image: string;
  gradeLabel: string;
  match: number;
  verified: boolean;
  reason: string;
  priceOriginal: number;
  priceNow: number;
};

export const LISTINGS: Listing[] = [
  {
    id: "sony-a7iv",
    name: "Sony a7 IV",
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56",
    gradeLabel: "Excellent",
    match: 96,
    verified: true,
    reason: "Shutter count verified under 8,000, sensor spotless in AI scan",
    priceOriginal: 2498,
    priceNow: 1760,
  },
  {
    id: "canon-rf-2470",
    name: "Canon RF 24–70mm f/2.8L",
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1560243563-062bfc001d68",
    gradeLabel: "Good",
    match: 89,
    verified: true,
    reason: "Optics clear under macro scan, AF calibration passed",
    priceOriginal: 2299,
    priceNow: 1540,
  },
  {
    id: "omega-speedmaster",
    name: "Omega Speedmaster Professional",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
    gradeLabel: "Like New",
    match: 93,
    verified: true,
    reason: "Movement authenticated, papers matched to serial",
    priceOriginal: 6200,
    priceNow: 4850,
  },
  {
    id: "jordan-1-retro",
    name: "Air Jordan 1 Retro High",
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    gradeLabel: "Good",
    match: 87,
    verified: true,
    reason: "Sole wear within tolerance, no rebuild detected",
    priceOriginal: 220,
    priceNow: 148,
  },
  {
    id: "full-grain-tote",
    name: "Full-Grain Leather Tote",
    category: "Bags",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    gradeLabel: "Excellent",
    match: 91,
    verified: true,
    reason: "Hardware authenticated, no aftermarket patches",
    priceOriginal: 890,
    priceNow: 612,
  },
];

export const PREVIEW_FILTERS = ["All", ...CATEGORIES] as const;
export type PreviewFilter = (typeof PREVIEW_FILTERS)[number];

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
      "I used to scroll past hundreds of \"mint condition\" listings that weren't. Here, if it's in my feed, it already cleared four checks before I saw it.",
    name: "Marisol Ortega",
    role: "Wedding photographer, Austin TX",
    initials: "MO",
  },
  {
    quote:
      "Selling my Speedmaster, I watched it pass authentication in under a day. Knowing the exact bar it had to clear made the price easy to justify to a buyer.",
    name: "Daniel Ferreira",
    role: "Watch collector, seller since 2024",
    initials: "DF",
  },
  {
    quote:
      "Most marketplaces show you everything and let you sort it out. repick already did the sorting — I just set how strict I want the bar.",
    name: "Priya Nandakumar",
    role: "Sneaker reseller",
    initials: "PN",
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: "31,300+", label: "listings screened across four categories monthly" },
  { value: "4 stages", label: "every listing clears before it reaches a feed" },
  { value: "$2.1M", label: "paid out to verified sellers to date" },
  { value: "72 hrs", label: "average time from submission to payout" },
];
