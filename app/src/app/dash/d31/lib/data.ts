// 결정론적 목업 데이터. Math.random() / Date.now() 사용 금지 — 모든 시각은 고정 기준시각(NOW)
// 기준 상대/절대 값으로 계산한다. 서버·클라이언트 렌더 결과가 항상 동일하다.

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

/** 대시보드 스냅샷 기준 시각 (고정값 — 실제 시계 미사용). */
export const NOW = new Date("2026-07-11T15:07:00+09:00");

function subDays(days: number): Date {
  return new Date(NOW.getTime() - days * DAY_MS);
}
function subMinutes(minutes: number): Date {
  return new Date(NOW.getTime() - minutes * 60_000);
}

const dateLabel = new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit" });

/** 총합을 정수 가중치로 나누되 나머지를 최대잔여법으로 배분해 부분합=총합을 보장한다. */
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
// 실행 추이 시계열 (기간별)
// ---------------------------------------------------------------------------

const SUCCESS_24H = [22, 26, 19, 14, 10, 8, 6, 5, 4, 3, 3, 4, 6, 9, 17, 35, 54, 63, 60, 57, 52, 49, 44, 51];
const FAILED_24H = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 19, 8];

const hourly24h: PeriodPoint[] = SUCCESS_24H.map((success, i) => {
  const hoursAgo = 23 - i;
  return {
    label: hoursAgo === 0 ? "지금" : `-${hoursAgo}h`,
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

// 30일 뷰의 마지막 7일은 7일 뷰와 동일한 값을 사용해 기간 전환 시 정합을 유지한다.
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

/** 기간별 평균 실행 소요시간(ms) — 표시용 대표값. */
export const PERIOD_AVG_DURATION_MS: Record<Period, number> = {
  "24h": 588,
  "7d": 642,
  "30d": 615,
};

/** 이전 기간 대비 증감률(%) — KPI 카드 보조 지표. */
export const PERIOD_DELTA: Record<Period, { executions: number; successRate: number; failed: number; avgDuration: number }> = {
  "24h": { executions: 8.2, successRate: -1.4, failed: 42.0, avgDuration: -3.1 },
  "7d": { executions: 5.6, successRate: -0.6, failed: 18.9, avgDuration: 1.2 },
  "30d": { executions: 12.4, successRate: 0.3, failed: -6.5, avgDuration: -4.8 },
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

/** 24시간 뷰에서 실패 급증 구간을 탐지 (알림 카드용, 데이터에서 직접 계산). */
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
// 워크플로 카탈로그
// ---------------------------------------------------------------------------

export const WORKFLOWS: Workflow[] = [
  {
    id: "wf_b84c0e",
    name: "Stripe 결제 웹훅 처리",
    category: "결제",
    executions: 1240,
    failed: 92,
    avgDurationMs: 640,
    lastStatus: "failed",
    sparkline: distribute(1240, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_4a1f0c",
    name: "주문 동기화 → 물류창고",
    category: "재고",
    executions: 1180,
    failed: 14,
    avgDurationMs: 2340,
    lastStatus: "success",
    sparkline: distribute(1180, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_2f9d15",
    name: "지원 티켓 라우팅",
    category: "고객지원",
    executions: 760,
    failed: 9,
    avgDurationMs: 810,
    lastStatus: "success",
    sparkline: distribute(760, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_e02f6a",
    name: "Slack 장애 알림",
    category: "알림",
    executions: 500,
    failed: 3,
    avgDurationMs: 205,
    lastStatus: "success",
    sparkline: distribute(500, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_1c7e88",
    name: "리드 보강 (Clearbit)",
    category: "CRM",
    executions: 330,
    failed: 24,
    avgDurationMs: 2980,
    lastStatus: "warning",
    sparkline: distribute(330, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_c630a7",
    name: "재고 부족 경보",
    category: "재고",
    executions: 160,
    failed: 3,
    avgDurationMs: 1310,
    lastStatus: "success",
    sparkline: distribute(160, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_9d3b21",
    name: "인보이스 PDF 생성",
    category: "청구",
    executions: 150,
    failed: 2,
    avgDurationMs: 1790,
    lastStatus: "success",
    sparkline: distribute(150, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_08e4d9",
    name: "CRM → 스프레드시트 내보내기",
    category: "리포팅",
    executions: 29,
    failed: 1,
    avgDurationMs: 655,
    lastStatus: "running",
    sparkline: distribute(29, [1, 0.95, 0.85, 1.6, 1.65, 1.7, 1.05]),
  },
  {
    id: "wf_77bca4",
    name: "야간 DB 백업",
    category: "운영",
    executions: 7,
    failed: 0,
    avgDurationMs: 156_000,
    lastStatus: "success",
    sparkline: distribute(7, [1, 1, 1, 1, 1, 1, 1]),
  },
];

export const WORKFLOW_BY_ID = new Map(WORKFLOWS.map((w) => [w.id, w]));

// ---------------------------------------------------------------------------
// 최근 실행 로그 (분 단위 오프셋 → NOW 기준 절대시각으로 환산, 결정론적)
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

/** 워크플로별 가장 최근 실행 시각 (로그에서 직접 파생 — 이중 관리 방지). */
export function lastRunAt(workflowId: string): Date {
  const entries = EXECUTION_LOG.filter((e) => e.workflowId === workflowId);
  return entries.reduce((latest, e) => (e.startedAt > latest ? e.startedAt : latest), new Date(0));
}

// ---------------------------------------------------------------------------
// 크레딧 / 사용량
// ---------------------------------------------------------------------------

export const CREDITS = {
  used: 148_230,
  total: 200_000,
  renewalDate: new Date("2026-08-01T00:00:00+09:00"),
  estimatedBillingKRW: 428_000,
};
