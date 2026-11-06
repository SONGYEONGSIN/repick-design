// app/src/app/landing-evolve/r38/b/data.ts
//
// Fixed, deterministic content. Nothing here is random or date-derived —
// every number a visitor sees is either one of these literals or a pure
// function of them (see score-math.ts). Four real resale categories
// (sneakers, outerwear, bag, watch) per the brief's own suggestion, each
// with its own four fixed annotation boxes placed by hand at the detail
// they actually describe (toe stitching, hem wear, hardware, strap) rather
// than evenly spaced arbitrary points.

export interface AnnotationBox {
  id: string;
  /** What the AI overlay says about this exact spot. */
  label: string;
  /** true = a flagged imperfection (amber), false = a clear/verified read (cyan). */
  flaw: boolean;
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
}

export interface Listing {
  id: string;
  title: string;
  category: string;
  /** Unsplash photo id — fixed, hand-picked, never seed/random based. */
  photoId: string;
  alt: string;
  price: number;
  originalPrice: number;
  /** Static catalog grade shown in the Product preview section (section 2). */
  grade: "Good" | "Very good" | "Like new";
  certified: boolean;
  /** AI confidence at reveal = 0 (raw photo only, no overlay shown yet). */
  baseConfidence: number;
  /** AI confidence at reveal = 100 (overlay fully revealed). */
  maxConfidence: number;
  boxes: AnnotationBox[];
}

export const LISTINGS: Listing[] = [
  {
    id: "sneakers",
    title: "Low-Top Court Sneakers",
    category: "Sneakers",
    photoId: "1549298916-b41d501d3772",
    alt: "White low-top court sneakers photographed against a plain background",
    price: 72,
    originalPrice: 150,
    grade: "Like new",
    certified: true,
    baseConfidence: 54,
    maxConfidence: 97,
    boxes: [
      { id: "toe", label: "Toe cap stitching: consistent", flaw: false, leftPct: 38, topPct: 18, widthPct: 16, heightPct: 14 },
      { id: "sole", label: "Outsole wear: minor", flaw: true, leftPct: 16, topPct: 62, widthPct: 16, heightPct: 16 },
      { id: "tread", label: "Tread pattern: original", flaw: false, leftPct: 60, topPct: 68, widthPct: 16, heightPct: 14 },
      { id: "tag", label: "Authenticity tag: verified", flaw: false, leftPct: 80, topPct: 32, widthPct: 14, heightPct: 14 },
    ],
  },
  {
    id: "jacket",
    title: "Waxed Leather Field Jacket",
    category: "Outerwear",
    photoId: "1441986300917-64674bd600d8",
    alt: "Brown waxed leather field jacket laid flat against a plain background",
    price: 118,
    originalPrice: 260,
    grade: "Good",
    certified: true,
    baseConfidence: 61,
    maxConfidence: 95,
    boxes: [
      { id: "collar", label: "Collar stitching: consistent", flaw: false, leftPct: 30, topPct: 16, widthPct: 16, heightPct: 14 },
      { id: "lining", label: "Lining: matches original", flaw: false, leftPct: 52, topPct: 46, widthPct: 16, heightPct: 16 },
      { id: "hem", label: "Hem wear: light", flaw: true, leftPct: 24, topPct: 78, widthPct: 16, heightPct: 14 },
      { id: "label", label: "Maker label: verified", flaw: false, leftPct: 74, topPct: 34, widthPct: 14, heightPct: 14 },
    ],
  },
  {
    id: "bag",
    title: "Hand-Woven Raffia Tote",
    category: "Bags",
    photoId: "1485462537746-965f33f7f6a7",
    alt: "Hand-woven natural raffia tote bag photographed against a plain background",
    price: 36,
    originalPrice: 85,
    grade: "Like new",
    certified: false,
    baseConfidence: 48,
    maxConfidence: 99,
    boxes: [
      { id: "weave", label: "Weave pattern: consistent", flaw: false, leftPct: 22, topPct: 28, widthPct: 16, heightPct: 16 },
      { id: "handle", label: "Handle stitching: original", flaw: false, leftPct: 52, topPct: 14, widthPct: 16, heightPct: 14 },
      { id: "hardware", label: "Hardware: unbranded", flaw: true, leftPct: 40, topPct: 58, widthPct: 16, heightPct: 14 },
      { id: "base", label: "Base wear: minor", flaw: true, leftPct: 70, topPct: 72, widthPct: 16, heightPct: 14 },
    ],
  },
  {
    id: "watch",
    title: "Automatic Chronograph Watch",
    category: "Watches",
    photoId: "1524805444758-089113d48a6d",
    alt: "Automatic chronograph watch with a metal bracelet photographed against a plain background",
    price: 215,
    originalPrice: 420,
    grade: "Very good",
    certified: true,
    baseConfidence: 58,
    maxConfidence: 93,
    boxes: [
      { id: "caseback", label: "Case back engraving: verified", flaw: false, leftPct: 30, topPct: 38, widthPct: 16, heightPct: 16 },
      { id: "crown", label: "Crown: original", flaw: false, leftPct: 62, topPct: 22, widthPct: 14, heightPct: 14 },
      { id: "strap", label: "Strap: aftermarket", flaw: true, leftPct: 44, topPct: 70, widthPct: 16, heightPct: 14 },
      { id: "movement", label: "Movement serial: match", flaw: false, leftPct: 76, topPct: 48, widthPct: 16, heightPct: 14 },
    ],
  },
];

/** Every listing ships exactly 4 boxes by design, so counts compare like-for-like across the tab set. */
export const TOTAL_BOXES = LISTINGS[0].boxes.length;

export const QUOTES = [
  {
    name: "Dana R.",
    role: "bought the chronograph watch",
    quote:
      "I dragged until the strap flag showed up before paying. It's aftermarket, which the listing page never says outright — the overlay is the only place that's on record.",
  },
  {
    name: "Wes T.",
    role: "bought the field jacket",
    quote:
      "The hem-wear flag was still sitting there at full reveal. Knowing the AI kept it visible instead of quietly folding it into one score mattered more than the number itself.",
  },
  {
    name: "Ines P.",
    role: "sold the raffia tote",
    quote:
      "Buyers kept dragging past the halfway point on my own listing before messaging me. Nobody paid at the base read — everyone pulled it further first.",
  },
] as const;

export const CATALOG_STATS = [
  { value: "48,000+", label: "listings carrying this exact scan at checkout" },
  { value: "86%", label: "of buyers drag past the halfway point before paying" },
] as const;
