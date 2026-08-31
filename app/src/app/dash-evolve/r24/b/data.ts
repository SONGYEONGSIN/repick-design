// Deterministic dummy data for the Sluice rollout console. No Math.random / Date.now anywhere —
// every figure below is a fixed literal so the page renders identically on every load and the
// rollout-percentage math (see apportion/deriveRollout) reconciles exactly at any percentage.

export type Env = "dev" | "staging" | "prod";
export type FlagStatus = "active" | "paused" | "draft";

export type Rule = {
  id: string;
  attribute: string;
  operator: string;
  value: string;
};

export type ActivityEntry = {
  id: string;
  date: string;
  text: string;
  actor: string;
};

export type SegmentId = "enterprise" | "smb" | "free" | "trial" | "internal";

export type FlagRecord = {
  id: string;
  key: string;
  name: string;
  description: string;
  status: FlagStatus;
  owner: { name: string; seed: string };
  environments: Record<Env, { eligibleUsers: number; rolloutPct: number }>;
  segmentShares: Record<SegmentId, number>;
  rules: Rule[];
  trend: number[]; // 14-day prod rollout % history, oldest first
  activity: ActivityEntry[];
};

export const SEGMENTS: { id: SegmentId; label: string }[] = [
  { id: "enterprise", label: "Enterprise" },
  { id: "smb", label: "SMB" },
  { id: "free", label: "Free tier" },
  { id: "trial", label: "Trial" },
  { id: "internal", label: "Internal / QA" },
];

export const ATTRIBUTE_OPTIONS = [
  "plan",
  "country",
  "device type",
  "signup cohort",
  "referrer",
  "sso enabled",
  "region",
  "browser",
] as const;

export const OPERATOR_OPTIONS = [
  "is",
  "is not",
  "is one of",
  "contains",
  "is after",
  "is before",
] as const;

export const ENVIRONMENTS: { id: Env; label: string }[] = [
  { id: "dev", label: "Dev" },
  { id: "staging", label: "Staging" },
  { id: "prod", label: "Prod" },
];

export const FLAGS: FlagRecord[] = [
  {
    id: "checkout-express-v2",
    key: "checkout-express-v2",
    name: "Checkout Express Redesign",
    description: "Streamlined single-page checkout with saved payment methods.",
    status: "active",
    owner: { name: "Priya Nair", seed: "sluice-owner-priya" },
    environments: {
      dev: { eligibleUsers: 1200, rolloutPct: 100 },
      staging: { eligibleUsers: 9400, rolloutPct: 100 },
      prod: { eligibleUsers: 412000, rolloutPct: 35 },
    },
    segmentShares: { enterprise: 0.16, smb: 0.3, free: 0.38, trial: 0.11, internal: 0.05 },
    rules: [
      { id: "r1", attribute: "plan", operator: "is one of", value: "Growth, Enterprise" },
      { id: "r2", attribute: "country", operator: "is", value: "US" },
    ],
    trend: [5, 5, 10, 10, 15, 15, 20, 20, 25, 25, 30, 30, 35, 35],
    activity: [
      { id: "a1", date: "Aug 24, 2026", text: "Rollout increased to 35% in prod", actor: "Priya Nair" },
      { id: "a2", date: "Aug 18, 2026", text: "Targeting rule added: country is US", actor: "Priya Nair" },
      { id: "a3", date: "Aug 6, 2026", text: "Flag created", actor: "Priya Nair" },
    ],
  },
  {
    id: "ai-copilot-panel",
    key: "ai-copilot-panel",
    name: "AI Copilot Panel",
    description: "In-app AI assistant panel for drafting responses.",
    status: "active",
    owner: { name: "Marcus Lee", seed: "sluice-owner-marcus" },
    environments: {
      dev: { eligibleUsers: 800, rolloutPct: 100 },
      staging: { eligibleUsers: 6200, rolloutPct: 80 },
      prod: { eligibleUsers: 188000, rolloutPct: 12 },
    },
    segmentShares: { enterprise: 0.22, smb: 0.28, free: 0.33, trial: 0.12, internal: 0.05 },
    rules: [
      { id: "r1", attribute: "plan", operator: "is not", value: "Free" },
      { id: "r2", attribute: "signup cohort", operator: "is after", value: "2026-01-01" },
    ],
    trend: [0, 0, 0, 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 12],
    activity: [
      { id: "a1", date: "Aug 27, 2026", text: "Rollout increased to 12% in prod", actor: "Marcus Lee" },
      { id: "a2", date: "Aug 20, 2026", text: "Targeting rule added: plan is not Free", actor: "Marcus Lee" },
      { id: "a3", date: "Aug 12, 2026", text: "Flag created", actor: "Marcus Lee" },
    ],
  },
  {
    id: "dark-mode-default",
    key: "dark-mode-default",
    name: "Dark Mode by Default",
    description: "Switches the default theme to dark for new sessions.",
    status: "paused",
    owner: { name: "Ada Fields", seed: "sluice-owner-ada" },
    environments: {
      dev: { eligibleUsers: 1500, rolloutPct: 100 },
      staging: { eligibleUsers: 11200, rolloutPct: 50 },
      prod: { eligibleUsers: 356000, rolloutPct: 18 },
    },
    segmentShares: { enterprise: 0.14, smb: 0.32, free: 0.4, trial: 0.09, internal: 0.05 },
    rules: [{ id: "r1", attribute: "device type", operator: "is", value: "Desktop" }],
    trend: [22, 22, 20, 20, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
    activity: [
      { id: "a1", date: "Aug 21, 2026", text: "Rollout paused at 18% in prod — contrast bug reported", actor: "Ada Fields" },
      { id: "a2", date: "Aug 14, 2026", text: "Rollout increased to 22% in prod", actor: "Ada Fields" },
      { id: "a3", date: "Jul 30, 2026", text: "Flag created", actor: "Ada Fields" },
    ],
  },
  {
    id: "pricing-page-redesign",
    key: "pricing-page-redesign",
    name: "Pricing Page Redesign",
    description: "New pricing page layout with usage-based tiers.",
    status: "active",
    owner: { name: "Devon Cole", seed: "sluice-owner-devon" },
    environments: {
      dev: { eligibleUsers: 900, rolloutPct: 100 },
      staging: { eligibleUsers: 7100, rolloutPct: 100 },
      prod: { eligibleUsers: 520000, rolloutPct: 50 },
    },
    segmentShares: { enterprise: 0.12, smb: 0.34, free: 0.41, trial: 0.1, internal: 0.03 },
    rules: [
      { id: "r1", attribute: "country", operator: "is one of", value: "US, CA, GB" },
      { id: "r2", attribute: "referrer", operator: "contains", value: "utm_campaign=q3-pricing" },
    ],
    trend: [10, 10, 20, 20, 25, 30, 30, 35, 40, 40, 45, 45, 50, 50],
    activity: [
      { id: "a1", date: "Aug 29, 2026", text: "Rollout increased to 50% in prod", actor: "Devon Cole" },
      { id: "a2", date: "Aug 22, 2026", text: "Targeting rule added: referrer contains utm_campaign=q3-pricing", actor: "Devon Cole" },
      { id: "a3", date: "Aug 9, 2026", text: "Flag created", actor: "Devon Cole" },
    ],
  },
  {
    id: "bulk-export-csv",
    key: "bulk-export-csv",
    name: "Bulk CSV Export",
    description: "Bulk data export to CSV for reporting workflows.",
    status: "active",
    owner: { name: "Priya Nair", seed: "sluice-owner-priya" },
    environments: {
      dev: { eligibleUsers: 700, rolloutPct: 100 },
      staging: { eligibleUsers: 5400, rolloutPct: 100 },
      prod: { eligibleUsers: 97000, rolloutPct: 60 },
    },
    segmentShares: { enterprise: 0.3, smb: 0.35, free: 0.2, trial: 0.05, internal: 0.1 },
    rules: [{ id: "r1", attribute: "plan", operator: "is one of", value: "Team, Enterprise" }],
    trend: [40, 40, 45, 45, 50, 50, 52, 52, 55, 55, 58, 58, 60, 60],
    activity: [
      { id: "a1", date: "Aug 26, 2026", text: "Rollout increased to 60% in prod", actor: "Priya Nair" },
      { id: "a2", date: "Aug 16, 2026", text: "Targeting rule added: plan is one of Team, Enterprise", actor: "Priya Nair" },
      { id: "a3", date: "Jul 22, 2026", text: "Flag created", actor: "Priya Nair" },
    ],
  },
  {
    id: "onboarding-tooltips-v3",
    key: "onboarding-tooltips-v3",
    name: "Onboarding Tooltips v3",
    description: "Third revision of the first-run onboarding tooltip sequence.",
    status: "draft",
    owner: { name: "Marcus Lee", seed: "sluice-owner-marcus" },
    environments: {
      dev: { eligibleUsers: 1100, rolloutPct: 40 },
      staging: { eligibleUsers: 8300, rolloutPct: 0 },
      prod: { eligibleUsers: 402000, rolloutPct: 0 },
    },
    segmentShares: { enterprise: 0.1, smb: 0.28, free: 0.44, trial: 0.13, internal: 0.05 },
    rules: [],
    trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    activity: [{ id: "a1", date: "Aug 25, 2026", text: "Flag created as draft", actor: "Marcus Lee" }],
  },
  {
    id: "sso-enforced-login",
    key: "sso-enforced-login",
    name: "SSO Enforced Login",
    description: "Requires SSO authentication for enterprise workspaces.",
    status: "active",
    owner: { name: "Ada Fields", seed: "sluice-owner-ada" },
    environments: {
      dev: { eligibleUsers: 600, rolloutPct: 100 },
      staging: { eligibleUsers: 4800, rolloutPct: 100 },
      prod: { eligibleUsers: 68000, rolloutPct: 100 },
    },
    segmentShares: { enterprise: 0.82, smb: 0.12, free: 0.02, trial: 0.02, internal: 0.02 },
    rules: [
      { id: "r1", attribute: "plan", operator: "is", value: "Enterprise" },
      { id: "r2", attribute: "sso enabled", operator: "is", value: "true" },
    ],
    trend: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    activity: [
      { id: "a1", date: "Jul 3, 2026", text: "Rollout reached 100% in prod", actor: "Ada Fields" },
      { id: "a2", date: "Jun 20, 2026", text: "Targeting rule added: sso enabled is true", actor: "Ada Fields" },
      { id: "a3", date: "Jun 8, 2026", text: "Flag created", actor: "Ada Fields" },
    ],
  },
  {
    id: "search-relevance-rerank",
    key: "search-relevance-rerank",
    name: "Search Relevance Rerank",
    description: "ML re-ranking layer for search result relevance.",
    status: "paused",
    owner: { name: "Devon Cole", seed: "sluice-owner-devon" },
    environments: {
      dev: { eligibleUsers: 1300, rolloutPct: 100 },
      staging: { eligibleUsers: 9800, rolloutPct: 45 },
      prod: { eligibleUsers: 244000, rolloutPct: 8 },
    },
    segmentShares: { enterprise: 0.2, smb: 0.3, free: 0.35, trial: 0.1, internal: 0.05 },
    rules: [
      { id: "r1", attribute: "country", operator: "is", value: "US" },
      { id: "r2", attribute: "device type", operator: "is not", value: "Mobile web" },
    ],
    trend: [15, 15, 15, 12, 12, 10, 10, 10, 8, 8, 8, 8, 8, 8],
    activity: [
      { id: "a1", date: "Aug 19, 2026", text: "Rollout paused at 8% in prod — latency regression under review", actor: "Devon Cole" },
      { id: "a2", date: "Aug 11, 2026", text: "Rollout reduced to 8% in prod", actor: "Devon Cole" },
      { id: "a3", date: "Jul 28, 2026", text: "Flag created", actor: "Devon Cole" },
    ],
  },
];

/**
 * Largest-remainder apportionment: splits `total` across `weights` so every share is a whole
 * number AND the shares sum to exactly `total` (never total-1 or total+1 from naive rounding).
 * This is what keeps the audience-segment breakdown reconciled at every rollout percentage.
 */
export function apportion(total: number, weights: number[]): number[] {
  const sumW = weights.reduce((a, b) => a + b, 0);
  if (sumW <= 0 || total <= 0) return weights.map(() => 0);
  const raw = weights.map((w) => (w / sumW) * total);
  const floors = raw.map(Math.floor);
  const allocated = floors.reduce((a, b) => a + b, 0);
  let remainder = total - allocated;
  const order = raw
    .map((r, i) => ({ i, frac: r - floors[i] }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  const result = [...floors];
  let k = 0;
  while (remainder > 0 && order.length > 0) {
    result[order[k % order.length].i] += 1;
    remainder -= 1;
    k += 1;
  }
  return result;
}

export type SegmentBreakdown = {
  id: SegmentId;
  label: string;
  eligible: number;
  included: number;
  excluded: number;
};

export type RolloutView = {
  totalEligible: number;
  impactedTotal: number;
  segments: SegmentBreakdown[];
};

/**
 * The single re-encoding function: given a flag, an environment and a rollout percentage, derive
 * every number the right pane shows. Selecting a different flag or environment simply calls this
 * again with a different baseline — it never swaps in a pre-baked static block, and moving the
 * rollout percentage always recomputes through the same path, so segment sums always reconcile to
 * the flag/environment's true eligible population.
 */
export function deriveRollout(flag: FlagRecord, env: Env, pct: number): RolloutView {
  const totalEligible = flag.environments[env].eligibleUsers;
  const impactedTotal = Math.round((totalEligible * pct) / 100);
  const weights = SEGMENTS.map((s) => flag.segmentShares[s.id]);
  const segEligible = apportion(totalEligible, weights);
  const segIncluded = apportion(impactedTotal, segEligible);
  const segments: SegmentBreakdown[] = SEGMENTS.map((s, i) => ({
    id: s.id,
    label: s.label,
    eligible: segEligible[i],
    included: segIncluded[i],
    excluded: segEligible[i] - segIncluded[i],
  }));
  return { totalEligible, impactedTotal, segments };
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
