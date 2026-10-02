// Deterministic dummy data for the "Loopback" returns & refund flow console.
// No Math.random / Date.now / argument-less `new Date()` anywhere in this file
// or anything that consumes it — every number below is a hand-set constant.

import {
  ClipboardList,
  Truck,
  PackageCheck,
  SearchCheck,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  CircleDollarSign,
  Undo2,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Periods
// ---------------------------------------------------------------------------

export type PeriodId = "30d" | "90d";

export const PERIODS: { id: PeriodId; label: string; range: string }[] = [
  { id: "30d", label: "Last 30 days", range: "Aug 31 – Sep 29, 2026" },
  { id: "90d", label: "Last 90 days", range: "Jul 2 – Sep 29, 2026" },
];

// ---------------------------------------------------------------------------
// Stages (graph nodes)
// ---------------------------------------------------------------------------

export type StageId =
  | "requested"
  | "transit"
  | "received"
  | "inspect"
  | "approved"
  | "disputed"
  | "escalated"
  | "refunded"
  | "returned_seller";

export interface Stage {
  id: StageId;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  terminal: boolean;
  /** Center coordinates in the shared SVG viewBox (see VIEW_BOX below),
   *  hand-placed on a fixed grid — whole numbers, so "rounded to 2
   *  decimals" is trivially satisfied and layout is fully deterministic. */
  cx: number;
  cy: number;
  /** Average dwell time in days a case spends at this stage before moving
   *  on, by reporting window. Absent for terminal stages — cases close
   *  here, there is no "dwell" to move on from. */
  dwellDays?: Record<PeriodId, number>;
}

export const NODE_W = 140;
export const NODE_H = 56;
export const VIEW_BOX = { width: 1360, height: 480 };

export const STAGES: Stage[] = [
  {
    id: "requested",
    label: "Return Requested",
    short: "Requested",
    description: "Buyer opens a return request from an order.",
    icon: ClipboardList,
    terminal: false,
    cx: 90,
    cy: 230,
    dwellDays: { "30d": 0.4, "90d": 0.4 },
  },
  {
    id: "transit",
    label: "Item In Transit",
    short: "In transit",
    description: "Return label generated; parcel moving with the carrier.",
    icon: Truck,
    terminal: false,
    cx: 280,
    cy: 230,
    dwellDays: { "30d": 3.2, "90d": 3.3 },
  },
  {
    id: "received",
    label: "Received At Warehouse",
    short: "Received",
    description: "Parcel scanned in at the repick intake warehouse.",
    icon: PackageCheck,
    terminal: false,
    cx: 470,
    cy: 230,
    dwellDays: { "30d": 0.6, "90d": 0.6 },
  },
  {
    id: "inspect",
    label: "Condition Re-Inspected",
    short: "Re-inspected",
    description: "Item condition checked against the listing claim.",
    icon: SearchCheck,
    terminal: false,
    cx: 660,
    cy: 230,
    dwellDays: { "30d": 1.1, "90d": 1.0 },
  },
  {
    id: "approved",
    label: "Approved",
    short: "Approved",
    description: "Condition confirmed; case cleared for refund.",
    icon: CheckCircle2,
    terminal: false,
    cx: 850,
    cy: 100,
    dwellDays: { "30d": 0.5, "90d": 0.6 },
  },
  {
    id: "disputed",
    label: "Disputed",
    short: "Disputed",
    description: "Inspector flags a mismatch with the buyer's claim.",
    icon: AlertCircle,
    terminal: false,
    cx: 850,
    cy: 360,
    dwellDays: { "30d": 0.3, "90d": 0.3 },
  },
  {
    id: "escalated",
    label: "Escalated Review",
    short: "Escalated",
    description: "A senior ops reviewer re-examines photos and case notes.",
    icon: ShieldAlert,
    terminal: false,
    cx: 1040,
    cy: 360,
    dwellDays: { "30d": 4.6, "90d": 4.9 },
  },
  {
    id: "refunded",
    label: "Refund Issued",
    short: "Refunded",
    description: "Buyer refunded; case closed.",
    icon: CircleDollarSign,
    terminal: true,
    cx: 1230,
    cy: 100,
  },
  {
    id: "returned_seller",
    label: "Returned To Seller",
    short: "To seller",
    description: "No refund; item shipped back to the original seller.",
    icon: Undo2,
    terminal: true,
    cx: 1230,
    cy: 360,
  },
];

export function stageById(id: StageId): Stage {
  const s = STAGES.find((st) => st.id === id);
  if (!s) throw new Error(`Unknown stage ${id}`);
  return s;
}

// ---------------------------------------------------------------------------
// Transitions (graph edges)
// ---------------------------------------------------------------------------

export type EdgeId = string; // `${from}__${to}`

export interface FlowEdge {
  id: EdgeId;
  from: StageId;
  to: StageId;
  label: string;
  /** Hand-authored path anchored to node borders (straight `L`, or a cubic
   *  `C` for diagonals/loops). */
  d: string;
  /** Midpoint of `d` at t=0.5 (hand-computed from the line/cubic-bezier
   *  formula for the anchors above), used to place the volume label. */
  labelX: number;
  labelY: number;
  /** Case volume moving along this transition, by reporting window. */
  volume: Record<PeriodId, number>;
  loop?: boolean;
}

function edgeId(from: StageId, to: StageId): EdgeId {
  return `${from}__${to}`;
}

export const EDGES: FlowEdge[] = [
  {
    id: edgeId("requested", "transit"),
    from: "requested",
    to: "transit",
    label: "Requested → In transit",
    d: "M160,230 L210,230",
    labelX: 185,
    labelY: 230,
    volume: { "30d": 1000, "90d": 2850 },
  },
  {
    id: edgeId("transit", "received"),
    from: "transit",
    to: "received",
    label: "In transit → Received",
    d: "M350,230 L400,230",
    labelX: 375,
    labelY: 230,
    volume: { "30d": 968, "90d": 2760 },
  },
  {
    id: edgeId("received", "inspect"),
    from: "received",
    to: "inspect",
    label: "Received → Re-inspected",
    d: "M540,230 L590,230",
    labelX: 565,
    labelY: 230,
    volume: { "30d": 1042, "90d": 2970 },
  },
  {
    id: edgeId("inspect", "approved"),
    from: "inspect",
    to: "approved",
    label: "Re-inspected → Approved",
    d: "M730,230 C780,230 730,100 780,100",
    labelX: 755,
    labelY: 165,
    volume: { "30d": 780, "90d": 2230 },
  },
  {
    id: edgeId("inspect", "disputed"),
    from: "inspect",
    to: "disputed",
    label: "Re-inspected → Disputed",
    d: "M730,230 C780,230 730,360 780,360",
    labelX: 755,
    labelY: 295,
    volume: { "30d": 262, "90d": 740 },
  },
  {
    id: edgeId("disputed", "escalated"),
    from: "disputed",
    to: "escalated",
    label: "Disputed → Escalated review",
    d: "M920,360 L970,360",
    labelX: 945,
    labelY: 360,
    volume: { "30d": 188, "90d": 530 },
  },
  {
    id: edgeId("disputed", "received"),
    from: "disputed",
    to: "received",
    label: "Disputed → Received (re-inspection requested)",
    d: "M850,388 C850,450 470,450 470,258",
    labelX: 660,
    labelY: 442,
    volume: { "30d": 74, "90d": 210 },
    loop: true,
  },
  {
    id: edgeId("escalated", "approved"),
    from: "escalated",
    to: "approved",
    label: "Escalated review → Approved",
    d: "M1040,332 C1130,332 1130,100 920,100",
    labelX: 1093,
    labelY: 216,
    volume: { "30d": 120, "90d": 330 },
  },
  {
    id: edgeId("escalated", "returned_seller"),
    from: "escalated",
    to: "returned_seller",
    label: "Escalated review → Returned to seller",
    d: "M1110,360 L1160,360",
    labelX: 1135,
    labelY: 360,
    volume: { "30d": 50, "90d": 140 },
  },
  {
    id: edgeId("approved", "refunded"),
    from: "approved",
    to: "refunded",
    label: "Approved → Refund issued",
    d: "M920,100 L1160,100",
    labelX: 1040,
    labelY: 100,
    volume: { "30d": 850, "90d": 2430 },
  },
];

export function edgeById(id: EdgeId): FlowEdge {
  const e = EDGES.find((ed) => ed.id === id);
  if (!e) throw new Error(`Unknown edge ${id}`);
  return e;
}

/** The 5 highest-volume transitions get a persistent on-graph number label
 *  instead of relying on hover/pin alone (edge thickness is never the only
 *  cue for volume). */
export const MAJOR_EDGE_IDS = new Set(
  [...EDGES]
    .sort((a, b) => b.volume["30d"] - a.volume["30d"])
    .slice(0, 5)
    .map((e) => e.id),
);

export function totalCases(period: PeriodId): number {
  return edgeById(edgeId("requested", "transit")).volume[period];
}

// ---------------------------------------------------------------------------
// Derived per-node stats (computed from the edge volumes above — never
// hand-duplicated, so the graph and the stage table can never disagree).
// ---------------------------------------------------------------------------

export interface StageStats {
  stage: Stage;
  inbound: number;
  outbound: number;
  /** Cases that have arrived but not yet moved on, within the window. */
  pooled: number;
  dwellDays: number | null;
  shareOfTotalPct: number;
  outgoing: { edge: FlowEdge; to: Stage; pct: number }[];
  incoming: { edge: FlowEdge; from: Stage; pct: number }[];
}

export function statsFor(id: StageId, period: PeriodId): StageStats {
  const stage = stageById(id);
  const incomingEdges = EDGES.filter((e) => e.to === id);
  const outgoingEdges = EDGES.filter((e) => e.from === id);
  const inbound = id === "requested" ? totalCases(period) : incomingEdges.reduce((s, e) => s + e.volume[period], 0);
  const outbound = outgoingEdges.reduce((s, e) => s + e.volume[period], 0);
  const pooled = stage.terminal ? 0 : Math.max(0, inbound - outbound);
  const dwellDays = stage.dwellDays ? stage.dwellDays[period] : null;
  const total = totalCases(period);
  return {
    stage,
    inbound,
    outbound,
    pooled,
    dwellDays,
    shareOfTotalPct: total > 0 ? (inbound / total) * 100 : 0,
    outgoing: outgoingEdges.map((edge) => ({
      edge,
      to: stageById(edge.to),
      pct: outbound > 0 ? (edge.volume[period] / outbound) * 100 : 0,
    })),
    incoming: incomingEdges.map((edge) => ({
      edge,
      from: stageById(edge.from),
      pct: inbound > 0 ? (edge.volume[period] / inbound) * 100 : 0,
    })),
  };
}

export function allStageStats(period: PeriodId): StageStats[] {
  return STAGES.map((s) => statsFor(s.id, period));
}

/** The bottleneck is computed, not asserted: whichever non-terminal stage
 *  has the highest average dwell time in the selected window. In both
 *  windows this lands on "Escalated review", which is also where volume
 *  visibly pools (inbound > outbound) — two independent signals agreeing. */
export function bottleneckStageId(period: PeriodId): StageId {
  const candidates = STAGES.filter((s): s is Stage & { dwellDays: Record<PeriodId, number> } => !s.terminal && !!s.dwellDays);
  let best = candidates[0];
  for (const s of candidates) {
    if (s.dwellDays[period] > best.dwellDays[period]) best = s;
  }
  return best.id;
}

export function medianDwellDays(period: PeriodId): number {
  const values = STAGES.filter((s) => s.dwellDays)
    .map((s) => (s.dwellDays as Record<PeriodId, number>)[period])
    .sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
}

// ---------------------------------------------------------------------------
// Top variant paths (filmstrip)
// ---------------------------------------------------------------------------

export type Outcome = "refunded" | "returned";

export interface FlowPath {
  id: string;
  label: string;
  stages: StageId[];
  volume: Record<PeriodId, number>;
  avgDurationDays: Record<PeriodId, number>;
  outcome: Outcome;
  throughEscalation: boolean;
  hasLoop: boolean;
  note: string;
}

export const PATHS: FlowPath[] = [
  {
    id: "standard",
    label: "Standard approval",
    stages: ["requested", "transit", "received", "inspect", "approved", "refunded"],
    volume: { "30d": 780, "90d": 2210 },
    avgDurationDays: { "30d": 5.6, "90d": 5.7 },
    outcome: "refunded",
    throughEscalation: false,
    hasLoop: false,
    note: "Passes re-inspection on the first pass, refunded without review.",
  },
  {
    id: "escalated-approved",
    label: "Escalated, then approved",
    stages: ["requested", "transit", "received", "inspect", "disputed", "escalated", "approved", "refunded"],
    volume: { "30d": 120, "90d": 330 },
    avgDurationDays: { "30d": 11.2, "90d": 11.5 },
    outcome: "refunded",
    throughEscalation: true,
    hasLoop: false,
    note: "Flagged at re-inspection, cleared on senior review, refunded.",
  },
  {
    id: "escalated-rejected",
    label: "Escalated, then rejected",
    stages: ["requested", "transit", "received", "inspect", "disputed", "escalated", "returned_seller"],
    volume: { "30d": 50, "90d": 140 },
    avgDurationDays: { "30d": 12.4, "90d": 12.6 },
    outcome: "returned",
    throughEscalation: true,
    hasLoop: false,
    note: "Senior review upholds the dispute; item returned, no refund.",
  },
  {
    id: "loop-approved",
    label: "Re-inspection loop, then approved",
    stages: ["requested", "transit", "received", "inspect", "disputed", "received", "inspect", "approved", "refunded"],
    volume: { "30d": 42, "90d": 130 },
    avgDurationDays: { "30d": 8.9, "90d": 9.1 },
    outcome: "refunded",
    throughEscalation: false,
    hasLoop: true,
    note: "A second physical inspection is requested instead of escalating; the case loops back through Received and Re-inspected before clearing.",
  },
];

export function pathById(id: string): FlowPath {
  const p = PATHS.find((pp) => pp.id === id);
  if (!p) throw new Error(`Unknown path ${id}`);
  return p;
}

export function pathSharePct(path: FlowPath, period: PeriodId): number {
  const total = totalCases(period);
  return total > 0 ? (path.volume[period] / total) * 100 : 0;
}

export function edgeIdsForPath(path: FlowPath): EdgeId[] {
  const ids: EdgeId[] = [];
  for (let i = 0; i < path.stages.length - 1; i++) {
    ids.push(edgeId(path.stages[i], path.stages[i + 1]));
  }
  return ids;
}

export function otherVariantsSharePct(period: PeriodId): number {
  const total = totalCases(period);
  const accounted = PATHS.reduce((s, p) => s + p.volume[period], 0);
  return total > 0 ? Math.max(0, ((total - accounted) / total) * 100) : 0;
}

// ---------------------------------------------------------------------------
// Pinned selection — a single "pin" that is EITHER a stage OR a path, never
// a bare shared `selectedId` threaded identically through every consumer.
// Each consumer below interprets the same union differently.
// ---------------------------------------------------------------------------

export type Selection = { kind: "stage"; id: StageId } | { kind: "path"; id: string } | null;

export function selectionEquals(a: Selection, b: Selection): boolean {
  if (a === null || b === null) return a === b;
  return a.kind === b.kind && a.id === b.id;
}

/** What the graph should visually emphasize for the current pin: the set of
 *  node ids and edge ids that belong to it. A pinned stage highlights the
 *  stage itself plus every edge touching it; a pinned path highlights every
 *  stage and edge the path visits (loops collapse to "visited", which is
 *  the correct picture for a static highlight). */
export function highlightForSelection(selection: Selection): { nodeIds: Set<StageId>; edgeIds: Set<EdgeId> } {
  if (!selection) return { nodeIds: new Set(), edgeIds: new Set() };
  if (selection.kind === "stage") {
    const id = selection.id;
    const touching = EDGES.filter((e) => e.from === id || e.to === id).map((e) => e.id);
    return { nodeIds: new Set([id]), edgeIds: new Set(touching) };
  }
  const path = pathById(selection.id);
  return { nodeIds: new Set(path.stages), edgeIds: new Set(edgeIdsForPath(path)) };
}

// ---------------------------------------------------------------------------
// Formatting helpers — plain Intl grouping only, never `notation: "compact"`
// (that hits real ICU-version hydration mismatches between Node and the
// browser in this repo, even for identical deterministic input numbers).
// ---------------------------------------------------------------------------

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(Math.round(n));
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function formatDays(n: number): string {
  return `${n.toFixed(1)}d`;
}

// ---------------------------------------------------------------------------
// Shared shell chrome data
// ---------------------------------------------------------------------------

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600";

export interface CaseNotification {
  id: string;
  title: string;
  meta: string;
  unread: boolean;
}

export const NOTIFICATIONS: CaseNotification[] = [
  { id: "n1", title: "Escalated review backlog crossed 18 cases", meta: "Return flow · 12m ago", unread: true },
  { id: "n2", title: "Case RTN-40218 re-inspection loop closed", meta: "Warehouse · 2h ago", unread: true },
  { id: "n3", title: "Weekly refund summary ready", meta: "Finance ops · Yesterday", unread: false },
];
