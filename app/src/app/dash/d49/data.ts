import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Building2,
  Cpu,
  Database,
  FileText,
  Globe,
  HardDrive,
  Layers,
  Receipt,
  Settings,
  ShieldCheck,
  Sigma,
  Siren,
  Table2,
  Tags,
  Target,
  Trash2,
} from "lucide-react";

/**
 * Trussline — cloud spend reconciliation console.
 *
 * ARITHMETIC CONTRACT (the whole page rests on it):
 *   1. A driver's amount is NEVER typed. It is the sum of its sub-drivers, computed here.
 *   2. opening + Σ(driver amounts) === closing, where `closing` is read out of the period series
 *      rather than typed next to the bridge — so the bridge and the trend chart cannot drift apart.
 *   3. `balanced` is a real check, not a decoration: it compares the derived closing against the
 *      series figure and the UI renders whichever answer comes back.
 *   4. Line items are the TOP THREE invoice lines inside a driver, never the whole set. The
 *      remainder is derived (`driver amount − Σ top three`) and printed as its own row, so the
 *      drill panel's column still foots to the driver total.
 *
 * Everything is hardcoded and deterministic — no Math.random, no Date.now, no bare new Date().
 */

/* ------------------------------------------------------------------ brand + shell */

export const BRAND = {
  name: "Trussline",
  product: "Spend Reconciliation",
  Icon: Sigma,
};

export const WORKSPACES = [
  { id: "northgate", name: "Northgate Labs", plan: "Enterprise · 7 cloud accounts" },
  { id: "harbourpoint", name: "Harbourpoint", plan: "Growth · 3 cloud accounts" },
  { id: "sable", name: "Sable Interactive", plan: "Enterprise · 12 cloud accounts" },
];

export const CURRENT_USER = {
  name: "Dana Whitfield",
  role: "FinOps Lead",
  email: "dana.whitfield@northgatelabs.com",
  avatarId: "1494790108377-be9c29b29330",
};

export const NAV_SECTIONS: {
  id: string;
  title: string;
  items: { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean }[];
}[] = [
  {
    id: "reconcile",
    title: "Reconcile",
    items: [
      { id: "bridge", label: "Spend bridge", Icon: Sigma, active: true },
      { id: "ledger", label: "Variance ledger", Icon: Table2 },
      { id: "drivers", label: "Drivers", Icon: Layers },
      { id: "commitments", label: "Commitments", Icon: ShieldCheck },
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    items: [
      { id: "accounts", label: "Cloud accounts", Icon: Building2 },
      { id: "owners", label: "Tags & owners", Icon: Tags },
      { id: "budgets", label: "Budgets", Icon: Target },
    ],
  },
  {
    id: "governance",
    title: "Governance",
    items: [
      { id: "anomalies", label: "Anomaly rules", Icon: Siren, disabled: true },
      { id: "reports", label: "Close reports", Icon: FileText },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "March close packet is ready for the finance review.", time: "18 minutes ago" },
  { id: "n2", text: "GPU inference fleet crossed 40% of the compute driver.", time: "2 hours ago" },
  { id: "n3", text: "Savings plan renewal booked — coverage now 78%.", time: "Yesterday" },
];

/* ---------------------------------------------------------------------- formatting */

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Short currency for axis ticks, chart bar labels at narrow column widths and secondary running
 * totals. Built from two plain `Intl` formatters and an explicit suffix rather than
 * `notation: "compact"`: Node's ICU and Chrome's disagree about trailing zeros there
 * ("$4.5M" server-side, "$4.50M" client-side), which surfaces as a hydration console error on a
 * page that is otherwise perfectly deterministic. Doing the magnitude split by hand also lets
 * thousands read the way a finance reader writes them — "$386K", not "$386.20K".
 */
const USD_MILLIONS = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PCT = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatUSD(n: number): string {
  return USD.format(n);
}

/** Signed money. The sign is part of the string, so the figure survives losing its colour. */
export function formatSignedUSD(n: number): string {
  return `${n < 0 ? "−" : "+"}${USD.format(Math.abs(n))}`;
}

export function formatCompactUSD(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${USD_MILLIONS.format(n / 1000000)}M`;
  if (abs >= 1000) return `${USD.format(Math.round(n / 1000))}K`;
  return USD.format(n);
}

export function formatPct(n: number): string {
  return `${PCT.format(n)}%`;
}

/* ------------------------------------------------------------------- period series */

export type PeriodPoint = { key: string; label: string; full: string; actual: number; plan: number };

/** Monthly actual vs plan, Apr 2025 → Mar 2026. The bridge's opening/closing are read from here. */
export const MONTHS: PeriodPoint[] = [
  { key: "2025-04", label: "Apr", full: "April 2025", actual: 3412600, plan: 3450000 },
  { key: "2025-05", label: "May", full: "May 2025", actual: 3508900, plan: 3520000 },
  { key: "2025-06", label: "Jun", full: "June 2025", actual: 3641200, plan: 3610000 },
  { key: "2025-07", label: "Jul", full: "July 2025", actual: 3795400, plan: 3700000 },
  { key: "2025-08", label: "Aug", full: "August 2025", actual: 3702800, plan: 3780000 },
  { key: "2025-09", label: "Sep", full: "September 2025", actual: 3884100, plan: 3850000 },
  { key: "2025-10", label: "Oct", full: "October 2025", actual: 3951700, plan: 3920000 },
  { key: "2025-11", label: "Nov", full: "November 2025", actual: 4046300, plan: 4000000 },
  { key: "2025-12", label: "Dec", full: "December 2025", actual: 4218500, plan: 4090000 },
  { key: "2026-01", label: "Jan", full: "January 2026", actual: 4095900, plan: 4160000 },
  { key: "2026-02", label: "Feb", full: "February 2026", actual: 4182400, plan: 4235000 },
  { key: "2026-03", label: "Mar", full: "March 2026", actual: 4461000, plan: 4310000 },
];

/** Quarters before the monthly window are typed; the last four are SUMMED from MONTHS, so the
 *  quarter-over-quarter bridge cannot disagree with the month-over-month one. */
const QUARTERS_PRIOR: PeriodPoint[] = [
  { key: "2024-Q2", label: "Q2 24", full: "Q2 2024", actual: 9102500, plan: 9150000 },
  { key: "2024-Q3", label: "Q3 24", full: "Q3 2024", actual: 9431800, plan: 9400000 },
  { key: "2024-Q4", label: "Q4 24", full: "Q4 2024", actual: 9776200, plan: 9720000 },
  { key: "2025-Q1", label: "Q1 25", full: "Q1 2025", actual: 10148600, plan: 10090000 },
];

function quarterFromMonths(key: string, label: string, full: string, start: number): PeriodPoint {
  const slice = MONTHS.slice(start, start + 3);
  return {
    key,
    label,
    full,
    actual: slice.reduce((a, m) => a + m.actual, 0),
    plan: slice.reduce((a, m) => a + m.plan, 0),
  };
}

export const QUARTERS: PeriodPoint[] = [
  ...QUARTERS_PRIOR,
  quarterFromMonths("2025-Q2", "Q2 25", "Q2 2025", 0),
  quarterFromMonths("2025-Q3", "Q3 25", "Q3 2025", 3),
  quarterFromMonths("2025-Q4", "Q4 25", "Q4 2025", 6),
  quarterFromMonths("2026-Q1", "Q1 26", "Q1 2026", 9),
];

/* ------------------------------------------------------------------------- drivers */

export type DriverId =
  | "compute"
  | "egress"
  | "postgres"
  | "observability"
  | "savings"
  | "idle"
  | "storage"
  | "support";

export type DriverType = "Compute" | "Network" | "Data" | "Commitments" | "Efficiency" | "Vendor";

export const DRIVER_TYPES: DriverType[] = ["Compute", "Network", "Data", "Commitments", "Efficiency", "Vendor"];

type DriverMeta = {
  id: DriverId;
  label: string;
  /** Two short lines for the chart's column label — keeps 10 columns legible at 1280px. */
  chartLabel: [string, string];
  type: DriverType;
  owner: string;
  Icon: LucideIcon;
};

export const DRIVERS: DriverMeta[] = [
  { id: "compute", label: "Compute autoscaling", chartLabel: ["Compute", "autoscaling"], type: "Compute", owner: "Platform Eng", Icon: Cpu },
  { id: "egress", label: "Egress & CDN", chartLabel: ["Egress &", "CDN"], type: "Network", owner: "Edge Delivery", Icon: Globe },
  { id: "postgres", label: "Managed Postgres", chartLabel: ["Managed", "Postgres"], type: "Data", owner: "Data Platform", Icon: Database },
  { id: "observability", label: "Observability retention", chartLabel: ["Observ.", "retention"], type: "Data", owner: "SRE", Icon: Activity },
  { id: "savings", label: "Savings plan coverage", chartLabel: ["Savings", "plans"], type: "Commitments", owner: "FinOps", Icon: ShieldCheck },
  { id: "idle", label: "Idle resource reclaim", chartLabel: ["Idle", "reclaim"], type: "Efficiency", owner: "Platform Eng", Icon: Trash2 },
  { id: "storage", label: "Storage lifecycle", chartLabel: ["Storage", "lifecycle"], type: "Efficiency", owner: "Data Platform", Icon: HardDrive },
  { id: "support", label: "Support & licensing", chartLabel: ["Support &", "licensing"], type: "Vendor", owner: "Procurement", Icon: Receipt },
];

/** Where each driver's money actually sits. Amounts vary by basis; the resource identity does not. */
const LINE_TEMPLATES: Record<DriverId, { resource: string; account: string; service: string }[]> = {
  compute: [
    { resource: "eks-prod-gpu-a100", account: "prod-ml-7741", service: "Kubernetes Engine" },
    { resource: "eks-prod-core-nodepool", account: "prod-core-1180", service: "Compute Engine" },
    { resource: "batch-etl-transcode", account: "data-batch-3312", service: "Batch" },
  ],
  egress: [
    { resource: "cdn-edge-eu-west", account: "edge-8802", service: "Content Delivery" },
    { resource: "xregion-replica-usw2", account: "prod-core-1180", service: "Inter-region transfer" },
    { resource: "partner-api-egress", account: "integrations-5504", service: "Data transfer out" },
  ],
  postgres: [
    { resource: "pg-orders-primary", account: "prod-core-1180", service: "Managed Postgres" },
    { resource: "pg-orders-replica-2", account: "prod-core-1180", service: "Managed Postgres" },
    { resource: "pg-analytics-primary", account: "data-warehouse-2290", service: "Managed Postgres" },
  ],
  observability: [
    { resource: "logs-retention-prod", account: "sre-obs-6610", service: "Log Archive" },
    { resource: "traces-sampling-api", account: "sre-obs-6610", service: "Distributed Tracing" },
    { resource: "metrics-highcard-k8s", account: "sre-obs-6610", service: "Metrics Store" },
  ],
  savings: [
    { resource: "csp-3yr-compute-2026", account: "billing-root-0001", service: "Savings Plan" },
    { resource: "ri-postgres-2yr", account: "billing-root-0001", service: "Reserved Instance" },
    { resource: "commit-storage-tier3", account: "billing-root-0001", service: "Committed Use" },
  ],
  idle: [
    { resource: "orphaned-ebs-snapshots", account: "prod-core-1180", service: "Block Storage" },
    { resource: "dev-namespace-sweep", account: "dev-sandbox-9917", service: "Kubernetes Engine" },
    { resource: "stale-nlb-pool", account: "prod-core-1180", service: "Load Balancing" },
  ],
  storage: [
    { resource: "s3-archive-coldline", account: "data-warehouse-2290", service: "Object Storage" },
    { resource: "snapshot-prune-90d", account: "prod-core-1180", service: "Block Storage" },
    { resource: "media-bucket-lifecycle", account: "media-4406", service: "Object Storage" },
  ],
  support: [
    { resource: "enterprise-support-tier", account: "billing-root-0001", service: "Support" },
    { resource: "sast-seats-q1", account: "security-7720", service: "Security Tooling" },
    { resource: "catalog-seats-q1", account: "data-warehouse-2290", service: "Data Catalog" },
  ],
};

/** How many invoice lines roll into each driver in total (the top three are shown by name). */
const LINE_COUNTS: Record<DriverId, number> = {
  compute: 214,
  egress: 96,
  postgres: 41,
  observability: 27,
  savings: 12,
  idle: 168,
  storage: 74,
  support: 9,
};

/* ---------------------------------------------------------------------- comparison bases */

export type BasisId = "mom" | "qoq" | "plan";

type BasisFacts = {
  subs: { label: string; amount: number }[];
  lines: [number, number, number];
};

const FACTS: Record<BasisId, Record<DriverId, BasisFacts>> = {
  mom: {
    compute: {
      subs: [
        { label: "Kubernetes node pool growth", amount: 214500 },
        { label: "GPU inference fleet", amount: 148300 },
        { label: "Batch job retries", amount: 41900 },
        { label: "Spot interruption fallback", amount: -18500 },
      ],
      lines: [142800, 96400, 38700],
    },
    egress: {
      subs: [
        { label: "Cross-region replication", amount: 88400 },
        { label: "Public egress to partners", amount: 52600 },
        { label: "CDN cache-miss ratio", amount: 21300 },
        { label: "Peering discount", amount: -7400 },
      ],
      lines: [58300, 44100, 26700],
    },
    postgres: {
      subs: [
        { label: "Primary cluster upsize", amount: 61200 },
        { label: "Read replica added", amount: 34800 },
        { label: "Backup retention trim", amount: -3300 },
      ],
      lines: [48600, 27900, 11400],
    },
    observability: {
      subs: [
        { label: "Log retention 14 → 30 days", amount: 47900 },
        { label: "Trace sampling increase", amount: 19600 },
        { label: "Metric cardinality cleanup", amount: -6200 },
      ],
      lines: [36200, 15800, 6100],
    },
    savings: {
      subs: [
        { label: "Compute savings plan renewal", amount: -171300 },
        { label: "3-year RI conversion", amount: -62800 },
        { label: "Storage commitment tier", amount: -14400 },
      ],
      lines: [-128700, -54300, -31200],
    },
    idle: {
      subs: [
        { label: "Orphaned volumes deleted", amount: -58700 },
        { label: "Idle dev namespaces", amount: -44200 },
        { label: "Stale load balancers", amount: -21300 },
        { label: "Unattached IPs released", amount: -7400 },
      ],
      lines: [-49800, -38600, -18900],
    },
    storage: {
      subs: [
        { label: "Cold tier transition", amount: -52100 },
        { label: "Snapshot pruning", amount: -28600 },
        { label: "Restore-fee offset", amount: 5900 },
      ],
      lines: [-41700, -22400, -8600],
    },
    support: {
      subs: [
        { label: "Enterprise support tier", amount: 26500 },
        { label: "Security scanning seats", amount: 9700 },
        { label: "Data catalog seats", amount: 2200 },
      ],
      lines: [26500, 7300, 2200],
    },
  },
  qoq: {
    compute: {
      subs: [
        { label: "Kubernetes node pool growth", amount: 512400 },
        { label: "GPU inference fleet", amount: 338700 },
        { label: "Batch job retries", amount: 82600 },
        { label: "Spot interruption fallback", amount: -41400 },
      ],
      lines: [341600, 228900, 96300],
    },
    egress: {
      subs: [
        { label: "Cross-region replication", amount: 196300 },
        { label: "Public egress to partners", amount: 118400 },
        { label: "CDN cache-miss ratio", amount: 45700 },
        { label: "Peering discount", amount: -18800 },
      ],
      lines: [128700, 97400, 58200],
    },
    postgres: {
      subs: [
        { label: "Primary cluster upsize", amount: 132700 },
        { label: "Read replica added", amount: 75300 },
        { label: "Backup retention trim", amount: -9600 },
      ],
      lines: [104800, 61300, 24700],
    },
    observability: {
      subs: [
        { label: "Log retention 14 → 30 days", amount: 66800 },
        { label: "Trace sampling increase", amount: 30400 },
        { label: "Metric cardinality cleanup", amount: -12700 },
      ],
      lines: [49600, 21700, 8400],
    },
    savings: {
      subs: [
        { label: "Compute savings plan renewal", amount: -441500 },
        { label: "3-year RI conversion", amount: -162900 },
        { label: "Storage commitment tier", amount: -37800 },
      ],
      lines: [-332400, -140600, -80700],
    },
    idle: {
      subs: [
        { label: "Orphaned volumes deleted", amount: -128600 },
        { label: "Idle dev namespaces", amount: -94700 },
        { label: "Stale load balancers", amount: -42100 },
        { label: "Unattached IPs released", amount: -16500 },
      ],
      lines: [-106700, -82900, -40300],
    },
    storage: {
      subs: [
        { label: "Cold tier transition", amount: -118200 },
        { label: "Snapshot pruning", amount: -59400 },
        { label: "Restore-fee offset", amount: 13300 },
      ],
      lines: [-91500, -49200, -18800],
    },
    support: {
      subs: [
        { label: "Enterprise support tier", amount: 65700 },
        { label: "Security scanning seats", amount: 22300 },
        { label: "Data catalog seats", amount: 6400 },
      ],
      lines: [65700, 18200, 5400],
    },
  },
  plan: {
    compute: {
      subs: [
        { label: "Kubernetes node pool growth", amount: 151300 },
        { label: "GPU inference fleet", amount: 109800 },
        { label: "Batch job retries", amount: 38600 },
        { label: "Spot interruption fallback", amount: -31000 },
      ],
      lines: [98400, 71200, 34600],
    },
    egress: {
      subs: [
        { label: "Cross-region replication", amount: 54200 },
        { label: "Public egress to partners", amount: 33700 },
        { label: "CDN cache-miss ratio", amount: 14900 },
        { label: "Peering discount", amount: -6400 },
      ],
      lines: [38700, 26300, 15900],
    },
    postgres: {
      subs: [
        { label: "Primary cluster upsize", amount: 28400 },
        { label: "Read replica added", amount: 19700 },
        { label: "Backup retention trim", amount: -4200 },
      ],
      lines: [22100, 12800, 5300],
    },
    observability: {
      subs: [
        { label: "Log retention 14 → 30 days", amount: 41600 },
        { label: "Trace sampling increase", amount: 16300 },
        { label: "Metric cardinality cleanup", amount: -5100 },
      ],
      lines: [31400, 12900, 5200],
    },
    savings: {
      subs: [
        { label: "Compute savings plan renewal", amount: -94800 },
        { label: "3-year RI conversion", amount: -38500 },
        { label: "Storage commitment tier", amount: -9300 },
      ],
      lines: [-74300, -31800, -20400],
    },
    idle: {
      subs: [
        { label: "Orphaned volumes deleted", amount: -39200 },
        { label: "Idle dev namespaces", amount: -28700 },
        { label: "Stale load balancers", amount: -14600 },
        { label: "Unattached IPs released", amount: -5800 },
      ],
      lines: [-33600, -24900, -12700],
    },
    storage: {
      subs: [
        { label: "Cold tier transition", amount: -61400 },
        { label: "Snapshot pruning", amount: -42300 },
        { label: "Restore-fee offset", amount: 7200 },
      ],
      lines: [-52800, -27400, -9900],
    },
    support: {
      subs: [
        { label: "Enterprise support tier", amount: 11200 },
        { label: "Security scanning seats", amount: 3900 },
        { label: "Data catalog seats", amount: 1500 },
      ],
      lines: [11200, 3100, 1200],
    },
  },
};

const LAST_MONTH = MONTHS[MONTHS.length - 1];
const PREV_MONTH = MONTHS[MONTHS.length - 2];
const LAST_QUARTER = QUARTERS[QUARTERS.length - 1];
const PREV_QUARTER = QUARTERS[QUARTERS.length - 2];

export type BasisMeta = {
  id: BasisId;
  label: string;
  full: string;
  openingLabel: string;
  closingLabel: string;
  opening: number;
  closing: number;
  /** Which period series the trend chart shows for this basis. */
  series: PeriodPoint[];
  seriesCaption: string;
  unitNoun: string;
};

export const BASES: BasisMeta[] = [
  {
    id: "mom",
    label: "MoM",
    full: "Month over month",
    openingLabel: `${PREV_MONTH.full} actual`,
    closingLabel: `${LAST_MONTH.full} actual`,
    opening: PREV_MONTH.actual,
    closing: LAST_MONTH.actual,
    series: MONTHS,
    seriesCaption: "Monthly cloud spend, April 2025 – March 2026",
    unitNoun: "month",
  },
  {
    id: "qoq",
    label: "QoQ",
    full: "Quarter over quarter",
    openingLabel: `${PREV_QUARTER.full} actual`,
    closingLabel: `${LAST_QUARTER.full} actual`,
    opening: PREV_QUARTER.actual,
    closing: LAST_QUARTER.actual,
    series: QUARTERS,
    seriesCaption: "Quarterly cloud spend, Q2 2024 – Q1 2026",
    unitNoun: "quarter",
  },
  {
    id: "plan",
    label: "vs Plan",
    full: "Actual versus plan",
    openingLabel: `${LAST_MONTH.full} plan`,
    closingLabel: `${LAST_MONTH.full} actual`,
    opening: LAST_MONTH.plan,
    closing: LAST_MONTH.actual,
    series: MONTHS,
    seriesCaption: "Monthly cloud spend, April 2025 – March 2026",
    unitNoun: "month",
  },
];

export const BASIS_BY_ID: Record<BasisId, BasisMeta> = {
  mom: BASES[0],
  qoq: BASES[1],
  plan: BASES[2],
};

/* -------------------------------------------------------------------------- bridge */

export type SubDriver = { label: string; amount: number };

export type LineItem = {
  id: string;
  resource: string;
  account: string;
  service: string;
  amount: number;
};

export type BridgeRow = DriverMeta & {
  /** Derived: Σ sub-drivers. Never typed by hand. */
  amount: number;
  /** Running balance AFTER this driver is applied. */
  runningTotal: number;
  /** |amount| ÷ Σ|amounts| — how much of the gross variance this driver explains. */
  share: number;
  subs: SubDriver[];
  subTotal: number;
  lineItems: LineItem[];
  /** driver amount − Σ named line items. Derived, so the drill column always foots. */
  otherAmount: number;
  otherCount: number;
  lineCount: number;
  direction: "increase" | "decrease";
};

export type Bridge = {
  basis: BasisMeta;
  opening: number;
  closing: number;
  net: number;
  /** opening + Σ contributions. Compared against `closing` to produce `balanced`. */
  derivedClosing: number;
  balanced: boolean;
  grossVariance: number;
  rows: BridgeRow[];
  largest: BridgeRow;
};

function buildBridge(basisId: BasisId): Bridge {
  const basis = BASIS_BY_ID[basisId];
  const facts = FACTS[basisId];

  const amounts = DRIVERS.map((d) => facts[d.id].subs.reduce((a, s) => a + s.amount, 0));
  const grossVariance = amounts.reduce((a, v) => a + Math.abs(v), 0);

  let running = basis.opening;
  const rows: BridgeRow[] = DRIVERS.map((meta, i) => {
    const amount = amounts[i];
    running += amount;
    const f = facts[meta.id];
    const lineItems: LineItem[] = LINE_TEMPLATES[meta.id].map((t, j) => ({
      id: `${basisId}-${meta.id}-${j}`,
      ...t,
      amount: f.lines[j],
    }));
    const namedTotal = lineItems.reduce((a, l) => a + l.amount, 0);
    return {
      ...meta,
      amount,
      runningTotal: running,
      share: (Math.abs(amount) / grossVariance) * 100,
      subs: f.subs,
      subTotal: f.subs.reduce((a, s) => a + s.amount, 0),
      lineItems,
      otherAmount: amount - namedTotal,
      otherCount: LINE_COUNTS[meta.id] - lineItems.length,
      lineCount: LINE_COUNTS[meta.id],
      direction: amount < 0 ? "decrease" : "increase",
    };
  });

  const net = amounts.reduce((a, v) => a + v, 0);
  const derivedClosing = basis.opening + net;

  return {
    basis,
    opening: basis.opening,
    closing: basis.closing,
    net,
    derivedClosing,
    balanced: derivedClosing === basis.closing,
    grossVariance,
    rows,
    largest: rows.reduce((best, r) => (Math.abs(r.amount) > Math.abs(best.amount) ? r : best), rows[0]),
  };
}

export const BRIDGES: Record<BasisId, Bridge> = {
  mom: buildBridge("mom"),
  qoq: buildBridge("qoq"),
  plan: buildBridge("plan"),
};

/** Command-palette corpus: every driver and every named line item, across every basis. */
export type SearchEntry =
  | { kind: "driver"; basis: BasisId; driverId: DriverId; title: string; meta: string; Icon: LucideIcon }
  | { kind: "line"; basis: BasisId; driverId: DriverId; title: string; meta: string; Icon: LucideIcon };

export const SEARCH_ENTRIES: SearchEntry[] = (Object.keys(BRIDGES) as BasisId[]).flatMap((basisId) =>
  BRIDGES[basisId].rows.flatMap((row) => [
    {
      kind: "driver" as const,
      basis: basisId,
      driverId: row.id,
      title: row.label,
      meta: `${BASIS_BY_ID[basisId].label} · ${row.type} · ${formatSignedUSD(row.amount)}`,
      Icon: row.Icon,
    },
    ...row.lineItems.map((l) => ({
      kind: "line" as const,
      basis: basisId,
      driverId: row.id,
      title: l.resource,
      meta: `${BASIS_BY_ID[basisId].label} · ${l.account} · ${formatSignedUSD(l.amount)}`,
      Icon: row.Icon,
    })),
  ]),
);
