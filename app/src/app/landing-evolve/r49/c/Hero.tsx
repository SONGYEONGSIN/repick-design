"use client";

import { ArrowRight } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import LocationPanel from "./LocationPanel";
import PinField from "./PinField";
import ProductCard from "./ProductCard";
import { AREA_RADIUS_MILES, coverageSentence, PRODUCT_ITEMS, type Category, type CoverageResult } from "./data";
import { ACCENT_FILL, CAPTION, EYEBROW, FOCUS_RING, HEADLINE_FONT, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

export function Hero({
  activeId,
  onActivate,
  categoryFilter,
  onFilterChange,
  coverage,
}: {
  activeId: string;
  onActivate: (id: string) => void;
  categoryFilter: Category | null;
  onFilterChange: (next: Category | null) => void;
  coverage: CoverageResult;
}) {
  const proofItems = PRODUCT_ITEMS.slice(0, 2);

  return (
    <section id="locations" className="mx-auto max-w-[1280px] px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:px-10 lg:pb-14 lg:pt-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-5">
          <p className={`${EYEBROW} text-[#BE123C]`}>In-person resale, point by point</p>
          <h1
            style={HEADLINE_FONT}
            className="mt-3 text-[clamp(1.9rem,3vw+1rem,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#171717] lg:text-[clamp(2.3rem,3.2vw+0.9rem,3.6rem)]"
          >
            Pick the point. See what happens before you walk in.
          </h1>
          <p className="mt-4 max-w-[492px] text-base font-normal leading-[1.6] text-[#171717]">
            Every pin below is a real verified partner location. Select one to see its processing
            time, accepted categories, current queue, and trust status update instantly.
          </p>

          <a
            href="#preview"
            className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} hover:opacity-90 ${FOCUS_RING}`}
          >
            See what sells near you
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <div className="mt-6 grid min-w-0 grid-cols-2 gap-3">
            {proofItems.map((item) => (
              <ProductCard key={item.id} item={item} coverage={coverage} compact />
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-[#E7E3E3] bg-white p-4 lg:col-span-7 lg:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className={`${EYEBROW} text-[#BE123C]`}>Verified drop-off network</p>
            <p className={`${CAPTION} ${MUTED_TEXT}`}>{coverage.point.name}</p>
          </div>

          <div className="mt-3">
            <CategoryFilter active={categoryFilter} onChange={onFilterChange} />
          </div>

          <div className="mt-4 border-t border-[#E7E3E3] pt-4">
            <p className="text-3xl font-extrabold leading-none tracking-[-0.02em] text-[#171717] sm:text-4xl">
              <span className="tabular-nums">{coverage.totalCount}</span>
              <span className="ml-2 text-base font-normal tracking-[0em] text-[#171717]">
                verified {coverage.totalCount === 1 ? "point" : "points"} near {coverage.point.name}
              </span>
            </p>
            <p className={`mt-1 max-w-[420px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
              {coverageSentence(coverage, categoryFilter)} Radius fixed at {AREA_RADIUS_MILES} mi around whichever
              pin is active.
            </p>

            <div className="mt-4">
              <PinField activeId={activeId} onActivate={onActivate} categoryFilter={categoryFilter} />
            </div>

            <div className="mt-3">
              <LocationPanel point={coverage.point} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
