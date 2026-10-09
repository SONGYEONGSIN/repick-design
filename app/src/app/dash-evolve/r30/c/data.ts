import {
  Globe,
  Server,
  Cog,
  Database,
  CircleCheck,
  TriangleAlert,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";

/**
 * Meshline — service dependency topology for a fictional commerce platform.
 *
 * Every figure below is a fixed literal or a value derived from fixed literals (weighted
 * averages, min/max scales, rank comparisons). Nothing reads `Math.random()`, `Date.now()`, or
 * bare `new Date()`, so server and client renders are byte-identical. Sparkline series are
 * generated from a pure sine function of the node's index and its own error rate — deterministic,
 * not random — and every coordinate that reaches an SVG is rounded to 2 decimals before render.
 */

// ---- Domain model -----------------------------------------------------------

export type Tier = "edge" | "service" | "worker" | "store";
export type Domain = "platform" | "identity" | "commerce" | "trust" | "growth" | "data";
export type HealthStatus = "healthy" | "degraded" | "critical";

export interface ServiceNode {
  id: string;
  label: string; // short name rendered on the graph node
  fullName: string; // canonical slug shown in the table / palette / tooltip
  tier: Tier;
  domain: Domain;
  errorRatePct: number;
  rps: number;
  p99Ms: number;
  saturationPct: number;
  note: string;
}

export interface RawEdge {
  id: string;
  from: string;
  to: string;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

export const TIER_LABEL: Record<Tier, string> = {
  edge: "Edge",
  service: "Service",
  worker: "Worker",
  store: "Data store",
};

export const TIER_ICON: Record<Tier, LucideIcon> = {
  edge: Globe,
  service: Server,
  worker: Cog,
  store: Database,
};

export const DOMAIN_LABEL: Record<Domain, string> = {
  platform: "Platform",
  identity: "Identity",
  commerce: "Commerce",
  trust: "Trust & Safety",
  growth: "Growth",
  data: "Data",
};

export const DOMAIN_ONCALL: Record<Domain, string> = {
  platform: "Denise Okafor",
  identity: "Marcus Lindqvist",
  commerce: "Priya Nair",
  trust: "Sana Al-Rashid",
  growth: "Tomas Vidal",
  data: "Elin Novak",
};

export interface StatusMeta {
  label: string;
  icon: LucideIcon;
  text: string; // text color on light/white surfaces
  textTint: string; // text color on the status's own tinted surface
  bg: string;
  border: string;
  dot: string;
  stroke: string; // svg node stroke class
  edgeStroke: string; // svg edge stroke class
  edgeDash?: string;
}

export const STATUS_META: Record<HealthStatus, StatusMeta> = {
  healthy: {
    label: "Healthy",
    icon: CircleCheck,
    text: "text-emerald-700",
    textTint: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    edgeStroke: "stroke-emerald-400",
  },
  degraded: {
    label: "Degraded",
    icon: TriangleAlert,
    text: "text-amber-700",
    textTint: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    stroke: "stroke-amber-500",
    edgeStroke: "stroke-amber-500",
    edgeDash: "7 5",
  },
  critical: {
    label: "Critical",
    icon: OctagonAlert,
    text: "text-rose-700",
    textTint: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
    stroke: "stroke-rose-500",
    edgeStroke: "stroke-rose-500",
    edgeDash: "2 4",
  },
};

export function statusFor(errorRatePct: number): HealthStatus {
  if (errorRatePct >= 4) return "critical";
  if (errorRatePct >= 1.2) return "degraded";
  return "healthy";
}

const STATUS_RANK: Record<HealthStatus, number> = { healthy: 0, degraded: 1, critical: 2 };
const RANK_STATUS: HealthStatus[] = ["healthy", "degraded", "critical"];

// ---- Nodes --------------------------------------------------------------------

export const NODES: ServiceNode[] = [
  { id: "api-gateway", label: "Gateway", fullName: "api-gateway", tier: "edge", domain: "platform", errorRatePct: 0.4, rps: 4200, p99Ms: 88, saturationPct: 42, note: "Fronts all public traffic; rate-limited at 6,000 req/s." },
  { id: "cdn-edge", label: "CDN Edge", fullName: "cdn-edge", tier: "edge", domain: "platform", errorRatePct: 0.1, rps: 9800, p99Ms: 22, saturationPct: 18, note: "204 edge points of presence; cache hit ratio 94%." },
  { id: "auth-service", label: "Auth", fullName: "auth-service", tier: "service", domain: "identity", errorRatePct: 0.6, rps: 3100, p99Ms: 64, saturationPct: 55, note: "Issues and verifies session tokens for every request." },
  { id: "session-cache", label: "Session Cache", fullName: "session-cache", tier: "store", domain: "identity", errorRatePct: 0.1, rps: 5200, p99Ms: 4, saturationPct: 71, note: "Redis cluster, 3 shards, 12ms replication lag." },
  { id: "user-service", label: "Users", fullName: "user-service", tier: "service", domain: "identity", errorRatePct: 0.5, rps: 2600, p99Ms: 71, saturationPct: 38, note: "Owns profile, address book, and preference data." },
  { id: "catalog-service", label: "Catalog", fullName: "catalog-service", tier: "service", domain: "commerce", errorRatePct: 0.7, rps: 1900, p99Ms: 58, saturationPct: 33, note: "Serves 420,000 active SKUs across 38 categories." },
  { id: "search-service", label: "Search", fullName: "search-service", tier: "service", domain: "commerce", errorRatePct: 0.9, rps: 1550, p99Ms: 112, saturationPct: 61, note: "Reindexes the full catalog every 15 minutes." },
  { id: "recommendation-service", label: "Recommender", fullName: "recommendation-service", tier: "service", domain: "growth", errorRatePct: 1.8, rps: 640, p99Ms: 340, saturationPct: 82, note: "Cold-start model refresh is running behind schedule." },
  { id: "pricing-service", label: "Pricing", fullName: "pricing-service", tier: "service", domain: "commerce", errorRatePct: 0.3, rps: 980, p99Ms: 47, saturationPct: 29, note: "Applies regional tax and promo rules per SKU." },
  { id: "inventory-service", label: "Inventory", fullName: "inventory-service", tier: "service", domain: "commerce", errorRatePct: 0.4, rps: 870, p99Ms: 66, saturationPct: 36, note: "Tracks stock across 14 fulfillment centers." },
  { id: "orders-service", label: "Orders", fullName: "orders-service", tier: "service", domain: "commerce", errorRatePct: 0.8, rps: 1240, p99Ms: 132, saturationPct: 58, note: "Orchestrates checkout across five downstream services." },
  { id: "payments-service", label: "Payments", fullName: "payments-service", tier: "service", domain: "commerce", errorRatePct: 2.1, rps: 1180, p99Ms: 158, saturationPct: 66, note: "Elevated latency traced to the fraud-check dependency." },
  { id: "fraud-service", label: "Fraud Check", fullName: "fraud-service", tier: "service", domain: "trust", errorRatePct: 6.8, rps: 1180, p99Ms: 410, saturationPct: 91, note: "Model server saturated; on-call paged 14 minutes ago." },
  { id: "billing-service", label: "Billing", fullName: "billing-service", tier: "service", domain: "commerce", errorRatePct: 0.5, rps: 610, p99Ms: 74, saturationPct: 24, note: "Generates invoices and manages subscription renewals." },
  { id: "shipping-service", label: "Shipping", fullName: "shipping-service", tier: "service", domain: "commerce", errorRatePct: 0.6, rps: 540, p99Ms: 90, saturationPct: 27, note: "Rates and books labels across four carriers." },
  { id: "notification-service", label: "Notifications", fullName: "notification-service", tier: "worker", domain: "growth", errorRatePct: 0.4, rps: 720, p99Ms: 55, saturationPct: 31, note: "Fans out order and shipping updates to push and SMS." },
  { id: "email-worker", label: "Email Worker", fullName: "email-worker", tier: "worker", domain: "growth", errorRatePct: 0.7, rps: 480, p99Ms: 210, saturationPct: 44, note: "Queue depth is within normal range." },
  { id: "analytics-service", label: "Analytics", fullName: "analytics-service", tier: "worker", domain: "data", errorRatePct: 1.1, rps: 2100, p99Ms: 640, saturationPct: 87, note: "Batch aggregation window is backed up by 6 minutes." },
  { id: "events-queue", label: "Event Queue", fullName: "events-queue", tier: "store", domain: "platform", errorRatePct: 0.2, rps: 2600, p99Ms: 18, saturationPct: 63, note: "Kafka cluster, 9 partitions, replication factor 3." },
  { id: "primary-db", label: "Primary DB", fullName: "primary-db", tier: "store", domain: "platform", errorRatePct: 2.4, rps: 3400, p99Ms: 96, saturationPct: 79, note: "Connection pool is nearing its configured ceiling." },
];

export const NODE_BY_ID = new Map(NODES.map((n) => [n.id, n]));

// ---- Edges ----------------------------------------------------------------------

const RAW_EDGES: RawEdge[] = [
  { id: "e1", from: "cdn-edge", to: "api-gateway" },
  { id: "e2", from: "api-gateway", to: "auth-service" },
  { id: "e3", from: "api-gateway", to: "user-service" },
  { id: "e4", from: "api-gateway", to: "catalog-service" },
  { id: "e5", from: "api-gateway", to: "search-service" },
  { id: "e6", from: "api-gateway", to: "orders-service" },
  { id: "e7", from: "api-gateway", to: "pricing-service" },
  { id: "e8", from: "auth-service", to: "session-cache" },
  { id: "e9", from: "auth-service", to: "user-service" },
  { id: "e10", from: "auth-service", to: "primary-db" },
  { id: "e11", from: "user-service", to: "primary-db" },
  { id: "e12", from: "user-service", to: "events-queue" },
  { id: "e13", from: "catalog-service", to: "primary-db" },
  { id: "e14", from: "catalog-service", to: "search-service" },
  { id: "e15", from: "search-service", to: "recommendation-service" },
  { id: "e16", from: "pricing-service", to: "catalog-service" },
  { id: "e17", from: "inventory-service", to: "primary-db" },
  { id: "e18", from: "orders-service", to: "inventory-service" },
  { id: "e19", from: "orders-service", to: "payments-service" },
  { id: "e20", from: "orders-service", to: "pricing-service" },
  { id: "e21", from: "orders-service", to: "primary-db" },
  { id: "e22", from: "orders-service", to: "shipping-service" },
  { id: "e23", from: "orders-service", to: "events-queue" },
  { id: "e24", from: "payments-service", to: "fraud-service" },
  { id: "e25", from: "payments-service", to: "billing-service" },
  { id: "e26", from: "payments-service", to: "primary-db" },
  { id: "e27", from: "billing-service", to: "primary-db" },
  { id: "e28", from: "shipping-service", to: "notification-service" },
  { id: "e29", from: "notification-service", to: "email-worker" },
  { id: "e30", from: "events-queue", to: "analytics-service" },
  { id: "e31", from: "recommendation-service", to: "analytics-service" },
  { id: "e32", from: "fraud-service", to: "analytics-service" },
];

export interface DependencyEdge extends RawEdge {
  status: HealthStatus;
  weightRps: number;
  strokeWidth: number;
}

const rawWeights = RAW_EDGES.map((e) => {
  const from = NODE_BY_ID.get(e.from)!;
  const to = NODE_BY_ID.get(e.to)!;
  return Math.round(Math.min(from.rps, to.rps) * 0.35);
});
const minWeight = Math.min(...rawWeights);
const maxWeight = Math.max(...rawWeights);

export const EDGES: DependencyEdge[] = RAW_EDGES.map((e, i) => {
  const from = NODE_BY_ID.get(e.from)!;
  const to = NODE_BY_ID.get(e.to)!;
  const fromStatus = statusFor(from.errorRatePct);
  const toStatus = statusFor(to.errorRatePct);
  const status = RANK_STATUS[Math.max(STATUS_RANK[fromStatus], STATUS_RANK[toStatus])];
  const weightRps = rawWeights[i];
  const span = maxWeight - minWeight || 1;
  const strokeWidth = round2(1.6 + ((weightRps - minWeight) / span) * 2.8);
  return { ...e, status, weightRps, strokeWidth };
});

export const EDGE_BY_ID = new Map(EDGES.map((e) => [e.id, e]));

// ---- Layout (fixed, recomputed only when the grouping key changes) --------------

export type GroupBy = "tier" | "domain";

export interface NodePosition {
  x: number;
  y: number;
}

export interface LayoutGroup {
  key: string;
  label: string;
  x: number;
}

export interface GraphLayout {
  positions: Record<string, NodePosition>;
  vbW: number;
  vbH: number;
  groups: LayoutGroup[];
}

export const NODE_W = 176;
export const NODE_H = 64;
const COL_GAP = 88;
const ROW_GAP = 24;
const PAD_X = 56;
const PAD_Y = 44;

const TIER_ORDER: Tier[] = ["edge", "service", "worker", "store"];
const DOMAIN_ORDER: Domain[] = ["platform", "identity", "commerce", "trust", "growth", "data"];

export function computeLayout(groupBy: GroupBy): GraphLayout {
  const order: string[] = groupBy === "tier" ? TIER_ORDER : DOMAIN_ORDER;
  const labelOf = (key: string) => (groupBy === "tier" ? TIER_LABEL[key as Tier] : DOMAIN_LABEL[key as Domain]);
  const buckets = new Map<string, ServiceNode[]>();
  for (const key of order) buckets.set(key, []);
  for (const n of NODES) {
    const key = groupBy === "tier" ? n.tier : n.domain;
    buckets.get(key)?.push(n);
  }

  const colWidth = NODE_W + COL_GAP;
  const rowPitch = NODE_H + ROW_GAP;
  const maxRows = Math.max(...order.map((k) => buckets.get(k)!.length));
  const vbW = round2(PAD_X * 2 + order.length * colWidth - COL_GAP);
  const vbH = round2(PAD_Y * 2 + maxRows * rowPitch - ROW_GAP);

  const positions: Record<string, NodePosition> = {};
  const groups: LayoutGroup[] = [];

  order.forEach((key, gi) => {
    const items = buckets.get(key)!;
    const x = round2(PAD_X + gi * colWidth);
    groups.push({ key, label: labelOf(key), x });
    const groupHeight = items.length * rowPitch - ROW_GAP;
    const yOffset = (vbH - PAD_Y * 2 - groupHeight) / 2;
    items.forEach((n, ni) => {
      const y = round2(PAD_Y + yOffset + ni * rowPitch);
      positions[n.id] = { x, y };
    });
  });

  return { positions, vbW, vbH, groups };
}

// ---- Derived summary totals (always reduced from NODES/EDGES, never hardcoded) --

export const TOTALS = {
  serviceCount: NODES.length,
  totalRps: NODES.reduce((sum, n) => sum + n.rps, 0),
  avgErrorRatePct: round2(
    NODES.reduce((sum, n) => sum + n.errorRatePct * n.rps, 0) / NODES.reduce((sum, n) => sum + n.rps, 0),
  ),
  avgP99Ms: Math.round(NODES.reduce((sum, n) => sum + n.p99Ms, 0) / NODES.length),
  degradedCount: NODES.filter((n) => statusFor(n.errorRatePct) === "degraded").length,
  criticalCount: NODES.filter((n) => statusFor(n.errorRatePct) === "critical").length,
  edgeCount: EDGES.length,
};

// ---- Formatters -------------------------------------------------------------

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(n);
}

export function formatRps(n: number): string {
  return `${countFmt.format(n)} req/s`;
}

export function formatPercent(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

export function formatMs(n: number): string {
  return `${countFmt.format(n)} ms`;
}

/**
 * Manual compact-number formatter — deliberately not `Intl.NumberFormat({ notation: "compact" })`,
 * whose trailing-zero behavior depends on the ICU version bundled with the runtime and differs
 * between Node (SSR) and the browser, which can produce a server/client hydration mismatch on the
 * exact same input. Dividing and rounding by hand removes ICU as a variable entirely.
 */
export function formatCompact(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs < 1000) return `${sign}${Math.round(abs)}`;
  const unit = abs < 1_000_000 ? 1000 : 1_000_000;
  const suffix = abs < 1_000_000 ? "K" : "M";
  const rounded = Math.round((abs / unit) * 10) / 10;
  const digits = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${sign}${digits}${suffix}`;
}

/** Deterministic 8-point trend series ending exactly on the node's current error rate. */
export function errorTrendSeries(node: ServiceNode, index: number): number[] {
  const amplitude = Math.max(0.15, node.errorRatePct * 0.32);
  const phase = index * 0.63;
  const values: number[] = [];
  for (let t = 0; t < 7; t++) {
    const v = Math.max(0.05, node.errorRatePct + amplitude * Math.sin(phase + t * 0.9));
    values.push(round2(v));
  }
  values.push(round2(node.errorRatePct));
  return values;
}

// ---- CSV export ---------------------------------------------------------------

function csvEscape(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function nodesToCsv(nodes: ServiceNode[]): string {
  const header = ["Service", "Tier", "Domain", "Status", "Error rate %", "Throughput req/s", "p99 latency ms", "Saturation %", "On-call"];
  const rows = nodes.map((n) => [
    n.fullName,
    TIER_LABEL[n.tier],
    DOMAIN_LABEL[n.domain],
    STATUS_META[statusFor(n.errorRatePct)].label,
    n.errorRatePct,
    n.rps,
    n.p99Ms,
    n.saturationPct,
    DOMAIN_ONCALL[n.domain],
  ]);
  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

// ---- Shared style tokens --------------------------------------------------------

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500";

export { round1, round2 };
