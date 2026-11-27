// Firebreak — incident reliability data model.
//
// Every number shown in the hero, the inline-stat tiles, and the service chart is computed by the
// functions below from the single `INCIDENTS` record array (the same array the incidents table
// renders row-by-row). Nothing here is a hand-typed aggregate that could drift from the table.
// A handful of business constants (deploy counts, on-call page counts, error-budget allowance,
// engineer headcount) are NOT derivable from the incident list — they are separate operational
// inputs a real reliability dashboard would pull from a deploy system / pager system, so they are
// declared once per period below and never duplicated.

export type Severity = "P1" | "P2" | "P3";
export type Period = "this-month" | "last-month";

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  period: Period;
  week: number; // 1-4 = last-month, 5-8 = this-month
  ackMinutes: number;
  resolveMinutes: number;
  customerFacing: boolean;
  changeRelated: boolean;
  postmortemRequired: boolean;
  postmortemDone: boolean;
  ownerId: string;
  openedLabel: string;
}

export interface Owner {
  id: string;
  name: string;
  photoId: string;
}

export const OWNERS: Owner[] = [
  { id: "mia", name: "Mia Chen", photoId: "1494790108377-be9c29b29330" },
  { id: "daniel", name: "Daniel Osei", photoId: "1472099645785-5658abf4ff4e" },
  { id: "priya", name: "Priya Nair", photoId: "1544005313-94ddf0286df2" },
  { id: "marcus", name: "Marcus Webb", photoId: "1507003211169-0a1dd7228f2d" },
  { id: "elena", name: "Elena Kade", photoId: "1500648767791-00dcc994a43e" },
  { id: "tomas", name: "Tomas Rivera", photoId: "1438761681033-6461ffad8d80" },
];

export const SERVICES = [
  "payments-api",
  "auth-service",
  "search-index",
  "billing-worker",
  "notifications",
  "checkout-web",
  "image-pipeline",
  "reporting-api",
] as const;

export const SLA_TARGET_MINUTES: Record<Severity, number> = { P1: 30, P2: 60, P3: 180 };
export const ACK_TARGET_MINUTES: Record<Severity, number> = { P1: 5, P2: 10, P3: 30 };

// Operational inputs that do not come from the incident ledger itself.
export const PERIOD_CONTEXT: Record<
  Period,
  { label: string; weeks: number[]; deploys: number; pages: number; engineers: number; errorBudgetMinutes: number; periodHours: number }
> = {
  "last-month": { label: "Last month", weeks: [1, 2, 3, 4], deploys: 160, pages: 104, engineers: 6, errorBudgetMinutes: 600, periodHours: 672 },
  "this-month": { label: "This month", weeks: [5, 6, 7, 8], deploys: 182, pages: 96, engineers: 6, errorBudgetMinutes: 600, periodHours: 672 },
};

export const INCIDENTS: Incident[] = [
  // ── last-month (weeks 1-4) ──────────────────────────────────────────────
  { id: "INC-0926", title: "Chargeback webhook signature mismatch", service: "payments-api", severity: "P2", period: "last-month", week: 1, ackMinutes: 9, resolveMinutes: 69, customerFacing: true, changeRelated: false, postmortemRequired: true, postmortemDone: true, ownerId: "daniel", openedLabel: "Sep 2, 18:47" },
  { id: "INC-0930", title: "CDN cache purge not propagating", service: "image-pipeline", severity: "P3", period: "last-month", week: 1, ackMinutes: 21, resolveMinutes: 160, customerFacing: false, changeRelated: false, postmortemRequired: false, postmortemDone: false, ownerId: "mia", openedLabel: "Sep 7, 04:33" },
  { id: "INC-0935", title: "Scheduled reports not sent for 2 orgs", service: "reporting-api", severity: "P2", period: "last-month", week: 2, ackMinutes: 12, resolveMinutes: 82, customerFacing: false, changeRelated: false, postmortemRequired: true, postmortemDone: true, ownerId: "tomas", openedLabel: "Sep 10, 16:11" },
  { id: "INC-0940", title: "Session invalidation looping on refresh", service: "auth-service", severity: "P1", period: "last-month", week: 2, ackMinutes: 7, resolveMinutes: 37, customerFacing: true, changeRelated: true, postmortemRequired: true, postmortemDone: true, ownerId: "elena", openedLabel: "Sep 13, 21:20" },
  { id: "INC-0945", title: "Push notifications delayed on Android", service: "notifications", severity: "P3", period: "last-month", week: 3, ackMinutes: 19, resolveMinutes: 140, customerFacing: false, changeRelated: false, postmortemRequired: false, postmortemDone: false, ownerId: "marcus", openedLabel: "Sep 17, 07:58" },
  { id: "INC-0949", title: "Discount codes stacking incorrectly", service: "checkout-web", severity: "P2", period: "last-month", week: 3, ackMinutes: 10, resolveMinutes: 75, customerFacing: true, changeRelated: true, postmortemRequired: true, postmortemDone: false, ownerId: "priya", openedLabel: "Sep 19, 12:04" },
  { id: "INC-0953", title: "Proration calc off for mid-cycle upgrades", service: "billing-worker", severity: "P3", period: "last-month", week: 3, ackMinutes: 25, resolveMinutes: 180, customerFacing: false, changeRelated: false, postmortemRequired: false, postmortemDone: false, ownerId: "daniel", openedLabel: "Sep 21, 15:30" },
  { id: "INC-0958", title: "Autocomplete index corrupted after reindex", service: "search-index", severity: "P1", period: "last-month", week: 4, ackMinutes: 6, resolveMinutes: 41, customerFacing: true, changeRelated: false, postmortemRequired: true, postmortemDone: true, ownerId: "mia", openedLabel: "Sep 26, 09:12" },
  { id: "INC-0962", title: "Partial outage on 3DS verification", service: "payments-api", severity: "P2", period: "last-month", week: 4, ackMinutes: 8, resolveMinutes: 66, customerFacing: true, changeRelated: true, postmortemRequired: true, postmortemDone: true, ownerId: "tomas", openedLabel: "Sep 28, 10:45" },

  // ── this-month (weeks 5-8) ──────────────────────────────────────────────
  { id: "INC-1004", title: "Checkout 500s during flash promotion", service: "checkout-web", severity: "P1", period: "this-month", week: 5, ackMinutes: 5, resolveMinutes: 33, customerFacing: true, changeRelated: true, postmortemRequired: true, postmortemDone: true, ownerId: "elena", openedLabel: "Oct 3, 14:02" },
  { id: "INC-1008", title: "Password reset email delivery delayed", service: "auth-service", severity: "P3", period: "this-month", week: 5, ackMinutes: 20, resolveMinutes: 110, customerFacing: false, changeRelated: false, postmortemRequired: false, postmortemDone: false, ownerId: "marcus", openedLabel: "Oct 4, 06:12" },
  { id: "INC-1011", title: "Export job timing out on large datasets", service: "reporting-api", severity: "P2", period: "this-month", week: 5, ackMinutes: 11, resolveMinutes: 64, customerFacing: false, changeRelated: false, postmortemRequired: true, postmortemDone: true, ownerId: "priya", openedLabel: "Oct 5, 17:30" },
  { id: "INC-1015", title: "Thumbnail generation backlog building up", service: "image-pipeline", severity: "P3", period: "this-month", week: 6, ackMinutes: 15, resolveMinutes: 130, customerFacing: false, changeRelated: false, postmortemRequired: false, postmortemDone: false, ownerId: "daniel", openedLabel: "Oct 8, 22:16" },
  { id: "INC-1019", title: "Webhook retries exhausted for refunds", service: "payments-api", severity: "P2", period: "this-month", week: 6, ackMinutes: 7, resolveMinutes: 58, customerFacing: true, changeRelated: false, postmortemRequired: true, postmortemDone: true, ownerId: "mia", openedLabel: "Oct 9, 08:55" },
  { id: "INC-1024", title: "Digest emails duplicated for some accounts", service: "notifications", severity: "P3", period: "this-month", week: 6, ackMinutes: 22, resolveMinutes: 95, customerFacing: false, changeRelated: false, postmortemRequired: false, postmortemDone: false, ownerId: "tomas", openedLabel: "Oct 11, 13:47" },
  { id: "INC-1027", title: "Invoice generation delayed past cutoff", service: "billing-worker", severity: "P2", period: "this-month", week: 7, ackMinutes: 9, resolveMinutes: 71, customerFacing: false, changeRelated: true, postmortemRequired: true, postmortemDone: true, ownerId: "elena", openedLabel: "Oct 15, 20:08" },
  { id: "INC-1031", title: "Search relevance regression on filters", service: "search-index", severity: "P3", period: "this-month", week: 7, ackMinutes: 18, resolveMinutes: 150, customerFacing: false, changeRelated: false, postmortemRequired: false, postmortemDone: false, ownerId: "marcus", openedLabel: "Oct 17, 03:21" },
  { id: "INC-1035", title: "SSO token refresh failing for EU tenants", service: "auth-service", severity: "P1", period: "this-month", week: 7, ackMinutes: 3, resolveMinutes: 19, customerFacing: true, changeRelated: true, postmortemRequired: true, postmortemDone: true, ownerId: "priya", openedLabel: "Oct 19, 11:02" },
  { id: "INC-1038", title: "Cart totals miscalculated for bundle SKUs", service: "checkout-web", severity: "P2", period: "this-month", week: 8, ackMinutes: 6, resolveMinutes: 52, customerFacing: true, changeRelated: false, postmortemRequired: true, postmortemDone: true, ownerId: "daniel", openedLabel: "Oct 24, 16:40" },
  { id: "INC-1042", title: "Card authorization failures after release", service: "payments-api", severity: "P1", period: "this-month", week: 8, ackMinutes: 4, resolveMinutes: 26, customerFacing: true, changeRelated: true, postmortemRequired: true, postmortemDone: true, ownerId: "mia", openedLabel: "Oct 27, 09:14" },
];

export function getOwner(id: string): Owner {
  return OWNERS.find((o) => o.id === id) ?? OWNERS[0];
}

export function getIncidentsForPeriod(period: Period): Incident[] {
  return INCIDENTS.filter((i) => i.period === period);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export interface WeeklyPoint {
  week: number;
  label: string;
  value: number;
}

export interface Aggregates {
  period: Period;
  totalIncidents: number;
  slaWithinCount: number;
  slaComplianceRate: number; // %
  mttrMinutes: number;
  mttaMinutes: number;
  p1Count: number;
  customerFacingCount: number;
  changeRelatedCount: number;
  changeFailureRate: number; // %
  postmortemCompletionRate: number; // %
  pagesPerEngineer: number;
  meanTimeBetweenIncidentsHours: number;
  errorBudgetConsumedMinutes: number;
  errorBudgetConsumedPct: number; // %
  weeklyMttr: WeeklyPoint[];
  weeklyIncidentCount: WeeklyPoint[];
}

export function computeAggregates(period: Period): Aggregates {
  const incidents = getIncidentsForPeriod(period);
  const ctx = PERIOD_CONTEXT[period];
  const total = incidents.length;

  const slaWithin = incidents.filter((i) => i.resolveMinutes <= SLA_TARGET_MINUTES[i.severity]);
  const mttr = incidents.reduce((sum, i) => sum + i.resolveMinutes, 0) / total;
  const mtta = incidents.reduce((sum, i) => sum + i.ackMinutes, 0) / total;
  const p1Count = incidents.filter((i) => i.severity === "P1").length;
  const customerFacing = incidents.filter((i) => i.customerFacing);
  const changeRelated = incidents.filter((i) => i.changeRelated).length;
  const needsPostmortem = incidents.filter((i) => i.postmortemRequired);
  const postmortemDone = needsPostmortem.filter((i) => i.postmortemDone).length;
  const errorBudgetConsumed = customerFacing.reduce((sum, i) => sum + i.resolveMinutes, 0);

  const weeklyMttr: WeeklyPoint[] = ctx.weeks.map((week, idx) => {
    const weekIncidents = incidents.filter((i) => i.week === week);
    const value = weekIncidents.length
      ? weekIncidents.reduce((sum, i) => sum + i.resolveMinutes, 0) / weekIncidents.length
      : 0;
    return { week, label: `Wk ${idx + 1}`, value: round1(value) };
  });

  const weeklyIncidentCount: WeeklyPoint[] = ctx.weeks.map((week, idx) => ({
    week,
    label: `Wk ${idx + 1}`,
    value: incidents.filter((i) => i.week === week).length,
  }));

  return {
    period,
    totalIncidents: total,
    slaWithinCount: slaWithin.length,
    slaComplianceRate: round1((slaWithin.length / total) * 100),
    mttrMinutes: round1(mttr),
    mttaMinutes: round1(mtta),
    p1Count,
    customerFacingCount: customerFacing.length,
    changeRelatedCount: changeRelated,
    changeFailureRate: round1((changeRelated / ctx.deploys) * 100),
    postmortemCompletionRate: needsPostmortem.length ? round1((postmortemDone / needsPostmortem.length) * 100) : 100,
    pagesPerEngineer: round1(ctx.pages / ctx.engineers),
    meanTimeBetweenIncidentsHours: round1(ctx.periodHours / total),
    errorBudgetConsumedMinutes: errorBudgetConsumed,
    errorBudgetConsumedPct: round1((errorBudgetConsumed / ctx.errorBudgetMinutes) * 100),
    weeklyMttr,
    weeklyIncidentCount,
  };
}

export interface ServiceCount {
  service: string;
  count: number;
}

export function computeServiceBreakdown(period: Period): ServiceCount[] {
  const incidents = getIncidentsForPeriod(period);
  const counts = new Map<string, number>();
  for (const service of SERVICES) counts.set(service, 0);
  for (const incident of incidents) counts.set(incident.service, (counts.get(incident.service) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);
}
