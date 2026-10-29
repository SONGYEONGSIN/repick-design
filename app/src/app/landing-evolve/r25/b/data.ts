// Deterministic data for the "Authentication Confidence Ring" landing — a multi-segment radial
// arc, one fixed-weight segment per verification method. No Math.random() / Date.now(): every
// number below is a fixed literal, and every derived value (confidence %, ring geometry, "next
// best" suggestion) is a pure function of the toggle state the visitor controls. See
// candidates/b.md "브리프에 없던 것" for the weight/gap rationale.

export type MethodId = "visual" | "serial" | "expert" | "provenance";

export type Method = {
  id: MethodId;
  label: string;
  short: string;
  weight: number;
  description: string;
};

// Fixed order = fixed ring position. Weights sum to exactly 100, so the ring's active arc length
// always equals the confidence percentage shown at its center — no separate renormalization step.
export const METHODS: Method[] = [
  {
    id: "visual",
    label: "Visual inspection",
    short: "Visual",
    weight: 24,
    description:
      "A repick specialist checks body, glass and shutter against 40 reference photo angles.",
  },
  {
    id: "serial",
    label: "Serial-number lookup",
    short: "Serial",
    weight: 27,
    description:
      "The serial is run against manufacturer recall, theft-report and warranty databases.",
  },
  {
    id: "expert",
    label: "Expert review",
    short: "Expert",
    weight: 31,
    description:
      "A second specialist re-grades the item blind, without seeing the first result.",
  },
  {
    id: "provenance",
    label: "Provenance check",
    short: "Provenance",
    weight: 18,
    description:
      "Ownership history is traced back through every prior sale recorded on repick.",
  },
];

export const TOTAL_WEIGHT = METHODS.reduce((sum, m) => sum + m.weight, 0); // 100

// Default: three of four on, never the 0% or 100% boundary — see b.md.
export const DEFAULT_ACTIVE: MethodId[] = ["visual", "serial", "expert"];

export function confidenceOf(active: Set<MethodId>): number {
  return METHODS.reduce((sum, m) => sum + (active.has(m.id) ? m.weight : 0), 0);
}

export function nextBest(active: Set<MethodId>): Method | null {
  const inactive = METHODS.filter((m) => !active.has(m.id));
  if (inactive.length === 0) return null;
  return [...inactive].sort((a, b) => b.weight - a.weight)[0];
}

export function strongestActive(active: Set<MethodId>): Method | null {
  const on = METHODS.filter((m) => active.has(m.id));
  if (on.length === 0) return null;
  return [...on].sort((a, b) => b.weight - a.weight)[0];
}

export function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function discountPct(ask: number, market: number): number {
  return Math.round((1 - ask / market) * 100);
}

export const HERO_ITEM = {
  name: "Fujifilm X100V",
  category: "Cameras",
  detail: "Compact prime · leather half-case · 6,200 actuations",
  askPrice: 980,
  marketValue: 1390,
  match: 91,
  conditionGrade: "A-",
  sellerTrades: 84,
  sellerRating: 4.9,
  photoId: "1489987707025-afc232f7ea0f",
  alt: "Black compact mirrorless camera with a fixed prime lens on a neutral background",
};

export type PreviewListing = {
  id: string;
  name: string;
  detail: string;
  grade: string;
  askPrice: number;
  marketValue: number;
  match: number;
  methodsUsed: MethodId[];
  tags: string[];
  photoId: string;
  alt: string;
};

export const PREVIEW_LISTINGS: PreviewListing[] = [
  {
    id: "sony-a7iii",
    name: "Sony a7 III body",
    detail: "24.2MP full-frame · 2 batteries · 41k actuations",
    grade: "B+",
    askPrice: 920,
    marketValue: 1250,
    match: 88,
    methodsUsed: ["visual", "serial", "expert"],
    tags: [
      "Same sensor generation as your saved search",
      "Shutter count under your 50k ceiling",
      "Priced below the last 90 days of comparable sales",
    ],
    photoId: "1543076447-215ad9ba6923",
    alt: "Black full-frame mirrorless camera body on a neutral background",
  },
  {
    id: "canon-rf50",
    name: "Canon RF 50mm f/1.2L",
    detail: "Prime lens · original hood & caps · no fungus",
    grade: "A",
    askPrice: 1740,
    marketValue: 2299,
    match: 95,
    methodsUsed: ["visual", "serial", "expert", "provenance"],
    tags: [
      "Matches your saved RF-mount prime filter",
      "Optics graded clean under macro light",
      "One prior owner, full service history",
    ],
    photoId: "1560243563-062bfc001d68",
    alt: "Camera prime lens standing upright on a neutral background",
  },
  {
    id: "leica-q2",
    name: "Leica Q2 compact",
    detail: "28mm fixed lens · weather sealed · 9k actuations",
    grade: "B",
    askPrice: 3650,
    marketValue: 4450,
    match: 79,
    methodsUsed: ["visual", "serial"],
    tags: [
      "Fixed 28mm matches your last 3 saved items",
      "Below the regional average for this shutter count",
    ],
    photoId: "1608256246200-53e635b5b65f",
    alt: "Compact black rangefinder-style camera on a neutral background",
  },
];

export const TESTIMONIALS: { name: string; quote: string; rating: number; context: string }[] = [
  {
    name: "Marcus T.",
    quote:
      "I turned off expert review just to watch the ring shrink, then switched it back on. First marketplace that shows its work.",
    rating: 5,
    context: "Bought a Sony body, Denver",
  },
  {
    name: "Aiko F.",
    quote:
      "The provenance check confirmed the lens had one prior owner. Worth the extra two days before it shipped.",
    rating: 5,
    context: "Bought a Canon lens, Seattle",
  },
  {
    name: "Devraj S.",
    quote:
      "As a seller, adding expert review moved my listing's ring past 80 percent within a day.",
    rating: 4,
    context: "Sold a Leica, Toronto",
  },
];

export const TRUST_STATS: { label: string; value: string }[] = [
  { label: "Verified listings", value: "9,300+" },
  { label: "Avg. confidence at sale", value: "86%" },
  { label: "Median verification time", value: "36 hrs" },
];
