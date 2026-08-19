"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import {
  CAPTION,
  EYEBROW,
  FOCUS,
  NUM,
  STAT,
  TRADES,
  cx,
  money,
  type CheckId,
  type Row,
  type Trade,
  type TradeId,
} from "./data";

type Props = {
  trade: Trade;
  value: number;
  rows: Row[];
  total: number;
  fee: number;
  waivedSum: number;
  onTrade: (id: TradeId) => void;
  onValue: (v: number) => void;
  onWaive: (id: CheckId) => void;
};

/**
 * The ledger itself. Three controls sit on it and every one of them recomputes more than one
 * surface: the four line amounts, the four share bars, the standing total, the fee, the multiple on
 * the fee, the escrow settlement figure and the write-off note all read from the same numbers.
 *
 * Nothing here is hidden behind an interaction — the total, all four entries and all four amounts
 * are rendered at rest, at scroll zero. The controls change what the ledger says; they are never
 * the thing that makes it say anything at all.
 */
export default function LedgerCard({
  trade,
  value,
  rows,
  total,
  fee,
  waivedSum,
  onTrade,
  onValue,
  onWaive,
}: Props) {
  const reduce = useReducedMotion();
  const multiple = fee > 0 ? Math.round(total / fee) : 0;

  return (
    <section
      aria-labelledby="ledger-title"
      className="rounded-xl border border-[#E2E2DC] bg-white shadow-[0_1px_0_0_#E2E2DC]"
    >
      {/* controls -------------------------------------------------------------------------- */}
      <div className="border-b border-[#E2E2DC] px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="ledger-title" className={cx(CAPTION, "text-[#12120F]")}>
            Ledger, one order
          </h2>
          <p className="text-[0.78rem] text-[#5B5B55]">{trade.item}</p>
        </div>

        <div className="mt-3.5 flex flex-col gap-3.5 sm:flex-row sm:items-end sm:gap-6">
          <div className="min-w-0">
            <p id="category-label" className={cx(STAT, "text-[#5B5B55]")}>
              Category
            </p>
            <div
              role="group"
              aria-labelledby="category-label"
              className="mt-1.5 inline-flex rounded-lg border border-[#E2E2DC] bg-[#F5F5F2] p-0.5"
            >
              {TRADES.map((t) => {
                const on = t.id === trade.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onTrade(t.id)}
                    className={cx(
                      "min-h-[34px] rounded-md px-3 text-[0.8rem] font-semibold transition-colors duration-150 motion-reduce:transition-none",
                      on
                        ? "bg-[#0F766E] text-white"
                        : "text-[#5B5B55] hover:bg-white hover:text-[#12120F]",
                      FOCUS,
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="order-value" className={cx(STAT, "text-[#5B5B55]")}>
                Order value
              </label>
              <output
                htmlFor="order-value"
                className={cx(NUM, "text-[0.9rem] font-semibold text-[#12120F]")}
              >
                {money(value)}
              </output>
            </div>
            <input
              id="order-value"
              type="range"
              min={trade.min}
              max={trade.max}
              step={trade.step}
              value={value}
              onChange={(e) => onValue(Number(e.target.value))}
              className={cx(
                "mt-2 h-6 w-full cursor-pointer accent-[#0F766E] rounded-md",
                FOCUS,
              )}
            />
            <div className={cx(NUM, "flex justify-between text-[0.68rem] text-[#5B5B55]")}>
              <span>{money(trade.min)}</span>
              <span>{money(trade.max)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* entries ---------------------------------------------------------------------------- */}
      <ul className="divide-y divide-[#E2E2DC]">
        {rows.map((row) => {
          const Icon = row.line.icon;
          return (
            <li key={row.line.id} className="px-4 py-3 sm:px-5">
              <div className="flex items-start gap-2.5">
                <Icon
                  aria-hidden="true"
                  className={cx(
                    "mt-0.5 size-4 shrink-0",
                    row.waived ? "text-[#5B5B55]" : "text-[#0F766E]",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={`#audit-${row.line.id}`}
                    className={cx(
                      "inline-block rounded-sm text-[0.9rem] font-semibold leading-snug text-[#12120F] underline decoration-[#C7E7E2] decoration-2 underline-offset-4 hover:decoration-[#0F766E]",
                      row.waived && "line-through decoration-[#5B5B55]",
                      FOCUS,
                    )}
                  >
                    {row.line.entry}
                  </a>
                  <p className="mt-0.5 truncate text-[0.72rem] leading-normal text-[#5B5B55]">
                    {row.line.found}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    style={{ fontFamily: "var(--font-display-wide)" }}
                    className={cx(
                      NUM,
                      "text-[1.05rem] font-extrabold leading-none",
                      row.waived ? "text-[#5B5B55] line-through" : "text-[#12120F]",
                    )}
                  >
                    {row.line.settled ? money(0) : `+${money(row.amount)}`}
                  </p>
                  <p className={cx(NUM, "mt-1 text-[0.66rem] text-[#5B5B55]")}>
                    {row.line.settled
                      ? "settled by escrow"
                      : row.waived
                        ? "written off by you"
                        : `${Math.round(row.share * 100)}% of total`}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#F5F5F2]">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: row.share }}
                    transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
                    style={{ transformOrigin: "left center" }}
                    className={cx(
                      "h-full w-full rounded-full",
                      row.waived ? "bg-[#5B5B55]" : "bg-[#0F766E]",
                    )}
                  />
                </div>

                {row.line.waivable ? (
                  <button
                    type="button"
                    aria-pressed={row.waived}
                    onClick={() => onWaive(row.line.id)}
                    className={cx(
                      "inline-flex min-h-[30px] shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-[0.7rem] font-semibold transition-colors duration-150 motion-reduce:transition-none",
                      row.waived
                        ? "border-[#0F766E] bg-[#0F766E] text-white"
                        : "border-[#E2E2DC] bg-white text-[#5B5B55] hover:border-[#0F766E] hover:text-[#0F766E]",
                      FOCUS,
                    )}
                  >
                    <Check aria-hidden="true" className="size-3.5" />
                    I would have caught this
                  </button>
                ) : (
                  <span className="inline-flex min-h-[30px] shrink-0 items-center gap-1.5 rounded-md border border-dashed border-[#E2E2DC] px-2.5 text-[0.7rem] text-[#5B5B55]">
                    <Lock aria-hidden="true" className="size-3.5" />
                    Nothing you could have caught
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* footing ------------------------------------------------------------------------------ */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t-2 border-[#12120F] px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <p className={cx(EYEBROW, "text-[#5B5B55]")}>Standing total</p>
          <p className={cx(NUM, "mt-1 text-[0.8rem] text-[#5B5B55]")}>
            {waivedSum > 0
              ? `You wrote off ${money(waivedSum)} of it yourself.`
              : `Against a ${money(fee)} inspection fee.`}
          </p>
        </div>
        <div className="flex items-end gap-4">
          <p
            style={{ fontFamily: "var(--font-display-wide)" }}
            className={cx(NUM, "text-[1.75rem] font-extrabold leading-none text-[#12120F]")}
          >
            {money(total)}
          </p>
          <p className="inline-flex items-center rounded-md bg-[#0F766E] px-2 py-1 text-[0.72rem] font-semibold text-white">
            <span className={NUM}>{multiple}x</span>
            <span className="ml-1">the fee</span>
          </p>
        </div>
      </div>
    </section>
  );
}
