"use client";

import { Fragment, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import { formatInt, formatPercent, formatSignedInt, formatWeekRange } from "./format";
import type { WeekResult } from "./sim";
import { FOCUS_RING, GapIndicator, SlaBadge } from "./ui";

type SortKey = "week" | "volume" | "required" | "gap" | "attainment";
type SortDir = "asc" | "desc";

function sortValue(row: WeekResult, key: SortKey): number {
  switch (key) {
    case "volume":
      return row.volume;
    case "required":
      return row.requiredHeadcount;
    case "gap":
      return row.gap;
    case "attainment":
      return row.attainmentPct;
    default:
      return row.index;
  }
}

function SortButton({ label, active, dir, onClick }: { label: string; active: boolean; dir: SortDir; onClick: () => void }) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center gap-1 rounded-md px-1.5 font-semibold text-[11px] uppercase tracking-[0.03em] text-zinc-600 motion-safe:transition-colors hover:text-zinc-900 ${FOCUS_RING}`}
    >
      {label}
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
    </button>
  );
}

function ChannelBreakdown({ row }: { row: WeekResult }) {
  const max = Math.max(row.channels.chat, row.channels.email, row.channels.phone, 1);
  const items: Array<{ label: string; value: number }> = [
    { label: "Chat", value: row.channels.chat },
    { label: "Email", value: row.channels.email },
    { label: "Phone", value: row.channels.phone },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-xs text-zinc-700">{item.label}</span>
            <span className="font-semibold text-xs tabular-nums text-zinc-900">{formatInt(item.value)} agents</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-green-700" style={{ width: `${Math.round((item.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpandedDetail({ row }: { row: WeekResult }) {
  const deficit = Math.max(0, row.requiredHeadcount - row.scheduledHeadcount);
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-zinc-50 p-4">
      <div>
        <p className="font-medium text-xs text-zinc-700">Required headcount by channel</p>
        <p className="mt-0.5 font-normal text-xs text-zinc-600">
          Chat, email and phone contributions always add back up to the {formatInt(row.requiredHeadcount)} agents required this week.
        </p>
        <div className="mt-3">
          <ChannelBreakdown row={row} />
        </div>
      </div>
      <p className="font-normal text-xs text-zinc-600">
        {deficit > 0 ? (
          <>
            Hire or reassign <span className="font-semibold tabular-nums text-zinc-900">{formatInt(deficit)}</span> more agents to close
            this week&rsquo;s gap and bring attainment back to 100%.
          </>
        ) : row.gap === 0 ? (
          <>This week is staffed to exactly the required headcount — no surplus, no gap.</>
        ) : (
          <>
            This week carries a surplus of <span className="font-semibold tabular-nums text-zinc-900">{formatInt(row.gap)}</span> agents
            — available to reassign to another week or team.
          </>
        )}
      </p>
    </div>
  );
}

export default function WeekTable({
  rows,
  pinnedWeek,
  onPinWeek,
  onHoverWeek,
}: {
  rows: WeekResult[];
  pinnedWeek: number;
  onPinWeek: (index: number) => void;
  onHoverWeek: (index: number | null) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("week");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const base = sortValue(a, sortKey) - sortValue(b, sortKey);
    return sortDir === "asc" ? base : -base;
  });

  const ariaSort = (key: SortKey): "ascending" | "descending" | "none" => (sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none");

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="mb-2 text-left font-normal text-xs text-zinc-600">
            {rows.length}-week staffing plan. Selecting a row&rsquo;s week pins it, expanding its channel breakdown below and marking it on
            the chart above; hovering any row previews it on the chart without changing the pin.
          </caption>
          <colgroup>
            <col style={{ width: "23%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "26%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" aria-sort={ariaSort("week")} className="py-2 pr-2 text-left font-normal">
                <SortButton label="Week" active={sortKey === "week"} dir={sortDir} onClick={() => toggleSort("week")} />
              </th>
              <th scope="col" aria-sort={ariaSort("volume")} className="py-2 pr-2 text-right font-normal">
                <span className="flex justify-end">
                  <SortButton label="Volume" active={sortKey === "volume"} dir={sortDir} onClick={() => toggleSort("volume")} />
                </span>
              </th>
              <th scope="col" aria-sort={ariaSort("required")} className="py-2 pr-2 text-right font-normal">
                <span className="flex justify-end">
                  <SortButton label="Required" active={sortKey === "required"} dir={sortDir} onClick={() => toggleSort("required")} />
                </span>
              </th>
              <th scope="col" className="py-2 pr-2 text-right font-semibold text-[11px] uppercase tracking-[0.03em] text-zinc-600">
                Scheduled
              </th>
              <th scope="col" aria-sort={ariaSort("gap")} className="py-2 pr-2 text-right font-normal">
                <span className="flex justify-end">
                  <SortButton label="Gap" active={sortKey === "gap"} dir={sortDir} onClick={() => toggleSort("gap")} />
                </span>
              </th>
              <th scope="col" aria-sort={ariaSort("attainment")} className="py-2 text-right font-normal">
                <span className="flex justify-end">
                  <SortButton label="Attainment" active={sortKey === "attainment"} dir={sortDir} onClick={() => toggleSort("attainment")} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const pinned = row.index === pinnedWeek;
              return (
                <Fragment key={row.index}>
                  <tr
                    onMouseEnter={() => onHoverWeek(row.index)}
                    onMouseLeave={() => onHoverWeek(null)}
                    className={`border-b border-zinc-100 last:border-0 ${pinned ? "bg-green-50" : "hover:bg-zinc-50"}`}
                  >
                    <td className="py-2.5 pr-2 align-middle">
                      <button
                        type="button"
                        onClick={() => onPinWeek(row.index)}
                        onFocus={() => onHoverWeek(row.index)}
                        onBlur={() => onHoverWeek(null)}
                        aria-expanded={pinned}
                        className={`flex min-h-8 w-full items-center gap-1.5 rounded-md text-left font-medium text-sm tabular-nums text-zinc-900 motion-safe:transition-colors ${FOCUS_RING}`}
                      >
                        {pinned ? (
                          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-green-700" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />
                        )}
                        <span className="whitespace-nowrap">{formatWeekRange(row.index)}</span>
                      </button>
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal text-sm tabular-nums text-zinc-700">
                      {formatInt(row.volume)}
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-semibold text-sm tabular-nums text-zinc-900">
                      {formatInt(row.requiredHeadcount)}
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal text-sm tabular-nums text-zinc-700">
                      {formatInt(row.scheduledHeadcount)}
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle">
                      <span className={`inline-flex items-center gap-1 font-medium text-sm tabular-nums ${row.gap >= 0 ? "text-green-700" : "text-red-700"}`}>
                        <GapIndicator gap={row.gap} />
                        {formatSignedInt(row.gap)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2.5 text-right align-middle">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-medium text-sm tabular-nums text-zinc-900">{formatPercent(row.attainmentPct)}</span>
                        <SlaBadge breach={row.breach} />
                      </div>
                    </td>
                  </tr>
                  {pinned ? (
                    <tr className="border-b border-zinc-100 bg-green-50 last:border-0">
                      <td colSpan={6} className="pb-3 pl-6 pr-2 pt-0">
                        <ExpandedDetail row={row} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile list, fully interactive (same pin/expand behavior, no second horizontal scroller) */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {sorted.map((row) => {
          const pinned = row.index === pinnedWeek;
          return (
            <li key={row.index} className={`rounded-lg border ${pinned ? "border-green-300 bg-green-50" : "border-zinc-200 bg-white"}`}>
              <button
                type="button"
                onClick={() => onPinWeek(row.index)}
                aria-expanded={pinned}
                className={`flex w-full min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left motion-safe:transition-colors ${FOCUS_RING}`}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {pinned ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-green-700" aria-hidden="true" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />}
                  <span className="truncate font-medium text-sm tabular-nums text-zinc-900">{formatWeekRange(row.index)}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-semibold text-sm tabular-nums text-zinc-900">{formatInt(row.requiredHeadcount)}</span>
                  <SlaBadge breach={row.breach} />
                </span>
              </button>
              {pinned ? (
                <div className="px-3 pb-3">
                  <ExpandedDetail row={row} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
