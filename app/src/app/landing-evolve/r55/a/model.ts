// Pure, deterministic condition-grade math. The stepper's only state is an index (0–3) into
// GRADES — every number and sentence shown anywhere on the page for the "current" grade is
// derived from that index through the functions below, never stored or typed separately. This is
// what keeps the hero card, the "value, three ways" recap, and the closing CTA's headline from
// ever drifting apart: they all call the same two functions on the same index.

export interface Grade {
  id: string;
  /** Full display name, e.g. "Very Good". */
  name: string;
  /** Short form for tight chip labels. */
  short: string;
  /** Fraction of original retail price a buyer can expect to pay at this condition. */
  multiplier: number;
  /** What this grade means for the person buying it — a real sentence, not a number restated. */
  buyerNote: string;
}

export const GRADES: readonly Grade[] = [
  {
    id: "good",
    name: "Good",
    short: "Good",
    multiplier: 0.52,
    buyerNote:
      "Honest wear from real use. Fully functional, nothing hidden — priced for buyers who want the item, not the story.",
  },
  {
    id: "very-good",
    name: "Very Good",
    short: "V. Good",
    multiplier: 0.67,
    buyerNote:
      "Light signs of use only on close inspection. A dependable everyday pick at a clear discount.",
  },
  {
    id: "excellent",
    name: "Excellent",
    short: "Excellent",
    multiplier: 0.81,
    buyerNote:
      "Wear is barely visible even up close. Looks right in photos and in hand, still well below retail.",
  },
  {
    id: "like-new",
    name: "Like New",
    short: "Like New",
    multiplier: 0.94,
    buyerNote:
      "No visible wear. Looks as it did on day one — some listings still include the original tags or box.",
  },
] as const;

export const GRADE_COUNT = GRADES.length;

export function clampStep(step: number): number {
  return Math.min(GRADE_COUNT - 1, Math.max(0, step));
}

export function gradeAt(step: number): Grade {
  return GRADES[clampStep(step)];
}

/** The one formula every grade-derived price on this page runs through — base price × that
 * grade's resale multiplier, rounded to a whole dollar. Never hardcoded per grade. */
export function estimatedPrice(basePrice: number, step: number): number {
  return Math.round(basePrice * gradeAt(step).multiplier);
}

/** Before/after discount off original retail, derived from the same price formula above —
 * never a separately-authored number. */
export function discountPercent(basePrice: number, step: number): number {
  const price = estimatedPrice(basePrice, step);
  return Math.round((1 - price / basePrice) * 100);
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function isFirstGrade(step: number): boolean {
  return clampStep(step) === 0;
}

export function isLastGrade(step: number): boolean {
  return clampStep(step) === GRADE_COUNT - 1;
}
