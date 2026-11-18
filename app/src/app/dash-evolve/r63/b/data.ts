/**
 * Vernier — deterministic domain data for the feature-flag / rollout console (auto-dash-r63 /
 * candidate b).
 *
 * No `Math.random()`, no `Date.now()`, no `new Date()` anywhere. `lastChangedLabel` is a fixed
 * demo copy string ("2 days ago", "today", …), never computed from a real clock. `enrolledUsers`
 * on every flag is hand-set to exactly `round(eligibleUsers * rolloutPct / 100)` so the table, the
 * hero metric and every stat tile below read the same pre-reconciled numbers — nothing is
 * recomputed at a different rounding than what's on screen elsewhere.
 *
 * Every aggregate exported below (ENROLLED_PCT, FLAGS_AT_FULL, SEGMENTS_TARGETED, …) is derived
 * from the single `FLAGS` array — the same array `FlagTable` and `FlagDetailPanel` read — so a
 * stat tile can never drift out of sync with what the table/detail drill-down would show for the
 * same bucket.
 */

export type FlagStatus = "active" | "paused" | "archived";

export interface Flag {
  id: string;
  key: string;
  name: string;
  status: FlagStatus;
  rolloutPct: number;
  segments: string[];
  owner: { name: string; initials: string };
  lastChangedLabel: string;
  eligibleUsers: number;
  enrolledUsers: number;
  rollbackEventsThisMonth: number;
  /** 7-point rollout-percentage trend, oldest to newest. Last point always equals rolloutPct. */
  history: number[];
  /** Only set once a flag has actually reached 100%. */
  daysToFull?: number;
}

export const FLAGS: Flag[] = [
  {
    id: "checkout-redesign-v2",
    key: "checkout-redesign-v2",
    name: "Checkout redesign v2",
    status: "active",
    rolloutPct: 65,
    segments: ["All users"],
    owner: { name: "Priya Nair", initials: "PN" },
    lastChangedLabel: "2 days ago",
    eligibleUsers: 480000,
    enrolledUsers: 312000,
    rollbackEventsThisMonth: 0,
    history: [20, 32, 41, 50, 58, 62, 65],
  },
  {
    id: "dark-mode-rollout",
    key: "dark-mode-rollout",
    name: "Dark mode rollout",
    status: "active",
    rolloutPct: 100,
    segments: ["All users"],
    owner: { name: "Marcus Webb", initials: "MW" },
    lastChangedLabel: "1 week ago",
    eligibleUsers: 480000,
    enrolledUsers: 480000,
    rollbackEventsThisMonth: 1,
    history: [60, 72, 84, 92, 97, 100, 100],
    daysToFull: 34,
  },
  {
    id: "ai-search-suggestions",
    key: "ai-search-suggestions",
    name: "AI search suggestions",
    status: "active",
    rolloutPct: 18,
    segments: ["Beta testers", "Enterprise"],
    owner: { name: "Priya Nair", initials: "PN" },
    lastChangedLabel: "yesterday",
    eligibleUsers: 52000,
    enrolledUsers: 9360,
    rollbackEventsThisMonth: 0,
    history: [4, 7, 10, 13, 15, 17, 18],
  },
  {
    id: "billing-v3-invoices",
    key: "billing-v3-invoices",
    name: "Billing v3 invoices",
    status: "paused",
    rolloutPct: 42,
    segments: ["EU region"],
    owner: { name: "Diego Alvarez", initials: "DA" },
    lastChangedLabel: "5 days ago",
    eligibleUsers: 96000,
    enrolledUsers: 40320,
    rollbackEventsThisMonth: 2,
    history: [10, 22, 35, 42, 42, 42, 42],
  },
  {
    id: "mobile-push-opt-in",
    key: "mobile-push-opt-in",
    name: "Mobile push opt-in",
    status: "active",
    rolloutPct: 100,
    segments: ["All users"],
    owner: { name: "Marcus Webb", initials: "MW" },
    lastChangedLabel: "3 weeks ago",
    eligibleUsers: 480000,
    enrolledUsers: 480000,
    rollbackEventsThisMonth: 0,
    history: [70, 82, 90, 95, 98, 100, 100],
    daysToFull: 21,
  },
  {
    id: "referral-program-v2",
    key: "referral-program-v2",
    name: "Referral program v2",
    status: "active",
    rolloutPct: 30,
    segments: ["US region", "Invite-only"],
    owner: { name: "Jun Ha Lee", initials: "JL" },
    lastChangedLabel: "4 days ago",
    eligibleUsers: 210000,
    enrolledUsers: 63000,
    rollbackEventsThisMonth: 0,
    history: [8, 14, 19, 23, 26, 28, 30],
  },
  {
    id: "legacy-api-sunset",
    key: "legacy-api-sunset",
    name: "Legacy API sunset",
    status: "archived",
    rolloutPct: 0,
    segments: ["Internal"],
    owner: { name: "Diego Alvarez", initials: "DA" },
    lastChangedLabel: "2 months ago",
    eligibleUsers: 1200,
    enrolledUsers: 0,
    rollbackEventsThisMonth: 0,
    history: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "onboarding-checklist-v4",
    key: "onboarding-checklist-v4",
    name: "Onboarding checklist v4",
    status: "active",
    rolloutPct: 100,
    segments: ["All users"],
    owner: { name: "Jun Ha Lee", initials: "JL" },
    lastChangedLabel: "6 weeks ago",
    eligibleUsers: 480000,
    enrolledUsers: 480000,
    rollbackEventsThisMonth: 0,
    history: [50, 68, 80, 90, 96, 100, 100],
    daysToFull: 18,
  },
  {
    id: "export-to-csv-beta",
    key: "export-to-csv-beta",
    name: "Export to CSV beta",
    status: "active",
    rolloutPct: 8,
    segments: ["Enterprise"],
    owner: { name: "Priya Nair", initials: "PN" },
    lastChangedLabel: "today",
    eligibleUsers: 14000,
    enrolledUsers: 1120,
    rollbackEventsThisMonth: 1,
    history: [0, 2, 4, 5, 6, 7, 8],
  },
];

export const FLAG_BY_ID: Map<string, Flag> = new Map(FLAGS.map((f) => [f.id, f]));

export const ACTIVE_FLAGS = FLAGS.filter((f) => f.status === "active");
export const PAUSED_FLAGS = FLAGS.filter((f) => f.status === "paused");
export const ARCHIVED_FLAGS = FLAGS.filter((f) => f.status === "archived");

/** Workspace-wide hero metric: eligible-user-weighted enrollment across active flags only. */
export const ELIGIBLE_ACTIVE_TOTAL = ACTIVE_FLAGS.reduce((sum, f) => sum + f.eligibleUsers, 0);
export const ENROLLED_ACTIVE_TOTAL = ACTIVE_FLAGS.reduce((sum, f) => sum + f.enrolledUsers, 0);
export const ENROLLED_PCT = Math.round((ENROLLED_ACTIVE_TOTAL / ELIGIBLE_ACTIVE_TOTAL) * 1000) / 10;

export const FLAGS_AT_FULL = FLAGS.filter((f) => f.rolloutPct === 100).length;
export const SEGMENTS_TARGETED = new Set(ACTIVE_FLAGS.flatMap((f) => f.segments)).size;
export const ROLLBACK_EVENTS_THIS_MONTH = FLAGS.reduce((sum, f) => sum + f.rollbackEventsThisMonth, 0);

const FLAGS_WITH_DAYS_TO_FULL = FLAGS.filter((f): f is Flag & { daysToFull: number } => f.daysToFull !== undefined);
export const AVG_DAYS_TO_FULL = Math.round(
  FLAGS_WITH_DAYS_TO_FULL.reduce((sum, f) => sum + f.daysToFull, 0) / FLAGS_WITH_DAYS_TO_FULL.length,
);

/**
 * Hero sparkline: six hand-authored historical snapshots (prior reporting checkpoints, not tied to
 * a real calendar) plus ENROLLED_PCT itself as the final point — so the chart's most recent value
 * is always exactly the number rendered beside it, never a separately hand-typed figure that could
 * drift from it.
 */
export const HERO_TREND: number[] = [71.2, 74.8, 77.3, 79.0, 80.6, 81.9, ENROLLED_PCT];

/** The one flag promoted into the small waffle-grid tile — chosen because it is mid-rollout
 *  (neither 0% nor 100%), which is the most legible case for a fill-grid visualization. */
export const SPOTLIGHT_FLAG_ID = "checkout-redesign-v2";

export function fmtCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
    trailingZeroDisplay: "stripIfInteger",
  }).format(n);
}

export const numberFmt = new Intl.NumberFormat("en-US");

export const STATUS_LABEL: Record<FlagStatus, string> = {
  active: "Active",
  paused: "Paused",
  archived: "Archived",
};
