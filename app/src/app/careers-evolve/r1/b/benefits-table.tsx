"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Minus } from "lucide-react";
import { BENEFIT_ROWS, TIERS, type TierKey } from "./data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type SortDir = "ascending" | "descending";

export function BenefitsTable() {
  const [sortKey, setSortKey] = useState<TierKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("descending");

  function handleSort(key: TierKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("descending");
      return;
    }
    setSortDir((prev) => (prev === "descending" ? "ascending" : "descending"));
  }

  const rows = useMemo(() => {
    if (!sortKey) return BENEFIT_ROWS;
    const factor = sortDir === "descending" ? -1 : 1;
    return [...BENEFIT_ROWS].sort(
      (a, b) => factor * (a.cells[sortKey].rank - b.cells[sortKey].rank),
    );
  }, [sortKey, sortDir]);

  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[560px] table-fixed border-collapse">
        <caption className="mb-4 text-left text-sm font-normal text-zinc-600">
          Benefits by employment type, current as of the 2026 plan year. Select a column
          heading to sort every row by coverage level for that tier.
        </caption>
        <thead>
          <tr className="border-b border-zinc-200">
            <th
              scope="col"
              className="w-[28%] py-3 pr-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-600"
            >
              Benefit
            </th>
            {TIERS.map((tier) => {
              const isActive = sortKey === tier.key;
              const SortIcon = !isActive ? ArrowUpDown : sortDir === "ascending" ? ArrowUp : ArrowDown;
              return (
                <th
                  key={tier.key}
                  scope="col"
                  aria-sort={isActive ? sortDir : "none"}
                  className="w-[24%] py-3 pl-2 pr-1 text-left align-bottom"
                >
                  <button
                    type="button"
                    onClick={() => handleSort(tier.key)}
                    className={`inline-flex items-center gap-1.5 rounded text-xs font-bold uppercase tracking-wide ${
                      isActive ? "text-orange-700" : "text-zinc-600 hover:text-zinc-900"
                    } ${FOCUS_RING}`}
                  >
                    {tier.shortLabel}
                    <SortIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-zinc-100 last:border-0">
              <th
                scope="row"
                className="py-3 pr-3 text-left align-top text-sm font-medium text-zinc-900"
              >
                {row.category}
              </th>
              {TIERS.map((tier) => {
                const cell = row.cells[tier.key];
                return (
                  <td key={tier.key} className="py-3 pl-2 pr-1 align-top">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                      {cell.rank === 0 ? (
                        <Minus className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
                      ) : (
                        <Check
                          className="h-4 w-4 flex-shrink-0 text-orange-600"
                          aria-hidden="true"
                        />
                      )}
                      {cell.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-normal leading-relaxed text-zinc-600">
                      {cell.detail}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
