"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import type { Exchange } from "./data";
import { CURRENCY } from "./data";
import { FOCUS_RING, StatusBadge, Sparkline } from "./ui";

function WatchItem({ exchange, active, onSelect }: { exchange: Exchange; active: boolean; onSelect: () => void }) {
  const up = exchange.deltaPct >= 0;
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className={`flex w-full flex-col gap-1.5 border-l-2 px-4 py-3 text-left transition-colors duration-150 ease-out ${FOCUS_RING} ${
          active ? "border-l-sky-600 bg-sky-50" : "border-l-transparent hover:bg-zinc-50"
        }`}
      >
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{exchange.name}</span>
          <StatusBadge status={exchange.status} />
        </div>
        <p className="truncate text-xs font-normal text-zinc-600">
          {exchange.type} &middot; {exchange.region}
        </p>
        <div className="flex items-center justify-between gap-2">
          <Sparkline values={exchange.seriesByPeriod["24H"]} className={up ? "text-emerald-600" : "text-red-600"} />
          <div className="flex flex-shrink-0 flex-col items-end">
            <span className="tabular-nums text-sm font-medium text-zinc-900">{CURRENCY.format(exchange.currentCpm)}</span>
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-normal tabular-nums ${up ? "text-emerald-700" : "text-red-700"}`}>
              {up ? <ArrowUp className="h-3 w-3 flex-shrink-0" aria-hidden="true" /> : <ArrowDown className="h-3 w-3 flex-shrink-0" aria-hidden="true" />}
              {Math.abs(exchange.deltaPct)}%
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

export function WatchlistRail({
  exchanges,
  selectedId,
  onSelect,
}: {
  exchanges: Exchange[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-shrink-0 flex-col border-b border-zinc-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-4 py-4">
        <h2 className="text-sm font-semibold text-zinc-900">Following</h2>
        <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-zinc-600">{exchanges.length}</span>
      </div>
      <ul className="max-h-72 flex-1 divide-y divide-zinc-100 overflow-y-auto lg:max-h-none">
        {exchanges.map((e) => (
          <WatchItem key={e.id} exchange={e} active={e.id === selectedId} onSelect={() => onSelect(e.id)} />
        ))}
        {exchanges.length === 0 && <li className="px-4 py-6 text-center text-sm font-normal text-zinc-500">Nothing on your watchlist yet.</li>}
      </ul>
    </div>
  );
}
