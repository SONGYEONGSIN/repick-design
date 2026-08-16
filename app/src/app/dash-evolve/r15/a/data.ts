/**
 * Nodal — deterministic dummy data for the Service Topology Console.
 * No Math.random / Date.now / new Date() anywhere. Every derived number (health counts, platform
 * P99, latency/error trend sparklines, the mesh request-rate history) is computed at module load by
 * reducing/mapping over the fixed NODES/EDGES arrays below with plain arithmetic (and, where a wave
 * shape is wanted, Math.sin/Math.cos on a fixed index — never wall-clock or RNG), so totals always
 * agree with their parts by construction and every render (server or client) produces byte-identical
 * output.
 */

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, BookOpen, Boxes, Rocket, Settings, Waypoints } from "lucide-react";
import type { Health } from "./tokens";

/* --------------------------------------------------------------- Brand */

export const BRAND = { name: "Nodal", tagline: "Service Topology Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-prod", name: "Meridian Retail — Production", plan: "Enterprise plan" },
  { id: "ws-staging", name: "Meridian Retail — Staging", plan: "Team plan" },
];

/** Fictional persona — never real session/account data. */
export const CURRENT_USER = {
  name: "Priya Kessler",
  role: "Platform Reliability Engineer",
  email: "priya.kessler@nodal.io",
  avatarId: "1580489944761-15a19d654956",
};

/* -------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "observability",
    title: "Observability",
    items: [
      { id: "topology", label: "Topology", Icon: Waypoints, active: true },
      { id: "incidents", label: "Incidents", Icon: AlertTriangle, disabled: true },
      { id: "deployments", label: "Deployments", Icon: Rocket, disabled: true },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    items: [
      { id: "catalog", label: "Service catalog", Icon: Boxes, disabled: true },
      { id: "runbooks", label: "Runbooks", Icon: BookOpen, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings, disabled: true },
    ],
  },
];

export type NotificationItem = { id: string; text: string; time: string };

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", text: "Redis Cache — critical incident opened (memory pressure, 6 dependents affected)", time: "2m ago" },
  { id: "n2", text: "Checkout Service — P99 latency crossed the 400ms SLO threshold", time: "18m ago" },
  { id: "n3", text: "Payments Service — degraded dependency to Postgres Primary auto-resolved", time: "1h ago" },
];

/* -------------------------------------------------------------- Topology */

export type Tier = "edge" | "core" | "support" | "data";
export const TIER_ORDER: Tier[] = ["edge", "core", "support", "data"];
export const TIER_LABEL: Record<Tier, string> = { edge: "Edge", core: "Core services", support: "Support services", data: "Data layer" };

/** Coordinate system for the generative graph canvas — plain layered (Sugiyama-style) layout, one
 *  fixed row per tier, nodes spread evenly across the row. All values are exact integers from simple
 *  arithmetic (no trig needed for a layered grid), so there is nothing to round for hydration safety. */
export const CANVAS_W = 1120;
export const CANVAS_H = 520;

export type NodeId =
  | "api-gateway"
  | "cdn-edge"
  | "auth-service"
  | "catalog-service"
  | "cart-service"
  | "checkout-service"
  | "search-service"
  | "payments-service"
  | "inventory-service"
  | "notification-service"
  | "recommendation-engine"
  | "postgres-primary"
  | "redis-cache"
  | "message-queue"
  | "object-storage";

export type TopoNode = {
  id: NodeId;
  label: string;
  short: string;
  tier: Tier;
  owner: string;
  version: string;
  uptimePct: number;
  p99Ms: number;
  errorRatePct: number;
  rps: number;
  health: Health;
  x: number;
  y: number;
};

export const NODES: TopoNode[] = [
  { id: "api-gateway", label: "API Gateway", short: "Gateway", tier: "edge", owner: "Edge Platform", version: "v4.12.0", uptimePct: 99.98, p99Ms: 58, errorRatePct: 0.08, rps: 3120, health: "healthy", x: 310, y: 70 },
  { id: "cdn-edge", label: "CDN Edge", short: "CDN", tier: "edge", owner: "Edge Platform", version: "v2.3.1", uptimePct: 99.99, p99Ms: 24, errorRatePct: 0.02, rps: 8600, health: "healthy", x: 810, y: 70 },
  { id: "auth-service", label: "Auth Service", short: "Auth", tier: "core", owner: "Identity", version: "v3.6.2", uptimePct: 99.95, p99Ms: 46, errorRatePct: 0.06, rps: 1180, health: "healthy", x: 160, y: 190 },
  { id: "catalog-service", label: "Catalog Service", short: "Catalog", tier: "core", owner: "Commerce Platform", version: "v5.1.0", uptimePct: 99.93, p99Ms: 52, errorRatePct: 0.09, rps: 2040, health: "healthy", x: 360, y: 190 },
  { id: "cart-service", label: "Cart Service", short: "Cart", tier: "core", owner: "Commerce Platform", version: "v3.9.4", uptimePct: 99.9, p99Ms: 61, errorRatePct: 0.12, rps: 1460, health: "healthy", x: 560, y: 190 },
  { id: "checkout-service", label: "Checkout Service", short: "Checkout", tier: "core", owner: "Commerce Platform", version: "v6.2.3", uptimePct: 99.71, p99Ms: 412, errorRatePct: 2.4, rps: 640, health: "degraded", x: 760, y: 190 },
  { id: "search-service", label: "Search Service", short: "Search", tier: "core", owner: "Discovery", version: "v2.8.0", uptimePct: 99.94, p99Ms: 71, errorRatePct: 0.14, rps: 980, health: "healthy", x: 960, y: 190 },
  { id: "payments-service", label: "Payments Service", short: "Payments", tier: "support", owner: "Payments", version: "v7.0.1", uptimePct: 99.82, p99Ms: 398, errorRatePct: 1.9, rps: 512, health: "degraded", x: 185, y: 310 },
  { id: "inventory-service", label: "Inventory Service", short: "Inventory", tier: "support", owner: "Commerce Platform", version: "v4.4.2", uptimePct: 99.9, p99Ms: 88, errorRatePct: 0.2, rps: 720, health: "healthy", x: 435, y: 310 },
  { id: "notification-service", label: "Notification Service", short: "Notify", tier: "support", owner: "Growth", version: "v1.9.0", uptimePct: 99.96, p99Ms: 34, errorRatePct: 0.05, rps: 340, health: "healthy", x: 685, y: 310 },
  { id: "recommendation-engine", label: "Recommendation Engine", short: "Recs", tier: "support", owner: "Discovery", version: "v2.1.4", uptimePct: 99.88, p99Ms: 105, errorRatePct: 0.3, rps: 410, health: "healthy", x: 935, y: 310 },
  { id: "postgres-primary", label: "Postgres Primary", short: "Postgres", tier: "data", owner: "Data Platform", version: "PG 15.4", uptimePct: 99.99, p99Ms: 19, errorRatePct: 0.01, rps: 4200, health: "healthy", x: 185, y: 430 },
  { id: "redis-cache", label: "Redis Cache", short: "Redis", tier: "data", owner: "Data Platform", version: "v7.2.0", uptimePct: 98.41, p99Ms: 774, errorRatePct: 6.4, rps: 5600, health: "critical", x: 435, y: 430 },
  { id: "message-queue", label: "Message Queue", short: "Queue", tier: "data", owner: "Data Platform", version: "v3.5.0", uptimePct: 99.97, p99Ms: 14, errorRatePct: 0.02, rps: 2100, health: "healthy", x: 685, y: 430 },
  { id: "object-storage", label: "Object Storage", short: "S3", tier: "data", owner: "Data Platform", version: "v1.0.0", uptimePct: 100, p99Ms: 22, errorRatePct: 0, rps: 1900, health: "healthy", x: 935, y: 430 },
];

export const NODE_MAP: Record<NodeId, TopoNode> = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, TopoNode>;

export type TopoEdge = { id: string; source: NodeId; target: NodeId; health: Health; latencyMs: number; errorRatePct: number };

export const EDGES: TopoEdge[] = [
  { id: "e1", source: "api-gateway", target: "auth-service", health: "healthy", latencyMs: 42, errorRatePct: 0.1 },
  { id: "e2", source: "api-gateway", target: "catalog-service", health: "healthy", latencyMs: 38, errorRatePct: 0.1 },
  { id: "e3", source: "api-gateway", target: "cart-service", health: "healthy", latencyMs: 51, errorRatePct: 0.2 },
  { id: "e4", source: "api-gateway", target: "checkout-service", health: "degraded", latencyMs: 340, errorRatePct: 2.1 },
  { id: "e5", source: "api-gateway", target: "search-service", health: "healthy", latencyMs: 64, errorRatePct: 0.3 },
  { id: "e6", source: "cdn-edge", target: "object-storage", health: "healthy", latencyMs: 22, errorRatePct: 0.0 },
  { id: "e7", source: "cdn-edge", target: "catalog-service", health: "healthy", latencyMs: 29, errorRatePct: 0.1 },
  { id: "e8", source: "auth-service", target: "postgres-primary", health: "healthy", latencyMs: 18, errorRatePct: 0.0 },
  { id: "e9", source: "auth-service", target: "redis-cache", health: "critical", latencyMs: 890, errorRatePct: 6.4 },
  { id: "e10", source: "catalog-service", target: "postgres-primary", health: "healthy", latencyMs: 24, errorRatePct: 0.1 },
  { id: "e11", source: "catalog-service", target: "redis-cache", health: "critical", latencyMs: 720, errorRatePct: 5.8 },
  { id: "e12", source: "catalog-service", target: "search-service", health: "healthy", latencyMs: 31, errorRatePct: 0.1 },
  { id: "e13", source: "cart-service", target: "redis-cache", health: "critical", latencyMs: 810, errorRatePct: 6.1 },
  { id: "e14", source: "cart-service", target: "postgres-primary", health: "healthy", latencyMs: 27, errorRatePct: 0.1 },
  { id: "e15", source: "checkout-service", target: "payments-service", health: "degraded", latencyMs: 410, errorRatePct: 3.2 },
  { id: "e16", source: "checkout-service", target: "inventory-service", health: "healthy", latencyMs: 45, errorRatePct: 0.2 },
  { id: "e17", source: "checkout-service", target: "cart-service", health: "healthy", latencyMs: 33, errorRatePct: 0.1 },
  { id: "e18", source: "checkout-service", target: "message-queue", health: "healthy", latencyMs: 19, errorRatePct: 0.0 },
  { id: "e19", source: "search-service", target: "postgres-primary", health: "healthy", latencyMs: 22, errorRatePct: 0.1 },
  { id: "e20", source: "payments-service", target: "postgres-primary", health: "healthy", latencyMs: 26, errorRatePct: 0.1 },
  { id: "e21", source: "payments-service", target: "message-queue", health: "healthy", latencyMs: 15, errorRatePct: 0.0 },
  { id: "e22", source: "inventory-service", target: "postgres-primary", health: "healthy", latencyMs: 21, errorRatePct: 0.1 },
  { id: "e23", source: "inventory-service", target: "redis-cache", health: "critical", latencyMs: 760, errorRatePct: 5.9 },
  { id: "e24", source: "message-queue", target: "notification-service", health: "healthy", latencyMs: 8, errorRatePct: 0.0 },
  { id: "e25", source: "recommendation-engine", target: "postgres-primary", health: "healthy", latencyMs: 34, errorRatePct: 0.1 },
  { id: "e26", source: "recommendation-engine", target: "redis-cache", health: "critical", latencyMs: 680, errorRatePct: 5.2 },
];

/* --------------------------------------------------- Derived aggregates (computed, not typed in) */

export const HEALTHY_COUNT = NODES.filter((n) => n.health === "healthy").length;
export const ACTIVE_INCIDENT_NODES = NODES.filter((n) => n.health !== "healthy");
export const CRITICAL_EDGES = EDGES.filter((e) => e.health === "critical");
export const CRITICAL_EDGE_COUNT = CRITICAL_EDGES.length;
export const AVG_CRITICAL_EDGE_LATENCY_MS = Math.round(CRITICAL_EDGES.reduce((sum, e) => sum + e.latencyMs, 0) / CRITICAL_EDGE_COUNT);
export const PLATFORM_P99_MS = Math.round(NODES.reduce((sum, n) => sum + n.p99Ms, 0) / NODES.length);
export const PLATFORM_RPS = NODES.reduce((sum, n) => sum + n.rps, 0);

/** Adjacency, derived from EDGES — this is the ground truth the accessible table renders from, so
 *  the table and the graph can never disagree (both read the same computed structure). */
export type AdjacencyEntry = { id: NodeId; short: string; health: Health };

function buildAdjacency() {
  const callsOut: Record<NodeId, AdjacencyEntry[]> = {} as Record<NodeId, AdjacencyEntry[]>;
  const calledBy: Record<NodeId, AdjacencyEntry[]> = {} as Record<NodeId, AdjacencyEntry[]>;
  for (const n of NODES) {
    callsOut[n.id] = [];
    calledBy[n.id] = [];
  }
  for (const e of EDGES) {
    callsOut[e.source].push({ id: e.target, short: NODE_MAP[e.target].short, health: e.health });
    calledBy[e.target].push({ id: e.source, short: NODE_MAP[e.source].short, health: e.health });
  }
  return { callsOut, calledBy };
}

export const { callsOut: CALLS_OUT, calledBy: CALLED_BY } = buildAdjacency();

/* --------------------------------------------------------- Deterministic trend sparklines */

export const TREND_LABELS = ["-35m", "-30m", "-25m", "-20m", "-15m", "-10m", "-5m", "Now"];

/** Fixed-shape wave around a baseline, seeded by node index — pure function of (baseline, seed),
 *  never Math.random/Date.now, so it is identical on every render and every environment. */
function buildTrend(baseline: number, seed: number, points = TREND_LABELS.length): number[] {
  return Array.from({ length: points }, (_, i) => {
    const wave = 1 + 0.09 * Math.sin((i + seed) * 0.9) + 0.04 * Math.cos((i + seed) * 1.7);
    return Math.max(0, Math.round(baseline * wave * 100) / 100);
  });
}

export const LATENCY_TREND: Record<NodeId, number[]> = Object.fromEntries(
  NODES.map((n, i) => [n.id, buildTrend(n.p99Ms, i)]),
) as Record<NodeId, number[]>;

export const ERROR_TREND: Record<NodeId, number[]> = Object.fromEntries(
  NODES.map((n, i) => [n.id, buildTrend(Math.max(n.errorRatePct, 0.02), i + 4)]),
) as Record<NodeId, number[]>;

/* --------------------------------------------------------- Mesh request-rate live history */

export const MESH_RPS_LABELS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

/** 24 hourly points, a fixed sinusoidal shape around the platform total — deterministic "live" data
 *  that the header ticker steps through via a counter, not the wall clock. */
export const MESH_RPS_HISTORY: number[] = Array.from({ length: 24 }, (_, i) => {
  const wave = Math.sin((i / 24) * Math.PI * 2 - 0.6) * 0.22 + Math.sin(i / 3) * 0.035;
  return Math.round(PLATFORM_RPS * (1 + wave));
});
