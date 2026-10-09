import {
  BarChart3,
  Gauge,
  Layers,
  ScatterChart,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ChannelId, GoalId, PeriodId } from "./tokens";

export const BRAND = { name: "Quadrant", Icon: ScatterChart };

export const CURRENT_USER = { name: "Jordan Mills", role: "Growth marketing lead", email: "jordan.mills@quadrant.example" };

export const WORKSPACES = [
  { id: "acme-retail", name: "Acme Retail Co.", plan: "30 active campaigns" },
  { id: "northline", name: "Northline Outdoor", plan: "18 active campaigns" },
  { id: "verve-beauty", name: "Verve Beauty Co.", plan: "22 active campaigns" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "analyze",
    title: "Analyze",
    items: [
      { id: "correlation", label: "Campaign correlation", Icon: ScatterChart, active: true },
      { id: "mix", label: "Channel mix", Icon: Layers },
      { id: "efficiency", label: "Efficiency trends", Icon: Gauge },
    ],
  },
  {
    id: "manage",
    title: "Manage",
    items: [
      { id: "audiences", label: "Audiences", Icon: Users },
      { id: "reports", label: "Board reports", Icon: BarChart3, disabled: true },
    ],
  },
];

export const CHANNELS: { id: ChannelId; label: string }[] = [
  { id: "search", label: "Paid search" },
  { id: "social", label: "Paid social" },
  { id: "display", label: "Display" },
  { id: "affiliate", label: "Affiliate" },
  { id: "email", label: "Email" },
];

export const GOALS: { id: GoalId; label: string }[] = [
  { id: "acquisition", label: "Acquisition" },
  { id: "retention", label: "Retention" },
  { id: "brand", label: "Brand" },
];

export const PERIODS: { id: PeriodId; label: string; days: number }[] = [
  { id: "7", label: "7D", days: 7 },
  { id: "30", label: "30D", days: 30 },
  { id: "90", label: "90D", days: 90 },
];
export const PERIOD_DAYS: Record<PeriodId, number> = { "7": 7, "30": 30, "90": 90 };
const WINDOW_DAYS = 90;

/**
 * Every figure below is a fixed trailing-90-day baseline. The period control scales
 * all three raw counts by `days / 90` and rounds — a 7-day or 30-day read is a
 * deterministic slice of the same run-rate, never a second hand-typed dataset that
 * could drift from the 90-day numbers. No value here is random or clock-derived.
 */
export interface Campaign {
  id: string;
  name: string;
  channel: ChannelId;
  goal: GoalId;
  spend90: number;
  clicks90: number;
  conversions90: number;
}

export const CAMPAIGNS: Campaign[] = [
  // Paid search — circle, blue
  { id: "se-1", name: "Branded Terms — Evergreen", channel: "search", goal: "acquisition", spend90: 17200, clicks90: 8800, conversions90: 660 },
  { id: "se-2", name: "Category: Core Keywords", channel: "search", goal: "acquisition", spend90: 61500, clicks90: 25700, conversions90: 1285 },
  { id: "se-3", name: "Competitor Conquest", channel: "search", goal: "acquisition", spend90: 39800, clicks90: 14600, conversions90: 525 },
  { id: "se-4", name: "Shopping — Best Sellers", channel: "search", goal: "acquisition", spend90: 84200, clicks90: 37800, conversions90: 3022 },
  { id: "se-5", name: "Retargeting Search — Cart", channel: "search", goal: "retention", spend90: 21000, clicks90: 8500, conversions90: 765 },
  { id: "se-6", name: "Local Service Ads", channel: "search", goal: "acquisition", spend90: 14600, clicks90: 4900, conversions90: 264 },

  // Paid social — square, pink
  { id: "so-1", name: "Prospecting — Lookalike 1%", channel: "social", goal: "acquisition", spend90: 55600, clicks90: 92500, conversions90: 1665 },
  { id: "so-2", name: "Prospecting — Broad Interests", channel: "social", goal: "acquisition", spend90: 108000, clicks90: 162000, conversions90: 1782 },
  { id: "so-3", name: "Retargeting — Site Visitors 30d", channel: "social", goal: "retention", spend90: 23700, clicks90: 30600, conversions90: 1286 },
  { id: "so-4", name: "Brand Awareness — Video Views", channel: "social", goal: "brand", spend90: 68900, clicks90: 136500, conversions90: 821 },
  { id: "so-5", name: "UGC Creative Test", channel: "social", goal: "acquisition", spend90: 38200, clicks90: 50100, conversions90: 1203 },
  { id: "so-6", name: "Carousel — New Arrivals", channel: "social", goal: "acquisition", spend90: 28500, clicks90: 37000, conversions90: 740 },

  // Display — triangle, violet
  { id: "di-1", name: "Programmatic — Run of Network", channel: "display", goal: "brand", spend90: 46500, clicks90: 194000, conversions90: 581 },
  { id: "di-2", name: "Contextual — Category Pages", channel: "display", goal: "acquisition", spend90: 31900, clicks90: 85100, conversions90: 766 },
  { id: "di-3", name: "Native — Content Recommendation", channel: "display", goal: "acquisition", spend90: 25700, clicks90: 68500, conversions90: 754 },
  { id: "di-4", name: "Retargeting Banners — Cart", channel: "display", goal: "retention", spend90: 14200, clicks90: 21700, conversions90: 565 },
  { id: "di-5", name: "High-Impact Takeover — Home", channel: "display", goal: "brand", spend90: 57200, clicks90: 137500, conversions90: 550 },
  { id: "di-6", name: "Connected TV — Awareness", channel: "display", goal: "brand", spend90: 66300, clicks90: 9400, conversions90: 169 },

  // Affiliate — diamond, emerald
  { id: "af-1", name: "Top Coupon Partner Network", channel: "affiliate", goal: "acquisition", spend90: 30100, clicks90: 47200, conversions90: 2715 },
  { id: "af-2", name: "Content & Review Sites", channel: "affiliate", goal: "acquisition", spend90: 17900, clicks90: 23500, conversions90: 1148 },
  { id: "af-3", name: "Cashback Portal Partnership", channel: "affiliate", goal: "acquisition", spend90: 26400, clicks90: 39800, conversions90: 2540 },
  { id: "af-4", name: "Loyalty & Rewards Network", channel: "affiliate", goal: "retention", spend90: 11900, clicks90: 15300, conversions90: 1098 },
  { id: "af-5", name: "Comparison Shopping Engine", channel: "affiliate", goal: "acquisition", spend90: 22100, clicks90: 34400, conversions90: 1408 },
  { id: "af-6", name: "Niche Blog Partnerships", channel: "affiliate", goal: "acquisition", spend90: 6800, clicks90: 8600, conversions90: 452 },

  // Email — cross, cyan
  { id: "em-1", name: "Weekly Newsletter — Full List", channel: "email", goal: "retention", spend90: 2000, clicks90: 52800, conversions90: 3598 },
  { id: "em-2", name: "Win-Back — Lapsed 90d", channel: "email", goal: "retention", spend90: 1350, clicks90: 18100, conversions90: 1702 },
  { id: "em-3", name: "Post-Purchase Flow", channel: "email", goal: "retention", spend90: 850, clicks90: 12000, conversions90: 1380 },
  { id: "em-4", name: "VIP Early Access", channel: "email", goal: "retention", spend90: 1700, clicks90: 9500, conversions90: 968 },
  { id: "em-5", name: "Abandoned Browse Reminder", channel: "email", goal: "retention", spend90: 1050, clicks90: 20700, conversions90: 1631 },
  { id: "em-6", name: "Seasonal Promo Blast", channel: "email", goal: "acquisition", spend90: 3100, clicks90: 59700, conversions90: 2566 },
];

export const TOTAL_CAMPAIGNS = CAMPAIGNS.length;

export interface CampaignMetrics {
  spend: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  cpa: number;
}

/** Scales a campaign's fixed 90-day baseline down to the requested window and
 * recomputes rate/CPA from the already-scaled integers, so the displayed rate can
 * never drift from the displayed spend/clicks/conversions after rounding. */
export function computeMetrics(c: Campaign, period: PeriodId): CampaignMetrics {
  const factor = PERIOD_DAYS[period] / WINDOW_DAYS;
  const spend = Math.round(c.spend90 * factor);
  const clicks = Math.round(c.clicks90 * factor);
  const conversions = Math.round(c.conversions90 * factor);
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
  const cpa = conversions > 0 ? spend / conversions : 0;
  return { spend, clicks, conversions, conversionRate, cpa };
}

export type CampaignWithMetrics = Campaign & { m: CampaignMetrics };

/** Axis/radius domains computed from the full cohort at the given period — never
 * the channel/goal-filtered subset — so toggling a channel chip narrows which
 * points render without rescaling the axes under the remaining points. */
export function computeDomains(items: CampaignWithMetrics[]): { maxSpend: number; maxRate: number; maxConversions: number } {
  const maxSpend = items.reduce((m, c) => Math.max(m, c.m.spend), 0);
  const maxRate = items.reduce((m, c) => Math.max(m, c.m.conversionRate), 0);
  const maxConversions = items.reduce((m, c) => Math.max(m, c.m.conversions), 0);
  return { maxSpend, maxRate, maxConversions };
}

export function channelLabel(id: ChannelId): string {
  return CHANNELS.find((c) => c.id === id)?.label ?? id;
}
export function goalLabel(id: GoalId): string {
  return GOALS.find((g) => g.id === id)?.label ?? id;
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function formatUsdCents(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}

/**
 * FIX #1 — compact-notation zero bug: Node's bundled ICU (server render) and the
 * browser's ICU (client hydration) do not agree on how "0" prints under
 * `notation: "compact"` (one yields "$0", the other "$0.0"), which reads to React
 * as a hydration mismatch even though the input is fully deterministic. Zero is
 * special-cased to a fixed literal BEFORE Intl ever sees `notation: "compact"`.
 * Applied to every helper in this file that formats a compact figure — there is
 * only one such helper, and every caller (axis ticks, the legend, the KPI tile)
 * routes through it rather than calling `Intl.NumberFormat` with compact notation
 * directly.
 */
export function formatCompactUsd(n: number): string {
  if (n === 0) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

/**
 * Same zero-before-compact rule as `formatCompactUsd` above, applied here too:
 * this is the "not just the obvious one" helper the fix calls out — a plain count
 * (clicks, conversions) formatted with compact notation for the bubble-size legend
 * hits the exact same ICU disagreement at zero, even though it is not a currency.
 */
export function formatCompactInt(n: number): string {
  if (n === 0) return "0";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
