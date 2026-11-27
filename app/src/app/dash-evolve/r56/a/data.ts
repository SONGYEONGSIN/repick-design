import {
  BadgeCheck,
  Building2,
  Clock,
  CircleAlert,
  Factory,
  Leaf,
  type LucideIcon,
  PackageSearch,
  RotateCcw,
  Scale,
  Store,
  Wrench,
} from "lucide-react";
import type { Direction } from "./tokens";

export const BRAND = { name: "Arbor", Icon: Leaf };

export const CURRENT_USER = {
  name: "Dana Ferreira",
  role: "ESG operations lead",
  email: "dana.ferreira@repick.com",
  avatarId: "1580489944761-15a19d654956",
};

export const WORKSPACES = [
  { id: "network", name: "repick facility network", plan: "12 sites" },
  { id: "us-west", name: "West region pod", plan: "4 sites" },
  { id: "us-east", name: "East region pod", plan: "4 sites" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "scorecard", label: "Scorecard", Icon: Scale, active: true },
      { id: "facilities", label: "Facilities", Icon: Factory },
      { id: "incidents", label: "Incidents", Icon: CircleAlert },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "trends", label: "Trends", Icon: Clock, disabled: true },
      { id: "reports", label: "Reports", Icon: BadgeCheck, disabled: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Facilities — the single source of truth. Every derived number shown anywhere
// on this page (ticker KPIs, table cells, slope-chart rows, the detail panel)
// is computed from this one list by the functions below. Nothing is ever
// hand-duplicated into a second, independently-maintained number.
// ---------------------------------------------------------------------------

export type Region = "West Coast" | "Mountain West" | "Midwest" | "Gulf Coast" | "Southeast" | "Northeast";
export type FacilityType = "Sorting hub" | "Repair & refurb" | "Distribution center" | "Returns processing" | "Resale showroom";
export type Certification = "Certified" | "In review" | "Not certified";

export interface Facility {
  id: string;
  name: string;
  region: Region;
  type: FacilityType;
  /** Current-quarter sub-scores, 0-100. Overall current score is always derived from these. */
  environmental: number;
  social: number;
  governance: number;
  /** Overall ESG score for the four quarters before this one: [Q-4, Q-3, Q-2, Q-1]. */
  historyPrev: [number, number, number, number];
  certification: Certification;
  openIncidents: number;
  description: string;
}

export const FACILITY_TYPE_META: Record<FacilityType, { Icon: LucideIcon }> = {
  "Sorting hub": { Icon: PackageSearch },
  "Repair & refurb": { Icon: Wrench },
  "Distribution center": { Icon: Factory },
  "Returns processing": { Icon: RotateCcw },
  "Resale showroom": { Icon: Store },
};

export const CERTIFICATION_META: Record<Certification, { Icon: LucideIcon; className: string }> = {
  Certified: { Icon: BadgeCheck, className: "border-lime-200 bg-lime-50 text-lime-800" },
  "In review": { Icon: Clock, className: "border-zinc-200 bg-zinc-100 text-zinc-600" },
  "Not certified": { Icon: CircleAlert, className: "border-zinc-300 bg-zinc-100 text-zinc-700" },
};

export const FACILITIES: Facility[] = [
  {
    id: "portland-sort",
    name: "Portland Sorting Hub",
    region: "West Coast",
    type: "Sorting hub",
    environmental: 82,
    social: 78,
    governance: 74,
    historyPrev: [69, 71, 73, 75],
    certification: "Certified",
    openIncidents: 1,
    description: "Intake sorting and grading for West Coast inbound trade-ins.",
  },
  {
    id: "oakland-refurb",
    name: "Oakland Refurb Center",
    region: "West Coast",
    type: "Repair & refurb",
    environmental: 84,
    social: 88,
    governance: 82,
    historyPrev: [77, 79, 81, 83],
    certification: "Certified",
    openIncidents: 1,
    description: "Electronics and appliance refurbishment, West Coast coverage.",
  },
  {
    id: "denver-resale",
    name: "Denver Resale Showroom",
    region: "Mountain West",
    type: "Resale showroom",
    environmental: 91,
    social: 85,
    governance: 80,
    historyPrev: [79, 81, 83, 84],
    certification: "Certified",
    openIncidents: 0,
    description: "Flagship retail floor for graded resale inventory.",
  },
  {
    id: "phoenix-sort",
    name: "Phoenix Sorting Hub",
    region: "Mountain West",
    type: "Sorting hub",
    environmental: 58,
    social: 62,
    governance: 60,
    historyPrev: [64, 62, 61, 60],
    certification: "Not certified",
    openIncidents: 6,
    description: "Secondary sorting hub, added capacity for peak-season intake.",
  },
  {
    id: "columbus-dist",
    name: "Columbus Distribution Center",
    region: "Midwest",
    type: "Distribution center",
    environmental: 70,
    social: 75,
    governance: 72,
    historyPrev: [74, 73, 71, 70],
    certification: "In review",
    openIncidents: 3,
    description: "Outbound fulfillment hub for the Midwest region.",
  },
  {
    id: "chicago-dist",
    name: "Chicago Distribution Center",
    region: "Midwest",
    type: "Distribution center",
    environmental: 73,
    social: 70,
    governance: 76,
    historyPrev: [70, 71, 72, 73],
    certification: "In review",
    openIncidents: 2,
    description: "Regional overflow fulfillment and cross-dock facility.",
  },
  {
    id: "houston-sort",
    name: "Houston Sorting Hub",
    region: "Gulf Coast",
    type: "Sorting hub",
    environmental: 60,
    social: 66,
    governance: 64,
    historyPrev: [68, 66, 65, 64],
    certification: "Not certified",
    openIncidents: 5,
    description: "Gulf Coast intake sorting, serving three metro drop-off networks.",
  },
  {
    id: "tampa-refurb",
    name: "Tampa Refurb Center",
    region: "Gulf Coast",
    type: "Repair & refurb",
    environmental: 77,
    social: 74,
    governance: 73,
    historyPrev: [71, 72, 74, 76],
    certification: "In review",
    openIncidents: 2,
    description: "Textile and furniture restoration center.",
  },
  {
    id: "atlanta-refurb",
    name: "Atlanta Refurb Center",
    region: "Southeast",
    type: "Repair & refurb",
    environmental: 88,
    social: 81,
    governance: 79,
    historyPrev: [80, 82, 84, 85],
    certification: "Certified",
    openIncidents: 0,
    description: "Largest refurbishment floor in the Southeast network.",
  },
  {
    id: "raleigh-returns",
    name: "Raleigh Returns Hub",
    region: "Southeast",
    type: "Returns processing",
    environmental: 68,
    social: 72,
    governance: 70,
    historyPrev: [66, 67, 68, 69],
    certification: "In review",
    openIncidents: 2,
    description: "Inspects and routes returned goods back into resale or refurb.",
  },
  {
    id: "newark-returns",
    name: "Newark Returns Hub",
    region: "Northeast",
    type: "Returns processing",
    environmental: 65,
    social: 69,
    governance: 71,
    historyPrev: [74, 72, 70, 69],
    certification: "Not certified",
    openIncidents: 4,
    description: "Highest-volume returns hub, serving the Northeast corridor.",
  },
  {
    id: "boston-resale",
    name: "Boston Resale Showroom",
    region: "Northeast",
    type: "Resale showroom",
    environmental: 89,
    social: 83,
    governance: 86,
    historyPrev: [82, 83, 85, 88],
    certification: "Certified",
    openIncidents: 0,
    description: "Second-largest retail showroom, Northeast flagship.",
  },
];

/** Current-quarter overall score, derived from the three sub-scores every time it's needed. */
export function currentScore(f: Facility): number {
  return Math.round(f.environmental * 0.4 + f.social * 0.3 + f.governance * 0.3);
}

export type PeriodMode = "qoq" | "yoy";
export const PERIOD_OPTIONS: { id: PeriodMode; label: string; fullLabel: string }[] = [
  { id: "qoq", label: "QoQ", fullLabel: "Quarter over quarter" },
  { id: "yoy", label: "YoY", fullLabel: "Year over year" },
];

/** The "previous" value for the active toggle, plus the derived delta — one function, used by
 * the ticker, the table and the slope chart alike, so none of them can drift apart. */
export function periodValues(f: Facility, mode: PeriodMode): { previous: number; current: number; delta: number; direction: Direction } {
  const current = currentScore(f);
  const previous = mode === "qoq" ? f.historyPrev[3] : f.historyPrev[0];
  const delta = current - previous;
  const direction: Direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return { previous, current, delta, direction };
}

/** Full 5-point trend (4 historical quarters + current) for the detail panel's sparkline. */
export function scoreHistory(f: Facility): number[] {
  return [...f.historyPrev, currentScore(f)];
}

export function facilityById(id: string): Facility | undefined {
  return FACILITIES.find((f) => f.id === id);
}

export const REGIONS: Region[] = Array.from(new Set(FACILITIES.map((f) => f.region)));

export const SEARCH_ENTRIES = FACILITIES.map((f) => ({
  id: f.id,
  title: f.name,
  meta: `${f.region} · ${f.type}`,
  Icon: Building2,
}));

// ---------------------------------------------------------------------------
// Network-wide ticker aggregates — all folded from FACILITIES + periodValues,
// never hand-typed, so the ticker can never disagree with the table below it.
// ---------------------------------------------------------------------------

export function networkAggregates(mode: PeriodMode) {
  const rows = FACILITIES.map((f) => periodValues(f, mode));
  const avgCurrent = rows.reduce((s, r) => s + r.current, 0) / rows.length;
  const avgPrevious = rows.reduce((s, r) => s + r.previous, 0) / rows.length;
  const improving = rows.filter((r) => r.direction === "up").length;
  const declining = rows.filter((r) => r.direction === "down").length;
  const certifiedSites = FACILITIES.filter((f) => f.certification === "Certified").length;
  const openIncidents = FACILITIES.reduce((s, f) => s + f.openIncidents, 0);
  return {
    avgCurrent,
    avgPrevious,
    avgDelta: avgCurrent - avgPrevious,
    improving,
    declining,
    flat: rows.length - improving - declining,
    certifiedSites,
    openIncidents,
    totalSites: FACILITIES.length,
  };
}

export function formatScore(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function formatScoreOneDecimal(n: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
}

export function formatSignedScore(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${formatScore(rounded)}`;
}

export function formatSignedOneDecimal(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${formatScoreOneDecimal(n)}`;
}
