// Pure, deterministic payout math — no Math.random / Date.now / new Date anywhere in this file.
// Every figure the receipt shows is derived only from the three selected ids below, so the same
// combination of inputs always renders the same numbers (hydration-safe, and testable by hand).

export type CategoryId = "outerwear" | "denim" | "sneakers" | "bags";
export type ConditionId = "like-new" | "excellent" | "good" | "fair";
export type AuthId = "standard" | "premium";
export type ShippingId = "standard" | "express" | "same-day";

export interface CategoryOption {
  id: CategoryId;
  label: string;
  /** Median resale base estimate for this category, in KRW, before any adjustment. */
  baseEstimate: number;
  photoId: string;
  alt: string;
  itemName: string;
}

export interface ConditionOption {
  id: ConditionId;
  label: string;
  shortLabel: string;
  /** Fraction of the base estimate deducted for this grade. */
  deductionRate: number;
}

export interface AuthOption {
  id: AuthId;
  label: string;
  shortLabel: string;
  fee: number;
  description: string;
}

export interface ShippingOption {
  id: ShippingId;
  label: string;
  shortLabel: string;
  fee: number;
  description: string;
}

export const CATEGORIES: CategoryOption[] = [
  {
    id: "outerwear",
    label: "Outerwear",
    baseEstimate: 210_000,
    photoId: "1489987707025-afc232f7ea0f",
    alt: "Wool double-breasted coat hung alone against a plain backdrop",
    itemName: "Wool overcoat",
  },
  {
    id: "denim",
    label: "Denim",
    baseEstimate: 98_000,
    photoId: "1516826957135-700dedea698c",
    alt: "Denim trucker jacket laid flat against a plain backdrop",
    itemName: "Denim trucker jacket",
  },
  {
    id: "sneakers",
    label: "Sneakers",
    baseEstimate: 145_000,
    photoId: "1542291026-7eec264c27ff",
    alt: "White and grey Nike running sneaker on a plain background",
    itemName: "Running sneakers",
  },
  {
    id: "bags",
    label: "Bags",
    baseEstimate: 265_000,
    photoId: "1553062407-98eeb64c6a62",
    alt: "Tan leather crossbody bag with a brass buckle",
    itemName: "Leather crossbody bag",
  },
];

export const CONDITIONS: ConditionOption[] = [
  { id: "like-new", label: "Like new", shortLabel: "Like new", deductionRate: 0.04 },
  { id: "excellent", label: "Excellent", shortLabel: "Excellent", deductionRate: 0.11 },
  { id: "good", label: "Good", shortLabel: "Good", deductionRate: 0.21 },
  { id: "fair", label: "Fair, visible wear", shortLabel: "Fair", deductionRate: 0.34 },
];

export const AUTH_TIERS: AuthOption[] = [
  {
    id: "standard",
    label: "Standard verification",
    shortLabel: "Standard",
    fee: 6_000,
    description: "Photo + serial cross-check",
  },
  {
    id: "premium",
    label: "Premium authentication",
    shortLabel: "Premium",
    fee: 15_000,
    description: "In-hand inspection, printed cert",
  },
];

export const SHIPPING_SPEEDS: ShippingOption[] = [
  { id: "standard", label: "Standard pickup", shortLabel: "Standard", fee: 3_000, description: "3–5 days" },
  { id: "express", label: "Express pickup", shortLabel: "Express", fee: 6_500, description: "1–2 days" },
  { id: "same-day", label: "Same-day pickup", shortLabel: "Same-day", fee: 12_000, description: "Today" },
];

/** repick's matching + escrow commission, applied to the post-condition subtotal. Fixed rate. */
export const SERVICE_FEE_RATE = 0.08;

export interface ReceiptLine {
  key: string;
  label: string;
  detail: string;
  amount: number;
  /** true = deduction (rendered with a minus sign and a down-tag, never color alone) */
  isDeduction: boolean;
}

export interface Receipt {
  category: CategoryOption;
  condition: ConditionOption;
  auth: AuthOption;
  shipping: ShippingOption;
  lines: ReceiptLine[];
  total: number;
}

const round10 = (n: number) => Math.round(n / 10) * 10;

export function computeReceipt(
  categoryId: CategoryId,
  conditionId: ConditionId,
  authId: AuthId,
  shippingId: ShippingId
): Receipt {
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const condition = CONDITIONS.find((c) => c.id === conditionId) ?? CONDITIONS[0];
  const auth = AUTH_TIERS.find((a) => a.id === authId) ?? AUTH_TIERS[0];
  const shipping = SHIPPING_SPEEDS.find((s) => s.id === shippingId) ?? SHIPPING_SPEEDS[0];

  const base = category.baseEstimate;
  const conditionDeduction = round10(base * condition.deductionRate);
  const subtotal = base - conditionDeduction;
  const serviceFee = round10(subtotal * SERVICE_FEE_RATE);
  const authFee = auth.fee;
  const shippingFee = shipping.fee;

  const total = subtotal - serviceFee - authFee - shippingFee;

  const lines: ReceiptLine[] = [
    {
      key: "base",
      label: "Base estimate",
      detail: `${category.label} · market comps`,
      amount: base,
      isDeduction: false,
    },
    {
      key: "condition",
      label: "Condition adjustment",
      detail: `${condition.label} · −${Math.round(condition.deductionRate * 100)}%`,
      amount: -conditionDeduction,
      isDeduction: true,
    },
    {
      key: "service",
      label: "repick service fee",
      detail: `${Math.round(SERVICE_FEE_RATE * 100)}% of subtotal`,
      amount: -serviceFee,
      isDeduction: true,
    },
    {
      key: "auth",
      label: "Authentication fee",
      detail: auth.description,
      amount: -authFee,
      isDeduction: true,
    },
    {
      key: "shipping",
      label: "Shipping & pickup",
      detail: `${shipping.label} · ${shipping.description}`,
      amount: -shippingFee,
      isDeduction: true,
    },
  ];

  return { category, condition, auth, shipping, lines, total };
}

export function formatKRW(amount: number): string {
  const sign = amount < 0 ? "−" : "";
  return `${sign}₩${Math.abs(Math.round(amount)).toLocaleString("en-US")}`;
}

export interface Testimonial {
  name: string;
  context: string;
  quote: string;
  rating: number;
  verified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Seoyeon P.",
    context: "Sold a wool coat, Mapo-gu",
    quote:
      "The receipt matched my payout to the won. No haggling in the chat, no surprise fee at the end.",
    rating: 5,
    verified: true,
  },
  {
    name: "Minjun K.",
    context: "Sold 3 denim jackets, Seongdong-gu",
    quote:
      "I moved the condition grade down one notch just to see it and the total updated instantly. Trustworthy.",
    rating: 5,
    verified: true,
  },
  {
    name: "Harin Y.",
    context: "Sold a leather bag, Gangnam-gu",
    quote: "Premium authentication paid for itself — it sold in a day at the listed estimate.",
    rating: 4,
    verified: true,
  },
];

export interface TrustStat {
  label: string;
  value: string;
}

export const TRUST_STATS: TrustStat[] = [
  { label: "Payout accuracy vs. final sale", value: "97%" },
  { label: "Items priced this month", value: "18,400+" },
  { label: "Median time to payout", value: "4.2 days" },
];

export const TRUST_SIGNALS: string[] = [
  "Escrow held until delivery",
  "Every fee itemized up front",
  "No hidden listing costs",
  "Authenticator network in 6 cities",
];
