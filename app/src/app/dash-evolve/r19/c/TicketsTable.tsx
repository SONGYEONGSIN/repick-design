"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import type { Ticket, TicketStatus } from "./data";
import { STATUS_META, dayFull, formatWaitMinutes } from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, TEXT_AUX, TEXT_AUX_MUTED, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Card, CardHead, Segmented } from "./ui";

type SortKey = "id" | "wait" | "status";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | TicketStatus;

const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "breached", label: "Breached" },
  { id: "at-risk", label: "At risk" },
  { id: "on-track", label: "On track" },
];

const COLUMNS: { key: SortKey | null; label: string; width: string; align: "left" | "right" }[] = [
  { key: "id", label: "Ticket", width: "32%", align: "left" },
  { key: null, label: "Assignee", width: "20%", align: "left" },
  { key: "wait", label: "Waiting", width: "17%", align: "right" },
  { key: "status", label: "Status", width: "31%", align: "right" },
];

export default function TicketsTable({
  tickets,
  ticketsTotal,
  queueLabel,
}: {
  tickets: Ticket[];
  ticketsTotal: number;
  queueLabel: string;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("wait");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "id" ? "asc" : "desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = tickets.filter((t) => statusFilter === "all" || t.status === statusFilter);
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "wait") cmp = a.waitMinutes - b.waitMinutes;
      else cmp = STATUS_META[a.status].rank - STATUS_META[b.status].rank;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [tickets, statusFilter, sortKey, sortDir]);

  const breachedShown = rows.filter((t) => t.status === "breached").length;
  const filtering = statusFilter !== "all";

  return (
    <Card id="tickets-card" className="flex min-w-0 flex-col">
      <CardHead
        title="Tickets in this window"
        hint={`${tickets.length} of ${ticketsTotal} tickets on record for ${queueLabel} fall inside the selected window. ${rows.length} shown after filtering.`}
      />

      <div className="mt-3">
        <Segmented options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} ariaLabel="Filter tickets by status" />
      </div>

      {/* Desktop: the real table. */}
      <div className={cx("mt-3 hidden rounded-xl border lg:block", BORDER)}>
        <table className="w-full table-fixed text-left text-sm">
          <caption className={cx("px-3 pt-3 text-left text-[11px] font-normal", TEXT_AUX)}>
            {`${queueLabel} tickets — id and subject, assignee, minutes waiting, and SLA status. Headers sort.`}
          </caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.label} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLUMNS.map((col) => {
                if (!col.key) {
                  return (
                    <th key={col.label} scope="col" className={cx("px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX_MUTED)}>
                      {col.label}
                    </th>
                  );
                }
                const active = sortKey === col.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={col.label}
                    scope="col"
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className={cx("px-3 py-2.5", col.align === "right" && "text-right")}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as SortKey)}
                      className={cx(
                        "inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.08em]",
                        col.align === "right" && "flex-row-reverse",
                        active ? TEXT_PRIMARY : TEXT_AUX_MUTED,
                        "hover:text-zinc-900",
                        TRANSITION,
                        FOCUS,
                      )}
                    >
                      {col.label}
                      <Icon size={11} aria-hidden="true" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={cx("px-3 py-6 text-center text-sm font-normal", TEXT_AUX)}>
                  No tickets match this filter in the selected window.
                </td>
              </tr>
            ) : (
              rows.map((t) => {
                const meta = STATUS_META[t.status];
                return (
                  <tr key={t.id} className={cx(TRANSITION, HOVER_ROW)}>
                    <td className="px-3 py-2.5">
                      <span className="block min-w-0">
                        <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{t.subject}</span>
                        <span className={cx("mt-0.5 block truncate text-[11px] font-normal", TEXT_AUX)}>{`${t.id} · ${t.requester} · ${dayFull(t.daysAgo)}`}</span>
                      </span>
                    </td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 text-sm font-normal", TEXT_SECONDARY)}>{t.assignee}</td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-sm font-medium", NUM, TEXT_PRIMARY)}>{formatWaitMinutes(t.waitMinutes)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", meta.subtle)}>
                        <meta.Icon size={11} aria-hidden="true" />
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <p className={cx("border-t px-3 py-2.5 text-[11px] font-medium", BORDER, TEXT_AUX_MUTED)}>
          {filtering ? `${rows.length} of ${tickets.length} tickets match "${STATUS_META[statusFilter as TicketStatus]?.label ?? statusFilter}".` : `${breachedShown} breached in this window.`}
        </p>
      </div>

      {/* Below lg the four-column table stops being legible however the widths are split, so it
          is replaced by a stacked card list rather than shrunk into a side-scroller. */}
      <ul className="mt-3 flex flex-col gap-1.5 lg:hidden">
        {rows.length === 0 ? (
          <li className={cx("rounded-xl border p-3 text-center text-sm font-normal", BORDER, TEXT_AUX)}>No tickets match this filter in the selected window.</li>
        ) : (
          rows.map((t) => {
            const meta = STATUS_META[t.status];
            return (
              <li key={t.id} className={cx("rounded-xl border p-3", BORDER, "bg-white")}>
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{t.subject}</span>
                    <span className={cx("mt-0.5 block truncate text-[11px] font-normal", TEXT_AUX)}>{`${t.id} · ${t.assignee}`}</span>
                  </span>
                  <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", meta.subtle)}>
                    <meta.Icon size={11} aria-hidden="true" />
                    {meta.label}
                  </span>
                </span>
                <span className={cx("mt-2 flex items-baseline justify-between gap-2 whitespace-nowrap text-[11px] font-normal", TEXT_AUX_MUTED)}>
                  <span className="min-w-0 truncate">{`${t.requester} · ${dayFull(t.daysAgo)}`}</span>
                  <span className={cx("shrink-0 font-medium", NUM)}>{`Waiting ${formatWaitMinutes(t.waitMinutes)}`}</span>
                </span>
              </li>
            );
          })
        )}
      </ul>
    </Card>
  );
}
