"use client";

import { MousePointerClick } from "lucide-react";
import { useState } from "react";
import {
  costCenterById,
  costCenterDeltaAt,
  formatCurrency,
  formatPercent,
  orgSharePct,
  PERIOD_OPTIONS,
  type PeriodMode,
  serviceBaselineAt,
  serviceById,
  serviceSpendAt,
} from "./data";
import HierarchyTree from "./HierarchyTree";
import SunburstChart from "./SunburstChart";
import { BORDER, type Direction, NUM, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, DeltaTag, Segmented } from "./ui";

/**
 * Hosts the sunburst and its required fallback together, plus the one ephemeral `activeId`
 * state they share (hover on the chart, focus/click on the tree — same state, same caption).
 * This is deliberately separate from the cost-center rail's `pinnedId`, owned by OutlayClient:
 * pinning a rail row never touches `activeId`, and activating a wedge or a tree row never
 * touches the rail's pin. Two independently-scoped selections, as required.
 */
export default function SpendBreakdown({ period, onPeriodChange }: { period: PeriodMode; onPeriodChange: (p: PeriodMode) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeCenter = activeId ? costCenterById(activeId) : undefined;
  const activeService = !activeCenter && activeId ? serviceById(activeId) : undefined;

  return (
    <Card>
      <CardHead
        title="Spend breakdown"
        hint="Org → cost center → service. Hover a wedge or focus a row below — both open the same inspector."
        action={<Segmented options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} ariaLabel="Comparison period" />}
      />

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 lg:w-[46%] lg:shrink-0">
          <SunburstChart period={period} activeId={activeId} onActivate={setActiveId} />

          <div aria-live="polite" className={cx("mt-4 min-h-[76px] rounded-xl border p-3", BORDER, "bg-white/[0.03]")}>
            {activeCenter ? (
              <CenterInspector id={activeCenter.id} name={activeCenter.name} period={period} />
            ) : activeService ? (
              <ServiceInspector centerName={activeService.center.name} serviceId={activeService.service.id} period={period} />
            ) : (
              <p className={cx("flex items-center gap-2 text-xs font-normal leading-relaxed", TEXT_AUX)}>
                <MousePointerClick size={14} aria-hidden="true" className="shrink-0" />
                Hover a wedge, or Tab to a row in the list, to inspect its exact spend and share of the org total.
              </p>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={cx("text-xs font-semibold tracking-tight", TEXT_PRIMARY)}>Full hierarchy</h3>
          <p className={cx("mt-0.5 mb-2.5 text-xs font-normal leading-relaxed", TEXT_AUX)}>
            The sunburst&apos;s required fallback — every node, its exact share of org spend, reachable with Tab alone.
          </p>
          <HierarchyTree period={period} activeId={activeId} onActivate={setActiveId} />
        </div>
      </div>
    </Card>
  );
}

function CenterInspector({ id, name, period }: { id: string; name: string; period: PeriodMode }) {
  const center = costCenterById(id);
  if (!center) return null;
  const delta = costCenterDeltaAt(center, period);
  const pct = orgSharePct(delta.current, period);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0">
        <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{name}</p>
        <p className={cx("text-xs font-normal", NUM, TEXT_AUX)}>
          {formatCurrency(delta.current)} · {formatPercent(pct)} of org spend
        </p>
      </div>
      <DeltaTag delta={delta.delta} direction={delta.direction} />
    </div>
  );
}

function ServiceInspector({ centerName, serviceId, period }: { centerName: string; serviceId: string; period: PeriodMode }) {
  const resolved = serviceById(serviceId);
  if (!resolved) return null;
  const spend = serviceSpendAt(resolved.service, period);
  const baseline = serviceBaselineAt(resolved.service, period);
  const delta = spend - baseline;
  const pct = orgSharePct(spend, period);
  const direction: Direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0">
        <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{resolved.service.name}</p>
        <p className={cx("text-xs font-normal", TEXT_AUX)}>{centerName}</p>
        <p className={cx("mt-0.5 text-xs font-normal", NUM, TEXT_AUX)}>
          {formatCurrency(spend)} · {formatPercent(pct)} of org spend
        </p>
      </div>
      <DeltaTag delta={delta} direction={direction} />
    </div>
  );
}
