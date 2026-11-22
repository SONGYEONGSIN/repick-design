// native/src/evolve/r61/a/data.ts
// Deterministic mock data for the seller identity re-verification screen.
// No Math.random / Date.now / no-arg `new Date()` anywhere below — every
// value is a fixed literal.

export type StepId = "legalName" | "govId" | "selfie" | "payout";

export interface RecheckStepDef {
  id: StepId;
  /** Card title. */
  title: string;
  /** One or two sentences explaining what the step covers. */
  detail: string;
  /** Label on the step's own action control. */
  actionLabel: string;
  /** Truthful accessibilityHint for that action — describes only what pressing it actually does. */
  actionHint: string;
  /** Lowercase imperative clause slotted into the band's blocking sentence. */
  blockingPhrase: string;
}

export const CASE_REFERENCE = "SIR-20264";

export const SELLER_LEGAL_NAME = "Morgan J. Ellis";

export const PAYOUT_ACCOUNT_LAST4 = "4421";

export const INTRO_SENTENCE =
  "Your seller account was flagged for a routine identity re-check. Complete all 4 steps below, in any order, then submit for review.";

export const READY_SENTENCE =
  "All 4 steps are complete. Submit for review when you're ready.";

export const SUBMITTED_SENTENCE =
  "Submitted for review. We'll message you with the result, usually within 1 business day.";

// Fixed canonical order — used only to pick which single step the band names
// when more than one is still incomplete. It does not restrict the order in
// which a seller may complete them; each step's own action works regardless
// of the other three.
export const RECHECK_STEPS: RecheckStepDef[] = [
  {
    id: "legalName",
    title: "Confirm legal name",
    detail: `Your legal name on file is "${SELLER_LEGAL_NAME}". Confirm it still matches the name printed on your government ID.`,
    actionLabel: "Confirm name matches ID",
    actionHint: "Marks the legal name step as confirmed.",
    blockingPhrase: "confirm your legal name still matches your ID",
  },
  {
    id: "govId",
    title: "Government ID photo",
    detail:
      "Upload a new photo of an unexpired, government-issued photo ID — passport, driver's license, or national ID card.",
    actionLabel: "Upload ID photo",
    actionHint: "Marks the government ID photo step as complete.",
    blockingPhrase: "re-upload a photo of your government ID",
  },
  {
    id: "selfie",
    title: "Selfie holding your ID",
    detail:
      "Upload a new photo of yourself holding that same ID next to your face, taken in a well-lit room.",
    actionLabel: "Upload selfie with ID",
    actionHint: "Marks the selfie-with-ID step as complete.",
    blockingPhrase: "re-upload a selfie holding your ID",
  },
  {
    id: "payout",
    title: "Payout bank account",
    detail: `Confirm the bank account ending •${PAYOUT_ACCOUNT_LAST4} saved for your payouts is still yours.`,
    actionLabel: "Confirm bank account",
    actionHint: "Marks the payout bank account step as confirmed.",
    blockingPhrase: "confirm your payout bank account is still yours",
  },
];

export const INITIAL_COMPLETION: Record<StepId, boolean> = {
  legalName: false,
  govId: false,
  selfie: false,
  payout: false,
};
