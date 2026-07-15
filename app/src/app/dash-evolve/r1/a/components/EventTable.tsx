"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import type { RivetEvent } from "../lib/data";
import { NOW } from "../lib/data";
import { formatDateTime, formatLatency, formatRelative } from "../lib/format";
import { Avatar, CategoryBadge, SOURCE_META } from "./ui";

type SortKey = "latencyMs" | "at";
type SortDir = "asc" | "desc";

const SORT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "latencyMs", label: "지연시간" },
  { key: "at", label: "시각" },
];

export default function EventTable({ events }: { events: RivetEvent[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...events].sort((a, b) => {
      const av = sortKey === "at" ? a.at.getTime() : a.latencyMs;
      const bv = sortKey === "at" ? b.at.getTime() : b.latencyMs;
      return (av - bv) * dir;
    });
  }, [events, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] table-fixed border-collapse text-sm">
        <caption className="sr-only">
          필터된 이벤트 목록 — 유형, 사용자, 이벤트, 소스, 지연시간, 시각. 지연시간과 시각 기준 정렬 가능.
        </caption>
        <colgroup>
          <col className="w-[13%]" />
          <col className="w-[25%]" />
          <col className="w-[24%]" />
          <col className="w-[12%]" />
          <col className="w-[13%]" />
          <col className="w-[13%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200 text-left">
            <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              유형
            </th>
            <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              사용자
            </th>
            <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              이벤트
            </th>
            <th scope="col" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              소스
            </th>
            {SORT_COLUMNS.map((col) => {
              const active = col.key === sortKey;
              const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
              return (
                <th key={col.key} scope="col" aria-sort={ariaSort} className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="inline-flex min-h-[28px] items-center gap-1 rounded-md px-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                  >
                    {col.label}
                    {active ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="size-3" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="size-3" aria-hidden="true" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 text-zinc-300" aria-hidden="true" />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((event) => {
            const source = SOURCE_META[event.source];
            const slow = event.latencyMs >= 1000;
            return (
              <tr key={event.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-2.5">
                  <CategoryBadge category={event.category} />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar name={event.user} className="size-6" />
                    <span className="truncate text-zinc-800">{event.user ?? "시스템"}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <code className="block truncate font-mono text-[12px] text-zinc-600">{event.eventName}</code>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-zinc-600">
                    <source.Icon className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                    {source.label}
                  </span>
                </td>
                <td className={`whitespace-nowrap px-4 py-2.5 text-right tabular-nums ${slow ? "font-medium text-rose-600" : "text-zinc-700"}`}>
                  {formatLatency(event.latencyMs)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right">
                  <time
                    dateTime={event.at.toISOString()}
                    title={formatDateTime(event.at)}
                    className="text-xs tabular-nums text-zinc-500"
                  >
                    {formatRelative(event.at, NOW)}
                  </time>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-500">
                조건에 맞는 이벤트가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
