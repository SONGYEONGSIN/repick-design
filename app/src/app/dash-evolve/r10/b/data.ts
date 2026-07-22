import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Biohazard,
  ClipboardList,
  Grid3x3,
  LayoutGrid,
  Package,
  PackageSearch,
  Settings,
  Snowflake,
  Truck,
  Undo2,
  Users,
  Warehouse,
  Zap,
} from "lucide-react";
import type { CellTierMeta, StateMeta } from "./tokens";

/* ---------------------------------------------------------------------- */
/* 결정론 수학 — Math.random / Date.now / new Date 미사용                     */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 문자열 → 안정적 정수 시드 (Math.random 없이 결정론 재현). */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}
/** 시드 기반 결정론 pseudo-random [0,1) — 완전 재현 가능(하이드레이션 안전). 빈 적재율·피킹 속도 생성 전용. */
function hash01(n: number): number {
  let t = (n + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  t = (t ^ (t >>> 14)) >>> 0;
  return t / 4294967296;
}
function seededFrac(key: string, salt: number): number {
  return hash01(hashString(key) + salt * 101 + 7);
}

/* ---------------------------------------------------------------------- */
/* 브랜드 / 워크스페이스 / 사용자                                             */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Stackyard", tagline: "Warehouse & Fulfillment Ops" };
export { Warehouse as BrandIcon };

export type WorkspaceOption = { id: string; name: string; plan: string };
export const WORKSPACES: WorkspaceOption[] = [
  { id: "northgate", name: "Northgate DC1", plan: "Enterprise · 존 7개" },
  { id: "riverside", name: "Riverside DC2", plan: "Growth · 존 5개" },
  { id: "peak", name: "Peak Season Sandbox", plan: "내부 테스트" },
];

/** 가상 인물(세션 컨텍스트 아님) — Stackyard를 쓰는 풀필먼트 운영 리드. */
export const CURRENT_USER = {
  name: "Marisol Quintana",
  role: "Fulfillment Operations Lead",
  email: "marisol.quintana@northgatedc.example",
  avatarId: "1580489944761-15a19d654956",
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
      { id: "heatmap", label: "존 히트맵", Icon: Grid3x3, active: true },
      { id: "queue", label: "피킹 큐", Icon: ClipboardList, badge: "6" },
    ],
  },
  {
    id: "operations",
    title: "운영",
    items: [
      { id: "receiving", label: "입고 관리", Icon: Truck },
      { id: "audit", label: "재고 감사", Icon: PackageSearch },
      { id: "labor", label: "인력 배치", Icon: Users, disabled: true },
    ],
  },
  {
    id: "admin",
    title: "관리",
    items: [
      { id: "billing", label: "청구", Icon: Banknote, disabled: true },
      { id: "settings", label: "설정", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* 존(zone) 원본 — 입고 도크부터 오버플로 야드까지 7개 구역.                       */
/* ---------------------------------------------------------------------- */

export type ZoneType = "receiving" | "fastpick" | "bulk" | "cold" | "returns" | "hazmat" | "overflow";

export type RawZone = {
  id: string;
  code: string;
  name: string;
  type: ZoneType;
  Icon: LucideIcon;
  aisleCount: number;
  binCapacity: number; // 빈 1개당 표준 적재 용량(단위)
  baseUtil: number; // 0~1 목표 가동률 중심값
  ampUtil: number; // 가동률 편차 폭
  baseVelocity: number; // 일일 피킹 건수 중심값
  ampVelocity: number; // 피킹 건수 편차 폭
  description: string;
};

export const RAW_ZONES: RawZone[] = [
  {
    id: "receiving",
    code: "A",
    name: "입고 도크",
    type: "receiving",
    Icon: Truck,
    aisleCount: 3,
    binCapacity: 30,
    baseUtil: 0.58,
    ampUtil: 0.55,
    baseVelocity: 6,
    ampVelocity: 6,
    description: "트럭 하차 직후 임시 스테이징. 입고량에 따라 적재율 변동이 크다.",
  },
  {
    id: "fastpick",
    code: "B",
    name: "패스트픽 포워드",
    type: "fastpick",
    Icon: Zap,
    aisleCount: 4,
    binCapacity: 45,
    baseUtil: 0.78,
    ampUtil: 0.4,
    baseVelocity: 28,
    ampVelocity: 20,
    description: "회전율 상위 SKU 전진 배치 구역. 하루 여러 번 보충된다.",
  },
  {
    id: "bulk",
    code: "C",
    name: "벌크 리저브",
    type: "bulk",
    Icon: Package,
    aisleCount: 4,
    binCapacity: 90,
    baseUtil: 0.7,
    ampUtil: 0.36,
    baseVelocity: 8,
    ampVelocity: 6,
    description: "팔레트 단위 예비 재고 보관. 피킹 빈도는 낮지만 단위 용량이 크다.",
  },
  {
    id: "cold",
    code: "D",
    name: "콜드체인",
    type: "cold",
    Icon: Snowflake,
    aisleCount: 3,
    binCapacity: 40,
    baseUtil: 0.62,
    ampUtil: 0.42,
    baseVelocity: 12,
    ampVelocity: 8,
    description: "냉장·냉동 SKU 전용. 온도 구획별로 적재 한도가 엄격하다.",
  },
  {
    id: "returns",
    code: "E",
    name: "반품 처리",
    type: "returns",
    Icon: Undo2,
    aisleCount: 2,
    binCapacity: 25,
    baseUtil: 0.38,
    ampUtil: 0.4,
    baseVelocity: 4,
    ampVelocity: 4,
    description: "고객 반품 검수·재입고 대기 구역. 대체로 여유가 있다.",
  },
  {
    id: "hazmat",
    code: "F",
    name: "위험물 케이지",
    type: "hazmat",
    Icon: Biohazard,
    aisleCount: 2,
    binCapacity: 20,
    baseUtil: 0.5,
    ampUtil: 0.25,
    baseVelocity: 2,
    ampVelocity: 3,
    description: "에어로졸·배터리 등 규제 품목. 별도 인가된 피커만 접근한다.",
  },
  {
    id: "overflow",
    code: "G",
    name: "오버플로 야드",
    type: "overflow",
    Icon: Package,
    aisleCount: 3,
    binCapacity: 80,
    baseUtil: 0.3,
    ampUtil: 0.45,
    baseVelocity: 2,
    ampVelocity: 3,
    description: "성수기 초과 재고를 임시로 흡수하는 완충 구역.",
  },
];

export const ZONE_MAP: Record<string, RawZone> = Object.fromEntries(RAW_ZONES.map((z) => [z.id, z]));

/* ---------------------------------------------------------------------- */
/* 통로(aisle) / 빈(bin) — 결정론 시드 기반 생성. rows = 통로, cols = 빈 포지션.   */
/* ---------------------------------------------------------------------- */

export const BIN_COLS = 8;

export type Aisle = { code: string; zoneId: string; indexInZone: number };

export const AISLES: Aisle[] = RAW_ZONES.flatMap((z) =>
  Array.from({ length: z.aisleCount }, (_, i) => ({ code: `${z.code}${i + 1}`, zoneId: z.id, indexInZone: i })),
);

export type UtilTier = "empty" | "low" | "mid" | "high" | "critical" | "over";
export type VelocityTier = "idle" | "low" | "medium" | "high" | "veryHigh" | "hot";

export function utilTierFor(pct: number): UtilTier {
  if (pct <= 0) return "empty";
  if (pct < 40) return "low";
  if (pct < 70) return "mid";
  if (pct < 95) return "high";
  if (pct < 110) return "critical";
  return "over";
}
export function velocityTierFor(v: number): VelocityTier {
  if (v <= 2) return "idle";
  if (v <= 9) return "low";
  if (v <= 19) return "medium";
  if (v <= 29) return "high";
  if (v <= 39) return "veryHigh";
  return "hot";
}

export const UTIL_TIER_META: Record<UtilTier, CellTierMeta> = {
  empty: { label: "공백", text: "text-zinc-500 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800/50", border: "border-zinc-300 border-dashed dark:border-zinc-600" },
  low: { label: "여유", text: "text-indigo-700 dark:text-indigo-300", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20" },
  mid: { label: "보통", text: "text-indigo-800 dark:text-indigo-200", bg: "bg-indigo-100 dark:bg-indigo-500/20", border: "border-indigo-200 dark:border-indigo-500/30" },
  high: { label: "높음", text: "text-indigo-950 dark:text-indigo-50", bg: "bg-indigo-300 dark:bg-indigo-500/40", border: "border-indigo-400 dark:border-indigo-400/60" },
  critical: { label: "임박", text: "text-white", bg: "bg-indigo-600 dark:bg-indigo-500/80", border: "border-indigo-700 dark:border-indigo-300" },
  over: { label: "초과", text: "text-white", bg: "bg-rose-600 dark:bg-rose-500/85", border: "border-rose-800 dark:border-rose-300", pattern: "stripe" },
};

export const VELOCITY_TIER_META: Record<VelocityTier, CellTierMeta> = {
  idle: { label: "휴지", text: "text-zinc-500 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800/50", border: "border-zinc-300 border-dashed dark:border-zinc-600", pattern: "hatch" },
  low: { label: "저속", text: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20" },
  medium: { label: "보통", text: "text-amber-800 dark:text-amber-200", bg: "bg-amber-100 dark:bg-amber-500/20", border: "border-amber-200 dark:border-amber-500/30" },
  high: { label: "빠름", text: "text-amber-950 dark:text-amber-50", bg: "bg-amber-300 dark:bg-amber-500/40", border: "border-amber-400 dark:border-amber-400/60" },
  veryHigh: { label: "매우 빠름", text: "text-white", bg: "bg-amber-800 dark:bg-amber-700/85", border: "border-amber-900 dark:border-amber-300" },
  hot: { label: "과열", text: "text-white", bg: "bg-rose-600 dark:bg-rose-500/85", border: "border-rose-800 dark:border-rose-300", pattern: "stripe" },
};

export type BinCell = {
  id: string;
  aisleCode: string;
  zoneId: string;
  rowIndex: number; // AISLES 배열 내 절대 행 인덱스(그리드 렌더용)
  binPos: number; // 1..BIN_COLS
  capacity: number;
  itemCount: number;
  utilizationPct: number;
  velocity: number;
  lastRestockedDaysAgo: number;
};

export const BINS: BinCell[] = AISLES.flatMap((aisle, rowIndex) => {
  const zone = ZONE_MAP[aisle.zoneId];
  return Array.from({ length: BIN_COLS }, (_, colIdx) => {
    const binPos = colIdx + 1;
    const id = `${aisle.code}-${String(binPos).padStart(2, "0")}`;
    const utilFrac = clamp(zone.baseUtil + (seededFrac(id, 1) - 0.5) * 2 * zone.ampUtil, 0, 1.3);
    const itemCount = Math.round(zone.binCapacity * utilFrac);
    const utilizationPct = Math.round((itemCount / zone.binCapacity) * 100);
    const velocity = Math.max(0, Math.round(zone.baseVelocity + (seededFrac(id, 2) - 0.5) * 2 * zone.ampVelocity));
    const lastRestockedDaysAgo = Math.round(seededFrac(id, 3) * 30);
    return {
      id,
      aisleCode: aisle.code,
      zoneId: aisle.zoneId,
      rowIndex,
      binPos,
      capacity: zone.binCapacity,
      itemCount,
      utilizationPct,
      velocity,
      lastRestockedDaysAgo,
    };
  });
});

export const BIN_MAP: Record<string, BinCell> = Object.fromEntries(BINS.map((b) => [b.id, b]));

/** 통로 → 해당 통로의 빈 8개(빈 포지션 순). 그리드/스크린리더 표 렌더 공용. */
export const AISLE_BINS: Record<string, BinCell[]> = Object.fromEntries(
  AISLES.map((a) => [a.code, BINS.filter((b) => b.aisleCode === a.code).sort((x, y) => x.binPos - y.binPos)]),
);

/* ---------------------------------------------------------------------- */
/* 존 집계 — 부분합(빈 단위) → 존 합계 → 전체 합계 순으로 도출(합계 정합 보장).     */
/* ---------------------------------------------------------------------- */

export type ZoneStats = RawZone & {
  totalCapacity: number;
  totalOccupied: number;
  utilizationPct: number;
  overCount: number; // 초과(over) 등급 빈 개수 — 존 레일의 경보 배지 기준
  avgVelocity: number;
};

export const ZONE_STATS: ZoneStats[] = RAW_ZONES.map((z) => {
  const bins = BINS.filter((b) => b.zoneId === z.id);
  const totalCapacity = bins.reduce((sum, b) => sum + b.capacity, 0);
  const totalOccupied = bins.reduce((sum, b) => sum + b.itemCount, 0);
  const overCount = bins.filter((b) => utilTierFor(b.utilizationPct) === "over").length;
  const avgVelocity = round2(bins.reduce((sum, b) => sum + b.velocity, 0) / bins.length);
  return {
    ...z,
    totalCapacity,
    totalOccupied,
    utilizationPct: Math.round((totalOccupied / totalCapacity) * 100),
    overCount,
    avgVelocity,
  };
});
export const ZONE_STATS_MAP: Record<string, ZoneStats> = Object.fromEntries(ZONE_STATS.map((z) => [z.id, z]));

/** 결정론 6구간 피킹 속도 추이(존 평균값으로 종료) — id 해시 기반, Math.random 미사용. 존 레일 미니 스파크라인용. */
export function zoneVelocityTrend(zone: ZoneStats): number[] {
  const seed = hashString(zone.id);
  const out: number[] = [];
  for (let i = 0; i < 5; i++) {
    const jitterPct = (hash01(seed + i * 13) - 0.5) * 0.35;
    out.push(Math.max(0, round2(zone.avgVelocity * (1 + jitterPct - (4 - i) * 0.02))));
  }
  out.push(zone.avgVelocity);
  return out;
}

export const TOTAL_CAPACITY = ZONE_STATS.reduce((sum, z) => sum + z.totalCapacity, 0);
export const TOTAL_OCCUPIED = ZONE_STATS.reduce((sum, z) => sum + z.totalOccupied, 0);
export const OVERALL_UTIL_PCT = Math.round((TOTAL_OCCUPIED / TOTAL_CAPACITY) * 100);
export const TOTAL_OVER_COUNT = ZONE_STATS.reduce((sum, z) => sum + z.overCount, 0);
export const OVERALL_AVG_VELOCITY = round2(BINS.reduce((sum, b) => sum + b.velocity, 0) / BINS.length);

/* ---------------------------------------------------------------------- */
/* 피커(picker) 인력 — 가상 인물, 실존 세션 정보 아님.                             */
/* ---------------------------------------------------------------------- */

export type Picker = { id: string; name: string; shift: string; avatarId: string };

export const PICKERS: Picker[] = [
  { id: "picker-noor", name: "Noor Delacroix", shift: "주간조", avatarId: "1438761681033-6461ffad8d80" },
  { id: "picker-ehsan", name: "Ehsan Bawa", shift: "주간조", avatarId: "1472099645785-5658abf4ff4e" },
  { id: "picker-talia", name: "Talia Ferrante", shift: "주간조", avatarId: "1494790108377-be9c29b29330" },
  { id: "picker-omar", name: "Omar Vetsch", shift: "야간조", avatarId: "1506794778202-cad84cf45f1d" },
  { id: "picker-renske", name: "Renske Kolar", shift: "야간조", avatarId: "1519085360753-af0119f7cbe7" },
  { id: "picker-dax", name: "Dax Okonkwo", shift: "야간조", avatarId: "1544005313-94ddf0286df2" },
];
export const PICKER_MAP: Record<string, Picker> = Object.fromEntries(PICKERS.map((p) => [p.id, p]));

/* ---------------------------------------------------------------------- */
/* 피킹 작업(task) — 존별 활성 피킹 큐. 상태·SLA는 서사가 맞도록 손으로 배정.        */
/* ---------------------------------------------------------------------- */

export type TaskStatus = "late" | "at_risk" | "picking" | "queued";

export const STATUS_META: Record<TaskStatus, StateMeta & { severity: number }> = {
  late: { label: "지연", text: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-500/12", border: "border-rose-200 dark:border-rose-500/25", dot: "bg-rose-500", bar: "bg-rose-500", severity: 0 },
  at_risk: { label: "임박", text: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-500/12", border: "border-amber-200 dark:border-amber-500/25", dot: "bg-amber-500", bar: "bg-amber-500", severity: 1 },
  picking: { label: "피킹중", text: "text-indigo-700 dark:text-indigo-300", bg: "bg-indigo-50 dark:bg-indigo-500/12", border: "border-indigo-200 dark:border-indigo-500/25", dot: "bg-indigo-500", bar: "bg-indigo-500", severity: 2 },
  queued: { label: "대기", text: "text-zinc-600 dark:text-zinc-300", bg: "bg-zinc-100 dark:bg-zinc-500/12", border: "border-zinc-200 dark:border-zinc-500/20", dot: "bg-zinc-400", bar: "bg-zinc-400", severity: 3 },
};

export type PickTask = {
  id: string;
  zoneId: string;
  sku: string;
  itemName: string;
  qty: number;
  pickerId: string;
  status: TaskStatus;
  slaMinutes: number; // 양수=남은 분, 음수=초과 분
};

export const TASKS: PickTask[] = [
  { id: "tsk-3001", zoneId: "receiving", sku: "RCV-1042", itemName: "팔레트 라벨 스캐너 배치", qty: 12, pickerId: "picker-noor", status: "picking", slaMinutes: 34 },
  { id: "tsk-3002", zoneId: "receiving", sku: "RCV-0918", itemName: "완충재 롤 900mm", qty: 6, pickerId: "picker-ehsan", status: "queued", slaMinutes: 96 },
  { id: "tsk-3003", zoneId: "receiving", sku: "RCV-1077", itemName: "입고 검수 클립보드 세트", qty: 3, pickerId: "picker-noor", status: "at_risk", slaMinutes: 11 },

  { id: "tsk-3011", zoneId: "fastpick", sku: "FPK-2201", itemName: "무선 마우스 M185", qty: 40, pickerId: "picker-talia", status: "late", slaMinutes: -14 },
  { id: "tsk-3012", zoneId: "fastpick", sku: "FPK-2255", itemName: "보조배터리 10000mAh", qty: 28, pickerId: "picker-dax", status: "picking", slaMinutes: 8 },
  { id: "tsk-3013", zoneId: "fastpick", sku: "FPK-2309", itemName: "스테인리스 텀블러 750ml", qty: 55, pickerId: "picker-omar", status: "at_risk", slaMinutes: 6 },
  { id: "tsk-3014", zoneId: "fastpick", sku: "FPK-2340", itemName: "블루투스 미니 스피커", qty: 19, pickerId: "picker-talia", status: "queued", slaMinutes: 52 },

  { id: "tsk-3021", zoneId: "bulk", sku: "BLK-4410", itemName: "요가 매트 6mm 팔레트", qty: 24, pickerId: "picker-renske", status: "picking", slaMinutes: 41 },
  { id: "tsk-3022", zoneId: "bulk", sku: "BLK-4487", itemName: "생수 24팩 팔레트", qty: 8, pickerId: "picker-omar", status: "queued", slaMinutes: 120 },
  { id: "tsk-3023", zoneId: "bulk", sku: "BLK-4512", itemName: "종이컵 벌크 박스", qty: 15, pickerId: "picker-renske", status: "at_risk", slaMinutes: 9 },

  { id: "tsk-3031", zoneId: "cold", sku: "CLD-0812", itemName: "냉장 유제품 트레이", qty: 32, pickerId: "picker-dax", status: "at_risk", slaMinutes: 4 },
  { id: "tsk-3032", zoneId: "cold", sku: "CLD-0855", itemName: "급속 냉동 밀키트", qty: 18, pickerId: "picker-ehsan", status: "picking", slaMinutes: 22 },

  { id: "tsk-3041", zoneId: "returns", sku: "RTN-1190", itemName: "반품 헤드셋 재검수", qty: 7, pickerId: "picker-noor", status: "queued", slaMinutes: 143 },
  { id: "tsk-3042", zoneId: "returns", sku: "RTN-1204", itemName: "반품 의류 재포장", qty: 21, pickerId: "picker-talia", status: "queued", slaMinutes: 88 },

  { id: "tsk-3051", zoneId: "hazmat", sku: "HAZ-0071", itemName: "에어로졸 세정제 케이스", qty: 5, pickerId: "picker-omar", status: "late", slaMinutes: -22 },

  { id: "tsk-3061", zoneId: "overflow", sku: "OVF-2290", itemName: "성수기 완구 팔레트", qty: 10, pickerId: "picker-dax", status: "queued", slaMinutes: 210 },
];

export const TASK_ZONE_MAP: Record<string, PickTask[]> = Object.fromEntries(
  RAW_ZONES.map((z) => [z.id, TASKS.filter((t) => t.zoneId === z.id)]),
);

export const ACTIVE_TASK_COUNT = TASKS.length;
export const AT_RISK_OR_LATE_COUNT = TASKS.filter((t) => t.status === "late" || t.status === "at_risk").length;

/* ---------------------------------------------------------------------- */
/* 커맨드 팔레트 검색 인덱스 — 존 / 피커 / 작업(품목) 통합.                          */
/* ---------------------------------------------------------------------- */

export type PaletteEntry = { id: string; kind: "zone" | "picker" | "task"; label: string; sublabel: string; zoneId: string };

export const PALETTE_ENTRIES: PaletteEntry[] = [
  ...RAW_ZONES.map((z): PaletteEntry => ({ id: `zone-${z.id}`, kind: "zone", label: `${z.code} · ${z.name}`, sublabel: `${z.aisleCount}개 통로 · 존으로 이동`, zoneId: z.id })),
  ...PICKERS.map((p): PaletteEntry => {
    const firstTask = TASKS.find((t) => t.pickerId === p.id);
    return { id: `picker-${p.id}`, kind: "picker", label: p.name, sublabel: `${p.shift} 피커 · ${firstTask ? ZONE_MAP[firstTask.zoneId].name : "배정 없음"}으로 이동`, zoneId: firstTask?.zoneId ?? RAW_ZONES[0].id };
  }),
  ...TASKS.map((t): PaletteEntry => ({ id: `task-${t.id}`, kind: "task", label: t.itemName, sublabel: `${t.sku} · ${ZONE_MAP[t.zoneId].name}`, zoneId: t.zoneId })),
];

/* ---------------------------------------------------------------------- */
/* 포맷터 — Intl 고정                                                       */
/* ---------------------------------------------------------------------- */

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(n);
}
export function formatUnits(n: number): string {
  return `${countFmt.format(n)}개`;
}
export function formatPercent(n: number): string {
  return `${countFmt.format(n)}%`;
}
export function formatSla(minutes: number): string {
  if (minutes < 0) return `${countFmt.format(Math.abs(minutes))}분 초과`;
  if (minutes === 0) return "마감 임박";
  return `${countFmt.format(minutes)}분 남음`;
}
export function formatRestocked(daysAgo: number): string {
  if (daysAgo <= 0) return "오늘 입고";
  return `${countFmt.format(daysAgo)}일 전`;
}
