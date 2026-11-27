// Tendril — vendor dependency & concentration-risk graph for "Aurora Electronics" workspace.
//
// Every number below is a hand-authored literal, never derived from Math.random/Date.now/new
// Date. Node screen positions are the one thing that IS computed — by a fixed radial-ring
// trigonometric layout run at render time with a fixed seed (index order in these literal
// arrays), per the catalog's "deterministic node positions" rule for network graphs. Every
// coordinate is rounded to 2 decimals.

export type Tier = "site" | "tier1" | "tier2";
export type RiskBand = "low" | "medium" | "high" | "critical";

export interface SiteNode {
  id: string;
  tier: "site";
  code: string;
  name: string;
  category: string;
  country: string;
}

export interface SupplierNode {
  id: string;
  tier: "tier1" | "tier2";
  code: string;
  name: string;
  category: string;
  country: string;
  riskScore: number;
  ownerId: string;
}

export type GraphNodeData = SiteNode | SupplierNode;

export interface SpendEdge {
  source: string;
  target: string;
  spendUsd: number;
}

export interface DepEdge {
  source: string;
  target: string;
}

export interface Owner {
  id: string;
  name: string;
  role: string;
  photoId: string;
}

export const OWNERS: Owner[] = [
  { id: "owner-1", name: "Maya Thorne", role: "Procurement lead", photoId: "1494790108377-be9c29b29330" },
  { id: "owner-2", name: "Dario Fenwick", role: "Procurement lead", photoId: "1507003211169-0a1dd7228f2d" },
  { id: "owner-3", name: "Priya Osei", role: "Risk analyst", photoId: "1544005313-94ddf0286df2" },
  { id: "owner-4", name: "Lucas Bramwell", role: "Risk analyst", photoId: "1500648767791-00dcc994a43e" },
];

export const SITES: SiteNode[] = [
  { id: "site-austin", tier: "site", code: "AUS", name: "Austin Assembly", category: "Final assembly", country: "United States" },
  { id: "site-penang", tier: "site", code: "PEN", name: "Penang Fab", category: "Semiconductor fab", country: "Malaysia" },
  { id: "site-guadalajara", tier: "site", code: "GUA", name: "Guadalajara SMT", category: "Surface-mount line", country: "Mexico" },
  { id: "site-eindhoven", tier: "site", code: "EIN", name: "Eindhoven DC", category: "Distribution center", country: "Netherlands" },
];

export const TIER1: SupplierNode[] = [
  { id: "t1-calder", tier: "tier1", code: "T1-01", name: "Calder Semiconductor", category: "Semiconductors", country: "Taiwan", riskScore: 72, ownerId: "owner-1" },
  { id: "t1-ridgeline", tier: "tier1", code: "T1-02", name: "Ridgeline PCB", category: "PCB & substrates", country: "South Korea", riskScore: 44, ownerId: "owner-2" },
  { id: "t1-vantage", tier: "tier1", code: "T1-03", name: "Vantage Connectors", category: "Connectors", country: "Germany", riskScore: 38, ownerId: "owner-3" },
  { id: "t1-solace", tier: "tier1", code: "T1-04", name: "Solace Power Systems", category: "Power modules", country: "Vietnam", riskScore: 61, ownerId: "owner-4" },
  { id: "t1-northfield", tier: "tier1", code: "T1-05", name: "Northfield Passives", category: "Passives", country: "Japan", riskScore: 29, ownerId: "owner-1" },
  { id: "t1-harrow", tier: "tier1", code: "T1-06", name: "Harrow Optics", category: "Optics & sensors", country: "Germany", riskScore: 55, ownerId: "owner-2" },
  { id: "t1-brightline", tier: "tier1", code: "T1-07", name: "Brightline Enclosures", category: "Enclosures", country: "Mexico", riskScore: 33, ownerId: "owner-3" },
  { id: "t1-delta", tier: "tier1", code: "T1-08", name: "Delta Fastening Co.", category: "Fasteners", country: "United States", riskScore: 22, ownerId: "owner-4" },
  { id: "t1-quaystone", tier: "tier1", code: "T1-09", name: "Quaystone Packaging", category: "Packaging", country: "Vietnam", riskScore: 27, ownerId: "owner-1" },
  { id: "t1-ferrovia", tier: "tier1", code: "T1-10", name: "Ferrovia Cable", category: "Cabling & harness", country: "China", riskScore: 68, ownerId: "owner-2" },
  { id: "t1-amberlight", tier: "tier1", code: "T1-11", name: "Amberlight Displays", category: "Displays", country: "South Korea", riskScore: 58, ownerId: "owner-3" },
  { id: "t1-kestrel", tier: "tier1", code: "T1-12", name: "Kestrel Battery Labs", category: "Battery cells", country: "China", riskScore: 77, ownerId: "owner-4" },
  { id: "t1-union", tier: "tier1", code: "T1-13", name: "Union Thermal", category: "Thermal management", country: "United States", riskScore: 41, ownerId: "owner-1" },
  { id: "t1-palisade", tier: "tier1", code: "T1-14", name: "Palisade Molding", category: "Injection molding", country: "Mexico", riskScore: 36, ownerId: "owner-2" },
];

export const TIER2: SupplierNode[] = [
  { id: "t2-meridian", tier: "tier2", code: "T2-01", name: "Meridian Metals", category: "Raw copper & alloys", country: "Chile", riskScore: 64, ownerId: "owner-3" },
  { id: "t2-baltic", tier: "tier2", code: "T2-02", name: "Baltic Resin Co.", category: "Epoxy resins", country: "Poland", riskScore: 48, ownerId: "owner-4" },
  { id: "t2-sumitera", tier: "tier2", code: "T2-03", name: "Sumitera Rare Earths", category: "Rare earths", country: "Japan", riskScore: 81, ownerId: "owner-1" },
  { id: "t2-choson", tier: "tier2", code: "T2-04", name: "Choson Wafer Supply", category: "Silicon wafers", country: "South Korea", riskScore: 70, ownerId: "owner-2" },
  { id: "t2-velden", tier: "tier2", code: "T2-05", name: "Velden Glass Works", category: "Specialty glass", country: "Germany", riskScore: 39, ownerId: "owner-3" },
  { id: "t2-arcos", tier: "tier2", code: "T2-06", name: "Arcos Mining Group", category: "Rare metals", country: "Peru", riskScore: 73, ownerId: "owner-4" },
  { id: "t2-tollgate", tier: "tier2", code: "T2-07", name: "Tollgate Chemicals", category: "Industrial solvents", country: "United States", riskScore: 35, ownerId: "owner-1" },
  { id: "t2-novaprene", tier: "tier2", code: "T2-08", name: "Novaprene Elastomers", category: "Elastomers", country: "Malaysia", riskScore: 29, ownerId: "owner-2" },
  { id: "t2-esker", tier: "tier2", code: "T2-09", name: "Esker Steel Mill", category: "Structural steel", country: "Vietnam", riskScore: 52, ownerId: "owner-3" },
  { id: "t2-vireo", tier: "tier2", code: "T2-10", name: "Vireo Films", category: "Optical films", country: "Taiwan", riskScore: 46, ownerId: "owner-4" },
  { id: "t2-castellan", tier: "tier2", code: "T2-11", name: "Castellan Fastener Supply", category: "Fastener stock", country: "China", riskScore: 31, ownerId: "owner-1" },
  { id: "t2-hallow", tier: "tier2", code: "T2-12", name: "Hallow Point Ceramics", category: "Technical ceramics", country: "Japan", riskScore: 58, ownerId: "owner-2" },
  { id: "t2-driftwood", tier: "tier2", code: "T2-13", name: "Driftwood Pulp & Fiber", category: "Packaging substrate", country: "Indonesia", riskScore: 24, ownerId: "owner-3" },
  { id: "t2-ironvale", tier: "tier2", code: "T2-14", name: "Ironvale Forging", category: "Metal forging", country: "Germany", riskScore: 42, ownerId: "owner-4" },
  { id: "t2-solenne", tier: "tier2", code: "T2-15", name: "Solenne Battery Chem", category: "Battery chemistry", country: "China", riskScore: 79, ownerId: "owner-1" },
  { id: "t2-palmerston", tier: "tier2", code: "T2-16", name: "Palmerston Dyes & Coatings", category: "Dyes & coatings", country: "South Korea", riskScore: 33, ownerId: "owner-2" },
  { id: "t2-birchgate", tier: "tier2", code: "T2-17", name: "Birchgate Adhesives", category: "Industrial adhesives", country: "United States", riskScore: 27, ownerId: "owner-3" },
  { id: "t2-kelvora", tier: "tier2", code: "T2-18", name: "Kelvora Cryo Gases", category: "Industrial gases", country: "Netherlands", riskScore: 45, ownerId: "owner-4" },
  { id: "t2-thornefield", tier: "tier2", code: "T2-19", name: "Thornefield Textiles", category: "Insulation textiles", country: "Vietnam", riskScore: 21, ownerId: "owner-1" },
  { id: "t2-greywick", tier: "tier2", code: "T2-20", name: "Greywick Mining Co.", category: "Cobalt mining", country: "DR Congo", riskScore: 85, ownerId: "owner-2" },
];

export const ALL_NODES: GraphNodeData[] = [...SITES, ...TIER1, ...TIER2];
export const NODE_BY_ID = new Map(ALL_NODES.map((n) => [n.id, n]));

/** Narrows a node to its supplier variant (tier-1 or tier-2, which carry riskScore/ownerId) —
 *  used everywhere instead of an `as` cast, so the compiler actually proves the narrowing. */
export function isSupplierNode(n: GraphNodeData): n is SupplierNode {
  return n.tier !== "site";
}

// Site → tier-1 edges, weighted by annual spend (USD, millions).
export const SPEND_EDGES: SpendEdge[] = [
  { source: "site-austin", target: "t1-calder", spendUsd: 4_200_000 },
  { source: "site-austin", target: "t1-vantage", spendUsd: 1_100_000 },
  { source: "site-austin", target: "t1-delta", spendUsd: 600_000 },
  { source: "site-austin", target: "t1-union", spendUsd: 900_000 },
  { source: "site-austin", target: "t1-kestrel", spendUsd: 3_400_000 },

  { source: "site-penang", target: "t1-calder", spendUsd: 2_800_000 },
  { source: "site-penang", target: "t1-ridgeline", spendUsd: 2_100_000 },
  { source: "site-penang", target: "t1-northfield", spendUsd: 1_400_000 },
  { source: "site-penang", target: "t1-amberlight", spendUsd: 1_900_000 },
  { source: "site-penang", target: "t1-ferrovia", spendUsd: 1_200_000 },

  { source: "site-guadalajara", target: "t1-brightline", spendUsd: 1_600_000 },
  { source: "site-guadalajara", target: "t1-palisade", spendUsd: 1_100_000 },
  { source: "site-guadalajara", target: "t1-delta", spendUsd: 500_000 },
  { source: "site-guadalajara", target: "t1-quaystone", spendUsd: 700_000 },
  { source: "site-guadalajara", target: "t1-solace", spendUsd: 1_800_000 },

  { source: "site-eindhoven", target: "t1-harrow", spendUsd: 1_300_000 },
  { source: "site-eindhoven", target: "t1-vantage", spendUsd: 800_000 },
  { source: "site-eindhoven", target: "t1-union", spendUsd: 600_000 },
  { source: "site-eindhoven", target: "t1-ferrovia", spendUsd: 900_000 },
];

// Tier-1 → tier-2 sourcing dependencies. Unweighted (sub-tier lineage, not a direct spend
// relationship) — a tier-2 node that several tier-1 vendors depend on is the single-source
// concentration-risk signal this whole product exists to surface.
export const DEP_EDGES: DepEdge[] = [
  { source: "t1-ferrovia", target: "t2-meridian" },
  { source: "t1-vantage", target: "t2-meridian" },
  { source: "t1-union", target: "t2-meridian" },

  { source: "t1-ridgeline", target: "t2-baltic" },

  { source: "t1-kestrel", target: "t2-sumitera" },
  { source: "t1-solace", target: "t2-sumitera" },

  { source: "t1-calder", target: "t2-choson" },

  { source: "t1-harrow", target: "t2-velden" },

  { source: "t1-kestrel", target: "t2-arcos" },

  { source: "t1-quaystone", target: "t2-tollgate" },

  { source: "t1-palisade", target: "t2-novaprene" },

  { source: "t1-brightline", target: "t2-esker" },
  { source: "t1-delta", target: "t2-esker" },

  { source: "t1-amberlight", target: "t2-vireo" },

  { source: "t1-delta", target: "t2-castellan" },

  { source: "t1-northfield", target: "t2-hallow" },
  { source: "t1-calder", target: "t2-hallow" },

  { source: "t1-quaystone", target: "t2-driftwood" },

  { source: "t1-union", target: "t2-ironvale" },
  { source: "t1-vantage", target: "t2-ironvale" },

  { source: "t1-kestrel", target: "t2-solenne" },

  { source: "t1-brightline", target: "t2-palmerston" },

  { source: "t1-ridgeline", target: "t2-birchgate" },
  { source: "t1-quaystone", target: "t2-birchgate" },

  { source: "t1-harrow", target: "t2-kelvora" },

  { source: "t1-solace", target: "t2-thornefield" },

  { source: "t1-kestrel", target: "t2-greywick" },
  { source: "t1-solace", target: "t2-greywick" },
];

export const ALL_EDGES = [
  ...SPEND_EDGES.map((e) => ({ ...e, kind: "spend" as const })),
  ...DEP_EDGES.map((e) => ({ ...e, kind: "dependency" as const, spendUsd: undefined })),
];

// --- Derived, never hand-duplicated --------------------------------------------------------

export function riskBand(score: number): RiskBand {
  if (score >= 75) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export const RISK_BAND_LABEL: Record<RiskBand, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const TIER_LABEL: Record<Tier, string> = {
  site: "Internal site",
  tier1: "Tier-1 supplier",
  tier2: "Tier-2 sub-supplier",
};

function fanInCount(targetId: string): number {
  return DEP_EDGES.filter((e) => e.target === targetId).length;
}

/** Tier-2 nodes depended on by 2+ tier-1 vendors — a single disruption there ripples into
 *  multiple direct suppliers at once. This is the headline "concentration risk" count. */
export const CONCENTRATION_RISK_IDS = new Set(TIER2.filter((n) => fanInCount(n.id) >= 2).map((n) => n.id));

export function isConcentrationRisk(id: string): boolean {
  return CONCENTRATION_RISK_IDS.has(id);
}

export const TOTAL_ANNUAL_SPEND_USD = SPEND_EDGES.reduce((sum, e) => sum + e.spendUsd, 0);

export const AVG_RISK_SCORE = Math.round(
  [...TIER1, ...TIER2].reduce((sum, n) => sum + n.riskScore, 0) / (TIER1.length + TIER2.length),
);

export interface CategoryTotal {
  category: string;
  vendorId: string;
  vendorName: string;
  spendUsd: number;
  riskBand: RiskBand;
}

/** Spend aggregated by tier-1 category — the small-multiples strip's data. Reduced directly
 *  from SPEND_EDGES + TIER1, never re-typed as separate "plausible" figures. */
export const CATEGORY_TOTALS: CategoryTotal[] = TIER1.map((vendor) => {
  const spendUsd = SPEND_EDGES.filter((e) => e.target === vendor.id).reduce((sum, e) => sum + e.spendUsd, 0);
  return {
    category: vendor.category,
    vendorId: vendor.id,
    vendorName: vendor.name,
    spendUsd,
    riskBand: riskBand(vendor.riskScore),
  };
})
  .filter((c) => c.spendUsd > 0)
  .sort((a, b) => b.spendUsd - a.spendUsd);

/**
 * Edge direction throughout this file is "sources from": a site sources from its tier-1
 * vendors, a tier-1 vendor sources from its tier-2 sub-suppliers. So, in supply-chain terms,
 * `upstream` (what a node depends on / sources from) follows edges where this id is the
 * SOURCE, and `downstream` (who depends on this node) follows edges where it is the TARGET —
 * the reverse of the raw edge direction.
 */
export function neighborsOf(id: string): { upstream: GraphNodeData[]; downstream: GraphNodeData[] } {
  const upstream: GraphNodeData[] = [];
  const downstream: GraphNodeData[] = [];
  for (const e of [...SPEND_EDGES, ...DEP_EDGES]) {
    if (e.source === id) {
      const n = NODE_BY_ID.get(e.target);
      if (n) upstream.push(n);
    }
    if (e.target === id) {
      const n = NODE_BY_ID.get(e.source);
      if (n) downstream.push(n);
    }
  }
  return { upstream, downstream };
}

export function edgesTouching(id: string): Set<string> {
  const touching = new Set<string>();
  for (const e of ALL_EDGES) {
    if (e.source === id || e.target === id) touching.add(`${e.source}__${e.target}`);
  }
  return touching;
}

export function ownerOf(ownerId: string | undefined): Owner | null {
  if (!ownerId) return null;
  return OWNERS.find((o) => o.id === ownerId) ?? null;
}

export function spendIncomingTo(id: string): number {
  return SPEND_EDGES.filter((e) => e.target === id).reduce((sum, e) => sum + e.spendUsd, 0);
}

export function spendOutgoingFrom(id: string): number {
  return SPEND_EDGES.filter((e) => e.source === id).reduce((sum, e) => sum + e.spendUsd, 0);
}

// --- Deterministic radial layout ------------------------------------------------------------
// Fixed 1000×560 coordinate space, three concentric rings (site / tier-1 / tier-2), node order
// taken straight from the literal arrays above (the "fixed seed"). Ring radii use ry = rx*0.56
// so a ring reads as a true ellipse matching the 1000:560 canvas aspect, never a lopsided oval.

const CANVAS_W = 1000;
const CANVAS_H = 560;
const CENTER_X = 500;
const CENTER_Y = 280;
const RING_ASPECT = 0.56;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function ringLayout(count: number, rx: number): Array<{ x: number; y: number }> {
  const ry = round2(rx * RING_ASPECT);
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i += 1) {
    const angleDeg = -90 + (360 / count) * i;
    const rad = (angleDeg * Math.PI) / 180;
    points.push({
      x: round2(CENTER_X + rx * Math.cos(rad)),
      y: round2(CENTER_Y + ry * Math.sin(rad)),
    });
  }
  return points;
}

export interface LaidOutNode {
  node: GraphNodeData;
  x: number;
  y: number;
  xPct: number;
  yPct: number;
}

function toLaidOut(nodes: GraphNodeData[], points: Array<{ x: number; y: number }>): LaidOutNode[] {
  return nodes.map((node, i) => ({
    node,
    x: points[i].x,
    y: points[i].y,
    xPct: round2((points[i].x / CANVAS_W) * 100),
    yPct: round2((points[i].y / CANVAS_H) * 100),
  }));
}

export const LAID_OUT_NODES: LaidOutNode[] = [
  ...toLaidOut(SITES, ringLayout(SITES.length, 85)),
  ...toLaidOut(TIER1, ringLayout(TIER1.length, 260)),
  ...toLaidOut(TIER2, ringLayout(TIER2.length, 420)),
];

export const FLAT_ORDER: string[] = LAID_OUT_NODES.map((l) => l.node.id);

// Six-month trailing network spend run-rate, in whole USD — literal figures, independent of
// the per-vendor totals above (this tracks total monthly commitments, not cumulative spend).
export const MONTHLY_SPEND_TREND_USD: number[] = [2_140_000, 2_260_000, 2_190_000, 2_380_000, 2_310_000, 2_470_000];

// --- Formatting -----------------------------------------------------------------------------

export function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function usdCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return usd(n);
}

export function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}
