"use client";

import { ArrowDown, ArrowUp, Filter } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { BridgeBar, DeltaStepKey, DriverRow, MetricId, StepKey } from "./data";
import { DELTA_STEPS, STEP_BASE_LABEL, formatMetricSigned, unsplashAvatar } from "./data";
import { BORDER, DIVIDE, FOCUS_RING_INSET, HOVER_ROW, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, Dropdown, NUM, SortIcon } from "./ui";

type SortKey = "step" | "segment" | "amount" | "accounts";
type SortDir = "ascending" | "descending";

const FILTER_OPTIONS: { id: DeltaStepKey | "all"; label: string }[] = [
  { id: "all", label: "All drivers" },
  ...DELTA_STEPS.map((s) => ({ id: s, label: STEP_BASE_LABEL[s] })),
];

function HeaderButton({
  label,
  sortKeyName,
  align = "left",
  direction,
  onToggle,
}: {
  label: string;
  sortKeyName: SortKey;
  align?: "left" | "right";
  direction: "ascending" | "descending" | "none";
  onToggle: (key: SortKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(sortKeyName)}
      className={cx("flex w-full items-center gap-1 py-2 text-[11px] font-semibold uppercase tracking-wide", TRANSITION, FOCUS_RING_INSET, align === "right" && "justify-end", TEXT_CAPTION, "hover:text-zinc-900 dark:hover:text-zinc-100")}
    >
      {align === "right" ? <SortIcon direction={direction} /> : null}
      {label}
      {align === "left" ? <SortIcon direction={direction} /> : null}
    </button>
  );
}

export default function DriverTable({
  rows,
  bars,
  metric,
  highlightStep,
  onRowFocusStep,
}: {
  rows: DriverRow[];
  bars: BridgeBar[];
  metric: MetricId;
  highlightStep: StepKey;
  onRowFocusStep: (step: DeltaStepKey) => void;
}) {
  const [filter, setFilter] = useState<DeltaStepKey | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("ascending");

  const filtered = useMemo(() => (filter === "all" ? rows : rows.filter((r) => r.step === filter)), [rows, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dirMul = sortDir === "ascending" ? 1 : -1;
    const copy = [...filtered];
    copy.sort((a, b) => {
      if (sortKey === "step") return DELTA_STEPS.indexOf(a.step) < DELTA_STEPS.indexOf(b.step) ? -dirMul : dirMul;
      if (sortKey === "segment") return a.segmentLabel.localeCompare(b.segmentLabel) * dirMul;
      if (sortKey === "amount") return (a.amount - b.amount) * dirMul;
      return (a.accounts - b.accounts) * dirMul;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("ascending");
    } else if (sortDir === "ascending") {
      setSortDir("descending");
    } else {
      setSortKey(null);
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    return sortKey === key ? sortDir : "none";
  }

  const bridgeValue = filter !== "all" ? bars.find((b) => b.key === filter)?.signedValue : undefined;
  const subtotal = filter !== "all" ? sorted.reduce((sum, r) => sum + r.amount, 0) : undefined;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Filter size={13} aria-hidden="true" className={TEXT_CAPTION} />
        <Dropdown ariaLabel="Filter drivers" label="Driver" options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
        <span className={cx("text-xs", TEXT_CAPTION)}>{sorted.length} rows</span>
      </div>

      <div className={cx("overflow-x-auto rounded-lg border", BORDER)}>
        <table className="w-full min-w-[720px] border-collapse text-left text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">Per-segment breakdown of each revenue bridge driver, with account counts and status signal. Columns are sortable.</caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[30%]" />
            <col className="w-[18%]" />
            <col className="w-[14%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" aria-sort={ariaSortFor("step")} className="pl-3">
                <HeaderButton label="Driver" sortKeyName="step" direction={ariaSortFor("step")} onToggle={toggleSort} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("segment")}>
                <HeaderButton label="Segment" sortKeyName="segment" direction={ariaSortFor("segment")} onToggle={toggleSort} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("amount")} className="text-right">
                <HeaderButton label={metric === "arr" ? "Δ ARR" : "Δ Seats"} sortKeyName="amount" align="right" direction={ariaSortFor("amount")} onToggle={toggleSort} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("accounts")} className="text-right">
                <HeaderButton label="Accounts" sortKeyName="accounts" align="right" direction={ariaSortFor("accounts")} onToggle={toggleSort} />
              </th>
              <th scope="col" className={cx("py-2 pr-3 text-right text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                Signal
              </th>
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {sorted.map((row) => {
              const isHighlighted = row.step === highlightStep;
              return (
                <tr
                  key={row.id}
                  tabIndex={0}
                  onFocus={() => onRowFocusStep(row.step)}
                  onClick={() => onRowFocusStep(row.step)}
                  className={cx("cursor-pointer", TRANSITION, HOVER_ROW, FOCUS_RING_INSET, isHighlighted && "bg-[#A16207]/6 dark:bg-amber-400/7")}
                >
                  <td className={cx("whitespace-nowrap py-2 pl-3 font-medium", TEXT_PRIMARY)}>{row.stepLabel}</td>
                  <td className="py-2 pr-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <Image src={unsplashAvatar(row.owner.avatarId, 48)} alt={`${row.owner.name} profile photo`} width={22} height={22} className="h-[22px] w-[22px] shrink-0 rounded-full border border-zinc-200 object-cover dark:border-white/10" />
                      <span className="min-w-0 flex-1">
                        <span className={cx("block truncate text-sm", TEXT_PRIMARY)}>{row.segmentLabel}</span>
                        <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>{row.owner.name}</span>
                      </span>
                    </span>
                  </td>
                  <td className={cx("whitespace-nowrap py-2 pr-2 text-right font-medium", NUM, row.amount >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                    <span className="inline-flex items-center gap-1">
                      {row.amount >= 0 ? <ArrowUp size={11} aria-hidden="true" /> : <ArrowDown size={11} aria-hidden="true" />}
                      {formatMetricSigned(metric, row.amount)}
                    </span>
                  </td>
                  <td className={cx("whitespace-nowrap py-2 pr-2 text-right", NUM, TEXT_SECONDARY)}>{row.accounts}</td>
                  <td className="py-2 pr-3 text-right">
                    <Badge tone={row.statusTone}>{row.status}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {filter !== "all" && bridgeValue !== undefined && subtotal !== undefined ? (
            <tfoot>
              <tr className={cx("border-t-2", BORDER)}>
                <td colSpan={2} className={cx("py-2 pl-3 text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                  Subtotal (reconciles to bridge bar)
                </td>
                <td className={cx("whitespace-nowrap py-2 pr-2 text-right text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatMetricSigned(metric, subtotal)}</td>
                <td colSpan={2} className={cx("py-2 pr-3 text-right text-xs", TEXT_CAPTION)}>
                  Bar value: <span className={cx("font-medium", TEXT_PRIMARY, NUM)}>{formatMetricSigned(metric, bridgeValue)}</span>
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      <p className={cx("mt-2 text-[11px] leading-snug", TEXT_CAPTION)}>Each driver&rsquo;s four segment rows always sum exactly to its bridge bar value. Click a row or a bar to sync the highlight.</p>
    </div>
  );
}
