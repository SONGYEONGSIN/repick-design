import { ArrowLeftRight } from "lucide-react";
import type { Listing } from "./data";
import type { Comparison } from "./compare";

interface DiffTableProps {
  comparison: Comparison;
  listingA: Listing;
  listingB: Listing;
}

// The live diff panel: every row below is computed from `comparison`, which
// is itself produced by the one shared `compare()` function in compare.ts.
// Nothing here is a hand-typed, position-dependent string.
export function DiffTable({ comparison, listingA, listingB }: DiffTableProps) {
  return (
    <div className="rounded-2xl border border-[#F1EDE8] bg-white p-5 sm:p-7">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-[#F1EDE8] pb-4">
        <p className="min-w-0 truncate text-sm font-semibold text-[#171311]">
          {listingA.title}
        </p>
        <p className="min-w-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6560]">
          vs.
        </p>
        <p className="min-w-0 truncate text-right text-sm font-semibold text-[#171311]">
          {listingB.title}
        </p>
      </div>

      <div className="flex flex-col">
        {comparison.rows.map(({ row, better, delta }) => (
          <div
            key={row.key}
            className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-[#F1EDE8] py-3.5 last:border-0"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6560]">
                {row.label}
              </p>
              <p
                className={`mt-0.5 text-base font-semibold tracking-[0.12em] ${
                  better === "a" ? "text-[#171311]" : "text-[#6B6560]"
                }`}
              >
                {row.formatValue(listingA)}
                {better === "a" ? <span className="ml-1.5 text-[11px] font-semibold text-[#B8410A]">leads</span> : null}
              </p>
            </div>

            <div className="min-w-0 text-center text-[11px] font-semibold tracking-[0.16em] text-[#534E49]">
              {delta}
            </div>

            <div className="min-w-0 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6560]">
                {row.label}
              </p>
              <p
                className={`mt-0.5 text-base font-semibold tracking-[0.12em] ${
                  better === "b" ? "text-[#171311]" : "text-[#6B6560]"
                }`}
              >
                {better === "b" ? <span className="mr-1.5 text-[11px] font-semibold text-[#B8410A]">leads</span> : null}
                {row.formatValue(listingB)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-xl bg-[#F1EDE8] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-[#B8410A]" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#534E49]">
            Composite value score
          </p>
        </div>
        {comparison.compositeBetter === "tie" ? (
          <p className="text-lg font-extrabold tracking-[-0.02em] text-[#171311]">
            Dead heat — 0.0 pts apart
          </p>
        ) : (
          <p className="text-lg font-extrabold tracking-[-0.02em] text-[#171311]">
            {comparison.compositeBetter === "a" ? listingA.title : listingB.title}{" "}
            wins by {comparison.compositeDelta.toFixed(1)} pts
          </p>
        )}
      </div>
    </div>
  );
}
