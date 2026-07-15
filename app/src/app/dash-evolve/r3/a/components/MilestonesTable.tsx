"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, CircleDot, TriangleAlert } from "lucide-react";
import { MILESTONE_STATUS_META, Milestone, WEEKS } from "../lib/data";
import { dayOffsetToLabel } from "../lib/format";
import { Badge, Card } from "./ui";

type SortKey = "day" | "status";
type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<Milestone["status"], number> = {
  "at-risk": 0,
  upcoming: 1,
  done: 2,
};

const STATUS_ICON = {
  done: CheckCircle2,
  "at-risk": TriangleAlert,
  upcoming: CircleDot,
} as const;

export default function MilestonesTable({ milestones }: { milestones: Milestone[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("day");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    const copy = [...milestones];
    copy.sort((a, b) => {
      const cmp =
        sortKey === "day" ? a.day - b.day : STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [milestones, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-zinc-900">Milestones</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] lg:min-w-0 lg:table-fixed border-collapse text-left">
          <caption className="sr-only">
            Key project milestones for the Q3 platform roadmap, sortable by date or status
          </caption>
          <colgroup>
            <col className="lg:w-[52%]" />
            <col className="lg:w-[24%]" />
            <col className="lg:w-[24%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="py-2 pr-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Milestone
              </th>
              <th scope="col" aria-sort={ariaSortFor("day")} className="py-2 pr-2">
                <SortButton label="Date" active={sortKey === "day"} dir={sortDir} onClick={() => toggleSort("day")} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("status")} className="py-2 pr-2">
                <SortButton label="Status" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ms) => {
              const meta = MILESTONE_STATUS_META[ms.status];
              const Icon = STATUS_ICON[ms.status];
              return (
                <tr key={ms.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <th scope="row" className="py-2 pr-2 text-sm font-normal text-zinc-800">
                    {ms.label}
                  </th>
                  <td className="whitespace-nowrap py-2 pr-2 text-xs tabular-nums text-zinc-600">
                    {dayOffsetToLabel(ms.day, WEEKS)}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2">
                    <Badge className={meta.badgeClass}>
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {meta.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded text-[11px] font-semibold uppercase tracking-wide text-zinc-500 outline-none transition-colors motion-reduce:transition-none hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {label}
      <Icon className={`h-3 w-3 ${active ? "text-indigo-600" : "text-zinc-400"}`} aria-hidden="true" />
    </button>
  );
}
