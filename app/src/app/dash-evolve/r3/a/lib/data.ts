// Deterministic dummy data for Trackline — no Math.random / Date.now / bare `new Date()`.
// All dates are represented as integer day-offsets from the project start (2026-06-01),
// which is a Monday. Today is fixed at 2026-07-15 -> day offset 44.

export type TaskStatus = "on-track" | "at-risk" | "blocked" | "done";
export type MilestoneStatus = "done" | "upcoming" | "at-risk";

export const WORKSPACE = {
  org: "Fieldstone Robotics",
  team: "Platform Engineering",
  project: "Q3 Platform Roadmap",
  plan: "Team plan",
};

export const PROJECT_START_LABEL = "Jun 1, 2026";
export const PROJECT_END_LABEL = "Sep 20, 2026";
export const TOTAL_DAYS = 112; // Jun 1 -> Sep 20 inclusive span
export const TODAY_DAY = 44; // Jul 15, 2026
export const TODAY_LABEL = "Today · Jul 15";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  capacityHoursPerWeek: number;
}

export const MEMBERS: Member[] = [
  {
    id: "m-ava",
    name: "Ava Chen",
    role: "Product Lead",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "AC",
    capacityHoursPerWeek: 40,
  },
  {
    id: "m-marcus",
    name: "Marcus Webb",
    role: "Design Lead",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "MW",
    capacityHoursPerWeek: 40,
  },
  {
    id: "m-priya",
    name: "Priya Nair",
    role: "Frontend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "PN",
    capacityHoursPerWeek: 40,
  },
  {
    id: "m-diego",
    name: "Diego Ramos",
    role: "Backend Engineer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "DR",
    capacityHoursPerWeek: 40,
  },
  {
    id: "m-sofia",
    name: "Sofia Lindqvist",
    role: "Platform Engineer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "SL",
    capacityHoursPerWeek: 40,
  },
  {
    id: "m-jamal",
    name: "Jamal Reed",
    role: "QA Lead",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "JR",
    capacityHoursPerWeek: 40,
  },
  {
    id: "m-elena",
    name: "Elena Kowalski",
    role: "DevRel Lead",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "EK",
    capacityHoursPerWeek: 40,
  },
  {
    id: "m-noah",
    name: "Noah Kim",
    role: "Program Manager",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=faces&q=60",
    initials: "NK",
    capacityHoursPerWeek: 40,
  },
];

export interface Task {
  id: string;
  memberId: string;
  title: string;
  status: TaskStatus;
  startDay: number;
  durationDays: number;
  progress: number;
  notes: string[];
}

export const TASKS: Task[] = [
  // Ava Chen — Product Lead
  { id: "t-ava-1", memberId: "m-ava", title: "Define v4 pricing tiers", status: "done", startDay: 0, durationDays: 18, progress: 100, notes: ["Finance sign-off received Jun 16.", "Rolled into billing spec."] },
  { id: "t-ava-2", memberId: "m-ava", title: "Beta customer interviews", status: "on-track", startDay: 30, durationDays: 20, progress: 60, notes: ["12 of 20 interviews complete.", "Findings feed the onboarding v2 spec."] },
  { id: "t-ava-3", memberId: "m-ava", title: "GA launch readiness review", status: "on-track", startDay: 90, durationDays: 14, progress: 0, notes: ["Blocked on code freeze completing first.", "Owner: Ava, reviewers: Noah, Jamal."] },

  // Marcus Webb — Design Lead
  { id: "t-marcus-1", memberId: "m-marcus", title: "Timeline redesign spec", status: "done", startDay: 4, durationDays: 16, progress: 100, notes: ["Shipped to engineering Jun 20.", "Used as the base for the Gantt rebuild."] },
  { id: "t-marcus-2", memberId: "m-marcus", title: "Design system audit", status: "at-risk", startDay: 26, durationDays: 24, progress: 45, notes: ["Token migration slower than planned.", "Needs one more design review pass."] },
  { id: "t-marcus-3", memberId: "m-marcus", title: "Onboarding flow v2", status: "on-track", startDay: 70, durationDays: 18, progress: 10, notes: ["Kicked off with research findings from Ava's interviews."] },

  // Priya Nair — Frontend Engineer
  { id: "t-priya-1", memberId: "m-priya", title: "Gantt virtualization", status: "blocked", startDay: 20, durationDays: 26, progress: 35, notes: ["Blocked on scheduling engine v2 API contract.", "Row virtualization prototype works up to 500 rows."] },
  { id: "t-priya-2", memberId: "m-priya", title: "Keyboard navigation pass", status: "on-track", startDay: 60, durationDays: 14, progress: 0, notes: ["Scoped: arrow-key bar selection, focus rings, screen reader labels."] },

  // Diego Ramos — Backend Engineer
  { id: "t-diego-1", memberId: "m-diego", title: "Scheduling engine v2", status: "on-track", startDay: 10, durationDays: 40, progress: 55, notes: ["Core allocation algorithm passing load tests.", "API contract freeze targeted for day 50."] },
  { id: "t-diego-2", memberId: "m-diego", title: "Webhook delivery retries", status: "at-risk", startDay: 54, durationDays: 18, progress: 20, notes: ["Retry backoff logic under review.", "Depends on scheduling engine v2 completing."] },

  // Sofia Lindqvist — Platform Engineer
  { id: "t-sofia-1", memberId: "m-sofia", title: "Multi-region rollout", status: "on-track", startDay: 34, durationDays: 30, progress: 40, notes: ["EU region live in staging.", "APAC region planned for week 12."] },
  { id: "t-sofia-2", memberId: "m-sofia", title: "Data residency compliance", status: "on-track", startDay: 78, durationDays: 20, progress: 0, notes: ["Legal review scheduled ahead of code freeze."] },

  // Jamal Reed — QA Lead
  { id: "t-jamal-1", memberId: "m-jamal", title: "Regression suite expansion", status: "done", startDay: 8, durationDays: 20, progress: 100, notes: ["312 new automated cases added.", "CI runtime holding under 9 minutes."] },
  { id: "t-jamal-2", memberId: "m-jamal", title: "Load testing — 10k orgs", status: "at-risk", startDay: 40, durationDays: 16, progress: 30, notes: ["p95 latency above target at 8k orgs.", "Needs scheduling engine v2 to stabilize first."] },
  { id: "t-jamal-3", memberId: "m-jamal", title: "GA release sign-off", status: "on-track", startDay: 96, durationDays: 10, progress: 0, notes: ["Final checklist gating the GA release milestone."] },

  // Elena Kowalski — DevRel Lead
  { id: "t-elena-1", memberId: "m-elena", title: "Docs rewrite — API v3", status: "done", startDay: 2, durationDays: 22, progress: 100, notes: ["Published Jun 24.", "Positive feedback from three design-partner devs."] },
  { id: "t-elena-2", memberId: "m-elena", title: "Partner integration guides", status: "on-track", startDay: 50, durationDays: 24, progress: 25, notes: ["3 of 7 partner guides drafted."] },

  // Noah Kim — Program Manager
  { id: "t-noah-1", memberId: "m-noah", title: "Roadmap alignment workshops", status: "done", startDay: 0, durationDays: 10, progress: 100, notes: ["All eight leads aligned on Q3 scope."] },
  { id: "t-noah-2", memberId: "m-noah", title: "Risk register + mitigation", status: "on-track", startDay: 44, durationDays: 30, progress: 15, notes: ["Tracking 6 open risks, 2 flagged at-risk this week."] },
  { id: "t-noah-3", memberId: "m-noah", title: "Launch comms plan", status: "on-track", startDay: 88, durationDays: 16, progress: 0, notes: ["Draft due before code freeze on day 84."] },
];

export interface Milestone {
  id: string;
  label: string;
  day: number;
  status: MilestoneStatus;
}

export const MILESTONES: Milestone[] = [
  { id: "ms-1", label: "Roadmap approved", day: 10, status: "done" },
  { id: "ms-2", label: "Design freeze", day: 26, status: "done" },
  { id: "ms-3", label: "Beta launch", day: 50, status: "at-risk" },
  { id: "ms-4", label: "Code freeze", day: 84, status: "upcoming" },
  { id: "ms-5", label: "GA release", day: 104, status: "upcoming" },
];

export interface WeekTick {
  index: number;
  label: string;
  startDay: number;
}

export const WEEKS: WeekTick[] = [
  { index: 0, label: "Jun 1", startDay: 0 },
  { index: 1, label: "Jun 8", startDay: 7 },
  { index: 2, label: "Jun 15", startDay: 14 },
  { index: 3, label: "Jun 22", startDay: 21 },
  { index: 4, label: "Jun 29", startDay: 28 },
  { index: 5, label: "Jul 6", startDay: 35 },
  { index: 6, label: "Jul 13", startDay: 42 },
  { index: 7, label: "Jul 20", startDay: 49 },
  { index: 8, label: "Jul 27", startDay: 56 },
  { index: 9, label: "Aug 3", startDay: 63 },
  { index: 10, label: "Aug 10", startDay: 70 },
  { index: 11, label: "Aug 17", startDay: 77 },
  { index: 12, label: "Aug 24", startDay: 84 },
  { index: 13, label: "Aug 31", startDay: 91 },
  { index: 14, label: "Sep 7", startDay: 98 },
  { index: 15, label: "Sep 14", startDay: 105 },
];

export interface MonthTick {
  label: string;
  startDay: number;
  spanDays: number;
}

export const MONTHS: MonthTick[] = [
  { label: "June", startDay: 0, spanDays: 30 },
  { label: "July", startDay: 30, spanDays: 31 },
  { label: "August", startDay: 61, spanDays: 31 },
  { label: "September", startDay: 92, spanDays: 20 },
];

export const STATUS_META: Record<
  TaskStatus,
  { label: string; swatch: string; badgeClass: string; barClass: string; iconLabel: string }
> = {
  "on-track": {
    label: "On track",
    swatch: "bg-indigo-500",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    // 700, not 500: white 11px labels on the Gantt bars need >=4.5:1 contrast.
    barClass: "bg-indigo-700",
    iconLabel: "On track",
  },
  "at-risk": {
    label: "At risk",
    swatch: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    barClass: "bg-amber-700",
    iconLabel: "At risk",
  },
  blocked: {
    label: "Blocked",
    swatch: "bg-rose-500",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    barClass: "bg-rose-700",
    iconLabel: "Blocked",
  },
  done: {
    label: "Done",
    swatch: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    barClass: "bg-emerald-700",
    iconLabel: "Done",
  },
};

export const MILESTONE_STATUS_META: Record<
  MilestoneStatus,
  { label: string; badgeClass: string; diamondClass: string }
> = {
  done: { label: "Done", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", diamondClass: "bg-emerald-500 border-emerald-600" },
  upcoming: { label: "Upcoming", badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-300", diamondClass: "bg-white border-zinc-400" },
  "at-risk": { label: "At risk", badgeClass: "bg-amber-50 text-amber-800 border-amber-200", diamondClass: "bg-amber-500 border-amber-600" },
};

// Weekly booked hours per member across the 16-week window (capacity 40h/week).
export const RESOURCE_LOAD: Record<string, number[]> = {
  "m-ava": [32, 34, 30, 28, 36, 38, 40, 42, 30, 26, 28, 32, 34, 30, 28, 26],
  "m-marcus": [28, 30, 34, 38, 44, 46, 42, 40, 36, 30, 26, 24, 28, 32, 30, 26],
  "m-priya": [20, 24, 30, 36, 42, 46, 48, 44, 38, 32, 26, 22, 20, 24, 28, 26],
  "m-diego": [30, 32, 36, 40, 44, 42, 40, 38, 36, 34, 32, 30, 28, 30, 32, 28],
  "m-sofia": [18, 20, 24, 28, 34, 38, 42, 44, 40, 36, 32, 28, 26, 24, 22, 20],
  "m-jamal": [26, 28, 32, 34, 36, 34, 38, 42, 40, 36, 32, 28, 26, 24, 22, 20],
  "m-elena": [24, 26, 28, 30, 32, 30, 28, 34, 38, 36, 32, 28, 26, 24, 22, 20],
  "m-noah": [30, 32, 34, 36, 38, 40, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24],
};

export const CAPACITY_PER_WEEK = 40;

export const STATUS_FILTERS: { id: "all" | TaskStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "on-track", label: "On track" },
  { id: "at-risk", label: "At risk" },
  { id: "blocked", label: "Blocked" },
  { id: "done", label: "Done" },
];

export function tasksForMember(memberId: string): Task[] {
  return TASKS.filter((t) => t.memberId === memberId);
}

export function memberById(memberId: string): Member | undefined {
  return MEMBERS.find((m) => m.id === memberId);
}

export function taskById(taskId: string): Task | undefined {
  return TASKS.find((t) => t.id === taskId);
}
