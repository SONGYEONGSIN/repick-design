// native/src/evolve/r17/b/data.ts — auto-native-r17 candidate b (Item Authentication Submission).
// Deterministic dummy data only — no Math.random / Date.now / argument-less new Date() anywhere.
// "Today" is treated as the fixed literal Sep 1, 2026 (matching this round's generation date),
// never derived from the real clock.

export interface RequiredPhotoSlot {
  id: string;
  /** Short label shown on the row and used in the "why blocked" sentence. */
  label: string;
  /** What the seller should capture — shown under the label. */
  hint: string;
}

// Five angles a human authenticator actually needs to grade a used luxury item: overall front,
// overall back, the serial/date-code/tag close-up (the single most fraud-relevant shot), the
// brand mark/hardware stamping, and a flaw close-up (or the cleanest area if the item has none).
export const REQUIRED_PHOTO_SLOTS: RequiredPhotoSlot[] = [
  {
    id: "front",
    label: "Front of item",
    hint: "Full front view, item flat or upright, even lighting",
  },
  {
    id: "back",
    label: "Back of item",
    hint: "Full back view showing overall shape and condition",
  },
  {
    id: "serial",
    label: "Serial number or authenticity tag",
    hint: "Close-up of the serial, date code, or authenticity card",
  },
  {
    id: "brandMark",
    label: "Brand mark or hardware stamp",
    hint: "Close-up of the logo, engraving, or hardware stamping",
  },
  {
    id: "flaw",
    label: "Flaws or wear",
    hint: "Close-up of any scratches, stains, or repairs — if none, the cleanest corner",
  },
];

export const ITEM = {
  title: "Chanel Classic Flap — Medium, Caviar",
  subtitle: "Handbags · Chanel",
  conditionLabel: "Seller-reported condition: Good, light corner wear",
  estimatedFeeKrw: 45000,
  turnaroundLabel: "3–5 business days once submitted",
};

export const DECLARATION_TEXT =
  "The photos above accurately represent this item's current condition, and I have not altered, repaired, or restored it in a way that isn't shown.";

// Fixed submission record created the moment the seller taps Submit. Every date is a literal
// string anchored to the round's fixed "today" (Sep 1, 2026) — never computed from the real clock.
export const SUBMISSION = {
  id: "AUTH-58213",
  submittedDateLabel: "Sep 1, 2026",
};

export interface ReviewStep {
  id: string;
  label: string;
  dateLabel: string;
  done: boolean;
}

export const REVIEW_STEPS: ReviewStep[] = [
  { id: "r1", label: "Submission received", dateLabel: "Sep 1, 2026", done: true },
  { id: "r2", label: "Photos verified by our team", dateLabel: "Expected by Sep 2, 2026", done: false },
  { id: "r3", label: "Physical inspection at partner lab", dateLabel: "Expected by Sep 4, 2026", done: false },
  { id: "r4", label: "Authentication result ready", dateLabel: "Expected by Sep 6, 2026", done: false },
];

export function formatKrwDigits(amount: number): string {
  return amount.toLocaleString("en-US");
}
