"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ShieldAlert } from "lucide-react";
import type { IncidentRecord } from "./data";
import { INCIDENT_STATUS_META, SEVERITY_LABEL, SEVERITY_TEXT } from "./status-meta";
import { Avatar, Badge } from "./ui";
import { cn, FOCUS_RING } from "./cn";

type SortKey = "title" | "status" | "startedRank" | "durationMin";
type SortDir = "asc" | "desc";

const COLUMNS: Array<{ key: SortKey; label: string; align?: "right" }> = [
  { key: "title", label: "Incident" },
  { key: "status", label: "Status" },
  { key: "startedRank", label: "Started" },
  { key: "durationMin", label: "Duration", align: "right" },
];

function sortValue(row: IncidentRecord, key: SortKey): string | number {
  switch (key) {
    case "title":
      return row.title;
    case "status":
      return row.status;
    case "startedRank":
      return row.startedRank;
    case "durationMin":
      return row.durationMin;
    default:
      return "";
  }
}

export function IncidentTable({ incidents, serviceName }: { incidents: IncidentRecord[]; serviceName: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("startedRank");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...incidents];
    copy.sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [incidents, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" ? "asc" : "desc");
    }
  }

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-8 text-center">
        <ShieldAlert aria-hidden="true" className="size-5 text-zinc-400" />
        <p className="text-sm text-zinc-200">No incidents recorded</p>
        <p className="text-xs text-zinc-400">This service has a clean incident history in the selected window.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">
          Incident log for {serviceName} — {incidents.length} records, sortable by column.
        </caption>
        <colgroup>
          <col className="w-[40%]" />
          <col className="w-[20%]" />
          <col className="w-[24%]" />
          <col className="w-[16%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            {COLUMNS.map((col) => {
              const active = sortKey === col.key;
              const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
              const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={cn(
                    "min-w-0 px-2.5 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400",
                    col.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      FOCUS_RING,
                      "flex w-full min-w-0 items-center gap-0.5 rounded hover:text-zinc-200",
                      col.align === "right" ? "flex-row-reverse justify-end" : "justify-start",
                      active && "text-zinc-200",
                    )}
                  >
                    <span className="truncate">{col.label}</span>
                    <Icon aria-hidden="true" className={cn("size-3 shrink-0", active ? "text-violet-300" : "text-zinc-400")} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((incident) => {
            const meta = INCIDENT_STATUS_META[incident.status];
            return (
              <tr key={incident.id} className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]">
                <th scope="row" className="px-2.5 py-2.5 text-left font-normal">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar src={incident.assigneeAvatar} name={incident.assignee} size={24} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-100">{incident.title}</p>
                      <p className="truncate text-[11px] text-zinc-400">
                        <span className={SEVERITY_TEXT[incident.severity]}>{SEVERITY_LABEL[incident.severity]}</span>
                        {" · "}
                        {incident.assignee}
                      </p>
                    </div>
                  </div>
                </th>
                <td className="px-2.5 py-2.5">
                  <Badge meta={meta} />
                </td>
                <td className="px-2 py-2.5 text-left text-[11px] whitespace-nowrap tabular-nums text-zinc-300" title={incident.startedAt}>
                  {incident.startedAt.replace(" UTC", "")}
                </td>
                <td className="px-2 py-2.5 text-right text-[11px] whitespace-nowrap tabular-nums text-zinc-300">
                  {incident.ongoing ? `${incident.durationMin}m so far` : `${incident.durationMin}m`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
