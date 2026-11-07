// Nodewatch — service dependency data for repick's platform engineering team.
//
// This file is the single source of truth: KPI tiles, the graph canvas, the detail panel and the
// accessible fallback table all read the same SERVICES / EDGES arrays through the pure helpers
// below. Nothing here is random or time-based — every number is hand-authored so the page renders
// identically on every request.

export type Status = "healthy" | "degraded" | "down";

export type IconKey =
  | "router"
  | "smartphone"
  | "shield"
  | "grid"
  | "search"
  | "dollar"
  | "route"
  | "image"
  | "workflow"
  | "radio"
  | "database";

export interface ServiceNode {
  id: string;
  name: string;
  /** One-line description of what the service does, shown in the detail panel and table. */
  summary: string;
  icon: IconKey;
  team: string;
  region: string;
  tier: 1 | 2 | 3 | 4;
  /** Hand-placed layout coordinates in a fixed 1180 x 980 design grid (see GraphCanvas). */
  cx: number;
  cy: number;
  status: Status;
  /** p99 latency in milliseconds for the service's primary operation. */
  p99Ms: number;
  callsPerMin: number;
  incidentsToday: number;
  incidents90d: number;
  /** Present only for degraded/down services — the current operator-facing note. */
  note?: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export const SERVICES: ServiceNode[] = [
  {
    id: "api-gateway",
    name: "api-gateway",
    summary: "Edge entry point for the repick web and partner API traffic.",
    icon: "router",
    team: "Platform Edge",
    region: "us-east-1",
    tier: 1,
    cx: 360,
    cy: 70,
    status: "healthy",
    p99Ms: 82,
    callsPerMin: 48200,
    incidentsToday: 0,
    incidents90d: 3,
  },
  {
    id: "mobile-bff",
    name: "mobile-bff",
    summary: "Backend-for-frontend that shapes responses for the repick mobile apps.",
    icon: "smartphone",
    team: "Platform Edge",
    region: "us-east-1",
    tier: 1,
    cx: 820,
    cy: 70,
    status: "healthy",
    p99Ms: 76,
    callsPerMin: 21400,
    incidentsToday: 0,
    incidents90d: 1,
  },
  {
    id: "auth-service",
    name: "auth-service",
    summary: "Session issuance and credential checks for buyers and sellers.",
    icon: "shield",
    team: "Identity",
    region: "us-east-1",
    tier: 2,
    cx: 140,
    cy: 300,
    status: "healthy",
    p99Ms: 41,
    callsPerMin: 36800,
    incidentsToday: 0,
    incidents90d: 2,
  },
  {
    id: "listings-service",
    name: "listings-service",
    summary: "CRUD and lifecycle rules for seller listings.",
    icon: "grid",
    team: "Catalog",
    region: "us-east-1",
    tier: 2,
    cx: 400,
    cy: 300,
    status: "healthy",
    p99Ms: 95,
    callsPerMin: 29300,
    incidentsToday: 0,
    incidents90d: 4,
  },
  {
    id: "search-index",
    name: "search-index",
    summary: "Query layer in front of the search cluster for browse and search.",
    icon: "search",
    team: "Search",
    region: "us-east-1",
    tier: 2,
    cx: 660,
    cy: 300,
    status: "healthy",
    p99Ms: 118,
    callsPerMin: 18700,
    incidentsToday: 0,
    incidents90d: 2,
  },
  {
    id: "payments-service",
    name: "payments-service",
    summary: "Checkout, payouts and refund orchestration.",
    icon: "dollar",
    team: "Payments",
    region: "us-east-1",
    tier: 2,
    cx: 900,
    cy: 300,
    status: "degraded",
    p99Ms: 612,
    callsPerMin: 9400,
    incidentsToday: 1,
    incidents90d: 6,
    note: "p99 latency up 4.8x since the 08:40 deploy. Rollback in progress.",
  },
  {
    id: "match-engine",
    name: "match-engine",
    summary: "AI matching that ranks listings against a buyer's saved search.",
    icon: "route",
    team: "Discovery",
    region: "us-east-1",
    tier: 2,
    cx: 1080,
    cy: 300,
    status: "healthy",
    p99Ms: 143,
    callsPerMin: 12100,
    incidentsToday: 0,
    incidents90d: 1,
  },
  {
    id: "image-cdn",
    name: "image-cdn",
    summary: "Resize and edge-cache listing photos.",
    icon: "image",
    team: "Media",
    region: "global",
    tier: 3,
    cx: 260,
    cy: 530,
    status: "healthy",
    p99Ms: 28,
    callsPerMin: 41200,
    incidentsToday: 0,
    incidents90d: 0,
  },
  {
    id: "pricing-engine",
    name: "pricing-engine",
    summary: "Suggests list prices from comparable sold items.",
    icon: "workflow",
    team: "Catalog",
    region: "us-east-1",
    tier: 3,
    cx: 560,
    cy: 530,
    status: "healthy",
    p99Ms: 64,
    callsPerMin: 8300,
    incidentsToday: 0,
    incidents90d: 1,
  },
  {
    id: "notification-queue",
    name: "notification-queue",
    summary: "Async broker for order, shipping and price-drop notifications.",
    icon: "radio",
    team: "Messaging",
    region: "us-east-1",
    tier: 3,
    cx: 860,
    cy: 530,
    status: "down",
    p99Ms: 0,
    callsPerMin: 0,
    incidentsToday: 2,
    incidents90d: 5,
    note: "Full outage — broker nodes unresponsive. On-call paged, mitigation underway.",
  },
  {
    id: "users-db",
    name: "users-db",
    summary: "Primary store for accounts, profiles and credentials.",
    icon: "database",
    team: "Identity",
    region: "us-east-1",
    tier: 4,
    cx: 160,
    cy: 760,
    status: "healthy",
    p99Ms: 12,
    callsPerMin: 52600,
    incidentsToday: 0,
    incidents90d: 1,
  },
  {
    id: "listings-db",
    name: "listings-db",
    summary: "Primary store for listing records and media references.",
    icon: "database",
    team: "Catalog",
    region: "us-east-1",
    tier: 4,
    cx: 460,
    cy: 760,
    status: "healthy",
    p99Ms: 19,
    callsPerMin: 38900,
    incidentsToday: 0,
    incidents90d: 2,
  },
  {
    id: "payments-db",
    name: "payments-db",
    summary: "Ledger of charges, payouts and refunds.",
    icon: "database",
    team: "Payments",
    region: "us-east-1",
    tier: 4,
    cx: 760,
    cy: 760,
    status: "healthy",
    p99Ms: 15,
    callsPerMin: 9800,
    incidentsToday: 0,
    incidents90d: 3,
  },
  {
    id: "search-cluster",
    name: "search-cluster",
    summary: "Sharded search index backing search-index.",
    icon: "database",
    team: "Search",
    region: "us-east-1",
    tier: 4,
    cx: 1040,
    cy: 760,
    status: "degraded",
    p99Ms: 340,
    callsPerMin: 14200,
    incidentsToday: 1,
    incidents90d: 4,
    note: "Disk pressure on 2 of 6 shards. Read replicas serving degraded queries.",
  },
];

// Directed "depends on" edges: `from` calls `to`. A DAG by construction — there is no path back
// from a datastore (tier 4) up to an edge service (tier 1).
export const EDGES: DependencyEdge[] = [
  { from: "api-gateway", to: "auth-service" },
  { from: "api-gateway", to: "listings-service" },
  { from: "api-gateway", to: "search-index" },
  { from: "api-gateway", to: "payments-service" },
  { from: "mobile-bff", to: "auth-service" },
  { from: "mobile-bff", to: "match-engine" },
  { from: "mobile-bff", to: "listings-service" },
  { from: "auth-service", to: "users-db" },
  { from: "listings-service", to: "listings-db" },
  { from: "listings-service", to: "image-cdn" },
  { from: "listings-service", to: "pricing-engine" },
  { from: "search-index", to: "search-cluster" },
  { from: "search-index", to: "listings-db" },
  { from: "payments-service", to: "payments-db" },
  { from: "payments-service", to: "notification-queue" },
  { from: "match-engine", to: "listings-service" },
  { from: "match-engine", to: "search-index" },
  { from: "match-engine", to: "pricing-engine" },
  { from: "notification-queue", to: "users-db" },
  { from: "pricing-engine", to: "listings-db" },
];

const SERVICES_BY_ID: Record<string, ServiceNode> = Object.fromEntries(
  SERVICES.map((node) => [node.id, node]),
);

export function getNode(id: string): ServiceNode | undefined {
  return SERVICES_BY_ID[id];
}

/** Services this node directly calls. */
export function getDirectDependencies(id: string): string[] {
  return EDGES.filter((edge) => edge.from === id).map((edge) => edge.to);
}

/** Services that directly call this node. */
export function getDirectDependents(id: string): string[] {
  return EDGES.filter((edge) => edge.to === id).map((edge) => edge.from);
}

/**
 * Full transitive dependent set — every service that would feel an incident on `id`, directly or
 * through another service in between. Walked breadth-first over the live edge list at call time,
 * never looked up from a precomputed table, so it stays correct if EDGES ever changes.
 */
export function getBlastRadius(id: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = getDirectDependents(id);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined || visited.has(current)) continue;
    visited.add(current);
    for (const next of getDirectDependents(current)) {
      if (!visited.has(next)) queue.push(next);
    }
  }
  return Array.from(visited);
}

export interface DependencyKpis {
  total: number;
  healthy: number;
  degraded: number;
  down: number;
  incidentsToday: number;
}

/** Every KPI tile reads this — never a hand-typed number sitting next to the graph. */
export function computeKpis(): DependencyKpis {
  return SERVICES.reduce<DependencyKpis>(
    (acc, node) => {
      acc.total += 1;
      if (node.status === "healthy") acc.healthy += 1;
      if (node.status === "degraded") acc.degraded += 1;
      if (node.status === "down") acc.down += 1;
      acc.incidentsToday += node.incidentsToday;
      return acc;
    },
    { total: 0, healthy: 0, degraded: 0, down: 0, incidentsToday: 0 },
  );
}

export const STATUS_RANK: Record<Status, number> = { down: 0, degraded: 1, healthy: 2 };

/** The non-healthy node with the largest blast radius — what the "View top risk" action jumps to. */
export function getTopRiskId(): string | null {
  const atRisk = SERVICES.filter((node) => node.status !== "healthy");
  if (atRisk.length === 0) return null;
  let best = atRisk[0];
  let bestSize = getBlastRadius(best.id).length;
  for (const node of atRisk.slice(1)) {
    const size = getBlastRadius(node.id).length;
    if (size > bestSize) {
      best = node;
      bestSize = size;
    }
  }
  return best.id;
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatInt(n: number): string {
  return numberFormatter.format(n);
}

export function formatMs(n: number): string {
  return `${numberFormatter.format(n)} ms`;
}

export function formatCallsPerMin(n: number): string {
  return `${numberFormatter.format(n)}/min`;
}
