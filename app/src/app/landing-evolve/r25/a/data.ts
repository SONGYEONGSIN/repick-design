// Fair Price Matrix — fixed reference data for repick's condition x age resale-price grid.
// All numbers are editorial baseline estimates (dummy data), not live market data.

export type Grade = {
  label: string;
  short: string;
  hint: string;
};

export const GRADES: Grade[] = [
  { label: "Like New", short: "LN", hint: "No visible wear, full original kit" },
  { label: "Excellent", short: "EX", hint: "Light handling marks only" },
  { label: "Good", short: "GD", hint: "Visible brassing, fully functional" },
  { label: "Fair", short: "FR", hint: "Heavy wear, tested and working" },
];

export type AgeBracket = {
  label: string;
  short: string;
};

export const AGE_BRACKETS: AgeBracket[] = [
  { label: "0–1 yr since release", short: "0–1 yr" },
  { label: "1–2 yr since release", short: "1–2 yr" },
  { label: "2–3 yr since release", short: "2–3 yr" },
  { label: "3–5 yr since release", short: "3–5 yr" },
  { label: "5+ yr since release", short: "5+ yr" },
];

// Retention as % of reference MSRP. Rows = GRADES order, columns = AGE_BRACKETS order.
export const PRICE_MATRIX: number[][] = [
  [92, 85, 78, 68, 55], // Like New
  [85, 78, 71, 61, 49], // Excellent
  [75, 68, 61, 52, 41], // Good
  [62, 55, 49, 41, 32], // Fair
];

// "Beats X% of comparable active listings" — how competitively the baseline is priced.
export const PERCENTILE_MATRIX: number[][] = [
  [96, 91, 84, 74, 58],
  [90, 83, 76, 65, 51],
  [79, 71, 64, 54, 42],
  [64, 56, 49, 40, 29],
];

export const REFERENCE_ITEM = {
  name: "Sony a7 IV body",
  msrp: 2498,
};

export const DEFAULT_GRADE_INDEX = 1; // Excellent
export const DEFAULT_AGE_INDEX = 2; // 2-3 yr

export type Listing = {
  id: string;
  name: string;
  category: "Mirrorless" | "Lens" | "Medium Format" | "Film";
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
    tags: ["Shutter count verified", "Sensor spotless", "Original box included"],
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
    tags: ["Optics clear, no fungus", "Light barrel wear", "AF calibrated"],
  },
  {
    id: "hasselblad-907x",
    name: "Hasselblad 907X",
    category: "Medium Format",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    gradeLabel: "Excellent",
    match: 91,
    verified: true,
    priceOriginal: 6399,
    priceNow: 4850,
    tags: ["Sensor block inspected", "Under 4,000 actuations"],
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
  {
    id: "sony-85gm",
    name: "Sony 85mm f/1.4 GM",
    category: "Lens",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    gradeLabel: "Like New",
    match: 97,
    verified: true,
    priceOriginal: 1798,
    priceNow: 1430,
    tags: ["Zero marks on barrel", "Hood and caps included"],
  },
];

export const CATEGORIES = ["All", "Mirrorless", "Lens", "Medium Format", "Film"] as const;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I priced my a7 IV against the matrix before listing anywhere else. Sold in four days, no haggling.",
    name: "Marisol Ortega",
    role: "Wedding photographer, Austin TX",
    initials: "MO",
  },
  {
    quote:
      "The grade-by-age breakdown matched what a local shop quoted me almost exactly. Saved me a trip.",
    name: "Daniel Ferreira",
    role: "Landscape photographer",
    initials: "DF",
  },
  {
    quote:
      "Buying used gear used to mean guessing. Now I can see exactly why a body is priced where it is.",
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
  { value: "38,200+", label: "items priced against the matrix" },
  { value: "$21.4M", label: "paid out to sellers to date" },
  { value: "4.9 / 5", label: "average seller rating" },
  { value: "72 hrs", label: "average time to payout" },
];
