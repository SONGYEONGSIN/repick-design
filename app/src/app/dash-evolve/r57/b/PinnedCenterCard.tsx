"use client";

import { ArrowRight, X } from "lucide-react";
import {
  COST_CENTERS,
  costCenterById,
  costCenterDeltaAt,
  formatCurrency,
  formatPercent,
  orgSharePct,
  type PeriodMode,
  serviceBaselineAt,
  serviceSpendAt,
} from "./data";
import { BORDER, type Direction, FOCUS, NUM, TEAM_RAMP, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, BudgetBar, Card, CardHead, DeltaTag } from "./ui";

/**
 * Independently scoped from SpendBreakdown's `activeId`: this card only changes when a row is
 * explicitly pinned in CostCenterRail (or via the command palette), and it never reacts to
 * hovering a sunburst wedge or focusing a hierarchy-tree row. The sunburst stays on the full org
 * view no matter what is pinned here — see SpendBreakdown.tsx's own comment for the other half
 * of this split.
 */
export default function PinnedCenterCard({ centerId, period, onClear }: { centerId: string | null; period: PeriodMode; onClear: () => void }) {
  const center = centerId ? costCenterById(centerId) : undefined;

  if (!center) {
    return (
      <Card className="flex min-h-[220px] flex-col items-center justify-center text-center">
        <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>No cost center pinned</p>
        <p className={cx("mt-1 max-w-[260px] text-xs font-normal leading-relaxed", TEXT_AUX)}>Pin a row in the cost-center rail, or search with ⌘K, to see its full budget detail here.</p>
      </Card>
    );
  }

  const swatch = TEAM_RAMP[COST_CENTERS.indexOf(center) % TEAM_RAMP.length];
  const delta = costCenterDeltaAt(center, period);
  const pct = orgSharePct(delta.current, period);
  const topServices = [...center.services].sort((a, b) => serviceSpendAt(b, period) - serviceSpendAt(a, period)).slice(0, 3);

  return (
    <Card>
      <CardHead
        title="Pinned cost center"
        action={
          <button type="button" onClick={onClear} className={cx("grid h-9 w-9 place-items-center rounded-lg", TRANSITION, FOCUS, "hover:bg-white/10")}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Clear pinned cost center</span>
          </button>
        }
      />

      <div className="mt-4 flex items-start gap-3">
        <span aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: swatch }} />
        <div className="min-w-0 flex-1">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{center.name}</p>
          <p className={cx("text-xs font-normal", NUM, TEXT_AUX)}>
            {formatCurrency(delta.current)} · {formatPercent(pct)} of org spend
          </p>
        </div>
        <DeltaTag delta={delta.delta} direction={delta.direction} />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Monthly budget</p>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <span className={cx("text-xs font-normal", NUM, TEXT_MUTED)}>{formatCurrency(delta.current)}</span>
          <span className={cx("text-xs font-normal", NUM, TEXT_AUX)}>of {formatCurrency(center.budget)}</span>
        </div>
        <div className="mt-2">
          <BudgetBar spend={delta.current} budget={center.budget} label={`${center.name} budget utilization`} />
        </div>
      </div>

      <div className="mt-4">
        <p className={cx("mb-2 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Top services this period</p>
        <ul className="flex flex-col gap-2">
          {topServices.map((service) => {
            const spend = serviceSpendAt(service, period);
            const baseline = serviceBaselineAt(service, period);
            const servicePct = orgSharePct(spend, period);
            const servDelta = spend - baseline;
            const direction: Direction = servDelta > 0 ? "up" : servDelta < 0 ? "down" : "flat";
            return (
              <li key={service.id} className="flex items-center gap-2.5">
                <service.Icon size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                <span className={cx("min-w-0 flex-1 truncate text-sm font-normal", TEXT_PRIMARY)}>{service.name}</span>
                <Badge className="shrink-0">{formatPercent(servicePct)} of org</Badge>
                <DeltaTag delta={servDelta} direction={direction} className="shrink-0" />
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cx("mt-4 flex items-center justify-between gap-3 border-t pt-4", BORDER)}>
        <p className={cx("flex items-center gap-1.5 text-xs font-normal", NUM, TEXT_AUX)}>
          {formatCurrency(delta.baseline)}
          <ArrowRight size={12} aria-hidden="true" />
          {formatCurrency(delta.current)}
        </p>
        <p className={cx("text-xs font-normal", TEXT_AUX)}>{center.services.length} services</p>
      </div>
    </Card>
  );
}
