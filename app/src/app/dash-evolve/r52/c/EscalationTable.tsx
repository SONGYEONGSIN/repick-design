"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TICKETS, type Ticket, type Priority } from "./data";
import { Badge, SegmentedControl } from "./ui";

type SortKey = "sla" | "priority";
type SortDir = "asc" | "desc";
type StageFilter = "all" | "triage" | "engineering" | "waiting" | "escalated";

const PRIORITY_RANK: Record<Priority, number> = { p1: 0, p2: 1, p3: 2 };
const PRIORITY_TONE: Record<Priority, "rose" | "amber" | "neutral"> = { p1: "rose", p2: "amber", p3: "neutral" };
const STAGE_LABEL: Record<string, string> = {
  triage: "Triage",
  engineering: "Engineering",
  waiting: "Waiting",
  escalated: "Escalated",
};

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-zinc-400" aria-hidden="true" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-indigo-700" aria-hidden="true" />
  ) : (
    <ArrowDown className="h-3 w-3 text-indigo-700" aria-hidden="true" />
  );
}

export function EscalationTable({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("sla");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const base = stageFilter === "all" ? TICKETS : TICKETS.filter((t) => t.stage === stageFilter);
    const sorted = [...base].sort((a, b) => {
      const cmp = sortKey === "sla" ? a.slaHours - b.slaHours : PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [stageFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">All tickets</h2>
        <SegmentedControl
          label="Filter by stage"
          value={stageFilter}
          onChange={setStageFilter}
          options={[
            { value: "all", label: "All" },
            { value: "triage", label: "Triage" },
            { value: "engineering", label: "Eng." },
            { value: "waiting", label: "Waiting" },
            { value: "escalated", label: "Escalated" },
          ]}
        />
      </div>

      <div className="max-h-80 overflow-y-auto overflow-x-hidden rounded-lg border border-zinc-200">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            All tickets, filtered to {stageFilter} stage, sorted by {sortKey} {sortDir === "asc" ? "ascending" : "descending"}
          </caption>
          <colgroup>
            <col style={{ width: "36%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>
          <thead className="sticky top-0 bg-zinc-50 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
            <tr>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Ticket
              </th>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Customer
              </th>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Stage
              </th>
              <th scope="col" aria-sort={sortKey === "priority" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="overflow-hidden px-3 py-2 text-left font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("priority")}
                  className="flex h-6 items-center gap-1 overflow-hidden rounded whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Priority
                  <SortIcon active={sortKey === "priority"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" aria-sort={sortKey === "sla" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="overflow-hidden px-3 py-2 text-right font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("sla")}
                  className="ml-auto flex h-6 items-center gap-1 overflow-hidden rounded whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  SLA
                  <SortIcon active={sortKey === "sla"} dir={sortDir} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-zinc-500">
                  No tickets match this filter.
                </td>
              </tr>
            ) : (
              rows.map((t: Ticket) => {
                const selected = t.id === selectedId;
                const breached = t.slaHours < 0;
                return (
                  <tr key={t.id} className={selected ? "bg-indigo-50" : "hover:bg-zinc-50"}>
                    <td className="px-0 py-0 font-medium text-zinc-900">
                      <button
                        type="button"
                        onClick={() => onSelect(t.id)}
                        aria-pressed={selected}
                        className="block w-full truncate px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {t.subject}
                      </button>
                    </td>
                    <td className="truncate px-3 py-2.5 text-zinc-600">{t.customer}</td>
                    <td className="truncate px-3 py-2.5 text-zinc-600">{STAGE_LABEL[t.stage]}</td>
                    <td className="overflow-hidden px-2 py-2.5">
                      <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority.toUpperCase()}</Badge>
                    </td>
                    <td className={`overflow-hidden whitespace-nowrap px-3 py-2.5 text-right tabular-nums ${breached ? "font-medium text-rose-700" : "text-zinc-600"}`}>
                      {breached ? `-${Math.abs(t.slaHours)}h` : `${t.slaHours}h`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
