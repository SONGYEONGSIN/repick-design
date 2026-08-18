// native/src/evolve/r8/b/data.ts — deterministic dummy data for the "Write a Review" composer.
// No Math.random / Date.now / argless `new Date()` anywhere in this file — every value below is a
// fixed literal or derived from fixed literals.

export type QuickTag = { id: string; label: string };

// The order this review is attached to. A buyer is reviewing the seller who handed off the item —
// invented direction (repick supports both directions; this candidate fixes one to keep the summary
// header unambiguous). All fields are fixed strings, not computed from any clock.
export const REVIEW_SUBJECT = {
  orderId: "RPK-58213",
  itemTitle: "Patagonia Better Sweater, size M",
  itemDetail: "Outerwear · Good condition",
  counterpartyName: "Jordan Whitfield",
  counterpartyRole: "Seller",
  completedOn: "Aug 14, 2026",
  initials: "JW",
} as const;

// 1-5 star value -> a short plain-language label shown next to the selected star count.
export const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

// Six quick tags a reviewer can multi-select. Fixed set, no randomness, chosen to cover the four
// dimensions buyers most often comment on for a secondhand handoff: speed, accuracy, communication,
// and packaging/repeat-intent.
export const QUICK_TAGS: QuickTag[] = [
  { id: "shipping", label: "Fast shipping" },
  { id: "described", label: "As described" },
  { id: "communication", label: "Great communication" },
  { id: "packaging", label: "Well packaged" },
  { id: "rebuy", label: "Would buy again" },
  { id: "easy", label: "Easy to work with" },
];

// Soft cap on the free-text field, shown as a live counter. Chosen to be generous enough for a real
// paragraph of feedback while keeping the summary card above it visually dominant.
export const FEEDBACK_MAX_LENGTH = 500;

// Fixed, non-random delay used to render a genuine loading -> success submit transition (Forms
// catalog: "제출 피드백: 로딩→성공/에러 / not 무반응"). Not derived from any clock read.
export const SUBMIT_DELAY_MS = 600;

// Fixed 5-point star polygon (viewBox 0 0 24 24), used for every star in the rating row so the
// control renders as a vector shape rather than a platform emoji glyph.
export const STAR_POLYGON_POINTS =
  "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26";
