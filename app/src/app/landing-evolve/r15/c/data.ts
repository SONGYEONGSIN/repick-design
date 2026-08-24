// Pure data + logic for the "Live Bid/Auction Ticker Board" candidate.
// Every timestamp below is a literal string baked into the array, not derived from `Date.now()` or
// `new Date()` — the board has to *look* live without being live. See page.tsx for the fixed-interval
// visual pulse that reads the same array in fixed order.

export type CategoryId = "cameras" | "audio" | "laptops" | "bikes";
export type SortMode = "recent" | "drop" | "watched";
export type EventKind = "bid" | "drop" | "watch";

export type Category = { id: CategoryId; label: string };

export const CATEGORIES: Category[] = [
  { id: "cameras", label: "Cameras" },
  { id: "audio", label: "Audio" },
  { id: "laptops", label: "Laptops" },
  { id: "bikes", label: "Bikes" },
];

export type Listing = {
  id: string;
  name: string;
  category: CategoryId;
  /** MSRP when new */
  retail: number;
  /** asking price when this listing first went live today */
  open: number;
  /** current asking price */
  price: number;
  matchPct: number;
  grade: string;
  verifiedLabel: string;
  watchers: number;
  bids: number;
  closesIn: string;
  reasons: string[];
};

export const LISTINGS: Listing[] = [
  {
    id: "x2",
    name: "Aperture X2",
    category: "cameras",
    retail: 1290,
    open: 760,
    price: 612,
    matchPct: 94,
    grade: "B+",
    verifiedLabel: "Serial verified",
    watchers: 24,
    bids: 7,
    closesIn: "1h 42m",
    reasons: [
      "Same model and generation as your saved search",
      "Condition photos cross-checked by AI against 40 prior sales",
      "3 near-identical units sold within 8% of this price this week",
    ],
  },
  {
    id: "loop",
    name: "Loop Pro",
    category: "audio",
    retail: 549,
    open: 340,
    price: 268,
    matchPct: 88,
    grade: "B",
    verifiedLabel: "Pairing verified",
    watchers: 15,
    bids: 4,
    closesIn: "3h 05m",
    reasons: [
      "Matches your noise-cancelling and case-condition filters",
      "Battery health disclosed and confirmed against seller photos",
      "Priced below the last 5 completed sales of this model",
    ],
  },
  {
    id: "ridge",
    name: "Ridge 14",
    category: "laptops",
    retail: 2180,
    open: 1390,
    price: 1180,
    matchPct: 91,
    grade: "B+",
    verifiedLabel: "Serial verified",
    watchers: 33,
    bids: 9,
    closesIn: "0h 54m",
    reasons: [
      "Spec match on the exact config you saved",
      "Cycle count and screen condition verified from photos",
      "Closing soon — 33 watchers is the highest of any open listing",
    ],
  },
  {
    id: "transit",
    name: "Transit S2",
    category: "bikes",
    retail: 2400,
    open: 1600,
    price: 1180,
    matchPct: 85,
    grade: "B",
    verifiedLabel: "Frame # verified",
    watchers: 19,
    bids: 5,
    closesIn: "2h 20m",
    reasons: [
      "Frame size matches your saved fit profile",
      "Battery and motor hours disclosed, not estimated",
      "Steepest markdown of any listing in your range today",
    ],
  },
  {
    id: "wave",
    name: "Wave Mini",
    category: "audio",
    retail: 199,
    open: 132,
    price: 98,
    matchPct: 90,
    grade: "A-",
    verifiedLabel: "Serial verified",
    watchers: 11,
    bids: 3,
    closesIn: "4h 12m",
    reasons: [
      "Grade A- is rare for this model at this price",
      "Original packaging confirmed in seller photos",
      "Under your saved budget even before today's markdown",
    ],
  },
];

export type TickerEvent = {
  id: string;
  listingId: string;
  /** literal "HH:MM:SS" — never computed from the real clock */
  ts: string;
  kind: EventKind;
  note: string;
  deltaText: string;
  value: string;
};

// Ascending by `ts` — a single session log. The board reverses this for display (newest first) and
// walks it forward, in this fixed order, for the auto-pulse. Nothing here is generated at runtime.
export const TICKER_EVENTS: TickerEvent[] = [
  { id: "e1", listingId: "x2", ts: "14:02:03", kind: "watch", note: "New watcher", deltaText: "+1", value: "21 watching" },
  { id: "e2", listingId: "ridge", ts: "14:03:41", kind: "watch", note: "New watchers", deltaText: "+4", value: "29 watching" },
  { id: "e3", listingId: "loop", ts: "14:05:18", kind: "drop", note: "Seller lowered the ask", deltaText: "-21%", value: "$268" },
  { id: "e4", listingId: "x2", ts: "14:06:41", kind: "drop", note: "Seller lowered the ask", deltaText: "-19%", value: "$612" },
  { id: "e5", listingId: "transit", ts: "14:08:14", kind: "watch", note: "New watchers", deltaText: "+2", value: "17 watching" },
  { id: "e6", listingId: "ridge", ts: "14:12:05", kind: "bid", note: "Offer submitted", deltaText: "+$40", value: "$1,140 offer" },
  { id: "e7", listingId: "loop", ts: "14:14:29", kind: "watch", note: "New watchers", deltaText: "+2", value: "13 watching" },
  { id: "e8", listingId: "wave", ts: "14:16:48", kind: "drop", note: "Seller lowered the ask", deltaText: "-26%", value: "$98" },
  { id: "e9", listingId: "transit", ts: "14:19:02", kind: "bid", note: "Offer submitted", deltaText: "+$60", value: "$1,120 offer" },
  { id: "e10", listingId: "x2", ts: "14:19:57", kind: "bid", note: "Offer submitted", deltaText: "+$18", value: "$605 offer" },
  { id: "e11", listingId: "ridge", ts: "14:23:40", kind: "watch", note: "New watchers", deltaText: "+4", value: "33 watching" },
  { id: "e12", listingId: "loop", ts: "14:26:03", kind: "bid", note: "Offer submitted", deltaText: "+$9", value: "$255 offer" },
  { id: "e13", listingId: "wave", ts: "14:28:22", kind: "watch", note: "New watchers", deltaText: "+2", value: "9 watching" },
  { id: "e14", listingId: "transit", ts: "14:30:51", kind: "drop", note: "Seller lowered the ask", deltaText: "-26%", value: "$1,180" },
  { id: "e15", listingId: "x2", ts: "14:33:14", kind: "watch", note: "New watchers", deltaText: "+3", value: "24 watching" },
  { id: "e16", listingId: "ridge", ts: "14:35:36", kind: "drop", note: "Closing-soon markdown", deltaText: "-15%", value: "$1,180" },
  { id: "e17", listingId: "loop", ts: "14:37:58", kind: "watch", note: "New watchers", deltaText: "+2", value: "15 watching" },
  { id: "e18", listingId: "wave", ts: "14:40:20", kind: "bid", note: "Offer submitted", deltaText: "+$4", value: "$94 offer" },
  { id: "e19", listingId: "transit", ts: "14:42:47", kind: "watch", note: "New watchers", deltaText: "+2", value: "19 watching" },
  { id: "e20", listingId: "wave", ts: "14:44:33", kind: "watch", note: "New watchers", deltaText: "+2", value: "11 watching" },
];

export function money(n: number): string {
  const v = Math.round(n);
  return "$" + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** percent drop from this listing's opening ask to its current price */
export function dropPct(l: Listing): number {
  return Math.round((1 - l.price / l.open) * 100);
}

/** percent discount from retail (MSRP) to current price */
export function discountPct(l: Listing): number {
  return Math.round((1 - l.price / l.retail) * 100);
}

function tsToSeconds(ts: string): number {
  const [h, m, s] = ts.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

export function lastEventSeconds(listingId: string): number {
  let max = 0;
  for (const e of TICKER_EVENTS) {
    if (e.listingId !== listingId) continue;
    const t = tsToSeconds(e.ts);
    if (t > max) max = t;
  }
  return max;
}

export function eventGlyph(kind: EventKind): "▲" | "▼" {
  return kind === "drop" ? "▼" : "▲";
}

export function eventKindLabel(kind: EventKind): string {
  if (kind === "bid") return "OFFER";
  if (kind === "drop") return "MARKDOWN";
  return "WATCH";
}

export function listingOf(listings: Listing[], id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function filterListings(category: CategoryId | "all"): Listing[] {
  if (category === "all") return LISTINGS;
  return LISTINGS.filter((l) => l.category === category);
}

export function sortListings(listings: Listing[], mode: SortMode): Listing[] {
  const copy = [...listings];
  if (mode === "drop") {
    copy.sort((a, b) => dropPct(b) - dropPct(a) || b.watchers - a.watchers);
  } else if (mode === "watched") {
    copy.sort((a, b) => b.watchers - a.watchers);
  } else {
    copy.sort((a, b) => lastEventSeconds(b.id) - lastEventSeconds(a.id));
  }
  return copy;
}

/** events belonging to `listings`, newest first */
export function feedFor(listings: Listing[]): TickerEvent[] {
  const ids = new Set(listings.map((l) => l.id));
  return [...TICKER_EVENTS].filter((e) => ids.has(e.listingId)).reverse();
}

export function withinBudget(listings: Listing[], target: number): Listing[] {
  return listings.filter((l) => l.price <= target);
}

export function fastestMover(listings: Listing[]): Listing | undefined {
  if (listings.length === 0) return undefined;
  return [...listings].sort((a, b) => dropPct(b) - dropPct(a))[0];
}

export function mostWatched(listings: Listing[]): Listing | undefined {
  if (listings.length === 0) return undefined;
  return [...listings].sort((a, b) => b.watchers - a.watchers)[0];
}
