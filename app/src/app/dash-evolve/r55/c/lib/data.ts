// Deterministic demo data for the Arbor ESG facility scorecard. Every figure below is hand-set —
// no Math.random(), no Date.now(), no new Date(). Portfolio-level ticker stats are derived from
// this table at render time (see the compute* helpers), so a subtotal can never drift from the
// rows it is built from.

export type MetricId = "emissions" | "safety" | "compliance";

export interface MetricScore {
  prior: number;
  current: number;
}

export interface Facility {
  id: string;
  name: string;
  region: "North America" | "EMEA" | "APAC" | "LATAM";
  regionCode: "NA" | "EMEA" | "APAC" | "LATAM";
  type: "Manufacturing" | "Logistics" | "Data Center" | "Energy";
  emissions: MetricScore;
  safety: MetricScore;
  compliance: MetricScore;
}

export const PRIOR_LABEL = "Q2 FY26";
export const CURRENT_LABEL = "Q3 FY26";

// Compliance score below this line is treated as a governance flag, independent of whichever
// metric is the active view — it is always computed off `compliance.current`.
export const COMPLIANCE_FLAG_THRESHOLD = 75;

export const METRICS: { id: MetricId; label: string; shortLabel: string; description: string }[] = [
  {
    id: "emissions",
    label: "Emissions efficiency",
    shortLabel: "Emissions",
    description: "Emissions efficiency score — higher means lower intensity per unit of output.",
  },
  {
    id: "safety",
    label: "Safety performance",
    shortLabel: "Safety",
    description: "Safety performance score — incident rate, near-misses and training coverage.",
  },
  {
    id: "compliance",
    label: "Compliance",
    shortLabel: "Compliance",
    description: "Regulatory compliance score — audit findings, permits and attestations.",
  },
];

export const FACILITIES: Facility[] = [
  {
    id: "riverside-assembly",
    name: "Riverside Assembly",
    region: "North America",
    regionCode: "NA",
    type: "Manufacturing",
    emissions: { prior: 68.4, current: 74.1 },
    safety: { prior: 81.2, current: 83.6 },
    compliance: { prior: 90.5, current: 91.8 },
  },
  {
    id: "port-elizabeth-terminal",
    name: "Port Elizabeth Terminal",
    region: "EMEA",
    regionCode: "EMEA",
    type: "Logistics",
    emissions: { prior: 72.0, current: 69.3 },
    safety: { prior: 76.5, current: 79.0 },
    compliance: { prior: 84.2, current: 85.0 },
  },
  {
    id: "kestrel-data-center",
    name: "Kestrel Data Center",
    region: "North America",
    regionCode: "NA",
    type: "Data Center",
    emissions: { prior: 88.6, current: 91.2 },
    safety: { prior: 92.0, current: 94.5 },
    compliance: { prior: 95.1, current: 96.0 },
  },
  {
    id: "nagoya-fabrication-hub",
    name: "Nagoya Fabrication Hub",
    region: "APAC",
    regionCode: "APAC",
    type: "Manufacturing",
    emissions: { prior: 61.3, current: 58.0 },
    safety: { prior: 70.4, current: 68.1 },
    compliance: { prior: 79.0, current: 77.2 },
  },
  {
    id: "tilbury-distribution",
    name: "Tilbury Distribution",
    region: "EMEA",
    regionCode: "EMEA",
    type: "Logistics",
    emissions: { prior: 74.8, current: 78.6 },
    safety: { prior: 83.0, current: 85.4 },
    compliance: { prior: 88.0, current: 89.1 },
  },
  {
    id: "austin-battery-works",
    name: "Austin Battery Works",
    region: "North America",
    regionCode: "NA",
    type: "Manufacturing",
    emissions: { prior: 55.2, current: 63.9 },
    safety: { prior: 66.8, current: 72.0 },
    compliance: { prior: 74.5, current: 79.8 },
  },
  {
    id: "busan-cold-storage",
    name: "Busan Cold Storage",
    region: "APAC",
    regionCode: "APAC",
    type: "Logistics",
    emissions: { prior: 79.1, current: 77.0 },
    safety: { prior: 85.6, current: 84.9 },
    compliance: { prior: 90.0, current: 89.5 },
  },
  {
    id: "rotterdam-refinery",
    name: "Rotterdam Refinery",
    region: "EMEA",
    regionCode: "EMEA",
    type: "Energy",
    emissions: { prior: 48.6, current: 52.3 },
    safety: { prior: 60.2, current: 58.9 },
    compliance: { prior: 68.4, current: 70.1 },
  },
  {
    id: "guadalajara-electronics",
    name: "Guadalajara Electronics",
    region: "LATAM",
    regionCode: "LATAM",
    type: "Manufacturing",
    emissions: { prior: 70.5, current: 72.8 },
    safety: { prior: 78.9, current: 80.2 },
    compliance: { prior: 86.3, current: 87.0 },
  },
  {
    id: "perth-minerals-yard",
    name: "Perth Minerals Yard",
    region: "APAC",
    regionCode: "APAC",
    type: "Energy",
    emissions: { prior: 42.0, current: 38.4 },
    safety: { prior: 55.0, current: 50.2 },
    compliance: { prior: 65.0, current: 61.8 },
  },
];

// The facility pre-selected in the detail drawer on first paint — the single biggest decliner
// across all three metrics in this data set, so the drawer never opens on an empty/neutral story.
export const DEFAULT_PINNED_ID = "perth-minerals-yard";

export function metricOf(facility: Facility, metricId: MetricId): MetricScore {
  return facility[metricId];
}

export function deltaOf(facility: Facility, metricId: MetricId): number {
  const m = metricOf(facility, metricId);
  return round1(m.current - m.prior);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function isFlagged(facility: Facility): boolean {
  return facility.compliance.current < COMPLIANCE_FLAG_THRESHOLD;
}

export function flaggedCount(): number {
  return FACILITIES.filter(isFlagged).length;
}

export function averageScore(metricId: MetricId, period: "prior" | "current"): number {
  const total = FACILITIES.reduce((sum, f) => sum + metricOf(f, metricId)[period], 0);
  return round1(total / FACILITIES.length);
}

export function averageDelta(metricId: MetricId): number {
  return round1(averageScore(metricId, "current") - averageScore(metricId, "prior"));
}

export function improvingCount(metricId: MetricId): number {
  return FACILITIES.filter((f) => deltaOf(f, metricId) > 0).length;
}

export function topMover(metricId: MetricId): { facility: Facility; delta: number } {
  return FACILITIES.reduce<{ facility: Facility; delta: number }>(
    (best, f) => {
      const d = deltaOf(f, metricId);
      return Math.abs(d) > Math.abs(best.delta) ? { facility: f, delta: d } : best;
    },
    { facility: FACILITIES[0], delta: deltaOf(FACILITIES[0], metricId) },
  );
}

export type SortMode = "improvement" | "decline" | "name";

export function sortFacilities(metricId: MetricId, mode: SortMode, declineOnly: boolean): Facility[] {
  const base = declineOnly ? FACILITIES.filter((f) => deltaOf(f, metricId) < 0) : FACILITIES.slice();
  if (mode === "name") return base.sort((a, b) => a.name.localeCompare(b.name));
  if (mode === "decline") return base.sort((a, b) => deltaOf(a, metricId) - deltaOf(b, metricId));
  return base.sort((a, b) => deltaOf(b, metricId) - deltaOf(a, metricId));
}

export const WORKSPACES = ["Arbor Global Portfolio", "North America Region", "EMEA Region"];

export const CURRENT_USER = {
  name: "Priya Natarajan",
  role: "ESG Program Lead",
  photoId: "1580489944761-15a19d654956",
};

export const NOTIFICATIONS = [
  { id: "n1", title: "Perth Minerals Yard dropped below the compliance threshold", time: "2h ago" },
  { id: "n2", title: "Austin Battery Works filed Q3 safety attestation", time: "1d ago" },
  { id: "n3", title: "Quarterly scorecard locked for audit export", time: "3d ago" },
];
