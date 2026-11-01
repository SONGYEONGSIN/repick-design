"use client";

import {
  COST_TYPE_META,
  COST_TYPE_TREND,
  DEPARTMENT_META,
  DEPARTMENT_TREND,
  TREND_QUARTER_LABELS,
  breakdownByCostType,
  breakdownByDepartment,
  classifySeverity,
  costTypeTotal,
  departmentTotal,
  lineItemsForCostType,
  lineItemsForDepartment,
  variancePct,
} from "./data";
import type { CostTypeId, DepartmentId, Grouping, Quarter } from "./data";
import { formatCurrency, formatCount, formatPercent, formatSignedPercent } from "./format";
import { NUM, SEVERITY_BADGE, SEVERITY_LABEL, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Sparkline } from "./ui";
import RecordsTable from "./RecordsTable";

export default function DetailPanel({
  grouping,
  quarter,
  selectedDepartmentId,
  selectedCostTypeId,
}: {
  grouping: Grouping;
  quarter: Quarter;
  selectedDepartmentId: DepartmentId;
  selectedCostTypeId: CostTypeId;
}) {
  const isDepartment = grouping === "department";

  const name = isDepartment ? DEPARTMENT_META[selectedDepartmentId].name : COST_TYPE_META[selectedCostTypeId].name;
  const Icon = isDepartment ? DEPARTMENT_META[selectedDepartmentId].icon : COST_TYPE_META[selectedCostTypeId].icon;
  const value = isDepartment ? departmentTotal(quarter, selectedDepartmentId) : costTypeTotal(quarter, selectedCostTypeId);
  const target = isDepartment ? DEPARTMENT_META[selectedDepartmentId].quarterlyTarget : COST_TYPE_META[selectedCostTypeId].quarterlyTarget;
  const variance = variancePct(value, target);
  const severity = classifySeverity(variance);

  const breakdown = isDepartment ? breakdownByCostType(quarter, selectedDepartmentId) : breakdownByDepartment(quarter, selectedCostTypeId);
  const breakdownTotal = breakdown.reduce((sum, b) => sum + b.value, 0);
  const breakdownLabel = (id: string) => (isDepartment ? COST_TYPE_META[id as CostTypeId].name : DEPARTMENT_META[id as DepartmentId].name);

  const trend = isDepartment ? DEPARTMENT_TREND[selectedDepartmentId] : COST_TYPE_TREND[selectedCostTypeId];

  const lineItems = isDepartment ? lineItemsForDepartment(selectedDepartmentId) : lineItemsForCostType(selectedCostTypeId);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-100">
            <Icon size={18} className="text-zinc-700" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className={cx("truncate text-base font-semibold", TEXT_PRIMARY)}>
              {name} <span className={cx("font-normal", TEXT_AUX)}>detail</span>
            </h2>
            <p className={cx("mt-0.5 text-xs font-normal", TEXT_AUX)}>
              {isDepartment ? `${DEPARTMENT_META[selectedDepartmentId].headcount} headcount · ` : ""}
              Target {formatCurrency(target)} this quarter
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{formatCurrency(value)}</span>
          <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", SEVERITY_BADGE[severity])}>
            {SEVERITY_LABEL[severity]}
            {severity !== "within" ? ` · ${formatSignedPercent(variance)}` : ""}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="breakdown-heading">
          <h3 id="breakdown-heading" className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
            {isDepartment ? "Breakdown by cost type" : "Breakdown by department"}
          </h3>
          <ul className="mt-3 flex flex-col gap-3">
            {breakdown
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((b) => {
                const pct = breakdownTotal > 0 ? (b.value / breakdownTotal) * 100 : 0;
                return (
                  <li key={b.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={cx("min-w-0 flex-1 truncate text-sm font-medium", TEXT_PRIMARY)}>{breakdownLabel(b.id)}</span>
                      <span className={cx("shrink-0 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatCurrency(b.value)}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                      {/* Neutral zinc, not rose — this bar shows proportion, not budget status, and
                          rose stays reserved for primary actions/active states/over-budget tiles. */}
                      <div className="h-full rounded-full bg-zinc-700" style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                    <p className={cx("mt-0.5 text-[11px] font-normal", TEXT_AUX)}>{formatPercent(pct)} of {name}</p>
                  </li>
                );
              })}
          </ul>
        </section>

        <section aria-labelledby="trend-heading">
          <h3 id="trend-heading" className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
            Six-quarter spend trend
          </h3>
          <div className="mt-3 flex items-center gap-4">
            <Sparkline values={trend} ariaLabel={`${name} spend from ${TREND_QUARTER_LABELS[0]} to ${TREND_QUARTER_LABELS[TREND_QUARTER_LABELS.length - 1]}`} />
            <div>
              <p className={cx("text-xs font-normal", TEXT_AUX)}>
                {TREND_QUARTER_LABELS[0]} → {TREND_QUARTER_LABELS[TREND_QUARTER_LABELS.length - 1]}
              </p>
              <p className={cx("text-sm font-semibold", NUM, TEXT_PRIMARY)}>
                {formatSignedPercent(((trend[trend.length - 1]! - trend[0]!) / trend[0]!) * 100)}
              </p>
              <p className={cx("text-[11px] font-normal", TEXT_AUX)}>vs. {TREND_QUARTER_LABELS[0]}</p>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[0, 2, 5].map((i) => (
              <div key={i} className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5">
                <dt className={cx("truncate text-[10px] font-medium uppercase tracking-[0.04em]", TEXT_AUX)}>{TREND_QUARTER_LABELS[i]}</dt>
                <dd className={cx("mt-0.5 truncate text-xs font-semibold", NUM, TEXT_PRIMARY)}>{formatCurrency(trend[i]!)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section aria-labelledby="records-heading" className="mt-6">
        <h3 id="records-heading" className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
          Related budget line items
        </h3>
        <p className={cx("mt-0.5 text-xs font-normal", TEXT_AUX)}>{formatCount(lineItems.length)} items tagged to {name}. Sort by column, or pin items to compare.</p>
        <div className="mt-3">
          <RecordsTable items={lineItems} caption={`Budget line items for ${name}, sortable by line item, quarter, amount and status`} />
        </div>
      </section>
    </div>
  );
}
