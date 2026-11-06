// Gatelist — a resale marketplace that only shows you listings that clear the
// requirement gates you personally care about.
//
// Every count on this page is derived, at render time, from the fixed POOL below and
// whichever gates are currently switched on — the derivation is pure arithmetic over
// static data, with no randomness and no clock reads anywhere, so the page renders
// identically on the server and the client (and identically on every reload) until a
// person actually touches a toggle.

import {
  ShieldCheck,
  PackageCheck,
  Sparkles,
  Truck,
  BadgeDollarSign,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Gates — five independent buyer requirements, evaluated IN THIS FIXED ORDER.
// Order matters: a listing that fails an earlier active gate never reaches a later
// one, which is what makes this a true cascading pipeline rather than an unordered
// set of five separate filters.

export type GateKey =
  | "verifiedSeller"
  | "originalPackaging"
  | "noVisibleWear"
  | "shipsIn24h"
  | "priceMatched";

export type Gate = {
  key: GateKey;
  label: string;
  shortLabel: string;
  helper: string;
  Icon: LucideIcon;
};

export const GATES: Gate[] = [
  {
    key: "verifiedSeller",
    label: "Verified seller only",
    shortLabel: "Verified seller",
    helper: "Seller identity and return history checked by Gatelist",
    Icon: ShieldCheck,
  },
  {
    key: "originalPackaging",
    label: "Original packaging included",
    shortLabel: "Orig. packaging",
    helper: "Box, manuals and accessories present as sold new",
    Icon: PackageCheck,
  },
  {
    key: "noVisibleWear",
    label: "No visible wear",
    shortLabel: "No visible wear",
    helper: "Graded Excellent or Like New under macro photo review",
    Icon: Sparkles,
  },
  {
    key: "shipsIn24h",
    label: "Ships within 24 hours",
    shortLabel: "Ships in 24h",
    helper: "Seller has dispatched every order same-day or next-day",
    Icon: Truck,
  },
  {
    key: "priceMatched",
    label: "Price-matched guarantee",
    shortLabel: "Price match",
    helper: "Covered if Gatelist finds the same grade cheaper in 14 days",
    Icon: BadgeDollarSign,
  },
];

// Default state: two of five gates on. Chosen so the default view is already a live,
// non-degenerate demonstration of the mechanic (5 of 10 qualify below) rather than
// either extreme — all toggles off would just show the full, unfiltered pool (the
// mechanic would look like it does nothing), and all five on by default would hide
// how much a visitor's own choices change the result.
export const DEFAULT_ACTIVE_GATES: GateKey[] = ["verifiedSeller", "noVisibleWear"];

// ---------------------------------------------------------------------------
// Listing pool

export type Grade = "Fair" | "Good" | "Excellent" | "Like New";

export type Listing = {
  id: string;
  name: string;
  category: string;
  image: string;
  grade: Grade;
  match: number;
  priceOriginal: number;
  priceNow: number;
  reason: string;
  gates: Record<GateKey, boolean>;
};

export const LISTINGS: Listing[] = [
  {
    id: "sony-a7iv",
    name: "Sony a7 IV",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56",
    grade: "Excellent",
    match: 94,
    priceOriginal: 2498,
    priceNow: 1674,
    reason: "Shutter count verified low, no sensor dust, seller ships from own studio",
    gates: {
      verifiedSeller: true,
      originalPackaging: false,
      noVisibleWear: true,
      shipsIn24h: true,
      priceMatched: false,
    },
  },
  {
    id: "leica-m6",
    name: "Leica M6",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
    grade: "Like New",
    match: 97,
    priceOriginal: 4750,
    priceNow: 3600,
    reason: "Rangefinder aligned, meter tested accurate, full box included",
    gates: {
      verifiedSeller: true,
      originalPackaging: true,
      noVisibleWear: true,
      shipsIn24h: false,
      priceMatched: true,
    },
  },
  {
    id: "fuji-x100v",
    name: "Fujifilm X100V",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    grade: "Like New",
    match: 98,
    priceOriginal: 1399,
    priceNow: 905,
    reason: "Leaf shutter tested, zero marks on the body, ships next day",
    gates: {
      verifiedSeller: true,
      originalPackaging: true,
      noVisibleWear: true,
      shipsIn24h: true,
      priceMatched: true,
    },
  },
  {
    id: "hasselblad-907x",
    name: "Hasselblad 907X",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    grade: "Excellent",
    match: 90,
    priceOriginal: 6399,
    priceNow: 4850,
    reason: "Sensor block inspected, under 4,000 actuations, private seller",
    gates: {
      verifiedSeller: false,
      originalPackaging: true,
      noVisibleWear: true,
      shipsIn24h: false,
      priceMatched: false,
    },
  },
  {
    id: "sony-85gm",
    name: "Sony 85mm f/1.4 GM",
    category: "Lens",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    grade: "Good",
    match: 86,
    priceOriginal: 1798,
    priceNow: 1430,
    reason: "Optics clear, light barrel wear, dispatched from verified studio",
    gates: {
      verifiedSeller: true,
      originalPackaging: false,
      noVisibleWear: false,
      shipsIn24h: true,
      priceMatched: false,
    },
  },
  {
    id: "canon-rf-2470",
    name: "Canon RF 24–70mm f/2.8L",
    category: "Lens",
    image: "https://images.unsplash.com/photo-1560243563-062bfc001d68",
    grade: "Fair",
    match: 83,
    priceOriginal: 2299,
    priceNow: 1540,
    reason: "AF calibration passed, cosmetic marks on the hood only",
    gates: {
      verifiedSeller: true,
      originalPackaging: false,
      noVisibleWear: false,
      shipsIn24h: false,
      priceMatched: true,
    },
  },
  {
    id: "omega-speedmaster",
    name: "Omega Speedmaster Professional",
    category: "Watch",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
    grade: "Excellent",
    match: 92,
    priceOriginal: 6400,
    priceNow: 4288,
    reason: "Movement serviced within 12 months, papers on file",
    gates: {
      verifiedSeller: true,
      originalPackaging: true,
      noVisibleWear: true,
      shipsIn24h: true,
      priceMatched: false,
    },
  },
  {
    id: "jordan-1-retro",
    name: "Air Jordan 1 Retro High",
    category: "Sneaker",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    grade: "Good",
    match: 88,
    priceOriginal: 220,
    priceNow: 148,
    reason: "Sole wear within tolerance, no rebuild detected on scan",
    gates: {
      verifiedSeller: true,
      originalPackaging: true,
      noVisibleWear: false,
      shipsIn24h: false,
      priceMatched: true,
    },
  },
  {
    id: "peak-design-pack",
    name: "Peak Design Everyday Backpack",
    category: "Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    grade: "Excellent",
    match: 90,
    priceOriginal: 280,
    priceNow: 162,
    reason: "Zippers and straps intact, light shelf wear only, ships same day",
    gates: {
      verifiedSeller: true,
      originalPackaging: false,
      noVisibleWear: true,
      shipsIn24h: true,
      priceMatched: false,
    },
  },
  {
    id: "leather-tote",
    name: "Full-Grain Leather Tote",
    category: "Bag",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    grade: "Like New",
    match: 89,
    priceOriginal: 890,
    priceNow: 612,
    reason: "Hardware authenticated, no aftermarket patches, private seller",
    gates: {
      verifiedSeller: false,
      originalPackaging: false,
      noVisibleWear: true,
      shipsIn24h: true,
      priceMatched: true,
    },
  },
];

export const POOL_COUNT = LISTINGS.length;

export const CATEGORIES = [
  "All",
  ...Array.from(new Set(LISTINGS.map((l) => l.category))),
] as const;
export type Category = (typeof CATEGORIES)[number];

// ---------------------------------------------------------------------------
// Gate-chain evaluation — the actual cascading pipeline logic.

export type GateStepStatus = "pass" | "fail" | "bypassed" | "unreached";

export type ListingEvaluation = {
  steps: GateStepStatus[];
  qualifies: boolean;
  /** Index of the first active gate this listing failed, or null if it passed everything. */
  stopAt: number | null;
};

/** Runs ONE listing through the five gates, in pipeline order, stopping at the first
 *  active gate it fails. An inactive (toggled-off) gate always passes through
 *  ("bypassed") regardless of the listing's own attribute — it simply is not being
 *  enforced right now. Once a listing has stopped, every later gate is "unreached":
 *  the pipeline never evaluates it, which is the visual difference between "this
 *  listing failed a check" and "this listing never got that far". */
export function evaluateListing(listing: Listing, activeGates: ReadonlySet<GateKey>): ListingEvaluation {
  let stopped = false;
  let stopAt: number | null = null;
  const steps: GateStepStatus[] = GATES.map((gate, i) => {
    if (stopped) return "unreached";
    if (!activeGates.has(gate.key)) return "bypassed";
    const passes = listing.gates[gate.key];
    if (!passes) {
      stopped = true;
      stopAt = i;
      return "fail";
    }
    return "pass";
  });
  return { steps, qualifies: !stopped, stopAt };
}

/** Cumulative remaining-after-each-stage counts: index 0 is the full pool, index i
 *  (1..GATES.length) is how many listings have survived gates[0..i-1] applied in
 *  order. Only active gates actually remove anything from the running total — an
 *  inactive gate carries the previous count forward unchanged. This is the "running
 *  qualifying count that updates live" the gate-chain section quotes per stage. */
export function cascadeCounts(listings: Listing[], activeGates: ReadonlySet<GateKey>): number[] {
  const counts: number[] = [listings.length];
  let remaining = listings;
  for (const gate of GATES) {
    if (activeGates.has(gate.key)) {
      remaining = remaining.filter((l) => l.gates[gate.key]);
    }
    counts.push(remaining.length);
  }
  return counts;
}

export function qualifyingListings(listings: Listing[], activeGates: ReadonlySet<GateKey>): Listing[] {
  return listings.filter((l) => evaluateListing(l, activeGates).qualifies);
}

/** The single best-match listing among whatever currently qualifies, for the closing
 *  CTA's "top pick" line. Ties broken by pool order (stable, not by any timestamp). */
export function topPick(listings: Listing[], activeGates: ReadonlySet<GateKey>): Listing | null {
  const qualifying = qualifyingListings(listings, activeGates);
  if (qualifying.length === 0) return null;
  return qualifying.reduce((best, l) => (l.match > best.match ? l : best), qualifying[0]);
}

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.priceNow / listing.priceOriginal) * 100);
}

// ---------------------------------------------------------------------------
// Social proof

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "62,400+", label: "listings run through the gate chain every week" },
  { value: "4 hrs", label: "maximum time between a listing going live and re-verification" },
  { value: "99.1%", label: "of “qualified” orders arrive matching every gate shown" },
  { value: "3.2%", label: "return rate on gate-qualified orders, company-wide" },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I turned on seller verification and original packaging and watched the count drop from forty-something to six in real time. That's the first resale site that showed its work.",
    name: "Priah Okafor",
    role: "Repeat buyer, cameras",
    initials: "PO",
  },
  {
    quote:
      "Most marketplaces let you filter by category. Gatelist lets me filter by what I actually refuse to compromise on, and shows me exactly which listings got cut and why.",
    name: "Marcus Lindqvist",
    role: "Verified buyer, watches",
    initials: "ML",
  },
  {
    quote:
      "The price-matched guarantee gate alone paid for itself twice. I like that switching it off shows the extra listings instead of just hiding a badge.",
    name: "Elena Furst",
    role: "Verified buyer, bags",
    initials: "EF",
  },
];

export const BRAND_NAME = "Gatelist";
