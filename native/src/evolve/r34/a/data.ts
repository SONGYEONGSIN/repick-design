// native/src/evolve/r34/a/data.ts
// Deterministic mock data for the identity re-verification checklist.
// No Math.random / Date.now / no-arg `new Date()` — every value below is a
// fixed literal or computed from fixed literals.

export type StepStatus = "done" | "pending";

export interface ReverificationStep {
  id: string;
  /** Short noun-phrase shown as the card title. */
  title: string;
  /** One or two sentences explaining what the step covers. */
  description: string;
  /** Imperative phrase used in the bottom band's "next: …" sentence. */
  actionLabel: string;
  status: StepStatus;
  /** Fixed display date, only set once a step is done. */
  completedOn?: string;
}

export const CASE_ID = "RVF-48217";

export const BLOCK_REASON =
  "Payouts are paused because a routine account security review flagged your identity file as out of date. Finish the checklist below to restore payouts.";

export const RESOLVED_MESSAGE =
  "All steps are submitted. Payouts resume once our team finishes reviewing the case, usually within one business day.";

// Initial state: 2 of 4 steps already done, 2 still pending — matches the
// "2 of 4 steps remaining" example in the brief.
export const INITIAL_STEPS: ReverificationStep[] = [
  {
    id: "gov-id",
    title: "Government-issued photo ID",
    description:
      "An unexpired driver's license, passport, or national ID with your full legal name clearly visible.",
    actionLabel: "Upload a current photo ID",
    status: "done",
    completedOn: "Oct 6, 2026",
  },
  {
    id: "liveness",
    title: "Liveness check photo",
    description:
      "A live camera capture matched against the photo ID on file — a gallery upload won't pass this step.",
    actionLabel: "Retake the liveness check",
    status: "done",
    completedOn: "Oct 6, 2026",
  },
  {
    id: "address",
    title: "Current home address",
    description:
      "Confirm the address on your seller account is still correct, or update it if you've moved in the last 12 months.",
    actionLabel: "Confirm your current address",
    status: "pending",
  },
  {
    id: "agreement",
    title: "Updated seller agreement",
    description:
      "Review and accept the revised payout terms that were introduced after this security review.",
    actionLabel: "Review the updated agreement",
    status: "pending",
  },
];
