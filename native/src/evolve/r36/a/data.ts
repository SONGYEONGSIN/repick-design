// native/src/evolve/r36/a/data.ts
// Deterministic data for the Seller Payout Hold Review screen. No Math.random,
// no Date.now, no argument-less `new Date()` — every value here is fixed.

export type RequirementStatus = "pending" | "done";

export interface PayoutRequirement {
  id: string;
  title: string;
  detail: string;
  actionLabel: string;
  initialStatus: RequirementStatus;
}

export const payoutHoldMeta = {
  // KRW notation used consistently instead of the ₩ glyph, which crowds the
  // following digit on the -apple-system stack at body size.
  amountHeldLabel: "KRW 184,500",
  holdStartedLabel: "Oct 11, 2026",
  triggerSummary:
    "A new linked bank account, an open buyer dispute, and a sales volume spike were all flagged this week.",
};

export const payoutRequirements: PayoutRequirement[] = [
  {
    id: "bank-verify",
    title: "Verify your new linked bank account",
    detail:
      "Two small deposits were sent to the account added on Oct 9. Confirm both amounts to prove ownership.",
    actionLabel: "Confirm deposit amounts",
    initialStatus: "pending",
  },
  {
    id: "dispute-response",
    title: "Respond to the dispute on order #RP-48213",
    detail:
      "The buyer reported the item as not matching its description on Oct 10. Submit a response with photos or proof of condition within 5 days.",
    actionLabel: "Submit dispute response",
    initialStatus: "pending",
  },
  {
    id: "spike-review",
    title: "Confirm your identity for this week's sales spike",
    detail:
      "This week's sales volume is 3.4x your 90-day average. Confirm your identity so payouts can keep moving.",
    actionLabel: "Confirm identity",
    initialStatus: "pending",
  },
  {
    id: "shipment-proof",
    title: "Upload tracking for order #RP-48190",
    detail: "A tracking number was added and matched to the carrier on Oct 8.",
    actionLabel: "Tracking already confirmed",
    initialStatus: "done",
  },
  {
    id: "policy-ack",
    title: "Acknowledge the updated payout policy",
    detail:
      "Review the Oct 2026 payout policy update and acknowledge it before funds can release.",
    actionLabel: "Acknowledge policy update",
    initialStatus: "pending",
  },
];
