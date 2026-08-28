"use client";

import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Gauge } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { COHORT_ROWS, formatInt, formatPct, formatUsd } from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, PANEL_BG, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

const ARPA_USD = 84;

type SortKey = "start" | "active" | "retention" | "mrr";
type SortDir = "asc" | "desc";
type Filter = "all" | "risk" | "healthy";

const COLS: { key: SortKey; label: string }[] = [
  { key: "start", label: "Starting" },
  { key: "active", label: "Active now" },
  { key: "retention", label: "Retention" },
  { key: "mrr", label: "MRR retained" },
];

function statusOf(pct: number): { label: string; className: string; Icon: typeof CheckCircle2 } {
  if (pct < 60) return { label: "At risk", className: "border-rose-800/60 bg-rose-950/40 text-rose-300", Icon: AlertTriangle };
  if (pct < 75) return { label: "Watch", className: "border-amber-800/60 bg-amber-950/30 text-amber-300", Icon: Gauge };
  return { label: "Healthy", className: "border-emerald-800/60 bg-emerald-950/30 text-emerald-300", Icon: CheckCircle2 };
}

export default function SegmentTable() {
  const [sortKey, setSortKey] = useState<SortKey>("retention");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const withDerived = COHORT_ROWS.map((r) => ({
      row: r,
      start: r.startCount,
      active: r.active[r.elapsed],
      retention: r.pct[r.elapsed],
      mrr: Math.round(r.active[r.elapsed] * r.expansion * ARPA_USD),
    }));
    const filtered = withDerived.filter((d) => {
      if (filter === "risk") return d.retention < 60;
      if (filter === "healthy") return d.retention >= 75;
      return true;
    });
    const sorted = [...filtered].sort((a, b) => (a[sortKey] - b[sortKey]) * (sortDir === "asc" ? 1 : -1));
    return sorted;
  }, [sortKey, sortDir, filter]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const totalMrr = rows.reduce((s, r) => s + r.mrr, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx("text-xs font-normal leading-relaxed", TEXT_AUX)}>{`${rows.length} of ${COHORT_ROWS.length} cohorts · ${formatUsd(totalMrr)} MRR in view`}</p>
        <div role="group" aria-label="Filter cohorts by health" className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
          {([
            { id: "all", label: "All" },
            { id: "healthy", label: "Healthy" },
            { id: "risk", label: "At risk" },
          ] as { id: Filter; label: string }[]).map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cx("h-8 rounded-md px-2.5 text-xs", TRANSITION, FOCUS, filter === f.id ? "bg-rose-700 font-semibold text-white" : cx("font-medium", TEXT_AUX, "hover:bg-white/[0.06] hover:text-zinc-50"))}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Percentage-column table-fixed, no horizontal scroll at any width — the two lowest-priority
          numeric columns (Starting, Active now) drop below `sm` instead of forcing a scroller, per
          the catalog's established mobile-table pattern (see OrderTable in the sibling r19 build). */}
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full table-fixed text-sm">
          <caption className="sr-only">Cohorts sorted and filtered by retention health</caption>
          <colgroup>
            <col className="w-[46%] sm:w-[30%]" />
            <col className="hidden sm:table-column sm:w-[14%]" />
            <col className="hidden sm:table-column sm:w-[14%]" />
            <col className="w-[27%] sm:w-[20%]" />
            <col className="w-[27%] sm:w-[22%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER, PANEL_BG)}>
              <th scope="col" className={cx("px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Cohort
              </th>
              {COLS.map((c) => {
                const sorted = sortKey === c.key;
                const Icon = sorted ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                const mobileHidden = c.key === "start" || c.key === "active";
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={sorted ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className={cx("px-1 py-1 text-right", mobileHidden && "hidden sm:table-cell")}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cx("inline-flex h-8 w-full items-center justify-end gap-1 rounded-md px-2 text-[11px] font-medium uppercase tracking-[0.06em]", TRANSITION, FOCUS, sorted ? "text-rose-300" : cx(TEXT_AUX, "hover:text-zinc-50"))}
                    >
                      {c.label}
                      <Icon size={12} aria-hidden="true" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map(({ row, start, active, retention, mrr }) => {
              const status = statusOf(retention);
              return (
                <tr key={row.id} className={cx(HOVER_ROW, TRANSITION)}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={`https://images.unsplash.com/photo-${row.owner.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 shrink-0 rounded-full bg-white/5 object-cover"
                      />
                      <div className="min-w-0">
                        <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{row.label}</p>
                        <p className={cx("hidden truncate text-[11px] font-normal sm:block", TEXT_AUX)}>{row.note}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cx("hidden px-2 py-2.5 text-right text-sm font-normal sm:table-cell", NUM, TEXT_PRIMARY)}>{formatInt(start)}</td>
                  <td className={cx("hidden px-2 py-2.5 text-right text-sm font-normal sm:table-cell", NUM, TEXT_PRIMARY)}>{formatInt(active)}</td>
                  <td className="px-2 py-2.5 text-right">
                    <span className={cx("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap", status.className)}>
                      <status.Icon size={11} aria-hidden="true" />
                      <span className={NUM}>{formatPct(retention)}</span>
                      <span className="sr-only">{`— ${status.label}`}</span>
                    </span>
                  </td>
                  <td className={cx("px-3 py-2.5 text-right text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatUsd(mrr)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
