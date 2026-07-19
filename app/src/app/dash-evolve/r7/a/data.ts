import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  BookOpen,
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  LogIn,
  Orbit,
  Rocket,
  Settings,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Waypoints,
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
  let t = (n + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  t = (t ^ (t >>> 14)) >>> 0;
  return t / 4294967296;
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
/* 브랜드 / 워크스페이스 / 사용자                                             */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Apogee", tagline: "Lifecycle Intelligence" };
export { Orbit as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "northwind", name: "Northwind Cloud", plan: "Scale · 1,842 계정" },
  { id: "atlas", name: "Atlas Robotics", plan: "Growth · 620 계정" },
  { id: "sandbox", name: "CS Sandbox", plan: "내부 테스트" },
];

/** 가상 인물(세션 컨텍스트 아님) — Apogee를 쓰는 CS팀 리드. */
export const CURRENT_USER = {
  name: "Dana Whitfield",
  role: "VP Customer Success",
  email: "dana.w@northwind.example",
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
      { id: "overview", label: "개요", Icon: LayoutGrid },
      { id: "orbit", label: "라이프사이클 궤도", Icon: Orbit, active: true },
      { id: "accounts", label: "계정", Icon: Users },
    ],
  },
  {
    id: "lifecycle",
    title: "라이프사이클",
    items: [
      { id: "health", label: "헬스 스코어", Icon: Activity },
      { id: "transitions", label: "단계 전환", Icon: Waypoints, badge: "6" },
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
/* 라이프사이클 단계 — 궤도 링 기하 + 범주 색상                                 */
/* 안쪽 궤도 = 초기 단계. 건강할수록 밴드 바깥쪽으로 이동(확장 방향).            */
/* Churned 는 활성 궤도를 이탈한 바깥쪽 점선 "이탈 궤도"로 별도 표기.           */
/* ---------------------------------------------------------------------- */

export type StageId = "trial" | "activated" | "retained" | "expanded" | "churned";
export const STAGE_ORDER: StageId[] = ["trial", "activated", "retained", "expanded", "churned"];

export type StageMeta = {
  id: StageId;
  label: string;
  ko: string;
  ring: { inner: number; outer: number };
  escape?: boolean;
  Icon: LucideIcon;
  // 배지/범례용 텍스트 색
  text: string;
  bg: string;
  border: string;
  chipDot: string;
  // SVG 색상 유틸(fill/stroke)
  fill: string;
  stroke: string;
};

export const STAGE_META: Record<StageId, StageMeta> = {
  trial: {
    id: "trial",
    label: "Trial",
    ko: "체험",
    ring: { inner: 66, outer: 106 },
    Icon: Rocket,
    text: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-500/15",
    border: "border-slate-200 dark:border-slate-500/25",
    chipDot: "bg-slate-400",
    fill: "fill-slate-400",
    stroke: "stroke-slate-400",
  },
  activated: {
    id: "activated",
    label: "Activated",
    ko: "활성화",
    ring: { inner: 106, outer: 152 },
    Icon: Sparkles,
    text: "text-sky-700 dark:text-sky-300",
    bg: "bg-sky-50 dark:bg-sky-500/15",
    border: "border-sky-200 dark:border-sky-500/25",
    chipDot: "bg-sky-500",
    fill: "fill-sky-500",
    stroke: "stroke-sky-500",
  },
  retained: {
    id: "retained",
    label: "Retained",
    ko: "유지",
    ring: { inner: 152, outer: 204 },
    Icon: BadgeCheck,
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    border: "border-emerald-200 dark:border-emerald-500/25",
    chipDot: "bg-emerald-500",
    fill: "fill-emerald-500",
    stroke: "stroke-emerald-500",
  },
  expanded: {
    id: "expanded",
    label: "Expanded",
    ko: "확장",
    ring: { inner: 204, outer: 252 },
    Icon: TrendingUp,
    text: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-50 dark:bg-indigo-500/15",
    border: "border-indigo-200 dark:border-indigo-500/25",
    chipDot: "bg-indigo-500",
    fill: "fill-indigo-500",
    stroke: "stroke-indigo-500",
  },
  churned: {
    id: "churned",
    label: "Churned",
    ko: "이탈",
    ring: { inner: 268, outer: 280 },
    escape: true,
    Icon: TrendingDown,
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    chipDot: "bg-rose-400",
    fill: "fill-rose-400",
    stroke: "stroke-rose-400",
  },
};

/* 궤도 좌표계 */
export const VB = 600;
export const CENTER = VB / 2;

/* ---------------------------------------------------------------------- */
/* 기간 세그먼트                                                             */
/* ---------------------------------------------------------------------- */

export type PeriodId = "7d" | "30d" | "90d";
export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
];

/* ---------------------------------------------------------------------- */
/* 고객 계정 — 결정론 생성(50개)                                             */
/* ---------------------------------------------------------------------- */

const COMPANIES = [
  "Northwind", "Cloudpeak", "Brightloom", "Fathom Labs", "Verano", "Quillbase", "Hearthworks", "Lumen IO",
  "Tidewater", "Anvil", "Cobalt", "Emberline", "Fernpath", "Glacier", "Harborview", "Ironwood",
  "Junoware", "Kestrel", "Lattice", "Meridian", "Nimbus", "Oakridge", "Pinnacle", "Quartz",
  "Riverbend", "Sableworks", "Terrace", "Umbra", "Vellum", "Wavelength", "Xenoform", "Yonder",
  "Zephyr", "Alcove", "Beacon", "Cinder", "Dovetail", "Everest", "Foundry", "Granite",
  "Halcyon", "Indigo Bay", "Juniper", "Kindred", "Larkspur", "Monarch", "Nectar", "Onyx",
  "Perch Data", "Quorum",
] as const;

const FIRST = ["Marcus", "Priya", "Sofia", "Theo", "Naomi", "Elias", "Ravi", "Clara", "Jonas", "Mina", "Owen", "Lena", "Amara", "Felix", "Yuki", "Diego"] as const;
const LAST = ["Lindqvist", "Okafor", "Alvarez", "Berg", "Cho", "Novak", "Menon", "Fischer", "Haas", "Serrano", "Weiss", "Duval", "Kato", "Reyes", "Bauer", "Nguyen"] as const;
const TITLES = ["VP Engineering", "Head of Ops", "CTO", "Product Lead", "Founder", "Director, Data", "COO", "Eng Manager"] as const;
const CSMS = ["Dana Whitfield", "Rowan Frost", "Isabel Ortega", "Kaito Mori", "Nora Kelleher"] as const;
const AVATAR_IDS = [
  "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e", "1507003211169-0a1dd7228f2d",
  "1519345182560-3f2917c472ef", "1438761681033-6461ffad8d80", "1472099645785-5658abf4ff4e",
  "1544005313-94ddf0286df2", "1580489944761-15a19d654956",
] as const;

const STAGE_COUNTS: Record<StageId, number> = { trial: 9, activated: 11, retained: 13, expanded: 9, churned: 8 };

const STAGE_RANGES: Record<StageId, { days: [number, number]; health: [number, number]; arr: [number, number] }> = {
  trial: { days: [2, 52], health: [42, 74], arr: [6000, 18000] },
  activated: { days: [18, 150], health: [54, 82], arr: [12000, 44000] },
  retained: { days: [90, 430], health: [60, 90], arr: [30000, 130000] },
  expanded: { days: [180, 660], health: [72, 96], arr: [90000, 480000] },
  churned: { days: [120, 700], health: [8, 38], arr: [18000, 160000] },
};

const EVENT_BANK: Record<StageId, { label: string; Icon: LucideIcon; tone: "up" | "down" | "flat" | "info" }[]> = {
  trial: [
    { label: "트라이얼 워크스페이스 생성", Icon: Rocket, tone: "info" },
    { label: "온보딩 체크리스트 40% 완료", Icon: Target, tone: "flat" },
    { label: "샘플 데이터셋 업로드", Icon: UserPlus, tone: "flat" },
    { label: "첫 대시보드 조회", Icon: Activity, tone: "info" },
  ],
  activated: [
    { label: "첫 워크플로 활성화", Icon: Sparkles, tone: "up" },
    { label: "팀원 5명 초대", Icon: UserPlus, tone: "up" },
    { label: "API 키 발급", Icon: Settings, tone: "flat" },
    { label: "주간 활성 사용자 2배", Icon: TrendingUp, tone: "up" },
  ],
  retained: [
    { label: "분기 비즈니스 리뷰(QBR) 완료", Icon: BadgeCheck, tone: "up" },
    { label: "SSO/SAML 연동 완료", Icon: Settings, tone: "flat" },
    { label: "시트 8석 추가", Icon: UserPlus, tone: "up" },
    { label: "지원 티켓 만족도 5.0", Icon: LifeBuoy, tone: "up" },
  ],
  expanded: [
    { label: "Enterprise 플랜 업그레이드", Icon: TrendingUp, tone: "up" },
    { label: "시트 24석 증설", Icon: UserPlus, tone: "up" },
    { label: "신규 부서 2곳 도입", Icon: Users, tone: "up" },
    { label: "멀티이어 계약 갱신", Icon: BadgeCheck, tone: "up" },
  ],
  churned: [
    { label: "구독 취소 요청 접수", Icon: TrendingDown, tone: "down" },
    { label: "결제 3회 연속 실패", Icon: CreditCard, tone: "down" },
    { label: "30일간 로그인 없음", Icon: LogIn, tone: "down" },
    { label: "핵심 관리자 이탈", Icon: Users, tone: "down" },
  ],
};

const NEXT_ACTION: Record<StageId, string> = {
  trial: "온보딩 콜 예약",
  activated: "가치 실현(Time-to-Value) 리뷰",
  retained: "확장 기회 제안",
  expanded: "레퍼런스·케이스 스터디 요청",
  churned: "윈백 캠페인 발송",
};

export type Customer = {
  id: string;
  name: string;
  stage: StageId;
  signupDaysAgo: number;
  angleDeg: number;
  health: Record<PeriodId, number>;
  trend: number[]; // 12포인트 헬스 히스토리(0~100)
  arr: number;
  seats: number;
  csm: string;
  contactName: string;
  contactTitle: string;
  avatarId: string;
  nextAction: string;
  events: { label: string; Icon: LucideIcon; tone: "up" | "down" | "flat" | "info"; when: string }[];
};

const WHEN_BANK = ["방금", "2시간 전", "어제", "3일 전", "1주 전", "2주 전"] as const;

function buildStagePlan(): StageId[] {
  const plan: StageId[] = [];
  for (const s of STAGE_ORDER) for (let k = 0; k < STAGE_COUNTS[s]; k++) plan.push(s);
  return plan;
}

function makeTrend(seed: number, end: number): number[] {
  const start = clamp(Math.round(end + between(seed + 71, -24, 12)), 6, 96);
  const pts: number[] = [];
  for (let k = 0; k < 12; k++) {
    const t = k / 11;
    const base = start + (end - start) * t;
    pts.push(clamp(Math.round(base + between(seed + 80 + k, -6, 6)), 4, 98));
  }
  return pts;
}

function makeEvents(stage: StageId, seed: number): Customer["events"] {
  const bank = EVENT_BANK[stage];
  const start = Math.floor(hash01(seed + 40) * bank.length);
  return [0, 1, 2].map((k) => {
    const e = bank[(start + k) % bank.length];
    return { ...e, when: pick(WHEN_BANK, seed + 50 + k) };
  });
}

export const CUSTOMERS: Customer[] = buildStagePlan().map((stage, i) => {
  const seed = i * 101 + 7;
  const r = STAGE_RANGES[stage];
  const signupDaysAgo = intBetween(seed + 1, r.days[0], r.days[1]);
  const h90 = clamp(intBetween(seed + 2, r.health[0], r.health[1]), 4, 98);
  const h30 = clamp(h90 + Math.round(between(seed + 3, -7, 9)), 4, 98);
  const h7 = clamp(h90 + Math.round(between(seed + 4, -9, 12)), 4, 98);
  const angleDeg = (signupDaysAgo % 360) + round2(between(seed + 5, -6, 6));
  const arr = Math.round(between(seed + 6, r.arr[0], r.arr[1]) / 1000) * 1000;
  const seats = intBetween(seed + 7, stage === "trial" ? 2 : 6, stage === "expanded" ? 240 : 90);
  return {
    id: `acct-${String(i + 1).padStart(2, "0")}`,
    name: COMPANIES[i],
    stage,
    signupDaysAgo,
    angleDeg: round2(((angleDeg % 360) + 360) % 360),
    health: { "7d": h7, "30d": h30, "90d": h90 },
    trend: makeTrend(seed, h90),
    arr,
    seats,
    csm: pick(CSMS, seed + 8),
    contactName: `${pick(FIRST, seed + 9)} ${pick(LAST, seed + 10)}`,
    contactTitle: pick(TITLES, seed + 11),
    avatarId: pick(AVATAR_IDS, seed + 12),
    nextAction: NEXT_ACTION[stage],
    events: makeEvents(stage, seed),
  };
});

export function customerById(id: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.id === id);
}

/* 궤도 좌표: 밴드 내에서 헬스로 반지름 변조(건강할수록 바깥). */
export function dotRadius(stage: StageId, health: number): number {
  const b = STAGE_META[stage].ring;
  const pad = STAGE_META[stage].escape ? 0 : 7;
  const frac = clamp(health, 0, 100) / 100;
  const span = b.outer - b.inner - 2 * pad;
  return round2(b.inner + pad + frac * Math.max(span, 0));
}

export function dotXY(c: Customer, period: PeriodId): { x: number; y: number; r: number } {
  const radius = dotRadius(c.stage, c.health[period]);
  const rad = ((c.angleDeg - 90) * Math.PI) / 180;
  return {
    x: round2(CENTER + radius * Math.cos(rad)),
    y: round2(CENTER + radius * Math.sin(rad)),
    r: radius,
  };
}

/** ARR 규모 → 점 크기(정보 밀도). */
export function dotSize(arr: number): number {
  if (arr >= 150000) return 6.4;
  if (arr >= 60000) return 5.4;
  if (arr >= 24000) return 4.6;
  return 3.9;
}

/* ---------------------------------------------------------------------- */
/* 단계 전환 로그 — 하단 테이블(정렬 가능). CUSTOMERS 에서 결정론적으로 파생.    */
/* ---------------------------------------------------------------------- */

export type Transition = {
  id: string;
  customerId: string;
  from: StageId;
  to: StageId;
  healthDelta: number;
  daysAgo: number;
  when: string;
  positive: boolean;
};

const ADVANCE_FROM: Partial<Record<StageId, StageId>> = {
  activated: "trial",
  retained: "activated",
  expanded: "retained",
};

function whenLabel(daysAgo: number): string {
  if (daysAgo <= 0) return "오늘";
  if (daysAgo === 1) return "어제";
  return `${daysAgo}일 전`;
}

export const TRANSITIONS: Transition[] = CUSTOMERS.flatMap((c, idx) => {
  const seed = idx * 101 + 7;
  // trial 진입은 "신규"라 전환 로그에서 제외. 나머지 단계는 결정론 플래그로 ~1/3 표본.
  if (c.stage === "trial") return [];
  if (hash01(seed + 60) <= 0.62) return [];

  const daysAgo = intBetween(seed + 61, 0, 30);
  let from: StageId;
  let positive: boolean;

  if (c.stage === "churned") {
    from = hash01(seed + 62) < 0.5 ? "retained" : "expanded";
    positive = false;
  } else if (hash01(seed + 63) < 0.16) {
    // 다운그레이드(부정 전환)
    from = c.stage === "activated" ? "retained" : "expanded";
    positive = false;
  } else {
    from = ADVANCE_FROM[c.stage] ?? "trial";
    positive = true;
  }

  const healthDelta = positive
    ? intBetween(seed + 64, 6, 22)
    : -intBetween(seed + 65, 8, 30);

  return [{
    id: `tr-${c.id}`,
    customerId: c.id,
    from,
    to: c.stage,
    healthDelta,
    daysAgo,
    when: whenLabel(daysAgo),
    positive,
  }];
});

/* ---------------------------------------------------------------------- */
/* 파생 집계 — 모든 수치는 CUSTOMERS 단일 소스에서 도출(합계 정합 보장)         */
/* ---------------------------------------------------------------------- */

export type FilterId = "all" | StageId;

export function visibleCustomers(filter: FilterId): Customer[] {
  return filter === "all" ? CUSTOMERS : CUSTOMERS.filter((c) => c.stage === filter);
}

export function stageCounts(): Record<StageId, number> {
  const out = { trial: 0, activated: 0, retained: 0, expanded: 0, churned: 0 } as Record<StageId, number>;
  for (const c of CUSTOMERS) out[c.stage] += 1;
  return out;
}

export function avgHealth(list: Customer[], period: PeriodId): number {
  if (list.length === 0) return 0;
  const sum = list.reduce((a, c) => a + c.health[period], 0);
  return Math.round(sum / list.length);
}

/** 이탈 위험: 활성(비-churned) 계정 중 헬스 45 미만. */
export function churnRisk(list: Customer[], period: PeriodId): number {
  return list.filter((c) => c.stage !== "churned" && c.health[period] < 45).length;
}

/** 이번 분기(90일 내) 확장 단계로 이동한 계정 수. */
export function netExpansions(): number {
  return TRANSITIONS.filter((t) => t.to === "expanded" && t.positive).length;
}

/** 확장 계정 총 ARR(Intl 포맷 전 원값). */
export function expansionArr(): number {
  return CUSTOMERS.filter((c) => c.stage === "expanded").reduce((a, c) => a + c.arr, 0);
}

/* 개발 시점 자기 점검: 단계별 합 = 총계(부분합=총합). */
const _COUNTS = stageCounts();
export const _TOTALS_OK = STAGE_ORDER.reduce((a, s) => a + _COUNTS[s], 0) === CUSTOMERS.length;

/* Intl 포맷 */
const USD0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const NUM0 = new Intl.NumberFormat("en-US");

export function formatUsd(v: number): string {
  return USD0.format(v);
}
export function formatUsdCompact(v: number): string {
  if (v >= 1000) return `$${round2(v / 1000)}k`;
  return `$${v}`;
}
export function formatCount(v: number): string {
  return NUM0.format(v);
}
