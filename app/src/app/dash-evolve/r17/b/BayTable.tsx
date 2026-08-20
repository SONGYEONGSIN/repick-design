"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Boxes } from "lucide-react";
import { useMemo, useState } from "react";
import type { BayId, BayLoad, MetricId } from "./data";
import { BAY_GROUP_LABEL, BAY_LOAD, GRAND_TOTALS, METRIC_BY_ID, fmt, fmtMetric, initialsOf } from "./data";
import { ACCENT_SUBTLE, BORDER, DIVIDE, FOCUS, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, LoadBar, SegmentedControl } from "./ui";

/**
 * Roster of the eight service bays. Every figure is reduced from the same work-order array the
 * calendar uses, so the filtered subtotal and the grand total always reconcile — the footer prints
 * both so the reader can check it.
 *
 * Below `md` the table is not narrowed, it is replaced: each bay becomes a stacked card with a flat
 * definition list. Six percentage columns at 390px is precisely the layout that survives an overflow
 * sweep and still reads as garbage.
 */

type SortKey = "bay" | "lead" | "days" | "value";
type SortDir = "asc" | "desc";
type ShiftFilter = "all" | "day" | "evening";

const FILTERS: { id: ShiftFilter; label: string }[] = [
  { id: "all", label: "All bays" },
  { id: "day", label: "Day shift" },
  { id: "evening", label: "Evening shift" },
];

function isEvening(shift: string): boolean {
  return shift.startsWith("13:30");
}

export default function BayTable({ metric, highlightBayId }: { metric: MetricId; highlightBayId: BayId | null }) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<ShiftFilter>("all");
  const meta = METRIC_BY_ID[metric];
  const grand = GRAND_TOTALS[metric];

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "bay" || key === "lead" ? "asc" : "desc");
    }
  }

  const rows: BayLoad[] = useMemo(() => {
    const filtered = BAY_LOAD.filter((r) => {
      // A bay the command palette just found always stays visible, even when the shift filter would
      // hide it — a search result that silently matches nothing on screen is worse than a filter
      // that admits one extra row, and the header count still reports honestly.
      if (r.bay.id === highlightBayId) return true;
      if (filter === "all") return true;
      return filter === "evening" ? isEvening(r.bay.shift) : !isEvening(r.bay.shift);
    });
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "bay") cmp = a.bay.code.localeCompare(b.bay.code);
      else if (sortKey === "lead") cmp = a.bay.lead.localeCompare(b.bay.lead);
      else if (sortKey === "days") cmp = a.days - b.days;
      else cmp = a.totals[metric] - b.totals[metric];
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filter, sortKey, sortDir, metric, highlightBayId]);

  const shownTotal = rows.reduce((s, r) => s + r.totals[metric], 0);
  /** Meter scaled against the busiest bay so the column compares bays, not slivers of the total. */
  const peakBay = BAY_LOAD.reduce((m, r) => Math.max(m, r.totals[metric]), 0);

  const columns: { key: SortKey | null; label: string; align: "left" | "right"; width: string }[] = [
    { key: "bay", label: "Bay", align: "left", width: "w-[24%]" },
    { key: "lead", label: "Crew lead", align: "left", width: "w-[22%]" },
    { key: null, label: "Discipline", align: "left", width: "w-[16%]" },
    { key: "days", label: "Days on rota", align: "right", width: "w-[12%]" },
    { key: "value", label: meta.label, align: "right", width: "w-[12%]" },
    { key: null, label: "Share of period", align: "right", width: "w-[14%]" },
  ];

  function sortIndicator(key: SortKey) {
    const active = sortKey === key;
    const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
    return <Icon size={11} aria-hidden="true" className={cx("shrink-0", active ? "text-blue-700" : "text-zinc-400")} />;
  }

  return (
    <Card id="bays-card">
      <CardHeader
        Icon={Boxes}
        title="Service bays"
        description={`${rows.length} of ${BAY_LOAD.length} bays shown · ${fmtMetric(shownTotal, metric)} of ${fmtMetric(grand, metric)} in the period`}
        action={<SegmentedControl ariaLabel="Filter bays by shift" value={filter} onChange={setFilter} options={FILTERS} size="sm" />}
      />

      {/* ------------------------------------------------------- md+: real table */}
      <table className="mt-3 hidden w-full table-fixed text-left md:table">
        <caption className={cx("mb-2 text-left text-xs font-normal", TEXT_CAPTION)}>
          {`Per-bay ${meta.label.toLowerCase()} for 2 February to 15 March 2026, with days on the rota and each bay's share of the period. Sortable by column.`}
        </caption>
        <thead>
          <tr className={cx("border-b", BORDER)}>
            {columns.map((col) => {
              const active = col.key !== null && sortKey === col.key;
              return (
                <th
                  key={col.label}
                  scope="col"
                  aria-sort={col.key === null ? undefined : active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className={cx(col.width, "pb-2 pr-3 last:pr-0")}
                >
                  {col.key === null ? (
                    <span className={cx("block text-[11px] font-medium uppercase tracking-wider", col.align === "right" && "text-right", TEXT_CAPTION)}>{col.label}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as SortKey)}
                      className={cx(
                        "flex w-full items-center gap-1 rounded text-[11px] font-medium uppercase tracking-wider",
                        col.align === "right" && "justify-end",
                        TEXT_CAPTION_MUTED,
                        "hover:text-zinc-900",
                        TRANSITION,
                        FOCUS,
                      )}
                    >
                      <span className="truncate">{col.label}</span>
                      {sortIndicator(col.key)}
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={cx("divide-y", DIVIDE)}>
          {rows.map((r) => {
            const value = r.totals[metric];
            const pct = grand === 0 ? 0 : (value / grand) * 100;
            return (
              <tr key={r.bay.id} className={cx(HOVER_ROW, TRANSITION, r.bay.id === highlightBayId && "bg-blue-50")}>
                <th scope="row" className="py-2.5 pr-3 text-left align-middle">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className={cx("grid h-6 w-9 shrink-0 place-items-center rounded-md text-[11px] font-semibold", ACCENT_SUBTLE)}>
                      {r.bay.code}
                    </span>
                    <span className={cx("min-w-0 truncate text-[13px] font-medium", TEXT_PRIMARY)}>{r.bay.name}</span>
                    {r.bay.id === highlightBayId ? (
                      <span className={cx("shrink-0 whitespace-nowrap rounded-full border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] font-medium", "text-blue-800")}>Found</span>
                    ) : null}
                  </span>
                </th>
                <td className="py-2.5 pr-3 align-middle">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600">
                      {initialsOf(r.bay.lead)}
                    </span>
                    <span className="min-w-0">
                      <span className={cx("block truncate text-[13px] font-normal leading-tight", TEXT_PRIMARY)}>{r.bay.lead}</span>
                      <span className={cx("block truncate whitespace-nowrap text-[11px] font-normal leading-tight", NUM, TEXT_CAPTION)}>{r.bay.shift}</span>
                    </span>
                  </span>
                </td>
                <td className="py-2.5 pr-3 align-middle">
                  <span className={cx("inline-block truncate rounded-full border px-2 py-0.5 text-[11px] font-medium", BORDER, "bg-zinc-50", TEXT_CAPTION_MUTED)}>
                    {BAY_GROUP_LABEL[r.bay.group]}
                  </span>
                </td>
                <td className={cx("py-2.5 pr-3 text-right align-middle text-[13px] font-normal whitespace-nowrap", NUM, TEXT_PRIMARY)}>{fmt(r.days)}</td>
                <td className={cx("py-2.5 pr-3 text-right align-middle text-[13px] font-medium whitespace-nowrap", NUM, TEXT_PRIMARY)}>{fmtMetric(value, metric)}</td>
                <td className="py-2.5 align-middle">
                  <span className="flex items-center justify-end gap-2">
                    <span className="hidden min-w-0 flex-1 lg:block">
                      <LoadBar pct={peakBay === 0 ? 0 : (value / peakBay) * 100} />
                    </span>
                    <span className={cx("w-10 shrink-0 whitespace-nowrap text-right text-[13px] font-medium", NUM, TEXT_PRIMARY)}>{`${Math.round(pct)}%`}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className={cx("border-t-2", BORDER)}>
            <th scope="row" className={cx("pt-2.5 pr-3 text-left text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED)}>
              {filter === "all" ? "All bays" : "Shown bays"}
            </th>
            <td className="pt-2.5 pr-3" />
            <td className="pt-2.5 pr-3" />
            <td className="pt-2.5 pr-3" />
            <td className={cx("pt-2.5 pr-3 text-right text-[13px] font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{fmtMetric(shownTotal, metric)}</td>
            <td className={cx("pt-2.5 text-right text-[13px] font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>
              {`${Math.round(grand === 0 ? 0 : (shownTotal / grand) * 100)}%`}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* ------------------------------- below md: stacked cards, not a shrunk grid */}
      <ul className="mt-3 flex flex-col gap-2 md:hidden">
        {rows.map((r) => {
          const value = r.totals[metric];
          const pct = grand === 0 ? 0 : (value / grand) * 100;
          return (
            <li key={r.bay.id} className={cx("rounded-xl border p-3", r.bay.id === highlightBayId ? "border-blue-700 bg-blue-50" : cx(BORDER, "bg-white"))}>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={cx("grid h-6 w-9 shrink-0 place-items-center rounded-md text-[11px] font-semibold", ACCENT_SUBTLE)}>
                  {r.bay.code}
                </span>
                <span className={cx("min-w-0 flex-1 truncate text-[13px] font-medium", TEXT_PRIMARY)}>{r.bay.name}</span>
                <span className={cx("shrink-0 whitespace-nowrap text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>{fmtMetric(value, metric)}</span>
              </div>
              <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
                <div className="min-w-0">
                  <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Crew lead</dt>
                  <dd className={cx("mt-0.5 truncate text-[13px] font-normal", TEXT_PRIMARY)}>{r.bay.lead}</dd>
                </div>
                <div className="min-w-0">
                  <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Shift</dt>
                  <dd className={cx("mt-0.5 truncate whitespace-nowrap text-[13px] font-normal", NUM, TEXT_PRIMARY)}>{r.bay.shift}</dd>
                </div>
                <div className="min-w-0">
                  <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Discipline</dt>
                  <dd className={cx("mt-0.5 truncate text-[13px] font-normal", TEXT_PRIMARY)}>{BAY_GROUP_LABEL[r.bay.group]}</dd>
                </div>
                <div className="min-w-0">
                  <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Days on rota</dt>
                  <dd className={cx("mt-0.5 text-[13px] font-normal", NUM, TEXT_PRIMARY)}>{fmt(r.days)}</dd>
                </div>
              </dl>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="min-w-0 flex-1">
                  <LoadBar pct={peakBay === 0 ? 0 : (value / peakBay) * 100} />
                </span>
                <span className={cx("w-24 shrink-0 whitespace-nowrap text-right text-[11px] font-normal", NUM, TEXT_CAPTION_MUTED)}>{`${Math.round(pct)}% of period`}</span>
              </div>
            </li>
          );
        })}
        <li className={cx("flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5", BORDER, "bg-zinc-50")}>
          <span className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED)}>{filter === "all" ? "All bays" : "Shown bays"}</span>
          <span className={cx("whitespace-nowrap text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>{`${fmtMetric(shownTotal, metric)} of ${fmtMetric(grand, metric)}`}</span>
        </li>
      </ul>
    </Card>
  );
}
