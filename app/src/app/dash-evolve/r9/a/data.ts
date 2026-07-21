import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Gauge as GaugeBrandIcon,
  KeyRound,
  LayoutGrid,
  LineChart,
  Plug,
  Search,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Siren,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* 결정론 수학 유틸 — Math.random / Date.now / new Date 미사용                 */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 인덱스 기반 결정론 파형 — 모듈로 산술로 재현 가능한 n포인트 시리즈(삼각함수 미사용). */
function genWave(seed: number, base: number, amp: number, n = 12): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const wobble = ((seed + i * 19) % 11) - 5; // -5..5
    const drift = Math.sin(0) * 0; // no-op keeps signature explicit about determinism
    out.push(round2(clamp(base + wobble * (amp / 10) + drift, 0, base * 2.4)));
  }
  return out;
}

/* ---------------------------------------------------------------------- */
/* 브랜드 / 워크스페이스 / 사용자                                             */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Redline", tagline: "SLO & Error-Budget Console" };
export { GaugeBrandIcon as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "prod-fleet", name: "Production Fleet", plan: "Enterprise · 4 services" },
  { id: "staging", name: "Staging Fleet", plan: "Team · 4 services" },
  { id: "sandbox", name: "QA Sandbox", plan: "Internal test" },
];

/** 가상 인물(세션 컨텍스트 아님) — Redline을 쓰는 SRE 팀 리드. */
export const CURRENT_USER = {
  name: "Jordan Ellis",
  role: "Site Reliability Lead",
  email: "jordan.ellis@redlinehq.io",
  avatarId: "1500648767791-00dcc994a43e",
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
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid },
      { id: "console", label: "SLO Console", Icon: GaugeBrandIcon, active: true },
      { id: "incidents", label: "Incidents", Icon: Siren, badge: "2" },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "budgets", label: "Error Budgets", Icon: ShieldAlert },
      { id: "latency", label: "Latency Trends", Icon: LineChart },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "integrations", label: "Integrations", Icon: Plug, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* 서비스 & 관측 기간                                                        */
/* ---------------------------------------------------------------------- */

export type ServiceId = "checkout-api" | "payments-svc" | "auth-gateway" | "search-api";

export type ServiceMeta = { id: ServiceId; label: string; Icon: LucideIcon; sloTargetPct: number };

export const SERVICES: ServiceMeta[] = [
  { id: "checkout-api", label: "checkout-api", Icon: ShoppingCart, sloTargetPct: 99.9 },
  { id: "payments-svc", label: "payments-svc", Icon: CreditCard, sloTargetPct: 99.9 },
  { id: "auth-gateway", label: "auth-gateway", Icon: KeyRound, sloTargetPct: 99.95 },
  { id: "search-api", label: "search-api", Icon: Search, sloTargetPct: 99.5 },
];

export type PeriodId = "1h" | "24h" | "7d" | "30d";
export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "1h", label: "1H" },
  { id: "24h", label: "24H" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
];

export type MetricSnapshot = {
  uptimePct: number;
  errorBudgetRemainingPct: number;
  p99LatencyMs: number;
  errorRatePct: number;
  cpuSaturationPct: number;
  requestRateRps: number;
};

/** 서비스 × 기간별 결정론 스냅샷(핸드작성). 창이 길수록 스파이크가 평균화되는 현실적 패턴. */
export const METRICS: Record<ServiceId, Record<PeriodId, MetricSnapshot>> = {
  "checkout-api": {
    "1h": { uptimePct: 99.95, errorBudgetRemainingPct: 58, p99LatencyMs: 265, errorRatePct: 0.09, cpuSaturationPct: 61, requestRateRps: 1310 },
    "24h": { uptimePct: 99.94, errorBudgetRemainingPct: 55, p99LatencyMs: 252, errorRatePct: 0.1, cpuSaturationPct: 58, requestRateRps: 1275 },
    "7d": { uptimePct: 99.97, errorBudgetRemainingPct: 60, p99LatencyMs: 240, errorRatePct: 0.08, cpuSaturationPct: 55, requestRateRps: 1240 },
    "30d": { uptimePct: 99.982, errorBudgetRemainingPct: 62, p99LatencyMs: 235, errorRatePct: 0.07, cpuSaturationPct: 54, requestRateRps: 1210 },
  },
  "payments-svc": {
    "1h": { uptimePct: 99.62, errorBudgetRemainingPct: 12, p99LatencyMs: 455, errorRatePct: 0.42, cpuSaturationPct: 82, requestRateRps: 845 },
    "24h": { uptimePct: 99.7, errorBudgetRemainingPct: 15, p99LatencyMs: 430, errorRatePct: 0.38, cpuSaturationPct: 80, requestRateRps: 852 },
    "7d": { uptimePct: 99.85, errorBudgetRemainingPct: 17, p99LatencyMs: 418, errorRatePct: 0.34, cpuSaturationPct: 79, requestRateRps: 858 },
    "30d": { uptimePct: 99.91, errorBudgetRemainingPct: 18, p99LatencyMs: 410, errorRatePct: 0.31, cpuSaturationPct: 78, requestRateRps: 860 },
  },
  "auth-gateway": {
    "1h": { uptimePct: 99.996, errorBudgetRemainingPct: 90, p99LatencyMs: 92, errorRatePct: 0.015, cpuSaturationPct: 30, requestRateRps: 2140 },
    "24h": { uptimePct: 99.995, errorBudgetRemainingPct: 89, p99LatencyMs: 94, errorRatePct: 0.018, cpuSaturationPct: 31, requestRateRps: 2115 },
    "7d": { uptimePct: 99.995, errorBudgetRemainingPct: 88, p99LatencyMs: 95, errorRatePct: 0.02, cpuSaturationPct: 32, requestRateRps: 2105 },
    "30d": { uptimePct: 99.995, errorBudgetRemainingPct: 88, p99LatencyMs: 95, errorRatePct: 0.02, cpuSaturationPct: 32, requestRateRps: 2100 },
  },
  "search-api": {
    "1h": { uptimePct: 99.8, errorBudgetRemainingPct: 38, p99LatencyMs: 640, errorRatePct: 0.58, cpuSaturationPct: 93, requestRateRps: 415 },
    "24h": { uptimePct: 99.83, errorBudgetRemainingPct: 40, p99LatencyMs: 625, errorRatePct: 0.56, cpuSaturationPct: 92, requestRateRps: 422 },
    "7d": { uptimePct: 99.85, errorBudgetRemainingPct: 41, p99LatencyMs: 615, errorRatePct: 0.55, cpuSaturationPct: 91, requestRateRps: 428 },
    "30d": { uptimePct: 99.87, errorBudgetRemainingPct: 41, p99LatencyMs: 610, errorRatePct: 0.55, cpuSaturationPct: 91, requestRateRps: 430 },
  },
};

/** "All services" 합성 스냅샷 — rps 가중 평균(uptime/오류율/p99), 단순 평균(budget/cpu), rps는 합산. 하드코딩 없이 4개 서비스 원본에서 파생. */
export function aggregateMetrics(period: PeriodId): MetricSnapshot {
  const rows = SERVICES.map((s) => METRICS[s.id][period]);
  const totalRps = rows.reduce((a, r) => a + r.requestRateRps, 0);
  const weighted = (pick: (r: MetricSnapshot) => number) => round2(rows.reduce((a, r) => a + pick(r) * r.requestRateRps, 0) / totalRps);
  const plain = (pick: (r: MetricSnapshot) => number) => round2(rows.reduce((a, r) => a + pick(r), 0) / rows.length);
  return {
    uptimePct: weighted((r) => r.uptimePct),
    errorBudgetRemainingPct: plain((r) => r.errorBudgetRemainingPct),
    p99LatencyMs: Math.round(weighted((r) => r.p99LatencyMs)),
    errorRatePct: weighted((r) => r.errorRatePct),
    cpuSaturationPct: plain((r) => r.cpuSaturationPct),
    requestRateRps: totalRps,
  };
}

export function metricsFor(scope: ServiceId | "all", period: PeriodId): MetricSnapshot {
  return scope === "all" ? aggregateMetrics(period) : METRICS[scope][period];
}

export function sloTargetFor(scope: ServiceId | "all"): number {
  if (scope === "all") return round2(SERVICES.reduce((a, s) => a + s.sloTargetPct, 0) / SERVICES.length);
  return SERVICES.find((s) => s.id === scope)!.sloTargetPct;
}

/** 서비스별 12틱 오류예산 소진 추이(핸드시드, 결정론 파형) — 디테일 패널 스파크라인용. */
const BURN_SEED: Record<ServiceId, number> = { "checkout-api": 14, "payments-svc": 41, "auth-gateway": 7, "search-api": 29 };
export function burnTrend(service: ServiceId): number[] {
  const base = METRICS[service]["30d"].errorBudgetRemainingPct;
  return genWave(BURN_SEED[service], base, 14);
}

/* ---------------------------------------------------------------------- */
/* 인시던트 / 얼럿                                                          */
/* ---------------------------------------------------------------------- */

export type Severity = 1 | 2 | 3 | 4;
export type IncidentStatus = "investigating" | "monitoring" | "resolved";

export type Incident = {
  id: string;
  orderRank: number; // 클수록 최근(고정 서열, Date 파싱 불필요)
  severity: Severity;
  title: string;
  service: ServiceId;
  startedLabel: string; // whitespace-nowrap 표시용
  durationMinutes: number | null; // null = 진행 중
  durationLabel: string;
  status: IncidentStatus;
  summary: string;
  rootCause: string;
};

export const INCIDENTS: Incident[] = [
  {
    id: "INC-482",
    orderRank: 9,
    severity: 1,
    title: "Checkout API 5xx spike after deploy",
    service: "checkout-api",
    startedLabel: "Jul 21, 09:14",
    durationMinutes: 42,
    durationLabel: "42m",
    status: "resolved",
    summary: "Error rate jumped to 4.8% within 3 minutes of the v482 rollout, tripping the SLO burn-rate alert.",
    rootCause: "Bad config pushed in the v482 rollout dropped a required feature flag default; rolled back at 09:56.",
  },
  {
    id: "INC-481",
    orderRank: 8,
    severity: 2,
    title: "Payments latency creeping above p99 target",
    service: "payments-svc",
    startedLabel: "Jul 20, 22:40",
    durationMinutes: 185,
    durationLabel: "3h 05m",
    status: "monitoring",
    summary: "p99 latency has been sustained above the 400ms target following an upstream card-network slowdown.",
    rootCause: "Upstream payment processor degraded; regional failover partially mitigated, still above target.",
  },
  {
    id: "INC-480",
    orderRank: 7,
    severity: 3,
    title: "Search API cache hit rate drop",
    service: "search-api",
    startedLabel: "Jul 20, 16:02",
    durationMinutes: 78,
    durationLabel: "1h 18m",
    status: "resolved",
    summary: "Edge cache hit rate fell from 91% to 64%, pushing more traffic to the origin index.",
    rootCause: "Cache node restart during a routine patch cleared warm entries; refilled naturally within the hour.",
  },
  {
    id: "INC-479",
    orderRank: 6,
    severity: 1,
    title: "Payments error budget exhausted for the week",
    service: "payments-svc",
    startedLabel: "Jul 19, 11:20",
    durationMinutes: null,
    durationLabel: "Ongoing",
    status: "investigating",
    summary: "Weekly error budget crossed zero; new feature releases for payments-svc are frozen pending review.",
    rootCause: "Root cause under investigation — correlated with the upstream processor incident and elevated card declines.",
  },
  {
    id: "INC-478",
    orderRank: 5,
    severity: 4,
    title: "Auth gateway minor cert renewal blip",
    service: "auth-gateway",
    startedLabel: "Jul 19, 03:11",
    durationMinutes: 6,
    durationLabel: "6m",
    status: "resolved",
    summary: "A handful of token validation calls failed during a scheduled TLS certificate rotation.",
    rootCause: "Rotation script briefly served the old cert to two pods before the reload completed.",
  },
  {
    id: "INC-477",
    orderRank: 4,
    severity: 2,
    title: "Checkout API elevated 429 rate",
    service: "checkout-api",
    startedLabel: "Jul 18, 19:47",
    durationMinutes: 51,
    durationLabel: "51m",
    status: "resolved",
    summary: "Rate limiter tightened unexpectedly for a subset of enterprise API keys during a traffic surge.",
    rootCause: "Autoscaling lagged behind a promotional-traffic burst; limiter thresholds relaxed manually.",
  },
  {
    id: "INC-476",
    orderRank: 3,
    severity: 3,
    title: "Search API p99 above warn threshold",
    service: "search-api",
    startedLabel: "Jul 17, 14:33",
    durationMinutes: 160,
    durationLabel: "2h 40m",
    status: "resolved",
    summary: "Query fan-out to a re-indexing shard added consistent latency to the 95th–99th percentile.",
    rootCause: "Re-index job was scheduled during peak hours; runbook updated to shift the window.",
  },
  {
    id: "INC-475",
    orderRank: 2,
    severity: 2,
    title: "Payments CPU saturation alert",
    service: "payments-svc",
    startedLabel: "Jul 16, 08:05",
    durationMinutes: 62,
    durationLabel: "1h 02m",
    status: "resolved",
    summary: "Reconciliation batch job overlapped with peak traffic, pushing CPU saturation past 90%.",
    rootCause: "Batch scheduler lacked a peak-hour exclusion window; added following this incident.",
  },
  {
    id: "INC-474",
    orderRank: 1,
    severity: 4,
    title: "Checkout API canary rollback",
    service: "checkout-api",
    startedLabel: "Jul 15, 21:18",
    durationMinutes: 15,
    durationLabel: "15m",
    status: "resolved",
    summary: "Canary cohort showed a minor conversion dip; rolled back automatically before full rollout.",
    rootCause: "New pricing-widget variant regressed load time on low-end mobile devices in the canary slice.",
  },
];

export const SEVERITY_META: Record<Severity, { label: string; tone: "bad" | "warn" | "info" | "neutral" }> = {
  1: { label: "SEV1", tone: "bad" },
  2: { label: "SEV2", tone: "warn" },
  3: { label: "SEV3", tone: "info" },
  4: { label: "SEV4", tone: "neutral" },
};

export const STATUS_META: Record<IncidentStatus, { label: string; tone: "bad" | "warn" | "good" }> = {
  investigating: { label: "Investigating", tone: "bad" },
  monitoring: { label: "Monitoring", tone: "warn" },
  resolved: { label: "Resolved", tone: "good" },
};

export function serviceLabel(id: ServiceId): string {
  return SERVICES.find((s) => s.id === id)?.label ?? id;
}

/* ---------------------------------------------------------------------- */
/* Intl 포맷터                                                              */
/* ---------------------------------------------------------------------- */

const NUM0 = new Intl.NumberFormat("en-US");
const PCT1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const PCT2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const PCT3 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function formatCount(v: number): string {
  return NUM0.format(v);
}
export function formatUptimePct(v: number): string {
  return `${v >= 99.99 ? PCT3.format(v) : PCT2.format(v)}%`;
}
export function formatPct1(v: number): string {
  return `${PCT1.format(v)}%`;
}
export function formatErrRate(v: number): string {
  return `${PCT2.format(v)}%`;
}
export function formatMs(v: number): string {
  return `${NUM0.format(v)}ms`;
}
export function formatRps(v: number): string {
  return `${NUM0.format(v)} rps`;
}
