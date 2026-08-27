"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { ESCALATED_TICKETS, RESOLVED_TICKETS, formatHours } from "./data";
import { BORDER, PRIORITY_BADGE, PRIORITY_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, Tabs } from "./ui";

type SortKey = "resolvedHoursAgo" | "durationHours" | "csat";
type TabId = "resolved" | "escalated";

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
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700",
          active ? "text-zinc-900" : TEXT_AUX,
        )}
      >
        {label}
        <Icon size={11} aria-hidden="true" />
      </button>
    </th>
  );
}

export default function TicketTable() {
  const [tab, setTab] = useState<TabId>("resolved");
  const [sortKey, setSortKey] = useState<SortKey>("resolvedHoursAgo");
  const [asc, setAsc] = useState(true);

  const rows = tab === "resolved" ? RESOLVED_TICKETS : ESCALATED_TICKETS;

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  return (
    <div>
      <Tabs<TabId>
        ariaLabel="Ticket history view"
        value={tab}
        onChange={setTab}
        options={[
          { id: "resolved", label: `Recently resolved (${RESOLVED_TICKETS.length})` },
          { id: "escalated", label: `Escalated (${ESCALATED_TICKETS.length})` },
        ]}
      />

      <div className="mt-3 w-full">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">{tab === "resolved" ? "Recently resolved tickets" : "Escalated tickets"}</caption>
          <colgroup>
            <col className="w-[38%]" />
            <col className="hidden w-[18%] sm:table-column" />
            <col className="w-[14%]" />
            <col className="w-[15%]" />
            <col className="hidden w-[15%] sm:table-column" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Ticket
              </th>
              <th scope="col" className={cx("hidden py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] sm:table-cell", TEXT_AUX)}>
                Customer
              </th>
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Priority
              </th>
              <SortHeader label="Resolved" sortKeyId="resolvedHoursAgo" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <SortHeader label="Duration" sortKeyId="durationHours" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50">
                <td className="py-2.5 pr-2 align-middle">
                  <p className={cx("truncate text-[13px] font-medium", TEXT_PRIMARY)}>{t.title}</p>
                  <p className={cx("truncate font-mono text-[11px] font-normal", TEXT_AUX)}>{t.key}</p>
                </td>
                <td className={cx("hidden truncate py-2.5 pr-2 align-middle text-[13px] font-normal sm:table-cell", TEXT_MUTED)}>{t.customer}</td>
                <td className="py-2.5 pr-2 align-middle">
                  <Badge className={PRIORITY_BADGE[t.priority]}>{PRIORITY_LABEL[t.priority]}</Badge>
                </td>
                <td className={cx("whitespace-nowrap py-2.5 pr-2 align-middle text-[13px] font-normal tabular-nums", TEXT_MUTED)}>{`${t.resolvedHoursAgo}h ago`}</td>
                <td className={cx("hidden whitespace-nowrap py-2.5 align-middle text-[13px] font-normal tabular-nums sm:table-cell", TEXT_MUTED)}>{formatHours(t.durationHours ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
