// app/src/app/landing-evolve/r13/c/data.ts — data, scoring math and shared style tokens for
// auto-landing-r13/c ("Reorder" — priority-list control × live ranked match board).
//
// Every export below is a module constant or a PURE function of the current priority order. No
// `Math.random`, no `Date.now`, no argless `new Date()`: the re-rank, the match% and the reasoning
// sentence are all deterministic functions of `order`, so the server render and the client hydration
// always agree and reordering never introduces a random tie-break.

import type { LucideIcon } from "lucide-react";
import { Tag, Sparkles, ShieldCheck, Truck, Gem } from "lucide-react";

// --- utils -----------------------------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// --- palette / tokens ------------------------------------------------------------------------------
// Dark, near-monochrome canvas with a single SKY accent. Two roles only, each with a checked ratio
// against this page's BG #0B0B0F and against white, so the accent never lands on a failing pairing:
//   sky-400 #38bdf8 on BG #0B0B0F .... 9.9:1  → small accent TEXT + ICONS on the dark ground (safe)
//   sky-700 #0369a1 fill, white text .. 6.0:1  → every accent FILL that carries small white text
//                                                (CTA buttons, active segment, active/top badge)
//   sky-600 #0284c7 fill, white text .. 4.1:1  → FAILS AA 4.5 for small text, so it is NOT used as a
//                                                a text-bearing fill; sky-700 is used instead.
//   zinc-400 #a1a1aa on BG ........... 7.6:1  → muted body copy (DNA floor for dark auxiliary text)
export const BG = "#0B0B0F";
export const SKY = "#38bdf8"; // sky-400 — small accent text + icons on the dark ground
export const SKY_FILL = "#0369a1"; // sky-700 — fills carrying small white text
export const SKY_FILL_HOVER = "#075985"; // sky-800 — hover for those fills

/** Focus indicator: plain `outline` + a soft box-shadow halo (never `ring`/`ring-offset`, which
 * Tailwind v4 paints transparent), and no `outline-none` in front of it to cancel itself. Sky
 * carries every focus ring regardless of which control it sits on. */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8] focus-visible:shadow-[0_0_0_3px_rgba(56,189,248,0.3)]";

// tracking 3-scale, one weight each (weights kept to 400 / 600 / 800 across the whole route)
export const EYEBROW = "text-[0.68rem] font-semibold uppercase tracking-[0.26em]";
export const CAPTION = "text-[0.7rem] font-semibold uppercase tracking-[0.14em]";

// --- priorities: the reorderable control -----------------------------------------------------------
export type PriorityId = "price" | "condition" | "verified" | "ship" | "rarity";

export type Priority = {
  id: PriorityId;
  label: string;
  icon: LucideIcon;
  /** Short gloss shown under the label in the control. */
  gloss: string;
};

export const PRIORITIES: Priority[] = [
  { id: "price", label: "Lowest price", icon: Tag, gloss: "Biggest discount under comps" },
  { id: "condition", label: "Best condition", icon: Sparkles, gloss: "Highest graded, fewest flaws" },
  { id: "verified", label: "Verified seller", icon: ShieldCheck, gloss: "ID + payout confirmed" },
  { id: "ship", label: "Fastest ship", icon: Truck, gloss: "Soonest tracked delivery" },
  { id: "rarity", label: "Rarity", icon: Gem, gloss: "Fewest comparable listings" },
];

/** The default priority order the page renders at rest — a non-trivial arrangement so the board
 * already shows a real ranking (not an identity/placeholder state) before any interaction. */
export const DEFAULT_ORDER: PriorityId[] = ["price", "condition", "verified", "ship", "rarity"];

const priorityById = (id: PriorityId): Priority =>
  PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[0];

export const priorityLabel = (id: PriorityId): string => priorityById(id).label;

// --- listings: the board ---------------------------------------------------------------------------
export type ScoreMap = Record<PriorityId, number>; // each dimension normalized 0–100
export type DetailMap = Record<PriorityId, string>; // the "why" clause per dimension

export type Listing = {
  id: string;
  title: string;
  brand: string;
  photoId: string;
  alt: string;
  price: number;
  originalPrice: number;
  grade: string;
  verified: boolean;
  shipLabel: string; // compact ship line shown at rest
  /** Per-dimension 0–100 fit used by the scoring function. */
  scores: ScoreMap;
  /** Per-dimension one-line evidence, surfaced as the "why it ranks here" reasoning. */
  details: DetailMap;
  /** Extra proof revealed by the per-card explain expander (never gates the always-shown proof). */
  explain: [string, string, string];
};

export const LISTINGS: Listing[] = [
  {
    id: "wool-trench",
    title: "Wool-Blend Trench Coat",
    brand: "Kova Studio",
    photoId: "photo-1490481651871-ab68de25d43d",
    alt: "AI scan: single-breasted wool-blend trench, belt intact, light shoulder wear",
    price: 128,
    originalPrice: 210,
    grade: "A",
    verified: true,
    shipLabel: "Ships in 3 days",
    scores: { price: 88, condition: 82, verified: 100, ship: 60, rarity: 45 },
    details: {
      price: "$128 — 39% under 6 comparable listings",
      condition: "Grade A — matched to 14 reference photos",
      verified: "ID + payout verified — 118 completed sales",
      ship: "Tracked, ships within 3 business days",
      rarity: "3 comparable trenches listed this month",
    },
    explain: [
      "Matches your saved search 'minimalist outerwear'",
      "Belt and lining confirmed intact on video",
      "Seller replies in under 2 hours on average",
    ],
  },
  {
    id: "shearling-bomber",
    title: "Shearling-Collar Bomber",
    brand: "Aldern & Row",
    photoId: "photo-1441986300917-64674bd600d8",
    alt: "AI scan: full-grain leather bomber, shearling trim, even patina",
    price: 96,
    originalPrice: 165,
    grade: "A-",
    verified: true,
    shipLabel: "Ships next day",
    scores: { price: 66, condition: 78, verified: 100, ship: 85, rarity: 88 },
    details: {
      price: "$96 — 42% under 5 comparable listings",
      condition: "Grade A- — even patina, no repairs found",
      verified: "ID + payout verified — 63 completed sales",
      ship: "Tracked, ships the next business day",
      rarity: "1 of 4 in this size listed this month",
    },
    explain: [
      "Close match to 3 items in your saved closet",
      "Condition confirmed against 14 reference photos",
      "12 buyers are watching this listing",
    ],
  },
  {
    id: "auto-chronograph",
    title: "Automatic Chronograph",
    brand: "Verlan",
    photoId: "photo-1500648767791-00dcc994a43e",
    alt: "AI scan: stainless chronograph, sapphire crystal clear, movement ticking on video",
    price: 210,
    originalPrice: 340,
    grade: "A+",
    verified: true,
    shipLabel: "Ships in 4 days",
    scores: { price: 30, condition: 96, verified: 100, ship: 45, rarity: 97 },
    details: {
      price: "$210 — 38% under retail comparables",
      condition: "Grade A+ — movement verified by video check",
      verified: "ID + payout verified — 41 completed sales",
      ship: "Insured, ships within 4 business days",
      rarity: "1 of 2 of this reference listed this season",
    },
    explain: [
      "Matches your saved search 'automatic chronograph'",
      "Movement verified by a 6-second video check",
      "Sapphire crystal confirmed scratch-free in macro",
    ],
  },
  {
    id: "canvas-trainers",
    title: "Retro Canvas Trainers",
    brand: "Fieldstone",
    photoId: "photo-1552664730-d307ca884978",
    alt: "AI scan: canvas trainers, rubber sole tread at 85 percent, no sole separation",
    price: 42,
    originalPrice: 78,
    grade: "A",
    verified: false,
    shipLabel: "Ships same day",
    scores: { price: 95, condition: 74, verified: 45, ship: 96, rarity: 38 },
    details: {
      price: "$42 — 46% under 8 comparable listings",
      condition: "Grade A — sole tread measured at 85%",
      verified: "Seller verifying — ID check still pending",
      ship: "Ships same day, arrives within 2 days",
      rarity: "12 comparable trainers listed this month",
    },
    explain: [
      "Matches your saved size and colorway filters",
      "Sole wear measured within your accepted range",
      "Original box and laces included",
    ],
  },
  {
    id: "leather-satchel",
    title: "Structured Leather Satchel",
    brand: "Halden Co.",
    photoId: "photo-1531123897727-8f129e1688ce",
    alt: "AI scan: structured leather satchel, brass buckles, corners show light wear",
    price: 89,
    originalPrice: 160,
    grade: "A-",
    verified: true,
    shipLabel: "Ships in 2 days",
    scores: { price: 58, condition: 80, verified: 100, ship: 70, rarity: 66 },
    details: {
      price: "$89 — 44% under 4 comparable listings",
      condition: "Grade A- — corner wear within threshold",
      verified: "ID + payout verified — 41 completed sales",
      ship: "Tracked, ships within 2 business days",
      rarity: "2 in this leather listed this month",
    },
    explain: [
      "Close match to 2 items you saved this week",
      "Corner wear falls within your condition threshold",
      "Brass hardware confirmed secure on video",
    ],
  },
  {
    id: "suede-boots",
    title: "Suede Desert Boots",
    brand: "Cabrillo",
    photoId: "photo-1519085360753-af0119f7cbe7",
    alt: "AI scan: suede desert boots, crepe sole even wear, light watermark near toe",
    price: 51,
    originalPrice: 89,
    grade: "B+",
    verified: false,
    shipLabel: "Ships next day",
    scores: { price: 84, condition: 68, verified: 45, ship: 82, rarity: 40 },
    details: {
      price: "$51 — 43% under 7 comparable listings",
      condition: "Grade B+ — light watermark noted at toe",
      verified: "Seller verifying — ID check still pending",
      ship: "Tracked, ships the next business day",
      rarity: "9 comparable boots listed this month",
    },
    explain: [
      "Matches your saved size 9.5",
      "Watermark pattern flagged for your review",
      "Crepe sole wear even across both boots",
    ],
  },
];

// --- scoring: pure functions of the priority order -------------------------------------------------
// Rank r (0-indexed) in the priority list carries weight (N − r): the top priority weighs most, the
// bottom least. match% is the weight-average of that listing's per-dimension fit. Because weights
// come only from ordinal position, reordering the list re-weights every card in lockstep.
const RANK_WEIGHTS: number[] = PRIORITIES.map((_, i) => PRIORITIES.length - i); // [5,4,3,2,1]
const WEIGHT_SUM = RANK_WEIGHTS.reduce((a, b) => a + b, 0); // 15

export function matchPercent(listing: Listing, order: PriorityId[]): number {
  const weighted = order.reduce(
    (sum, id, rank) => sum + RANK_WEIGHTS[rank] * listing.scores[id],
    0,
  );
  return Math.round(weighted / WEIGHT_SUM);
}

/** The "why it ranks here" sentence — always cites the current TOP priority, so one reorder refreshes
 * the reasoning on every card at once. */
export function reasonFor(listing: Listing, order: PriorityId[]): string {
  const top = order[0];
  return listing.details[top];
}

export type RankedCard = {
  listing: Listing;
  match: number;
  reason: string;
  topPriority: PriorityId;
};

/** Rank the board by match% descending. Ties break by original catalog index ascending — a stable,
 * fully deterministic order with no random tie-break. */
export function rankBoard(order: PriorityId[], pool: Listing[]): RankedCard[] {
  return pool
    .map((listing, index) => ({
      listing,
      index,
      match: matchPercent(listing, order),
    }))
    .sort((a, b) => (b.match - a.match) || (a.index - b.index))
    .map(({ listing, match }) => ({
      listing,
      match,
      reason: reasonFor(listing, order),
      topPriority: order[0],
    }));
}

export const discountOf = (l: Listing): number =>
  Math.round(((l.originalPrice - l.price) / l.originalPrice) * 100);

// --- board filter (segmented toggle) ---------------------------------------------------------------
export type FilterId = "all" | "verified" | "under100";

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All items" },
  { id: "verified", label: "Verified only" },
  { id: "under100", label: "Under $100" },
];

export function applyFilter(cards: RankedCard[], filter: FilterId): RankedCard[] {
  if (filter === "verified") return cards.filter((c) => c.listing.verified);
  if (filter === "under100") return cards.filter((c) => c.listing.price < 100);
  return cards;
}

// --- below-fold copy -------------------------------------------------------------------------------
export const VALUE_STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "You set the order",
    body: "Rank what matters — price, condition, seller, speed, rarity. The list is the whole control.",
  },
  {
    n: "02",
    title: "The board re-ranks live",
    body: "Every card's match% recomputes and the deck re-sorts the instant your top priority changes.",
  },
  {
    n: "03",
    title: "Each card says why",
    body: "One line per card cites your top priority against real proof — never a black-box score.",
  },
];

export const PROOF_STATS: { value: string; label: string }[] = [
  { value: "148,000+", label: "Listings graded end to end" },
  { value: "94%", label: "Buyers who reorder before buying" },
  { value: "AA", label: "Every proof surface, contrast-checked" },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "I dropped 'lowest price' to the bottom and moved 'verified seller' up, and the whole board re-ranked in front of me. I could read why the top pick changed.",
    name: "Priya Kapoor",
    role: "Bought 6 pieces on repick",
  },
  {
    quote:
      "The match number is not the pitch — the line under it is. Every card tells me which of my priorities it won on, so I never guess why it ranked where it did.",
    name: "Daniel Osei",
    role: "Buys and resells footwear",
  },
];

export function photoUrl(photoId: string, width: number): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}
