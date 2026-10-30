"use client";

import { useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { DEFAULT_PRICE, computeDepletionCurve, sellOutDay, headlineFor } from "./data";
import { DISPLAY, FOCUS_RING, MUTED_TEXT } from "./tokens";

export default function Page() {
  const [price, setPrice] = useState(DEFAULT_PRICE);

  const curve = useMemo(() => computeDepletionCurve(price), [price]);
  const clearDay = useMemo(() => sellOutDay(price), [price]);
  const headline = useMemo(() => headlineFor(price, curve), [price, curve]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#121212]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#121212] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-[#121212]/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className={`${DISPLAY} text-lg font-extrabold tracking-[-0.02em] text-[#121212]`}>repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#simulator" className={`text-sm font-bold text-[#121212]/70 transition-colors duration-200 hover:text-[#121212] ${FOCUS_RING} rounded-sm`}>
              The simulator
            </a>
            <a href="#proof" className={`text-sm font-bold text-[#121212]/70 transition-colors duration-200 hover:text-[#121212] ${FOCUS_RING} rounded-sm`}>
              Seller results
            </a>
          </nav>
          <a
            href="#simulator"
            className={`rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#065f46] ${FOCUS_RING}`}
          >
            Price a lot
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero price={price} onPriceChange={setPrice} curve={curve} sellOutDay={clearDay} headline={headline} />
        <ValueSplit />
        <div id="proof">
          <SocialProof />
        </div>
        <ClosingCTA price={price} headlineCta={headline.cta} />
      </main>

      <footer className="border-t border-[#121212]/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1440px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Resale, priced on purpose.</span>
          <span>Simulated sell-through is an estimate from a fixed demand model, not a guarantee.</span>
        </div>
      </footer>
    </div>
  );
}
