import type { LucideIcon } from "lucide-react";
import {
  Heart,
  Ruler,
  Wallet,
  ShieldCheck,
  TrendingUp,
  BadgeCheck,
  Sparkles,
  Gauge as GaugeIcon,
  Timer,
  Check,
} from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ---------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- domain: match accuracy dial (hero gauge) ----------------------------

export type Criterion = {
  id: string;
  label: string;
  icon: LucideIcon;
  score: number;
  weight: string;
  evidence: string;
};

// 5 criteria — fixed so the average (96, the dial's final center value) checks out
export const CRITERIA: Criterion[] = [
  {
    id: "taste",
    label: "Taste Profile",
    icon: Heart,
    score: 98,
    weight: "22% weight",
    evidence: "Learned your preferred silhouette from the color and fit patterns across your last 87 saved items.",
  },
  {
    id: "size",
    label: "Size",
    icon: Ruler,
    score: 99,
    weight: "20% weight",
    evidence: "Your measurements and the seller's listed measurements match within 0.5cm.",
  },
  {
    id: "budget",
    label: "Budget",
    icon: Wallet,
    score: 94,
    weight: "18% weight",
    evidence: "Selected the best-conditioned listing within your ₩100,000–₩200,000 range.",
  },
  {
    id: "condition",
    label: "Condition Grade",
    icon: ShieldCheck,
    score: 97,
    weight: "22% weight",
    evidence: "Our inspection team measured 9 checkpoints and confirmed it meets Grade S standards.",
  },
  {
    id: "market",
    label: "Market Price",
    icon: TrendingUp,
    score: 92,
    weight: "18% weight",
    evidence: "Verified as fair value against 178 real transactions of the same brand over the last 3 months.",
  },
];

export const TOTAL_MATCH = Math.round(
  CRITERIA.reduce((sum, c) => sum + c.score, 0) / CRITERIA.length,
);

// --- domain: product preview (always visible — no hover-gated reveal) --------------------

export type Product = {
  id: string;
  image: { src: string; alt: string };
  title: string;
  brand: string;
  retail: number;
  repick: number;
  match: number;
  grade: "S" | "A";
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  tags: [string, string];
  daysAgo: number; // for the "newest" sort — lower is more recent
};

export const PRODUCTS: Product[] = [
  {
    id: "coat",
    image: {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
      alt: "Fashion shot of a person wearing a beige-toned oversized trench coat",
    },
    title: "Oversized Trench Coat",
    brand: "Aureum Vintage",
    retail: 268000,
    repick: 132000,
    match: 91,
    grade: "A",
    gradeLabel: "Light Wear",
    seller: "Verified Seller · Jimin",
    sellerMeta: "154 deals",
    tags: ["Matches your oversized-fit taste", "A-grade or above only"],
    daysAgo: 6,
  },
  {
    id: "shoulderbag",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      alt: "Close-up photo of a leather mini shoulder bag",
    },
    title: "Leather Mini Shoulder Bag",
    brand: "Atelier Noir",
    retail: 214000,
    repick: 104000,
    match: 90,
    grade: "A",
    gradeLabel: "Light Wear",
    seller: "Verified Seller · Seoyeon",
    sellerMeta: "132 deals",
    tags: ["Neutral color match", "Authenticity verified"],
    daysAgo: 2,
  },
  {
    id: "hitop",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
      alt: "Photo of a pair of high-top leather sneakers placed side by side",
    },
    title: "High-Top Leather Sneakers",
    brand: "Runway Archive",
    retail: 236000,
    repick: 112000,
    match: 96,
    grade: "S",
    gradeLabel: "Like New",
    seller: "Verified Seller · Minjae",
    sellerMeta: "189 deals",
    tags: ["0.5cm measured size variance", "6% sole wear"],
    daysAgo: 1,
  },
  {
    id: "crossbag",
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
      alt: "A leather crossbody bag and accessories laid out on the floor",
    },
    title: "Mini Crossbody Bag",
    brand: "Noir & Co.",
    retail: 268000,
    repick: 129000,
    match: 93,
    grade: "S",
    gradeLabel: "Like New",
    seller: "Verified Seller · Eunwoo",
    sellerMeta: "143 deals",
    tags: ["Reflects daily-use frequency", "Passed authentication"],
    daysAgo: 9,
  },
  {
    id: "knit",
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
      alt: "Fashion shot of a person wearing a knit sweater",
    },
    title: "Cashmere V-Neck Sweater",
    brand: "Studio Aren",
    retail: 246000,
    repick: 118000,
    match: 92,
    grade: "S",
    gradeLabel: "Like New",
    seller: "Verified Seller · Rina",
    sellerMeta: "127 deals",
    tags: ["Matches your fabric & fit taste", "Low pilling density"],
    daysAgo: 4,
  },
  {
    id: "sneaker2",
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
      alt: "A pair of classic white-toned sneakers",
    },
    title: "Leather Low-Top Sneakers",
    brand: "Fielder Studio",
    retail: 298000,
    repick: 139000,
    match: 95,
    grade: "S",
    gradeLabel: "Like New",
    seller: "Verified Seller · Junseo",
    sellerMeta: "189 deals",
    tags: ["270mm measured match", "3% sole wear"],
    daysAgo: 12,
  },
];

export type SortMode = "match" | "discount" | "new";

export const SORTS: { id: SortMode; label: string; icon: LucideIcon }[] = [
  { id: "match", label: "Best Match", icon: GaugeIcon },
  { id: "discount", label: "Biggest Discount", icon: TrendingUp },
  { id: "new", label: "Newest", icon: Timer },
];

export const discountRate = (p: Product) =>
  Math.round((1 - p.repick / p.retail) * 100);

export function sortProducts(products: Product[], mode: SortMode): Product[] {
  const list = [...products];
  if (mode === "match") return list.sort((a, b) => b.match - a.match);
  if (mode === "discount")
    return list.sort((a, b) => discountRate(b) - discountRate(a));
  return list.sort((a, b) => a.daysAgo - b.daysAgo);
}

// --- domain: value, three-way split -----------------------------------------------------

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Scores all five criteria at once",
    desc: "Taste profile, size, budget, condition grade, and market price are each scored independently, then combined into a single weighted match score.",
    icon: GaugeIcon,
  },
  {
    index: "02",
    title: "Proven with numbers",
    desc: "No guesswork. Nine measured inspection points and real transaction price comparisons back up every match score.",
    icon: ShieldCheck,
  },
  {
    index: "03",
    title: "Tap a criterion to see the evidence",
    desc: "Select any criterion on the dial and the panel right next to it shows exactly what data produced that score.",
    icon: Sparkles,
  },
];

// --- domain: social proof (updates live on toggle) --------------------------------

export type Stat = { value: string; label: string };

export const PROOF_WEEK: Stat[] = [
  { value: "3,400+", label: "Matches this week" },
  { value: "94%", label: "Avg. accuracy this week" },
  { value: "81s", label: "Avg. match time this week" },
];

export const PROOF_TOTAL: Stat[] = [
  { value: "128,000+", label: "Matches to date" },
  { value: "96%", label: "Avg. accuracy to date" },
  { value: "9/9", label: "Measured inspection points" },
];

export { BadgeCheck, Check, Sparkles };
