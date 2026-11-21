"use client";

import { useState } from "react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_ACTIVE_INDEX, DEFAULT_VALUES, clampStep } from "./data";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

export default function LandingClient() {
  const [values, setValues] = useState<number[]>(DEFAULT_VALUES);
  const [activeIndex, setActiveIndex] = useState(DEFAULT_ACTIVE_INDEX);

  function handleChange(index: number, value: number) {
    const clamped = clampStep(value);
    setValues((prev) => prev.map((v, i) => (i === index ? clamped : v)));
  }

  function handleActivate(index: number) {
    setActiveIndex(index);
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#22D3EE] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-[#23232C] px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-white">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a
              href="#curve"
              className={`rounded-sm text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
            >
              Your curve
            </a>
            <a
              href="#plan"
              className={`rounded-sm text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
            >
              Current picks
            </a>
          </nav>
          <a
            href="#curve"
            className={`rounded-full bg-[#22D3EE] px-4 py-2 text-sm font-semibold text-[#0B0B0F] transition-colors duration-200 hover:opacity-90 ${FOCUS_RING}`}
          >
            Draw your curve
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero values={values} activeIndex={activeIndex} onChange={handleChange} onActivate={handleActivate} />
        <ProductPreview values={values} activeIndex={activeIndex} />
        <ValueSplit />
        <SocialProof />
        <ClosingCTA values={values} />
      </main>

      <footer className="border-t border-[#23232C] px-4 py-10 sm:px-6 lg:px-10">
        <div
          className={`mx-auto flex max-w-[1280px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}
        >
          <span className="max-w-[370px]">© 2026 repick. Plan what you spend, before you spend it.</span>
          <span className="max-w-[370px]">
            Listing figures are illustrative of repick&rsquo;s live inventory, not a guarantee of
            availability.
          </span>
        </div>
      </footer>
    </div>
  );
}
