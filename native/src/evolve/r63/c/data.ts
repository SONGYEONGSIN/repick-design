// native/src/evolve/r63/c/data.ts — auto-native-r63 candidate c.
//
// Fixed, deterministic referral-program dummy data. No Math.random/Date.now/
// bare `new Date()` anywhere — every date and amount below is a literal.
//
// `status` is the field the screen's derivation logic actually branches on:
// a "pending" referral's `creditAmount` must NOT be folded into the earned
// total yet (the friend joined, but the credit-triggering condition — their
// first completed purchase — hasn't happened). "credited" is the only status
// whose amount counts. The summary numbers in the screen are computed FROM
// this array at render time, never written as separate literals.

export type ReferralStatus = "credited" | "pending";

export type ReferralEntry = {
  id: string;
  friendName: string;
  joinedDateLabel: string;
  status: ReferralStatus;
  creditAmount: number; // whole US dollars
};

export const referralEntries: ReferralEntry[] = [
  {
    id: "ref-1",
    friendName: "Mia Chen",
    joinedDateLabel: "Oct 2",
    status: "credited",
    creditAmount: 15,
  },
  {
    id: "ref-2",
    friendName: "Owen Brooks",
    joinedDateLabel: "Oct 9",
    status: "credited",
    creditAmount: 15,
  },
  {
    id: "ref-3",
    friendName: "Priya Nair",
    joinedDateLabel: "Oct 15",
    status: "pending",
    creditAmount: 15,
  },
  {
    id: "ref-4",
    friendName: "Lucas Ferreira",
    joinedDateLabel: "Oct 21",
    status: "credited",
    creditAmount: 15,
  },
  {
    id: "ref-5",
    friendName: "Sofia Alvarez",
    joinedDateLabel: "Nov 3",
    status: "pending",
    creditAmount: 15,
  },
];

export const referralProgram = {
  inviteCode: "JORDAN-K4F9",
  inviteLink: "https://repick.app/invite/JORDAN-K4F9",
  creditRuleNote:
    "You earn $15 in credit once a friend you invite completes their first purchase.",
};
