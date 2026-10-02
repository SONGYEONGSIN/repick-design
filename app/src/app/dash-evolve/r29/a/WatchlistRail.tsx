"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import { Card, SectionLabel, Tabs, ChangeReadout, Sparkline, FOCUS_RING } from "./ui";
import { LOTS, STATUS_META, STATUS_COUNTS, TOTAL_LOTS, currencyFmt, countFmt, type Lot } from "./data";

/** The trader's personal watchlist — a fixed subset of the desk's lots. */
const WATCH_IDS = ["lot-01", "lot-02", "lot-03", "lot-05", "lot-06", "lot-09"];

export function WatchlistRail({ pinnedId, onPin }: { pinnedId: string; onPin: (id: string) => void }) {
  const [tab, setTab] = useState<"watching" | "all">("watching");
  const lots = tab === "watching" ? LOTS.filter((l) => WATCH_IDS.includes(l.id)) : LOTS;

  return (
    <aside className="w-full shrink-0 lg:w-[288px]">
      <div className="lg:sticky lg:top-[88px]">
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 pt-4">
            <div>
              <SectionLabel as="h2">Watchlist</SectionLabel>
              <p className="mt-0.5 text-sm font-normal text-zinc-400">Click a lot to pin it to the desk pane.</p>
              <p className="mt-1 text-xs font-normal tabular-nums text-zinc-400">
                {countFmt.format(TOTAL_LOTS)} lots on desk &middot; {countFmt.format(STATUS_COUNTS.active)} active &middot;{" "}
                {countFmt.format(STATUS_COUNTS.review + STATUS_COUNTS.reserved)} in review &middot; {countFmt.format(STATUS_COUNTS.closed)} closed
              </p>
            </div>
          </div>
          <div className="mt-3 px-4">
            <Tabs
              label="Watchlist filter"
              idPrefix="watchlist"
              value={tab}
              onChange={(v) => setTab(v as "watching" | "all")}
              options={[
                { value: "watching", label: "Watching" },
                { value: "all", label: "All lots" },
              ]}
            />
          </div>
          <ul
            id="watchlist-panel"
            role="tabpanel"
            aria-labelledby={`watchlist-tab-${tab}`}
            className="max-h-[560px] divide-y divide-white/5 overflow-y-auto lg:max-h-[calc(100vh-260px)]"
          >
            {lots.map((lot) => (
              <WatchlistRow key={lot.id} lot={lot} pinned={lot.id === pinnedId} onPin={onPin} />
            ))}
          </ul>
        </Card>
      </div>
    </aside>
  );
}

function WatchlistRow({ lot, pinned, onPin }: { lot: Lot; pinned: boolean; onPin: (id: string) => void }) {
  const meta = STATUS_META[lot.status];
  const sparkTone = lot.dayChangePct > 0.05 ? "emerald" : lot.dayChangePct < -0.05 ? "rose" : "zinc";

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => onPin(lot.id)}
        aria-pressed={pinned}
        className={`block w-full px-4 py-3 text-left transition-colors motion-reduce:transition-none hover:bg-white/[0.04] ${FOCUS_RING} ${
          pinned ? "bg-indigo-500/[0.08]" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {pinned && <Pin aria-hidden="true" className="h-3 w-3 shrink-0 text-indigo-300" />}
              <span className="truncate text-xs font-medium text-zinc-400">{lot.code}</span>
            </div>
            <p className="mt-0.5 truncate text-sm font-medium text-zinc-50">{lot.title}</p>
          </div>
          <Sparkline values={lot.sparkline} tone={sparkTone} />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-medium tabular-nums text-zinc-50">{currencyFmt.format(lot.currentPrice)}</span>
          <ChangeReadout pct={lot.dayChangePct} className="text-xs" />
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <meta.icon aria-hidden="true" className={`h-3 w-3 shrink-0 ${meta.text}`} />
          <span className={`text-xs font-normal ${meta.text}`}>{meta.label}</span>
        </div>

        {/* Fully ephemeral hover/focus preview — pure CSS reveal, no state change, separate code path from the pin above. */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-150 motion-reduce:transition-none group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
          <div className="overflow-hidden">
            <p className="mt-2 truncate text-[11px] font-normal text-zinc-400">
              {countFmt.format(lot.bidCount)} bids so far &middot; floor {currencyFmt.format(lot.floorPrice)}
            </p>
          </div>
        </div>
      </button>
    </li>
  );
}
