"use client";

import { useMemo, useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { PriceLab } from "./PriceLab";
import { ProductPreview } from "./ProductPreview";
import { SocialProof } from "./SocialProof";
import {
  bucketIndex,
  clamp,
  COMPS,
  daysToSell,
  DEFAULT_PRICE,
  PRICE_MAX,
  PRICE_MIN,
  sellProbability,
  sortByProximity,
  verdictFor,
} from "./data";
import { ACCENT_BRIGHT, cx, FOCUS } from "./tokens";

const SKIP_LINK_CLASS = cx(
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#111116] focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-white",
  FOCUS,
);

/**
 * Root state lives here, one level above every section that reads it: the exact price a visitor
 * types into Price Lab's input is the single source of truth that the probability readout, the
 * comp ranking, the distribution strip AND the closing CTA all derive from — never a value frozen
 * at mount, and never re-computed independently in more than one place.
 *
 * `rawPrice` is what the input element actually shows (so a visitor can freely type "1", "15",
 * "150" without the field fighting them mid-keystroke). `price` is the same value clamped into
 * [PRICE_MIN, PRICE_MAX] and is what every derived figure below is computed from — so typing an
 * out-of-range number still drives the proof panels live, using the nearest valid price, rather
 * than producing NaN or an out-of-bounds percentage.
 */
export default function PriceLabLanding() {
  const [rawPrice, setRawPrice] = useState(String(DEFAULT_PRICE));

  const price = useMemo(() => {
    const parsed = Number(rawPrice);
    if (rawPrice.trim() === "" || !Number.isFinite(parsed)) return DEFAULT_PRICE;
    return clamp(Math.round(parsed), PRICE_MIN, PRICE_MAX);
  }, [rawPrice]);

  const probability = useMemo(() => sellProbability(price), [price]);
  const days = useMemo(() => daysToSell(price), [price]);
  const verdict = useMemo(() => verdictFor(probability), [probability]);
  const sortedComps = useMemo(() => sortByProximity(price, COMPS), [price]);
  const bucket = useMemo(() => bucketIndex(price), [price]);

  function commitPrice(next: number) {
    setRawPrice(String(clamp(next, PRICE_MIN, PRICE_MAX)));
  }

  return (
    <>
      <a href="#main" className={SKIP_LINK_CLASS}>
        Skip to main content
      </a>
      <Header />
      <main id="main" className="min-h-screen bg-[#0B0B0F]">
        <Hero />
        <ProductPreview />
        <PriceLab
          rawPrice={rawPrice}
          price={price}
          probability={probability}
          days={days}
          verdict={verdict}
          sortedComps={sortedComps}
          bucket={bucket}
          onRawPriceChange={setRawPrice}
          onCommitPrice={commitPrice}
        />
        <SocialProof />
        <ClosingCta price={price} probability={probability} days={days} verdict={verdict} />
      </main>
      <footer className="border-t border-[#1C1C22] bg-[#0B0B0F] px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT_BRIGHT }} aria-hidden="true" />
            repick
          </span>
          <p className="text-[11.5px] font-normal text-zinc-400">
            Prices, grades and match figures shown are illustrative for this preview.
          </p>
        </div>
      </footer>
    </>
  );
}
