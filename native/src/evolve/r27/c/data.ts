// native/src/evolve/r27/c/data.ts
//
// Deterministic dummy data for the Blocked Accounts screen. No Math.random,
// no Date.now, no argument-less `new Date()` — every "blocked on" value is a
// fixed, pre-written label rather than something computed at render time.

export type BlockKind = "user" | "platform";

export type BlockedAccount = {
  id: string;
  name: string;
  initials: string;
  role: "Seller" | "Buyer" | "Seller & Buyer";
  reason: string;
  blockedOnLabel: string;
  // Who initiated the block. "user" blocks were requested by this account and
  // can be reversed at will. "platform" blocks were applied by repick Trust &
  // Safety (fraud/abuse enforcement) and are NOT removable from this screen —
  // this is the screen's one non-destructive business rule: a computed
  // eligibility flag (see `canUnblock` in the screen) rather than a delete
  // toggle every row shares equally.
  blockedBy: BlockKind;
};

export const INITIAL_BLOCKED_ACCOUNTS: BlockedAccount[] = [
  {
    id: "ba-1",
    name: "Jun Park",
    initials: "JP",
    role: "Buyer",
    reason: "Sent repeated lowball offers after being declined",
    blockedOnLabel: "Blocked Aug 14, 2026",
    blockedBy: "user",
  },
  {
    id: "ba-2",
    name: "Soomin Lee",
    initials: "SL",
    role: "Seller",
    reason: "Listing photos did not match the item received",
    blockedOnLabel: "Blocked Jul 2, 2026",
    blockedBy: "user",
  },
  {
    id: "ba-3",
    name: "dz.reseller88",
    initials: "DR",
    role: "Seller & Buyer",
    reason: "Flagged for counterfeit authentication documents",
    blockedOnLabel: "Blocked Jun 20, 2026",
    blockedBy: "platform",
  },
  {
    id: "ba-4",
    name: "Hana Cho",
    initials: "HC",
    role: "Buyer",
    reason: "Abusive language in offer messages",
    blockedOnLabel: "Blocked Jun 3, 2026",
    blockedBy: "user",
  },
  {
    id: "ba-5",
    name: "Minho Kang",
    initials: "MK",
    role: "Seller",
    reason: "No-show at two scheduled meetups in a row",
    blockedOnLabel: "Blocked May 19, 2026",
    blockedBy: "user",
  },
  {
    id: "ba-6",
    name: "vault_flips_kr",
    initials: "VF",
    role: "Seller",
    reason: "Payment chargeback fraud confirmed by Trust & Safety",
    blockedOnLabel: "Blocked Apr 27, 2026",
    blockedBy: "platform",
  },
  {
    id: "ba-7",
    name: "Yerin Baek",
    initials: "YB",
    role: "Buyer",
    reason: "Threatened a false damage claim to force a refund",
    blockedOnLabel: "Blocked Mar 11, 2026",
    blockedBy: "user",
  },
  {
    id: "ba-8",
    name: "Taeyang Oh",
    initials: "TO",
    role: "Seller",
    reason: "Shared contact info to route around platform protection",
    blockedOnLabel: "Blocked Feb 25, 2026",
    blockedBy: "user",
  },
];
