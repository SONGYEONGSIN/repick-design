"use client";

import { Minus, Target, TrendingDown, TrendingUp } from "lucide-react";
import { Reveal } from "./Reveal";
import {
  BUCKETS,
  BUCKET_SOLD_TOTAL,
  DEFAULT_PRICE,
  LAB_ITEM,
  PRICE_MAX,
  PRICE_MIN,
  type Comp,
  type Verdict,
} from "./data";
import { ACCENT, ACCENT_BRIGHT, cx, DISPLAY_FONT, FOCUS, NUM } from "./tokens";

const VERDICT_ICON = { fast: TrendingUp, balanced: Minus, slow: TrendingDown } as const;

interface PriceLabProps {
  rawPrice: string;
  price: number;
  probability: number;
  days: number;
  verdict: Verdict;
  sortedComps: Comp[];
  bucket: number;
  onRawPriceChange: (value: string) => void;
  onCommitPrice: (value: number) => void;
}

export function PriceLab({
  rawPrice,
  price,
  probability,
  days,
  verdict,
  sortedComps,
  bucket,
  onRawPriceChange,
  onCommitPrice,
}: PriceLabProps) {
  const VerdictIcon = VERDICT_ICON[verdict.tone];
  const maxBucketCount = Math.max(...BUCKETS.map((b) => b.count));
  const activeBucket = BUCKETS[bucket];

  return (
    <section id="price-lab" className="scroll-mt-24 border-b border-[#1C1C22] bg-[#0B0B0F] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.28em" }}>
          Fig. 04 &mdash; Price Lab
        </p>
        <h2
          className="mt-4 max-w-[720px] text-white"
          style={{ ...DISPLAY_FONT, letterSpacing: "-0.015em", fontSize: "clamp(1.75rem, 1.6vw + 1.3rem, 2.5rem)", lineHeight: 1.08 }}
        >
          Type a price. Watch the market answer.
        </h2>
        <p className="mt-4 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
          No slider to drag &mdash; type the exact number you have in mind for {LAB_ITEM.shortLabel}, and every
          panel below recomputes from that figure alone.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6">
          {/* Column 1 — the control itself, and the headline proof it drives */}
          <Reveal className="min-w-0 rounded-2xl border border-[#1C1C22] bg-[#111116] p-6">
            <label htmlFor="ask-price" className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.16em" }}>
              Your asking price
            </label>
            <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-[#27272E] bg-[#0B0B0F] px-4 py-3 focus-within:border-[#7F6C34]">
              <span className={cx("text-[20px] font-semibold text-zinc-400", NUM)} aria-hidden="true">
                $
              </span>
              <input
                id="ask-price"
                type="number"
                inputMode="numeric"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1}
                value={rawPrice}
                onChange={(event) => onRawPriceChange(event.target.value)}
                onBlur={() => onCommitPrice(price)}
                aria-describedby="ask-price-help ask-price-verdict"
                className={cx("w-full min-w-0 rounded-sm bg-transparent text-[20px] font-semibold text-white", NUM, FOCUS)}
              />
            </div>
            <p id="ask-price-help" className="mt-2 text-[12px] font-normal text-zinc-400">
              Retail is ${LAB_ITEM.retailPrice}. repick&apos;s model suggests starting near ${DEFAULT_PRICE}.
            </p>

            <div aria-live="polite" className="mt-6 border-t border-[#1C1C22] pt-6">
              <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.16em" }}>
                Sell probability
              </p>
              <p className={cx("mt-1 text-white", NUM)} style={{ ...DISPLAY_FONT, fontSize: "40px", lineHeight: 1 }}>
                {probability}%
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#1C1C22]">
                <div
                  className="h-full w-full origin-left rounded-full transition-transform duration-300 motion-reduce:transition-none"
                  style={{ transform: `scaleX(${probability / 100})`, backgroundColor: ACCENT }}
                />
              </div>

              <p id="ask-price-verdict" className="mt-4 flex items-start gap-2 text-[13.5px] font-normal leading-snug text-zinc-300">
                <VerdictIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                <span>
                  <span className="font-semibold text-white">{verdict.label}.</span> {verdict.body} Estimated{" "}
                  <span className={NUM}>{days}</span> days to sell at this price.
                </span>
              </p>
            </div>
          </Reveal>

          {/* Column 2 — comps, re-ranked by proximity to the typed price */}
          <Reveal delay={0.08} className="min-w-0 rounded-2xl border border-[#1C1C22] bg-[#111116] p-6">
            <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.16em" }}>
              Nearest recent sales
            </p>
            <p className="mt-1 text-[12px] font-normal text-zinc-400">Ranked by distance from your typed price.</p>

            <ul className="mt-4 flex flex-col gap-2">
              {sortedComps.map((comp, index) => {
                const isClosest = index === 0;
                return (
                  <li key={comp.id}>
                    <button
                      type="button"
                      onClick={() => onCommitPrice(comp.price)}
                      aria-label={`Use $${comp.price} as your asking price — sold in ${comp.days} days, grade ${comp.grade}`}
                      className={cx(
                        "flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150",
                        FOCUS,
                        isClosest ? "border-[#7F6C34] bg-[#7F6C34]/10" : "border-[#1C1C22] bg-[#0B0B0F] hover:border-[#27272E]",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {isClosest && <Target className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />}
                        <span className="min-w-0">
                          <span className={cx("block text-[15px] font-semibold text-white", NUM)}>${comp.price}</span>
                          <span className={cx("block text-[11px] font-normal text-zinc-400", NUM)}>
                            Sold in {comp.days}d &middot; Grade {comp.grade}
                          </span>
                        </span>
                      </span>
                      {isClosest ? (
                        <span className="shrink-0 text-[11px] font-semibold" style={{ color: ACCENT_BRIGHT }}>
                          Closest match
                        </span>
                      ) : (
                        <span className="shrink-0 text-[11px] font-semibold text-zinc-400">Use this price</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Column 3 — where the typed price lands in the wider distribution */}
          <Reveal delay={0.16} className="min-w-0 rounded-2xl border border-[#1C1C22] bg-[#111116] p-6">
            <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.16em" }}>
              Where you land
            </p>
            <p className="mt-1 text-[12px] font-normal text-zinc-400">Last {BUCKET_SOLD_TOTAL} confirmed sales of this model.</p>

            <div className="mt-5 flex h-24 items-end gap-2" role="img" aria-label={`Histogram of ${BUCKET_SOLD_TOTAL} recent sales across five price bands. Your price of $${price} falls in the ${activeBucket.label} band, which had ${activeBucket.count} sales.`}>
              {BUCKETS.map((b, index) => {
                const isActive = index === bucket;
                const heightPct = Math.max(8, Math.round((b.count / maxBucketCount) * 100));
                return (
                  <div key={b.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                    <span
                      className={cx("text-[10px] font-semibold", NUM, !isActive && "text-zinc-400")}
                      style={isActive ? { color: ACCENT_BRIGHT } : undefined}
                      aria-hidden="true"
                    >
                      {b.count}
                    </span>
                    <div
                      className="w-full rounded-t-sm transition-colors duration-150"
                      style={{ height: `${heightPct}%`, backgroundColor: isActive ? ACCENT : "#27272E" }}
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10.5px] font-normal text-zinc-400" aria-hidden="true">
              {BUCKETS.map((b) => b.label).join("  ·  ")}
            </p>

            <p className="mt-5 border-t border-[#1C1C22] pt-5 text-[13.5px] font-normal leading-snug text-zinc-300">
              At <span className={cx("font-semibold text-white", NUM)}>${price}</span>, you land in the{" "}
              <span className="font-semibold text-white">{activeBucket.label}</span> band &mdash;{" "}
              <span className={NUM}>{activeBucket.count}</span> of the last {BUCKET_SOLD_TOTAL} sales priced there.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
