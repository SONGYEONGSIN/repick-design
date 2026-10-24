"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { CaseRow } from "./data";
import { CaseStatusBadge, FOCUS_RING, cx } from "./ui";

type SortKey = "id" | "status" | "openedDaysAgo";

const STATUS_ORDER: Record<CaseRow["status"], number> = { escalated: 0, investigating: 1, open: 2 };

export default function CaseTable({ cases, signalName }: { cases: CaseRow[]; signalName: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("openedDaysAgo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const copy = [...cases];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "status") cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      else cmp = a.openedDaysAgo - b.openedDaysAgo;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [cases, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const columns: { key: SortKey; label: string; widthPct: number }[] = [
    { key: "id", label: "Case", widthPct: 46 },
    { key: "status", label: "Status", widthPct: 30 },
    { key: "openedDaysAgo", label: "Opened", widthPct: 24 },
  ];

  if (cases.length === 0) {
    return <p className="text-[12px] text-zinc-500">No open cases linked to this signal.</p>;
  }

  return (
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">Related open cases for {signalName}, sortable by column</caption>
      <colgroup>
        {columns.map((c) => (
          <col key={c.key} style={{ width: `${c.widthPct}%` }} />
        ))}
      </colgroup>
      <thead>
        <tr className="border-b border-zinc-200">
          {columns.map((col) => {
            const active = col.key === sortKey;
            const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
            return (
              <th
                key={col.key}
                scope="col"
                aria-sort={ariaSort as "ascending" | "descending" | "none"}
                className="py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSort(col.key);
                  }}
                  className={cx("inline-flex items-center gap-1", FOCUS_RING)}
                >
                  {col.label}
                  {active ? (
                    sortDir === "asc" ? (
                      <ArrowUp aria-hidden className="h-3 w-3" />
                    ) : (
                      <ArrowDown aria-hidden className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown aria-hidden className="h-3 w-3 text-zinc-500" />
                  )}
                </button>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.map((c) => (
          <tr key={c.id} className="border-b border-zinc-100 last:border-0">
            <td className="truncate py-1.5 pr-2 text-[12px] font-medium text-zinc-800">{c.title}</td>
            <td className="py-1.5">
              <CaseStatusBadge status={c.status} />
            </td>
            <td className="py-1.5 text-[12px] tabular-nums text-zinc-600">{c.openedDaysAgo}d ago</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
