import {
  GitCompareArrows,
  LayoutGrid,
  Package,
  Settings,
  Warehouse as WarehouseIcon,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { LineStatus } from "./tokens";

export const BRAND = { name: "Parity", Icon: GitCompareArrows };

export const WORKSPACES = [
  { id: "seoul", name: "Repick Seoul Ops", plan: "Reconciliation · Growth" },
  { id: "busan", name: "Repick Busan Ops", plan: "Reconciliation · Standard" },
];

export const CURRENT_USER = {
  name: "Dana Okafor",
  role: "Reconciliation Lead",
  email: "dana.okafor@repick.io",
  avatarId: "1500648767791-00dcc994a43e",
};

type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "main",
    title: "Console",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid },
      { id: "reconciliation", label: "Reconciliation", Icon: GitCompareArrows, active: true },
      { id: "payouts", label: "Payouts", Icon: Wallet },
      { id: "listings", label: "Listings", Icon: Package },
    ],
  },
  {
    id: "ops",
    title: "Operations",
    items: [
      { id: "warehouses", label: "Warehouses", Icon: WarehouseIcon },
      { id: "automations", label: "Automations", Icon: Workflow, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

export type Reviewer = { name: string; avatarId: string };
const REVIEWERS: Record<string, Reviewer> = {
  noa: { name: "Noa Lindqvist", avatarId: "1494790108377-be9c29b29330" },
  jonah: { name: "Jonah Ade", avatarId: "1519345182560-3f2917c472ef" },
  priya: { name: "Priya Nair", avatarId: "1544723795-3fb6469f5b39" },
};

export type Category = "Outerwear" | "Footwear" | "Bags" | "Accessories" | "Denim" | "Knitwear";
export type Warehouse = "SEL-01" | "SEL-03" | "BUS-02" | "INC-01";

export type ScanEvent = { hoursAgo: number; units: number };

export type ReconLine = {
  id: string;
  sku: string;
  title: string;
  category: Category;
  warehouse: Warehouse;
  expected: number;
  scanned: number;
  unitValue: number;
  status: LineStatus;
  confidence: number;
  reviewer: Reviewer;
  lastScanHoursAgo: number;
};

/** Deterministic 50/30/20 split of a scanned total into three "most recent first" scan events —
 *  never Math.random: the split ratio is a fixed constant, only the input (scanned) varies. */
function scanTrail(scanned: number, lastScanHoursAgo: number): ScanEvent[] {
  const recent = Math.round(scanned * 0.2);
  const mid = Math.round(scanned * 0.3);
  const old = scanned - recent - mid;
  return [
    { hoursAgo: lastScanHoursAgo, units: recent },
    { hoursAgo: lastScanHoursAgo + 8, units: mid },
    { hoursAgo: lastScanHoursAgo + 19, units: old },
  ];
}

type RawLine = Omit<ReconLine, "reviewer"> & { reviewer: keyof typeof REVIEWERS };

/** Status is authored per line, not derived from variance sign/magnitude — a small variance can
 *  sit in "reviewing" regardless of direction, while "missing"/"overcount" mark lines ops has
 *  already confirmed as a real shortage or surplus. Confidence is the model's own certainty in
 *  that read, independent of how the status was assigned. */
const RAW_LINES: RawLine[] = [
  { id: "l01", sku: "RPK-10234", title: "Cropped Wool Coat", category: "Outerwear", warehouse: "SEL-01", expected: 42, scanned: 42, unitValue: 68, status: "matched", confidence: 99, reviewer: "noa", lastScanHoursAgo: 2 },
  { id: "l02", sku: "RPK-10298", title: "Canvas Tote Bag", category: "Bags", warehouse: "SEL-01", expected: 88, scanned: 88, unitValue: 22, status: "matched", confidence: 98, reviewer: "jonah", lastScanHoursAgo: 5 },
  { id: "l03", sku: "RPK-10355", title: "Straight Leg Jeans", category: "Denim", warehouse: "BUS-02", expected: 61, scanned: 61, unitValue: 34, status: "matched", confidence: 100, reviewer: "noa", lastScanHoursAgo: 1 },
  { id: "l04", sku: "RPK-10402", title: "Merino Crewneck", category: "Knitwear", warehouse: "SEL-03", expected: 53, scanned: 53, unitValue: 41, status: "matched", confidence: 97, reviewer: "priya", lastScanHoursAgo: 3 },
  { id: "l05", sku: "RPK-10460", title: "Leather Ankle Boots", category: "Footwear", warehouse: "INC-01", expected: 24, scanned: 24, unitValue: 76, status: "matched", confidence: 99, reviewer: "jonah", lastScanHoursAgo: 6 },
  { id: "l06", sku: "RPK-10517", title: "Gold Hoop Earrings", category: "Accessories", warehouse: "SEL-01", expected: 130, scanned: 130, unitValue: 14, status: "matched", confidence: 96, reviewer: "priya", lastScanHoursAgo: 9 },
  { id: "l07", sku: "RPK-10574", title: "Belted Trench Coat", category: "Outerwear", warehouse: "SEL-03", expected: 19, scanned: 19, unitValue: 92, status: "matched", confidence: 100, reviewer: "noa", lastScanHoursAgo: 4 },
  { id: "l08", sku: "RPK-10631", title: "Suede Crossbody Bag", category: "Bags", warehouse: "BUS-02", expected: 46, scanned: 46, unitValue: 58, status: "matched", confidence: 98, reviewer: "jonah", lastScanHoursAgo: 7 },
  { id: "l09", sku: "RPK-10688", title: "Selvedge Denim Jacket", category: "Denim", warehouse: "SEL-01", expected: 33, scanned: 33, unitValue: 84, status: "matched", confidence: 99, reviewer: "priya", lastScanHoursAgo: 2 },
  { id: "l10", sku: "RPK-10745", title: "Cable Knit Cardigan", category: "Knitwear", warehouse: "INC-01", expected: 27, scanned: 27, unitValue: 55, status: "matched", confidence: 97, reviewer: "noa", lastScanHoursAgo: 8 },
  { id: "l11", sku: "RPK-10802", title: "Running Sneakers", category: "Footwear", warehouse: "SEL-03", expected: 71, scanned: 71, unitValue: 48, status: "matched", confidence: 100, reviewer: "jonah", lastScanHoursAgo: 5 },
  { id: "l12", sku: "RPK-10859", title: "Silk Scarf", category: "Accessories", warehouse: "SEL-01", expected: 95, scanned: 95, unitValue: 19, status: "matched", confidence: 96, reviewer: "priya", lastScanHoursAgo: 11 },
  { id: "l13", sku: "RPK-10916", title: "Puffer Vest", category: "Outerwear", warehouse: "BUS-02", expected: 38, scanned: 38, unitValue: 63, status: "matched", confidence: 99, reviewer: "noa", lastScanHoursAgo: 3 },
  { id: "l14", sku: "RPK-10973", title: "Structured Tote", category: "Bags", warehouse: "SEL-03", expected: 29, scanned: 29, unitValue: 71, status: "matched", confidence: 98, reviewer: "jonah", lastScanHoursAgo: 6 },
  { id: "l15", sku: "RPK-11030", title: "Wide Leg Trousers", category: "Denim", warehouse: "SEL-01", expected: 54, scanned: 51, unitValue: 39, status: "reviewing", confidence: 74, reviewer: "priya", lastScanHoursAgo: 1 },
  { id: "l16", sku: "RPK-11087", title: "Chunky Leather Loafers", category: "Footwear", warehouse: "INC-01", expected: 22, scanned: 24, unitValue: 82, status: "reviewing", confidence: 68, reviewer: "noa", lastScanHoursAgo: 2 },
  { id: "l17", sku: "RPK-11144", title: "Ribbed Turtleneck", category: "Knitwear", warehouse: "SEL-03", expected: 46, scanned: 44, unitValue: 45, status: "reviewing", confidence: 81, reviewer: "jonah", lastScanHoursAgo: 4 },
  { id: "l18", sku: "RPK-11201", title: "Statement Necklace", category: "Accessories", warehouse: "BUS-02", expected: 64, scanned: 67, unitValue: 26, status: "reviewing", confidence: 71, reviewer: "priya", lastScanHoursAgo: 3 },
  { id: "l19", sku: "RPK-11258", title: "Shearling Collar Coat", category: "Outerwear", warehouse: "SEL-01", expected: 17, scanned: 15, unitValue: 110, status: "reviewing", confidence: 63, reviewer: "noa", lastScanHoursAgo: 5 },
  { id: "l20", sku: "RPK-11315", title: "Woven Straw Clutch", category: "Bags", warehouse: "SEL-03", expected: 39, scanned: 37, unitValue: 48, status: "reviewing", confidence: 77, reviewer: "jonah", lastScanHoursAgo: 9 },
  { id: "l21", sku: "RPK-11372", title: "Vintage Leather Jacket", category: "Outerwear", warehouse: "INC-01", expected: 12, scanned: 7, unitValue: 145, status: "missing", confidence: 38, reviewer: "priya", lastScanHoursAgo: 14 },
  { id: "l22", sku: "RPK-11429", title: "Raw Selvedge Denim Jeans", category: "Denim", warehouse: "SEL-01", expected: 28, scanned: 21, unitValue: 58, status: "missing", confidence: 41, reviewer: "noa", lastScanHoursAgo: 18 },
  { id: "l23", sku: "RPK-11486", title: "Platform Sandals", category: "Footwear", warehouse: "SEL-03", expected: 35, scanned: 29, unitValue: 52, status: "missing", confidence: 47, reviewer: "jonah", lastScanHoursAgo: 22 },
  { id: "l24", sku: "RPK-11543", title: "Cashmere V-Neck Sweater", category: "Knitwear", warehouse: "BUS-02", expected: 20, scanned: 14, unitValue: 96, status: "missing", confidence: 33, reviewer: "priya", lastScanHoursAgo: 26 },
  { id: "l25", sku: "RPK-11600", title: "Quilted Nylon Backpack", category: "Bags", warehouse: "SEL-01", expected: 31, scanned: 36, unitValue: 66, status: "overcount", confidence: 58, reviewer: "noa", lastScanHoursAgo: 12 },
  { id: "l26", sku: "RPK-11657", title: "Beaded Bracelet Set", category: "Accessories", warehouse: "SEL-03", expected: 88, scanned: 94, unitValue: 12, status: "overcount", confidence: 62, reviewer: "jonah", lastScanHoursAgo: 16 },
];

export const RECON_LINES: ReconLine[] = RAW_LINES.map((row) => ({ ...row, reviewer: REVIEWERS[row.reviewer] }));

export function varianceOf(line: ReconLine): number {
  return line.scanned - line.expected;
}

export function valueImpactOf(line: ReconLine): number {
  return varianceOf(line) * line.unitValue;
}

export function scanTrailOf(line: ReconLine): ScanEvent[] {
  return scanTrail(line.scanned, line.lastScanHoursAgo);
}

export const WAREHOUSES: Warehouse[] = ["SEL-01", "SEL-03", "BUS-02", "INC-01"];
export type WarehouseFilter = "all" | Warehouse;
export type StatusFilter = "all" | LineStatus;

/** Single source of truth for "which lines are visible right now" — used both to render the grid
 *  and, in the client shell, to test whether a pinned line has fallen outside the current filter
 *  (the pinned tray needs that answer without re-deriving the filter logic itself). */
export function filterLines(lines: ReconLine[], opts: { status: StatusFilter; warehouse: WarehouseFilter; search: string }): ReconLine[] {
  const q = opts.search.trim().toLowerCase();
  return lines.filter((l) => {
    if (opts.status !== "all" && l.status !== opts.status) return false;
    if (opts.warehouse !== "all" && l.warehouse !== opts.warehouse) return false;
    if (q.length > 0) {
      const hay = `${l.sku} ${l.title} ${l.category} ${l.warehouse}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const TOTAL_LINES = RECON_LINES.length;
export const MATCHED_COUNT = RECON_LINES.filter((l) => l.status === "matched").length;
export const FLAGGED_COUNT = TOTAL_LINES - MATCHED_COUNT;
export const MATCH_RATE = MATCHED_COUNT / TOTAL_LINES;
export const MATCH_RATE_TREND = [0.42, 0.46, 0.49, 0.51, 0.5, 0.53, MATCH_RATE];
export const NET_VALUE = RECON_LINES.reduce((sum, l) => sum + valueImpactOf(l), 0);
export const LAST_SYNC_HOURS = Math.min(...RECON_LINES.map((l) => l.lastScanHoursAgo));

export type Period = "today" | "7d" | "30d";

export const TREND_SERIES: Record<Period, { labels: string[]; values: number[] }> = {
  today: {
    labels: ["9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p"],
    values: [-320, -540, -780, -1120, -1360, -1590, -1740, -1898],
  },
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [-3120, -2760, -2340, -2600, -2010, -2150, -1898],
  },
  "30d": {
    labels: ["W-30", "W-27", "W-24", "W-21", "W-18", "W-15", "W-12", "W-9", "W-6", "Today"],
    values: [-4820, -4210, -3960, -4400, -3580, -3110, -2870, -2340, -2150, -1898],
  },
};

export const NOTIFICATIONS = [
  { id: "n1", text: "RPK-11372 dropped below 40% match confidence", time: "18m ago" },
  { id: "n2", text: "Priya Nair cleared 3 reviewing lines in BUS-02", time: "41m ago" },
  { id: "n3", text: "Weekly reconciliation digest is ready", time: "2h ago" },
];

export const SEARCH_ENTRIES = RECON_LINES.map((l) => ({
  id: l.id,
  title: l.title,
  meta: `${l.sku} · ${l.warehouse}`,
  Icon: Package,
}));

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPct(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(n);
}

export function formatHoursAgo(h: number): string {
  if (h < 24) return `${formatInt(h)}h ago`;
  return `${formatInt(Math.round(h / 24))}d ago`;
}
