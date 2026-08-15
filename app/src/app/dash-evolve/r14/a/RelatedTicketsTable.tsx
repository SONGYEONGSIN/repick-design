"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDate, ticketOpenedMs, type Ticket } from "./data";
import { BORDER, DIVIDE, FOCUS_VISIBLE_INSET, HOVER_ROW, NUM, PRIORITY_LABEL, PRIORITY_TONE, STATUS_LABEL, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";
import { Badge } from "./ui";

type SortKey = "id" | "status" | "opened";
type SortDir = "asc" | "desc";

/** Compact column set for the aside rail — kept to 3 columns (Ticket/Status/Opened) so the
 *  narrower sidebar width never has to squeeze a full-word priority badge, which is the column
 *  that forced a real desktop table-overflow at 1280–1366px in testing. Priority is still
 *  communicated, just via a decorative dot plus a screen-reader-only word in the Ticket cell,
 *  since it's already shown as a full labeled badge in the rail and the ticket header above. */
const COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: "id", label: "Ticket", width: "30%" },
  { key: "status", label: "Status", width: "34%" },
  { key: "opened", label: "Opened", width: "36%" },
];

/** Real sortable table — "other tickets from this account", excluding the currently selected one. */
export default function RelatedTicketsTable({ tickets, onSelect }: { tickets: Ticket[]; onSelect: (ticketId: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("opened");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    const arr = [...tickets];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "id":
          return a.id.localeCompare(b.id) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "opened":
          return (a.createdOffsetMin - b.createdOffsetMin) * dir;
        default:
          return 0;
      }
    });
    return arr;
  }, [tickets, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (tickets.length === 0) {
    return <p className={cx("py-3 text-sm", TEXT_CAPTION)}>No other tickets from this account.</p>;
  }

  return (
    <div className="relative overflow-x-auto [scrollbar-width:thin]">
      <table className="w-full min-w-[360px] table-fixed border-collapse text-sm lg:min-w-0">
        <caption className="sr-only">Other support tickets from this customer account, sortable by column.</caption>
        <colgroup>
          {COLUMNS.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
        </colgroup>
        <thead>
          <tr className={cx("border-b", BORDER)}>
            {COLUMNS.map((c) => {
              const active = sortKey === c.key;
              const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
              const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <th key={c.key} scope="col" aria-sort={ariaSort} className="py-2 pr-2 text-left align-middle font-medium">
                  <button type="button" onClick={() => toggleSort(c.key)} className={cx("inline-flex items-center gap-1 rounded px-1 py-1 text-[11px] font-medium uppercase tracking-wider", active ? TEXT_PRIMARY : TEXT_CAPTION, TRANSITION, FOCUS_VISIBLE_INSET)}>
                    {c.label}
                    <Icon size={11} aria-hidden="true" className={active ? "" : "opacity-50"} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={cx("divide-y", DIVIDE)}>
          {sorted.map((t) => (
            <tr key={t.id} className={cx(HOVER_ROW, TRANSITION)}>
              <td className="py-2 pr-2 align-middle">
                <button type="button" onClick={() => onSelect(t.id)} className={cx("inline-flex min-w-0 items-center gap-1.5 rounded text-left", FOCUS_VISIBLE_INSET)}>
                  <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", TONE[PRIORITY_TONE[t.priority]].dot)} aria-hidden="true" />
                  <span className="sr-only">{PRIORITY_LABEL[t.priority]} priority, </span>
                  <span className={cx("truncate font-medium underline-offset-2 hover:underline", NUM, "text-teal-700")}>{t.id}</span>
                </button>
              </td>
              <td className="py-2 pr-2 align-middle">
                <Badge tone={TONE[STATUS_TONE[t.status]]}>{STATUS_LABEL[t.status]}</Badge>
              </td>
              <td className={cx("truncate whitespace-nowrap py-2 pr-2 align-middle", NUM, TEXT_CAPTION)}>{formatDate(ticketOpenedMs(t))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
