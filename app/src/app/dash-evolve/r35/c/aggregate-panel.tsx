"use client";

import { BarChart3, GitCompare, Info, Percent, Receipt, Target, Wallet, type LucideIcon } from "lucide-react";
import type { CampaignWithMetrics } from "./data";
import { formatInt, formatPercent, formatUsd, formatUsdPrecise } from "./data";
import { NUM, TEXT_AUX, TEXT_PRIMARY, correlationLabel, cx, pearsonR } from "./tokens";

function StatRow({ Icon, label, value, sub }: { Icon: LucideIcon; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-zinc-950">
          <Icon size={14} aria-hidden="true" className={TEXT_AUX} />
        </span>
        <span className={cx("text-xs font-medium leading-tight", TEXT_AUX)}>{label}</span>
      </div>
      <div className="shrink-0 text-right">
        <p className={cx("text-sm font-semibold leading-tight", NUM, TEXT_PRIMARY)}>{value}</p>
        {sub ? <p className={cx("mt-0.5 text-[10.5px] font-normal", TEXT_AUX)}>{sub}</p> : null}
      </div>
    </div>
  );
}

/**
 * Reads only the FILTERED set passed in by the parent (channel + objective + period
 * state) and recomputes every number here from scratch on every change — this is
 * the one genuine "filter → recompute" axis on the page. It has no idea whether any
 * bubble on the chart is hovered or pinned, and never will: that state lives and
 * dies entirely inside scatter-chart.tsx.
 */
export default function AggregatePanel({ items, totalCampaigns, windowDays }: { items: CampaignWithMetrics[]; totalCampaigns: number; windowDays: number }) {
  const n = items.length;
  const totalSpend = items.reduce((s, c) => s + c.m.spend, 0);
  const totalClicks = items.reduce((s, c) => s + c.m.clicks, 0);
  const totalConversions = items.reduce((s, c) => s + c.m.conversions, 0);
  const blendedRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const r = pearsonR(items.map((c) => ({ x: c.m.spend, y: c.m.conversionRate })));

  return (
    <div>
      <div className="divide-y divide-white/5">
        <StatRow Icon={Target} label="Campaigns in view" value={formatInt(n)} sub={`of ${formatInt(totalCampaigns)} total, trailing ${windowDays}d`} />
        <StatRow Icon={Wallet} label="Total spend" value={formatUsd(totalSpend)} />
        <StatRow Icon={BarChart3} label="Total conversions" value={formatInt(totalConversions)} />
        <StatRow Icon={Percent} label="Blended conversion rate" value={n > 0 ? formatPercent(blendedRate, 2) : "—"} sub="conversions ÷ clicks, weighted" />
        <StatRow Icon={Receipt} label="Average CPA" value={totalConversions > 0 ? formatUsdPrecise(avgCpa) : "—"} />
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950 p-3.5">
        <div className="flex items-center gap-1.5">
          <GitCompare size={13} aria-hidden="true" className="text-orange-400" />
          <p className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{"Spend ↔ conversion-rate correlation"}</p>
        </div>
        {r === null ? (
          <p className={cx("mt-1.5 text-[11.5px] font-normal leading-relaxed", TEXT_AUX)}>Need at least two campaigns in view to compute a correlation coefficient.</p>
        ) : (
          <>
            <p className="mt-1.5 flex items-baseline gap-2">
              <span className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{`r = ${r.toFixed(2)}`}</span>
              <span className={cx("text-xs font-medium capitalize", TEXT_AUX)}>{correlationLabel(r)}</span>
            </p>
            <p className={cx("mt-1.5 text-[11px] font-normal leading-relaxed", TEXT_AUX)}>
              {`Computed live from the ${n} campaign${n === 1 ? "" : "s"} currently plotted. A value near zero means spend size alone doesn't predict conversion efficiency in this cohort.`}
            </p>
          </>
        )}
        <p className={cx("mt-2 flex items-start gap-1 text-[10px] font-normal leading-relaxed", TEXT_AUX)}>
          <Info size={11} aria-hidden="true" className="mt-0.5 shrink-0" />
          Pearson's r, recalculated from the exact spend and rate of every currently visible point — never a fixed figure.
        </p>
      </div>
    </div>
  );
}
