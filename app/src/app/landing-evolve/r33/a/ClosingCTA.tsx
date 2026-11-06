'use client';

import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { COLORS } from './data';
import { CRITERIA, scoreTier } from './orbit-math';

interface ClosingCTAProps {
  weights: number[];
  score: number;
  leading: number;
}

/**
 * The orbit's live state survives all the way here: the sentence and the
 * button label both read the current score and leading criterion, not a
 * fixed example.
 */
export default function ClosingCTA({ weights, score, leading }: ClosingCTAProps) {
  const leadingCriterion = CRITERIA[leading];

  return (
    <section id="get-started" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div
          className="flex flex-col items-start gap-6 rounded-3xl p-8 sm:p-12"
          style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: COLORS.accentTint }}>
            Your orbit, right now
          </p>
          <h2
            className="max-w-[640px] text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[38px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            {leadingCriterion.label} is carrying {weights[leading]}% of your weight — a{' '}
            <span className="tabular-nums">{score}</span>, {scoreTier(score).toLowerCase()}.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            That is the weighting you chose, not a default. The catalog is scored against it
            the same way the hero listing was — open it and the same math is already running.
          </p>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
          >
            <span className="tabular-nums">
              See your {score}% {leadingCriterion.short}-led matches
            </span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
