// Data for the Trade Path Simulator: a 2-step branching decision tree. Step 1 picks a sell
// method; step 2's options depend on which step-1 method was picked. Every number below is a
// fixed, hand-authored estimate (no Math.random/Date.now) so the whole device is deterministic
// and reproducible on every render.

export type StepOneId = "sell-now" | "list-offer" | "trade-credit";
export type StepTwoId =
  | "instant-bank"
  | "instant-credit"
  | "accept-floor"
  | "hold-7"
  | "standard-credit"
  | "premium-credit";

export interface LeafOutcome {
  id: StepTwoId;
  parentId: StepOneId;
  /** Short label shown on the node itself. */
  label: string;
  /** Full sentence used in prose, the live-region announcement, and the "Your path" summary. */
  fullLabel: string;
  description: string;
  payout: number;
  days: number;
}

export interface BranchOption {
  id: StepOneId;
  /** Short label shown on the node itself. */
  label: string;
  /** Full phrase used in prose and announcements, e.g. "List for best offer". */
  fullLabel: string;
  description: string;
  children: LeafOutcome[];
}

/** The sample listing the whole simulator is priced against. */
export const SAMPLE_LISTING = {
  title: "Sony A7 IV body, Grade A",
  listingCode: "RPK-20417",
  baseValue: 1850,
  photoId: "1441986300917-64674bd600d8",
  alt: "Photo of the Sony A7 IV camera body listed for trade",
};

export const BASE_VALUE = SAMPLE_LISTING.baseValue;

export const BRANCHES: readonly BranchOption[] = [
  {
    id: "sell-now",
    label: "Sell now",
    fullLabel: "Sell now",
    description: "An instant, algorithmic offer — no listing, no negotiation.",
    children: [
      {
        id: "instant-bank",
        parentId: "sell-now",
        label: "Bank transfer",
        fullLabel: "instant bank transfer",
        description: "Cash lands in your linked bank account the next business day.",
        payout: 1395,
        days: 1,
      },
      {
        id: "instant-credit",
        parentId: "sell-now",
        label: "Store credit",
        fullLabel: "instant store credit",
        description: "Credit posts to your repick balance immediately, with a same-day bonus.",
        payout: 1480,
        days: 0,
      },
    ],
  },
  {
    id: "list-offer",
    label: "List offer",
    fullLabel: "List for best offer",
    description: "Your item goes live to verified buyers; you choose how long to hold out.",
    children: [
      {
        id: "accept-floor",
        parentId: "list-offer",
        label: "Accept first offer",
        fullLabel: "accepting the first offer above floor",
        description: "You take the first qualifying offer above your floor price.",
        payout: 1645,
        days: 3,
      },
      {
        id: "hold-7",
        parentId: "list-offer",
        label: "Hold 7 days",
        fullLabel: "holding for 7 days for the best offer",
        description: "The listing stays open a full week so competing offers can raise the price.",
        payout: 1760,
        days: 7,
      },
    ],
  },
  {
    id: "trade-credit",
    label: "Trade credit",
    fullLabel: "Trade in for store credit",
    description: "Trade straight in for credit toward your next purchase on repick.",
    children: [
      {
        id: "standard-credit",
        parentId: "trade-credit",
        label: "Standard credit",
        fullLabel: "standard trade-in credit",
        description: "Credit posts instantly at a flat bonus over the cash estimate.",
        payout: 1945,
        days: 0,
      },
      {
        id: "premium-credit",
        parentId: "trade-credit",
        label: "Premium credit",
        fullLabel: "premium credit toward a new purchase",
        description: "A larger bonus, applied directly toward one specific new listing.",
        payout: 2220,
        days: 0,
      },
    ],
  },
];

export function getBranch(id: StepOneId): BranchOption {
  const branch = BRANCHES.find((b) => b.id === id);
  if (!branch) throw new Error(`Unknown branch id: ${id}`);
  return branch;
}

export function getLeaf(parentId: StepOneId, id: StepTwoId): LeafOutcome {
  const leaf = getBranch(parentId).children.find((c) => c.id === id);
  if (!leaf) throw new Error(`Unknown leaf id: ${id} under ${parentId}`);
  return leaf;
}
