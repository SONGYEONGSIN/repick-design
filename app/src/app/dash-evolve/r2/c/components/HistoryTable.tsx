"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { CampaignStatus } from "../lib/data";
import { CAMPAIGN_HISTORY, segmentById } from "../lib/data";
import { formatDate, formatNumber, formatPercent } from "../lib/format";
import { Segmented, StatusBadge } from "./ui";

type SortKey = "name" | "segment" | "date" | "recipients" | "openRate" | "clickRate";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | CampaignStatus;

const COLUMNS: { key: SortKey; label: string; widthPct: number }[] = [
  { key: "name", label: "캠페인", widthPct: 24 },
  { key: "segment", label: "세그먼트", widthPct: 15 },
  { key: "date", label: "발송일", widthPct: 12 },
  { key: "recipients", label: "수신자", widthPct: 13 },
  { key: "openRate", label: "오픈율", widthPct: 12 },
  { key: "clickRate", label: "클릭율", widthPct: 12 },
];

export default function HistoryTable() {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const filtered = CAMPAIGN_HISTORY.filter((row) => {
      const matchesQuery = row.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name, "ko");
      else if (sortKey === "segment") cmp = segmentById(a.segmentId).name.localeCompare(segmentById(b.segmentId).name, "ko");
      else if (sortKey === "date") cmp = a.date.localeCompare(b.date);
      else if (sortKey === "recipients") cmp = a.recipients - b.recipients;
      else if (sortKey === "openRate") cmp = (a.openRate ?? -1) - (b.openRate ?? -1);
      else if (sortKey === "clickRate") cmp = (a.clickRate ?? -1) - (b.clickRate ?? -1);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [query, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (key !== sortKey) return <ArrowUpDown className="size-3 text-zinc-300" aria-hidden="true" />;
    return sortDir === "asc" ? (
      <ArrowUp className="size-3 text-indigo-600" aria-hidden="true" />
    ) : (
      <ArrowDown className="size-3 text-indigo-600" aria-hidden="true" />
    );
  };

  const ariaSortFor = (key: SortKey): "ascending" | "descending" | "none" => {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-0">
        <label className="relative w-full max-w-[280px] sm:w-64">
          <span className="sr-only">캠페인 이름 검색</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="캠페인 이름 검색"
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
          />
        </label>
        <Segmented<StatusFilter>
          label="상태 필터"
          size="sm"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "전체" },
            { value: "sent", label: "발송 완료" },
            { value: "scheduled", label: "예약됨" },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 lg:overflow-visible">
        <table className="w-full min-w-[760px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">캠페인 발송 이력 — 세그먼트, 발송일, 수신자, 오픈율, 클릭율, 상태별로 정렬 가능</caption>
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: `${col.widthPct}%` }} />
            ))}
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {COLUMNS.map((col) => (
                <th key={col.key} scope="col" aria-sort={ariaSortFor(col.key)} className="px-3 py-2 text-left">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex items-center gap-1 rounded text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                      col.key === "recipients" || col.key === "openRate" || col.key === "clickRate" ? "w-full justify-end" : ""
                    }`}
                  >
                    {col.label}
                    {sortIndicator(col.key)}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => {
              const segment = segmentById(row.segmentId);
              return (
                <tr key={row.id} className="transition-colors motion-reduce:transition-none hover:bg-zinc-50">
                  <th scope="row" className="truncate px-3 py-2.5 text-left font-medium text-zinc-800">
                    {row.name}
                  </th>
                  <td className="truncate px-3 py-2.5 text-zinc-600">{segment.shortName}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-zinc-600">{formatDate(row.date)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-800">
                    {formatNumber(row.recipients)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-800">
                    {row.openRate === null ? <span className="text-zinc-500">—</span> : formatPercent(row.openRate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-800">
                    {row.clickRate === null ? <span className="text-zinc-500">—</span> : formatPercent(row.clickRate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-zinc-500">
                  조건에 맞는 캠페인이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
