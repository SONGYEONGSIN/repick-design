// Static, hand-authored tier catalog + pure derivation helpers for the 2D quadrant recommender.
// No randomness: the live marker's position is the two slider values themselves, and the
// recommended tier is a deterministic nearest-neighbour lookup against four fixed plot points.

export type TierId = "quick-sale" | "balanced" | "best-price" | "premium-auth";

export interface Tier {
  id: TierId;
  name: string;
  /** Fixed reference position on the plot, 0-100 on both axes. */
  x: number; // price priority (0 = take a fair offer fast, 100 = hold out for top dollar)
  y: number; // sale urgency (0 = no rush, 100 = need it sold now)
  tagline: string;
  pitch: string;
  turnaround: string;
  fee: string;
  photoId: string; // images.unsplash.com/photo-<id>
  alt: string;
  itemName: string;
  match: number; // 0-100, AI match confidence for the example listing shown
  condition: string;
  verified: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "quick-sale",
    name: "Quick Sale",
    x: 20,
    y: 84,
    tagline: "Fastest path to cash",
    pitch:
      "The AI lists at a fair, comparable price and accepts strong offers the moment they land, so you're not left refreshing a listing.",
    turnaround: "24–72 hrs to sold",
    fee: "12% flat commission",
    photoId: "1543076447-215ad9ba6923",
    alt: "Pair of classic white low-top sneakers laid on a plain surface",
    itemName: "Classic low-top sneakers, EU 42",
    match: 91,
    condition: "A-",
    verified: true,
  },
  {
    id: "balanced",
    name: "Balanced",
    x: 50,
    y: 50,
    tagline: "Even split, no stalling",
    pitch:
      "A blended strategy — the AI holds out for slightly-above-market offers for a short window before it accepts, so the listing never goes stale.",
    turnaround: "5–8 days median",
    fee: "9% commission",
    photoId: "1560243563-062bfc001d68",
    alt: "Leather crossbody bag resting on a plain floor",
    itemName: "Leather crossbody bag",
    match: 88,
    condition: "B+",
    verified: true,
  },
  {
    id: "best-price",
    name: "Best Price",
    x: 84,
    y: 20,
    tagline: "Patience pays",
    pitch:
      "No rush, no compromise — the AI negotiates and waits for top-decile offers across a longer listing window.",
    turnaround: "2–3 weeks median",
    fee: "6% commission",
    photoId: "1445205170230-053b83016050",
    alt: "Vintage wool Chesterfield coat hanging alone on a clothing rack",
    itemName: "Vintage wool Chesterfield coat",
    match: 95,
    condition: "A",
    verified: true,
  },
  {
    id: "premium-auth",
    name: "Premium Auth",
    x: 80,
    y: 80,
    tagline: "Speed and top dollar",
    pitch:
      "For pieces worth verifying — a human authenticator confirms the AI's grading, then the listing is fast-tracked to serious buyers at a premium price.",
    turnaround: "3–5 days after authentication",
    fee: "15% commission (incl. authentication)",
    photoId: "1608256246200-53e635b5b65f",
    alt: "Pair of suede Chelsea boots side by side on a plain surface",
    itemName: "Suede Chelsea boots, verified",
    match: 97,
    condition: "A",
    verified: true,
  },
];

/**
 * Nearest-neighbour lookup: which fixed reference tier is the live (x, y) marker
 * closest to, by plain squared Euclidean distance. Pure function, no rounding
 * needed — both inputs and reference points are already plain integers.
 */
export function nearestTier(x: number, y: number): Tier {
  let best = TIERS[0];
  let bestDist = Infinity;
  for (const tier of TIERS) {
    const dist = (x - tier.x) ** 2 + (y - tier.y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = tier;
    }
  }
  return best;
}

/** Live explanation copy — always references the actual current slider values. */
export function explainRecommendation(tier: Tier, x: number, y: number): string {
  switch (tier.id) {
    case "quick-sale":
      return `At ${y}% urgency against just ${x}% price priority, speed wins the trade-off. ${tier.name} lists today at a fair market offer and typically closes in ${tier.turnaround}.`;
    case "balanced":
      return `Your priorities sit close to even — ${x}% price priority, ${y}% urgency. ${tier.name} holds out for a slightly better offer without stalling the listing, closing in ${tier.turnaround}.`;
    case "best-price":
      return `Price priority is running high at ${x}% against only ${y}% urgency — that patience pays. ${tier.name} negotiates for top-decile offers over ${tier.turnaround}.`;
    case "premium-auth":
      return `Both dials are high — ${x}% price priority and ${y}% urgency. That combination is what ${tier.name} is built for: authentication fast-tracks the listing so you get speed and a premium price.`;
  }
}

export interface Testimonial {
  name: string;
  context: string;
  quote: string;
  rating: number; // 1-5
  verified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Hana K.",
    context: "Sold on Quick Sale",
    quote:
      "I needed rent money by Friday. I dragged both sliders to the edge, saw Quick Sale light up, and it actually sold in two days at the price it quoted.",
    rating: 5,
    verified: true,
  },
  {
    name: "Daniel P.",
    context: "Sold on Best Price",
    quote:
      "I wasn't in a hurry, and the plot moved to Best Price the moment I said so. Three weeks later I got 18% more than my first offer.",
    rating: 5,
    verified: true,
  },
  {
    name: "Soo-jin L.",
    context: "Sold on Premium Auth",
    quote:
      "My bag needed real authentication, not just a photo check. Seeing the dot land on Premium Auth before I even scrolled down was what convinced me to try it.",
    rating: 4,
    verified: true,
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "96%", label: "Sellers matched to their first-recommended tier" },
  { value: "4 tiers", label: "Service paths, one AI reasoning engine" },
  { value: "12.4K", label: "Condition-verified trades to date" },
];

export const TRUST_SIGNALS: string[] = [
  "Tier match recomputed on every drag, not on submit",
  "Condition graded on a 12-point rubric",
  "Seller identity checked before listing",
  "Human authentication on every Premium Auth trade",
];
