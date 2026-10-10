'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SAMPLE_TOTAL, type DerivedStats } from './data';

type ClosingCTAProps = {
  derived: DerivedStats;
};

type Intent = 'buying' | 'selling';

/**
 * Closing CTA. `derived.count` is the exact same number computed once in
 * LandingPage from the Hero's own slider state — never a separately
 * hardcoded figure — and it appears in both the summary sentence and the
 * CTA button's own label, so it can never drift from what the array above
 * actually shows. The Buying/Selling segmented control is the page's 4th
 * distinct interaction: a lightweight, quiz-like branch that swaps copy
 * without inventing a second data source.
 */
export default function ClosingCTA({ derived }: ClosingCTAProps) {
  const [intent, setIntent] = useState<Intent>('buying');

  const copy =
    intent === 'buying'
      ? {
          heading: `${derived.count} listings are ready when you are.`,
          sub: `That's how many of our ${SAMPLE_TOTAL} sample listings clear every threshold you set above — price, condition, and seller trust, together. Adjust the sliders any time; the count follows.`,
          button: `Browse the ${derived.count} that qualify`,
        }
      : {
          heading: `Your bar just became the market's bar.`,
          sub: `${derived.count} of our ${SAMPLE_TOTAL} sample listings clear the same thresholds a buyer would be comparing you against — see what a listing needs before it's shown.`,
          button: `See what beats ${derived.count} listings`,
        };

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-14 sm:px-12">
        <div
          role="group"
          aria-label="Choose your intent"
          className="mb-8 inline-flex rounded-full bg-zinc-100 p-1"
        >
          <button
            type="button"
            aria-pressed={intent === 'buying'}
            onClick={() => setIntent('buying')}
            className={
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c0f] ' +
              (intent === 'buying' ? 'bg-[#84cc16] text-zinc-900' : 'text-zinc-600 hover:text-zinc-900')
            }
          >
            Buying
          </button>
          <button
            type="button"
            aria-pressed={intent === 'selling'}
            onClick={() => setIntent('selling')}
            className={
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c0f] ' +
              (intent === 'selling' ? 'bg-[#84cc16] text-zinc-900' : 'text-zinc-600 hover:text-zinc-900')
            }
          >
            Selling
          </button>
        </div>

        <h2 className="max-w-[640px] text-3xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-4xl">
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-[500px] text-base leading-[1.6] text-zinc-600">{copy.sub}</p>

        <a
          href="#preview"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#84cc16] px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#76b513] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c0f]"
        >
          {copy.button}
          <ArrowRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </section>
  );
}
