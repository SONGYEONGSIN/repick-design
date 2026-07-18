import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  Boxes,
  Download,
  KeyRound,
  LayoutDashboard,
  Plug,
  Settings,
  ShieldCheck,
  UploadCloud,
  Users,
  Waypoints,
  Wand2,
  Workflow,
} from "lucide-react";
import { round2 } from "./math";

/* ---------------------------------------------------------------------- */
/* 브랜드 / 환경 / 사용자                                                     */
/* ---------------------------------------------------------------------- */

export const BRAND = {
  name: "Millrace",
  tagline: "Pipeline Orchestration",
};

export type Env = { id: string; name: string; plan: string };

export const ENVIRONMENTS: Env[] = [
  { id: "prod", name: "Production", plan: "us-east-1" },
  { id: "staging", name: "Staging", plan: "us-east-1" },
  { id: "dev", name: "Dev sandbox", plan: "local" },
];

/** 가상 인물(세션 컨텍스트 아님) — Millrace 데이터 플랫폼팀. */
export const CURRENT_USER = {
  name: "Priya Desai",
  role: "Data Platform Lead",
  avatarId: "1580489944761-15a19d654956",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* 내비게이션                                                                */
/* ---------------------------------------------------------------------- */

export type NavItem = {
  id: string;
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
};

export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "워크스페이스",
    items: [
      { id: "overview", label: "개요", Icon: LayoutDashboard },
      { id: "pipelines", label: "파이프라인", Icon: Workflow, active: true },
      { id: "assets", label: "데이터 자산", Icon: Boxes },
    ],
  },
  {
    id: "ops",
    title: "운영",
    items: [
      { id: "alerts", label: "알림 규칙", Icon: BellRing, badge: "2" },
      { id: "connections", label: "커넥션", Icon: Plug },
      { id: "secrets", label: "시크릿", Icon: KeyRound, disabled: true },
    ],
  },
  {
    id: "admin",
    title: "관리",
    items: [
      { id: "members", label: "멤버", Icon: Users, disabled: true },
      { id: "settings", label: "설정", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* DAG — nightly_orders_pipeline 태스크 그래프                                */
/* ---------------------------------------------------------------------- */

export type TaskType = "extract" | "transform" | "validate" | "load" | "notify";
export type TaskStatus = "success" | "running" | "failed" | "pending";

export const TASK_TYPE_ICON: Record<TaskType, LucideIcon> = {
  extract: Download,
  transform: Wand2,
  validate: ShieldCheck,
  load: UploadCloud,
  notify: BellRing,
};

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  extract: "Extract",
  transform: "Transform",
  validate: "Validate",
  load: "Load",
  notify: "Notify",
};

/** 그래프 좌표계(SVG viewBox 단위) — 열(스테이지) x 레인(병렬 분기), 손으로 배치한 고정값. */
export const GRAPH_VB = { w: 860, h: 340 };
const COL_MARGIN = 64;
const COL_GAP = (GRAPH_VB.w - COL_MARGIN * 2) / 6;
const LANE_TOP = 64;
const LANE_GAP = 106;

function colX(col: number): number {
  return round2(COL_MARGIN + col * COL_GAP);
}
function laneY(lane: number): number {
  return round2(LANE_TOP + lane * LANE_GAP);
}

export type Task = {
  id: string;
  label: string;
  type: TaskType;
  col: number;
  lane: number;
  status: TaskStatus;
  durationSec: number;
  retries: number;
  startedAt: string;
  finishedAt: string | null;
  upstream: string[];
  owner: string;
  note: string;
  log: string[];
};

export const TASKS: Task[] = [
  {
    id: "extract_orders",
    label: "extract_orders",
    type: "extract",
    col: 0,
    lane: 0,
    status: "success",
    durationSec: 18,
    retries: 0,
    startedAt: "03:10:00",
    finishedAt: "03:10:18",
    upstream: [],
    owner: "checkout-svc",
    note: "주문 원장 테이블에서 지난 24시간 증분을 읽어온다.",
    log: [
      "[03:10:00] INFO  task started (pool: extract, slots: 2)",
      "[03:10:04] INFO  connected to orders-primary (checkout-svc)",
      "[03:10:17] INFO  rows fetched: 48,213",
      "[03:10:18] INFO  task succeeded in 18s",
    ],
  },
  {
    id: "extract_customers",
    label: "extract_customers",
    type: "extract",
    col: 0,
    lane: 1,
    status: "success",
    durationSec: 22,
    retries: 0,
    startedAt: "03:10:00",
    finishedAt: "03:10:22",
    upstream: [],
    owner: "identity-svc",
    note: "고객 마스터 스냅샷과 지난 24시간 변경 로그를 읽어온다.",
    log: [
      "[03:10:00] INFO  task started (pool: extract, slots: 2)",
      "[03:10:06] INFO  connected to identity-primary (identity-svc)",
      "[03:10:21] INFO  rows fetched: 12,047",
      "[03:10:22] INFO  task succeeded in 22s",
    ],
  },
  {
    id: "extract_inventory",
    label: "extract_inventory",
    type: "extract",
    col: 0,
    lane: 2,
    status: "success",
    durationSec: 15,
    retries: 0,
    startedAt: "03:10:00",
    finishedAt: "03:10:15",
    upstream: [],
    owner: "warehouse-svc",
    note: "물류 창고 재고 스냅샷(SKU 단위)을 읽어온다.",
    log: [
      "[03:10:00] INFO  task started (pool: extract, slots: 2)",
      "[03:10:03] INFO  connected to inventory-primary (warehouse-svc)",
      "[03:10:14] INFO  rows fetched: 9,842",
      "[03:10:15] INFO  task succeeded in 15s",
    ],
  },
  {
    id: "transform_orders",
    label: "transform_orders",
    type: "transform",
    col: 1,
    lane: 0,
    status: "success",
    durationSec: 41,
    retries: 0,
    startedAt: "03:10:18",
    finishedAt: "03:10:59",
    upstream: ["extract_orders"],
    owner: "dbt: orders_stg",
    note: "통화 정규화, 환불 조인, 취소 주문 제외.",
    log: [
      "[03:10:18] INFO  task started (pool: transform, slots: 4)",
      "[03:10:22] INFO  normalizing currency (7 currencies)",
      "[03:10:51] INFO  excluded 1,204 cancelled orders",
      "[03:10:59] INFO  task succeeded in 41s",
    ],
  },
  {
    id: "dedupe_customers",
    label: "dedupe_customers",
    type: "transform",
    col: 1,
    lane: 1,
    status: "success",
    durationSec: 12,
    retries: 1,
    startedAt: "03:10:22",
    finishedAt: "03:10:35",
    upstream: ["extract_customers"],
    owner: "dbt: customers_stg",
    note: "이메일/전화 정규화 후 동일 고객 병합.",
    log: [
      "[03:10:22] INFO  task started (pool: transform, slots: 4)",
      "[03:10:24] WARN  lock timeout on customers_stg, retrying (1/3)",
      "[03:10:26] INFO  task restarted",
      "[03:10:34] INFO  merged 318 duplicate identities",
      "[03:10:35] INFO  task succeeded in 12s (1 retry)",
    ],
  },
  {
    id: "enrich_inventory",
    label: "enrich_inventory",
    type: "transform",
    col: 1,
    lane: 2,
    status: "success",
    durationSec: 9,
    retries: 0,
    startedAt: "03:10:15",
    finishedAt: "03:10:24",
    upstream: ["extract_inventory"],
    owner: "dbt: inventory_stg",
    note: "SKU에 카테고리·창고 리전 태그를 조인.",
    log: [
      "[03:10:15] INFO  task started (pool: transform, slots: 4)",
      "[03:10:20] INFO  joined category taxonomy (v14)",
      "[03:10:24] INFO  task succeeded in 9s",
    ],
  },
  {
    id: "join_orders_customers",
    label: "join_orders_customers",
    type: "transform",
    col: 2,
    lane: 0,
    status: "running",
    durationSec: 27,
    retries: 0,
    startedAt: "03:10:59",
    finishedAt: null,
    upstream: ["transform_orders", "dedupe_customers"],
    owner: "dbt: orders_wide",
    note: "정제된 주문과 고객을 고객 ID 기준으로 결합.",
    log: [
      "[03:10:59] INFO  task started (pool: transform, slots: 4)",
      "[03:11:12] INFO  streaming batch 2 / 5",
      "[03:11:26] INFO  streaming batch 3 / 5",
      "[03:11:26] INFO  still running…",
    ],
  },
  {
    id: "validate_inventory_counts",
    label: "validate_inventory_counts",
    type: "validate",
    col: 2,
    lane: 2,
    status: "success",
    durationSec: 6,
    retries: 0,
    startedAt: "03:10:24",
    finishedAt: "03:10:30",
    upstream: ["enrich_inventory"],
    owner: "great_expectations",
    note: "재고 수량 음수·SKU 중복 여부 검증.",
    log: [
      "[03:10:24] INFO  task started (pool: validate, slots: 3)",
      "[03:10:29] INFO  9,842 rows checked, 0 violations",
      "[03:10:30] INFO  task succeeded in 6s",
    ],
  },
  {
    id: "validate_schema",
    label: "validate_schema",
    type: "validate",
    col: 3,
    lane: 0,
    status: "pending",
    durationSec: 0,
    retries: 0,
    startedAt: "",
    finishedAt: null,
    upstream: ["join_orders_customers"],
    owner: "great_expectations",
    note: "결합 결과 스키마와 필수 컬럼 not-null 검증.",
    log: ["대기 중 — 업스트림(join_orders_customers) 완료 후 실행됩니다."],
  },
  {
    id: "archive_raw_inventory",
    label: "archive_raw_inventory",
    type: "load",
    col: 3,
    lane: 2,
    status: "failed",
    durationSec: 4,
    retries: 2,
    startedAt: "03:10:30",
    finishedAt: "03:10:34",
    upstream: ["validate_inventory_counts"],
    owner: "s3: raw-archive",
    note: "원본 재고 스냅샷을 콜드 스토리지에 백업(메인 라인과 독립된 분기).",
    log: [
      "[03:10:30] INFO  task started (pool: load, slots: 2)",
      "[03:10:32] ERROR schema mismatch: column `snapshot_id` missing",
      "[03:10:33] ERROR task failed (attempt 2/3) — retrying",
      "[03:10:34] ERROR max retries exceeded (2), task marked failed",
    ],
  },
  {
    id: "load_warehouse",
    label: "load_warehouse",
    type: "load",
    col: 4,
    lane: 0,
    status: "pending",
    durationSec: 0,
    retries: 0,
    startedAt: "",
    finishedAt: null,
    upstream: ["validate_schema"],
    owner: "snowflake: analytics_wh",
    note: "검증된 광폭 테이블을 웨어하우스에 upsert.",
    log: ["대기 중 — 업스트림(validate_schema) 완료 후 실행됩니다."],
  },
  {
    id: "load_analytics_mart",
    label: "load_analytics_mart",
    type: "load",
    col: 5,
    lane: 0,
    status: "pending",
    durationSec: 0,
    retries: 0,
    startedAt: "",
    finishedAt: null,
    upstream: ["load_warehouse"],
    owner: "snowflake: orders_mart",
    note: "매출/주문 지표용 집계 마트 리프레시.",
    log: ["대기 중 — 업스트림(load_warehouse) 완료 후 실행됩니다."],
  },
  {
    id: "notify_slack",
    label: "notify_slack",
    type: "notify",
    col: 6,
    lane: 0,
    status: "pending",
    durationSec: 0,
    retries: 0,
    startedAt: "",
    finishedAt: null,
    upstream: ["load_analytics_mart"],
    owner: "#data-pipelines",
    note: "완료 요약(행 수·소요 시간)을 Slack 채널에 게시.",
    log: ["대기 중 — 업스트림(load_analytics_mart) 완료 후 실행됩니다."],
  },
  {
    id: "notify_pagerduty",
    label: "notify_pagerduty",
    type: "notify",
    col: 6,
    lane: 1,
    status: "pending",
    durationSec: 0,
    retries: 0,
    startedAt: "",
    finishedAt: null,
    upstream: ["load_analytics_mart"],
    owner: "pagerduty: data-oncall",
    note: "실패 태스크가 있을 경우에만 온콜에 에스컬레이션.",
    log: ["대기 중 — 업스트림(load_analytics_mart) 완료 후 실행됩니다."],
  },
];

export type TaskPos = { x: number; y: number };
export function taskPos(task: Task): TaskPos {
  return { x: colX(task.col), y: laneY(task.lane) };
}

export function taskById(id: string): Task | undefined {
  return TASKS.find((t) => t.id === id);
}

/** 다운스트림(자식) 태스크 id 목록 — upstream 배열을 역인덱싱해 도출(수기 이중관리 방지). */
export function downstreamOf(id: string): string[] {
  return TASKS.filter((t) => t.upstream.includes(id)).map((t) => t.id);
}

export type Edge = { from: string; to: string };
export const EDGES: Edge[] = TASKS.flatMap((t) => t.upstream.map((u) => ({ from: u, to: t.id })));

/* ---------------------------------------------------------------------- */
/* 런 히스토리 — nightly_orders_pipeline 과거 실행 이력                        */
/* ---------------------------------------------------------------------- */

export type Trigger = "schedule" | "manual" | "api";
export type RunStatus = "success" | "failed" | "running";

export type Run = {
  id: string;
  dateLabel: string;
  timeLabel: string;
  daysAgo: number;
  trigger: Trigger;
  durationSec: number;
  status: RunStatus;
  succeeded: number;
  failed: number;
  skipped: number;
};

const TOTAL_TASKS = TASKS.length; // 14

export const RUN_HISTORY: Run[] = [
  { id: "r-2118", dateLabel: "07/18", timeLabel: "03:10", daysAgo: 0, trigger: "schedule", durationSec: 146, status: "running", succeeded: 7, failed: 1, skipped: 0 },
  { id: "r-2117", dateLabel: "07/17", timeLabel: "03:10", daysAgo: 1, trigger: "schedule", durationSec: 372, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2116", dateLabel: "07/16", timeLabel: "03:10", daysAgo: 2, trigger: "schedule", durationSec: 298, status: "failed", succeeded: 11, failed: 1, skipped: 2 },
  { id: "r-2115", dateLabel: "07/15", timeLabel: "14:32", daysAgo: 3, trigger: "manual", durationSec: 361, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2114", dateLabel: "07/14", timeLabel: "03:10", daysAgo: 4, trigger: "schedule", durationSec: 355, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2113", dateLabel: "07/13", timeLabel: "03:10", daysAgo: 5, trigger: "schedule", durationSec: 349, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2112", dateLabel: "07/12", timeLabel: "03:10", daysAgo: 6, trigger: "schedule", durationSec: 311, status: "failed", succeeded: 10, failed: 1, skipped: 3 },
  { id: "r-2111", dateLabel: "07/11", timeLabel: "09:05", daysAgo: 7, trigger: "api", durationSec: 340, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2108", dateLabel: "07/08", timeLabel: "03:10", daysAgo: 10, trigger: "schedule", durationSec: 366, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2105", dateLabel: "07/05", timeLabel: "03:10", daysAgo: 13, trigger: "schedule", durationSec: 289, status: "failed", succeeded: 8, failed: 2, skipped: 4 },
  { id: "r-2101", dateLabel: "07/01", timeLabel: "03:10", daysAgo: 17, trigger: "schedule", durationSec: 358, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2095", dateLabel: "06/25", timeLabel: "03:10", daysAgo: 23, trigger: "schedule", durationSec: 344, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2088", dateLabel: "06/18", timeLabel: "03:10", daysAgo: 30, trigger: "schedule", durationSec: 351, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2080", dateLabel: "06/10", timeLabel: "03:10", daysAgo: 38, trigger: "schedule", durationSec: 363, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2071", dateLabel: "06/01", timeLabel: "03:10", daysAgo: 47, trigger: "schedule", durationSec: 305, status: "failed", succeeded: 12, failed: 1, skipped: 1 },
  { id: "r-2059", dateLabel: "05/20", timeLabel: "16:48", daysAgo: 59, trigger: "manual", durationSec: 339, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2044", dateLabel: "05/05", timeLabel: "03:10", daysAgo: 74, trigger: "schedule", durationSec: 347, status: "success", succeeded: 14, failed: 0, skipped: 0 },
  { id: "r-2029", dateLabel: "04/20", timeLabel: "03:10", daysAgo: 89, trigger: "schedule", durationSec: 359, status: "success", succeeded: 14, failed: 0, skipped: 0 },
];

// 자기 점검(개발 시점): 완료된 런은 succeeded+failed+skipped가 태스크 총수(14)와 항상 일치해야 한다(부분합=총합).
export const _RUN_TOTALS_OK = RUN_HISTORY.every(
  (r) => r.status === "running" || r.succeeded + r.failed + r.skipped === TOTAL_TASKS,
);

export type RangeId = "24h" | "7d" | "30d" | "90d";
export const RANGE_OPTIONS: { id: RangeId; label: string; maxDays: number }[] = [
  { id: "24h", label: "24H", maxDays: 0 },
  { id: "7d", label: "7D", maxDays: 7 },
  { id: "30d", label: "30D", maxDays: 30 },
  { id: "90d", label: "90D", maxDays: 90 },
];

export function runsInRange(rangeId: RangeId): Run[] {
  const opt = RANGE_OPTIONS.find((r) => r.id === rangeId) ?? RANGE_OPTIONS[1];
  return RUN_HISTORY.filter((r) => r.daysAgo <= opt.maxDays);
}

export const PIPELINE = {
  id: "nightly_orders_pipeline",
  name: "nightly_orders_pipeline",
  schedule: "매일 03:10 KST",
  owner: "data-platform",
  nextRun: "07/19 03:10 KST",
};

export { Waypoints as BrandIcon };
