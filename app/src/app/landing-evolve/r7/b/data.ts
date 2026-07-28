import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Ruler,
  Wallet,
  ShieldCheck,
  TrendingDown,
  Fingerprint,
  Layers,
  Award,
} from "lucide-react";

// --- utils -------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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

// --- domain: the five equalizer channels --------------------------------
export type Criterion = {
  id: string;
  label: string;
  fullLabel: string;
  value: number; // contribution to overall match, 0-100 -> bar height
  evidence: string;
  icon: LucideIcon;
};

export const CRITERIA: Criterion[] = [
  {
    id: "taste",
    label: "Taste",
    fullLabel: "Taste Profile",
    value: 96,
    evidence:
      "Your saved palette and silhouette history line up with this coat's cut and tone almost exactly.",
    icon: Sparkles,
  },
  {
    id: "size",
    label: "Size",
    fullLabel: "Size",
    value: 94,
    evidence:
      "Shoulder, sleeve, and body length sit within 1cm of your saved size card.",
    icon: Ruler,
  },
  {
    id: "budget",
    label: "Budget",
    fullLabel: "Budget",
    value: 99,
    evidence:
      "Priced well inside your $150–250 range, with room to spare before your ceiling.",
    icon: Wallet,
  },
  {
    id: "condition",
    label: "Grade",
    fullLabel: "Condition Grade",
    value: 93,
    evidence:
      "Graded A on our 5-point condition scale — light wear only, no structural flags.",
    icon: ShieldCheck,
  },
  {
    id: "price",
    label: "Price",
    fullLabel: "Market Price",
    value: 98,
    evidence:
      "43% under comparable retail and resale listings tracked across this week.",
    icon: TrendingDown,
  },
];

export const HERO_MATCH = Math.round(
  CRITERIA.reduce((sum, c) => sum + c.value, 0) / CRITERIA.length,
);

export const HERO_ITEM = {
  title: "Wool Double-Breasted Overcoat",
  brand: "Nordby Studio",
  price: 214,
  original: 398,
  discount: 46,
  seller: "Verified seller · Aram",
  sellerMeta: "176 trades · 4.9 rating",
  image:
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
  alt: "Charcoal wool double-breasted overcoat hanging against a plain backdrop",
} as const;

// --- domain: product preview cards --------------------------------------
export type Grade = "S" | "A" | "B";

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
  topSignal: string;
  topSignalValue: number;
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "overcoat",
    title: "Wool Double-Breasted Overcoat",
    brand: "Nordby Studio",
    category: "Outerwear",
    price: 214,
    original: 398,
    discount: 46,
    match: 96,
    grade: "A",
    gradeLabel: "Light wear only",
    seller: "Verified seller · Aram",
    sellerMeta: "176 trades · 4.9 rating",
    topSignal: "Budget",
    topSignalValue: 99,
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
    alt: "Charcoal wool double-breasted overcoat hanging against a plain backdrop",
  },
  {
    id: "tote",
    title: "Structured Leather Tote",
    brand: "Atelier Noir",
    category: "Bags",
    price: 132,
    original: 265,
    discount: 50,
    match: 91,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Seoyeon",
    sellerMeta: "132 trades · 4.9 rating",
    topSignal: "Taste",
    topSignalValue: 95,
    image:
      "https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format&fit=crop&w=900&q=80",
    alt: "Structured black leather tote bag resting on a plain surface",
  },
  {
    id: "denim",
    title: "Raw Selvedge Denim Jacket",
    brand: "Runway Archive",
    category: "Outerwear",
    price: 88,
    original: 160,
    discount: 45,
    match: 89,
    grade: "A",
    gradeLabel: "Minor fading noted",
    seller: "Verified seller · Minjae",
    sellerMeta: "87 trades · 4.8 rating",
    topSignal: "Price",
    topSignalValue: 97,
    image:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
    alt: "Raw selvedge denim jacket laid flat against a plain backdrop",
  },
  {
    id: "boots",
    title: "Leather Ankle Boots",
    brand: "Aureum Vintage",
    category: "Footwear",
    price: 96,
    original: 175,
    discount: 45,
    match: 93,
    grade: "A",
    gradeLabel: "Sole wear at 6%",
    seller: "Verified seller · Harin",
    sellerMeta: "156 trades · 4.9 rating",
    topSignal: "Grade",
    topSignalValue: 93,
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of brown leather ankle boots on a plain floor",
  },
];

export type Value = {
  index: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Calibrate",
    desc: "Your taste profile, size card, and budget train every channel before the first listing is ever scored.",
    icon: Fingerprint,
  },
  {
    index: "02",
    title: "Balance",
    desc: "Five checks run independently and in parallel — taste, size, budget, condition, and price — never averaged blindly.",
    icon: Layers,
  },
  {
    index: "03",
    title: "Verify",
    desc: "Every channel keeps its own evidence on file, so you can see exactly what moved the score, not just the total.",
    icon: Award,
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "5", label: "Channels scored per match" },
  { value: "94%", label: "Verdict accuracy" },
];

export const PROOF: Stat[] = [
  { value: "2.3x", label: "Faster to checkout" },
  { value: "-61%", label: "Less time spent browsing" },
  { value: "36%", label: "Repeat buyers within 90 days" },
];

export const TESTIMONIAL = {
  quote:
    "I could see which channel was doing the work — budget, size, condition — instead of just trusting one flat percentage.",
  name: "Priya Nair",
  role: "Product designer",
} as const;
