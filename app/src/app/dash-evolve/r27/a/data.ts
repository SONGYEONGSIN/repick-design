import { BarChart3, Compass, Flag, GaugeCircle, HeartHandshake, LineChart, ListChecks, LucideIcon, Rocket, ServerCog } from "lucide-react";
import type { BandTone } from "./tokens";

export const BRAND = { name: "Waymark", Icon: Compass };

export const CURRENT_USER = {
  name: "Sam Ortiz",
  role: "Head of product strategy",
  email: "sam.ortiz@waymarkhq.io",
  avatarId: "1519244703995-f4e0f30006d5",
};

export const WORKSPACES = [
  { id: "eng", name: "Engineering & product", plan: "Q3 2026 cycle" },
  { id: "gtm", name: "Go-to-market", plan: "Q3 2026 cycle" },
  { id: "exec", name: "Company-wide", plan: "Board rollup" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "goals", label: "Goals console", Icon: GaugeCircle, active: true },
      { id: "checkins", label: "Check-ins", Icon: ListChecks },
      { id: "objectives", label: "Objectives", Icon: Flag },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "reports", label: "Quarterly reports", Icon: BarChart3 },
      { id: "forecasts", label: "Confidence forecasts", Icon: LineChart, disabled: true },
    ],
  },
];

export type Team = "platform" | "growth" | "cs";
export const TEAM_LABEL: Record<Team, string> = { platform: "Platform", growth: "Growth", cs: "Customer Success" };

export interface Objective {
  id: string;
  code: string;
  name: string;
  team: Team;
  Icon: LucideIcon;
}

export const OBJECTIVES: Objective[] = [
  { id: "o1", code: "O1", name: "Ship a reliable release train", team: "platform", Icon: ServerCog },
  { id: "o2", code: "O2", name: "Grow qualified pipeline", team: "growth", Icon: Rocket },
  { id: "o3", code: "O3", name: "Deepen customer retention", team: "cs", Icon: HeartHandshake },
];

export type Unit = "pct" | "ms" | "usd" | "usdCompact" | "count" | "days" | "score";
export type Direction = "up" | "down";
export interface Segment {
  tone: BandTone;
  from: number;
  to: number;
}

export interface KeyResult {
  id: string;
  code: string;
  name: string;
  objectiveId: string;
  unit: Unit;
  domainMax: number;
  target: number;
  quarterStart: number;
  latest: number;
  direction: Direction;
  segments: Segment[];
  owner: { name: string; role: string; avatarId: string };
  note: string;
  checkinDate: string;
}

const JORDAN = { name: "Jordan Ames", role: "Staff engineer", avatarId: "1544005313-94ddf0286df2" };
const DANA = { name: "Dana Reyes", role: "SRE lead", avatarId: "1547425260-76bcadfb4f2c" };
const MARCUS = { name: "Marcus Webb", role: "Growth PM", avatarId: "1552664730-d307ca884978" };
const ELENA = { name: "Elena Cho", role: "Demand gen lead", avatarId: "1543076447-215ad9ba6923" };
const THEO = { name: "Theo Banks", role: "CS operations", avatarId: "1553062407-98eeb64c6a62" };
const NAOMI = { name: "Naomi Ruiz", role: "Support lead", avatarId: "1560243563-062bfc001d68" };

export const KEY_RESULTS: KeyResult[] = [
  {
    id: "kr1", code: "KR1.1", name: "Deployment success rate", objectiveId: "o1", unit: "pct", domainMax: 100, target: 99.5,
    quarterStart: 96.1, latest: 99.6, direction: "up",
    segments: [{ tone: "poor", from: 0, to: 97 }, { tone: "satisfactory", from: 97, to: 99 }, { tone: "good", from: 99, to: 100 }],
    owner: JORDAN, checkinDate: "2026-09-19",
    note: "Two-approval deploy gate landed; canary rollback caught the one bad build before it reached prod.",
  },
  {
    id: "kr2", code: "KR1.2", name: "Median API latency", objectiveId: "o1", unit: "ms", domainMax: 320, target: 180,
    quarterStart: 260, latest: 205, direction: "down",
    segments: [{ tone: "good", from: 0, to: 180 }, { tone: "satisfactory", from: 180, to: 240 }, { tone: "poor", from: 240, to: 320 }],
    owner: DANA, checkinDate: "2026-09-18",
    note: "Connection pooling fix cut p50 by 55ms; still short of target ahead of the read-replica rollout.",
  },
  {
    id: "kr3", code: "KR1.3", name: "Change-failure rate", objectiveId: "o1", unit: "pct", domainMax: 25, target: 8,
    quarterStart: 18.2, latest: 9.8, direction: "down",
    segments: [{ tone: "good", from: 0, to: 8 }, { tone: "satisfactory", from: 8, to: 15 }, { tone: "poor", from: 15, to: 25 }],
    owner: JORDAN, checkinDate: "2026-09-17",
    note: "Rollback automation is live; close to target after one manual hotfix skipped the gate mid-quarter.",
  },
  {
    id: "kr4", code: "KR1.4", name: "Automated test coverage", objectiveId: "o1", unit: "pct", domainMax: 100, target: 85,
    quarterStart: 64, latest: 83, direction: "up",
    segments: [{ tone: "poor", from: 0, to: 60 }, { tone: "satisfactory", from: 60, to: 80 }, { tone: "good", from: 80, to: 100 }],
    owner: DANA, checkinDate: "2026-09-16",
    note: "Contract tests now cover the billing service; the payments module is the remaining gap.",
  },
  {
    id: "kr5", code: "KR2.1", name: "Qualified pipeline generated", objectiveId: "o2", unit: "usdCompact", domainMax: 500000, target: 420000,
    quarterStart: 210000, latest: 358000, direction: "up",
    segments: [{ tone: "poor", from: 0, to: 250000 }, { tone: "satisfactory", from: 250000, to: 380000 }, { tone: "good", from: 380000, to: 500000 }],
    owner: MARCUS, checkinDate: "2026-09-19",
    note: "Partner-sourced deals picked up after the integrations page relaunch.",
  },
  {
    id: "kr6", code: "KR2.2", name: "Outbound reply rate", objectiveId: "o2", unit: "pct", domainMax: 20, target: 12,
    quarterStart: 5.8, latest: 9.4, direction: "up",
    segments: [{ tone: "poor", from: 0, to: 6 }, { tone: "satisfactory", from: 6, to: 10 }, { tone: "good", from: 10, to: 20 }],
    owner: ELENA, checkinDate: "2026-09-15",
    note: "New sequence copy lifted replies; still testing subject lines against the enterprise segment.",
  },
  {
    id: "kr7", code: "KR2.3", name: "Marketing-sourced signups", objectiveId: "o2", unit: "count", domainMax: 2200, target: 1800,
    quarterStart: 980, latest: 1620, direction: "up",
    segments: [{ tone: "poor", from: 0, to: 1000 }, { tone: "satisfactory", from: 1000, to: 1500 }, { tone: "good", from: 1500, to: 2200 }],
    owner: MARCUS, checkinDate: "2026-09-12",
    note: "The webinar series is the single largest source this quarter, ahead of paid search.",
  },
  {
    id: "kr8", code: "KR2.4", name: "Cost per qualified lead", objectiveId: "o2", unit: "usd", domainMax: 240, target: 140,
    quarterStart: 228, latest: 205, direction: "down",
    segments: [{ tone: "good", from: 0, to: 140 }, { tone: "satisfactory", from: 140, to: 190 }, { tone: "poor", from: 190, to: 240 }],
    owner: ELENA, checkinDate: "2026-09-11",
    note: "Paid social CPL is still elevated; shifting spend toward the channels that convert to pipeline.",
  },
  {
    id: "kr9", code: "KR3.1", name: "Net revenue retention", objectiveId: "o3", unit: "pct", domainMax: 130, target: 112,
    quarterStart: 96, latest: 106, direction: "up",
    segments: [{ tone: "poor", from: 0, to: 98 }, { tone: "satisfactory", from: 98, to: 108 }, { tone: "good", from: 108, to: 130 }],
    owner: THEO, checkinDate: "2026-09-18",
    note: "Expansion from the enterprise cohort offset two mid-market downgrades this quarter.",
  },
  {
    id: "kr10", code: "KR3.2", name: "Gross churn rate", objectiveId: "o3", unit: "pct", domainMax: 8, target: 3,
    quarterStart: 5.6, latest: 4.1, direction: "down",
    segments: [{ tone: "good", from: 0, to: 3 }, { tone: "satisfactory", from: 3, to: 5 }, { tone: "poor", from: 5, to: 8 }],
    owner: NAOMI, checkinDate: "2026-09-10",
    note: "The save-desk playbook is reducing voluntary churn; usage-based accounts remain the highest risk.",
  },
  {
    id: "kr11", code: "KR3.3", name: "CSAT score", objectiveId: "o3", unit: "score", domainMax: 100, target: 90,
    quarterStart: 79, latest: 88, direction: "up",
    segments: [{ tone: "poor", from: 0, to: 70 }, { tone: "satisfactory", from: 70, to: 85 }, { tone: "good", from: 85, to: 100 }],
    owner: NAOMI, checkinDate: "2026-09-17",
    note: "First-response time improvements are the biggest driver in this quarter's survey comments.",
  },
  {
    id: "kr12", code: "KR3.4", name: "Support ticket backlog age", objectiveId: "o3", unit: "days", domainMax: 8, target: 2,
    quarterStart: 6.8, latest: 5.1, direction: "down",
    segments: [{ tone: "good", from: 0, to: 2 }, { tone: "satisfactory", from: 2, to: 4 }, { tone: "poor", from: 4, to: 8 }],
    owner: THEO, checkinDate: "2026-09-09",
    note: "Backlog is still aging past target; the new triage rota starts next sprint.",
  },
];

export function objectiveFor(kr: KeyResult): Objective {
  return OBJECTIVES.find((o) => o.id === kr.objectiveId) ?? OBJECTIVES[0];
}

export function bandFor(kr: KeyResult, value: number): BandTone {
  const sorted = [...kr.segments].sort((a, b) => a.from - b.from);
  let tone: BandTone = sorted[0].tone;
  for (const seg of sorted) {
    if (value >= seg.from) tone = seg.tone;
  }
  return tone;
}

// Fraction of the domain each value occupies, for the bar/tick geometry — clamped so a value that
// (rarely) exceeds domainMax never draws past the card edge.
export function domainPct(kr: KeyResult, value: number): number {
  return r2(Math.max(0, Math.min(100, (value / kr.domainMax) * 100)));
}

// How much of its target a KR has achieved, direction-aware and capped at 100 — the only input the
// objective rollup card reads. Always computed from the *latest* checkpoint (see FocusRail.tsx for
// why the rollup intentionally never reads the grid's period toggle or its pin).
export function achievementPct(kr: KeyResult): number {
  const ratio = kr.direction === "up" ? kr.latest / kr.target : kr.target / kr.latest;
  return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
}

function r1(n: number): number {
  return Math.round(n * 10) / 10;
}
function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function formatKrValue(kr: KeyResult, value: number): string {
  switch (kr.unit) {
    case "pct":
      return `${trimNum(r1(value))}%`;
    case "ms":
      return `${new Intl.NumberFormat("en-US").format(Math.round(value))} ms`;
    case "usd":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
    case "usdCompact": {
      // Hand-rolled instead of Intl.NumberFormat's `notation: "compact"`: that option's rendering
      // (trailing-zero and rounding behavior) is ICU/CLDR-version-dependent and differs between
      // Node's bundled ICU and a browser's, which produced a server/client hydration mismatch
      // ("$358.0K" on the server vs "$358K" in the browser) for the exact same input value.
      const sign = value < 0 ? "−" : "";
      const abs = Math.abs(value);
      if (abs >= 1_000_000) return `${sign}$${trimNum(r1(abs / 1_000_000))}M`;
      if (abs >= 1_000) return `${sign}$${trimNum(r1(abs / 1000))}K`;
      return `${sign}$${trimNum(r1(abs))}`;
    }
    case "count":
      return new Intl.NumberFormat("en-US").format(Math.round(value));
    case "days":
      return `${trimNum(r1(value))}d`;
    case "score":
      return `${Math.round(value)}/100`;
    default:
      return String(value);
  }
}

// Signed change since quarter start, formatted with the same per-unit rules as the value itself.
// The sign follows the raw arithmetic (a "down is better" metric can show a negative number that is
// still an improvement) — `improved` carries the actual good/bad verdict for icon + color, so the
// text is never asked to double as the only signal.
export function deltaSince(kr: KeyResult): { improved: boolean; diff: number; text: string } {
  const diff = r1(kr.latest - kr.quarterStart);
  const improved = kr.direction === "up" ? diff > 0 : diff < 0;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "±";
  // "score" reuses formatKrValue's "/100" suffix for a value, but that reads oddly on a *delta*
  // ("+9/100") — every other unit's magnitude format already doubles fine as a delta magnitude.
  const magnitude = kr.unit === "score" ? `${Math.round(Math.abs(diff))} pts` : formatKrValue(kr, Math.abs(diff));
  return { improved, diff, text: `${sign}${magnitude} vs quarter start` };
}

export const CHECKINS = KEY_RESULTS.map((kr) => ({
  id: `chk-${kr.id}`,
  krId: kr.id,
  date: kr.checkinDate,
}));

const WEEK_START = "2026-09-14"; // Monday of the current cycle week — used only for the KPI count below.
export const CHECKINS_THIS_WEEK = CHECKINS.filter((c) => c.date >= WEEK_START).length;

export const ON_TRACK_COUNT = KEY_RESULTS.filter((kr) => bandFor(kr, kr.latest) === "good").length;
export const AT_RISK_COUNT = KEY_RESULTS.filter((kr) => bandFor(kr, kr.latest) === "satisfactory").length;
export const OFF_TRACK_COUNT = KEY_RESULTS.filter((kr) => bandFor(kr, kr.latest) === "poor").length;

// Six-week trend strips ending in this week's computed figure — only the first five points are
// hand-authored history; the trailing point is always the live count above, so the sparkline can
// never silently drift out of sync with the KPI number beside it.
export const ON_TRACK_TREND = [2, 2, 3, 3, 3, ON_TRACK_COUNT];
export const CHECKIN_TREND = [5, 6, 4, 7, 6, CHECKINS_THIS_WEEK];

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${iso}T00:00:00`));
}

export const SEARCH_ENTRIES = [
  ...KEY_RESULTS.map((kr) => ({ id: kr.id, kind: "key result" as const, title: `${kr.code} — ${kr.name}`, meta: `${objectiveFor(kr).name} · ${kr.owner.name}`, Icon: GaugeCircle })),
  ...OBJECTIVES.map((o) => ({ id: o.id, kind: "objective" as const, title: `${o.code} — ${o.name}`, meta: `${TEAM_LABEL[o.team]} team`, Icon: Flag })),
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Change-failure rate check-in logged by Jordan Ames", time: "1h ago" },
  { id: "n2", text: "Net revenue retention crossed into the satisfactory band", time: "3h ago" },
  { id: "n3", text: "Weekly OKR digest for Sep 14–Sep 20 is ready", time: "1d ago" },
];
