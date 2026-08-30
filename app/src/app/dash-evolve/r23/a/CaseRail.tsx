"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, ArrowUpDown, Clock, TriangleAlert } from "lucide-react";
import {
  CASES,
  STATUS_META,
  formatKrw,
  formatSla,
  isOpen,
  isAtRisk,
  type CaseStatus,
  type DisputeCase,
} from "./data";
import { Badge, SegmentedControl, cx, FOCUS_LIGHT } from "./ui";

type FilterKey = "all" | "open" | "at_risk" | "escalated" | "resolved";
type SortKey = "item" | "status" | "amount";
type SortDir = "asc" | "desc";

const STATUS_RANK: Record<CaseStatus, number> = {
  escalated: 0,
  evidence_review: 1,
  awaiting_seller: 2,
  new: 3,
  resolved_buyer: 4,
  resolved_seller: 4,
};

function filterCases(key: FilterKey): DisputeCase[] {
  switch (key) {
    case "open":
      return CASES.filter(isOpen);
    case "at_risk":
      return CASES.filter(isAtRisk);
    case "escalated":
      return CASES.filter((c) => c.status === "escalated");
    case "resolved":
      return CASES.filter((c) => !isOpen(c));
    default:
      return CASES;
  }
}

const FILTERS: { value: FilterKey; label: string }[] = [
  { value: "all", label: `All ${CASES.length}` },
  { value: "open", label: `Open ${filterCases("open").length}` },
  { value: "at_risk", label: `At risk ${filterCases("at_risk").length}` },
  { value: "escalated", label: `Escalated ${filterCases("escalated").length}` },
  { value: "resolved", label: `Resolved ${filterCases("resolved").length}` },
];

export function CaseRail({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);

  const rows = useMemo(() => {
    const base = filterCases(filter);
    if (!sort) return base;
    const sorted = [...base].sort((a, b) => {
      let cmp = 0;
      if (sort.key === "item") cmp = a.itemTitle.localeCompare(b.itemTitle);
      if (sort.key === "status") cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      if (sort.key === "amount") cmp = a.amountKrw - b.amountKrw;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filter, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (!sort || sort.key !== key) return "none";
    return sort.dir === "asc" ? "ascending" : "descending";
  }

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-x-auto border-b border-zinc-200 p-3">
        <SegmentedControl ariaLabel="Filter dispute cases" size="sm" value={filter} onChange={setFilter} options={FILTERS} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed border-collapse">
          <caption className="relative sr-only">
            Dispute cases queue, {rows.length} shown. Select a row to load its full case detail.
          </caption>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-zinc-200 text-left">
              <SortHeader label="Case" width="w-[34%]" sort={ariaSortFor("item")} onClick={() => toggleSort("item")} />
              <SortHeader label="Status" width="w-[32%]" sort={ariaSortFor("status")} onClick={() => toggleSort("status")} />
              <SortHeader label="Amount" width="w-[34%]" align="right" sort={ariaSortFor("amount")} onClick={() => toggleSort("amount")} />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <CaseRow key={c.id} c={c} selected={c.id === selectedId} onSelect={() => onSelect(c.id)} />
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-[13px] text-zinc-500">No cases match this filter.</p>}
      </div>
    </div>
  );
}

function SortHeader({
  label,
  width,
  sort,
  onClick,
  align = "left",
}: {
  label: string;
  width: string;
  sort: "ascending" | "descending" | "none";
  onClick: () => void;
  align?: "left" | "right";
}) {
  const Icon = sort === "none" ? ArrowUpDown : sort === "ascending" ? ArrowUp : ArrowDown;
  return (
    <th scope="col" aria-sort={sort} className={cx("px-3 py-2", width, align === "right" && "text-right")}>
      <button
        type="button"
        onClick={onClick}
        className={cx(
          "inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-800",
          FOCUS_LIGHT,
        )}
      >
        {label}
        <Icon className={cx("h-3 w-3", sort === "none" && "opacity-40")} />
      </button>
    </th>
  );
}

function CaseRow({ c, selected, onSelect }: { c: DisputeCase; selected: boolean; onSelect: () => void }) {
  const meta = STATUS_META[c.status];
  const overdue = c.slaHoursRemaining !== null && c.slaHoursRemaining < 0;
  const urgent = c.slaHoursRemaining !== null && c.slaHoursRemaining >= 0 && c.slaHoursRemaining <= 8;

  return (
    <tr
      tabIndex={0}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cx(
        "cursor-pointer border-b border-zinc-100 align-top transition-colors motion-reduce:transition-none",
        selected ? "bg-amber-50" : "bg-white hover:bg-zinc-50",
        FOCUS_LIGHT,
      )}
    >
      <td className={cx("px-3 py-3", selected && "border-l-2 border-l-amber-700")}>
        <p className="text-[11px] font-medium tabular-nums text-zinc-500">
          {c.id}
          {selected && <span className="sr-only"> (selected)</span>}
        </p>
        <p className="mt-1 line-clamp-2 text-[13px] font-medium text-zinc-900">{c.itemTitle}</p>
        {c.slaHoursRemaining !== null && (
          <p className={cx("mt-1 inline-flex items-center gap-1 text-[11px] tabular-nums whitespace-nowrap", overdue ? "text-red-700" : urgent ? "text-amber-700" : "text-zinc-500")}>
            {overdue ? <TriangleAlert className="h-3 w-3 shrink-0" /> : <Clock className="h-3 w-3 shrink-0" />}
            {formatSla(c.slaHoursRemaining)}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="flex -space-x-1.5">
            <span className="relative h-4 w-4 overflow-hidden rounded-full border-2 border-white box-content">
              <Image src={`https://images.unsplash.com/photo-${c.buyer.avatarId}?w=32&h=32&fit=crop&crop=faces`} alt="" fill sizes="16px" className="object-cover" />
            </span>
            <span className="relative h-4 w-4 overflow-hidden rounded-full border-2 border-white box-content">
              <Image src={`https://images.unsplash.com/photo-${c.seller.avatarId}?w=32&h=32&fit=crop&crop=faces`} alt="" fill sizes="16px" className="object-cover" />
            </span>
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] text-zinc-500">{c.claimType}</span>
        </div>
      </td>
      <td className="px-3 py-3">
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </td>
      <td className="px-3 py-3 text-right">
        <span className="text-[13px] font-medium tabular-nums whitespace-nowrap text-zinc-900">{formatKrw(c.amountKrw)}</span>
      </td>
    </tr>
  );
}
