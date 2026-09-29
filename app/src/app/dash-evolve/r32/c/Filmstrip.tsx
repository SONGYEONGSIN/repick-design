"use client";

import { ChevronRight, Repeat2, ShieldAlert } from "lucide-react";
import {
  PATHS,
  stageById,
  pathSharePct,
  otherVariantsSharePct,
  formatCount,
  formatPct,
  formatDays,
  type PeriodId,
  type Selection,
} from "./data";
import { cx, FOCUS_RING, SegmentedControl, Badge } from "./ui";

export type PathFilter = "all" | "refunded" | "returned" | "escalation";

const FILTER_OPTIONS: { id: PathFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "refunded", label: "Refunded" },
  { id: "returned", label: "Returned" },
  { id: "escalation", label: "Via escalation" },
];

function matchesFilter(filter: PathFilter, p: (typeof PATHS)[number]): boolean {
  if (filter === "all") return true;
  if (filter === "refunded") return p.outcome === "refunded";
  if (filter === "returned") return p.outcome === "returned";
  return p.throughEscalation;
}

interface FilmstripProps {
  period: PeriodId;
  selection: Selection;
  filter: PathFilter;
  onChangeFilter: (f: PathFilter) => void;
  onPinPath: (id: string) => void;
}

export default function Filmstrip({ period, selection, filter, onChangeFilter, onPinPath }: FilmstripProps) {
  const visible = PATHS.filter((p) => matchesFilter(filter, p));
  const otherPct = otherVariantsSharePct(period);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="filmstrip-heading" className="text-[13px] font-semibold text-zinc-900">
            Top variant paths
          </h2>
          <p className="mt-0.5 text-[11.5px] text-zinc-500">
            The most common sequences a case actually follows. This filter only changes which rows appear here — it never changes the pinned selection above.
          </p>
        </div>
        <SegmentedControl label="Filter paths by outcome" options={FILTER_OPTIONS} value={filter} onChange={onChangeFilter} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((p) => {
          const isPinned = selection?.kind === "path" && selection.id === p.id;
          const share = pathSharePct(p, period);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPinPath(p.id)}
              aria-pressed={isPinned}
              className={cx(
                "flex min-w-0 flex-col gap-2 rounded-lg border p-3 text-left transition-colors",
                FOCUS_RING,
                isPinned ? "border-amber-500 bg-amber-50 shadow-sm shadow-amber-900/5" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[12.5px] font-semibold text-zinc-900">{p.label}</span>
                <span className={cx("shrink-0 text-[13px] font-semibold tabular-nums", isPinned ? "text-amber-700" : "text-zinc-900")}>{formatPct(share, 0)}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10.5px] text-zinc-500">
                {p.stages.map((sid, i) => (
                  <span key={`${sid}-${i}`} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight aria-hidden className="h-2.5 w-2.5 text-zinc-300" />}
                    <span className={i === p.stages.length - 1 ? "font-medium text-zinc-700" : undefined}>{stageById(sid).short}</span>
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone={p.outcome === "refunded" ? "emerald" : "rose"}>{p.outcome === "refunded" ? "Refunded" : "Returned to seller"}</Badge>
                {p.throughEscalation && (
                  <Badge tone="neutral">
                    <ShieldAlert aria-hidden className="h-3 w-3" />
                    Escalated
                  </Badge>
                )}
                {p.hasLoop && (
                  <Badge tone="amber" className="border border-amber-300">
                    <Repeat2 aria-hidden className="h-3 w-3" />
                    Loop
                  </Badge>
                )}
              </div>

              <p className="text-[11px] text-zinc-500">
                <span className="font-medium tabular-nums text-zinc-700">{formatCount(p.volume[period])}</span> cases · avg{" "}
                <span className="font-medium tabular-nums text-zinc-700">{formatDays(p.avgDurationDays[period])}</span> end-to-end
              </p>
            </button>
          );
        })}
        {visible.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-[12.5px] text-zinc-500">No paths match this filter.</p>
        )}
      </div>

      <p className="mt-2.5 text-[11px] text-zinc-500">
        Top {PATHS.length} variants shown · {formatPct(otherPct, 1)} of cases follow other, rarer paths not pictured.
      </p>
    </div>
  );
}
