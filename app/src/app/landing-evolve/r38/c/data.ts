/**
 * Static, deterministic content for this route. Nothing here is computed
 * from `Date.now()`/`Math.random()` — every "live-looking" value (stage
 * timestamps, confidence weights) is a fixed constant, and only the
 * scrubber's *position* (user input) drives what's visible at any moment.
 */

export interface Stage {
  id: string;
  /** Full label, used in headings/ledger/live-region copy. */
  label: string;
  /** Short label for the quick-jump chips row. */
  short: string;
  /** Points this stage contributes to the 0–100 trust total once fully passed. */
  weight: number;
  /** Fixed, pre-seeded timestamp string — never `Date.now()`/`new Date()`. */
  timestamp: string;
  /** One-line evidence shown once the stage is fully confirmed. */
  detail: string;
}

/** Six chronological stages, weights sum to exactly 100. */
export const STAGES: Stage[] = [
  {
    id: "listed",
    label: "Listed",
    short: "Listed",
    weight: 8,
    timestamp: "Day 0 · 09:14",
    detail: "Seller intake form and 12 photos received.",
  },
  {
    id: "scan",
    label: "AI Photo Scan",
    short: "Scan",
    weight: 20,
    timestamp: "Day 0 · 09:52",
    detail: "38-point visual scan across all 12 photos, 0 blur flags.",
  },
  {
    id: "grading",
    label: "Condition Grading",
    short: "Grading",
    weight: 24,
    timestamp: "Day 1 · 14:10",
    detail: "Fabric wear, hardware and stitching scored — grade assigned.",
  },
  {
    id: "authenticity",
    label: "Authenticity Check",
    short: "Authenticity",
    weight: 28,
    timestamp: "Day 2 · 08:31",
    detail: "Serial, stitch pattern and hardware stamp matched to archive.",
  },
  {
    id: "priced",
    label: "Price Calibration",
    short: "Priced",
    weight: 12,
    timestamp: "Day 2 · 17:45",
    detail: "Priced against 214 comparable resale closes this quarter.",
  },
  {
    id: "sold",
    label: "Buyer Match & Sold",
    short: "Sold",
    weight: 8,
    timestamp: "Day 5 · 11:03",
    detail: "Matched to a verified buyer, payout released to the seller.",
  },
];

/** Each stage spans this many playhead units; six stages → max 600. */
export const STAGE_SPAN = 100;
export const PLAYHEAD_MAX = STAGES.length * STAGE_SPAN;

/** Fixed percentage positions of the five stage boundaries (rounded 2dp). */
export const TICK_POSITIONS = [16.67, 33.33, 50, 66.67, 83.33];

export interface ItemPreset {
  id: string;
  name: string;
  category: string;
  match: number;
  grade: string;
  cert: string;
  discountPct: number;
  priceNow: number;
  priceWas: number;
}

export const ITEMS: ItemPreset[] = [
  {
    id: "fleece",
    name: "Patagonia Retro-X Fleece",
    category: "Outerwear · Size M",
    match: 97,
    grade: "B+",
    cert: "Authenticity Verified",
    discountPct: 42,
    priceNow: 118,
    priceWas: 205,
  },
  {
    id: "boots",
    name: "Red Wing 8111 Iron Ranger",
    category: "Footwear · US 10",
    match: 94,
    grade: "A-",
    cert: "Authenticity Verified",
    discountPct: 35,
    priceNow: 189,
    priceWas: 290,
  },
  {
    id: "watch",
    name: "Seiko SKX007 Dive Watch",
    category: "Accessories · 42mm",
    match: 99,
    grade: "A",
    cert: "Authenticity Verified",
    discountPct: 48,
    priceNow: 142,
    priceWas: 275,
  },
];

/** Fixed catalog-wide facts for the value section's two "FIXED" columns. */
export const AVG_TURNAROUND = "4.9 days";
export const REJECTION_RATE = "11.6%";

export interface Quote {
  quote: string;
  name: string;
  role: string;
}

export const QUOTES: Quote[] = [
  {
    quote:
      "I watched the authenticity check happen before I paid, not after. That order of operations is the whole pitch.",
    name: "M. Alvarez",
    role: "Verified buyer",
  },
  {
    quote:
      "The grading ledger named the exact stitch they checked. First resale receipt I've read start to finish.",
    name: "D. Whitfield",
    role: "Verified buyer",
  },
  {
    quote:
      "Scrubbed through all six stages before checkout. Didn't expect a listing to carry its own paperwork like that.",
    name: "R. Tanaka",
    role: "Verified buyer",
  },
];
