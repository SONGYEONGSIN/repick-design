import { AlertTriangle, Boxes, LayoutGrid, Settings, Share2, Workflow, type LucideIcon } from "lucide-react";
import { r2, type Status } from "./tokens";

export const BRAND = { name: "Fluxgraph", Icon: Share2 };

export const CURRENT_USER = {
  name: "Jonah Reyes",
  role: "SRE, Streaming Platform",
  email: "jonah.reyes@fluxgraph.io",
  initials: "JR",
};

// ---------------------------------------------------------------------------
// Geometry — deterministic concentric-ring layout. No physics simulation and
// no Math.random anywhere: every node gets a fixed angle from a formula whose
// inputs (ring radius, node index, node count in its ring, a per-ring stagger
// offset) are all literal numbers chosen below. Math.cos/Math.sin are plain
// trigonometry, not randomness, and every resulting coordinate is rounded to
// 2 decimal places via r2() before it is ever stored or rendered. This runs
// once at module load, so it is identical on every render and on the server
// (no hydration mismatch risk).
// ---------------------------------------------------------------------------

export const VIEW_W = 740;
export const VIEW_H = 560;
export const CENTER_X = 370;
export const CENTER_Y = 280;

export type TierId = "edge" | "service" | "data";
export const TIER_ORDER: TierId[] = ["edge", "service", "data"];
export const TIER_LABEL: Record<TierId, string> = {
  edge: "Edge",
  service: "Service",
  data: "Data",
};
/** Ring radius for the default "by tier" grouping. The same three radii are reused,
 * positionally, by the "by traffic" grouping below — switching views moves nodes
 * between the same three physical rings rather than inventing new geometry, so a view
 * toggle is a reassignment, not a redraw. */
export const TIER_RADIUS: Record<TierId, number> = { edge: 90, service: 175, data: 250 };
/** Arbitrary per-ring angular stagger so radial spokes across rings don't align into
 * straight lines through the center — a plain legibility convention from polar/dendrogram
 * layouts, not a measured or borrowed number. */
const TIER_STAGGER_DEG: Record<TierId, number> = { edge: 0, service: 15, data: 8 };

/** Node body shape — tier identity is encoded by RING RADIUS already, and reinforced by a
 * distinct SVG shape per tier so identity never rests on ring position alone (which
 * disappears once "by traffic" reassigns rings). Shape stays fixed across both views. */
export type NodeShape = "triangle" | "circle" | "square";
export const TIER_SHAPE: Record<TierId, NodeShape> = { edge: "triangle", service: "circle", data: "square" };

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
export const RELATIONSHIP_SHORT: Record<RelationshipType, string> = {
  http: "HTTP",
  grpc: "gRPC",
  queue: "Queue",
  "db-write": "DB-W",
  "db-read": "DB-R",
  cache: "Cache",
};

/**
 * Edge relationship grouped into 3 broad categories so the graph canvas can show
 * relationship KIND persistently (as a dash pattern — see CATEGORY_DASH in tokens.ts)
 * without needing 6 separate hues stacked on the 3 status colors. The exact 6-way type
 * is still always available in the hover tooltip and as its own column in the table.
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
  trafficRpm: number;
}

/** Raw node data — every value is a hand-picked literal, no derivation, no Math.random. */
const NODE_SEED: ServiceNode[] = [
  { id: "cdn-edge", name: "CDN Edge", hostname: "cdn-edge.prod.global.internal", tier: "edge", status: "healthy", team: "Platform", selfLatencyMs: 4, p99LatencyMs: 11, uptimePct: 99.99, trafficRpm: 138500 },
  { id: "api-gateway", name: "API Gateway", hostname: "api-gateway.prod.use1.internal", tier: "edge", status: "healthy", team: "Platform", selfLatencyMs: 7, p99LatencyMs: 21, uptimePct: 99.98, trafficRpm: 52300 },
  { id: "auth-gate", name: "Auth Gate", hostname: "auth-gate.prod.use1.internal", tier: "edge", status: "degraded", team: "Identity", selfLatencyMs: 26, p99LatencyMs: 110, uptimePct: 99.9, trafficRpm: 28100 },

  { id: "playback-api", name: "Playback API", hostname: "playback-api.prod.use1.internal", tier: "service", status: "healthy", team: "Playback", selfLatencyMs: 16, p99LatencyMs: 58, uptimePct: 99.96, trafficRpm: 31200 },
  { id: "recommendation-engine", name: "Recommendation Engine", hostname: "reco-engine.prod.use1.internal", tier: "service", status: "healthy", team: "Discovery", selfLatencyMs: 34, p99LatencyMs: 140, uptimePct: 99.9, trafficRpm: 18700 },
  { id: "drm-license-svc", name: "DRM License Service", hostname: "drm-license.prod.use1.internal", tier: "service", status: "healthy", team: "Rights", selfLatencyMs: 21, p99LatencyMs: 75, uptimePct: 99.95, trafficRpm: 9400 },
  { id: "billing-svc", name: "Billing Service", hostname: "billing-svc.prod.use1.internal", tier: "service", status: "healthy", team: "Monetization", selfLatencyMs: 19, p99LatencyMs: 68, uptimePct: 99.97, trafficRpm: 6100 },
  { id: "ingest-svc", name: "Ingest Service", hostname: "ingest-svc.prod.euw1.internal", tier: "service", status: "healthy", team: "Media Ops", selfLatencyMs: 23, p99LatencyMs: 90, uptimePct: 99.92, trafficRpm: 3800 },
  { id: "transcode-worker", name: "Transcode Worker", hostname: "transcode-worker.prod.euw1.internal", tier: "service", status: "degraded", team: "Media Ops", selfLatencyMs: 46, p99LatencyMs: 310, uptimePct: 99.6, trafficRpm: 2100 },
  { id: "notification-svc", name: "Notification Service", hostname: "notification-svc.prod.use1.internal", tier: "service", status: "down", team: "Growth", selfLatencyMs: 58, p99LatencyMs: 420, uptimePct: 98.4, trafficRpm: 1600 },

  { id: "postgres-primary", name: "Postgres Primary", hostname: "pg-primary-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 5, p99LatencyMs: 17, uptimePct: 99.99, trafficRpm: 46200 },
  { id: "redis-cache", name: "Redis Cache", hostname: "redis-cache-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 1, p99LatencyMs: 4, uptimePct: 99.99, trafficRpm: 102300 },
  { id: "kafka-bus", name: "Kafka Bus", hostname: "kafka-bus-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 9, p99LatencyMs: 28, uptimePct: 99.97, trafficRpm: 24700 },
  { id: "s3-media-store", name: "S3 Media Store", hostname: "s3-media.prod.global.internal", tier: "data", status: "healthy", team: "Platform", selfLatencyMs: 29, p99LatencyMs: 115, uptimePct: 99.95, trafficRpm: 11300 },
  { id: "clickhouse-analytics", name: "ClickHouse Analytics", hostname: "ch-analytics-0.prod.use1.internal", tier: "data", status: "healthy", team: "Data Platform", selfLatencyMs: 54, p99LatencyMs: 220, uptimePct: 99.9, trafficRpm: 3600 },
  { id: "elasticsearch", name: "Elasticsearch", hostname: "es-cluster-0.prod.use1.internal", tier: "data", status: "degraded", team: "Discovery", selfLatencyMs: 44, p99LatencyMs: 190, uptimePct: 99.8, trafficRpm: 8200 },
];

export type TrafficBucket = "low" | "medium" | "high";
export const TRAFFIC_BUCKET_LABEL: Record<TrafficBucket, string> = { low: "< 10k rpm", medium: "10k–50k rpm", high: "> 50k rpm" };
/** "By traffic" reuses the exact same three ring radii as the tier view (TIER_RADIUS,
 * keyed positionally: high→innermost, medium→middle, low→outermost), so the two
 * views are a reassignment between fixed rings, not a different geometry. */
const TRAFFIC_RADIUS: Record<TrafficBucket, number> = { high: TIER_RADIUS.edge, medium: TIER_RADIUS.service, low: TIER_RADIUS.data };
const TRAFFIC_STAGGER_DEG: Record<TrafficBucket, number> = { high: 0, medium: 15, low: 8 };
function trafficBucket(rpm: number): TrafficBucket {
  if (rpm > 50000) return "high";
  if (rpm >= 10000) return "medium";
  return "low";
}

export interface PositionedNode extends ServiceNode {
  shape: NodeShape;
  tierX: number;
  tierY: number;
  trafficX: number;
  trafficY: number;
  trafficBucket: TrafficBucket;
}

function computeNodes(): PositionedNode[] {
  const byTier: Record<TierId, ServiceNode[]> = { edge: [], service: [], data: [] };
  for (const n of NODE_SEED) byTier[n.tier].push(n);

  const byBucket: Record<TrafficBucket, ServiceNode[]> = { low: [], medium: [], high: [] };
  for (const n of NODE_SEED) byBucket[trafficBucket(n.trafficRpm)].push(n);

  const tierPos = new Map<string, { x: number; y: number }>();
  for (const tier of TIER_ORDER) {
    const list = byTier[tier];
    list.forEach((n, i) => tierPos.set(n.id, ringPosition(TIER_RADIUS[tier], i, list.length, TIER_STAGGER_DEG[tier])));
  }

  const trafficPos = new Map<string, { x: number; y: number }>();
  (Object.keys(byBucket) as TrafficBucket[]).forEach((bucket) => {
    const list = byBucket[bucket];
    list.forEach((n, i) => trafficPos.set(n.id, ringPosition(TRAFFIC_RADIUS[bucket], i, list.length, TRAFFIC_STAGGER_DEG[bucket])));
  });

  return NODE_SEED.map((n) => {
    const tp = tierPos.get(n.id)!;
    const fp = trafficPos.get(n.id)!;
    return { ...n, shape: TIER_SHAPE[n.tier], tierX: tp.x, tierY: tp.y, trafficX: fp.x, trafficY: fp.y, trafficBucket: trafficBucket(n.trafficRpm) };
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

/** 28 calls across the 16 nodes above. Every node above appears as a source or target of at
 * least one edge here — verified by construction while writing this list (no orphan nodes). */
export const EDGES: ServiceEdge[] = [
  { id: "e1", source: "api-gateway", target: "auth-gate", relationship: "http", status: "degraded", latencyMs: 24, callsPerMin: 28100 },
  { id: "e2", source: "api-gateway", target: "playback-api", relationship: "http", status: "healthy", latencyMs: 16, callsPerMin: 31200 },
  { id: "e3", source: "api-gateway", target: "recommendation-engine", relationship: "http", status: "healthy", latencyMs: 29, callsPerMin: 18700 },
  { id: "e4", source: "api-gateway", target: "billing-svc", relationship: "http", status: "healthy", latencyMs: 14, callsPerMin: 6100 },
  { id: "e5", source: "api-gateway", target: "ingest-svc", relationship: "http", status: "healthy", latencyMs: 18, callsPerMin: 3800 },
  { id: "e6", source: "cdn-edge", target: "playback-api", relationship: "http", status: "healthy", latencyMs: 5, callsPerMin: 44600 },
  { id: "e7", source: "cdn-edge", target: "s3-media-store", relationship: "cache", status: "healthy", latencyMs: 4, callsPerMin: 52300 },
  { id: "e8", source: "auth-gate", target: "playback-api", relationship: "grpc", status: "degraded", latencyMs: 27, callsPerMin: 28100 },
  { id: "e9", source: "auth-gate", target: "redis-cache", relationship: "cache", status: "degraded", latencyMs: 3, callsPerMin: 28100 },
  { id: "e10", source: "playback-api", target: "drm-license-svc", relationship: "grpc", status: "healthy", latencyMs: 20, callsPerMin: 9400 },
  { id: "e11", source: "playback-api", target: "recommendation-engine", relationship: "grpc", status: "healthy", latencyMs: 12, callsPerMin: 31200 },
  { id: "e12", source: "playback-api", target: "redis-cache", relationship: "cache", status: "healthy", latencyMs: 2, callsPerMin: 31200 },
  { id: "e13", source: "playback-api", target: "postgres-primary", relationship: "db-read", status: "healthy", latencyMs: 6, callsPerMin: 31200 },
  { id: "e14", source: "recommendation-engine", target: "clickhouse-analytics", relationship: "db-read", status: "healthy", latencyMs: 51, callsPerMin: 18700 },
  { id: "e15", source: "recommendation-engine", target: "redis-cache", relationship: "cache", status: "healthy", latencyMs: 2, callsPerMin: 18700 },
  { id: "e16", source: "drm-license-svc", target: "postgres-primary", relationship: "db-read", status: "healthy", latencyMs: 7, callsPerMin: 9400 },
  { id: "e17", source: "billing-svc", target: "postgres-primary", relationship: "db-write", status: "healthy", latencyMs: 16, callsPerMin: 6100 },
  { id: "e18", source: "billing-svc", target: "kafka-bus", relationship: "queue", status: "healthy", latencyMs: 10, callsPerMin: 6100 },
  { id: "e19", source: "billing-svc", target: "notification-svc", relationship: "queue", status: "down", latencyMs: 290, callsPerMin: 1600 },
  { id: "e20", source: "ingest-svc", target: "transcode-worker", relationship: "queue", status: "degraded", latencyMs: 48, callsPerMin: 3800 },
  { id: "e21", source: "ingest-svc", target: "s3-media-store", relationship: "http", status: "healthy", latencyMs: 31, callsPerMin: 3800 },
  { id: "e22", source: "ingest-svc", target: "kafka-bus", relationship: "queue", status: "healthy", latencyMs: 11, callsPerMin: 3800 },
  { id: "e23", source: "transcode-worker", target: "s3-media-store", relationship: "http", status: "degraded", latencyMs: 58, callsPerMin: 2100 },
  { id: "e24", source: "transcode-worker", target: "elasticsearch", relationship: "db-write", status: "degraded", latencyMs: 61, callsPerMin: 2100 },
  { id: "e25", source: "transcode-worker", target: "notification-svc", relationship: "queue", status: "down", latencyMs: 305, callsPerMin: 1600 },
  { id: "e26", source: "notification-svc", target: "kafka-bus", relationship: "queue", status: "down", latencyMs: 298, callsPerMin: 1600 },
  { id: "e27", source: "kafka-bus", target: "elasticsearch", relationship: "queue", status: "degraded", latencyMs: 33, callsPerMin: 8200 },
  { id: "e28", source: "kafka-bus", target: "clickhouse-analytics", relationship: "queue", status: "healthy", latencyMs: 19, callsPerMin: 24700 },
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
 * Chronological incident/alert timeline — intentionally NOT wired to the graph or the table's
 * selection. The node inspector is an ephemeral popover owned by whichever action button or
 * graph mark triggered it; this list is a separate, always-identical feed that never filters,
 * reorders or highlights based on that state (rendered in client.tsx by its own component that
 * takes zero selection-related props — see the comment there). That is the point of the
 * assigned skeleton: a genuinely independent bottom strip, not a "select something →
 * everything else recomputes" fan-out.
 */
export const INCIDENTS: Incident[] = [
  { id: "i1", dateLabel: "Oct 7", time: "09:42", severity: "critical", serviceName: "Notification Service", message: "Returning 5xx on 74% of requests; publish backlog growing on Kafka Bus." },
  { id: "i2", dateLabel: "Oct 7", time: "09:35", severity: "warning", serviceName: "Transcode Worker", message: "Job queue depth crossed 400; EU-West encode jobs running 3x slower than baseline." },
  { id: "i3", dateLabel: "Oct 7", time: "09:21", severity: "warning", serviceName: "Auth Gate", message: "p99 latency crossed the 100ms threshold for the last 5 minutes." },
  { id: "i4", dateLabel: "Oct 7", time: "08:57", severity: "info", serviceName: "Playback API", message: "Rolling deploy of v214 completed across all 3 availability zones." },
  { id: "i5", dateLabel: "Oct 7", time: "08:44", severity: "resolved", serviceName: "Billing Service", message: "Elevated write latency on Postgres Primary returned to baseline after index rebuild." },
  { id: "i6", dateLabel: "Oct 6", time: "08:12", severity: "info", serviceName: "S3 Media Store", message: "Lifecycle policy updated for archived renditions; no service impact expected." },
  { id: "i7", dateLabel: "Oct 6", time: "07:55", severity: "resolved", serviceName: "Postgres Primary", message: "Scheduled replica failover test completed without incident." },
  { id: "i8", dateLabel: "Oct 6", time: "07:30", severity: "critical", serviceName: "Elasticsearch", message: "Metadata index replication fell behind by 14 minutes during peak traffic." },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "monitor",
    title: "Monitor",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid, disabled: true },
      { id: "topology", label: "Dependency graph", Icon: Workflow, active: true },
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
