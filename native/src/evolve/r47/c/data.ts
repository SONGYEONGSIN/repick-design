// native/src/evolve/r47/c/data.ts
//
// Deterministic reward catalog + starting balance for the Points Redemption
// Catalog screen. Every cost is a fixed integer decided up front — nothing
// here reads the clock or a random source, so the same session always opens
// on the same balance and the same eight rewards in the same order.

export type RewardCategory = "shipping" | "boost" | "voucher";

export type Reward = {
  id: string;
  title: string;
  description: string;
  category: RewardCategory;
  costPoints: number;
};

export const CATEGORY_LABEL: Record<RewardCategory, string> = {
  shipping: "Shipping credit",
  boost: "Listing boost",
  voucher: "Store credit voucher",
};

// Points earned from prior selling and buying activity on repick.
export const STARTING_BALANCE = 2480;

export const REWARDS: Reward[] = [
  {
    id: "ship-5",
    title: "$5 shipping credit",
    description: "Takes $5 off the shipping label on your next sold item.",
    category: "shipping",
    costPoints: 400,
  },
  {
    id: "boost-24",
    title: "24-hour listing boost",
    description: "Moves one listing higher in search results for 24 hours.",
    category: "boost",
    costPoints: 300,
  },
  {
    id: "ship-10",
    title: "$10 shipping credit",
    description: "Takes $10 off the shipping label on your next sold item.",
    category: "shipping",
    costPoints: 750,
  },
  {
    id: "boost-72",
    title: "72-hour listing boost",
    description: "Moves one listing higher in search results for 3 days.",
    category: "boost",
    costPoints: 700,
  },
  {
    id: "voucher-5",
    title: "$5 store credit voucher",
    description: "Applied automatically to your next purchase at checkout.",
    category: "voucher",
    costPoints: 900,
  },
  {
    id: "boost-168",
    title: "7-day listing boost",
    description: "Moves one listing higher in search results for a week.",
    category: "boost",
    costPoints: 1500,
  },
  {
    id: "voucher-15",
    title: "$15 store credit voucher",
    description: "Applied automatically to your next purchase at checkout.",
    category: "voucher",
    costPoints: 2200,
  },
  {
    id: "voucher-30",
    title: "$30 store credit voucher",
    description: "Applied automatically to your next purchase at checkout.",
    category: "voucher",
    costPoints: 4000,
  },
];

// en-US grouping is deterministic for a fixed input integer — not a clock or
// locale-sensitive read.
export const formatPoints = (value: number): string =>
  value.toLocaleString("en-US");
