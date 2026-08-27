"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { FILLS, INSTRUMENT_BY_ID, formatPrice, formatQty } from "./data";
import { BORDER, DOWN_TEXT, NUM, TEXT_AUX, TEXT_PRIMARY, UP_TEXT, cx } from "./tokens";

/**
 * Deliberately independent of the watchlist selection — per the r18/r19 lesson, threading a raw
 * selectedId into every sibling widget collapses archetype differentiation into a stock
 * master-detail. This feed shows the whole desk's flow regardless of which instrument is charted.
 */
export default function FillsFeed() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-3">
        <p className={cx("text-xs font-semibold uppercase tracking-[0.06em]", TEXT_AUX)}>Desk fills</p>
        <p className={cx("mt-0.5 text-[11px] font-normal leading-relaxed", TEXT_AUX)}>Whole-desk flow — not scoped to the chart above.</p>
      </div>
      <ul className="flex-1 overflow-y-auto p-1.5 [scrollbar-width:thin]" aria-label="Recent fills">
        {FILLS.map((f) => {
          const inst = INSTRUMENT_BY_ID[f.instrumentId];
          const buy = f.side === "buy";
          return (
            <li key={f.id} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
              <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-full border", buy ? "border-emerald-800/60 bg-emerald-950/30" : "border-rose-800/60 bg-rose-950/30")}>
                {buy ? <ArrowUpRight size={13} aria-hidden="true" className={UP_TEXT} /> : <ArrowDownLeft size={13} aria-hidden="true" className={DOWN_TEXT} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>
                  <span className={buy ? UP_TEXT : DOWN_TEXT}>{buy ? "Buy" : "Sell"}</span>
                  {` ${inst.symbol}`}
                </p>
                <p className={cx("truncate text-[11px] font-normal", NUM, TEXT_AUX)}>{`${formatQty(f.qty)} @ ${formatPrice(f.price, inst.decimals)}`}</p>
              </div>
              <span className={cx("shrink-0 text-[11px] font-normal", TEXT_AUX)}>{f.timeAgo}</span>
            </li>
          );
        })}
      </ul>
      <div className={cx("border-t p-2.5 text-center text-[11px] font-normal", BORDER, TEXT_AUX)}>{`${FILLS.length} fills today`}</div>
    </div>
  );
}
