// native/src/evolve/r47/a/data.ts — deterministic dummy data for
// InstantTradeInScreen (auto-native-r47 candidate a).
//
// This is NOT the appraisal-for-review flow in evolve/r25/a — there is no
// "submit and wait for Repick to confirm" step here. Every number on screen
// is computed live, client-side, from a fixed formula and the user's own
// answers, so the offer can be accepted or declined the instant it appears.

export type ConditionOption = {
  id: string;
  label: string;
  deductionUsd: number;
};

export type ConditionQuestion = {
  id: string;
  prompt: string;
  detail: string;
  options: ConditionOption[];
};

export const ITEM = {
  title: "Sony WH-1000XM4 Wireless Headphones",
  brand: "Sony",
  categoryLabel: "Electronics & Audio",
} as const;

// Instant-buyback math: a flat subtotal (already discounted from what the
// item might fetch peer-to-peer, to cover Repick's own resale risk and
// turnaround cost) minus whatever the condition answers deduct, floored at
// a guaranteed minimum so the offer never reads as zero or negative.
export const BASE_SUBTOTAL_USD = 120;
export const MIN_OFFER_USD = 15;
export const OFFER_VALID_HOURS = 24;

export const CONDITION_QUESTIONS: ConditionQuestion[] = [
  {
    id: "function",
    prompt: "Does it power on and work as expected?",
    detail: "Noise cancelling, Bluetooth pairing, and both ear cups functioning.",
    options: [
      { id: "full", label: "Works perfectly", deductionUsd: 0 },
      { id: "partial", label: "Minor issues (occasional static, slow pairing)", deductionUsd: 15 },
      { id: "broken", label: "Not functional", deductionUsd: 70 },
    ],
  },
  {
    id: "battery",
    prompt: "How is the battery health?",
    detail: "Rated for 30 hours of playback when new.",
    options: [
      { id: "full", label: "Holds a full charge", deductionUsd: 0 },
      { id: "reduced", label: "Reduced battery life", deductionUsd: 10 },
      { id: "none", label: "Won't hold a charge", deductionUsd: 30 },
    ],
  },
  {
    id: "cosmetic",
    prompt: "What's the cosmetic condition?",
    detail: "Check the headband, ear cushions, and outer shell.",
    options: [
      { id: "mint", label: "Like new, no visible wear", deductionUsd: 0 },
      { id: "scuffed", label: "Visible scuffs or scratches", deductionUsd: 8 },
      { id: "cracked", label: "Cracked housing or torn cushions", deductionUsd: 20 },
    ],
  },
  {
    id: "accessories",
    prompt: "Do you still have the original accessories?",
    detail: "Carrying case, charging cable, and audio cable.",
    options: [
      { id: "all", label: "Case, cable, and box all included", deductionUsd: 0 },
      { id: "some", label: "Missing some accessories", deductionUsd: 5 },
      { id: "none", label: "No original accessories", deductionUsd: 10 },
    ],
  },
  {
    id: "environment",
    prompt: "Was it used in a smoke-free, pet-free home?",
    detail: "Odor and pet hair affect resale even when the hardware is fine.",
    options: [
      { id: "clean", label: "Yes, smoke-free and pet-free", deductionUsd: 0 },
      { id: "exposed", label: "No, exposed to smoke or pets", deductionUsd: 5 },
    ],
  },
];

export function totalDeductionUsd(answers: Partial<Record<string, string>>): number {
  return CONDITION_QUESTIONS.reduce((sum, q) => {
    const chosenId = answers[q.id];
    const option = q.options.find((o) => o.id === chosenId);
    return sum + (option ? option.deductionUsd : 0);
  }, 0);
}

export function computeOfferUsd(answers: Partial<Record<string, string>>): number {
  const raw = BASE_SUBTOTAL_USD - totalDeductionUsd(answers);
  return Math.max(MIN_OFFER_USD, raw);
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(0)}`;
}
