"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { PageRow } from "../../lib/data";
import { formatNumber, formatPercent, parseDurationToSeconds } from "../../lib/format";
import { Card, DeltaPill, WidgetHeader } from "../ui";

type SortKey = "views" | "users" | "avgTime" | "conv";
type SortDir = "asc" | "desc";

interface ColumnDef {
  key: SortKey | "page" | "trend";
  label: string;
  widthPct: number;
  align: "left" | "right";
  sortKey?: SortKey;
}

const COLUMNS: ColumnDef[] = [
  { key: "page", label: "페이지", widthPct: 32, align: "left" },
  { key: "views", label: "조회수", widthPct: 14, align: "right", sortKey: "views" },
  { key: "users", label: "방문자", widthPct: 14, align: "right", sortKey: "users" },
  { key: "avgTime", label: "평균 체류시간", widthPct: 16, align: "right", sortKey: "avgTime" },
  { key: "conv", label: "전환율", widthPct: 12, align: "right", sortKey: "conv" },
  { key: "trend", label: "추세", widthPct: 12, align: "right" },
];

function valueFor(row: PageRow, key: SortKey): number {
  if (key === "avgTime") return parseDurationToSeconds(row.avgTime);
  return row[key];
}

export default function TableWidget({
  id,
  highlighted,
  title,
  subtitle,
  data,
}: {
  id: string;
  highlighted: boolean;
  title: string;
  subtitle: string;
  data: PageRow[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const ariaSortFor = (key: SortKey): "ascending" | "descending" | "none" => {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  };

  const sortIndicator = (key: SortKey) => {
    if (key !== sortKey) return <ArrowUpDown className="size-3 text-zinc-400" aria-hidden="true" />;
    return sortDir === "asc" ? (
      <ArrowUp className="size-3 text-indigo-600" aria-hidden="true" />
    ) : (
      <ArrowDown className="size-3 text-indigo-600" aria-hidden="true" />
    );
  };

  const trimmedQuery = query.trim().toLowerCase();

  const rows = useMemo(() => {
    const filtered = data.filter((r) => trimmedQuery === "" || r.page.toLowerCase().includes(trimmedQuery));
    return [...filtered].sort((a, b) => {
      const cmp = valueFor(a, sortKey) - valueFor(b, sortKey);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, trimmedQuery, sortKey, sortDir]);

  return (
    <Card id={id} highlighted={highlighted} className="col-span-12 flex min-w-0 flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <WidgetHeader title={title} subtitle={subtitle} />
        <label className="relative w-full max-w-[240px] sm:w-56">
          <span className="sr-only">페이지 이름으로 검색</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="페이지 검색"
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
          />
        </label>
      </div>

      <div className="min-w-0 overflow-x-auto contain-layout lg:overflow-visible">
        <table className="w-full min-w-[720px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">
            상위 페이지 성과 테이블 — 조회수, 방문자, 평균 체류시간, 전환율 기준으로 정렬할 수 있습니다. 현재{" "}
            {rows.length}개 페이지가 표시되고 있습니다.
          </caption>
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: `${col.widthPct}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortKey ? ariaSortFor(col.sortKey) : undefined}
                  className={`px-3 py-2 ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.sortKey ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.sortKey as SortKey)}
                      className={`inline-flex items-center gap-1 rounded text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                        col.align === "right" ? "w-full justify-end" : ""
                      }`}
                    >
                      {col.label}
                      {sortIndicator(col.sortKey)}
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors motion-reduce:transition-none hover:bg-zinc-50">
                <th scope="row" className="px-3 py-2.5 text-left font-medium text-zinc-900">
                  <span className="block truncate font-mono text-[13px] font-medium text-zinc-800">{row.page}</span>
                </th>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-700">{formatNumber(row.views)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-700">{formatNumber(row.users)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-700">{row.avgTime}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-700">{formatPercent(row.conv)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right">
                  <div className="inline-flex justify-end">
                    <DeltaPill value={row.trendPct} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-6 text-center text-sm text-zinc-500">
                  조건에 맞는 페이지가 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
