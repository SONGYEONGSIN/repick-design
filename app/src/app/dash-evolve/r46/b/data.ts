/**
 * Relay — cross-team handoff intelligence for engineering orgs.
 *
 * Every figure below is a fixed literal. No `Math.random`, no `Date.now`, no bare `new Date()`.
 * Two authored snapshots ("current" = Sprint 24, "prior" = Sprint 23) give every handoff edge a
 * `weight.current` and `weight.prior`; every derived figure (sprint totals, rework rate, the
 * busiest handoff, per-team in/out volume) is a `reduce()`/`filter()` over these literals at
 * render time, so it can never drift out of sync with what the diagram, the KPIs and the fallback
 * table print. Edge weight domains (used to scale arc stroke width) are likewise computed from
 * this same array, never hand-typed.
 */

export type Period = "current" | "prior";

export type TeamId = "design" | "product" | "frontend" | "backend" | "qa" | "security" | "devops" | "support";

export interface Team {
  id: TeamId;
  name: string;
  category: string;
  /** Five-point combined (outgoing + incoming) handoff-volume history, oldest to newest, ending
   *  in exactly [prior-sprint total, current-sprint total] — those last two values are the same
   *  numbers `teamStats()` derives from `EDGES` below, so the sparkline and the printed totals can
   *  never disagree. */
  volumeHistory: number[];
  /** Fixed, hand-picked Unsplash photo id — the avatar cell shown for this team's outgoing
   *  handoffs in the fallback table. Never a seeded/random image service. */
  lead: { name: string; avatarId: string };
}

/** Canonical SDLC order — this is the single axis the arc diagram lays every team out on, left
 *  to right. Position on the line is this array's index, nothing else. */
export const TEAM_ORDER: TeamId[] = ["design", "product", "frontend", "backend", "qa", "security", "devops", "support"];

export const TEAMS: Record<TeamId, Team> = {
  design: {
    id: "design",
    name: "Design",
    category: "Product Design",
    volumeHistory: [36, 39, 41, 44, 52],
    lead: { name: "Maya Lindqvist", avatarId: "1519244703995-f4e0f30006d5" },
  },
  product: {
    id: "product",
    name: "Product",
    category: "Product Management",
    volumeHistory: [64, 69, 73, 78, 91],
    lead: { name: "Owen Castillo", avatarId: "1544005313-94ddf0286df2" },
  },
  frontend: {
    id: "frontend",
    name: "Frontend",
    category: "Frontend Engineering",
    volumeHistory: [178, 192, 201, 214, 232],
    lead: { name: "Renata Kessler", avatarId: "1547425260-76bcadfb4f2c" },
  },
  backend: {
    id: "backend",
    name: "Backend",
    category: "Backend Engineering",
    volumeHistory: [124, 133, 140, 148, 164],
    lead: { name: "Dmitri Okafor", avatarId: "1552664730-d307ca884978" },
  },
  qa: {
    id: "qa",
    name: "QA",
    category: "Quality Assurance",
    volumeHistory: [158, 170, 179, 190, 210],
    lead: { name: "Sofia Park", avatarId: "1543076447-215ad9ba6923" },
  },
  security: {
    id: "security",
    name: "Security",
    category: "Security Engineering",
    volumeHistory: [70, 75, 79, 84, 91],
    lead: { name: "Idris Mbeki", avatarId: "1553062407-98eeb64c6a62" },
  },
  devops: {
    id: "devops",
    name: "DevOps",
    category: "DevOps / Platform",
    volumeHistory: [90, 97, 102, 109, 126],
    lead: { name: "Lena Vukovic", avatarId: "1560243563-062bfc001d68" },
  },
  support: {
    id: "support",
    name: "Support",
    category: "Customer Support",
    volumeHistory: [54, 56, 57, 59, 60],
    lead: { name: "Theo Bannerman", avatarId: "1531123897727-8f129e1688ce" },
  },
};

export function teamIndexOf(id: TeamId): number {
  return TEAM_ORDER.indexOf(id);
}

export type HandoffType = "forward" | "rework";

export interface HandoffEdge {
  id: string;
  from: TeamId;
  to: TeamId;
  /** "forward" moves work further down the pipeline; "rework" sends it back to an earlier team. */
  type: HandoffType;
  /** Work items handed off this period — the arc diagram's data-bearing weight. */
  weight: Record<Period, number>;
}

/**
 * Fifteen handoff pairs, authored once. `type` is a structural fact about direction along
 * `TEAM_ORDER` (forward = later index, rework = earlier index) — it is never flipped per period,
 * only the two weight literals change between Sprint 23 and Sprint 24.
 */
export const EDGES: HandoffEdge[] = [
  { id: "design-product", from: "design", to: "product", type: "forward", weight: { current: 18, prior: 15 } },
  { id: "design-frontend", from: "design", to: "frontend", type: "forward", weight: { current: 34, prior: 29 } },
  { id: "product-frontend", from: "product", to: "frontend", type: "forward", weight: { current: 52, prior: 44 } },
  { id: "product-backend", from: "product", to: "backend", type: "forward", weight: { current: 21, prior: 19 } },
  { id: "frontend-backend", from: "frontend", to: "backend", type: "forward", weight: { current: 46, prior: 40 } },
  { id: "frontend-qa", from: "frontend", to: "qa", type: "forward", weight: { current: 61, prior: 53 } },
  { id: "backend-qa", from: "backend", to: "qa", type: "forward", weight: { current: 58, prior: 51 } },
  { id: "backend-security", from: "backend", to: "security", type: "forward", weight: { current: 27, prior: 24 } },
  { id: "qa-security", from: "qa", to: "security", type: "forward", weight: { current: 19, prior: 17 } },
  { id: "qa-devops", from: "qa", to: "devops", type: "forward", weight: { current: 49, prior: 42 } },
  { id: "security-devops", from: "security", to: "devops", type: "forward", weight: { current: 33, prior: 29 } },
  { id: "devops-support", from: "devops", to: "support", type: "forward", weight: { current: 44, prior: 38 } },
  { id: "support-frontend", from: "support", to: "frontend", type: "rework", weight: { current: 16, prior: 21 } },
  { id: "qa-frontend", from: "qa", to: "frontend", type: "rework", weight: { current: 23, prior: 27 } },
  { id: "security-backend", from: "security", to: "backend", type: "rework", weight: { current: 12, prior: 14 } },
];

export const PERIODS: { value: Period; label: string }[] = [
  { value: "current", label: "This sprint" },
  { value: "prior", label: "Last sprint" },
];

export const SPRINT_LABELS: Record<Period, string> = { current: "Sprint 24", prior: "Sprint 23" };

export type ViewFilter = "all" | "rework";

export const VIEW_FILTERS: { value: ViewFilter; label: string }[] = [
  { value: "all", label: "All handoffs" },
  { value: "rework", label: "Rework only" },
];

export function edgesFor(viewFilter: ViewFilter): HandoffEdge[] {
  return viewFilter === "all" ? EDGES : EDGES.filter((e) => e.type === "rework");
}

export function totalWeight(period: Period, edges: HandoffEdge[] = EDGES): number {
  return edges.reduce((sum, e) => sum + e.weight[period], 0);
}

export function reworkWeight(period: Period): number {
  return EDGES.filter((e) => e.type === "rework").reduce((sum, e) => sum + e.weight[period], 0);
}

export function reworkRatePct(period: Period): number {
  return (reworkWeight(period) / totalWeight(period)) * 100;
}

export function strongestEdge(period: Period, edges: HandoffEdge[] = EDGES): HandoffEdge {
  return edges.reduce((leader, e) => (e.weight[period] > leader.weight[period] ? e : leader));
}

/** Every distinct team touched by at least one rework edge — derived from `EDGES`, never typed
 *  out by hand, so it stays correct if the rework edge list ever changes. */
export const REWORK_TOUCHED_TEAM_IDS: TeamId[] = Array.from(
  new Set(EDGES.filter((e) => e.type === "rework").flatMap((e) => [e.from, e.to]))
);

export const REWORK_FREE_TEAM_IDS: TeamId[] = TEAM_ORDER.filter((id) => !REWORK_TOUCHED_TEAM_IDS.includes(id));

export function teamStats(id: TeamId, period: Period): { outgoing: number; incoming: number; reworkSharePct: number } {
  const touching = EDGES.filter((e) => e.from === id || e.to === id);
  const outgoing = EDGES.filter((e) => e.from === id).reduce((sum, e) => sum + e.weight[period], 0);
  const incoming = EDGES.filter((e) => e.to === id).reduce((sum, e) => sum + e.weight[period], 0);
  const total = touching.reduce((sum, e) => sum + e.weight[period], 0);
  const reworkTotal = touching.filter((e) => e.type === "rework").reduce((sum, e) => sum + e.weight[period], 0);
  return { outgoing, incoming, reworkSharePct: total === 0 ? 0 : (reworkTotal / total) * 100 };
}

function combinedVolume(id: TeamId, period: Period): number {
  const s = teamStats(id, period);
  return s.outgoing + s.incoming;
}

/** The default pinned team for the Team Spotlight widget — the team with the highest combined
 *  in+out handoff volume this sprint, computed from the literals above, never guessed. */
export const DEFAULT_SPOTLIGHT_TEAM_ID: TeamId = TEAM_ORDER.reduce((leader, id) =>
  combinedVolume(id, "current") > combinedVolume(leader, "current") ? id : leader
);

/** Weight domain across BOTH periods and ALL edges — the arc diagram's stroke-width scale is
 *  built from this, not a hand-typed min/max, so it stays correct if any weight above changes. */
export function weightDomain(): { min: number; max: number } {
  const all = EDGES.flatMap((e) => [e.weight.current, e.weight.prior]);
  return { min: Math.min(...all), max: Math.max(...all) };
}
