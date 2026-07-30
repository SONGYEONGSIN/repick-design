import type { LucideIcon } from "lucide-react";
import { Sparkles, ScanSearch, TrendingDown } from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const clamp = (v: number, lo = 0, hi = 100) =>
  Math.min(hi, Math.max(lo, v));

// --- motion --------------------------------------------------------------
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

// --- hero comparison images (before = cluttered typical listing, after = refined curation) ---
export const BEFORE_IMG = {
  src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  alt: "A cluttered rack densely packed with unsorted secondhand clothing",
} as const;

export const AFTER_IMG = {
  src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
  alt: "A single secondhand garment, curated and neatly presented by Threshold AI",
} as const;

// --- domain --------------------------------------------------------------
export type Grade = "S" | "A";

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  original: number;
  discount: number;
  match: number;
  grade: Grade;
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  reasons: string[];
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "coat",
    title: "Handmade Wool Double-Breasted Coat",
    brand: "Maison Blanche",
    category: "Outerwear",
    price: 78000,
    original: 148000,
    discount: 47,
    match: 96,
    grade: "S",
    gradeLabel: "Like new",
    seller: "Verified seller · Doyun",
    sellerMeta: "214 deals · 38% repeat rate",
    reasons: ["Matches your minimal, neutral tone", "Alert for a brand you follow", "Measurements within 1cm accuracy"],
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "Wool double-breasted coat hung alone against a tidy background",
  },
  {
    id: "bag",
    title: "Leather Square Crossbody Bag",
    brand: "Atelier Noir",
    category: "Bags",
    price: 62000,
    original: 120000,
    discount: 48,
    match: 91,
    grade: "A",
    gradeLabel: "Lightly used",
    seller: "Verified seller · Seoyeon",
    sellerMeta: "132 deals · 4.9 rating",
    reasons: ["Neutral color match", "Within your ₩60,000 budget range", "48% below market price"],
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "Leather square crossbody bag placed on the floor",
  },
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers",
    brand: "Runway Archive",
    category: "Shoes",
    price: 54000,
    original: 98000,
    discount: 45,
    match: 88,
    grade: "A",
    gradeLabel: "Minor wear",
    seller: "Verified seller · Minjae",
    sellerMeta: "87 deals · 4.8 rating",
    reasons: ["Matches your 270mm size", "Expands your casual style picks", "Sole wear inspected at 8%"],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "A pair of white classic low-top sneakers",
  },
  {
    id: "rack",
    title: "Vintage Wool Chesterfield Coat",
    brand: "Aureum Vintage",
    category: "Outerwear",
    price: 89000,
    original: 152000,
    discount: 41,
    match: 93,
    grade: "S",
    gradeLabel: "Like new",
    seller: "Verified seller · Harin",
    sellerMeta: "156 deals · 32% repeat rate",
    reasons: ["Reflects your oversized-fit preference", "Grade S condition", "41% below retail price"],
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    alt: "Vintage wool Chesterfield coat hanging on a rack",
  },
];

// Deficiency signals overlaid on the general secondhand (before) side — monochrome, no info
export const BEFORE_GAPS = ["No measurements listed", "Condition unknown", "No price comparison"] as const;

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "We verify your taste",
    desc: "We reflect your likes, skips, and purchase history in real time, keeping only what fits you right now.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "We measure condition",
    desc: "Our inspection team checks measurements and flaws, surfacing only Grade S and A items.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "We compare market price",
    desc: "We compare recent sale prices against retail, showing only listings that are a fair deal right now.",
    icon: TrendingDown,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "128,000+", label: "Total resales" },
  { value: "94%", label: "Average match accuracy" },
  { value: "4.9 / 5", label: "User satisfaction" },
];

export const PROOF: Stat[] = [
  { value: "2.4×", label: "Increase in purchase conversion" },
  { value: "-63%", label: "Reduction in browsing time" },
  { value: "38%", label: "Repeat purchase rate within 3 months" },
];
