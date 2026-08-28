import {
  Anchor,
  Compass,
  Gauge,
  Grid3x3,
  LayoutGrid,
  LifeBuoy,
  type LucideIcon,
  Settings,
  Table2,
  Users,
} from "lucide-react";

export const BRAND = { name: "Ridge", Icon: Anchor };

export const CURRENT_USER = {
  name: "Priya Naidu",
  role: "Retention lead",
  email: "priya@ridge-analytics.io",
  avatarId: "1547425260-76bcadfb4f2c",
};

export const WORKSPACES = [
  { id: "core", name: "Ridge — Core plan", plan: "18 cohorts tracked" },
  { id: "enterprise", name: "Ridge — Enterprise", plan: "6 cohorts tracked" },
];

type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "retention",
    title: "Retention",
    items: [
      { id: "cohorts", label: "Cohort matrix", Icon: Grid3x3, active: true },
      { id: "segments", label: "Segments", Icon: Users },
      { id: "overview", label: "Overview", Icon: LayoutGrid },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "reports", label: "Saved reports", Icon: Table2, disabled: true },
      { id: "goals", label: "Retention goals", Icon: Compass, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "May 2025 cohort dropped below the 60% watch line at month 6.", time: "18m ago" },
  { id: "n2", text: "Weekly retention digest for Core plan is ready.", time: "2h ago" },
  { id: "n3", text: "Feb 2025 cohort crossed 12 months tracked — final column filled.", time: "1d ago" },
];

/* ------------------------------------------------------------------- Cohorts */

export type CohortSeed = {
  id: string;
  label: string;
  elapsed: number; // months of data available, 0..11 (triangular — newer cohorts have fewer)
  startCount: number;
  tau: number; // decay time constant
  floorFrac: number; // asymptotic retained fraction
  expansion: number; // revenue expansion multiplier applied on top of logo retention
  owner: { name: string; avatarId: string };
  note: string; // deterministic, hand-authored — the cohort's story
};

const OWNERS = [
  { name: "Priya Naidu", avatarId: "1547425260-76bcadfb4f2c" },
  { name: "Tomas Vukovic", avatarId: "1544005313-94ddf0286df2" },
  { name: "Aiko Sato", avatarId: "1123897727-8f129e1688ce" },
];

// 12 monthly cohorts, Jan 2025 → Dec 2025. The reference "today" is the end of Dec 2025, so the
// oldest cohort has 11 full months of elapsed data (offsets 0..11) and the newest has just offset 0
// — this is what makes the grid a triangle, not a rectangle.
export const COHORTS: CohortSeed[] = [
  { id: "2025-01", label: "Jan 2025", elapsed: 11, startCount: 412, tau: 5.5, floorFrac: 0.71, expansion: 1.14, owner: OWNERS[0], note: "Pre-paywall-redesign intake — best floor in the book." },
  { id: "2025-02", label: "Feb 2025", elapsed: 10, startCount: 388, tau: 5.2, floorFrac: 0.69, expansion: 1.12, owner: OWNERS[0], note: "Held the Jan curve within 2pp through month 10." },
  { id: "2025-03", label: "Mar 2025", elapsed: 9, startCount: 445, tau: 4.6, floorFrac: 0.64, expansion: 1.1, owner: OWNERS[1], note: "First cohort onboarded post self-serve launch." },
  { id: "2025-04", label: "Apr 2025", elapsed: 8, startCount: 501, tau: 4.1, floorFrac: 0.6, expansion: 1.07, owner: OWNERS[1], note: "Self-serve volume up, activation coaching down." },
  { id: "2025-05", label: "May 2025", elapsed: 7, startCount: 467, tau: 3.2, floorFrac: 0.52, expansion: 1.03, owner: OWNERS[1], note: "Crossed below the 60% watch line at month 6." },
  { id: "2025-06", label: "Jun 2025", elapsed: 6, startCount: 512, tau: 3.4, floorFrac: 0.54, expansion: 1.04, owner: OWNERS[2], note: "Onboarding checklist v2 shipped mid-month." },
  { id: "2025-07", label: "Jul 2025", elapsed: 5, startCount: 493, tau: 3.9, floorFrac: 0.58, expansion: 1.06, owner: OWNERS[2], note: "Checklist v2's first full cohort — curve steadied." },
  { id: "2025-08", label: "Aug 2025", elapsed: 4, startCount: 534, tau: 4.3, floorFrac: 0.61, expansion: 1.08, owner: OWNERS[2], note: "Best month-3 mark since March." },
  { id: "2025-09", label: "Sep 2025", elapsed: 3, startCount: 522, tau: 4.4, floorFrac: 0.62, expansion: 1.09, owner: OWNERS[0], note: "Tracking a touch ahead of Aug at the same offset." },
  { id: "2025-10", label: "Oct 2025", elapsed: 2, startCount: 560, tau: 4.5, floorFrac: 0.63, expansion: 1.1, owner: OWNERS[1], note: "Annual-plan promo lifted month-1 retention." },
  { id: "2025-11", label: "Nov 2025", elapsed: 1, startCount: 548, tau: 4.6, floorFrac: 0.64, expansion: 1.1, owner: OWNERS[2], note: "One month in, promo effect holding." },
  { id: "2025-12", label: "Dec 2025", elapsed: 0, startCount: 601, tau: 4.6, floorFrac: 0.64, expansion: 1.1, owner: OWNERS[0], note: "Just landed — one data point so far." },
];

/** Deterministic exponential-decay curve — pure math, no Math.random/Date.now. Every array element
 *  is `Math.round`ed so both server and client render identical integers. */
function activeCounts(seed: CohortSeed): number[] {
  const out: number[] = [];
  for (let k = 0; k <= seed.elapsed; k++) {
    const frac = seed.floorFrac + (1 - seed.floorFrac) * Math.exp(-k / seed.tau);
    out.push(Math.round(seed.startCount * frac));
  }
  return out;
}

export type CohortRow = CohortSeed & { active: number[]; pct: number[]; revenuePct: number[] };

export const COHORT_ROWS: CohortRow[] = COHORTS.map((seed) => {
  const active = activeCounts(seed);
  const pct = active.map((n) => Math.round((n / seed.startCount) * 1000) / 10);
  const revenuePct = pct.map((p) => Math.round(Math.min(p * seed.expansion, 140) * 10) / 10);
  return { ...seed, active, pct, revenuePct };
});

export const MAX_OFFSET = 11;

/** Column margin — weighted average retention at each month offset, across every cohort that has
 *  data there. Weighted by starting size so the margin reconciles with the grid, not a naive mean. */
export function columnMargin(metric: "pct" | "revenuePct"): (number | null)[] {
  const out: (number | null)[] = [];
  for (let k = 0; k <= MAX_OFFSET; k++) {
    let num = 0;
    let den = 0;
    for (const row of COHORT_ROWS) {
      if (k > row.elapsed) continue;
      const active = metric === "pct" ? row.active[k] : row.active[k] * row.expansion;
      num += active;
      den += row.startCount;
    }
    out.push(den > 0 ? Math.round((num / den) * 1000) / 10 : null);
  }
  return out;
}

/* ------------------------------------------------------------------ Summary */

export const TOTAL_STARTING = COHORT_ROWS.reduce((s, r) => s + r.startCount, 0);
export const TOTAL_ACTIVE_NOW = COHORT_ROWS.reduce((s, r) => s + r.active[r.elapsed], 0);
export const NET_LOGO_RETENTION = Math.round((TOTAL_ACTIVE_NOW / TOTAL_STARTING) * 1000) / 10;

const ARPA_USD = 84; // fixed average revenue per active account — deterministic constant
export const TOTAL_MRR_RETAINED = COHORT_ROWS.reduce((s, r) => s + Math.round(r.active[r.elapsed] * r.expansion * ARPA_USD), 0);
export const AT_RISK_COUNT = COHORT_ROWS.filter((r) => r.pct[r.elapsed] < 60).length;

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function formatPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}
export function formatPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}pp`;
}

/* ------------------------------------------------------------------- Search */

export type SearchEntry = { id: string; title: string; meta: string; Icon: LucideIcon; cohortId: string };
export const SEARCH_ENTRIES: SearchEntry[] = COHORT_ROWS.map((r) => ({
  id: r.id,
  title: r.label,
  meta: `${formatPct(r.pct[r.elapsed])} retained · ${formatInt(r.active[r.elapsed])} of ${formatInt(r.startCount)} active`,
  Icon: r.pct[r.elapsed] < 60 ? Gauge : LifeBuoy,
  cohortId: r.id,
}));
