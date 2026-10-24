// native/src/evolve/r35/c/data.ts
// Deterministic dummy data for the Listing Boost Credits ledger screen.
// No Math.random, no Date.now, no argument-less `new Date()` — every date is
// a fixed ISO literal and every display string is derived from it with pure
// functions below.

export type BoostCreditKind = "earned" | "spent";

export interface BoostCreditEvent {
  id: string;
  /** Fixed ISO calendar date literal, e.g. "2026-08-03". Never computed at runtime. */
  isoDate: string;
  kind: BoostCreditKind;
  /** Always a positive magnitude — direction comes from `kind`, not the sign. */
  amount: number;
  title: string;
  detail: string;
}

export interface BoostCreditLedgerRow extends BoostCreditEvent {
  runningBalance: number;
  displayDate: string;
}

// Chronological order: OLDEST FIRST. This array is the single source of
// truth for this screen. The hero balance and every row's running balance
// are both derived by folding over this array exactly once (see
// `buildLedger` below) — there is no second, hand-typed total anywhere that
// could drift out of sync with the rows.
export const boostCreditEvents: BoostCreditEvent[] = [
  {
    id: "bc-01",
    isoDate: "2026-08-03",
    kind: "earned",
    amount: 20,
    title: "Seller verification bonus",
    detail: "One-time credit for completing identity verification",
  },
  {
    id: "bc-02",
    isoDate: "2026-08-10",
    kind: "spent",
    amount: 8,
    title: "Boosted “Vintage Leather Jacket”",
    detail: "3-day search boost",
  },
  {
    id: "bc-03",
    isoDate: "2026-08-17",
    kind: "earned",
    amount: 6,
    title: "Weekly storefront bonus",
    detail: "Storefront stayed active for 7 straight days",
  },
  {
    id: "bc-04",
    isoDate: "2026-08-24",
    kind: "earned",
    amount: 6,
    title: "Weekly storefront bonus",
    detail: "Storefront stayed active for 7 straight days",
  },
  {
    id: "bc-05",
    isoDate: "2026-08-29",
    kind: "spent",
    amount: 12,
    title: "Boosted “Mid-Century Floor Lamp”",
    detail: "5-day search boost",
  },
  {
    id: "bc-06",
    isoDate: "2026-09-02",
    kind: "earned",
    amount: 10,
    title: "Fast-shipping streak reward",
    detail: "5 orders shipped within 24 hours of purchase",
  },
  {
    id: "bc-07",
    isoDate: "2026-09-07",
    kind: "earned",
    amount: 6,
    title: "Weekly storefront bonus",
    detail: "Storefront stayed active for 7 straight days",
  },
  {
    id: "bc-08",
    isoDate: "2026-09-14",
    kind: "earned",
    amount: 6,
    title: "Weekly storefront bonus",
    detail: "Storefront stayed active for 7 straight days",
  },
  {
    id: "bc-09",
    isoDate: "2026-09-19",
    kind: "spent",
    amount: 8,
    title: "Boosted “Vintage Leather Jacket”",
    detail: "3-day search boost, relisted after a price drop",
  },
  {
    id: "bc-10",
    isoDate: "2026-09-21",
    kind: "spent",
    amount: 4,
    title: "Boosted “Ceramic Plant Pot Set”",
    detail: "1-day flash boost",
  },
  {
    id: "bc-11",
    isoDate: "2026-09-28",
    kind: "earned",
    amount: 6,
    title: "Weekly storefront bonus",
    detail: "Storefront stayed active for 7 straight days",
  },
  {
    id: "bc-12",
    isoDate: "2026-10-05",
    kind: "earned",
    amount: 15,
    title: "Review milestone reward",
    detail: "Reached 50 verified buyer reviews",
  },
];

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Pure, deterministic formatter — never reads the system clock. */
export function formatIsoDate(isoDate: string): string {
  const parts = isoDate.split("-");
  const year = Number(parts[0]);
  const monthIndex = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  return `${MONTH_LABELS[monthIndex]} ${day}, ${year}`;
}

export function formatCreditAmount(amount: number): string {
  return amount.toLocaleString("en-US");
}

/**
 * The one and only fold over the transaction history. Both the hero
 * current-balance figure and each row's running balance read from the
 * output of this single pass, so they cannot silently drift apart.
 */
export function buildLedger(events: BoostCreditEvent[]): BoostCreditLedgerRow[] {
  let balance = 0;
  const rows: BoostCreditLedgerRow[] = [];
  for (const event of events) {
    balance += event.kind === "earned" ? event.amount : -event.amount;
    rows.push({
      ...event,
      runningBalance: balance,
      displayDate: formatIsoDate(event.isoDate),
    });
  }
  return rows;
}

export const boostCreditLedger = buildLedger(boostCreditEvents);

export const currentBoostBalance =
  boostCreditLedger.length > 0
    ? boostCreditLedger[boostCreditLedger.length - 1].runningBalance
    : 0;

export const totalEarned = boostCreditEvents.reduce(
  (sum, event) => (event.kind === "earned" ? sum + event.amount : sum),
  0,
);

export const totalSpent = boostCreditEvents.reduce(
  (sum, event) => (event.kind === "spent" ? sum + event.amount : sum),
  0,
);

// Newest-first order for display only. The fold that produced `runningBalance`
// above always ran chronologically, so reversing the array afterward for the
// list UI cannot affect the computed balances.
export const boostCreditLedgerNewestFirst = [...boostCreditLedger].reverse();
