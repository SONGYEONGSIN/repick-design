import type { LucideIcon } from "lucide-react";
import { ScanLine, ShieldCheck, ClipboardCheck } from "lucide-react";

// --- utils -------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// Deterministic thousands separator — no `toLocaleString` (ICU output can
// differ between server and client locale, which is a hydration mismatch).
export const comma = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion --------------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;
// Fixed per-row delay for the certificate's sequential "stamp" reveal — a
// plain index multiplier, never Math.random/Date.now.
export const STAMP_STEP = 0.16;

// --- shared class tokens (design DNA: light near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-emerald-700";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW = "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- line-length caps ----------------------------------------------------------
// design-principles §Spacing: chars/line = container-px / (0.44 * font-size-px),
// `ch` is banned (Pretendard's `ch` advance runs ~35% wider than the true
// average glyph advance). Two tokens cover every paragraph on this page:
//   BODY_MAX  512px @ 16px body  -> 512 / (0.44*16) = 512/7.04  ≈ 72.7 chars
//   LEDE_MAX  560px @ 18px lede  -> 560 / (0.44*18) = 560/7.92  ≈ 70.7 chars
// Both land inside the 65–75 window with real clearance under the 75 cap
// (72.7 is 3% under; 70.7 is 6% under) — never the "barely fits" edge the
// width-check convention treats as a failure in its own right.
export const BODY_MAX = "max-w-[512px]";
export const LEDE_MAX = "max-w-[560px]";

// --- certificate model -----------------------------------------------------------
export type Grade = "S" | "A";

export type Listing = {
  id: string;
  tabLabel: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  original: number;
  discount: number;
  grade: Grade;
  score: number;
  gradeLabel: string;
  certNo: string;
  authenticityDetail: string;
  matchTags: [string, string];
  seller: { name: string; trades: number; rating: number };
  image: string;
  alt: string;
};

// Positions/photos are fixed, human-picked Unsplash IDs (never a random
// image host) — one per listing, reused nowhere else on this route.
export const LISTINGS: Listing[] = [
  {
    id: "coat",
    tabLabel: "Overcoat",
    title: "Wool Double-Breasted Overcoat",
    brand: "Aldern & Foss",
    category: "Outerwear",
    price: 214,
    original: 410,
    discount: 48,
    grade: "S",
    score: 96,
    gradeLabel: "Archive condition — no visible wear",
    certNo: "RP-70142-C",
    authenticityDetail:
      "Lining stitch pattern and horn buttons matched to 3 verified archive photos.",
    matchTags: ["Fits your tailored-fit profile", "96% match to 4 recent saves"],
    seller: { name: "Priya N.", trades: 241, rating: 4.9 },
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
    alt: "Wool double-breasted overcoat hung against a plain backdrop",
  },
  {
    id: "bag",
    tabLabel: "Crossbody bag",
    title: "Leather Crossbody Bag",
    brand: "Atelier Bran",
    category: "Bags",
    price: 92,
    original: 185,
    discount: 50,
    grade: "A",
    score: 91,
    gradeLabel: "Light corner wear, structurally sound",
    certNo: "RP-70143-C",
    authenticityDetail:
      "Hardware stamp and stitch gauge cross-checked against the maker's reference set.",
    matchTags: ["Matches your neutral palette", "Similar to 2 saved bags"],
    seller: { name: "Noah K.", trades: 118, rating: 4.8 },
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=1000&q=80",
    alt: "Leather crossbody bag resting on a plain floor",
  },
  {
    id: "boots",
    tabLabel: "Chelsea boots",
    title: "Suede Chelsea Boots",
    brand: "Fieldstone Co.",
    category: "Footwear",
    price: 74,
    original: 150,
    discount: 49,
    grade: "A",
    score: 89,
    gradeLabel: "Minor sole scuffing, uppers like new",
    certNo: "RP-70144-C",
    authenticityDetail:
      "Sole-unit tread pattern and heel branding matched to the maker's spec sheet.",
    matchTags: ["Fits your usual size run", "89% match to your saved list"],
    seller: { name: "Mika S.", trades: 76, rating: 4.7 },
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80",
    alt: "Pair of suede Chelsea boots side by side",
  },
];

// --- product preview (4 parallel cards, badges in their own row — never
// overlaid on the photo, per design-principles §Landing 구조 기본형 2) ------------
export type PreviewCard = {
  id: string;
  title: string;
  brand: string;
  price: number;
  original: number;
  discount: number;
  grade: Grade;
  gradeLabel: string;
  match: number;
  matchTag: string;
  seller: string;
  image: string;
  alt: string;
};

export const PREVIEW: PreviewCard[] = [
  {
    id: "jacket",
    title: "Denim Trucker Jacket",
    brand: "Larkspur House",
    price: 58,
    original: 120,
    discount: 52,
    grade: "A",
    gradeLabel: "Light fade, no structural wear",
    match: 87,
    matchTag: "Matches your casual rotation",
    seller: "Verified seller · Elin",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
    alt: "Denim trucker jacket laid flat against a plain backdrop",
  },
  {
    id: "backpack",
    title: "Canvas Commuter Backpack",
    brand: "Fieldstone Co.",
    price: 64,
    original: 130,
    discount: 51,
    grade: "S",
    gradeLabel: "Archive condition, unused straps",
    match: 93,
    matchTag: "93% match to your saved list",
    seller: "Verified seller · Jordan",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    alt: "Dark navy canvas backpack standing on the floor",
  },
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers",
    brand: "Fieldstone Co.",
    price: 71,
    original: 140,
    discount: 49,
    grade: "A",
    gradeLabel: "Minor scuffing at the toe cap",
    match: 90,
    matchTag: "Fits your usual size run",
    seller: "Verified seller · Mika",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
  {
    id: "minibag",
    title: "Leather Mini Shoulder Bag",
    brand: "Atelier Bran",
    price: 85,
    original: 165,
    discount: 48,
    grade: "S",
    gradeLabel: "Archive condition, hardware unmarked",
    match: 95,
    matchTag: "Matches your neutral palette",
    seller: "Verified seller · Noah",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    alt: "Close-up photo of a leather mini shoulder bag",
  },
];

// --- 3-way process split ---------------------------------------------------------
export type ProcessStep = { index: string; title: string; desc: string; icon: LucideIcon };

export const PROCESS: ProcessStep[] = [
  {
    index: "01",
    title: "Capture",
    desc: "Every seller photo — garment, tag, seam, sole — is checked against our reference archive before a certificate opens.",
    icon: ScanLine,
  },
  {
    index: "02",
    title: "Cross-check",
    desc: "Authenticity markers, condition, and your saved taste profile are scored independently, then reconciled into one file.",
    icon: ShieldCheck,
  },
  {
    index: "03",
    title: "Certify",
    desc: "The four findings are stamped into a single certificate — the same one you paged through above.",
    icon: ClipboardCheck,
  },
];

// --- social proof ---------------------------------------------------------------
export type Stat = { value: string; label: string };

export const HERO_STATS: Stat[] = [
  { value: "3.1M+", label: "Items certified" },
  { value: "98.6%", label: "Grading precision" },
  { value: "72s", label: "Avg. certificate time" },
];

export const PROOF: Stat[] = [
  { value: "44%", label: "Fewer return requests" },
  { value: "2.3x", label: "Faster to a confident checkout" },
  { value: "31%", label: "Repeat buyers within 90 days" },
];

export const TESTIMONIAL = {
  quote:
    "I stopped emailing sellers ten questions before I buy. The certificate already answers them, in writing, before I ever open the listing.",
  name: "Dana Whitfield",
  role: "Frequent buyer",
} as const;
