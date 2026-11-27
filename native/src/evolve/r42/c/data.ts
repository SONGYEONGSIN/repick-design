// native/src/evolve/r42/c/data.ts — auto-native-r42 candidate c.
//
// Deterministic dummy data for the Split-Pay Plan Selector: the item being purchased and the
// three mutually-exclusive payment-TIMING plans the buyer can choose between before checkout.
// This is financing the buyer's own payment IN (one charge today vs. several smaller charges
// over time) — it has nothing to do with insurance/protection-coverage tiers and nothing to do
// with seller payouts.

export type PlanId = "full" | "four" | "twelve";

export interface PurchaseItemDef {
  title: string;
  seller: string;
  price: number; // dollars
}

export interface PlanDef {
  id: PlanId;
  name: string;
  /** How often a charge happens, e.g. "One-time charge today", "Every 2 weeks". */
  cadenceLabel: string;
  installmentCount: number;
  amountPerInstallment: number; // dollars, each charge
  totalCost: number; // dollars, sum of all charges including fee
  feeAmount: number; // dollars, 0 means no fee
  feeLabel: string; // "No fees" or "$3.00 service fee"
  description: string;
}

/** The item on the checkout screen this plan selector sits in front of. */
export const PURCHASE_ITEM: PurchaseItemDef = {
  title: "Vintage Leather Moto Jacket, Size M",
  seller: "sold by @dustyattic",
  price: 120.0,
};

/**
 * The three fixed, mutually-exclusive plan options. A small fixed set like this is rendered with
 * a plain .map() over the array below, not a FlatList — FlatList is for scrolling lists of
 * records, and three distinct named options is not that.
 */
export const PLAN_DEFINITIONS: PlanDef[] = [
  {
    id: "full",
    name: "Pay in Full",
    cadenceLabel: "One-time charge today",
    installmentCount: 1,
    amountPerInstallment: 120.0,
    totalCost: 120.0,
    feeAmount: 0,
    feeLabel: "No fees",
    description: "Charge the full amount to your default payment method today.",
  },
  {
    id: "four",
    name: "Pay in 4",
    cadenceLabel: "Every 2 weeks, 4 payments",
    installmentCount: 4,
    amountPerInstallment: 30.75,
    totalCost: 123.0,
    feeAmount: 3.0,
    feeLabel: "$3.00 service fee",
    description: "Split the cost into 4 equal biweekly payments with a small service fee.",
  },
  {
    id: "twelve",
    name: "Pay in 12",
    cadenceLabel: "Every month, 12 payments",
    installmentCount: 12,
    amountPerInstallment: 10.75,
    totalCost: 129.0,
    feeAmount: 9.0,
    feeLabel: "$9.00 service fee",
    description: "Spread the cost across 12 monthly payments with a larger service fee.",
  },
];

/** First charge date for whichever plan is chosen — fixed, never computed from "now". */
export const FIRST_PAYMENT_DATE = "Nov 9, 2026";

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
