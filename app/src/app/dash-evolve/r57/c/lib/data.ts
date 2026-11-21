// Deterministic, hand-authored pipeline telemetry for the Trestle console. No Math.random, no
// Date.now, no bare `new Date()` — every number below is a fixed literal. Anything "derived"
// (failed counts, fail rates, impact scores, SLA multiples, edges, bottleneck ranking, totals) is
// computed once in `buildPeriod` from the same `entered`/`passed` pair per stage, so a stage's
// aggregate and any drill-down of that stage always read the same underlying numbers — there is
// no second, independently-typed copy of a count anywhere in the app.

export type PeriodKey = "7d" | "30d";

export interface StageInput {
  id: string;
  name: string;
  description: string;
  /** Builds that reached this stage. */
  entered: number;
  /** Builds that cleared this stage and moved on. */
  passed: number;
  avgDurationMin: number;
  slaMin: number;
}

export interface Stage extends StageInput {
  failed: number;
  failRate: number;
  /** failed * avgDurationMin — a simple, auditable "time lost" ranking score. */
  impactScore: number;
  slaMultiple: number;
  overSla: boolean;
}

export interface TransitionEdge {
  id: string;
  fromId: string;
  fromName: string;
  toId: string | null;
  toName: string;
  /** Builds that advanced across this edge. */
  count: number;
  avgDurationMin: number;
  failedAtSource: number;
  failRateAtSource: number;
  isTerminal: boolean;
}

export interface PeriodData {
  key: PeriodKey;
  label: string;
  totalRuns: number;
  releasedRuns: number;
  successRate: number;
  totalDurationMin: number;
  stages: Stage[];
  edges: TransitionEdge[];
  /** Top 3 stages by impactScore, descending — the "named bottlenecks" callout. */
  bottlenecks: Stage[];
}

function buildPeriod(key: PeriodKey, label: string, raw: StageInput[]): PeriodData {
  const stages: Stage[] = raw.map((s) => {
    const failed = s.entered - s.passed;
    const failRate = failed / s.entered;
    const impactScore = failed * s.avgDurationMin;
    const slaMultiple = s.avgDurationMin / s.slaMin;
    return { ...s, failed, failRate, impactScore, slaMultiple, overSla: slaMultiple > 1 };
  });

  const edges: TransitionEdge[] = [];
  for (let i = 0; i < stages.length - 1; i++) {
    const from = stages[i];
    const to = stages[i + 1];
    edges.push({
      id: `${from.id}-${to.id}`,
      fromId: from.id,
      fromName: from.name,
      toId: to.id,
      toName: to.name,
      count: from.passed,
      avgDurationMin: to.avgDurationMin,
      failedAtSource: from.failed,
      failRateAtSource: from.failRate,
      isTerminal: false,
    });
  }
  const last = stages[stages.length - 1];
  edges.push({
    id: `${last.id}-released`,
    fromId: last.id,
    fromName: last.name,
    toId: null,
    toName: "Released",
    count: last.passed,
    avgDurationMin: last.avgDurationMin,
    failedAtSource: last.failed,
    failRateAtSource: last.failRate,
    isTerminal: true,
  });

  const bottlenecks = [...stages].sort((a, b) => b.impactScore - a.impactScore).slice(0, 3);
  const totalRuns = stages[0].entered;
  const releasedRuns = last.passed;

  return {
    key,
    label,
    totalRuns,
    releasedRuns,
    successRate: releasedRuns / totalRuns,
    totalDurationMin: stages.reduce((sum, s) => sum + s.avgDurationMin, 0),
    stages,
    edges,
    bottlenecks,
  };
}

const STAGES_30D: StageInput[] = [
  { id: "checkout", name: "Checkout", description: "Resolves refs and fetches source from the monorepo.", entered: 4920, passed: 4887, avgDurationMin: 0.4, slaMin: 1.0 },
  { id: "install", name: "Install Deps", description: "Restores and installs the workspace dependency graph.", entered: 4887, passed: 4799, avgDurationMin: 1.8, slaMin: 3.0 },
  { id: "lint", name: "Lint & Typecheck", description: "Static analysis gate — ESLint and the TypeScript compiler.", entered: 4799, passed: 4544, avgDurationMin: 1.1, slaMin: 2.0 },
  { id: "unit", name: "Unit Tests", description: "Package-level test suites, run sharded across workers.", entered: 4544, passed: 4190, avgDurationMin: 6.4, slaMin: 5.0 },
  { id: "build", name: "Build", description: "Compiles and bundles every deployable target.", entered: 4190, passed: 4071, avgDurationMin: 4.2, slaMin: 5.0 },
  { id: "integration", name: "Integration Tests", description: "End-to-end suite against a live ephemeral environment.", entered: 4071, passed: 3498, avgDurationMin: 11.8, slaMin: 6.0 },
  { id: "deploy-staging", name: "Deploy Staging", description: "Rolls the build out to the staging cluster.", entered: 3498, passed: 3402, avgDurationMin: 2.6, slaMin: 3.0 },
  { id: "deploy-prod", name: "Deploy Production", description: "Progressive rollout to the production fleet.", entered: 3402, passed: 3344, avgDurationMin: 3.1, slaMin: 4.0 },
];

const STAGES_7D: StageInput[] = [
  { id: "checkout", name: "Checkout", description: "Resolves refs and fetches source from the monorepo.", entered: 1142, passed: 1134, avgDurationMin: 0.4, slaMin: 1.0 },
  { id: "install", name: "Install Deps", description: "Restores and installs the workspace dependency graph.", entered: 1134, passed: 1111, avgDurationMin: 1.9, slaMin: 3.0 },
  { id: "lint", name: "Lint & Typecheck", description: "Static analysis gate — ESLint and the TypeScript compiler.", entered: 1111, passed: 1049, avgDurationMin: 1.2, slaMin: 2.0 },
  { id: "unit", name: "Unit Tests", description: "Package-level test suites, run sharded across workers.", entered: 1049, passed: 963, avgDurationMin: 6.7, slaMin: 5.0 },
  { id: "build", name: "Build", description: "Compiles and bundles every deployable target.", entered: 963, passed: 936, avgDurationMin: 4.4, slaMin: 5.0 },
  { id: "integration", name: "Integration Tests", description: "End-to-end suite against a live ephemeral environment.", entered: 936, passed: 788, avgDurationMin: 13.2, slaMin: 6.0 },
  { id: "deploy-staging", name: "Deploy Staging", description: "Rolls the build out to the staging cluster.", entered: 788, passed: 768, avgDurationMin: 2.7, slaMin: 3.0 },
  { id: "deploy-prod", name: "Deploy Production", description: "Progressive rollout to the production fleet.", entered: 768, passed: 754, avgDurationMin: 3.2, slaMin: 4.0 },
];

export const PERIODS: Record<PeriodKey, PeriodData> = {
  "7d": buildPeriod("7d", "Last 7 days", STAGES_7D),
  "30d": buildPeriod("30d", "Last 30 days", STAGES_30D),
};

export const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
];

// ---------------------------------------------------------------------------
// Formatters — Intl everywhere, no hand-rolled string math.
// ---------------------------------------------------------------------------

const intCount = new Intl.NumberFormat("en-US");

export function formatCount(n: number): string {
  return intCount.format(n);
}

export function formatPercent(fraction: number, decimals = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(fraction);
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return new Intl.NumberFormat("en-US", {
      style: "unit",
      unit: "second",
      unitDisplay: "short",
    }).format(seconds);
  }
  return new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "minute",
    unitDisplay: "short",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(minutes);
}

export function formatMultiple(x: number): string {
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(x)}×`;
}

export function stageById(data: PeriodData, id: string): Stage | undefined {
  return data.stages.find((s) => s.id === id);
}
