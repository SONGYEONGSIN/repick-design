// native/src/evolve/r41/b/data.ts — auto-native-r41 candidate b: Protection Plan Picker.
//
// Deterministic dummy data for a PRE-purchase protection-plan comparison. The
// item being bought is fixed context (not part of the decision). The four
// PLAN_OPTIONS are the actual decision: "No protection plan" plus three paid
// tiers. Premium's bullets are a strict escalation of Plus's, which are in
// turn an escalation of Basic's (longer coverage window, more claims, faster
// turnaround, then free return shipping, then a one-time replacement) — the
// comparison is a coherent ladder, not three arbitrary feature lists.
//
// This screen is a LIVE, undecided selection — unlike
// evolve/r23/a/ProtectionCoverageScreen (a read-only record of a plan already
// attached to a past order). Nothing here is "attached" yet; everything is a
// provisional choice the buyer can still change before continuing.

export type ProtectionTierId = "basic" | "plus" | "premium";
export type PlanOptionId = "none" | ProtectionTierId;

export type PlanOption = {
  id: PlanOptionId;
  name: string;
  /** Flat one-time add-on cost in cents. 0 for "No protection plan". */
  priceCents: number;
  /** 2–4 short bullets describing what this option covers. */
  bullets: string[];
};

export const ITEM = {
  name: "Sony A7 III Mirrorless Camera Body",
  priceCents: 129900,
};

// Order: "No protection plan" first, as the valid baseline every buyer starts
// from, then the three paid tiers in ascending coverage.
export const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "none",
    name: "No protection plan",
    priceCents: 0,
    bullets: [
      "Covered only by repick's standard buyer guarantee",
      "No accidental-damage or loss coverage",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    priceCents: 499,
    bullets: [
      "90 days of accidental damage coverage",
      "1 claim per coverage term",
      "Standard repair turnaround",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    priceCents: 999,
    bullets: [
      "1 year of accidental damage coverage",
      "2 claims per coverage term",
      "Priority repair turnaround",
      "Free return shipping on approved claims",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceCents: 1999,
    bullets: [
      "2 years of accidental damage coverage",
      "Unlimited claims per coverage term",
      "Priority repair turnaround",
      "Free return shipping on approved claims",
      "One-time no-questions-asked replacement",
    ],
  },
];

export const INITIAL_SELECTION: PlanOptionId = "none";

export function findPlanOption(id: PlanOptionId): PlanOption {
  const found = PLAN_OPTIONS.find((option) => option.id === id);
  if (!found) {
    throw new Error(`Unknown plan option id: ${id}`);
  }
  return found;
}

/** "$4.99" / "$1,299.00" — cents formatted as a dollar string, always 2 decimals. */
export function formatUsdCents(cents: number): string {
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  return `$${dollars.toLocaleString("en-US")}.${remainder.toString().padStart(2, "0")}`;
}

/**
 * The single source of truth for the bottom band's running-total line.
 * Always derived from the live selected option — never a separately
 * hand-typed string — so the band can never drift from what the selected
 * card above it shows.
 */
export function continueBandLabel(selected: PlanOption): string {
  if (selected.priceCents === 0) {
    return "Continue — $0 added";
  }
  return `Continue — +${formatUsdCents(selected.priceCents)} (${selected.name})`;
}

/** Longer form of the same fact, read to screen readers when the Continue
 * button itself receives focus (independent of the live-region announcement
 * on the line above it). */
export function continueAccessibilityLabel(selected: PlanOption): string {
  if (selected.priceCents === 0) {
    return "Continue with no protection plan added";
  }
  return `Continue with ${selected.name} plan added, ${formatUsdCents(selected.priceCents)}`;
}
