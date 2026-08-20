"use client";

/**
 * Backhaul — the individual units currently held in the selected stage.
 *
 * Real sorting (`aria-sort` on the live column, ascending/descending toggle) and a real SLA filter,
 * both recomputed against the active stage and the active period. Desktop uses `table-fixed` with
 * percentage columns so there is never a horizontal scrollbar; below `lg` the same rows render as
 * stacked cards instead, because six percentage columns squeezed into 358px push their own
 * `whitespace-nowrap` text into the neighbouring cell — an overflow sweep passes and the screen is
 * still unreadable. The mobile layout keeps its own sort control so the ordering stays operable.
 */

import { ArrowDown, ArrowUp, ArrowUpDown, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import type { Stage, UnitRow } from "./data";
import { fmtDwell, fmtInt, fmtUsd } from "./data";
import type { SlaState } from "./tokens";
import {
  BORDER,
  DIVIDE,
  EYEBROW,
  FOCUS,
  FOCUS_INSET,
  HOVER_ROW,
  NUM,
  SLA_LABEL,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TRANSITION,
  cx,
} from "./tokens";
import { SlaBadge } from "./ui";

type SortKey = "id" | "merchant" | "dwellHours" | "valueUsd" | "sla";
type SortDir = "asc" | "desc";
type FilterId = "all" | SlaState;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "on-track", label: SLA_LABEL["on-track"] },
  { id: "at-risk", label: SLA_LABEL["at-risk"] },
  { id: "breached", label: SLA_LABEL.breached },
];

const SLA_ORDER: Record<SlaState, number> = { "on-track": 0, "at-risk": 1, breached: 2 };

const COLUMNS: { key: SortKey | null; label: string; width: string; align: "left" | "right" }[] = [
  { key: "id", label: "RMA", width: "w-[12%]", align: "left" },
  { key: null, label: "Unit", width: "w-[19%]", align: "left" },
  { key: "merchant", label: "Merchant", width: "w-[17%]", align: "left" },
  { key: null, label: "Hold reason", width: "w-[21%]", align: "left" },
  { key: "dwellHours", label: "Dwell", width: "w-[10%]", align: "right" },
  { key: "valueUsd", label: "Value", width: "w-[9%]", align: "right" },
  { key: "sla", label: "SLA", width: "w-[12%]", align: "left" },
];

const MOBILE_SORTS: { key: SortKey; label: string }[] = [
  { key: "dwellHours", label: "Dwell" },
  { key: "valueUsd", label: "Value" },
  { key: "id", label: "RMA" },
];

export default function UnitsTable({ stage, units, periodLabel }: { stage: Stage; units: UnitRow[]; periodLabel: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("dwellHours");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<FilterId>("all");

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "id" || key === "merchant" ? "asc" : "desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = units.filter((u) => filter === "all" || u.sla === filter);
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "merchant") cmp = a.merchant.localeCompare(b.merchant) || a.id.localeCompare(b.id);
      else if (sortKey === "sla") cmp = SLA_ORDER[a.sla] - SLA_ORDER[b.sla] || a.dwellHours - b.dwellHours;
      else cmp = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [units, filter, sortKey, sortDir]);

  const breached = units.filter((u) => u.sla === "breached").length;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={cx("text-xs font-normal", TEXT_CAPTION)}>
          <span className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{fmtInt(rows.length)}</span> of {fmtInt(units.length)} held units shown ·{" "}
          <span className={cx("font-medium", NUM)}>{fmtInt(breached)}</span> breaching SLA
        </p>
        <div role="radiogroup" aria-label="Filter held units by SLA state" className={cx("inline-flex items-center gap-0.5 rounded-xl border p-0.5", BORDER, "bg-zinc-950/60")}>
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFilter(f.id)}
                className={cx(
                  "h-9 rounded-lg px-2.5 text-xs whitespace-nowrap",
                  TRANSITION,
                  FOCUS,
                  active ? "bg-indigo-600 font-semibold text-white" : "font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-50",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile sort control — the desktop header buttons are display:none below lg. */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 lg:hidden">
        <span className={cx(EYEBROW, TEXT_CAPTION, "mr-0.5")}>Sort</span>
        {MOBILE_SORTS.map((s) => {
          const active = s.key === sortKey;
          const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={active}
              onClick={() => toggleSort(s.key)}
              className={cx(
                "inline-flex min-h-11 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium",
                TRANSITION,
                FOCUS,
                active ? "border-indigo-400/50 bg-indigo-400/10 text-indigo-200" : cx(BORDER, TEXT_SECONDARY),
              )}
            >
              {s.label}
              <Icon size={12} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className={cx("mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center", BORDER)}>
          <SearchX size={20} aria-hidden="true" className={TEXT_CAPTION} />
          <p className={cx("text-sm font-medium", TEXT_SECONDARY)}>No held units match this filter</p>
          <p className={cx("text-xs font-normal", TEXT_CAPTION)}>
            None of the {fmtInt(units.length)} units held in {stage.name.toLowerCase()} over the {periodLabel.toLowerCase()} are in that SLA state.
          </p>
        </div>
      ) : (
        <>
          <table className="mt-3 hidden w-full table-fixed border-collapse text-left lg:table">
            <caption className={cx("relative pb-3 text-left text-xs font-normal", TEXT_CAPTION)}>
              Units held in {stage.name.toLowerCase()} over the {periodLabel.toLowerCase()}, sorted by {COLUMNS.find((c) => c.key === sortKey)?.label.toLowerCase()}.
              Column headers with an arrow are sort controls.
            </caption>
            <thead>
              <tr className={cx("border-y", BORDER)}>
                {COLUMNS.map((col) => {
                  const active = col.key !== null && col.key === sortKey;
                  if (col.key === null) {
                    return (
                      <th key={col.label} scope="col" className={cx(col.width, "px-2 py-2.5 first:pl-1", EYEBROW, TEXT_CAPTION, col.align === "right" && "text-right")}>
                        {col.label}
                      </th>
                    );
                  }
                  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                  return (
                    <th
                      key={col.label}
                      scope="col"
                      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                      className={cx(col.width, "px-2 py-1 first:pl-1")}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key as SortKey)}
                        className={cx(
                          "flex min-h-11 w-full items-center gap-1 rounded",
                          col.align === "right" && "justify-end",
                          EYEBROW,
                          active ? "text-indigo-300" : cx(TEXT_CAPTION, "hover:text-zinc-50"),
                          TRANSITION,
                          FOCUS_INSET,
                        )}
                      >
                        {col.label}
                        <Icon size={11} aria-hidden="true" className="shrink-0" />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className={cx("divide-y", DIVIDE)}>
              {rows.map((u) => (
                <tr key={u.id} className={cx(HOVER_ROW, TRANSITION)}>
                  <td className={cx("py-2.5 pl-1 pr-2 text-sm font-medium whitespace-nowrap", NUM, TEXT_PRIMARY)}>{u.id}</td>
                  <td className="px-2 py-2.5">
                    <span className={cx("block truncate text-sm font-normal", TEXT_SECONDARY)}>{u.model}</span>
                    <span className={cx("block truncate text-[11px] font-normal", NUM, TEXT_CAPTION)}>{u.sku}</span>
                  </td>
                  <td className="px-2 py-2.5">
                    <span className={cx("block truncate text-sm font-normal", TEXT_SECONDARY)}>{u.merchant}</span>
                    <span className={cx("block truncate text-[11px] font-normal", TEXT_CAPTION)}>{u.owner}</span>
                  </td>
                  <td className={cx("truncate px-2 py-2.5 text-sm font-normal", TEXT_SECONDARY)}>{u.holdReason}</td>
                  <td className={cx("px-2 py-2.5 text-right text-sm font-normal whitespace-nowrap", NUM, TEXT_SECONDARY)}>{fmtDwell(u.dwellHours)}</td>
                  <td className={cx("px-2 py-2.5 text-right text-sm font-medium whitespace-nowrap", NUM, TEXT_PRIMARY)}>{fmtUsd(u.valueUsd)}</td>
                  <td className="px-2 py-2.5">
                    <SlaBadge state={u.sla} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-3 flex flex-col gap-2 lg:hidden">
            {rows.map((u) => (
              <li key={u.id} className={cx("rounded-xl border p-3", BORDER, "bg-zinc-950/40")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={cx("truncate text-sm font-medium", NUM, TEXT_PRIMARY)}>{u.id}</p>
                    <p className={cx("truncate text-xs font-normal", TEXT_SECONDARY)}>{u.model}</p>
                  </div>
                  <SlaBadge state={u.sla} />
                </div>
                <p className={cx("mt-2 text-xs font-normal", TEXT_CAPTION)}>
                  {u.merchant} · {u.owner}
                </p>
                <p className={cx("mt-1 text-xs font-normal", TEXT_SECONDARY)}>{u.holdReason}</p>
                <div className={cx("mt-2 flex items-center justify-between border-t pt-2", BORDER)}>
                  <span className={cx("text-xs font-normal", NUM, TEXT_CAPTION)}>Held {fmtDwell(u.dwellHours)}</span>
                  <span className={cx("text-sm font-medium", NUM, TEXT_PRIMARY)}>{fmtUsd(u.valueUsd)}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
