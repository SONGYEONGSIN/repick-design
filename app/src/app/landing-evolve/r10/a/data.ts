import type { LucideIcon } from "lucide-react";
import {
  ScanLine,
  ShieldCheck,
  Tag,
  CheckCircle2,
  CircleDot,
  CircleDashed,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

/**
 * Layer Inspector — data, scoring and static copy for the r10/a landing.
 *
 * Every figure below is a module constant; every derived value comes out of a pure function of
 * plain arrays and numbers. No `Math.random`, no `Date.now`, no argless `new Date()` — the server
 * render and the client hydration always agree.
 */

// --- utils ---------------------------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** Grouped thousands by hand — avoids `toLocaleString`, whose ICU data can differ between the
 * server render and the browser and produce a hydration mismatch. */
export const money = (value: number): string =>
  `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --- shared style tokens (dark near-monochrome + single accent, per design-principles.md) --------
// Accent #6E56CF is reserved for fills / borders / bars / large (>=24px, or >=19px bold) text — at
// small sizes on the #0B0B0F page background it measures 3.73:1, under the 4.5:1 body-text AA
// floor. Small text, icons and focus rings use the derived tint #B6A6F0 (9.1:1) instead.
export const ACCENT = "#6E56CF";
export const ACCENT_TINT = "#B6A6F0";
export const BG = "#0B0B0F";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#B6A6F0]";

// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW = "text-xs font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums";

export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

// --- hero photo ------------------------------------------------------------------------------------
export const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  alt: "Vintage wool Chesterfield coat hanging alone on a clothing rack",
  subject: "Vintage Wool Chesterfield Coat",
} as const;

// --- inspection layers -----------------------------------------------------------------------------
export type LayerId = "condition" | "authenticity" | "price";

export type Region = { top: number; left: number; width: number; height: number };

export type Layer = {
  id: LayerId;
  label: string;
  short: string;
  icon: LucideIcon;
  /** Fixed confidence score this layer reports, 0-100. */
  confidence: number;
  /** Fixed-percentage highlight box on the hero photo, or null when this layer has no visual region. */
  region: Region | null;
  finding: string;
};

export const LAYERS: Layer[] = [
  {
    id: "condition",
    label: "Condition scan",
    short: "Condition",
    icon: ScanLine,
    confidence: 92,
    region: { top: 34, left: 24, width: 34, height: 38 },
    finding:
      "Wool weave and seam stitching show light, even wear consistent with gentle prior use — no structural damage across the shoulder line.",
  },
  {
    id: "authenticity",
    label: "Authenticity check",
    short: "Authenticity",
    icon: ShieldCheck,
    confidence: 97,
    region: { top: 6, left: 54, width: 20, height: 15 },
    finding:
      "Interior label stitching and horn-button stamping match verified archive samples for this maker and era.",
  },
  {
    id: "price",
    label: "Price fairness",
    short: "Price",
    icon: Tag,
    confidence: 88,
    region: null,
    finding: "Asking price sits 34% below the 90-day median for this exact model and grade.",
  },
];

/** Two of three layers start active — the mechanism demonstrates value immediately, and the third
 * (price) stays off so a visitor's very first view already shows a legible, genuinely partial
 * off-state before they touch anything. */
export const DEFAULT_ACTIVE: LayerId[] = ["condition", "authenticity"];

export type Verdict = { label: string; icon: LucideIcon; filled: boolean };

export function verdictFor(activeCount: number): Verdict {
  if (activeCount === 0) return { label: "Not inspected yet", icon: CircleDashed, filled: false };
  if (activeCount === LAYERS.length) return { label: "Fully verified", icon: CheckCircle2, filled: true };
  return {
    label: activeCount === 1 ? "Partially verified" : "Mostly verified",
    icon: CircleDot,
    filled: false,
  };
}

/** Confidence meter — mean of the active layers' own scores, 0 when nothing is toggled on. */
export function confidenceFor(active: LayerId[]): number {
  if (active.length === 0) return 0;
  const sum = active.reduce((total, id) => {
    const layer = LAYERS.find((l) => l.id === id);
    return total + (layer ? layer.confidence : 0);
  }, 0);
  return Math.round(sum / active.length);
}

// --- product preview (4 parallel, spec-sheet cards, all proof always-on) -------------------------
export type ProductCard = {
  id: string;
  title: string;
  brand: string;
  matchTag: string;
  grade: string;
  gradeNote: string;
  seller: string;
  sellerMeta: string;
  price: number;
  original: number;
  discount: number;
  image: string;
  alt: string;
};

export const PRODUCTS: ProductCard[] = [
  {
    id: "coat",
    title: "Wool Double-Breasted Coat",
    brand: "Rowan & Fife",
    matchTag: "Matched on condition + authenticity",
    grade: "S",
    gradeNote: "Museum condition",
    seller: "Verified seller · Priya",
    sellerMeta: "241 trades · 4.9 rating",
    price: 198,
    original: 390,
    discount: 49,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=80",
    alt: "Wool double-breasted coat hung alone against a plain backdrop",
  },
  {
    id: "bag",
    title: "Leather Crossbody Bag",
    brand: "Atelier Bran",
    matchTag: "Matched on authenticity + price",
    grade: "A",
    gradeNote: "Light wear only",
    seller: "Verified seller · Noah",
    sellerMeta: "118 trades · 4.8 rating",
    price: 112,
    original: 230,
    discount: 51,
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=700&q=80",
    alt: "Leather crossbody bag resting on a plain floor",
  },
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers",
    brand: "Fieldstone Co.",
    matchTag: "Matched on condition + price",
    grade: "A",
    gradeNote: "Minor scuffing noted",
    seller: "Verified seller · Mika",
    sellerMeta: "76 trades · 4.7 rating",
    price: 88,
    original: 160,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    brand: "Larkspur House",
    matchTag: "Matched on condition + authenticity",
    grade: "A",
    gradeNote: "Resoled heel, otherwise clean",
    seller: "Verified seller · Elin",
    sellerMeta: "163 trades · 4.9 rating",
    price: 96,
    original: 175,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
    alt: "Pair of suede Chelsea boots side by side",
  },
];

// --- editorial long-form (alternating image/text, no numbering) -----------------------------------
export type EditorialBlock = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  stat?: { value: string; label: string };
  image: string;
  alt: string;
};

export const EDITORIAL: EditorialBlock[] = [
  {
    id: "same-model",
    eyebrow: "Behind the toggle",
    title: "Every layer is a real model, not a marketing label.",
    body: "Condition, authenticity and price fairness are three separate scoring passes trained on completed trades, seller disputes and return outcomes — the same three passes that just recomputed on the coat above.",
    stat: { value: "1.4M", label: "Photos annotated this year" },
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    alt: "Rows of garments in various colors hanging on a rack",
  },
  {
    id: "condition-grade",
    eyebrow: "Condition scan",
    title: "Grades come from the same scan you just ran.",
    body: "A grade of S or A is not a seller's guess — it is the condition layer's output, rounded to a letter. Wear, completeness and repair history all feed the same score you saw move on the coat.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    alt: "A clothing rack of pastel-toned vintage garments",
  },
  {
    id: "price-fairness",
    eyebrow: "Price fairness",
    title: "Fairness checks against real trades, not list prices.",
    body: "The price layer compares every listing to 90 days of completed sales for that exact model and grade — not to what other sellers merely ask for it.",
    stat: { value: "34%", label: "Average savings vs. retail" },
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
    alt: "Denim trucker jacket laid flat against a plain backdrop",
  },
];

// --- FAQ accordion -----------------------------------------------------------------------------
export const FAQS: { id: string; q: string; a: string }[] = [
  {
    id: "grade",
    q: "How does the AI decide a condition grade?",
    a: "The condition layer scores wear, completeness and repair history against thousands of prior trades for similar items, then rounds the result to a letter grade — S, A, B or C. You can always see the same finding text the layer used to reach that grade.",
  },
  {
    id: "authenticity",
    q: "What does the authenticity check actually verify?",
    a: "It compares stitching, hardware stamping, label placement and materials against verified archive samples from the maker. It flags a mismatch rather than guessing — a listing that fails stays visible, just clearly marked.",
  },
  {
    id: "price",
    q: "Is the price fairness score comparing to retail or resale?",
    a: "Resale. It checks the asking price against 90 days of completed trades for that exact model and grade, not the original retail tag and not what other sellers are merely asking.",
  },
  {
    id: "toggle",
    q: "Can I turn a layer off if I don't trust it?",
    a: "Yes — every layer is optional. Turning one off removes its finding and its share of the confidence score, and the verdict updates to reflect exactly what was actually checked.",
  },
  {
    id: "fail",
    q: "What happens if a listing fails one of the checks?",
    a: "It is not hidden. A failed check stays on the listing with its own finding text, so you can decide whether it matters to you instead of the AI deciding for you.",
  },
];

// --- single pull-quote testimonial -----------------------------------------------------------------
export const TESTIMONIAL = {
  quote:
    "I turned every layer off just to see what would happen, and the listing still made sense — grade, seller and price were all still right there. Then I turned condition back on and watched the exact wear the AI meant.",
  name: "Reiko Tanaka",
  role: "Product designer, repeat buyer",
} as const;

// --- misc icons reused across sections -------------------------------------------------------------
export const ICONS = { BadgeCheck, Sparkles } as const;
