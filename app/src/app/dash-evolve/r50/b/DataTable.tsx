"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import { type Day, type ProviderId, PROVIDERS, buildTableRows } from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx, gradeForRate } from "./tokens";
import { Card, CardHead, GradeBadge, Segmented } from "./ui";

type SortKey = "date" | ProviderId | "blended" | "volume";
type SortDir = "asc" | "desc";
type LedgerFilter = "all" | "flagged";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "gmail", label: "Gmail" },
  { key: "outlook", label: "Outlook" },
  { key: "yahoo", label: "Yahoo" },
  { key: "other", label: "Other" },
  { key: "blended", label: "Blended" },
  { key: "volume", label: "Monitored volume" },
];

/**
 * The route's data-table fallback for the streamgraph — every number the ribbons encode, printed
 * exactly, sortable and filterable. Doubles as the visible "legend-with-values" the brief requires
 * beyond the always-on chip row above the chart.
 */
export default function DataTable({ days, windowLabel }: { days: Day[]; windowLabel: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const rows = useMemo(() => buildTableRows(days), [days]);
  const filtered = flaggedOnly ? rows.filter((r) => r.flagged) : rows;
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let av: number;
      let bv: number;
      if (sortKey === "date") {
        av = a.offset;
        bv = b.offset;
      } else if (sortKey === "blended") {
        av = a.blendedRate;
        bv = b.blendedRate;
      } else if (sortKey === "volume") {
        av = a.totalSent;
        bv = b.totalSent;
      } else {
        av = a.rates[sortKey];
        bv = b.rates[sortKey];
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  const flaggedCount = rows.filter((r) => r.flagged).length;

  return (
    <Card padded={false} className="flex h-full min-w-0 flex-col overflow-hidden">
      <div className="p-4 sm:p-5">
        <CardHead
          title="Daily placement ledger"
          Icon={Table2}
          hint={`Every day in the ${windowLabel} window, by provider. Sort any column; a day is flagged when any provider's rate drops below 85%.`}
          action={
            <Segmented<LedgerFilter>
              ariaLabel="Filter ledger rows"
              value={flaggedOnly ? "flagged" : "all"}
              onChange={(v) => setFlaggedOnly(v === "flagged")}
              options={[
                { id: "all", label: `All (${rows.length})` },
                { id: "flagged", label: `Flagged (${flaggedCount})` },
              ]}
            />
          }
        />
      </div>

      {/* --------------------------------------------------------------------- desktop table */}
      <div className="hidden min-h-0 min-w-0 flex-1 overflow-y-auto border-t border-white/10 sm:block [scrollbar-width:thin]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-zinc-900">
              <tr className="border-b border-white/10">
                {COLUMNS.map((col) => {
                  const active = sortKey === col.key;
                  const numeric = col.key !== "date";
                  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                  return (
                    <th key={col.key} scope="col" aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className={cx("whitespace-nowrap px-3 py-2 text-left", numeric && "text-right")}>
                      <button type="button" onClick={() => onSort(col.key)} className={cx("inline-flex items-center gap-1 rounded-md text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX, "hover:text-zinc-50", TRANSITION, FOCUS, numeric && "flex-row-reverse")}>
                        {col.label}
                        <Icon size={11} aria-hidden="true" className={active ? "text-lime-400" : "opacity-50"} />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.offset} className={cx("border-b border-white/[0.06]", HOVER_ROW, TRANSITION, row.flagged && "bg-rose-400/[0.04]")}>
                  <td className={cx("whitespace-nowrap px-3 py-2 font-medium", TEXT_PRIMARY)}>{row.dateLabel}</td>
                  {PROVIDERS.map((p) => (
                    <td key={p.id} className={cx("whitespace-nowrap px-3 py-2 text-right", NUM, row.rates[p.id] < 85 ? "font-medium text-amber-300" : TEXT_PRIMARY)}>
                      {row.rates[p.id]}%
                    </td>
                  ))}
                  <td className={cx("whitespace-nowrap px-3 py-2 text-right font-medium", NUM, TEXT_PRIMARY)}>{row.blendedRate}%</td>
                  <td className={cx("whitespace-nowrap px-3 py-2 text-right", NUM, TEXT_AUX)}>{row.totalSent.toLocaleString("en-US")}</td>
                </tr>
              ))}
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className={cx("px-3 py-6 text-center text-sm font-normal", TEXT_AUX)}>
                    No flagged days in this window.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------------ mobile cards */}
      <ul className={cx("min-h-0 flex-1 divide-y overflow-y-auto border-t sm:hidden [scrollbar-width:thin]", BORDER, "divide-white/[0.06]")}>
        {sorted.map((row) => {
          const grade = gradeForRate(row.blendedRate);
          return (
            <li key={row.offset} className={cx("p-3", row.flagged && "bg-rose-400/[0.04]")}>
              <div className="flex items-center justify-between gap-2">
                <span className={cx("text-sm font-medium", TEXT_PRIMARY)}>{row.dateLabel}</span>
                <span className="flex items-center gap-1.5">
                  <span className={cx("text-sm font-semibold", NUM, TEXT_PRIMARY)}>{row.blendedRate}%</span>
                  <GradeBadge grade={grade} />
                </span>
              </div>
              <dl className="mt-1.5 grid grid-cols-4 gap-1.5">
                {PROVIDERS.map((p) => (
                  <div key={p.id}>
                    <dt className={cx("text-[10px] font-medium uppercase tracking-[0.04em]", TEXT_AUX)}>{p.label}</dt>
                    <dd className={cx("text-xs font-medium", NUM, row.rates[p.id] < 85 ? "text-amber-300" : TEXT_PRIMARY)}>{row.rates[p.id]}%</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
        {sorted.length === 0 ? <li className={cx("p-6 text-center text-sm font-normal", TEXT_AUX)}>No flagged days in this window.</li> : null}
      </ul>
    </Card>
  );
}
