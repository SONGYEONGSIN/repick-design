// Deterministic dummy data for the Verbatim word-trends dashboard.
// No Math.random(), no Date.now(), no bare new Date() anywhere in this module —
// every figure below is a fixed literal or a pure arithmetic transform of one.

export type Sentiment = "positive" | "neutral" | "negative";
export type Period = "7d" | "30d" | "90d";

export interface WordBase {
  word: string;
  sentiment: Sentiment;
  /** Mention count over the 30-day baseline window. */
  base: number;
}

export interface ScaledWord extends WordBase {
  count: number;
  /** 1-based rank by count within the full (unfiltered) period dataset. */
  rank: number;
  /** Share of the full period total, 0-100, one decimal. */
  sharePct: number;
}

// Hand-authored, zipfian-shaped, already sorted by count descending.
// Sentiment is assigned by what the word means in a review, not derived from count.
export const WORD_BASE: WordBase[] = [
  { word: "crashes", sentiment: "negative", base: 612 },
  { word: "love", sentiment: "positive", base: 578 },
  { word: "support", sentiment: "neutral", base: 544 },
  { word: "bugs", sentiment: "negative", base: 511 },
  { word: "intuitive", sentiment: "positive", base: 487 },
  { word: "update", sentiment: "neutral", base: 462 },
  { word: "slow", sentiment: "negative", base: 438 },
  { word: "fast", sentiment: "positive", base: 415 },
  { word: "sync", sentiment: "neutral", base: 392 },
  { word: "freezes", sentiment: "negative", base: 371 },
  { word: "reliable", sentiment: "positive", base: 352 },
  { word: "notifications", sentiment: "neutral", base: 334 },
  { word: "glitchy", sentiment: "negative", base: 317 },
  { word: "smooth", sentiment: "positive", base: 301 },
  { word: "login", sentiment: "neutral", base: 286 },
  { word: "laggy", sentiment: "negative", base: 272 },
  { word: "helpful", sentiment: "positive", base: 259 },
  { word: "settings", sentiment: "neutral", base: 247 },
  { word: "unresponsive", sentiment: "negative", base: 235 },
  { word: "beautiful", sentiment: "positive", base: 224 },
  { word: "onboarding", sentiment: "neutral", base: 213 },
  { word: "confusing", sentiment: "negative", base: 203 },
  { word: "easy", sentiment: "positive", base: 193 },
  { word: "pricing", sentiment: "neutral", base: 184 },
  { word: "expensive", sentiment: "negative", base: 175 },
  { word: "amazing", sentiment: "positive", base: 167 },
  { word: "dashboard", sentiment: "neutral", base: 159 },
  { word: "ads", sentiment: "negative", base: 151 },
  { word: "responsive", sentiment: "positive", base: 144 },
  { word: "export", sentiment: "neutral", base: 137 },
  { word: "drains", sentiment: "negative", base: 130 },
  { word: "polished", sentiment: "positive", base: 124 },
  { word: "search", sentiment: "neutral", base: 118 },
  { word: "buggy", sentiment: "negative", base: 112 },
  { word: "great", sentiment: "positive", base: 107 },
  { word: "widget", sentiment: "neutral", base: 102 },
  { word: "clunky", sentiment: "negative", base: 97 },
  { word: "clean", sentiment: "positive", base: 92 },
  { word: "backup", sentiment: "neutral", base: 88 },
  { word: "frustrating", sentiment: "negative", base: 84 },
  { word: "delightful", sentiment: "positive", base: 80 },
  { word: "permissions", sentiment: "neutral", base: 76 },
];

// Fixed scalar multipliers applied to the 30-day baseline. Pure arithmetic,
// identical on server and client, so period switching never risks a hydration
// mismatch the way a randomized or clock-derived figure would.
export const PERIOD_MULTIPLIER: Record<Period, number> = {
  "7d": 0.24,
  "30d": 1,
  "90d": 2.9,
};

export const PERIOD_LABEL: Record<Period, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export const PERIODS: Period[] = ["7d", "30d", "90d"];

/** Scales the base list for a period and attaches rank + share. Deterministic, pure. */
export function getWordsForPeriod(period: Period): ScaledWord[] {
  const multiplier = PERIOD_MULTIPLIER[period];
  const scaled = WORD_BASE.map((w) => ({
    ...w,
    count: Math.round(w.base * multiplier),
  }));
  const total = scaled.reduce((sum, w) => sum + w.count, 0);
  return scaled
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((w, i) => ({
      ...w,
      rank: i + 1,
      sharePct: Math.round((w.count / total) * 1000) / 10,
    }));
}

export function totalMentions(words: ScaledWord[]): number {
  return words.reduce((sum, w) => sum + w.count, 0);
}

export function sentimentTotals(words: ScaledWord[]): Record<Sentiment, number> {
  return words.reduce(
    (acc, w) => {
      acc[w.sentiment] += w.count;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 } as Record<Sentiment, number>,
  );
}

export const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

// Fixed baseline snapshot shown in the non-interactive KPI strip — always the
// 30-day window, independent of the explorer's own period toggle below it.
export const KPI_WORDS = getWordsForPeriod("30d");
export const KPI_TOTAL = totalMentions(KPI_WORDS);
export const KPI_SENTIMENT = sentimentTotals(KPI_WORDS);

// Hand-authored 13-point (12-week-interval) trend shape for the sparkline —
// illustrative trend direction only, not required to reconcile with the
// 30-day total above.
export const MENTIONS_TREND: number[] = [
  605, 612, 598, 631, 655, 640, 672, 690, 705, 698, 722, 715, 740,
];

export const SECTION_IDS = {
  overview: "section-overview",
  explorer: "section-explorer",
  wordCloud: "word-cloud-panel",
  frequencyTable: "frequency-table-panel",
};

export interface NavItem {
  key: string;
  label: string;
}

export const NAV_SECTIONS: NavItem[] = [
  { key: "overview", label: "Overview" },
  { key: "reviews", label: "Reviews" },
  { key: "word-trends", label: "Word Trends" },
  { key: "sentiment", label: "Sentiment" },
  { key: "competitors", label: "Competitors" },
  { key: "alerts", label: "Alerts" },
];

export interface NotificationItem {
  id: string;
  initials: string;
  name: string;
  message: string;
  time: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    initials: "RP",
    name: "Reviewer feed",
    message: "12 new App Store reviews mention \"crashes\" after v4.2.",
    time: "18m ago",
  },
  {
    id: "n2",
    initials: "SC",
    name: "Sam Carter",
    message: "Tagged \"onboarding\" thread for the product review.",
    time: "2h ago",
  },
  {
    id: "n3",
    initials: "WK",
    name: "Weekly digest",
    message: "Positive mentions of \"intuitive\" up 14% this week.",
    time: "1d ago",
  },
];

export const WORKSPACES = ["Acme Mobile", "Acme Wallet", "Acme Labs"];
