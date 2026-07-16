// Deterministic dummy data for Ridgeline — no Math.random / Date.now / bare `new Date()`.
// All timestamps are pre-formatted static strings. "Today" in this fixture is
// fixed at Jul 16, 2026 (mid Cycle 14, which runs Jul 13 – Jul 26, 2026).

export type IssueStatus =
  | "backlog"
  | "todo"
  | "in-progress"
  | "in-review"
  | "done"
  | "cancelled";

export type Priority = "urgent" | "high" | "medium" | "low" | "none";

export const WORKSPACE = {
  org: "Anchor Robotics",
  team: "Platform Engineering",
  project: "Core Platform",
  plan: "Business plan",
};

export const CURRENT_CYCLE = {
  label: "Cycle 14",
  range: "Jul 13 – Jul 26, 2026",
  daysLeftLabel: "10 days left",
};

export const CURRENT_USER_ID = "m-jordan";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

export const MEMBERS: Member[] = [
  {
    id: "m-jordan",
    name: "Jordan Vance",
    role: "Senior Engineer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "JV",
  },
  {
    id: "m-maya",
    name: "Maya Torres",
    role: "Staff Engineer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "MT",
  },
  {
    id: "m-elliot",
    name: "Elliot Cho",
    role: "Backend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "EC",
  },
  {
    id: "m-priya",
    name: "Priya Deshmukh",
    role: "Frontend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "PD",
  },
  {
    id: "m-sam",
    name: "Sam Okafor",
    role: "Platform Engineer",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "SO",
  },
  {
    id: "m-nadia",
    name: "Nadia Petrov",
    role: "QA Engineer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "NP",
  },
  {
    id: "m-owen",
    name: "Owen Blake",
    role: "Engineering Manager",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "OB",
  },
  {
    id: "m-grace",
    name: "Grace Lindholm",
    role: "Product Designer",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "GL",
  },
];

export function memberById(id: string | null | undefined): Member | undefined {
  return MEMBERS.find((m) => m.id === id);
}

export const STATUS_ORDER: IssueStatus[] = [
  "in-progress",
  "in-review",
  "todo",
  "backlog",
  "done",
  "cancelled",
];

export const STATUS_META: Record<
  IssueStatus,
  { label: string; badgeClass: string; swatch: string }
> = {
  backlog: {
    label: "Backlog",
    badgeClass: "bg-zinc-100 text-zinc-600 border-zinc-200",
    swatch: "bg-zinc-400",
  },
  todo: {
    label: "Todo",
    badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-300",
    swatch: "bg-zinc-500",
  },
  "in-progress": {
    label: "In Progress",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    swatch: "bg-amber-500",
  },
  "in-review": {
    label: "In Review",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
    swatch: "bg-violet-500",
  },
  done: {
    label: "Done",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    swatch: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-zinc-100 text-zinc-500 border-zinc-200",
    swatch: "bg-zinc-400",
  },
};

export const PRIORITY_ORDER: Priority[] = ["urgent", "high", "medium", "low", "none"];

export const PRIORITY_META: Record<Priority, { label: string; textClass: string }> = {
  urgent: { label: "Urgent", textClass: "text-rose-600" },
  high: { label: "High", textClass: "text-zinc-700" },
  medium: { label: "Medium", textClass: "text-zinc-700" },
  low: { label: "Low", textClass: "text-zinc-500" },
  none: { label: "No priority", textClass: "text-zinc-400" },
};

export const LABEL_META: Record<string, { badgeClass: string }> = {
  Bug: { badgeClass: "bg-rose-50 text-rose-700 border-rose-200" },
  Feature: { badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  Perf: { badgeClass: "bg-amber-50 text-amber-800 border-amber-200" },
  Infra: { badgeClass: "bg-sky-50 text-sky-700 border-sky-200" },
  Design: { badgeClass: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
  Docs: { badgeClass: "bg-zinc-100 text-zinc-600 border-zinc-200" },
  Security: { badgeClass: "bg-orange-50 text-orange-700 border-orange-200" },
  DX: { badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export interface SubIssue {
  id: string;
  title: string;
  done: boolean;
}

export interface LinkedPr {
  id: string;
  title: string;
  status: "open" | "merged" | "draft";
}

export type ActivityType =
  | "created"
  | "status"
  | "priority"
  | "label"
  | "comment"
  | "pr"
  | "assigned";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actorId: string;
  timestampLabel: string;
  text: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  assigneeId: string | null;
  labels: string[];
  cycle: string;
  estimate: number;
  createdLabel: string;
  updatedLabel: string;
  subIssues?: SubIssue[];
  linkedPr?: LinkedPr;
  activity: ActivityEvent[];
}

export const ISSUES: Issue[] = [
  // ---- Backlog ----
  {
    id: "COR-401",
    title: "Support multi-region fleet telemetry ingestion",
    description:
      "Fleet operators running devices across US, EU, and APAC need telemetry ingested in-region before aggregation, to keep latency low and satisfy data residency requirements for enterprise customers.",
    status: "backlog",
    priority: "medium",
    assigneeId: null,
    labels: ["Feature", "Infra"],
    cycle: "Backlog",
    estimate: 8,
    createdLabel: "Jun 22",
    updatedLabel: "Jun 22",
    activity: [
      { id: "a1", type: "created", actorId: "m-owen", timestampLabel: "Jun 22, 9:10 AM", text: "created this issue" },
      { id: "a2", type: "label", actorId: "m-owen", timestampLabel: "Jun 22, 9:11 AM", text: "added labels Feature, Infra" },
    ],
  },
  {
    id: "COR-398",
    title: "Investigate GraphQL query batching for fleet API",
    description:
      "The fleet ops console fires up to 40 separate queries on initial load. Batching related queries into a single round trip should cut first-paint latency meaningfully on slower connections.",
    status: "backlog",
    priority: "low",
    assigneeId: "m-elliot",
    labels: ["Feature", "Perf"],
    cycle: "Backlog",
    estimate: 5,
    createdLabel: "Jun 20",
    updatedLabel: "Jun 24",
    activity: [
      { id: "a1", type: "created", actorId: "m-elliot", timestampLabel: "Jun 20, 3:40 PM", text: "created this issue" },
      { id: "a2", type: "comment", actorId: "m-elliot", timestampLabel: "Jun 24, 11:02 AM", text: "Prototyped DataLoader-style batching locally, ~35% fewer round trips. Needs a proper spike before scheduling." },
    ],
  },
  {
    id: "COR-388",
    title: "Add dark mode to fleet ops console",
    description:
      "Night-shift fleet operators have asked for a dark theme. Scope: theme tokens, console shell, map overlay contrast, and persisting the preference per user.",
    status: "backlog",
    priority: "low",
    assigneeId: null,
    labels: ["Design"],
    cycle: "Backlog",
    estimate: 3,
    createdLabel: "Jun 18",
    updatedLabel: "Jun 18",
    activity: [
      { id: "a1", type: "created", actorId: "m-grace", timestampLabel: "Jun 18, 4:05 PM", text: "created this issue" },
    ],
  },
  {
    id: "COR-377",
    title: "Deprecate legacy v1 telemetry endpoint",
    description:
      "The v1 telemetry endpoint has been superseded by v2 for 11 months. Remaining traffic is under 2% and comes from three customers already migrating. Plan a sunset date and shut it down.",
    status: "backlog",
    priority: "medium",
    assigneeId: "m-maya",
    labels: ["Infra"],
    cycle: "Backlog",
    estimate: 5,
    createdLabel: "Jun 12",
    updatedLabel: "Jun 29",
    activity: [
      { id: "a1", type: "created", actorId: "m-maya", timestampLabel: "Jun 12, 10:00 AM", text: "created this issue" },
      { id: "a2", type: "comment", actorId: "m-maya", timestampLabel: "Jun 29, 2:15 PM", text: "Reached out to the last three v1 customers about migrating; two have confirmed a target date." },
    ],
  },
  {
    id: "COR-365",
    title: "Evaluate managed Kafka vs. self-hosted for event bus",
    description:
      "Our self-hosted event bus is becoming an operational burden. Compare a managed offering against continued self-hosting on cost, latency, and on-call load before committing to Q4 infra budget.",
    status: "backlog",
    priority: "medium",
    assigneeId: "m-sam",
    labels: ["Infra"],
    cycle: "Backlog",
    estimate: 13,
    createdLabel: "Jun 8",
    updatedLabel: "Jul 2",
    activity: [
      { id: "a1", type: "created", actorId: "m-sam", timestampLabel: "Jun 8, 1:30 PM", text: "created this issue" },
      { id: "a2", type: "comment", actorId: "m-sam", timestampLabel: "Jul 2, 9:45 AM", text: "First cost model puts managed Kafka at roughly 1.4x current spend, but removes ~6 on-call hours/week." },
    ],
  },
  {
    id: "COR-354",
    title: "Draft SDK v3 migration guide",
    description:
      "SDK v3 changes the authentication flow and renames several telemetry client methods. Draft a migration guide covering breaking changes and a codemod for the common cases.",
    status: "backlog",
    priority: "low",
    assigneeId: "m-priya",
    labels: ["Docs"],
    cycle: "Backlog",
    estimate: 3,
    createdLabel: "Jun 5",
    updatedLabel: "Jun 5",
    activity: [
      { id: "a1", type: "created", actorId: "m-priya", timestampLabel: "Jun 5, 5:20 PM", text: "created this issue" },
    ],
  },

  // ---- Todo ----
  {
    id: "COR-452",
    title: "Firmware OTA rollback fails on partial download",
    description:
      "If an OTA update is interrupted mid-download, the rollback path leaves the device reporting a corrupted firmware slot instead of reverting to the previous known-good image.",
    status: "todo",
    priority: "high",
    assigneeId: "m-nadia",
    labels: ["Bug"],
    cycle: "Cycle 14",
    estimate: 5,
    createdLabel: "Jul 9",
    updatedLabel: "Jul 12",
    activity: [
      { id: "a1", type: "created", actorId: "m-nadia", timestampLabel: "Jul 9, 8:50 AM", text: "created this issue" },
      { id: "a2", type: "comment", actorId: "m-nadia", timestampLabel: "Jul 12, 3:30 PM", text: "Reproduced on 3 of 5 device models. Slot B checksum isn't validated before the rollback marks it active." },
      { id: "a3", type: "priority", actorId: "m-owen", timestampLabel: "Jul 12, 4:00 PM", text: "changed priority to High" },
    ],
  },
  {
    id: "COR-449",
    title: "Rate limit fleet API per API key, not per IP",
    description:
      "Several enterprise customers proxy all fleet API traffic through a single NAT gateway, so our per-IP rate limiting throttles every device behind it together. Limits should key off the API key instead.",
    status: "todo",
    priority: "medium",
    assigneeId: "m-elliot",
    labels: ["Feature", "Security"],
    cycle: "Cycle 14",
    estimate: 5,
    createdLabel: "Jul 6",
    updatedLabel: "Jul 10",
    activity: [
      { id: "a1", type: "created", actorId: "m-elliot", timestampLabel: "Jul 6, 11:15 AM", text: "created this issue" },
      { id: "a2", type: "label", actorId: "m-elliot", timestampLabel: "Jul 10, 9:00 AM", text: "added label Security" },
    ],
  },
  {
    id: "COR-447",
    title: "Command queue drops messages under backpressure",
    description:
      "When the command dispatch queue backs up past ~20k pending commands, new enqueue calls silently fail instead of shedding load with a clear error the caller can retry on.",
    status: "todo",
    priority: "urgent",
    assigneeId: "m-sam",
    labels: ["Bug", "Infra"],
    cycle: "Cycle 14",
    estimate: 8,
    createdLabel: "Jul 13",
    updatedLabel: "Jul 15",
    activity: [
      { id: "a1", type: "created", actorId: "m-sam", timestampLabel: "Jul 13, 2:05 PM", text: "created this issue" },
      { id: "a2", type: "priority", actorId: "m-sam", timestampLabel: "Jul 13, 2:06 PM", text: "changed priority to Urgent" },
      { id: "a3", type: "comment", actorId: "m-owen", timestampLabel: "Jul 15, 10:20 AM", text: "This is affecting two enterprise fleets today. Please pick up right after COR-482." },
    ],
  },
  {
    id: "COR-441",
    title: "Add audit log export to CSV",
    description:
      "Compliance teams at two enterprise customers have asked for a self-serve CSV export of the workspace audit log, rather than filing a support ticket for each request.",
    status: "todo",
    priority: "low",
    assigneeId: "m-jordan",
    labels: ["Feature"],
    cycle: "Cycle 14",
    estimate: 3,
    createdLabel: "Jul 8",
    updatedLabel: "Jul 11",
    activity: [
      { id: "a1", type: "created", actorId: "m-jordan", timestampLabel: "Jul 8, 9:40 AM", text: "created this issue" },
      { id: "a2", type: "assigned", actorId: "m-owen", timestampLabel: "Jul 11, 1:00 PM", text: "assigned this to Jordan Vance" },
    ],
  },
  {
    id: "COR-436",
    title: "Onboarding checklist skips device pairing step",
    description:
      "New workspaces created via the self-serve signup flow skip straight to the dashboard, without the device pairing walkthrough that's shown for sales-assisted signups.",
    status: "todo",
    priority: "medium",
    assigneeId: "m-priya",
    labels: ["Bug", "DX"],
    cycle: "Cycle 14",
    estimate: 2,
    createdLabel: "Jul 7",
    updatedLabel: "Jul 9",
    activity: [
      { id: "a1", type: "created", actorId: "m-priya", timestampLabel: "Jul 7, 4:30 PM", text: "created this issue" },
      { id: "a2", type: "comment", actorId: "m-priya", timestampLabel: "Jul 9, 10:05 AM", text: "Traced it to a feature flag mismatch between the two signup paths." },
    ],
  },

  // ---- In Progress ----
  {
    id: "COR-482",
    title: "Telemetry pipeline drops packets above 50k msgs/sec",
    description:
      "Under sustained load above roughly 50k messages/sec, ingest workers begin dropping UDP telemetry packets before they reach the dedupe stage. Packet loss correlates tightly with GC pauses during batching-buffer resize, which suggests the ring buffer grow path isn't safe under concurrent writers from multiple fleet shards.",
    status: "in-progress",
    priority: "urgent",
    assigneeId: "m-jordan",
    labels: ["Bug", "Perf"],
    cycle: "Cycle 14",
    estimate: 8,
    createdLabel: "Jul 8",
    updatedLabel: "Jul 16, 8:30 AM",
    subIssues: [
      { id: "s1", title: "Reproduce packet loss with synthetic load generator", done: true },
      { id: "s2", title: "Profile GC pauses during ring buffer resize", done: true },
      { id: "s3", title: "Prototype lock-free ring buffer", done: false },
      { id: "s4", title: "Load test fix against staging fleet-shard-04", done: false },
    ],
    linkedPr: { id: "PR-1188", title: "fix(ingest): lock-free ring buffer for telemetry batching", status: "open" },
    activity: [
      { id: "a1", type: "created", actorId: "m-jordan", timestampLabel: "Jul 8, 10:12 AM", text: "created this issue" },
      { id: "a2", type: "label", actorId: "m-jordan", timestampLabel: "Jul 8, 10:13 AM", text: "added label Bug" },
      { id: "a3", type: "status", actorId: "m-owen", timestampLabel: "Jul 8, 2:40 PM", text: "moved this to Todo" },
      { id: "a4", type: "comment", actorId: "m-sam", timestampLabel: "Jul 9, 9:05 AM", text: "Confirmed on fleet-shard-04 — packet loss starts around 48k msgs/sec, matches the GC pause window exactly." },
      { id: "a5", type: "status", actorId: "m-jordan", timestampLabel: "Jul 10, 11:00 AM", text: "moved this to In Progress" },
      { id: "a6", type: "priority", actorId: "m-jordan", timestampLabel: "Jul 10, 11:02 AM", text: "changed priority to Urgent" },
      { id: "a7", type: "comment", actorId: "m-jordan", timestampLabel: "Jul 12, 4:20 PM", text: "Ring buffer resize path isn't lock-free — writers from other shards can interleave during grow(). That's the likely root cause." },
      { id: "a8", type: "pr", actorId: "m-jordan", timestampLabel: "Jul 14, 9:47 AM", text: "opened PR-1188: fix(ingest): lock-free ring buffer for telemetry batching" },
      { id: "a9", type: "comment", actorId: "m-maya", timestampLabel: "Jul 15, 1:15 PM", text: "Nice catch. Can we get a load test against fleet-shard-04 before merging?" },
      { id: "a10", type: "comment", actorId: "m-jordan", timestampLabel: "Jul 16, 8:30 AM", text: "Load test queued against fleet-shard-04, should have results by end of day." },
    ],
  },
  {
    id: "COR-479",
    title: "Migrate device registry to Postgres partitioning",
    description:
      "The device registry table has crossed 40M rows and query planning time is climbing. Partition by fleet_id so per-fleet lookups stay fast as customers keep adding devices.",
    status: "in-progress",
    priority: "high",
    assigneeId: "m-sam",
    labels: ["Infra"],
    cycle: "Cycle 14",
    estimate: 8,
    createdLabel: "Jul 3",
    updatedLabel: "Jul 15",
    subIssues: [
      { id: "s1", title: "Add partition key migration script", done: true },
      { id: "s2", title: "Backfill existing rows into partitions", done: true },
      { id: "s3", title: "Cut over read traffic to partitioned tables", done: false },
      { id: "s4", title: "Remove legacy unpartitioned table", done: false },
    ],
    activity: [
      { id: "a1", type: "created", actorId: "m-sam", timestampLabel: "Jul 3, 9:00 AM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-sam", timestampLabel: "Jul 6, 2:00 PM", text: "moved this to In Progress" },
      { id: "a3", type: "comment", actorId: "m-sam", timestampLabel: "Jul 15, 4:45 PM", text: "Backfill finished overnight with zero drift against the source table. Read cutover is next." },
    ],
  },
  {
    id: "COR-474",
    title: "Fleet map clustering perf regression on 10k+ devices",
    description:
      "Marker clustering on the live fleet map starts dropping frames once a fleet crosses 10k visible devices. Regression traced to a change in the clustering library's re-index strategy.",
    status: "in-progress",
    priority: "high",
    assigneeId: "m-elliot",
    labels: ["Bug", "Perf"],
    cycle: "Cycle 14",
    estimate: 5,
    createdLabel: "Jul 11",
    updatedLabel: "Jul 15",
    activity: [
      { id: "a1", type: "created", actorId: "m-elliot", timestampLabel: "Jul 11, 3:20 PM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-elliot", timestampLabel: "Jul 12, 9:00 AM", text: "moved this to In Progress" },
      { id: "a3", type: "comment", actorId: "m-elliot", timestampLabel: "Jul 15, 11:10 AM", text: "Bisected to the clustering library bump in COR-409. Pinning the previous version while I patch the re-index path." },
    ],
  },
  {
    id: "COR-468",
    title: "SSO group sync for enterprise workspaces",
    description:
      "Enterprise customers on SAML SSO want workspace role assignment driven by their identity provider's groups, so new hires get correct access automatically instead of a manual invite step.",
    status: "in-progress",
    priority: "medium",
    assigneeId: "m-maya",
    labels: ["Feature", "Security"],
    cycle: "Cycle 14",
    estimate: 8,
    createdLabel: "Jun 30",
    updatedLabel: "Jul 14",
    subIssues: [
      { id: "s1", title: "Design group-to-role mapping schema", done: true },
      { id: "s2", title: "Implement SCIM group sync job", done: false },
      { id: "s3", title: "QA against Okta sandbox tenant", done: false },
      { id: "s4", title: "Write enterprise setup docs", done: false },
    ],
    activity: [
      { id: "a1", type: "created", actorId: "m-maya", timestampLabel: "Jun 30, 10:00 AM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-maya", timestampLabel: "Jul 7, 9:30 AM", text: "moved this to In Progress" },
      { id: "a3", type: "comment", actorId: "m-maya", timestampLabel: "Jul 14, 2:50 PM", text: "Mapping schema signed off with the design partner customer. Starting the SCIM sync job next." },
    ],
  },
  {
    id: "COR-463",
    title: "Command center keyboard shortcuts",
    description:
      "Power users managing large fleets want keyboard shortcuts for the most common actions: acknowledge alert, jump to device, and open the command palette.",
    status: "in-progress",
    priority: "low",
    assigneeId: "m-priya",
    labels: ["Feature", "DX"],
    cycle: "Cycle 14",
    estimate: 3,
    createdLabel: "Jul 10",
    updatedLabel: "Jul 14",
    activity: [
      { id: "a1", type: "created", actorId: "m-priya", timestampLabel: "Jul 10, 1:00 PM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-priya", timestampLabel: "Jul 13, 9:00 AM", text: "moved this to In Progress" },
      { id: "a3", type: "comment", actorId: "m-priya", timestampLabel: "Jul 14, 5:30 PM", text: "First pass lands ⌘K, g+d for jump-to-device, and a for acknowledge. Gathering feedback from the ops team next." },
    ],
  },
  {
    id: "COR-459",
    title: "Alert rule builder validation edge cases",
    description:
      "The alert rule builder accepts threshold combinations that can never fire (for example, greater-than and less-than on the same metric with overlapping ranges) without warning the user.",
    status: "in-progress",
    priority: "medium",
    assigneeId: "m-jordan",
    labels: ["Bug"],
    cycle: "Cycle 14",
    estimate: 3,
    createdLabel: "Jul 12",
    updatedLabel: "Jul 15",
    activity: [
      { id: "a1", type: "created", actorId: "m-nadia", timestampLabel: "Jul 12, 10:40 AM", text: "created this issue" },
      { id: "a2", type: "assigned", actorId: "m-owen", timestampLabel: "Jul 13, 9:00 AM", text: "assigned this to Jordan Vance" },
      { id: "a3", type: "status", actorId: "m-jordan", timestampLabel: "Jul 15, 3:00 PM", text: "moved this to In Progress" },
    ],
  },

  // ---- In Review ----
  {
    id: "COR-455",
    title: "Add retry with jitter to command dispatch",
    description:
      "Command dispatch currently retries on a fixed 1-second interval, which causes thundering-herd retries after a brief outage. Add exponential backoff with jitter, capped at 30 seconds.",
    status: "in-review",
    priority: "high",
    assigneeId: "m-sam",
    labels: ["Infra", "Perf"],
    cycle: "Cycle 14",
    estimate: 5,
    createdLabel: "Jul 5",
    updatedLabel: "Jul 15",
    linkedPr: { id: "PR-1180", title: "feat(dispatch): exponential backoff with jitter for retries", status: "open" },
    activity: [
      { id: "a1", type: "created", actorId: "m-sam", timestampLabel: "Jul 5, 11:00 AM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-sam", timestampLabel: "Jul 9, 9:00 AM", text: "moved this to In Progress" },
      { id: "a3", type: "pr", actorId: "m-sam", timestampLabel: "Jul 13, 4:10 PM", text: "opened PR-1180: feat(dispatch): exponential backoff with jitter for retries" },
      { id: "a4", type: "status", actorId: "m-sam", timestampLabel: "Jul 13, 4:11 PM", text: "moved this to In Review" },
      { id: "a5", type: "comment", actorId: "m-jordan", timestampLabel: "Jul 15, 2:30 PM", text: "LGTM overall — left one comment about the jitter ceiling on the PR." },
    ],
  },
  {
    id: "COR-451",
    title: "Fleet health score v2 algorithm",
    description:
      "The current fleet health score weighs uptime too heavily relative to alert volume. V2 rebalances the weighting and adds a rolling 7-day trend so operators can spot slow degradation earlier.",
    status: "in-review",
    priority: "medium",
    assigneeId: "m-elliot",
    labels: ["Feature"],
    cycle: "Cycle 14",
    estimate: 8,
    createdLabel: "Jun 28",
    updatedLabel: "Jul 14",
    activity: [
      { id: "a1", type: "created", actorId: "m-elliot", timestampLabel: "Jun 28, 3:00 PM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-elliot", timestampLabel: "Jul 8, 10:00 AM", text: "moved this to In Progress" },
      { id: "a3", type: "status", actorId: "m-elliot", timestampLabel: "Jul 14, 1:20 PM", text: "moved this to In Review" },
    ],
  },
  {
    id: "COR-444",
    title: "Device pairing QR code expiry handling",
    description:
      "Pairing QR codes expire after 10 minutes, but the pairing screen doesn't refresh the code or explain why it stopped working, leaving field technicians stuck.",
    status: "in-review",
    priority: "medium",
    assigneeId: "m-nadia",
    labels: ["Bug"],
    cycle: "Cycle 14",
    estimate: 2,
    createdLabel: "Jul 4",
    updatedLabel: "Jul 13",
    activity: [
      { id: "a1", type: "created", actorId: "m-nadia", timestampLabel: "Jul 4, 9:15 AM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-nadia", timestampLabel: "Jul 10, 11:00 AM", text: "moved this to In Progress" },
      { id: "a3", type: "status", actorId: "m-nadia", timestampLabel: "Jul 13, 3:40 PM", text: "moved this to In Review" },
    ],
  },
  {
    id: "COR-439",
    title: "Workspace-level webhook signing keys",
    description:
      "Webhook payloads are unsigned today. Add per-workspace HMAC signing keys, with rotation support, so customers can verify events actually came from Ridgeline.",
    status: "in-review",
    priority: "high",
    assigneeId: "m-maya",
    labels: ["Feature", "Security"],
    cycle: "Cycle 14",
    estimate: 5,
    createdLabel: "Jun 26",
    updatedLabel: "Jul 12",
    linkedPr: { id: "PR-1174", title: "feat(webhooks): HMAC signing keys with rotation", status: "open" },
    activity: [
      { id: "a1", type: "created", actorId: "m-maya", timestampLabel: "Jun 26, 2:00 PM", text: "created this issue" },
      { id: "a2", type: "pr", actorId: "m-maya", timestampLabel: "Jul 11, 5:00 PM", text: "opened PR-1174: feat(webhooks): HMAC signing keys with rotation" },
      { id: "a3", type: "status", actorId: "m-maya", timestampLabel: "Jul 12, 9:00 AM", text: "moved this to In Review" },
    ],
  },

  // ---- Done ----
  {
    id: "COR-430",
    title: "Reduce cold start latency on ingest workers",
    description:
      "Ingest worker cold starts were adding up to 4 seconds of delay after autoscaling events. Trimmed dependency init and pre-warmed connection pools to bring that under 500ms.",
    status: "done",
    priority: "high",
    assigneeId: "m-sam",
    labels: ["Perf", "Infra"],
    cycle: "Cycle 13",
    estimate: 8,
    createdLabel: "Jun 15",
    updatedLabel: "Jun 27",
    linkedPr: { id: "PR-1152", title: "perf(ingest): pre-warm connection pools on cold start", status: "merged" },
    activity: [
      { id: "a1", type: "created", actorId: "m-sam", timestampLabel: "Jun 15, 9:00 AM", text: "created this issue" },
      { id: "a2", type: "pr", actorId: "m-sam", timestampLabel: "Jun 25, 3:00 PM", text: "opened PR-1152: perf(ingest): pre-warm connection pools on cold start" },
      { id: "a3", type: "status", actorId: "m-sam", timestampLabel: "Jun 27, 10:00 AM", text: "moved this to Done" },
    ],
  },
  {
    id: "COR-421",
    title: "Fix timezone drift in scheduled maintenance windows",
    description:
      "Maintenance windows scheduled by customers in non-UTC timezones were being applied an hour off during daylight saving transitions, occasionally firing mid-business-hours.",
    status: "done",
    priority: "medium",
    assigneeId: "m-priya",
    labels: ["Bug"],
    cycle: "Cycle 13",
    estimate: 3,
    createdLabel: "Jun 10",
    updatedLabel: "Jun 20",
    activity: [
      { id: "a1", type: "created", actorId: "m-priya", timestampLabel: "Jun 10, 1:30 PM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-priya", timestampLabel: "Jun 20, 4:00 PM", text: "moved this to Done" },
    ],
  },
  {
    id: "COR-417",
    title: "Add CSV export to fleet inventory table",
    description:
      "Fleet managers wanted a one-click CSV export of the device inventory table, respecting whatever filters and column selection they currently have applied.",
    status: "done",
    priority: "low",
    assigneeId: "m-jordan",
    labels: ["Feature"],
    cycle: "Cycle 14",
    estimate: 3,
    createdLabel: "Jul 1",
    updatedLabel: "Jul 9",
    activity: [
      { id: "a1", type: "created", actorId: "m-jordan", timestampLabel: "Jul 1, 10:00 AM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-jordan", timestampLabel: "Jul 9, 2:15 PM", text: "moved this to Done" },
    ],
  },
  {
    id: "COR-409",
    title: "Upgrade telemetry SDK to v2.4",
    description:
      "Bumped the telemetry client SDK to v2.4 across all first-party integrations, picking up the new batch-compression codec and dropping a deprecated retry shim.",
    status: "done",
    priority: "medium",
    assigneeId: "m-elliot",
    labels: ["Infra"],
    cycle: "Cycle 13",
    estimate: 5,
    createdLabel: "Jun 8",
    updatedLabel: "Jun 18",
    linkedPr: { id: "PR-1149", title: "chore(telemetry): bump SDK to v2.4", status: "merged" },
    activity: [
      { id: "a1", type: "created", actorId: "m-elliot", timestampLabel: "Jun 8, 11:00 AM", text: "created this issue" },
      { id: "a2", type: "pr", actorId: "m-elliot", timestampLabel: "Jun 17, 9:30 AM", text: "opened PR-1149: chore(telemetry): bump SDK to v2.4" },
      { id: "a3", type: "status", actorId: "m-elliot", timestampLabel: "Jun 18, 2:00 PM", text: "moved this to Done" },
    ],
  },
  {
    id: "COR-402",
    title: "Document rate-limit headers in public API reference",
    description:
      "The public API reference didn't document the X-RateLimit-* response headers, leading to repeated support questions about how clients should back off.",
    status: "done",
    priority: "low",
    assigneeId: "m-priya",
    labels: ["Docs"],
    cycle: "Cycle 13",
    estimate: 2,
    createdLabel: "Jun 4",
    updatedLabel: "Jun 11",
    activity: [
      { id: "a1", type: "created", actorId: "m-priya", timestampLabel: "Jun 4, 3:00 PM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-priya", timestampLabel: "Jun 11, 9:00 AM", text: "moved this to Done" },
    ],
  },

  // ---- Cancelled ----
  {
    id: "COR-393",
    title: "Rewrite fleet console in server components",
    description:
      "Explored a full rewrite of the fleet console around server components for faster initial load. Cancelled after prototyping showed the live map and real-time alerts need client state throughout anyway.",
    status: "cancelled",
    priority: "low",
    assigneeId: null,
    labels: ["Infra"],
    cycle: "Cycle 12",
    estimate: 13,
    createdLabel: "May 20",
    updatedLabel: "Jun 3",
    activity: [
      { id: "a1", type: "created", actorId: "m-owen", timestampLabel: "May 20, 10:00 AM", text: "created this issue" },
      { id: "a2", type: "comment", actorId: "m-owen", timestampLabel: "Jun 3, 11:00 AM", text: "Prototype confirmed most of the console needs client-side state regardless. Not worth the rewrite risk right now." },
      { id: "a3", type: "status", actorId: "m-owen", timestampLabel: "Jun 3, 11:05 AM", text: "moved this to Cancelled" },
    ],
  },
  {
    id: "COR-361",
    title: "Custom on-prem relay for air-gapped fleets",
    description:
      "One prospect asked about an on-prem relay for fleets with no outbound internet access. Deal did not close, and no other pipeline demand surfaced, so this was shelved.",
    status: "cancelled",
    priority: "low",
    assigneeId: null,
    labels: ["Infra"],
    cycle: "Backlog",
    estimate: 8,
    createdLabel: "May 12",
    updatedLabel: "May 30",
    activity: [
      { id: "a1", type: "created", actorId: "m-owen", timestampLabel: "May 12, 2:00 PM", text: "created this issue" },
      { id: "a2", type: "status", actorId: "m-owen", timestampLabel: "May 30, 9:00 AM", text: "moved this to Cancelled" },
    ],
  },
];

export function issueById(id: string | null | undefined): Issue | undefined {
  return ISSUES.find((i) => i.id === id);
}

export const FILTER_OPTIONS: { id: "all" | "mine" | "urgent"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mine", label: "Mine" },
  { id: "urgent", label: "Urgent" },
];

export type SortKey = "updated" | "priority" | "created" | "id";

export const PRIORITY_RANK: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
  none: 4,
};
