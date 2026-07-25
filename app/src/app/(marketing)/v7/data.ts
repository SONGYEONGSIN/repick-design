import type { LucideIcon } from "lucide-react";
import {
  Shirt,
  ShoppingBag,
  Footprints,
  Layers,
  Scale,
  ScanSearch,
  ShieldCheck,
  Clock,
  Target,
  Sparkles,
  Table2,
  BadgeCheck,
} from "lucide-react";

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const comma = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion --------------------------------------------------------------
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

// --- domain: comparison table ---------------------------------------------

export type Listing = {
  title: string;
  brand: string;
  retail: number;
  repick: number;
  match: number;
  grade: "S" | "A";
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
};

export type RowValue = {
  general: { value: string; sub: string };
  repick: { value: string; sub: string };
  evidence: string;
};

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  image: { src: string; alt: string };
  listing: Listing;
  // same length/order as ROWS
  rows: RowValue[];
};

export type RowMeta = {
  id: string;
  label: string;
  icon: LucideIcon;
};

// The 5 comparison-criteria rows — kept in the same order across all categories; only the values are recalculated per category
export const ROWS: RowMeta[] = [
  { id: "price", label: "Price basis", icon: Scale },
  { id: "condition", label: "Condition check", icon: ScanSearch },
  { id: "trust", label: "Seller trust", icon: ShieldCheck },
  { id: "time", label: "Search time", icon: Clock },
  { id: "fit", label: "Taste fit", icon: Target },
];

export const CATEGORIES: Category[] = [
  {
    id: "outer",
    label: "Outerwear",
    icon: Shirt,
    image: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
      alt: "Wool coats neatly hung on a clothing rack",
    },
    listing: {
      title: "Wool Single-Breasted Coat",
      brand: "Atelier Given",
      retail: 312000,
      repick: 148000,
      match: 96,
      grade: "S",
      gradeLabel: "Like-new condition",
      seller: "Verified seller · Haneul",
      sellerMeta: "171 transactions · 35% repeat-purchase rate",
    },
    rows: [
      {
        general: { value: "±38% error", sub: "Seller's arbitrary pricing" },
        repick: { value: "-53%", sub: "Based on real transaction prices" },
        evidence:
          "This coat is priced at 148,000 won, benchmarked against 178 real transactions of the same brand over the past 3 months.",
      },
      {
        general: { value: "3/9 items", sub: "Self-reported by seller" },
        repick: { value: "9/9 items", sub: "Measured by expert inspection team" },
        evidence:
          "Grade S was determined by physically inspecting 9 items, including 4% wear rate, no lining damage, and no missing buttons.",
      },
      {
        general: { value: "Rating not disclosed", sub: "Anonymous private transaction" },
        repick: { value: "4.8/5", sub: "Verified identity · Authenticity appraisal" },
        evidence: "Seller Haneul is a verified seller who passed authenticity appraisal, with 171 transactions and a 35% repeat-purchase rate.",
      },
      {
        general: { value: "58 min. avg.", sub: "Endless-scroll browsing" },
        repick: { value: "92 sec.", sub: "Instant AI match suggestion" },
        evidence: "With a taste, size, and budget profile set up, the next match takes just 92 seconds.",
      },
      {
        general: { value: "24% fit", sub: "Filtered by category only" },
        repick: { value: "96% match", sub: "Factors in taste, size, and budget" },
        evidence: "Matched at 96% fit by factoring in a preference for oversized silhouettes and budget range.",
      },
    ],
  },
  {
    id: "bag",
    label: "Bags",
    icon: ShoppingBag,
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
      alt: "A leather crossbody bag and accessories laid on the floor",
    },
    listing: {
      title: "Mini Crossbody Bag",
      brand: "Noir & Co.",
      retail: 268000,
      repick: 129000,
      match: 93,
      grade: "S",
      gradeLabel: "Like-new condition",
      seller: "Verified seller · Eunwoo",
      sellerMeta: "143 transactions · 4.8 rating",
    },
    rows: [
      {
        general: { value: "±42% error", sub: "Seller's arbitrary pricing" },
        repick: { value: "-52%", sub: "Based on real transaction prices" },
        evidence:
          "Priced at 129,000 won, benchmarked against 96 recent transactions of the same line.",
      },
      {
        general: { value: "2/9 items", sub: "Self-reported by seller" },
        repick: { value: "9/9 items", sub: "Measured by expert inspection team" },
        evidence:
          "Grade S was determined by physically inspecting 9 items, including hardware oxidation, zipper function, and base wear.",
      },
      {
        general: { value: "Rating not disclosed", sub: "Anonymous private transaction" },
        repick: { value: "4.8/5", sub: "Verified identity · Authenticity appraisal" },
        evidence: "Seller Eunwoo is a verified seller who passed authenticity appraisal, with 143 transactions and a 4.8 rating.",
      },
      {
        general: { value: "46 min. avg.", sub: "Endless-scroll browsing" },
        repick: { value: "81 sec.", sub: "Instant AI match suggestion" },
        evidence: "With a neutral-tone, minimalist taste profile set up, the next match takes just 81 seconds.",
      },
      {
        general: { value: "19% fit", sub: "Filtered by category only" },
        repick: { value: "93% match", sub: "Factors in taste, size, and budget" },
        evidence: "Matched at 93% fit by factoring in daily-use frequency and color preference.",
      },
    ],
  },
  {
    id: "shoes",
    label: "Shoes",
    icon: Footprints,
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
      alt: "A pair of classic white-toned sneakers",
    },
    listing: {
      title: "Leather Low-Top Sneakers",
      brand: "Fielder Studio",
      retail: 298000,
      repick: 139000,
      match: 95,
      grade: "S",
      gradeLabel: "Like-new condition",
      seller: "Verified seller · Junseo",
      sellerMeta: "189 transactions · 41% repeat-purchase rate",
    },
    rows: [
      {
        general: { value: "±31% error", sub: "Seller's arbitrary pricing" },
        repick: { value: "-53%", sub: "Based on real transaction prices" },
        evidence:
          "Priced at 139,000 won, benchmarked against 121 resale transactions of the same size and condition.",
      },
      {
        general: { value: "4/9 items", sub: "Self-reported by seller" },
        repick: { value: "9/9 items", sub: "Measured by expert inspection team" },
        evidence:
          "9 items were physically inspected, including 3% sole wear, a 0.5 cm measured size deviation, and adhesive condition.",
      },
      {
        general: { value: "Rating not disclosed", sub: "Anonymous private transaction" },
        repick: { value: "4.9/5", sub: "Verified identity · Authenticity appraisal" },
        evidence: "Seller Junseo is a verified seller who passed authenticity appraisal, with 189 transactions and a 41% repeat-purchase rate.",
      },
      {
        general: { value: "63 min. avg.", sub: "Endless-scroll browsing" },
        repick: { value: "104 sec.", sub: "Instant AI match suggestion" },
        evidence: "With a 270mm size and casual-style taste profile set up, the next match takes just 104 seconds.",
      },
      {
        general: { value: "21% fit", sub: "Filtered by category only" },
        repick: { value: "95% match", sub: "Factors in taste, size, and budget" },
        evidence: "Matched at 95% fit by factoring in measured size and casual-style preference.",
      },
    ],
  },
  {
    id: "top",
    label: "Tops",
    icon: Layers,
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
      alt: "Fashion shot of a person wearing a silk blouse",
    },
    listing: {
      title: "Cashmere V-Neck Knit",
      brand: "Studio Aren",
      retail: 246000,
      repick: 118000,
      match: 92,
      grade: "S",
      gradeLabel: "Like-new condition",
      seller: "Verified seller · Rina",
      sellerMeta: "127 transactions · 4.9 rating",
    },
    rows: [
      {
        general: { value: "±36% error", sub: "Seller's arbitrary pricing" },
        repick: { value: "-52%", sub: "Based on real transaction prices" },
        evidence:
          "Priced at 118,000 won, benchmarked against 84 recent transactions of the same material line.",
      },
      {
        general: { value: "3/9 items", sub: "Self-reported by seller" },
        repick: { value: "9/9 items", sub: "Measured by expert inspection team" },
        evidence:
          "Grade S was determined by physically inspecting 9 items, including pilling density, color transfer, and neckline stretching.",
      },
      {
        general: { value: "Rating not disclosed", sub: "Anonymous private transaction" },
        repick: { value: "4.9/5", sub: "Verified identity · Authenticity appraisal" },
        evidence: "Seller Rina is a verified seller who passed authenticity appraisal, with 127 transactions and a 4.9 rating.",
      },
      {
        general: { value: "41 min. avg.", sub: "Endless-scroll browsing" },
        repick: { value: "77 sec.", sub: "Instant AI match suggestion" },
        evidence: "With a neutral-tone, knit-material taste profile set up, the next match takes just 77 seconds.",
      },
      {
        general: { value: "23% fit", sub: "Filtered by category only" },
        repick: { value: "92% match", sub: "Factors in taste, size, and budget" },
        evidence: "Matched at 92% fit by factoring in material and fit preference along with budget range.",
      },
    ],
  },
];

// --- section 2: always-visible proof grid (no hover-gated reveal) --------
export type PreviewCard = {
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
  tags: [string, string];
};

export const PREVIEW_CARDS: PreviewCard[] = [
  {
    id: "coat",
    image: {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
      alt: "Fashion shot of a person wearing a beige oversized trench coat",
    },
    title: "Oversized Trench Coat",
    brand: "Aureum Vintage",
    retail: 268000,
    repick: 132000,
    match: 91,
    grade: "A",
    gradeLabel: "Light wear",
    seller: "Verified seller · Jimin",
    tags: ["Matched to oversized-fit preference", "Grade A or higher only"],
  },
  {
    id: "bag2",
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
    gradeLabel: "Light wear",
    seller: "Verified seller · Seoyeon",
    tags: ["Matched to neutral color", "Authenticity verified"],
  },
  {
    id: "sneaker",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
      alt: "Photo of a pair of high-top sneakers placed side by side",
    },
    title: "High-Top Leather Sneakers",
    brand: "Runway Archive",
    retail: 236000,
    repick: 112000,
    match: 94,
    grade: "S",
    gradeLabel: "Like-new condition",
    seller: "Verified seller · Minjae",
    tags: ["0.5 cm measured size deviation", "6% sole wear"],
  },
];

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Switch the tab, and the whole table recalculates",
    desc: "Pick a category and all five rows — price basis, condition, trust, search time, and fit — instantly recalculate with that category's real data.",
    icon: Table2,
  },
  {
    index: "02",
    title: "Open a row for deeper evidence",
    desc: "The baseline comparison values always stay visible in the table, and expanding a row reveals the actual listing photo, match percentage, grade, verification, and the before/after discount.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "Every one of the five criteria is proven with numbers",
    desc: "Price, condition, trust, time, fit — all five criteria are compared using measured, real-transaction data, leaving no room for guesswork.",
    icon: ShieldCheck,
  },
];

export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "128,000+", label: "Total resales" },
  { value: "9/9", label: "Inspected items" },
  { value: "4.9 / 5", label: "User satisfaction" },
];

export { Sparkles, BadgeCheck };
