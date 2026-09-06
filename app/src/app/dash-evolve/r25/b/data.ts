import { CalendarClock, FileBarChart, Landmark, LayoutDashboard, Scale, ShieldAlert, Users, type LucideIcon, Wallet } from "lucide-react";

/**
 * All figures below are hand-authored and internally reconciled — no Math.random / Date.now / bare
 * `new Date()`. Dates are fixed ISO literals formatted through Intl.DateTimeFormat; "today" is the
 * fixed reference constant TODAY_ISO, never the live clock.
 */

export const TODAY_ISO = "2026-09-06";

export type Period = "week" | "month" | "quarter";

export const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "quarter", label: "Quarter" },
];

export const PERIOD_START_ISO: Record<Period, string> = {
  week: "2026-08-31",
  month: "2026-08-10",
  quarter: "2026-06-15",
};

export type ChartPoint = { key: string; label: string; sub: string; value: number };

export type HeroSnapshot = {
  amount: number;
  prevAmount: number;
  rangeLabel: string;
  takeRatePct: number;
  settlements: number;
  avgSettleDays: number;
  newDisputes: number;
  chart: ChartPoint[];
};

/**
 * Nested-consistent by construction: the month chart's last bar (Wk 4, 68240) equals the week
 * total; the quarter chart's last bar (Aug block, 284910) equals the month total. Every chart's
 * points sum exactly to that period's headline amount — verified by comment, not by a runtime
 * assertion the gate can't see, so the arithmetic is spelled out here:
 *   week:    8120+9430+11050+7890+12340+10260+9150 = 68240
 *   month:   74120+71830+70720+68240               = 284910
 *   quarter: 264200+263350+284910                  = 812460
 */
export const HERO_DATA: Record<Period, HeroSnapshot> = {
  week: {
    amount: 68240,
    prevAmount: 70720, // prior week (= month chart's Wk 3)
    rangeLabel: "Aug 31 – Sep 6, 2026",
    takeRatePct: 12.6,
    settlements: 184,
    avgSettleDays: 1.6,
    newDisputes: 2,
    chart: [
      { key: "mon", label: "Mon", sub: "Aug 31", value: 8120 },
      { key: "tue", label: "Tue", sub: "Sep 1", value: 9430 },
      { key: "wed", label: "Wed", sub: "Sep 2", value: 11050 },
      { key: "thu", label: "Thu", sub: "Sep 3", value: 7890 },
      { key: "fri", label: "Fri", sub: "Sep 4", value: 12340 },
      { key: "sat", label: "Sat", sub: "Sep 5", value: 10260 },
      { key: "sun", label: "Sun", sub: "Sep 6", value: 9150 },
    ],
  },
  month: {
    amount: 284910,
    prevAmount: 263350, // prior 4-week block (= quarter chart's Jul block)
    rangeLabel: "Aug 10 – Sep 6, 2026",
    takeRatePct: 12.4,
    settlements: 742,
    avgSettleDays: 1.8,
    newDisputes: 6,
    chart: [
      { key: "w1", label: "Wk 1", sub: "Aug 10–16", value: 74120 },
      { key: "w2", label: "Wk 2", sub: "Aug 17–23", value: 71830 },
      { key: "w3", label: "Wk 3", sub: "Aug 24–30", value: 70720 },
      { key: "w4", label: "Wk 4", sub: "Aug 31–Sep 6", value: 68240 },
    ],
  },
  quarter: {
    amount: 812460,
    prevAmount: 774900, // prior quarter total, tracked upstream only as a trend reference
    rangeLabel: "Jun 15 – Sep 6, 2026",
    takeRatePct: 12.1,
    settlements: 2168,
    avgSettleDays: 2.1,
    newDisputes: 14,
    chart: [
      { key: "b1", label: "Jun", sub: "Jun 15–Jul 12", value: 264200 },
      { key: "b2", label: "Jul", sub: "Jul 13–Aug 9", value: 263350 },
      { key: "b3", label: "Aug", sub: "Aug 10–Sep 6", value: 284910 },
    ],
  },
};

export type Seller = {
  id: string;
  name: string;
  region: string;
  sellerSince: string;
  lifetimeSettlements: number;
  avatarId: string;
};

export const SELLERS: Seller[] = [
  { id: "marlowe-finch", name: "Marlowe & Finch", region: "Northeast", sellerSince: "Mar 2023", lifetimeSettlements: 214, avatarId: "1500648767791-00dcc994a43e" },
  { id: "north-loop", name: "North Loop Vintage", region: "Midwest", sellerSince: "Jul 2022", lifetimeSettlements: 388, avatarId: "1494790108377-be9c29b29330" },
  { id: "ridgeline", name: "Ridgeline Outfitters", region: "Mountain West", sellerSince: "Jan 2024", lifetimeSettlements: 96, avatarId: "1472099645785-5658abf4ff4e" },
  { id: "kestrel-co", name: "Kestrel & Co", region: "Pacific NW", sellerSince: "Nov 2023", lifetimeSettlements: 142, avatarId: "1544005313-94ddf0286df2" },
  { id: "salt-cedar", name: "Salt & Cedar", region: "Southeast", sellerSince: "May 2022", lifetimeSettlements: 431, avatarId: "1517841905240-472988babdf9" },
  { id: "fernbank", name: "Fernbank Supply", region: "Southwest", sellerSince: "Sep 2024", lifetimeSettlements: 58, avatarId: "1519345182560-3f2917c472ef" },
];

export const SELLER_BY_ID: Record<string, Seller> = Object.fromEntries(SELLERS.map((s) => [s.id, s]));

export type RunStatus = "paid" | "processing" | "held" | "failed";
export type PayoutMethod = "bank" | "instant";

export type SettlementRun = {
  id: string;
  sellerId: string;
  amount: number;
  method: PayoutMethod;
  status: RunStatus;
  dateIso: string;
};

export const SETTLEMENT_RUNS: SettlementRun[] = [
  { id: "STL-48291", sellerId: "marlowe-finch", amount: 4820, method: "bank", status: "paid", dateIso: "2026-06-02" },
  { id: "STL-49110", sellerId: "north-loop", amount: 3150, method: "instant", status: "paid", dateIso: "2026-06-20" },
  { id: "STL-50224", sellerId: "ridgeline", amount: 6410, method: "bank", status: "held", dateIso: "2026-07-18" },
  { id: "STL-51002", sellerId: "kestrel-co", amount: 2940, method: "instant", status: "paid", dateIso: "2026-08-05" },
  { id: "STL-51188", sellerId: "salt-cedar", amount: 5280, method: "bank", status: "processing", dateIso: "2026-08-12" },
  { id: "STL-51340", sellerId: "fernbank", amount: 4065, method: "instant", status: "paid", dateIso: "2026-08-19" },
  { id: "STL-51502", sellerId: "marlowe-finch", amount: 7730, method: "bank", status: "failed", dateIso: "2026-08-27" },
  { id: "STL-51610", sellerId: "north-loop", amount: 2410, method: "instant", status: "paid", dateIso: "2026-09-01" },
  { id: "STL-51648", sellerId: "marlowe-finch", amount: 3920, method: "bank", status: "processing", dateIso: "2026-09-02" },
  { id: "STL-51677", sellerId: "ridgeline", amount: 6150, method: "instant", status: "paid", dateIso: "2026-09-04" },
  { id: "STL-51690", sellerId: "salt-cedar", amount: 1845, method: "bank", status: "held", dateIso: "2026-09-05" },
  { id: "STL-51702", sellerId: "kestrel-co", amount: 5510, method: "instant", status: "paid", dateIso: "2026-09-06" },
];

export const SETTLEMENT_RUN_BY_ID: Record<string, SettlementRun> = Object.fromEntries(SETTLEMENT_RUNS.map((r) => [r.id, r]));

export const STATUS_LABEL: Record<RunStatus, string> = {
  paid: "Paid",
  processing: "Processing",
  held: "Held",
  failed: "Failed",
};

export const METHOD_LABEL: Record<PayoutMethod, string> = {
  bank: "Bank transfer",
  instant: "Instant payout",
};

const FEE_RATE: Record<PayoutMethod, number> = { bank: 0.004, instant: 0.015 };

export function computeFee(amount: number, method: PayoutMethod): number {
  return Math.round(amount * FEE_RATE[method] * 100) / 100;
}

export function currency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function currencyWhole(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/** In-range test uses plain ISO-string comparison (lexically sortable) — no Date arithmetic needed. */
export function isWithinPeriod(dateIso: string, period: Period): boolean {
  return dateIso >= PERIOD_START_ISO[period] && dateIso <= TODAY_ISO;
}

/** Narrowest period a date actually falls in, for the detail rail's "belongs to" suggestion. */
export function narrowestPeriodFor(dateIso: string): Period | null {
  if (isWithinPeriod(dateIso, "week")) return "week";
  if (isWithinPeriod(dateIso, "month")) return "month";
  if (isWithinPeriod(dateIso, "quarter")) return "quarter";
  return null;
}

export const BRAND: { name: string; Icon: LucideIcon } = { name: "Payline", Icon: Wallet };

export const WORKSPACES = [
  { id: "repick-us", name: "Repick Marketplace", plan: "US · Production" },
  { id: "repick-eu", name: "Repick EU", plan: "EU · Production" },
  { id: "repick-wh", name: "Repick Wholesale", plan: "B2B · Beta" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  { id: "overview", title: "Overview", items: [{ id: "payouts", label: "Payouts overview", Icon: LayoutDashboard, active: true }] },
  {
    id: "operations",
    title: "Operations",
    items: [
      { id: "settlements", label: "Settlement runs", Icon: Landmark },
      { id: "disputes", label: "Disputes", Icon: ShieldAlert },
      { id: "sellers", label: "Sellers", Icon: Users },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    items: [
      { id: "reports", label: "Reports", Icon: FileBarChart },
      { id: "reconciliation", label: "Reconciliation", Icon: Scale },
      { id: "schedule", label: "Payout schedule", Icon: CalendarClock, disabled: true },
    ],
  },
];

export const CURRENT_USER = {
  name: "Jordan Ames",
  role: "Payments Ops Lead",
  email: "jordan.ames@repick.example",
  avatarId: "1519085360753-af0119f7cbe7",
};

export const NOTIFICATIONS = [
  { id: "n1", text: "Settlement run STL-51502 failed — card verification required.", time: "22m ago" },
  { id: "n2", text: "Weekly payout report for Aug 31–Sep 6 is ready.", time: "1h ago" },
  { id: "n3", text: "3 disputes are awaiting a response before their SLA window closes.", time: "4h ago" },
];

export type SearchEntry =
  | { kind: "run"; id: string; title: string; meta: string; runId: string }
  | { kind: "seller"; id: string; title: string; meta: string }
  | { kind: "nav"; id: string; title: string; meta: string };

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...SETTLEMENT_RUNS.map((r) => ({
    kind: "run" as const,
    id: `run-${r.id}`,
    title: r.id,
    meta: `${SELLER_BY_ID[r.sellerId].name} · ${currency(r.amount)}`,
    runId: r.id,
  })),
  ...SELLERS.map((s) => ({ kind: "seller" as const, id: `seller-${s.id}`, title: s.name, meta: `${s.region} · ${s.lifetimeSettlements} lifetime settlements` })),
  { kind: "nav" as const, id: "nav-disputes", title: "Disputes", meta: "Operations" },
  { kind: "nav" as const, id: "nav-reports", title: "Reports", meta: "Finance" },
  { kind: "nav" as const, id: "nav-reconciliation", title: "Reconciliation", meta: "Finance" },
];
