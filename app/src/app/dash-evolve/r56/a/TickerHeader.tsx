"use client";

import { BadgeCheck, CircleAlert, Gauge, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatScoreOneDecimal, formatSignedOneDecimal, networkAggregates, type PeriodMode } from "./data";
import { BORDER, NUM, PANEL_BG, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";

interface TickerItem {
  Icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  toneClassName?: string;
}

/**
 * Full-width ticker-style banner — the "rail-less" concept's substitute for a KPI tile row.
 * Every number here is read straight off networkAggregates(mode), which folds the same
 * FACILITIES list the table and slope chart read, so this banner can never disagree with them.
 * It wraps instead of scrolling (no overflow-x anywhere on this element) so it never becomes a
 * second horizontally-scrolling container alongside the facility table.
 */
export default function TickerHeader({ mode }: { mode: PeriodMode }) {
  const agg = networkAggregates(mode);

  const items: TickerItem[] = [
    {
      Icon: Gauge,
      label: "Network ESG score",
      value: formatScoreOneDecimal(agg.avgCurrent),
      sub: formatSignedOneDecimal(agg.avgDelta),
      toneClassName: agg.avgDelta >= 0 ? "text-lime-800" : "text-zinc-600",
    },
    {
      Icon: TrendingUp,
      label: "Improving",
      value: `${agg.improving} / ${agg.totalSites}`,
      sub: "sites",
    },
    {
      Icon: TrendingDown,
      label: "Declining",
      value: `${agg.declining} / ${agg.totalSites}`,
      sub: "sites",
    },
    {
      Icon: BadgeCheck,
      label: "Certified sites",
      value: `${agg.certifiedSites} / ${agg.totalSites}`,
    },
    {
      Icon: CircleAlert,
      label: "Open incidents",
      value: String(agg.openIncidents),
      sub: "network-wide",
    },
  ];

  return (
    <div className={cx("w-full border-b", BORDER, PANEL_BG)}>
      <div className="flex flex-wrap items-stretch gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        {items.map((item, i) => (
          <div key={item.label} className={cx("flex min-w-0 items-center gap-2.5", i > 0 && "sm:border-l sm:pl-6", i > 0 && BORDER)}>
            <item.Icon size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
            <div className="min-w-0 leading-tight">
              <p className={cx("truncate text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>{item.label}</p>
              <p className="flex items-baseline gap-1.5">
                <span className={cx("text-[15px] font-semibold", NUM, TEXT_PRIMARY)}>{item.value}</span>
                {item.sub ? <span className={cx("text-xs font-normal", NUM, item.toneClassName ?? TEXT_AUX)}>{item.sub}</span> : null}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
