"use client";

import { motion } from "framer-motion";
import DeliveryGrid from "./DeliveryGrid";
import ProofBadges from "./ProofBadges";
import { ITEM, discountPercent, type Speed, type Insurance } from "../lib/delivery";

interface HeroProps {
  speed: Speed;
  insurance: Insurance;
  onSelect: (speed: Speed, insurance: Insurance) => void;
}

/**
 * Document order here IS the mobile stacking order: headline block, then the device, then the
 * four proof badges — all three live inside this one component, in that order, with no
 * `order-*` utility reshuffling them. The desktop 12-col layout only changes column placement,
 * never DOM order.
 */
export default function Hero({ speed, insurance, onSelect }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300"
            >
              AI-Matched Resale
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
              className="mt-2 text-[clamp(2.25rem,4vw+1.7rem,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-white"
            >
              Resale that proves its own price.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
              className="mt-4 max-w-[30rem] text-base leading-[1.6] text-zinc-400"
            >
              Every listing ships with its match score, condition grade, and
              seller verification attached. Pick a delivery combination on
              the grid and the total cost updates instantly for this listing.
            </motion.p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#preview"
                className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white outline-offset-2 transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
              >
                Browse verified listings
              </a>
              <span className="text-xs text-zinc-400">
                {ITEM.name}, {ITEM.size}
              </span>
            </div>
            <div className="mt-6">
              <ProofBadges
                matchPercent={ITEM.matchPercent}
                conditionGrade={ITEM.conditionGrade}
                conditionScore={ITEM.conditionScore}
                sellerRating={ITEM.sellerRating}
                sellerSales={ITEM.sellerSales}
                price={ITEM.price}
                originalPrice={ITEM.originalPrice}
                discountPercent={discountPercent(ITEM.price, ITEM.originalPrice)}
              />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <DeliveryGrid speed={speed} insurance={insurance} onSelect={onSelect} />
          </div>
        </div>
      </div>
    </section>
  );
}
