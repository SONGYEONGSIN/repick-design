/**
 * Pure, deterministic selectors over data.ts's TICKETS array. Everything shown anywhere on
 * the page — box-plot summaries, KPI tiles, the per-team detail card, the breach log — reads
 * through one of these functions so the same number never gets computed twice from two
 * independently-typed formulas.
 */

import { TICKETS, TeamId, Ticket, ticketStatus } from "./data";

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type FiveNumberSummary = {
  n: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  lowerWhisker: number;
  upperWhisker: number;
  outliers: number[];
};

/** Linear-interpolation percentile (the common "inclusive" method), then Tukey whiskers. */
export function fiveNumberSummary(valuesIn: number[]): FiveNumberSummary {
  const values = [...valuesIn].sort((a, b) => a - b);
  const n = values.length;
  const percentile = (p: number): number => {
    const index = p * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return values[lower];
    return values[lower] + (values[upper] - values[lower]) * (index - lower);
  };
  const min = values[0];
  const max = values[n - 1];
  const q1 = percentile(0.25);
  const median = percentile(0.5);
  const q3 = percentile(0.75);
  const iqr = q3 - q1;
  const fenceLow = q1 - 1.5 * iqr;
  const fenceHigh = q3 + 1.5 * iqr;
  const inFence = values.filter((v) => v >= fenceLow && v <= fenceHigh);
  const lowerWhisker = inFence.length ? inFence[0] : min;
  const upperWhisker = inFence.length ? inFence[inFence.length - 1] : max;
  const outliers = values.filter((v) => v < fenceLow || v > fenceHigh);
  return {
    n,
    min: round2(min),
    q1: round2(q1),
    median: round2(median),
    q3: round2(q3),
    max: round2(max),
    lowerWhisker: round2(lowerWhisker),
    upperWhisker: round2(upperWhisker),
    outliers: outliers.map(round2),
  };
}

export function teamResolvedHours(team: TeamId, tickets: Ticket[] = TICKETS): number[] {
  return tickets
    .filter((t): t is Ticket & { kind: "resolved" } => t.team === team && t.kind === "resolved")
    .map((t) => t.resolutionHours);
}

export type TeamSummary = FiveNumberSummary & {
  teamId: TeamId;
  breachCount: number;
  ticketCount: number;
  escalatedCount: number;
};

export function teamSummary(team: TeamId, tickets: Ticket[] = TICKETS): TeamSummary {
  const hours = teamResolvedHours(team, tickets);
  const summary = fiveNumberSummary(hours);
  const teamTickets = tickets.filter((t) => t.team === team);
  const breachCount = teamTickets.filter((t) => ticketStatus(t) === "breached").length;
  const escalatedCount = teamTickets.filter((t) => ticketStatus(t) === "escalated").length;
  return { ...summary, teamId: team, breachCount, ticketCount: teamTickets.length, escalatedCount };
}

export function overallCompliance(tickets: Ticket[] = TICKETS): { percent: number; resolvedOk: number; breached: number; total: number } {
  const resolved = tickets.filter((t) => t.kind === "resolved");
  const breached = resolved.filter((t) => ticketStatus(t) === "breached").length;
  const resolvedOk = resolved.length - breached;
  const percent = resolved.length === 0 ? 0 : Math.round((resolvedOk / resolved.length) * 1000) / 10;
  return { percent, resolvedOk, breached, total: resolved.length };
}

export function overallAvgResolutionHours(tickets: Ticket[] = TICKETS): number {
  const resolved = tickets.filter((t): t is Ticket & { kind: "resolved" } => t.kind === "resolved");
  if (resolved.length === 0) return 0;
  const sum = resolved.reduce((acc, t) => acc + t.resolutionHours, 0);
  return round2(sum / resolved.length);
}

export function escalatedCount(tickets: Ticket[] = TICKETS): number {
  return tickets.filter((t) => t.kind === "escalated").length;
}

/** Bucket by day-of-activity (floor(offsetMinutes / 1440)), oldest → newest, for the sparkline. */
export function dailyVolume(tickets: Ticket[] = TICKETS, days = 4): number[] {
  const buckets = new Array(days).fill(0) as number[];
  for (const t of tickets) {
    const dayIndex = Math.floor(t.offsetMinutes / 1440);
    if (dayIndex < days) buckets[dayIndex] += 1;
  }
  return buckets.reverse();
}
