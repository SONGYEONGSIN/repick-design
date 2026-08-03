// native/src/evolve/r1/b/data.ts — offer negotiation thread (deterministic dummy data).
// No Math.random / Date.now / new Date(): every timestamp is a fixed relative string and every
// amount is a fixed integer. All derived numbers come from pure functions of those fixed values.
// Self-contained on purpose — an evolve candidate must not depend on another screen's domain module.

export type Party = "buyer" | "seller"; // "seller" is the person using this screen
export type OfferStatus = "live" | "countered" | "declined" | "expired";

export type DayEntry = { kind: "day"; id: string; label: string };
export type MessageEntry = { kind: "message"; id: string; from: Party; at: string; text: string };
export type EventEntry = { kind: "event"; id: string; at: string; text: string };
export type OfferEntry = {
  kind: "offer";
  id: string;
  from: Party;
  round: number;
  amount: number; // KRW, fixed
  status: OfferStatus;
  at: string;
  note: string;
};

// One thread = one time-ordered stream of four entry kinds (oldest first).
export type ThreadEntry = DayEntry | MessageEntry | EventEntry | OfferEntry;

export const LISTING = {
  title: "Rolleiflex 2.8F · Planar 80mm",
  grade: "A",
  asking: 1350000,
  counterparty: "@ellis_k",
};

// The offer that is on the table right now — mirrored by the pinned strip and the action bar,
// so the current amount is never more than a glance away regardless of scroll position.
export type Standing = {
  round: number;
  amount: number;
  from: Party;
  at: string;
  expiresIn: string;
  expiryElapsed: `${number}%`; // fixed share of the 12h window already spent
};

export const STANDING: Standing = {
  round: 4,
  amount: 1180000,
  from: "buyer",
  at: "2h ago",
  expiresIn: "5h 40m",
  expiryElapsed: "62%",
};

// Platform settlement — the seller-side numbers the action bar keeps on screen.
export const FEE_RATE = 0.05;
export const FEE_PCT_LABEL = "5%";

export function feeFor(amount: number): number {
  return Math.round(amount * FEE_RATE);
}

export function payoutFor(amount: number): number {
  return amount - feeFor(amount);
}

// Counter bounds: a counter has to beat the standing offer and cannot exceed the asking price.
export const COUNTER = {
  step: 10000,
  min: STANDING.amount + 10000,
  max: LISTING.asking,
  initial: 1250000,
};

// Quick counters. `tag` overrides the derived "+₩x over" caption when the amount means something
// on its own (the asking price).
export type Preset = { amount: number; tag: string | null };

export const PRESETS: readonly [Preset, Preset, Preset] = [
  { amount: 1220000, tag: null },
  { amount: 1280000, tag: null },
  { amount: LISTING.asking, tag: "Your ask" },
];

// Snap to the step grid, then clamp into [min, max]. Pure.
export function clampCounter(next: number): number {
  const stepped = Math.round(next / COUNTER.step) * COUNTER.step;
  return Math.max(COUNTER.min, Math.min(COUNTER.max, stepped));
}

// Always returns a sentence (never null) so the composer height stays stable while stepping.
export function boundHint(amount: number): string {
  if (amount <= COUNTER.min) {
    return `Lowest allowed — a counter has to beat the standing ${formatKRW(STANDING.amount)}.`;
  }
  if (amount >= COUNTER.max) {
    return `That matches your asking price of ${formatKRW(COUNTER.max)}.`;
  }
  return `Anywhere between ${formatKRW(COUNTER.min)} and your ask of ${formatKRW(COUNTER.max)}.`;
}

// Thousands-separated KRW — avoids toLocaleString so the output is environment-independent.
export function formatKRW(won: number): string {
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${won < 0 ? "-" : ""}₩${digits}`;
}

// Signed difference text — direction is carried by the sign, not by color (single-accent DNA).
export function signedKRW(delta: number): string {
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}${formatKRW(Math.abs(delta))}`;
}

export function statusLabel(status: OfferStatus): string {
  if (status === "live") return "Live";
  if (status === "countered") return "Countered";
  if (status === "declined") return "Declined";
  return "Expired";
}

export function partyLabel(party: Party): string {
  return party === "seller" ? "You" : "Buyer";
}

// Four rounds of negotiation, oldest first. Statuses show the state transitions the thread went
// through: declined → countered → expired → live.
export const THREAD: ThreadEntry[] = [
  { kind: "day", id: "d1", label: "Yesterday" },
  {
    kind: "message",
    id: "m1",
    from: "buyer",
    at: "1d ago",
    text: "Is the 2.8F still available? Any haze or separation in the taking lens?",
  },
  {
    kind: "message",
    id: "m2",
    from: "seller",
    at: "1d ago",
    text: "Still here. Glass is clean and it came back from a full service in January — receipt included.",
  },
  {
    kind: "offer",
    id: "o1",
    from: "buyer",
    round: 1,
    amount: 980000,
    status: "declined",
    at: "23h ago",
    note: "Trade-in offered",
  },
  { kind: "event", id: "e1", at: "23h ago", text: "You declined offer #1" },
  {
    kind: "offer",
    id: "o2",
    from: "buyer",
    round: 2,
    amount: 1050000,
    status: "countered",
    at: "20h ago",
    note: "Pickup in person",
  },
  {
    kind: "offer",
    id: "o3",
    from: "seller",
    round: 3,
    amount: 1320000,
    status: "expired",
    at: "19h ago",
    note: "Hood and strap included",
  },
  { kind: "event", id: "e2", at: "7h ago", text: "Your counter expired after 12 hours" },
  { kind: "day", id: "d2", label: "Today" },
  {
    kind: "message",
    id: "m3",
    from: "buyer",
    at: "3h ago",
    text: "Splitting the difference, then. This is my last number today and I can collect tomorrow morning.",
  },
  {
    kind: "offer",
    id: "o4",
    from: "buyer",
    round: 4,
    amount: 1180000,
    status: "live",
    at: "2h ago",
    note: "Expires in 5h 40m · pickup tomorrow 9am",
  },
  { kind: "event", id: "e3", at: "12m ago", text: "Buyer opened this thread" },
];

/* ───────── state transitions ─────────
   Acting on an offer is not a dead end: the thread gains the entry the action produced and the
   pinned strip re-targets to whatever is valid afterwards. Both are pure functions of the
   settled outcome, so no timestamp or random id is ever generated. */

export type Outcome = "accepted" | "declined" | "countered";

export function threadFor(outcome: Outcome | null, counterAmount: number): ThreadEntry[] {
  if (outcome === null) return THREAD;
  if (outcome === "accepted") {
    return THREAD.concat([
      {
        kind: "event",
        id: "x-accepted",
        at: "just now",
        text: `You accepted offer #${STANDING.round} — ${formatKRW(payoutFor(STANDING.amount))} payout scheduled`,
      },
    ]);
  }
  if (outcome === "declined") {
    return THREAD.concat([
      { kind: "event", id: "x-declined", at: "just now", text: `You declined offer #${STANDING.round}` },
    ]);
  }
  // A counter supersedes the offer it answers — the old card stops being the live one.
  const superseded: ThreadEntry[] = THREAD.map((entry) =>
    entry.kind === "offer" && entry.status === "live"
      ? { ...entry, status: "countered" as const, note: "Superseded by your counter" }
      : entry,
  );
  return superseded.concat([
    {
      kind: "offer",
      id: "x-counter",
      from: "seller",
      round: STANDING.round + 1,
      amount: counterAmount,
      status: "live",
      at: "just now",
      note: "Sent · buyer has 12h to answer",
    },
  ]);
}

// The pinned strip: which round is valid right now, and how much of its window is gone.
export type Pinned = {
  pill: string;
  tone: "accent" | "quiet";
  amount: number;
  struck: boolean;
  left: string;
  right: string;
  elapsed: `${number}%` | null; // null once nothing is counting down
};

export function pinnedState(outcome: Outcome | null, counterAmount: number): Pinned {
  if (outcome === "accepted") {
    return {
      pill: `Accepted #${STANDING.round}`,
      tone: "accent",
      amount: STANDING.amount,
      struck: false,
      left: "You accepted · just now",
      right: "Pickup tomorrow 9am",
      elapsed: null,
    };
  }
  if (outcome === "declined") {
    return {
      pill: `Declined #${STANDING.round}`,
      tone: "quiet",
      amount: STANDING.amount,
      struck: true,
      left: "You declined · just now",
      right: "Thread stays open",
      elapsed: null,
    };
  }
  if (outcome === "countered") {
    return {
      pill: `Live offer #${STANDING.round + 1}`,
      tone: "accent",
      amount: counterAmount,
      struck: false,
      left: "Your counter · just now",
      right: "Expires in 12h",
      elapsed: "3%",
    };
  }
  return {
    pill: `Live offer #${STANDING.round}`,
    tone: "accent",
    amount: STANDING.amount,
    struck: false,
    left: `From ${LISTING.counterparty} · ${STANDING.at}`,
    right: `Expires in ${STANDING.expiresIn}`,
    elapsed: STANDING.expiryElapsed,
  };
}
