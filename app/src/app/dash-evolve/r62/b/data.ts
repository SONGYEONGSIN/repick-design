// Deterministic Dockwise fulfillment-ops data. No Math.random / Date.now / new Date() anywhere —
// every figure below is hand-authored, and every total is hand-reconciled in the comment beside it.

export type ZoneId = "fast-pick" | "bulk" | "cold-chain" | "cross-dock" | "returns" | "staging" | "hazmat" | "overflow";

export type Zone = {
  id: ZoneId;
  name: string;
  onHand: number; // USD, on shelf and sellable
  reserved: number; // USD, allocated to open orders
  backordered: number; // USD, owed to customers, not yet in stock
};

// Already authored in descending order by total (onHand + reserved + backordered) — the order the
// ranked bar renders in. Reconciliation for each row is checked below.
export const ZONES: Zone[] = [
  { id: "fast-pick", name: "Fast-Pick", onHand: 1_240_000, reserved: 180_000, backordered: 40_000 }, // 1,460,000
  { id: "bulk", name: "Bulk Storage", onHand: 980_000, reserved: 120_000, backordered: 25_000 }, // 1,125,000
  { id: "cold-chain", name: "Cold Chain", onHand: 610_000, reserved: 95_000, backordered: 60_000 }, // 765,000
  { id: "cross-dock", name: "Cross-Dock", onHand: 455_000, reserved: 70_000, backordered: 15_000 }, // 540,000
  { id: "returns", name: "Returns", onHand: 310_000, reserved: 40_000, backordered: 85_000 }, // 435,000
  { id: "staging", name: "Staging", onHand: 265_000, reserved: 55_000, backordered: 10_000 }, // 330,000
  { id: "hazmat", name: "Hazmat", onHand: 198_000, reserved: 22_000, backordered: 5_000 }, // 225,000
  { id: "overflow", name: "Overflow", onHand: 142_000, reserved: 18_000, backordered: 8_000 }, // 168,000
];

export function zoneTotal(zone: Zone): number {
  return zone.onHand + zone.reserved + zone.backordered;
}

// Hand-verified: 1,460,000 + 1,125,000 + 765,000 + 540,000 + 435,000 + 330,000 + 225,000 + 168,000
// = 5,048,000. Used to scale each row's bar length against the largest zone.
export const MAX_ZONE_TOTAL = Math.max(...ZONES.map(zoneTotal));

// Hand-verified sums — the headline number is exactly the first of these three.
// onHand:  1,240,000+980,000+610,000+455,000+310,000+265,000+198,000+142,000 = 4,200,000
// reserved:  180,000+120,000+ 95,000+ 70,000+ 40,000+ 55,000+ 22,000+ 18,000 =   600,000
// backordered: 40,000+ 25,000+ 60,000+ 15,000+ 85,000+ 10,000+  5,000+  8,000 =   248,000
export const TOTAL_ON_HAND = ZONES.reduce((sum, z) => sum + z.onHand, 0);
export const TOTAL_RESERVED = ZONES.reduce((sum, z) => sum + z.reserved, 0);
export const TOTAL_BACKORDERED = ZONES.reduce((sum, z) => sum + z.backordered, 0);
export const GRAND_TOTAL = TOTAL_ON_HAND + TOTAL_RESERVED + TOTAL_BACKORDERED; // 5,048,000, matches MAX check above

export const ZONE_BY_ID: Map<ZoneId, Zone> = new Map(ZONES.map((z) => [z.id, z]));

export function fmtUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function fmtUsdCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n);
}

export function fmtNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

// --- Trend window (secondary stats + sparkline under the hero number) -----------------------

export type TrendWindow = "7d" | "30d" | "qtd";

export const TREND_WINDOWS: TrendWindow[] = ["7d", "30d", "qtd"];

export const TREND_WINDOW_LABEL: Record<TrendWindow, string> = {
  "7d": "7D",
  "30d": "30D",
  qtd: "QTD",
};

export type WindowStats = {
  fillRatePct: number;
  fillRateDeltaPt: number; // vs the prior window of the same length, hand-set
  avgDwellDays: number;
  unitsReceived: number;
  sparkline: number[]; // fill-rate trend, oldest first, last value equals fillRatePct
};

export const WINDOW_STATS: Record<TrendWindow, WindowStats> = {
  "7d": {
    fillRatePct: 97.8,
    fillRateDeltaPt: 0.4,
    avgDwellDays: 3.2,
    unitsReceived: 8_400,
    sparkline: [96.9, 97.1, 97.4, 97.0, 98.1, 97.6, 97.8],
  },
  "30d": {
    fillRatePct: 96.4,
    fillRateDeltaPt: -0.3,
    avgDwellDays: 4.1,
    unitsReceived: 34_900,
    sparkline: [95.8, 96.0, 95.5, 96.7, 96.2, 96.4],
  },
  qtd: {
    fillRatePct: 95.1,
    fillRateDeltaPt: 0.2,
    avgDwellDays: 4.6,
    unitsReceived: 96_200,
    sparkline: [94.0, 94.6, 95.3, 94.8, 95.0, 95.1],
  },
};

// --- People -----------------------------------------------------------------------------------

export type Person = {
  id: string;
  name: string;
  role: string;
  photoId: string; // fixed images.unsplash.com photo id
};

export const PEOPLE: Person[] = [
  { id: "mia", name: "Mia Chen", role: "Inventory Lead", photoId: "1494790108377-be9c29b29330" },
  { id: "theo", name: "Theo Narang", role: "Replenishment Analyst", photoId: "1507003211169-0a1dd7228f2d" },
  { id: "priya", name: "Priya Osei", role: "Dock Supervisor", photoId: "1534528741775-53994a69daeb" },
  { id: "jordan", name: "Jordan Blake", role: "Operations Lead", photoId: "1500648767791-00dcc994a43e" },
];

export const PERSON_BY_ID: Map<string, Person> = new Map(PEOPLE.map((p) => [p.id, p]));

// --- Replenishment queue ------------------------------------------------------------------------

export type ReplStatus = "pending" | "in-transit" | "overdue";
export type Priority = "low" | "medium" | "high";

export type ReplTask = {
  id: string;
  zoneName: string;
  sku: string;
  item: string;
  qty: number;
  assigneeId: string;
  status: ReplStatus;
  priority: Priority;
  etaLabel: string; // fixed display string, e.g. "Nov 18"
  etaRank: number; // chronological order, 1 = soonest — avoids parsing etaLabel as a Date
};

// etaRank is unique 1..8 and matches the chronological order of etaLabel below.
export const REPL_TASKS: ReplTask[] = [
  { id: "RPL-1042", zoneName: "Fast-Pick", sku: "SKU-8841", item: "Thermal Shipping Labels", qty: 1200, assigneeId: "mia", status: "pending", priority: "high", etaLabel: "Nov 18", etaRank: 4 },
  { id: "RPL-1041", zoneName: "Cold Chain", sku: "SKU-2217", item: "Chilled Gel Packs", qty: 480, assigneeId: "theo", status: "overdue", priority: "high", etaLabel: "Nov 14", etaRank: 2 },
  { id: "RPL-1040", zoneName: "Bulk Storage", sku: "SKU-5509", item: "Pallet Stretch Wrap", qty: 3000, assigneeId: "priya", status: "in-transit", priority: "medium", etaLabel: "Nov 19", etaRank: 5 },
  { id: "RPL-1039", zoneName: "Returns", sku: "SKU-9102", item: "RMA Intake Boxes", qty: 650, assigneeId: "mia", status: "pending", priority: "low", etaLabel: "Nov 21", etaRank: 7 },
  { id: "RPL-1038", zoneName: "Cross-Dock", sku: "SKU-3387", item: "Shrink Film Rolls", qty: 900, assigneeId: "theo", status: "in-transit", priority: "medium", etaLabel: "Nov 17", etaRank: 3 },
  { id: "RPL-1037", zoneName: "Hazmat", sku: "SKU-7765", item: "Spill Containment Kits", qty: 120, assigneeId: "priya", status: "overdue", priority: "high", etaLabel: "Nov 13", etaRank: 1 },
  { id: "RPL-1036", zoneName: "Staging", sku: "SKU-4420", item: "Carton Sealing Tape", qty: 2100, assigneeId: "mia", status: "pending", priority: "low", etaLabel: "Nov 23", etaRank: 8 },
  { id: "RPL-1035", zoneName: "Overflow", sku: "SKU-6693", item: "Stretch Hood Covers", qty: 540, assigneeId: "theo", status: "in-transit", priority: "medium", etaLabel: "Nov 20", etaRank: 6 },
];

export const REPL_STATUS_LABEL: Record<ReplStatus, string> = {
  pending: "Pending",
  "in-transit": "In Transit",
  overdue: "Overdue",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// --- Recent receipts (read-only companion tab) --------------------------------------------------

export type Receipt = {
  id: string;
  zoneName: string;
  item: string;
  qty: number;
  receivedLabel: string;
  source: string;
};

export const RECEIPTS: Receipt[] = [
  { id: "RCT-7781", zoneName: "Fast-Pick", item: "Thermal Shipping Labels", qty: 2000, receivedLabel: "Nov 12", source: "Norvell Packaging Co." },
  { id: "RCT-7780", zoneName: "Bulk Storage", item: "Pallet Stretch Wrap", qty: 4200, receivedLabel: "Nov 11", source: "Haldor Supply" },
  { id: "RCT-7779", zoneName: "Cold Chain", item: "Chilled Gel Packs", qty: 900, receivedLabel: "Nov 10", source: "Arcticore Logistics" },
  { id: "RCT-7778", zoneName: "Staging", item: "Carton Sealing Tape", qty: 3100, receivedLabel: "Nov 09", source: "Norvell Packaging Co." },
  { id: "RCT-7777", zoneName: "Cross-Dock", item: "Shrink Film Rolls", qty: 1500, receivedLabel: "Nov 08", source: "Haldor Supply" },
];
