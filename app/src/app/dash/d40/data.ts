/**
 * Cadence — deterministic dummy data for the Release &amp; Reliability console.
 * No Math.random / Date.now anywhere: a small seeded Lehmer/Park-Miller PRNG drives every
 * generated value, and all dates are fixed UTC timestamps (never wall-clock). Re-running this
 * module always produces the exact same grid, deploys, and stats.
 */

import type { LucideIcon } from "lucide-react";
import { Activity, Gauge, GitBranch, Radio, Server, Settings, ShieldAlert, Timer } from "lucide-react";

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ------------------------------------------------------------ Seeded PRNG */

/** Park-Miller / Lehmer generator — deterministic, no Math.random. */
function makePrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* --------------------------------------------------------------- Brand */

export const BRAND = { name: "Cadence", tagline: "Release & Reliability Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-orbital", name: "Orbital Platform", plan: "Growth plan" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session data. */
export const CURRENT_USER = {
  name: "Dara Whitfield",
  role: "Platform Engineer",
  email: "dara.whitfield@cadence-app.io",
  avatarId: "1500648767791-00dcc994a43e",
};

/* -------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "engineering",
    title: "Engineering",
    items: [
      { id: "overview", label: "Release health", Icon: Activity, active: true },
      { id: "services", label: "Services", Icon: Server, disabled: true },
      { id: "pipelines", label: "Pipelines", Icon: GitBranch, disabled: true },
    ],
  },
  {
    id: "reliability",
    title: "Reliability",
    items: [
      { id: "incidents", label: "Incidents", Icon: ShieldAlert, disabled: true },
      { id: "oncall", label: "On-call", Icon: Radio, disabled: true },
      { id: "slo", label: "SLOs", Icon: Gauge, disabled: true },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [{ id: "settings", label: "Settings", Icon: Settings, disabled: true }],
  },
];

/* ------------------------------------------------------------- Services */

export type ServiceId = "checkout-api" | "payments-worker" | "auth-gateway" | "search-indexer" | "notify-svc" | "web-frontend";

export type Service = {
  id: ServiceId;
  name: string;
  dot: string;
  text: string;
};

export const SERVICES: Service[] = [
  { id: "checkout-api", name: "Checkout API", dot: "bg-sky-500", text: "text-sky-700 dark:text-sky-300" },
  { id: "payments-worker", name: "Payments Worker", dot: "bg-cyan-500", text: "text-cyan-700 dark:text-cyan-300" },
  { id: "auth-gateway", name: "Auth Gateway", dot: "bg-violet-500", text: "text-violet-700 dark:text-violet-300" },
  { id: "search-indexer", name: "Search Indexer", dot: "bg-teal-500", text: "text-teal-700 dark:text-teal-300" },
  { id: "notify-svc", name: "Notification Service", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-300" },
  { id: "web-frontend", name: "Web Frontend", dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-300" },
];

export const SERVICE_BY_ID: Record<ServiceId, Service> = Object.fromEntries(SERVICES.map((s) => [s.id, s])) as Record<ServiceId, Service>;

const AUTHORS = [
  { name: "Nia Osei", initials: "NO" },
  { name: "Marcus Lindqvist", initials: "ML" },
  { name: "Priya Chandra", initials: "PC" },
  { name: "Tomas Reyes", initials: "TR" },
  { name: "Elin Karlsson", initials: "EK" },
  { name: "Jonah Whitaker", initials: "JW" },
  { name: "Sofia Bianchi", initials: "SB" },
];

/* ---------------------------------------------------------- Date range */

const DAY_MS = 86_400_000;
/** Fixed UTC anchor date for the fictional data range — never Date.now(). Chosen so the 98-day
 *  range starts on a Sunday, producing an exact 14-column grid with no leading/trailing padding. */
const RANGE_END_MS = Date.UTC(2026, 6, 25);
const QUARTER_DAYS = 98; // 14 full weeks
const RANGE_START_MS = RANGE_END_MS - (QUARTER_DAYS - 1) * DAY_MS;

const leadingPad = new Date(RANGE_START_MS).getUTCDay(); // 0=Sun..6=Sat
const GRID_START_MS = RANGE_START_MS - leadingPad * DAY_MS;
const rawTotalCells = leadingPad + QUARTER_DAYS;
const trailingPad = (7 - (rawTotalCells % 7)) % 7;
export const GRID_TOTAL_CELLS = rawTotalCells + trailingPad;
export const GRID_COLUMNS = GRID_TOTAL_CELLS / 7;

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const dateFmtShort = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });

export function formatDate(ms: number): string {
  return dateFmt.format(new Date(ms));
}
export function formatDateShort(ms: number): string {
  return dateFmtShort.format(new Date(ms));
}

/* -------------------------------------------------------------- Deploys */

export type DeployStatus = "success" | "rolled_back" | "failed";

export type DeployRecord = {
  id: string;
  dateMs: number;
  serviceId: ServiceId;
  author: string;
  authorInitials: string;
  durationMin: number;
  leadTimeHours: number;
  status: DeployStatus;
};

export type DayCell = {
  index: number;
  col: number;
  row: number;
  dateMs: number;
  inRange: boolean;
  deployCount: number;
  incident: boolean;
  mttrMinutes: number | null;
  deploys: DeployRecord[];
};

const rng = makePrng(88172645);

export const DAYS: DayCell[] = [];
export const ALL_DEPLOYS: DeployRecord[] = [];

for (let i = 0; i < GRID_TOTAL_CELLS; i++) {
  const dateMs = GRID_START_MS + i * DAY_MS;
  const col = Math.floor(i / 7);
  const row = i % 7; // 0=Sun..6=Sat
  const inRange = dateMs >= RANGE_START_MS && dateMs <= RANGE_END_MS;

  if (!inRange) {
    DAYS.push({ index: i, col, row, dateMs, inRange: false, deployCount: 0, incident: false, mttrMinutes: null, deploys: [] });
    continue;
  }

  const isWeekend = row === 0 || row === 6;
  const bucketRoll = rng();
  let count: number;
  if (bucketRoll < 0.08) count = 0;
  else if (bucketRoll < 0.35) count = 1;
  else if (bucketRoll < 0.6) count = 2;
  else if (bucketRoll < 0.78) count = 3;
  else if (bucketRoll < 0.9) count = 4;
  else if (bucketRoll < 0.97) count = 5;
  else if (bucketRoll < 0.995) count = 6;
  else count = 8;
  if (isWeekend) count = Math.round(count * 0.3);

  const deploys: DeployRecord[] = [];
  for (let k = 0; k < count; k++) {
    const service = SERVICES[Math.floor(rng() * SERVICES.length)];
    const author = AUTHORS[Math.floor(rng() * AUTHORS.length)];
    const durationMin = 3 + Math.floor(rng() * 40);
    const leadTimeHours = round2(0.4 + rng() * 7.6);
    const statusRoll = rng();
    const status: DeployStatus = statusRoll < 0.88 ? "success" : statusRoll < 0.96 ? "rolled_back" : "failed";
    deploys.push({
      id: `dep-${i}-${k}`,
      dateMs,
      serviceId: service.id,
      author: author.name,
      authorInitials: author.initials,
      durationMin,
      leadTimeHours,
      status,
    });
  }

  const incident = deploys.some((d) => d.status !== "success");
  const mttrMinutes = incident ? 8 + Math.floor(rng() * 112) : null;

  DAYS.push({ index: i, col, row, dateMs, inRange: true, deployCount: count, incident, mttrMinutes, deploys });
  ALL_DEPLOYS.push(...deploys);
}

/** Most-recent-first, for the recent-deploys table. */
export const ALL_DEPLOYS_DESC: DeployRecord[] = [...ALL_DEPLOYS].sort((a, b) => b.dateMs - a.dateMs || a.id.localeCompare(b.id));

/* ------------------------------------------------------------ Weekly rollups */

export type WeekAgg = {
  col: number;
  weekStartMs: number;
  deployCount: number;
  failCount: number;
  incidentDays: number;
  mttrSum: number;
  mttrCount: number;
  leadTimeSum: number;
  leadTimeCount: number;
};

export const WEEKS: WeekAgg[] = Array.from({ length: GRID_COLUMNS }, (_, col) => ({
  col,
  weekStartMs: GRID_START_MS + col * 7 * DAY_MS,
  deployCount: 0,
  failCount: 0,
  incidentDays: 0,
  mttrSum: 0,
  mttrCount: 0,
  leadTimeSum: 0,
  leadTimeCount: 0,
}));

for (const day of DAYS) {
  if (!day.inRange) continue;
  const w = WEEKS[day.col];
  w.deployCount += day.deployCount;
  w.failCount += day.deploys.filter((d) => d.status !== "success").length;
  if (day.incident) w.incidentDays += 1;
  if (day.mttrMinutes != null) {
    w.mttrSum += day.mttrMinutes;
    w.mttrCount += 1;
  }
  for (const d of day.deploys) {
    w.leadTimeSum += d.leadTimeHours;
    w.leadTimeCount += 1;
  }
}

/** Weeks that contain at least one in-range day — trims the padded/empty leading & trailing weeks. */
export const ACTIVE_WEEKS: WeekAgg[] = WEEKS.filter((w) => DAYS.some((d) => d.inRange && d.col === w.col));

export function weeklyDeployFreq(w: WeekAgg): number {
  return w.deployCount;
}
export function weeklyCfr(w: WeekAgg): number {
  return w.deployCount === 0 ? 0 : round1((w.failCount / w.deployCount) * 100);
}
export function weeklyMttr(w: WeekAgg): number {
  return w.mttrCount === 0 ? 0 : Math.round(w.mttrSum / w.mttrCount);
}
export function weeklyLeadTime(w: WeekAgg): number {
  return w.leadTimeCount === 0 ? 0 : round1(w.leadTimeSum / w.leadTimeCount);
}

/* --------------------------------------------------------------- Periods */

export type PeriodId = "6w" | "quarter";
export const PERIODS: { id: PeriodId; label: string; weeks: number }[] = [
  { id: "6w", label: "Last 6 weeks", weeks: 6 },
  { id: "quarter", label: "Last quarter", weeks: ACTIVE_WEEKS.length },
];

export function weeksForPeriod(periodId: PeriodId): WeekAgg[] {
  const n = PERIODS.find((p) => p.id === periodId)?.weeks ?? ACTIVE_WEEKS.length;
  return ACTIVE_WEEKS.slice(-n);
}

export function daysForPeriod(periodId: PeriodId): DayCell[] {
  const weeks = weeksForPeriod(periodId);
  const cols = new Set(weeks.map((w) => w.col));
  return DAYS.filter((d) => cols.has(d.col));
}

/* ---------------------------------------------------------------- Stats */

export type HeroStat = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  trendGood: boolean;
  trendDirection: "up" | "down" | "flat";
  trendLabel: string;
  Icon: LucideIcon;
  spark: number[];
};

export function computeHeroStats(periodId: PeriodId): HeroStat[] {
  const weeks = weeksForPeriod(periodId);
  const startIdx = ACTIVE_WEEKS.indexOf(weeks[0]);
  const hasExternalPrior = startIdx - weeks.length >= 0;
  // When the selected period already spans the entire tracked range (e.g. "Last quarter"), there is
  // no external prior period to compare against — fall back to comparing the second half of the
  // window against its first half so the trend is honest rather than a misleading "flat 0%".
  const prevWeeks = hasExternalPrior ? ACTIVE_WEEKS.slice(startIdx - weeks.length, startIdx) : weeks.slice(0, Math.max(1, Math.floor(weeks.length / 2)));
  const comparisonSuffix = hasExternalPrior ? "vs. prior period" : "vs. first half of period";

  const totalDeploys = weeks.reduce((s, w) => s + w.deployCount, 0);
  const totalFail = weeks.reduce((s, w) => s + w.failCount, 0);
  const totalMttrSum = weeks.reduce((s, w) => s + w.mttrSum, 0);
  const totalMttrCount = weeks.reduce((s, w) => s + w.mttrCount, 0);
  const totalLeadSum = weeks.reduce((s, w) => s + w.leadTimeSum, 0);
  const totalLeadCount = weeks.reduce((s, w) => s + w.leadTimeCount, 0);

  const deployFreq = round1(totalDeploys / weeks.length);
  const cfr = totalDeploys === 0 ? 0 : round1((totalFail / totalDeploys) * 100);
  const mttr = totalMttrCount === 0 ? 0 : Math.round(totalMttrSum / totalMttrCount);
  const leadTime = totalLeadCount === 0 ? 0 : round1(totalLeadSum / totalLeadCount);

  const prevDeploys = prevWeeks.reduce((s, w) => s + w.deployCount, 0);
  const prevFreq = prevWeeks.length ? round1(prevDeploys / prevWeeks.length) : deployFreq;
  const prevFail = prevWeeks.reduce((s, w) => s + w.failCount, 0);
  const prevCfr = prevDeploys === 0 ? cfr : round1((prevFail / prevDeploys) * 100);
  const prevMttrSum = prevWeeks.reduce((s, w) => s + w.mttrSum, 0);
  const prevMttrCount = prevWeeks.reduce((s, w) => s + w.mttrCount, 0);
  const prevMttr = prevMttrCount === 0 ? mttr : Math.round(prevMttrSum / prevMttrCount);
  const prevLeadSum = prevWeeks.reduce((s, w) => s + w.leadTimeSum, 0);
  const prevLeadCount = prevWeeks.reduce((s, w) => s + w.leadTimeCount, 0);
  const prevLead = prevLeadCount === 0 ? leadTime : round1(prevLeadSum / prevLeadCount);

  function pctDelta(cur: number, prev: number): { direction: "up" | "down" | "flat"; label: string } {
    if (prev === 0 && cur === 0) return { direction: "flat", label: `flat ${comparisonSuffix}` };
    if (prev === 0) return { direction: "up", label: `new activity ${comparisonSuffix}` };
    const delta = round1(((cur - prev) / prev) * 100);
    const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
    return { direction, label: `${direction} ${Math.abs(delta)}% ${comparisonSuffix}` };
  }

  const freqDelta = pctDelta(deployFreq, prevFreq);
  const cfrDelta = pctDelta(cfr, prevCfr);
  const mttrDelta = pctDelta(mttr, prevMttr);
  const leadDelta = pctDelta(leadTime, prevLead);

  return [
    {
      id: "deploy-frequency",
      label: "Deploy frequency",
      value: deployFreq.toFixed(1),
      unit: "/ week",
      trendGood: deployFreq >= prevFreq,
      trendDirection: freqDelta.direction,
      trendLabel: freqDelta.label,
      Icon: GitBranch,
      spark: weeks.map(weeklyDeployFreq),
    },
    {
      id: "change-failure-rate",
      label: "Change failure rate",
      value: cfr.toFixed(1),
      unit: "%",
      trendGood: cfr <= prevCfr,
      trendDirection: cfrDelta.direction,
      trendLabel: cfrDelta.label,
      Icon: ShieldAlert,
      spark: weeks.map(weeklyCfr),
    },
    {
      id: "mttr",
      label: "Mean time to recovery",
      value: String(mttr),
      unit: "min",
      trendGood: mttr <= prevMttr,
      trendDirection: mttrDelta.direction,
      trendLabel: mttrDelta.label,
      Icon: Timer,
      spark: weeks.map(weeklyMttr),
    },
    {
      id: "lead-time",
      label: "Lead time for changes",
      value: leadTime.toFixed(1),
      unit: "hrs",
      trendGood: leadTime <= prevLead,
      trendDirection: leadDelta.direction,
      trendLabel: leadDelta.label,
      Icon: Gauge,
      spark: weeks.map(weeklyLeadTime),
    },
  ];
}

export const STATUS_LABEL: Record<DeployStatus, string> = {
  success: "Success",
  rolled_back: "Rolled back",
  failed: "Failed",
};
