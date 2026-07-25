import type { LucideIcon } from "lucide-react";
import { Fingerprint, Ruler, Scale } from "lucide-react";

// --- utils -----------------------------------------------------------------
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

// --- fixed document metadata (no Date.now()/new Date() — static strings only) --
export const ISSUED = "Issued 07.25.2026" as const;
export const LAB = "repick Authentication Lab" as const;
export const CASE_FILE = "Case File RP-260725" as const;

// --- domain ------------------------------------------------------------------
export type Grade = "S" | "A";

export type CertItem = {
  id: string;
  exhibit: string;
  serial: string;
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
  priceVerdict: string;
  findings: string[];
  image: string;
  alt: string;
};

export const PRODUCTS: CertItem[] = [
  {
    id: "coat",
    exhibit: "Exhibit A",
    serial: "RP-260725-A",
    title: "Handmade Wool Double-Breasted Coat",
    brand: "Maison Blanche",
    category: "Outerwear",
    price: 215,
    original: 420,
    discount: 49,
    match: 96,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Dohyun",
    sellerMeta: "214 trades · 38% repeat buyers",
    priceVerdict: "Fair — 49% under retail comps",
    findings: [
      "Palette matches your saved neutral profile",
      "Flagged the moment this brand relisted",
      "Measurements within 1cm of your size card",
    ],
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "Wool double-breasted coat hung alone against a plain backdrop",
  },
  {
    id: "bag",
    exhibit: "Exhibit B",
    serial: "RP-260725-B",
    title: "Leather Square Crossbody Bag",
    brand: "Atelier Noir",
    category: "Bags",
    price: 118,
    original: 240,
    discount: 51,
    match: 91,
    grade: "A",
    gradeLabel: "Light wear only",
    seller: "Verified seller · Seoyeon",
    sellerMeta: "132 trades · 4.9 rating",
    priceVerdict: "Fair — 51% under retail comps",
    findings: [
      "Neutral tone matches your saved palette",
      "Fits your $100–150 budget band",
      "Hardware and stitching inspected, no defects",
    ],
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "Leather square crossbody bag resting on a plain floor",
  },
  {
    id: "sneakers",
    exhibit: "Exhibit C",
    serial: "RP-260725-C",
    title: "Classic Low-Top Sneakers",
    brand: "Runway Archive",
    category: "Footwear",
    price: 92,
    original: 168,
    discount: 45,
    match: 88,
    grade: "A",
    gradeLabel: "Minor scuffing noted",
    seller: "Verified seller · Minjae",
    sellerMeta: "87 trades · 4.8 rating",
    priceVerdict: "Fair — 45% under retail comps",
    findings: [
      "Size 8.5 matches your saved fit",
      "Extends your casual rotation",
      "Sole wear measured at 8%",
    ],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
  {
    id: "vintage-coat",
    exhibit: "Exhibit D",
    serial: "RP-260725-D",
    title: "Vintage Wool Chesterfield Coat",
    brand: "Aureum Vintage",
    category: "Outerwear",
    price: 132,
    original: 224,
    discount: 41,
    match: 93,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Harin",
    sellerMeta: "156 trades · 32% repeat buyers",
    priceVerdict: "Fair — 41% under retail comps",
    findings: [
      "Oversized fit matches your saved preference",
      "Graded S on our 5-point condition scale",
      "Priced 41% under original retail",
    ],
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    alt: "Vintage wool chesterfield coat hanging on a clothing rack",
  },
];

export const HERO_CERT: CertItem = PRODUCTS[0];

export type Value = {
  index: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Verify",
    desc: "Photos, brand archives, and your saved taste profile are cross-checked before a listing ever qualifies as a match.",
    icon: Fingerprint,
  },
  {
    index: "02",
    title: "Grade",
    desc: "Inspectors measure wear, stitching, and hardware against a fixed 5-point condition scale — no self-reported grades.",
    icon: Ruler,
  },
  {
    index: "03",
    title: "Price-check",
    desc: "Every asking price is compared against retail and recent comparable resales before the verdict reaches you.",
    icon: Scale,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "128,000+", label: "Certificates issued" },
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
    "I didn't have to take anyone's word for it. The score, the grade, the seller — it was all on file before I paid.",
  name: "Jordan Lee",
  role: "Freelance designer",
} as const;
