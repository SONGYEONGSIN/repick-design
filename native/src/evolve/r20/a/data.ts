// native/src/evolve/r20/a/data.ts
// Deterministic dummy data for TradeProposalScreen. No Math.random, no Date.now(),
// no bare `new Date()` — every figure below is a fixed literal or a pure function of
// fixed literals, and every relative-time string ("2 days ago") is a hand-written
// literal, not a computed diff against the real clock.

export type ProposalStatus = "pending" | "countered" | "accepted" | "declined";

export type TradeItem = {
  id: string;
  title: string;
  condition: "Like New" | "Good" | "Fair";
  valueWon: number;
};

export type TopUpDirection = "none" | "mine" | "theirs";

export const COUNTERPARTY_NAME = "Mira Chen";
export const COUNTERPARTY_INITIALS = "MC";

export const PROPOSAL_STATUS: ProposalStatus = "countered";
export const STATUS_UPDATED_LABEL = "2 days ago";
export const STATUS_NOTE =
  "Mira countered: she dropped the vlogging tripod and asked for a top-up instead.";

// What the current user owns and can put into this trade.
export const MY_ITEMS: TradeItem[] = [
  { id: "m1", title: "Canon EOS M50 Body", condition: "Good", valueWon: 420000 },
  { id: "m2", title: "50mm f/1.8 Lens", condition: "Like New", valueWon: 125000 },
  { id: "m3", title: "Camera Backpack", condition: "Good", valueWon: 52000 },
  { id: "m4", title: "Spare Battery Pack", condition: "Fair", valueWon: 23000 },
];

// What the counterparty owns, on offer in this trade.
export const THEIR_ITEMS: TradeItem[] = [
  { id: "t1", title: "Sony ZV-E10 Body", condition: "Good", valueWon: 490000 },
  { id: "t2", title: "32GB SD Card (x2)", condition: "Like New", valueWon: 26000 },
  { id: "t3", title: "Ring Light", condition: "Good", valueWon: 39000 },
  { id: "t4", title: "Lens Cleaning Kit", condition: "Like New", valueWon: 15000 },
  { id: "t5", title: "Camera Strap", condition: "Fair", valueWon: 19000 },
  { id: "t6", title: "Vlogging Tripod", condition: "Good", valueWon: 71000 },
];

// Selection + top-up state as it stood after the counterparty's counter-offer —
// the screen opens mid-negotiation, matching PROPOSAL_STATUS = "countered".
export const INITIAL_SELECTED_MINE: string[] = ["m1", "m2"];
export const INITIAL_SELECTED_THEIRS: string[] = ["t1", "t2"];
export const INITIAL_TOPUP_DIRECTION: TopUpDirection = "theirs";
export const INITIAL_TOPUP_WON = 15000; // in the direction above

export const TOPUP_STEP_WON = 5000; // per tap
export const TOPUP_MAX_WON = 150000; // ceiling
export const TOPUP_MIN_WON = 0;

// A trade within this margin of the combined value is treated as "even" —
// real barter never lands on an exact-won match, so a small tolerance band
// avoids flagging a ₩1,000 gap as unfair.
export const FAIRNESS_TOLERANCE_WON = 13000;

export function formatWon(won: number): string {
  const sign = won < 0 ? "-" : "";
  return `${sign}₩${Math.abs(won).toLocaleString("en-US")}`;
}

export function sumValues(items: TradeItem[], ids: string[]): number {
  return items
    .filter((item) => ids.includes(item.id))
    .reduce((total, item) => total + item.valueWon, 0);
}
