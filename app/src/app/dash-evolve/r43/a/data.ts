// Meterbase — Lifecycle dashboard data.
// Every number below is a literal, hand-reconciled integer: no Math.random(), no Date.now(),
// no `new Date()`. Each channel row is internally self-consistent —
//   activated + notActivated      === signups
//   paidConverted + trialing + churnedInTrial === activated
//   expanding + stable + contracting === paidConverted
// — and every aggregate the UI shows (column totals in the Sankey, the KPI row, the rail
// headline figures) is derived at render time by summing this table with `reduce`, never
// hardcoded, so nothing can drift out of reconciliation.

export type Period = "q3" | "q2";

export const PERIODS: { value: Period; label: string }[] = [
  { value: "q3", label: "This quarter" },
  { value: "q2", label: "Last quarter" },
];

export interface ChannelRow {
  id: string;
  name: string;
  description: string;
  signups: number;
  activated: number;
  notActivated: number;
  paidConverted: number;
  trialing: number;
  churnedInTrial: number;
  expanding: number;
  stable: number;
  contracting: number;
}

export const CHANNELS_BY_PERIOD: Record<Period, ChannelRow[]> = {
  q3: [
    {
      id: "organic-search",
      name: "Organic Search",
      description: "Signups that arrived via unpaid search results.",
      signups: 3920,
      activated: 2822,
      notActivated: 1098,
      paidConverted: 1467,
      trialing: 806,
      churnedInTrial: 549,
      expanding: 612,
      stable: 684,
      contracting: 171,
    },
    {
      id: "paid-search",
      name: "Paid Search",
      description: "Signups attributed to paid search campaigns.",
      signups: 2860,
      activated: 1888,
      notActivated: 972,
      paidConverted: 905,
      trialing: 621,
      churnedInTrial: 362,
      expanding: 334,
      stable: 410,
      contracting: 161,
    },
    {
      id: "referral",
      name: "Referral Program",
      description: "Signups credited to the customer referral program.",
      signups: 1980,
      activated: 1545,
      notActivated: 435,
      paidConverted: 896,
      trialing: 406,
      churnedInTrial: 243,
      expanding: 441,
      stable: 372,
      contracting: 83,
    },
    {
      id: "partner",
      name: "Partner Integrations",
      description: "Signups from listed marketplace and technology partners.",
      signups: 1540,
      activated: 1279,
      notActivated: 261,
      paidConverted: 762,
      trialing: 318,
      churnedInTrial: 199,
      expanding: 398,
      stable: 302,
      contracting: 62,
    },
    {
      id: "outbound",
      name: "Outbound Sales",
      description: "Signups sourced directly by the sales development team.",
      signups: 1240,
      activated: 992,
      notActivated: 248,
      paidConverted: 612,
      trialing: 251,
      churnedInTrial: 129,
      expanding: 283,
      stable: 274,
      contracting: 55,
    },
    {
      id: "content",
      name: "Content & Webinars",
      description: "Signups attributed to gated content and live webinars.",
      signups: 940,
      activated: 715,
      notActivated: 225,
      paidConverted: 418,
      trialing: 198,
      churnedInTrial: 99,
      expanding: 192,
      stable: 183,
      contracting: 43,
    },
  ],
  q2: [
    {
      id: "organic-search",
      name: "Organic Search",
      description: "Signups that arrived via unpaid search results.",
      signups: 3540,
      activated: 2440,
      notActivated: 1100,
      paidConverted: 1210,
      trialing: 740,
      churnedInTrial: 490,
      expanding: 480,
      stable: 572,
      contracting: 158,
    },
    {
      id: "paid-search",
      name: "Paid Search",
      description: "Signups attributed to paid search campaigns.",
      signups: 2600,
      activated: 1664,
      notActivated: 936,
      paidConverted: 760,
      trialing: 580,
      churnedInTrial: 324,
      expanding: 260,
      stable: 356,
      contracting: 144,
    },
    {
      id: "referral",
      name: "Referral Program",
      description: "Signups credited to the customer referral program.",
      signups: 1760,
      activated: 1320,
      notActivated: 440,
      paidConverted: 740,
      trialing: 360,
      churnedInTrial: 220,
      expanding: 350,
      stable: 310,
      contracting: 80,
    },
    {
      id: "partner",
      name: "Partner Integrations",
      description: "Signups from listed marketplace and technology partners.",
      signups: 1320,
      activated: 1056,
      notActivated: 264,
      paidConverted: 600,
      trialing: 288,
      churnedInTrial: 168,
      expanding: 300,
      stable: 240,
      contracting: 60,
    },
    {
      id: "outbound",
      name: "Outbound Sales",
      description: "Signups sourced directly by the sales development team.",
      signups: 1060,
      activated: 816,
      notActivated: 244,
      paidConverted: 480,
      trialing: 224,
      churnedInTrial: 112,
      expanding: 210,
      stable: 220,
      contracting: 50,
    },
    {
      id: "content",
      name: "Content & Webinars",
      description: "Signups attributed to gated content and live webinars.",
      signups: 800,
      activated: 584,
      notActivated: 216,
      paidConverted: 320,
      trialing: 170,
      churnedInTrial: 94,
      expanding: 140,
      stable: 150,
      contracting: 30,
    },
  ],
};

export interface ChannelTotals {
  signups: number;
  activated: number;
  notActivated: number;
  paidConverted: number;
  trialing: number;
  churnedInTrial: number;
  expanding: number;
  stable: number;
  contracting: number;
  churned: number;
}

/** Sums every channel row for a period. The single source of truth for every aggregate on the
 *  page — the Sankey node values, the KPI row, the rail's "All channels" framing — so nothing is
 *  ever a second, independently-typed copy of a total that could drift out of reconciliation. */
export function totalsForPeriod(period: Period): ChannelTotals {
  const rows = CHANNELS_BY_PERIOD[period];
  const sum = (key: keyof Omit<ChannelRow, "id" | "name" | "description">) =>
    rows.reduce((acc, row) => acc + row[key], 0);
  const churnedInTrial = sum("churnedInTrial");
  const notActivated = sum("notActivated");
  return {
    signups: sum("signups"),
    activated: sum("activated"),
    notActivated,
    paidConverted: sum("paidConverted"),
    trialing: sum("trialing"),
    churnedInTrial,
    expanding: sum("expanding"),
    stable: sum("stable"),
    contracting: sum("contracting"),
    churned: churnedInTrial + notActivated,
  };
}

export type AccountStage = "expanding" | "stable" | "contracting" | "trialing" | "churned";

export interface AccountRow {
  id: string;
  name: string;
  domain: string;
  channelId: string;
  stage: AccountStage;
  mrr: number;
  health: number;
  lastActivity: string;
  /** A literal YYYYMMDD integer, hand-computed — never `new Date(string)` (banned) — used purely
   *  so the table can sort chronologically without re-parsing the display string. */
  lastActivityRank: number;
  /** Six literal MRR checkpoints leading up to `mrr` — `trend[5]` always equals `mrr` exactly, so
   *  the sparkline's endpoint never contradicts the number printed next to it. */
  trend: number[];
}

// Flagged accounts shown underneath the flow — independent of the period toggle, since this is
// a live worklist ("who needs a look right now") rather than a historical rollup.
export const ACCOUNTS: AccountRow[] = [
  { id: "acc-1", name: "Lumen Robotics", domain: "lumenrobotics.com", channelId: "partner", stage: "expanding", mrr: 18400, health: 92, lastActivity: "Oct 16, 2026", lastActivityRank: 20261016, trend: [12800, 13600, 14900, 16200, 17500, 18400] },
  { id: "acc-2", name: "Basalt Freight", domain: "basaltfreight.io", channelId: "paid-search", stage: "expanding", mrr: 24750, health: 88, lastActivity: "Oct 17, 2026", lastActivityRank: 20261017, trend: [17200, 18900, 20100, 21800, 23400, 24750] },
  { id: "acc-3", name: "Candor Health", domain: "candorhealth.com", channelId: "partner", stage: "stable", mrr: 11300, health: 81, lastActivity: "Oct 14, 2026", lastActivityRank: 20261014, trend: [10800, 11100, 10950, 11200, 11050, 11300] },
  { id: "acc-4", name: "Harbor & Vine", domain: "harborandvine.com", channelId: "organic-search", stage: "stable", mrr: 9600, health: 78, lastActivity: "Oct 15, 2026", lastActivityRank: 20261015, trend: [9200, 9450, 9300, 9550, 9400, 9600] },
  { id: "acc-5", name: "Quillwork Studio", domain: "quillworkstudio.co", channelId: "content", stage: "trialing", mrr: 0, health: 67, lastActivity: "Oct 17, 2026", lastActivityRank: 20261017, trend: [0, 0, 0, 0, 0, 0] },
  { id: "acc-6", name: "Driftwood Analytics", domain: "driftwoodanalytics.com", channelId: "outbound", stage: "contracting", mrr: 6200, health: 54, lastActivity: "Oct 12, 2026", lastActivityRank: 20261012, trend: [8400, 7900, 7500, 7000, 6600, 6200] },
  { id: "acc-7", name: "Northfield Logistics", domain: "northfieldlogistics.com", channelId: "referral", stage: "churned", mrr: 0, health: 12, lastActivity: "Sep 30, 2026", lastActivityRank: 20260930, trend: [5200, 4100, 2800, 1400, 500, 0] },
  { id: "acc-8", name: "Tidewell Supply", domain: "tidewellsupply.com", channelId: "outbound", stage: "churned", mrr: 0, health: 9, lastActivity: "Sep 22, 2026", lastActivityRank: 20260922, trend: [3600, 2900, 2100, 1300, 600, 0] },
];

export const STAGE_LABEL: Record<AccountStage, string> = {
  expanding: "Expanding",
  stable: "Stable",
  contracting: "Contracting",
  trialing: "Trialing",
  churned: "Churned",
};

export function channelName(channelId: string, period: Period): string {
  return CHANNELS_BY_PERIOD[period].find((c) => c.id === channelId)?.name ?? channelId;
}
