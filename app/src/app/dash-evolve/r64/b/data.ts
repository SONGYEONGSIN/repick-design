/**
 * Jobline — deterministic domain data for a field-service technician dispatch console
 * (auto-dash-r64 / candidate b).
 *
 * Everything below is hand-authored and fixed: no `Math.random()`, no `Date.now()`, no `new Date()`
 * anywhere. "Today" is a fixed demo anchor — a single operating day, Thursday — with no calendar
 * math involved at all, since the board is a same-day dispatch view, not a multi-month calendar.
 * Minute-of-day integers (0–1439) stand in for clock time throughout, formatted by hand below.
 *
 * Every total shown on screen (a technician's assigned minutes, utilization percentage, job counts,
 * the fleet-average KPI) is computed from `JOBS`/`TECHNICIANS` by the functions at the bottom of
 * this file, never hand-typed separately, so a displayed subtotal can never drift out of sync with
 * the jobs it rolls up from.
 */

export type TechnicianId = "priya" | "marcus" | "dana" | "leo" | "sofia" | "omar";
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type Priority = "standard" | "urgent";
export type BoardView = "board" | "calendar";
export type StatusFilter = "all" | "scheduled" | "active" | "completed";

export interface Technician {
  id: TechnicianId;
  name: string;
  role: string;
  vehicle: string;
  /** Daily capacity target, in minutes. */
  capacityMin: number;
}

export interface Job {
  id: string;
  tech: TechnicianId;
  /** Minutes since midnight, [0, 1440). */
  start: number;
  duration: number;
  title: string;
  customer: string;
  address: string;
  status: JobStatus;
  priority: Priority;
}

export const TECHNICIANS: Technician[] = [
  { id: "priya", name: "Priya Natarajan", role: "Senior HVAC Technician", vehicle: "Van 04", capacityMin: 480 },
  { id: "marcus", name: "Marcus Webb", role: "Plumbing Technician", vehicle: "Van 11", capacityMin: 480 },
  { id: "dana", name: "Dana Okafor", role: "Electrical Technician", vehicle: "Van 07", capacityMin: 480 },
  { id: "leo", name: "Leo Tran", role: "HVAC Technician", vehicle: "Van 15", capacityMin: 360 },
  { id: "sofia", name: "Sofia Reyes", role: "Plumbing Technician", vehicle: "Van 09", capacityMin: 480 },
  { id: "omar", name: "Omar Haddad", role: "Lead Electrician", vehicle: "Van 02", capacityMin: 480 },
];

export const STATUS_LABEL: Record<JobStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const VIEW_LABEL: Record<BoardView, string> = {
  board: "Board",
  calendar: "Calendar",
};

/** Operating window shown on the day timeline — 7:00 AM to 6:00 PM. Every job below falls inside
 *  it, so timeline bar geometry never has to clamp or clip against the window edges. */
export const DAY_START = 420;
export const DAY_END = 1080;
export const DAY_SPAN = DAY_END - DAY_START;
export const DAY_LABEL = "Thursday · Today";

/** Bullet-chart track scale, in minutes, shared across every technician row so their bars read on
 *  one consistent axis (600 min = 10h comfortably covers the largest capacity target plus overrun). */
export const BULLET_SCALE_MAX = 600;

function j(
  id: string,
  tech: TechnicianId,
  start: number,
  duration: number,
  title: string,
  customer: string,
  address: string,
  status: JobStatus,
  priority: Priority,
): Job {
  return { id, tech, start, duration, title, customer, address, status, priority };
}

export const JOBS: Job[] = [
  // Priya Natarajan — Senior HVAC Technician
  j("j-priya-1", "priya", 420, 90, "No-heat diagnostic", "Harriet Voss", "142 Birchwood Ln", "completed", "standard"),
  j("j-priya-2", "priya", 525, 120, "Furnace igniter replacement", "Oscar Lindqvist", "88 Cedar Grove Rd", "completed", "standard"),
  j("j-priya-3", "priya", 660, 90, "AC compressor inspection", "Nadia Fuchs", "310 Alder St", "in_progress", "urgent"),
  j("j-priya-4", "priya", 780, 120, "Ductwork repair", "Walter Brennan", "27 Pinecrest Ave", "scheduled", "standard"),
  j("j-priya-5", "priya", 930, 60, "Thermostat install", "Greta Simmons", "5 Maple Court", "scheduled", "standard"),
  j("j-priya-6", "priya", 1005, 30, "Filter replacement", "Imani Cole", "19 Spruce Way", "cancelled", "standard"),
  j("j-priya-7", "priya", 1050, 30, "Vent cleaning", "Felix Okoro", "61 Hollow Rd", "scheduled", "standard"),

  // Marcus Webb — Plumbing Technician
  j("j-marcus-1", "marcus", 420, 60, "Water heater flush", "Priyanka Shah", "14 Brook St", "completed", "standard"),
  j("j-marcus-2", "marcus", 495, 90, "Leak detection", "Samuel Osei", "76 Laurel Ave", "completed", "urgent"),
  j("j-marcus-3", "marcus", 600, 90, "Pipe re-route", "Carmen Diaz", "203 Chestnut Blvd", "in_progress", "standard"),
  j("j-marcus-4", "marcus", 705, 90, "Drain cleaning", "Miguel Soto", "9 Fern Court", "scheduled", "standard"),
  j("j-marcus-5", "marcus", 810, 60, "Faucet install", "Lena Novak", "142 Willow Dr", "scheduled", "standard"),

  // Dana Okafor — Electrical Technician
  j("j-dana-1", "dana", 420, 90, "Panel upgrade inspection", "Teodora Marsh", "55 Aspen Ln", "completed", "standard"),
  j("j-dana-2", "dana", 525, 90, "Circuit breaker replacement", "Hugo Berger", "301 Maple Row", "completed", "standard"),
  j("j-dana-3", "dana", 630, 60, "Outlet install", "Yuki Tanaka", "18 Elm St", "in_progress", "standard"),
  j("j-dana-4", "dana", 705, 120, "EV charger wiring", "Rosalind Price", "410 Sycamore Ter", "scheduled", "urgent"),
  j("j-dana-5", "dana", 840, 95, "Lighting retrofit", "Caleb Whitfield", "27 Birch Hollow", "scheduled", "standard"),

  // Leo Tran — HVAC Technician
  j("j-leo-1", "leo", 420, 60, "Filter replacement", "Astrid Lund", "8 Grove Path", "completed", "standard"),
  j("j-leo-2", "leo", 495, 60, "Thermostat calibration", "Jonah Pratt", "66 Fir St", "completed", "standard"),
  j("j-leo-3", "leo", 570, 90, "Duct inspection", "Mira Solberg", "120 Cypress Ln", "in_progress", "standard"),
  j("j-leo-4", "leo", 675, 90, "Vent install", "Theo Lacroix", "33 Hazel Ct", "scheduled", "standard"),

  // Sofia Reyes — Plumbing Technician
  j("j-sofia-1", "sofia", 420, 60, "Water softener check", "Ingrid Haas", "71 Poplar Ave", "completed", "standard"),
  j("j-sofia-2", "sofia", 495, 60, "Faucet repair", "Bram Vos", "15 Larch Row", "completed", "standard"),
  j("j-sofia-3", "sofia", 660, 90, "Sewer line camera inspection", "Delphine Roux", "220 Juniper Dr", "scheduled", "urgent"),
  j("j-sofia-4", "sofia", 765, 40, "Shutoff valve replacement", "Otto Reinholt", "9 Walnut Ct", "scheduled", "standard"),
  j("j-sofia-5", "sofia", 1005, 40, "Garbage disposal install", "Noor Siddiqui", "44 Linden Way", "cancelled", "standard"),

  // Omar Haddad — Lead Electrician
  j("j-omar-1", "omar", 420, 90, "Service panel audit", "Esperanza Cruz", "5 Redwood Ln", "completed", "standard"),
  j("j-omar-2", "omar", 525, 90, "Generator transfer switch", "Finn Donoghue", "310 Ash Grove", "completed", "urgent"),
  j("j-omar-3", "omar", 630, 90, "Rewire kitchen circuit", "Paloma Vidal", "77 Magnolia St", "in_progress", "standard"),
  j("j-omar-4", "omar", 735, 120, "Solar inverter hookup", "Adrian Koenig", "18 Cottonwood Dr", "scheduled", "standard"),
  j("j-omar-5", "omar", 870, 90, "Lighting control panel", "Simone Achebe", "402 Beechwood Ave", "scheduled", "standard"),
];

// ---------------------------------------------------------------------------
// Formatting — hand-rolled against minute-of-day integers, never `Date`.
// ---------------------------------------------------------------------------

export function formatClock(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const minute = m % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function formatRange(start: number, duration: number): string {
  return `${formatClock(start)}–${formatClock(start + duration)}`;
}

/** `(minutes / 60)` as a compact hour label — plain `toFixed`, never `Intl`'s compact notation, so
 *  there is no server/client ICU trailing-zero disagreement to worry about at all: this is pure,
 *  deterministic string math that resolves identically in every environment. */
export function formatHours(minutes: number): string {
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
export const countFmt = new Intl.NumberFormat("en-US");

// ---------------------------------------------------------------------------
// Derived aggregates — every number on screen traces back to one of these.
// ---------------------------------------------------------------------------

export function getJobsForTech(tech: TechnicianId): Job[] {
  return JOBS.filter((job) => job.tech === tech).sort((a, b) => a.start - b.start);
}

/** Shared status-filter predicate for the board, the day timeline, and (independently) any other
 *  widget that wants the same four chips. "All" still includes cancelled jobs (rendered muted by
 *  the caller) rather than hiding them outright. */
export function statusFilterMatches(job: Job, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "active") return job.status === "in_progress";
  return job.status === filter;
}

export function getTechnicianById(id: TechnicianId): Technician {
  return TECHNICIANS.find((t) => t.id === id) ?? TECHNICIANS[0];
}

export interface TechUtilization {
  tech: Technician;
  assignedMin: number;
  utilization: number;
  completedCount: number;
  activeCount: number;
  scheduledCount: number;
  cancelledCount: number;
}

/** A technician's utilization is the sum of every non-cancelled job's duration, counted fresh from
 *  `JOBS` — it can never drift from the schedule the board and calendar render. */
export function getTechUtilization(tech: Technician): TechUtilization {
  const jobs = getJobsForTech(tech.id);
  const live = jobs.filter((job) => job.status !== "cancelled");
  const assignedMin = live.reduce((sum, job) => sum + job.duration, 0);
  return {
    tech,
    assignedMin,
    utilization: assignedMin / tech.capacityMin,
    completedCount: jobs.filter((j2) => j2.status === "completed").length,
    activeCount: jobs.filter((j2) => j2.status === "in_progress").length,
    scheduledCount: jobs.filter((j2) => j2.status === "scheduled").length,
    cancelledCount: jobs.filter((j2) => j2.status === "cancelled").length,
  };
}

export function getAllUtilizations(): TechUtilization[] {
  return TECHNICIANS.map(getTechUtilization);
}

/** Fleet-wide average utilization, as a whole percentage — the mean of every technician's own
 *  utilization ratio, rounded once at the end. */
export function getFleetAvgUtilizationPct(): number {
  const rows = getAllUtilizations();
  const avg = rows.reduce((sum, r) => sum + r.utilization, 0) / rows.length;
  return Math.round(avg * 100);
}

export interface FleetStats {
  totalJobs: number;
  completed: number;
  active: number;
  scheduled: number;
  cancelled: number;
  urgentOpen: number;
}

export function getFleetStats(): FleetStats {
  const live = JOBS.filter((job) => job.status !== "cancelled");
  return {
    totalJobs: live.length,
    completed: JOBS.filter((job) => job.status === "completed").length,
    active: JOBS.filter((job) => job.status === "in_progress").length,
    scheduled: JOBS.filter((job) => job.status === "scheduled").length,
    cancelled: JOBS.filter((job) => job.status === "cancelled").length,
    urgentOpen: JOBS.filter((job) => job.priority === "urgent" && job.status !== "completed" && job.status !== "cancelled").length,
  };
}

/** Jobs that need dispatcher attention right now: urgent priority, not yet wrapped up. The single
 *  source the notifications popover reads from, so its list and its badge count can never drift
 *  apart from each other or from the urgent-open KPI tile. */
export function getUrgentOpenJobs(): Job[] {
  return JOBS.filter((job) => job.priority === "urgent" && job.status !== "completed" && job.status !== "cancelled");
}

/** Fixed 6-day utilization history, ending the day before today — independent demo content, not
 *  derived from `JOBS`. Today's point (7th) is appended by the caller from `getFleetAvgUtilizationPct`
 *  so the sparkline's final point always matches the KPI tile it sits beside. */
export const UTIL_HISTORY_PREV: number[] = [79, 82, 77, 84, 88, 83];
