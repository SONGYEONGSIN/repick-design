"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EDGES_BY_STRENGTH_DESC, needById, productById, type NeedId, type ProductId } from "./data";
import { ACCENT_BASE, FOCUS } from "./ui";

type SortDir = "desc" | "asc";

/**
 * Network/constellation graphs are accessibility-poor by nature (A11y-D-grade chart type), so this
 * table is the parallel reading path: every need-to-listing connection, as plain text, always
 * rendered (not behind a toggle or accordion) -- visually secondary to the graph above it, but
 * structurally equal. Sorting by match % is its own interaction: a semantic, aria-sort-correct
 * table, not a decorative one.
 */
export default function MatchTable({
  activeNeedId,
  activeProductId,
  onSelectPair,
}: {
  activeNeedId: NeedId;
  activeProductId: ProductId;
  onSelectPair: (needId: NeedId, productId: ProductId) => void;
}) {
  const [dir, setDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const sorted = [...EDGES_BY_STRENGTH_DESC];
    if (dir === "asc") sorted.reverse();
    return sorted;
  }, [dir]);

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="border-b border-zinc-800 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400" style={{ backgroundColor: "#131318" }}>
          Full match list — every need-to-listing connection on this page, as text
        </caption>
        {/* Percentages re-balanced (and td padding tightened from px-4 to px-3) specifically for
            390px: at that width the table is ~348px, so each column's content-box (after padding)
            is col% * 348 - 24px. Need 22% -> ~53px content box, enough to wrap "Ships fast" onto
            two short lines; Match % 16% -> ~32px, enough for the header's icon + wrapped label.
            Every button below is `w-full` (not shrink-to-fit) specifically so it respects that
            content-box width and wraps instead of overflowing past it -- a shrink-to-fit button
            (the original bug) sizes to its *unwrapped* text width and visually spills into the
            next cell instead of wrapping, which is what produced the cell-overlap failures. */}
        <colgroup>
          <col style={{ width: "22%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Need
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Listing
            </th>
            <th scope="col" aria-sort={dir === "desc" ? "descending" : "ascending"} className="px-1.5 py-2.5 font-semibold">
              <button
                type="button"
                onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))}
                className={`flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-0.5 rounded px-1 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 hover:text-zinc-200 ${FOCUS}`}
              >
                <span className="whitespace-normal break-words">Match %</span>
                {dir === "desc" ? (
                  <ChevronDown className="h-3 w-3 flex-none" aria-hidden="true" strokeWidth={2.5} />
                ) : (
                  <ChevronUp className="h-3 w-3 flex-none" aria-hidden="true" strokeWidth={2.5} />
                )}
              </button>
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              Why this match
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => {
            const isActive = e.needId === activeNeedId && e.productId === activeProductId;
            return (
              <tr
                key={`${e.needId}-${e.productId}`}
                className="border-b border-zinc-800 text-[13px] leading-[1.5] text-zinc-300 last:border-b-0"
                style={isActive ? { backgroundColor: "#1a1f0d" } : undefined}
              >
                <td className="px-3 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => onSelectPair(e.needId, e.productId)}
                    className={`block w-full whitespace-normal break-words rounded py-1 text-left font-semibold text-zinc-100 hover:underline ${FOCUS}`}
                  >
                    {needById(e.needId).label}
                  </button>
                </td>
                <td className="px-3 py-3 align-top whitespace-normal break-words">{productById(e.productId).name}</td>
                <td className="px-3 py-3 align-top text-center font-semibold tabular-nums" style={{ color: ACCENT_BASE }}>
                  {e.strength}%
                </td>
                <td className="px-3 py-3 align-top whitespace-normal break-words text-zinc-400">{e.reason}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
