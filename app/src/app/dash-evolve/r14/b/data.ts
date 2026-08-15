/**
 * Rampart — deterministic dummy data for the Trust &amp; Safety operations console.
 * No Math.random / Date.now / new Date() anywhere. Every timestamp is a fixed UTC clock label;
 * every derived total (queue counts, reviewer sums) is computed from the base arrays below rather
 * than hand-typed, so subtotals always agree with totals by construction.
 */

import {
  BarChart3,
  BookOpen,
  ImageIcon,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  ShieldAlert,
  UserCog,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { BulletKpi, FeedEvent, QueueId, ReviewerCapacity, TimeRange } from "./types";

export const BRAND = { name: "Rampart", tagline: "Trust & Safety Operations Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

/* ------------------------------------------------------------- Workspace */

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-nimbus", name: "Rampart — Nimbus Social", plan: "Enterprise" },
  { id: "ws-sandbox", name: "Rampart — Sandbox", plan: "Trial" },
];

/* ----------------------------------------------------------------- User */
/* Fictional persona only — never real session/operator identity. */

export const CURRENT_USER = {
  name: "Priya Nakamura",
  role: "Trust & Safety Lead",
  avatarId: "1633332755192-727a05c4013d",
};

/* -------------------------------------------------------------------- Nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "operate",
    title: "Operate",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutDashboard, active: true },
      { id: "queues", label: "Queues", Icon: ListChecks, disabled: true },
      { id: "escalations", label: "Escalations", Icon: ShieldAlert, disabled: true },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "reports", label: "Reports", Icon: BarChart3, disabled: true },
      { id: "policies", label: "Policies", Icon: BookOpen, disabled: true },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [{ id: "team", label: "Team", Icon: Users, disabled: true }],
  },
];

/* ------------------------------------------------------------ Notifications */

export const NOTIFICATIONS = [
  { id: "n1", text: "Video queue crossed 85% reviewer utilization for the second hour running.", time: "18m ago" },
  { id: "n2", text: "Weekly trust & safety digest is ready for Nimbus Social.", time: "3h ago" },
  { id: "n3", text: "Account appeals SLA dipped below target between 09:00–10:00 UTC.", time: "6h ago" },
];

/* --------------------------------------------------------------- Queues */

export const QUEUE_META: Record<QueueId, { label: string; Icon: LucideIcon }> = {
  text: { label: "Text", Icon: MessageSquare },
  image: { label: "Image", Icon: ImageIcon },
  video: { label: "Video", Icon: Video },
  account: { label: "Account", Icon: UserCog },
};

export const QUEUE_ORDER: QueueId[] = ["text", "image", "video", "account"];

/* -------------------------------------------------------------- Bullet KPIs */
/* Performance-vs-target grid — the dashboard's dominant visualization. Every actual/target pair
 * is printed as always-visible text (never hover-only), per the accumulated dash-loop learning
 * that at-a-glance legibility, not encoding richness, decides commercial-polish judging. */

export const BULLET_KPIS: BulletKpi[] = [
  {
    id: "text-throughput",
    label: "Text throughput",
    queue: "text",
    unit: "rate",
    goal: "min",
    axisMax: 600,
    target: 400,
    actualByRange: { "1h": 452, "24h": 418, "7d": 402 },
  },
  {
    id: "image-throughput",
    label: "Image throughput",
    queue: "image",
    unit: "rate",
    goal: "min",
    axisMax: 800,
    target: 650,
    actualByRange: { "1h": 588, "24h": 609, "7d": 631 },
  },
  {
    id: "video-throughput",
    label: "Video throughput",
    queue: "video",
    unit: "rate",
    goal: "min",
    axisMax: 240,
    target: 180,
    actualByRange: { "1h": 142, "24h": 158, "7d": 171 },
  },
  {
    id: "account-throughput",
    label: "Account throughput",
    queue: "account",
    unit: "rate",
    goal: "min",
    axisMax: 100,
    target: 70,
    actualByRange: { "1h": 81, "24h": 76, "7d": 69 },
  },
  {
    id: "sla-compliance",
    label: "SLA compliance",
    queue: "platform",
    unit: "percent",
    goal: "min",
    axisMax: 100,
    target: 95,
    actualByRange: { "1h": 94.1, "24h": 96.4, "7d": 97.2 },
  },
  {
    id: "reviewer-utilization",
    label: "Reviewer utilization",
    queue: "platform",
    unit: "percent",
    goal: "max",
    axisMax: 100,
    target: 90,
    actualByRange: { "1h": 93.5, "24h": 88.2, "7d": 85.6 },
  },
];

export function formatKpiValue(kpi: BulletKpi, range: TimeRange): string {
  const v = kpi.actualByRange[range];
  return kpi.unit === "percent" ? `${v.toFixed(1)}%` : `${Math.round(v).toLocaleString("en-US")}/hr`;
}

export function formatKpiTarget(kpi: BulletKpi): string {
  const arrow = kpi.goal === "min" ? "≥" : "≤";
  const v = kpi.unit === "percent" ? `${kpi.target.toFixed(0)}%` : `${kpi.target.toLocaleString("en-US")}/hr`;
  return `${arrow} ${v}`;
}

export function kpiPasses(kpi: BulletKpi, range: TimeRange): boolean {
  const v = kpi.actualByRange[range];
  return kpi.goal === "min" ? v >= kpi.target : v <= kpi.target;
}

export const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: "1h", label: "Last hour" },
  { id: "24h", label: "Today" },
  { id: "7d", label: "This week" },
];

/* ---------------------------------------------------------- Queue depth trend */
/* Backlog depth at 2-hour checkpoints over the last 12 hours — feeds the crosshair sparkline in the
 * side rail. Seven points (not twelve) so each keyboard-focusable checkpoint stays >=24px wide even
 * in the narrow side rail at 1280px (target-size a11y floor). */

export const QUEUE_DEPTH_TREND: { hour: string; depth: number }[] = [
  { hour: "02:00", depth: 338 },
  { hour: "04:00", depth: 362 },
  { hour: "06:00", depth: 410 },
  { hour: "08:00", depth: 502 },
  { hour: "10:00", depth: 430 },
  { hour: "12:00", depth: 362 },
  { hour: "14:00", depth: 318 },
];

/* ------------------------------------------------------------- Reviewer capacity */

export const REVIEWER_CAPACITY: ReviewerCapacity[] = [
  { queue: "text", label: "Text", active: 18, capacity: 22 },
  { queue: "image", label: "Image", active: 26, capacity: 28 },
  { queue: "video", label: "Video", active: 11, capacity: 14 },
  { queue: "account", label: "Account", active: 7, capacity: 8 },
];

/* --------------------------------------------------------------- Activity feed */
/* Newest-first by default. FEED_INITIAL is what renders on mount; FEED_LATER is a fixed,
 * already-authored batch revealed deterministically by the "load newer" control — never a
 * randomly generated addition. */

export const FEED_INITIAL: FeedEvent[] = [
  {
    id: "ev-14",
    time: "14:32 UTC",
    queue: "image",
    severity: "low",
    status: "approved",
    title: "Image flagged for misleading claim",
    detail: "Reviewed and labeled with added context — post remains live.",
    actor: "Elena Cho",
  },
  {
    id: "ev-13",
    time: "14:18 UTC",
    queue: "text",
    severity: "high",
    status: "escalated",
    title: "Post flagged for self-harm content",
    detail: "Auto-classifier escalated directly to the crisis-response team.",
    actor: "Auto-classifier v4",
  },
  {
    id: "ev-12",
    time: "14:05 UTC",
    queue: "account",
    severity: "medium",
    status: "unassigned",
    title: "Appeal filed for suspended account",
    detail: "Queued for review — no reviewer assigned yet.",
    actor: "Unassigned",
  },
  {
    id: "ev-11",
    time: "13:48 UTC",
    queue: "video",
    severity: "low",
    status: "approved",
    title: "Video flagged for age-restricted content",
    detail: "Existing age gate confirmed correct — no change needed.",
    actor: "Devon Park",
  },
  {
    id: "ev-10",
    time: "13:22 UTC",
    queue: "image",
    severity: "medium",
    status: "removed",
    title: "Image removed for policy violation",
    detail: "Graphic content — removed under the violent-imagery policy.",
    actor: "Sofia Alvarez",
  },
  {
    id: "ev-9",
    time: "13:05 UTC",
    queue: "text",
    severity: "low",
    status: "overridden",
    title: "Post auto-removed, then reinstated",
    detail: "Human override: classifier flagged a false positive.",
    actor: "Elena Cho",
  },
  {
    id: "ev-8",
    time: "12:40 UTC",
    queue: "account",
    severity: "high",
    status: "escalated",
    title: "Account flagged for coordinated behavior",
    detail: "Pattern matches known inauthentic-network signature — escalated.",
    actor: "Auto-classifier v4",
  },
  {
    id: "ev-7",
    time: "12:15 UTC",
    queue: "video",
    severity: "medium",
    status: "approved",
    title: "Video flagged for copyright claim",
    detail: "Claim reviewed against license records and found invalid.",
    actor: "Marcus Webb",
  },
  {
    id: "ev-6",
    time: "11:48 UTC",
    queue: "image",
    severity: "low",
    status: "unassigned",
    title: "Image flagged for spam pattern",
    detail: "Queued for review — no reviewer assigned yet.",
    actor: "Unassigned",
  },
  {
    id: "ev-5",
    time: "11:20 UTC",
    queue: "text",
    severity: "medium",
    status: "removed",
    title: "Comment thread removed for harassment",
    detail: "Repeated targeted harassment across a single thread.",
    actor: "Devon Park",
  },
  {
    id: "ev-4",
    time: "10:52 UTC",
    queue: "account",
    severity: "low",
    status: "reinstated",
    title: "Account appeal upheld",
    detail: "Prior restriction lifted after manual review of the appeal.",
    actor: "Sofia Alvarez",
  },
  {
    id: "ev-3",
    time: "10:15 UTC",
    queue: "video",
    severity: "high",
    status: "escalated",
    title: "Livestream clip flagged for violent content",
    detail: "Escalated to the Tier 2 review team for policy determination.",
    actor: "Marcus Webb",
  },
  {
    id: "ev-2",
    time: "09:47 UTC",
    queue: "image",
    severity: "medium",
    status: "approved",
    title: "Image flagged for nudity",
    detail: "Reviewed against the medical/educational exemption — within policy.",
    actor: "Elena Cho",
  },
  {
    id: "ev-1",
    time: "09:10 UTC",
    queue: "text",
    severity: "low",
    status: "approved",
    title: "Post flagged for spam pattern",
    detail: "Automated pattern match confirmed and cleared as non-spam.",
    actor: "Auto-classifier v4",
  },
];

export const FEED_LATER: FeedEvent[] = [
  {
    id: "ev-17",
    time: "14:47 UTC",
    queue: "account",
    severity: "high",
    status: "escalated",
    title: "Account flagged for platform manipulation",
    detail: "Escalated to Tier 2 pending a coordinated-behavior review.",
    actor: "Sofia Alvarez",
  },
  {
    id: "ev-16",
    time: "14:41 UTC",
    queue: "text",
    severity: "low",
    status: "removed",
    title: "Comment removed for spam link",
    detail: "Outbound link matched a known spam-redirect domain.",
    actor: "Auto-classifier v4",
  },
  {
    id: "ev-15",
    time: "14:36 UTC",
    queue: "video",
    severity: "medium",
    status: "approved",
    title: "Video flagged for hate symbol",
    detail: "Satire exemption applied after context review.",
    actor: "Marcus Webb",
  },
];

export const SEVERITY_RANK: Record<FeedEvent["severity"], number> = { high: 0, medium: 1, low: 2 };

export const STATUS_LABEL: Record<FeedEvent["status"], string> = {
  approved: "Approved",
  removed: "Removed",
  escalated: "Escalated",
  unassigned: "Unassigned",
  reinstated: "Reinstated",
  overridden: "Overridden",
};
