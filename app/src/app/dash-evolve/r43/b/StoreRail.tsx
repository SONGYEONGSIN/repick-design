"use client";

import { ChevronDown } from "lucide-react";
import { STORES, getStoreSummary, formatPercent, type ShrinkStatus, type StoreId } from "./data";
import { cn, FOCUS_RING, Pill } from "./ui";

const STATUS_TONE: Record<ShrinkStatus, "up" | "watch" | "down"> = {
  healthy: "up",
  watch: "watch",
  critical: "down",
};

const STATUS_LABEL: Record<ShrinkStatus, string> = {
  healthy: "Healthy",
  watch: "Watch",
  critical: "Critical",
};

function StatusPill({ status }: { status: ShrinkStatus }) {
  return <Pill tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Pill>;
}

export function StoreRail({
  selectedId,
  onSelect,
}: {
  selectedId: StoreId;
  onSelect: (id: StoreId) => void;
}) {
  return (
    <>
      {/* Desktop: vertical location list, selection = view toggle for
          every other widget on the page. */}
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-zinc-950 lg:flex">
        <div className="px-4 pb-2 pt-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Locations</p>
        </div>
        <ul className="flex-1 space-y-1 px-2 pb-4" role="list" aria-label="Locations">
          {STORES.map((store) => {
            const summary = getStoreSummary(store.id);
            const selected = store.id === selectedId;
            return (
              <li key={store.id}>
                <button
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  onClick={() => onSelect(store.id)}
                  className={cn(
                    "flex w-full flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left transition-colors motion-reduce:transition-none",
                    FOCUS_RING,
                    selected ? "bg-teal-400/10" : "hover:bg-white/5",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-sm font-medium", selected ? "text-zinc-50" : "text-zinc-200")}>
                      {store.name}
                    </span>
                    <StatusPill status={summary.status} />
                  </span>
                  <span className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                    <span className="truncate">{store.region}</span>
                    <span className="tabular-nums">{formatPercent(summary.shrinkPct)} shrink</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile / tablet: a single select — avoids a second horizontal
          scroll strip stacking on top of the table's. */}
      <div className="border-b border-white/10 bg-zinc-950 px-4 py-3 lg:hidden">
        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Location</span>
          <span className="relative mt-1.5 block">
            <select
              value={selectedId}
              onChange={(e) => onSelect(e.target.value as StoreId)}
              className={cn(
                "h-11 w-full appearance-none rounded-lg border border-white/10 bg-zinc-900 pl-3 pr-9 text-sm text-zinc-50",
                FOCUS_RING,
              )}
            >
              {STORES.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} — {store.region}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
          </span>
        </label>
      </div>
    </>
  );
}
