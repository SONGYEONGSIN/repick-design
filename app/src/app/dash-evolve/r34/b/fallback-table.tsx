"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Axis } from "./data";
import type { RadarSeriesInput } from "./radar-chart";

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />;
  return dir === "asc" ? (
    <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 text-lime-700" />
  ) : (
    <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 text-lime-700" />
  );
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Mandatory, always-visible fallback for the radar chart above: a plain data table carrying the
 * same raw per-axis values for every overlaid vendor. It is never hidden behind a tab or toggle
 * and re-renders immediately whenever the toggle-chip selection or reporting period changes.
 */
export function FallbackTable({
  id,
  axes,
  series,
  periodLabel,
}: {
  id: string;
  axes: Axis[];
  series: RadarSeriesInput[];
  periodLabel: string;
}) {
  const [sort, setSort] = useState<{ key: string | null; dir: "asc" | "desc" }>({
    key: null,
    dir: "asc",
  });

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: key === "axis" ? "asc" : "desc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  }

  const sortedAxes = useMemo(() => {
    if (!sort.key) return axes;
    const list = [...axes];
    if (sort.key === "axis") {
      list.sort((a, b) => a.label.localeCompare(b.label));
    } else {
      const s = series.find((s) => s.id === sort.key);
      if (s) list.sort((a, b) => s.scores[a.id] - s.scores[b.id]);
    }
    if (sort.dir === "desc") list.reverse();
    return list;
  }, [axes, series, sort]);

  const axisColPct = 30;
  const seriesColPct = series.length > 0 ? (100 - axisColPct) / series.length : 0;

  function ariaSortFor(key: string): "ascending" | "descending" | "none" {
    if (sort.key !== key) return "none";
    return sort.dir === "asc" ? "ascending" : "descending";
  }

  return (
    <div>
      <table id={id} className="w-full table-fixed border-collapse text-sm">
        <caption className="mb-3 text-left text-xs text-zinc-500">
          Raw per-axis scores (0&ndash;100) for every overlaid vendor, {periodLabel}. Click a column
          heading to sort.
        </caption>
        <colgroup>
          <col style={{ width: `${axisColPct}%` }} />
          {series.map((s) => (
            <col key={s.id} style={{ width: `${seriesColPct}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200">
            <th scope="col" aria-sort={ariaSortFor("axis")} className="py-2 pr-2 text-left align-bottom font-semibold">
              <button
                type="button"
                onClick={() => toggleSort("axis")}
                className="flex items-center gap-1 rounded text-[11px] font-semibold uppercase tracking-wide text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
              >
                Axis
                <SortIcon active={sort.key === "axis"} dir={sort.dir} />
              </button>
            </th>
            {series.map((s) => (
              <th key={s.id} scope="col" aria-sort={ariaSortFor(s.id)} className="py-2 pl-2 text-right align-bottom font-semibold">
                <button
                  type="button"
                  onClick={() => toggleSort(s.id)}
                  aria-label={`Sort by ${s.name}, currently ${ariaSortFor(s.id)}`}
                  title={s.name}
                  className="ml-auto flex w-full flex-col items-end gap-1 rounded text-right focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] text-white"
                      style={{ backgroundColor: s.style.color }}
                    >
                      {initialsFor(s.name)}
                    </span>
                    <span className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                      {s.name}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="7" viewBox="0 0 12 7" aria-hidden="true" className="shrink-0">
                      <line
                        x1="0"
                        y1="3.5"
                        x2="12"
                        y2="3.5"
                        stroke={s.style.color}
                        strokeWidth={1.8}
                        strokeDasharray={s.style.dash}
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    <SortIcon active={sort.key === s.id} dir={sort.dir} />
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedAxes.map((axis) => (
            <tr key={axis.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
              <th scope="row" className="py-2 pr-2 text-left font-semibold text-zinc-800">
                {axis.label}
              </th>
              {series.map((s) => (
                <td key={s.id} className="whitespace-nowrap py-2 pl-2 text-right tabular-nums text-zinc-900">
                  {s.scores[axis.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
