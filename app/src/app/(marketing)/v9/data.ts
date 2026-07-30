import type { LucideIcon } from "lucide-react";
import { ScanSearch, Layers, Gauge } from "lucide-react";

// --- utils -------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ------------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;
// fixed step interval for the deterministic annotation-scan sequence (no
// Math.random/Date.now anywhere — just a plain counter on a timer)
export const STEP_MS = 2800;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

export const SCAN_ID = "Scan RP-2607-K" as const;

// --- hero annotation pins ------------------------------------------------------
// Positions are fixed percentages authored against the hero photo, chosen at
// build time — never computed at runtime, so there is no layout thrash and no
// hydration mismatch. `cumulative` is the running overall match score once
// this pin (and every pin before it) has been examined — precomputed here
// rather than reduced at runtime, so the sequence is trivially deterministic.
export type Pin = {
  id: string;
  step: number;
  top: string;
  left: string;
  title: string;
  finding: string;
  confidence: number;
  cumulative: number;
};

export const PINS: Pin[] = [
  {
    id: "weave",
    step: 1,
    top: "16%",
    left: "54%",
    title: "Fabric weave",
    finding:
      "Dense wool twill weave matches the Chesterfield archive spec — no pilling detected across the shoulder line.",
    confidence: 98,
    cumulative: 98,
  },
  {
    id: "tag",
    step: 2,
    top: "11%",
    left: "67%",
    title: "Brand tag authenticity",
    finding:
      "Interior label stitching and thread gauge match verified archive samples for this maker and era.",
    confidence: 95,
    cumulative: 97,
  },
  {
    id: "stitching",
    step: 3,
    top: "48%",
    left: "40%",
    title: "Stitching integrity",
    finding:
      "Lock-stitch spacing holds steady along the full placket seam — no loose or doubled threads.",
    confidence: 97,
    cumulative: 97,
  },
  {
    id: "cuff",
    step: 4,
    top: "67%",
    left: "23%",
    title: "Wear pattern on cuff",
    finding:
      "Cuff edge shows light creasing consistent with gentle prior wear, not structural damage.",
    confidence: 91,
    cumulative: 95,
  },
  {
    id: "color",
    step: 5,
    top: "83%",
    left: "58%",
    title: "Color-match confidence",
    finding:
      "Charcoal tone sits inside your saved neutral palette, within 4% of your last three purchases.",
    confidence: 96,
    cumulative: 95,
  },
];

export const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  alt: "Vintage wool Chesterfield coat hanging alone on a clothing rack",
} as const;

// --- product preview (3-4 parallel rich cards, always-visible core proof) ----
export type Grade = "S" | "A";

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
  seller: string;
  sellerMeta: string;
  image: string;
  alt: string;
};

export const PRODUCTS: ProductCard[] = [
  {
    id: "coat",
    title: "Wool Double-Breasted Coat",
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
    alt: "Wool double-breasted coat hung alone against a plain backdrop",
  },
  {
    id: "bag",
    title: "Leather Crossbody Bag",
    brand: "Atelier Bran",
    category: "Bags",
    price: 112,
    original: 230,
    discount: 51,
    match: 92,
    grade: "A",
    gradeLabel: "Light wear only",
    seller: "Verified seller · Noah",
    sellerMeta: "118 trades · 4.8 rating",
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "Leather crossbody bag resting on a plain floor",
  },
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers",
    brand: "Fieldstone Co.",
    category: "Footwear",
    price: 88,
    original: 160,
    discount: 45,
    match: 89,
    grade: "A",
    gradeLabel: "Minor scuffing noted",
    seller: "Verified seller · Mika",
    sellerMeta: "76 trades · 4.7 rating",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
  {
    id: "trench",
    title: "Oversized Trench Coat",
    brand: "Larkspur House",
    category: "Outerwear",
    price: 145,
    original: 260,
    discount: 44,
    match: 94,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Elin",
    sellerMeta: "163 trades · 33% repeat buyers",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    alt: "Fashion shot of a person wearing a beige oversized trench coat",
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
    title: "Capture",
    desc: "Every seller photo — full garment, tag, seam, cuff — feeds the same model your certificate is built from.",
    icon: ScanSearch,
  },
  {
    index: "02",
    title: "Annotate",
    desc: "Weave, stitching, tag, and wear each get their own pin and their own confidence score, filed to the exact spot.",
    icon: Layers,
  },
  {
    index: "03",
    title: "Verdict",
    desc: "The five checks roll up into one running match score — the same number you see updating in the scan above.",
    icon: Gauge,
  },
];

// --- social proof ---------------------------------------------------------------
export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "1.2M+", label: "Garments annotated" },
  { value: "97%", label: "Inspection accuracy" },
  { value: "4.8s", label: "Avg. scan time" },
];

export const PROOF: Stat[] = [
  { value: "41%", label: "Fewer returns after purchase" },
  { value: "2.1x", label: "Faster to a confident checkout" },
  { value: "33%", label: "Repeat buyers within 90 days" },
];

export const TESTIMONIAL = {
  quote:
    "I could see exactly why the cuff got flagged before I paid — the first secondhand app that actually showed its work instead of asking me to trust it.",
  name: "Reiko Tanaka",
  role: "Product designer",
} as const;
