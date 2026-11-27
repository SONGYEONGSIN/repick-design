"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarX } from "lucide-react";
import {
  STATUS_FILTERS,
  STATUS_LABEL,
  formatDayHeading,
  formatRange,
  getSite,
  statusCounts,
  visitTypeBreakdownForDay,
  visitsForDay,
  type StatusFilter,
  type Visit,
  type VisitStatus,
} from "./data";
import { Card, CardHeader, FieldLabel } from "./Card";
import { StatusBadge, Pill } from "./Badge";
import { Tabs } from "./Tabs";
import { cx, FOCUS_RING_INSET } from "./ui";

type SortKey = "start" | "patientId" | "status";
type SortDir = "asc" | "desc";
type BoardTab = "list" | "summary";

interface VisitBoardProps {
  visits: Visit[];
  selectedDay: number;
  compact: boolean;
  headingId: string;
  filter: StatusFilter;
  onFilterChange: (f: StatusFilter) => void;
}

const STATUS_ORDER: Record<VisitStatus, number> = { scheduled: 0, confirmed: 1, completed: 2, missed: 3, cancelled: 4 };

// Column widths as a percentage of the table's own width. "Time" renders a fixed-length 24-hour
// range ("HH:MM–HH:MM", always exactly 11 characters — see data.ts) and "Patient" a fixed-length
// 7-character id ("021-169"), so both are whitespace-nowrap with no truncate escape hatch — unlike
// Visit type/Site/Coordinator, which truncate internally and can never bleed into a neighboring
// cell regardless of width. Time and Patient are therefore the two columns sized against real
// pixel arithmetic, checked at the table's own narrowest rendered width (the 660px `min-w` below,
// which only matters at the 390px mobile breakpoint where that min-w forces this table's own
// horizontal scroll):
//   Time:    0.18 * 660px = 118.8px; minus `pr-3` (12px) = 106.8px content area.
//            "08:30–09:00" (11 chars) measures ~88px in 14px tabular-nums -> ~18.8px slack.
//   Patient: 0.13 * 660px = 85.8px;  minus `pr-3` (12px) = 73.8px content area.
//            "021-169" (7 chars) measures ~56px in 14px tabular-nums -> ~17.8px slack.
// Both clear the required >=16px slack floor at 660px; every desktop breakpoint
// (1280/1366/1440/1600/1920) gives the table far more real width than 660px, so the same
// percentages only gain slack there, never lose it.
const COL_WIDTH = {
  time: "18%",
  patient: "13%",
  visitType: "15%",
  site: "18%",
  coordinator: "16%",
  status: "20%",
} as const;

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className="py-2 pr-3 text-left align-middle"
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cx(
          "flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-800",
          FOCUS_RING_INSET
        )}
      >
        {label}
        <Icon className={cx("h-3 w-3", active ? "text-zinc-700" : "text-zinc-400")} aria-hidden="true" />
      </button>
    </th>
  );
}

export function VisitBoard({ visits, selectedDay, compact, headingId, filter, onFilterChange }: VisitBoardProps) {
  const [tab, setTab] = useState<BoardTab>("list");
  const [sortKey, setSortKey] = useState<SortKey>("start");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const dayVisits = useMemo(() => visitsForDay(visits, selectedDay), [visits, selectedDay]);
  const counts = useMemo(() => statusCounts(dayVisits), [dayVisits]);
  const typeBreakdown = useMemo(() => visitTypeBreakdownForDay(visits, selectedDay), [visits, selectedDay]);

  const filtered = useMemo(
    () => (filter === "all" ? dayVisits : dayVisits.filter((v) => v.status === filter)),
    [dayVisits, filter]
  );

  const sorted = useMemo(() => {
    const rows = [...filtered];
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "start") cmp = a.start - b.start;
      else if (sortKey === "patientId") cmp = a.patientId.localeCompare(b.patientId);
      else cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const rowPad = compact ? "py-1.5" : "py-2.5";

  return (
    <Card>
      <CardHeader
        id={headingId}
        title={`Visits — ${formatDayHeading(selectedDay)}`}
        description="Updates only this board — the KPIs and site list above never change with the calendar selection."
      />

      {dayVisits.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-200 py-12 text-center">
          <CalendarX className="h-6 w-6 text-zinc-400" aria-hidden="true" />
          <p className="text-sm font-medium text-zinc-700">No visits scheduled</p>
          <p className="max-w-xs text-xs text-zinc-500">
            Nothing is on the calendar for {formatDayHeading(selectedDay)}. Pick another day, or schedule a new visit.
          </p>
        </div>
      ) : (
        <>
          <Tabs
            idPrefix="board"
            label="Board view"
            value={tab}
            onChange={setTab}
            options={[
              { value: "list", label: "Visit list" },
              { value: "summary", label: "Day summary" },
            ]}
          />

          {tab === "list" ? (
            <div id="board-panel-list" role="tabpanel" aria-labelledby="board-tab-list" className="pt-4">
              <div className="mb-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by status">
                {STATUS_FILTERS.map((f) => {
                  const active = f === filter;
                  const n = f === "all" ? dayVisits.length : counts[f];
                  return (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onFilterChange(f)}
                      className={cx(
                        "rounded-full border px-2.5 py-1.5 text-xs font-medium",
                        FOCUS_RING_INSET,
                        active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      )}
                    >
                      {f === "all" ? "All" : STATUS_LABEL[f]} <span className="tabular-nums">{n}</span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop: zero horizontal scroll, table-fixed + colgroup percentage widths. Mobile
                  (<=390px): a min-w on the <table> itself (never on a <td>, which has no layout
                  effect under table-fixed and would silently let text overlap) permits local
                  horizontal scroll, the only place this route scrolls sideways. 660px (not 600px)
                  is the smallest width that still leaves the fixed-length Time/Patient columns
                  >=16px slack per the arithmetic above. `relative` on this wrapper gives the
                  sr-only (position:absolute) <caption> below a containing block inside the clip,
                  so it can't escape and inflate the page's 390px scrollWidth. */}
              <div className="relative overflow-x-auto">
                <table className="w-full min-w-[660px] table-fixed border-collapse text-sm">
                  <caption className="sr-only">
                    Scheduled patient visits for {formatDayHeading(selectedDay)}, {sorted.length} of {dayVisits.length} shown
                  </caption>
                  <colgroup>
                    <col style={{ width: COL_WIDTH.time }} />
                    <col style={{ width: COL_WIDTH.patient }} />
                    <col style={{ width: COL_WIDTH.visitType }} />
                    <col style={{ width: COL_WIDTH.site }} />
                    <col style={{ width: COL_WIDTH.coordinator }} />
                    <col style={{ width: COL_WIDTH.status }} />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <SortHeader label="Time" sortKey="start" active={sortKey === "start"} dir={sortDir} onSort={handleSort} />
                      <SortHeader
                        label="Patient"
                        sortKey="patientId"
                        active={sortKey === "patientId"}
                        dir={sortDir}
                        onSort={handleSort}
                      />
                      <th scope="col" className="py-2 pr-3 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                        Visit type
                      </th>
                      <th scope="col" className="py-2 pr-3 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                        Site
                      </th>
                      <th scope="col" className="py-2 pr-3 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                        Coordinator
                      </th>
                      <SortHeader
                        label="Status"
                        sortKey="status"
                        active={sortKey === "status"}
                        dir={sortDir}
                        onSort={handleSort}
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((v) => {
                      const site = getSite(v.siteId);
                      return (
                        <tr key={v.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                          <td className={cx(rowPad, "whitespace-nowrap tabular-nums pr-3 text-zinc-700")}>
                            {formatRange(v.start, v.duration)}
                          </td>
                          <td className={cx(rowPad, "whitespace-nowrap tabular-nums pr-3 font-medium text-zinc-900")}>{v.patientId}</td>
                          <td className={cx(rowPad, "min-w-0 truncate pr-3 text-zinc-700")}>{v.visitType}</td>
                          <td className={cx(rowPad, "min-w-0 truncate pr-3 text-zinc-700")}>{site.name}</td>
                          <td className={cx(rowPad, "min-w-0 truncate pr-3 text-zinc-600")}>{site.coordinator}</td>
                          <td className={cx(rowPad, "pr-3")}>
                            <StatusBadge status={v.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div id="board-panel-summary" role="tabpanel" aria-labelledby="board-tab-summary" className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              <div>
                <FieldLabel>By status</FieldLabel>
                <ul className="mt-2 space-y-1.5">
                  {(Object.keys(counts) as VisitStatus[])
                    .filter((k) => counts[k] > 0)
                    .map((k) => (
                      <li key={k} className="flex items-center justify-between gap-2 text-sm">
                        <StatusBadge status={k} />
                        <span className="font-medium tabular-nums text-zinc-800">{counts[k]}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <FieldLabel>By visit type</FieldLabel>
                <ul className="mt-2 space-y-1.5">
                  {typeBreakdown.map((b) => (
                    <li key={b.type} className="flex items-center justify-between gap-2 text-sm">
                      <Pill>{b.type}</Pill>
                      <span className="font-medium tabular-nums text-zinc-800">{b.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
