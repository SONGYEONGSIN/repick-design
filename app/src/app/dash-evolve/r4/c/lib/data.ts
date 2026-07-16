// Parallax — 리포트 캔버스 더미 데이터.
// 전부 사전 정의된 결정론적 시나리오 매핑이다. Math.random / Date.now / new Date() 사용 없음.
// 공유 필터(기간 × 세그먼트)가 바뀌면 아래 매핑 테이블에서 값을 다시 조회해 모든 위젯이 함께 갱신된다.

export type RangeId = "7d" | "30d" | "90d";
export type SegmentId = "all" | "new" | "power";

export const RANGE_OPTIONS: { id: RangeId; label: string }[] = [
  { id: "7d", label: "지난 7일" },
  { id: "30d", label: "지난 30일" },
  { id: "90d", label: "지난 90일" },
];

export const SEGMENT_OPTIONS: { id: SegmentId; label: string; hint: string }[] = [
  { id: "all", label: "전체 사용자", hint: "전체 활성 계정" },
  { id: "new", label: "신규 사용자", hint: "기간 내 첫 가입" },
  { id: "power", label: "파워 유저", hint: "주간 10회 이상 접속" },
];

export interface TrendPoint {
  date: string;
  value: number;
}

export interface KpiScenario {
  mrr: { value: number; deltaPct: number; spark: number[] };
  churn: { value: number; deltaPct: number; spark: number[] };
}

export interface BreakdownItem {
  label: string;
  value: number;
}

export interface FunnelStage {
  label: string;
  value: number;
}

export interface DeviceShare {
  label: "데스크톱" | "모바일" | "태블릿";
  value: number;
}

export interface PageRow {
  id: string;
  page: string;
  views: number;
  users: number;
  avgTime: string;
  conv: number;
  trendPct: number;
}

export interface ScenarioData {
  kpis: KpiScenario;
  wau: TrendPoint[];
  channels: BreakdownItem[];
  funnel: FunnelStage[];
  devices: DeviceShare[];
  pages: PageRow[];
}

// ── 기간별 날짜 축 (전부 고정 문자열, 오늘 2026-07-16 기준 과거 구간) ──
const DATES_7D = ["2026-07-09", "2026-07-10", "2026-07-11", "2026-07-12", "2026-07-13", "2026-07-14", "2026-07-15"];
const DATES_30D = [
  "2026-06-18",
  "2026-06-21",
  "2026-06-24",
  "2026-06-27",
  "2026-06-30",
  "2026-07-03",
  "2026-07-06",
  "2026-07-09",
  "2026-07-12",
  "2026-07-15",
];
const DATES_90D = [
  "2026-04-29",
  "2026-05-06",
  "2026-05-13",
  "2026-05-20",
  "2026-05-27",
  "2026-06-03",
  "2026-06-10",
  "2026-06-17",
  "2026-06-24",
  "2026-07-01",
  "2026-07-08",
  "2026-07-15",
];

const RANGE_FACTOR: Record<RangeId, number> = { "7d": 0.25, "30d": 1, "90d": 2.9 };

function scale(base: number, range: RangeId): number {
  return Math.round(base * RANGE_FACTOR[range]);
}

function zip(dates: string[], values: number[]): TrendPoint[] {
  return dates.map((date, i) => ({ date, value: values[i] }));
}

// ── KPI (MRR·이탈률) — 절대값은 세그먼트 기준 현재 스냅샷, 델타/스파크라인은 기간별 비교 창 ──
const KPI_BASE: Record<SegmentId, { mrr: number; churn: number }> = {
  all: { mrr: 412_800_000, churn: 2.1 },
  new: { mrr: 38_600_000, churn: 6.4 },
  power: { mrr: 187_300_000, churn: 0.6 },
};

const KPI_WINDOW: Record<SegmentId, Record<RangeId, { mrrDeltaPct: number; mrrSpark: number[]; churnDeltaPct: number; churnSpark: number[] }>> = {
  all: {
    "7d": { mrrDeltaPct: 1.2, mrrSpark: [96, 97, 96, 98, 99, 99, 100, 101], churnDeltaPct: -0.1, churnSpark: [2.3, 2.3, 2.2, 2.2, 2.1, 2.1, 2.1, 2.1] },
    "30d": { mrrDeltaPct: 4.8, mrrSpark: [88, 91, 93, 95, 97, 99, 100, 101], churnDeltaPct: -0.4, churnSpark: [2.6, 2.5, 2.4, 2.3, 2.2, 2.2, 2.1, 2.1] },
    "90d": { mrrDeltaPct: 14.6, mrrSpark: [74, 79, 84, 88, 91, 95, 98, 101], churnDeltaPct: -0.9, churnSpark: [3.2, 3.0, 2.8, 2.6, 2.4, 2.3, 2.2, 2.1] },
  },
  new: {
    "7d": { mrrDeltaPct: 6.1, mrrSpark: [90, 92, 94, 95, 97, 98, 100, 101], churnDeltaPct: 0.3, churnSpark: [6.0, 6.1, 6.1, 6.2, 6.3, 6.3, 6.4, 6.4] },
    "30d": { mrrDeltaPct: 18.4, mrrSpark: [68, 74, 80, 85, 90, 94, 98, 101], churnDeltaPct: 0.9, churnSpark: [5.2, 5.6, 5.9, 6.0, 6.1, 6.2, 6.3, 6.4] },
    "90d": { mrrDeltaPct: 46.2, mrrSpark: [48, 58, 66, 74, 82, 90, 96, 101], churnDeltaPct: 1.6, churnSpark: [4.5, 5.0, 5.4, 5.7, 5.9, 6.1, 6.3, 6.4] },
  },
  power: {
    "7d": { mrrDeltaPct: 0.4, mrrSpark: [98, 99, 99, 100, 100, 100, 101, 101], churnDeltaPct: -0.05, churnSpark: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6] },
    "30d": { mrrDeltaPct: 2.1, mrrSpark: [93, 95, 96, 97, 98, 99, 100, 101], churnDeltaPct: -0.1, churnSpark: [0.7, 0.7, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6] },
    "90d": { mrrDeltaPct: 6.8, mrrSpark: [85, 88, 91, 93, 95, 97, 99, 101], churnDeltaPct: -0.3, churnSpark: [0.9, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.6] },
  },
};

// ── 주간 활성 사용자 추세 (세그먼트 × 기간, 마지막 지점은 세그먼트별로 일치 — 동일 "오늘" 스냅샷) ──
const WAU_VALUES: Record<SegmentId, Record<RangeId, number[]>> = {
  all: {
    "7d": [21400, 21850, 21700, 22100, 22600, 22300, 22950],
    "30d": [19200, 19600, 20100, 20450, 20800, 21200, 21600, 21950, 22400, 22950],
    "90d": [15800, 16400, 17100, 17700, 18300, 18900, 19600, 20300, 21000, 21700, 22300, 22950],
  },
  new: {
    "7d": [3120, 3180, 3240, 3310, 3260, 3380, 3450],
    "30d": [2680, 2790, 2880, 2960, 3050, 3140, 3230, 3310, 3390, 3450],
    "90d": [1980, 2150, 2320, 2480, 2620, 2760, 2900, 3040, 3160, 3280, 3370, 3450],
  },
  power: {
    "7d": [2410, 2430, 2405, 2460, 2480, 2470, 2505],
    "30d": [2260, 2290, 2320, 2350, 2380, 2400, 2430, 2450, 2480, 2505],
    "90d": [2080, 2120, 2160, 2200, 2240, 2280, 2320, 2360, 2400, 2440, 2470, 2505],
  },
};

function datesFor(range: RangeId): string[] {
  return range === "7d" ? DATES_7D : range === "30d" ? DATES_30D : DATES_90D;
}

// ── 유입 채널별 신규 가입 (30일 기준 베이스 — 기간 배율로 스케일) ──
const CHANNEL_BASE: Record<SegmentId, BreakdownItem[]> = {
  all: [
    { label: "오가닉 검색", value: 1850 },
    { label: "유료 광고", value: 1240 },
    { label: "추천", value: 640 },
    { label: "소셜", value: 380 },
  ],
  new: [
    { label: "오가닉 검색", value: 780 },
    { label: "유료 광고", value: 920 },
    { label: "추천", value: 210 },
    { label: "소셜", value: 260 },
  ],
  power: [
    { label: "오가닉 검색", value: 120 },
    { label: "유료 광고", value: 40 },
    { label: "추천", value: 310 },
    { label: "소셜", value: 30 },
  ],
};

// ── 활성화 퍼널 (30일 기준 베이스 — 기간 배율로 스케일) ──
const FUNNEL_BASE: Record<SegmentId, FunnelStage[]> = {
  all: [
    { label: "방문", value: 48000 },
    { label: "가입", value: 9200 },
    { label: "활성화", value: 5400 },
    { label: "유료 전환", value: 1380 },
  ],
  new: [
    { label: "방문", value: 21000 },
    { label: "가입", value: 9200 },
    { label: "활성화", value: 4100 },
    { label: "유료 전환", value: 640 },
  ],
  power: [
    { label: "방문", value: 2800 },
    { label: "가입", value: 2680 },
    { label: "활성화", value: 2600 },
    { label: "유료 전환", value: 2505 },
  ],
};

// ── 디바이스 구성비 (세그먼트별 고정 — 접속 성향은 기간에 크게 좌우되지 않음) ──
const DEVICE_SHARE: Record<SegmentId, DeviceShare[]> = {
  all: [
    { label: "데스크톱", value: 58 },
    { label: "모바일", value: 34 },
    { label: "태블릿", value: 8 },
  ],
  new: [
    { label: "데스크톱", value: 41 },
    { label: "모바일", value: 52 },
    { label: "태블릿", value: 7 },
  ],
  power: [
    { label: "데스크톱", value: 72 },
    { label: "모바일", value: 24 },
    { label: "태블릿", value: 4 },
  ],
};

// ── 상위 페이지 (30일 기준 베이스 조회수/방문자 — 기간 배율로 스케일, 체류시간/전환율/추세는 세그먼트 고유 특성) ──
interface PageBaseRow {
  id: string;
  page: string;
  viewsBase: number;
  usersBase: number;
  avgTime: string;
  conv: number;
  trendPct: number;
}

const PAGES_BASE: Record<SegmentId, PageBaseRow[]> = {
  all: [
    { id: "p1", page: "/dashboard", viewsBase: 18400, usersBase: 9800, avgTime: "04:12", conv: 6.8, trendPct: 4.2 },
    { id: "p2", page: "/reports/weekly", viewsBase: 12100, usersBase: 6400, avgTime: "05:40", conv: 9.2, trendPct: 8.6 },
    { id: "p3", page: "/explore", viewsBase: 9600, usersBase: 5200, avgTime: "03:05", conv: 4.1, trendPct: -1.4 },
    { id: "p4", page: "/settings/billing", viewsBase: 4200, usersBase: 3100, avgTime: "01:48", conv: 12.4, trendPct: 2.0 },
    { id: "p5", page: "/integrations", viewsBase: 3100, usersBase: 2000, avgTime: "02:26", conv: 3.6, trendPct: -3.1 },
    { id: "p6", page: "/docs/api", viewsBase: 2600, usersBase: 1400, avgTime: "06:12", conv: 1.9, trendPct: 0.6 },
  ],
  new: [
    { id: "p1", page: "/onboarding", viewsBase: 8600, usersBase: 3450, avgTime: "07:20", conv: 18.6, trendPct: 12.4 },
    { id: "p2", page: "/dashboard", viewsBase: 5200, usersBase: 3450, avgTime: "03:10", conv: 5.2, trendPct: 5.0 },
    { id: "p3", page: "/pricing", viewsBase: 3900, usersBase: 2600, avgTime: "02:04", conv: 22.8, trendPct: 6.8 },
    { id: "p4", page: "/docs/getting-started", viewsBase: 3100, usersBase: 2050, avgTime: "05:55", conv: 8.4, trendPct: 3.2 },
    { id: "p5", page: "/integrations", viewsBase: 1400, usersBase: 980, avgTime: "02:40", conv: 3.1, trendPct: -0.5 },
    { id: "p6", page: "/settings/billing", viewsBase: 900, usersBase: 640, avgTime: "01:20", conv: 15.2, trendPct: 9.1 },
  ],
  power: [
    { id: "p1", page: "/explore", viewsBase: 4800, usersBase: 2505, avgTime: "08:40", conv: 2.1, trendPct: 1.8 },
    { id: "p2", page: "/reports/weekly", viewsBase: 4200, usersBase: 2400, avgTime: "07:15", conv: 3.4, trendPct: 2.4 },
    { id: "p3", page: "/api-console", viewsBase: 3100, usersBase: 2100, avgTime: "11:20", conv: 1.2, trendPct: 5.6 },
    { id: "p4", page: "/dashboard", viewsBase: 2900, usersBase: 2505, avgTime: "02:50", conv: 0.9, trendPct: 0.4 },
    { id: "p5", page: "/alerts", viewsBase: 2200, usersBase: 1800, avgTime: "03:30", conv: 4.6, trendPct: 7.2 },
    { id: "p6", page: "/settings/team", viewsBase: 1100, usersBase: 900, avgTime: "02:10", conv: 2.0, trendPct: -0.9 },
  ],
};

export function getScenario(range: RangeId, segment: SegmentId): ScenarioData {
  const kpiBase = KPI_BASE[segment];
  const kpiWindow = KPI_WINDOW[segment][range];

  return {
    kpis: {
      mrr: { value: kpiBase.mrr, deltaPct: kpiWindow.mrrDeltaPct, spark: kpiWindow.mrrSpark },
      churn: { value: kpiBase.churn, deltaPct: kpiWindow.churnDeltaPct, spark: kpiWindow.churnSpark },
    },
    wau: zip(datesFor(range), WAU_VALUES[segment][range]),
    channels: CHANNEL_BASE[segment].map((c) => ({ label: c.label, value: scale(c.value, range) })),
    funnel: FUNNEL_BASE[segment].map((f) => ({ label: f.label, value: scale(f.value, range) })),
    devices: DEVICE_SHARE[segment],
    pages: PAGES_BASE[segment].map((p) => ({
      id: p.id,
      page: p.page,
      views: scale(p.viewsBase, range),
      users: scale(p.usersBase, range),
      avgTime: p.avgTime,
      conv: p.conv,
      trendPct: p.trendPct,
    })),
  };
}
