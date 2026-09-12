// native/src/evolve/r20/b/data.ts — deterministic dummy data + pure helpers for
// LinkPayoutMethodScreen.
//
// No Math.random / Date.now / bare `new Date()` anywhere below — every value is a fixed literal
// or a pure computation over fixed literals and the user's own typed digits.

export type FieldId = "routing" | "account" | "authorize";

export type LinkStripState =
  | { kind: "unresolved"; field: FieldId; reason: string }
  | { kind: "armed" }
  | { kind: "confirmed" };

export const ROUTING_LENGTH = 9;
export const ACCOUNT_MIN_LENGTH = 4;
export const ACCOUNT_MAX_LENGTH = 17;
export const VERIFICATION_WINDOW_LABEL = "2 business days";

/** A tiny fixed lookup from routing-number prefix to a receiving-bank label — purely so the
 * routing field can surface *something* concrete once it checksum-validates, never a network
 * call. Unlisted prefixes (any prefix not in this table, including ones a real ABA registry
 * would recognize) fall back to a generic label rather than guessing. */
const ROUTING_PREFIX_BANK: ReadonlyArray<readonly [string, string]> = [
  ["011", "Cascade Trust Bank"],
  ["021", "Harborline Federal Credit Union"],
  ["044", "Meridian Community Bank"],
  ["065", "Union Slate Bank"],
];

export function bankNameForRouting(routing: string): string {
  const prefix = routing.slice(0, 3);
  const found = ROUTING_PREFIX_BANK.find(([p]) => p === prefix);
  return found ? found[1] : "Receiving bank";
}

/** Standard ABA routing-number checksum: digits weighted 3,7,1 repeating; valid only when the
 * weighted sum is a multiple of 10. This is the same check real bank-linking forms run
 * client-side before ever contacting a server — it catches most single-digit typos and
 * transpositions, not just a wrong digit count. */
export function isValidRoutingNumber(routing: string): boolean {
  if (routing.length !== ROUTING_LENGTH || !/^\d+$/.test(routing)) return false;
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  let sum = 0;
  for (let i = 0; i < ROUTING_LENGTH; i++) {
    sum += Number(routing[i]) * weights[i];
  }
  return sum % 10 === 0;
}

/** US ACH account numbers vary by bank (commonly 4–17 digits) — there is no single fixed
 * length across institutions the way there is for routing numbers, so this checks a fixed
 * valid *range* rather than one exact length. */
export function isValidAccountNumber(account: string): boolean {
  return (
    /^\d+$/.test(account) &&
    account.length >= ACCOUNT_MIN_LENGTH &&
    account.length <= ACCOUNT_MAX_LENGTH
  );
}

export function maskAccountNumber(account: string): string {
  const last4 = account.slice(-4);
  return `••••${last4}`;
}

export function computeLinkStripState(
  routingValid: boolean,
  accountValid: boolean,
  authorized: boolean,
  submitted: boolean,
): LinkStripState {
  if (submitted) return { kind: "confirmed" };
  if (!routingValid) {
    return {
      kind: "unresolved",
      field: "routing",
      reason: `Enter a valid ${ROUTING_LENGTH}-digit routing number`,
    };
  }
  if (!accountValid) {
    return {
      kind: "unresolved",
      field: "account",
      reason: `Enter an account number between ${ACCOUNT_MIN_LENGTH} and ${ACCOUNT_MAX_LENGTH} digits`,
    };
  }
  if (!authorized) {
    return {
      kind: "unresolved",
      field: "authorize",
      reason: "Authorize micro-deposit verification to continue",
    };
  }
  return { kind: "armed" };
}

export type TimelineStepStatus = "done" | "pending" | "upcoming";

export interface TimelineStep {
  id: string;
  dayLabel: string;
  title: string;
  detail: string;
  status: TimelineStepStatus;
}

/** The 4-stop verification timeline shown only once a link has been submitted. Every label is a
 * relative business-day marker ("Day 0", "Day 1–2", …) fixed at authoring time — never a
 * calendar date, since there is no clock behind this dummy data and a real date would go stale
 * the moment this screen is opened on a different day. */
export const VERIFICATION_TIMELINE: ReadonlyArray<TimelineStep> = [
  {
    id: "submitted",
    dayLabel: "Day 0",
    title: "Account details submitted",
    detail: "Routing and account number received and queued for verification.",
    status: "done",
  },
  {
    id: "deposits-sent",
    dayLabel: "Day 1–2",
    title: "Two small deposits sent",
    detail: "Each is under $1.00 and posts to the linked account itself, not inside this app.",
    status: "pending",
  },
  {
    id: "confirm-amounts",
    dayLabel: "Day 2",
    title: "Confirm the two amounts",
    detail: "Check the linked account's statement, then enter both amounts here to confirm ownership.",
    status: "upcoming",
  },
  {
    id: "payouts-enabled",
    dayLabel: "Day 3",
    title: "Payouts enabled",
    detail: "Once confirmed, this method becomes available as a payout destination.",
    status: "upcoming",
  },
];
