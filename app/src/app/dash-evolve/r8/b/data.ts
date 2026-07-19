import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Compass,
  CreditCard,
  LayoutGrid,
  LineChart,
  MessagesSquare,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* 결정론 수학 — Math.random / Date.now / new Date 미사용                     */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 인덱스 기반 결정론 pseudo-random [0,1) — 완전 재현 가능(하이드레이션 안전). */
function hash01(n: number): number {
  let t = (n + 0x9e3779b9) >>> 0;
  t = Math.imul(t ^ (t >>> 16), 0x85ebca6b);
  t = Math.imul(t ^ (t >>> 13), 0xc2b2ae35);
  t ^= t >>> 16;
  return (t >>> 0) / 4294967296;
}
function between(seed: number, lo: number, hi: number): number {
  return lo + hash01(seed) * (hi - lo);
}
function intBetween(seed: number, lo: number, hi: number): number {
  return Math.round(between(seed, lo, hi));
}
function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(hash01(seed) * arr.length)];
}

/* ---------------------------------------------------------------------- */
/* 브랜드 / 워크스페이스 / 사용자 (전부 가상 — 세션 컨텍스트 무관)                  */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Farsight", tagline: "Revenue Copilot" };
export { Compass as BrandIcon };

/** 대시보드에 상주하는 AI 코파일럿의 페르소나 이름. */
export const COPILOT_NAME = "Fara";

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "orbital", name: "Orbital Foods", plan: "Growth · 20 계정" },
  { id: "northstar", name: "Northstar Retail", plan: "Scale · 64 계정" },
  { id: "sandbox", name: "RevOps 샌드박스", plan: "내부 테스트" },
];

/** 가상 인물(세션 컨텍스트 아님) — Farsight를 쓰는 RevOps 리드. 도메인도 .example 예약 TLD. */
export const CURRENT_USER = {
  name: "Priya Nakamura",
  role: "Head of Revenue Ops",
  email: "priya.nakamura@farsight.example",
  avatarId: "1544005313-94ddf0286df2",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* 내비게이션                                                                */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "워크스페이스",
    items: [
      { id: "overview", label: "개요", Icon: LayoutGrid, active: true },
      { id: "copilot", label: "코파일럿 스레드", Icon: MessagesSquare, badge: "3" },
      { id: "accounts", label: "계정", Icon: Users },
    ],
  },
  {
    id: "revenue",
    title: "매출",
    items: [
      { id: "trends", label: "매출 추이", Icon: LineChart },
      { id: "reports", label: "리포트", Icon: BarChart3 },
      { id: "playbooks", label: "플레이북", Icon: BookOpen },
    ],
  },
  {
    id: "admin",
    title: "관리",
    items: [
      { id: "billing", label: "청구", Icon: CreditCard, disabled: true },
      { id: "settings", label: "설정", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* 리전 — 카테고리 색상은 dataviz 고정 순서(blue → green → violet)를 따른다.      */
/* ---------------------------------------------------------------------- */

export type RegionId = "na" | "emea" | "apac";
export const REGION_ORDER: RegionId[] = ["na", "emea", "apac"];

export type RegionMeta = {
  id: RegionId;
  label: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
  stroke: string;
  fill: string;
};

export const REGION_META: Record<RegionId, RegionMeta> = {
  na: {
    id: "na",
    label: "북미",
    text: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-500/12",
    border: "border-blue-200 dark:border-blue-500/25",
    dot: "bg-blue-500",
    stroke: "stroke-blue-500 dark:stroke-blue-400",
    fill: "fill-blue-500 dark:fill-blue-400",
  },
  emea: {
    id: "emea",
    label: "유럽·중동",
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
    stroke: "stroke-emerald-600 dark:stroke-emerald-400",
    fill: "fill-emerald-600 dark:fill-emerald-400",
  },
  apac: {
    id: "apac",
    label: "아시아·태평양",
    text: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-50 dark:bg-violet-500/12",
    border: "border-violet-200 dark:border-violet-500/25",
    dot: "bg-violet-500",
    stroke: "stroke-violet-500 dark:stroke-violet-400",
    fill: "fill-violet-500 dark:fill-violet-400",
  },
};

/* ---------------------------------------------------------------------- */
/* 주간 매출 시계열 — 12주, 리전별 결정론 생성. 합계는 REVENUE_TOTAL로 파생.        */
/* ---------------------------------------------------------------------- */

export const WEEK_LABELS = [
  "4/27", "5/4", "5/11", "5/18", "5/25", "6/1",
  "6/8", "6/15", "6/22", "6/29", "7/6", "7/13",
] as const;

const REGION_BASE: Record<RegionId, { start: number; growth: number; noise: number; seed: number }> = {
  na: { start: 148000, growth: 1900, noise: 3200, seed: 11 },
  emea: { start: 92000, growth: 2600, noise: 2600, seed: 29 },
  apac: { start: 54000, growth: 2100, noise: 2100, seed: 47 },
};

function buildSeries(region: RegionId): number[] {
  const cfg = REGION_BASE[region];
  const out: number[] = [];
  for (let w = 0; w < WEEK_LABELS.length; w++) {
    const trend = cfg.start + cfg.growth * w;
    const wobble = between(cfg.seed + w * 7, -cfg.noise, cfg.noise);
    out.push(Math.round((trend + wobble) / 100) * 100);
  }
  return out;
}

/** 리전별 12주 MRR 시계열. */
export const REVENUE: Record<RegionId, number[]> = {
  na: buildSeries("na"),
  emea: buildSeries("emea"),
  apac: buildSeries("apac"),
};

/** 전 리전 합계 시계열 — 부분합(리전)의 총합으로만 파생, 별도 하드코딩 없음. */
export const REVENUE_TOTAL: number[] = WEEK_LABELS.map((_, w) =>
  REGION_ORDER.reduce((sum, r) => sum + REVENUE[r][w], 0),
);

export type ChartWindow = "recent" | "full";
export function windowSlice<T>(arr: readonly T[], win: ChartWindow): T[] {
  return win === "recent" ? arr.slice(-6) : [...arr];
}

/* ---------------------------------------------------------------------- */
/* 계정 — 결정론 생성(20개). 상태 카운트 합계 = 총계.                           */
/* ---------------------------------------------------------------------- */

export type AccountStatus = "at-risk" | "growing" | "stable";
export const STATUS_META: Record<AccountStatus, { label: string; tone: Tone }> = {
  "at-risk": { label: "위험", tone: "down" },
  growing: { label: "성장", tone: "up" },
  stable: { label: "안정", tone: "flat" },
};

type Tone = "up" | "down" | "flat";

const COMPANIES = [
  "Northstar Retail", "Orbital Foods", "Cinderline", "Fathom Labs", "Verano Health", "Quillbase",
  "Hearthworks", "Lumen Studio", "Tidewater Co", "Anvil Cloud", "Cobalt Freight", "Emberline",
  "Fernpath Media", "Glacier Bank", "Harborview", "Ironwood Supply", "Junoware", "Kestrel Air",
  "Lattice Data", "Meridian Goods",
] as const;

const FIRST = ["Marcus", "Sofia", "Theo", "Naomi", "Elias", "Ravi", "Clara", "Jonas", "Mina", "Owen", "Lena", "Amara", "Felix", "Yuki", "Diego", "Ines", "Otto", "Priya", "Sana", "Malik"] as const;
const LAST = ["Lindqvist", "Alvarez", "Berg", "Cho", "Novak", "Menon", "Fischer", "Haas", "Serrano", "Weiss", "Duval", "Kato", "Reyes", "Bauer", "Nguyen", "Osei", "Park", "Costa", "Fry", "Adeyemi"] as const;
const TITLES = ["VP Finance", "Head of Ops", "CFO", "Revenue Lead", "Founder", "Director, Growth", "COO", "FP&A Manager"] as const;
const CSMS = ["Jordan Peale", "Rowan Frost", "Isabel Ortega", "Kaito Mori", "Nora Kelleher"] as const;
const AVATAR_IDS = [
  "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e", "1507003211169-0a1dd7228f2d",
  "1519345182560-3f2917c472ef", "1438761681033-6461ffad8d80", "1472099645785-5658abf4ff4e",
  "1544005313-94ddf0286df2", "1580489944761-15a19d654956",
] as const;
const ACTIVITY_BANK = ["방금", "2시간 전", "어제", "3일 전", "1주 전", "2주 전"] as const;

const STATUS_PLAN: AccountStatus[] = (() => {
  const plan: AccountStatus[] = [];
  const counts: Record<AccountStatus, number> = { "at-risk": 5, growing: 7, stable: 8 };
  (Object.keys(counts) as AccountStatus[]).forEach((s) => {
    for (let k = 0; k < counts[s]; k++) plan.push(s);
  });
  return plan;
})();

const STATUS_RANGES: Record<AccountStatus, { health: [number, number]; mrr: [number, number] }> = {
  "at-risk": { health: [18, 46], mrr: [3200, 18000] },
  growing: { health: [66, 92], mrr: [8000, 42000] },
  stable: { health: [52, 78], mrr: [5000, 26000] },
};

export type Account = {
  id: string;
  name: string;
  region: RegionId;
  status: AccountStatus;
  mrr: number;
  health: number;
  trend: number[];
  contactName: string;
  contactTitle: string;
  csm: string;
  avatarId: string;
  lastActivity: string;
  nextAction: string;
};

const NEXT_ACTION: Record<AccountStatus, string> = {
  "at-risk": "이탈 방지 콜 예약",
  growing: "확장 플랜 제안",
  stable: "분기 리뷰 예약",
};

function makeTrend(seed: number, end: number): number[] {
  const start = clamp(Math.round(end + between(seed + 5, -18, 10)), 4, 98);
  const pts: number[] = [];
  for (let k = 0; k < 8; k++) {
    const t = k / 7;
    const base = start + (end - start) * t;
    pts.push(clamp(Math.round(base + between(seed + 9 + k, -5, 5)), 2, 98));
  }
  return pts;
}

export const ACCOUNTS: Account[] = STATUS_PLAN.map((status, i) => {
  const seed = i * 97 + 13;
  const r = STATUS_RANGES[status];
  const region = REGION_ORDER[i % REGION_ORDER.length];
  const health = clamp(intBetween(seed + 1, r.health[0], r.health[1]), 2, 98);
  const mrr = Math.round(between(seed + 2, r.mrr[0], r.mrr[1]) / 100) * 100;
  return {
    id: `acct-${String(i + 1).padStart(2, "0")}`,
    name: COMPANIES[i],
    region,
    status,
    mrr,
    health,
    trend: makeTrend(seed, health),
    contactName: `${pick(FIRST, seed + 3)} ${pick(LAST, seed + 4)}`,
    contactTitle: pick(TITLES, seed + 6),
    csm: pick(CSMS, seed + 7),
    avatarId: pick(AVATAR_IDS, seed + 8),
    lastActivity: pick(ACTIVITY_BANK, seed + 10),
    nextAction: NEXT_ACTION[status],
  };
});

export function accountById(id: string): Account | undefined {
  return ACCOUNTS.find((a) => a.id === id);
}

/* 자기 점검: 상태별 합 = 총계(부분합=총합). */
const _STATUS_COUNTS = ACCOUNTS.reduce(
  (acc, a) => ({ ...acc, [a.status]: (acc[a.status] ?? 0) + 1 }),
  {} as Record<AccountStatus, number>,
);
export const _TOTALS_OK =
  (["at-risk", "growing", "stable"] as AccountStatus[]).reduce((a, s) => a + (_STATUS_COUNTS[s] ?? 0), 0) === ACCOUNTS.length;

/* ---------------------------------------------------------------------- */
/* 파생 집계 — 전부 REVENUE/ACCOUNTS 단일 소스에서 산출(합계 정합 보장)          */
/* ---------------------------------------------------------------------- */

const USD0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const NUM0 = new Intl.NumberFormat("en-US");
const PCT1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1, signDisplay: "always" });
const PCT_SHARE = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

export function formatUsd(v: number): string {
  return USD0.format(v);
}
export function formatCount(v: number): string {
  return NUM0.format(v);
}
export function formatPct(v: number): string {
  return `${PCT1.format(v)}%`;
}
/** 부호 없는 비중 표기(전체 대비 %) — 델타(formatPct)와 구분. */
export function formatShare(v: number): string {
  return `${PCT_SHARE.format(v)}%`;
}

export function latestTotalMrr(): number {
  return REVENUE_TOTAL[REVENUE_TOTAL.length - 1];
}
export function priorTotalMrr(): number {
  return REVENUE_TOTAL[REVENUE_TOTAL.length - 2];
}
export function mrrDeltaPct(): number {
  const latest = latestTotalMrr();
  const prior = priorTotalMrr();
  return round2(((latest - prior) / prior) * 100);
}
export function atRiskAccounts(): Account[] {
  return ACCOUNTS.filter((a) => a.status === "at-risk");
}
export function growingAccounts(): Account[] {
  return ACCOUNTS.filter((a) => a.status === "growing");
}
export function churnRatePct(): number {
  return round2((atRiskAccounts().length / ACCOUNTS.length) * 100);
}
/** NRR — 상태별 계정 MRR에 유지율 가중치를 적용해 산출(단일 소스 파생, 매직넘버 아님). */
export function netRevenueRetentionPct(): number {
  const weights: Record<AccountStatus, number> = { growing: 1.14, stable: 1.0, "at-risk": 0.82 };
  const weighted = ACCOUNTS.reduce((sum, a) => sum + a.mrr * weights[a.status], 0);
  const base = ACCOUNTS.reduce((sum, a) => sum + a.mrr, 0);
  return round2((weighted / base) * 100);
}
export function topAccountByMrr(): Account {
  return [...ACCOUNTS].sort((a, b) => b.mrr - a.mrr)[0];
}
export function fastestGrowingRegion(): RegionId {
  let best: RegionId = REGION_ORDER[0];
  let bestGrowth = -Infinity;
  for (const r of REGION_ORDER) {
    const series = REVENUE[r];
    const growth = series[series.length - 1] - series[series.length - 6];
    if (growth > bestGrowth) {
      bestGrowth = growth;
      best = r;
    }
  }
  return best;
}
export function accountsTotalMrr(list: Account[]): number {
  return list.reduce((sum, a) => sum + a.mrr, 0);
}

/* ---------------------------------------------------------------------- */
/* 코파일럿 — 인사이트 카드 + 대화 스크립트. 전부 사전 작성된 결정론 콘텐츠.        */
/* 액션은 메인 워크스페이스 상태(리전 포커스·상태 필터·차트 창·계정 선택)를 동기화. */
/* ---------------------------------------------------------------------- */

export type CopilotAction =
  | { type: "focus-region"; region: RegionId | null }
  | { type: "filter-status"; status: AccountStatus | "all" }
  | { type: "set-window"; window: ChartWindow }
  | { type: "select-account"; id: string };

export type InsightCard = {
  id: string;
  Icon: LucideIcon;
  title: string;
  body: string;
  actions: CopilotAction[];
  reply: string;
};

const topAccount = topAccountByMrr();
const fastestRegion = fastestGrowingRegion();
const atRiskList = atRiskAccounts();

export const INSIGHT_CARDS: InsightCard[] = [
  {
    id: "insight-at-risk",
    Icon: AlertTriangle,
    title: `${REGION_META.apac.label} 계정 ${atRiskList.filter((a) => a.region === "apac").length}곳이 위험 단계입니다`,
    body: `헬스 스코어가 50 미만으로 떨어진 위험 계정을 표로 정리했습니다.`,
    actions: [
      { type: "filter-status", status: "at-risk" },
      { type: "focus-region", region: "apac" },
    ],
    reply: `위험 계정 ${atRiskList.length}곳으로 테이블을 필터링하고 차트를 ${REGION_META.apac.label} 기준으로 강조했습니다. 대부분 최근 로그인 활동이 뜸해진 계정입니다.`,
  },
  {
    id: "insight-growth",
    Icon: TrendingUp,
    title: `${REGION_META[fastestRegion].label}가 6주간 가장 빠르게 성장했습니다`,
    body: `다른 리전 대비 확장 속도가 가장 가파릅니다. 차트에서 확인해보세요.`,
    actions: [
      { type: "focus-region", region: fastestRegion },
      { type: "set-window", window: "recent" },
    ],
    reply: `차트를 최근 6주·${REGION_META[fastestRegion].label} 기준으로 전환했습니다. 이 흐름이 유지되면 다음 분기 목표를 상향 조정할 수 있습니다.`,
  },
  {
    id: "insight-top-account",
    Icon: Sparkles,
    title: `${topAccount.name}이(가) 최대 MRR 계정입니다`,
    body: `${formatUsd(topAccount.mrr)}/월 — 담당 CSM ${topAccount.csm}.`,
    actions: [{ type: "select-account", id: topAccount.id }],
    reply: `${topAccount.name} 상세를 테이블에서 펼쳤습니다. 다음 액션은 "${topAccount.nextAction}"으로 제안되어 있습니다.`,
  },
];

export type QuickReply = {
  id: string;
  label: string;
  userText: string;
  actions: CopilotAction[];
  reply: string;
};

export const QUICK_REPLIES: QuickReply[] = [
  {
    id: "qr-compare",
    label: "리전별 비교",
    userText: "이번 분기 리전별 매출을 비교해줘",
    actions: [
      { type: "focus-region", region: null },
      { type: "set-window", window: "full" },
    ],
    reply: `12주 전체 보기로 전환했습니다. 현재 합산 MRR은 ${formatUsd(latestTotalMrr())}, 전주 대비 ${formatPct(mrrDeltaPct())}입니다. ${REGION_META[fastestRegion].label}가 가장 가파르게 성장 중입니다.`,
  },
  {
    id: "qr-at-risk",
    label: "위험 계정 보기",
    userText: "위험 신호가 있는 계정 보여줘",
    actions: [{ type: "filter-status", status: "at-risk" }],
    reply: `헬스 스코어 50 미만 계정 ${atRiskList.length}곳으로 테이블을 필터링했습니다. 합산 MRR은 ${formatUsd(accountsTotalMrr(atRiskList))}로 전체의 ${formatShare(round2((accountsTotalMrr(atRiskList) / accountsTotalMrr(ACCOUNTS)) * 100))}를 차지합니다.`,
  },
  {
    id: "qr-vs-last",
    label: "전주 대비",
    userText: "이번 주 실적이 지난주보다 어때?",
    actions: [{ type: "set-window", window: "recent" }],
    reply: `최근 6주 창으로 전환했습니다. 이번 주 합산 MRR ${formatUsd(latestTotalMrr())}은 전주 대비 ${formatPct(mrrDeltaPct())} 변화입니다.`,
  },
  {
    id: "qr-top",
    label: "최우수 계정",
    userText: "지금 우리 최우수 계정이 어디야?",
    actions: [{ type: "select-account", id: topAccount.id }],
    reply: `${topAccount.name}(${formatUsd(topAccount.mrr)}/월)이 최상위입니다. 테이블에서 상세를 펼쳐두었습니다.`,
  },
];

export type ChatRole = "assistant" | "user";
export type ChatMessage = { id: string; role: ChatRole; text: string; time: string };

/** 결정론 타임스탬프 시퀀스 — Date.now 미사용, 대화 진행 순서로만 인덱싱. */
const TIME_SEQUENCE = [
  "9:02 AM", "9:03 AM", "9:05 AM", "9:06 AM", "9:08 AM", "9:09 AM",
  "9:11 AM", "9:12 AM", "9:14 AM", "9:15 AM", "9:17 AM", "9:18 AM",
] as const;
export function timeForIndex(i: number): string {
  return TIME_SEQUENCE[i % TIME_SEQUENCE.length];
}

export const INITIAL_THREAD: ChatMessage[] = [
  {
    id: "m0",
    role: "assistant",
    text: `안녕하세요, Priya님. 저는 ${COPILOT_NAME}예요. 아래 인사이트 카드를 클릭하거나 빠른 질문을 보내면 화면이 함께 움직여요.`,
    time: timeForIndex(0),
  },
];
