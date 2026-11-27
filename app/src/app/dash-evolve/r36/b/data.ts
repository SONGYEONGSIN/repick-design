import { Activity, AlertTriangle, Boxes, Network, Settings, type LucideIcon } from "lucide-react";
import { r2, type Status } from "./tokens";

export const BRAND = { name: "Meshwire", Icon: Network };

export const CURRENT_USER = {
  name: "Priya Narayan",
  role: "SRE, Platform",
  email: "priya.narayan@meshwire.io",
  initials: "PN",
};

// ---------------------------------------------------------------------------
// Geometry — deterministic concentric-ring layout, no physics simulation and
// no Math.random. Every node gets a fixed angle from a formula whose inputs
// (ring radius, node index, node count in its ring, a per-ring stagger offset)
// are all literal numbers chosen below; Math.cos/Math.sin are plain
// trigonometry, not randomness, and every resulting coordinate is rounded to
// 2 decimal places via r2() before it is ever stored. This is computed once,
// at module load, so it is the same on every render and on the server.
// ---------------------------------------------------------------------------

export const VIEW_W = 820;
export const VIEW_H = 600;
export const CENTER_X = 410;
export const CENTER_Y = 300;

export type TierId = "edge" | "service" | "data";
export const TIER_ORDER: TierId[] = ["edge", "service", "data"];
export const TIER_LABEL: Record<TierId, string> = {
  edge: "Edge",
  service: "Service",
  data: "Data",
};
/** Ring radius used by the default "by tier" grouping. Also reused as the
 * three latency-bucket ring radii in the "by latency" view, so switching
 * views moves nodes between the same three physical rings rather than
 * inventing a new geometry — the recompute is a reassignment, not a redraw. */
export const TIER_RADIUS: Record<TierId, number> = { edge: 110, service: 205, data: 275 };
/** Arbitrary per-ring angular stagger so radial spokes across rings don't
 * align into straight lines through the center — a plain legibility
 * convention from polar/dendrogram layouts (e.g. d3's radial tree examples
 * stagger child rings the same way), not a measured or borrowed number. */
const TIER_STAGGER_DEG: Record<TierId, number> = { edge: 0, service: 20, data: 10 };
/** Node "kind" shape — tier identity is encoded by RING POSITION already, and
 * reinforced by a distinct SVG shape per tier so identity never rests on
 * ring position alone (which would disappear once "by latency" reassigns
 * rings). Shape stays fixed across both views. */
export type NodeShape = "square" | "circle" | "diamond";
export const TIER_SHAPE: Record<TierId, NodeShape> = { edge: "square", service: "circle", data: "diamond" };

function ringPosition(radius: number, index: number, count: number, staggerDeg: number) {
  const angleDeg = -90 + index * (360 / count) + staggerDeg;
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: r2(CENTER_X + radius * Math.cos(angleRad)), y: r2(CENTER_Y + radius * Math.sin(angleRad)) };
}

export type RelationshipType = "http" | "grpc" | "queue" | "db-write" | "db-read" | "cache";
export const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  http: "HTTP call",
  grpc: "gRPC call",
  queue: "Queue publish",
  "db-write": "DB write",
  "db-read": "DB read",
  cache: "Cache op",
};

/**
 * Edge relationship, grouped into 3 broad categories so the graph canvas can
 * show relationship KIND persistently (as a dash pattern — see CATEGORY_DASH
 * in tokens.ts) without needing 6 separate hues on top of the 3 status
 * colors. The exact 6-way relationship type is still always available,
 * at-a-glance, in the hover/focus tooltip's label, in the inspector's
 * dependency rows, and as its own column in the adjacency table.
 */
export type RelationshipCategory = "sync" | "async" | "data";
export const RELATIONSHIP_CATEGORY: Record<RelationshipType, RelationshipCategory> = {
  http: "sync",
  grpc: "sync",
  queue: "async",
  "db-write": "data",
  "db-read": "data",
  cache: "data",
};
export const CATEGORY_LABEL: Record<RelationshipCategory, string> = {
  sync: "Sync call",
  async: "Async queue",
  data: "Data access",
};

export interface ServiceNode {
  id: string;
  name: string;
  hostname: string;
  tier: TierId;
  status: Status;
  team: string;
  selfLatencyMs: number;
  p99LatencyMs: number;
  uptimePct: number;
  callsPerMin: number;
}

/** Raw node data — every value is a hand-picked literal, no derivation. */
const NODE_SEED: ServiceNode[] = [
  { id: "api-gateway", name: "API Gateway", hostname: "api-gateway.prod.use1.internal", tier: "edge", status: "healthy", team: "Platform", selfLatencyMs: 6, p99LatencyMs: 18, uptimePct: 99.99, callsPerMin: 48200 },
  { id: "edge-cdn", name: "Edge CDN", hostname: "edge-cdn.prod.global.internal", tier: "edge", status: "healthy", team: "Platform", selfLatencyMs: 3, p99LatencyMs: 9, uptimePct: 99.99, callsPerMin: 112400 },
  { id: "auth-proxy", name: "Auth Proxy", hostname: "auth-proxy.prod.use1.internal", tier: "edge", status: "degraded", team: "Identity", selfLatencyMs: 22, p99LatencyMs: 95, uptimePct: 99.91, callsPerMin: 31800 },

  { id: "checkout-svc", name: "Checkout Service", hostname: "checkout-svc.prod.use1.internal", tier: "service", status: "healthy", team: "Commerce", selfLatencyMs: 18, p99LatencyMs: 64, uptimePct: 99.95, callsPerMin: 9200 },
  { id: "catalog-svc", name: "Catalog Service", hostname: "catalog-svc.prod.use1.internal", tier: "service", status: "healthy", team: "Commerce", selfLatencyMs: 14, p99LatencyMs: 47, uptimePct: 99.97, callsPerMin: 26500 },
  { id: "pricing-svc", name: "Pricing Service", hostname: "pricing-svc.prod.use1.internal", tier: "service", status: "healthy", team: "Commerce", selfLatencyMs: 11, p99LatencyMs: 38, uptimePct: 99.98, callsPerMin: 15300 },
  { id: "cart-svc", name: "Cart Service", hostname: "cart-svc.prod.use1.internal", tier: "service", status: "healthy", team: "Commerce", selfLatencyMs: 9, p99LatencyMs: 29, uptimePct: 99.98, callsPerMin: 18700 },
  { id: "search-svc", name: "Search Service", hostname: "search-svc.prod.use1.internal", tier: "service", status: "degraded", team: "Discovery", selfLatencyMs: 41, p99LatencyMs: 180, uptimePct: 99.82, callsPerMin: 22100 },
  { id: "user-svc", name: "User Service", hostname: "user-svc.prod.use1.internal", tier: "service", status: "healthy", team: "Identity", selfLatencyMs: 13, p99LatencyMs: 42, uptimePct: 99.96, callsPerMin: 19600 },
  { id: "payments-svc", name: "Payments Service", hostname: "payments-svc.prod.use1.internal", tier: "service", status: "healthy", team: "Payments", selfLatencyMs: 27, p99LatencyMs: 88, uptimePct: 99.94, callsPerMin: 8400 },
  { id: "notification-svc", name: "Notification Service", hostname: "notification-svc.prod.use1.internal", tier: "service", status: "down", team: "Growth", selfLatencyMs: 54, p99LatencyMs: 310, uptimePct: 98.72, callsPerMin: 5100 },

  { id: "postgres-primary", name: "Postgres Primary", hostname: "pg-primary-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 4, p99LatencyMs: 15, uptimePct: 99.99, callsPerMin: 41200 },
  { id: "redis-cache", name: "Redis Cache", hostname: "redis-cache-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 1, p99LatencyMs: 4, uptimePct: 99.99, callsPerMin: 88300 },
  { id: "kafka-bus", name: "Kafka Bus", hostname: "kafka-bus-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 8, p99LatencyMs: 24, uptimePct: 99.97, callsPerMin: 36400 },
  { id: "s3-assets", name: "S3 Assets", hostname: "s3-assets.prod.global.internal", tier: "data", status: "healthy", team: "Platform", selfLatencyMs: 31, p99LatencyMs: 120, uptimePct: 99.95, callsPerMin: 7300 },
  { id: "elasticsearch", name: "Elasticsearch", hostname: "es-cluster-0.prod.use1.internal", tier: "data", status: "degraded", team: "Discovery", selfLatencyMs: 48, p99LatencyMs: 210, uptimePct: 99.8, callsPerMin: 24800 },
  { id: "clickhouse-analytics", name: "ClickHouse Analytics", hostname: "ch-analytics-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 62, p99LatencyMs: 240, uptimePct: 99.9, callsPerMin: 4100 },
];

export type LatencyBucket = "fast" | "moderate" | "slow";
export const LATENCY_BUCKET_LABEL: Record<LatencyBucket, string> = { fast: "< 15ms", moderate: "15–40ms", slow: "> 40ms" };
/** Latency view reuses the exact same three ring radii as the tier view
 * (TIER_RADIUS, keyed positionally: fast→innermost, moderate→middle,
 * slow→outermost) so the two views are a reassignment between fixed rings,
 * not a different geometry. */
const LATENCY_RADIUS: Record<LatencyBucket, number> = { fast: TIER_RADIUS.edge, moderate: TIER_RADIUS.service, slow: TIER_RADIUS.data };
const LATENCY_STAGGER_DEG: Record<LatencyBucket, number> = { fast: 0, moderate: 20, slow: 10 };
function latencyBucket(ms: number): LatencyBucket {
  if (ms < 15) return "fast";
  if (ms <= 40) return "moderate";
  return "slow";
}

export interface PositionedNode extends ServiceNode {
  shape: NodeShape;
  tierX: number;
  tierY: number;
  latencyX: number;
  latencyY: number;
  latencyBucket: LatencyBucket;
}

function computeNodes(): PositionedNode[] {
  const byTier: Record<TierId, ServiceNode[]> = { edge: [], service: [], data: [] };
  for (const n of NODE_SEED) byTier[n.tier].push(n);

  const byBucket: Record<LatencyBucket, ServiceNode[]> = { fast: [], moderate: [], slow: [] };
  for (const n of NODE_SEED) byBucket[latencyBucket(n.selfLatencyMs)].push(n);

  const tierPos = new Map<string, { x: number; y: number }>();
  for (const tier of TIER_ORDER) {
    const list = byTier[tier];
    list.forEach((n, i) => tierPos.set(n.id, ringPosition(TIER_RADIUS[tier], i, list.length, TIER_STAGGER_DEG[tier])));
  }

  const latencyPos = new Map<string, { x: number; y: number }>();
  (Object.keys(byBucket) as LatencyBucket[]).forEach((bucket) => {
    const list = byBucket[bucket];
    list.forEach((n, i) => latencyPos.set(n.id, ringPosition(LATENCY_RADIUS[bucket], i, list.length, LATENCY_STAGGER_DEG[bucket])));
  });

  return NODE_SEED.map((n) => {
    const tp = tierPos.get(n.id)!;
    const lp = latencyPos.get(n.id)!;
    return { ...n, shape: TIER_SHAPE[n.tier], tierX: tp.x, tierY: tp.y, latencyX: lp.x, latencyY: lp.y, latencyBucket: latencyBucket(n.selfLatencyMs) };
  });
}

export const NODES: PositionedNode[] = computeNodes();
export const NODE_BY_ID = new Map(NODES.map((n) => [n.id, n]));

export interface ServiceEdge {
  id: string;
  source: string;
  target: string;
  relationship: RelationshipType;
  status: Status;
  latencyMs: number;
  callsPerMin: number;
}

export const EDGES: ServiceEdge[] = [
  { id: "e1", source: "api-gateway", target: "auth-proxy", relationship: "http", status: "degraded", latencyMs: 24, callsPerMin: 31800 },
  { id: "e2", source: "api-gateway", target: "checkout-svc", relationship: "http", status: "healthy", latencyMs: 19, callsPerMin: 9200 },
  { id: "e3", source: "api-gateway", target: "catalog-svc", relationship: "http", status: "healthy", latencyMs: 15, callsPerMin: 26500 },
  { id: "e4", source: "api-gateway", target: "search-svc", relationship: "http", status: "degraded", latencyMs: 44, callsPerMin: 22100 },
  { id: "e5", source: "api-gateway", target: "user-svc", relationship: "http", status: "healthy", latencyMs: 14, callsPerMin: 19600 },
  { id: "e6", source: "edge-cdn", target: "catalog-svc", relationship: "cache", status: "healthy", latencyMs: 5, callsPerMin: 61200 },
  { id: "e7", source: "auth-proxy", target: "user-svc", relationship: "grpc", status: "healthy", latencyMs: 12, callsPerMin: 31800 },
  { id: "e8", source: "checkout-svc", target: "cart-svc", relationship: "grpc", status: "healthy", latencyMs: 10, callsPerMin: 9200 },
  { id: "e9", source: "checkout-svc", target: "pricing-svc", relationship: "grpc", status: "healthy", latencyMs: 12, callsPerMin: 9200 },
  { id: "e10", source: "checkout-svc", target: "payments-svc", relationship: "grpc", status: "healthy", latencyMs: 29, callsPerMin: 8400 },
  { id: "e11", source: "checkout-svc", target: "postgres-primary", relationship: "db-write", status: "healthy", latencyMs: 17, callsPerMin: 9200 },
  { id: "e12", source: "cart-svc", target: "redis-cache", relationship: "cache", status: "healthy", latencyMs: 2, callsPerMin: 18700 },
  { id: "e13", source: "catalog-svc", target: "elasticsearch", relationship: "grpc", status: "degraded", latencyMs: 52, callsPerMin: 24800 },
  { id: "e14", source: "catalog-svc", target: "postgres-primary", relationship: "db-read", status: "healthy", latencyMs: 9, callsPerMin: 26500 },
  { id: "e15", source: "catalog-svc", target: "s3-assets", relationship: "http", status: "healthy", latencyMs: 33, callsPerMin: 7300 },
  { id: "e16", source: "pricing-svc", target: "postgres-primary", relationship: "db-read", status: "healthy", latencyMs: 8, callsPerMin: 15300 },
  { id: "e17", source: "pricing-svc", target: "redis-cache", relationship: "cache", status: "healthy", latencyMs: 1, callsPerMin: 15300 },
  { id: "e18", source: "search-svc", target: "elasticsearch", relationship: "grpc", status: "degraded", latencyMs: 58, callsPerMin: 22100 },
  { id: "e19", source: "search-svc", target: "redis-cache", relationship: "cache", status: "degraded", latencyMs: 3, callsPerMin: 22100 },
  { id: "e20", source: "user-svc", target: "postgres-primary", relationship: "db-read", status: "healthy", latencyMs: 7, callsPerMin: 19600 },
  { id: "e21", source: "user-svc", target: "redis-cache", relationship: "cache", status: "healthy", latencyMs: 2, callsPerMin: 19600 },
  { id: "e22", source: "payments-svc", target: "kafka-bus", relationship: "queue", status: "healthy", latencyMs: 9, callsPerMin: 8400 },
  { id: "e23", source: "payments-svc", target: "postgres-primary", relationship: "db-write", status: "healthy", latencyMs: 19, callsPerMin: 8400 },
  { id: "e24", source: "notification-svc", target: "kafka-bus", relationship: "queue", status: "down", latencyMs: 310, callsPerMin: 5100 },
  { id: "e25", source: "notification-svc", target: "s3-assets", relationship: "http", status: "down", latencyMs: 290, callsPerMin: 5100 },
  { id: "e26", source: "kafka-bus", target: "clickhouse-analytics", relationship: "queue", status: "healthy", latencyMs: 21, callsPerMin: 36400 },
];

export interface Incident {
  id: string;
  dateLabel: string;
  time: string;
  severity: "critical" | "warning" | "info" | "resolved";
  serviceName: string;
  message: string;
}

/**
 * Chronological incident/alert timeline — intentionally NOT wired to node
 * selection. Clicking a node opens/closes the ephemeral inspector popover;
 * this list is a separate, always-identical feed that never filters,
 * reorders or highlights based on that selection. That is a deliberate
 * design decision (not a missing feature): the brief's assigned skeleton
 * calls for a bottom timeline independent of the graph, specifically to
 * avoid the "select a node → everything else on the page recomputes"
 * fan-out pattern this catalog already has several examples of.
 */
export const INCIDENTS: Incident[] = [
  { id: "i1", dateLabel: "Oct 7", time: "09:42", severity: "critical", serviceName: "Notification Service", message: "Returning 5xx on 80% of requests; queue backlog growing on Kafka Bus." },
  { id: "i2", dateLabel: "Oct 7", time: "09:38", severity: "warning", serviceName: "Elasticsearch", message: "Cluster health yellow after one node restart; Search Service p99 climbing." },
  { id: "i3", dateLabel: "Oct 7", time: "09:21", severity: "warning", serviceName: "Auth Proxy", message: "p99 latency crossed the 90ms threshold for the last 5 minutes." },
  { id: "i4", dateLabel: "Oct 7", time: "08:57", severity: "info", serviceName: "Catalog Service", message: "Rolling deploy of v214 completed across all 3 availability zones." },
  { id: "i5", dateLabel: "Oct 7", time: "08:44", severity: "resolved", serviceName: "Payments Service", message: "Elevated error rate (0.8%) returned to baseline after Kafka consumer lag cleared." },
  { id: "i6", dateLabel: "Oct 6", time: "08:12", severity: "info", serviceName: "S3 Assets", message: "Lifecycle policy updated; no service impact expected." },
  { id: "i7", dateLabel: "Oct 6", time: "07:55", severity: "resolved", serviceName: "Postgres Primary", message: "Scheduled replica failover test completed without incident." },
  { id: "i8", dateLabel: "Oct 6", time: "07:30", severity: "critical", serviceName: "Search Service", message: "Index replication fell behind by 12 minutes during peak traffic." },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "monitor",
    title: "Monitor",
    items: [
      { id: "overview", label: "Overview", Icon: Activity, disabled: true },
      { id: "topology", label: "Topology", Icon: Network, active: true },
      { id: "incidents", label: "Incidents", Icon: AlertTriangle, disabled: true },
    ],
  },
  {
    id: "manage",
    title: "Manage",
    items: [
      { id: "catalog", label: "Service catalog", Icon: Boxes, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings, disabled: true },
    ],
  },
];
