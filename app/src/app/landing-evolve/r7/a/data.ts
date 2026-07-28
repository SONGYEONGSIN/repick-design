import type { LucideIcon } from "lucide-react";
import { Radar, Ruler, Wallet, BadgeCheck } from "lucide-react";

// --- generic utils -----------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ------------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
// accent #6E56CF has presence at rest — never hover-only.
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// =============================================================================
// Split-flap board engine — deterministic character scramble
// =============================================================================
// Fixed ring of glyphs a physical split-flap unit could show. No randomness:
// scrambleSequence() is a pure function of the target character + a fixed
// step count, so the exact "spin-down" sequence for any given character is
// always identical on every render, every device, every locale.
export const FLAP_ALPHABET =
  " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%$.,-+'" as const;

export const FLAP_STEPS = 6;
export const FLAP_STEP_MS = 45;
export const FLAP_ROW_STAGGER_MS = 90;
export const FLAP_COL_STAGGER_MS = 12;

function flapIndex(char: string): number {
  const i = FLAP_ALPHABET.indexOf(char.toUpperCase());
  return i === -1 ? 0 : i;
}

// Returns FLAP_STEPS glyphs, deterministically counting up through the fixed
// alphabet ring and landing on `target` as the final frame.
export function scrambleSequence(target: string): string[] {
  const targetIndex = flapIndex(target);
  const seq: string[] = [];
  for (let s = FLAP_STEPS - 1; s >= 0; s--) {
    const idx =
      (targetIndex - s + FLAP_ALPHABET.length * 3) % FLAP_ALPHABET.length;
    seq.push(FLAP_ALPHABET[idx]);
  }
  return seq;
}

// --- board domain --------------------------------------------------------
export const NAME_WIDTH = 16;

export const padName = (s: string) => s.toUpperCase().padEnd(NAME_WIDTH).slice(0, NAME_WIDTH);
export const formatMatch = (n: number) => `${n}%`;
export const formatPrice = (n: number) => `$${String(n).padStart(3, "0")}`;

export type BoardGrade = "S" | "A" | "B";

export type BoardRow = {
  item: string;
  match: number;
  grade: BoardGrade;
  price: number;
};

export type BoardCategory = {
  id: string;
  label: string;
  rows: BoardRow[];
};

export const BOARD_CATEGORIES: BoardCategory[] = [
  {
    id: "outerwear",
    label: "Outerwear",
    rows: [
      { item: "Wool Coat", match: 97, grade: "S", price: 215 },
      { item: "Denim Jacket", match: 89, grade: "A", price: 76 },
      { item: "Trench Coat", match: 93, grade: "A", price: 148 },
      { item: "Puffer Vest", match: 85, grade: "B", price: 62 },
    ],
  },
  {
    id: "bags",
    label: "Bags",
    rows: [
      { item: "Leather Tote", match: 94, grade: "S", price: 118 },
      { item: "Canvas Satchel", match: 88, grade: "A", price: 54 },
      { item: "Mini Crossbody", match: 91, grade: "A", price: 82 },
      { item: "Suede Clutch", match: 86, grade: "B", price: 45 },
    ],
  },
  {
    id: "shoes",
    label: "Shoes",
    rows: [
      { item: "Low-Top Sneaker", match: 92, grade: "A", price: 92 },
      { item: "Chelsea Boot", match: 90, grade: "S", price: 124 },
      { item: "Suede Loafer", match: 87, grade: "A", price: 68 },
      { item: "Running Shoe", match: 83, grade: "B", price: 57 },
    ],
  },
  {
    id: "tops",
    label: "Tops",
    rows: [
      { item: "Wool Sweater", match: 95, grade: "S", price: 71 },
      { item: "Oxford Shirt", match: 88, grade: "A", price: 38 },
      { item: "Silk Blouse", match: 91, grade: "A", price: 56 },
      { item: "Ribbed Tee", match: 84, grade: "B", price: 22 },
    ],
  },
];

// --- product preview (rich cards, always-visible badges) --------------------
export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  match: number;
  grade: BoardGrade;
  gradeLabel: string;
  seller: string;
  sellerTrades: string;
  price: number;
  original: number;
  discount: number;
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "coat",
    title: "Handmade Wool Double-Breasted Coat",
    brand: "Maison Blanche",
    category: "Outerwear",
    match: 97,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Dohyun",
    sellerTrades: "214 trades · 4.9 rating",
    price: 215,
    original: 420,
    discount: 49,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "Wool double-breasted coat hung alone against a plain backdrop",
  },
  {
    id: "bag",
    title: "Leather Square Crossbody Bag",
    brand: "Atelier Noir",
    category: "Bags",
    match: 94,
    grade: "S",
    gradeLabel: "Light wear only",
    seller: "Verified seller · Seoyeon",
    sellerTrades: "132 trades · 4.9 rating",
    price: 118,
    original: 240,
    discount: 51,
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "Leather square crossbody bag resting on a plain floor",
  },
  {
    id: "sneaker",
    title: "Classic Low-Top Sneakers",
    brand: "Runway Archive",
    category: "Shoes",
    match: 92,
    grade: "A",
    gradeLabel: "Minor scuffing noted",
    seller: "Verified seller · Minjae",
    sellerTrades: "87 trades · 4.8 rating",
    price: 92,
    original: 168,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
];

// --- 3-way value split --------------------------------------------------------
export type Value = {
  index: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Scan",
    desc: "Your taste profile is checked against every new listing the moment it's posted — brand archives, photos, and fit included.",
    icon: Radar,
  },
  {
    index: "02",
    title: "Grade",
    desc: "Inspectors measure wear, stitching, and hardware against a fixed 5-point condition scale before a row is ever posted.",
    icon: Ruler,
  },
  {
    index: "03",
    title: "Price-check",
    desc: "Every asking price is compared against retail and recent resales — the board only lists what's genuinely fair.",
    icon: Wallet,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "41,000+", label: "Rows posted this month" },
  { value: "94%", label: "Verdict accuracy" },
  { value: "4.9 / 5", label: "Buyer trust score" },
];

export const PROOF: Stat[] = [
  { value: "2.4x", label: "Faster to checkout" },
  { value: "-63%", label: "Less time spent browsing" },
  { value: "38%", label: "Repeat buyers within 90 days" },
];

export const TESTIMONIAL = {
  quote:
    "I stopped scrolling and started reading the board. Match, grade, price — it was all posted before I ever clicked in.",
  name: "Priya Nair",
  role: "Product manager",
} as const;

export const VERIFIED_ICON = BadgeCheck;
