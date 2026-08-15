import { Plus } from "lucide-react";
import { STAGE_ORDER, stageMeta, type Deal, type Stage } from "./data";
import { formatKRWCompact } from "./format";
import { DealCard } from "./deal-card";

/**
 * Kanban board — the centerpiece of this screen.
 * Four stage columns lay out horizontally; each column is a vertical card stack with internal scroll (lg).
 * On desktop (≥1280), flex-1 distributes the four columns evenly so they fit without horizontal scroll.
 */
export function Board({ grouped }: { grouped: Record<Stage, Deal[]> }) {
  return (
    <div className="flex h-full min-h-0 gap-4 overflow-x-auto pb-1 [scrollbar-width:thin]">
      {STAGE_ORDER.map((stage) => (
        <BoardColumn key={stage} stage={stage} deals={grouped[stage]} />
      ))}
    </div>
  );
}

function BoardColumn({ stage, deals }: { stage: Stage; deals: Deal[] }) {
  const meta = stageMeta[stage];
  const sum = deals.reduce((acc, d) => acc + d.amount, 0);
  const headingId = `col-${stage}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex w-[300px] shrink-0 flex-col rounded-xl border border-zinc-200 bg-zinc-50/70 lg:w-auto lg:min-w-0 lg:flex-1 lg:basis-0"
    >
      {/* Column header — stage, count, and sum (per-column totals) */}
      <div className="shrink-0 rounded-t-xl border-b border-zinc-200 bg-white px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dotClass}`} aria-hidden="true" />
            <h2 id={headingId} className="truncate text-sm font-semibold text-zinc-900">
              {meta.label}
            </h2>
            <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-600 tabular-nums">
              {deals.length}
            </span>
          </div>
          <span className="shrink-0 text-xs font-medium text-zinc-500 tabular-nums">
            {formatKRWCompact(sum)}
          </span>
        </div>
        <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className={`h-full ${meta.accentClass}`} style={{ width: deals.length ? "100%" : "0%" }} />
        </div>
      </div>

      {/* Card stack — internal scroll on lg (thin scrollbar), natural expansion on mobile */}
      <div className="flex flex-col gap-2.5 p-2.5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-width:thin]">
        {deals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
            No deals match the current filters.
          </p>
        ) : (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        )}
        <button
          type="button"
          className="mt-0.5 flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 text-xs font-medium text-zinc-500 transition-colors hover:border-blue-400 hover:bg-white hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add deal
        </button>
      </div>
    </section>
  );
}
