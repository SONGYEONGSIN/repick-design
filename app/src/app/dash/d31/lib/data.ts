// Deterministic mock data. No Math.random() / Date.now() — every timestamp is computed relative
// to (or as an absolute anchored on) the fixed reference instant (NOW). Server and client render output is always identical.

export type Period = "24h" | "7d" | "30d";
export type ExecStatus = "success" | "failed" | "running" | "warning";

export interface PeriodPoint {
  label: string;
  success: number;
  failed: number;
}

export interface Workflow {
  id: string;
  name: string;
  category: string;
  executions: number;
  failed: number;
  avgDurationMs: number;
  lastStatus: ExecStatus;
  sparkline: number[];
}

export interface ExecutionLogEntry {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecStatus;
  durationMs: number | null;
  startedAt: Date;
  triggeredBy: "schedule" | "webhook" | "manual";
}

const DAY_MS = 86_400_000;

/** Dashboard snapshot reference instant (fixed value — no real clock used). */
export const NOW = new Date("2026-07-11T15:07:00+09:00");

function subDays(days: number): Date {
  return new Date(NOW.getTime() - days * DAY_MS);
}
function subMinutes(minutes: number): Date {
  return new Date(NOW.getTime() - minutes * 60_000);
}

const dateLabel = new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit" });

/** Splits a total by integer weights, distributing the remainder via the largest-remainder method so the parts sum exactly to the total. */
function distribute(total: number, weights: number[]): number[] {
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / weightSum);
  const floors = raw.map(Math.floor);
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floors];
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    result[order[k].i] += 1;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Execution trend time series (by period)
// ---------------------------------------------------------------------------

const SUCCESS_24H = [22, 26, 19, 14, 10, 8, 6, 5, 4, 3, 3, 4, 6, 9, 17, 35, 54, 63, 60, 57, 52, 49, 44, 51];
const FAILED_24H = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 19, 8];

const hourly24h: PeriodPoint[] = SUCCESS_24H.map((success, i) => {
  const hoursAgo = 23 - i;
  return {
    label: hoursAgo === 0 ? "Now" : `-${hoursAgo}h`,
    success,
    failed: FAILED_24H[i],
  };
});

const SUCCESS_7D = [612, 588, 631, 674, 690, 655, 358];
const FAILED_7D = [18, 14, 22, 45, 31, 11, 7];

const daily7d: PeriodPoint[] = SUCCESS_7D.map((success, i) => {
  const daysAgo = 6 - i;
  return { label: dateLabel.format(subDays(daysAgo)), success, failed: FAILED_7D[i] };
});

// The last 7 days of the 30-day view use the same values as the 7-day view, keeping the two consistent when switching periods.
const WEEK_PATTERN = [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05];
const leadingDays = 23;
const leadingSuccess: number[] = [];
const leadingFailed: number[] = [];
for (let i = 0; i < leadingDays; i++) {
  const base = 350 + i * 8;
  const success = Math.round(base * WEEK_PATTERN[i % 7]);
  const failed = Math.round(success * (0.022 + (i % 5) * 0.004));
  leadingSuccess.push(success);
  leadingFailed.push(failed);
}
const SUCCESS_30D = [...leadingSuccess, ...SUCCESS_7D];
const FAILED_30D = [...leadingFailed, ...FAILED_7D];

const daily30d: PeriodPoint[] = SUCCESS_30D.map((success, i) => {
  const daysAgo = 29 - i;
  return { label: dateLabel.format(subDays(daysAgo)), success, failed: FAILED_30D[i] };
});

export const PERIOD_SERIES: Record<Period, PeriodPoint[]> = {
  "24h": hourly24h,
  "7d": daily7d,
  "30d": daily30d,
};

export function periodTotals(period: Period) {
  const series = PERIOD_SERIES[period];
  const success = series.reduce((a, p) => a + p.success, 0);
  const failed = series.reduce((a, p) => a + p.failed, 0);
  const total = success + failed;
  return {
    total,
    success,
    failed,
    successRate: total === 0 ? 0 : (success / total) * 100,
  };
}

/** Detects the failure-spike window in the 24h view (for the alert card, computed directly from the data). */
export function detectErrorSpike() {
  const series = PERIOD_SERIES["24h"];
  let peakIndex = 0;
  for (let i = 1; i < series.length; i++) {
    if (series[i].failed > series[peakIndex].failed) peakIndex = i;
  }
  const peak = series[peakIndex];
  const others = series.filter((_, i) => i !== peakIndex).map((p) => p.failed);
  const baseline = others.reduce((a, b) => a + b, 0) / others.length;
  const ratio = baseline === 0 ? peak.failed : peak.failed / baseline;
  return { label: peak.label, count: peak.failed, baseline, ratio };
}

// ---------------------------------------------------------------------------
// Workflow catalog
// ---------------------------------------------------------------------------

export const WORKFLOWS: Workflow[] = [
  {
    id: "wf_b84c0e",
    name: "Stripe payment webhook processing",
    category: "Payments",
    executions: 1240,
    failed: 92,
    avgDurationMs: 640,
    lastStatus: "failed",
    sparkline: distribute(1240, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_4a1f0c",
    name: "Order sync → warehouse",
    category: "Inventory",
    executions: 1180,
    failed: 14,
    avgDurationMs: 2340,
    lastStatus: "success",
    sparkline: distribute(1180, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_2f9d15",
    name: "Support ticket routing",
    category: "Customer support",
    executions: 760,
    failed: 9,
    avgDurationMs: 810,
    lastStatus: "success",
    sparkline: distribute(760, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_e02f6a",
    name: "Slack incident alerts",
    category: "Alerts",
    executions: 500,
    failed: 3,
    avgDurationMs: 205,
    lastStatus: "success",
    sparkline: distribute(500, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_1c7e88",
    name: "Lead enrichment (Clearbit)",
    category: "CRM",
    executions: 330,
    failed: 24,
    avgDurationMs: 2980,
    lastStatus: "warning",
    sparkline: distribute(330, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_c630a7",
    name: "Low stock alerts",
    category: "Inventory",
    executions: 160,
    failed: 3,
    avgDurationMs: 1310,
    lastStatus: "success",
    sparkline: distribute(160, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_9d3b21",
    name: "Invoice PDF generation",
    category: "Billing",
    executions: 150,
    failed: 2,
    avgDurationMs: 1790,
    lastStatus: "success",
    sparkline: distribute(150, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_08e4d9",
    name: "CRM → spreadsheet export",
    category: "Reporting",
    executions: 29,
    failed: 1,
    avgDurationMs: 655,
    lastStatus: "running",
    sparkline: distribute(29, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_77bca4",
    name: "Nightly DB backup",
    category: "Operations",
    executions: 7,
    failed: 0,
    avgDurationMs: 156_000,
    lastStatus: "success",
    sparkline: distribute(7, [1, 1, 1, 1, 1, 1, 1]),
  },
];

export const WORKFLOW_BY_ID = new Map(WORKFLOWS.map((w) => [w.id, w]));

const TOTAL_WORKFLOW_EXECUTIONS = WORKFLOWS.reduce((sum, w) => sum + w.executions, 0);

export function workflowSuccessRate(workflow: Workflow): number {
  return workflow.executions === 0 ? 0 : ((workflow.executions - workflow.failed) / workflow.executions) * 100;
}

/** Tiles the 7-day sparkline pattern out to the target length to build per-point shape weights (a 0 weight is corrected to 1). */
function tileShape(shape: number[], length: number): number[] {
  return Array.from({ length }, (_, i) => shape[i % shape.length] || 1);
}

/**
 * Per-workflow execution trend time series — allocates the workflow's share of executions
 * out of the global period total, then shapes each point using the workflow's own sparkline
 * pattern (the sum of the points is guaranteed to equal the allocated workflow total).
 * The 24h view for the Stripe webhook (wf_b84c0e) mirrors the global failure-spike window shape
 * exactly, to stay consistent with the alert card.
 */
export function workflowPeriodSeries(workflowId: string, period: Period): PeriodPoint[] {
  const workflow = WORKFLOW_BY_ID.get(workflowId);
  if (!workflow) throw new Error(`unknown workflow: ${workflowId}`);

  const globalSeries = PERIOD_SERIES[period];
  const n = globalSeries.length;
  const share = workflow.executions / TOTAL_WORKFLOW_EXECUTIONS;
  const workflowTotal = Math.round(periodTotals(period).total * share);
  const successRate = workflowSuccessRate(workflow) / 100;
  const workflowFailed = Math.min(workflowTotal, Math.round(workflowTotal * (1 - successRate)));
  const workflowSuccess = workflowTotal - workflowFailed;

  const shape = tileShape(workflow.sparkline, n);
  const failedShape = workflowId === "wf_b84c0e" && period === "24h" ? FAILED_24H : shape;

  const successCounts = distribute(workflowSuccess, shape);
  const failedCounts = distribute(workflowFailed, failedShape);

  return globalSeries.map((p, i) => ({
    label: p.label,
    success: successCounts[i],
    failed: failedCounts[i],
  }));
}

// ---------------------------------------------------------------------------
// Recent execution log (minute offsets → converted to absolute times anchored on NOW, deterministic)
// ---------------------------------------------------------------------------

interface LogSeed {
  minutesAgo: number;
  workflowId: string;
  status: ExecStatus;
  durationMs: number | null;
  triggeredBy: ExecutionLogEntry["triggeredBy"];
}

const LOG_SEED: LogSeed[] = [
  { minutesAgo: 1, workflowId: "wf_b84c0e", status: "failed", durationMs: 5040, triggeredBy: "webhook" },
  { minutesAgo: 3, workflowId: "wf_4a1f0c", status: "success", durationMs: 2380, triggeredBy: "schedule" },
  { minutesAgo: 4, workflowId: "wf_2f9d15", status: "success", durationMs: 890, triggeredBy: "webhook" },
  { minutesAgo: 6, workflowId: "wf_1c7e88", status: "warning", durationMs: 3120, triggeredBy: "webhook" },
  { minutesAgo: 8, workflowId: "wf_b84c0e", status: "success", durationMs: 455, triggeredBy: "webhook" },
  { minutesAgo: 9, workflowId: "wf_08e4d9", status: "running", durationMs: null, triggeredBy: "schedule" },
  { minutesAgo: 11, workflowId: "wf_e02f6a", status: "success", durationMs: 210, triggeredBy: "webhook" },
  { minutesAgo: 13, workflowId: "wf_c630a7", status: "success", durationMs: 1340, triggeredBy: "schedule" },
  { minutesAgo: 15, workflowId: "wf_b84c0e", status: "failed", durationMs: 5023, triggeredBy: "webhook" },
  { minutesAgo: 16, workflowId: "wf_4a1f0c", status: "success", durationMs: 2290, triggeredBy: "schedule" },
  { minutesAgo: 18, workflowId: "wf_2f9d15", status: "success", durationMs: 760, triggeredBy: "webhook" },
  { minutesAgo: 21, workflowId: "wf_1c7e88", status: "failed", durationMs: 8110, triggeredBy: "webhook" },
  { minutesAgo: 24, workflowId: "wf_9d3b21", status: "success", durationMs: 1870, triggeredBy: "manual" },
  { minutesAgo: 27, workflowId: "wf_b84c0e", status: "failed", durationMs: 4998, triggeredBy: "webhook" },
  { minutesAgo: 30, workflowId: "wf_b84c0e", status: "success", durationMs: 402, triggeredBy: "webhook" },
  { minutesAgo: 34, workflowId: "wf_e02f6a", status: "success", durationMs: 198, triggeredBy: "webhook" },
  { minutesAgo: 38, workflowId: "wf_4a1f0c", status: "success", durationMs: 2410, triggeredBy: "schedule" },
  { minutesAgo: 42, workflowId: "wf_b84c0e", status: "failed", durationMs: 5110, triggeredBy: "webhook" },
  { minutesAgo: 47, workflowId: "wf_2f9d15", status: "warning", durationMs: 1290, triggeredBy: "webhook" },
  { minutesAgo: 52, workflowId: "wf_b84c0e", status: "failed", durationMs: 4870, triggeredBy: "webhook" },
  { minutesAgo: 58, workflowId: "wf_c630a7", status: "success", durationMs: 1298, triggeredBy: "schedule" },
  { minutesAgo: 63, workflowId: "wf_b84c0e", status: "failed", durationMs: 5200, triggeredBy: "webhook" },
  { minutesAgo: 67, workflowId: "wf_b84c0e", status: "failed", durationMs: 4950, triggeredBy: "webhook" },
  { minutesAgo: 71, workflowId: "wf_08e4d9", status: "success", durationMs: 640, triggeredBy: "schedule" },
  { minutesAgo: 78, workflowId: "wf_77bca4", status: "success", durationMs: 154_200, triggeredBy: "schedule" },
  { minutesAgo: 85, workflowId: "wf_4a1f0c", status: "success", durationMs: 2350, triggeredBy: "schedule" },
];

export const EXECUTION_LOG: ExecutionLogEntry[] = LOG_SEED.map((seed, i) => {
  const workflow = WORKFLOW_BY_ID.get(seed.workflowId);
  if (!workflow) throw new Error(`unknown workflow: ${seed.workflowId}`);
  return {
    id: `exec_${(1000 + i).toString(16)}${seed.workflowId.slice(3, 6)}`,
    workflowId: seed.workflowId,
    workflowName: workflow.name,
    status: seed.status,
    durationMs: seed.durationMs,
    startedAt: subMinutes(seed.minutesAgo),
    triggeredBy: seed.triggeredBy,
  };
});

/** Most recent execution time per workflow (derived directly from the log — avoids maintaining it twice). */
export function lastRunAt(workflowId: string): Date {
  const entries = EXECUTION_LOG.filter((e) => e.workflowId === workflowId);
  return entries.reduce((latest, e) => (e.startedAt > latest ? e.startedAt : latest), new Date(0));
}

// ---------------------------------------------------------------------------
// Credits / usage
// ---------------------------------------------------------------------------

export const CREDITS = {
  used: 148_230,
  total: 200_000,
  renewalDate: new Date("2026-08-01T00:00:00+09:00"),
  estimatedBillingKRW: 428_000,
};
