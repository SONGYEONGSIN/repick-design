"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Bookmark, BookmarkCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { BudgetLineItem } from "./data";
import { DEPARTMENT_META, QUARTERS } from "./data";
import { formatCurrency } from "./format";
import { BORDER, FOCUS, HOVER_ROW, NUM, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

type SortKey = "description" | "quarter" | "amount" | "status";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "description", label: "Line item" },
  { key: "quarter", label: "Quarter" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

function quarterRank(q: BudgetLineItem["quarter"]): number {
  return q === "q3-2026" ? 0 : 1;
}

function statusRank(s: BudgetLineItem["status"]): number {
  return s === "approved" ? 0 : s === "pending" ? 1 : 2;
}

/**
 * Owns two pieces of genuinely independent client state: the sort applied to this table, and a
 * "pinned for comparison" set. The pin set is deliberately separate from whatever drives the
 * treemap's selection one level up — pinning a line item here never changes, and is never reset
 * by, which department or cost type is currently selected in the treemap above.
 */
export default function RecordsTable({ items, caption }: { items: BudgetLineItem[]; caption: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function togglePin(id: string) {
    setPinnedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "description") cmp = a.description.localeCompare(b.description);
      else if (sortKey === "quarter") cmp = quarterRank(a.quarter) - quarterRank(b.quarter);
      else if (sortKey === "amount") cmp = a.amount - b.amount;
      else cmp = statusRank(a.status) - statusRank(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [items, sortKey, sortDir]);

  const pinnedItems = items.filter((i) => pinnedIds.includes(i.id));

  return (
    <div>
      {pinnedItems.length > 0 ? (
        <div className={cx("mb-3 rounded-lg border p-2.5", BORDER, "bg-zinc-50")}>
          <p className={cx("mb-1.5 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Pinned for comparison ({pinnedItems.length})</p>
          <ul className="flex flex-wrap gap-1.5">
            {pinnedItems.map((item) => (
              <li key={item.id}>
                <span className={cx("inline-flex items-center gap-1.5 rounded-full border bg-white px-2 py-1 text-xs font-medium", BORDER, TEXT_PRIMARY)}>
                  {item.description}
                  <span className={cx(NUM, "font-semibold")}>{formatCurrency(item.amount)}</span>
                  <button
                    type="button"
                    onClick={() => togglePin(item.id)}
                    aria-label={`Unpin ${item.description}`}
                    className={cx("rounded-full p-0.5", HOVER_ROW, TRANSITION, FOCUS)}
                  >
                    <X size={12} aria-hidden="true" className={TEXT_AUX} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 [scrollbar-width:thin]">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <caption className="relative sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {COLUMNS.map((col) => {
                const active = col.key === sortKey;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th key={col.key} scope="col" aria-sort={ariaSort} className={cx("px-3 py-2 text-left font-medium text-xs", TEXT_MUTED, col.key === "amount" && "text-right")}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cx("inline-flex items-center gap-1 rounded font-medium", col.key === "amount" && "flex-row-reverse", TRANSITION, FOCUS)}
                    >
                      {col.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={12} aria-hidden="true" />
                        ) : (
                          <ArrowDown size={12} aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown size={12} aria-hidden="true" className="text-zinc-400" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className={cx("px-3 py-2 text-right font-medium text-xs", TEXT_MUTED)}>
                <span className="relative sr-only">Pin</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((item) => {
              const pinned = pinnedIds.includes(item.id);
              const quarterLabel = QUARTERS.find((q) => q.value === item.quarter)?.label ?? item.quarter;
              return (
                <tr key={item.id} className={cx(HOVER_ROW, TRANSITION)}>
                  <td className="px-3 py-2">
                    <span className={cx("font-normal", TEXT_PRIMARY)}>{item.description}</span>
                    <span className={cx("ml-1.5 text-xs font-normal", TEXT_AUX)}>{DEPARTMENT_META[item.departmentId].name}</span>
                  </td>
                  <td className={cx("px-3 py-2 font-normal", TEXT_MUTED)}>{quarterLabel}</td>
                  <td className={cx("px-3 py-2 text-right font-semibold", NUM, TEXT_PRIMARY)}>{formatCurrency(item.amount)}</td>
                  <td className="px-3 py-2">
                    <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", STATUS_BADGE[item.status])}>{STATUS_LABEL[item.status]}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => togglePin(item.id)}
                      aria-pressed={pinned}
                      aria-label={pinned ? `Unpin ${item.description}` : `Pin ${item.description} for comparison`}
                      className={cx("rounded-md p-1.5", HOVER_ROW, TRANSITION, FOCUS)}
                    >
                      {pinned ? <BookmarkCheck size={15} aria-hidden="true" className="text-rose-600" /> : <Bookmark size={15} aria-hidden="true" className={TEXT_AUX} />}
                    </button>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className={cx("px-3 py-6 text-center text-sm font-normal", TEXT_AUX)}>
                  No budget line items for this selection.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
