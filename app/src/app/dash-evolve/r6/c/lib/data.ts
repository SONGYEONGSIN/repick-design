// Foothold — 코호트 리텐션 분석 제품의 결정론적 더미 데이터
// 규칙: Math.random()/Date.now()/new Date() 런타임 호출 없음. 전부 고정 리터럴 + 순수 산술로 파생.

export type MetricId = "retention" | "revenue";
export type DefinitionId = "weekly" | "monthly";

export interface ChannelShare {
  channel: string;
  pct: number; // 정수, 한 코호트 내 채널 pct 합 = 100
}

export interface CohortRow {
  id: string;
  shortLabel: string; // 표에 들어가는 짧은 라벨 (nowrap)
  fullLabel: string; // 상세 패널/스크린리더용 전체 라벨
  size: number; // 가입자 수
  periodsAvailable: number; // 1~8, 관측된 기간 수 (최근 코호트일수록 적음 — 실서비스형 삼각 매트릭스)
  retention: number[]; // 길이 8, 0=100 고정, 이후 %
  revenueRetention: number[]; // 길이 8, 0=100 고정, 확장매출 포함 가능(>100)
  channelMix: ChannelShare[]; // 길이 5, pct 합 = 100
}

export interface DatasetDefinition {
  id: DefinitionId;
  label: string;
  periodUnitLabel: string; // "주차" | "개월차"
  periodShortLabels: string[]; // 8개, 예: W0..W7
  periodFullLabels: string[]; // 8개, 스크린리더용
  cohorts: CohortRow[]; // 최신 코호트가 index 0 (표 최상단)
}

const PERIODS = 8;

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ── 채널 믹스 (5개 채널, 코호트별로 결정론적으로 살짝 변주되지만 항상 합 100) ──
const CHANNEL_NAMES = ["Organic Search", "Paid Social", "Referral", "Direct", "Email"] as const;

function channelMixForCohort(i: number): ChannelShare[] {
  const shiftA = (i % 5) - 2; // -2..2, Organic ↔ Paid 사이에서만 이동
  const shiftB = ((i + 2) % 4) - 1; // -1..2, Referral ↔ Direct 사이에서만 이동
  const organic = 34 + shiftA;
  const paid = 26 - shiftA;
  const referral = 18 + shiftB;
  const direct = 14 - shiftB;
  const email = 8;
  return [
    { channel: CHANNEL_NAMES[0], pct: organic },
    { channel: CHANNEL_NAMES[1], pct: paid },
    { channel: CHANNEL_NAMES[2], pct: referral },
    { channel: CHANNEL_NAMES[3], pct: direct },
    { channel: CHANNEL_NAMES[4], pct: email },
  ];
}

// ── 리텐션 곡선 산출 (기저 감쇠 곡선 × 코호트 품질 배수, 전부 고정 배열) ──
const WEEKLY_BASE_DECAY = [100, 44, 33, 28, 25, 22, 20, 18];
const MONTHLY_BASE_DECAY = [100, 36, 25, 20, 17, 15, 13, 11];

const WEEKLY_QUALITY = [1.08, 1.04, 0.97, 1.12, 0.93, 1.06, 1.15, 0.99, 1.02, 0.9, 1.1, 1.05];
const MONTHLY_QUALITY = [1.06, 0.95, 1.11, 1.02, 0.9, 1.14, 0.98, 1.08, 1.0, 0.93, 1.16, 1.04];

// 확장매출(업셀/시트 추가)로 기간이 지날수록 매출 리텐션이 사용자 리텐션보다 높게 남는 전형적인 SaaS NRR 패턴
const EXPANSION_FACTOR = [1, 1.06, 1.11, 1.17, 1.22, 1.27, 1.31, 1.36];

const PERIODS_AVAILABLE = [1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8];

function buildRetention(base: number[], quality: number): number[] {
  return base.map((v, p) => (p === 0 ? 100 : clamp(Math.round(v * quality), 1, 100)));
}

function buildRevenueRetention(retention: number[], base: number[], quality: number): number[] {
  return base.map((v, p) =>
    p === 0 ? 100 : clamp(Math.round(v * quality * EXPANSION_FACTOR[p]), 1, 220),
  );
}

// ── 주간 코호트 ──
const WEEKLY_SHORT_LABELS = [
  "07/13",
  "07/06",
  "06/29",
  "06/22",
  "06/15",
  "06/08",
  "06/01",
  "05/25",
  "05/18",
  "05/11",
  "05/04",
  "04/27",
];
const WEEKLY_FULL_LABELS = [
  "2026년 7월 13일 주 코호트",
  "2026년 7월 6일 주 코호트",
  "2026년 6월 29일 주 코호트",
  "2026년 6월 22일 주 코호트",
  "2026년 6월 15일 주 코호트",
  "2026년 6월 8일 주 코호트",
  "2026년 6월 1일 주 코호트",
  "2026년 5월 25일 주 코호트",
  "2026년 5월 18일 주 코호트",
  "2026년 5월 11일 주 코호트",
  "2026년 5월 4일 주 코호트",
  "2026년 4월 27일 주 코호트",
];
const WEEKLY_SIZES = [842, 915, 788, 1024, 967, 1103, 1240, 876, 932, 1058, 799, 861];

// ── 월간 코호트 ──
const MONTHLY_SHORT_LABELS = [
  "Jul '26",
  "Jun '26",
  "May '26",
  "Apr '26",
  "Mar '26",
  "Feb '26",
  "Jan '26",
  "Dec '25",
  "Nov '25",
  "Oct '25",
  "Sep '25",
  "Aug '25",
];
const MONTHLY_FULL_LABELS = [
  "2026년 7월 가입 코호트",
  "2026년 6월 가입 코호트",
  "2026년 5월 가입 코호트",
  "2026년 4월 가입 코호트",
  "2026년 3월 가입 코호트",
  "2026년 2월 가입 코호트",
  "2026년 1월 가입 코호트",
  "2025년 12월 가입 코호트",
  "2025년 11월 가입 코호트",
  "2025년 10월 가입 코호트",
  "2025년 9월 가입 코호트",
  "2025년 8월 가입 코호트",
];
const MONTHLY_SIZES = [3210, 3684, 3105, 4088, 3520, 4415, 3960, 3287, 3798, 3402, 3055, 3611];

function buildCohorts(
  shortLabels: string[],
  fullLabels: string[],
  sizes: number[],
  base: number[],
  quality: number[],
): CohortRow[] {
  return shortLabels.map((shortLabel, i) => {
    const retention = buildRetention(base, quality[i]);
    const revenueRetention = buildRevenueRetention(retention, base, quality[i]);
    return {
      id: `${shortLabel}-${i}`,
      shortLabel,
      fullLabel: fullLabels[i],
      size: sizes[i],
      periodsAvailable: PERIODS_AVAILABLE[i],
      retention,
      revenueRetention,
      channelMix: channelMixForCohort(i),
    };
  });
}

function periodLabels(unit: string): { short: string[]; full: string[] } {
  const short = Array.from({ length: PERIODS }, (_, p) => `${unit === "주차" ? "W" : "M"}${p}`);
  const full = Array.from({ length: PERIODS }, (_, p) => `가입 후 ${p}${unit}`);
  return { short, full };
}

const weeklyLabels = periodLabels("주차");
const monthlyLabels = periodLabels("개월차");

export const WEEKLY_DATASET: DatasetDefinition = {
  id: "weekly",
  label: "주간 코호트",
  periodUnitLabel: "주차",
  periodShortLabels: weeklyLabels.short,
  periodFullLabels: weeklyLabels.full,
  cohorts: buildCohorts(
    WEEKLY_SHORT_LABELS,
    WEEKLY_FULL_LABELS,
    WEEKLY_SIZES,
    WEEKLY_BASE_DECAY,
    WEEKLY_QUALITY,
  ),
};

export const MONTHLY_DATASET: DatasetDefinition = {
  id: "monthly",
  label: "월간 코호트",
  periodUnitLabel: "개월차",
  periodShortLabels: monthlyLabels.short,
  periodFullLabels: monthlyLabels.full,
  cohorts: buildCohorts(
    MONTHLY_SHORT_LABELS,
    MONTHLY_FULL_LABELS,
    MONTHLY_SIZES,
    MONTHLY_BASE_DECAY,
    MONTHLY_QUALITY,
  ),
};

export function getDataset(id: DefinitionId): DatasetDefinition {
  return id === "weekly" ? WEEKLY_DATASET : MONTHLY_DATASET;
}

export function valueFor(cohort: CohortRow, period: number, metric: MetricId): number {
  return metric === "retention" ? cohort.retention[period] : cohort.revenueRetention[period];
}

// 블렌디드(가중평균) 지표 — 해당 기간에 데이터가 있는 코호트만 사이즈 가중
export function blendedAtPeriod(
  dataset: DatasetDefinition,
  period: number,
  metric: MetricId,
): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const c of dataset.cohorts) {
    if (c.periodsAvailable > period) {
      weightedSum += valueFor(c, period, metric) * c.size;
      weightTotal += c.size;
    }
  }
  return weightTotal === 0 ? 0 : Math.round(weightedSum / weightTotal);
}

export function totalTrackedUsers(dataset: DatasetDefinition): number {
  return dataset.cohorts.reduce((sum, c) => sum + c.size, 0);
}

export function topChannel(dataset: DatasetDefinition): { channel: string; avgPct: number } {
  const totals = new Map<string, number>();
  for (const c of dataset.cohorts) {
    for (const share of c.channelMix) {
      totals.set(share.channel, (totals.get(share.channel) ?? 0) + share.pct);
    }
  }
  let best = CHANNEL_NAMES[0] as string;
  let bestSum = -1;
  for (const [channel, sum] of totals) {
    if (sum > bestSum) {
      best = channel;
      bestSum = sum;
    }
  }
  return { channel: best, avgPct: Math.round(bestSum / dataset.cohorts.length) };
}

// 도메인 최댓값(컬러 스케일·스파크라인 축 공용 기준) — retention은 100%, revenue는 확장매출 포함 220%까지
export function domainMax(metric: MetricId): number {
  return metric === "retention" ? 100 : 220;
}

export const percentFormatter = new Intl.NumberFormat("ko-KR", {
  style: "percent",
  maximumFractionDigits: 0,
});

export const numberFormatter = new Intl.NumberFormat("ko-KR");

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100);
}

export function formatUsers(value: number): string {
  return `${numberFormatter.format(value)}명`;
}

export { round2 };
