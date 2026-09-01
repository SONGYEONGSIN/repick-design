"use client";

import { Pin, TriangleAlert } from "lucide-react";
import type { WatchItem } from "./data";
import { CompTable } from "./CompTable";
import { FOCUS_RING } from "./ui/focus";

/**
 * Right panel. Deliberately reads from `pinnedItem`, not `activeItem` — see the comment on
 * `onPin` in `client.tsx`. Clicking a different watchlist row moves `activeItem` (and with it the
 * center chart) immediately, but this panel's expensive-to-refresh comp feed only follows once the
 * analyst explicitly presses "Pin comps here."
 */
export function CompFeedPanel({
  activeItem,
  pinnedItem,
  onPin,
}: {
  activeItem: WatchItem;
  pinnedItem: WatchItem;
  onPin: () => void;
}) {
  const repickAvg = pinnedItem.series[pinnedItem.series.length - 1].repick;
  const belowCount = pinnedItem.comps.filter((c) => c.price < repickAvg).length;
  const outOfSync = activeItem.id !== pinnedItem.id;

  return (
    <section aria-labelledby="comp-feed-heading" className="flex h-full min-w-0 flex-col">
      <div className="px-4 pt-4">
        <h2 id="comp-feed-heading" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Comp feed
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <p className="min-w-0 truncate text-[14px] font-medium text-zinc-100">{pinnedItem.shortName}</p>
          <span className="flex items-center gap-1 text-amber-300">
            <Pin className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-zinc-400">
          {belowCount} of {pinnedItem.comps.length} comps priced below repick avg
        </p>
      </div>

      {outOfSync && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-2.5">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] text-zinc-300">
              Chart is showing <span className="font-medium text-zinc-100">{activeItem.shortName}</span>, but the comp
              feed is still pinned to <span className="font-medium text-zinc-100">{pinnedItem.shortName}</span>.
            </p>
            <button
              onClick={onPin}
              className={`mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-2.5 py-1 text-[11.5px] font-semibold text-zinc-950 transition-opacity hover:opacity-90 ${FOCUS_RING}`}
            >
              <Pin className="h-3 w-3" aria-hidden="true" />
              Pin comps to {activeItem.shortName}
            </button>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3">
        <CompTable comps={pinnedItem.comps} repickAvg={repickAvg} />
      </div>
    </section>
  );
}
