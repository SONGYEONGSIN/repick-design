"use client";

import { useState } from "react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { CAPTION, FOCUS, SKIP_LINK } from "./data";

export default function GradingTimelineLanding() {
  const [stageIndex, setStageIndex] = useState(0);

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-[#D9BE84]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The preview
            </a>
            <a href="#value" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              What it buys
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <a
            href="#start"
            className={`rounded-full bg-[#7A5F28] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#63491E] ${FOCUS}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main">
        <Hero stageIndex={stageIndex} onStageChange={setStageIndex} />
        <ProductPreview stageIndex={stageIndex} />
        <ValueSplit stageIndex={stageIndex} />
        <SocialProof />
        <ClosingCta stageIndex={stageIndex} />
      </main>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.02em]">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The preview
            </a>
            <a href="#value" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              What it buys
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <span className={CAPTION}>ONE LISTING, FIVE VERIFIED STEPS</span>
        </div>
      </footer>
    </div>
  );
}
