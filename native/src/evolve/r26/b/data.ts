// native/src/evolve/r26/b/data.ts
// Deterministic dummy data + pure derivation helpers for the Seller Rating
// Summary screen. Nothing here calls Math.random / Date.now / new Date() —
// every "computed" value below is a pure fold over the fixed entry list, so
// the on-screen numbers are genuinely derived, not typed-in placeholders.

export type StarCount = 1 | 2 | 3 | 4 | 5;

export type ScoreLens = "overall" | "itemAsDescribed" | "shippingSpeed" | "communication";

export interface RatingEntry {
  id: string;
  buyerLabel: string; // anonymized-ish buyer identity as shown to the seller
  gearContext: string; // what was purchased, ties the review to a real transaction
  postedLabel: string; // fixed relative-time string, not a live clock
  overallStars: StarCount;
  categoryStars: Record<Exclude<ScoreLens, "overall">, StarCount>;
  body: string;
  usefulVotes: number;
}

export const sellerDisplayName = "Meridian Optics Co.";
export const sellerSinceLabel = "Selling on repick since 2021";

export const ratingEntries: RatingEntry[] = [
  {
    id: "rv-01",
    buyerLabel: "Alicia P. · Portland, OR",
    gearContext: "Purchased: Sony A7 III + 24-70mm kit",
    postedLabel: "Posted 2 days ago",
    overallStars: 5,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 5, communication: 5 },
    body: "Body and lens matched the listing photos exactly, down to the small brassing on the grip. Shipped same afternoon with tracking sent right away.",
    usefulVotes: 14,
  },
  {
    id: "rv-02",
    buyerLabel: "Marcus T. · Austin, TX",
    gearContext: "Purchased: Canon 5D Mark IV body",
    postedLabel: "Posted 5 days ago",
    overallStars: 5,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 4, communication: 5 },
    body: "Shutter count and sensor condition were exactly as disclosed. Answered every question same day before I bought.",
    usefulVotes: 9,
  },
  {
    id: "rv-03",
    buyerLabel: "Priya K. · Seattle, WA",
    gearContext: "Purchased: Fujifilm X100V",
    postedLabel: "Posted 1 week ago",
    overallStars: 4,
    categoryStars: { itemAsDescribed: 4, shippingSpeed: 4, communication: 5 },
    body: "Small scuff on the bottom plate wasn't in the photos, but it was disclosed honestly once I asked. Great communication throughout.",
    usefulVotes: 6,
  },
  {
    id: "rv-04",
    buyerLabel: "Daniel W. · Denver, CO",
    gearContext: "Purchased: Nikon Z6 II + 24-120mm",
    postedLabel: "Posted 9 days ago",
    overallStars: 5,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 5, communication: 4 },
    body: "Double-boxed and fully insured. Arrived two days earlier than the estimate.",
    usefulVotes: 21,
  },
  {
    id: "rv-05",
    buyerLabel: "Sofia R. · Miami, FL",
    gearContext: "Purchased: Peak Design Everyday Backpack",
    postedLabel: "Posted 2 weeks ago",
    overallStars: 3,
    categoryStars: { itemAsDescribed: 3, shippingSpeed: 2, communication: 4 },
    body: "Bag itself was fine, but it sat five days before shipping with no update until I messaged first.",
    usefulVotes: 4,
  },
  {
    id: "rv-06",
    buyerLabel: "Ben H. · Minneapolis, MN",
    gearContext: "Purchased: Leica Q2",
    postedLabel: "Posted 3 weeks ago",
    overallStars: 5,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 5, communication: 5 },
    body: "Best private-party camera purchase I've made. Included the original box and two extra batteries as promised.",
    usefulVotes: 27,
  },
  {
    id: "rv-07",
    buyerLabel: "Grace L. · Boston, MA",
    gearContext: "Purchased: Sigma 35mm f/1.4 Art",
    postedLabel: "Posted 3 weeks ago",
    overallStars: 4,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 4, communication: 3 },
    body: "Lens is mint, exactly as listed. Took about two days longer than most sellers to reply to my first message.",
    usefulVotes: 3,
  },
  {
    id: "rv-08",
    buyerLabel: "Omar S. · Phoenix, AZ",
    gearContext: "Purchased: DJI RS 3 Gimbal",
    postedLabel: "Posted 1 month ago",
    overallStars: 5,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 5, communication: 5 },
    body: "Included a printed balance chart for my rig config, which nobody does. Genuinely thoughtful seller.",
    usefulVotes: 11,
  },
  {
    id: "rv-09",
    buyerLabel: "Kayla N. · Raleigh, NC",
    gearContext: "Purchased: Godox AD200 flash kit",
    postedLabel: "Posted 1 month ago",
    overallStars: 2,
    categoryStars: { itemAsDescribed: 2, shippingSpeed: 3, communication: 2 },
    body: "Flash head had more scratching than the listing showed, and it took three messages to get a response about it.",
    usefulVotes: 18,
  },
  {
    id: "rv-10",
    buyerLabel: "Trevor J. · Salt Lake City, UT",
    gearContext: "Purchased: Sony 70-200mm f/2.8 GM",
    postedLabel: "Posted 5 weeks ago",
    overallStars: 5,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 5, communication: 5 },
    body: "Optics are flawless, no fungus or haze anywhere near the edges. Would buy from again without hesitation.",
    usefulVotes: 8,
  },
  {
    id: "rv-11",
    buyerLabel: "Nadia F. · San Diego, CA",
    gearContext: "Purchased: Canon RF 50mm f/1.2",
    postedLabel: "Posted 6 weeks ago",
    overallStars: 4,
    categoryStars: { itemAsDescribed: 4, shippingSpeed: 5, communication: 4 },
    body: "Exactly as described, packaging was excellent. Only note is the lens hood wasn't mentioned until I asked.",
    usefulVotes: 5,
  },
  {
    id: "rv-12",
    buyerLabel: "Chris B. · Nashville, TN",
    gearContext: "Purchased: GoPro Hero 12 bundle",
    postedLabel: "Posted 7 weeks ago",
    overallStars: 5,
    categoryStars: { itemAsDescribed: 5, shippingSpeed: 4, communication: 5 },
    body: "Bundle had every accessory listed plus a spare battery the seller threw in unprompted.",
    usefulVotes: 12,
  },
];

export const SCORE_LENS_LABEL: Record<ScoreLens, string> = {
  overall: "Overall rating",
  itemAsDescribed: "Item as described",
  shippingSpeed: "Shipping speed",
  communication: "Communication",
};

export const SCORE_LENS_ORDER: ScoreLens[] = [
  "overall",
  "itemAsDescribed",
  "shippingSpeed",
  "communication",
];

function starsForLens(entry: RatingEntry, lens: ScoreLens): StarCount {
  return lens === "overall" ? entry.overallStars : entry.categoryStars[lens];
}

// Pure fold — average score for a given lens across the fixed entry list.
// Recomputed on demand (see the screen's useMemo), never stored as a literal.
export function averageForLens(entries: RatingEntry[], lens: ScoreLens): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, e) => acc + starsForLens(e, lens), 0);
  return Math.round((sum / entries.length) * 10) / 10;
}

// Pure fold — 1..5 star histogram for a given lens across the fixed entry list.
export function distributionForLens(
  entries: RatingEntry[],
  lens: ScoreLens
): Record<StarCount, number> {
  const buckets: Record<StarCount, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  entries.forEach((e) => {
    buckets[starsForLens(e, lens)] += 1;
  });
  return buckets;
}
