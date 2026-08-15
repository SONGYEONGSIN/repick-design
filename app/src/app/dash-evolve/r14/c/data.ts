/**
 * Crewline — deterministic dummy data for the Dispatch schedule console.
 * No Math.random / Date.now / new Date() anywhere: every date is a fixed literal ISO string and
 * every derived number (scheduled hours, utilization, weekly totals) is computed by reducing over
 * the fixed JOBS array below, so subtotals always agree with totals by construction.
 */

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarClock,
  Droplet,
  ListChecks,
  Receipt,
  Settings,
  Users,
  Wind,
  Zap,
} from "lucide-react";

/* --------------------------------------------------------------- Brand */

export const BRAND = { name: "Crewline", tagline: "Field Service Dispatch Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-basin", name: "Basin City HVAC & Electric", plan: "Team plan" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session/account data. */
export const CURRENT_USER = {
  name: "Jordan Ashcombe",
  role: "Dispatch Manager",
  email: "jordan.ashcombe@crewline.app",
  avatarId: "1544005313-94ddf0286df2",
};

/* -------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "operations",
    title: "Operations",
    items: [
      { id: "dispatch", label: "Dispatch", Icon: CalendarClock, active: true },
      { id: "technicians", label: "Technicians", Icon: Users, disabled: true },
      { id: "jobs", label: "Jobs", Icon: ListChecks, disabled: true },
    ],
  },
  {
    id: "business",
    title: "Business",
    items: [
      { id: "invoicing", label: "Invoicing", Icon: Receipt, disabled: true },
      { id: "reports", label: "Reports", Icon: BarChart3, disabled: true },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [{ id: "settings", label: "Settings", Icon: Settings, disabled: true }],
  },
];

/* ------------------------------------------------------------- Trades */

export type Trade = "hvac" | "electrical" | "plumbing";

export const TRADE_META: Record<Trade, { label: string; Icon: LucideIcon }> = {
  hvac: { label: "HVAC", Icon: Wind },
  electrical: { label: "Electrical", Icon: Zap },
  plumbing: { label: "Plumbing", Icon: Droplet },
};

/* -------------------------------------------------------- Technicians */

export type TechId = "priya" | "owen" | "marcus" | "selin" | "denny" | "rosa";

export type Technician = {
  id: TechId;
  name: string;
  role: string;
  trade: Trade;
  avatarId: string;
  weeklyCapacityHours: number;
};

export const TECHNICIANS: Technician[] = [
  { id: "priya", name: "Priya Nakamura", role: "HVAC Lead", trade: "hvac", avatarId: "1472099645785-5658abf4ff4e", weeklyCapacityHours: 40 },
  { id: "owen", name: "Owen Castellano", role: "Electrician", trade: "electrical", avatarId: "1487412720507-e7ab37603c6f", weeklyCapacityHours: 40 },
  { id: "marcus", name: "Marcus Yeboah", role: "Plumber", trade: "plumbing", avatarId: "1500648767791-00dcc994a43e", weeklyCapacityHours: 40 },
  { id: "selin", name: "Selin Aydin", role: "HVAC Tech", trade: "hvac", avatarId: "1519085360753-af0119f7cbe7", weeklyCapacityHours: 40 },
  { id: "denny", name: "Denny Okafor", role: "Electrician", trade: "electrical", avatarId: "1519244703995-f4e0f30006d5", weeklyCapacityHours: 40 },
  { id: "rosa", name: "Rosa Villanueva", role: "Plumber", trade: "plumbing", avatarId: "1534528741775-53994a69daeb", weeklyCapacityHours: 40 },
];

export function getTechnician(id: TechId | null): Technician | undefined {
  return TECHNICIANS.find((t) => t.id === id);
}

/* ------------------------------------------------------------------ Days */

export type DayId = "mon" | "tue" | "wed" | "thu" | "fri";

export type DayInfo = { id: DayId; label: string; dateLabel: string; iso: string };

export const DAYS: DayInfo[] = [
  { id: "mon", label: "Mon", dateLabel: "Mar 9", iso: "2026-03-09" },
  { id: "tue", label: "Tue", dateLabel: "Mar 10", iso: "2026-03-10" },
  { id: "wed", label: "Wed", dateLabel: "Mar 11", iso: "2026-03-11" },
  { id: "thu", label: "Thu", dateLabel: "Mar 12", iso: "2026-03-12" },
  { id: "fri", label: "Fri", dateLabel: "Mar 13", iso: "2026-03-13" },
];

export const WEEK_LABEL = "Week of Mar 9–13, 2026";

export function getDay(id: DayId): DayInfo {
  return DAYS.find((d) => d.id === id)!;
}

/* ---------------------------------------------------------- Off-shift */

export const OFF_SHIFTS: { techId: TechId; day: DayId }[] = [
  { techId: "denny", day: "mon" },
  { techId: "selin", day: "wed" },
  { techId: "rosa", day: "thu" },
];

export function isOffShift(techId: TechId, day: DayId): boolean {
  return OFF_SHIFTS.some((o) => o.techId === techId && o.day === day);
}

/* ---------------------------------------------------------------- Jobs */

export type Status = "scheduled" | "in-progress" | "completed" | "unassigned";

export type Job = {
  id: string;
  techId: TechId | null;
  day: DayId;
  startHour: number;
  durationHours: number;
  customer: string;
  jobLabel: string;
  status: Status;
};

export const JOBS: Job[] = [
  // Priya Nakamura — HVAC Lead
  { id: "j-priya-1", techId: "priya", day: "mon", startHour: 8, durationHours: 2, customer: "Whitmore Bakery", jobLabel: "AC install", status: "completed" },
  { id: "j-priya-2", techId: "priya", day: "mon", startHour: 10.5, durationHours: 1.5, customer: "Fenwick Apartments", jobLabel: "System inspection", status: "completed" },
  { id: "j-priya-3", techId: "priya", day: "tue", startHour: 9, durationHours: 3, customer: "Larkspur Dental", jobLabel: "HVAC replacement", status: "completed" },
  { id: "j-priya-4", techId: "priya", day: "wed", startHour: 8, durationHours: 1.5, customer: "Coastal Diner", jobLabel: "Filter service", status: "completed" },
  { id: "j-priya-5", techId: "priya", day: "wed", startHour: 13, durationHours: 3, customer: "Marrow Logistics", jobLabel: "Rooftop unit repair", status: "in-progress" },
  { id: "j-priya-6", techId: "priya", day: "thu", startHour: 9, durationHours: 2, customer: "Union Fitness", jobLabel: "AC repair", status: "scheduled" },
  { id: "j-priya-7", techId: "priya", day: "fri", startHour: 8, durationHours: 3, customer: "Prairie Elementary", jobLabel: "System tune-up", status: "scheduled" },

  // Owen Castellano — Electrician
  { id: "j-owen-1", techId: "owen", day: "mon", startHour: 9, durationHours: 2, customer: "Delridge Hardware", jobLabel: "Panel upgrade", status: "completed" },
  { id: "j-owen-2", techId: "owen", day: "mon", startHour: 13, durationHours: 2, customer: "Hartley Law Office", jobLabel: "Wiring inspection", status: "completed" },
  { id: "j-owen-3", techId: "owen", day: "tue", startHour: 8, durationHours: 2, customer: "Union Fitness", jobLabel: "Lighting retrofit", status: "completed" },
  { id: "j-owen-4", techId: "owen", day: "tue", startHour: 10.5, durationHours: 2, customer: "Foss Marina", jobLabel: "Generator install", status: "completed" },
  { id: "j-owen-5", techId: "owen", day: "wed", startHour: 9, durationHours: 3, customer: "Kessler Hospital Wing", jobLabel: "Emergency circuit", status: "in-progress" },
  { id: "j-owen-6", techId: "owen", day: "thu", startHour: 8, durationHours: 1, customer: "Coastal Diner", jobLabel: "Outlet repair", status: "scheduled" },
  { id: "j-owen-7", techId: "owen", day: "thu", startHour: 10, durationHours: 3, customer: "Bramble Studios", jobLabel: "Service upgrade", status: "scheduled" },
  { id: "j-owen-8", techId: "owen", day: "fri", startHour: 9, durationHours: 2, customer: "Larkspur Dental", jobLabel: "Panel inspection", status: "scheduled" },

  // Marcus Yeboah — Plumber
  { id: "j-marcus-1", techId: "marcus", day: "mon", startHour: 8, durationHours: 1.5, customer: "Foss Marina", jobLabel: "Leak repair", status: "completed" },
  { id: "j-marcus-2", techId: "marcus", day: "tue", startHour: 9, durationHours: 2, customer: "Prairie Elementary", jobLabel: "Drain cleaning", status: "completed" },
  { id: "j-marcus-3", techId: "marcus", day: "wed", startHour: 8, durationHours: 2, customer: "Whitmore Bakery", jobLabel: "Water heater swap", status: "completed" },
  { id: "j-marcus-4", techId: "marcus", day: "thu", startHour: 9, durationHours: 3, customer: "Kessler Hospital Wing", jobLabel: "Pipe replacement", status: "in-progress" },
  { id: "j-marcus-5", techId: "marcus", day: "fri", startHour: 8, durationHours: 2, customer: "Delridge Hardware", jobLabel: "Fixture install", status: "scheduled" },
  { id: "j-marcus-6", techId: "marcus", day: "fri", startHour: 13, durationHours: 2, customer: "Hartley Law Office", jobLabel: "Backflow test", status: "scheduled" },

  // Selin Aydin — HVAC Tech (off Wed)
  { id: "j-selin-1", techId: "selin", day: "mon", startHour: 8, durationHours: 3, customer: "Bramble Studios", jobLabel: "Duct cleaning", status: "completed" },
  { id: "j-selin-2", techId: "selin", day: "tue", startHour: 8, durationHours: 2, customer: "Coastal Diner", jobLabel: "AC repair", status: "completed" },
  { id: "j-selin-3", techId: "selin", day: "thu", startHour: 8, durationHours: 3, customer: "Foss Marina", jobLabel: "System install", status: "scheduled" },
  { id: "j-selin-4", techId: "selin", day: "thu", startHour: 13, durationHours: 2, customer: "Union Fitness", jobLabel: "Filter service", status: "scheduled" },
  { id: "j-selin-5", techId: "selin", day: "fri", startHour: 9, durationHours: 3, customer: "Kessler Hospital Wing", jobLabel: "HVAC balancing", status: "scheduled" },

  // Denny Okafor — Electrician (off Mon)
  { id: "j-denny-1", techId: "denny", day: "tue", startHour: 8, durationHours: 2, customer: "Delridge Hardware", jobLabel: "Rewiring", status: "completed" },
  { id: "j-denny-2", techId: "denny", day: "tue", startHour: 13, durationHours: 3, customer: "Marrow Logistics", jobLabel: "Panel install", status: "completed" },
  { id: "j-denny-3", techId: "denny", day: "wed", startHour: 8, durationHours: 3, customer: "Larkspur Dental", jobLabel: "Lighting retrofit", status: "in-progress" },
  { id: "j-denny-4", techId: "denny", day: "thu", startHour: 9, durationHours: 2, customer: "Hartley Law Office", jobLabel: "Safety inspection", status: "scheduled" },
  { id: "j-denny-5", techId: "denny", day: "fri", startHour: 8, durationHours: 2, customer: "Prairie Elementary", jobLabel: "Safety audit", status: "scheduled" },
  { id: "j-denny-6", techId: "denny", day: "fri", startHour: 10.5, durationHours: 2, customer: "Whitmore Bakery", jobLabel: "Outlet install", status: "scheduled" },

  // Rosa Villanueva — Plumber (off Thu)
  { id: "j-rosa-1", techId: "rosa", day: "mon", startHour: 9, durationHours: 2, customer: "Kessler Hospital Wing", jobLabel: "Fixture repair", status: "completed" },
  { id: "j-rosa-2", techId: "rosa", day: "mon", startHour: 13, durationHours: 2, customer: "Bramble Studios", jobLabel: "Drain install", status: "completed" },
  { id: "j-rosa-3", techId: "rosa", day: "tue", startHour: 8, durationHours: 3, customer: "Foss Marina", jobLabel: "Repipe section", status: "completed" },
  { id: "j-rosa-4", techId: "rosa", day: "wed", startHour: 9, durationHours: 3, customer: "Union Fitness", jobLabel: "Water line repair", status: "in-progress" },
  { id: "j-rosa-5", techId: "rosa", day: "fri", startHour: 8, durationHours: 2, customer: "Coastal Diner", jobLabel: "Leak repair", status: "scheduled" },
  { id: "j-rosa-6", techId: "rosa", day: "fri", startHour: 10.5, durationHours: 3, customer: "Marrow Logistics", jobLabel: "Backflow install", status: "scheduled" },

  // Unassigned — awaiting dispatch
  { id: "j-unassigned-1", techId: null, day: "wed", startHour: 14, durationHours: 2, customer: "Fenwick Apartments", jobLabel: "No-cool call", status: "unassigned" },
  { id: "j-unassigned-2", techId: null, day: "thu", startHour: 8, durationHours: 2, customer: "Delridge Hardware", jobLabel: "Urgent leak call", status: "unassigned" },
];

/** null = nothing selected, "unassigned" = the unassigned-jobs pseudo-row, else a technician id. */
export type SelectedKey = TechId | "unassigned" | null;

export function jobsFor(day: DayId, techId: TechId | null): Job[] {
  return JOBS.filter((j) => j.day === day && j.techId === techId).sort((a, b) => a.startHour - b.startHour);
}

export const UNASSIGNED_JOBS = JOBS.filter((j) => j.status === "unassigned");

/* --------------------------------------------------------- Computed stats */

export type TechStat = { tech: Technician; scheduledHours: number; utilizationPct: number; jobCount: number; activeCount: number };

export const TECH_STATS: TechStat[] = TECHNICIANS.map((tech) => {
  const techJobs = JOBS.filter((j) => j.techId === tech.id);
  const scheduledHours = techJobs.reduce((sum, j) => sum + j.durationHours, 0);
  const utilizationPct = Math.round((scheduledHours / tech.weeklyCapacityHours) * 100);
  const activeCount = techJobs.filter((j) => j.status === "in-progress").length;
  return { tech, scheduledHours, utilizationPct, jobCount: techJobs.length, activeCount };
});

export const WEEKLY_TOTALS = {
  totalJobs: JOBS.length,
  assignedJobs: JOBS.filter((j) => j.techId !== null).length,
  unassignedJobs: UNASSIGNED_JOBS.length,
  technicianCount: TECHNICIANS.length,
  avgUtilizationPct: Math.round(TECH_STATS.reduce((sum, s) => sum + s.utilizationPct, 0) / TECH_STATS.length),
  totalScheduledHours: TECH_STATS.reduce((sum, s) => sum + s.scheduledHours, 0),
};

/* --------------------------------------------------------- Status meta */

export const STATUS_ORDER: Status[] = ["scheduled", "in-progress", "completed", "unassigned"];

export const STATUS_LABEL: Record<Status, string> = {
  scheduled: "Scheduled",
  "in-progress": "In progress",
  completed: "Completed",
  unassigned: "Unassigned",
};

/* -------------------------------------------------- Notifications (topbar) */

export const NOTIFICATIONS = [
  { id: "n1", text: "2 jobs still need a technician assigned before Wednesday.", time: "18m ago" },
  { id: "n2", text: "Denny Okafor marked Tuesday's panel install at Marrow Logistics complete.", time: "2h ago" },
  { id: "n3", text: "Weekly capacity digest is ready for Basin City HVAC & Electric.", time: "1d ago" },
];
