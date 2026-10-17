"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { Anomaly, MetricId, Severity } from "./data";
import { formatValue } from "./format";
import { SEVERITY_STYLE } from "./ui";

type SortKey = "label" | "value" | "severity" | "service";
type SortDir = "asc" | "desc";

const SEVERITY_RANK: Record<Severity, number> = { minor: 1, moderate: 2, severe: 3 };

const COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: "label", label: "Timestamp", width: "30%" },
  { key: "value", label: "Reading", width: "22%" },
  { key: "severity", label: "Severity", width: "22%" },
  { key: "service", label: "Service", width: "26%" },
];

/**
 * The secondary data table this round's brief calls for. It shares the
 * metric+range the hero chart is showing, but it does NOT read which
 * single anomaly is hovered/selected — it always lists every anomaly in
 * the current view, so it is a companion legend, not a reactive detail
 * pane keyed to one point.
 */
export function AnomalyTable({ metric, anomalies }: { metric: MetricId; anomalies: Anomaly[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("label");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const sorted = [...anomalies].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "label") cmp = a.index - b.index;
      else if (sortKey === "value") cmp = a.value - b.value;
      else if (sortKey === "severity") cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      else cmp = a.service.localeCompare(b.service);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [anomalies, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (anomalies.length === 0) {
    return <p className="text-sm font-normal text-zinc-400">No anomalies flagged in this view.</p>;
  }

  return (
    <table className="w-full table-fixed border-collapse text-left">
      <caption className="mb-2 text-left text-sm font-semibold text-zinc-50">
        Flagged anomalies in this view
      </caption>
      <colgroup>
        {COLUMNS.map((c) => (
          <col key={c.key} style={{ width: c.width }} />
        ))}
      </colgroup>
      <thead>
        <tr className="border-b border-white/10">
          {COLUMNS.map((c) => {
            const active = sortKey === c.key;
            const ariaSort: "ascending" | "descending" | "none" = active
              ? sortDir === "asc"
                ? "ascending"
                : "descending"
              : "none";
            return (
              <th key={c.key} scope="col" aria-sort={ariaSort} className="py-2 pr-2">
                <button
                  type="button"
                  onClick={() => toggleSort(c.key)}
                  className="inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 outline-offset-2 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  {c.label}
                  {active ? (
                    sortDir === "asc" ? (
                      <ChevronUp className="h-3 w-3 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3 w-3 shrink-0" aria-hidden="true" />
                    )
                  ) : (
                    <ChevronsUpDown className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
                  )}
                </button>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((a) => {
          const style = SEVERITY_STYLE[a.severity];
          const Icon = style.icon;
          return (
            <tr key={a.index} className="border-b border-white/5 last:border-0">
              <td className="truncate py-2 pr-2 text-[11px] font-normal tabular-nums text-zinc-50">{a.label}</td>
              <td className="truncate py-2 pr-2 text-[11px] font-normal tabular-nums text-zinc-50">
                {formatValue(metric, a.value)}
              </td>
              <td className="truncate py-2 pr-2 text-[11px] font-normal">
                <span className={`inline-flex items-center gap-1 ${style.text}`}>
                  <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {style.word}
                </span>
              </td>
              <td className="truncate py-2 pr-2 font-mono text-[11px] font-normal text-zinc-400">{a.service}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
