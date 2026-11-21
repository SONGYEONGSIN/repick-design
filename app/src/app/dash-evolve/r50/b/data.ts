import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Globe2, KeyRound, LayoutDashboard, ListChecks, Radar, ShieldAlert, ShieldCheck, Sliders } from "lucide-react";
import { type Grade, gradeForRate } from "./tokens";

/**
 * Inboxline — email deliverability / sender-reputation console.
 *
 * DATE CONTRACT: every date is `WINDOW_START` plus a fixed integer day offset, run through
 * `addDays` (which wraps `new Date(iso)` — an EXPLICIT argument, never the bare, clock-reading form
 * the gate bans). Nothing here calls `Date.now()` or argument-less `new Date()`.
 *
 * DATA CONTRACT: nothing here calls `Math.random()`. Every provider's daily series is a closed-form
 * function of its day offset (a handful of fixed-period sine waves, rounded with `r1`/`r2`), so the
 * module evaluates identically on every render and every machine, and reloading never reshuffles
 * which provider looks worst.
 *
 * ARITHMETIC CONTRACT: `testsSent` and `inboxHits` are the only numbers ever "typed" per day; every
 * placement RATE, every grade, every weighted average and every stream ribbon height is *derived*
 * from those two integers at read time (see `rateOf`, `gradeForRate`, `weightedRate`). A rate and the
 * grade badge next to it can therefore never drift apart, and the streamgraph's ribbon volumes sum
 * to the same daily total the table's "Monitored volume" column shows.
 */

/* ------------------------------------------------------------------------- dates */

export const WINDOW_START = "2026-07-30";
export const TOTAL_DAYS = 90;
/** In-app "today" — the last day of the fixed 90-day window, not the real calendar clock. */
export const TODAY_OFFSET = TOTAL_DAYS - 1;

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function offsetToDate(offset: number): Date {
  return new Date(`${addDays(WINDOW_START, offset)}T00:00:00Z`);
}

const SHORT_DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const LONG_DATE = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

export function formatShort(offset: number): string {
  return SHORT_DATE.format(offsetToDate(offset));
}
export function formatLong(offset: number): string {
  return LONG_DATE.format(offsetToDate(offset));
}

/* ------------------------------------------------------------------------ brand + shell */

export const BRAND = { name: "Inboxline", product: "Deliverability Console", Icon: Radar };

export const WORKSPACES = [
  { id: "northwind", name: "Northwind Growth Marketing Ops", plan: "Scale · 4 domains" },
  { id: "lumen", name: "Lumen Robotics", plan: "Growth · 1 domain" },
  { id: "pallet", name: "Pallet & Co", plan: "Starter · 1 domain" },
];

export const CURRENT_USER = {
  name: "Dara Kessler",
  role: "Deliverability Lead",
  email: "dara.kessler@northwindgrowth.com",
  avatarId: "1580489944761-15a19d654956",
};

export const NAV_SECTIONS: { id: string; title: string; items: { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean }[] }[] = [
  {
    id: "monitor",
    title: "Monitor",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutDashboard, active: true },
      { id: "seed-tests", label: "Seed tests", Icon: ListChecks },
      { id: "blocklists", label: "Blocklists", Icon: ShieldAlert },
    ],
  },
  {
    id: "configure",
    title: "Configure",
    items: [
      { id: "auth", label: "SPF / DKIM / DMARC", Icon: KeyRound },
      { id: "domains", label: "Sending domains", Icon: Globe2 },
      { id: "automation", label: "Alert rules", Icon: Sliders, disabled: true },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Yahoo inbox placement dropped below 85% on mail.acme.com.", time: "2h ago" },
  { id: "n2", text: "DKIM key for mail.acme.com rotates in 5 days.", time: "1d ago" },
  { id: "n3", text: "Weekly deliverability digest is ready.", time: "2d ago" },
];

/* ------------------------------------------------------------------------- providers */

export type ProviderId = "gmail" | "outlook" | "yahoo" | "other";

export type ProviderMeta = {
  id: ProviderId;
  label: string;
  /** Decorative fill used at reduced opacity inside the ribbon. */
  fillHex: string;
  /** Full-opacity top-edge stroke — paired with `edgeDash` for a second, colour-independent signal. */
  strokeHex: string;
  /** Hatch-line rotation inside the ribbon fill (0/45/90/135) — the PRIMARY colour-blind-safe cue. */
  patternAngle: 0 | 45 | 90 | 135;
  /** Dasharray for the hatch lines themselves; `undefined` renders solid hatch lines. */
  patternDash?: string;
  /** Dasharray for the ribbon's top-edge stroke; `undefined` renders a solid edge. */
  edgeDash?: string;
};

/** Fixed stack order, bottom → top. Never reordered by sort/filter state, so a provider's band
 *  stays in the same visual position across every interaction. Each provider carries TWO
 *  colour-independent signals — hatch angle+dash and edge dasharray — so the four ribbons stay
 *  distinguishable with colour removed entirely, per the streamgraph's pattern requirement. */
export const PROVIDERS: ProviderMeta[] = [
  { id: "gmail", label: "Gmail", fillHex: "#a3e635", strokeHex: "#d9f99d", patternAngle: 45 },
  { id: "outlook", label: "Outlook", fillHex: "#38bdf8", strokeHex: "#bae6fd", patternAngle: 135, edgeDash: "6 3" },
  { id: "yahoo", label: "Yahoo", fillHex: "#fbbf24", strokeHex: "#fde68a", patternAngle: 90, patternDash: "2 3", edgeDash: "1.5 3" },
  { id: "other", label: "Other", fillHex: "#a1a1aa", strokeHex: "#e4e4e7", patternAngle: 0, edgeDash: "8 2 2 2" },
];

export const PROVIDER_BY_ID: Record<ProviderId, ProviderMeta> = Object.fromEntries(PROVIDERS.map((p) => [p.id, p])) as Record<ProviderId, ProviderMeta>;

function wave(offset: number, period: number, phase: number): number {
  return Math.sin((2 * Math.PI * offset) / period + phase);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function r1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** A 16-day authentication incident on Yahoo — the one deliberate "story" in the series, so the
 *  default-populated detail card and the flagged-rows filter both have something real to surface. */
const YAHOO_INCIDENT_START = 54;
const YAHOO_INCIDENT_END = 69;
const YAHOO_INCIDENT_PEAK = 61;
function yahooIncidentDip(offset: number): number {
  if (offset < YAHOO_INCIDENT_START || offset > YAHOO_INCIDENT_END) return 0;
  const half = offset <= YAHOO_INCIDENT_PEAK ? YAHOO_INCIDENT_PEAK - YAHOO_INCIDENT_START : YAHOO_INCIDENT_END - YAHOO_INCIDENT_PEAK;
  const dist = Math.abs(offset - YAHOO_INCIDENT_PEAK);
  return 30 * (1 - dist / Math.max(1, half));
}

/** Target placement rate before it is re-derived from integer volumes below — this is the only
 *  "synthetic" curve in the file; everything a reader sees is computed from `testsSent`/`inboxHits`. */
function targetRate(id: ProviderId, offset: number): number {
  switch (id) {
    case "gmail":
      return clamp(98.6 + 0.6 * wave(offset, 45, 0.4) + 0.3 * wave(offset, 7, 1.1) + 0.4 * wave(offset, 11, 2.7), 95, 99.8);
    case "outlook":
      return clamp(93.3 + 1.8 * wave(offset, 37, 0.9) + 0.6 * wave(offset, 7, 0.2) + 0.9 * wave(offset, 13, 1.6), 84, 97.5);
    case "yahoo":
      return clamp(90.5 + 3 * wave(offset, 29, 1.3) + 1.2 * wave(offset, 7, 2.0) + 1.6 * wave(offset, 9, 0.5) - yahooIncidentDip(offset), 54, 96);
    case "other":
      return clamp(89.2 + 1.4 * wave(offset, 41, 2.2) + 0.8 * wave(offset, 7, 0.6) + 0.7 * wave(offset, 15, 1.0), 78, 95);
  }
}

const VOLUME_BASE: Record<ProviderId, number> = { gmail: 1860, outlook: 1120, yahoo: 640, other: 420 };
const VOLUME_PHASE: Record<ProviderId, number> = { gmail: 0.3, outlook: 1.4, yahoo: 2.6, other: 0.8 };

function testsSentFor(id: ProviderId, offset: number): number {
  const base = VOLUME_BASE[id];
  const weekly = 1 + 0.07 * wave(offset, 7, VOLUME_PHASE[id]);
  const slow = 1 + 0.03 * wave(offset, 30, VOLUME_PHASE[id] + 1);
  return Math.round(base * weekly * slow);
}

export type DayProvider = { testsSent: number; inboxHits: number };
export type Day = { offset: number; iso: string; byProvider: Record<ProviderId, DayProvider>; totalSent: number; totalHits: number };

/** `rate` is never stored — always re-derived from the two integers above, so a percentage printed
 *  anywhere in the app is mechanically tied to the volumes printed in the data table. */
export function rateOf(dp: DayProvider): number {
  if (dp.testsSent <= 0) return 0;
  return r1((dp.inboxHits / dp.testsSent) * 100);
}

export const DAILY: Day[] = Array.from({ length: TOTAL_DAYS }, (_, offset) => {
  const byProvider = {} as Record<ProviderId, DayProvider>;
  let totalSent = 0;
  let totalHits = 0;
  for (const p of PROVIDERS) {
    const sent = testsSentFor(p.id, offset);
    const hits = clamp(Math.round((sent * targetRate(p.id, offset)) / 100), 0, sent);
    byProvider[p.id] = { testsSent: sent, inboxHits: hits };
    totalSent += sent;
    totalHits += hits;
  }
  return { offset, iso: addDays(WINDOW_START, offset), byProvider, totalSent, totalHits };
});

export const DAY_BY_OFFSET: Record<number, Day> = Object.fromEntries(DAILY.map((d) => [d.offset, d]));

/** Weighted average placement rate across a run of days — hits-over-sent, not an average of daily
 *  percentages, so a 7-day figure and the per-day rows it summarises never imply different totals. */
export function weightedRate(id: ProviderId, days: Day[]): number {
  let sent = 0;
  let hits = 0;
  for (const d of days) {
    sent += d.byProvider[id].testsSent;
    hits += d.byProvider[id].inboxHits;
  }
  return sent > 0 ? r1((hits / sent) * 100) : 0;
}

/* --------------------------------------------------------------------------- windows */

export type WindowId = "7d" | "30d" | "90d";
export const WINDOWS: { id: WindowId; label: string; days: number }[] = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "90d", label: "90D", days: 90 },
];

export function sliceForWindow(id: WindowId): Day[] {
  const def = WINDOWS.find((w) => w.id === id) ?? WINDOWS[1];
  return DAILY.slice(TOTAL_DAYS - def.days);
}

/* ------------------------------------------------------------------- provider snapshot */

export type ProviderSnapshot = {
  id: ProviderId;
  label: string;
  todayRate: number;
  todayGrade: Grade;
  rate7d: number;
  rate7dPrior: number;
  deltaVsPriorWeek: number;
  volumeShareToday: number; // this provider's share of today's total inbox hits, %
};

const TODAY = DAY_BY_OFFSET[TODAY_OFFSET];
const LAST7 = DAILY.slice(TOTAL_DAYS - 7);
const PRIOR7 = DAILY.slice(TOTAL_DAYS - 14, TOTAL_DAYS - 7);

export const PROVIDER_SNAPSHOTS: ProviderSnapshot[] = PROVIDERS.map((p) => {
  const todayRate = rateOf(TODAY.byProvider[p.id]);
  const rate7d = weightedRate(p.id, LAST7);
  const rate7dPrior = weightedRate(p.id, PRIOR7);
  return {
    id: p.id,
    label: p.label,
    todayRate,
    todayGrade: gradeForRate(todayRate),
    rate7d,
    rate7dPrior,
    deltaVsPriorWeek: r1(rate7d - rate7dPrior),
    volumeShareToday: TODAY.totalHits > 0 ? r1((TODAY.byProvider[p.id].inboxHits / TODAY.totalHits) * 100) : 0,
  };
});

export const SNAPSHOT_BY_ID: Record<ProviderId, ProviderSnapshot> = Object.fromEntries(PROVIDER_SNAPSHOTS.map((s) => [s.id, s])) as Record<ProviderId, ProviderSnapshot>;

/** Sensible first-paint default for the pinned detail card — the worst performer today, never an
 *  empty "select a provider" state (page-brief-core §3). */
export const WORST_PERFORMER_ID: ProviderId = PROVIDER_SNAPSHOTS.slice().sort((a, b) => a.todayRate - b.todayRate)[0].id;

/* ----------------------------------------------------------------------------- table */

export type TableRow = {
  offset: number;
  dateLabel: string;
  rates: Record<ProviderId, number>;
  totalSent: number;
  totalHits: number;
  blendedRate: number;
  flagged: boolean;
};

export function buildTableRows(days: Day[]): TableRow[] {
  return days
    .map((d) => {
      const rates = {} as Record<ProviderId, number>;
      for (const p of PROVIDERS) rates[p.id] = rateOf(d.byProvider[p.id]);
      const blendedRate = d.totalSent > 0 ? r1((d.totalHits / d.totalSent) * 100) : 0;
      const flagged = PROVIDERS.some((p) => rates[p.id] < 85);
      return { offset: d.offset, dateLabel: formatShort(d.offset), rates, totalSent: d.totalSent, totalHits: d.totalHits, blendedRate, flagged };
    })
    .reverse(); // most recent day first
}

/** Builds the CSV the topbar's Export button downloads — the exact rows the ledger renders for the
 *  window currently on screen, never a separately-maintained export shape. */
export function toCsv(rows: TableRow[]): string {
  const header = ["Date", ...PROVIDERS.map((p) => p.label), "Blended", "Monitored volume"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push([row.dateLabel, ...PROVIDERS.map((p) => `${row.rates[p.id]}%`), `${row.blendedRate}%`, String(row.totalSent)].join(","));
  }
  return lines.join("\n");
}

export const SEARCH_ENTRIES: { id: string; title: string; meta: string; kind: "provider" | "window"; Icon: LucideIcon; providerId?: ProviderId; windowId?: WindowId }[] = [
  ...PROVIDERS.map((p) => ({
    id: `provider-${p.id}`,
    title: `Pin ${p.label}`,
    meta: `${SNAPSHOT_BY_ID[p.id].todayRate}% today · grade ${SNAPSHOT_BY_ID[p.id].todayGrade}`,
    kind: "provider" as const,
    Icon: p.id === WORST_PERFORMER_ID ? AlertTriangle : ShieldCheck,
    providerId: p.id,
  })),
  ...WINDOWS.map((w) => ({
    id: `window-${w.id}`,
    title: `Show last ${w.label === "7D" ? "7 days" : w.label === "30D" ? "30 days" : "90 days"}`,
    meta: "Rescales the trend and the table below",
    kind: "window" as const,
    Icon: ListChecks,
    windowId: w.id,
  })),
];
