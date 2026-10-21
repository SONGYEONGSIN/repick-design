"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CATEGORIES, FINDINGS, type Finding } from "../lib/data";
import { ColumnBadge, SeverityBadge, SortHeaderButton } from "./ui";

type SortKey = "id" | "title" | "category" | "severity" | "owner" | "due" | "column";

const SEVERITY_RANK: Record<Finding["severity"], number> = { critical: 0, high: 1, medium: 2, low: 3 };
const COLUMN_RANK: Record<Finding["column"], number> = {
  backlog: 0,
  "in-progress": 1,
  "evidence-review": 2,
  attested: 3,
};
// "Due" is a plain literal label ("Oct 24"), not a Date — sorted with this fixed lookup, never
// `new Date()`, so parsing stays deterministic across renders.
const MONTH_RANK: Record<string, number> = { Oct: 10, Nov: 11, Dec: 12 };

function dueRank(due: string): number {
  const [month, day] = due.split(" ");
  return (MONTH_RANK[month] ?? 0) * 100 + Number(day);
}

const categoryName = (id: Finding["category"]) => CATEGORIES.find((c) => c.id === id)?.name ?? id;

function compare(a: Finding, b: Finding, key: SortKey): number {
  switch (key) {
    case "id":
      return a.id.localeCompare(b.id);
    case "title":
      return a.title.localeCompare(b.title);
    case "category":
      return categoryName(a.category).localeCompare(categoryName(b.category));
    case "severity":
      return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    case "owner":
      return a.owner.name.localeCompare(b.owner.name);
    case "due":
      return dueRank(a.due) - dueRank(b.due);
    case "column":
      return COLUMN_RANK[a.column] - COLUMN_RANK[b.column];
    default:
      return 0;
  }
}

const COLUMNS: { key: SortKey; label: string; widthPct: number }[] = [
  { key: "id", label: "ID", widthPct: 10 },
  { key: "title", label: "Finding", widthPct: 30 },
  { key: "category", label: "Category", widthPct: 14 },
  { key: "severity", label: "Severity", widthPct: 10 },
  { key: "owner", label: "Owner", widthPct: 16 },
  { key: "due", label: "Due", widthPct: 8 },
  { key: "column", label: "Status", widthPct: 12 },
];

export function FindingsTable() {
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    const sorted = [...FINDINGS].sort((a, b) => compare(a, b, sortKey));
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="min-w-0">
      {/* Desktop / tablet: a single table-fixed table, no horizontal scroller. */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Findings register — all audit findings, sortable by any column</caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: `${c.widthPct}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              {COLUMNS.map((c) => {
                const active = c.key === sortKey;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className="px-3 py-2.5 first:pl-4 last:pr-4"
                  >
                    <SortHeaderButton
                      label={c.label}
                      active={active}
                      direction={sortDir}
                      onClick={() => handleSort(c.key)}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((f, i) => (
              <tr key={f.id} className={`${i % 2 === 1 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04]`}>
                <td className="px-3 py-2.5 pl-4 align-top text-xs font-medium tabular-nums text-zinc-50">{f.id}</td>
                <td className="px-3 py-2.5 align-top text-xs leading-snug text-zinc-50">
                  <span className="block">{f.title}</span>
                </td>
                <td className="px-3 py-2.5 align-top text-xs text-zinc-400">
                  <span className="block truncate">{categoryName(f.category)}</span>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <SeverityBadge severity={f.severity} />
                </td>
                <td className="px-3 py-2.5 align-top text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Image
                      src={`https://images.unsplash.com/photo-${f.owner.photoId}?q=80&w=48&h=48&fit=crop&crop=faces`}
                      alt=""
                      width={18}
                      height={18}
                      className="h-[18px] w-[18px] shrink-0 rounded-full object-cover"
                    />
                    <span className="truncate">{f.owner.name}</span>
                  </span>
                </td>
                <td className="px-3 py-2.5 align-top text-xs tabular-nums text-zinc-400">{f.due}</td>
                <td className="px-3 py-2.5 pr-4 align-top">
                  <ColumnBadge column={f.column} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card-list fallback — never a second horizontally-scrolling surface on the page. */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {rows.map((f) => (
          <li key={f.id} className="rounded-xl border border-white/10 bg-zinc-900 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium tabular-nums text-zinc-400">{f.id}</span>
              <SeverityBadge severity={f.severity} />
            </div>
            <p className="mt-1.5 text-sm font-medium leading-snug text-zinc-50">{f.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-400">
                {categoryName(f.category)}
              </span>
              <ColumnBadge column={f.column} />
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Image
                  src={`https://images.unsplash.com/photo-${f.owner.photoId}?q=80&w=48&h=48&fit=crop&crop=faces`}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] rounded-full object-cover"
                />
                {f.owner.name}
              </span>
              <span className="text-xs tabular-nums text-zinc-400">Due {f.due}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
