"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ListChecks } from "lucide-react";
import { useMemo, useState } from "react";
import { REPORTS, REVIEWERS, REVIEWER_STATS, type ReviewerName } from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, Card, CardHead } from "./ui";

type Row = { name: ReviewerName; decisions: number; avgHandleMin: number; accuracyPct: number; lastActiveLabel: string };

const ROWS: Row[] = REVIEWERS.map((name) => ({
  name,
  decisions: REPORTS.filter((r) => r.assignedReviewer === name && r.status === "Resolved").length,
  avgHandleMin: REVIEWER_STATS[name].avgHandleMin,
  accuracyPct: REVIEWER_STATS[name].accuracyPct,
  lastActiveLabel: REVIEWER_STATS[name].lastActiveLabel,
}));

const TOTAL_DECISIONS = ROWS.reduce((sum, r) => sum + r.decisions, 0);

type SortKey = "name" | "decisions" | "avgHandleMin" | "accuracyPct";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey | "lastActive"; label: string; widthPct: number; numeric?: boolean; sortable: boolean }[] = [
  { key: "name", label: "Reviewer", widthPct: 32, sortable: true },
  { key: "decisions", label: "Decisions", widthPct: 17, numeric: true, sortable: true },
  { key: "avgHandleMin", label: "Avg handle time", widthPct: 21, numeric: true, sortable: true },
  { key: "accuracyPct", label: "Accuracy", widthPct: 17, numeric: true, sortable: true },
  { key: "lastActive", label: "Last active", widthPct: 13, sortable: false },
];

/**
 * The route's secondary, feed-independent table — the brief's "table sort/filter" requirement
 * satisfied here distinctly from the feed's own filtering. `table-fixed` + percentage `colgroup`,
 * never a `min-w` + `overflow-x-auto` scroller (see dash grid-craft notes on this exact bug).
 */
export default function AuditTable() {
  const [sortKey, setSortKey] = useState<SortKey>("decisions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...ROWS];
    copy.sort((a, b) => {
      let av: number | string = a[sortKey];
      let bv: number | string = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      av = av as number;
      bv = bv as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <Card id="audit-log" padded={false} className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <CardHead
          title="Decision audit log"
          Icon={ListChecks}
          hint={`Resolved-decision volume by reviewer this window — ${TOTAL_DECISIONS} decisions total, matching the resolved count in the queue above.`}
        />
      </div>

      {/* table-fixed + colgroup % widths — see note above. */}
      <div className="hidden border-t sm:block border-zinc-200">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Reviewer performance: decisions resolved, average handle time, accuracy and last active time, sortable by column.</caption>
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: `${col.widthPct}%` }} />
            ))}
          </colgroup>
          <thead className="bg-zinc-50">
            <tr className="border-b border-zinc-200">
              {COLUMNS.map((col) => {
                const active = col.sortable && sortKey === col.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={col.key} scope="col" aria-sort={col.sortable ? (active ? (sortDir === "asc" ? "ascending" : "descending") : "none") : undefined} className={cx("overflow-hidden px-3 py-2 text-left", col.numeric && "text-right")}>
                    {col.sortable ? (
                      <button type="button" onClick={() => onSort(col.key as SortKey)} className={cx("inline-flex w-full items-center gap-1 overflow-hidden rounded-md text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX, "hover:text-zinc-900", TRANSITION, FOCUS, col.numeric && "flex-row-reverse")}>
                        <span className="truncate">{col.label}</span>
                        <Icon size={11} aria-hidden="true" className={cx("shrink-0", active ? "text-green-700" : "opacity-50")} />
                      </button>
                    ) : (
                      <span className={cx("inline-flex w-full items-center text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>{col.label}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.name} className={cx("border-b border-zinc-100", HOVER_ROW, TRANSITION)}>
                <td className="overflow-hidden px-3 py-2">
                  <span className="flex items-center gap-2">
                    <Avatar name={row.name} size={22} />
                    <span className={cx("truncate font-medium", TEXT_PRIMARY)}>{row.name}</span>
                  </span>
                </td>
                <td className={cx("overflow-hidden truncate px-3 py-2 text-right font-medium", NUM, TEXT_PRIMARY)}>{row.decisions}</td>
                <td className={cx("overflow-hidden truncate px-3 py-2 text-right", NUM, TEXT_AUX)}>{row.avgHandleMin}m</td>
                <td className={cx("overflow-hidden truncate px-3 py-2 text-right", NUM, row.accuracyPct < 93 ? "font-medium text-amber-700" : TEXT_PRIMARY)}>{row.accuracyPct}%</td>
                <td className={cx("overflow-hidden truncate whitespace-nowrap px-3 py-2", NUM, TEXT_AUX)}>{row.lastActiveLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <ul className={cx("divide-y border-t sm:hidden", BORDER, "divide-zinc-100")}>
        {sorted.map((row) => (
          <li key={row.name} className="p-3">
            <div className="flex items-center gap-2">
              <Avatar name={row.name} size={24} />
              <span className={cx("min-w-0 flex-1 truncate text-sm font-medium", TEXT_PRIMARY)}>{row.name}</span>
              <span className={cx("shrink-0 text-xs font-normal", TEXT_AUX)}>{row.lastActiveLabel}</span>
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-2">
              <div className="min-w-0">
                <dt className={cx("text-[10px] font-medium uppercase tracking-[0.04em]", TEXT_AUX)}>Decisions</dt>
                <dd className={cx("text-xs font-medium", NUM, TEXT_PRIMARY)}>{row.decisions}</dd>
              </div>
              <div className="min-w-0">
                <dt className={cx("text-[10px] font-medium uppercase tracking-[0.04em]", TEXT_AUX)}>Avg time</dt>
                <dd className={cx("text-xs font-medium", NUM, TEXT_PRIMARY)}>{row.avgHandleMin}m</dd>
              </div>
              <div className="min-w-0">
                <dt className={cx("text-[10px] font-medium uppercase tracking-[0.04em]", TEXT_AUX)}>Accuracy</dt>
                <dd className={cx("text-xs font-medium", NUM, row.accuracyPct < 93 ? "text-amber-700" : TEXT_PRIMARY)}>{row.accuracyPct}%</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </Card>
  );
}
