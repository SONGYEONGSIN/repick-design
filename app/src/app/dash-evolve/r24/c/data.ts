// Deterministic domain data for the Accrue revenue-recognition console.
// Every bridge below reconciles exactly: opening + increases - decreases = ending.
// No Math.random / Date.now / bare `new Date()` is used anywhere in this folder.

export type StepType = "total" | "increase" | "decrease";
export type Category = "Balance" | "Growth" | "Reduction";

export interface BridgeStep {
  key: string;
  label: string;
  shortLabel: string;
  category: Category;
  type: StepType;
  /** Always a positive magnitude. Sign is derived from `type`. */
  amount: number;
  note: string;
}

export interface BridgeRow extends BridgeStep {
  before: number;
  after: number;
  /** after - before, signed. 0 for total rows. */
  delta: number;
  /** running total after this step, as a share of the opening balance. */
  shareOfOpening: number;
}

function buildBridge(steps: BridgeStep[]): BridgeRow[] {
  let running = 0;
  let opening = 0;
  return steps.map((step, i) => {
    const before = running;
    let after: number;
    if (step.type === "total") {
      after = i === 0 ? step.amount : before;
    } else if (step.type === "increase") {
      after = before + step.amount;
    } else {
      after = before - step.amount;
    }
    if (i === 0) opening = after;
    running = after;
    const delta = after - before;
    const shareOfOpening = opening === 0 ? 0 : Math.round((after / opening) * 1000) / 10;
    return { ...step, before, after, delta, shareOfOpening };
  });
}

const MONTH_STEPS: BridgeStep[] = [
  { key: "opening", label: "Opening Balance", shortLabel: "Opening", category: "Balance", type: "total", amount: 1842300, note: "Recognized balance carried in from the prior period close." },
  { key: "bookings", label: "New Bookings", shortLabel: "Bookings", category: "Growth", type: "increase", amount: 186400, note: "New contracts recognized ratably this period." },
  { key: "expansion", label: "Expansion Revenue", shortLabel: "Expansion", category: "Growth", type: "increase", amount: 64200, note: "Seat and usage upgrades on existing contracts." },
  { key: "churn", label: "Customer Churn", shortLabel: "Churn", category: "Reduction", type: "decrease", amount: 92700, note: "Cancelled accounts, fully de-recognized." },
  { key: "downgrades", label: "Plan Downgrades", shortLabel: "Downgrades", category: "Reduction", type: "decrease", amount: 38900, note: "Tier and seat reductions on active contracts." },
  { key: "adjustments", label: "Credits & Adjustments", shortLabel: "Credits", category: "Reduction", type: "decrease", amount: 16500, note: "Billing corrections and goodwill credits issued." },
  { key: "ending", label: "Ending Balance", shortLabel: "Ending", category: "Balance", type: "total", amount: 0, note: "Recognized balance carried into next period." },
];

const QUARTER_STEPS: BridgeStep[] = [
  { key: "opening", label: "Opening Balance", shortLabel: "Opening", category: "Balance", type: "total", amount: 1760500, note: "Recognized balance carried in from the prior quarter close." },
  { key: "bookings", label: "New Bookings", shortLabel: "Bookings", category: "Growth", type: "increase", amount: 512900, note: "New contracts recognized ratably this quarter." },
  { key: "expansion", label: "Expansion Revenue", shortLabel: "Expansion", category: "Growth", type: "increase", amount: 178300, note: "Seat and usage upgrades on existing contracts." },
  { key: "churn", label: "Customer Churn", shortLabel: "Churn", category: "Reduction", type: "decrease", amount: 276400, note: "Cancelled accounts, fully de-recognized." },
  { key: "downgrades", label: "Plan Downgrades", shortLabel: "Downgrades", category: "Reduction", type: "decrease", amount: 118700, note: "Tier and seat reductions on active contracts." },
  { key: "adjustments", label: "Credits & Adjustments", shortLabel: "Credits", category: "Reduction", type: "decrease", amount: 51900, note: "Billing corrections and goodwill credits issued." },
  { key: "ending", label: "Ending Balance", shortLabel: "Ending", category: "Balance", type: "total", amount: 0, note: "Recognized balance carried into next quarter." },
];

export type Period = "month" | "quarter";

export const BRIDGES: Record<Period, BridgeRow[]> = {
  month: buildBridge(MONTH_STEPS),
  quarter: buildBridge(QUARTER_STEPS),
};

export const PERIOD_META: Record<Period, { title: string; caption: string; axisNote: string }> = {
  month: { title: "August 2026", caption: "Monthly revenue-recognition bridge", axisNote: "Aug 1 – Aug 31, 2026" },
  quarter: { title: "Q3 2026", caption: "Quarterly revenue-recognition bridge", axisNote: "Jul 1 – Sep 30, 2026" },
};

// --- KPI hero row -----------------------------------------------------

export interface Kpi {
  key: string;
  label: string;
  value: string;
  deltaLabel: string;
  deltaDirection: "up" | "down";
  sparkline?: number[];
}

export const KPIS: Kpi[] = [
  {
    key: "mrr",
    label: "MRR (Recognized)",
    value: "$1,944,800",
    deltaLabel: "+5.6% MoM",
    deltaDirection: "up",
    sparkline: [1712000, 1738000, 1755000, 1749000, 1771000, 1798000, 1812000, 1836000, 1855000, 1879000, 1901000, 1944800],
  },
  {
    key: "nrr",
    label: "Net Revenue Retention",
    value: "108.3%",
    deltaLabel: "+1.2pt QoQ",
    deltaDirection: "up",
  },
  {
    key: "churn",
    label: "Gross Churn Rate",
    value: "1.9%",
    deltaLabel: "−0.3pt QoQ",
    deltaDirection: "down",
  },
  {
    key: "deferred",
    label: "Deferred Revenue Balance",
    value: "$3,214,600",
    deltaLabel: "−2.1% MoM",
    deltaDirection: "down",
  },
];

// --- formatting ---------------------------------------------------------

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatSigned(n: number): string {
  if (n === 0) return currency.format(0);
  const sign = n > 0 ? "+" : "−";
  return `${sign}${currency.format(Math.abs(n))}`;
}

// --- table sort / filter ------------------------------------------------

export type SortKey = "label" | "delta" | "after";
export type SortDir = "asc" | "desc";
export type CategoryFilter = "All" | Category;

/**
 * Single shared derivation used by every consumer of the table: category
 * filter, the pinned bar-selection filter, and column sort all funnel
 * through this one function so selection never drifts into a second,
 * independently-maintained copy of "what rows are visible".
 */
export function deriveVisibleRows(
  rows: BridgeRow[],
  opts: { categoryFilter: CategoryFilter; pinnedKey: string | null; sortKey: SortKey; sortDir: SortDir }
): BridgeRow[] {
  const { categoryFilter, pinnedKey, sortKey, sortDir } = opts;
  let out = rows.slice();
  if (pinnedKey) {
    out = out.filter((r) => r.key === pinnedKey);
  } else if (categoryFilter !== "All") {
    out = out.filter((r) => r.category === categoryFilter);
  }
  const dir = sortDir === "asc" ? 1 : -1;
  out.sort((a, b) => {
    if (sortKey === "label") return a.label.localeCompare(b.label) * dir;
    if (sortKey === "delta") return (a.delta - b.delta) * dir;
    return (a.after - b.after) * dir;
  });
  return out;
}
