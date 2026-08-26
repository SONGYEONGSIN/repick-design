"use client";

import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Clock, ListFilter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { resourceOf, WEEK_DAYS, type Booking, type BookingStatus, type DayId } from "./data";
import { formatTimeRange } from "./format";
import { BORDER, DIVIDE, FOCUS, NUM, STATUS_LABEL, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, InitialsAvatar, SegmentedControl } from "./ui";

const STATUS_ICON: Record<BookingStatus, LucideIcon> = { confirmed: CheckCircle2, pending: Clock, conflict: AlertTriangle };

type SortKey = "date" | "resource" | "organizer" | "status" | "attendees";
type SortDir = "asc" | "desc";

const DAY_ORDER: Record<DayId, number> = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
const STATUS_ORDER: Record<BookingStatus, number> = { confirmed: 0, pending: 1, conflict: 2 };
const STATUS_FILTERS: { id: BookingStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "confirmed", label: "Confirmed" },
  { id: "pending", label: "Pending" },
  { id: "conflict", label: "Conflict" },
];

const COLS: { key: SortKey; label: string; width: string }[] = [
  { key: "date", label: "Date", width: "16%" },
  { key: "resource", label: "Resource", width: "18%" },
  { key: "organizer", label: "Organizer", width: "22%" },
  { key: "status", label: "Status", width: "16%" },
  { key: "attendees", label: "Attendees", width: "12%" },
];

function sortValue(b: Booking, key: SortKey): number | string {
  switch (key) {
    case "date":
      return DAY_ORDER[b.day] * 100 + b.startHour;
    case "resource":
      return resourceOf(b.resourceId).name;
    case "organizer":
      return b.organizer;
    case "status":
      return STATUS_ORDER[b.status];
    case "attendees":
      return b.attendees;
    default:
      return "";
  }
}

/**
 * Bookings table — the sortable, filterable record of the resource-filtered dataset the parent
 * hands down (see CorridorClient). Status filtering here is a SEPARATE control from the resource
 * rail: the rail changes which rows exist at all (recomputing the week board too), this segmented
 * control changes which of those rows are shown, independent of the board above.
 */
export default function BookingsTable({
  bookings,
  headingId,
  statusFilter,
  onStatusFilterChange,
}: {
  bookings: Booking[];
  headingId: string;
  statusFilter: BookingStatus | "all";
  onStatusFilterChange: (status: BookingStatus | "all") => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => (statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter)), [bookings, statusFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const dayOf = (day: DayId) => WEEK_DAYS.find((d) => d.id === day)!;

  return (
    <Card ariaLabelledBy={headingId} padded={false} className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <CardHeader titleId={headingId} Icon={ListFilter} title="Bookings" description={`${sorted.length} of ${bookings.length} shown · sortable, filterable by status`} />
        <SegmentedControl ariaLabel="Filter bookings by status" value={statusFilter} onChange={onStatusFilterChange} options={STATUS_FILTERS} />
      </div>

      {/* Desktop / tablet: real sortable table. */}
      <div className={cx("hidden overflow-hidden border-t md:block", BORDER)}>
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Resource bookings for the tracked week, sortable by column and filterable by status. {sorted.length} of {bookings.length} bookings shown.</caption>
          <colgroup>
            {COLS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLS.map((c) => {
                const active = sortKey === c.key;
                const ariaSort: "ascending" | "descending" | "none" = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th key={c.key} scope="col" aria-sort={ariaSort} className="px-2 py-1 text-left">
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cx(
                        "flex min-h-6 items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-wide",
                        TRANSITION,
                        FOCUS,
                        active ? "text-sky-700" : TEXT_CAPTION,
                        c.key === "attendees" && "ml-auto",
                      )}
                    >
                      {c.label}
                      {active ? sortDir === "asc" ? <ArrowUp size={11} aria-hidden="true" /> : <ArrowDown size={11} aria-hidden="true" /> : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className={cx("px-2 py-8 text-center text-sm", TEXT_CAPTION)}>
                  No bookings match this filter.
                </td>
              </tr>
            ) : (
              sorted.map((b) => {
                const tone = STATUS_TONE[b.status];
                const Icon = STATUS_ICON[b.status];
                const day = dayOf(b.day);
                const resource = resourceOf(b.resourceId);
                return (
                  <tr key={b.id} className="align-top hover:bg-zinc-50/70">
                    <td className={cx("whitespace-nowrap px-2 py-2.5", TEXT_PRIMARY)}>
                      <span className="text-[13px] font-medium">{day.label}, {day.dateLabel}</span>
                      <span className={cx("block whitespace-nowrap text-[11px]", NUM, TEXT_CAPTION)}>{formatTimeRange(b.startHour, b.durationHours)}</span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={cx("block truncate text-[13px] font-medium", TEXT_PRIMARY)}>{resource.name}</span>
                      <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>{b.title}</span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="flex min-w-0 items-center gap-2">
                        <InitialsAvatar name={b.organizer} size={20} />
                        <span className={cx("min-w-0 truncate text-[13px] font-medium", TEXT_PRIMARY)}>{b.organizer}</span>
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", tone.text, tone.bg, tone.border)}>
                        <Icon size={11} aria-hidden="true" />
                        {STATUS_LABEL[b.status]}
                      </span>
                    </td>
                    <td className={cx("whitespace-nowrap px-2 py-2.5 text-right text-[13px] font-medium", NUM, TEXT_PRIMARY)}>{b.attendees}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards — a 5-column table cannot fit 390px without wrapping. */}
      <div className="border-t p-4 md:hidden">
        {sorted.length === 0 ? (
          <p className={cx("py-6 text-center text-sm", TEXT_CAPTION)}>No bookings match this filter.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sorted.map((b) => {
              const tone = STATUS_TONE[b.status];
              const Icon = STATUS_ICON[b.status];
              const day = dayOf(b.day);
              const resource = resourceOf(b.resourceId);
              return (
                <li key={b.id} className={cx("rounded-xl border p-3", BORDER)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={cx("truncate text-[13px] font-medium", TEXT_PRIMARY)}>{resource.name}</p>
                      <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>{b.title}</p>
                    </div>
                    <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", tone.text, tone.bg, tone.border)}>
                      <Icon size={11} aria-hidden="true" />
                      {STATUS_LABEL[b.status]}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                    <span className={cx(NUM, TEXT_CAPTION)}>
                      {day.label}, {day.dateLabel} · {formatTimeRange(b.startHour, b.durationHours)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <InitialsAvatar name={b.organizer} size={18} />
                      <span className={cx("text-[11px]", TEXT_CAPTION)}>{b.organizer}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
