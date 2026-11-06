"use client";

import { useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ProductGrid } from "./ProductGrid";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { CONDITIONS, DEFAULT_CONDITION_INDEX, DEFAULT_PRICE, PRODUCTS, calcCredit } from "./data";
import { DISPLAY, FOCUS_RING, MUTED_TEXT } from "./tokens";

export function LandingExperience() {
  // Single source of truth for the whole page. Defaults are a real, mid-range condition and
  // price — never an empty/zero starting state — so the hero shows live proof on first paint.
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [conditionIndex, setConditionIndex] = useState(DEFAULT_CONDITION_INDEX);

  const credit = useMemo(() => calcCredit(price, conditionIndex), [price, conditionIndex]);
  const tier = CONDITIONS[conditionIndex];
  const heroProducts = useMemo(() => PRODUCTS.slice(0, 3), []);

  function handleConditionChange(index: number) {
    // Resets never land on an empty state either — the new tier's own detail/multiplier is
    // always a real, non-zero value, so the device never shows a blank slate after a change.
    setConditionIndex(index);
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F5F7]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-sky-500 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className={`${DISPLAY} text-lg font-extrabold tracking-[-0.02em] text-[#F5F5F7]`}>repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#catalog" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-[#F5F5F7] ${FOCUS_RING} rounded-sm`}>
              Catalog
            </a>
            <a href="#proof-heading" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-[#F5F5F7] ${FOCUS_RING} rounded-sm`}>
              Reviews
            </a>
          </nav>
          <a
            href="#hero-heading"
            className={`rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-[#0B0B0F] transition-colors duration-200 hover:bg-sky-400 ${FOCUS_RING}`}
          >
            Price an item
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero
          price={price}
          onPriceChange={setPrice}
          conditionIndex={conditionIndex}
          onConditionChange={handleConditionChange}
          credit={credit}
          heroProducts={heroProducts}
        />
        <ProductGrid credit={credit} conditionLabel={tier.label} />
        <ValueSplit price={price} credit={credit} conditionLabel={tier.label} multiplier={tier.multiplier} />
        <SocialProof />
        <ClosingCTA price={price} credit={credit} conditionLabel={tier.label} />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1440px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Trade-in credit is an instant estimate, confirmed at drop-off.</span>
          <span>Condition multipliers shown are repick&apos;s standard trade-in terms, not a promotion.</span>
        </div>
      </footer>
    </div>
  );
}
