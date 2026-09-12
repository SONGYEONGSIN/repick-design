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
  valueCents: number;
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
  { id: "m1", title: "Canon EOS M50 Body", condition: "Good", valueCents: 32000 },
  { id: "m2", title: "50mm f/1.8 Lens", condition: "Like New", valueCents: 9500 },
  { id: "m3", title: "Camera Backpack", condition: "Good", valueCents: 4000 },
  { id: "m4", title: "Spare Battery Pack", condition: "Fair", valueCents: 1800 },
];

// What the counterparty owns, on offer in this trade.
export const THEIR_ITEMS: TradeItem[] = [
  { id: "t1", title: "Sony ZV-E10 Body", condition: "Good", valueCents: 38000 },
  { id: "t2", title: "32GB SD Card (x2)", condition: "Like New", valueCents: 2000 },
  { id: "t3", title: "Ring Light", condition: "Good", valueCents: 3000 },
  { id: "t4", title: "Lens Cleaning Kit", condition: "Like New", valueCents: 1200 },
  { id: "t5", title: "Camera Strap", condition: "Fair", valueCents: 1500 },
  { id: "t6", title: "Vlogging Tripod", condition: "Good", valueCents: 5500 },
];

// Selection + top-up state as it stood after the counterparty's counter-offer —
// the screen opens mid-negotiation, matching PROPOSAL_STATUS = "countered".
export const INITIAL_SELECTED_MINE: string[] = ["m1", "m2"];
export const INITIAL_SELECTED_THEIRS: string[] = ["t1", "t2"];
export const INITIAL_TOPUP_DIRECTION: TopUpDirection = "theirs";
export const INITIAL_TOPUP_CENTS = 1000; // $10.00, in the direction above

export const TOPUP_STEP_CENTS = 500; // $5.00 per tap
export const TOPUP_MAX_CENTS = 10000; // $100.00 ceiling
export const TOPUP_MIN_CENTS = 0;

// A trade within this margin of the combined value is treated as "even" —
// real barter never lands on an exact cent match, so a small tolerance band
// avoids flagging a $0.30 gap as unfair.
export const FAIRNESS_TOLERANCE_CENTS = 1000; // $10.00

export function formatUsd(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const cents2 = remainder < 10 ? `0${remainder}` : `${remainder}`;
  return `${sign}$${dollars.toLocaleString("en-US")}.${cents2}`;
}

export function sumValues(items: TradeItem[], ids: string[]): number {
  return items
    .filter((item) => ids.includes(item.id))
    .reduce((total, item) => total + item.valueCents, 0);
}
