// native/src/evolve/r37/a/data.ts
//
// Deterministic data for the Referral Program & Rewards screen. No
// Math.random, no Date.now, no argument-less `new Date()` — every value
// here is fixed. Rewards are store credit (KRW), a distinct balance domain
// from the existing Wallet ledger / Payout screens — this screen never
// reads or writes those shapes.

export type ReferralStatus = "invited" | "joined" | "first_purchase";

export interface ReferralRecord {
  id: string;
  friendLabel: string;
  status: ReferralStatus;
  invitedOnLabel: string;
  milestoneLabel: string;
  rewardLineLabel: string;
}

export const referralProfile = {
  code: "RPK-HYEWON24",
  shareLink: "repick.app/r/hyewon24",
  rewardPerFriendLabel: "KRW 15,000",
  friendWelcomeCreditLabel: "KRW 10,000",
};

// Reward credited to the referrer once a friend completes their first
// purchase. Fixed amount, not derived from any runtime value.
const REWARD_PER_FRIEND = 15000;

export const referralFriends: ReferralRecord[] = [
  {
    id: "ref-01",
    friendLabel: "Minji K.",
    status: "first_purchase",
    invitedOnLabel: "Sep 2",
    milestoneLabel: "First purchase completed Sep 12",
    rewardLineLabel: "KRW 15,000 store credit earned",
  },
  {
    id: "ref-02",
    friendLabel: "Jun H.",
    status: "joined",
    invitedOnLabel: "Sep 20",
    milestoneLabel: "Joined Sep 22 — hasn't purchased yet",
    rewardLineLabel: "Credit unlocks after their first purchase",
  },
  {
    id: "ref-03",
    friendLabel: "Hana P.",
    status: "invited",
    invitedOnLabel: "Oct 1",
    milestoneLabel: "Invite sent, not opened yet",
    rewardLineLabel: "Credit unlocks once they join and buy",
  },
  {
    id: "ref-04",
    friendLabel: "Woojin S.",
    status: "first_purchase",
    invitedOnLabel: "Aug 10",
    milestoneLabel: "First purchase completed Aug 15",
    rewardLineLabel: "KRW 15,000 store credit earned",
  },
  {
    id: "ref-05",
    friendLabel: "Dayeon L.",
    status: "invited",
    invitedOnLabel: "Oct 8",
    milestoneLabel: "Invite sent, not opened yet",
    rewardLineLabel: "Credit unlocks once they join and buy",
  },
  {
    id: "ref-06",
    friendLabel: "Seojun C.",
    status: "joined",
    invitedOnLabel: "Sep 28",
    milestoneLabel: "Joined Sep 29 — hasn't purchased yet",
    rewardLineLabel: "Credit unlocks after their first purchase",
  },
  {
    id: "ref-07",
    friendLabel: "Yuna R.",
    status: "first_purchase",
    invitedOnLabel: "Jul 3",
    milestoneLabel: "First purchase completed Jul 9",
    rewardLineLabel: "KRW 15,000 store credit earned",
  },
];

const rewardedCount = referralFriends.filter(
  (f) => f.status === "first_purchase"
).length;
const pendingCount = referralFriends.filter((f) => f.status === "joined").length;
const invitedOnlyCount = referralFriends.filter(
  (f) => f.status === "invited"
).length;

export const referralBalance = {
  availableCreditLabel: `KRW ${(rewardedCount * REWARD_PER_FRIEND).toLocaleString(
    "en-US"
  )}`,
  rewardedCount,
  pendingCount,
  invitedOnlyCount,
};

export type ReferralFilter = "all" | ReferralStatus;

export const referralFilters: { key: ReferralFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "invited", label: "Invited" },
  { key: "joined", label: "Joined" },
  { key: "first_purchase", label: "Rewarded" },
];
