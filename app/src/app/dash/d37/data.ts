import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Handshake,
  Layers,
  LayoutGrid,
  LineChart,
  Mail,
  Plug,
  Search,
  Settings,
  Share2,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Waves,
  Workflow,
  Zap,
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

/** 정수 가중치 분배(최대 나머지법) — 반올림 후에도 합계가 total과 정확히 일치(부분합=총합 보장). */
export function distributeInts(total: number, weightsPct: number[]): number[] {
  const raw = weightsPct.map((w) => (total * w) / 100);
  const floors = raw.map((v) => Math.floor(v));
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    out[order[k].i] += 1;
  }
  return out;
}

/* ---------------------------------------------------------------------- */
/* 브랜드 / 워크스페이스 / 사용자 (전부 가상 — 세션 컨텍스트와 무관한 발명 인물)        */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Currents", tagline: "Revenue Attribution Flow" };
export { Waves as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "solstice", name: "Solstice Robotics", plan: "Scale · Revenue Ops" },
  { id: "anchorpoint", name: "Anchorpoint Labs", plan: "Growth · Revenue Ops" },
  { id: "sandbox", name: "QA Sandbox", plan: "Internal test" },
];

/** 가상 인물(세션 컨텍스트 아님) — Currents를 쓰는 레브옵스 리드. */
export const CURRENT_USER = {
  name: "Dana Whitfield",
  role: "Revenue Operations Lead",
  email: "dana.whitfield@currentshq.io",
  avatarId: "1494790108377-be9c29b29330",
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
      { id: "flow", label: "Revenue Flow", Icon: Workflow, active: true },
      { id: "cohorts", label: "Cohorts", Icon: Users },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "channel-mix", label: "Channel Mix", Icon: BarChart3 },
      { id: "waterfall", label: "Retention Waterfall", Icon: LineChart, badge: "New" },
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
/* 기간                                                                     */
/* ---------------------------------------------------------------------- */

export type PeriodId = "7d" | "30d" | "90d";
export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
];

/** 기간별 신규 유료 계정 총합(핸드작성, 결정론). 다른 모든 수치는 여기서 비례 분배된다. */
export const TOTAL_ACCOUNTS: Record<PeriodId, number> = {
  "7d": 540,
  "30d": 2380,
  "90d": 6960,
};

export type MetricId = "customers" | "mrr";
export const METRICS: { id: MetricId; label: string }[] = [
  { id: "customers", label: "Customers" },
  { id: "mrr", label: "New MRR" },
];

/* ---------------------------------------------------------------------- */
/* 1단: 획득 채널 (5) — 가중치 합 100                                          */
/* ---------------------------------------------------------------------- */

export type ChannelId = "organic" | "paid_search" | "paid_social" | "partner" | "direct";

export type ChannelMeta = { id: ChannelId; label: string; Icon: LucideIcon; weightPct: number };

export const CHANNELS: ChannelMeta[] = [
  { id: "organic", label: "Organic Search", Icon: Search, weightPct: 28 },
  { id: "paid_search", label: "Paid Search", Icon: Target, weightPct: 21 },
  { id: "paid_social", label: "Paid Social", Icon: Share2, weightPct: 19 },
  { id: "partner", label: "Partner Referral", Icon: Handshake, weightPct: 17 },
  { id: "direct", label: "Direct / Email", Icon: Mail, weightPct: 15 },
];

/* ---------------------------------------------------------------------- */
/* 2단: 가입 시점 플랜 티어 (4) — ARPU 고정, 채널별 분배 가중치 행(각 행 합 100)      */
/* ---------------------------------------------------------------------- */

export type TierId = "starter" | "growth" | "scale" | "enterprise";

export type TierMeta = { id: TierId; label: string; Icon: LucideIcon; arpu: number };

export const TIERS: TierMeta[] = [
  { id: "starter", label: "Starter", Icon: Zap, arpu: 49 },
  { id: "growth", label: "Growth", Icon: TrendingUp, arpu: 199 },
  { id: "scale", label: "Scale", Icon: Layers, arpu: 499 },
  { id: "enterprise", label: "Enterprise", Icon: Building2, arpu: 1499 },
];

/** 행 = 채널(CHANNELS 순서), 열 = 티어(TIERS 순서). 각 행 합 100. */
const CHANNEL_TO_TIER_WEIGHTS: number[][] = [
  [45, 35, 15, 5], // organic — self-serve, skews low tier
  [30, 40, 22, 8], // paid_search
  [55, 30, 12, 3], // paid_social — cheapest CAC, skews starter
  [10, 25, 35, 30], // partner — enterprise deal desk
  [25, 35, 28, 12], // direct / email
];

/* ---------------------------------------------------------------------- */
/* 3단: 90일 결과 (4) — 티어별 분배 가중치 행(각 행 합 100)                        */
/* ---------------------------------------------------------------------- */

export type OutcomeId = "retained" | "expanded" | "downgraded" | "churned";

export type OutcomeMeta = { id: OutcomeId; label: string; Icon: LucideIcon };

export const OUTCOMES: OutcomeMeta[] = [
  { id: "retained", label: "Retained", Icon: CheckCircle2 },
  { id: "expanded", label: "Expanded", Icon: TrendingUp },
  { id: "downgraded", label: "Downgraded", Icon: TrendingDown },
  { id: "churned", label: "Churned", Icon: TrendingDown },
];

/** 행 = 티어(TIERS 순서), 열 = 결과(OUTCOMES 순서). 각 행 합 100. */
const TIER_TO_OUTCOME_WEIGHTS: number[][] = [
  [48, 8, 10, 34], // starter — high self-serve churn
  [58, 18, 9, 15], // growth
  [60, 26, 6, 8], // scale
  [55, 34, 4, 7], // enterprise — highest expansion
];

/* ---------------------------------------------------------------------- */
/* 흐름 계산 — 부분합=총합 보장(distributeInts로 행 단위 정수 분배)                */
/* ---------------------------------------------------------------------- */

export type FlowNode = {
  id: string;
  label: string;
  Icon: LucideIcon;
  col: 0 | 1 | 2;
  customers: number;
  mrr: number;
};

export type FlowLink = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceLabel: string;
  targetLabel: string;
  col: 0 | 1; // 0 = channel→tier, 1 = tier→outcome
  customers: number;
  mrr: number;
  shareOfSourcePct: number;
};

export type FlowGraph = {
  channels: FlowNode[];
  tiers: FlowNode[];
  outcomes: FlowNode[];
  linksChannelTier: FlowLink[];
  linksTierOutcome: FlowLink[];
  totalCustomers: number;
  totalMrr: number;
};

export function computeFlow(period: PeriodId): FlowGraph {
  const totalAccounts = TOTAL_ACCOUNTS[period];
  const channelWeights = CHANNELS.map((c) => c.weightPct);
  const channelCounts = distributeInts(totalAccounts, channelWeights);

  // channel x tier matrix
  const m1: number[][] = channelCounts.map((count, ci) => distributeInts(count, CHANNEL_TO_TIER_WEIGHTS[ci]));

  const tierTotals = TIERS.map((_, ti) => m1.reduce((sum, row) => sum + row[ti], 0));

  // tier x outcome matrix
  const m2: number[][] = tierTotals.map((count, ti) => distributeInts(count, TIER_TO_OUTCOME_WEIGHTS[ti]));

  const outcomeTotals = OUTCOMES.map((_, oi) => m2.reduce((sum, row) => sum + row[oi], 0));

  const channels: FlowNode[] = CHANNELS.map((c, ci) => {
    const mrr = TIERS.reduce((sum, t, ti) => sum + m1[ci][ti] * t.arpu, 0);
    return { id: c.id, label: c.label, Icon: c.Icon, col: 0, customers: channelCounts[ci], mrr };
  });

  const tiers: FlowNode[] = TIERS.map((t, ti) => ({
    id: t.id,
    label: t.label,
    Icon: t.Icon,
    col: 1,
    customers: tierTotals[ti],
    mrr: tierTotals[ti] * t.arpu,
  }));

  const outcomes: FlowNode[] = OUTCOMES.map((o, oi) => {
    const mrr = TIERS.reduce((sum, t, ti) => sum + m2[ti][oi] * t.arpu, 0);
    return { id: o.id, label: o.label, Icon: o.Icon, col: 2, customers: outcomeTotals[oi], mrr };
  });

  const linksChannelTier: FlowLink[] = [];
  CHANNELS.forEach((c, ci) => {
    TIERS.forEach((t, ti) => {
      const customers = m1[ci][ti];
      if (customers <= 0) return;
      linksChannelTier.push({
        id: `${c.id}__${t.id}`,
        sourceId: c.id,
        targetId: t.id,
        sourceLabel: c.label,
        targetLabel: t.label,
        col: 0,
        customers,
        mrr: customers * t.arpu,
        shareOfSourcePct: round2((customers / channelCounts[ci]) * 100),
      });
    });
  });

  const linksTierOutcome: FlowLink[] = [];
  TIERS.forEach((t, ti) => {
    OUTCOMES.forEach((o, oi) => {
      const customers = m2[ti][oi];
      if (customers <= 0) return;
      linksTierOutcome.push({
        id: `${t.id}__${o.id}`,
        sourceId: t.id,
        targetId: o.id,
        sourceLabel: t.label,
        targetLabel: o.label,
        col: 1,
        customers,
        mrr: customers * t.arpu,
        shareOfSourcePct: round2((customers / tierTotals[ti]) * 100),
      });
    });
  });

  const totalCustomers = totalAccounts;
  const totalMrr = channels.reduce((sum, n) => sum + n.mrr, 0);

  return { channels, tiers, outcomes, linksChannelTier, linksTierOutcome, totalCustomers, totalMrr };
}

export function metricValue(node: { customers: number; mrr: number }, metric: MetricId): number {
  return metric === "customers" ? node.customers : node.mrr;
}

/* ---------------------------------------------------------------------- */
/* 12주 신규 MRR 추세 — 선택 노드 상세용 결정론 시리즈(삼각함수 미사용, 모듈로 산술)   */
/* ---------------------------------------------------------------------- */

function genSeries(seed: number, base: number, amp: number, n = 12): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const wobble = ((seed + i * 17) % 13) - 6; // -6..6
    const drift = (i - (n - 1) / 2) * (amp / n);
    out.push(round2(clamp(base + wobble * (amp / 12) + drift, 0, base * 2.4)));
  }
  return out;
}

const SEED_TABLE: Record<string, number> = {};
let seedCursor = 5;
function seedFor(id: string): number {
  if (!(id in SEED_TABLE)) {
    seedCursor += 17;
    SEED_TABLE[id] = seedCursor;
  }
  return SEED_TABLE[id];
}

export function nodeTrend(nodeId: string, baseValue: number): { label: string; value: number }[] {
  const seed = seedFor(nodeId);
  const amp = Math.max(baseValue * 0.18, 2);
  const vals = genSeries(seed, baseValue, amp);
  return vals.map((v, i) => ({ label: `W${i + 1}`, value: v }));
}

/* ---------------------------------------------------------------------- */
/* Intl 포맷터                                                              */
/* ---------------------------------------------------------------------- */

const NUM0 = new Intl.NumberFormat("en-US");
const PCT1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const USD0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function formatCount(v: number): string {
  return NUM0.format(v);
}
export function formatPct(v: number): string {
  return `${PCT1.format(v)}%`;
}
export function formatUsd(v: number): string {
  return USD0.format(v);
}
export function formatMetric(v: number, metric: MetricId): string {
  return metric === "customers" ? `${formatCount(v)} accts` : formatUsd(v);
}

/* 개발 시점 자기 점검: 채널/티어 분배 가중치 행이 전부 100으로 합산되는지(부분합=총합 보장의 전제). */
export const _WEIGHTS_OK =
  CHANNELS.reduce((a, c) => a + c.weightPct, 0) === 100 &&
  CHANNEL_TO_TIER_WEIGHTS.every((row) => row.reduce((a, b) => a + b, 0) === 100) &&
  TIER_TO_OUTCOME_WEIGHTS.every((row) => row.reduce((a, b) => a + b, 0) === 100);
