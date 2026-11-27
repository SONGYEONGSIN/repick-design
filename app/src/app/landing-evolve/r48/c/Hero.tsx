"use client";

import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import TimeWindowSelector from "./TimeWindowSelector";
import TrendChart from "./TrendChart";
import { PRODUCT_ITEMS, type WindowStats } from "./data";
import { EYEBROW, FOCUS_RING, ON_ACCENT_FILL_TEXT, ACCENT_FILL } from "./tokens";

export function Hero({
  start,
  end,
  stats,
  onWindowChange,
}: {
  start: number;
  end: number;
  stats: WindowStats;
  onWindowChange: (start: number, end: number) => void;
}) {
  const proofItems = PRODUCT_ITEMS.slice(0, 2);

  return (
    <section id="trend" className="mx-auto max-w-[1280px] px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:px-10 lg:pb-14 lg:pt-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-5">
          <p className={`${EYEBROW} text-[#047857]`}>Drag the window, watch the market</p>
          <h1 className="mt-3 text-[clamp(1.9rem,3vw+1rem,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#09090B] lg:text-[clamp(2.3rem,3.2vw+0.9rem,3.6rem)]">
            Resale demand, on your own time scale.
          </h1>
          <p className="mt-4 max-w-[460px] text-base font-normal leading-[1.6] text-[#09090B]">
            Drag either handle below to widen or narrow the window. The curve, the headline stat and
            every listing on this page recompute for exactly the days you select — nothing here is a
            fixed example.
          </p>

          <a
            href="#preview"
            className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} hover:opacity-90 ${FOCUS_RING}`}
          >
            See matching listings
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <div className="mt-6 grid min-w-0 grid-cols-2 gap-3">
            {proofItems.map((item) => (
              <ProductCard key={item.id} item={item} avgDays={stats.avgDays} compact />
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-[#E4E4E7] bg-white p-4 lg:col-span-7 lg:p-6">
          <TimeWindowSelector start={start} end={end} onChange={onWindowChange} />
          <div className="mt-5 border-t border-[#E4E4E7] pt-5">
            <TrendChart start={start} end={end} stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
}
