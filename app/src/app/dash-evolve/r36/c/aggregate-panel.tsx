"use client";

import { BarChart3, Percent, Receipt, Target, Wallet, type LucideIcon } from "lucide-react";
import type { CampaignWithMetrics } from "./data";
import { formatInt, formatPercent, formatUsd, formatUsdCents } from "./data";
import { NUM, TEXT_DIM, TEXT_PRIMARY, cx } from "./tokens";

/**
 * KPI values here are deliberately kept at text-base (16px) — strictly smaller
 * than the scatter chart's own always-visible correlation headline (text-2xl,
 * 24px, rendered in scatter-chart.tsx). This panel summarizes; the chart is where
 * the single biggest number on the page belongs.
 */
function StatTile({ Icon, label, value, sub }: { Icon: LucideIcon; label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-950 p-3">
      <div className="flex items-center gap-1.5">
        <Icon size={13} aria-hidden="true" className={TEXT_DIM} />
        <span className={cx("truncate text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_DIM)}>{label}</span>
      </div>
      <p className={cx("mt-1.5 text-base font-semibold leading-none", NUM, TEXT_PRIMARY)}>{value}</p>
      {sub ? <p className={cx("mt-1 truncate text-[10.5px] font-normal leading-snug", TEXT_DIM)}>{sub}</p> : null}
    </div>
  );
}

/**
 * Reads only the filtered set passed in by the parent (channel + goal + period
 * state) and recomputes every number here from scratch on every change — the one
 * genuine filter-to-recompute axis on this page. It has no idea whether any
 * bubble on the chart is hovered or pinned, and never will: that state lives and
 * dies entirely inside scatter-chart.tsx and the data table's Pin column.
 */
export default function AggregatePanel({ items, totalCampaigns, windowDays }: { items: CampaignWithMetrics[]; totalCampaigns: number; windowDays: number }) {
  const n = items.length;
  const totalSpend = items.reduce((s, c) => s + c.m.spend, 0);
  const totalClicks = items.reduce((s, c) => s + c.m.clicks, 0);
  const totalConversions = items.reduce((s, c) => s + c.m.conversions, 0);
  const blendedRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      <StatTile Icon={Target} label="In view" value={formatInt(n)} sub={`of ${formatInt(totalCampaigns)} total, ${windowDays}d`} />
      <StatTile Icon={Wallet} label="Total spend" value={formatUsd(totalSpend)} />
      <StatTile Icon={BarChart3} label="Conversions" value={formatInt(totalConversions)} />
      <StatTile Icon={Percent} label="Blended rate" value={n > 0 ? formatPercent(blendedRate, 2) : "—"} sub="conversions ÷ clicks" />
      <StatTile Icon={Receipt} label="Average CPA" value={totalConversions > 0 ? formatUsdCents(avgCpa) : "—"} />
    </div>
  );
}
