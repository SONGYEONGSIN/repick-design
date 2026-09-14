// native/src/evolve/r21/c/data.ts
// Deterministic dummy data for the Referral / Invite Friends screen.
// No Math.random / Date.now / bare `new Date()` — all dates are fixed literal labels.

export type InviteStatus = "pending" | "joined" | "first_sale" | "rewarded";

export interface InvitedFriend {
  id: string;
  name: string;
  initials: string;
  invitedDateLabel: string; // fixed literal label, not computed from wall clock
  status: InviteStatus;
}

export interface RewardTier {
  id: string;
  threshold: number; // qualifying-invite count required to unlock
  title: string;
  rewardLabel: string;
  rewardDetail: string;
}

// A friend counts toward tier progress once they've joined using the code —
// "pending" (invited, not yet joined) does not count yet.
export const QUALIFYING_STATUSES: InviteStatus[] = ["joined", "first_sale", "rewarded"];

export const REFERRAL_CODE = "REPICK-YS284";
export const REFERRAL_LINK_LABEL = "repick.app/r/YS284";

export const INVITED_FRIENDS: InvitedFriend[] = [
  {
    id: "f1",
    name: "Elena Cruz",
    initials: "EC",
    invitedDateLabel: "Invited Jul 10, 2026",
    status: "rewarded",
  },
  {
    id: "f2",
    name: "Priya Shah",
    initials: "PS",
    invitedDateLabel: "Invited Jul 20, 2026",
    status: "rewarded",
  },
  {
    id: "f3",
    name: "Grace Lin",
    initials: "GL",
    invitedDateLabel: "Invited Aug 2, 2026",
    status: "joined",
  },
  {
    id: "f4",
    name: "Marcus Webb",
    initials: "MW",
    invitedDateLabel: "Invited Aug 5, 2026",
    status: "first_sale",
  },
  {
    id: "f5",
    name: "Tariq Osei",
    initials: "TO",
    invitedDateLabel: "Invited Aug 20, 2026",
    status: "joined",
  },
  {
    id: "f6",
    name: "Noah Kim",
    initials: "NK",
    invitedDateLabel: "Invited Sep 1, 2026",
    status: "pending",
  },
  {
    id: "f7",
    name: "Sophie Dubois",
    initials: "SD",
    invitedDateLabel: "Invited Sep 10, 2026",
    status: "pending",
  },
];

// Most recent friend whose status change qualified toward tier progress —
// referenced by the live region's status line (fixed, not derived from a clock).
export const MOST_RECENT_QUALIFYING_FRIEND_ID = "f5"; // Tariq Osei, Aug 20 — most recent "joined"

export const REWARD_TIERS: RewardTier[] = [
  {
    id: "tier1",
    threshold: 3,
    title: "Tier 1",
    rewardLabel: "₩ 10,000 wallet credit",
    rewardDetail:
      "Credited to your repick wallet automatically once your 3rd qualifying invite joins repick.",
  },
  {
    id: "tier2",
    threshold: 5,
    title: "Tier 2",
    rewardLabel: "3 free shipping labels",
    rewardDetail:
      "Three free domestic shipping labels added to your account — usable on any sale, no expiry.",
  },
  {
    id: "tier3",
    threshold: 10,
    title: "Tier 3",
    rewardLabel: "₩ 50,000 credit + priority verification",
    rewardDetail:
      "A ₩ 50,000 wallet credit plus a fast-tracked review for seller verification.",
  },
];

// Format a KRW amount with a small gap before the digits (GENERATION.md ₩ glyph note,
// option (a)) and thousands separators.
export function formatWon(amount: number): string {
  return `₩ ${amount.toLocaleString("en-US")}`;
}
