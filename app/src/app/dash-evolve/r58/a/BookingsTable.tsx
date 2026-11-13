"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Card, CardTitle, Badge, FOCUS } from "./ui";
import { BOOKINGS, RESOURCE_BY_ID, fmtUsd, type Booking } from "./data";

type SortKey = "day" | "client" | "revenue";

const DAY_ORDER: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };

function sortBookings(rows: Booking[], key: SortKey, dir: 1 | -1): Booking[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    let cmp = 0;
    if (key === "day") cmp = DAY_ORDER[a.day] - DAY_ORDER[b.day] || a.startHour - b.startHour;
    else if (key === "client") cmp = a.client.localeCompare(b.client);
    else cmp = a.revenue - b.revenue;
    return cmp * dir;
  });
  return copy;
}

function HeaderButton({
  k,
  onToggle,
  children,
}: {
  k: SortKey;
  onToggle: (k: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(k)}
      className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 hover:text-slate-200 ${FOCUS}`}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
    </button>
  );
}

export function BookingsTable({ highlightResourceId }: { highlightResourceId: string | null }) {
  const [sortKey, setSortKey] = useState<SortKey>("day");
  const [dir, setDir] = useState<1 | -1>(1);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setDir(1);
    }
  }

  const rows = sortBookings(BOOKINGS, sortKey, dir);

  function ariaSortFor(key: SortKey) {
    if (key !== sortKey) return "none" as const;
    return dir === 1 ? ("ascending" as const) : ("descending" as const);
  }

  return (
    <Card id="upcoming-bookings" className="min-w-0">
      <CardTitle>Upcoming bookings</CardTitle>
      <div className="mt-3 min-w-0 overflow-x-auto">
        <table className="w-full min-w-[520px] table-fixed border-collapse">
          <caption className="sr-only">This week&apos;s bookings, sortable by day, client, or revenue.</caption>
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" aria-sort={ariaSortFor("day")} className="px-2 py-2 text-left">
                <HeaderButton k="day" onToggle={toggleSort}>When</HeaderButton>
              </th>
              <th scope="col" aria-sort={ariaSortFor("client")} className="px-2 py-2 text-left">
                <HeaderButton k="client" onToggle={toggleSort}>Client</HeaderButton>
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Resource
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th scope="col" aria-sort={ariaSortFor("revenue")} className="px-2 py-2 text-right">
                <span className="flex justify-end">
                  <HeaderButton k="revenue" onToggle={toggleSort}>Revenue</HeaderButton>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const resource = RESOURCE_BY_ID.get(b.resourceId);
              const isHighlighted = highlightResourceId === b.resourceId;
              return (
                <tr key={b.id} className={`border-b border-white/5 last:border-0 ${isHighlighted ? "bg-indigo-500/10" : ""}`}>
                  <td className="px-2 py-2 text-sm font-normal tabular-nums text-slate-300 whitespace-nowrap">
                    {b.day} {b.startHour}:00
                  </td>
                  <td className="px-2 py-2 text-sm font-medium text-slate-100">
                    <span className="block truncate">{b.client}</span>
                  </td>
                  <td className="px-2 py-2 text-sm font-normal text-slate-300">
                    <span className="block truncate">{resource?.shortName ?? b.resourceId}</span>
                  </td>
                  <td className="px-2 py-2">
                    <Badge tone={b.status}>{b.status}</Badge>
                  </td>
                  <td className="px-2 py-2 text-right text-sm font-normal tabular-nums text-slate-300">
                    {fmtUsd(b.revenue)}
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
