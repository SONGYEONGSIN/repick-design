"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, CircleDot, PauseCircle, Inbox } from "lucide-react";
import { cx, focusRing, Avatar } from "./ui";
import type { Ticket, TicketSeverity, TicketStatus } from "./data";

/**
 * Support tickets inside the vantage window.
 *
 * Two renderings of the same sorted array: a real semantic table once the detail pane is wide
 * enough to give every column its intrinsic minimum, and a stacked card list below that. The
 * swap is a container query, not a viewport one — this pane's width depends on the rail, not the
 * window. A `table-fixed` grid that merely avoids a scrollbar would still smear nowrap headers
 * into their neighbours at 390px, which no scrollWidth sweep can see.
 */

type SortKey = "date" | "severity" | "status";

const SEVERITY_RANK: Record<TicketSeverity, number> = { S1: 0, S2: 1, S3: 2 };
const STATUS_RANK: Record<TicketStatus, number> = { 보류: 0, 진행: 1, 해결: 2 };

const SEVERITY_CHIP: Record<TicketSeverity, string> = {
  S1: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  S2: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  S3: "border-white/15 bg-white/[0.05] text-zinc-300",
};

const STATUS_META: Record<TicketStatus, { icon: typeof CheckCircle2; className: string }> = {
  해결: { icon: CheckCircle2, className: "text-zinc-300" },
  진행: { icon: CircleDot, className: "text-amber-200" },
  보류: { icon: PauseCircle, className: "text-rose-300" },
};

/**
 * Two label sets on purpose. Column headers are 11px uppercase with wide tracking, so a four-glyph
 * Korean header plus a sort arrow needs ~80px of intrinsic width — more than a 13% column has at
 * the breakpoint where the table first appears. The chips have the room for the longer wording.
 */
const SORT_LABEL: Record<SortKey, string> = {
  date: "접수",
  severity: "등급",
  status: "상태",
};

const SORT_LABEL_LONG: Record<SortKey, string> = {
  date: "접수일",
  severity: "심각도",
  status: "상태",
};

/**
 * Declared at module scope, not inside the table component: a component defined during render is
 * a fresh type on every keystroke, so React unmounts the header button and the keyboard focus that
 * just activated it disappears.
 */
function SortHead({
  column,
  width,
  sortKey,
  descending,
  onToggle,
}: {
  column: SortKey;
  width: string;
  sortKey: SortKey;
  descending: boolean;
  onToggle: (key: SortKey) => void;
}) {
  const activeSort = column === sortKey;
  return (
    <th
      scope="col"
      aria-sort={activeSort ? (descending ? "descending" : "ascending") : "none"}
      style={{ width }}
      className="px-3 py-2"
    >
      <button
        type="button"
        onClick={() => onToggle(column)}
        className={cx(
          "inline-flex w-full items-center gap-1 rounded py-1 text-left text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-150 motion-reduce:transition-none",
          activeSort ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200",
          focusRing,
        )}
      >
        {SORT_LABEL[column]}
        {activeSort ? (
          descending ? (
            <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />
          ) : (
            <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" />
          )
        ) : null}
      </button>
    </th>
  );
}

function SeverityChip({ severity }: { severity: TicketSeverity }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
        SEVERITY_CHIP[severity],
      )}
    >
      {severity}
    </span>
  );
}

function StatusTag({ status }: { status: TicketStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-xs", meta.className)}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {status}
    </span>
  );
}

export default function TicketLedger({
  tickets,
  labels,
  windowText,
}: {
  tickets: Ticket[];
  labels: Array<{ long: string; short: string }>;
  windowText: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [descending, setDescending] = useState(true);

  const sorted = tickets
    .map((ticket, index) => ({ ticket, index }))
    .sort((a, b) => {
      let delta = 0;
      if (sortKey === "date") {
        delta =
          a.ticket.monthIndex * 100 + a.ticket.day - (b.ticket.monthIndex * 100 + b.ticket.day);
      } else if (sortKey === "severity") {
        delta = SEVERITY_RANK[a.ticket.severity] - SEVERITY_RANK[b.ticket.severity];
      } else {
        delta = STATUS_RANK[a.ticket.status] - STATUS_RANK[b.ticket.status];
      }
      if (delta === 0) delta = a.index - b.index;
      return descending ? -delta : delta;
    })
    .map((entry) => entry.ticket);

  function toggle(key: SortKey) {
    if (key === sortKey) {
      setDescending((value) => !value);
    } else {
      setSortKey(key);
      setDescending(true);
    }
  }

  const dateOf = (ticket: Ticket) => `${labels[ticket.monthIndex].short} ${ticket.day}일`;

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-10 text-center">
        <Inbox className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        <p className="text-sm text-zinc-300">{windowText}에 접수된 지원 티켓이 없습니다.</p>
        <p className="text-xs text-zinc-400">시점을 옮기면 해당 구간의 티켓이 다시 채워집니다.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Sort control for the card rendering, where there are no column headers to click. */}
      <div className="mb-3 flex flex-wrap items-center gap-2 @xl:hidden">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
          정렬
        </span>
        {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            aria-pressed={key === sortKey}
            className={cx(
              "inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs transition-colors duration-150 motion-reduce:transition-none",
              key === sortKey
                ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                : "border-white/15 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07]",
              focusRing,
            )}
          >
            {SORT_LABEL_LONG[key]}
            {key === sortKey ? (
              descending ? (
                <ArrowDown className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ArrowUp className="h-3 w-3" aria-hidden="true" />
              )
            ) : null}
          </button>
        ))}
      </div>

      <table className="hidden w-full table-fixed border-collapse @xl:table">
        <caption className="sr-only">
          {windowText} 구간에 접수된 지원 티켓 목록. 접수일, 심각도, 상태 열은 정렬할 수 있습니다.
        </caption>
        <thead>
          <tr className="border-b border-white/10">
            <SortHead
              column="date"
              width="17%"
              sortKey={sortKey}
              descending={descending}
              onToggle={toggle}
            />
            <th
              scope="col"
              style={{ width: "31%" }}
              className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400"
            >
              내용
            </th>
            <th
              scope="col"
              style={{ width: "20%" }}
              className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400"
            >
              담당
            </th>
            <SortHead
              column="severity"
              width="16%"
              sortKey={sortKey}
              descending={descending}
              onToggle={toggle}
            />
            <SortHead
              column="status"
              width="16%"
              sortKey={sortKey}
              descending={descending}
              onToggle={toggle}
            />
          </tr>
        </thead>
        <tbody>
          {sorted.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-white/[0.06] transition-colors duration-150 last:border-0 hover:bg-white/[0.04] motion-reduce:transition-none"
            >
              <td className="px-3 py-2.5 text-xs tabular-nums text-zinc-300">{dateOf(ticket)}</td>
              <td className="px-3 py-2.5 text-sm break-keep text-zinc-100">{ticket.title}</td>
              <td className="px-3 py-2.5">
                <span className="flex items-center gap-2">
                  <Avatar initials={ticket.assigneeInitials} size="sm" />
                  <span className="min-w-0 break-keep text-xs text-zinc-300">
                    {ticket.assignee}
                  </span>
                </span>
              </td>
              <td className="px-3 py-2.5">
                <SeverityChip severity={ticket.severity} />
              </td>
              <td className="px-3 py-2.5">
                <StatusTag status={ticket.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-2 @xl:hidden">
        {sorted.map((ticket) => (
          <li
            key={ticket.id}
            className="rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors duration-150 hover:bg-white/[0.05] motion-reduce:transition-none"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs tabular-nums text-zinc-400">{dateOf(ticket)}</span>
              <SeverityChip severity={ticket.severity} />
            </div>
            <p className="mt-1.5 text-sm break-keep text-zinc-100">{ticket.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="flex items-center gap-2">
                <Avatar initials={ticket.assigneeInitials} size="sm" />
                <span className="text-xs text-zinc-300">{ticket.assignee}</span>
              </span>
              <StatusTag status={ticket.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
