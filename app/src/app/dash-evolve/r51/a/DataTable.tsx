"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import { type Day, type ProviderId, PROVIDERS, buildTableRows } from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx, gradeForRate } from "./tokens";
import { Card, CardHead, GradeBadge, Segmented } from "./ui";

type SortKey = "date" | ProviderId | "blended" | "volume";
type SortDir = "asc" | "desc";
type LedgerFilter = "all" | "flagged";

const COLUMNS: { key: SortKey; label: string; widthPct: number }[] = [
  { key: "date", label: "Date", widthPct: 13 },
  { key: "gmail", label: "Gmail", widthPct: 13 },
  { key: "outlook", label: "Outlook", widthPct: 16 },
  { key: "yahoo", label: "Yahoo", widthPct: 14 },
  { key: "other", label: "Other", widthPct: 13 },
  { key: "blended", label: "Blended", widthPct: 16 },
  { key: "volume", label: "Volume", widthPct: 15 },
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
      {/*
        table-fixed + colgroup % widths, not a min-w + overflow-x-auto scroller (dash-brief-v3
        §그리드 크래프트 룰 — "데스크톱 테이블은 가로 스크롤바 금지, min-w 강제 대신 table-fixed +
        % 열 배분"). The prior `min-w-[720px]` forced this table's own scrollWidth past its
        overflow-x-auto wrapper's clientWidth at 1264-1366px (confirmed by direct measurement:
        wrapper clientWidth 622-690px at that band, table min-w pinned at 720px, independent of
        any ancestor's min-w-0 — reassign-queue #17's "min-w-0 on ancestors" fix never touched
        the actual cause). table-fixed makes the table always exactly fill its container; cells
        get a truncation safety net instead of a horizontal scrollbar.
      */}
      <div className="hidden min-h-0 min-w-0 flex-1 overflow-y-auto border-t border-white/10 sm:block [scrollbar-width:thin]">
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: `${col.widthPct}%` }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10 bg-zinc-900">
            <tr className="border-b border-white/10">
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const numeric = col.key !== "date";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={col.key} scope="col" aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className={cx("overflow-hidden px-3 py-2 text-left", numeric && "text-right")}>
                    <button type="button" onClick={() => onSort(col.key)} className={cx("inline-flex w-full items-center gap-1 overflow-hidden rounded-md text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX, "hover:text-zinc-50", TRANSITION, FOCUS, numeric && "flex-row-reverse")}>
                      <span className="truncate">{col.label}</span>
                      <Icon size={11} aria-hidden="true" className={cx("shrink-0", active ? "text-lime-400" : "opacity-50")} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.offset} className={cx("border-b border-white/[0.06]", HOVER_ROW, TRANSITION, row.flagged && "bg-rose-400/[0.04]")}>
                <td className={cx("overflow-hidden truncate px-3 py-2 font-medium", TEXT_PRIMARY)}>{row.dateLabel}</td>
                {PROVIDERS.map((p) => (
                  <td key={p.id} className={cx("overflow-hidden truncate px-3 py-2 text-right", NUM, row.rates[p.id] < 85 ? "font-medium text-amber-300" : TEXT_PRIMARY)}>
                    {row.rates[p.id]}%
                  </td>
                ))}
                <td className={cx("overflow-hidden truncate px-3 py-2 text-right font-medium", NUM, TEXT_PRIMARY)}>{row.blendedRate}%</td>
                <td className={cx("overflow-hidden truncate px-3 py-2 text-right", NUM, TEXT_AUX)}>{row.totalSent.toLocaleString("en-US")}</td>
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
