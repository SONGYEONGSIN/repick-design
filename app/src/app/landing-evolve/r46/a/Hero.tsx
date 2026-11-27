"use client";

import { useId } from "react";
import { ArrowRight } from "lucide-react";
import { ConditionSelector } from "./ConditionSelector";
import { CreditStack } from "./CreditStack";
import { PriceSlider } from "./PriceSlider";
import { ProductCard } from "./ProductCard";
import { CONDITIONS, formatUsd, type Product } from "./data";
import { ACCENT_BUTTON_FILL, CAPTION, DISPLAY, FOCUS_RING, MUTED_TEXT, ON_ACCENT_BUTTON_TEXT, PROSE_WIDTH_12, PROSE_WIDTH_18 } from "./tokens";

interface HeroProps {
  price: number;
  onPriceChange: (price: number) => void;
  conditionIndex: number;
  onConditionChange: (index: number) => void;
  credit: number;
  heroProducts: Product[];
}

export function Hero({ price, onPriceChange, conditionIndex, onConditionChange, credit, heroProducts }: HeroProps) {
  const conditionLabelId = useId();
  const priceLabelId = useId();
  const liveRegionId = useId();
  const tier = CONDITIONS[conditionIndex];

  return (
    <section className="border-b border-white/10 px-4 pb-20 pt-14 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-14">
          {/* Left: asymmetric headline block, not centered */}
          <div className="flex min-w-0 flex-col gap-6">
            <p className={`${CAPTION} text-sky-500`}>Trade-in &amp; instant credit</p>
            <h1
              id="hero-heading"
              className={`${DISPLAY} text-[clamp(2.5rem,5.6vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#F5F5F7]`}
            >
              See what your stuff
              <br />
              is actually worth.
            </h1>
            <p className={`${PROSE_WIDTH_18} text-lg font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Pick a condition and tell us what you paid — repick prices the trade-in instantly, no
              listing, no waiting on a buyer. The credit below updates as you move either control.
            </p>
            <div>
              <a
                href="#catalog"
                className={`inline-flex items-center gap-2 rounded-full ${ACCENT_BUTTON_FILL} px-6 py-3 text-sm font-semibold ${ON_ACCENT_BUTTON_TEXT} transition-colors duration-200 ${FOCUS_RING}`}
              >
                See what it unlocks
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Mini product proof — same global state, re-filtered live. Still inside Hero. */}
            <div className="mt-2">
              <p className={`${CAPTION} ${MUTED_TEXT} tabular-nums mb-3`}>
                At {formatUsd(credit)} credit, right now
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {heroProducts.map((p) => (
                  <div key={p.id} className="min-w-0">
                    <ProductCard product={p} credit={credit} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: the live calculator device, inside the Hero component */}
          <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-white/10 bg-[#15151C] p-5 sm:p-6">
            <div>
              <p id={conditionLabelId} className={`${CAPTION} ${MUTED_TEXT} mb-3`}>
                Condition
              </p>
              <ConditionSelector selectedIndex={conditionIndex} onSelect={onConditionChange} labelId={conditionLabelId} />
              <p className={`${PROSE_WIDTH_12} mt-2 text-xs font-normal leading-[1.5] ${MUTED_TEXT}`}>{tier.detail}</p>
            </div>

            <PriceSlider price={price} onChange={onPriceChange} labelId={priceLabelId} describedById={liveRegionId} />

            <CreditStack
              price={price}
              credit={credit}
              conditionLabel={tier.label}
              multiplier={tier.multiplier}
              liveRegionId={liveRegionId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
