// Fixed, deterministic data for the "Sell Timeline" candidate. Nothing here is randomized,
// fetched, or time-based (no Math.random, no Date.now) -- every number is a literal so the page
// renders identically on server and client and on every reload. Prices in USD, durations in days.

// ---------------------------------------------------------------------------------------------
// Seller personas -- the segmented single-select control in the Hero drives everything below it.

export type PersonaId = "first-listing" | "regular-seller" | "trade-in-bulk";

export type Persona = {
  id: PersonaId;
  label: string;
  tagline: string;
  blurb: string;
};

export const PERSONAS: Persona[] = [
  {
    id: "first-listing",
    label: "First listing",
    tagline: "New sellers",
    blurb:
      "No sales history yet, so every photo and price gets a manual review before it goes live.",
  },
  {
    id: "regular-seller",
    label: "Regular seller",
    tagline: "Verified track record",
    blurb: "A clean sell-through history skips the manual queue and goes straight to AI matching.",
  },
  {
    id: "trade-in-bulk",
    label: "Trade-in bulk",
    tagline: "Batch intake",
    blurb:
      "A full batch routes directly to repick's pre-verified bulk-buyer network instead of the open market.",
  },
];

export function personaById(id: PersonaId): Persona {
  return PERSONAS.find((p) => p.id === id)!;
}

export const DEFAULT_PERSONA: PersonaId = "regular-seller";

// ---------------------------------------------------------------------------------------------
// The selling-journey stage timeline. Four fixed stages; each persona carries its own fixed
// duration (in days) per stage. MAX_SCALE_DAYS is the shared ceiling every persona's bar is
// drawn against, so a faster persona visibly ends sooner rather than every bar filling the same
// width -- the width itself is the "duration" encoding the brief calls for, not just a label.

export type StageId = "list" | "match" | "verify" | "payout";

export type Stage = {
  id: StageId;
  name: string;
  verb: string; // used to build the live label, e.g. "Payout in 2 days"
  detail: string; // fixed description shown when a visitor selects this stage
};

export const STAGES: Stage[] = [
  {
    id: "list",
    name: "List",
    verb: "Listing live",
    detail:
      "Photos, price, and category get checked against repick's listing standard before the page goes public.",
  },
  {
    id: "match",
    name: "AI match",
    verb: "AI match",
    detail:
      "repick's matcher scores the listing against active buyer searches and surfaces it to the strongest-fit buyers first.",
  },
  {
    id: "verify",
    name: "Buyer verification",
    verb: "Buyer verified",
    detail:
      "The buyer's payment and identity clear repick's verification step before the sale is marked final.",
  },
  {
    id: "payout",
    name: "Payout",
    verb: "Payout",
    detail: "Funds move from escrow to the seller's linked bank account or card.",
  },
];

// days per [persona][stage] -- fixed literals, no derivation from anything random.
export const STAGE_DAYS: Record<PersonaId, Record<StageId, number>> = {
  "first-listing": { list: 1.5, match: 3, verify: 2, payout: 5 },
  "regular-seller": { list: 0.5, match: 1.5, verify: 1, payout: 2 },
  "trade-in-bulk": { list: 0.25, match: 0.5, verify: 0.25, payout: 1 },
};

// The widest total (first-listing's 11.5 days) rounded up -- the shared scale every bar draws
// against so persona-to-persona speed differences show up as bar *length*, not just labels.
export const MAX_SCALE_DAYS = 12;

export function totalDays(personaId: PersonaId): number {
  const days = STAGE_DAYS[personaId];
  return days.list + days.match + days.verify + days.payout;
}

/** Formats a day count as the friendliest fixed unit -- deterministic, no rounding surprises. */
export function formatDuration(days: number): string {
  if (days < 1) {
    const hours = Math.round(days * 24);
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  const rounded = Math.round(days * 10) / 10;
  const trimmed = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
  return `${trimmed} day${rounded === 1 ? "" : "s"}`;
}

/** The live label for one stage, e.g. "Payout in 2 days" / "Payout in 5 days". */
export function stageLabel(personaId: PersonaId, stageId: StageId): string {
  const stage = STAGES.find((s) => s.id === stageId)!;
  const days = STAGE_DAYS[personaId][stageId];
  return `${stage.verb} in ${formatDuration(days)}`;
}

/** Share of MAX_SCALE_DAYS this one stage occupies, rounded to 2 decimals for stable SVG/CSS math. */
export function stageWidthPct(personaId: PersonaId, stageId: StageId): number {
  const pct = (STAGE_DAYS[personaId][stageId] / MAX_SCALE_DAYS) * 100;
  return Math.round(pct * 100) / 100;
}

export function totalWidthPct(personaId: PersonaId): number {
  const pct = (totalDays(personaId) / MAX_SCALE_DAYS) * 100;
  return Math.round(Math.min(pct, 100) * 100) / 100;
}

// ---------------------------------------------------------------------------------------------
// Product preview -- a fixed catalog snapshot. NOT wired to the persona control: these four
// listings and their badges are the same regardless of which seller persona is selected, because
// they represent buyer-facing proof (what a sold listing looked like), not the selling pipeline.

export type Category = "Footwear" | "Outerwear" | "Bags" | "Accessories";

export type Listing = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  photoId: string;
  priceOriginal: number;
  priceNow: number;
  conditionLabel: string;
  matchPct: number;
  matchReason: string;
  verified: boolean;
};

export const LISTINGS: Listing[] = [
  {
    id: "runner-high",
    name: "Retro Runner High",
    brand: "Northfield",
    category: "Footwear",
    photoId: "1495121605193-b116b5b09a56",
    priceOriginal: 180,
    priceNow: 129,
    conditionLabel: "Grade A — worn twice, box included",
    matchPct: 94,
    matchReason: "Matched on size, colorway, and your saved brand alerts.",
    verified: true,
  },
  {
    id: "field-jacket",
    name: "Shearling Field Jacket",
    brand: "Carrow & Co.",
    category: "Outerwear",
    photoId: "1524805444758-089113d48a6d",
    priceOriginal: 340,
    priceNow: 198,
    conditionLabel: "Grade A− — light shelf wear",
    matchPct: 88,
    matchReason: "Priced 42% under this week's resale average for the model.",
    verified: true,
  },
  {
    id: "weekender-bag",
    name: "Canvas Weekender",
    brand: "Portside",
    category: "Bags",
    photoId: "1542291026-7eec264c27ff",
    priceOriginal: 150,
    priceNow: 96,
    conditionLabel: "Grade B+ — minor corner scuffing",
    matchPct: 81,
    matchReason: "Same-metro seller — courier delivery in under 24 hours.",
    verified: true,
  },
  {
    id: "aviator-sun",
    name: "Classic Aviator Sunglasses",
    brand: "Solane",
    category: "Accessories",
    photoId: "1523381210434-271e8be1f52b",
    priceOriginal: 165,
    priceNow: 74,
    conditionLabel: "Grade A — like new, original case",
    matchPct: 90,
    matchReason: "Open-box return, inspected and priced under every active comp.",
    verified: true,
  },
];

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.priceNow / listing.priceOriginal) * 100);
}

export function formatUSD(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function listingById(id: string): Listing {
  return LISTINGS.find((l) => l.id === id)!;
}

export const HERO_LISTING_ID = "runner-high";

// ---------------------------------------------------------------------------------------------
// Social proof

export const STATS: { label: string; value: string }[] = [
  { label: "Listings graded last year", value: "58,200+" },
  { label: "Seller personas modeled", value: "3" },
  { label: "Stages tracked per sale", value: "4" },
  { label: "Median time to first offer", value: "19 hr" },
];

export const TESTIMONIALS: { name: string; role: string; quote: string; initials: string }[] = [
  {
    name: "Dara Osei",
    role: "First listing, sold a jacket",
    quote:
      "I expected to wait around guessing. Instead the timeline told me exactly which step I was on and how long the next one would take.",
    initials: "DO",
  },
  {
    name: "Luca Ferrante",
    role: "Regular seller, 60+ sales",
    quote:
      "Switching to the regular-seller view cut the bar almost in half. That's the actual difference a track record makes here, not a vague promise.",
    initials: "LF",
  },
  {
    name: "Wren Castillo",
    role: "Traded in 14 items at once",
    quote:
      "Bulk intake skipped the open market entirely. Payout landed before I'd finished unpacking the next batch.",
    initials: "WC",
  },
];
