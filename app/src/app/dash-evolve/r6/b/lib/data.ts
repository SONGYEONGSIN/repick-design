// Deterministic dummy data for Podium — a gamified sales-performance /
// revenue-ops platform. Fixture workspace: Solstice Cloud, a mid-market SaaS
// company's field sales org. No Math.random / Date.now anywhere below —
// every figure is either a fixed literal or a pure arithmetic derivation of
// fixed literals (a "seed" index), so re-rendering always produces the same
// output and hydration never mismatches. The fictional "today" pinned for
// this fixture is Sat Jul 18, 2026 (matches the close-date literals below).

export type PeriodId = "week" | "month" | "quarter";
export type TeamId = "enterprise" | "mid-market" | "smb" | "emerging";
export type DealStage = "Discovery" | "Proposal" | "Negotiation" | "Closed Won";

export interface PeriodStat {
  attainmentPct: number;
  quotaTarget: number;
  closedRevenue: number;
  dealsClosed: number;
  /** Position change vs. the previous period in the same scope. +N = moved up N spots. */
  rankDelta: number;
}

export interface Deal {
  id: string;
  company: string;
  stage: DealStage;
  value: number;
  closeDate: string;
  probability: number;
}

export interface QuotaTrendPoint {
  label: string;
  pct: number;
}

export interface Activity {
  calls: number;
  emails: number;
  meetingsBooked: number;
  meetingsHeld: number;
}

export interface Rep {
  id: string;
  name: string;
  title: string;
  team: TeamId;
  avatarId: string;
  periods: Record<PeriodId, PeriodStat>;
  weeklyTrend: number[];
  quotaTrend: QuotaTrendPoint[];
  activity: Activity;
  deals: Deal[];
}

export interface RankedRep {
  rep: Rep;
  rank: number;
  stat: PeriodStat;
}

export const TEAM_META: Record<TeamId, { label: string; short: string }> = {
  enterprise: { label: "Enterprise", short: "Enterprise" },
  "mid-market": { label: "Mid-Market", short: "Mid-Market" },
  smb: { label: "SMB", short: "SMB" },
  emerging: { label: "Emerging Accounts", short: "Emerging" },
};

export const TEAM_ORDER: TeamId[] = ["enterprise", "mid-market", "smb", "emerging"];

export const PERIOD_META: Record<PeriodId, { label: string; short: string; comparisonLabel: string }> = {
  week: { label: "This Week", short: "Week", comparisonLabel: "vs last week" },
  month: { label: "This Month", short: "Month", comparisonLabel: "vs last month" },
  quarter: { label: "This Quarter", short: "Quarter", comparisonLabel: "vs last quarter" },
};

export const PERIOD_ORDER: PeriodId[] = ["week", "month", "quarter"];

const QUOTA_TARGET: Record<TeamId, Record<PeriodId, number>> = {
  enterprise: { quarter: 420000, month: 140000, week: 32300 },
  "mid-market": { quarter: 240000, month: 80000, week: 18500 },
  smb: { quarter: 130000, month: 43300, week: 10000 },
  emerging: { quarter: 85000, month: 28300, week: 6500 },
};

function stat(team: TeamId, period: PeriodId, attainmentPct: number, dealsClosed: number, rankDelta: number): PeriodStat {
  const quotaTarget = QUOTA_TARGET[team][period];
  return {
    attainmentPct,
    quotaTarget,
    closedRevenue: Math.round(quotaTarget * (attainmentPct / 100)),
    dealsClosed,
    rankDelta,
  };
}

// Fixed, hand-authored offset waveforms used to derive multi-point trend
// series from a single ending value — deterministic, not random.
const TREND_OFFSETS_A = [-14, -9, -4, 2, -6, 5, -2, 0];
const TREND_OFFSETS_B = [10, 4, -3, -8, -2, 6, 1, 0];
const QTREND_OFFSETS_A = [-10, -6, -2, 3, -1, 0];
const QTREND_OFFSETS_B = [8, 3, -2, -5, 2, 0];
const QUOTA_TREND_MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

function buildWeeklyTrend(endValue: number, variant: "a" | "b"): number[] {
  const offsets = variant === "a" ? TREND_OFFSETS_A : TREND_OFFSETS_B;
  return offsets.map((o) => Math.max(20, Math.round((endValue + o) * 10) / 10));
}

function buildQuotaTrend(endValue: number, variant: "a" | "b"): QuotaTrendPoint[] {
  const offsets = variant === "a" ? QTREND_OFFSETS_A : QTREND_OFFSETS_B;
  return QUOTA_TREND_MONTHS.map((label, i) => ({
    label,
    pct: Math.max(30, Math.round((endValue + offsets[i]) * 10) / 10),
  }));
}

const COMPANY_POOL = [
  "Brightwell Logistics",
  "Cascade Robotics",
  "Fernhill Dental Group",
  "Ironpeak Freight",
  "Lucent Biotech",
  "Meadowline Retail",
  "Nimbus Cloud Systems",
  "Oakmere Insurance",
  "Pinnacle Foundries",
  "Quorum Legal",
  "Riverside Health Network",
  "Solvent Analytics",
  "Tidewater Shipping",
  "Underline Media",
  "Vantage Point Realty",
  "Westfield Manufacturing",
  "Anchorage Fintech",
  "Birchwood Schools",
  "Cobalt Energy",
  "Driftwood Hospitality",
];

const STAGE_CYCLE: DealStage[] = ["Negotiation", "Proposal", "Discovery", "Closed Won"];
const PROB_BY_STAGE: Record<DealStage, number> = {
  Discovery: 25,
  Proposal: 50,
  Negotiation: 75,
  "Closed Won": 100,
};
const CLOSE_DATES = [
  "Jul 21",
  "Jul 24",
  "Jul 28",
  "Jul 30",
  "Aug 02",
  "Aug 05",
  "Aug 08",
  "Aug 12",
  "Aug 15",
  "Aug 19",
  "Aug 21",
  "Sep 03",
];

function buildDeals(repIndex: number, repId: string): Deal[] {
  const deals: Deal[] = [];
  for (let i = 0; i < 4; i++) {
    const company = COMPANY_POOL[(repIndex * 3 + i * 5) % COMPANY_POOL.length];
    const stage = STAGE_CYCLE[(repIndex + i) % STAGE_CYCLE.length];
    const rawValue = 6000 + ((repIndex * 4200 + i * 3100) % 38000);
    const value = Math.round(rawValue / 500) * 500;
    const closeDate = CLOSE_DATES[(repIndex * 2 + i) % CLOSE_DATES.length];
    deals.push({
      id: `${repId}-deal-${i + 1}`,
      company,
      stage,
      value,
      closeDate,
      probability: PROB_BY_STAGE[stage],
    });
  }
  return deals;
}

export const REPS: Rep[] = [
  {
    id: "diego-marchetti",
    name: "Diego Marchetti",
    title: "Enterprise Account Executive",
    team: "enterprise",
    avatarId: "1438761681033-6461ffad8d80",
    periods: {
      quarter: stat("enterprise", "quarter", 132.4, 9, -1),
      month: stat("enterprise", "month", 118.6, 3, -1),
      week: stat("enterprise", "week", 104.0, 1, -2),
    },
    weeklyTrend: buildWeeklyTrend(104.0, "a"),
    quotaTrend: buildQuotaTrend(118.6, "a"),
    activity: { calls: 198, emails: 262, meetingsBooked: 23, meetingsHeld: 19 },
    deals: buildDeals(0, "diego-marchetti"),
  },
  {
    id: "naomi-whitfield",
    name: "Naomi Whitfield",
    title: "Senior Enterprise AE",
    team: "enterprise",
    avatarId: "1441974231531-c6227db76b6e",
    periods: {
      quarter: stat("enterprise", "quarter", 121.8, 8, 1),
      month: stat("enterprise", "month", 129.4, 3, 2),
      week: stat("enterprise", "week", 96.5, 1, -3),
    },
    weeklyTrend: buildWeeklyTrend(96.5, "b"),
    quotaTrend: buildQuotaTrend(129.4, "b"),
    activity: { calls: 210, emails: 248, meetingsBooked: 25, meetingsHeld: 21 },
    deals: buildDeals(1, "naomi-whitfield"),
  },
  {
    id: "kwame-asante",
    name: "Kwame Asante",
    title: "Enterprise Account Executive",
    team: "enterprise",
    avatarId: "1449158743715-0a90ebb6d2d8",
    periods: {
      quarter: stat("enterprise", "quarter", 96.2, 6, -3),
      month: stat("enterprise", "month", 88.0, 2, -2),
      week: stat("enterprise", "week", 112.7, 1, 3),
    },
    weeklyTrend: buildWeeklyTrend(112.7, "a"),
    quotaTrend: buildQuotaTrend(88.0, "a"),
    activity: { calls: 164, emails: 201, meetingsBooked: 17, meetingsHeld: 13 },
    deals: buildDeals(2, "kwame-asante"),
  },
  {
    id: "lena-kowalski",
    name: "Lena Kowalski",
    title: "Mid-Market Account Executive",
    team: "mid-market",
    avatarId: "1472099645785-5658abf4ff4e",
    periods: {
      quarter: stat("mid-market", "quarter", 118.9, 7, 3),
      month: stat("mid-market", "month", 104.2, 2, -1),
      week: stat("mid-market", "week", 91.3, 1, -2),
    },
    weeklyTrend: buildWeeklyTrend(91.3, "b"),
    quotaTrend: buildQuotaTrend(104.2, "b"),
    activity: { calls: 176, emails: 219, meetingsBooked: 19, meetingsHeld: 15 },
    deals: buildDeals(3, "lena-kowalski"),
  },
  {
    id: "rafael-ibarra",
    name: "Rafael Ibarra",
    title: "Mid-Market Account Executive",
    team: "mid-market",
    avatarId: "1476820865390-c52aeebb9891",
    periods: {
      quarter: stat("mid-market", "quarter", 108.4, 6, -2),
      month: stat("mid-market", "month", 96.8, 2, 0),
      week: stat("mid-market", "week", 121.6, 2, 6),
    },
    weeklyTrend: buildWeeklyTrend(121.6, "a"),
    quotaTrend: buildQuotaTrend(96.8, "a"),
    activity: { calls: 188, emails: 233, meetingsBooked: 21, meetingsHeld: 18 },
    deals: buildDeals(4, "rafael-ibarra"),
  },
  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    title: "Mid-Market Account Executive",
    team: "mid-market",
    avatarId: "1487412720507-e7ab37603c6f",
    periods: {
      quarter: stat("mid-market", "quarter", 87.6, 5, -1),
      month: stat("mid-market", "month", 92.1, 2, 1),
      week: stat("mid-market", "week", 78.4, 0, -3),
    },
    weeklyTrend: buildWeeklyTrend(78.4, "b"),
    quotaTrend: buildQuotaTrend(92.1, "b"),
    activity: { calls: 142, emails: 178, meetingsBooked: 14, meetingsHeld: 10 },
    deals: buildDeals(5, "yuki-tanaka"),
  },
  {
    id: "chloe-bergstrom",
    name: "Chloe Bergstrom",
    title: "SMB Account Executive",
    team: "smb",
    avatarId: "1494790108377-be9c29b29330",
    periods: {
      quarter: stat("smb", "quarter", 141.7, 10, 2),
      month: stat("smb", "month", 133.9, 4, 1),
      week: stat("smb", "week", 108.2, 1, -1),
    },
    weeklyTrend: buildWeeklyTrend(108.2, "a"),
    quotaTrend: buildQuotaTrend(133.9, "a"),
    activity: { calls: 224, emails: 271, meetingsBooked: 27, meetingsHeld: 23 },
    deals: buildDeals(6, "chloe-bergstrom"),
  },
  {
    id: "marcus-odell",
    name: "Marcus Odell",
    title: "SMB Account Executive",
    team: "smb",
    avatarId: "1500648767791-00dcc994a43e",
    periods: {
      quarter: stat("smb", "quarter", 102.3, 6, 0),
      month: stat("smb", "month", 110.5, 2, 4),
      week: stat("smb", "week", 94.7, 1, 1),
    },
    weeklyTrend: buildWeeklyTrend(94.7, "b"),
    quotaTrend: buildQuotaTrend(110.5, "b"),
    activity: { calls: 171, emails: 206, meetingsBooked: 18, meetingsHeld: 14 },
    deals: buildDeals(7, "marcus-odell"),
  },
  {
    id: "priya-chandran",
    name: "Priya Chandran",
    title: "SMB Account Executive",
    team: "smb",
    avatarId: "1502082553048-f009c37129b9",
    periods: {
      quarter: stat("smb", "quarter", 79.8, 4, 2),
      month: stat("smb", "month", 84.2, 1, 1),
      week: stat("smb", "week", 90.1, 1, 2),
    },
    weeklyTrend: buildWeeklyTrend(90.1, "a"),
    quotaTrend: buildQuotaTrend(84.2, "a"),
    activity: { calls: 133, emails: 165, meetingsBooked: 12, meetingsHeld: 9 },
    deals: buildDeals(8, "priya-chandran"),
  },
  {
    id: "owen-fitzgerald",
    name: "Owen Fitzgerald",
    title: "Emerging Accounts Executive",
    team: "emerging",
    avatarId: "1506794778202-cad84cf45f1d",
    periods: {
      quarter: stat("emerging", "quarter", 93.5, 5, 1),
      month: stat("emerging", "month", 101.7, 2, 2),
      week: stat("emerging", "week", 116.3, 2, 4),
    },
    weeklyTrend: buildWeeklyTrend(116.3, "b"),
    quotaTrend: buildQuotaTrend(101.7, "b"),
    activity: { calls: 158, emails: 197, meetingsBooked: 16, meetingsHeld: 13 },
    deals: buildDeals(9, "owen-fitzgerald"),
  },
  {
    id: "sofia-delgado",
    name: "Sofia Delgado",
    title: "Emerging Accounts Executive",
    team: "emerging",
    avatarId: "1519085360753-af0119f7cbe7",
    periods: {
      quarter: stat("emerging", "quarter", 111.2, 6, 5),
      month: stat("emerging", "month", 97.4, 2, -3),
      week: stat("emerging", "week", 85.9, 1, -4),
    },
    weeklyTrend: buildWeeklyTrend(85.9, "a"),
    quotaTrend: buildQuotaTrend(97.4, "a"),
    activity: { calls: 181, emails: 224, meetingsBooked: 20, meetingsHeld: 16 },
    deals: buildDeals(10, "sofia-delgado"),
  },
  {
    id: "theo-nakashima",
    name: "Theo Nakashima",
    title: "Emerging Accounts Executive",
    team: "emerging",
    avatarId: "1519244703995-f4e0f30006d5",
    periods: {
      quarter: stat("emerging", "quarter", 68.9, 3, -2),
      month: stat("emerging", "month", 74.3, 1, -1),
      week: stat("emerging", "week", 81.5, 0, 0),
    },
    weeklyTrend: buildWeeklyTrend(81.5, "b"),
    quotaTrend: buildQuotaTrend(74.3, "b"),
    activity: { calls: 121, emails: 150, meetingsBooked: 10, meetingsHeld: 7 },
    deals: buildDeals(11, "theo-nakashima"),
  },
];

export const CURRENT_USER = {
  name: "Isla Renner",
  role: "RevOps Lead",
  avatarId: "1531123897727-8f129e1688ce",
};

export const WORKSPACE = { id: "solstice-cloud", name: "Solstice Cloud", plan: "Growth plan" };
export const WORKSPACES = [
  WORKSPACE,
  { id: "solstice-cloud-eu", name: "Solstice Cloud — EU", plan: "Growth plan" },
];

export const NAV_NOTIFICATIONS = [
  { id: "n1", text: "Chloe Bergstrom closed Fernhill Dental Group — $18,500.", time: "24m ago" },
  { id: "n2", text: "Rafael Ibarra jumped to #1 on the weekly leaderboard.", time: "1h ago" },
  { id: "n3", text: "The Q3 contest leaderboard resets in 2 days.", time: "5h ago" },
];

export function repsInScope(scope: TeamId | "all"): Rep[] {
  return scope === "all" ? REPS : REPS.filter((r) => r.team === scope);
}

export function getRankedReps(period: PeriodId, scope: TeamId | "all"): RankedRep[] {
  return repsInScope(scope)
    .map((rep) => ({ rep, stat: rep.periods[period] }))
    .sort((a, b) => b.stat.attainmentPct - a.stat.attainmentPct)
    .map((entry, i) => ({ rep: entry.rep, stat: entry.stat, rank: i + 1 }));
}

export interface ScopeSummary {
  avgAttainment: number;
  totalRevenue: number;
  repsAtGoal: number;
  repCount: number;
  openPipelineValue: number;
}

export function summarizeScope(ranked: RankedRep[]): ScopeSummary {
  const repCount = ranked.length || 1;
  const totalAttainment = ranked.reduce((sum, r) => sum + r.stat.attainmentPct, 0);
  const totalRevenue = ranked.reduce((sum, r) => sum + r.stat.closedRevenue, 0);
  const repsAtGoal = ranked.filter((r) => r.stat.attainmentPct >= 100).length;
  const openPipelineValue = ranked.reduce(
    (sum, r) => sum + r.rep.deals.filter((d) => d.stage !== "Closed Won").reduce((s, d) => s + d.value, 0),
    0,
  );
  return {
    avgAttainment: Math.round((totalAttainment / repCount) * 10) / 10,
    totalRevenue,
    repsAtGoal,
    repCount: ranked.length,
    openPipelineValue,
  };
}

export function repById(id: string): Rep | undefined {
  return REPS.find((r) => r.id === id);
}
