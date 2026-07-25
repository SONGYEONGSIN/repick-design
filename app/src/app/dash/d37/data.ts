import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Handshake,
  Layers,
  LayoutGrid,
  LineChart,
  Mail,
  Plug,
  Search,
  Settings,
  Share2,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Waves,
  Workflow,
  Zap,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Deterministic math utils — no Math.random / Date.now / new Date        */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Distributes integer weights (largest-remainder method) — sums exactly to total after rounding (guarantees subtotals = grand total). */
export function distributeInts(total: number, weightsPct: number[]): number[] {
  const raw = weightsPct.map((w) => (total * w) / 100);
  const floors = raw.map((v) => Math.floor(v));
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    out[order[k].i] += 1;
  }
  return out;
}

/* ---------------------------------------------------------------------- */
/* Brand / workspace / user (all fictional — invented, unrelated to any session context) */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Currents", tagline: "Revenue Attribution Flow" };
export { Waves as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "solstice", name: "Solstice Robotics", plan: "Scale · Revenue Ops" },
  { id: "anchorpoint", name: "Anchorpoint Labs", plan: "Growth · Revenue Ops" },
  { id: "sandbox", name: "QA Sandbox", plan: "Internal test" },
];

/** Fictional persona (not session context) — a revenue ops lead who uses Currents. */
export const CURRENT_USER = {
  name: "Dana Whitfield",
  role: "Revenue Operations Lead",
  email: "dana.whitfield@currentshq.io",
  avatarId: "1494790108377-be9c29b29330",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* Navigation                                                              */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid },
      { id: "flow", label: "Revenue Flow", Icon: Workflow, active: true },
      { id: "cohorts", label: "Cohorts", Icon: Users },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "channel-mix", label: "Channel Mix", Icon: BarChart3 },
      { id: "waterfall", label: "Retention Waterfall", Icon: LineChart, badge: "New" },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "integrations", label: "Integrations", Icon: Plug, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* Period                                                                  */
/* ---------------------------------------------------------------------- */

export type PeriodId = "7d" | "30d" | "90d";
export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
];

/** Total new paid accounts per period (hand-authored, deterministic). Every other figure is proportionally distributed from this. */
export const TOTAL_ACCOUNTS: Record<PeriodId, number> = {
  "7d": 540,
  "30d": 2380,
  "90d": 6960,
};

export type MetricId = "customers" | "mrr";
export const METRICS: { id: MetricId; label: string }[] = [
  { id: "customers", label: "Customers" },
  { id: "mrr", label: "New MRR" },
];

/* ---------------------------------------------------------------------- */
/* Stage 1: acquisition channels (5) — weights sum to 100                  */
/* ---------------------------------------------------------------------- */

export type ChannelId = "organic" | "paid_search" | "paid_social" | "partner" | "direct";

export type ChannelMeta = { id: ChannelId; label: string; Icon: LucideIcon; weightPct: number };

export const CHANNELS: ChannelMeta[] = [
  { id: "organic", label: "Organic Search", Icon: Search, weightPct: 28 },
  { id: "paid_search", label: "Paid Search", Icon: Target, weightPct: 21 },
  { id: "paid_social", label: "Paid Social", Icon: Share2, weightPct: 19 },
  { id: "partner", label: "Partner Referral", Icon: Handshake, weightPct: 17 },
  { id: "direct", label: "Direct / Email", Icon: Mail, weightPct: 15 },
];

/* ---------------------------------------------------------------------- */
/* Stage 2: plan tier at signup (4) — fixed ARPU, per-channel distribution weight rows (each row sums to 100) */
/* ---------------------------------------------------------------------- */

export type TierId = "starter" | "growth" | "scale" | "enterprise";

export type TierMeta = { id: TierId; label: string; Icon: LucideIcon; arpu: number };

export const TIERS: TierMeta[] = [
  { id: "starter", label: "Starter", Icon: Zap, arpu: 49 },
  { id: "growth", label: "Growth", Icon: TrendingUp, arpu: 199 },
  { id: "scale", label: "Scale", Icon: Layers, arpu: 499 },
  { id: "enterprise", label: "Enterprise", Icon: Building2, arpu: 1499 },
];

/** Rows = channels (CHANNELS order), columns = tiers (TIERS order). Each row sums to 100. */
const CHANNEL_TO_TIER_WEIGHTS: number[][] = [
  [45, 35, 15, 5], // organic — self-serve, skews low tier
  [30, 40, 22, 8], // paid_search
  [55, 30, 12, 3], // paid_social — cheapest CAC, skews starter
  [10, 25, 35, 30], // partner — enterprise deal desk
  [25, 35, 28, 12], // direct / email
];

/* ---------------------------------------------------------------------- */
/* Stage 3: 90-day outcome (4) — per-tier distribution weight rows (each row sums to 100) */
/* ---------------------------------------------------------------------- */

export type OutcomeId = "retained" | "expanded" | "downgraded" | "churned";

export type OutcomeMeta = { id: OutcomeId; label: string; Icon: LucideIcon };

export const OUTCOMES: OutcomeMeta[] = [
  { id: "retained", label: "Retained", Icon: CheckCircle2 },
  { id: "expanded", label: "Expanded", Icon: TrendingUp },
  { id: "downgraded", label: "Downgraded", Icon: TrendingDown },
  { id: "churned", label: "Churned", Icon: TrendingDown },
];

/** Rows = tiers (TIERS order), columns = outcomes (OUTCOMES order). Each row sums to 100. */
const TIER_TO_OUTCOME_WEIGHTS: number[][] = [
  [48, 8, 10, 34], // starter — high self-serve churn
  [58, 18, 9, 15], // growth
  [60, 26, 6, 8], // scale
  [55, 34, 4, 7], // enterprise — highest expansion
];

/* ---------------------------------------------------------------------- */
/* Flow computation — subtotals = grand total guaranteed (distributeInts does per-row integer distribution) */
/* ---------------------------------------------------------------------- */

export type FlowNode = {
  id: string;
  label: string;
  Icon: LucideIcon;
  col: 0 | 1 | 2;
  customers: number;
  mrr: number;
};

export type FlowLink = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceLabel: string;
  targetLabel: string;
  col: 0 | 1; // 0 = channel→tier, 1 = tier→outcome
  customers: number;
  mrr: number;
  shareOfSourcePct: number;
};

export type FlowGraph = {
  channels: FlowNode[];
  tiers: FlowNode[];
  outcomes: FlowNode[];
  linksChannelTier: FlowLink[];
  linksTierOutcome: FlowLink[];
  totalCustomers: number;
  totalMrr: number;
};

export function computeFlow(period: PeriodId): FlowGraph {
  const totalAccounts = TOTAL_ACCOUNTS[period];
  const channelWeights = CHANNELS.map((c) => c.weightPct);
  const channelCounts = distributeInts(totalAccounts, channelWeights);

  // channel x tier matrix
  const m1: number[][] = channelCounts.map((count, ci) => distributeInts(count, CHANNEL_TO_TIER_WEIGHTS[ci]));

  const tierTotals = TIERS.map((_, ti) => m1.reduce((sum, row) => sum + row[ti], 0));

  // tier x outcome matrix
  const m2: number[][] = tierTotals.map((count, ti) => distributeInts(count, TIER_TO_OUTCOME_WEIGHTS[ti]));

  const outcomeTotals = OUTCOMES.map((_, oi) => m2.reduce((sum, row) => sum + row[oi], 0));

  const channels: FlowNode[] = CHANNELS.map((c, ci) => {
    const mrr = TIERS.reduce((sum, t, ti) => sum + m1[ci][ti] * t.arpu, 0);
    return { id: c.id, label: c.label, Icon: c.Icon, col: 0, customers: channelCounts[ci], mrr };
  });

  const tiers: FlowNode[] = TIERS.map((t, ti) => ({
    id: t.id,
    label: t.label,
    Icon: t.Icon,
    col: 1,
    customers: tierTotals[ti],
    mrr: tierTotals[ti] * t.arpu,
  }));

  const outcomes: FlowNode[] = OUTCOMES.map((o, oi) => {
    const mrr = TIERS.reduce((sum, t, ti) => sum + m2[ti][oi] * t.arpu, 0);
    return { id: o.id, label: o.label, Icon: o.Icon, col: 2, customers: outcomeTotals[oi], mrr };
  });

  const linksChannelTier: FlowLink[] = [];
  CHANNELS.forEach((c, ci) => {
    TIERS.forEach((t, ti) => {
      const customers = m1[ci][ti];
      if (customers <= 0) return;
      linksChannelTier.push({
        id: `${c.id}__${t.id}`,
        sourceId: c.id,
        targetId: t.id,
        sourceLabel: c.label,
        targetLabel: t.label,
        col: 0,
        customers,
        mrr: customers * t.arpu,
        shareOfSourcePct: round2((customers / channelCounts[ci]) * 100),
      });
    });
  });

  const linksTierOutcome: FlowLink[] = [];
  TIERS.forEach((t, ti) => {
    OUTCOMES.forEach((o, oi) => {
      const customers = m2[ti][oi];
      if (customers <= 0) return;
      linksTierOutcome.push({
        id: `${t.id}__${o.id}`,
        sourceId: t.id,
        targetId: o.id,
        sourceLabel: t.label,
        targetLabel: o.label,
        col: 1,
        customers,
        mrr: customers * t.arpu,
        shareOfSourcePct: round2((customers / tierTotals[ti]) * 100),
      });
    });
  });

  const totalCustomers = totalAccounts;
  const totalMrr = channels.reduce((sum, n) => sum + n.mrr, 0);

  return { channels, tiers, outcomes, linksChannelTier, linksTierOutcome, totalCustomers, totalMrr };
}

export function metricValue(node: { customers: number; mrr: number }, metric: MetricId): number {
  return metric === "customers" ? node.customers : node.mrr;
}

/* ---------------------------------------------------------------------- */
/* 12-week new-MRR trend — deterministic series for selected-node detail (no trig, modulo arithmetic) */
/* ---------------------------------------------------------------------- */

function genSeries(seed: number, base: number, amp: number, n = 12): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const wobble = ((seed + i * 17) % 13) - 6; // -6..6
    const drift = (i - (n - 1) / 2) * (amp / n);
    out.push(round2(clamp(base + wobble * (amp / 12) + drift, 0, base * 2.4)));
  }
  return out;
}

const SEED_TABLE: Record<string, number> = {};
let seedCursor = 5;
function seedFor(id: string): number {
  if (!(id in SEED_TABLE)) {
    seedCursor += 17;
    SEED_TABLE[id] = seedCursor;
  }
  return SEED_TABLE[id];
}

export function nodeTrend(nodeId: string, baseValue: number): { label: string; value: number }[] {
  const seed = seedFor(nodeId);
  const amp = Math.max(baseValue * 0.18, 2);
  const vals = genSeries(seed, baseValue, amp);
  return vals.map((v, i) => ({ label: `W${i + 1}`, value: v }));
}

/* ---------------------------------------------------------------------- */
/* Intl formatters                                                        */
/* ---------------------------------------------------------------------- */

const NUM0 = new Intl.NumberFormat("en-US");
const PCT1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const USD0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function formatCount(v: number): string {
  return NUM0.format(v);
}
export function formatPct(v: number): string {
  return `${PCT1.format(v)}%`;
}
export function formatUsd(v: number): string {
  return USD0.format(v);
}
export function formatMetric(v: number, metric: MetricId): string {
  return metric === "customers" ? `${formatCount(v)} accts` : formatUsd(v);
}

/* Dev-time self-check: verifies channel/tier distribution weight rows all sum to 100 (a precondition for subtotals = grand total). */
export const _WEIGHTS_OK =
  CHANNELS.reduce((a, c) => a + c.weightPct, 0) === 100 &&
  CHANNEL_TO_TIER_WEIGHTS.every((row) => row.reduce((a, b) => a + b, 0) === 100) &&
  TIER_TO_OUTCOME_WEIGHTS.every((row) => row.reduce((a, b) => a + b, 0) === 100);
