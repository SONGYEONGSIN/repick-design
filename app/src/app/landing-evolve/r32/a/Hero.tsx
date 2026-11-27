'use client';

import { useMemo } from 'react';
import { ShieldCheck, ArrowRight, SlidersHorizontal } from 'lucide-react';
import RangeSlider from './RangeSlider';
import BoxPlot from './BoxPlot';
import {
  GRADE_ORDER,
  type Grade,
  SOLD_LISTINGS,
  EXAMPLE_LISTING,
  filteredPrices,
  computeBoxStats,
  percentileRank,
  discountPercent,
} from './data';

interface HeroProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export default function Hero({ minPrice, maxPrice, onMinChange, onMaxChange }: HeroProps) {
  const statsByGrade = useMemo(() => {
    const result = {} as Record<Grade, ReturnType<typeof computeBoxStats>>;
    for (const grade of GRADE_ORDER) {
      result[grade] = computeBoxStats(filteredPrices(grade, minPrice, maxPrice));
    }
    return result;
  }, [minPrice, maxPrice]);

  const totalFiltered = useMemo(
    () => SOLD_LISTINGS.filter((l) => l.price >= minPrice && l.price <= maxPrice).length,
    [minPrice, maxPrice],
  );

  const markerInRange = EXAMPLE_LISTING.price >= minPrice && EXAMPLE_LISTING.price <= maxPrice;
  const goodFiltered = useMemo(
    () => filteredPrices('good', minPrice, maxPrice),
    [minPrice, maxPrice],
  );
  const examplePercentile = percentileRank(goodFiltered, EXAMPLE_LISTING.price);
  const discount = discountPercent(EXAMPLE_LISTING.retailPrice, EXAMPLE_LISTING.price);

  return (
    <section className="relative mx-auto max-w-[1280px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Left: headline block */}
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" aria-hidden="true" />
            Repick · Sneakers resale
          </div>
          <h1
            className="mt-5 text-[clamp(2.5rem,5.6vw,4.4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-zinc-900"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            See exactly where a price lands among real sales.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-zinc-600">
            Drag the range below and every box plot recomputes — min, quartiles, median,
            max — for sold Sneakers in that band, split by condition grade. Based on a
            fixed set of 60 recorded comparable sales, not a single asking price dressed
            up as the market.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#listings"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Browse verified Sneakers
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="text-[13px] text-zinc-500">
              Every comp on this page already sold — not an asking price.
            </p>
          </div>
        </div>

        {/* Right: device + proof card, same component/JSX tree as the headline */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
                <SlidersHorizontal className="h-4 w-4 text-sky-600" aria-hidden="true" />
                Comparable sold listings
              </div>
              <div className="text-right text-[13px] tabular-nums text-zinc-500">
                ${minPrice}–${maxPrice}
              </div>
            </div>

            <div className="mt-4">
              <RangeSlider
                min={minPrice}
                max={maxPrice}
                onMinChange={onMinChange}
                onMaxChange={onMaxChange}
              />
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {totalFiltered} of {SOLD_LISTINGS.length} comparable sales between $
              {minPrice} and ${maxPrice}.
            </p>

            <div className="mt-5">
              <BoxPlot
                statsByGrade={statsByGrade}
                markerGrade={EXAMPLE_LISTING.grade}
                markerPrice={EXAMPLE_LISTING.price}
                markerInRange={markerInRange}
              />
            </div>

            {/* Proof card: match %, condition grade, seller verification, before/after discount — all inside Hero */}
            <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[14px] font-semibold text-zinc-900">
                    {EXAMPLE_LISTING.name}
                  </div>
                  <div className="mt-1 text-[12px] tabular-nums text-zinc-500">
                    Good-grade comp, {examplePercentile}th percentile of {goodFiltered.length}{' '}
                    filtered sales
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                  {EXAMPLE_LISTING.matchPercent}% match
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                  Condition: Good
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
                  {EXAMPLE_LISTING.sellerLabel}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[13px] tabular-nums text-zinc-500 line-through">
                  ${EXAMPLE_LISTING.retailPrice}
                </span>
                <span className="text-[18px] font-extrabold tabular-nums text-zinc-900">
                  ${EXAMPLE_LISTING.price}
                </span>
                <span className="text-[12px] font-semibold tabular-nums text-sky-700">
                  {discount}% below retail
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
