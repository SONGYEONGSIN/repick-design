'use client';

import { Shirt, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import IconArray from './IconArray';
import CategoryArt from './CategoryArt';
import {
  GRADE_LABELS,
  SAMPLE_TOTAL,
  THRESHOLD_LIMITS,
  type DerivedStats,
  type Thresholds,
  HERO_PROOF_LISTING,
} from './data';

type SliderProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabel: string;
  onChange: (value: number) => void;
};

/** A single threshold control. Defined once, used three times — a real
 * named component, not an inline closure built fresh on every render. */
function ThresholdSlider({ id, label, value, min, max, step, valueLabel, onChange }: SliderProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold tracking-[0.12em] uppercase text-zinc-600">
          {label}
        </label>
        <span className="font-mono text-sm font-semibold tabular-nums text-zinc-900">{valueLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: '#65a30d' }}
        className="h-6 w-full cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c0f]"
      />
    </div>
  );
}

type HeroProps = {
  thresholds: Thresholds;
  derived: DerivedStats;
  onChange: (next: Partial<Thresholds>) => void;
};

export default function Hero({ thresholds, derived, onChange }: HeroProps) {
  return (
    <section className="relative mx-auto max-w-[1200px] px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        {/* Headline block — left-aligned, asymmetric */}
        <div className="col-span-12 lg:col-span-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#4d7c0f]">
            repick · resale, graded
          </p>
          <h1
            className="text-[clamp(2.75rem,6vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-zinc-900"
          >
            Price, condition, trust.
            <br />
            You draw the line.
          </h1>
          <p className="mt-6 max-w-[500px] text-base leading-[1.6] text-zinc-600">
            Move three thresholds below and our sample resale catalog
            recalculates, listing by listing, right here in your browser — no
            page reload, no separate search.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#preview"
              className="inline-flex items-center gap-2 rounded-full bg-[#84cc16] px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#76b513] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c0f]"
            >
              See what qualifies
              <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
            </a>
            <p className="text-sm text-zinc-500">
              A sample catalog of {SAMPLE_TOTAL} listings — move the sliders to see
              who clears your bar.
            </p>
          </div>
        </div>

        {/* Proof card — all 4 proof elements, inside the Hero's own tree */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <CategoryArt icon={Shirt} label={`${HERO_PROOF_LISTING.category} listing photo placeholder`} />
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-semibold tracking-[0.02em] text-[#4d7c0f]">
                <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
                {HERO_PROOF_LISTING.matchPercent}% match
              </span>
            </div>
            <h2 className="mt-3 text-base font-extrabold tracking-[-0.02em] text-zinc-900">
              {HERO_PROOF_LISTING.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">{HERO_PROOF_LISTING.category} · Size M</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                Grade {HERO_PROOF_LISTING.grade}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                Verified seller
              </span>
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-mono text-lg font-extrabold tabular-nums text-zinc-900">
                ${HERO_PROOF_LISTING.salePrice}
              </span>
              <span className="font-mono text-sm tabular-nums text-zinc-500 line-through">
                ${HERO_PROOF_LISTING.originalPrice}
              </span>
              <span className="ml-auto rounded-full bg-[#84cc16] px-2 py-0.5 text-xs font-semibold tabular-nums text-zinc-900">
                -{HERO_PROOF_LISTING.discountPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* The assigned device: threshold sliders + live pictogram array,
            still inside the Hero component's own JSX tree. */}
        <div className="col-span-12">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                Set your own bar
              </p>
              <p aria-live="polite" className="text-sm leading-[1.6] text-zinc-600">
                <span className="font-mono text-base font-extrabold tabular-nums text-zinc-900">
                  {derived.count}
                </span>{' '}
                of {SAMPLE_TOTAL} sample listings qualify{' '}
                <span className="font-mono font-semibold tabular-nums text-[#4d7c0f]">
                  ({derived.percent}%)
                </span>
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <ThresholdSlider
                id="slider-max-price"
                label="Max price"
                value={thresholds.maxPrice}
                min={THRESHOLD_LIMITS.maxPrice.min}
                max={THRESHOLD_LIMITS.maxPrice.max}
                step={THRESHOLD_LIMITS.maxPrice.step}
                valueLabel={`$${thresholds.maxPrice}`}
                onChange={(v) => onChange({ maxPrice: v })}
              />
              <ThresholdSlider
                id="slider-min-grade"
                label="Min condition grade"
                value={thresholds.minGrade}
                min={THRESHOLD_LIMITS.minGrade.min}
                max={THRESHOLD_LIMITS.minGrade.max}
                step={THRESHOLD_LIMITS.minGrade.step}
                valueLabel={`${GRADE_LABELS[thresholds.minGrade]} or better`}
                onChange={(v) => onChange({ minGrade: v })}
              />
              <ThresholdSlider
                id="slider-min-trust"
                label="Min seller trust score"
                value={thresholds.minTrust}
                min={THRESHOLD_LIMITS.minTrust.min}
                max={THRESHOLD_LIMITS.minTrust.max}
                step={THRESHOLD_LIMITS.minTrust.step}
                valueLabel={`${thresholds.minTrust}+`}
                onChange={(v) => onChange({ minTrust: v })}
              />
            </div>

            <div className="mt-8 rounded-xl bg-white p-4">
              <IconArray thresholds={thresholds} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
