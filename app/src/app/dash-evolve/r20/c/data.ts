import { Boxes, GitBranch, LayoutGrid, type LucideIcon, Rocket, Settings, ShieldAlert } from "lucide-react";
import type { SloStatus } from "./tokens";

export const BRAND = { name: "Lockstep", Icon: Rocket };

export const CURRENT_USER = {
  name: "Marcus Webb",
  role: "Platform on-call",
  email: "marcus@lockstep-ops.io",
  avatarId: "1553062407-98eeb64c6a62",
};

export const WORKSPACES = [
  { id: "prod", name: "Lockstep — Production", plan: "22 services deployed" },
  { id: "staging", name: "Lockstep — Staging", plan: "22 services deployed" },
];

type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "ops",
    title: "Operations",
    items: [
      { id: "deploys", label: "Deploy feed", Icon: GitBranch, active: true },
      { id: "slo", label: "Error budgets", Icon: ShieldAlert },
      { id: "services", label: "Services", Icon: Boxes },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "rollouts", label: "Rollout policies", Icon: LayoutGrid, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "billing-api error budget crossed 80% burn for the 7-day window.", time: "4m ago" },
  { id: "n2", text: "search-index rollback completed in 48s.", time: "26m ago" },
  { id: "n3", text: "9 deploys shipped to production in the last hour.", time: "1h ago" },
];

/* --------------------------------------------------------------------- SLOs */

export type SloSeed = { id: string; name: string; target: number; burn7d: number; burn30d: number };
const SLO_SEEDS: SloSeed[] = [
  { id: "billing-api", name: "billing-api", target: 99.9, burn7d: 84, burn30d: 61 },
  { id: "checkout", name: "checkout", target: 99.95, burn7d: 46, burn30d: 52 },
  { id: "search-index", name: "search-index", target: 99.5, burn7d: 91, burn30d: 74 },
  { id: "auth-gateway", name: "auth-gateway", target: 99.99, burn7d: 22, burn30d: 30 },
  { id: "notifications", name: "notifications", target: 99.5, burn7d: 58, burn30d: 44 },
  { id: "media-encode", name: "media-encode", target: 99.0, burn7d: 33, burn30d: 39 },
  { id: "recommend-svc", name: "recommend-svc", target: 99.5, burn7d: 12, burn30d: 18 },
  { id: "ledger-sync", name: "ledger-sync", target: 99.95, burn7d: 67, burn30d: 71 },
  { id: "webhook-relay", name: "webhook-relay", target: 99.0, burn7d: 29, burn30d: 26 },
  { id: "image-cdn-edge", name: "image-cdn-edge", target: 99.9, burn7d: 15, burn30d: 21 },
];

export function sloStatus(burn: number): SloStatus {
  if (burn >= 80) return "bad";
  if (burn >= 50) return "warn";
  return "good";
}

export const SLOS: SloSeed[] = SLO_SEEDS;
export const SLO_BY_ID: Record<string, SloSeed> = Object.fromEntries(SLOS.map((s) => [s.id, s]));

/* ------------------------------------------------------------------ Deploys */

export type DeployStatus = "success" | "failed" | "rolled-back";
export type Deploy = {
  id: string;
  service: string;
  env: "production" | "staging";
  status: DeployStatus;
  durationSec: number;
  actor: { name: string; avatarId: string };
  branch: string;
  timeAgo: string;
};

const ACTORS = [
  { name: "Marcus Webb", avatarId: "1553062407-98eeb64c6a62" },
  { name: "Ines Duarte", avatarId: "1543076447-215ad9ba6923" },
  { name: "Owen Blackwood", avatarId: "1123897727-8f129e1688ce" },
  { name: "Freya Lindqvist", avatarId: "1560243563-062bfc001d68" },
];

export const DEPLOYS: Deploy[] = [
  { id: "d1", service: "billing-api", env: "production", status: "failed", durationSec: 142, actor: ACTORS[1], branch: "fix/invoice-rounding", timeAgo: "3m ago" },
  { id: "d2", service: "checkout", env: "production", status: "success", durationSec: 58, actor: ACTORS[0], branch: "feat/apple-pay", timeAgo: "11m ago" },
  { id: "d3", service: "search-index", env: "production", status: "rolled-back", durationSec: 210, actor: ACTORS[2], branch: "perf/shard-rebalance", timeAgo: "18m ago" },
  { id: "d4", service: "auth-gateway", env: "staging", status: "success", durationSec: 34, actor: ACTORS[3], branch: "chore/token-ttl", timeAgo: "25m ago" },
  { id: "d5", service: "notifications", env: "production", status: "success", durationSec: 47, actor: ACTORS[1], branch: "fix/digest-dedupe", timeAgo: "33m ago" },
  { id: "d6", service: "media-encode", env: "production", status: "success", durationSec: 96, actor: ACTORS[2], branch: "feat/av1-transcode", timeAgo: "41m ago" },
  { id: "d7", service: "recommend-svc", env: "staging", status: "success", durationSec: 29, actor: ACTORS[0], branch: "experiment/rerank-v3", timeAgo: "49m ago" },
  { id: "d8", service: "ledger-sync", env: "production", status: "failed", durationSec: 178, actor: ACTORS[3], branch: "fix/idempotency-key", timeAgo: "57m ago" },
  { id: "d9", service: "webhook-relay", env: "production", status: "success", durationSec: 41, actor: ACTORS[1], branch: "chore/retry-backoff", timeAgo: "1h ago" },
  { id: "d10", service: "image-cdn-edge", env: "production", status: "success", durationSec: 63, actor: ACTORS[2], branch: "feat/avif-default", timeAgo: "1h ago" },
  { id: "d11", service: "checkout", env: "staging", status: "success", durationSec: 31, actor: ACTORS[0], branch: "feat/apple-pay", timeAgo: "2h ago" },
  { id: "d12", service: "billing-api", env: "production", status: "success", durationSec: 88, actor: ACTORS[3], branch: "fix/tax-locale", timeAgo: "2h ago" },
];

/* -------------------------------------------------------------------- KPIs */

export const DEPLOYS_TODAY = DEPLOYS.length;
export const FAILED_TODAY = DEPLOYS.filter((d) => d.status !== "success").length;
export const SUCCESS_RATE = Math.round(((DEPLOYS_TODAY - FAILED_TODAY) / DEPLOYS_TODAY) * 1000) / 10;
export const AVG_DURATION = Math.round(DEPLOYS.reduce((s, d) => s + d.durationSec, 0) / DEPLOYS.length);
export const BURNING_COUNT = SLOS.filter((s) => sloStatus(s.burn7d) === "bad").length;

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
export function formatDuration(sec: number): string {
  return sec >= 60 ? `${Math.floor(sec / 60)}m ${sec % 60}s` : `${sec}s`;
}
export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/* ------------------------------------------------------------------- Search */

export type SearchEntry = { id: string; title: string; meta: string; Icon: LucideIcon; serviceId: string };
export const SEARCH_ENTRIES: SearchEntry[] = SLOS.map((s) => ({
  id: s.id,
  title: s.name,
  meta: `${formatPct(s.burn7d, 0)} of 7d budget burned · target ${s.target}%`,
  Icon: ShieldAlert,
  serviceId: s.id,
}));
