"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Clock, TriangleAlert } from "lucide-react";

import {
  CATEGORY,
  METHOD,
  STATUS,
  UI,
  dateFull,
  dateShort,
  formatSigned,
  type Lang,
  type StatusKey,
  type Txn,
} from "./data";
import { SHELL, cn } from "./ui";

type SortKey = "date" | "party" | "category" | "status" | "amount";
type SortDir = "asc" | "desc";

const STATUS_STYLE: Record<StatusKey, string> = {
  settled: "bg-zinc-100 text-zinc-700",
  pending: "bg-white text-zinc-700 ring-1 ring-inset ring-zinc-300",
  review: "bg-rose-50 text-rose-700",
};

const STATUS_ICON: Record<StatusKey, typeof Check> = {
  settled: Check,
  pending: Clock,
  review: TriangleAlert,
};

const STATUS_RANK: Record<StatusKey, number> = { review: 0, pending: 1, settled: 2 };

function compare(a: Txn, b: Txn, key: SortKey, lang: Lang): number {
  if (key === "date") return b.day - a.day;
  if (key === "amount") {
    const av = a.dir === "in" ? a.cents : -a.cents;
    const bv = b.dir === "in" ? b.cents : -b.cents;
    return av - bv;
  }
  if (key === "status") return STATUS_RANK[a.status] - STATUS_RANK[b.status];
  const av = key === "party" ? a.party[lang] : CATEGORY[a.cat][lang];
  const bv = key === "party" ? b.party[lang] : CATEGORY[b.cat][lang];
  if (av < bv) return -1;
  if (av > bv) return 1;
  return 0;
}

export function StreamFeed({
  rows,
  lang,
  caption,
}: {
  rows: readonly Txn[];
  lang: Lang;
  caption: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = [...rows].sort((a, b) => {
    const base = compare(a, b, sortKey, lang);
    const resolved = base === 0 ? (a.id < b.id ? -1 : a.id > b.id ? 1 : 0) : base;
    return sortDir === "asc" ? resolved : -resolved;
  });

  function toggle(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDir(key === "date" || key === "amount" ? "desc" : "asc");
  }

  const columns: {
    key: SortKey | "method";
    label: string;
    width: string;
    align?: "right";
  }[] = [
    { key: "date", label: SHELL.headDate[lang], width: "w-[22%] sm:w-[18%] md:w-[14%] lg:w-[12%]" },
    {
      key: "party",
      label: SHELL.headParty[lang],
      width: "w-[36%] sm:w-[36%] md:w-[30%] lg:w-[28%]",
    },
    {
      key: "category",
      label: UI.category[lang],
      width: "hidden md:table-cell md:w-[20%] lg:w-[18%]",
    },
    { key: "method", label: UI.method[lang], width: "hidden lg:table-cell lg:w-[12%]" },
    {
      key: "status",
      label: UI.status[lang],
      width: "hidden sm:table-cell sm:w-[20%] md:w-[16%] lg:w-[14%]",
    },
    {
      key: "amount",
      label: SHELL.headAmount[lang],
      width: "w-[42%] sm:w-[26%] md:w-[20%] lg:w-[16%]",
      align: "right",
    },
  ];

  return (
    <table className="w-full table-fixed border-collapse text-left text-sm">
      <caption className="sr-only font-normal">{caption}</caption>
      <thead>
        <tr className="border-b border-zinc-200">
          {columns.map((column) => {
            const sortable = column.key !== "method";
            const active = sortable && column.key === sortKey;
            const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
            return (
              <th
                key={column.key}
                scope="col"
                aria-sort={
                  active ? (sortDir === "asc" ? "ascending" : "descending") : undefined
                }
                className={cn(
                  "px-3 py-2 align-middle text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600",
                  column.width,
                  column.align === "right" && "text-right",
                )}
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => toggle(column.key as SortKey)}
                    className={cn(
                      "-mx-1 inline-flex h-9 max-w-full items-center gap-1 rounded-md px-1 transition-colors hover:text-zinc-900 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500",
                      active && "text-zinc-900",
                    )}
                  >
                    <span className="truncate">{column.label}</span>
                    <Icon
                      className={cn("h-3 w-3 shrink-0", active ? "text-rose-600" : "text-zinc-400")}
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <span className="inline-flex h-9 max-w-full items-center truncate">
                    {column.label}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-100">
        {sorted.map((row) => {
          const StatusIcon = STATUS_ICON[row.status];
          return (
            <tr key={row.id} className="transition-colors hover:bg-zinc-50 motion-reduce:transition-none">
              <td className="truncate px-3 py-3 text-[12px] text-zinc-700 tabular-nums sm:text-[13px]">
                <span className="md:hidden">{dateShort(row.day, lang)}</span>
                <span className="hidden md:inline">{dateFull(row.day, lang)}</span>
              </td>
              <td className="px-3 py-3">
                <span className="block truncate text-[13.5px] font-medium text-zinc-900">
                  {row.party[lang]}
                </span>
                <span className="block truncate text-[11.5px] text-zinc-600">{row.memo[lang]}</span>
                <span className="mt-1 block truncate text-[11.5px] text-zinc-600 sm:hidden">
                  {CATEGORY[row.cat][lang]} · {STATUS[row.status][lang]}
                </span>
              </td>
              <td className="hidden truncate px-3 py-3 text-[13px] text-zinc-700 md:table-cell">
                {CATEGORY[row.cat][lang]}
              </td>
              <td className="hidden truncate px-3 py-3 text-[13px] text-zinc-700 lg:table-cell">
                {METHOD[row.method][lang]}
                <span className="block truncate text-[11.5px] text-zinc-600 tabular-nums">
                  {row.ref}
                </span>
              </td>
              <td className="hidden px-3 py-3 sm:table-cell">
                <span
                  className={cn(
                    "inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium",
                    STATUS_STYLE[row.status],
                  )}
                >
                  <StatusIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{STATUS[row.status][lang]}</span>
                </span>
              </td>
              <td
                className={cn(
                  "truncate px-3 py-3 text-right text-[12.5px] font-medium tabular-nums sm:text-sm",
                  row.dir === "in" ? "text-rose-700" : "text-zinc-900",
                )}
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {formatSigned(row.cents, row.dir)}
              </td>
            </tr>
          );
        })}
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-3 py-10 text-center text-[13px] text-zinc-600">
              {UI.empty[lang]}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}
