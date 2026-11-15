/**
 * Deterministic dummy data for Clearcall — a revenue call-intelligence console.
 *
 * No `Math.random`, `Date.now`, or `new Date()` anywhere: every date is a fixed display string and
 * every "trend" is a hand-authored array. Sums that are supposed to reconcile actually do —
 * `REPS[].callsWeek` totals `CALLS.length` (10), `REPS[].callsMonth` totals `DIGEST.month.callsAnalyzed`
 * (42), and each period's `topics[].pct` totals exactly 100.
 */

export type Sentiment = "positive" | "neutral" | "at-risk";
export type Period = "week" | "month";
export type CallStage = "Discovery" | "Demo" | "Evaluation" | "Negotiation" | "Onboarding" | "Renewal";

export interface Call {
  id: string;
  title: string;
  account: string;
  repId: string;
  date: string;
  durationMin: number;
  talkRatioRep: number;
  score: number;
  sentiment: Sentiment;
  dealValue: number;
  stage: CallStage;
  topic: string;
}

export interface Rep {
  id: string;
  name: string;
  role: string;
  avatarId: string;
  callsWeek: number;
  callsMonth: number;
  avgTalkRatio: number;
  winRatePct: number;
  /** Eight weekly call-score averages, oldest to newest. */
  trend: number[];
}

export interface TopicSlice {
  topic: string;
  pct: number;
  avgScore: number;
}

export interface HeadlineStat {
  label: string;
  value: string;
  delta: string;
  deltaGood: boolean;
}

export interface DigestData {
  label: string;
  callsAnalyzed: number;
  headline: HeadlineStat[];
  topics: TopicSlice[];
}

export const REPS: Rep[] = [
  {
    id: "maren",
    name: "Maren Lindqvist",
    role: "Senior AE",
    avatarId: "1494790108377-be9c29b29330",
    callsWeek: 2,
    callsMonth: 9,
    avgTalkRatio: 48,
    winRatePct: 62,
    trend: [71, 74, 76, 75, 78, 80, 82, 84],
  },
  {
    id: "devon",
    name: "Devon Osei",
    role: "Account Executive",
    avatarId: "1507003211169-0a1dd7228f2d",
    callsWeek: 2,
    callsMonth: 8,
    avgTalkRatio: 61,
    winRatePct: 41,
    trend: [65, 63, 60, 58, 55, 54, 52, 50],
  },
  {
    id: "priya",
    name: "Priya Chandran",
    role: "Account Executive",
    avatarId: "1544005313-94ddf0286df2",
    callsWeek: 2,
    callsMonth: 9,
    avgTalkRatio: 52,
    winRatePct: 55,
    trend: [70, 69, 71, 70, 72, 71, 73, 74],
  },
  {
    id: "theo",
    name: "Theo Albrecht",
    role: "Mid-Market AE",
    avatarId: "1500648767791-00dcc994a43e",
    callsWeek: 2,
    callsMonth: 8,
    avgTalkRatio: 58,
    winRatePct: 47,
    trend: [58, 60, 59, 62, 61, 63, 64, 66],
  },
  {
    id: "noa",
    name: "Noa Fischer",
    role: "Senior AE",
    avatarId: "1580489944761-15a19d654956",
    callsWeek: 2,
    callsMonth: 8,
    avgTalkRatio: 45,
    winRatePct: 58,
    trend: [77, 76, 78, 79, 78, 80, 81, 83],
  },
];

export const CALLS: Call[] = [
  {
    id: "c1",
    title: "Renewal check-in",
    account: "Harborlight Systems",
    repId: "maren",
    date: "Mon · Nov 10",
    durationMin: 34,
    talkRatioRep: 46,
    score: 88,
    sentiment: "positive",
    dealValue: 86000,
    stage: "Renewal",
    topic: "Pricing",
  },
  {
    id: "c2",
    title: "Security review follow-up",
    account: "Northfield Logistics",
    repId: "maren",
    date: "Wed · Nov 12",
    durationMin: 41,
    talkRatioRep: 52,
    score: 79,
    sentiment: "positive",
    dealValue: 54000,
    stage: "Negotiation",
    topic: "Security",
  },
  {
    id: "c3",
    title: "Second demo",
    account: "Bellcross Health",
    repId: "devon",
    date: "Mon · Nov 10",
    durationMin: 29,
    talkRatioRep: 63,
    score: 58,
    sentiment: "neutral",
    dealValue: 38000,
    stage: "Demo",
    topic: "Onboarding",
  },
  {
    id: "c4",
    title: "Competitive displacement call",
    account: "Vantage Freight Co.",
    repId: "devon",
    date: "Thu · Nov 13",
    durationMin: 47,
    talkRatioRep: 68,
    score: 41,
    sentiment: "at-risk",
    dealValue: 112000,
    stage: "Evaluation",
    topic: "Competitor",
  },
  {
    id: "c5",
    title: "Discovery call",
    account: "Amaranth Retail Group",
    repId: "priya",
    date: "Tue · Nov 11",
    durationMin: 26,
    talkRatioRep: 49,
    score: 76,
    sentiment: "positive",
    dealValue: 29000,
    stage: "Discovery",
    topic: "Pricing",
  },
  {
    id: "c6",
    title: "Integration scoping",
    account: "Cedarbrook Analytics",
    repId: "priya",
    date: "Fri · Nov 14",
    durationMin: 38,
    talkRatioRep: 55,
    score: 69,
    sentiment: "neutral",
    dealValue: 47000,
    stage: "Demo",
    topic: "Integrations",
  },
  {
    id: "c7",
    title: "Pricing negotiation",
    account: "Westmarch Insurance",
    repId: "theo",
    date: "Wed · Nov 12",
    durationMin: 44,
    talkRatioRep: 59,
    score: 62,
    sentiment: "neutral",
    dealValue: 97000,
    stage: "Negotiation",
    topic: "Pricing",
  },
  {
    id: "c8",
    title: "Champion check-in",
    account: "Orinvale Media",
    repId: "theo",
    date: "Thu · Nov 13",
    durationMin: 22,
    talkRatioRep: 44,
    score: 83,
    sentiment: "positive",
    dealValue: 21000,
    stage: "Onboarding",
    topic: "Onboarding",
  },
  {
    id: "c9",
    title: "Exec sponsor review",
    account: "Fenwick & Dalton LLP",
    repId: "noa",
    date: "Tue · Nov 11",
    durationMin: 51,
    talkRatioRep: 51,
    score: 86,
    sentiment: "positive",
    dealValue: 143000,
    stage: "Renewal",
    topic: "Security",
  },
  {
    id: "c10",
    title: "At-risk escalation",
    account: "Thornridge Manufacturing",
    repId: "noa",
    date: "Fri · Nov 14",
    durationMin: 36,
    talkRatioRep: 71,
    score: 37,
    sentiment: "at-risk",
    dealValue: 68000,
    stage: "Negotiation",
    topic: "Competitor",
  },
];

export const TOPIC_MOMENTS: Record<string, string> = {
  Pricing: "“Can we get a multi-year discount if we commit before quarter close?”",
  Competitor: "“We're also evaluating Orbital for the renewal — what's the real difference?”",
  Onboarding: "“How fast can your team get us live after signature?”",
  Security: "“Our security team will want your SOC 2 report before we proceed.”",
  Integrations: "“Does this sync natively with our warehouse, or do we need middleware?”",
};

export const DIGEST: Record<Period, DigestData> = {
  week: {
    label: "This week",
    callsAnalyzed: 10,
    headline: [
      { label: "Calls analyzed", value: "10", delta: "+2 vs last wk", deltaGood: true },
      { label: "Avg call score", value: "73", delta: "+4 pts", deltaGood: true },
      { label: "Rep talk ratio", value: "53%", delta: "−4 pts", deltaGood: true },
      { label: "Win rate", value: "54%", delta: "+6 pts", deltaGood: true },
    ],
    topics: [
      { topic: "Pricing", pct: 30, avgScore: 68 },
      { topic: "Competitor", pct: 22, avgScore: 54 },
      { topic: "Onboarding", pct: 20, avgScore: 81 },
      { topic: "Security", pct: 16, avgScore: 72 },
      { topic: "Integrations", pct: 12, avgScore: 77 },
    ],
  },
  month: {
    label: "This month",
    callsAnalyzed: 42,
    headline: [
      { label: "Calls analyzed", value: "42", delta: "+5 vs last mo", deltaGood: true },
      { label: "Avg call score", value: "71", delta: "+2 pts", deltaGood: true },
      { label: "Rep talk ratio", value: "56%", delta: "+1 pt", deltaGood: false },
      { label: "Win rate", value: "49%", delta: "−3 pts", deltaGood: false },
    ],
    topics: [
      { topic: "Competitor", pct: 28, avgScore: 50 },
      { topic: "Pricing", pct: 26, avgScore: 70 },
      { topic: "Onboarding", pct: 18, avgScore: 79 },
      { topic: "Security", pct: 14, avgScore: 75 },
      { topic: "Integrations", pct: 14, avgScore: 73 },
    ],
  },
};

export const TOPIC_SHADES = ["bg-sky-700", "bg-sky-600", "bg-sky-500", "bg-sky-400", "bg-sky-300"];

export function repById(id: string): Rep | undefined {
  return REPS.find((r) => r.id === id);
}

export function callById(id: string): Call | undefined {
  return CALLS.find((c) => c.id === id);
}

export function formatCompactUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
    // Without this, "auto" trailing-zero resolution for compact notation is left to the ICU
    // implementation, and the server (Node) and client (browser) ICU builds disagree on whether to
    // print a trailing ".0" (e.g. "$86K" vs "$86.0K") — causing a hydration mismatch. Pin the
    // behavior explicitly so both sides agree.
    trailingZeroDisplay: "stripIfInteger",
  }).format(n);
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatMinutes(n: number): string {
  return `${n} min`;
}

export function scoreTone(score: number): "positive" | "neutral" | "at-risk" {
  if (score >= 75) return "positive";
  if (score >= 55) return "neutral";
  return "at-risk";
}

/** Deterministic point string for an 8-value trend sparkline, viewBox 0 0 64 24, rounded to 2dp. */
export function sparklinePoints(trend: number[]): string {
  const width = 64;
  const height = 24;
  const pad = 3;
  const step = width / (trend.length - 1);
  return trend
    .map((v, i) => {
      const x = Number((i * step).toFixed(2));
      const y = Number((height - pad - (v / 100) * (height - pad * 2)).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");
}
