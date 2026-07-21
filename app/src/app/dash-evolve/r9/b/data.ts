import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Boxes,
  ClipboardList,
  Database,
  GitPullRequestArrow,
  LayoutGrid,
  Radar,
  Settings,
  ShieldAlert,
  Waypoints,
  Workflow,
} from "lucide-react";
import type { StateMeta } from "./tokens";

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
/** 시드 기반 결정론 pseudo-random [0,1) — 완전 재현 가능(하이드레이션 안전). 레이아웃 지터·추이 생성 전용. */
function hash01(n: number): number {
  let t = (n + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  t = (t ^ (t >>> 14)) >>> 0;
  return t / 4294967296;
}
/** 노드 id 기반 결정론 미세 지터(±amp) — 손으로 앉힌 좌표에 유기적 편차를 더한다(물리 시뮬레이션 없음, 모듈 로드 시 1회 계산). */
function jitter(id: string, axis: 0 | 1, amp: number): number {
  const h = hash01(hashString(id) + axis * 97 + 11);
  return (h - 0.5) * 2 * amp;
}

/* ---------------------------------------------------------------------- */
/* 브랜드 / 워크스페이스 / 사용자                                             */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Meshline", tagline: "Service Dependency Intelligence" };
export { Workflow as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "bramwell", name: "Bramwell Commerce", plan: "Scale · 서비스 16개" },
  { id: "northfield", name: "Northfield Logistics", plan: "Growth · 서비스 9개" },
  { id: "sandbox", name: "Reliability Sandbox", plan: "내부 테스트" },
];

/** 가상 인물(세션 컨텍스트 아님) — Meshline을 쓰는 플랫폼 신뢰성 리드. */
export const CURRENT_USER = {
  name: "Nadia Ferreira",
  role: "Head of Platform Reliability",
  email: "nadia.ferreira@bramwellcommerce.io",
  avatarId: "1633332755192-727a05c4013d",
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
      { id: "graph", label: "의존성 그래프", Icon: Waypoints, active: true },
      { id: "incidents", label: "인시던트", Icon: ShieldAlert, badge: "2" },
    ],
  },
  {
    id: "observability",
    title: "관측 가능성",
    items: [
      { id: "latency", label: "지연 추이", Icon: Radar },
      { id: "changes", label: "배포 로그", Icon: GitPullRequestArrow },
      { id: "runbooks", label: "런북", Icon: ClipboardList },
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
/* 신뢰도(오류율) / 지연(P99) 상태 메타 — 두 지표를 각각 3구간 톤으로 인코딩         */
/* ---------------------------------------------------------------------- */

export type ReliabilityId = "healthy" | "degraded" | "critical";
export type LatencyId = "fast" | "moderate" | "slow";

export const RELIABILITY_META: Record<ReliabilityId, StateMeta> = {
  healthy: {
    label: "Healthy",
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    stroke: "stroke-emerald-600 dark:stroke-emerald-400",
    fill: "fill-emerald-600 dark:fill-emerald-400",
  },
  degraded: {
    label: "Degraded",
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    stroke: "stroke-amber-600 dark:stroke-amber-400",
    fill: "fill-amber-600 dark:fill-amber-400",
  },
  critical: {
    label: "Critical",
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
    stroke: "stroke-rose-600 dark:stroke-rose-400",
    fill: "fill-rose-600 dark:fill-rose-400",
  },
};

export const LATENCY_META: Record<LatencyId, StateMeta> = {
  fast: {
    label: "Fast",
    text: "text-teal-700 dark:text-teal-300",
    bg: "bg-teal-50 dark:bg-teal-500/12",
    border: "border-teal-200 dark:border-teal-500/25",
    dot: "bg-teal-500",
    bar: "bg-teal-500",
    stroke: "stroke-teal-600 dark:stroke-teal-400",
    fill: "fill-teal-600 dark:fill-teal-400",
  },
  moderate: {
    label: "Moderate",
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    stroke: "stroke-amber-600 dark:stroke-amber-400",
    fill: "fill-amber-600 dark:fill-amber-400",
  },
  slow: {
    label: "Slow",
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
    stroke: "stroke-rose-600 dark:stroke-rose-400",
    fill: "fill-rose-600 dark:fill-rose-400",
  },
};

export function reliabilityFor(errorRate: number): ReliabilityId {
  if (errorRate >= 3.5) return "critical";
  if (errorRate >= 1.2) return "degraded";
  return "healthy";
}
export function latencyFor(p99: number): LatencyId {
  if (p99 >= 350) return "slow";
  if (p99 >= 150) return "moderate";
  return "fast";
}

/* ---------------------------------------------------------------------- */
/* 계층(layer) 메타 — 진입점(edge) / 도메인 서비스(service) / 데이터·인프라(data)   */
/* ---------------------------------------------------------------------- */

export type Layer = "edge" | "service" | "data";
export const LAYER_META: Record<Layer, { label: string; Icon: LucideIcon }> = {
  edge: { label: "진입점", Icon: Waypoints },
  service: { label: "도메인 서비스", Icon: Boxes },
  data: { label: "데이터·인프라", Icon: Database },
};

/* ---------------------------------------------------------------------- */
/* 서비스 원본 — Bramwell Commerce 마이크로서비스 16개. 실측이 아닌 결정론 더미이나  */
/* 오류율/지연/요청량은 상호 서사가 맞도록 손으로 배정(예: 결제→사기탐지 장애 전파).   */
/* ---------------------------------------------------------------------- */

export type RawService = {
  id: string;
  name: string;
  shortLabel: string;
  layer: Layer;
  owner: string;
  version: string;
  requestVolume: number; // req/분
  errorRate: number; // %
  p99: number; // ms
  uptime: number; // %
  description: string;
  baseX: number;
  baseY: number;
};

export const RAW_SERVICES: RawService[] = [
  {
    id: "edge-gateway",
    name: "edge-gateway",
    shortLabel: "Gateway",
    layer: "edge",
    owner: "Platform Infra",
    version: "v4.2.1",
    requestVolume: 12400,
    errorRate: 0.4,
    p99: 82,
    uptime: 99.98,
    description: "모든 외부 트래픽의 단일 진입점. TLS 종료, 라우팅, 레이트리밋을 담당한다.",
    baseX: 120,
    baseY: 90,
  },
  {
    id: "web-bff",
    name: "web-bff",
    shortLabel: "Web BFF",
    layer: "edge",
    owner: "Web Platform",
    version: "v2.9.0",
    requestVolume: 9800,
    errorRate: 0.6,
    p99: 96,
    uptime: 99.95,
    description: "웹 클라이언트 전용 Backend-for-Frontend. 도메인 서비스 응답을 화면 단위로 합성한다.",
    baseX: 270,
    baseY: 140,
  },
  {
    id: "auth-service",
    name: "auth-service",
    shortLabel: "Auth",
    layer: "service",
    owner: "Identity",
    version: "v6.1.3",
    requestVolume: 8200,
    errorRate: 0.3,
    p99: 64,
    uptime: 99.99,
    description: "세션 발급·토큰 검증. 거의 모든 요청 경로의 첫 관문.",
    baseX: 95,
    baseY: 250,
  },
  {
    id: "billing-service",
    name: "billing-service",
    shortLabel: "Billing",
    layer: "service",
    owner: "Finance Eng",
    version: "v3.4.0",
    requestVolume: 1450,
    errorRate: 0.8,
    p99: 210,
    uptime: 99.9,
    description: "구독 청구 주기와 인보이스를 관리한다.",
    baseX: 550,
    baseY: 85,
  },
  {
    id: "orders-service",
    name: "orders-service",
    shortLabel: "Orders",
    layer: "service",
    owner: "Commerce Core",
    version: "v8.0.2",
    requestVolume: 5300,
    errorRate: 2.1,
    p99: 340,
    uptime: 99.7,
    description: "주문 생성·상태 전이의 중심 서비스. 재고·결제·사기탐지와 직접 연동된다.",
    baseX: 400,
    baseY: 235,
  },
  {
    id: "payments-service",
    name: "payments-service",
    shortLabel: "Payments",
    layer: "service",
    owner: "Finance Eng",
    version: "v5.7.1",
    requestVolume: 2200,
    errorRate: 3.8,
    p99: 480,
    uptime: 99.4,
    description: "카드사·PG 연동 결제 처리. 사기탐지 결과를 대기해 최종 승인한다.",
    baseX: 505,
    baseY: 165,
  },
  {
    id: "fraud-detection",
    name: "fraud-detection",
    shortLabel: "Fraud",
    layer: "service",
    owner: "Trust & Safety",
    version: "v2.3.4",
    requestVolume: 2050,
    errorRate: 4.6,
    p99: 610,
    uptime: 99.2,
    description: "룰+모델 기반 실시간 사기 스코어링. 현재 모델 재학습 배포 이후 오류율이 상승 중이다.",
    baseX: 690,
    baseY: 130,
  },
  {
    id: "inventory-service",
    name: "inventory-service",
    shortLabel: "Inventory",
    layer: "service",
    owner: "Commerce Core",
    version: "v4.1.0",
    requestVolume: 3100,
    errorRate: 0.5,
    p99: 120,
    uptime: 99.95,
    description: "SKU 재고 예약·차감을 처리한다.",
    baseX: 520,
    baseY: 305,
  },
  {
    id: "catalog-service",
    name: "catalog-service",
    shortLabel: "Catalog",
    layer: "service",
    owner: "Commerce Core",
    version: "v7.2.0",
    requestVolume: 6700,
    errorRate: 0.4,
    p99: 88,
    uptime: 99.97,
    description: "상품 메타데이터·가격·옵션을 서빙한다.",
    baseX: 310,
    baseY: 345,
  },
  {
    id: "search-service",
    name: "search-service",
    shortLabel: "Search",
    layer: "service",
    owner: "Discovery",
    version: "v3.0.5",
    requestVolume: 4200,
    errorRate: 0.7,
    p99: 150,
    uptime: 99.92,
    description: "키워드·필터 검색 질의를 처리한다.",
    baseX: 170,
    baseY: 395,
  },
  {
    id: "recommendation-service",
    name: "recommendation-service",
    shortLabel: "Recs",
    layer: "service",
    owner: "Discovery",
    version: "v1.8.2",
    requestVolume: 2600,
    errorRate: 1.4,
    p99: 260,
    uptime: 99.8,
    description: "개인화 추천 후보를 생성한다. 최근 피처 스토어 지연으로 응답이 느려지는 중이다.",
    baseX: 430,
    baseY: 425,
  },
  {
    id: "notification-service",
    name: "notification-service",
    shortLabel: "Notify",
    layer: "service",
    owner: "Growth Eng",
    version: "v2.6.0",
    requestVolume: 3900,
    errorRate: 0.9,
    p99: 140,
    uptime: 99.9,
    description: "이메일·푸시·인앱 알림 발송을 오케스트레이션한다.",
    baseX: 645,
    baseY: 230,
  },
  {
    id: "cache-layer",
    name: "cache-layer",
    shortLabel: "Cache",
    layer: "data",
    owner: "Platform Infra",
    version: "Redis 7.2",
    requestVolume: 15200,
    errorRate: 0.1,
    p99: 8,
    uptime: 99.99,
    description: "세션·검색·재고 조회 결과의 공유 캐시.",
    baseX: 150,
    baseY: 470,
  },
  {
    id: "message-bus",
    name: "message-bus",
    shortLabel: "Event Bus",
    layer: "data",
    owner: "Platform Infra",
    version: "Kafka 3.6",
    requestVolume: 10800,
    errorRate: 0.6,
    p99: 32,
    uptime: 99.96,
    description: "주문·알림·추천·결제 이벤트를 비동기로 팬아웃하는 이벤트 버스.",
    baseX: 590,
    baseY: 385,
  },
  {
    id: "postgres-primary",
    name: "postgres-primary",
    shortLabel: "Postgres",
    layer: "data",
    owner: "Data Platform",
    version: "PG 16",
    requestVolume: 7600,
    errorRate: 0.2,
    p99: 22,
    uptime: 99.99,
    description: "주문·인증·청구·재고의 원장 데이터를 보관하는 1차 저장소.",
    baseX: 300,
    baseY: 480,
  },
  {
    id: "search-index",
    name: "search-index",
    shortLabel: "Elastic",
    layer: "data",
    owner: "Data Platform",
    version: "ES 8.13",
    requestVolume: 3300,
    errorRate: 0.3,
    p99: 45,
    uptime: 99.97,
    description: "카탈로그·검색을 위한 역색인 저장소.",
    baseX: 225,
    baseY: 270,
  },
];

/* ---------------------------------------------------------------------- */
/* 의존성 엣지 — 방향성 호출 관계. 순수 계층 트리가 아니라 순환(사기탐지→주문,      */
/* 알림↔이벤트버스)과 다대다 교차 연결을 포함하는 유기적 웹 형태.                   */
/* ---------------------------------------------------------------------- */

export type Channel = "http" | "event";
export type RawEdge = { source: string; target: string; channel: Channel };

export const RAW_EDGES: RawEdge[] = [
  { source: "edge-gateway", target: "web-bff", channel: "http" },
  { source: "edge-gateway", target: "auth-service", channel: "http" },
  { source: "web-bff", target: "catalog-service", channel: "http" },
  { source: "web-bff", target: "search-service", channel: "http" },
  { source: "web-bff", target: "recommendation-service", channel: "http" },
  { source: "web-bff", target: "orders-service", channel: "http" },
  { source: "auth-service", target: "postgres-primary", channel: "http" },
  { source: "auth-service", target: "cache-layer", channel: "http" },
  { source: "orders-service", target: "inventory-service", channel: "http" },
  { source: "orders-service", target: "payments-service", channel: "http" },
  { source: "orders-service", target: "notification-service", channel: "http" },
  { source: "orders-service", target: "message-bus", channel: "event" },
  { source: "payments-service", target: "fraud-detection", channel: "http" },
  { source: "fraud-detection", target: "orders-service", channel: "http" },
  { source: "fraud-detection", target: "message-bus", channel: "event" },
  { source: "inventory-service", target: "postgres-primary", channel: "http" },
  { source: "inventory-service", target: "cache-layer", channel: "http" },
  { source: "catalog-service", target: "search-index", channel: "http" },
  { source: "catalog-service", target: "postgres-primary", channel: "http" },
  { source: "search-service", target: "search-index", channel: "http" },
  { source: "search-service", target: "cache-layer", channel: "http" },
  { source: "recommendation-service", target: "message-bus", channel: "event" },
  { source: "recommendation-service", target: "catalog-service", channel: "http" },
  { source: "notification-service", target: "message-bus", channel: "event" },
  { source: "message-bus", target: "notification-service", channel: "event" },
  { source: "billing-service", target: "payments-service", channel: "http" },
  { source: "billing-service", target: "postgres-primary", channel: "http" },
  { source: "billing-service", target: "message-bus", channel: "event" },
];

/* ---------------------------------------------------------------------- */
/* 파생 모델 — 신뢰도/지연 등급, 좌표(지터 반영), 상·하류 이웃, 반경 스케일.        */
/* ---------------------------------------------------------------------- */

export type ServiceNode = RawService & {
  reliability: ReliabilityId;
  latency: LatencyId;
  x: number;
  y: number;
  radius: number; // 요청량 기반 반경(설계 좌표계) — 엣지 트리밍·크기 인코딩 공용
  chipW: number; // 카드 폭(설계 좌표계) — radius로부터 유도, 노드 크기 = 요청량 인코딩
  chipH: number; // 카드 높이(설계 좌표계)
  upstreamIds: string[]; // 이 서비스를 "호출하는" 서비스
  downstreamIds: string[]; // 이 서비스가 "호출하는" 서비스
};

const JITTER_AMP = 3;

/* 설계 폭(CANVAS_W/H)은 "authoring 기준" 좌표계다. 렌더링 시 SVG viewBox + 퍼센트 위치로
   실제 카드 폭에 맞춰 균일 스케일되므로(DagCanvas/OrgTreeCanvas 선례와 동일 원리) 데스크톱
   1280px 이상에서 가로 스크롤이 발생하지 않는다. */
export const CANVAS_W = 880;
export const CANVAS_H = 560;
/** 카드 크기 산정에 쓰인 최대 폭/높이 — 좌표 배치 시 겹침 방지 여유(min dx>=108 or dy>=60)의 기준값. */
export const NODE_W_MAX = 108;
export const NODE_H_MAX = 60;

/** 요청량(req/분) → 노드 반경(px, 설계 좌표계). 로그 스케일 — 최댓값·최솟값 편차가 커도 극단적 크기 차 방지. */
const VOL_MIN = Math.min(...RAW_SERVICES.map((n) => n.requestVolume));
const VOL_MAX = Math.max(...RAW_SERVICES.map((n) => n.requestVolume));
const RADIUS_MIN = 15;
const RADIUS_MAX = 29;
export function radiusForVolume(volume: number): number {
  const t = (Math.log(volume) - Math.log(VOL_MIN)) / (Math.log(VOL_MAX) - Math.log(VOL_MIN));
  return round2(RADIUS_MIN + clamp(t, 0, 1) * (RADIUS_MAX - RADIUS_MIN));
}
function chipWidthForRadius(r: number): number {
  return round2(72 + (r - RADIUS_MIN) * 2.4); // r=15→72, r=29→105.6 (NODE_W_MAX=108 이하 보장)
}
function chipHeightForRadius(r: number): number {
  return round2(46 + (r - RADIUS_MIN) * 1.0); // r=15→46, r=29→60 (NODE_H_MAX=60 이하 보장)
}

export const NODES: ServiceNode[] = RAW_SERVICES.map((s) => {
  const radius = radiusForVolume(s.requestVolume);
  return {
    ...s,
    reliability: reliabilityFor(s.errorRate),
    latency: latencyFor(s.p99),
    x: round2(s.baseX + jitter(s.id, 0, JITTER_AMP)),
    y: round2(s.baseY + jitter(s.id, 1, JITTER_AMP)),
    radius,
    chipW: chipWidthForRadius(radius),
    chipH: chipHeightForRadius(radius),
    upstreamIds: RAW_EDGES.filter((e) => e.target === s.id).map((e) => e.source),
    downstreamIds: RAW_EDGES.filter((e) => e.source === s.id).map((e) => e.target),
  };
});

export const NODE_MAP: Record<string, ServiceNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

export type Connector = { id: string; source: string; target: string; channel: Channel; path: string };

/** 엣지 경로 — 두 노드 중심을 잇되 각 노드 반경만큼 안쪽으로 트리밍해 칩 안으로 선이 파고들지 않게 한다. */
export const CONNECTORS: Connector[] = RAW_EDGES.map((e, i) => {
  const a = NODE_MAP[e.source];
  const b = NODE_MAP[e.target];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.max(Math.hypot(dx, dy), 1);
  const ux = dx / dist;
  const uy = dy / dist;
  const trimA = radiusForVolume(a.requestVolume) + 3;
  const trimB = radiusForVolume(b.requestVolume) + 3;
  const x1 = round2(a.x + ux * trimA);
  const y1 = round2(a.y + uy * trimA);
  const x2 = round2(b.x - ux * trimB);
  const y2 = round2(b.y - uy * trimB);
  return {
    id: `edge-${i}-${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    channel: e.channel,
    path: `M ${x1} ${y1} L ${x2} ${y2}`,
  };
});

/** 결정론 6구간 요청량 추이(현재값으로 종료) — id 해시 기반, Math.random 미사용. */
export function requestVolumeTrend(node: ServiceNode): number[] {
  const seed = hashString(node.id);
  const out: number[] = [];
  for (let i = 0; i < 5; i++) {
    const jitterPct = (hash01(seed + i * 13) - 0.5) * 0.3;
    out.push(Math.round(node.requestVolume * (1 + jitterPct - (4 - i) * 0.015)));
  }
  out.push(node.requestVolume);
  return out.map((v) => Math.max(v, 1));
}

/* ---------------------------------------------------------------------- */
/* 포맷터 — Intl 고정                                                       */
/* ---------------------------------------------------------------------- */

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(n);
}
export function formatVolume(n: number): string {
  return `${countFmt.format(n)}/분`;
}
export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}
export function formatMs(n: number): string {
  return `${countFmt.format(n)}ms`;
}

/* ---------------------------------------------------------------------- */
/* 집계 KPI — 전체 요청량, 가중평균 오류율, 위험 서비스 수, 느린 서비스 수.         */
/* ---------------------------------------------------------------------- */

export const TOTAL_REQUEST_VOLUME = NODES.reduce((sum, n) => sum + n.requestVolume, 0);
export const WEIGHTED_ERROR_RATE = round2(
  NODES.reduce((sum, n) => sum + n.errorRate * n.requestVolume, 0) / TOTAL_REQUEST_VOLUME,
);
export const AT_RISK_COUNT = NODES.filter((n) => n.reliability !== "healthy").length;
export const SLOW_COUNT = NODES.filter((n) => n.latency === "slow").length;
