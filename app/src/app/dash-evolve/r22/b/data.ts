// Nodeline — service dependency graph console.
// All figures below are hand-authored and deterministic (no Math.random/Date.now anywhere in this
// candidate). Node coordinates sit on a fixed four-tier layout — this is NOT a force simulation run
// at request time; the (x, y) pairs are pre-computed once and just rendered, so hydration always
// produces the same SVG on server and client.

export type ServiceStatus = "healthy" | "degraded" | "critical";

export interface ServiceNode {
  id: string;
  label: string;
  tier: 0 | 1 | 2 | 3;
  x: number;
  y: number;
  /** p99 latency, milliseconds */
  latencyMs: number;
  /** error rate, percent (0-100) */
  errorRatePct: number;
  /** last 6 latency samples (ms), oldest first — deterministic, hand-authored */
  latencyTrend: number[];
}

export interface ServiceEdge {
  source: string;
  target: string;
  callsPerMin: number;
}

// Fixed deterministic layout: four call-flow tiers, left to right.
export const TIER_X = [70, 350, 630, 900] as const;
export const TIER_LABEL = ["Entry", "Core services", "Domain services", "Data & messaging"] as const;
export const GRAPH_VIEWBOX = { width: 980, height: 620 };
export const NODE_RADIUS = 20;

export const NODES: ServiceNode[] = [
  { id: "web-gateway", label: "web-gateway", tier: 0, x: 70, y: 90, latencyMs: 42, errorRatePct: 0.12, latencyTrend: [39, 41, 38, 44, 40, 42] },
  { id: "mobile-gateway", label: "mobile-gateway", tier: 0, x: 70, y: 280, latencyMs: 58, errorRatePct: 0.31, latencyTrend: [52, 55, 60, 57, 61, 58] },
  { id: "partner-api", label: "partner-api", tier: 0, x: 70, y: 470, latencyMs: 130, errorRatePct: 1.8, latencyTrend: [95, 102, 118, 125, 140, 130] },

  { id: "auth-service", label: "auth-service", tier: 1, x: 350, y: 50, latencyMs: 24, errorRatePct: 0.05, latencyTrend: [22, 23, 25, 24, 26, 24] },
  { id: "user-service", label: "user-service", tier: 1, x: 350, y: 175, latencyMs: 31, errorRatePct: 0.09, latencyTrend: [29, 30, 33, 31, 32, 31] },
  { id: "billing-service", label: "billing-service", tier: 1, x: 350, y: 300, latencyMs: 88, errorRatePct: 0.42, latencyTrend: [80, 84, 90, 86, 92, 88] },
  { id: "search-service", label: "search-service", tier: 1, x: 350, y: 425, latencyMs: 210, errorRatePct: 2.4, latencyTrend: [150, 168, 185, 196, 204, 210] },
  { id: "notify-service", label: "notify-service", tier: 1, x: 350, y: 550, latencyMs: 45, errorRatePct: 0.6, latencyTrend: [40, 43, 47, 44, 46, 45] },

  { id: "payments-service", label: "payments-service", tier: 2, x: 630, y: 130, latencyMs: 340, errorRatePct: 4.9, latencyTrend: [220, 255, 280, 305, 322, 340] },
  { id: "inventory-service", label: "inventory-service", tier: 2, x: 630, y: 300, latencyMs: 62, errorRatePct: 0.28, latencyTrend: [58, 60, 64, 61, 63, 62] },
  { id: "recommend-engine", label: "recommend-engine", tier: 2, x: 630, y: 470, latencyMs: 275, errorRatePct: 3.1, latencyTrend: [200, 220, 240, 258, 266, 275] },

  { id: "postgres-primary", label: "postgres-primary", tier: 3, x: 900, y: 110, latencyMs: 8, errorRatePct: 0.02, latencyTrend: [7, 8, 9, 8, 8, 8] },
  { id: "redis-cache", label: "redis-cache", tier: 3, x: 900, y: 280, latencyMs: 2, errorRatePct: 0.01, latencyTrend: [2, 2, 3, 2, 2, 2] },
  { id: "kafka-bus", label: "kafka-bus", tier: 3, x: 900, y: 450, latencyMs: 14, errorRatePct: 0.15, latencyTrend: [12, 13, 15, 14, 13, 14] },
];

export const EDGES: ServiceEdge[] = [
  { source: "web-gateway", target: "auth-service", callsPerMin: 4200 },
  { source: "web-gateway", target: "user-service", callsPerMin: 3800 },
  { source: "web-gateway", target: "billing-service", callsPerMin: 1200 },
  { source: "web-gateway", target: "search-service", callsPerMin: 2600 },
  { source: "mobile-gateway", target: "auth-service", callsPerMin: 3100 },
  { source: "mobile-gateway", target: "user-service", callsPerMin: 2900 },
  { source: "mobile-gateway", target: "notify-service", callsPerMin: 900 },
  { source: "partner-api", target: "billing-service", callsPerMin: 700 },
  { source: "partner-api", target: "inventory-service", callsPerMin: 500 },
  { source: "auth-service", target: "postgres-primary", callsPerMin: 5600 },
  { source: "auth-service", target: "redis-cache", callsPerMin: 7200 },
  { source: "user-service", target: "postgres-primary", callsPerMin: 4100 },
  { source: "user-service", target: "redis-cache", callsPerMin: 3300 },
  { source: "billing-service", target: "payments-service", callsPerMin: 1500 },
  { source: "billing-service", target: "postgres-primary", callsPerMin: 1400 },
  { source: "search-service", target: "recommend-engine", callsPerMin: 1800 },
  { source: "search-service", target: "redis-cache", callsPerMin: 2200 },
  { source: "notify-service", target: "kafka-bus", callsPerMin: 900 },
  { source: "payments-service", target: "postgres-primary", callsPerMin: 1500 },
  { source: "payments-service", target: "kafka-bus", callsPerMin: 1500 },
  { source: "inventory-service", target: "postgres-primary", callsPerMin: 500 },
  { source: "inventory-service", target: "redis-cache", callsPerMin: 500 },
  { source: "recommend-engine", target: "redis-cache", callsPerMin: 1800 },
  { source: "recommend-engine", target: "kafka-bus", callsPerMin: 600 },
];

const STATUS_ORDER: Record<ServiceStatus, number> = { healthy: 0, degraded: 1, critical: 2 };
export function worseStatus(a: ServiceStatus, b: ServiceStatus): ServiceStatus {
  return STATUS_ORDER[a] >= STATUS_ORDER[b] ? a : b;
}

export function latencyStatus(ms: number): ServiceStatus {
  if (ms >= 250) return "critical";
  if (ms >= 100) return "degraded";
  return "healthy";
}
export function errorStatus(pct: number): ServiceStatus {
  if (pct >= 3.5) return "critical";
  if (pct >= 1) return "degraded";
  return "healthy";
}

/** Canonical status (worse of the two metrics) — used everywhere EXCEPT the graph's own node
 *  fill, which follows the live latency/error encoding toggle instead. Edges, the adjacency table
 *  and the KPI strip all read this one number so a toggle flip never disturbs them. */
export function canonicalStatus(node: ServiceNode): ServiceStatus {
  return worseStatus(latencyStatus(node.latencyMs), errorStatus(node.errorRatePct));
}

export function statusForEncoding(node: ServiceNode, encoding: "latency" | "error"): ServiceStatus {
  return encoding === "latency" ? latencyStatus(node.latencyMs) : errorStatus(node.errorRatePct);
}

const nodeById = new Map(NODES.map((n) => [n.id, n]));
export function getNode(id: string): ServiceNode | undefined {
  return nodeById.get(id);
}

/** Distinct callers into a node (in-degree). */
export function upstreamCount(id: string): number {
  return new Set(EDGES.filter((e) => e.target === id).map((e) => e.source)).size;
}
/** Distinct callees a node reaches (out-degree). */
export function downstreamCount(id: string): number {
  return new Set(EDGES.filter((e) => e.source === id).map((e) => e.target)).size;
}
export function trafficIn(id: string): number {
  return EDGES.filter((e) => e.target === id).reduce((sum, e) => sum + e.callsPerMin, 0);
}
export function trafficOut(id: string): number {
  return EDGES.filter((e) => e.source === id).reduce((sum, e) => sum + e.callsPerMin, 0);
}
/** Requests/min shown in the inspector: incoming traffic where it exists, else what the service
 *  itself initiates (true for the three entry-tier nodes, which have no callers in this graph). */
export function primaryTraffic(id: string): number {
  const inbound = trafficIn(id);
  return inbound > 0 ? inbound : trafficOut(id);
}

export const TOTAL_CALLS_PER_MIN = EDGES.reduce((sum, e) => sum + e.callsPerMin, 0);
export const AT_RISK_COUNT = NODES.filter((n) => canonicalStatus(n) !== "healthy").length;
export const MEDIAN_P99_MS = (() => {
  const sorted = [...NODES.map((n) => n.latencyMs)].sort((a, b) => a - b);
  const mid = sorted.length / 2;
  return Math.round(sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]);
})();

export const intFormat = new Intl.NumberFormat("en-US");
export const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

/** Round a computed coordinate to 2 decimal places (hydration-safe formatting for any generated SVG geometry). */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
