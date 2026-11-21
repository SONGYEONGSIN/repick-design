// Deterministic dummy data for the "Appeal This Review" screen.
// No Math.random / Date.now / bare new Date anywhere in this module.

export type PolicyGround = {
  id: string;
  label: string;
  helper: string;
};

// Grounds a seller can cite — this app's own vocabulary for "policy-violation reasons".
export const POLICY_GROUNDS: PolicyGround[] = [
  {
    id: "remorse-mislabeled",
    label: "Buyer's remorse presented as a product defect",
    helper:
      "The review faults the item for something unrelated to its condition as described.",
  },
  {
    id: "off-platform-claim",
    label: "References a return or refund never requested in the app",
    helper: "No return, refund, or cancellation request exists on this order.",
  },
  {
    id: "personal-attack",
    label: "Targets me personally rather than the transaction",
    helper: "Comments about the seller as a person, not the item or the sale.",
  },
  {
    id: "conduct-violation",
    label: "Contains language that breaks the community conduct guidelines",
    helper: "Profanity, harassment, or threats aimed at the seller.",
  },
  {
    id: "wrong-order",
    label: "Appears to describe a different order entirely",
    helper: "Details in the review don't match what was actually shipped.",
  },
];

// The completed sale and the review attached to it. Fixed, specific, not placeholder text.
export const REVIEWED_SALE = {
  orderRef: "RPK-20593-A",
  itemTitle: "Patagonia Better Sweater, size M, sage green",
  buyerUsername: "thriftloom92",
  starRating: 1,
  reviewQuote:
    "Wanted a refund but seller never responded, sweater showed up with a weird smell too. Would not buy from this person again.",
  reviewDate: "Sep 28, 2026",
  soldDate: "Sep 19, 2026",
};

export const APPEAL_REFERENCE = `${REVIEWED_SALE.orderRef}-APL`;

export const MIN_EXPLANATION_CHARS = 40;
export const MIN_EXPLANATION_WORDS = 8;

export function wordCountOf(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

// Gate: substance check, not just "any text". Both a character floor and a word floor.
export function meetsExplanationBar(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < MIN_EXPLANATION_CHARS) return false;
  return wordCountOf(trimmed) >= MIN_EXPLANATION_WORDS;
}

// Deterministic estimate: a pure function of the current inputs, not a random guess.
// More cited grounds means more cross-checking; a longer account means more reading time.
export function estimateReviewWindowHours(
  groundCount: number,
  explanationLength: number
): number {
  const base = 24;
  const groundLoad = groundCount * 6;
  const readingLoad = Math.floor(explanationLength / 120) * 4;
  return Math.min(base + groundLoad + readingLoad, 72);
}

// Fixed demo resolution — picked deterministically, never randomized.
export const DUMMY_DECISION = {
  outcome: "removed" as "removed" | "upheld",
  decidedNote:
    "The review referenced a refund request that doesn't exist on this order. Removed for violating the no-return-on-record policy.",
  caseNumber: "TS-88214",
};
