/**
 * Warden — access-anomaly & trust/safety monitoring console.
 *
 * All data below is generated deterministically from a fixed seed and a fixed anchor
 * timestamp (integer LCG only — no Math.random, no Date.now(), no argument-less `new Date()`).
 * Every `new Date(...)` call passes explicit y/m/d[/h/min] arguments.
 *
 * Reconciliation: the network graph's edges are hand-authored fixed relationships; each
 * event's ego-network is *derived* from that fixed edge list plus the event's own actor/
 * target, so the adjacency table and the SVG graph always agree.
 */

// ---------------------------------------------------------------------------------------
// Deterministic RNG
// ---------------------------------------------------------------------------------------

function makeRng(seed: number) {
  let s = (seed % 233280 + 233280) % 233280 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Small deterministic string hash -> unsigned int, used to scope risk metrics to an actor. */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---------------------------------------------------------------------------------------
// Anchor time — "now" for this console, fixed (never wall-clock).
// ---------------------------------------------------------------------------------------

export const ANCHOR = new Date(2026, 8, 25, 14, 32); // Sep 25, 2026, 14:32

function minutesAgo(min: number): Date {
  return new Date(ANCHOR.getTime() - min * 60000);
}

// ---------------------------------------------------------------------------------------
// Nodes: accounts + services
// ---------------------------------------------------------------------------------------

export type NodeKind = "account" | "service";

export interface AccountNode {
  id: string;
  kind: "account";
  name: string;
  role: string;
  team: string;
  homeCity: string;
  homeCountry: string;
  external?: boolean;
}

export interface ServiceNode {
  id: string;
  kind: "service";
  name: string;
  category: string;
}

export type GraphNode = AccountNode | ServiceNode;

export const ACCOUNTS: AccountNode[] = [
  { id: "acc-elowen", kind: "account", name: "Elowen Park", role: "Site Reliability Engineer", team: "Platform", homeCity: "Denver", homeCountry: "United States" },
  { id: "acc-tobias", kind: "account", name: "Tobias Reyes", role: "Senior Support Agent", team: "Support", homeCity: "Manila", homeCountry: "Philippines" },
  { id: "acc-marguerite", kind: "account", name: "Marguerite Sato", role: "Finance Operations Lead", team: "Finance", homeCity: "Osaka", homeCountry: "Japan" },
  { id: "acc-declan", kind: "account", name: "Declan Osei", role: "Platform Admin", team: "Platform", homeCity: "Accra", homeCountry: "Ghana" },
  { id: "acc-nadia", kind: "account", name: "Nadia Kessler", role: "Security Analyst", team: "Trust & Safety", homeCity: "Berlin", homeCountry: "Germany" },
  { id: "acc-omar", kind: "account", name: "Omar Delacroix", role: "Backend Engineer", team: "Payments", homeCity: "Montreal", homeCountry: "Canada" },
  { id: "acc-ines", kind: "account", name: "Ines Thorne", role: "Customer Success Manager", team: "Support", homeCity: "Leeds", homeCountry: "United Kingdom" },
  { id: "acc-felix", kind: "account", name: "Felix Moreau", role: "DevOps Engineer", team: "Platform", homeCity: "Lyon", homeCountry: "France" },
  { id: "acc-saoirse", kind: "account", name: "Saoirse Byrne", role: "Data Analyst", team: "Analytics", homeCity: "Cork", homeCountry: "Ireland" },
  { id: "acc-jasper", kind: "account", name: "Jasper Lindqvist", role: "Billing Engineer", team: "Payments", homeCity: "Malmö", homeCountry: "Sweden" },
  { id: "acc-camille", kind: "account", name: "Camille Duarte", role: "IT Administrator", team: "Platform", homeCity: "Lisbon", homeCountry: "Portugal" },
  { id: "acc-anders", kind: "account", name: "Anders Vik", role: "Contract Engineer", team: "Platform", homeCity: "Oslo", homeCountry: "Norway", external: true },
  { id: "acc-hollis", kind: "account", name: "Hollis Bramwell", role: "Customer Support Lead", team: "Support", homeCity: "Austin", homeCountry: "United States" },
  { id: "acc-rosalind", kind: "account", name: "Rosalind Achterberg", role: "Compliance Officer", team: "Trust & Safety", homeCity: "Rotterdam", homeCountry: "Netherlands" },
];

export const SERVICES: ServiceNode[] = [
  { id: "svc-admin", kind: "service", name: "Admin Console", category: "Internal tooling" },
  { id: "svc-billing", kind: "service", name: "Billing API", category: "Payments" },
  { id: "svc-customerdb", kind: "service", name: "Customer Database", category: "Data store" },
  { id: "svc-payments", kind: "service", name: "Payments Gateway", category: "Payments" },
  { id: "svc-support", kind: "service", name: "Support Portal", category: "Internal tooling" },
  { id: "svc-analytics", kind: "service", name: "Analytics Warehouse", category: "Data store" },
  { id: "svc-idp", kind: "service", name: "Identity Provider", category: "Infrastructure" },
  { id: "svc-deploy", kind: "service", name: "Deploy Pipeline", category: "Infrastructure" },
];

const NODE_MAP = new Map<string, GraphNode>();
for (const a of ACCOUNTS) NODE_MAP.set(a.id, a);
for (const s of SERVICES) NODE_MAP.set(s.id, s);

export function getNode(id: string): GraphNode {
  const n = NODE_MAP.get(id);
  if (!n) throw new Error(`Unknown node id: ${id}`);
  return n;
}

// ---------------------------------------------------------------------------------------
// Fixed relationship graph (hand-authored, not generated — this is the ground truth the
// adjacency table and SVG graph both read from).
// ---------------------------------------------------------------------------------------

export type EdgeKind = "admin" | "access" | "peer" | "escalation";

export interface GraphEdge {
  a: string;
  b: string;
  kind: EdgeKind;
  since: string;
}

export const GLOBAL_EDGES: GraphEdge[] = [
  { a: "acc-elowen", b: "svc-deploy", kind: "admin", since: "Since Feb 2024" },
  { a: "acc-elowen", b: "svc-idp", kind: "access", since: "Since Feb 2024" },
  { a: "acc-elowen", b: "svc-admin", kind: "access", since: "Since Jun 2024" },
  { a: "acc-declan", b: "svc-admin", kind: "admin", since: "Since Nov 2022" },
  { a: "acc-declan", b: "svc-idp", kind: "admin", since: "Since Nov 2022" },
  { a: "acc-declan", b: "svc-deploy", kind: "access", since: "Since Nov 2022" },
  { a: "acc-declan", b: "svc-customerdb", kind: "admin", since: "Since Mar 2023" },
  { a: "acc-felix", b: "svc-deploy", kind: "admin", since: "Since Jan 2025" },
  { a: "acc-felix", b: "svc-analytics", kind: "access", since: "Since Jan 2025" },
  { a: "acc-camille", b: "svc-idp", kind: "admin", since: "Since Sep 2021" },
  { a: "acc-camille", b: "svc-admin", kind: "admin", since: "Since Sep 2021" },
  { a: "acc-anders", b: "svc-deploy", kind: "access", since: "Since Aug 2026" },
  { a: "acc-anders", b: "svc-admin", kind: "access", since: "Since Aug 2026" },
  { a: "acc-nadia", b: "svc-idp", kind: "access", since: "Since Apr 2024" },
  { a: "acc-nadia", b: "svc-customerdb", kind: "access", since: "Since Apr 2024" },
  { a: "acc-nadia", b: "svc-admin", kind: "access", since: "Since Apr 2024" },
  { a: "acc-rosalind", b: "svc-customerdb", kind: "access", since: "Since Jul 2023" },
  { a: "acc-rosalind", b: "svc-billing", kind: "access", since: "Since Jul 2023" },
  { a: "acc-marguerite", b: "svc-billing", kind: "admin", since: "Since May 2022" },
  { a: "acc-marguerite", b: "svc-payments", kind: "access", since: "Since May 2022" },
  { a: "acc-jasper", b: "svc-billing", kind: "admin", since: "Since Oct 2024" },
  { a: "acc-jasper", b: "svc-payments", kind: "admin", since: "Since Oct 2024" },
  { a: "acc-omar", b: "svc-payments", kind: "admin", since: "Since Feb 2023" },
  { a: "acc-omar", b: "svc-customerdb", kind: "access", since: "Since Feb 2023" },
  { a: "acc-tobias", b: "svc-support", kind: "access", since: "Since Jun 2025" },
  { a: "acc-tobias", b: "svc-customerdb", kind: "access", since: "Since Jun 2025" },
  { a: "acc-ines", b: "svc-support", kind: "admin", since: "Since Mar 2022" },
  { a: "acc-ines", b: "svc-customerdb", kind: "access", since: "Since Mar 2022" },
  { a: "acc-hollis", b: "svc-support", kind: "admin", since: "Since Jan 2021" },
  { a: "acc-hollis", b: "svc-customerdb", kind: "admin", since: "Since Jan 2021" },
  { a: "acc-saoirse", b: "svc-analytics", kind: "admin", since: "Since Dec 2024" },
  { a: "acc-saoirse", b: "svc-customerdb", kind: "access", since: "Since Dec 2024" },
  { a: "acc-elowen", b: "acc-felix", kind: "peer", since: "Shared on-call rotation" },
  { a: "acc-declan", b: "acc-camille", kind: "peer", since: "Shared admin group" },
  { a: "acc-declan", b: "acc-anders", kind: "peer", since: "Contractor sponsor" },
  { a: "acc-marguerite", b: "acc-jasper", kind: "peer", since: "Shared finance group" },
  { a: "acc-tobias", b: "acc-ines", kind: "peer", since: "Shared support queue" },
  { a: "acc-hollis", b: "acc-ines", kind: "peer", since: "Shared support queue" },
];

export function edgesFor(nodeId: string): GraphEdge[] {
  return GLOBAL_EDGES.filter((e) => e.a === nodeId || e.b === nodeId);
}

export function otherNode(edge: GraphEdge, nodeId: string): string {
  return edge.a === nodeId ? edge.b : edge.a;
}

// ---------------------------------------------------------------------------------------
// Event types
// ---------------------------------------------------------------------------------------

export type EventType =
  | "unusual-login"
  | "impossible-travel"
  | "permission-escalation"
  | "bulk-export"
  | "mfa-bypass"
  | "new-device"
  | "role-change";

export type Severity = "critical" | "high" | "medium" | "low";
export type EventStatus = "open" | "investigating" | "resolved" | "dismissed";

export const EVENT_TYPE_META: Record<EventType, { label: string; severity: Severity }> = {
  "impossible-travel": { label: "Impossible travel", severity: "critical" },
  "permission-escalation": { label: "Permission escalation", severity: "critical" },
  "bulk-export": { label: "Suspicious bulk export", severity: "critical" },
  "unusual-login": { label: "Unusual login location", severity: "high" },
  "mfa-bypass": { label: "MFA challenge bypassed", severity: "high" },
  "role-change": { label: "Role grant changed", severity: "medium" },
  "new-device": { label: "New device registered", severity: "low" },
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const STATUS_LABEL: Record<EventStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const LOCATIONS = [
  { city: "Denver", country: "United States" },
  { city: "Manila", country: "Philippines" },
  { city: "Osaka", country: "Japan" },
  { city: "Accra", country: "Ghana" },
  { city: "Berlin", country: "Germany" },
  { city: "Montreal", country: "Canada" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Minsk", country: "Belarus" },
  { city: "Jakarta", country: "Indonesia" },
  { city: "Reykjavik", country: "Iceland" },
  { city: "Tashkent", country: "Uzbekistan" },
  { city: "Austin", country: "United States" },
] as const;

const DEVICES = [
  "MacBook Pro (managed)",
  "Windows desktop (managed)",
  "Unmanaged Linux host",
  "iPhone 15",
  "Unknown device fingerprint",
  "Chrome on unmanaged VM",
] as const;

const IP_BASES = ["192.0.2", "198.51.100", "203.0.113"] as const; // RFC 5737 documentation ranges

const EVENT_TYPES: EventType[] = [
  "unusual-login", "impossible-travel", "permission-escalation", "bulk-export",
  "mfa-bypass", "new-device", "role-change",
];

const ROLE_GRANTS = ["Read-only", "Editor", "Admin", "Owner"] as const;

export interface SecurityEvent {
  id: string;
  type: EventType;
  severity: Severity;
  status: EventStatus;
  timestampMin: number; // minutes before ANCHOR
  actorId: string;
  targetId: string;
  targetKind: NodeKind;
  location: { city: string; country: string };
  device: string;
  ip: string;
  riskScore: number;
  recordCount?: number;
  fromRole?: string;
  toRole?: string;
  travelMin?: number;
  description: string;
}

function fmtInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

function buildEvent(index: number): SecurityEvent {
  const rng = makeRng(index * 7919 + 101);
  const type = EVENT_TYPES[Math.floor(rng() * EVENT_TYPES.length)];
  const meta = EVENT_TYPE_META[type];
  const actor = ACCOUNTS[Math.floor(rng() * ACCOUNTS.length)];

  const isGrantType = type === "permission-escalation" || type === "role-change";
  let targetId: string;
  let targetKind: NodeKind;
  if (isGrantType) {
    let grantee = ACCOUNTS[Math.floor(rng() * ACCOUNTS.length)];
    let guard = 0;
    while (grantee.id === actor.id && guard < 5) {
      grantee = ACCOUNTS[Math.floor(rng() * ACCOUNTS.length)];
      guard++;
    }
    targetId = grantee.id;
    targetKind = "account";
  } else {
    targetId = SERVICES[Math.floor(rng() * SERVICES.length)].id;
    targetKind = "service";
  }

  const timestampMin = 4 + Math.floor(rng() * 2200); // spread across ~36.7 hours

  const severity = meta.severity;
  const riskBase =
    severity === "critical" ? 80 : severity === "high" ? 58 : severity === "medium" ? 34 : 10;
  const riskSpread = severity === "low" ? 18 : 16;
  const riskScore = clamp(Math.round(riskBase + rng() * riskSpread), 4, 99);

  const location = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
  const device = DEVICES[Math.floor(rng() * DEVICES.length)];
  const ipBase = IP_BASES[Math.floor(rng() * IP_BASES.length)];
  const ip = `${ipBase}.${10 + Math.floor(rng() * 240)}`;

  const statusRoll = rng();
  let status: EventStatus;
  if (timestampMin < 90) {
    status = statusRoll < 0.7 ? "open" : "investigating";
  } else if (severity === "critical") {
    status = statusRoll < 0.45 ? "investigating" : statusRoll < 0.85 ? "open" : "resolved";
  } else if (severity === "high") {
    status = statusRoll < 0.35 ? "investigating" : statusRoll < 0.75 ? "resolved" : "open";
  } else {
    status = statusRoll < 0.55 ? "resolved" : statusRoll < 0.85 ? "dismissed" : "open";
  }

  const targetNode = getNode(targetId);
  let recordCount: number | undefined;
  let fromRole: string | undefined;
  let toRole: string | undefined;
  let travelMin: number | undefined;

  let description = "";
  const svcName = targetKind === "service" ? targetNode.name : "";
  switch (type) {
    case "unusual-login":
      description = `${actor.name} signed in from ${location.city}, ${location.country} — outside their usual ${actor.homeCity} region.`;
      break;
    case "impossible-travel": {
      travelMin = 8 + Math.floor(rng() * 40);
      description = `${actor.name}'s session moved from ${actor.homeCity} to ${location.city} in under ${travelMin} minutes — physically impossible.`;
      break;
    }
    case "permission-escalation": {
      const grantee = getNode(targetId);
      description = `${actor.name} granted ${grantee.kind === "account" ? grantee.name : ""} elevated access via the ${["Admin Console", "Identity Provider"][Math.floor(rng() * 2)]}.`;
      break;
    }
    case "bulk-export": {
      recordCount = 800 + Math.floor(rng() * 40) * 500;
      description = `${actor.name} exported ${fmtInt(recordCount)} records from ${svcName} in a single session.`;
      break;
    }
    case "mfa-bypass":
      description = `${actor.name}'s MFA challenge on ${svcName} was bypassed using a backup recovery code.`;
      break;
    case "new-device":
      description = `${actor.name} registered a new device (${device}) for ${svcName} access.`;
      break;
    case "role-change": {
      const fromI = Math.floor(rng() * ROLE_GRANTS.length);
      let toI = Math.floor(rng() * ROLE_GRANTS.length);
      if (toI === fromI) toI = (toI + 1) % ROLE_GRANTS.length;
      fromRole = ROLE_GRANTS[Math.min(fromI, toI)];
      toRole = ROLE_GRANTS[Math.max(fromI, toI)];
      const grantee = getNode(targetId);
      description = `${actor.name} changed ${grantee.kind === "account" ? grantee.name : ""}'s role on ${["the Admin Console", "the Support Portal", "the Billing API"][Math.floor(rng() * 3)]} from ${fromRole} to ${toRole}.`;
      break;
    }
  }

  return {
    id: `evt-${index}`,
    type, severity, status, timestampMin,
    actorId: actor.id, targetId, targetKind,
    location, device, ip, riskScore,
    recordCount, fromRole, toRole, travelMin,
    description,
  };
}

const EVENT_COUNT = 34;

export const EVENTS: SecurityEvent[] = Array.from({ length: EVENT_COUNT }, (_, i) => buildEvent(i))
  .sort((a, b) => a.timestampMin - b.timestampMin);

export function getEvent(id: string): SecurityEvent {
  const e = EVENTS.find((ev) => ev.id === id);
  if (!e) throw new Error(`Unknown event id: ${id}`);
  return e;
}

// ---------------------------------------------------------------------------------------
// Ego-network builder — the same fixed edge list feeds both the SVG graph and the
// adjacency table fallback, so they can never disagree.
// ---------------------------------------------------------------------------------------

export interface EgoNetwork {
  focalId: string;
  targetId: string;
  neighborIds: string[]; // includes targetId first, then known relationships
  knownEdges: { edge: GraphEdge; otherId: string }[];
  flaggedEdgeLabel: string;
}

const MAX_NEIGHBORS = 6;

export function buildEgoNetwork(event: SecurityEvent): EgoNetwork {
  const focalId = event.actorId;
  const known = edgesFor(focalId).map((edge) => ({ edge, otherId: otherNode(edge, focalId) }));

  const neighborIds: string[] = [];
  const knownEdges: { edge: GraphEdge; otherId: string }[] = [];

  if (event.targetId !== focalId) neighborIds.push(event.targetId);

  for (const rel of known) {
    if (neighborIds.length >= MAX_NEIGHBORS) break;
    if (rel.otherId === event.targetId) {
      knownEdges.push(rel);
      continue;
    }
    if (!neighborIds.includes(rel.otherId)) {
      neighborIds.push(rel.otherId);
      knownEdges.push(rel);
    }
  }

  return {
    focalId,
    targetId: event.targetId,
    neighborIds,
    knownEdges,
    flaggedEdgeLabel: EVENT_TYPE_META[event.type].label,
  };
}

// ---------------------------------------------------------------------------------------
// Risk metric strip — org-wide default, or narrowed to a pinned event's actor.
// ---------------------------------------------------------------------------------------

export interface RiskMetric {
  key: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  goodDirection: "down" | "up";
}

export function orgRiskMetrics(): RiskMetric[] {
  return [
    { key: "anomaly-rate", label: "Anomaly rate", current: 4.8, target: 2.0, unit: " /1k sessions", goodDirection: "down" },
    { key: "mtta", label: "Mean time to triage", current: 22, target: 15, unit: " min", goodDirection: "down" },
    { key: "open-cases", label: "Open investigations", current: 9, target: 5, unit: "", goodDirection: "down" },
  ];
}

export function actorRiskMetrics(actorId: string): RiskMetric[] {
  const h = hashId(actorId);
  const anomalyRate = Math.round((1.0 + (h % 40) / 10) * 10) / 10;
  const mtta = 8 + (h % 30);
  const openCases = (h >> 3) % 6;
  return [
    { key: "anomaly-rate", label: "Anomaly rate (this actor)", current: anomalyRate, target: 2.0, unit: " /1k sessions", goodDirection: "down" },
    { key: "mtta", label: "Triage time (this actor)", current: mtta, target: 15, unit: " min", goodDirection: "down" },
    { key: "open-cases", label: "Open cases (this actor)", current: openCases, target: 3, unit: "", goodDirection: "down" },
  ];
}

// ---------------------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------------------

const numberFmt = new Intl.NumberFormat("en-US");

export function fmtNumber(v: number): string {
  return numberFmt.format(v);
}

export function fmtRelative(min: number): string {
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} d ago`;
}

export function fmtAbsolute(min: number): string {
  return minutesAgo(min).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}
