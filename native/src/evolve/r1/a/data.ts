// native/src/evolve/r1/a/data.ts — Listing composer (auto-native-r1/a) fixed data + pure pricing math.
// Deterministic: no Math.random / Date.now / new Date(). Every value is a constant or a pure computation,
// so the payout the seller sees is reproducible across runs and platforms.

/* ───────── Steps ───────── */

export type StepId = "item" | "condition" | "review";
export type Step = { id: StepId; label: string; title: string; hint: string };

export const STEPS: readonly Step[] = [
  { id: "item", label: "Item", title: "What are you selling", hint: "Category sets the market average we price against." },
  { id: "condition", label: "Condition", title: "Condition grade", hint: "Grade and extras move the suggested price." },
  { id: "review", label: "Review", title: "Payout breakdown", hint: "Check every deduction before it goes live." },
];

/* ───────── Catalog (fixed) ───────── */

export type Category = { id: string; label: string; model: string; base: number };

// base = market average for a working unit of that category, in KRW.
export const CATEGORIES: readonly Category[] = [
  { id: "camera", label: "Compact camera", model: "Ricoh GR III", base: 640000 },
  { id: "audio", label: "Headphones", model: "Sony WH-1000XM4", base: 210000 },
  { id: "watch", label: "Mechanical watch", model: "Seiko SKX007", base: 380000 },
  { id: "bike", label: "Folding bike", model: "Brompton C Line", base: 1240000 },
];

export type Grade = { id: string; label: string; note: string; factor: number };

// factor = percentage of the market average a unit of that grade holds.
export const GRADES: readonly Grade[] = [
  { id: "S", label: "Like new", note: "Barely used, no marks", factor: 92 },
  { id: "A", label: "Excellent", note: "Light wear, fully working", factor: 80 },
  { id: "B", label: "Good", note: "Visible wear, works fine", factor: 66 },
  { id: "C", label: "Fair", note: "Heavy wear or one minor fault", factor: 48 },
];

export type Extra = { id: string; label: string; delta: number };

// delta = percentage points added to (or removed from) the grade factor.
export const EXTRAS: readonly Extra[] = [
  { id: "box", label: "Original box", delta: 4 },
  { id: "receipt", label: "Purchase receipt", delta: 2 },
  { id: "scratch", label: "Light scratches", delta: -6 },
];

export const FEE_PERCENT = 7;
export const SHIPPING_FEE = 3500;
export const PRICE_STEP = 5000;
export const PRICE_FLOOR = 10000;
export const TITLE_MAX = 60;

export const DEFAULT_CATEGORY_ID = "camera";
export const DEFAULT_GRADE_ID = "A";
export const DEFAULT_EXTRA_IDS: readonly string[] = ["box"];

/* ───────── Lookups ───────── */

export function findCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function findGrade(id: string): Grade {
  return GRADES.find((g) => g.id === id) ?? GRADES[1];
}

// Default listing title follows the category until the seller edits the field.
export function suggestedTitle(categoryId: string): string {
  const category = findCategory(categoryId);
  return `${category.model} · ${category.label.toLowerCase()}`;
}

/* ───────── Pricing (pure) ───────── */

// Percentage points contributed by the selected extras (box/receipt add, scratches subtract).
export function extraPercent(extraIds: readonly string[]): number {
  let total = 0;
  for (const extra of EXTRAS) {
    if (extraIds.includes(extra.id)) total += extra.delta;
  }
  return total;
}

const roundTo1000 = (won: number) => Math.round(won / 1000) * 1000;

// Estimated resale value for one grade, given the base average and the selected extras.
export function gradeValue(base: number, grade: Grade, extraPct: number): number {
  const percent = Math.max(grade.factor + extraPct, 5);
  return roundTo1000((base * percent) / 100);
}

// Sellers price within ±5% of the estimate in practice — that band becomes the suggested range.
export function suggestedRange(value: number): { low: number; high: number } {
  return { low: roundTo1000(value * 0.95), high: roundTo1000(value * 1.05) };
}

export function serviceFee(price: number): number {
  return Math.round((price * FEE_PERCENT) / 100);
}

// One tap on the price stepper. Clamped so the payout can never go negative or run past the market average.
export function stepPrice(price: number, direction: 1 | -1, base: number): number {
  const ceiling = roundTo1000(base * 1.5);
  const next = roundTo1000(price + direction * PRICE_STEP);
  return Math.min(Math.max(next, PRICE_FLOOR), ceiling);
}

export type Band = "in" | "above" | "below";

export type Quote = {
  category: Category;
  grade: Grade;
  extraPct: number;
  value: number; // estimate for the selected grade + extras
  low: number;
  high: number;
  price: number; // asking price (estimate, or the seller's override)
  fee: number;
  shipping: number;
  payout: number;
  band: Band;
  overridden: boolean;
};

export type QuoteInput = {
  categoryId: string;
  gradeId: string;
  extraIds: readonly string[];
  priceOverride: number | null;
  sellerPaysShipping: boolean;
};

// Single source of truth for every number on screen: one pure call recomputed on each state change.
export function buildQuote(input: QuoteInput): Quote {
  const category = findCategory(input.categoryId);
  const grade = findGrade(input.gradeId);
  const extraPct = extraPercent(input.extraIds);
  const value = gradeValue(category.base, grade, extraPct);
  const { low, high } = suggestedRange(value);
  const price = input.priceOverride ?? value;
  const fee = serviceFee(price);
  const shipping = input.sellerPaysShipping ? SHIPPING_FEE : 0;
  return {
    category,
    grade,
    extraPct,
    value,
    low,
    high,
    price,
    fee,
    shipping,
    payout: price - fee - shipping,
    band: price > high ? "above" : price < low ? "below" : "in",
    overridden: input.priceOverride !== null,
  };
}

/* ───────── Breakdown rows (step 3 list data) ───────── */

export type BreakdownRow = { id: string; label: string; amount: string; note: string; total: boolean };

export function breakdownRows(quote: Quote, sellerPaysShipping: boolean): BreakdownRow[] {
  return [
    { id: "price", label: "Asking price", amount: formatWon(quote.price), note: "What the buyer pays", total: false },
    {
      id: "fee",
      label: `Service fee ${FEE_PERCENT}%`,
      amount: `− ${formatWon(quote.fee)}`,
      note: "Covers payment and buyer protection",
      total: false,
    },
    {
      id: "shipping",
      label: "Shipping",
      amount: sellerPaysShipping ? `− ${formatWon(SHIPPING_FEE)}` : "Buyer pays",
      note: sellerPaysShipping ? "Prepaid label, door pickup" : "Added at checkout",
      total: false,
    },
    { id: "payout", label: "You receive", amount: formatWon(quote.payout), note: "Settled 2 days after delivery", total: true },
  ];
}

/* ───────── Formatting (deterministic, no toLocaleString) ───────── */

export function formatWon(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}₩${digits}`;
}

// Extras read as signed percentages so the direction is text, never color alone.
export function deltaLabel(delta: number): string {
  return `${delta > 0 ? "+" : "−"}${Math.abs(delta)}%`;
}

export function bandLabel(band: Band): string {
  if (band === "above") return "Above suggested";
  if (band === "below") return "Below suggested";
  return "In range";
}
