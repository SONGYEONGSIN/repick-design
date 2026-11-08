// native/src/evolve/r52/a/data.ts — Flash Drop Raffle Entry (deterministic
// dummy data + pure helpers). No Math.random / Date.now / no-arg `new Date()`
// anywhere below — every timestamp is a fixed literal, and the raffle
// outcome is a fixed literal too (per the brief, exactly one of "won" /
// "lost" is baked in; this round bakes in "lost" so the no-op
// "Browse Similar Items" path — the one with the stricter accessibilityHint
// rule — is the one actually exercised on screen).

export type RaffleOutcome = "won" | "lost";

// The outcome is picked once, here, as fixed dummy data — never computed.
export const RAFFLE_OUTCOME: RaffleOutcome = "lost";

// ---- The drop itself -------------------------------------------------

export const ITEM_NAME = "Aether Runner “Nightfall” — US 9";
export const ITEM_BRAND = "Aether Supply Co.";
export const ITEM_THUMBNAIL_INITIALS = "AR";
export const WINNER_SLOTS = 1;

// ---- Timing (fixed constants — never wall-clock) -----------------------
//
// A raffle has two external clock events, not one: the moment entries close,
// and the (later) moment results are posted. Both are expressed as fixed
// offsets from a fixed epoch, and the screen's own "now" is a locally
// incremented tick counter compared against those offsets — never
// Date.now() or a bare `new Date()`.

// Arbitrary fixed epoch-style constant, not derived from Date.now().
export const RAFFLE_EPOCH_MS = 1_700_000_000_000;

// Entries are open for this many ms after the epoch.
export const ENTRY_WINDOW_MS = ((3 * 60 + 42) * 60 + 18) * 1000; // 3h 42m 18s

// Results post this many ms after the entry deadline (not after the epoch).
export const RESULTS_DELAY_AFTER_DEADLINE_MS = (22 * 60 + 15) * 60 * 1000; // 22h 15m

// Absolute offsets from the epoch, for phase comparisons.
export const RESULTS_WINDOW_MS = ENTRY_WINDOW_MS + RESULTS_DELAY_AFTER_DEADLINE_MS;

export type RafflePhase = "open" | "closed" | "resultsPosted";

// Pure: given how many ms have elapsed since RAFFLE_EPOCH_MS, which phase is
// the raffle in. No wall-clock read of any kind.
export function getRafflePhase(elapsedMs: number): RafflePhase {
  if (elapsedMs < ENTRY_WINDOW_MS) return "open";
  if (elapsedMs < RESULTS_WINDOW_MS) return "closed";
  return "resultsPosted";
}

export function msUntilEntryDeadline(elapsedMs: number): number {
  return Math.max(0, ENTRY_WINDOW_MS - elapsedMs);
}

// ---- Drop facts (short, fixed — a FlatList row set, not a .map()) ------

export type DropFact = {
  id: string;
  label: string;
  value: string;
};

export const DROP_FACTS: DropFact[] = [
  { id: "fee", label: "Entry fee", value: "Free" },
  { id: "slots", label: "Winner slots", value: `${WINNER_SLOTS} of this size` },
  { id: "entrants", label: "Entrants so far", value: formatCount(2348) },
  { id: "value", label: "Retail value", value: formatWon(389_000) },
  { id: "delivery", label: "Delivery", value: "Free express, winner only" },
];

// ---- Formatting ----------------------------------------------------------

function padTwo(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// "3h 42m 18s" style — distinct from a clock-face "H:MM:SS" readout since
// this screen's countdown is read once on a status line, not stared at
// digit-by-digit the way a live bid countdown is.
export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${padTwo(minutes)}m ${padTwo(seconds)}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${padTwo(seconds)}s`;
  }
  return `${seconds}s`;
}

// Thousands-separated plain count, tabular-nums friendly.
export function formatCount(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Thousands-separated KRW with a deliberate space after the ₩ glyph so it
// never visually fuses with the leading digit (project-documented rule —
// kept as a plain space, not a structural rework).
export function formatWon(amountWon: number): string {
  return `₩ ${formatCount(Math.round(amountWon))}`;
}

// ---- Band content (pure — kept here so it's testable independent of the
// band's own render logic) --------------------------------------------

export type ClaimPhase = "unclaimed" | "claimed";

export type BandAction =
  | { kind: "enter" }
  | { kind: "claim" }
  | { kind: "browseSimilar" }
  | { kind: "none" };

export type BandContent = {
  message: string;
  action: BandAction;
};

export function describeRaffleBand(args: {
  phase: RafflePhase;
  entered: boolean;
  outcome: RaffleOutcome;
  claimPhase: ClaimPhase;
  remainingToDeadlineMs: number;
}): BandContent {
  const { phase, entered, outcome, claimPhase, remainingToDeadlineMs } = args;

  if (phase === "open") {
    if (!entered) {
      return {
        message: `Entries close in ${formatCountdown(
          remainingToDeadlineMs
        )}. Enter now to be placed in the drawing.`,
        action: { kind: "enter" },
      };
    }
    return {
      message: `You're entered. Entries close in ${formatCountdown(
        remainingToDeadlineMs
      )} — winners are drawn after that.`,
      action: { kind: "none" },
    };
  }

  if (phase === "closed") {
    if (!entered) {
      return {
        message:
          "Entries are closed. You didn't enter before the deadline, so you're not included in this drawing.",
        action: { kind: "none" },
      };
    }
    return {
      message:
        "Entries are closed. Winners are being drawn — results post within a day.",
      action: { kind: "none" },
    };
  }

  // phase === "resultsPosted"
  if (!entered) {
    return {
      message:
        "This drop's raffle has ended. You weren't entered, so there's nothing to claim here.",
      action: { kind: "browseSimilar" },
    };
  }

  if (outcome === "lost") {
    return {
      message: "Not this time — another entrant won this drop. Thanks for entering.",
      action: { kind: "browseSimilar" },
    };
  }

  // outcome === "won"
  if (claimPhase === "unclaimed") {
    return {
      message: `You won! ${ITEM_NAME} is reserved for you — claim it to start checkout.`,
      action: { kind: "claim" },
    };
  }
  return {
    message: `Checkout started. We've reserved ${ITEM_NAME} and emailed your next steps.`,
    action: { kind: "none" },
  };
}
