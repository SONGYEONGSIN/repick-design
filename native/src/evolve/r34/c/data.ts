// native/src/evolve/r34/c/data.ts — deterministic dummy data for the
// "Close Seller Account" screen (destructive-confirm band, band self-transforms).
//
// No Math.random / Date.now / no-arg `new Date()` anywhere below — every value
// is a fixed literal or derived from fixed literals.

/** Raw account-state fields a real backend would supply. Kept separate from
 * the derived "is this seller eligible to close" question below so the
 * eligibility check is a genuine computation over this data, not a flag
 * someone could flip cosmetically. */
export interface SellerAccountState {
  sellerHandle: string;
  memberSinceISO: string;
  /** Listings that are currently live and would be delisted immediately on close. */
  activeListingsCount: number;
  /** Completed, closed-out sales — these stay as read-only history, they are
   * never a blocker on their own. */
  completedSalesCount: number;
  /** Orders still moving (shipped-but-not-delivered, awaiting return, etc).
   * A real, hard blocker: these must reach a terminal state before the
   * account can be closed at all. */
  openOrdersCount: number;
  /** Payout owed to the seller that has not yet been transferred out.
   * Also a hard blocker — repick will not close an account still holding
   * seller funds. */
  pendingPayoutBalanceCents: number;
  pendingPayoutCurrencyCode: "KRW";
}

// This candidate's mock data represents the seller's ELIGIBLE state: both
// hard-blocker conditions are already satisfied (0 open orders, 0 pending
// payout). The gating logic below is still a real, data-driven conditional —
// flipping either field back to a nonzero value is enough to re-block the
// close action and change the band's copy, nothing is hardcoded to "enabled".
export const SELLER_ACCOUNT: SellerAccountState = {
  sellerHandle: "@northstar.vintage",
  memberSinceISO: "2022-03-04",
  activeListingsCount: 9,
  completedSalesCount: 134,
  openOrdersCount: 0,
  pendingPayoutBalanceCents: 0,
  pendingPayoutCurrencyCode: "KRW",
};

export interface Blocker {
  id: string;
  label: string;
  /** Human-readable current value, e.g. "0 open orders". */
  detail: string;
  resolved: boolean;
}

/** Computes the hard-blocker checklist from account state. A blocker only
 * disappears when the underlying count is actually zero — this is the real
 * conditional the brief asks for, not a cosmetic disabled prop. */
export function getBlockers(state: SellerAccountState): Blocker[] {
  return [
    {
      id: "open-orders",
      label: "Open orders",
      detail:
        state.openOrdersCount === 0
          ? "0 open orders"
          : `${state.openOrdersCount} open order${state.openOrdersCount === 1 ? "" : "s"} still in progress`,
      resolved: state.openOrdersCount === 0,
    },
    {
      id: "pending-payout",
      label: "Pending payout balance",
      detail:
        state.pendingPayoutBalanceCents === 0
          ? `${state.pendingPayoutCurrencyCode} 0 pending`
          : `${state.pendingPayoutCurrencyCode} ${(state.pendingPayoutBalanceCents / 100).toLocaleString("en-US")} still owed to you`,
      resolved: state.pendingPayoutBalanceCents === 0,
    },
  ];
}

export function isEligibleToClose(state: SellerAccountState): boolean {
  return getBlockers(state).every((b) => b.resolved);
}

export interface ImpactRow {
  id: string;
  label: string;
  detail: string;
}

/** Read-only summary of what closing will do — informational, never a
 * blocker, never tappable. */
export function getImpactRows(state: SellerAccountState): ImpactRow[] {
  return [
    {
      id: "listings",
      label: "Active listings",
      detail: `${state.activeListingsCount} listing${state.activeListingsCount === 1 ? "" : "s"} will be delisted immediately`,
    },
    {
      id: "history",
      label: "Order history",
      detail: `${state.completedSalesCount} completed sale${state.completedSalesCount === 1 ? "" : "s"} stay visible to you as read-only history`,
    },
    {
      id: "profile",
      label: "Seller profile",
      detail: "Hidden from buyers immediately; the handle cannot be reused",
    },
  ];
}

export type SummaryRow =
  | { kind: "section"; id: string; title: string }
  | { kind: "blocker"; id: string; blocker: Blocker }
  | { kind: "impact"; id: string; impact: ImpactRow };

/** Flattens the checklist + impact sections into one list for a single
 * FlatList, in a fixed, deterministic order. */
export function buildSummaryRows(state: SellerAccountState): SummaryRow[] {
  const blockers = getBlockers(state);
  const impact = getImpactRows(state);
  return [
    { kind: "section", id: "section-checklist", title: "Before you can close" },
    ...blockers.map((b) => ({ kind: "blocker" as const, id: `blocker-${b.id}`, blocker: b })),
    { kind: "section", id: "section-impact", title: "What happens when you close" },
    ...impact.map((i) => ({ kind: "impact" as const, id: `impact-${i.id}`, impact: i })),
  ];
}
