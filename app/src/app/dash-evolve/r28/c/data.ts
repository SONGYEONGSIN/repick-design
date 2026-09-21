import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  type LucideIcon,
} from "lucide-react";

/**
 * Trestle — deployment scheduling for field installation teams.
 *
 * Calendar model: everything is plotted against an integer day offset from a
 * fixed epoch (Aug 31, 2026, a Monday) rather than against `new Date()` at
 * render time, so the chart is fully deterministic. `TODAY_DAY` is pinned to
 * Sep 21, 2026 to match the session's real "today".
 */

export const EPOCH_YEAR = 2026;
export const EPOCH_MONTH_INDEX = 7; // August (0-indexed)
export const EPOCH_DATE = 31;

export const TODAY_DAY = 21; // Sep 21, 2026
export const MONTH_VIEW_START = 0; // Aug 31, 2026
export const MONTH_VIEW_END = 55; // Oct 25, 2026 (8 full weeks)
export const WEEK_VIEW_START = 14; // Sep 14, 2026
export const WEEK_VIEW_END = 27; // Sep 27, 2026 (14 days)

export function dayToDate(day: number): Date {
  const d = new Date(EPOCH_YEAR, EPOCH_MONTH_INDEX, EPOCH_DATE);
  d.setDate(d.getDate() + day);
  return d;
}

const shortDateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const weekdayShortFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", weekday: "short" });

export function formatDay(day: number): string {
  return shortDateFmt.format(dayToDate(day));
}

export function formatDayLong(day: number): string {
  return weekdayShortFmt.format(dayToDate(day));
}

export function formatRange(startDay: number, endDay: number): string {
  return `${formatDay(startDay)}–${formatDay(endDay)}`;
}

const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
export function formatPercent(pct: number): string {
  return pctFmt.format(pct / 100);
}

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(n);
}

export type JobStatus = "on-track" | "at-risk" | "blocked" | "unscheduled";
export type JobCategory = "Install" | "Retrofit" | "Audit";

export interface Job {
  id: string;
  code: string;
  site: string;
  city: string;
  crew: string;
  category: JobCategory;
  startDay: number | null;
  endDay: number | null;
  status: JobStatus;
  progressPct: number;
  note: string;
}

export const CREW_NAMES = ["Crew Atlas", "Crew Brant", "Crew Cinder", "Crew Delta", "Crew Echo"] as const;

export const JOBS: Job[] = [
  {
    id: "j1",
    code: "INS-2101",
    site: "Fulton Distribution Hub",
    city: "Newark, NJ",
    crew: "Crew Atlas",
    category: "Install",
    startDay: 1,
    endDay: 9,
    status: "on-track",
    progressPct: 100,
    note: "Completed two days ahead of schedule.",
  },
  {
    id: "j2",
    code: "RTF-2098",
    site: "Meridian Cold Storage",
    city: "Columbus, OH",
    crew: "Crew Brant",
    category: "Retrofit",
    startDay: 4,
    endDay: 16,
    status: "on-track",
    progressPct: 100,
    note: "Closed out; punch list clear.",
  },
  {
    id: "j3",
    code: "AUD-2114",
    site: "Harbor Point Terminal",
    city: "Savannah, GA",
    crew: "Crew Cinder",
    category: "Audit",
    startDay: 6,
    endDay: 10,
    status: "blocked",
    progressPct: 40,
    note: "Dock access permit expired mid-audit; awaiting port authority renewal.",
  },
  {
    id: "j4",
    code: "INS-2122",
    site: "Pinnacle Logistics Park",
    city: "Reno, NV",
    crew: "Crew Atlas",
    category: "Install",
    startDay: 9,
    endDay: 20,
    status: "on-track",
    progressPct: 95,
    note: "Final commissioning scheduled for tomorrow.",
  },
  {
    id: "j5",
    code: "RTF-2105",
    site: "Crestline Fulfillment",
    city: "Louisville, KY",
    crew: "Crew Delta",
    category: "Retrofit",
    startDay: 11,
    endDay: 25,
    status: "at-risk",
    progressPct: 55,
    note: "Electrical subcontractor short-staffed; a three-day slip is likely.",
  },
  {
    id: "j6",
    code: "INS-2130",
    site: "Bayline Cross-Dock",
    city: "Tampa, FL",
    crew: "Crew Echo",
    category: "Install",
    startDay: 13,
    endDay: 24,
    status: "on-track",
    progressPct: 60,
    note: "Tracking to plan; materials on site.",
  },
  {
    id: "j7",
    code: "AUD-2119",
    site: "Northgate Depot",
    city: "Kansas City, MO",
    crew: "Crew Brant",
    category: "Audit",
    startDay: 15,
    endDay: 19,
    status: "blocked",
    progressPct: 20,
    note: "Fire-suppression inspector flagged a non-conformance; rework required before sign-off.",
  },
  {
    id: "j8",
    code: "INS-2138",
    site: "Silverline Micro-Fulfillment",
    city: "Phoenix, AZ",
    crew: "Crew Cinder",
    category: "Install",
    startDay: 17,
    endDay: 29,
    status: "at-risk",
    progressPct: 35,
    note: "Rooftop HVAC delivery delayed one week by the supplier.",
  },
  {
    id: "j9",
    code: "RTF-2141",
    site: "Union Yard Annex",
    city: "Chicago, IL",
    crew: "Crew Atlas",
    category: "Retrofit",
    startDay: 19,
    endDay: 33,
    status: "on-track",
    progressPct: 25,
    note: "On schedule, week one of four.",
  },
  {
    id: "j10",
    code: "INS-2144",
    site: "Copperline DC-7",
    city: "Salt Lake City, UT",
    crew: "Crew Delta",
    category: "Install",
    startDay: 20,
    endDay: 34,
    status: "at-risk",
    progressPct: 15,
    note: "Utility power upgrade running four days behind.",
  },
  {
    id: "j11",
    code: "AUD-2126",
    site: "Westgate Cold Chain",
    city: "Fresno, CA",
    crew: "Crew Echo",
    category: "Audit",
    startDay: 22,
    endDay: 26,
    status: "on-track",
    progressPct: 0,
    note: "Kickoff confirmed for tomorrow morning.",
  },
  {
    id: "j12",
    code: "RTF-2150",
    site: "Ironbridge Terminal",
    city: "Pittsburgh, PA",
    crew: "Crew Brant",
    category: "Retrofit",
    startDay: 24,
    endDay: 38,
    status: "on-track",
    progressPct: 0,
    note: "Materials staged; crew mobilizing Monday.",
  },
  {
    id: "j13",
    code: "INS-2155",
    site: "Sablewood Fulfillment",
    city: "Charlotte, NC",
    crew: "Crew Cinder",
    category: "Install",
    startDay: 27,
    endDay: 41,
    status: "at-risk",
    progressPct: 0,
    note: "County permit review delayed; approval expected late this week.",
  },
  {
    id: "j14",
    code: "RTF-2160",
    site: "Marrow Creek DC",
    city: "Boise, ID",
    crew: "Crew Atlas",
    category: "Retrofit",
    startDay: 33,
    endDay: 47,
    status: "on-track",
    progressPct: 0,
    note: "Scope confirmed; lead time on schedule.",
  },
  {
    id: "j15",
    code: "INS-2170",
    site: "Longview Regional Hub",
    city: "Amarillo, TX",
    crew: "Unassigned",
    category: "Install",
    startDay: null,
    endDay: null,
    status: "unscheduled",
    progressPct: 0,
    note: "Site survey pending; no crew assigned yet.",
  },
  {
    id: "j16",
    code: "RTF-2175",
    site: "Basalt Ridge Depot",
    city: "Bend, OR",
    crew: "Unassigned",
    category: "Retrofit",
    startDay: null,
    endDay: null,
    status: "unscheduled",
    progressPct: 0,
    note: "Awaiting landlord sign-off before scheduling can begin.",
  },
];

export const SCHEDULED_JOBS = JOBS.filter((j): j is Job & { startDay: number; endDay: number } => j.startDay !== null && j.endDay !== null);
export const UNSCHEDULED_JOBS = JOBS.filter((j) => j.status === "unscheduled");
export const QUEUE_JOBS = JOBS.filter((j) => j.status !== "on-track");

export interface StatusMeta {
  label: string;
  icon: LucideIcon;
  text: string;
  bg: string;
  ring: string;
  bar: string;
  barTrack: string;
  barTrackHover: string;
  barBorder: string;
  dot: string;
}

export const STATUS_META: Record<JobStatus, StatusMeta> = {
  "on-track": {
    label: "On track",
    icon: CheckCircle2,
    text: "text-emerald-400",
    bg: "bg-emerald-500/15",
    ring: "ring-emerald-500/30",
    bar: "bg-emerald-500",
    barTrack: "bg-emerald-500/25",
    barTrackHover: "hover:bg-emerald-500/35",
    barBorder: "border-emerald-400/50",
    dot: "bg-emerald-400",
  },
  "at-risk": {
    label: "At risk",
    icon: AlertTriangle,
    text: "text-amber-400",
    bg: "bg-amber-500/15",
    ring: "ring-amber-500/30",
    bar: "bg-amber-500",
    barTrack: "bg-amber-500/25",
    barTrackHover: "hover:bg-amber-500/35",
    barBorder: "border-amber-400/50",
    dot: "bg-amber-400",
  },
  blocked: {
    label: "Blocked",
    icon: AlertOctagon,
    text: "text-rose-400",
    bg: "bg-rose-500/15",
    ring: "ring-rose-500/30",
    bar: "bg-rose-500",
    barTrack: "bg-rose-500/25",
    barTrackHover: "hover:bg-rose-500/35",
    barBorder: "border-rose-400/50",
    dot: "bg-rose-400",
  },
  unscheduled: {
    label: "Unscheduled",
    icon: CircleDashed,
    text: "text-zinc-400",
    bg: "bg-zinc-500/15",
    ring: "ring-zinc-500/30",
    bar: "bg-zinc-600",
    barTrack: "bg-zinc-500/25",
    barTrackHover: "hover:bg-zinc-500/35",
    barBorder: "border-zinc-500/50",
    dot: "bg-zinc-400",
  },
};

export function overlapDays(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  const start = Math.max(aStart, bStart);
  const end = Math.min(aEnd, bEnd);
  return Math.max(0, end - start + 1);
}

export interface CrewSummary {
  name: string;
  activeJobs: number;
  utilizationPct: number;
  nextAvailableDay: number;
  nextAvailableLabel: string;
}

function computeNextAvailable(intervals: Array<[number, number]>, fromDay: number): number {
  let day = fromDay;
  for (let i = 0; i < 90; i++) {
    const busy = intervals.some(([s, e]) => day >= s && day <= e);
    if (!busy) return day;
    day += 1;
  }
  return day;
}

export const CREWS: CrewSummary[] = CREW_NAMES.map((name) => {
  const crewJobs = SCHEDULED_JOBS.filter((j) => j.crew === name);
  const intervals: Array<[number, number]> = crewJobs.map((j): [number, number] => [j.startDay, j.endDay]);
  const weekOverlap = crewJobs.reduce((sum, j) => sum + overlapDays(j.startDay, j.endDay, WEEK_VIEW_START, WEEK_VIEW_END), 0);
  const utilizationPct = Math.min(100, Math.round((weekOverlap / (WEEK_VIEW_END - WEEK_VIEW_START + 1)) * 100));
  const nextAvailableDay = computeNextAvailable(intervals, TODAY_DAY);
  return {
    name,
    activeJobs: crewJobs.length,
    utilizationPct,
    nextAvailableDay,
    nextAvailableLabel: nextAvailableDay <= TODAY_DAY ? "Today" : formatDay(nextAvailableDay),
  };
});

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300";

export const TOTALS = {
  total: JOBS.length,
  onTrack: JOBS.filter((j) => j.status === "on-track").length,
  atRisk: JOBS.filter((j) => j.status === "at-risk").length,
  blocked: JOBS.filter((j) => j.status === "blocked").length,
  unscheduled: JOBS.filter((j) => j.status === "unscheduled").length,
  avgProgress: Math.round(JOBS.reduce((sum, j) => sum + j.progressPct, 0) / JOBS.length),
};
