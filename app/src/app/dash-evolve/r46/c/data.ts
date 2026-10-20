// Deterministic demo data for Tidemark, a revenue-intelligence console for a
// subscription/e-commerce finance team. No Math.random / Date.now / new Date anywhere
// in this file or any consumer — every series is a pure function of fixed per-channel
// constants, and every "day" label is a fixed literal offset from a fictional "today",
// never the real wall clock.

export type Period = "30d" | "90d";
export type Scheme = "diverging" | "sequential";

export const BRAND_NAME = "Tidemark";
export const BRAND_TAGLINE = "Revenue Intelligence";

export const WORKSPACES = ["Tidemark — Core", "Tidemark — EU Entity"];

export const CURRENT_USER = {
  name: "Priya Shenoy",
  email: "priya.shenoy@tidemark.io",
  initials: "PS",
  avatarId: "1472099645785-5658abf4ff4e",
};

export const NAV_SECTIONS: { label: string; icon: "LayoutGrid" | "Layers" | "BellRing" | "FileBarChart2"; active: boolean }[] = [
  { label: "Overview", icon: "LayoutGrid", active: true },
  { label: "Channels", icon: "Layers", active: false },
  { label: "Alerts", icon: "BellRing", active: false },
  { label: "Reports", icon: "FileBarChart2", active: false },
];

export const PERIODS: { value: Period; label: string; days: number }[] = [
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
];

export const DEFAULT_PERIOD: Period = "30d";

export const SCHEMES: { value: Scheme; label: string }[] = [
  { value: "diverging", label: "Diverging" },
  { value: "sequential", label: "Sequential" },
];

export const DEFAULT_SCHEME: Scheme = "diverging";

/** Full lookback window every per-channel series is generated over. The period toggle
 *  only changes which trailing slice of this fixed array is displayed/aggregated — it
 *  never regenerates data, so "current" (today, index HISTORY_DAYS-1) is always the
 *  same number regardless of which period is selected. */
export const HISTORY_DAYS = 90;

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

export type Channel = {
  id: string;
  name: string;
  category: "Owned" | "Paid" | "Partner" | "Sales";
  /** Typical daily revenue for this channel, in USD, used only to translate a
   *  percentage deviation into a dollar figure for the KPI strip. */
  baseRevenue: number;
};

export const CHANNELS: Channel[] = [
  { id: "direct", name: "Direct", category: "Owned", baseRevenue: 42000 },
  { id: "organic-search", name: "Organic Search", category: "Owned", baseRevenue: 31000 },
  { id: "paid-search", name: "Paid Search", category: "Paid", baseRevenue: 27000 },
  { id: "paid-social", name: "Paid Social", category: "Paid", baseRevenue: 19500 },
  { id: "email-lifecycle", name: "Email & Lifecycle", category: "Owned", baseRevenue: 15800 },
  { id: "affiliates", name: "Affiliates", category: "Partner", baseRevenue: 12200 },
  { id: "marketplace", name: "Marketplace", category: "Partner", baseRevenue: 9800 },
  { id: "partner-api", name: "Partner API", category: "Partner", baseRevenue: 8600 },
  { id: "enterprise-sales", name: "Enterprise Sales", category: "Sales", baseRevenue: 36000 },
  { id: "referral", name: "Referral Program", category: "Owned", baseRevenue: 6200 },
];

export const CHANNEL_BY_ID: Record<string, Channel> = Object.fromEntries(CHANNELS.map((c) => [c.id, c]));

// Per-channel generator constants, same order as CHANNELS. `drift` is a slow
// percentage-points-per-day trend slope (the long-run story); `amplitude`/`freq`/`phase`
// shape a bounded oscillation around it. None of this is random — it is a fixed
// sum of sine/cosine terms, so every render (server or client) produces the exact
// same series.
const CHANNEL_DRIFT = [0.05, 0.02, -0.03, -0.08, 0.01, -0.12, -0.05, 0.1, 0.03, -0.05];
const CHANNEL_AMPLITUDE = [14, 11, 18, 22, 10, 16, 13, 20, 9, 17];
const CHANNEL_FREQ = [0.18, 0.22, 0.15, 0.26, 0.2, 0.17, 0.24, 0.19, 0.21, 0.23];
const CHANNEL_PHASE = [0.4, 1.1, 2.0, 2.7, 3.3, 4.0, 4.6, 5.2, 0.8, 1.6];
const DEVIATION_CLAMP = 42;

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Deterministic daily % deviation from this channel's 28-day baseline revenue,
 *  for the fixed HISTORY_DAYS-day lookback. index 0 = 89 days ago, index
 *  HISTORY_DAYS-1 = today. Pure function of the channel's position in CHANNELS. */
function generateDeviationSeries(index: number): number[] {
  const drift = CHANNEL_DRIFT[index];
  const amp = CHANNEL_AMPLITUDE[index];
  const freq = CHANNEL_FREQ[index];
  const phase = CHANNEL_PHASE[index];
  const series: number[] = [];
  for (let t = 0; t < HISTORY_DAYS; t++) {
    const trend = drift * (t - 45);
    const wave = amp * Math.sin(t * freq + phase);
    const ripple = amp * 0.35 * Math.cos(t * freq * 1.7 + phase * 0.6);
    const raw = trend + wave + ripple;
    const clamped = Math.max(-DEVIATION_CLAMP, Math.min(DEVIATION_CLAMP, raw));
    series.push(Math.round(clamped * 10) / 10);
  }
  return series;
}

/** Precomputed once at module load — never per-render — so every consumer reads the
 *  exact same array instance for a given channel. */
export const SERIES: Record<string, number[]> = Object.fromEntries(CHANNELS.map((c, i) => [c.id, generateDeviationSeries(i)]));

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function sliceLast(values: number[], n: number): number[] {
  return values.slice(Math.max(0, values.length - n));
}

/** "Right now" — always index HISTORY_DAYS-1, independent of the period toggle. */
export function currentValue(channelId: string): number {
  const s = SERIES[channelId];
  return s[s.length - 1];
}

/** The trailing `days`-length slice of a channel's full history — the same slice the
 *  compact horizon strip renders, exported so the row's crosshair tooltip and the
 *  fallback table read the identical numbers the bars encode. */
export function windowSeries(channelId: string, days: number): number[] {
  return sliceLast(SERIES[channelId], days);
}

export function periodAvg(channelId: string, days: number): number {
  return round2(mean(sliceLast(SERIES[channelId], days)));
}

export function periodMin(channelId: string, days: number): number {
  return Math.min(...sliceLast(SERIES[channelId], days));
}

export function periodMax(channelId: string, days: number): number {
  return Math.max(...sliceLast(SERIES[channelId], days));
}

/** Dollar translation of a channel's deviation over a window — the ONLY place this
 *  conversion happens, so the KPI strip's total is always this same function summed,
 *  never a hand-typed figure that could drift from the per-channel numbers. */
export function dollarImpact(channel: Channel, days: number): number {
  const values = sliceLast(SERIES[channel.id], days);
  const total = values.reduce((sum, v) => sum + (v / 100) * channel.baseRevenue, 0);
  return Math.round(total);
}

export function netRevenueImpact(days: number): number {
  return CHANNELS.reduce((sum, c) => sum + dollarImpact(c, days), 0);
}

export function decliningCount(days: number): number {
  return CHANNELS.filter((c) => periodAvg(c.id, days) < 0).length;
}

/** The channel with the lowest "right now" value — the dominant chart's single most
 *  important readout, computed once and reused everywhere it is cited (KPI strip,
 *  default-expanded row) so it can never disagree with itself. */
export function worstChannelNow(): Channel {
  return [...CHANNELS].sort((a, b) => currentValue(a.id) - currentValue(b.id))[0];
}

export function bestChannelNow(): Channel {
  return [...CHANNELS].sort((a, b) => currentValue(b.id) - currentValue(a.id))[0];
}

export const WORST_CHANNEL_NOW = worstChannelNow();
export const BEST_CHANNEL_NOW = bestChannelNow();

/** The row that starts expanded on first paint — the same channel the KPI strip
 *  already names as the steepest decline, so the expanded panel never shows up
 *  pointing at a different story than the headline above it. */
export const DEFAULT_EXPANDED_CHANNEL_ID = WORST_CHANNEL_NOW.id;

/** Pure function of a fixed "days ago" integer within a displayed window of `days`
 *  entries (index HISTORY_DAYS-1 and the last slice entry both mean "today") — never
 *  Date.now()/new Date(). */
export function dayAgoLabel(indexInWindow: number, windowDays: number): string {
  const agoFromToday = windowDays - 1 - indexInWindow;
  if (agoFromToday === 0) return "Today";
  if (agoFromToday === 1) return "Yesterday";
  return `${agoFromToday} days ago`;
}

// ---------------------------------------------------------------------------
// Alerts (created via the primary "New alert" action)
// ---------------------------------------------------------------------------

export type AlertDirection = "above" | "below";

export type RevenueAlert = {
  id: string;
  channelId: string;
  thresholdPct: number;
  direction: AlertDirection;
};

export const SYSTEM_NOTIFICATIONS = [
  { id: "sys-1", text: "Monthly close snapshot for September is ready to review." },
  { id: "sys-2", text: "Affiliates fell below its 90-day floor for the third day running." },
  { id: "sys-3", text: "Partner API crossed +25% above baseline for the first time this quarter." },
];
