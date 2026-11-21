// native/src/evolve/r25/a/data.ts — deterministic dummy data for TradeInAppraisalScreen.
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value is a
// fixed literal or a pure function of the screen's own state.

export type DisclosureAnswer = "yes" | "no";

export type DisclosureQuestion = {
  id: string;
  /** The exact sentence shown to the buyer and echoed back in the blocked-state band. */
  prompt: string;
  detail: string;
  /** Which answer keeps the item at full estimated value. */
  favorableAnswer: DisclosureAnswer;
  /** Credit deducted from the high end of the estimate when the buyer picks the other answer. */
  deductionKrw: number;
};

export const DISCLOSURE_QUESTIONS: DisclosureQuestion[] = [
  {
    id: "power",
    prompt: "Does it power on and hold a charge normally?",
    detail: "Turn it on and let it run for a minute before answering.",
    favorableAnswer: "yes",
    deductionKrw: 40000,
  },
  {
    id: "audio",
    prompt: "Do noise cancellation and both ear cups work?",
    detail: "Check left and right audio and the ANC toggle.",
    favorableAnswer: "yes",
    deductionKrw: 15000,
  },
  {
    id: "cosmetic",
    prompt: "Any cracks, dents, or missing parts?",
    detail: "Look at the hinges, headband, and ear cup padding.",
    favorableAnswer: "no",
    deductionKrw: 12000,
  },
  {
    id: "cable",
    prompt: "Do you still have the original charging cable?",
    detail: "A third-party cable is fine to note as missing.",
    favorableAnswer: "yes",
    deductionKrw: 6000,
  },
];

export type HandoffMethod = {
  id: string;
  label: string;
  detail: string;
  turnaroundLabel: string;
};

export const HANDOFF_METHODS: HandoffMethod[] = [
  {
    id: "mail",
    label: "Mail-in kit",
    detail: "Repick emails a prepaid shipping label today. Pack the item within 5 days.",
    turnaroundLabel: "Credit issues ~2 days after we receive it",
  },
  {
    id: "store",
    label: "Store drop-off",
    detail: "Bring the item to a Repick partner store for an on-the-spot check.",
    turnaroundLabel: "Credit issues the same day",
  },
];

export type PayoutMethod = {
  id: string;
  label: string;
  detail: string;
  arrivalLabel: string;
  multiplier: number;
};

export const PAYOUT_METHODS: PayoutMethod[] = [
  {
    id: "credit",
    label: "Store credit",
    detail: "Adds a 10% bonus, redeemable on your next purchase.",
    arrivalLabel: "Available immediately after approval",
    multiplier: 1.1,
  },
  {
    id: "bank",
    label: "Bank transfer",
    detail: "Sent to your linked bank account, no bonus.",
    arrivalLabel: "Arrives in 1–3 business days",
    multiplier: 1,
  },
];

export type ItemPhoto = {
  id: string;
  label: string;
  /** Index into the tokens.color swatch cycle (kept out of tokens.ts consumers, resolved by the screen). */
  swatchIndex: number;
};

export const ITEM_PHOTOS: ItemPhoto[] = [
  { id: "ph-1", label: "Front", swatchIndex: 0 },
  { id: "ph-2", label: "Back", swatchIndex: 1 },
  { id: "ph-3", label: "Serial tag", swatchIndex: 2 },
  { id: "ph-4", label: "Cable + case", swatchIndex: 0 },
];

export const ITEM_SUMMARY = {
  title: "Sony WH-1000XM4 Wireless Headphones",
  brand: "Sony",
  categoryLabel: "Headphones · Over-ear",
  photoSourceLabel: "4 photos synced from your listing draft",
};

// Estimate model: start from a full-condition high end, subtract a fixed deduction per
// unfavorable disclosure answer, then apply the chosen payout method's multiplier. The low end
// trails the high end by a fixed spread, both floored so the range never goes negative.
export const ESTIMATE_BASE_HIGH_KRW = 96000;
export const ESTIMATE_SPREAD_KRW = 15000;
export const ESTIMATE_FLOOR_KRW = 15000;

export function estimateRangeKrw(
  deductionsKrw: number[],
  multiplier: number,
): { lowKrw: number; highKrw: number } {
  const totalDeduction = deductionsKrw.reduce((sum, d) => sum + d, 0);
  const highKrw = Math.max(
    ESTIMATE_FLOOR_KRW,
    Math.round((ESTIMATE_BASE_HIGH_KRW - totalDeduction) * multiplier),
  );
  const lowKrw = Math.max(
    Math.round(ESTIMATE_FLOOR_KRW * 0.6),
    highKrw - ESTIMATE_SPREAD_KRW,
  );
  return { lowKrw, highKrw };
}

export const SUBMISSION = {
  referenceId: "RA-58213",
  submittedAtLabel: "Sep 27, 10:42 AM",
  reviewWindowLabel: "1 business day",
};

// Thousands-separated KRW digits, no toLocaleString (deterministic across environments).
export function formatDigits(won: number): string {
  return Math.abs(Math.round(won))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
