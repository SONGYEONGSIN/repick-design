"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import type { Deal, Priority, StageId } from "../lib/data";
import { DEALS, OWNERS, STAGES, ownerById } from "../lib/data";
import { formatCurrency, formatDate } from "../lib/format";
import { Card, CompanyMark, FilterChip, PriorityBadge, ProbabilityBar, SectionLabel } from "./ui";

type SortKey = "company" | "value" | "probability" | "closeDate";
type SortDir = "asc" | "desc";

interface ColumnDef {
  key: SortKey | "owner" | "priority" | "detail";
  label: string;
  widthPct: number;
  align: "left" | "right";
  sortKey?: SortKey;
}

const COLUMNS: ColumnDef[] = [
  { key: "company", label: "거래처 / 담당자", widthPct: 27, align: "left", sortKey: "company" },
  { key: "owner", label: "오너", widthPct: 14, align: "left" },
  { key: "value", label: "금액", widthPct: 13, align: "right", sortKey: "value" },
  { key: "probability", label: "성사 확률", widthPct: 17, align: "left", sortKey: "probability" },
  { key: "closeDate", label: "마감 예정일", widthPct: 12, align: "left", sortKey: "closeDate" },
  { key: "priority", label: "우선순위", widthPct: 10, align: "left" },
  { key: "detail", label: "상세", widthPct: 7, align: "right" },
];

function sortDeals(rows: Deal[], sortKey: SortKey | null, sortDir: SortDir): Deal[] {
  if (!sortKey) return rows;
  const sorted = [...rows].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "company") cmp = a.company.localeCompare(b.company, "ko");
    else if (sortKey === "value") cmp = a.value - b.value;
    else if (sortKey === "probability") cmp = a.probability - b.probability;
    else if (sortKey === "closeDate") cmp = a.closeDate.localeCompare(b.closeDate);
    return sortDir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export default function DealsGrid({
  onOpenDeal,
  selectedDealId,
}: {
  onOpenDeal: (id: string) => void;
  selectedDealId: string | null;
}) {
  const [collapsedStages, setCollapsedStages] = useState<Set<StageId>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [query, setQuery] = useState("");
  const [activeStages, setActiveStages] = useState<StageId[]>([]);
  const [activeOwners, setActiveOwners] = useState<string[]>([]);

  const toggleStage = (id: StageId) => {
    setCollapsedStages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStageFilter = (id: StageId) => {
    setActiveStages((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleOwnerFilter = (id: string) => {
    setActiveOwners((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]));
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
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

  const groups = useMemo(() => {
    return STAGES.map((stage) => {
      const stageDeals = DEALS.filter((d) => d.stage === stage.id);
      const filtered = stageDeals.filter((d) => {
        const matchesQuery =
          trimmedQuery === "" ||
          d.company.toLowerCase().includes(trimmedQuery) ||
          d.contact.toLowerCase().includes(trimmedQuery);
        const matchesOwner = activeOwners.length === 0 || activeOwners.includes(d.ownerId);
        return matchesQuery && matchesOwner;
      });
      const rows = sortDeals(filtered, sortKey, sortDir);
      const subtotal = rows.reduce((sum, d) => sum + d.value, 0);
      const visible = activeStages.length === 0 || activeStages.includes(stage.id);
      return { stage, rows, subtotal, totalInStage: stageDeals.length, visible };
    });
  }, [trimmedQuery, activeOwners, activeStages, sortKey, sortDir]);

  const visibleGroups = groups.filter((g) => g.visible);
  const totalVisibleRows = visibleGroups.reduce((sum, g) => sum + g.rows.length, 0);

  return (
    <Card as="section" className="flex flex-col">
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">딜 파이프라인</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              상태별로 그룹화된 전체 딜 목록입니다. 그룹 헤더를 눌러 접고 펼칠 수 있습니다.
            </p>
          </div>
          <label className="relative w-full max-w-[260px] sm:w-64">
            <span className="sr-only">거래처 또는 담당자 검색</span>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="거래처, 담당자 검색"
              className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <SectionLabel className="mr-1 shrink-0">상태</SectionLabel>
            <FilterChip active={activeStages.length === 0} onClick={() => setActiveStages([])}>
              전체
            </FilterChip>
            {STAGES.map((stage) => (
              <FilterChip
                key={stage.id}
                active={activeStages.includes(stage.id)}
                onClick={() => toggleStageFilter(stage.id)}
              >
                {stage.label}
                <span className="tabular-nums opacity-80">
                  {groups.find((g) => g.stage.id === stage.id)?.totalInStage ?? 0}
                </span>
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <SectionLabel className="mr-1 shrink-0">담당자</SectionLabel>
            <FilterChip active={activeOwners.length === 0} onClick={() => setActiveOwners([])}>
              전체
            </FilterChip>
            {OWNERS.map((owner) => (
              <FilterChip key={owner.id} active={activeOwners.includes(owner.id)} onClick={() => toggleOwnerFilter(owner.id)}>
                <Image src={owner.photo} alt="" width={16} height={16} className="size-4 rounded-full object-cover" />
                {owner.name}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-zinc-200 lg:overflow-visible">
        <table className="w-full min-w-[900px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">
            딜 파이프라인 테이블 — 상태별로 그룹화되어 있으며 거래처, 금액, 성사 확률, 마감 예정일 기준으로 정렬할 수 있습니다.
            현재 {totalVisibleRows}건이 표시되고 있습니다.
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
                  className="px-3 py-2 text-left"
                >
                  {col.key === "detail" ? (
                    <span className="sr-only">{col.label}</span>
                  ) : col.sortKey ? (
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

          {visibleGroups.map(({ stage, rows, subtotal }) => {
            const collapsed = collapsedStages.has(stage.id);
            const bodyId = `deals-group-${stage.id}-rows`;
            return (
              <Fragment key={stage.id}>
                <tbody>
                  <tr className="border-b border-t border-zinc-200 bg-zinc-50/80">
                    <td colSpan={COLUMNS.length} className="p-0">
                      <button
                        type="button"
                        aria-expanded={!collapsed}
                        aria-controls={bodyId}
                        onClick={() => toggleStage(stage.id)}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        <ChevronRight
                          className={`size-4 shrink-0 text-zinc-500 transition-transform motion-reduce:transition-none ${
                            collapsed ? "" : "rotate-90"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-semibold text-zinc-900">{stage.label}</span>
                        <span className="text-xs tabular-nums text-zinc-500">{rows.length}건</span>
                        <span className="ml-auto whitespace-nowrap text-xs font-medium tabular-nums text-zinc-700">
                          {formatCurrency(subtotal)}
                        </span>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tbody id={bodyId} hidden={collapsed} className="divide-y divide-zinc-100">
                {rows.map((deal) => {
                  const owner = ownerById(deal.ownerId);
                  const selected = deal.id === selectedDealId;
                  return (
                    <tr
                      key={deal.id}
                      onClick={() => onOpenDeal(deal.id)}
                      className={`cursor-pointer transition-colors motion-reduce:transition-none hover:bg-zinc-50 ${
                        selected ? "bg-indigo-50/70" : ""
                      }`}
                    >
                      <th scope="row" className="px-3 py-2.5 text-left font-medium text-zinc-900">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <CompanyMark name={deal.company} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-zinc-900">{deal.company}</p>
                            <p className="truncate text-xs font-normal text-zinc-500">{deal.contact}</p>
                          </div>
                        </div>
                      </th>
                      <td className="px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <Image src={owner.photo} alt="" width={22} height={22} className="size-[22px] shrink-0 rounded-full object-cover ring-1 ring-zinc-200" />
                          <span className="truncate text-sm text-zinc-700">{owner.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium tabular-nums text-zinc-900">
                        {formatCurrency(deal.value)}
                      </td>
                      <td className="px-3 py-2.5">
                        <ProbabilityBar value={deal.probability} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-zinc-600">{formatDate(deal.closeDate)}</td>
                      <td className="px-3 py-2.5">
                        <PriorityBadge priority={deal.priority as Priority} />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDeal(deal.id);
                          }}
                          aria-label={`${deal.company} 딜 상세 보기`}
                          className="ml-auto flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
                        >
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-3 py-6 text-center text-sm text-zinc-500">
                      조건에 맞는 딜이 없습니다.
                    </td>
                  </tr>
                ) : null}
                </tbody>
              </Fragment>
            );
          })}
        </table>
      </div>
    </Card>
  );
}
