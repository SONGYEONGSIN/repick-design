// native/src/auction/data.ts
//
// Deterministic dummy data for the Live Auction Bid screen. No Math.random,
// Date.now, or bare `new Date()` anywhere — the countdown's reference "now"
// and the auction's close time are both fixed constants, and the ticking
// display below is a pure function of a locally-incremented tick counter
// (see LiveAuctionScreen.tsx), never of wall-clock time.

export type Bid = {
  id: string;
  bidderName: string;
  bidderInitials: string;
  amountWon: number;
  minutesAgo: number;
  isYou: boolean;
};

// ---- Item being auctioned -------------------------------------------------

export const ITEM_TITLE = "Leica M6 35mm Film Camera";
export const ITEM_CONDITION = "Good — light brassing, works fully";
export const ITEM_SELLER_NAME = "RetroLensCo";
export const ITEM_SELLER_INITIALS = "RL";
export const ITEM_THUMBNAIL_INITIALS = "M6";

// ---- Timing (fixed constants — never wall-clock) --------------------------

// Arbitrary fixed epoch-style constants, not derived from Date.now().
export const FIXED_NOW_MS = 1_000_000;
export const AUCTION_CLOSES_AT_MS =
  FIXED_NOW_MS + ((2 * 60 + 14) * 60 + 37) * 1000; // fixed 2h 14m 37s out

export const INITIAL_REMAINING_MS = Math.max(
  0,
  AUCTION_CLOSES_AT_MS - FIXED_NOW_MS,
);

// ---- Bid economics ----------------------------------------------------

export const STARTING_BID_WON = 150_000;
export const BID_INCREMENT_WON = 10_000;

// Chronological (oldest first). The last entry is the current highest bid.
export const INITIAL_BIDS: Bid[] = [
  {
    id: "b1",
    bidderName: "Minseo K.",
    bidderInitials: "MK",
    amountWon: 180_000,
    minutesAgo: 46,
    isYou: false,
  },
  {
    id: "b2",
    bidderName: "Priya N.",
    bidderInitials: "PN",
    amountWon: 200_000,
    minutesAgo: 38,
    isYou: false,
  },
  {
    id: "b3",
    bidderName: "You",
    bidderInitials: "ME",
    amountWon: 210_000,
    minutesAgo: 31,
    isYou: true,
  },
  {
    id: "b4",
    bidderName: "Priya N.",
    bidderInitials: "PN",
    amountWon: 230_000,
    minutesAgo: 22,
    isYou: false,
  },
  {
    id: "b5",
    bidderName: "Jordan R.",
    bidderInitials: "JR",
    amountWon: 250_000,
    minutesAgo: 11,
    isYou: false,
  },
  {
    id: "b6",
    bidderName: "Jordan R.",
    bidderInitials: "JR",
    amountWon: 260_000,
    minutesAgo: 4,
    isYou: false,
  },
];

// A generous, sane upper bound for the bid-amount stepper so it can't be
// cranked indefinitely — a UI safety rail, not a business rule.
export const STEPPER_CAP_ABOVE_MIN_WON = 20 * BID_INCREMENT_WON;

// ---- Proxy / max auto-bid ----------------------------------------------

export const AUTO_BID_DEFAULT_CEILING_WON = 320_000;
export const AUTO_BID_CEILING_STEP_WON = 10_000;
export const AUTO_BID_CEILING_CAP_WON = 800_000;

// ---- Formatting ----------------------------------------------------------

// ₩ glyph note (GENERATION.md §1): insert a plain space between the symbol
// and the digits so the glyph's horizontal stroke doesn't visually run into
// the leading digit at body-text size.
export function formatWon(amountWon: number): string {
  return `₩ ${amountWon.toLocaleString("en-US")}`;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
}

export function formatTimeAgo(minutesAgo: number): string {
  if (minutesAgo <= 0) return "Just now";
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  const mins = minutesAgo % 60;
  return mins === 0 ? `${hours}h ago` : `${hours}h ${mins}m ago`;
}
