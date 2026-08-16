// native/src/evolve/r7/c/data.ts — auto-native-r7 candidate c (Price Alerts).
// All values below are fixed literals or pure functions of fixed literals — no Math.random,
// no Date.now, no argless `new Date()`.

export type AlertStatus = "armed" | "triggered" | "expired";
export type AlertKind = "price" | "restock";

type BaseAlert = {
  id: string;
  kind: AlertKind;
  itemTitle: string;
  itemMeta: string;
  createdLabel: string;
  status: AlertStatus;
};

export type PriceAlertRecord = BaseAlert & {
  kind: "price";
  currentPriceWon: number;
  targetPriceWon: number;
  minTargetWon: number;
  maxTargetWon: number;
};

export type RestockAlertRecord = BaseAlert & {
  kind: "restock";
  targetSize: string;
  inStockSizes: string[];
  sizeOptions: string[];
};

export type AlertRecord = PriceAlertRecord | RestockAlertRecord;

export const PRICE_STEP_WON = 5000;

export const STATUS_TEXT: Record<AlertStatus, string> = {
  armed: "Watching",
  triggered: "Target reached",
  expired: "Listing ended",
};

// Fixed initial list — deterministic, covers every kind × status combination once.
export const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: "pa1",
    kind: "price",
    itemTitle: "Nike Air Force 1 '07 White",
    itemMeta: "Size 270 · Grade A",
    createdLabel: "Set Jun 3",
    status: "armed",
    currentPriceWon: 128000,
    targetPriceWon: 100000,
    minTargetWon: 20000,
    maxTargetWon: 150000,
  },
  {
    id: "pa2",
    kind: "price",
    itemTitle: "Sony WH-1000XM4 Headphones",
    itemMeta: "Black · Grade B+",
    createdLabel: "Set Jun 14",
    status: "triggered",
    currentPriceWon: 145000,
    targetPriceWon: 150000,
    minTargetWon: 50000,
    maxTargetWon: 250000,
  },
  {
    id: "pa3",
    kind: "price",
    itemTitle: "Uniqlo U Wide Fit Jeans",
    itemMeta: "Size 32 · Grade A",
    createdLabel: "Set May 22",
    status: "expired",
    currentPriceWon: 38000,
    targetPriceWon: 30000,
    minTargetWon: 10000,
    maxTargetWon: 50000,
  },
  {
    id: "ra1",
    kind: "restock",
    itemTitle: "New Balance 550 Sea Salt",
    itemMeta: "Grade New",
    createdLabel: "Set Jul 2",
    status: "armed",
    targetSize: "260",
    inStockSizes: ["270", "280"],
    sizeOptions: ["230", "240", "250", "260", "270", "280"],
  },
  {
    id: "ra2",
    kind: "restock",
    itemTitle: "Patagonia Retro-X Fleece",
    itemMeta: "Grade A",
    createdLabel: "Set Jul 21",
    status: "triggered",
    targetSize: "M",
    inStockSizes: ["S", "M"],
    sizeOptions: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "ra3",
    kind: "restock",
    itemTitle: "Levi's 501 Vintage Fit",
    itemMeta: "Grade B",
    createdLabel: "Set Jun 28",
    status: "expired",
    targetSize: "32",
    inStockSizes: [],
    sizeOptions: ["29", "30", "31", "32", "33", "34"],
  },
];

export function formatWonDigits(won: number): string {
  return won.toLocaleString("en-US");
}

export function clampWon(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// A price alert re-evaluates its own status the instant the threshold moves — there is no
// separate "save" step. Expired alerts are locked: the listing is gone, so no target can bring
// it back.
export function recomputePriceStatus(
  currentPriceWon: number,
  targetPriceWon: number,
  prevStatus: AlertStatus,
): AlertStatus {
  if (prevStatus === "expired") return "expired";
  return currentPriceWon <= targetPriceWon ? "triggered" : "armed";
}

// A restock alert re-evaluates against the fixed "currently in stock" snapshot the instant the
// watched size changes.
export function recomputeRestockStatus(
  targetSize: string,
  inStockSizes: string[],
  prevStatus: AlertStatus,
): AlertStatus {
  if (prevStatus === "expired") return "expired";
  return inStockSizes.includes(targetSize) ? "triggered" : "armed";
}
