import { Building2, Gauge, LucideIcon, ScrollText, Snowflake, Truck } from "lucide-react";
import type { AlertStatus, Severity } from "./tokens";

export const BRAND = { name: "Coldline", Icon: Snowflake };

export const CURRENT_USER = {
  name: "Sana Okafor",
  role: "Cold chain ops lead",
  email: "sana.okafor@coldline.io",
  avatarId: "1494790108377-be9c29b29330",
};

export const WORKSPACES = [
  { id: "pnw", name: "Pacific Northwest network", plan: "38 zones" },
  { id: "gulf", name: "Gulf Coast network", plan: "22 zones" },
  { id: "ne", name: "Northeast corridor", plan: "14 zones" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "monitor",
    title: "Monitor",
    items: [
      { id: "heat", label: "Excursion intensity", Icon: Gauge, active: true },
      { id: "facilities", label: "Facilities", Icon: Building2 },
      { id: "fleet", label: "Fleet devices", Icon: Truck },
    ],
  },
  {
    id: "operate",
    title: "Operate",
    items: [{ id: "reports", label: "Weekly reports", Icon: ScrollText, disabled: true }],
  },
];

// ---------------------------------------------------------------------------
// Excursion intensity grid — deterministic, no Math.random / Date.now anywhere.
// Rows = day of week (Mon–Sun), columns = hour of day (0–23). Value = average
// minutes per hour-slot that monitored reefer units spent outside the safe
// temperature band, aggregated across every active zone in the selected network.
// ---------------------------------------------------------------------------

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

// Baseline excursion minutes per hour across a typical facility-day — two loading
// peaks (morning and afternoon dock activity) with a quiet overnight trough.
const HOUR_BASE = [3, 2, 2, 2, 3, 5, 9, 16, 27, 33, 24, 18, 15, 17, 22, 31, 36, 29, 19, 12, 8, 6, 5, 4];

// Weekday loading intensifies toward Friday pre-weekend shipping; weekends are quiet.
const DAY_MULT = [1.0, 1.05, 1.08, 1.1, 1.15, 0.55, 0.35];

// Trailing 4-week average runs slightly cooler than the current week (a modest
// improvement trend) — a fixed scalar, not a second random series.
const TRAILING_SCALAR = 0.92;

function buildMatrix(scalar: number): number[][] {
  return DAY_MULT.map((mult) => HOUR_BASE.map((base) => Math.round(base * mult * scalar)));
}

export type Period = "week" | "trailing4w";
export const PERIOD_LABEL: Record<Period, string> = { week: "This week", trailing4w: "Trailing 4-wk avg" };
export const MATRIX_BY_PERIOD: Record<Period, number[][]> = {
  week: buildMatrix(1),
  trailing4w: buildMatrix(TRAILING_SCALAR),
};

export const SAFE_THRESHOLD_MIN = 15;

export interface GridStats {
  total: number;
  avgPerSlot: number;
  peak: { day: number; hour: number; value: number };
  compliancePct: number;
}

export function computeStats(matrix: number[][]): GridStats {
  let total = 0;
  let peak = { day: 0, hour: 0, value: -1 };
  let safeCount = 0;
  for (let d = 0; d < matrix.length; d++) {
    for (let h = 0; h < matrix[d].length; h++) {
      const v = matrix[d][h];
      total += v;
      if (v > peak.value) peak = { day: d, hour: h, value: v };
      if (v < SAFE_THRESHOLD_MIN) safeCount += 1;
    }
  }
  const cells = matrix.length * matrix[0].length;
  return {
    total,
    avgPerSlot: Math.round((total / cells) * 10) / 10,
    peak,
    compliancePct: Math.round((safeCount / cells) * 100),
  };
}

export function hourLabel(h: number): string {
  return `${h.toString().padStart(2, "0")}:00`;
}

export type Tier = "minimal" | "light" | "moderate" | "heavy" | "severe";
export function tierFor(value: number): Tier {
  if (value < 5) return "minimal";
  if (value < 15) return "light";
  if (value < 25) return "moderate";
  if (value < 35) return "heavy";
  return "severe";
}
export const TIER_LABEL: Record<Tier, string> = {
  minimal: "Minimal",
  light: "Light",
  moderate: "Moderate",
  heavy: "Heavy",
  severe: "Severe",
};
// Fill classes are contrast-checked stop by stop in ExcursionHeatmap.tsx's header comment —
// violet-500 is deliberately skipped (fails AA with both dark and white text).
export const TIER_FILL: Record<Tier, string> = {
  minimal: "bg-zinc-50",
  light: "bg-violet-100",
  moderate: "bg-violet-200",
  heavy: "bg-violet-400",
  severe: "bg-violet-600",
};
export const TIER_TEXT: Record<Tier, string> = {
  minimal: "text-zinc-900",
  light: "text-zinc-900",
  moderate: "text-zinc-900",
  heavy: "text-zinc-900",
  severe: "text-white",
};

// ---------------------------------------------------------------------------
// Recent Alerts Log — an independent, network-wide feed. It is deliberately
// NOT threaded to the heatmap's pinned cell (see AlertsLog.tsx) — it always
// shows the same rows regardless of what is pinned above it.
// ---------------------------------------------------------------------------

export interface AlertRow {
  id: string;
  zone: string;
  facility: string;
  severity: Severity;
  durationMin: number;
  status: AlertStatus;
  detected: string;
}

export const ALERTS: AlertRow[] = [
  { id: "a1", zone: "Dock 4 — Zone B", facility: "Portland DC", severity: "critical", durationMin: 46, status: "open", detected: "6m ago" },
  { id: "a2", zone: "Cold room 2", facility: "Tacoma Hub", severity: "warning", durationMin: 22, status: "open", detected: "18m ago" },
  { id: "a3", zone: "Trailer bay 7", facility: "Seattle North", severity: "critical", durationMin: 51, status: "ack", detected: "34m ago" },
  { id: "a4", zone: "Dock 1 — Zone A", facility: "Portland DC", severity: "info", durationMin: 6, status: "resolved", detected: "1h ago" },
  { id: "a5", zone: "Cold room 5", facility: "Eugene Depot", severity: "warning", durationMin: 19, status: "open", detected: "1h ago" },
  { id: "a6", zone: "Trailer bay 3", facility: "Tacoma Hub", severity: "info", durationMin: 8, status: "resolved", detected: "2h ago" },
  { id: "a7", zone: "Dock 6 — Zone C", facility: "Seattle North", severity: "warning", durationMin: 27, status: "ack", detected: "3h ago" },
  { id: "a8", zone: "Cold room 1", facility: "Eugene Depot", severity: "critical", durationMin: 39, status: "open", detected: "3h ago" },
];

export const SEVERITY_RANK: Record<Severity, number> = { critical: 2, warning: 1, info: 0 };

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
export function formatMin(n: number): string {
  return `${new Intl.NumberFormat("en-US").format(n)} min`;
}

// Fixed avatar pool — indexed, never Math.random-selected.
export const AVATAR_IDS = [
  "1123897727-8f129e1688ce",
  "1438761681033-6461ffad8d80",
  "1472099645785-5658abf4ff4e",
  "1487412720507-e7ab37603c6f",
];

export const SEARCH_ENTRIES = ALERTS.map((a) => ({ id: a.id, title: `${a.zone} — ${a.facility}`, meta: `${a.durationMin} min · ${a.status}`, Icon: Gauge }));
