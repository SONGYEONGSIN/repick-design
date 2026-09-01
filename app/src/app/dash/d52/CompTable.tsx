"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, TrendingDown, TrendingUp } from "lucide-react";
import type { Comp } from "./data";
import { fmtCompact, fmtSignedPct } from "./format";
import { StatusBadge } from "./ui/Badge";
import { FOCUS_RING } from "./ui/focus";

type SortKey = "price" | "delta" | "grade";
type SortDir = "asc" | "desc";

const SOURCE_INITIAL: Record<string, string> = {
  eBay: "eB",
  KEH: "KH",
  MPB: "MP",
  Chrono24: "C2",
  WatchBox: "WB",
  StockX: "SX",
  GOAT: "GT",
  Fashionphile: "FP",
  "The RealReal": "RR",
};

function SourceAvatar({ source }: { source: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-semibold tracking-tight text-zinc-300"
    >
      {SOURCE_INITIAL[source] ?? source.slice(0, 2).toUpperCase()}
    </span>
  );
}

// Column widths are set from measured worst-case content, not evenly split: at the panel's
// narrowest real width (~328px of usable table area inside the 360px fixed rail), "Δ Avg" plus its
// sort icon is the widest header, and "eBay"/status-badge pairing is the widest body cell — the
// 34/22/22/22 split gives each sortable header ~56px after cell padding, enough for label + icon
// without wrapping, while Listing keeps enough room for a 24px avatar + truncated source name.
const COLS: { key: SortKey; label: string; width: string }[] = [
  { key: "price", label: "Price", width: "22%" },
  { key: "delta", label: "Δ Avg", width: "22%" },
  { key: "grade", label: "Grade", width: "22%" },
];

/**
 * Sortable comp-listings table. `vs. avg` is the axis explicitly encoded with the second accent:
 * teal marks a comp priced BELOW repick's current average (a competitive undercut worth reviewing);
 * plain zinc marks at-or-above. Direction is also carried by the trending icon, so color is never
 * the only signal.
 */
export function CompTable({ comps, repickAvg }: { comps: Comp[]; repickAvg: number }) {
  const [sortKey, setSortKey] = useState<SortKey>("delta");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const withDelta = comps.map((c) => ({ ...c, delta: (c.price - repickAvg) / repickAvg }));
    const sorted = [...withDelta].sort((a, b) => {
      const va = sortKey === "price" ? a.price : sortKey === "delta" ? a.delta : a.gradeConfidence;
      const vb = sortKey === "price" ? b.price : sortKey === "delta" ? b.delta : b.gradeConfidence;
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return sorted;
  }, [comps, repickAvg, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "grade" ? "desc" : "asc");
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-white/10">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">External marketplace comps for the pinned item, sortable by price, delta versus repick average, and AI grading confidence.</caption>
        <colgroup>
          <col style={{ width: "34%" }} />
          {COLS.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="bg-zinc-800/60">
            <th scope="col" className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide text-zinc-400">
              Listing
            </th>
            {COLS.map((c) => {
              const active = sortKey === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className="px-1.5 py-2 text-right text-[10.5px] font-semibold uppercase tracking-wide text-zinc-400"
                >
                  <button
                    onClick={() => toggleSort(c.key)}
                    className={`inline-flex items-center gap-0.5 rounded ${FOCUS_RING} ${active ? "text-zinc-100" : "hover:text-zinc-200"}`}
                  >
                    {c.label}
                    {active ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="h-3 w-3" aria-hidden="true" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const below = row.delta < 0;
            return (
              <tr key={row.id} className="border-t border-white/5 transition-colors hover:bg-white/[0.03]">
                <td className="px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <SourceAvatar source={row.source} />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-zinc-100">{row.source}</p>
                      <StatusBadge status={row.status} />
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-right align-top text-[12.5px] tabular-nums text-zinc-100">
                  {fmtCompact(row.price)}
                </td>
                <td className="px-2 py-2.5 text-right align-top">
                  <span
                    className={`inline-flex items-center gap-0.5 text-[12px] tabular-nums ${
                      below ? "text-teal-300" : "text-zinc-400"
                    }`}
                  >
                    {below ? (
                      <TrendingDown className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    )}
                    {fmtSignedPct(row.delta)}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right align-top">
                  <p className="text-[12.5px] font-medium text-zinc-100">{row.conditionGrade}</p>
                  <p className="text-[10.5px] tabular-nums text-zinc-400">{Math.round(row.gradeConfidence * 100)}% conf.</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* One short line, deliberately — this table lives in a ~330px rail at every breakpoint
          (fixed-width desktop panel, or a similarly narrow full-width mobile stack), so footer
          copy is kept to content that still fits on a single line at that width. */}
      <div className="border-t border-white/5 bg-zinc-900/60 px-3 py-2">
        <p className="truncate text-[10.5px] text-zinc-400">{rows.length} comps tracked</p>
      </div>
    </div>
  );
}
