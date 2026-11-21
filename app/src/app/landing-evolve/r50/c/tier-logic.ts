// tier-logic.ts — pure, deterministic rules for the Seller Tier Ladder.
// No React, no Math.random / Date.now anywhere: every output is a function of `checked` alone,
// so the same five booleans always produce the same score, tier, perks and projection no matter
// which surface on the page is reading them.

export type ChecklistItemId =
  | "id-verified"
  | "photos-verified"
  | "return-policy"
  | "fast-ship"
  | "bank-linked";

export type ChecklistItem = {
  id: ChecklistItemId;
  label: string;
  weight: number; // contribution to the 0-100 trust score
  description: string; // "why this matters" disclosure copy
};

// Weights are intentionally uneven — ID verification is worth twice a return policy — so the
// *combination* of checked items matters, not merely the count of them.
export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "id-verified",
    label: "ID verified",
    weight: 30,
    description:
      "Government ID matched against the seller's linked bank name. The single strongest trust signal repick checks for.",
  },
  {
    id: "photos-verified",
    label: "Photos verified",
    weight: 20,
    description:
      "Every listing photo passed repick's vision model for authenticity — no stock images, no reused shots from other listings.",
  },
  {
    id: "fast-ship",
    label: "Fast-ship enabled",
    weight: 20,
    description:
      "Seller commits to dispatch within 24 hours. Buyers filter for this directly, so it carries real weight in search ranking.",
  },
  {
    id: "return-policy",
    label: "Return policy published",
    weight: 15,
    description:
      "A written return window buyers can read before they commit, shown next to the AI match score on every listing.",
  },
  {
    id: "bank-linked",
    label: "Bank account linked",
    weight: 15,
    description:
      "Enables instant payout the moment a sale completes, instead of the standard five-business-day hold.",
  },
];

export const MAX_SCORE = CHECKLIST_ITEMS.reduce((sum, item) => sum + item.weight, 0); // 100

// Non-trivial default: two of five steps already done, so the page has visible proof at rest —
// never an empty or all-checked starting state.
export const DEFAULT_CHECKED: ChecklistItemId[] = ["id-verified", "photos-verified"];

export type Tier = { name: string; min: number };

export const TIERS: Tier[] = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 40 },
  { name: "Gold", min: 65 },
  { name: "Platinum", min: 90 },
];

export function scoreFor(checked: ReadonlySet<ChecklistItemId>): number {
  const raw = CHECKLIST_ITEMS.reduce((sum, item) => sum + (checked.has(item.id) ? item.weight : 0), 0);
  // Guard: clamp even though the weights sum to exactly MAX_SCORE, so this stays correct if the
  // checklist is ever edited without re-balancing the weights.
  return Math.min(MAX_SCORE, Math.max(0, raw));
}

export function tierFor(score: number): Tier {
  // TIERS[0].min is 0, so this always matches at least one tier — guards the zero-checked case —
  // and the highest-matching tier is always returned, guarding the all-checked case too.
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (score >= tier.min) current = tier;
  }
  return current;
}

export function tierIndex(tier: Tier): number {
  return TIERS.findIndex((t) => t.name === tier.name);
}

export type NextTierInfo =
  | { reached: true }
  | { reached: false; nextTier: Tier; needed: number; nextItems: ChecklistItem[] };

/**
 * How many more checklist items — and which ones — would it take to cross into the next tier,
 * starting from the current combination? Picking the highest-weight missing items first is the
 * minimum-count way to cross a target sum, so "needed" is never an over- or under-claim.
 */
export function nextTierInfo(checked: ReadonlySet<ChecklistItemId>): NextTierInfo {
  const score = scoreFor(checked);
  const current = tierFor(score);
  const idx = tierIndex(current);
  const next = TIERS[idx + 1];

  const missing = CHECKLIST_ITEMS.filter((item) => !checked.has(item.id));

  // Guard: already at the top tier, or (defensively) nothing left to check — never claim a "next
  // step" that doesn't exist.
  if (!next || missing.length === 0) {
    return { reached: true };
  }

  const sorted = [...missing].sort((a, b) => b.weight - a.weight);
  let running = score;
  const picked: ChecklistItem[] = [];
  for (const item of sorted) {
    if (running >= next.min) break;
    running += item.weight;
    picked.push(item);
  }

  return { reached: false, nextTier: next, needed: picked.length, nextItems: picked };
}

export const BASELINE_DAYS = 21;
export const FASTEST_DAYS = 2;

export function daysToSellFor(score: number): number {
  const clamped = Math.min(MAX_SCORE, Math.max(0, score));
  const raw = BASELINE_DAYS - ((BASELINE_DAYS - FASTEST_DAYS) / MAX_SCORE) * clamped;
  // Guard: floor at FASTEST_DAYS so no combination of items ever projects an impossible 0- or
  // negative-day sale.
  return Math.max(FASTEST_DAYS, Math.round(raw));
}

export type PerkState = { checked: ReadonlySet<ChecklistItemId>; score: number };

export type Perk = {
  id: string;
  label: string;
  unlocked: (state: PerkState) => boolean;
};

// Each predicate reads the live checklist/score directly — never a per-tier static lookup — so an
// unchecked box always removes exactly the perks it was gating, on every render.
export const PERKS: Perk[] = [
  {
    id: "ai-match",
    label: "Appears in AI match results",
    unlocked: (s) => s.checked.has("id-verified") && s.checked.has("photos-verified"),
  },
  {
    id: "fee",
    label: "Lower platform fee — 8% → 5%",
    unlocked: (s) => s.score >= 65,
  },
  {
    id: "fast-ship-badge",
    label: "Fast-ship badge shown to buyers",
    unlocked: (s) => s.checked.has("fast-ship"),
  },
  {
    id: "returns",
    label: "Extended buyer return window",
    unlocked: (s) => s.checked.has("return-policy"),
  },
  {
    id: "payout",
    label: "Instant payout, same day",
    unlocked: (s) => s.checked.has("bank-linked"),
  },
  {
    id: "manager",
    label: "Dedicated account manager",
    unlocked: (s) => s.score >= 90,
  },
];

export function discountPct(original: number, price: number): number {
  return Math.round((1 - price / original) * 100);
}
