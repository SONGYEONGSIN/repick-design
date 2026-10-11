// Deterministic data module for the repick landing page (round r33, candidate b).
// Nothing here calls Math.random / Date.now / new Date — every number below is a fixed literal,
// hand-generated offline from a seeded index formula (see the round's scratch notes) and pasted in
// as plain data, so server and client always render the exact same markup.

import type { LucideIcon } from "lucide-react";
import {
  Footprints,
  Watch,
  ShoppingBag,
  Shirt,
} from "lucide-react";

// ---- Ledger Calendar: comparable-sale ledger for one model --------------------------------
// 96 closed resale sales of a single sneaker model, collected over a trailing 12-month window.
// Each sale carries the month it closed in, which $20-wide price band it landed in, the grade the
// condition inspection gave it, and whether authenticity and the seller were verified.
export type Grade = "A" | "B" | "C";

export interface SaleRecord {
  id: string;
  month: number; // 0..11, index into MONTH_LABELS
  band: number; // 0..5, index into BAND_LABELS
  price: number;
  grade: Grade;
  authVerified: boolean;
  sellerVerified: boolean;
}

export const MONTH_LABELS: string[] = [
  "Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug", "Sep", "Oct",
];

export const BAND_LABELS: string[] = [
  "Under $130",
  "$130–149",
  "$150–169",
  "$170–189",
  "$190–209",
  "$210+",
];

export const SALES: SaleRecord[] = [
  { id: "s001", month: 0, band: 2, price: 150, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s002", month: 0, band: 3, price: 180, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s003", month: 0, band: 1, price: 136, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s004", month: 0, band: 4, price: 192, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s005", month: 0, band: 2, price: 169, grade: "A", authVerified: false, sellerVerified: true },
  { id: "s006", month: 0, band: 3, price: 185, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s007", month: 0, band: 0, price: 117, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s008", month: 0, band: 5, price: 213, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s009", month: 1, band: 2, price: 169, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s010", month: 1, band: 1, price: 146, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s011", month: 1, band: 4, price: 202, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s012", month: 1, band: 3, price: 172, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s013", month: 1, band: 3, price: 170, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s014", month: 1, band: 0, price: 108, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s015", month: 1, band: 5, price: 223, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s016", month: 1, band: 2, price: 159, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s017", month: 2, band: 1, price: 149, grade: "A", authVerified: false, sellerVerified: true },
  { id: "s018", month: 2, band: 4, price: 205, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s019", month: 2, band: 1, price: 143, grade: "C", authVerified: false, sellerVerified: true },
  { id: "s020", month: 2, band: 3, price: 180, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s021", month: 2, band: 0, price: 116, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s022", month: 2, band: 5, price: 226, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s023", month: 2, band: 2, price: 162, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s024", month: 2, band: 3, price: 178, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s025", month: 3, band: 4, price: 197, grade: "A", authVerified: false, sellerVerified: false },
  { id: "s026", month: 3, band: 2, price: 153, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s027", month: 3, band: 3, price: 183, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s028", month: 3, band: 0, price: 119, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s029", month: 3, band: 5, price: 215, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s030", month: 3, band: 3, price: 172, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s031", month: 3, band: 3, price: 170, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s032", month: 3, band: 1, price: 140, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s033", month: 4, band: 2, price: 156, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s034", month: 4, band: 3, price: 172, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s035", month: 4, band: 0, price: 129, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s036", month: 4, band: 5, price: 225, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s037", month: 4, band: 2, price: 157, grade: "A", authVerified: false, sellerVerified: false },
  { id: "s038", month: 4, band: 3, price: 173, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s039", month: 4, band: 0, price: 129, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s040", month: 4, band: 4, price: 206, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s041", month: 5, band: 3, price: 182, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s042", month: 5, band: 1, price: 132, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s043", month: 5, band: 5, price: 210, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s044", month: 5, band: 1, price: 146, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s045", month: 5, band: 3, price: 183, grade: "A", authVerified: false, sellerVerified: true },
  { id: "s046", month: 5, band: 1, price: 139, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s047", month: 5, band: 4, price: 209, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s048", month: 5, band: 2, price: 165, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s049", month: 6, band: 0, price: 108, grade: "C", authVerified: false, sellerVerified: true },
  { id: "s050", month: 6, band: 5, price: 220, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s051", month: 6, band: 2, price: 156, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s052", month: 6, band: 3, price: 186, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s053", month: 6, band: 1, price: 142, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s054", month: 6, band: 4, price: 198, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s055", month: 6, band: 2, price: 157, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s056", month: 6, band: 3, price: 173, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s057", month: 7, band: 5, price: 223, grade: "A", authVerified: false, sellerVerified: true },
  { id: "s058", month: 7, band: 2, price: 159, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s059", month: 7, band: 3, price: 175, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s060", month: 7, band: 2, price: 152, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s061", month: 7, band: 4, price: 190, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s062", month: 7, band: 2, price: 160, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s063", month: 7, band: 3, price: 176, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s064", month: 7, band: 0, price: 112, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s065", month: 8, band: 2, price: 169, grade: "A", authVerified: false, sellerVerified: true },
  { id: "s066", month: 8, band: 3, price: 185, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s067", month: 8, band: 1, price: 137, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s068", month: 8, band: 4, price: 193, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s069", month: 8, band: 1, price: 149, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s070", month: 8, band: 3, price: 186, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s071", month: 8, band: 0, price: 122, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s072", month: 8, band: 5, price: 229, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s073", month: 9, band: 3, price: 170, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s074", month: 9, band: 0, price: 126, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s075", month: 9, band: 4, price: 203, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s076", month: 9, band: 2, price: 159, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s077", month: 9, band: 3, price: 189, grade: "A", authVerified: false, sellerVerified: true },
  { id: "s078", month: 9, band: 0, price: 125, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s079", month: 9, band: 4, price: 203, grade: "C", authVerified: false, sellerVerified: true },
  { id: "s080", month: 9, band: 2, price: 160, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s081", month: 10, band: 1, price: 136, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s082", month: 10, band: 4, price: 206, grade: "A", authVerified: true, sellerVerified: false },
  { id: "s083", month: 10, band: 2, price: 162, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s084", month: 10, band: 3, price: 178, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s085", month: 10, band: 0, price: 117, grade: "A", authVerified: false, sellerVerified: false },
  { id: "s086", month: 10, band: 5, price: 213, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s087", month: 10, band: 2, price: 163, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s088", month: 10, band: 3, price: 179, grade: "B", authVerified: true, sellerVerified: false },
  { id: "s089", month: 11, band: 4, price: 195, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s090", month: 11, band: 3, price: 172, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s091", month: 11, band: 3, price: 170, grade: "B", authVerified: true, sellerVerified: true },
  { id: "s092", month: 11, band: 0, price: 120, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s093", month: 11, band: 5, price: 216, grade: "B", authVerified: false, sellerVerified: true },
  { id: "s094", month: 11, band: 2, price: 152, grade: "C", authVerified: false, sellerVerified: false },
  { id: "s095", month: 11, band: 3, price: 189, grade: "A", authVerified: true, sellerVerified: true },
  { id: "s096", month: 11, band: 1, price: 145, grade: "B", authVerified: true, sellerVerified: false },
];

export const LEDGER_MODEL_NAME = "Air Current 97 — Triple White";
export const LISTING_PRICE = 158;
export const LISTING_RETAIL = 225;
export const LISTING_DISCOUNT_PCT = Math.round(
  ((LISTING_RETAIL - LISTING_PRICE) / LISTING_RETAIL) * 100,
);
export const LISTING_MATCH_PCT = 94;
export const LISTING_GRADE = "A−";

// ---- Filters ---------------------------------------------------------------------------------
export interface FilterState {
  gradeA: boolean;
  authVerified: boolean;
  sellerVerified: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  gradeA: false,
  authVerified: false,
  sellerVerified: false,
};

export function filterSales(filters: FilterState): SaleRecord[] {
  return SALES.filter(
    (s) =>
      (!filters.gradeA || s.grade === "A") &&
      (!filters.authVerified || s.authVerified) &&
      (!filters.sellerVerified || s.sellerVerified),
  );
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export interface LedgerGrid {
  // cells[bandIndex][monthIndex] = count of sales in that price band, that month, under the
  // active filters. Row 0 = the highest price band (drawn at the top), row 5 = the lowest.
  cells: number[][];
  maxCount: number;
  nonzeroCells: number;
  totalCells: number;
}

export function buildGrid(filtered: SaleRecord[]): LedgerGrid {
  const bandCount = BAND_LABELS.length;
  const monthCount = MONTH_LABELS.length;
  const cells: number[][] = Array.from({ length: bandCount }, () =>
    Array.from({ length: monthCount }, () => 0),
  );
  filtered.forEach((s) => {
    cells[s.band][s.month] += 1;
  });
  let maxCount = 0;
  let nonzeroCells = 0;
  cells.forEach((row) =>
    row.forEach((c) => {
      if (c > maxCount) maxCount = c;
      if (c > 0) nonzeroCells += 1;
    }),
  );
  return { cells, maxCount, nonzeroCells, totalCells: bandCount * monthCount };
}

export interface LedgerStats {
  filtered: SaleRecord[];
  grid: LedgerGrid;
  count: number;
  medianPrice: number | null;
  beatsPct: number | null; // % of filtered comps the listing's own price undercuts (priced higher)
}

export function computeStats(filters: FilterState): LedgerStats {
  const filtered = filterSales(filters);
  const grid = buildGrid(filtered);
  const prices = filtered.map((s) => s.price);
  const medianPrice = median(prices);
  const higher = prices.filter((p) => p > LISTING_PRICE).length;
  const beatsPct = prices.length
    ? Math.round((higher / prices.length) * 100)
    : null;
  return { filtered, grid, count: filtered.length, medianPrice, beatsPct };
}

export function activeFilterCount(filters: FilterState): number {
  return [filters.gradeA, filters.authVerified, filters.sellerVerified].filter(
    Boolean,
  ).length;
}

export function describeFilters(filters: FilterState): string {
  const parts: string[] = [];
  if (filters.gradeA) parts.push("Grade A only");
  if (filters.authVerified) parts.push("authenticity verified");
  if (filters.sellerVerified) parts.push("seller verified");
  if (parts.length === 0) return "every closed sale in the last 12 months";
  return parts.join(", ");
}

// ---- Product preview cards --------------------------------------------------------------
export interface Product {
  id: string;
  name: string;
  categoryLabel: string;
  icon: LucideIcon;
  photoId: string; // images.unsplash.com/photo-<id>, fixed real photo, reused across the catalog
  matchPct: number;
  conditionGrade: string;
  priceBefore: number;
  priceAfter: number;
  discountPct: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "p-sneakers",
    name: "Air Current 97 — Triple White",
    categoryLabel: "Sneakers",
    icon: Footprints,
    photoId: "1495121605193-b116b5b09a56",
    matchPct: 94,
    conditionGrade: "A−",
    priceBefore: 225,
    priceAfter: 158,
    discountPct: 30,
  },
  {
    id: "p-watch",
    name: "Meridian Diver 200m",
    categoryLabel: "Watches",
    icon: Watch,
    photoId: "1524805444758-089113d48a6d",
    matchPct: 91,
    conditionGrade: "B+",
    priceBefore: 640,
    priceAfter: 452,
    discountPct: 29,
  },
  {
    id: "p-bag",
    name: "Canvas Field Tote",
    categoryLabel: "Bags",
    icon: ShoppingBag,
    photoId: "1553062407-98eeb64c6a62",
    matchPct: 88,
    conditionGrade: "A",
    priceBefore: 175,
    priceAfter: 121,
    discountPct: 31,
  },
  {
    id: "p-jacket",
    name: "Shearling Field Jacket",
    categoryLabel: "Outerwear",
    icon: Shirt,
    photoId: "1509631179647-0177331693ae",
    matchPct: 90,
    conditionGrade: "A−",
    priceBefore: 390,
    priceAfter: 246,
    discountPct: 37,
  },
];

// ---- Social proof -------------------------------------------------------------------------
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "I filtered the ledger down to verified sellers only and the median barely moved — that told me more than any single review could.",
    name: "Mia R.",
    location: "Austin, TX",
  },
  {
    id: "t-2",
    quote:
      "Seeing the actual month-by-month sales, not a summary of them, is what made me trust the asking price.",
    name: "Theo K.",
    location: "Chicago, IL",
  },
  {
    id: "t-3",
    quote:
      "I listed expecting a week of back-and-forth over price. The ledger had already made the case for me.",
    name: "Priya N.",
    location: "Seattle, WA",
  },
  {
    id: "t-4",
    quote:
      "Grade A, verified, twelve months of comps — the discount stopped feeling like a guess.",
    name: "Daniel O.",
    location: "Brooklyn, NY",
  },
];

export const TRUST_STATS: { label: string; value: string }[] = [
  { label: "Closed sales in this ledger", value: "96" },
  { label: "Verified sellers", value: "6,200+" },
  { label: "Average buyer rating", value: "4.9 / 5" },
];
