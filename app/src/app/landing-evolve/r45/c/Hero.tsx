"use client";

import { ArrowRight } from "lucide-react";
import { SavingsSplit } from "./SavingsSplit";
import { EYEBROW } from "./tokens";

export function Hero({
  discount,
  onDiscountChange,
}: {
  discount: number;
  onDiscountChange: (next: number) => void;
}) {
  return (
    <section id="split" className="mx-auto max-w-[1280px] px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
      <p className={`${EYEBROW} text-[#BEF264]`}>One line, two prices</p>
      <h1 className="mt-3 max-w-2xl text-[clamp(2.1rem,4vw+1rem,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#F4F4F5]">
        Drag the line until the price feels fair.
      </h1>
      <p className="mt-5 max-w-[500px] text-lg font-normal leading-[1.6] text-[#F4F4F5]">
        Left is retail. Right is repick. One shared discount drives both sides of the line below
        — move it and every price on this page, down to the closing one, recomputes with it.
      </p>

      <div className="mt-9">
        <SavingsSplit discount={discount} onDiscountChange={onDiscountChange} />
      </div>

      <a
        href="#value"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[#BEF264] underline decoration-[#BEF264]/40 underline-offset-4 transition-colors duration-200 hover:decoration-[#BEF264] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BEF264] focus-visible:rounded-[3px]"
      >
        See how the range is bounded
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}
