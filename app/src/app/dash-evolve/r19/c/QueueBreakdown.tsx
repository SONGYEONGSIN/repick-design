"use client";

import { Check } from "lucide-react";
import type { PeriodStats, QueueId, QueueMeta } from "./data";
import { formatPct } from "./data";
import { ACCENT_RING_SELECTED, ACCENT_TEXT, BAD_TEXT, BORDER, FOCUS, GOOD_TEXT, NUM, SURFACE_INSET, TEXT_AUX, TEXT_AUX_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHead } from "./ui";

/**
 * The page's ONE selection surface. Every other widget on the page reads the queue this list
 * picks through `buildDashboardView(queueId, period)` — there is no second selector anywhere
 * else on the page for the same choice, so the "which queue am I looking at" state never has
 * two independent owners to fall out of sync.
 */
export default function QueueBreakdown({
  rows,
  selectedId,
  onSelect,
}: {
  rows: { queue: QueueMeta; stats: PeriodStats }[];
  selectedId: QueueId;
  onSelect: (id: QueueId) => void;
}) {
  const tierRows = rows.filter((r) => r.queue.id !== "all");
  const maxTickets = Math.max(1, ...tierRows.map((r) => r.queue.ticketsPerDay));

  return (
    <Card id="breakdown-card" className="flex min-w-0 flex-col">
      <CardHead title="By priority queue" hint="Select a tier to recompute the headline number, the trend chart, the response times and the ticket list below for that tier alone." />

      <div role="radiogroup" aria-label="Focus a priority queue" className="mt-3 flex flex-col gap-1.5">
        {rows.map((row) => {
          const selected = row.queue.id === selectedId;
          const isAll = row.queue.id === "all";
          const barW = isAll ? 100 : Math.max(6, Math.round((row.queue.ticketsPerDay / maxTickets) * 1000) / 10);
          return (
            <button
              key={row.queue.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(row.queue.id)}
              className={cx(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left",
                TRANSITION,
                FOCUS,
                selected ? ACCENT_RING_SELECTED : cx(BORDER, "bg-white hover:bg-zinc-50"),
              )}
            >
              <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg border", selected ? "border-indigo-200 bg-white" : cx(BORDER, SURFACE_INSET))}>
                <row.queue.Icon size={15} aria-hidden="true" className={selected ? ACCENT_TEXT : TEXT_AUX_MUTED} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{row.queue.full}</span>
                  {selected ? <Check size={13} aria-hidden="true" strokeWidth={2.5} className={ACCENT_TEXT} /> : null}
                </span>
                <span aria-hidden="true" className={cx("mt-1.5 block h-1.5 w-full overflow-hidden rounded-full", SURFACE_INSET)}>
                  <span className={cx("block h-full rounded-full", isAll ? "bg-zinc-400" : "bg-indigo-400")} style={{ width: `${barW}%` }} />
                </span>
                <span className={cx("mt-1 block text-[11px] font-normal", TEXT_AUX_MUTED)}>{`${row.queue.ticketsPerDay}/day · target ${formatPct(row.queue.target)}`}</span>
              </span>

              <span className="shrink-0 text-right">
                <span className={cx("block text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatPct(row.stats.rate)}</span>
                <span className={cx("mt-0.5 block text-[11px] font-medium", row.stats.aboveTarget ? GOOD_TEXT : BAD_TEXT)}>
                  {row.stats.aboveTarget ? "On target" : "Below target"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className={cx("mt-3 border-t pt-2.5 text-[11px] font-normal leading-relaxed", BORDER, TEXT_AUX)}>
        Bars are sized against the busiest tier by daily ticket volume, so a 6/day P1 queue never draws as a rounding error next to a 31/day P3 queue.
      </p>
    </Card>
  );
}
