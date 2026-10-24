// native/src/evolve/r30/a/data.ts
// Deterministic dummy data for the Pro Seller subscription plan screen.
// No Math.random / Date.now / bare `new Date()` — fixed literals only.

export type PlanStatus = "active";

export interface CurrentPlan {
  planName: string;
  tierLabel: string;
  priceLabel: string;
  billingCycle: string;
  renewalDate: string;
  memberSinceDate: string;
  status: PlanStatus;
}

export interface PlanBenefit {
  id: string;
  label: string;
  detail: string;
}

export const currentPlan: CurrentPlan = {
  planName: "Pro Seller",
  tierLabel: "Paid plan",
  priceLabel: "$14.00 / month",
  billingCycle: "Monthly, billed on the 4th",
  renewalDate: "November 4, 2026",
  memberSinceDate: "March 12, 2025",
  status: "active",
};

export const planBenefits: PlanBenefit[] = [
  {
    id: "listings",
    label: "Unlimited active listings",
    detail: "No cap on how many items you can list at once.",
  },
  {
    id: "placement",
    label: "Priority search placement",
    detail: "Your listings surface above Basic-plan sellers in search.",
  },
  {
    id: "fees",
    label: "Reduced selling fees",
    detail: "3% per sale, instead of the 8% Basic-plan rate.",
  },
  {
    id: "analytics",
    label: "Advanced sales analytics",
    detail: "Full access to trend and conversion breakdowns.",
  },
  {
    id: "support",
    label: "Priority support response",
    detail: "Replies to your tickets within 4 business hours.",
  },
];

// Copy shown once cancellation is confirmed. Built from the same `renewalDate`
// field shown in the plan card above, so the two can never drift apart.
export function buildCancellationNotice(renewalDate: string): string {
  return `Subscription cancelled. Your Pro benefits stay active through ${renewalDate}, then your account moves to the free Basic plan.`;
}

// Copy shown while the band is asking for confirmation, same source field.
export function buildConfirmationPrompt(renewalDate: string): string {
  return `Cancel your Pro plan? You'll keep Pro benefits until ${renewalDate}. This can't be undone from here.`;
}
