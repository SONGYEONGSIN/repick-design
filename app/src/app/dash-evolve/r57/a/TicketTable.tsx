"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, ArrowUpDown, AlertOctagon, ArrowUpCircle, Minus, ArrowDownCircle, CircleDot, Clock, AlertTriangle } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { OPEN_TICKETS, ASSIGNEES, formatCount, formatHours, type OpenTicket, type Priority, type OpenStatus } from "./data";

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400";

const PRIORITY_META: Record<Priority, { icon: typeof AlertOctagon; tone: "red" | "amber" | "sky" | "slate" }> = {
  Critical: { icon: AlertOctagon, tone: "red" },
  High: { icon: ArrowUpCircle, tone: "amber" },
  Medium: { icon: Minus, tone: "sky" },
  Low: { icon: ArrowDownCircle, tone: "slate" },
};

const STATUS_META: Record<OpenStatus, { icon: typeof CircleDot; tone: "sky" | "amber" | "red" }> = {
  Open: { icon: CircleDot, tone: "sky" },
  "In progress": { icon: Clock, tone: "amber" },
  Escalated: { icon: AlertTriangle, tone: "red" },
};

type SortColumn = "age" | "priority";
type SortDirection = "ascending" | "descending";

const PRIORITY_RANK: Record<Priority, number> = { Low: 0, Medium: 1, High: 2, Critical: 3 };

export function TicketTable() {
  const [sort, setSort] = useState<{ column: SortColumn; direction: SortDirection }>({ column: "age", direction: "descending" });

  function toggleSort(column: SortColumn) {
    setSort((current) => {
      if (current.column !== column) return { column, direction: "descending" };
      return { column, direction: current.direction === "descending" ? "ascending" : "descending" };
    });
  }

  const sorted = [...OPEN_TICKETS].sort((a, b) => {
    const dir = sort.direction === "ascending" ? 1 : -1;
    if (sort.column === "age") return (a.ageHours - b.ageHours) * dir;
    return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * dir;
  });

  function sortIcon(column: SortColumn) {
    if (sort.column !== column) return ArrowUpDown;
    return sort.direction === "ascending" ? ArrowUp : ArrowDown;
  }

  function headerButton(column: SortColumn, label: string) {
    const Icon = sortIcon(column);
    const isActive = sort.column === column;
    return (
      <button
        type="button"
        onClick={() => toggleSort(column)}
        className={`flex min-h-[28px] w-full items-center justify-end gap-1 rounded px-1 text-right ${FOCUS} ${isActive ? "text-slate-100" : "text-slate-400 hover:text-slate-200"}`}
      >
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
        <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      </button>
    );
  }

  return (
    <Card padded={false} className="min-w-0" id="open-ticket-queue">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 p-5 pb-4 sm:p-6 sm:pb-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-100">Open ticket queue</h2>
          <p className="mt-1 text-xs font-normal text-slate-400">{formatCount(OPEN_TICKETS.length)} tickets currently open across every team.</p>
        </div>
      </div>

      <div className="min-w-0 overflow-x-auto">
        <table className="w-full table-fixed border-collapse max-lg:min-w-[720px]">
          <caption className="sr-only">Open ticket queue, sortable by age and priority</caption>
          <colgroup>
            <col style={{ width: "32%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "9%" }} />
          </colgroup>
          <thead>
            <tr className="border-y border-white/10 text-left">
              <th scope="col" className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-400 sm:px-6">
                Ticket
              </th>
              <th scope="col" className="px-2 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Team
              </th>
              <th scope="col" aria-sort={sort.column === "priority" ? sort.direction : "none"} className="px-2 py-2.5">
                {headerButton("priority", "Priority")}
              </th>
              <th scope="col" className="px-2 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th scope="col" className="px-2 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Assignee
              </th>
              <th scope="col" aria-sort={sort.column === "age" ? sort.direction : "none"} className="px-5 py-2.5 sm:px-6">
                {headerButton("age", "Age")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ticket: OpenTicket) => {
              const priority = PRIORITY_META[ticket.priority];
              const status = STATUS_META[ticket.status];
              const assignee = ASSIGNEES[ticket.assignee];
              return (
                <tr key={ticket.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="min-w-0 px-5 py-3 sm:px-6">
                    <p className="text-sm font-medium text-slate-100">{ticket.id}</p>
                    <p className="truncate text-xs font-normal text-slate-400">{ticket.subject}</p>
                  </td>
                  <td className="min-w-0 px-2 py-3 text-sm font-normal text-slate-300">
                    <span className="truncate">{ticket.team}</span>
                  </td>
                  <td className="min-w-0 px-2 py-3">
                    <Badge tone={priority.tone} icon={priority.icon}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="min-w-0 px-2 py-3">
                    <Badge tone={status.tone} icon={status.icon}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="min-w-0 px-2 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <Image src={assignee.photo} alt="" width={24} height={24} className="h-6 w-6 flex-shrink-0 rounded-full object-cover" />
                      <span className="truncate text-sm font-normal text-slate-300">{assignee.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right text-sm font-normal tabular-nums text-slate-300 sm:px-6">{formatHours(ticket.ageHours)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
