// Shared, deterministic data for the Transit Path landing page. No Math.random / Date.now
// anywhere in this file or its consumers — every number here is a fixed input.

export type SpeedId = "standard" | "expedited" | "sameday";

export type SpeedOption = {
  id: SpeedId;
  label: string;
  /** hours from seller handoff to the verification hub's door */
  sellerToHub: number;
  /** hours the hub spends authenticating, grading and photographing the item */
  hubProcessing: number;
  /** hours from the hub's door to the buyer's door */
  hubToBuyer: number;
  /** total shipping cost charged for this speed, in whole dollars */
  cost: number;
  /** cost attributed to each leg of the route — must sum to `cost` */
  legCost: readonly [sellerLeg: number, hubFee: number, buyerLeg: number];
};

// Clean, hand-set hour values so every derived label (12 hrs / 1 day / 2 days) reads naturally —
// not computed from anything random or time-of-day dependent.
export const SPEEDS: readonly SpeedOption[] = [
  {
    id: "standard",
    label: "Standard",
    sellerToHub: 24,
    hubProcessing: 24,
    hubToBuyer: 48,
    cost: 4,
    legCost: [1, 2, 1],
  },
  {
    id: "expedited",
    label: "Expedited",
    sellerToHub: 12,
    hubProcessing: 12,
    hubToBuyer: 24,
    cost: 15,
    legCost: [6, 3, 6],
  },
  {
    id: "sameday",
    label: "Same-day",
    sellerToHub: 2,
    hubProcessing: 2,
    hubToBuyer: 4,
    cost: 34,
    legCost: [14, 6, 14],
  },
];

export const DEFAULT_SPEED: SpeedId = "standard";

export type DerivedSpeed = SpeedOption & {
  /** cumulative hour the item arrives at the hub */
  hubArrivalHour: number;
  /** cumulative hour the item leaves the hub, verification complete */
  hubDepartureHour: number;
  /** cumulative hour the item reaches the buyer — the headline ETA */
  totalHours: number;
  sellerToHubLabel: string;
  hubProcessingLabel: string;
  hubToBuyerLabel: string;
  totalLabel: string;
  costLabel: string;
};

export function formatHours(hours: number): string {
  if (hours <= 0) return "instant";
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function deriveSpeed(speed: SpeedOption): DerivedSpeed {
  const hubArrivalHour = speed.sellerToHub;
  const hubDepartureHour = speed.sellerToHub + speed.hubProcessing;
  const totalHours = hubDepartureHour + speed.hubToBuyer;
  return {
    ...speed,
    hubArrivalHour,
    hubDepartureHour,
    totalHours,
    sellerToHubLabel: formatHours(speed.sellerToHub),
    hubProcessingLabel: formatHours(speed.hubProcessing),
    hubToBuyerLabel: formatHours(speed.hubToBuyer),
    totalLabel: formatHours(totalHours),
    costLabel: formatUsd(speed.cost),
  };
}

export function findSpeed(id: SpeedId): SpeedOption {
  return SPEEDS.find((s) => s.id === id) ?? SPEEDS[0];
}

// Fastest/cheapest reduced over the 3 options. Guarded against ties: the accumulator starts as
// SPEEDS[0] and only a *strictly* lower value ever replaces it, so two equal-value options never
// leave both (or neither) labelled — the first one found simply keeps the badge. There is no tie
// in this fixed data set, but the reduce is written to stay correct if the numbers above ever change.
export const FASTEST_SPEED: SpeedOption = SPEEDS.reduce(
  (best, s) => (s.sellerToHub + s.hubProcessing + s.hubToBuyer < best.sellerToHub + best.hubProcessing + best.hubToBuyer ? s : best),
  SPEEDS[0],
);
export const CHEAPEST_SPEED: SpeedOption = SPEEDS.reduce(
  (best, s) => (s.cost < best.cost ? s : best),
  SPEEDS[0],
);

// ---------------------------------------------------------------------------------------------
// Product preview listings
// ---------------------------------------------------------------------------------------------

export type Listing = {
  id: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  grade: string;
  matchReason: string;
  sellerRating: number;
  sellerSales: number;
  priceOriginal: number;
  priceNow: number;
};

export const LISTINGS: readonly Listing[] = [
  {
    id: "canon-ae1",
    name: "Canon AE-1 Program",
    category: "35mm film camera",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
    alt: "Canon AE-1 Program film camera body photographed against a white background",
    grade: "A−",
    matchReason: "Shutter verified at 1/1000s · light seals replaced",
    sellerRating: 4.9,
    sellerSales: 341,
    priceOriginal: 420,
    priceNow: 268,
  },
  {
    id: "omega-seamaster",
    name: "Omega Seamaster Diver 300M",
    category: "automatic watch",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop",
    alt: "Stainless steel Omega Seamaster dive watch with a blue dial, photographed against a plain background",
    grade: "Excellent",
    matchReason: "Movement serviced 2025 · box and papers on file",
    sellerRating: 4.95,
    sellerSales: 86,
    priceOriginal: 4200,
    priceNow: 2850,
  },
  {
    id: "peak-design-backpack",
    name: "Peak Design Everyday Backpack 20L",
    category: "camera backpack",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    alt: "Peak Design Everyday Backpack in dark canvas, standing upright",
    grade: "Good",
    matchReason: "Zippers cycle-tested · strap stitching reinforced",
    sellerRating: 4.8,
    sellerSales: 212,
    priceOriginal: 280,
    priceNow: 171,
  },
];

export function discountPercent(before: number, after: number): number {
  return Math.round(((before - after) / before) * 100);
}

// ---------------------------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------------------------

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "t1",
    name: "Jordan Pak",
    role: "Sold 14 lenses this year",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    quote: "I listed a lens at 11pm and had a verified offer before I woke up. The grading report matched what I would have written myself.",
  },
  {
    id: "t2",
    name: "Resa Okafor",
    role: "Buyer, 6 purchases",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    quote: "Same-day shipping actually meant same day. The tracking showed exactly which hub my watch was sitting in.",
  },
  {
    id: "t3",
    name: "Milo Fenwick",
    role: "Sold 29 items this year",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    quote: "Payout cleared the hour verification finished. No back-and-forth over condition — the grade was already settled.",
  },
];

export const TRUST_STATS: readonly { value: string; label: string }[] = [
  { value: "128,000", label: "verified sales shipped" },
  { value: "$42M", label: "paid out to sellers" },
  { value: "4.9 / 5", label: "average seller rating" },
];
