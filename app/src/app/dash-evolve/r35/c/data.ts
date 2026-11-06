import {
  FileBarChart2,
  GitCompare,
  Layers,
  ScatterChart,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ChannelId, ObjectiveId, PeriodId } from "./tokens";

export const BRAND = { name: "Quadrant", Icon: ScatterChart };

export const CURRENT_USER = {
  name: "Jordan Mills",
  role: "Growth marketing lead",
  email: "jordan.mills@quadrant.example",
  avatarId: "1472099645785-5658abf4ff4e",
};

export const WORKSPACES = [
  { id: "acme-retail", name: "Acme Retail Co.", plan: "35 active campaigns" },
  { id: "northline", name: "Northline Outdoor", plan: "19 active campaigns" },
  { id: "verve-beauty", name: "Verve Beauty Co.", plan: "27 active campaigns" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "analyze",
    title: "Analyze",
    items: [
      { id: "correlation", label: "Campaign correlation", Icon: ScatterChart, active: true },
      { id: "mix", label: "Channel mix", Icon: Layers },
      { id: "paths", label: "Attribution paths", Icon: GitCompare },
    ],
  },
  {
    id: "manage",
    title: "Manage",
    items: [
      { id: "audiences", label: "Audiences", Icon: Users },
      { id: "reports", label: "Board reports", Icon: FileBarChart2, disabled: true },
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

export const OBJECTIVES: { id: ObjectiveId; label: string }[] = [
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
 * Every figure below is a trailing-90-day baseline (`spend90`/`clicks90`/`conversions90`).
 * The period toggle scales all three by `days / 90` and rounds — a 7-day or 30-day read is
 * a deterministic slice of the same run-rate, never a second hand-typed dataset that could
 * drift from the 90-day numbers. Rates vary genuinely by campaign (0.3%–11.5%) so the
 * scatter has real spread, not a decorative near-uniform cloud.
 */
export interface Campaign {
  id: string;
  name: string;
  channel: ChannelId;
  objective: ObjectiveId;
  spend90: number;
  clicks90: number;
  conversions90: number;
}

export const CAMPAIGNS: Campaign[] = [
  // Paid search — circle, blue. High intent, mid-to-high spend, solid rates.
  { id: "se-1", name: "Branded Terms — Always On", channel: "search", objective: "acquisition", spend90: 18400, clicks90: 9200, conversions90: 690 },
  { id: "se-2", name: "Category: Core Keywords", channel: "search", objective: "acquisition", spend90: 64200, clicks90: 26800, conversions90: 1340 },
  { id: "se-3", name: "Competitor Conquest", channel: "search", objective: "acquisition", spend90: 41500, clicks90: 15200, conversions90: 547 },
  { id: "se-4", name: "Dynamic Search — Catalog", channel: "search", objective: "acquisition", spend90: 52800, clicks90: 24100, conversions90: 1326 },
  { id: "se-5", name: "Shopping — Best Sellers", channel: "search", objective: "acquisition", spend90: 88700, clicks90: 39600, conversions90: 3168 },
  { id: "se-6", name: "Retargeting Search — Cart", channel: "search", objective: "retention", spend90: 22100, clicks90: 8900, conversions90: 801 },
  { id: "se-7", name: "Local Service Ads", channel: "search", objective: "acquisition", spend90: 15300, clicks90: 5100, conversions90: 275 },

  // Paid social — square, pink. Broad reach, lower intent, variable rates.
  { id: "so-1", name: "Prospecting — Lookalike 1%", channel: "social", objective: "acquisition", spend90: 58000, clicks90: 96700, conversions90: 1741 },
  { id: "so-2", name: "Prospecting — Broad Interests", channel: "social", objective: "acquisition", spend90: 112000, clicks90: 168000, conversions90: 1848 },
  { id: "so-3", name: "Retargeting — Site Visitors 30d", channel: "social", objective: "retention", spend90: 24600, clicks90: 31800, conversions90: 1336 },
  { id: "so-4", name: "Brand Awareness — Video Views", channel: "social", objective: "brand", spend90: 71500, clicks90: 142000, conversions90: 852 },
  { id: "so-5", name: "UGC Creative Test", channel: "social", objective: "acquisition", spend90: 39800, clicks90: 52300, conversions90: 1255 },
  { id: "so-6", name: "Influencer Amplification", channel: "social", objective: "brand", spend90: 46200, clicks90: 61000, conversions90: 793 },
  { id: "so-7", name: "Carousel — New Arrivals", channel: "social", objective: "acquisition", spend90: 29700, clicks90: 38500, conversions90: 770 },

  // Display — triangle, violet. Cheap reach, the lowest rates in the cohort.
  { id: "di-1", name: "Programmatic — Run of Network", channel: "display", objective: "brand", spend90: 48300, clicks90: 201000, conversions90: 603 },
  { id: "di-2", name: "Contextual — Category Pages", channel: "display", objective: "acquisition", spend90: 33200, clicks90: 88500, conversions90: 797 },
  { id: "di-3", name: "Native — Content Recommendation", channel: "display", objective: "acquisition", spend90: 26700, clicks90: 71200, conversions90: 783 },
  { id: "di-4", name: "Retargeting Banners — Abandoned Cart", channel: "display", objective: "retention", spend90: 14800, clicks90: 22600, conversions90: 588 },
  { id: "di-5", name: "High-Impact Takeover — Homepage", channel: "display", objective: "brand", spend90: 59500, clicks90: 143000, conversions90: 572 },
  { id: "di-6", name: "Dynamic Product Ads — Display", channel: "display", objective: "acquisition", spend90: 21300, clicks90: 39800, conversions90: 637 },
  { id: "di-7", name: "Connected TV — Awareness", channel: "display", objective: "brand", spend90: 68900, clicks90: 9800, conversions90: 176 },

  // Affiliate — diamond, teal. Performance-based, mid spend, strong rates.
  { id: "af-1", name: "Top Coupon Partner Network", channel: "affiliate", objective: "acquisition", spend90: 31200, clicks90: 48700, conversions90: 2825 },
  { id: "af-2", name: "Content & Review Sites", channel: "affiliate", objective: "acquisition", spend90: 18600, clicks90: 24300, conversions90: 1191 },
  { id: "af-3", name: "Cashback Portal Partnership", channel: "affiliate", objective: "acquisition", spend90: 27400, clicks90: 41200, conversions90: 2637 },
  { id: "af-4", name: "Loyalty & Rewards Network", channel: "affiliate", objective: "retention", spend90: 12300, clicks90: 15800, conversions90: 1138 },
  { id: "af-5", name: "Micro-Influencer Affiliate Pool", channel: "affiliate", objective: "acquisition", spend90: 9800, clicks90: 13200, conversions90: 475 },
  { id: "af-6", name: "Comparison Shopping Engine", channel: "affiliate", objective: "acquisition", spend90: 22900, clicks90: 35600, conversions90: 1460 },
  { id: "af-7", name: "Niche Blog Partnerships", channel: "affiliate", objective: "acquisition", spend90: 6400, clicks90: 8100, conversions90: 429 },

  // Email — cross, cyan. Near-zero media cost, the highest rates in the cohort.
  { id: "em-1", name: "Weekly Newsletter — Full List", channel: "email", objective: "retention", spend90: 2100, clicks90: 54200, conversions90: 3686 },
  { id: "em-2", name: "Win-Back — Lapsed 90d", channel: "email", objective: "retention", spend90: 1400, clicks90: 18600, conversions90: 1748 },
  { id: "em-3", name: "Post-Purchase Flow", channel: "email", objective: "retention", spend90: 900, clicks90: 12400, conversions90: 1426 },
  { id: "em-4", name: "VIP Early Access", channel: "email", objective: "retention", spend90: 1800, clicks90: 9800, conversions90: 1000 },
  { id: "em-5", name: "Abandoned Browse Reminder", channel: "email", objective: "retention", spend90: 1100, clicks90: 21300, conversions90: 1683 },
  { id: "em-6", name: "Seasonal Promo Blast", channel: "email", objective: "acquisition", spend90: 3200, clicks90: 61500, conversions90: 2645 },
  { id: "em-7", name: "Referral Program Nudge", channel: "email", objective: "retention", spend90: 2600, clicks90: 16700, conversions90: 1436 },
];

export const TOTAL_CAMPAIGNS = CAMPAIGNS.length;

export interface CampaignMetrics {
  spend: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  cpa: number;
}

/** Scales a campaign's 90-day baseline down to the requested window and recomputes
 * rate/CPA from the scaled integers — so the displayed rate can never drift from the
 * displayed spend/clicks/conversions, even after rounding. */
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

/** Axis/radius domains — deliberately computed from the FULL cohort at the given
 * period (never the filtered subset), so toggling a channel chip narrows which
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
export function objectiveLabel(id: ObjectiveId): string {
  return OBJECTIVES.find((o) => o.id === id)?.label ?? id;
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function formatUsdPrecise(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
export function formatCompactUsd(n: number): string {
  // Zero is special-cased: Node's bundled ICU (server render) formats compact-notation zero as
  // "$0" while Chromium's ICU (client hydration) formats it as "$0.0" — same input, same Intl
  // options, different runtimes disagree on this one edge value, which reads to React as a
  // hydration mismatch even though nothing here is non-deterministic.
  if (n === 0) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);
}
export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
