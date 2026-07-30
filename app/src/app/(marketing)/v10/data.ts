import type { LucideIcon } from "lucide-react";
import {
  SlidersHorizontal,
  Waypoints,
  Network,
  Sparkles,
  Ruler,
  Wallet,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

// --- utils -------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

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

// ============================================================================
// Preference → Product Graph — hero data
// ============================================================================

export type PrefId = "style" | "size" | "budget" | "condition" | "trend";
export type GraphProductId = "coat" | "tote" | "jacket" | "boots";

export type PreferenceNode = {
  id: PrefId;
  label: string;
  icon: LucideIcon;
  /** vertical center, percent of graph height — fixed at build time */
  y: number;
};

// Left cluster: the visitor's saved preference signals. Order also drives the
// fixed stagger delay of the initial edge-draw sequence (index * 0.12s) —
// deterministic, no Math.random/Date.now anywhere.
export const PREFERENCES: PreferenceNode[] = [
  { id: "style", label: "Style", icon: Sparkles, y: 10 },
  { id: "size", label: "Size", icon: Ruler, y: 30 },
  { id: "budget", label: "Budget", icon: Wallet, y: 50 },
  { id: "condition", label: "Condition", icon: ShieldCheck, y: 70 },
  { id: "trend", label: "Trend", icon: TrendingUp, y: 90 },
];

export type Grade = "S" | "A" | "B+";

export type GraphProduct = {
  id: GraphProductId;
  name: string;
  match: number;
  grade: Grade;
  gradeLabel: string;
  seller: string;
  price: number;
  original: number;
  discount: number;
  /** vertical center, percent of graph height — fixed at build time */
  y: number;
};

// Right cluster: the live matched listings themselves — always fully tagged
// (match %, condition grade, verified seller, before/after discount) at
// rest, independent of which preference node is selected.
export const GRAPH_PRODUCTS: GraphProduct[] = [
  {
    id: "coat",
    name: "Wool Overcoat",
    match: 96,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Priya",
    price: 198,
    original: 390,
    discount: 49,
    y: 12.5,
  },
  {
    id: "tote",
    name: "Leather Tote",
    match: 91,
    grade: "A",
    gradeLabel: "Light wear only",
    seller: "Noah",
    price: 112,
    original: 230,
    discount: 51,
    y: 37.5,
  },
  {
    id: "jacket",
    name: "Denim Trucker",
    match: 88,
    grade: "A",
    gradeLabel: "Minor fade only",
    seller: "Mika",
    price: 74,
    original: 140,
    discount: 47,
    y: 62.5,
  },
  {
    id: "boots",
    name: "Suede Chelsea Boots",
    match: 84,
    grade: "B+",
    gradeLabel: "Well-loved, sturdy",
    seller: "Elin",
    price: 96,
    original: 175,
    discount: 45,
    y: 87.5,
  },
];

// Edge strength: how strongly each preference signal explains each matched
// product, 0-100. Encodes both stroke-width and opacity in the graph.
// Order of values follows GRAPH_PRODUCTS order: [coat, tote, jacket, boots].
export const EDGE_STRENGTH: Record<PrefId, Record<GraphProductId, number>> = {
  style: { coat: 95, tote: 70, jacket: 55, boots: 40 },
  size: { coat: 88, tote: 92, jacket: 60, boots: 96 },
  budget: { coat: 60, tote: 82, jacket: 90, boots: 78 },
  condition: { coat: 98, tote: 85, jacket: 70, boots: 65 },
  trend: { coat: 72, tote: 66, jacket: 94, boots: 58 },
};

// The specific reasoning sentence the AI surfaces for each preference
// dimension, always tied to the product that dimension explains best (the
// argmax of EDGE_STRENGTH for that row) — real, recomputable evidence, not
// decoration.
export const REASONING: Record<
  PrefId,
  { product: GraphProductId; text: string }
> = {
  style: {
    product: "coat",
    text: "Your saved style board skews tailored and neutral — this overcoat's silhouette and charcoal tone sit inside your last 12 saves.",
  },
  size: {
    product: "boots",
    text: "You've confirmed EU 41 as a true fit twice this month — these boots are logged at 41, verified against the seller's own foot-tracing photo.",
  },
  budget: {
    product: "jacket",
    text: "You capped spend at $120 for outerwear this week — this jacket clears your ceiling by $46 after the seller's discount.",
  },
  condition: {
    product: "coat",
    text: "Your history shows you reject anything below grade A — this listing's pill-test and seam check both came back museum-grade.",
  },
  trend: {
    product: "jacket",
    text: "Trucker silhouettes are up 34% in your saved-feed engagement this month — this cut is trending fastest among size-matched sellers.",
  },
};

// --- product preview (3-4 parallel rich cards, always-visible core proof) ----
export type ProductCard = {
  id: GraphProductId;
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
  image: string;
  alt: string;
};

export const PRODUCTS: ProductCard[] = [
  {
    id: "coat",
    title: "Wool Overcoat",
    brand: "Rowan & Fife",
    category: "Outerwear",
    price: 198,
    original: 390,
    discount: 49,
    match: 96,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Priya",
    sellerMeta: "241 trades · 4.9 rating",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "Wool overcoat hung alone against a plain backdrop",
  },
  {
    id: "tote",
    title: "Leather Tote",
    brand: "Atelier Bran",
    category: "Bags",
    price: 112,
    original: 230,
    discount: 51,
    match: 91,
    grade: "A",
    gradeLabel: "Light wear only",
    seller: "Verified seller · Noah",
    sellerMeta: "118 trades · 4.8 rating",
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "Leather tote bag resting on a plain floor",
  },
  {
    id: "jacket",
    title: "Denim Trucker Jacket",
    brand: "Fieldstone Co.",
    category: "Outerwear",
    price: 74,
    original: 140,
    discount: 47,
    match: 88,
    grade: "A",
    gradeLabel: "Minor fade only",
    seller: "Verified seller · Mika",
    sellerMeta: "76 trades · 4.7 rating",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
    alt: "Denim trucker jacket laid flat against a plain backdrop",
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    brand: "Larkspur House",
    category: "Footwear",
    price: 96,
    original: 175,
    discount: 45,
    match: 84,
    grade: "B+",
    gradeLabel: "Well-loved, sturdy",
    seller: "Verified seller · Elin",
    sellerMeta: "163 trades · 33% repeat buyers",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of suede Chelsea boots side by side",
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
    title: "Listen",
    desc: "Every save, size filter, and price cap you set becomes a signal node the model keeps updated in real time.",
    icon: SlidersHorizontal,
  },
  {
    index: "02",
    title: "Connect",
    desc: "Each signal is weighed against every live listing — the strongest wires are the ones that make it into your feed.",
    icon: Waypoints,
  },
  {
    index: "03",
    title: "Prove",
    desc: "Click a signal and the graph shows you exactly which wire produced which match, in plain language, not a black box.",
    icon: Network,
  },
];

// --- social proof ---------------------------------------------------------------
export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "5", label: "Signals tracked" },
  { value: "4", label: "Live matches shown" },
  { value: "96%", label: "Top match confidence" },
];

export const PROOF: Stat[] = [
  { value: "38%", label: "Fewer returns after purchase" },
  { value: "1.9x", label: "Faster to a confident checkout" },
  { value: "33%", label: "Repeat buyers within 90 days" },
];

export const TESTIMONIAL = {
  quote:
    "I clicked 'Budget' and watched the wire jump straight to the jacket that actually fit it — the first app that shows its match logic instead of just asserting it.",
  name: "Devon Okafor",
  role: "Supply chain analyst",
} as const;
