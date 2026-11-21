'use client';

import Image from 'next/image';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import OrbitDevice from './OrbitDevice';
import { COLORS, FEATURED_LISTING } from './data';
import { CRITERIA } from './orbit-math';

interface HeroProps {
  weights: number[];
  score: number;
  leading: number;
  onAdjust: (index: number, value: number) => void;
}

/**
 * Hero carries the headline, the single CTA, the Priority Orbit device,
 * AND the featured listing's full proof row (match, grade, verified,
 * before/after) — all inside this one component's grid, so the proof is
 * on screen with zero scroll. The listing's match percent is not a fixed
 * number: it IS the live composite score from the orbit below it.
 */
export default function Hero({ weights, score, leading, onAdjust }: HeroProps) {
  const leadingCriterion = CRITERIA[leading];

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-10">
        {/* Left: headline, subhead, CTA, featured-listing proof */}
        <div className="flex flex-col gap-7">
          <span
            className="text-[13px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: COLORS.accentTint }}
          >
            AI secondhand matching
          </span>

          <h1
            className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[52px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            Five criteria.
            <br />
            One score.
            <br />
            Your priorities move it.
          </h1>

          <p className="max-w-[480px] text-[17px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            Drag any priority in the orbit below and the other four give way. The composite
            score, and the real listing it is scored against, recompute in front of you —
            right now it is {score}, led by {leadingCriterion.short.toLowerCase()}.
          </p>

          <div>
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
            >
              Browse the live catalog
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* Featured listing — the proof, visible with zero scroll */}
          <div
            className="flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            <div
              className="relative h-[108px] w-full shrink-0 overflow-hidden rounded-xl sm:w-[108px]"
              style={{ backgroundColor: COLORS.surfaceLine }}
            >
              <Image
                src={`https://images.unsplash.com/photo-${FEATURED_LISTING.photoId}?auto=format&fit=crop&w=320&q=80`}
                alt="Waxed field jacket, the listing currently scored by the orbit above"
                fill
                sizes="108px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div>
                <p className="text-[15px] font-semibold" style={{ color: COLORS.fg }}>
                  {FEATURED_LISTING.title}
                </p>
                <p className="text-[13px] font-normal" style={{ color: COLORS.muted }}>
                  {FEATURED_LISTING.category} · scored live by the orbit
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="tabular-nums rounded-full px-2.5 py-1 text-[12px] font-semibold text-white"
                  style={{ backgroundColor: COLORS.accentFill }}
                >
                  {score}% match
                </span>
                <span
                  className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
                  style={{ color: COLORS.fg, border: `1px solid ${COLORS.surfaceLine}` }}
                >
                  Grade {FEATURED_LISTING.conditionGrade}
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                  style={{ color: COLORS.accentTint, border: `1px solid ${COLORS.surfaceLine}` }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified seller
                </span>
                <span className="tabular-nums text-[12px] font-normal" style={{ color: COLORS.muted }}>
                  <span className="line-through">${FEATURED_LISTING.priceBefore}</span>{' '}
                  <span className="font-semibold" style={{ color: COLORS.fg }}>
                    ${FEATURED_LISTING.priceAfter}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: the Priority Orbit device itself */}
        <div
          className="rounded-3xl p-6 sm:p-7"
          style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          <OrbitDevice weights={weights} score={score} leading={leading} onAdjust={onAdjust} />
        </div>
      </div>
    </section>
  );
}
