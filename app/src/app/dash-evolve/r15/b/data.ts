import type { Corridor, Hub, Lane, PeriodId, SeriesPoint, Status } from "./types";

export const BRAND = { name: "Traverse", tagline: "Regional network operations" };

export const CURRENT_USER = { name: "Dana Whitfield", role: "Network Operations Lead", initials: "DW" };

export const CORRIDOR_LABEL: Record<Corridor, string> = {
  west: "West corridor",
  central: "Central corridor",
  east: "East corridor",
};

export const STATUS_LABEL: Record<Status, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  delayed: "Delayed",
};

export const PERIODS: { id: PeriodId; label: string; fullLabel: string }[] = [
  { id: "7", label: "7D", fullLabel: "trailing 7 days" },
  { id: "14", label: "14D", fullLabel: "trailing 14 days" },
  { id: "30", label: "30D", fullLabel: "trailing 30 days" },
];

/**
 * Twelve regional hubs on a fixed, hand-authored schematic layout (not real-world geodata) — a
 * generative SVG "route network" per charts.catalog's Geographic family. Coordinates are static
 * constants in a 1000×460 viewBox, chosen for even spacing rather than any tile projection.
 * `onTime30`/`delta14`/`delta7` are deterministic hand-authored baselines; every other figure below
 * (network average, at-risk counts, trend series) is derived from these at render time so subtotals
 * always agree with totals.
 */
export const HUBS: Hub[] = [
  { id: "nrs", code: "NRS", name: "Northshore", corridor: "west", x: 120, y: 90, volume: 1180, transitHours: 6.2, capacityPct: 71, onTime30: 96.8, delta14: -0.4, delta7: -1.3 },
  { id: "csd", code: "CSD", name: "Cascadia", corridor: "west", x: 90, y: 230, volume: 1560, transitHours: 7.8, capacityPct: 88, onTime30: 94.1, delta14: 0.3, delta7: 0.9 },
  { id: "snc", code: "SNC", name: "Suncrest", corridor: "west", x: 150, y: 380, volume: 940, transitHours: 9.1, capacityPct: 94, onTime30: 91.4, delta14: -1.1, delta7: -2.6 },
  { id: "hpl", code: "HPL", name: "Highplain", corridor: "west", x: 340, y: 150, volume: 1050, transitHours: 5.4, capacityPct: 63, onTime30: 97.5, delta14: 0.2, delta7: 0.4 },
  { id: "rdr", code: "RDR", name: "Redrock", corridor: "central", x: 280, y: 340, volume: 1310, transitHours: 10.4, capacityPct: 97, onTime30: 88.9, delta14: -2.0, delta7: -4.1 },
  { id: "irp", code: "IRP", name: "Ironport", corridor: "central", x: 480, y: 100, volume: 1890, transitHours: 6.9, capacityPct: 82, onTime30: 95.6, delta14: 0.6, delta7: 1.0 },
  { id: "lkm", code: "LKM", name: "Lakemoor", corridor: "central", x: 520, y: 260, volume: 2240, transitHours: 7.3, capacityPct: 90, onTime30: 93.7, delta14: -0.5, delta7: -0.8 },
  { id: "rvg", code: "RVG", name: "Rivergate", corridor: "central", x: 470, y: 400, volume: 980, transitHours: 8.6, capacityPct: 85, onTime30: 90.2, delta14: -1.4, delta7: -2.2 },
  { id: "pnh", code: "PNH", name: "Pinehold", corridor: "east", x: 680, y: 150, volume: 1420, transitHours: 6.0, capacityPct: 76, onTime30: 96.3, delta14: 0.4, delta7: 0.7 },
  { id: "byl", code: "BYL", name: "Bayline", corridor: "east", x: 760, y: 310, volume: 1970, transitHours: 7.1, capacityPct: 89, onTime30: 94.9, delta14: 0.1, delta7: -0.3 },
  { id: "cdw", code: "CDW", name: "Coldwater", corridor: "east", x: 650, y: 420, volume: 860, transitHours: 8.9, capacityPct: 79, onTime30: 92.6, delta14: -0.8, delta7: -1.7 },
  { id: "slm", code: "SLM", name: "Saltmarsh", corridor: "east", x: 880, y: 230, volume: 1130, transitHours: 5.8, capacityPct: 68, onTime30: 97.1, delta14: 0.3, delta7: 0.5 },
];

export const HUB_BY_ID: Record<string, Hub> = Object.fromEntries(HUBS.map((h) => [h.id, h]));

/** Backbone + spoke lanes — a connected network, not a full mesh. */
export const LANES: Lane[] = [
  ["nrs", "csd"],
  ["nrs", "hpl"],
  ["csd", "snc"],
  ["snc", "rdr"],
  ["rdr", "hpl"],
  ["rdr", "rvg"],
  ["hpl", "irp"],
  ["irp", "lkm"],
  ["irp", "pnh"],
  ["lkm", "rdr"],
  ["lkm", "rvg"],
  ["lkm", "pnh"],
  ["lkm", "byl"],
  ["rvg", "cdw"],
  ["pnh", "byl"],
  ["byl", "slm"],
  ["byl", "cdw"],
];

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** On-time rate for a hub at a given period, derived from the stored 30d baseline + deltas. */
export function onTimeForPeriod(hub: Hub, period: PeriodId): number {
  const v = period === "30" ? hub.onTime30 : period === "14" ? hub.onTime30 + hub.delta14 : hub.onTime30 + hub.delta14 + hub.delta7;
  return round1(clamp(v, 0, 100));
}

export function statusForOnTime(onTime: number): Status {
  if (onTime >= 95) return "on-track";
  if (onTime >= 90) return "at-risk";
  return "delayed";
}

export const TOTAL_VOLUME = HUBS.reduce((sum, h) => sum + h.volume, 0);

/** Volume-weighted network on-time average for a period — always internally consistent with the
 *  per-hub figures, never a separately hand-typed number. */
export function networkOnTime(period: PeriodId): number {
  const weighted = HUBS.reduce((sum, h) => sum + onTimeForPeriod(h, period) * h.volume, 0);
  return round1(weighted / TOTAL_VOLUME);
}

export function hubsAtRisk(period: PeriodId): Hub[] {
  return HUBS.filter((h) => statusForOnTime(onTimeForPeriod(h, period)) !== "on-track");
}

export function connectedHubIds(hubId: string): string[] {
  const out: string[] = [];
  for (const [a, b] of LANES) {
    if (a === hubId) out.push(b);
    else if (b === hubId) out.push(a);
  }
  return out;
}

export function laneTouchesHub(lane: Lane, hubId: string | null): boolean {
  return hubId != null && (lane[0] === hubId || lane[1] === hubId);
}

/** Bubble radius on the map, linearly scaled from daily volume. Rounded to 2dp per SVG-coordinate
 *  determinism convention. */
export function bubbleRadius(volume: number): number {
  const minV = Math.min(...HUBS.map((h) => h.volume));
  const maxV = Math.max(...HUBS.map((h) => h.volume));
  const t = (volume - minV) / (maxV - minV);
  return round2(10 + t * 12);
}

/** 30 deterministic daily network-wide on-time points (index 0 = 29 days ago … 29 = today). Built
 *  from the volume-weighted 30d baseline with a fixed sinusoidal wiggle and a mild recent-softening
 *  drift consistent with the several hubs whose delta14/delta7 already trend down — no Math.random. */
export function dailyNetworkSeries(): number[] {
  const base = networkOnTime("30");
  const out: number[] = [];
  for (let i = 0; i < 30; i++) {
    const wiggle = 0.9 * Math.sin(i * 0.35) + 0.35 * Math.cos(i * 0.18);
    const drift = -(i / 29) * 0.85;
    out.push(round1(clamp(base + wiggle + drift, 80, 100)));
  }
  return out;
}

/** 30 deterministic daily on-time points for a single hub, ramping from its 30d baseline toward
 *  baseline+delta14 (days 15–29) and then toward +delta7 on top of that (days 22–29). The hub's own
 *  fixed x-coordinate seeds a small per-hub wiggle so hubs do not all move in lockstep. */
export function dailyHubSeries(hub: Hub): number[] {
  const out: number[] = [];
  for (let i = 0; i < 30; i++) {
    const t14 = clamp((i - 15) / 14, 0, 1);
    const t7 = clamp((i - 22) / 7, 0, 1);
    const level = hub.onTime30 + hub.delta14 * t14 + hub.delta7 * t7;
    const wiggle = 0.5 * Math.sin(i * 0.4 + hub.x * 0.01);
    out.push(round1(clamp(level + wiggle, 75, 100)));
  }
  return out;
}

/** Buckets the trailing N days of a daily series into a small, Tab-friendly number of chart points
 *  (7 for the 7D/14D views, 10 for 30D) by averaging within each bucket. */
export function seriesForPeriod(daily: number[], period: PeriodId): SeriesPoint[] {
  const nDays = Number(period);
  const slice = daily.slice(30 - nDays);
  const bucketCount = period === "30" ? 10 : 7;
  const bucketSize = Math.ceil(slice.length / bucketCount);
  const values: number[] = [];
  for (let b = 0; b < bucketCount; b++) {
    const chunk = slice.slice(b * bucketSize, Math.min(slice.length, (b + 1) * bucketSize));
    if (chunk.length === 0) continue;
    values.push(round1(chunk.reduce((s, v) => s + v, 0) / chunk.length));
  }
  return values.map((value, idx) => ({ idx, value, isToday: idx === values.length - 1 }));
}

export function fmtVolume(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function fmtPctPoint(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pt`;
}

/** Fixed set of Unsplash photo ids (human-chosen, not random-indexed) reused for the account menu. */
export function unsplashAvatar(id: string, size: number): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces&q=80`;
}
