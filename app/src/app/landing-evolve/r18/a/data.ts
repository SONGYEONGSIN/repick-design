// Fixed, deterministic content only — no Math.random()/Date.now()/new Date() anywhere in this
// route. Every number below is a hand-picked constant so the page renders identically on server
// and client and on every reload.

export const ACCENT = "#B8791A"; // base amber/brass — fills, borders, ≥24px (or ≥19px bold) text
export const ACCENT_DEEP = "#8F5D12"; // darker tint — small text/icons/focus rings on light bg
export const ACCENT_TINT_BG = "rgba(184,121,26,0.12)"; // chip backgrounds behind ACCENT_DEEP text
export const INK = "#111114";
export const MUTED = "#6B6B72";
export const BORDER = "#E4E4E7";
export const BG = "#FAFAF8";
export const SURFACE = "#F1F0EC";

export type StageKey = "received" | "inspected" | "graded" | "verified" | "listed";

export interface FlawMarker {
  x: number; // 0-200 viewBox units
  y: number; // 0-140 viewBox units
  label: string;
}

export interface Stage {
  key: StageKey;
  index: number;
  label: string;
  timestamp: string;
  headline: string;
  notes: string;
  evidenceCaption: string;
  markers: FlawMarker[];
  checklistDone: number; // out of CHECKLIST.length
  metrics: {
    trustScore: number;
    matchedBuyers: number;
    price: number | null;
    originalPrice: number;
    discountPercent: number | null;
  };
  extraStat?: string;
}

export const CHECKLIST = [
  "Serial number matches manufacturer registry",
  "Shutter speeds tested 1/4s–1/1000s (within 4% tolerance)",
  "Light meter calibration confirmed",
  "Lens mount alignment passed",
];

export const PRODUCT_NAME = "Canon AE-1 Program — 35mm SLR";
export const PRODUCT_ID = "REPICK-CAM-0482";

export const STAGES: Stage[] = [
  {
    key: "received",
    index: 0,
    label: "Received",
    timestamp: "Day 0 · 09:14",
    headline: "Item received at inspection hub",
    notes:
      "Seller-declared condition: Good. Includes original strap and 50mm f/1.8 lens, no case. Six intake angles logged before any grading begins.",
    evidenceCaption: "Fig. 01 — Intake photo set, 6 angles logged",
    markers: [],
    checklistDone: 0,
    metrics: { trustScore: 42, matchedBuyers: 3, price: null, originalPrice: 310, discountPercent: null },
  },
  {
    key: "inspected",
    index: 1,
    label: "Inspected",
    timestamp: "Day 1 · 14:02",
    headline: "42-point AI vision scan complete",
    notes:
      "Detected light brassing on both baseplate corners and a small paint chip near the hot shoe. Shutter curtain travel measured even across six test frames.",
    evidenceCaption: "Fig. 02 — Flaw map: 3 wear points flagged, 0 structural",
    markers: [
      { x: 46, y: 100, label: "Baseplate corner brassing, left" },
      { x: 154, y: 100, label: "Baseplate corner brassing, right" },
      { x: 130, y: 34, label: "Paint chip near hot shoe" },
    ],
    checklistDone: 1,
    metrics: { trustScore: 61, matchedBuyers: 7, price: null, originalPrice: 310, discountPercent: null },
  },
  {
    key: "graded",
    index: 2,
    label: "Graded",
    timestamp: "Day 2 · 10:30",
    headline: "Condition grade assigned: B+ (Very Good)",
    notes:
      "Sub-scores — Optics 9.1, Body 7.8, Shutter 9.4, Cosmetic 7.2 (out of 10). Grade reflects light cosmetic wear with no functional impact on performance.",
    evidenceCaption: "Fig. 03 — Grade breakdown across 4 sub-scores",
    markers: [
      { x: 46, y: 100, label: "Baseplate corner brassing, left" },
      { x: 154, y: 100, label: "Baseplate corner brassing, right" },
      { x: 130, y: 34, label: "Paint chip near hot shoe" },
    ],
    checklistDone: 2,
    metrics: { trustScore: 78, matchedBuyers: 14, price: 186, originalPrice: 310, discountPercent: 40 },
  },
  {
    key: "verified",
    index: 3,
    label: "Verified",
    timestamp: "Day 3 · 16:45",
    headline: "Authenticity and function verified",
    notes:
      "All four verification checks passed with no exceptions. Nothing in the AI scan or grade changes as a result — verification confirms it, it doesn't revise it.",
    evidenceCaption: "Fig. 04 — 4/4 authenticity checks passed",
    markers: [
      { x: 46, y: 100, label: "Baseplate corner brassing, left" },
      { x: 154, y: 100, label: "Baseplate corner brassing, right" },
      { x: 130, y: 34, label: "Paint chip near hot shoe" },
    ],
    checklistDone: 4,
    metrics: { trustScore: 92, matchedBuyers: 21, price: 186, originalPrice: 310, discountPercent: 40 },
  },
  {
    key: "listed",
    index: 4,
    label: "Listed",
    timestamp: "Day 4 · 08:00",
    headline: "Live in the marketplace",
    notes:
      "Listed at $186, 40% below new-equivalent price. Matched to buyers whose saved searches align with grade B+ film cameras under $200.",
    evidenceCaption: "Fig. 05 — Listing published, matching engine active",
    markers: [
      { x: 46, y: 100, label: "Baseplate corner brassing, left" },
      { x: 154, y: 100, label: "Baseplate corner brassing, right" },
      { x: 130, y: 34, label: "Paint chip near hot shoe" },
    ],
    checklistDone: 4,
    metrics: { trustScore: 96, matchedBuyers: 24, price: 186, originalPrice: 310, discountPercent: 40 },
    extraStat: "Sells in ~2.4 days on average at this grade",
  },
];

export const DEFAULT_STAGE_INDEX = 2; // "Graded" — mid-pipeline, real proof already visible at rest

export interface Product {
  id: string;
  category: "Photography" | "Furniture" | "Accessories";
  title: string;
  grade: string;
  gradeLabel: string;
  sellerVerified: boolean;
  price: number;
  originalPrice: number;
  discountPercent: number;
  tags: string[];
  tone: string; // fixed hex used for the generated thumbnail panel
}

export const PRODUCTS: Product[] = [
  {
    id: "cam-0482",
    category: "Photography",
    title: "Canon AE-1 Program — 35mm SLR",
    grade: "B+",
    gradeLabel: "Very Good",
    sellerVerified: true,
    price: 186,
    originalPrice: 310,
    discountPercent: 40,
    tags: ["Matches: Film Photography search", "Similar to 3 saved items"],
    tone: "#8A8A93",
  },
  {
    id: "sideboard-0117",
    category: "Furniture",
    title: "Danish Teak Sideboard, 1960s Reissue",
    grade: "A-",
    gradeLabel: "Excellent",
    sellerVerified: true,
    price: 612,
    originalPrice: 1120,
    discountPercent: 45,
    tags: ["Matches: Mid-century search", "Local pickup available"],
    tone: "#9C8465",
  },
  {
    id: "aeron-0339",
    category: "Furniture",
    title: "Herman Miller Aeron, Size B",
    grade: "A",
    gradeLabel: "Like New",
    sellerVerified: true,
    price: 430,
    originalPrice: 895,
    discountPercent: 52,
    tags: ["Matches: Home Office search", "Price within your range"],
    tone: "#767B82",
  },
  {
    id: "seamaster-0071",
    category: "Accessories",
    title: "Omega Seamaster Automatic",
    grade: "B",
    gradeLabel: "Good",
    sellerVerified: false,
    price: 2380,
    originalPrice: 3550,
    discountPercent: 33,
    tags: ["Matches: Dress Watch search", "3 authenticity checks passed"],
    tone: "#8F8375",
  },
];

export const CATEGORIES: Array<Product["category"] | "All"> = ["All", "Photography", "Furniture", "Accessories"];

export const SOCIAL_STATS = [
  { value: "14,300+", label: "Items graded to date" },
  { value: "4.9 / 5", label: "Average buyer rating" },
  { value: "40%", label: "Avg. payout above trade-in value" },
];

export const TESTIMONIALS = [
  {
    quote: "I could see the exact frame the flaw map flagged before I paid. That's the first time a resale site earned my trust instead of asking for it.",
    author: "M. Alvarez",
    role: "Buyer, film photography",
  },
  {
    quote: "My sideboard was priced from four sub-scores I could read myself, not a stranger's guess. It sold in three days at the number the grade implied.",
    author: "R. Okafor",
    role: "Seller, furniture",
  },
  {
    quote: "The authenticity checklist on the watch listing was more thorough than the last two dealers I used in person.",
    author: "T. Lindqvist",
    role: "Buyer, accessories",
  },
];
