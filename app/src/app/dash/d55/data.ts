import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Landmark,
  PieChart,
  Receipt,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "./tokens";

export const BRAND = { name: "Ledgerline", Icon: Landmark };

export const CURRENT_USER = {
  name: "Priya Anand",
  role: "Payments operations lead",
  email: "priya.anand@ledgerline.io",
  avatarId: "1519244703995-f4e0f30006d5",
};

export const WORKSPACES = [
  { id: "platform", name: "Ledgerline Platform", plan: "14 merchant accounts" },
  { id: "na", name: "North America pod", plan: "5 accounts" },
  { id: "intl", name: "International pod", plan: "9 accounts" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "ledger", label: "Ledger", Icon: Receipt, active: true },
      { id: "payouts", label: "Payouts", Icon: Landmark },
      { id: "disputes", label: "Disputes", Icon: ShieldAlert },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "revenue-mix", label: "Revenue mix", Icon: PieChart },
      { id: "reports", label: "Reports", Icon: BarChart3, disabled: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Merchant accounts — the single source of truth. Both the ledger feed (who did
// what) and the revenue-mix hierarchy (region > channel > plan tier) are derived
// from this one list, so a region's total in the sunburst is always the literal
// sum of its accounts' volume — subtotals cannot drift from the total.
// ---------------------------------------------------------------------------

export type Region = "North America" | "EMEA" | "APAC" | "LatAm";
export type Channel = "Self-serve" | "Sales-assisted" | "Partner";
export type Tier = "Starter" | "Growth" | "Scale";

export interface Account {
  id: string;
  name: string;
  region: Region;
  channel: Channel;
  tier: Tier;
  monthlyVolume: number;
}

const AVATAR_IDS = [
  "1552664730-d307ca884978",
  "1547425260-76bcadfb4f2c",
  "1544005313-94ddf0286df2",
  "1123897727-8f129e1688ce",
  "1553062407-98eeb64c6a62",
  "1543076447-215ad9ba6923",
  "1560243563-062bfc001d68",
  "1494790108377-be9c29b29330",
];

export const ACCOUNTS: Account[] = [
  { id: "harbor", name: "Harbor Analytics", region: "North America", channel: "Self-serve", tier: "Starter", monthlyVolume: 2100 },
  { id: "fernbridge", name: "Fernbridge Retail", region: "North America", channel: "Self-serve", tier: "Growth", monthlyVolume: 5200 },
  { id: "anchor", name: "Anchor Systems", region: "North America", channel: "Sales-assisted", tier: "Growth", monthlyVolume: 14800 },
  { id: "meridian", name: "Meridian Freight", region: "North America", channel: "Sales-assisted", tier: "Scale", monthlyVolume: 38600 },
  { id: "northwind", name: "Northwind Logistics", region: "North America", channel: "Partner", tier: "Scale", monthlyVolume: 26400 },
  { id: "solstice", name: "Solstice Studio", region: "EMEA", channel: "Self-serve", tier: "Starter", monthlyVolume: 1800 },
  { id: "bluecrest", name: "Bluecrest Retail", region: "EMEA", channel: "Sales-assisted", tier: "Growth", monthlyVolume: 11200 },
  { id: "vertex", name: "Vertex Manufacturing", region: "EMEA", channel: "Sales-assisted", tier: "Scale", monthlyVolume: 31200 },
  { id: "loomis", name: "Loomis Health", region: "EMEA", channel: "Partner", tier: "Growth", monthlyVolume: 9600 },
  { id: "kaida", name: "Kaida Analytics", region: "APAC", channel: "Self-serve", tier: "Starter", monthlyVolume: 1600 },
  { id: "foundry", name: "Foundry Robotics", region: "APAC", channel: "Self-serve", tier: "Growth", monthlyVolume: 6400 },
  { id: "atlas", name: "Atlas Components", region: "APAC", channel: "Sales-assisted", tier: "Scale", monthlyVolume: 21800 },
  { id: "tsuki", name: "Tsuki Commerce", region: "APAC", channel: "Partner", tier: "Growth", monthlyVolume: 8200 },
  { id: "cerrado", name: "Cerrado Foods", region: "LatAm", channel: "Self-serve", tier: "Starter", monthlyVolume: 1400 },
  { id: "amistad", name: "Amistad Freight", region: "LatAm", channel: "Sales-assisted", tier: "Growth", monthlyVolume: 7600 },
];

export function accountAvatar(accountId: string): string {
  const idx = ACCOUNTS.findIndex((a) => a.id === accountId);
  return AVATAR_IDS[idx % AVATAR_IDS.length];
}

export const TOTAL_VOLUME = ACCOUNTS.reduce((sum, a) => sum + a.monthlyVolume, 0);

export function accountById(id: string): Account | undefined {
  return ACCOUNTS.find((a) => a.id === id);
}

// ---------------------------------------------------------------------------
// Revenue-mix hierarchy: region > channel > tier. Built once, at module load,
// by folding the account list — never hand-authored, so a leaf's value and its
// ancestors' values can never fall out of sync with the accounts above.
// ---------------------------------------------------------------------------

export interface RevNode {
  id: string;
  label: string;
  value: number;
  depth: 0 | 1 | 2 | 3;
  path: string[]; // ids from root (exclusive) to this node (inclusive)
  children?: RevNode[];
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function buildRevenueTree(accounts: Account[]): RevNode {
  const regions: RevNode[] = [];
  for (const region of Array.from(new Set(accounts.map((a) => a.region)))) {
    const regionAccounts = accounts.filter((a) => a.region === region);
    const channels: RevNode[] = [];
    for (const channel of Array.from(new Set(regionAccounts.map((a) => a.channel)))) {
      const channelAccounts = regionAccounts.filter((a) => a.channel === channel);
      const tiers: RevNode[] = [];
      for (const tier of Array.from(new Set(channelAccounts.map((a) => a.tier)))) {
        const tierAccounts = channelAccounts.filter((a) => a.tier === tier);
        const value = tierAccounts.reduce((s, a) => s + a.monthlyVolume, 0);
        const id = `${slug(region)}/${slug(channel)}/${slug(tier)}`;
        tiers.push({ id, label: tier, value, depth: 3, path: [slug(region), `${slug(region)}/${slug(channel)}`, id] });
      }
      const value = tiers.reduce((s, t) => s + t.value, 0);
      const id = `${slug(region)}/${slug(channel)}`;
      channels.push({ id, label: channel, value, depth: 2, path: [slug(region), id], children: tiers });
    }
    const value = channels.reduce((s, c) => s + c.value, 0);
    const id = slug(region);
    regions.push({ id, label: region, value, depth: 1, path: [id], children: channels });
  }
  const value = regions.reduce((s, r) => s + r.value, 0);
  return { id: "root", label: "All merchants", value, depth: 0, path: [], children: regions };
}

export const REVENUE_TREE = buildRevenueTree(ACCOUNTS);

const NODE_INDEX = new Map<string, RevNode>();
(function indexTree(node: RevNode) {
  NODE_INDEX.set(node.id, node);
  node.children?.forEach(indexTree);
})(REVENUE_TREE);

export function nodeById(id: string): RevNode | undefined {
  return NODE_INDEX.get(id);
}

export function nodeAtPath(path: string[]): RevNode {
  if (path.length === 0) return REVENUE_TREE;
  return nodeById(path[path.length - 1]) ?? REVENUE_TREE;
}

export function pctOfTotal(value: number): number {
  return (value / TOTAL_VOLUME) * 100;
}

export function pctOfParent(value: number, parentValue: number): number {
  if (parentValue <= 0) return 0;
  return (value / parentValue) * 100;
}

// ---------------------------------------------------------------------------
// Ledger events — the central feed. Independent of the revenue-mix hierarchy
// above on purpose (see LedgerFeed / RevenueBreakdown wiring comments).
// ---------------------------------------------------------------------------

export type EventType = "charge" | "refund" | "payout" | "dispute";
export type EventStatus = "succeeded" | "failed" | "issued" | "initiated" | "completed" | "opened" | "lost" | "won";

export interface LedgerEvent {
  id: string;
  type: EventType;
  status: EventStatus;
  accountId: string;
  amount: number;
  description: string;
  timeShort: string; // compact, e.g. "2m" — never wraps in a narrow cell
  timeFull: string; // for the accessible name, e.g. "2 minutes ago"
}

export const EVENTS: LedgerEvent[] = [
  { id: "e1", type: "charge", status: "succeeded", accountId: "anchor", amount: 4820, description: "Card payment", timeShort: "2m", timeFull: "2 minutes ago" },
  { id: "e2", type: "dispute", status: "opened", accountId: "vertex", amount: 1240, description: "Chargeback filed", timeShort: "6m", timeFull: "6 minutes ago" },
  { id: "e3", type: "payout", status: "initiated", accountId: "northwind", amount: 18900, description: "Weekly payout", timeShort: "11m", timeFull: "11 minutes ago" },
  { id: "e4", type: "refund", status: "issued", accountId: "foundry", amount: 340, description: "Partial refund", timeShort: "18m", timeFull: "18 minutes ago" },
  { id: "e5", type: "charge", status: "succeeded", accountId: "meridian", amount: 9600, description: "Invoice #4821 paid", timeShort: "24m", timeFull: "24 minutes ago" },
  { id: "e6", type: "charge", status: "succeeded", accountId: "bluecrest", amount: 2150, description: "Card payment", timeShort: "31m", timeFull: "31 minutes ago" },
  { id: "e7", type: "charge", status: "failed", accountId: "kaida", amount: 180, description: "Card declined", timeShort: "38m", timeFull: "38 minutes ago" },
  { id: "e8", type: "payout", status: "completed", accountId: "atlas", amount: 12400, description: "Monthly payout", timeShort: "47m", timeFull: "47 minutes ago" },
  { id: "e9", type: "charge", status: "succeeded", accountId: "tsuki", amount: 1980, description: "Invoice #4819 paid", timeShort: "52m", timeFull: "52 minutes ago" },
  { id: "e10", type: "dispute", status: "lost", accountId: "solstice", amount: 260, description: "Chargeback lost", timeShort: "1h", timeFull: "1 hour ago" },
  { id: "e11", type: "refund", status: "issued", accountId: "amistad", amount: 410, description: "Full refund", timeShort: "1h", timeFull: "1 hour ago" },
  { id: "e12", type: "charge", status: "succeeded", accountId: "loomis", amount: 3320, description: "Card payment", timeShort: "2h", timeFull: "2 hours ago" },
  { id: "e13", type: "charge", status: "succeeded", accountId: "harbor", amount: 860, description: "Invoice #4790 paid", timeShort: "2h", timeFull: "2 hours ago" },
  { id: "e14", type: "payout", status: "initiated", accountId: "cerrado", amount: 640, description: "Weekly payout", timeShort: "3h", timeFull: "3 hours ago" },
  { id: "e15", type: "charge", status: "succeeded", accountId: "fernbridge", amount: 2760, description: "Card payment", timeShort: "3h", timeFull: "3 hours ago" },
  { id: "e16", type: "dispute", status: "won", accountId: "anchor", amount: 980, description: "Chargeback won", timeShort: "4h", timeFull: "4 hours ago" },
  { id: "e17", type: "charge", status: "succeeded", accountId: "vertex", amount: 7140, description: "Invoice #4771 paid", timeShort: "5h", timeFull: "5 hours ago" },
  { id: "e18", type: "refund", status: "issued", accountId: "northwind", amount: 520, description: "Partial refund", timeShort: "6h", timeFull: "6 hours ago" },
];

export const EVENT_TYPE_META: Record<EventType, { label: string; plural: string }> = {
  charge: { label: "Charge", plural: "Charges" },
  refund: { label: "Refund", plural: "Refunds" },
  payout: { label: "Payout", plural: "Payouts" },
  dispute: { label: "Dispute", plural: "Disputes" },
};

export const EVENT_STATUS_META: Record<string, { label: string; tone: Tone; Icon: LucideIcon }> = {
  "charge-succeeded": { label: "Succeeded", tone: "positive", Icon: CheckCircle2 },
  "charge-failed": { label: "Failed", tone: "negative", Icon: XCircle },
  "refund-issued": { label: "Issued", tone: "warning", Icon: RotateCcw },
  "payout-initiated": { label: "Initiated", tone: "neutral", Icon: Clock },
  "payout-completed": { label: "Completed", tone: "positive", Icon: CheckCircle2 },
  "dispute-opened": { label: "Opened", tone: "warning", Icon: AlertTriangle },
  "dispute-lost": { label: "Lost", tone: "negative", Icon: XCircle },
  "dispute-won": { label: "Won", tone: "positive", Icon: ShieldCheck },
};

export function eventStatusKey(e: LedgerEvent): string {
  return `${e.type}-${e.status}`;
}

// ---------------------------------------------------------------------------
// Period-scoped hero KPIs — hard-coded per period rather than derived from the
// 18-row demo feed (a real console reads these off a warehouse rollup with a
// much longer window than the visible feed sample; keeping them independent
// numbers here avoids implying the feed itself is the KPI's source data).
// ---------------------------------------------------------------------------

export type PeriodId = "today" | "7d" | "30d";
export const PERIOD_OPTIONS: { id: PeriodId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
];

export const PERIOD_KPI: Record<PeriodId, { netVolume: number; takeRatePct: number; refundRatePct: number }> = {
  today: { netVolume: 42800, takeRatePct: 2.9, refundRatePct: 0.6 },
  "7d": { netVolume: 268400, takeRatePct: 2.7, refundRatePct: 0.8 },
  "30d": { netVolume: 1142600, takeRatePct: 2.6, refundRatePct: 0.9 },
};

// ---------------------------------------------------------------------------
// Platform health rail (left auxiliary panel) — static ops metrics, deliberately
// unrelated to any selection on the page.
// ---------------------------------------------------------------------------

export const PAYOUT_BACKLOG_CLEARED_PCT = 82;
export const API_LATENCY_P95_MS = [148, 152, 141, 163, 157, 149, 138];

export const SEARCH_ENTRIES = ACCOUNTS.map((a) => ({
  id: a.id,
  title: a.name,
  meta: `${a.region} · ${a.tier}`,
  Icon: Building2,
}));

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
