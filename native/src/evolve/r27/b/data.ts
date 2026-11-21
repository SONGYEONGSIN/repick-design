// native/src/evolve/r27/b/data.ts
// Deterministic dummy data + pure helpers for the Blocked Users screen.
// No Math.random / Date.now / new Date() anywhere — every relative-time
// string below is a fixed literal, not computed from the current clock.

export type BlockReason = "manual" | "platform";
export type ContactRole = "buyer" | "seller" | "both";

export interface BlockedUser {
  id: string;
  displayName: string;
  initial: string; // precomputed avatar-circle letter, not derived at render time
  role: ContactRole;
  reason: BlockReason;
  reasonDetail: string;
  blockedOnLabel: string; // fixed relative-time string
  interactionsBlockedCount: number;
}

// Whether a blocked user can be unblocked directly from this screen. Platform
// (trust & safety) blocks are enforced above the user's own control and can
// only be lifted through a dispute/appeal flow elsewhere in the app — not
// relevant here, this screen only reads the flag.
export function isSelfLiftable(user: BlockedUser): boolean {
  return user.reason === "manual";
}

export const blockedUsers: BlockedUser[] = [
  {
    id: "bu-01",
    displayName: "Jordan Meeks",
    initial: "J",
    role: "buyer",
    reason: "manual",
    reasonDetail: "Lowballed repeatedly after agreeing on a price",
    blockedOnLabel: "Blocked 3 weeks ago",
    interactionsBlockedCount: 2,
  },
  {
    id: "bu-02",
    displayName: "Priya Anand",
    initial: "P",
    role: "seller",
    reason: "platform",
    reasonDetail: "Confirmed counterfeit-goods report",
    blockedOnLabel: "Blocked 2 months ago",
    interactionsBlockedCount: 0,
  },
  {
    id: "bu-03",
    displayName: "Kevin O'Rourke",
    initial: "K",
    role: "buyer",
    reason: "manual",
    reasonDetail: "Sent unsolicited off-platform payment requests",
    blockedOnLabel: "Blocked 5 days ago",
    interactionsBlockedCount: 1,
  },
  {
    id: "bu-04",
    displayName: "Min-jun Lee",
    initial: "M",
    role: "both",
    reason: "manual",
    reasonDetail: "No-show at two agreed meetups",
    blockedOnLabel: "Blocked 1 month ago",
    interactionsBlockedCount: 4,
  },
  {
    id: "bu-05",
    displayName: "Rosa Delgado",
    initial: "R",
    role: "seller",
    reason: "platform",
    reasonDetail: "Suspended for listing stolen inventory",
    blockedOnLabel: "Blocked 6 weeks ago",
    interactionsBlockedCount: 0,
  },
  {
    id: "bu-06",
    displayName: "Tyler Vance",
    initial: "T",
    role: "buyer",
    reason: "manual",
    reasonDetail: "Abusive language in offer messages",
    blockedOnLabel: "Blocked 2 days ago",
    interactionsBlockedCount: 3,
  },
  {
    id: "bu-07",
    displayName: "Ha-eun Song",
    initial: "H",
    role: "seller",
    reason: "manual",
    reasonDetail: "Sent items materially not as described, twice",
    blockedOnLabel: "Blocked 4 months ago",
    interactionsBlockedCount: 2,
  },
  {
    id: "bu-08",
    displayName: "Andre Fontaine",
    initial: "A",
    role: "buyer",
    reason: "platform",
    reasonDetail: "Chargeback-fraud pattern flagged by trust & safety",
    blockedOnLabel: "Blocked 10 days ago",
    interactionsBlockedCount: 0,
  },
  {
    id: "bu-09",
    displayName: "Wei Zhang",
    initial: "W",
    role: "both",
    reason: "manual",
    reasonDetail: "Harassment after a declined offer",
    blockedOnLabel: "Blocked 9 months ago",
    interactionsBlockedCount: 1,
  },
];

export function roleLabel(role: ContactRole): string {
  if (role === "buyer") return "Buyer";
  if (role === "seller") return "Seller";
  return "Buyer & Seller";
}
