"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { SegmentId } from "../lib/data";
import { SEGMENT_LABELS, SEGMENT_ORDER } from "../lib/data";
import {
  SegmentRow,
  SegmentSortKey,
  SortDir,
  formatInt,
  formatPct,
  sortSegments,
  withRate,
} from "../lib/format";

const COLUMNS: { key: SegmentSortKey; label: string; width: string; align: "left" | "right" }[] = [
  { key: "segment", label: "Segment", width: "34%", align: "left" },
  { key: "visitors", label: "Visitors", width: "22%", align: "right" },
  { key: "conversions", label: "Conv.", width: "22%", align: "right" },
  { key: "rate", label: "Rate", width: "22%", align: "right" },
];

export default function SegmentTable({
  caption,
  rows,
  sortKey,
  sortDir,
  onSort,
  selectedSegment,
  onSelectSegment,
  accentTextClass,
}: {
  caption: string;
  rows: SegmentRow[];
  sortKey: SegmentSortKey;
  sortDir: SortDir;
  onSort: (key: SegmentSortKey) => void;
  selectedSegment: SegmentId | "all";
  onSelectSegment: (id: SegmentId | "all") => void;
  accentTextClass: string;
}) {
  const withRates = withRate(rows);
  const sorted = sortSegments(withRates, sortKey, sortDir);

  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <FilterChip active={selectedSegment === "all"} onClick={() => onSelectSegment("all")}>
          All segments
        </FilterChip>
        {SEGMENT_ORDER.map((id) => (
          <FilterChip key={id} active={selectedSegment === id} onClick={() => onSelectSegment(id)}>
            {SEGMENT_LABELS[id]}
          </FilterChip>
        ))}
      </div>

      <div className="min-w-0 overflow-x-auto lg:overflow-visible">
        <table className="w-full min-w-[360px] border-collapse text-xs lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200 dark:border-white/10">
              {COLUMNS.map((c) => {
                const active = sortKey === c.key;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ${
                      c.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={`inline-flex items-center gap-1 rounded outline-none hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-zinc-100 ${
                        c.align === "right" ? "flex-row-reverse" : ""
                      } ${active ? "text-zinc-900 dark:text-zinc-100" : ""}`}
                    >
                      {c.label}
                      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isSelected = selectedSegment === row.id;
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectSegment(isSelected ? "all" : (row.id as SegmentId))}
                  aria-selected={isSelected}
                  // Never dim rows via opacity — that silently drops text below the
                  // AA contrast floor for a "filtered" state. Selection is conveyed
                  // by background tint (color) plus the filter chip label (text) instead.
                  className={`cursor-pointer border-b border-zinc-100 transition-colors motion-reduce:transition-none last:border-0 dark:border-white/5 ${
                    isSelected
                      ? "bg-indigo-50/70 dark:bg-indigo-500/10"
                      : "hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}
                >
                  <th scope="row" className="py-1.5 pr-2 text-left font-medium text-zinc-800 dark:text-zinc-200">
                    <span className="truncate">{row.label}</span>
                  </th>
                  <td className={`whitespace-nowrap py-1.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300`}>
                    {formatInt(row.visitors)}
                  </td>
                  <td className={`whitespace-nowrap py-1.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300`}>
                    {formatInt(row.conversions)}
                  </td>
                  <td className={`whitespace-nowrap py-1.5 text-right font-semibold tabular-nums ${accentTextClass}`}>
                    {formatPct(row.rate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-6 items-center rounded-full border px-2 text-[11px] font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        active
          ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-400/40 dark:bg-indigo-500/10 dark:text-indigo-300"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}
