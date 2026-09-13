"use client";

/**
 * Recent Alerts Log — intentionally NOT threaded to the heatmap's pinned cell.
 * It takes no `pinned` prop at all: pinning a cell above never adds, removes, or
 * reorders a single row here, and the caption says so out loud rather than leaving
 * it implicit. This is the other half of the interaction-scope split required this
 * round — pin scopes to the KPI summary only, this table scopes to nothing but its
 * own filter and sort controls.
 */

import { ArrowDown, ArrowUp, ArrowUpDown, Unlink } from "lucide-react";
import { useMemo, useState } from "react";
import { ALERTS, SEVERITY_RANK, formatMin } from "./data";
import { BORDER, FOCUS, SEVERITY_BADGE, SEVERITY_LABEL, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx, type Severity } from "./tokens";
import { Badge } from "./ui";

type SortKey = "durationMin" | "severity";
type SeverityFilter = Severity | "all";

const SEVERITY_OPTIONS: { id: SeverityFilter; label: string }[] = [
  { id: "all", label: "All severities" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Info" },
];

function SortHeader({ label, sortKeyId, sortKey, asc, onToggle, className }: { label: string; sortKeyId: SortKey; sortKey: SortKey; asc: boolean; onToggle: (key: SortKey) => void; className?: string }) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={cx("py-2 text-left align-middle", className)}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={cx(
          "inline-flex items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-[0.06em]",
          TRANSITION,
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
          active ? "text-zinc-900" : TEXT_AUX,
        )}
      >
        {label}
        <Icon size={11} aria-hidden="true" />
      </button>
    </th>
  );
}

export default function AlertsLog() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("durationMin");
  const [asc, setAsc] = useState(false);

  const filtered = useMemo(() => (severityFilter === "all" ? ALERTS : ALERTS.filter((a) => a.severity === severityFilter)), [severityFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = sortKey === "durationMin" ? a.durationMin : SEVERITY_RANK[a.severity];
      const bv = sortKey === "durationMin" ? b.durationMin : SEVERITY_RANK[b.severity];
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [filtered, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", BORDER, "bg-zinc-50", TEXT_MUTED)}>
          <Unlink size={11} aria-hidden="true" />
          Network-wide — not filtered by the heatmap selection above
        </span>

        <label className="flex items-center gap-1.5">
          <span className="sr-only">Filter by severity</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
            className={cx("h-8 rounded-lg border bg-white px-2 text-[12px] font-medium", BORDER, TEXT_PRIMARY, FOCUS)}
          >
            {SEVERITY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 w-full overflow-x-auto">
        <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
          <caption className="sr-only">Recent excursion alerts across the monitored network</caption>
          <colgroup>
            <col className="w-[34%]" />
            <col className="hidden w-[18%] sm:table-column" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Zone
              </th>
              <th scope="col" className={cx("hidden py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] sm:table-cell", TEXT_AUX)}>
                Facility
              </th>
              <SortHeader label="Severity" sortKeyId="severity" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <SortHeader label="Duration" sortKeyId="durationMin" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className={cx("py-6 text-center text-sm font-normal", TEXT_AUX)}>
                  No alerts match this filter.
                </td>
              </tr>
            ) : null}
            {sorted.map((a) => (
              <tr key={a.id} className="hover:bg-zinc-50">
                <td className="py-2.5 pr-2 align-middle">
                  <p className={cx("truncate text-[13px] font-medium", TEXT_PRIMARY)}>{a.zone}</p>
                  <p className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{a.detected}</p>
                </td>
                <td className={cx("hidden truncate py-2.5 pr-2 align-middle text-[13px] font-normal sm:table-cell", TEXT_MUTED)}>{a.facility}</td>
                <td className="py-2.5 pr-2 align-middle">
                  <Badge className={SEVERITY_BADGE[a.severity]}>{SEVERITY_LABEL[a.severity]}</Badge>
                </td>
                <td className={cx("whitespace-nowrap py-2.5 pr-2 align-middle text-[13px] font-normal tabular-nums", TEXT_MUTED)}>{formatMin(a.durationMin)}</td>
                <td className="whitespace-nowrap py-2.5 align-middle">
                  <Badge className={STATUS_BADGE[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
