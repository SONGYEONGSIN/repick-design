// Outpost — deterministic domain data for the Risk Ops signal feed.
// No Math.random / Date.now / new Date() anywhere: every "today/yesterday" label below is a plain
// string literal keyed by day index, not a computed calendar. All aggregates (daily volume, risk
// distribution, queue counts, account history) are derived at module-load time from this single
// EVENTS array via reduce/filter, so a summary tile and the detail view it summarizes can never
// drift apart.

export type RiskTier = "low" | "medium" | "high";
export type Channel = "card" | "ach" | "wire" | "p2p";
export type Status = "open" | "escalated" | "resolved" | "hold";

export interface SignalEvent {
  id: string;
  day: number; // 0 = oldest (Oct 18), 13 = most recent (Oct 31 / "Today")
  minuteOfDay: number; // 0-1439, used for the Time column and its sort
  time: string; // display form of minuteOfDay, e.g. "09:42"
  accountName: string;
  accountId: string;
  channel: Channel;
  amount: number;
  riskScore: number; // 0-100
  status: Status;
  reasons: string[];
  handleMinutes?: number; // only set once a case has been resolved
}

export const DAY_LABELS: string[] = [
  "Oct 18", "Oct 19", "Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24",
  "Oct 25", "Oct 26", "Oct 27", "Oct 28", "Oct 29", "Oct 30", "Today",
];

export function riskTier(score: number): RiskTier {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

// Kept tight on purpose (no surrounding spaces around the separator, and only "Today" gets a
// word instead of a date): this string fills the Feed table's narrowest fixed-width column at
// the 1280px floor, so every saved character of width is safety margin against the
// table-fixed-overlap failure mode.
export function dayTimeLabel(day: number, time: string): string {
  if (day === 13) return `Today·${time}`;
  return `${DAY_LABELS[day]}·${time}`;
}

export const EVENTS: SignalEvent[] = [
  { id: "sig-0001", day: 0, minuteOfDay: 542, time: "09:02", accountName: "Priya Nandakumar", accountId: "ACC-10482", channel: "wire", amount: 18420, riskScore: 82, status: "resolved", reasons: ["New payee", "Velocity spike"], handleMinutes: 34 },
  { id: "sig-0002", day: 0, minuteOfDay: 781, time: "13:01", accountName: "Marcus Webb", accountId: "ACC-20117", channel: "card", amount: 240, riskScore: 22, status: "resolved", reasons: ["Geo mismatch"], handleMinutes: 9 },
  { id: "sig-0003", day: 1, minuteOfDay: 611, time: "10:11", accountName: "Elin Foss", accountId: "ACC-30551", channel: "ach", amount: 5300, riskScore: 54, status: "resolved", reasons: ["Device change"], handleMinutes: 18 },
  { id: "sig-0004", day: 1, minuteOfDay: 905, time: "15:05", accountName: "Diego Alarcon", accountId: "ACC-10998", channel: "p2p", amount: 890, riskScore: 61, status: "resolved", reasons: ["Linked to flagged account"], handleMinutes: 22 },
  { id: "sig-0005", day: 2, minuteOfDay: 500, time: "08:20", accountName: "Hana Kobayashi", accountId: "ACC-40212", channel: "card", amount: 1120, riskScore: 38, status: "resolved", reasons: ["First-time merchant"], handleMinutes: 11 },
  { id: "sig-0006", day: 2, minuteOfDay: 702, time: "11:42", accountName: "Priya Nandakumar", accountId: "ACC-10482", channel: "wire", amount: 22100, riskScore: 88, status: "resolved", reasons: ["New payee", "Amount outlier"], handleMinutes: 41 },
  { id: "sig-0007", day: 2, minuteOfDay: 1001, time: "16:41", accountName: "Owen Fitzgerald", accountId: "ACC-50301", channel: "ach", amount: 3200, riskScore: 29, status: "resolved", reasons: ["Dormant account reactivated"], handleMinutes: 7 },
  { id: "sig-0008", day: 3, minuteOfDay: 480, time: "08:00", accountName: "Marcus Webb", accountId: "ACC-20117", channel: "card", amount: 180, riskScore: 18, status: "resolved", reasons: ["Geo mismatch"], handleMinutes: 6 },
  { id: "sig-0009", day: 3, minuteOfDay: 820, time: "13:40", accountName: "Zanele Khumalo", accountId: "ACC-60119", channel: "wire", amount: 41500, riskScore: 91, status: "escalated", reasons: ["New payee", "Amount outlier", "Velocity spike"] },
  { id: "sig-0010", day: 3, minuteOfDay: 1100, time: "18:20", accountName: "Elin Foss", accountId: "ACC-30551", channel: "ach", amount: 4800, riskScore: 47, status: "resolved", reasons: ["Device change"], handleMinutes: 15 },
  { id: "sig-0011", day: 4, minuteOfDay: 530, time: "08:50", accountName: "Diego Alarcon", accountId: "ACC-10998", channel: "p2p", amount: 1200, riskScore: 66, status: "resolved", reasons: ["Linked to flagged account"], handleMinutes: 26 },
  { id: "sig-0012", day: 4, minuteOfDay: 760, time: "12:40", accountName: "Hana Kobayashi", accountId: "ACC-40212", channel: "card", amount: 960, riskScore: 33, status: "resolved", reasons: ["First-time merchant"], handleMinutes: 10 },
  { id: "sig-0013", day: 4, minuteOfDay: 990, time: "16:30", accountName: "Owen Fitzgerald", accountId: "ACC-50301", channel: "ach", amount: 2750, riskScore: 24, status: "resolved", reasons: ["Dormant account reactivated"], handleMinutes: 8 },
  { id: "sig-0014", day: 5, minuteOfDay: 505, time: "08:25", accountName: "Zanele Khumalo", accountId: "ACC-60119", channel: "wire", amount: 38900, riskScore: 85, status: "resolved", reasons: ["New payee", "Amount outlier"], handleMinutes: 39 },
  { id: "sig-0015", day: 5, minuteOfDay: 845, time: "14:05", accountName: "Marcus Webb", accountId: "ACC-20117", channel: "card", amount: 310, riskScore: 20, status: "resolved", reasons: ["Geo mismatch"], handleMinutes: 5 },
  { id: "sig-0016", day: 5, minuteOfDay: 1150, time: "19:10", accountName: "Priya Nandakumar", accountId: "ACC-10482", channel: "wire", amount: 19800, riskScore: 79, status: "resolved", reasons: ["New payee"], handleMinutes: 30 },
  { id: "sig-0017", day: 6, minuteOfDay: 495, time: "08:15", accountName: "Elin Foss", accountId: "ACC-30551", channel: "ach", amount: 5100, riskScore: 52, status: "resolved", reasons: ["Device change"], handleMinutes: 17 },
  { id: "sig-0018", day: 6, minuteOfDay: 718, time: "11:58", accountName: "Diego Alarcon", accountId: "ACC-10998", channel: "p2p", amount: 1340, riskScore: 70, status: "escalated", reasons: ["Linked to flagged account", "Velocity spike"] },
  { id: "sig-0019", day: 6, minuteOfDay: 960, time: "16:00", accountName: "Hana Kobayashi", accountId: "ACC-40212", channel: "card", amount: 1050, riskScore: 36, status: "resolved", reasons: ["First-time merchant"], handleMinutes: 12 },
  { id: "sig-0020", day: 7, minuteOfDay: 512, time: "08:32", accountName: "Owen Fitzgerald", accountId: "ACC-50301", channel: "ach", amount: 2900, riskScore: 27, status: "resolved", reasons: ["Dormant account reactivated"], handleMinutes: 9 },
  { id: "sig-0021", day: 7, minuteOfDay: 788, time: "13:08", accountName: "Zanele Khumalo", accountId: "ACC-60119", channel: "wire", amount: 44200, riskScore: 94, status: "escalated", reasons: ["New payee", "Amount outlier", "Velocity spike"] },
  { id: "sig-0022", day: 7, minuteOfDay: 1080, time: "18:00", accountName: "Marcus Webb", accountId: "ACC-20117", channel: "card", amount: 260, riskScore: 19, status: "resolved", reasons: ["Geo mismatch"], handleMinutes: 4 },
  { id: "sig-0023", day: 8, minuteOfDay: 500, time: "08:20", accountName: "Priya Nandakumar", accountId: "ACC-10482", channel: "wire", amount: 20700, riskScore: 80, status: "resolved", reasons: ["New payee", "Amount outlier"], handleMinutes: 33 },
  { id: "sig-0024", day: 8, minuteOfDay: 740, time: "12:20", accountName: "Elin Foss", accountId: "ACC-30551", channel: "ach", amount: 4950, riskScore: 49, status: "resolved", reasons: ["Device change"], handleMinutes: 16 },
  { id: "sig-0025", day: 8, minuteOfDay: 1020, time: "17:00", accountName: "Diego Alarcon", accountId: "ACC-10998", channel: "p2p", amount: 1180, riskScore: 63, status: "resolved", reasons: ["Linked to flagged account"], handleMinutes: 21 },
  { id: "sig-0026", day: 9, minuteOfDay: 480, time: "08:00", accountName: "Hana Kobayashi", accountId: "ACC-40212", channel: "card", amount: 1300, riskScore: 41, status: "resolved", reasons: ["First-time merchant"], handleMinutes: 13 },
  { id: "sig-0027", day: 9, minuteOfDay: 820, time: "13:40", accountName: "Owen Fitzgerald", accountId: "ACC-50301", channel: "ach", amount: 3100, riskScore: 31, status: "resolved", reasons: ["Dormant account reactivated"], handleMinutes: 10 },
  { id: "sig-0028", day: 9, minuteOfDay: 1140, time: "19:00", accountName: "Zanele Khumalo", accountId: "ACC-60119", channel: "wire", amount: 36700, riskScore: 83, status: "hold", reasons: ["New payee", "Amount outlier"] },
  { id: "sig-0029", day: 10, minuteOfDay: 510, time: "08:30", accountName: "Marcus Webb", accountId: "ACC-20117", channel: "card", amount: 290, riskScore: 21, status: "resolved", reasons: ["Geo mismatch"], handleMinutes: 5 },
  { id: "sig-0030", day: 10, minuteOfDay: 760, time: "12:40", accountName: "Priya Nandakumar", accountId: "ACC-10482", channel: "wire", amount: 21300, riskScore: 84, status: "resolved", reasons: ["New payee"], handleMinutes: 36 },
  { id: "sig-0031", day: 10, minuteOfDay: 1010, time: "16:50", accountName: "Elin Foss", accountId: "ACC-30551", channel: "ach", amount: 5050, riskScore: 51, status: "resolved", reasons: ["Device change"], handleMinutes: 18 },
  { id: "sig-0032", day: 11, minuteOfDay: 495, time: "08:15", accountName: "Diego Alarcon", accountId: "ACC-10998", channel: "p2p", amount: 1260, riskScore: 68, status: "resolved", reasons: ["Linked to flagged account"], handleMinutes: 24 },
  { id: "sig-0033", day: 11, minuteOfDay: 730, time: "12:10", accountName: "Hana Kobayashi", accountId: "ACC-40212", channel: "card", amount: 1180, riskScore: 44, status: "resolved", reasons: ["First-time merchant"], handleMinutes: 14 },
  { id: "sig-0034", day: 11, minuteOfDay: 990, time: "16:30", accountName: "Owen Fitzgerald", accountId: "ACC-50301", channel: "ach", amount: 2980, riskScore: 26, status: "resolved", reasons: ["Dormant account reactivated"], handleMinutes: 8 },
  { id: "sig-0035", day: 12, minuteOfDay: 500, time: "08:20", accountName: "Zanele Khumalo", accountId: "ACC-60119", channel: "wire", amount: 39900, riskScore: 90, status: "escalated", reasons: ["New payee", "Amount outlier", "Velocity spike"] },
  { id: "sig-0036", day: 12, minuteOfDay: 780, time: "13:00", accountName: "Marcus Webb", accountId: "ACC-20117", channel: "card", amount: 215, riskScore: 17, status: "resolved", reasons: ["Geo mismatch"], handleMinutes: 4 },
  { id: "sig-0037", day: 12, minuteOfDay: 1050, time: "17:30", accountName: "Priya Nandakumar", accountId: "ACC-10482", channel: "wire", amount: 23400, riskScore: 89, status: "open", reasons: ["New payee", "Amount outlier"] },
  { id: "sig-0038", day: 13, minuteOfDay: 482, time: "08:02", accountName: "Elin Foss", accountId: "ACC-30551", channel: "ach", amount: 5200, riskScore: 55, status: "open", reasons: ["Device change"] },
  { id: "sig-0039", day: 13, minuteOfDay: 611, time: "10:11", accountName: "Diego Alarcon", accountId: "ACC-10998", channel: "p2p", amount: 1410, riskScore: 71, status: "escalated", reasons: ["Linked to flagged account", "Velocity spike"] },
  { id: "sig-0040", day: 13, minuteOfDay: 702, time: "11:42", accountName: "Hana Kobayashi", accountId: "ACC-40212", channel: "card", amount: 1090, riskScore: 39, status: "open", reasons: ["First-time merchant"] },
  { id: "sig-0041", day: 13, minuteOfDay: 845, time: "14:05", accountName: "Owen Fitzgerald", accountId: "ACC-50301", channel: "ach", amount: 3050, riskScore: 28, status: "open", reasons: ["Dormant account reactivated"] },
  { id: "sig-0042", day: 13, minuteOfDay: 960, time: "16:00", accountName: "Zanele Khumalo", accountId: "ACC-60119", channel: "wire", amount: 42800, riskScore: 96, status: "open", reasons: ["New payee", "Amount outlier", "Velocity spike"] },
];

// ---- Derived aggregates — every number below is computed from EVENTS, never hand-typed. ----

export interface DailyVolume {
  day: number;
  label: string;
  low: number;
  medium: number;
  high: number;
  total: number;
}

export const DAILY_VOLUME: DailyVolume[] = DAY_LABELS.map((label, day) => {
  const dayEvents = EVENTS.filter((e) => e.day === day);
  const low = dayEvents.filter((e) => riskTier(e.riskScore) === "low").length;
  const medium = dayEvents.filter((e) => riskTier(e.riskScore) === "medium").length;
  const high = dayEvents.filter((e) => riskTier(e.riskScore) === "high").length;
  return { day, label, low, medium, high, total: low + medium + high };
});

export interface RiskBucket {
  rangeLabel: string;
  min: number;
  max: number;
  count: number;
}

export const RISK_DISTRIBUTION: RiskBucket[] = [0, 20, 40, 60, 80].map((min) => {
  const max = min + 20;
  const count = EVENTS.filter((e) => e.riskScore >= min && (max === 100 ? e.riskScore <= max : e.riskScore < max)).length;
  return { rangeLabel: `${min}-${max === 100 ? 100 : max - 1}`, min, max, count };
});

export const QUEUE_SUMMARY = {
  open: EVENTS.filter((e) => e.status === "open").length,
  escalated: EVENTS.filter((e) => e.status === "escalated").length,
  hold: EVENTS.filter((e) => e.status === "hold").length,
  resolved: EVENTS.filter((e) => e.status === "resolved").length,
  avgHandleMinutes: Math.round(
    EVENTS.filter((e) => typeof e.handleMinutes === "number").reduce((sum, e) => sum + (e.handleMinutes ?? 0), 0) /
      Math.max(1, EVENTS.filter((e) => typeof e.handleMinutes === "number").length)
  ),
};

export function accountHistory(accountId: string): SignalEvent[] {
  return EVENTS.filter((e) => e.accountId === accountId).sort((a, b) => b.day - a.day || b.minuteOfDay - a.minuteOfDay);
}

export interface ChannelTierCount {
  channel: Channel;
  low: number;
  medium: number;
  high: number;
  total: number;
}

export const CHANNEL_LABELS: Record<Channel, string> = {
  card: "Card",
  ach: "ACH",
  wire: "Wire",
  p2p: "P2P",
};

export const CHANNEL_BREAKDOWN: ChannelTierCount[] = (Object.keys(CHANNEL_LABELS) as Channel[]).map((channel) => {
  const rows = EVENTS.filter((e) => e.channel === channel);
  const low = rows.filter((e) => riskTier(e.riskScore) === "low").length;
  const medium = rows.filter((e) => riskTier(e.riskScore) === "medium").length;
  const high = rows.filter((e) => riskTier(e.riskScore) === "high").length;
  return { channel, low, medium, high, total: rows.length };
});

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  tier: RiskTier;
  active: boolean;
}

export const INITIAL_RULES: DetectionRule[] = [
  { id: "rule-01", name: "New payee + amount outlier", description: "Flags wires to a first-seen payee above the account's 90-day median.", tier: "high", active: true },
  { id: "rule-02", name: "Velocity spike", description: "Three or more transfers within 15 minutes across any channel.", tier: "high", active: true },
  { id: "rule-03", name: "Device change", description: "Transaction initiated from a device not seen in the last 30 days.", tier: "medium", active: true },
  { id: "rule-04", name: "Dormant account reactivated", description: "First transaction after 60+ days of inactivity.", tier: "low", active: true },
  { id: "rule-05", name: "Linked to flagged account", description: "Counterparty shares a device or payout method with a held account.", tier: "medium", active: false },
  { id: "rule-06", name: "First-time merchant", description: "Card transaction to a merchant category new to this account.", tier: "low", active: true },
];

export const WORKSPACES = ["Northfield Bank — Retail", "Northfield Bank — Business", "Sandbox"];

export const STATUS_LABELS: Record<Status, string> = {
  open: "Open",
  escalated: "Escalated",
  resolved: "Resolved",
  hold: "On hold",
};
