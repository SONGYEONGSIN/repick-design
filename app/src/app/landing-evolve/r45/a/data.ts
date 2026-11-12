// Deterministic payout-receipt model for the Live Payout Receipt candidate.
// No Math.random / Date.now / new Date anywhere — computeReceipt(price, gradeId) is a pure
// function of its two inputs, so the exact same (price, grade) pair always produces the exact
// same five line items, on the server and the client, on every render.

export const MIN_PRICE = 15;
export const MAX_PRICE = 400;
export const PRICE_STEP = 5;
export const DEFAULT_PRICE = 85;

export const PLATFORM_FEE_RATE = 0.09; // flat 9% seller commission, applied after the condition deduction
export const SHIPPING_CREDIT = 4.5; // flat prepaid-label subsidy repick credits back to every seller

export type ConditionGradeId = "like-new" | "excellent" | "good" | "fair";

export type ConditionGrade = {
  id: ConditionGradeId;
  label: string;
  deductionRate: number; // fraction of listed price this grade typically loses on resale
  detail: string;
};

export const CONDITION_GRADES: ConditionGrade[] = [
  {
    id: "like-new",
    label: "Like New",
    deductionRate: 0.03,
    detail: "No visible wear. Buyers pay almost full listed value for this grade.",
  },
  {
    id: "excellent",
    label: "Excellent",
    deductionRate: 0.08,
    detail: "Light, honest wear. The most common grade across repick listings.",
  },
  {
    id: "good",
    label: "Good",
    deductionRate: 0.15,
    detail: "Visible wear or one small flaw — still fully wearable, priced for it.",
  },
  {
    id: "fair",
    label: "Fair",
    deductionRate: 0.25,
    detail: "Noticeable wear or a repair. Buyers expect the steepest discount at this grade.",
  },
];

export const DEFAULT_GRADE_ID: ConditionGradeId = "excellent";

export function gradeById(id: ConditionGradeId): ConditionGrade {
  return CONDITION_GRADES.find((g) => g.id === id) ?? CONDITION_GRADES[1];
}

export type ReceiptLines = {
  listedPrice: number;
  conditionDeduction: number;
  afterCondition: number;
  platformFee: number;
  shippingCredit: number;
  netPayout: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** The one formula the whole page threads through — pure function of price + grade only. */
export function computeReceipt(listedPrice: number, gradeId: ConditionGradeId): ReceiptLines {
  const grade = gradeById(gradeId);
  const conditionDeduction = round2(listedPrice * grade.deductionRate);
  const afterCondition = round2(listedPrice - conditionDeduction);
  const platformFee = round2(afterCondition * PLATFORM_FEE_RATE);
  const netPayout = round2(afterCondition - platformFee + SHIPPING_CREDIT);
  return {
    listedPrice,
    conditionDeduction,
    afterCondition,
    platformFee,
    shippingCredit: SHIPPING_CREDIT,
    netPayout,
  };
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

// ---- Catalog content (apparel, matching the repick resale catalog) ----

export const ITEM = {
  title: "Waxed cotton field jacket",
  brand: "Northbound Supply",
  image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=800&auto=format&fit=crop",
  alt: "Waxed cotton field jacket laid flat against a neutral background",
  verified: true,
  receiptNo: "00482",
};

export type Testimonial = { id: string; name: string; role: string; quote: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Priya K.",
    role: "Seller, 60+ listings",
    quote:
      "Every other app told me a number after the sale closed. This one itemizes the fee and the shipping credit before I even hit publish, so payout day is never a surprise.",
  },
  {
    id: "t2",
    name: "Owen M.",
    role: "Seller, outerwear and denim",
    quote:
      "I dragged the price down twenty dollars just to watch the deduction line shrink in real time. First payout calculator that made the math feel like mine, not the platform's.",
  },
];

export const STATS: { value: string; label: string }[] = [
  { value: "180K", label: "receipts itemized to date" },
  { value: "9%", label: "flat fee, every grade, no tiers" },
  { value: "2 days", label: "from sale to payout, on average" },
];
