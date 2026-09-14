"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { INSPECTORS, STATUS_BADGE, STATUS_ICON, STATUS_LABEL, isoDate, shortDate, type InspectionRecord, type InspectionStatus } from "./data";
import { BORDER, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, Segmented } from "./ui";

type SortKey = "date" | "severity" | "duration";
type StatusFilter = InspectionStatus | "all";

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pass", label: "Pass" },
  { id: "watch", label: "Watch" },
  { id: "flagged", label: "Flagged" },
];

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
  className,
}: {
  label: string;
  sortKeyId: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onToggle: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={cx("py-2 text-left align-middle", className)}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={cx(
          "inline-flex items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-[0.06em]",
          TRANSITION,
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700",
          active ? "text-zinc-900" : TEXT_AUX,
        )}
      >
        {label}
        <Icon size={11} aria-hidden="true" />
      </button>
    </th>
  );
}

export default function InspectionLedger({ records, supplierName, periodLabel }: { records: InspectionRecord[]; supplierName: string; periodLabel: string }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const base = statusFilter === "all" ? records : records.filter((r) => r.status === statusFilter);
    const copy = [...base];
    copy.sort((a, b) => {
      const av = sortKey === "date" ? a.daysAgo : sortKey === "severity" ? a.severity : a.duration;
      const bv = sortKey === "date" ? b.daysAgo : sortKey === "severity" ? b.severity : b.duration;
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [records, statusFilter, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(key === "date");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx("text-[11px] font-normal", TEXT_MUTED)}>{`${rows.length} of ${records.length} inspections · ${supplierName} · ${periodLabel}`}</p>
        <Segmented<StatusFilter> ariaLabel="Filter inspections by status" value={statusFilter} onChange={setStatusFilter} options={STATUS_TABS} />
      </div>

      {rows.length === 0 ? (
        <p className={cx("mt-3 rounded-lg border px-3 py-4 text-center text-sm font-normal", BORDER, TEXT_AUX)}>No inspections match this filter.</p>
      ) : (
        <div className="relative mt-3 max-h-[420px] overflow-y-auto overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
            <caption className="sr-only">{`Individual inspection records for ${supplierName}, ${periodLabel}`}</caption>
            <colgroup>
              <col className="w-[14%]" />
              <col className="w-[32%]" />
              <col className="w-[14%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-white">
              <tr className={cx("border-b", BORDER)}>
                <SortHeader label="Date" sortKeyId="date" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
                <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                  Inspector
                </th>
                <SortHeader label="Severity" sortKeyId="severity" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
                <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                  Status
                </th>
                <SortHeader label="Duration" sortKeyId="duration" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.map((r) => {
                const inspector = INSPECTORS[r.inspectorIdx];
                const StatusIcon = STATUS_ICON[r.status];
                return (
                  <tr key={r.id} className="hover:bg-zinc-50">
                    <td className="whitespace-nowrap py-2.5 pr-2 align-middle">
                      <time dateTime={isoDate(r.daysAgo)} className={cx("text-[13px] font-normal", TEXT_MUTED)}>
                        {shortDate(r.daysAgo)}
                      </time>
                    </td>
                    <td className="py-2.5 pr-2 align-middle">
                      <span className="flex min-w-0 items-center gap-2">
                        <Image
                          src={`https://images.unsplash.com/photo-${inspector.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                          alt=""
                          width={20}
                          height={20}
                          className="h-5 w-5 shrink-0 rounded-full bg-zinc-100 object-cover"
                        />
                        <span className={cx("truncate text-[13px] font-medium", TEXT_PRIMARY)}>{inspector.name}</span>
                      </span>
                    </td>
                    <td className={cx("whitespace-nowrap py-2.5 pr-2 align-middle text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>{r.severity.toFixed(1)}</td>
                    <td className="whitespace-nowrap py-2.5 pr-2 align-middle">
                      <Badge Icon={StatusIcon} className={STATUS_BADGE[r.status]}>
                        {STATUS_LABEL[r.status]}
                      </Badge>
                    </td>
                    <td className={cx("whitespace-nowrap py-2.5 align-middle text-[13px] font-normal", NUM, TEXT_MUTED)}>{`${r.duration} min`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
