// Deterministic, fixed-literal data for the "Duel" head-to-head comparator.
// No Math.random / Date.now / new Date anywhere — every number below is a
// hand-authored literal, and every derived value is a pure function of them.

export type ListingId = "jacket" | "watch" | "sneaker" | "camera";

export type AxisKey = "price" | "condition" | "trust" | "delivery";

export interface Listing {
  id: ListingId;
  name: string;
  brand: string;
  category: string;
  price: number;
  listPrice: number;
  grade: string;
  verified: boolean;
  deliveryDays: number;
  matchScore: number;
  matchReason: string;
  axis: Record<AxisKey, number>;
}

export const LISTINGS: Listing[] = [
  {
    id: "jacket",
    name: "Ridge Shell Jacket",
    brand: "Arc Trail",
    category: "Outerwear",
    price: 128,
    listPrice: 210,
    grade: "A-",
    verified: true,
    deliveryDays: 2,
    matchScore: 96,
    matchReason: "Matches three of your saved cold-weather searches",
    axis: { price: 82, condition: 88, trust: 94, delivery: 90 },
  },
  {
    id: "watch",
    name: "Diver 200M Chrono",
    brand: "Seiko",
    category: "Watches",
    price: 310,
    listPrice: 420,
    grade: "B+",
    verified: true,
    deliveryDays: 4,
    matchScore: 91,
    matchReason: "Priced under your watch alert ceiling of $350",
    axis: { price: 64, condition: 78, trust: 88, delivery: 68 },
  },
  {
    id: "sneaker",
    name: "Pulse Runner 97",
    brand: "Nike",
    category: "Sneakers",
    price: 96,
    listPrice: 150,
    grade: "A",
    verified: true,
    deliveryDays: 1,
    matchScore: 98,
    matchReason: "Your exact size in a colorway flagged as rare",
    axis: { price: 80, condition: 92, trust: 97, delivery: 96 },
  },
  {
    id: "camera",
    name: "Mirrorless Mk II",
    brand: "Fujifilm",
    category: "Cameras",
    price: 540,
    listPrice: 890,
    grade: "A-",
    verified: true,
    deliveryDays: 3,
    matchScore: 89,
    matchReason: "Same kit configuration you compared last week",
    axis: { price: 83, condition: 85, trust: 90, delivery: 80 },
  },
];

export const WEIGHTS: Record<AxisKey, number> = {
  price: 0.3,
  condition: 0.25,
  trust: 0.25,
  delivery: 0.2,
};

export const AXES: { key: AxisKey; label: string; weightLabel: string }[] = [
  { key: "price", label: "Price value", weightLabel: "30%" },
  { key: "condition", label: "Condition grade", weightLabel: "25%" },
  { key: "trust", label: "Seller trust", weightLabel: "25%" },
  { key: "delivery", label: "Delivery speed", weightLabel: "20%" },
];

export function getListing(id: ListingId): Listing {
  const found = LISTINGS.find((l) => l.id === id);
  if (!found) throw new Error(`Unknown listing id: ${id}`);
  return found;
}

export function discountPct(l: Listing): number {
  return Math.round(((l.listPrice - l.price) / l.listPrice) * 100);
}

export function aggregateScore(l: Listing): number {
  const raw =
    l.axis.price * WEIGHTS.price +
    l.axis.condition * WEIGHTS.condition +
    l.axis.trust * WEIGHTS.trust +
    l.axis.delivery * WEIGHTS.delivery;
  return Math.round(raw * 10) / 10;
}

export type AxisWinner = "a" | "b" | "tie";

export function axisWinner(a: Listing, b: Listing, axis: AxisKey): AxisWinner {
  if (a.axis[axis] === b.axis[axis]) return "tie";
  return a.axis[axis] > b.axis[axis] ? "a" : "b";
}

export function winCount(a: Listing, b: Listing): { a: number; b: number } {
  let aWins = 0;
  let bWins = 0;
  for (const { key } of AXES) {
    const w = axisWinner(a, b, key);
    if (w === "a") aWins += 1;
    if (w === "b") bWins += 1;
  }
  return { a: aWins, b: bWins };
}

export function overallWinner(a: Listing, b: Listing): { winner: Listing; loser: Listing; winnerScore: number; loserScore: number } {
  const aScore = aggregateScore(a);
  const bScore = aggregateScore(b);
  if (aScore >= bScore) {
    return { winner: a, loser: b, winnerScore: aScore, loserScore: bScore };
  }
  return { winner: b, loser: a, winnerScore: bScore, loserScore: aScore };
}
