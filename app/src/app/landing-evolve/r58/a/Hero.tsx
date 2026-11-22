"use client";

import { ArrowRight, CheckCircle2, Percent, ShieldCheck, Sparkles } from "lucide-react";
import { FOCUS_RING, type TradeInResult } from "./lib";
import { TradeInCounter } from "./TradeInCounter";

type HeroProps = {
  result: TradeInResult;
  onChange: (count: number) => void;
};

/**
 * Hero holds the headline, the device, and the full product-proof row in one render tree — in
 * that document order — so the single-column mobile stack never separates them or reorders the
 * headline behind the device.
 */
export function Hero({ result, onChange }: HeroProps) {
  return (
    <section className="relative border-b border-white/10 bg-[#0b0b0f] px-4 pt-7 pb-10 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-10">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-400">
            Repick · bulk resale
          </p>
          <h1
            className="mt-3 text-[clamp(2.1rem,8.5vw,4.5rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Trade in by the box,
            <br />
            not the item.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400 sm:text-base">
            Price each item on its own, then roll it into one payout that pays more per piece as
            the box grows.
          </p>
          <a
            href="#closing-cta"
            className={`mt-6 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800 ${FOCUS_RING}`}
          >
            Start bulk trade-in
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <TradeInCounter result={result} onChange={onChange} />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              Live match example — Canon EOS R6
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Sparkles aria-hidden="true" size={13} className="text-green-400" />
                  AI match
                </dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-white tabular-nums">96%</dd>
              </div>
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <ShieldCheck aria-hidden="true" size={13} className="text-green-400" />
                  Condition
                </dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-white">Grade A-</dd>
              </div>
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <CheckCircle2 aria-hidden="true" size={13} className="text-green-400" />
                  Seller
                </dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-white">Verified</dd>
              </div>
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Percent aria-hidden="true" size={13} className="text-green-400" />
                  vs. retail
                </dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-green-400 tabular-nums">
                  $1,850 → $1,260
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
