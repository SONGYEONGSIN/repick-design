import type { LucideIcon } from "lucide-react";
import {
  Shirt,
  Ruler,
  BadgeCheck,
  Tag,
  TrendingUp,
  Layers,
  Hand,
  CheckCircle2,
} from "lucide-react";

// --- utils -------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ------------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

export const STRATA_ID = "Match ST-2607-J" as const;

// --- hero: the exploded evidence stack ("Strata") ----------------------------
// Five fixed evaluation criteria. `score` is the AI's confidence on that
// single criterion; VERDICT.match below is the precomputed aggregate of all
// five — precomputed at module load (plain arithmetic, no Math.random /
// Date.now anywhere) so the running total is trivially deterministic.
export type EvidenceLayer = {
  id: string;
  label: string;
  score: number;
  shortFinding: string;
  fullReasoning: string;
  icon: LucideIcon;
};

export const LAYERS: EvidenceLayer[] = [
  {
    id: "style",
    label: "Style Fit",
    score: 94,
    shortFinding:
      "Cropped, structured cut matches your saved silhouette preference.",
    fullReasoning:
      "Your saved style board favors cropped, structured jackets with covered buttons. This listing's silhouette, lapel width, and shoulder line land inside that same band across all four seller photos — the closest style match in your feed this week.",
    icon: Shirt,
  },
  {
    id: "size",
    label: "Size",
    score: 90,
    shortFinding:
      "Shoulder-to-hem measurements sit within 1cm of your last four fits.",
    fullReasoning:
      "The seller's flat-lay measurements — shoulder, bust, and hem length — fall within 1cm of the four garments you've kept from past orders. Sleeve length runs 0.5cm longer than your average, noted but well inside comfortable tailoring range.",
    icon: Ruler,
  },
  {
    id: "condition",
    label: "Condition",
    score: 97,
    shortFinding:
      "Grade A — light interior wear only, confirmed across 12 close-ups.",
    fullReasoning:
      "Twelve close-up photos were checked against our condition rubric: no pilling, no visible staining, lining intact at both seams. A faint crease near the left cuff is the only wear noted — consistent with gentle prior use, not damage.",
    icon: BadgeCheck,
  },
  {
    id: "price",
    label: "Price",
    score: 88,
    shortFinding:
      "42% below original retail, in line with this seller's last 90 days.",
    fullReasoning:
      "Listed at $155 against a $268 original retail — a 42% discount. That sits within 3 points of this seller's average closing discount over their last 90 days of sales, so the price is a fair mark against their own history, not an outlier.",
    icon: Tag,
  },
  {
    id: "trend",
    label: "Trend",
    score: 91,
    shortFinding:
      "Cropped blazers are up 18% in your saved category this month.",
    fullReasoning:
      "Saves and completed trades for cropped, structured blazers are up 18% inside your saved category this month, ahead of outerwear overall. Timing this listing now, rather than waiting, keeps you ahead of the resale price curve on this cut.",
    icon: TrendingUp,
  },
];

// aggregate match — plain rounded mean of the five layer scores above,
// computed once at module load (deterministic, no runtime randomness).
const aggregateMatch = Math.round(
  LAYERS.reduce((sum, l) => sum + l.score, 0) / LAYERS.length,
);

export type Grade = "S" | "A";

export const VERDICT = {
  productTitle: "Cropped Wool-Blend Blazer",
  brand: "Rosalind Studio",
  size: "US 6 / EU 38",
  price: 155,
  original: 268,
  discount: 42,
  match: aggregateMatch,
  grade: "A" as Grade,
  gradeLabel: "Light wear, verified",
  sellerName: "Verified seller · Sana",
  sellerMeta: "184 trades · 4.9 rating",
} as const;

// --- product preview (3-4 parallel rich cards, always-visible core proof) ----
export type ProductCard = {
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
  topSignal: string;
  seller: string;
  sellerMeta: string;
  image: string;
  alt: string;
};

export const PRODUCTS: ProductCard[] = [
  {
    id: "coat",
    title: "Belted Wrap Coat",
    brand: "Maren & Co.",
    category: "Outerwear",
    price: 172,
    original: 310,
    discount: 45,
    match: 95,
    grade: "S",
    gradeLabel: "Museum condition",
    topSignal: "Condition",
    seller: "Verified seller · Talia",
    sellerMeta: "203 trades · 4.9 rating",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    alt: "Belted wrap coat hung alone against a plain backdrop",
  },
  {
    id: "tote",
    title: "Structured Leather Tote",
    brand: "Fen & Oak",
    category: "Bags",
    price: 96,
    original: 205,
    discount: 53,
    match: 90,
    grade: "A",
    gradeLabel: "Light edge wear",
    topSignal: "Price",
    seller: "Verified seller · Devon",
    sellerMeta: "97 trades · 4.8 rating",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    alt: "Structured leather tote bag resting on a plain floor",
  },
  {
    id: "skirt",
    title: "Pleated Midi Skirt",
    brand: "Solstice Row",
    category: "Skirts",
    price: 58,
    original: 110,
    discount: 47,
    match: 93,
    grade: "A",
    gradeLabel: "Like new",
    topSignal: "Style Fit",
    seller: "Verified seller · Imani",
    sellerMeta: "142 trades · 4.9 rating",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=900&q=80",
    alt: "Pleated midi skirt laid flat against a plain backdrop",
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    brand: "Harrow Field",
    category: "Footwear",
    price: 84,
    original: 150,
    discount: 44,
    match: 88,
    grade: "A",
    gradeLabel: "Minor sole wear",
    topSignal: "Trend",
    seller: "Verified seller · Wes",
    sellerMeta: "61 trades · 4.7 rating",
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of suede Chelsea boots on a plain floor",
  },
];

// --- 3-way value split ---------------------------------------------------------
export type Value = {
  index: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Run the layers",
    desc: "Every listing passes the same five checks — Style Fit, Size, Condition, Price, Trend — before it ever reaches your feed.",
    icon: Layers,
  },
  {
    index: "02",
    title: "Pull one forward",
    desc: "Tap or arrow-key through any layer to bring its full reasoning to the front — the evidence behind the score, not just the number.",
    icon: Hand,
  },
  {
    index: "03",
    title: "Read the verdict",
    desc: "The five scores resolve into one match percentage, alongside grade, seller verification, and the real discount.",
    icon: CheckCircle2,
  },
];

// --- social proof ---------------------------------------------------------------
export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "850K+", label: "Listings evidence-scored" },
  { value: "92%", label: "Avg. match confidence" },
  { value: "5", label: "Criteria scored per listing" },
];

// count-up proof band — numeric fields drive a deterministic on-scroll
// count-up (framer-motion `animate`, fixed duration/ease, no randomness).
export type ProofStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
};

export const PROOF: ProofStat[] = [
  { value: 38, decimals: 0, suffix: "%", label: "Fewer returns after purchase" },
  { value: 3.4, decimals: 1, suffix: "x", label: "Faster to a confident checkout" },
  { value: 29, decimals: 0, suffix: "%", label: "Repeat buyers within 90 days" },
];

export const TESTIMONIAL = {
  quote:
    "I pulled the Condition layer forward before I paid and read the exact reasoning behind it — the first secondhand app that showed me why, not just what.",
  name: "Marcus Webb",
  role: "Operations lead",
} as const;
