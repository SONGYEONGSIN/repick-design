/**
 * Spendmesh — deterministic domain data for a cloud cost / spend-allocation console
 * (auto-dash-r66 / candidate c).
 *
 * No `Math.random()`, no `Date.now()`, no `new Date()` anywhere. Every "month" below is a fixed,
 * hand-authored snapshot (labelled by a plain string, never computed from a real clock).
 *
 * Reconciliation is structural, not asserted: `teamTotal()` and `grandTotal()` are the ONLY
 * functions that ever sum a cost, and every consumer (KPI strip, treemap, fallback table,
 * selection drawer) calls them against the same three literal arrays below — there is no
 * second, independently-typed headline number anywhere. The "quarter" period is not a fourth
 * hand-typed dataset; it is `combinePeriods()` summing the three real months category-by-category,
 * so it is mechanically guaranteed to reconcile with them.
 */

export type ServiceCategory = "compute" | "database" | "storage" | "network" | "observability" | "other";
export type TeamId = "platform" | "payments" | "growth" | "data-ml" | "mobile" | "core-api";
export type Period = "this-month" | "last-month" | "quarter";

export interface ServiceCost {
  category: ServiceCategory;
  cost: number;
}

export interface TeamCost {
  id: TeamId;
  services: ServiceCost[];
}

export const CATEGORY_ORDER: ServiceCategory[] = ["compute", "database", "storage", "network", "observability", "other"];

export const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  compute: "Compute",
  database: "Database",
  storage: "Storage",
  network: "Network & CDN",
  observability: "Observability",
  other: "Other",
};

export const TEAM_ORDER: TeamId[] = ["platform", "payments", "growth", "data-ml", "mobile", "core-api"];

export const TEAM_NAME: Record<TeamId, string> = {
  platform: "Platform Engineering",
  payments: "Payments",
  growth: "Growth & Marketing",
  "data-ml": "Data & ML",
  mobile: "Mobile",
  "core-api": "Core API",
};

export function teamName(id: TeamId): string {
  return TEAM_NAME[id];
}

/** "This month" — the most recent closed snapshot. */
export const TEAMS_THIS_MONTH: TeamCost[] = [
  {
    id: "platform",
    services: [
      { category: "compute", cost: 182000 },
      { category: "storage", cost: 54000 },
      { category: "database", cost: 76000 },
      { category: "network", cost: 38000 },
      { category: "observability", cost: 21000 },
    ],
  },
  {
    id: "payments",
    services: [
      { category: "compute", cost: 96000 },
      { category: "database", cost: 142000 },
      { category: "network", cost: 22000 },
      { category: "observability", cost: 18000 },
    ],
  },
  {
    id: "growth",
    services: [
      { category: "compute", cost: 44000 },
      { category: "storage", cost: 19000 },
      { category: "network", cost: 61000 },
      { category: "other", cost: 14000 },
    ],
  },
  {
    id: "data-ml",
    services: [
      { category: "compute", cost: 215000 },
      { category: "storage", cost: 88000 },
      { category: "database", cost: 33000 },
      { category: "observability", cost: 12000 },
    ],
  },
  {
    id: "mobile",
    services: [
      { category: "compute", cost: 28000 },
      { category: "network", cost: 46000 },
      { category: "storage", cost: 9000 },
      { category: "other", cost: 7000 },
    ],
  },
  {
    id: "core-api",
    services: [
      { category: "compute", cost: 124000 },
      { category: "database", cost: 97000 },
      { category: "network", cost: 29000 },
      { category: "observability", cost: 15000 },
    ],
  },
];

/** "Last month" — one snapshot back. */
export const TEAMS_LAST_MONTH: TeamCost[] = [
  {
    id: "platform",
    services: [
      { category: "compute", cost: 178000 },
      { category: "storage", cost: 52000 },
      { category: "database", cost: 71000 },
      { category: "network", cost: 36000 },
      { category: "observability", cost: 20000 },
    ],
  },
  {
    id: "payments",
    services: [
      { category: "compute", cost: 91000 },
      { category: "database", cost: 138000 },
      { category: "network", cost: 21000 },
      { category: "observability", cost: 17000 },
    ],
  },
  {
    id: "growth",
    services: [
      { category: "compute", cost: 39000 },
      { category: "storage", cost: 17000 },
      { category: "network", cost: 58000 },
      { category: "other", cost: 12000 },
    ],
  },
  {
    id: "data-ml",
    services: [
      { category: "compute", cost: 198000 },
      { category: "storage", cost: 82000 },
      { category: "database", cost: 31000 },
      { category: "observability", cost: 11000 },
    ],
  },
  {
    id: "mobile",
    services: [
      { category: "compute", cost: 26000 },
      { category: "network", cost: 43000 },
      { category: "storage", cost: 8000 },
      { category: "other", cost: 6000 },
    ],
  },
  {
    id: "core-api",
    services: [
      { category: "compute", cost: 119000 },
      { category: "database", cost: 93000 },
      { category: "network", cost: 27000 },
      { category: "observability", cost: 14000 },
    ],
  },
];

/** Two snapshots back — only used as the quarter's third month and as the comparison baseline
 *  for "last month"'s own delta. Never surfaced as its own selectable period. */
export const TEAMS_MONTH_BEFORE: TeamCost[] = [
  {
    id: "platform",
    services: [
      { category: "compute", cost: 171000 },
      { category: "storage", cost: 49000 },
      { category: "database", cost: 68000 },
      { category: "network", cost: 34000 },
      { category: "observability", cost: 19000 },
    ],
  },
  {
    id: "payments",
    services: [
      { category: "compute", cost: 87000 },
      { category: "database", cost: 131000 },
      { category: "network", cost: 20000 },
      { category: "observability", cost: 16000 },
    ],
  },
  {
    id: "growth",
    services: [
      { category: "compute", cost: 36000 },
      { category: "storage", cost: 16000 },
      { category: "network", cost: 54000 },
      { category: "other", cost: 11000 },
    ],
  },
  {
    id: "data-ml",
    services: [
      { category: "compute", cost: 184000 },
      { category: "storage", cost: 77000 },
      { category: "database", cost: 29000 },
      { category: "observability", cost: 10000 },
    ],
  },
  {
    id: "mobile",
    services: [
      { category: "compute", cost: 24000 },
      { category: "network", cost: 40000 },
      { category: "storage", cost: 8000 },
      { category: "other", cost: 5000 },
    ],
  },
  {
    id: "core-api",
    services: [
      { category: "compute", cost: 113000 },
      { category: "database", cost: 89000 },
      { category: "network", cost: 25000 },
      { category: "observability", cost: 13000 },
    ],
  },
];

/** Sums a list of monthly snapshots into one, team-by-team and category-by-category. Used to
 *  build the "quarter" period so it can never drift from the three real months it is made of. */
export function combinePeriods(periods: TeamCost[][]): TeamCost[] {
  const byTeam = new Map<TeamId, Map<ServiceCategory, number>>();
  for (const period of periods) {
    for (const team of period) {
      const catMap = byTeam.get(team.id) ?? new Map<ServiceCategory, number>();
      for (const svc of team.services) {
        catMap.set(svc.category, (catMap.get(svc.category) ?? 0) + svc.cost);
      }
      byTeam.set(team.id, catMap);
    }
  }
  return TEAM_ORDER.map((id) => {
    const catMap = byTeam.get(id) ?? new Map<ServiceCategory, number>();
    return {
      id,
      services: CATEGORY_ORDER.filter((c) => catMap.has(c)).map((c) => ({ category: c, cost: catMap.get(c)! })),
    };
  });
}

export const TEAMS_QUARTER: TeamCost[] = combinePeriods([TEAMS_MONTH_BEFORE, TEAMS_LAST_MONTH, TEAMS_THIS_MONTH]);

export const PERIOD_DATA: Record<Period, TeamCost[]> = {
  "this-month": TEAMS_THIS_MONTH,
  "last-month": TEAMS_LAST_MONTH,
  quarter: TEAMS_QUARTER,
};

export const PERIOD_LABEL: Record<Period, string> = {
  "this-month": "This month",
  "last-month": "Last month",
  quarter: "Quarter to date",
};

/** The adjacent-month dataset each period compares itself against, for the KPI strip's secondary
 *  stat and the drawer's delta line. `quarter` has no older quarter on hand, so it is `null` and
 *  callers fall back to an average-per-month figure instead of fabricating a comparison. */
export const PERIOD_COMPARE: Record<Period, TeamCost[] | null> = {
  "this-month": TEAMS_LAST_MONTH,
  "last-month": TEAMS_MONTH_BEFORE,
  quarter: null,
};

export function teamTotal(team: TeamCost): number {
  return team.services.reduce((sum, s) => sum + s.cost, 0);
}

export function grandTotal(teams: TeamCost[]): number {
  return teams.reduce((sum, t) => sum + teamTotal(t), 0);
}

export function findTeam(teams: TeamCost[], teamId: TeamId): TeamCost | undefined {
  return teams.find((t) => t.id === teamId);
}

export function findCost(teams: TeamCost[], teamId: TeamId, category: ServiceCategory): number | null {
  const svc = findTeam(teams, teamId)?.services.find((s) => s.category === category);
  return svc ? svc.cost : null;
}

export function tileId(teamId: TeamId, category: ServiceCategory): string {
  return `${teamId}__${category}`;
}

export interface Kpis {
  period: Period;
  total: number;
  teamsCount: number;
  servicesTracked: number;
  largestTeamId: TeamId;
  largestTeamCost: number;
  secondary: { kind: "delta"; pct: number; up: boolean } | { kind: "avg"; value: number };
}

/** The single place the KPI strip's numbers are derived — every figure comes from `PERIOD_DATA`
 *  and `PERIOD_COMPARE`, the exact same arrays the treemap and the fallback table render, so the
 *  hero total can never disagree with what is on screen below it. */
export function computeKpis(period: Period): Kpis {
  const teams = PERIOD_DATA[period];
  const total = grandTotal(teams);
  const servicesTracked = teams.reduce((sum, t) => sum + t.services.length, 0);
  const largest = teams.reduce((a, b) => (teamTotal(b) > teamTotal(a) ? b : a));
  const compare = PERIOD_COMPARE[period];
  const secondary: Kpis["secondary"] = compare
    ? (() => {
        const prevTotal = grandTotal(compare);
        const pct = Math.round(((total - prevTotal) / prevTotal) * 1000) / 10;
        return { kind: "delta", pct, up: pct >= 0 };
      })()
    : { kind: "avg", value: Math.round(total / 3) };
  return {
    period,
    total,
    teamsCount: teams.length,
    servicesTracked,
    largestTeamId: largest.id,
    largestTeamCost: teamTotal(largest),
    secondary,
  };
}

export const usdCompact = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
    // Node (server) and browser (client) ICU builds disagree on trailing-zero display for whole
    // compact numbers ("$1.5M" vs "$1.50M") unless this is pinned — otherwise a hydration mismatch.
    trailingZeroDisplay: "stripIfInteger",
  }).format(n);

export const usd = (n: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const pctFmt = (n: number): string => `${n.toFixed(1)}%`;

export const numberFmt = new Intl.NumberFormat("en-US");

/** Deterministic point string for a small sparkline, viewBox 0 0 W H, rounded to 2dp. */
export function sparklinePoints(values: number[], width: number, height: number, pad = 3): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = Number((i * step).toFixed(2));
      const y = Number((height - pad - ((v - min) / span) * (height - pad * 2)).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");
}
