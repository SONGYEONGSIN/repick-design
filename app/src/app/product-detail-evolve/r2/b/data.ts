// Anvil Type Co. — Anvil TKL-75 product-detail data.
// Every value below is a fixed literal: no Math.random, no Date.now, no `new Date()`. Review dates
// are plain display strings and `order` is a hand-set integer used only for deterministic sorting —
// nothing here derives from the clock at render time, so server and client markup always match.

export const BRAND = "Anvil Type Co.";
export const PRODUCT_NAME = "Anvil TKL-75";
export const SKU_LINE = "Certified-refurbished 75% mechanical keyboard, hot-swap PCB";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function usd(dollars: number): string {
  // Whole-dollar integers only — formatted by hand with a thousands separator so server and client
  // never disagree the way an Intl locale lookup occasionally can.
  const s = Math.trunc(dollars).toString();
  return `$${s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// ---------------------------------------------------------------- Condition grade (resale core)

export type GradeId = "grade-a" | "grade-b" | "grade-c";

export interface Grade {
  id: GradeId;
  short: string;
  label: string;
  price: number;
  condition: string;
  warranty: string;
  shipsIn: string;
  stock: number;
}

export const GRADES: Grade[] = [
  {
    id: "grade-a",
    short: "Grade A",
    label: "Grade A — Like New",
    price: 179,
    condition: "No visible wear. Retail box, foam and accessories retained.",
    warranty: "18-month Anvil warranty",
    shipsIn: "Ships in 3 business days (post-inspection)",
    stock: 6,
  },
  {
    id: "grade-b",
    short: "Grade B",
    label: "Grade B — Excellent",
    price: 149,
    condition: "Faint keycap sheen on primary keys. Case free of marks.",
    warranty: "12-month Anvil warranty",
    shipsIn: "Ships in 2 business days",
    stock: 11,
  },
  {
    id: "grade-c",
    short: "Grade C",
    label: "Grade C — Good",
    price: 119,
    condition: "Visible case scuffs on the underside. Electronics bench-tested.",
    warranty: "6-month Anvil warranty",
    shipsIn: "Ships next business day — clearance stock",
    stock: 3,
  },
];

// ---------------------------------------------------------------- Switch (live-recalculated feel)

export type SwitchId = "linear" | "tactile" | "clicky";

export interface SwitchOption {
  id: SwitchId;
  label: string;
  swatch: string;
  delta: number;
  actuationG: number;
  soundDb: number;
  soundDesc: string;
  travelMm: number;
  lifecycle: string;
  bestFor: string;
}

export const SWITCHES: SwitchOption[] = [
  {
    id: "linear",
    label: "Garnet Linear",
    swatch: "#B91C1C",
    delta: 0,
    actuationG: 45,
    soundDb: 52,
    soundDesc: "Quiet — desk and call friendly",
    travelMm: 4.0,
    lifecycle: "80M keystroke rated",
    bestFor: "Fast repeat inputs, low finger fatigue",
  },
  {
    id: "tactile",
    label: "Amber Tactile",
    swatch: "#B45309",
    delta: 8,
    actuationG: 55,
    soundDb: 58,
    soundDesc: "Moderate — a contained click per bump",
    travelMm: 4.0,
    lifecycle: "70M keystroke rated",
    bestFor: "Typing feedback without office noise",
  },
  {
    id: "clicky",
    label: "Cobalt Clicky",
    swatch: "#1D4ED8",
    delta: 12,
    actuationG: 60,
    soundDb: 68,
    soundDesc: "Loud — headphones recommended nearby",
    travelMm: 4.0,
    lifecycle: "65M keystroke rated",
    bestFor: "Tactile plus audible confirmation",
  },
];

// ---------------------------------------------------------------- Bundle add-ons

export type AddonId = "deskmat" | "switches10" | "cable" | "keycaps";

export interface Addon {
  id: AddonId;
  label: string;
  detail: string;
  price: number;
}

export const ADDONS: Addon[] = [
  { id: "deskmat", label: "Anvil Deskmat XL", detail: "900 x 400 mm, stitched edge", price: 24 },
  { id: "switches10", label: "Spare switch 10-pack", detail: "Same profile as your selection", price: 18 },
  { id: "cable", label: "USB-C coiled cable", detail: "1.8 m, aviator connector", price: 16 },
  { id: "keycaps", label: "PBT keycap set upgrade", detail: "Dye-sublimated, matches case", price: 34 },
];

// ---------------------------------------------------------------- Compatibility notes

export const COMPAT_NOTES: string[] = [
  "ANSI 75% (84-key) keycap sets — standard bottom row",
  "Cherry MX-style switches — hot-swap, no soldering required",
  "USB-C to USB-A cable included; USB-C to USB-C also supported",
  "VIA and QMK firmware — remap keys without extra software",
];

// ---------------------------------------------------------------- Specifications

export interface SpecItem {
  label: string;
  value: string;
}

export interface SpecSection {
  id: string;
  title: string;
  items: SpecItem[];
}

export const STATIC_SPEC_SECTIONS: SpecSection[] = [
  {
    id: "deck",
    title: "Deck & construction",
    items: [
      { label: "Layout", value: "75% (84-key), ANSI" },
      { label: "Case material", value: "CNC-milled aluminum, two-tone" },
      { label: "Plate material", value: "FR4 polycarbonate, gasket-mounted" },
      { label: "Hot-swap PCB", value: "5-pin, south-facing" },
      { label: "Weight", value: "920 g" },
    ],
  },
  {
    id: "connectivity",
    title: "Connectivity & firmware",
    items: [
      { label: "Interface", value: "USB-C wired, detachable" },
      { label: "Polling rate", value: "1000 Hz" },
      { label: "Key rollover", value: "N-key rollover (NKRO)" },
      { label: "Firmware", value: "QMK / VIA compatible, open source" },
    ],
  },
];

// ---------------------------------------------------------------- Reviews

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  order: number;
  helpful: number;
  gradeBought: GradeId;
}

export const REVIEWS: Review[] = [
  {
    id: "rv-1",
    author: "P. Novak",
    role: "Software engineer",
    rating: 5,
    title: "Grade B unit looked brand new",
    body: "Went in expecting light shelf wear and found none I could see under desk lighting. Hot-swapped in tactiles the same night with zero issues.",
    date: "Jul 18, 2026",
    order: 6,
    helpful: 142,
    gradeBought: "grade-b",
  },
  {
    id: "rv-2",
    author: "H. Ibarra",
    role: "UX writer",
    rating: 5,
    title: "Tactile switches feel factory-fresh",
    body: "Bought Grade A specifically to avoid any switch wear, and it paid off — the bump is consistent across every key, no scratchiness anywhere on the board.",
    date: "Jul 02, 2026",
    order: 5,
    helpful: 98,
    gradeBought: "grade-a",
  },
  {
    id: "rv-3",
    author: "C. Duffy",
    role: "Support engineer",
    rating: 4,
    title: "Grade C scuffs are exactly as described",
    body: "The underside has the cosmetic marks the listing showed, nothing on the top or in typing feel. Saved real money for a board that works perfectly.",
    date: "Jun 21, 2026",
    order: 4,
    helpful: 51,
    gradeBought: "grade-c",
  },
  {
    id: "rv-4",
    author: "M. Solheim",
    role: "Streamer",
    rating: 5,
    title: "Clicky switches are the loud fun kind",
    body: "Viewers can hear every keystroke on stream, which is exactly what I wanted. Case has zero flex and the feet grip the desk well.",
    date: "Jun 05, 2026",
    order: 3,
    helpful: 77,
    gradeBought: "grade-b",
  },
  {
    id: "rv-5",
    author: "A. Reyes",
    role: "Technical writer",
    rating: 3,
    title: "Great board, warranty claim took a week",
    body: "Typing experience is excellent, but a stuck key needed a warranty exchange and the turnaround was slower than I'd have liked. Board itself has no complaints.",
    date: "May 22, 2026",
    order: 2,
    helpful: 19,
    gradeBought: "grade-a",
  },
  {
    id: "rv-6",
    author: "J. Kowalski",
    role: "QA tester",
    rating: 4,
    title: "Hot-swap made switching trivial",
    body: "Pulled the stock switches with the included tool in under ten minutes, no desoldering. Would like a few more spare switches in the box, otherwise no issues.",
    date: "May 09, 2026",
    order: 1,
    helpful: 34,
    gradeBought: "grade-c",
  },
];

export const RATING_SUMMARY = {
  average: 4.6,
  count: 227,
  distribution: [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 22 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ],
} as const;

export const TRUST_ROW_ITEMS = [
  { key: "shipping", text: "Free shipping over $150" },
  { key: "inspection", text: "Every unit bench-tested before listing" },
  { key: "returns", text: "30-day return window" },
] as const;
