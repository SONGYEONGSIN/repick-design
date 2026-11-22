"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import type { KeyboardEvent } from "react";
import { DEFAULT_ITEM_COUNT, FOCUS_RING, MIN_ITEM_COUNT, type TradeInResult } from "./lib";

type TradeInCounterProps = {
  result: TradeInResult;
  onChange: (count: number) => void;
};

/**
 * The Bulk Trade-In Tier Counter. One unbounded input — the item count — drives all four
 * read-outs through `deriveTradeIn`: average payout, running total, tier badge and summary
 * sentence. There is no second control here that could move any of those numbers.
 */
export function TradeInCounter({ result, onChange }: TradeInCounterProps) {
  const { count, tier, nextTier, itemsToNextTier, tierProgress, avgPayout, totalPayout, summary } = result;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      onChange(count + 1);
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      onChange(Math.max(MIN_ITEM_COUNT, count - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(MIN_ITEM_COUNT);
    }
  }

  return (
    <div
      id="trade-in-counter"
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Bulk Trade-In Tier Counter
        </p>
        <span className="shrink-0 rounded-full bg-green-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#0b0b0f]">
          {tier.name}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(MIN_ITEM_COUNT, count - 1))}
          disabled={count <= MIN_ITEM_COUNT}
          aria-label="Decrease item count"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors enabled:hover:border-green-300/60 enabled:hover:text-green-300 disabled:opacity-30 ${FOCUS_RING}`}
        >
          <Minus aria-hidden="true" size={18} />
        </button>

        <div
          role="spinbutton"
          aria-label="Items to trade in"
          aria-valuemin={MIN_ITEM_COUNT}
          aria-valuenow={count}
          aria-valuetext={`${count} item${count === 1 ? "" : "s"}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={`flex min-w-0 flex-1 items-baseline justify-center gap-1.5 rounded-xl py-1 text-center ${FOCUS_RING}`}
        >
          <span className="text-4xl font-extrabold tracking-[-0.02em] text-white tabular-nums sm:text-5xl">
            {count}
          </span>
          <span className="text-sm font-semibold text-zinc-400">{count === 1 ? "item" : "items"}</span>
        </div>

        <button
          type="button"
          onClick={() => onChange(count + 1)}
          aria-label="Increase item count"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-green-300/60 hover:text-green-300 ${FOCUS_RING}`}
        >
          <Plus aria-hidden="true" size={18} />
        </button>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full origin-left rounded-full bg-green-500 transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: `scaleX(${tierProgress})` }}
          />
        </div>
        <p className="mt-1.5 text-xs tabular-nums text-zinc-400">
          {nextTier
            ? `${itemsToNextTier} more item${itemsToNextTier === 1 ? "" : "s"} to ${nextTier.name}`
            : `Top tier reached — ${tier.name} pricing applied`}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-[11px] text-zinc-400">Avg. payout / item</p>
          <p className="text-lg font-extrabold tracking-[-0.02em] text-white tabular-nums">${avgPayout}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-[11px] text-zinc-400">Total payout</p>
          <p className="text-lg font-extrabold tracking-[-0.02em] text-green-400 tabular-nums">
            ${totalPayout.toLocaleString("en-US")}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed tabular-nums text-zinc-400">{summary}</p>

      <button
        type="button"
        onClick={() => onChange(DEFAULT_ITEM_COUNT)}
        className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-green-300 ${FOCUS_RING} rounded`}
      >
        <RotateCcw aria-hidden="true" size={13} />
        Reset to {DEFAULT_ITEM_COUNT} items
      </button>
    </div>
  );
}
