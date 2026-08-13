/**
 * Trestle — deterministic dummy data for the deployment operations console.
 * No Math.random / Date.now anywhere. Every timestamp is computed relative to (or as an absolute
 * anchored on) the fixed reference instant NOW below, so server and client render identical output
 * on every run. Diff subtotals (filesChanged/additions/deletions) are never hand-typed — they are
 * always derived from the per-file rows via `diffTotals`, so a totals/subtotals mismatch is
 * structurally impossible.
 */

import type { LucideIcon } from "lucide-react";
import { Activity, Gauge, GitBranch, Radio, Server, Settings, ShieldAlert, Waypoints } from "lucide-react";

/* ------------------------------------------------------------------ Time */

const MIN_MS = 60_000;
const HOUR_MS = 60 * MIN_MS;
const DAY_MS = 24 * HOUR_MS;

/** Console snapshot reference instant — fixed value, never a real clock. */
export const NOW = new Date("2026-08-13T16:42:00Z");
const NOW_MS = NOW.getTime();

function minsAgo(m: number): number {
  return NOW_MS - m * MIN_MS;
}
function hoursAgo(h: number): number {
  return NOW_MS - h * HOUR_MS;
}
function daysAgo(d: number, extraHours = 0): number {
  return NOW_MS - d * DAY_MS - extraHours * HOUR_MS;
}

const RTF = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
const CLOCK_FMT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const DATE_CLOCK_FMT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** "3m ago" / "2h ago" / "yesterday" style relative label, computed off the fixed NOW instant. */
export function formatRelative(ms: number): string {
  const diff = ms - NOW_MS;
  const absDiff = Math.abs(diff);
  if (absDiff < MIN_MS) return "just now";
  if (absDiff < HOUR_MS) return RTF.format(Math.round(diff / MIN_MS), "minute");
  if (absDiff < DAY_MS) return RTF.format(Math.round(diff / HOUR_MS), "hour");
  return RTF.format(Math.round(diff / DAY_MS), "day");
}

/** Absolute clock — same-day events get a time only, older ones get a date + time. */
export function formatWhen(ms: number): string {
  const sameDay = new Date(ms).toDateString() === NOW.toDateString();
  return sameDay ? CLOCK_FMT.format(ms) : DATE_CLOCK_FMT.format(ms);
}

export function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

/* ----------------------------------------------------------------- Brand */

export const BRAND = { name: "Trestle", tagline: "Deployment Operations Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-core", name: "Core Platform", plan: "Team plan" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session data. */
export const CURRENT_USER = {
  name: "Marisol Kade",
  role: "Release Engineering Lead",
  email: "marisol.kade@trestle.dev",
  avatarId: "1502685104226-ee32379fefbe",
};

/* -------------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "pipelines",
    title: "Pipelines",
    items: [
      { id: "activity", label: "Activity", Icon: Activity, active: true },
      { id: "environments", label: "Environments", Icon: Waypoints, disabled: true },
      { id: "services", label: "Services", Icon: Server, disabled: true },
      { id: "branches", label: "Branches", Icon: GitBranch, disabled: true },
    ],
  },
  {
    id: "reliability",
    title: "Reliability",
    items: [
      { id: "alerts", label: "Alerts", Icon: ShieldAlert, disabled: true },
      { id: "oncall", label: "On-call", Icon: Radio, disabled: true },
      { id: "slo", label: "SLOs", Icon: Gauge, disabled: true },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [{ id: "settings", label: "Settings", Icon: Settings, disabled: true }],
  },
];

/* ------------------------------------------------------------------ People */

export type Person = { name: string; role: string; avatarId: string };

export const PEOPLE = {
  marisol: { name: "Marisol Kade", role: "Release Engineering Lead", avatarId: "1502685104226-ee32379fefbe" },
  theo: { name: "Theo Bannerman", role: "Backend Engineer", avatarId: "1531123897727-8f129e1688ce" },
  priya: { name: "Priya Osei", role: "SRE", avatarId: "1494790108377-be9c29b29330" },
  diego: { name: "Diego Farrow", role: "Platform Engineer", avatarId: "1544005313-94ddf0286df2" },
  lena: { name: "Lena Vasquez", role: "Backend Engineer", avatarId: "1438761681033-6461ffad8d80" },
  sam: { name: "Sam Okafor", role: "Search Infra", avatarId: "1519085360753-af0119f7cbe7" },
  iris: { name: "Iris Chen", role: "SRE", avatarId: "1580489944761-15a19d654956" },
  noah: { name: "Noah Petric", role: "Frontend Engineer", avatarId: "1519345182560-3f2917c472ef" },
} as const satisfies Record<string, Person>;

/* -------------------------------------------------------------- Services */

export type ServiceId = "checkout-api" | "payments-worker" | "auth-gateway" | "search-indexer" | "notify-svc" | "web-frontend" | "billing-api" | "image-pipeline";

export type Service = { id: ServiceId; name: string; dot: string };

export const SERVICES: Service[] = [
  { id: "checkout-api", name: "Checkout API", dot: "bg-sky-500" },
  { id: "payments-worker", name: "Payments Worker", dot: "bg-indigo-500" },
  { id: "auth-gateway", name: "Auth Gateway", dot: "bg-fuchsia-500" },
  { id: "search-indexer", name: "Search Indexer", dot: "bg-orange-500" },
  { id: "notify-svc", name: "Notification Service", dot: "bg-lime-500" },
  { id: "web-frontend", name: "Web Frontend", dot: "bg-pink-500" },
  { id: "billing-api", name: "Billing API", dot: "bg-blue-500" },
  { id: "image-pipeline", name: "Image Pipeline", dot: "bg-slate-400" },
];

export const SERVICE_BY_ID: Record<ServiceId, Service> = Object.fromEntries(SERVICES.map((s) => [s.id, s])) as Record<ServiceId, Service>;

/* --------------------------------------------------------------- Environments */

export type EnvironmentId = "production" | "staging" | "canary" | "preview";
export type EnvHealthStatus = "healthy" | "degraded" | "down";

export interface Environment {
  id: EnvironmentId;
  name: string;
  region: string;
  status: EnvHealthStatus;
  statusLabel: string;
  version: string;
  servicesCount: number;
  lastDeployMs: number;
  /** Rolling deploy-health score (0-100) for the last 12 samples — oldest first. */
  health: number[];
}

export const ENVIRONMENTS: Environment[] = [
  {
    id: "production",
    name: "Production",
    region: "us-east-1",
    status: "healthy",
    statusLabel: "Healthy",
    version: "v2026.8.13-114",
    servicesCount: 18,
    lastDeployMs: minsAgo(47),
    health: [98, 97, 99, 96, 98, 99, 97, 98, 99, 98, 97, 99],
  },
  {
    id: "staging",
    name: "Staging",
    region: "us-east-1",
    status: "healthy",
    statusLabel: "Healthy",
    version: "v2026.8.13-118",
    servicesCount: 18,
    lastDeployMs: minsAgo(9),
    health: [92, 94, 90, 93, 95, 88, 91, 94, 93, 90, 92, 95],
  },
  {
    id: "canary",
    name: "Canary",
    region: "us-east-1 · 5% traffic",
    status: "degraded",
    statusLabel: "Degraded",
    version: "v2026.8.13-117",
    servicesCount: 6,
    lastDeployMs: minsAgo(22),
    health: [95, 90, 82, 74, 68, 71, 66, 70, 73, 69, 72, 68],
  },
  {
    id: "preview",
    name: "Preview",
    region: "ephemeral · per-PR",
    status: "healthy",
    statusLabel: "Healthy",
    version: "7 active",
    servicesCount: 7,
    lastDeployMs: minsAgo(4),
    health: [100, 100, 96, 100, 98, 100, 100, 97, 100, 100, 99, 100],
  },
];

export const ENV_BY_ID: Record<EnvironmentId, Environment> = Object.fromEntries(ENVIRONMENTS.map((e) => [e.id, e])) as Record<EnvironmentId, Environment>;

export const ENV_TONE: Record<EnvHealthStatus, "good" | "warn" | "bad"> = { healthy: "good", degraded: "warn", down: "bad" };

/* ------------------------------------------------------------------- Feed */

export type EventKind = "build" | "deploy";
export type EventStatus = "success" | "failed" | "running" | "rolled_back";

export interface DiffFile {
  path: string;
  additions: number;
  deletions: number;
}

export interface FeedEvent {
  id: string;
  kind: EventKind;
  status: EventStatus;
  serviceId: ServiceId;
  environment: EnvironmentId | null;
  branch: string;
  commitSha: string;
  commitMessage: string;
  author: Person;
  startedAtMs: number;
  durationSec: number | null;
  files: DiffFile[];
  logLines: string[];
}

/** Derives filesChanged/additions/deletions from per-file rows — never hand-typed, so a
 * subtotal/total mismatch is structurally impossible. */
export function diffTotals(files: DiffFile[]): { filesChanged: number; additions: number; deletions: number } {
  return files.reduce(
    (acc, f) => ({ filesChanged: acc.filesChanged + 1, additions: acc.additions + f.additions, deletions: acc.deletions + f.deletions }),
    { filesChanged: 0, additions: 0, deletions: 0 },
  );
}

export const STATUS_LABEL: Record<EventStatus, string> = {
  success: "Success",
  failed: "Failed",
  running: "Running",
  rolled_back: "Rolled back",
};

export const KIND_LABEL: Record<EventKind, string> = { build: "Build", deploy: "Deploy" };

export const EVENTS: FeedEvent[] = [
  {
    id: "evt-24",
    kind: "deploy",
    status: "running",
    serviceId: "auth-gateway",
    environment: "canary",
    branch: "main",
    commitSha: "f3a91c2",
    commitMessage: "Extend canary bake window for JWT clock-skew fix",
    author: PEOPLE.iris,
    startedAtMs: minsAgo(4),
    durationSec: null,
    files: [
      { path: "src/auth/jwt.ts", additions: 22, deletions: 6 },
      { path: "src/auth/jwt.test.ts", additions: 14, deletions: 0 },
    ],
    logLines: [
      "$ trestle deploy canary --service auth-gateway --strategy canary --bake 2h",
      "OK  image pulled auth-gateway@f3a91c2 (41.2 MB)",
      "OK  health checks passing on 1/12 pods",
      "..  shifting traffic 5% -> waiting for bake window",
    ],
  },
  {
    id: "evt-23",
    kind: "deploy",
    status: "failed",
    serviceId: "checkout-api",
    environment: "canary",
    branch: "main",
    commitSha: "9d0e7ab",
    commitMessage: "Add canary traffic-split guard for checkout retries",
    author: PEOPLE.theo,
    startedAtMs: minsAgo(18),
    durationSec: 143,
    files: [
      { path: "src/checkout/guard.ts", additions: 48, deletions: 9 },
      { path: "src/checkout/guard.test.ts", additions: 31, deletions: 2 },
      { path: "config/canary.yaml", additions: 3, deletions: 1 },
    ],
    logLines: [
      "$ trestle deploy canary --service checkout-api",
      "OK  image pulled checkout-api@9d0e7ab (58.9 MB)",
      "FAIL  readiness probe timed out on 3/6 pods (10s)",
      "FAIL  5xx rate 6.8% over 5m window, threshold 2.0%",
      "$ trestle rollback canary --service checkout-api --auto",
      "OK  traffic reverted to checkout-api@1a7cf40",
    ],
  },
  {
    id: "evt-22",
    kind: "build",
    status: "failed",
    serviceId: "notify-svc",
    environment: null,
    branch: "feature/digest-batching",
    commitSha: "2c88f61",
    commitMessage: "Batch weekly digest sends into 500-recipient chunks",
    author: PEOPLE.noah,
    startedAtMs: minsAgo(35),
    durationSec: 96,
    files: [
      { path: "src/notify/digest.ts", additions: 61, deletions: 18 },
      { path: "src/notify/digest.test.ts", additions: 27, deletions: 3 },
    ],
    logLines: [
      "$ pnpm run test:integration --filter=notify-svc",
      "FAIL  digest.test.ts > sends in chunks of 500 (timeout 5000ms)",
      "FAIL  1 of 58 tests failed",
      "exit code 1",
    ],
  },
  {
    id: "evt-21",
    kind: "deploy",
    status: "success",
    serviceId: "search-indexer",
    environment: "staging",
    branch: "main",
    commitSha: "6b4a2d9",
    commitMessage: "Increase batch size for reindex jobs from 200 to 500",
    author: PEOPLE.sam,
    startedAtMs: minsAgo(52),
    durationSec: 187,
    files: [{ path: "src/indexer/batch.ts", additions: 9, deletions: 4 }],
    logLines: [
      "$ trestle deploy staging --service search-indexer",
      "OK  image pulled search-indexer@6b4a2d9 (72.1 MB)",
      "OK  health checks passing on 4/4 pods",
      "OK  traffic shifted 100% -> search-indexer@6b4a2d9",
    ],
  },
  {
    id: "evt-20",
    kind: "deploy",
    status: "success",
    serviceId: "web-frontend",
    environment: "production",
    branch: "main",
    commitSha: "e17b3f0",
    commitMessage: "Ship redesigned billing settings page",
    author: PEOPLE.lena,
    startedAtMs: hoursAgo(1) - 4 * MIN_MS,
    durationSec: 94,
    files: [
      { path: "src/pages/settings/billing.tsx", additions: 118, deletions: 42 },
      { path: "src/components/PlanCard.tsx", additions: 36, deletions: 0 },
    ],
    logLines: [
      "$ trestle deploy production --service web-frontend",
      "OK  image pulled web-frontend@e17b3f0 (12.4 MB)",
      "OK  health checks passing on 8/8 pods",
      "OK  traffic shifted 100% -> web-frontend@e17b3f0",
    ],
  },
  {
    id: "evt-19",
    kind: "deploy",
    status: "success",
    serviceId: "auth-gateway",
    environment: "production",
    branch: "main",
    commitSha: "0f6c9a1",
    commitMessage: "Widen JWT clock-skew tolerance to 90s",
    author: PEOPLE.iris,
    startedAtMs: hoursAgo(1) - 40 * MIN_MS,
    durationSec: 61,
    files: [{ path: "src/auth/jwt.ts", additions: 4, deletions: 4 }],
    logLines: [
      "$ trestle deploy production --service auth-gateway",
      "OK  image pulled auth-gateway@0f6c9a1 (41.0 MB)",
      "OK  health checks passing on 10/10 pods",
      "OK  traffic shifted 100% -> auth-gateway@0f6c9a1",
    ],
  },
  {
    id: "evt-18",
    kind: "deploy",
    status: "rolled_back",
    serviceId: "billing-api",
    environment: "production",
    branch: "main",
    commitSha: "a52e8d3",
    commitMessage: "Switch billing-api to new invoice ledger schema",
    author: PEOPLE.theo,
    startedAtMs: hoursAgo(3) - 12 * MIN_MS,
    durationSec: 211,
    files: [
      { path: "src/billing/ledger.ts", additions: 204, deletions: 87 },
      { path: "src/billing/migrations/0042_ledger.sql", additions: 58, deletions: 0 },
      { path: "src/billing/ledger.test.ts", additions: 44, deletions: 6 },
    ],
    logLines: [
      "$ trestle deploy production --service billing-api",
      "OK  image pulled billing-api@a52e8d3 (33.7 MB)",
      "OK  traffic shifted 100% -> billing-api@a52e8d3",
      "WARN  5xx rate 4.1% over 10m window, threshold 2.0%",
      "$ trestle rollback production --service billing-api --auto",
      "OK  traffic reverted to billing-api@7e2c410",
    ],
  },
  {
    id: "evt-17",
    kind: "build",
    status: "success",
    serviceId: "image-pipeline",
    environment: null,
    branch: "main",
    commitSha: "3d19b7e",
    commitMessage: "Add AVIF output alongside WebP for thumbnails",
    author: PEOPLE.diego,
    startedAtMs: hoursAgo(4) - 20 * MIN_MS,
    durationSec: 264,
    files: [
      { path: "src/pipeline/encode.ts", additions: 73, deletions: 11 },
      { path: "src/pipeline/encode.test.ts", additions: 39, deletions: 0 },
    ],
    logLines: [
      "$ pnpm run build --filter=image-pipeline",
      "OK  compiled in 22.1s",
      "$ pnpm run test:integration --filter=image-pipeline",
      "OK  87 passed, 0 failed",
    ],
  },
  {
    id: "evt-16",
    kind: "deploy",
    status: "success",
    serviceId: "payments-worker",
    environment: "staging",
    branch: "main",
    commitSha: "88c4f2a",
    commitMessage: "Fix connection pool leak in payment retry loop",
    author: PEOPLE.priya,
    startedAtMs: hoursAgo(6) - 8 * MIN_MS,
    durationSec: 132,
    files: [{ path: "src/payments/retry.ts", additions: 19, deletions: 27 }],
    logLines: [
      "$ trestle deploy staging --service payments-worker",
      "OK  image pulled payments-worker@88c4f2a (28.6 MB)",
      "OK  health checks passing on 3/3 pods",
      "OK  traffic shifted 100% -> payments-worker@88c4f2a",
    ],
  },
  {
    id: "evt-15",
    kind: "deploy",
    status: "success",
    serviceId: "checkout-api",
    environment: "production",
    branch: "main",
    commitSha: "1a7cf40",
    commitMessage: "Cache tax-rate lookups for 5 minutes",
    author: PEOPLE.marisol,
    startedAtMs: hoursAgo(9) - 30 * MIN_MS,
    durationSec: 88,
    files: [
      { path: "src/checkout/tax.ts", additions: 31, deletions: 5 },
      { path: "src/checkout/tax.test.ts", additions: 22, deletions: 0 },
    ],
    logLines: [
      "$ trestle deploy production --service checkout-api",
      "OK  image pulled checkout-api@1a7cf40 (58.4 MB)",
      "OK  health checks passing on 12/12 pods",
      "OK  traffic shifted 100% -> checkout-api@1a7cf40",
    ],
  },
  {
    id: "evt-14",
    kind: "deploy",
    status: "success",
    serviceId: "web-frontend",
    environment: "preview",
    branch: "feature/plan-comparison",
    commitSha: "c60a1e4",
    commitMessage: "Add side-by-side plan comparison table",
    author: PEOPLE.lena,
    startedAtMs: hoursAgo(11),
    durationSec: 47,
    files: [{ path: "src/pages/pricing/compare.tsx", additions: 96, deletions: 0 }],
    logLines: [
      "$ trestle deploy preview --service web-frontend --pr 482",
      "OK  image pulled web-frontend@c60a1e4 (12.6 MB)",
      "OK  preview live at pr-482.preview.trestle.dev",
    ],
  },
  {
    id: "evt-13",
    kind: "build",
    status: "failed",
    serviceId: "search-indexer",
    environment: null,
    branch: "feature/synonym-expansion",
    commitSha: "7fbe903",
    commitMessage: "Expand query synonyms using the new taxonomy table",
    author: PEOPLE.sam,
    startedAtMs: hoursAgo(14),
    durationSec: 71,
    files: [{ path: "src/indexer/synonyms.ts", additions: 54, deletions: 12 }],
    logLines: [
      "$ pnpm run lint --filter=search-indexer",
      "FAIL  synonyms.ts:88 'taxonomy' is possibly undefined",
      "exit code 1",
    ],
  },
  {
    id: "evt-12",
    kind: "deploy",
    status: "success",
    serviceId: "notify-svc",
    environment: "production",
    branch: "main",
    commitSha: "d34ab61",
    commitMessage: "Retry failed webhook deliveries with exponential backoff",
    author: PEOPLE.noah,
    startedAtMs: hoursAgo(19),
    durationSec: 76,
    files: [
      { path: "src/notify/webhooks.ts", additions: 41, deletions: 9 },
      { path: "src/notify/webhooks.test.ts", additions: 28, deletions: 0 },
    ],
    logLines: [
      "$ trestle deploy production --service notify-svc",
      "OK  image pulled notify-svc@d34ab61 (19.8 MB)",
      "OK  health checks passing on 6/6 pods",
      "OK  traffic shifted 100% -> notify-svc@d34ab61",
    ],
  },
  {
    id: "evt-11",
    kind: "deploy",
    status: "success",
    serviceId: "auth-gateway",
    environment: "staging",
    branch: "main",
    commitSha: "5e21c8b",
    commitMessage: "Add device-fingerprint header to login events",
    author: PEOPLE.iris,
    startedAtMs: daysAgo(1, 2),
    durationSec: 58,
    files: [{ path: "src/auth/login.ts", additions: 17, deletions: 2 }],
    logLines: [
      "$ trestle deploy staging --service auth-gateway",
      "OK  image pulled auth-gateway@5e21c8b (40.7 MB)",
      "OK  traffic shifted 100% -> auth-gateway@5e21c8b",
    ],
  },
  {
    id: "evt-10",
    kind: "deploy",
    status: "success",
    serviceId: "billing-api",
    environment: "production",
    branch: "main",
    commitSha: "7e2c410",
    commitMessage: "Round invoice totals using banker's rounding",
    author: PEOPLE.theo,
    startedAtMs: daysAgo(1, 6),
    durationSec: 69,
    files: [{ path: "src/billing/round.ts", additions: 12, deletions: 3 }],
    logLines: [
      "$ trestle deploy production --service billing-api",
      "OK  image pulled billing-api@7e2c410 (33.1 MB)",
      "OK  traffic shifted 100% -> billing-api@7e2c410",
    ],
  },
  {
    id: "evt-09",
    kind: "deploy",
    status: "success",
    serviceId: "image-pipeline",
    environment: "production",
    branch: "main",
    commitSha: "b9f0a22",
    commitMessage: "Downscale source images before EXIF strip",
    author: PEOPLE.diego,
    startedAtMs: daysAgo(2, 1),
    durationSec: 118,
    files: [{ path: "src/pipeline/exif.ts", additions: 26, deletions: 8 }],
    logLines: [
      "$ trestle deploy production --service image-pipeline",
      "OK  image pulled image-pipeline@b9f0a22 (44.9 MB)",
      "OK  traffic shifted 100% -> image-pipeline@b9f0a22",
    ],
  },
  {
    id: "evt-08",
    kind: "deploy",
    status: "rolled_back",
    serviceId: "web-frontend",
    environment: "canary",
    branch: "main",
    commitSha: "45cd118",
    commitMessage: "Migrate marketing header to server components",
    author: PEOPLE.lena,
    startedAtMs: daysAgo(2, 9),
    durationSec: 156,
    files: [
      { path: "src/components/Header.tsx", additions: 88, deletions: 61 },
      { path: "src/app/layout.tsx", additions: 6, deletions: 6 },
    ],
    logLines: [
      "$ trestle deploy canary --service web-frontend",
      "WARN  LCP regression +820ms over baseline on 4/6 pods",
      "$ trestle rollback canary --service web-frontend --auto",
      "OK  traffic reverted to web-frontend@e17b3f0",
    ],
  },
  {
    id: "evt-07",
    kind: "deploy",
    status: "success",
    serviceId: "payments-worker",
    environment: "production",
    branch: "main",
    commitSha: "c2118af",
    commitMessage: "Add idempotency keys to refund processing",
    author: PEOPLE.priya,
    startedAtMs: daysAgo(3),
    durationSec: 101,
    files: [
      { path: "src/payments/refund.ts", additions: 47, deletions: 14 },
      { path: "src/payments/refund.test.ts", additions: 33, deletions: 0 },
    ],
    logLines: [
      "$ trestle deploy production --service payments-worker",
      "OK  image pulled payments-worker@c2118af (28.9 MB)",
      "OK  traffic shifted 100% -> payments-worker@c2118af",
    ],
  },
  {
    id: "evt-06",
    kind: "build",
    status: "success",
    serviceId: "checkout-api",
    environment: null,
    branch: "feature/tax-cache",
    commitSha: "9a04ee1",
    commitMessage: "Add tests for tax-rate cache invalidation",
    author: PEOPLE.marisol,
    startedAtMs: daysAgo(4, 3),
    durationSec: 54,
    files: [{ path: "src/checkout/tax.test.ts", additions: 40, deletions: 0 }],
    logLines: ["$ pnpm run test:unit --filter=checkout-api", "OK  216 passed, 0 failed"],
  },
  {
    id: "evt-05",
    kind: "deploy",
    status: "success",
    serviceId: "search-indexer",
    environment: "production",
    branch: "main",
    commitSha: "618fae2",
    commitMessage: "Warm index cache on pod startup",
    author: PEOPLE.sam,
    startedAtMs: daysAgo(4, 14),
    durationSec: 143,
    files: [{ path: "src/indexer/warmup.ts", additions: 29, deletions: 0 }],
    logLines: [
      "$ trestle deploy production --service search-indexer",
      "OK  image pulled search-indexer@618fae2 (72.4 MB)",
      "OK  traffic shifted 100% -> search-indexer@618fae2",
    ],
  },
  {
    id: "evt-04",
    kind: "deploy",
    status: "success",
    serviceId: "notify-svc",
    environment: "staging",
    branch: "main",
    commitSha: "0bb71ac",
    commitMessage: "Dedupe SMS sends within a 60s window",
    author: PEOPLE.noah,
    startedAtMs: daysAgo(5, 5),
    durationSec: 62,
    files: [{ path: "src/notify/sms.ts", additions: 21, deletions: 5 }],
    logLines: [
      "$ trestle deploy staging --service notify-svc",
      "OK  image pulled notify-svc@0bb71ac (19.5 MB)",
      "OK  traffic shifted 100% -> notify-svc@0bb71ac",
    ],
  },
  {
    id: "evt-03",
    kind: "deploy",
    status: "failed",
    serviceId: "auth-gateway",
    environment: "staging",
    branch: "main",
    commitSha: "f01c983",
    commitMessage: "Rotate signing keys to new KMS key ring",
    author: PEOPLE.iris,
    startedAtMs: daysAgo(6, 2),
    durationSec: 39,
    files: [{ path: "src/auth/keys.ts", additions: 15, deletions: 15 }],
    logLines: [
      "$ trestle deploy staging --service auth-gateway",
      "FAIL  KMS key ring 'auth-2026' not found in region",
      "exit code 1",
    ],
  },
  {
    id: "evt-02",
    kind: "deploy",
    status: "success",
    serviceId: "billing-api",
    environment: "staging",
    branch: "main",
    commitSha: "aa20f5d",
    commitMessage: "Add proration support for mid-cycle plan changes",
    author: PEOPLE.theo,
    startedAtMs: daysAgo(6, 18),
    durationSec: 174,
    files: [
      { path: "src/billing/proration.ts", additions: 112, deletions: 8 },
      { path: "src/billing/proration.test.ts", additions: 65, deletions: 0 },
    ],
    logLines: [
      "$ trestle deploy staging --service billing-api",
      "OK  image pulled billing-api@aa20f5d (33.9 MB)",
      "OK  traffic shifted 100% -> billing-api@aa20f5d",
    ],
  },
  {
    id: "evt-01",
    kind: "deploy",
    status: "success",
    serviceId: "web-frontend",
    environment: "production",
    branch: "main",
    commitSha: "42d9b0e",
    commitMessage: "Ship new onboarding checklist widget",
    author: PEOPLE.lena,
    startedAtMs: daysAgo(6, 23),
    durationSec: 82,
    files: [{ path: "src/components/OnboardingChecklist.tsx", additions: 74, deletions: 0 }],
    logLines: [
      "$ trestle deploy production --service web-frontend",
      "OK  image pulled web-frontend@42d9b0e (12.2 MB)",
      "OK  traffic shifted 100% -> web-frontend@42d9b0e",
    ],
  },
];

export const EVENT_BY_ID: Record<string, FeedEvent> = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

export type Period = "24h" | "7d";
const PERIOD_MS: Record<Period, number> = { "24h": DAY_MS, "7d": 7 * DAY_MS };

export function eventsForPeriod(period: Period): FeedEvent[] {
  const cutoff = NOW_MS - PERIOD_MS[period];
  return EVENTS.filter((e) => e.startedAtMs >= cutoff);
}

/* ------------------------------------------------------------------ Alerts */

export type Severity = "critical" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged";

export interface AlertItem {
  id: string;
  severity: Severity;
  title: string;
  serviceId: ServiceId;
  environment: EnvironmentId | null;
  openedAtMs: number;
  status: AlertStatus;
  onCall: Person;
  relatedEventId?: string;
}

export const SEVERITY_LABEL: Record<Severity, string> = { critical: "Critical", warning: "Warning", info: "Info" };
export const SEVERITY_TONE: Record<Severity, "bad" | "warn" | "neutral"> = { critical: "bad", warning: "warn", info: "neutral" };

export const ALERTS: AlertItem[] = [
  {
    id: "alrt-01",
    severity: "critical",
    title: "Elevated 5xx rate on checkout-api canary — auto rolled back",
    serviceId: "checkout-api",
    environment: "canary",
    openedAtMs: minsAgo(18),
    status: "open",
    onCall: PEOPLE.theo,
    relatedEventId: "evt-23",
  },
  {
    id: "alrt-02",
    severity: "warning",
    title: "payments-worker p95 latency above 300ms SLO for 15 minutes",
    serviceId: "payments-worker",
    environment: "production",
    openedAtMs: hoursAgo(2) - 10 * MIN_MS,
    status: "acknowledged",
    onCall: PEOPLE.priya,
  },
  {
    id: "alrt-03",
    severity: "critical",
    title: "billing-api rolled back — invoice ledger schema mismatch",
    serviceId: "billing-api",
    environment: "production",
    openedAtMs: hoursAgo(3) - 8 * MIN_MS,
    status: "open",
    onCall: PEOPLE.theo,
    relatedEventId: "evt-18",
  },
  {
    id: "alrt-04",
    severity: "warning",
    title: "search-indexer reindex queue backlog above 50k messages",
    serviceId: "search-indexer",
    environment: "staging",
    openedAtMs: hoursAgo(5),
    status: "open",
    onCall: PEOPLE.sam,
  },
  {
    id: "alrt-05",
    severity: "info",
    title: "auth-gateway canary bake window extended to 2 hours",
    serviceId: "auth-gateway",
    environment: "canary",
    openedAtMs: minsAgo(40),
    status: "acknowledged",
    onCall: PEOPLE.iris,
  },
  {
    id: "alrt-06",
    severity: "warning",
    title: "notify-svc integration suite flaking on digest batching",
    serviceId: "notify-svc",
    environment: null,
    openedAtMs: minsAgo(35),
    status: "open",
    onCall: PEOPLE.noah,
    relatedEventId: "evt-22",
  },
];
