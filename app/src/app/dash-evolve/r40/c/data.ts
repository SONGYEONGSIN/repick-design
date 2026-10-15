// Pure, deterministic data for the Tracewell incident-flow console.
// No Math.random(), no Date.now(), no bare `new Date()` anywhere in this module —
// every figure below is a hand-authored constant.

export type StateId =
  | "detected"
  | "triaged"
  | "investigating"
  | "escalated"
  | "mitigating"
  | "resolved"
  | "reopened";

export type PeriodId = "7d" | "30d" | "90d";

export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
];

export const PERIOD_LABEL: Record<PeriodId, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export interface NodeLayout {
  id: StateId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const NODE_W = 150;
export const NODE_H = 64;

// Left-to-right spine on row y=40, branch row (escalation / reopen loop) on y=232.
export const NODE_LAYOUT: NodeLayout[] = [
  { id: "detected", label: "Detected", x: 24, y: 40, w: NODE_W, h: NODE_H },
  { id: "triaged", label: "Triaged", x: 234, y: 40, w: NODE_W, h: NODE_H },
  { id: "investigating", label: "Investigating", x: 444, y: 40, w: NODE_W, h: NODE_H },
  { id: "mitigating", label: "Mitigating", x: 654, y: 40, w: NODE_W, h: NODE_H },
  { id: "resolved", label: "Resolved", x: 864, y: 40, w: NODE_W, h: NODE_H },
  { id: "escalated", label: "Escalated", x: 444, y: 232, w: NODE_W, h: NODE_H },
  { id: "reopened", label: "Reopened", x: 864, y: 232, w: NODE_W, h: NODE_H },
];

export const GRAPH_VIEWBOX = { width: 1062, height: 336 };

/** Snapshot of how many open tickets sit in each state right now — constant across periods. */
export const NODE_CURRENT: Record<StateId, number> = {
  detected: 4,
  triaged: 9,
  investigating: 21,
  escalated: 6,
  mitigating: 13,
  resolved: 31,
  reopened: 2,
};

export interface DwellBucket {
  label: string;
  count: number;
}

/** Dwell-time-in-state buckets for the right-now snapshot; each list sums to NODE_CURRENT[id]. */
export const NODE_DISTRIBUTION: Record<StateId, DwellBucket[]> = {
  detected: [
    { label: "< 15m", count: 3 },
    { label: "15–60m", count: 1 },
  ],
  triaged: [
    { label: "< 30m", count: 5 },
    { label: "30m–2h", count: 3 },
    { label: "> 2h", count: 1 },
  ],
  investigating: [
    { label: "< 2h", count: 9 },
    { label: "2–8h", count: 8 },
    { label: "> 8h", count: 4 },
  ],
  escalated: [
    { label: "< 2h", count: 1 },
    { label: "2–8h", count: 2 },
    { label: "8–24h", count: 2 },
    { label: "> 24h", count: 1 },
  ],
  mitigating: [
    { label: "< 2h", count: 6 },
    { label: "2–8h", count: 5 },
    { label: "> 8h", count: 2 },
  ],
  resolved: [
    { label: "< 6h ago", count: 14 },
    { label: "6–12h ago", count: 10 },
    { label: "12–24h ago", count: 7 },
  ],
  reopened: [
    { label: "< 1h", count: 1 },
    { label: "1–4h", count: 1 },
  ],
};

export const NODE_HINT: Record<StateId, string> = {
  detected: "New tickets waiting for first triage.",
  triaged: "Severity and owner assigned; queued for investigation.",
  investigating: "An on-call engineer is actively diagnosing root cause.",
  escalated: "Kicked to a senior responder or second team.",
  mitigating: "Root cause known; fix is being applied or verified.",
  resolved: "Customer-confirmed or auto-closed in the last 24 hours.",
  reopened: "Customer reported a recurrence after resolution.",
};

export type SelectedTarget = { kind: "node"; id: StateId } | { kind: "edge"; id: string };

export type EdgeKind = "line" | "quad" | "cubic";

export interface EdgeGeometry {
  id: string;
  from: StateId;
  to: StateId;
  kind: EdgeKind;
  points: number[]; // line: [x1,y1,x2,y2]; quad: [x0,y0,cx,cy,x1,y1]; cubic: [x0,y0,c1x,c1y,c2x,c2y,x1,y1]
  labelDx: number;
  labelDy: number;
  labelAnchor: "middle" | "start";
  isLoopBack: boolean;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function lineMid(points: number[]): { x: number; y: number } {
  const [x1, y1, x2, y2] = points;
  return { x: round2((x1 + x2) / 2), y: round2((y1 + y2) / 2) };
}

function quadMid(points: number[]): { x: number; y: number } {
  const [x0, y0, cx, cy, x1, y1] = points;
  return {
    x: round2(0.25 * x0 + 0.5 * cx + 0.25 * x1),
    y: round2(0.25 * y0 + 0.5 * cy + 0.25 * y1),
  };
}

function cubicMid(points: number[]): { x: number; y: number } {
  const [x0, y0, c1x, c1y, c2x, c2y, x1, y1] = points;
  return {
    x: round2((x0 + 3 * c1x + 3 * c2x + x1) / 8),
    y: round2((y0 + 3 * c1y + 3 * c2y + y1) / 8),
  };
}

export function edgeMidpoint(edge: EdgeGeometry): { x: number; y: number } {
  if (edge.kind === "line") return lineMid(edge.points);
  if (edge.kind === "quad") return quadMid(edge.points);
  return cubicMid(edge.points);
}

export function edgePath(edge: EdgeGeometry): string {
  if (edge.kind === "line") {
    const [x1, y1, x2, y2] = edge.points;
    return `M${round2(x1)},${round2(y1)} L${round2(x2)},${round2(y2)}`;
  }
  if (edge.kind === "quad") {
    const [x0, y0, cx, cy, x1, y1] = edge.points;
    return `M${round2(x0)},${round2(y0)} Q${round2(cx)},${round2(cy)} ${round2(x1)},${round2(y1)}`;
  }
  const [x0, y0, c1x, c1y, c2x, c2y, x1, y1] = edge.points;
  return `M${round2(x0)},${round2(y0)} C${round2(c1x)},${round2(c1y)} ${round2(c2x)},${round2(c2y)} ${round2(x1)},${round2(y1)}`;
}

export const EDGE_GEOMETRY: EdgeGeometry[] = [
  {
    id: "detected-triaged",
    from: "detected",
    to: "triaged",
    kind: "line",
    points: [174, 72, 234, 72],
    labelDx: 0,
    labelDy: -14,
    labelAnchor: "middle",
    isLoopBack: false,
  },
  {
    id: "triaged-investigating",
    from: "triaged",
    to: "investigating",
    kind: "line",
    points: [384, 72, 444, 72],
    labelDx: 0,
    labelDy: -14,
    labelAnchor: "middle",
    isLoopBack: false,
  },
  {
    id: "triaged-resolved",
    from: "triaged",
    to: "resolved",
    kind: "quad",
    points: [309, 40, 624, 0, 939, 40],
    labelDx: 0,
    labelDy: -8,
    labelAnchor: "middle",
    isLoopBack: false,
  },
  {
    id: "investigating-mitigating",
    from: "investigating",
    to: "mitigating",
    kind: "line",
    points: [594, 72, 654, 72],
    labelDx: 0,
    labelDy: -14,
    labelAnchor: "middle",
    isLoopBack: false,
  },
  {
    id: "investigating-escalated",
    from: "investigating",
    to: "escalated",
    kind: "line",
    points: [519, 104, 519, 232],
    labelDx: 14,
    labelDy: 4,
    labelAnchor: "start",
    isLoopBack: false,
  },
  {
    id: "escalated-investigating",
    from: "escalated",
    to: "investigating",
    kind: "quad",
    points: [444, 264, 360, 168, 484, 104],
    labelDx: -10,
    labelDy: 0,
    labelAnchor: "start",
    isLoopBack: true,
  },
  {
    id: "escalated-mitigating",
    from: "escalated",
    to: "mitigating",
    kind: "quad",
    points: [594, 264, 660, 190, 729, 104],
    labelDx: 10,
    labelDy: 0,
    labelAnchor: "start",
    isLoopBack: false,
  },
  {
    id: "mitigating-resolved",
    from: "mitigating",
    to: "resolved",
    kind: "line",
    points: [804, 72, 864, 72],
    labelDx: 0,
    labelDy: -14,
    labelAnchor: "middle",
    isLoopBack: false,
  },
  {
    id: "resolved-reopened",
    from: "resolved",
    to: "reopened",
    kind: "line",
    points: [939, 104, 939, 232],
    labelDx: 14,
    labelDy: 4,
    labelAnchor: "start",
    isLoopBack: false,
  },
  {
    id: "reopened-investigating",
    from: "reopened",
    to: "investigating",
    kind: "cubic",
    points: [864, 264, 700, 330, 500, 330, 594, 104],
    labelDx: 0,
    labelDy: 16,
    labelAnchor: "middle",
    isLoopBack: true,
  },
];

export interface EdgeStats {
  id: string;
  volume: number;
  avgWaitHours: number;
}

export const EDGE_STATS: Record<PeriodId, EdgeStats[]> = {
  "7d": [
    { id: "detected-triaged", volume: 142, avgWaitHours: 0.4 },
    { id: "triaged-investigating", volume: 139, avgWaitHours: 1.1 },
    { id: "triaged-resolved", volume: 3, avgWaitHours: 0.3 },
    { id: "investigating-mitigating", volume: 145, avgWaitHours: 2.3 },
    { id: "investigating-escalated", volume: 36, avgWaitHours: 1.8 },
    { id: "escalated-investigating", volume: 33, avgWaitHours: 13.1 },
    { id: "escalated-mitigating", volume: 3, avgWaitHours: 3.4 },
    { id: "mitigating-resolved", volume: 148, avgWaitHours: 4.7 },
    { id: "resolved-reopened", volume: 9, avgWaitHours: 9.1 },
    { id: "reopened-investigating", volume: 9, avgWaitHours: 2.0 },
  ],
  "30d": [
    { id: "detected-triaged", volume: 612, avgWaitHours: 0.4 },
    { id: "triaged-investigating", volume: 598, avgWaitHours: 1.1 },
    { id: "triaged-resolved", volume: 14, avgWaitHours: 0.3 },
    { id: "investigating-mitigating", volume: 621, avgWaitHours: 2.3 },
    { id: "investigating-escalated", volume: 157, avgWaitHours: 1.8 },
    { id: "escalated-investigating", volume: 142, avgWaitHours: 14.2 },
    { id: "escalated-mitigating", volume: 15, avgWaitHours: 3.6 },
    { id: "mitigating-resolved", volume: 636, avgWaitHours: 4.9 },
    { id: "resolved-reopened", volume: 38, avgWaitHours: 9.5 },
    { id: "reopened-investigating", volume: 38, avgWaitHours: 2.0 },
  ],
  "90d": [
    { id: "detected-triaged", volume: 1840, avgWaitHours: 0.4 },
    { id: "triaged-investigating", volume: 1800, avgWaitHours: 1.1 },
    { id: "triaged-resolved", volume: 40, avgWaitHours: 0.3 },
    { id: "investigating-mitigating", volume: 1875, avgWaitHours: 2.3 },
    { id: "investigating-escalated", volume: 470, avgWaitHours: 1.8 },
    { id: "escalated-investigating", volume: 430, avgWaitHours: 15.0 },
    { id: "escalated-mitigating", volume: 40, avgWaitHours: 3.7 },
    { id: "mitigating-resolved", volume: 1915, avgWaitHours: 5.0 },
    { id: "resolved-reopened", volume: 115, avgWaitHours: 9.8 },
    { id: "reopened-investigating", volume: 115, avgWaitHours: 2.1 },
  ],
};

export function edgeLabel(id: string): string {
  const geo = EDGE_GEOMETRY.find((e) => e.id === id);
  if (!geo) return id;
  const from = NODE_LAYOUT.find((n) => n.id === geo.from)?.label ?? geo.from;
  const to = NODE_LAYOUT.find((n) => n.id === geo.to)?.label ?? geo.to;
  return `${from} → ${to}`;
}

/** The single worst edge for a period, by average wait time — the designated bottleneck. */
export function bottleneckFor(period: PeriodId): EdgeStats {
  const stats = EDGE_STATS[period];
  return stats.reduce((worst, s) => (s.avgWaitHours > worst.avgWaitHours ? s : worst), stats[0]!);
}

export function networkAverageWait(period: PeriodId): number {
  const stats = EDGE_STATS[period];
  const total = stats.reduce((sum, s) => sum + s.avgWaitHours, 0);
  return total / stats.length;
}

export type Priority = "Critical" | "High" | "Medium" | "Low";

export interface Incident {
  id: string;
  title: string;
  state: StateId;
  assigneeName: string;
  assigneeInitials: string;
  ageHours: number;
  priority: Priority;
}

export const INCIDENTS: Incident[] = [
  {
    id: "INC-4821",
    title: "Checkout webhook retries timing out",
    state: "investigating",
    assigneeName: "Mina Choi",
    assigneeInitials: "MC",
    ageHours: 2.4,
    priority: "High",
  },
  {
    id: "INC-4819",
    title: "Billing export job stuck mid-run",
    state: "escalated",
    assigneeName: "Devon Park",
    assigneeInitials: "DP",
    ageHours: 14.8,
    priority: "Critical",
  },
  {
    id: "INC-4814",
    title: "Elevated 502s on region eu-west",
    state: "mitigating",
    assigneeName: "Sam Okafor",
    assigneeInitials: "SO",
    ageHours: 5.1,
    priority: "High",
  },
  {
    id: "INC-4808",
    title: "Slack notification delay > 5 min",
    state: "triaged",
    assigneeName: "Mina Choi",
    assigneeInitials: "MC",
    ageHours: 0.8,
    priority: "Medium",
  },
  {
    id: "INC-4799",
    title: "Dashboard export returns empty CSV",
    state: "resolved",
    assigneeName: "Priya Nair",
    assigneeInitials: "PN",
    ageHours: 9.6,
    priority: "Medium",
  },
  {
    id: "INC-4793",
    title: "Auth token refresh loop for SSO tenants",
    state: "reopened",
    assigneeName: "Devon Park",
    assigneeInitials: "DP",
    ageHours: 1.2,
    priority: "High",
  },
  {
    id: "INC-4780",
    title: "Search index lag reported by support",
    state: "detected",
    assigneeName: "Sam Okafor",
    assigneeInitials: "SO",
    ageHours: 0.1,
    priority: "Low",
  },
];

/** Weekly escalation-rate trend (%), most recent week last. Matches the 30d escalation rate. */
export const ESCALATION_TREND: number[] = [18.4, 19.1, 20.6, 21.3, 19.8, 20.9, 20.2];

export const SLA_COMPLIANCE = { current: 87, target: 90 };

export const WORKSPACES = ["Northcross Platform Eng", "Northcross Payments"];

export const CURRENT_USER = {
  name: "Jordan Lee",
  email: "jordan.lee@northcross.io",
  initials: "JL",
};
