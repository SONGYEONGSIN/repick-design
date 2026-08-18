/**
 * Formatting + SLA-math utilities for Warden.
 * Dates are parsed from 'YYYY-MM-DD' ISO strings anchored to UTC so the server (UTC) and client
 * (local tz) renders never diverge (hydration-safe) — same convention as the rest of the catalog.
 */

import { SLA_TARGET_DAYS, STAGE_ORDER, type Finding, type Severity, type Stage } from "./data";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Adds (or subtracts, with a negative delta) whole days to an ISO date — pure, no clock read. */
export function addDays(iso: string, delta: number): string {
  const d = parseISODate(iso);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function dayDiff(fromISO: string, toISO: string): number {
  return Math.round((parseISODate(toISO).getTime() - parseISODate(fromISO).getTime()) / MS_PER_DAY);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const dateFormatterYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const numberFormatter = new Intl.NumberFormat("en-US");

export function formatDate(iso: string): string {
  return dateFormatter.format(parseISODate(iso));
}

export function formatDateYear(iso: string): string {
  return dateFormatterYear.format(parseISODate(iso));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function clampPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}

/** Days the finding has been open — frozen at resolution if resolved, else counted to `todayISO`. */
export function daysOpen(finding: Pick<Finding, "discoveredISO" | "resolvedISO">, todayISO: string): number {
  return dayDiff(finding.discoveredISO, finding.resolvedISO ?? todayISO);
}

export function slaTargetDays(severity: Severity): number {
  return SLA_TARGET_DAYS[severity];
}

export type SlaStatus = "onTrack" | "atRisk" | "breached" | "met" | "missed";

export function slaStatus(finding: Pick<Finding, "severity" | "discoveredISO" | "resolvedISO">, todayISO: string): SlaStatus {
  const target = slaTargetDays(finding.severity);
  const open = daysOpen(finding, todayISO);
  if (finding.resolvedISO) return open <= target ? "met" : "missed";
  const ratio = open / target;
  if (ratio >= 1) return "breached";
  if (ratio >= 0.7) return "atRisk";
  return "onTrack";
}

export interface StageHistoryEntry {
  stage: Stage;
  days: number;
  enteredISO: string;
}

/**
 * Reconstructs a deterministic "days spent in each stage so far" breakdown from a finding's
 * discovery date, current stage and elapsed days — no per-finding history array to hand-author
 * (and keep in sync) is needed, and the segments always sum to exactly `daysOpen` by
 * construction. Weights model a typical AppSec queue: triage and remediation take the biggest
 * bites, verification and closeout are quicker.
 */
const STAGE_WEIGHTS: Record<Stage, number> = {
  backlog: 0.3,
  triaged: 0.18,
  assigned: 0.14,
  remediation: 0.24,
  verifying: 0.1,
  resolved: 0.04,
};

export function buildStageHistory(finding: Finding, todayISO: string): StageHistoryEntry[] {
  const currentIndex = STAGE_ORDER.indexOf(finding.stage);
  const passedStages = STAGE_ORDER.slice(0, currentIndex + 1);
  const total = daysOpen(finding, todayISO);
  const weightSum = passedStages.reduce((acc, s) => acc + STAGE_WEIGHTS[s], 0);

  const rawDays = passedStages.map((s) => (total * STAGE_WEIGHTS[s]) / weightSum);
  const floored = rawDays.map((d) => Math.max(0, Math.floor(d)));
  let remainder = total - floored.reduce((a, b) => a + b, 0);
  // Distribute the rounding remainder to the stages with the largest fractional part, so the
  // segments always sum to exactly `total` (no drift between the chart and the stat strip).
  const fractionalOrder = rawDays
    .map((d, i) => ({ i, frac: d - Math.floor(d) }))
    .sort((a, b) => b.frac - a.frac);
  const days = [...floored];
  for (let k = 0; remainder > 0 && k < fractionalOrder.length; k++, remainder--) {
    days[fractionalOrder[k].i] += 1;
  }
  // The current (still-open) stage should never show as zero-width once at least a day has
  // passed there; borrow one day from the largest earlier stage if rounding zeroed it out.
  if (days[days.length - 1] === 0 && total > 0 && days.length > 1) {
    const maxIdx = days.reduce((best, d, i) => (i !== days.length - 1 && d > days[best] ? i : best), 0);
    if (days[maxIdx] > 1) {
      days[maxIdx] -= 1;
      days[days.length - 1] += 1;
    }
  }

  let cursor = finding.discoveredISO;
  return passedStages.map((stage, i) => {
    const enteredISO = cursor;
    cursor = addDays(cursor, days[i]);
    return { stage, days: days[i], enteredISO };
  });
}
