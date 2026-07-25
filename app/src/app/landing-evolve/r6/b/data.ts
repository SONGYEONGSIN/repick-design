import type { LucideIcon } from "lucide-react";
import { ScanSearch, Scale, ShieldCheck, Sparkles } from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// --- motion ----------------------------------------------------------------
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

export const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

export const NAV_LINK =
  "rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white " +
  FOCUS;

// --- domain: the single listing this whole page walks through -------------
export const PRODUCT = {
  brand: "Maison Blanche",
  title: "Wool Double-Breasted Coat",
  category: "Outerwear",
  price: 184,
  original: 310,
  discount: 41,
  match: 96,
  grade: "A",
  gradeLabel: "Light wear",
  conditionScore: 94,
  sellerName: "Verified seller · Dohyun",
  sellerMeta: "214 completed trades · 4.9 / 5",
  image:
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
  alt: "Wool double-breasted coat photographed alone against a plain studio background",
} as const;

export type Step = {
  id: string;
  index: string;
  icon: LucideIcon;
  title: string;
  body: string;
  metricLabel: string;
  metricValue: string;
  chips: string[];
};

export const STEPS: Step[] = [
  {
    id: "condition",
    index: "01",
    icon: ScanSearch,
    title: "Condition Check",
    body: "Every photo is cross-checked against our defect model — stitching, fabric wear, hardware, and lining are scored individually.",
    metricLabel: "Condition score",
    metricValue: "94 / 100",
    chips: ["No structural damage", "Lining intact", "Light wear on cuffs only"],
  },
  {
    id: "price",
    index: "02",
    icon: Scale,
    title: "Price Fairness Check",
    body: "The listed price is weighed against 60-day resale medians for the same brand, category, and condition tier.",
    metricLabel: "Below market median",
    metricValue: "-41%",
    chips: ["36 comparable sales found", "Market median $310", "Listed at $184"],
  },
  {
    id: "seller",
    index: "03",
    icon: ShieldCheck,
    title: "Seller Verification",
    body: "ID, trade history, and dispute record are checked before a seller's listings ever reach the matching pool.",
    metricLabel: "Trust score",
    metricValue: "4.9 / 5",
    chips: ["ID verified", "214 completed trades", "0 unresolved disputes"],
  },
  {
    id: "match",
    index: "04",
    icon: Sparkles,
    title: "Match Score",
    body: "Your saved style, size, and budget signals are weighted against this listing's attributes.",
    metricLabel: "Match confidence",
    metricValue: "96%",
    chips: [
      "Style: minimal neutral — match",
      "Size: fits saved profile",
      "Budget: within range",
    ],
  },
];

export const VERDICT_STATS = [
  { label: "Condition", value: "A · 94/100" },
  { label: "Price", value: "-41% vs. market" },
  { label: "Seller trust", value: "4.9/5 · verified" },
  { label: "Match", value: "96%" },
];

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Computer-vision grading",
    desc: "Every photo set is scored against thousands of labelled defects before a condition grade is ever assigned.",
    icon: ScanSearch,
  },
  {
    index: "02",
    title: "Live market index",
    desc: "Resale prices are pulled from completed trades daily, so fairness checks reflect this week, not last year.",
    icon: Scale,
  },
  {
    index: "03",
    title: "Seller trust network",
    desc: "Trade history and dispute records follow every seller across the marketplace, not just one listing.",
    icon: ShieldCheck,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "12,400+", label: "Listings verified daily" },
  { value: "4", label: "Checks run per listing" },
  { value: "96%", label: "Avg. match confidence" },
];

export const PROOF: Stat[] = [
  { value: "2.4x", label: "Higher purchase confidence" },
  { value: "-58%", label: "Less time re-checking listings" },
  { value: "99.2%", label: "Listings that pass all 4 checks" },
];

export const QUOTE = {
  text: "I scrolled through the checks and just trusted it — first time I've bought secondhand without messaging the seller twenty questions.",
  name: "Alex R.",
  role: "Product designer",
} as const;
