import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ReactNode } from "react";
import { PERIOD_CONTEXT, type Aggregates } from "./data";
import { BulletBar, Card, Label, Sparkline } from "./ui";

// Targets that are business thresholds, not derived from the ledger — same role as a real
// product's configured SLO/alert thresholds. The VALUES being compared against them (mttr,
// mtta, p1Count, …) all come from `computeAggregates`, which reads the shared incident array.
const TARGETS = {
  mttrMinutes: 90,
  mttaMinutes: 10,
  p1Count: 2,
  customerFacingCount: 4,
  changeFailureRate: 5,
  postmortemCompletionRate: 100,
  pagesPerEngineer: 12,
  meanTimeBetweenIncidentsHours: 48,
  errorBudgetConsumedPct: 100,
};

function DeltaTag({ delta, goodWhenLower = true, unit = "" }: { delta: number; goodWhenLower?: boolean; unit?: string }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-zinc-500">
        <Minus className="h-3 w-3" aria-hidden="true" />
        flat
      </span>
    );
  }
  const improved = goodWhenLower ? delta < 0 : delta > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${improved ? "text-emerald-700" : "text-rose-700"}`}>
      {delta > 0 ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
      {delta > 0 ? "+" : ""}
      {delta}
      {unit} vs prior
    </span>
  );
}

function Tile({
  label,
  value,
  unit,
  span = 1,
  footer,
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  span?: 1 | 2;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={`min-w-0 rounded-lg border border-zinc-200 p-3.5 ${span === 2 ? "col-span-2" : ""}`}>
      <Label>{label}</Label>
      <p className="mt-1.5 text-[26px] font-semibold leading-none tracking-tight tabular-nums text-zinc-900">
        {value}
        {unit ? <span className="ml-0.5 text-sm font-medium text-zinc-500">{unit}</span> : null}
      </p>
      {children ? <div className="mt-2">{children}</div> : null}
      {footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  );
}

export function StatsGrid({ current, previous }: { current: Aggregates; previous: Aggregates }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <Tile
        label="MTTR"
        value={current.mttrMinutes.toFixed(0)}
        unit="min"
        footer={<DeltaTag delta={Number((current.mttrMinutes - previous.mttrMinutes).toFixed(0))} unit=" min" />}
      >
        <BulletBar value={current.mttrMinutes} target={TARGETS.mttrMinutes} max={TARGETS.mttrMinutes * 1.6} onTarget={current.mttrMinutes <= TARGETS.mttrMinutes} />
        <p className="mt-1 text-[11px] text-zinc-500">Target ≤ {TARGETS.mttrMinutes} min</p>
      </Tile>

      <Tile
        label="MTTA"
        value={current.mttaMinutes.toFixed(1)}
        unit="min"
        footer={<DeltaTag delta={Number((current.mttaMinutes - previous.mttaMinutes).toFixed(1))} unit=" min" />}
      >
        <BulletBar value={current.mttaMinutes} target={TARGETS.mttaMinutes} max={TARGETS.mttaMinutes * 1.8} onTarget={current.mttaMinutes <= TARGETS.mttaMinutes} />
        <p className="mt-1 text-[11px] text-zinc-500">Target ≤ {TARGETS.mttaMinutes} min</p>
      </Tile>

      <Tile
        label="P1 incidents"
        value={String(current.p1Count)}
        footer={<DeltaTag delta={current.p1Count - previous.p1Count} />}
      >
        <BulletBar value={current.p1Count} target={TARGETS.p1Count} max={Math.max(TARGETS.p1Count * 2, current.p1Count + 1)} onTarget={current.p1Count <= TARGETS.p1Count} />
        <p className="mt-1 text-[11px] text-zinc-500">Target ≤ {TARGETS.p1Count}</p>
      </Tile>

      <Tile
        label="Customer-facing"
        value={String(current.customerFacingCount)}
        footer={<DeltaTag delta={current.customerFacingCount - previous.customerFacingCount} />}
      >
        <BulletBar
          value={current.customerFacingCount}
          target={TARGETS.customerFacingCount}
          max={Math.max(TARGETS.customerFacingCount * 2, current.customerFacingCount + 1)}
          onTarget={current.customerFacingCount <= TARGETS.customerFacingCount}
        />
        <p className="mt-1 text-[11px] text-zinc-500">Target ≤ {TARGETS.customerFacingCount}</p>
      </Tile>

      <Tile
        label="Weekly incident volume"
        value={String(current.totalIncidents)}
        span={2}
        footer={<p className="text-[11px] text-zinc-500">4-week trend, hover or tab into a point for the exact count</p>}
      >
        <Sparkline points={current.weeklyIncidentCount} unit=" incidents" width={160} height={34} />
      </Tile>

      <Tile
        label="MTTR trend"
        value={`${current.mttrMinutes.toFixed(0)}`}
        unit="min avg"
        span={2}
        footer={<p className="text-[11px] text-zinc-500">4-week average resolve time, hover or tab into a point</p>}
      >
        <Sparkline points={current.weeklyMttr} unit=" min" width={160} height={34} />
      </Tile>

      <Tile
        label="Change failure rate"
        value={current.changeFailureRate.toFixed(1)}
        unit="%"
        footer={<DeltaTag delta={Number((current.changeFailureRate - previous.changeFailureRate).toFixed(1))} unit=" pts" />}
      >
        <BulletBar value={current.changeFailureRate} target={TARGETS.changeFailureRate} max={TARGETS.changeFailureRate * 2.4} onTarget={current.changeFailureRate <= TARGETS.changeFailureRate} />
        <p className="mt-1 text-[11px] text-zinc-500">Target ≤ {TARGETS.changeFailureRate}%</p>
      </Tile>

      <Tile
        label="Postmortem completion"
        value={current.postmortemCompletionRate.toFixed(0)}
        unit="%"
        footer={<DeltaTag delta={Number((current.postmortemCompletionRate - previous.postmortemCompletionRate).toFixed(0))} unit=" pts" goodWhenLower={false} />}
      >
        <BulletBar
          value={current.postmortemCompletionRate}
          target={TARGETS.postmortemCompletionRate}
          max={100}
          onTarget={current.postmortemCompletionRate >= TARGETS.postmortemCompletionRate}
        />
        <p className="mt-1 text-[11px] text-zinc-500">Target = {TARGETS.postmortemCompletionRate}%</p>
      </Tile>

      <Tile
        label="Pages per engineer"
        value={current.pagesPerEngineer.toFixed(1)}
        footer={<DeltaTag delta={Number((current.pagesPerEngineer - previous.pagesPerEngineer).toFixed(1))} />}
      >
        <BulletBar value={current.pagesPerEngineer} target={TARGETS.pagesPerEngineer} max={TARGETS.pagesPerEngineer * 1.8} onTarget={current.pagesPerEngineer <= TARGETS.pagesPerEngineer} />
        <p className="mt-1 text-[11px] text-zinc-500">Target ≤ {TARGETS.pagesPerEngineer}</p>
      </Tile>

      <Tile
        label="Mean time between incidents"
        value={current.meanTimeBetweenIncidentsHours.toFixed(0)}
        unit="hrs"
        footer={<DeltaTag delta={Number((current.meanTimeBetweenIncidentsHours - previous.meanTimeBetweenIncidentsHours).toFixed(0))} unit=" hrs" goodWhenLower={false} />}
      >
        <BulletBar
          value={current.meanTimeBetweenIncidentsHours}
          target={TARGETS.meanTimeBetweenIncidentsHours}
          max={Math.max(current.meanTimeBetweenIncidentsHours, TARGETS.meanTimeBetweenIncidentsHours) * 1.3}
          onTarget={current.meanTimeBetweenIncidentsHours >= TARGETS.meanTimeBetweenIncidentsHours}
          higherIsBetter
        />
        <p className="mt-1 text-[11px] text-zinc-500">Floor ≥ {TARGETS.meanTimeBetweenIncidentsHours} hrs</p>
      </Tile>

      <Tile
        label="Error budget consumed"
        value={current.errorBudgetConsumedPct.toFixed(0)}
        unit="%"
        footer={
          <p className="text-[11px] text-zinc-500">
            {current.errorBudgetConsumedMinutes} of {PERIOD_CONTEXT[current.period].errorBudgetMinutes} min allowance used
          </p>
        }
      >
        <BulletBar value={current.errorBudgetConsumedPct} target={TARGETS.errorBudgetConsumedPct} max={100} onTarget={current.errorBudgetConsumedPct <= TARGETS.errorBudgetConsumedPct} />
      </Tile>
    </div>
  );
}

export function StatsGridCard({ current, previous }: { current: Aggregates; previous: Aggregates }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">Inline stats</h2>
        <p className="text-xs text-zinc-500">vs {previous.period === "this-month" ? "this month" : "last month"}</p>
      </div>
      <StatsGrid current={current} previous={previous} />
    </Card>
  );
}
