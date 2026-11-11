"use client";

import { CircleDollarSign, TrendingUp, TriangleAlert, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { COST_CENTERS, costCentersOverBudgetAt, formatCurrency, formatSignedCurrency, orgDeltaAt, orgSpendAt, type PeriodMode, topMoverAt } from "./data";
import { Card, CardHead, DeltaTag } from "./ui";
import { NUM, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";

interface KpiItem {
  Icon: LucideIcon;
  label: string;
  value: string;
  sub: ReactNode;
}

/**
 * Always-visible headline stats — never gated behind a hover or a click. Every figure here is
 * read straight off the same data.ts functions the sunburst, the hierarchy tree and the
 * cost-center rail read, so this row can never drift from what those widgets show.
 */
export default function KpiRow({ period }: { period: PeriodMode }) {
  const total = orgSpendAt(period);
  const delta = orgDeltaAt(period);
  const mover = topMoverAt(period);
  const overBudget = costCentersOverBudgetAt(period);

  const items: KpiItem[] = [
    {
      Icon: CircleDollarSign,
      label: "Total org spend",
      value: formatCurrency(total),
      sub: <span className={cx("text-xs font-normal", TEXT_AUX)}>across {COST_CENTERS.length} cost centers</span>,
    },
    {
      Icon: TrendingUp,
      label: "Month over month",
      value: formatSignedCurrency(delta.delta),
      sub: <DeltaTag delta={delta.pct} direction={delta.direction} format="percent" />,
    },
    {
      Icon: Zap,
      label: "Top mover",
      value: mover.center.name,
      sub: <DeltaTag delta={mover.delta.delta} direction={mover.delta.direction} format="currency" />,
    },
    {
      Icon: TriangleAlert,
      label: "Over budget",
      value: `${overBudget.length} of ${COST_CENTERS.length}`,
      sub: (
        <span className={cx("block w-full truncate text-xs font-normal", overBudget.length > 0 ? "text-amber-300" : TEXT_AUX)}>
          {overBudget.length > 0 ? overBudget.map((c) => c.name).join(", ") : "all cost centers within budget"}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHead title="Spend overview" hint="Always visible — never hidden behind a hover or a selection." />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-1.5">
              <item.Icon size={13} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
              <p className={cx("truncate text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>{item.label}</p>
            </div>
            <p className={cx("mt-1.5 truncate text-[17px] font-semibold leading-tight", NUM, TEXT_PRIMARY)}>{item.value}</p>
            <div className="mt-1 min-w-0">{item.sub}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
