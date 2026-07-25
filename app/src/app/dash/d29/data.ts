/**
 * Waypoint dashboard mock data.
 * All values are deterministic static literals — do not use Math.random / Date.now.
 * The "today" reference point is a fictional dataset anchor (TODAY_ISO), independent of the real system clock.
 */

export const TODAY_ISO = "2026-07-13";

export type ProjectStatus = "on_track" | "at_risk" | "delayed";
export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";
export type ActivityType = "complete" | "comment" | "create" | "update";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  capacityPercent: number;
  tasksAssigned: number;
  projectIds: string[];
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  status: ProjectStatus;
  progress: number;
  tasksTotal: number;
  tasksDone: number;
  startDate: string;
  dueDate: string;
  memberIds: string[];
  priority: Priority;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  isMine: boolean;
}

export interface ActivityItem {
  id: string;
  actorId: string;
  projectId: string;
  action: string;
  target: string;
  time: string;
  type: ActivityType;
}

export const CURRENT_USER_ID = "m1";

export const members: Member[] = [
  {
    id: "m1",
    name: "Haneul Oh",
    role: "Design Lead",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 92,
    tasksAssigned: 11,
    projectIds: ["p1", "p3"],
  },
  {
    id: "m2",
    name: "Doyoon Kim",
    role: "Product Manager",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 108,
    tasksAssigned: 14,
    projectIds: ["p1", "p2", "p5"],
  },
  {
    id: "m3",
    name: "Seojun Lee",
    role: "Frontend",
    avatarUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 76,
    tasksAssigned: 9,
    projectIds: ["p1", "p3", "p6"],
  },
  {
    id: "m4",
    name: "Jimin Park",
    role: "Backend",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 121,
    tasksAssigned: 15,
    projectIds: ["p1", "p4"],
  },
  {
    id: "m5",
    name: "Mina Choi",
    role: "QA",
    avatarUrl:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 64,
    tasksAssigned: 7,
    projectIds: ["p2", "p5"],
  },
  {
    id: "m6",
    name: "Hayoon Jeong",
    role: "Backend",
    avatarUrl:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 95,
    tasksAssigned: 10,
    projectIds: ["p2", "p4"],
  },
  {
    id: "m7",
    name: "Taeo Kang",
    role: "Content Strategy",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 58,
    tasksAssigned: 6,
    projectIds: ["p3", "p5", "p6"],
  },
  {
    id: "m8",
    name: "Soi Yoon",
    role: "Product Designer",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 87,
    tasksAssigned: 9,
    projectIds: ["p5", "p6"],
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "Mobile App Revamp",
    ownerId: "m1",
    status: "on_track",
    progress: 68,
    tasksTotal: 42,
    tasksDone: 29,
    startDate: "2026-06-01",
    dueDate: "2026-07-31",
    memberIds: ["m1", "m2", "m3", "m4"],
    priority: "high",
  },
  {
    id: "p2",
    name: "Payment System Migration",
    ownerId: "m2",
    status: "at_risk",
    progress: 41,
    tasksTotal: 36,
    tasksDone: 15,
    startDate: "2026-06-15",
    dueDate: "2026-07-18",
    memberIds: ["m2", "m5", "m6"],
    priority: "high",
  },
  {
    id: "p3",
    name: "Onboarding Funnel Optimization",
    ownerId: "m3",
    status: "on_track",
    progress: 82,
    tasksTotal: 24,
    tasksDone: 20,
    startDate: "2026-06-08",
    dueDate: "2026-07-25",
    memberIds: ["m1", "m3", "m7"],
    priority: "medium",
  },
  {
    id: "p4",
    name: "API v3 Documentation",
    ownerId: "m4",
    status: "delayed",
    progress: 24,
    tasksTotal: 18,
    tasksDone: 4,
    startDate: "2026-06-22",
    dueDate: "2026-07-15",
    memberIds: ["m4", "m6"],
    priority: "medium",
  },
  {
    id: "p5",
    name: "Customer Portal Beta",
    ownerId: "m5",
    status: "on_track",
    progress: 55,
    tasksTotal: 30,
    tasksDone: 17,
    startDate: "2026-07-01",
    dueDate: "2026-08-14",
    memberIds: ["m2", "m5", "m7", "m8"],
    priority: "low",
  },
  {
    id: "p6",
    name: "Q3 Brand Refresh",
    ownerId: "m7",
    status: "at_risk",
    progress: 33,
    tasksTotal: 20,
    tasksDone: 7,
    startDate: "2026-06-20",
    dueDate: "2026-08-05",
    memberIds: ["m3", "m7", "m8"],
    priority: "low",
  },
];

export const tasks: Task[] = [
  { id: "t1", title: "Write QA scenarios for payment widget", projectId: "p2", assigneeId: "m5", dueDate: "2026-07-13", priority: "high", status: "in_progress", isMine: false },
  { id: "t2", title: "Review API v3 endpoint spec", projectId: "p4", assigneeId: "m4", dueDate: "2026-07-14", priority: "high", status: "todo", isMine: false },
  { id: "t3", title: "Rewrite onboarding step 3 copy", projectId: "p3", assigneeId: "m7", dueDate: "2026-07-14", priority: "medium", status: "in_progress", isMine: false },
  { id: "t4", title: "Design payment failure alert flow", projectId: "p2", assigneeId: "m2", dueDate: "2026-07-15", priority: "high", status: "todo", isMine: false },
  { id: "t5", title: "QA mobile app dark mode", projectId: "p1", assigneeId: "m3", dueDate: "2026-07-15", priority: "medium", status: "todo", isMine: false },
  { id: "t6", title: "Mock up customer portal login screen", projectId: "p5", assigneeId: "m8", dueDate: "2026-07-16", priority: "medium", status: "in_progress", isMine: false },
  { id: "t7", title: "Finalize brand color palette", projectId: "p6", assigneeId: "m8", dueDate: "2026-07-16", priority: "low", status: "todo", isMine: false },
  { id: "t8", title: "Draft API v3 auth documentation", projectId: "p4", assigneeId: "m6", dueDate: "2026-07-17", priority: "high", status: "todo", isMine: false },
  { id: "t9", title: "Organize revamp icon set", projectId: "p1", assigneeId: "m1", dueDate: "2026-07-13", priority: "high", status: "in_progress", isMine: true },
  { id: "t10", title: "Review onboarding widget component", projectId: "p3", assigneeId: "m1", dueDate: "2026-07-14", priority: "medium", status: "todo", isMine: true },
  { id: "t11", title: "Clean up design system spacing tokens", projectId: "p1", assigneeId: "m1", dueDate: "2026-07-16", priority: "medium", status: "todo", isMine: true },
  { id: "t12", title: "Compile prototype usability test results", projectId: "p3", assigneeId: "m1", dueDate: "2026-07-18", priority: "low", status: "todo", isMine: true },
  { id: "t13", title: "Final review of revamp v2 mockups", projectId: "p1", assigneeId: "m1", dueDate: "2026-07-11", priority: "high", status: "done", isMine: true },
  { id: "t14", title: "Onboarding copy tone guide", projectId: "p3", assigneeId: "m1", dueDate: "2026-07-10", priority: "medium", status: "done", isMine: true },
  { id: "t15", title: "Payment migration rollback plan", projectId: "p2", assigneeId: "m2", dueDate: "2026-07-20", priority: "medium", status: "todo", isMine: false },
  { id: "t16", title: "Customer portal beta invite email", projectId: "p5", assigneeId: "m5", dueDate: "2026-07-22", priority: "low", status: "todo", isMine: false },
  { id: "t17", title: "Brand logo responsive guide", projectId: "p6", assigneeId: "m7", dueDate: "2026-07-24", priority: "low", status: "in_progress", isMine: false },
  { id: "t18", title: "Write API v3 changelog", projectId: "p4", assigneeId: "m4", dueDate: "2026-07-19", priority: "medium", status: "todo", isMine: false },
  { id: "t19", title: "Mobile app accessibility audit", projectId: "p1", assigneeId: "m3", dueDate: "2026-07-21", priority: "medium", status: "todo", isMine: false },
  { id: "t20", title: "Analyze onboarding A/B test results", projectId: "p3", assigneeId: "m7", dueDate: "2026-07-25", priority: "low", status: "todo", isMine: false },
  { id: "t21", title: "Payment API unit tests", projectId: "p2", assigneeId: "m6", dueDate: "2026-07-09", priority: "medium", status: "done", isMine: false },
  { id: "t22", title: "Customer portal wireframes", projectId: "p5", assigneeId: "m8", dueDate: "2026-07-08", priority: "medium", status: "done", isMine: false },
  { id: "t23", title: "Finalize brand moodboard", projectId: "p6", assigneeId: "m7", dueDate: "2026-07-07", priority: "low", status: "done", isMine: false },
  { id: "t24", title: "Mobile app QA round 1", projectId: "p1", assigneeId: "m3", dueDate: "2026-07-09", priority: "high", status: "done", isMine: false },
];

export const activities: ActivityItem[] = [
  { id: "a1", actorId: "m1", projectId: "p1", action: "marked complete", target: "Final review of revamp v2 mockups", time: "12m ago", type: "complete" },
  { id: "a2", actorId: "m4", projectId: "p4", action: "left a comment", target: "Review API v3 endpoint spec", time: "38m ago", type: "comment" },
  { id: "a3", actorId: "m2", projectId: "p2", action: "changed status to 'At Risk'", target: "Payment System Migration", time: "1h ago", type: "update" },
  { id: "a4", actorId: "m8", projectId: "p5", action: "uploaded a mockup", target: "Customer portal login screen", time: "2h ago", type: "create" },
  { id: "a5", actorId: "m3", projectId: "p1", action: "marked complete", target: "Mobile app QA round 1", time: "3h ago", type: "complete" },
  { id: "a6", actorId: "m7", projectId: "p6", action: "left a comment", target: "Finalize brand color palette", time: "4h ago", type: "comment" },
  { id: "a7", actorId: "m6", projectId: "p2", action: "marked complete", target: "Payment API unit tests", time: "Yesterday", type: "complete" },
  { id: "a8", actorId: "m5", projectId: "p5", action: "added a new task", target: "Customer portal beta invite email", time: "Yesterday", type: "create" },
  { id: "a9", actorId: "m1", projectId: "p3", action: "marked complete", target: "Onboarding copy tone guide", time: "Yesterday", type: "complete" },
  { id: "a10", actorId: "m2", projectId: "p2", action: "added a team member", target: "Hayoon Jeong · Payment System Migration", time: "2d ago", type: "update" },
];

export const statusMeta: Record<ProjectStatus, { label: string; className: string }> = {
  on_track: { label: "On Track", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  at_risk: { label: "At Risk", className: "bg-amber-50 text-amber-700 border-amber-200" },
  delayed: { label: "Delayed", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const priorityMeta: Record<Priority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-rose-50 text-rose-700 border-rose-200" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200" },
  low: { label: "Low", className: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

export const taskStatusMeta: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "To Do", className: "bg-zinc-100 text-zinc-600 border-zinc-200" },
  in_progress: { label: "In Progress", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  done: { label: "Done", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export function getMember(id: string): Member {
  const found = members.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown member id: ${id}`);
  return found;
}

export function getProject(id: string): Project {
  const found = projects.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown project id: ${id}`);
  return found;
}
