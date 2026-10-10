'use client';

import { TrendingDown, ShieldCheck, Layers } from 'lucide-react';
import Reveal from './Reveal';
import { SAMPLE_TOTAL, type DerivedStats } from './data';

type ValueSectionProps = {
  derived: DerivedStats;
};

/**
 * "Value, in 3 parts" — all three numbers come straight from the same
 * `derived` object the Hero's sliders produce (lifted in LandingPage), so
 * moving a slider recomputes real data here too, not just reveals
 * pre-written copy. These numbers also feed the closing CTA, unchanged.
 */
export default function ValueSection({ derived }: ValueSectionProps) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-[500px]">
        <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-4xl">
          What your bar is worth
        </h2>
        <p className="mt-3 text-base leading-[1.6] text-zinc-600">
          These three numbers recalculate instantly in your browser from the
          same sample pool as the array above — move a slider, and all three
          move with it.
        </p>
      </div>

      <Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
          <div className="flex flex-col gap-3 bg-white p-6">
            <Layers size={20} strokeWidth={2} className="text-[#4d7c0f]" />
            <p className="font-mono text-4xl font-extrabold tabular-nums text-zinc-900">
              {derived.count}
              <span className="text-xl text-zinc-500">/{SAMPLE_TOTAL}</span>
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Listings that clear your bar
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-white p-6">
            <TrendingDown size={20} strokeWidth={2} className="text-[#4d7c0f]" />
            <p className="font-mono text-4xl font-extrabold tabular-nums text-zinc-900">
              {derived.avgDiscount}%
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Average markdown among them
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-white p-6">
            <ShieldCheck size={20} strokeWidth={2} className="text-[#4d7c0f]" />
            <p className="font-mono text-4xl font-extrabold tabular-nums text-zinc-900">
              {derived.avgTrust}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Average seller trust score
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
