// native/src/evolve/r28/a/data.ts
//
// Deterministic fixtures + pure scoring logic for AccountAppealScreen.
// Nothing here reads the clock or randomness — every derived value is a
// pure function of the user's own in-session answers.

export type AppealGroundId =
  | "listing_flagged_in_error"
  | "dispute_already_resolved"
  | "account_access_compromised"
  | "strike_count_miscounted"
  | "other_explain_below";

export interface AppealGround {
  id: AppealGroundId;
  label: string;
  helper: string;
}

export const APPEAL_GROUNDS: AppealGround[] = [
  {
    id: "listing_flagged_in_error",
    label: "A listing was flagged in error",
    helper:
      "The item I posted followed policy and was matched to a banned category by mistake.",
  },
  {
    id: "dispute_already_resolved",
    label: "The dispute behind this was already resolved",
    helper:
      "The buyer and I settled this directly, or a moderator already closed the case.",
  },
  {
    id: "account_access_compromised",
    label: "Someone else accessed my account",
    helper: "The activity that triggered this suspension wasn't initiated by me.",
  },
  {
    id: "strike_count_miscounted",
    label: "My strike count includes an error",
    helper: "One or more prior warnings on my account should not have been issued.",
  },
  {
    id: "other_explain_below",
    label: "None of these — I'll explain below",
    helper: "Describe the situation in your own words in the statement field.",
  },
];

export const SUSPENSION_NOTICE = {
  caseRef: "RP-SUS-48213",
  suspendedOnLabel: "Sep 26, 2026",
  policyCited: "Prohibited Items Policy, Section 4.2",
  appealWindowLabel: "This appeal window closes Oct 10, 2026.",
};

// Fixed, ordered list of evidence references a user can attach to the case.
// "Add reference" below walks this list in order rather than letting the
// user free-type a label, so the result stays deterministic.
export const EVIDENCE_LIBRARY: string[] = [
  "Message thread with the buyer",
  "Payment receipt from the order",
  "Photos of the item at drop-off",
  "Prior moderator response on this account",
  "Screenshot of the listing before removal",
];

export const MAX_EVIDENCE_REFS = 3;

// A written statement shorter than this is treated as not substantive
// enough to send for review — this is the hard gate, not just "non-empty".
export const MIN_STATEMENT_CHARS = 120;

// Length at which the statement stops adding to the case-strength score.
// Chosen well above MIN_STATEMENT_CHARS so clearing the gate alone doesn't
// read as "fully strong" — there's real room to improve the explanation.
export const TARGET_STATEMENT_CHARS = 400;

/**
 * Case strength, 0–100. Pure function of the three things the band also
 * gates on: whether a ground is picked, how long the statement is, and how
 * many evidence references are attached. Recomputed on every keystroke.
 */
export function computeCaseStrength(
  hasGround: boolean,
  statementChars: number,
  evidenceCount: number,
): number {
  const groundPoints = hasGround ? 20 : 0;
  const statementRatio = Math.min(1, statementChars / TARGET_STATEMENT_CHARS);
  const statementPoints = Math.round(statementRatio * 60);
  const evidenceRatio = Math.min(evidenceCount, MAX_EVIDENCE_REFS) / MAX_EVIDENCE_REFS;
  const evidencePoints = Math.round(evidenceRatio * 20);
  return Math.min(100, groundPoints + statementPoints + evidencePoints);
}

export type StrengthTone = "faint" | "warning" | "accent" | "success";

export interface StrengthTier {
  label: string;
  tone: StrengthTone;
}

export function strengthTier(score: number): StrengthTier {
  if (score < 25) return { label: "Not enough to review yet", tone: "faint" };
  if (score < 55) return { label: "Developing", tone: "warning" };
  if (score < 80) return { label: "Solid", tone: "accent" };
  return { label: "Strong", tone: "success" };
}

/**
 * A deterministic mock case reference — derived only from the ground chosen
 * and the statement length, never from time or randomness, so the same
 * answers always produce the same reference.
 */
export function buildAppealReference(
  groundId: AppealGroundId,
  statementChars: number,
): string {
  const groundCode = groundId.slice(0, 3).toUpperCase();
  const lengthTag = String(statementChars).padStart(3, "0").slice(-3);
  return `APL-${groundCode}-${lengthTag}`;
}
